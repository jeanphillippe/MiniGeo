export default{async fetch(r,env,ctx){const allowedCountries=['US','AR'];const country=r.cf.country;const u=new URL(r.url);const origin=r.headers.get('Origin');const isAllowedOrigin=origin&&(origin==='https://minigeo.org'||origin==='http://minigeo.org'||origin.endsWith('.minigeo.org'));const cors={'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization'};if(isAllowedOrigin){cors['Access-Control-Allow-Origin']=origin}
if(r.method==='OPTIONS')return new Response(null,{headers:cors});if(!allowedCountries.includes(country)){return new Response('Access denied from your location',{status:403,headers:{'Content-Type':'text/plain'}})}
try{const ip=r.headers.get('CF-Connecting-IP')||'unknown';const rateLimited=await checkRateLimit(ip,env);if(rateLimited){return res({error:'Rate limit'},429,cors)}
await updateRateLimit(ip,env);let response;const p=u.pathname;if(p==='/api/rooms')response=await handleRooms(r,env);else if(p==='/api/messages')response=await handleMsgs(r,env);else if(p==='/api/initialize-default-rooms')response=await initRooms(r,env);else if(p==='/api/users')response=await handleUsers(r,env);else if(p==='/api/join-room')response=await joinRoom(r,env);else if(p==='/api/leave-room')response=await leaveRoom(r,env);else if(p==='/api/moderate')response=await moderate(r,env);else if(p==='/api/admin-login')response=await adminLogin(r,env);else if(p==='/api/promote-user')response=await promoteUser(r,env);else if(p==='/api/demote-user')response=await demoteUser(r,env);else if(p==='/api/moderators')response=await getModerators(r,env);else if(p==='/api/check-orphans')response=await checkOrphans(r,env);else if(p==='/api/recover-rooms')response=await recoverRooms(r,env);else if(p.startsWith('/api/rooms/')&&r.method==='DELETE'){response=await delRoom(r,env,p.split('/')[3])}else if(p==='/api/vote')response=await handleVote(r,env);else if(p==='/api/cleanup')response=await handleCleanup(r,env);else if(p==='/api/archive')response=await handleArchive(r,env);else if(p==='/api/health'){response=res({status:'ok',ts:new Date().toISOString()})}else response=new Response('Not Found',{status:404});Object.entries(cors).forEach(([k,v])=>response.headers.set(k,v));return response}catch(e){console.error(e);return res({error:'Internal error'},500,cors)}}};function res(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{...headers,'Content-Type':'application/json'}})}
async function checkRateLimit(ip,env){const now=Date.now();const result=await env.DB.prepare('SELECT count, reset_time FROM rate_limits WHERE ip = ?').bind(ip).first();if(result&&result.count>100&&now<result.reset_time){return!0}
return!1}
async function updateRateLimit(ip,env){const now=Date.now();const resetTime=now+(60*1000);try{const result=await env.DB.prepare('SELECT count, reset_time FROM rate_limits WHERE ip = ?').bind(ip).first();if(result){if(now<result.reset_time){await env.DB.prepare('UPDATE rate_limits SET count = count + 1 WHERE ip = ?').bind(ip).run()}else{await env.DB.prepare('UPDATE rate_limits SET count = 1, reset_time = ? WHERE ip = ?').bind(resetTime,ip).run()}}else{await env.DB.prepare('INSERT INTO rate_limits (ip, count, reset_time) VALUES (?, 1, ?)').bind(ip,resetTime).run()}}catch(e){console.error('Rate limit update error:',e)}}
async function hashPass(pass){const enc=new TextEncoder();const data=enc.encode(pass+'minigeo_salt_2024');const hash=await crypto.subtle.digest('SHA-256',data);return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('')}
async function genToken(userId){const data=`${userId}:${Date.now()}:minigeo`;const enc=new TextEncoder();const key=await crypto.subtle.importKey('raw',enc.encode('minigeo_secret_2024'),{name:'HMAC',hash:'SHA-256'},!1,['sign']);const sig=await crypto.subtle.sign('HMAC',key,enc.encode(data));const token=btoa(String.fromCharCode(...new Uint8Array(sig)));return `${btoa(data)}.${token}`}
async function verifyToken(token,env){try{if(!token)return null;const[data,sig]=token.split('.');const userData=atob(data);const[userId,timestamp]=userData.split(':');if(Date.now()-parseInt(timestamp)>24*60*60*1000)return null;const enc=new TextEncoder();const key=await crypto.subtle.importKey('raw',enc.encode('minigeo_secret_2024'),{name:'HMAC',hash:'SHA-256'},!1,['verify']);const sigBytes=Uint8Array.from(atob(sig),c=>c.charCodeAt(0));const valid=await crypto.subtle.verify('HMAC',key,sigBytes,enc.encode(userData));return valid?userId:null}catch(e){return null}}
async function getAuth(r,env){const auth=r.headers.get('Authorization');if(!auth||!auth.startsWith('Bearer '))return null;const token=auth.substring(7);return await verifyToken(token,env)}
async function adminLogin(r,env){if(r.method!=='POST')return res({error:'Method not allowed'},405);try{const{password}=await r.json();if(!password)return res({error:'Password required'},400);const hashedInput=await hashPass(password);const correctHash=await hashPass('minigeo-setup-2024');if(hashedInput!==correctHash){return res({error:'Invalid password'},403)}
const adminId='admin';const token=await genToken(adminId);await ensureAdminInMods(env);return res({success:!0,token,message:'Admin authenticated'})}catch(e){return res({error:'Auth failed'},500)}}
async function ensureAdminInMods(env){try{const existing=await env.DB.prepare('SELECT user_id FROM moderators WHERE user_id = ?').bind('admin').first();if(!existing){await env.DB.prepare('INSERT OR IGNORE INTO moderators (user_id) VALUES (?)').bind('admin').run()}}catch(e){console.error('Failed to ensure admin in mods:',e)}}
async function initRooms(r,env){if(r.method!=='POST')return res({error:'Method not allowed'},405);try{const{adminKey}=await r.json();if(adminKey!=='minigeo-setup-2024'){return res({error:'Invalid key'},403)}
const rooms=[{name:'global',displayName:'🌍 Global',createdBy:'System',createdAt:new Date().toISOString(),isPerm:!0},{name:'tech',displayName:'🗺️ Tech',createdBy:'System',createdAt:new Date().toISOString(),isPerm:!0},{name:'explore',displayName:'🧭 Explore',createdBy:'System',createdAt:new Date().toISOString(),isPerm:!0}];const statements=[];for(const room of rooms){statements.push(env.DB.prepare('INSERT OR REPLACE INTO rooms (name, display_name, created_by, created_at, is_permanent) VALUES (?, ?, ?, ?, ?)').bind(room.name,room.displayName,room.createdBy,room.createdAt,room.isPerm));statements.push(env.DB.prepare('INSERT OR REPLACE INTO room_meta (room_name, created, last_activity, message_count, is_permanent) VALUES (?, ?, ?, 0, ?)').bind(room.name,room.createdAt,room.createdAt,room.isPerm))}
await env.DB.batch(statements);await ensureAdminInMods(env);return res({success:!0,rooms})}catch(e){console.error('Init error:',e);return res({error:'Init failed'},500)}}
async function checkOrphans(r,env){try{const orphanRooms=await env.DB.prepare(`
      SELECT rm.room_name, rm.last_activity, rm.message_count, rm.created
      FROM room_meta rm
      LEFT JOIN rooms r ON rm.room_name = r.name
      WHERE r.name IS NULL
    `).all();const orphans=orphanRooms.results.map(row=>({name:row.room_name,lastActivity:row.last_activity,messageCount:row.message_count,created:row.created}));return res({orphans})}catch(e){console.error('Check orphans error:',e);return res({error:'Check failed'},500)}}
async function recoverRooms(r,env){if(r.method!=='POST')return res({error:'Method not allowed'},405);try{const{orphans}=await r.json();if(!orphans||!Array.isArray(orphans)){return res({error:'Invalid orphans data'},400)}
const statements=[];for(const orphan of orphans){statements.push(env.DB.prepare('INSERT OR IGNORE INTO rooms (name, display_name, created_by, created_at, is_orphan) VALUES (?, ?, ?, ?, ?)').bind(orphan.name,orphan.name.charAt(0).toUpperCase()+orphan.name.slice(1),'Recovered',orphan.created||new Date().toISOString(),!0))}
await env.DB.batch(statements);return res({success:!0,recovered:orphans.length})}catch(e){console.error('Recovery error:',e);return res({error:'Recovery failed'},500)}}
async function handleRooms(r,env){if(r.method==='GET'){try{const roomsResult=await env.DB.prepare(`
        SELECT r.*, 
               COUNT(CASE WHEN ru.last_seen > datetime('now', '-5 minutes') THEN 1 END) as user_count
        FROM rooms r
        LEFT JOIN room_users ru ON r.name = ru.room_name
        GROUP BY r.name
        ORDER BY r.created_at
      `).all();const rooms=roomsResult.results.map(row=>({name:row.name,displayName:row.display_name,createdBy:row.created_by,createdAt:row.created_at,userCount:row.user_count,isPerm:Boolean(row.is_permanent),isOrphan:Boolean(row.is_orphan)}));return res({rooms})}catch(e){console.error('Get rooms error:',e);return res({error:'Fetch failed'},500)}}
if(r.method==='POST'){try{const{roomName,createdBy}=await r.json();if(!roomName||!createdBy){return res({error:'Missing fields'},400)}
const clean=cleanRoom(roomName);if(!clean)return res({error:'Invalid name'},400);const existing=await env.DB.prepare('SELECT name FROM rooms WHERE name = ?').bind(clean).first();if(existing)return res({error:'Exists'},409);const now=new Date().toISOString();await env.DB.batch([env.DB.prepare('INSERT INTO rooms (name, display_name, created_by, created_at) VALUES (?, ?, ?, ?)').bind(clean,roomName.trim(),cleanTxt(createdBy),now),env.DB.prepare('INSERT INTO room_meta (room_name, created, last_activity, message_count) VALUES (?, ?, ?, 0)').bind(clean,now,now)]);return res({success:!0,roomName:clean,displayName:roomName.trim()})}catch(e){console.error('Create room error:',e);return res({error:'Create failed'},500)}}}
async function delRoom(r,env,roomName){try{const{moderatorId}=await r.json();const authUser=await getAuth(r,env);if(!await isMod(moderatorId,env)&&!await isMod(authUser,env)){return res({error:'Not authorized'},403)}
const room=await env.DB.prepare('SELECT name, is_permanent FROM rooms WHERE name = ?').bind(roomName).first();if(!room)return res({error:'Not found'},404);if(room.is_permanent&&!await isAdmin(authUser||moderatorId,env)){return res({error:'Cannot delete permanent room'},400)}
await env.DB.prepare('DELETE FROM rooms WHERE name = ?').bind(roomName).run();return res({success:!0})}catch(e){console.error('Delete room error:',e);return res({error:'Delete failed'},500)}}
async function handleMsgs(r,env){if(r.method==='GET'){try{const u=new URL(r.url);const room=u.searchParams.get('room');const since=u.searchParams.get('since');const limit=Math.min(parseInt(u.searchParams.get('limit'))||50,100);if(!room)return res({error:'Room required'},400);let query=`
  SELECT m.*, 
         CASE WHEN mod.user_id IS NOT NULL THEN 1 ELSE 0 END as is_mod,
         CASE WHEN m.user_id = 'admin' THEN 1 ELSE 0 END as is_admin,
         COALESCE(up_votes.vote_count, 0) as up_votes,
         COALESCE(down_votes.vote_count, 0) as down_votes,
         user_vote.vote_type as user_vote
  FROM messages m
  LEFT JOIN moderators mod ON m.user_id = mod.user_id
  LEFT JOIN (
    SELECT message_id, COUNT(*) as vote_count 
    FROM message_votes 
    WHERE vote_type = 'up' 
    GROUP BY message_id
  ) up_votes ON m.id = up_votes.message_id
  LEFT JOIN (
    SELECT message_id, COUNT(*) as vote_count 
    FROM message_votes 
    WHERE vote_type = 'down' 
    GROUP BY message_id
  ) down_votes ON m.id = down_votes.message_id
  LEFT JOIN message_votes user_vote ON m.id = user_vote.message_id AND user_vote.user_id = ?
  WHERE m.room_name = ?
`;const params=[u.searchParams.get('userId')||'',room];if(since){query+=' AND m.timestamp > ?';params.push(since)}
query+=' ORDER BY m.timestamp DESC LIMIT ?';params.push(limit);const result=await env.DB.prepare(query).bind(...params).all();const messages=result.results.reverse().map(row=>({id:row.id,userId:row.user_id,userName:row.user_name,message:row.message,timestamp:row.timestamp,roomName:row.room_name,isMod:Boolean(row.is_mod),isAdmin:Boolean(row.is_admin),karma:{up:parseInt(row.up_votes)||0,down:parseInt(row.down_votes)||0},userVote:row.user_vote||null}));return res({messages,hasMore:messages.length===limit})}catch(e){console.error('Get messages error:',e);return res({error:'Fetch failed'},500)}}
if(r.method==='POST'){try{const{roomName,userId,message,userName}=await r.json();if(!roomName||!userId||!message||!userName){return res({error:'Missing fields'},400)}
const cleanMsg=cleanMessage(message);if(!cleanMsg)return res({error:'Invalid message'},400);const mutedUser=await env.DB.prepare('SELECT until_time, reason FROM muted_users WHERE user_id = ? AND until_time > datetime("now")').bind(userId).first();if(mutedUser){const remaining=Math.ceil((new Date(mutedUser.until_time)-new Date())/1000);return res({error:'Muted',until:mutedUser.until_time,remaining,reason:mutedUser.reason},403)}
const isMod=await checkUserMod(userId,env);const isAdm=await isAdmin(userId,env);const msgId=genId();const timestamp=new Date().toISOString();await env.DB.batch([env.DB.prepare('INSERT INTO messages (id, room_name, user_id, user_name, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)').bind(msgId,roomName,cleanTxt(userId),cleanTxt(userName),cleanMsg,timestamp),env.DB.prepare('UPDATE room_meta SET last_activity = ?, message_count = message_count + 1 WHERE room_name = ?').bind(timestamp,roomName),env.DB.prepare('INSERT OR REPLACE INTO users (user_id, last_seen) VALUES (?, ?)').bind(userId,timestamp)]);await env.DB.prepare(`
        DELETE FROM messages 
        WHERE room_name = ? 
        AND id NOT IN (
          SELECT id FROM messages 
          WHERE room_name = ? 
          ORDER BY timestamp DESC 
          LIMIT 200
        )
      `).bind(roomName,roomName).run();return res({success:!0,messageId:msgId,timestamp})}catch(e){console.error('Send message error:',e);return res({error:'Send failed'},500)}}}
async function handleUsers(r,env){if(r.method==='GET'){try{const u=new URL(r.url);const userId=u.searchParams.get('userId');if(!userId)return res({error:'User ID required'},400);let user=await env.DB.prepare('SELECT * FROM users WHERE user_id = ?').bind(userId).first();if(!user){user={user_id:userId,name:`User${userId.slice(-4)}`,label:'New',joined_at:new Date().toISOString(),last_seen:new Date().toISOString()}}
const userResponse={id:user.user_id,name:user.name,label:user.label,joinedAt:user.joined_at,lastSeen:user.last_seen,isMod:await checkUserMod(userId,env),isAdmin:await isAdmin(userId,env)};return res({user:userResponse})}catch(e){console.error('Get user error:',e);return res({error:'Fetch failed'},500)}}
if(r.method==='PUT'){try{const{userId,name,label}=await r.json();if(!userId)return res({error:'User ID required'},400);const cleanName=cleanTxt(name);const cleanLabel=cleanTxt(label);if(!cleanName)return res({error:'Valid name required'},400);const now=new Date().toISOString();await env.DB.prepare(`
        INSERT OR REPLACE INTO users 
        (user_id, name, label, joined_at, last_updated, last_seen) 
        VALUES (?, ?, ?, COALESCE((SELECT joined_at FROM users WHERE user_id = ?), ?), ?, ?)
      `).bind(userId,cleanName,cleanLabel||'User',userId,now,now,now).run();const user={id:userId,name:cleanName,label:cleanLabel||'User',lastUpdated:now,lastSeen:now,isMod:await checkUserMod(userId,env),isAdmin:await isAdmin(userId,env)};return res({success:!0,user})}catch(e){console.error('Update user error:',e);return res({error:'Update failed'},500)}}}
async function joinRoom(r,env){try{const{userId,roomName,userName}=await r.json();if(!userId||!roomName||!userName){return res({error:'Missing fields'},400)}
const now=new Date().toISOString();await env.DB.batch([env.DB.prepare(`
        INSERT OR REPLACE INTO room_users 
        (room_name, user_id, user_name, joined_at, last_seen) 
        VALUES (?, ?, ?, COALESCE((SELECT joined_at FROM room_users WHERE room_name = ? AND user_id = ?), ?), ?)
      `).bind(roomName,cleanTxt(userId),cleanTxt(userName),roomName,userId,now,now),env.DB.prepare('INSERT OR REPLACE INTO user_active_rooms (user_id, room_name) VALUES (?, ?)').bind(userId,roomName)]);await env.DB.prepare(`
      DELETE FROM room_users 
      WHERE last_seen < datetime('now', '-10 minutes')
    `).run();return res({success:!0})}catch(e){console.error('Join room error:',e);return res({error:'Join failed'},500)}}
async function leaveRoom(r,env){try{const{userId,roomName}=await r.json();if(!userId||!roomName){return res({error:'Missing fields'},400)}
await env.DB.batch([env.DB.prepare('DELETE FROM room_users WHERE room_name = ? AND user_id = ?').bind(roomName,userId),env.DB.prepare('DELETE FROM user_active_rooms WHERE user_id = ? AND room_name = ?').bind(userId,roomName)]);return res({success:!0})}catch(e){console.error('Leave room error:',e);return res({error:'Leave failed'},500)}}
async function moderate(r,env){try{const{action,userId,duration,roomName,moderatorId}=await r.json();const authUser=await getAuth(r,env);if(!await isMod(moderatorId,env)&&!await isMod(authUser,env)){return res({error:'Not authorized'},403)}
if(action==='mute'){if(!userId||!duration)return res({error:'Missing fields'},400);const until=new Date(Date.now()+duration*60*1000);await env.DB.prepare('INSERT OR REPLACE INTO muted_users (user_id, until_time, reason, muted_by) VALUES (?, ?, ?, ?)').bind(userId,until.toISOString(),'Muted by moderator',moderatorId||authUser).run();return res({success:!0,until:until.toISOString()})}
if(action==='kick'){if(!userId||!roomName)return res({error:'Missing fields'},400);await env.DB.prepare('DELETE FROM room_users WHERE room_name = ? AND user_id = ?').bind(roomName,userId).run();return res({success:!0})}
return res({error:'Invalid action'},400)}catch(e){console.error('Moderate error:',e);return res({error:'Moderate failed'},500)}}
async function promoteUser(r,env){if(r.method!=='POST')return res({error:'Method not allowed'},405);try{const{userId,adminId}=await r.json();const authUser=await getAuth(r,env);if(!await isAdmin(adminId,env)&&!await isAdmin(authUser,env)){return res({error:'Admin required'},403)}
if(!userId)return res({error:'User ID required'},400);await env.DB.prepare('INSERT OR IGNORE INTO moderators (user_id) VALUES (?)').bind(userId).run();return res({success:!0,message:'User promoted to moderator'})}catch(e){console.error('Promote error:',e);return res({error:'Promotion failed'},500)}}
async function demoteUser(r,env){if(r.method!=='POST')return res({error:'Method not allowed'},405);try{const{userId,adminId}=await r.json();const authUser=await getAuth(r,env);if(!await isAdmin(adminId,env)&&!await isAdmin(authUser,env)){return res({error:'Admin required'},403)}
if(!userId)return res({error:'User ID required'},400);if(userId==='admin')return res({error:'Cannot demote admin'},400);await env.DB.prepare('DELETE FROM moderators WHERE user_id = ?').bind(userId).run();return res({success:!0,message:'User demoted'})}catch(e){console.error('Demote error:',e);return res({error:'Demotion failed'},500)}}
async function getModerators(r,env){try{const result=await env.DB.prepare('SELECT user_id FROM moderators').all();const moderators=result.results.map(row=>row.user_id);return res({moderators})}catch(e){console.error('Get moderators error:',e);return res({error:'Failed to get moderators'},500)}}
async function isMod(userId,env){if(!userId)return!1;try{const result=await env.DB.prepare('SELECT user_id FROM moderators WHERE user_id = ?').bind(userId).first();return!!result}catch(e){return!1}}
async function isAdmin(userId,env){return userId==='admin'}
async function checkUserMod(userId,env){return await isMod(userId,env)}
function genId(){return Date.now().toString(36)+Math.random().toString(36).substr(2,9)}
function cleanTxt(txt){if(typeof txt!=='string')return'';return txt.trim().substring(0,50).replace(/[<>&"']/g,'')}
function cleanMessage(msg){if(typeof msg!=='string')return'';const cleaned=msg.trim().substring(0,1000);return cleaned.length===0?'':cleaned.replace(/[<>&"']/g,'')}
function cleanRoom(name){if(typeof name!=='string')return'';return name.trim().toLowerCase().replace(/[^a-z0-9-_\s]/g,'').substring(0,30).replace(/\s+/g,'-')}
async function handleVote(r,env){if(r.method!=='POST')return res({error:'Method not allowed'},405);try{const{messageId,roomName,vote,userId}=await r.json();if(!messageId||!roomName||!vote||!userId){return res({error:'Missing fields'},400)}
if(!['up','down'].includes(vote)){return res({error:'Invalid vote type'},400)}
const message=await env.DB.prepare('SELECT id FROM messages WHERE id = ? AND room_name = ?').bind(messageId,roomName).first();if(!message)return res({error:'Message not found'},404);const existingVote=await env.DB.prepare('SELECT vote_type FROM message_votes WHERE message_id = ? AND user_id = ?').bind(messageId,userId).first();if(existingVote){if(existingVote.vote_type===vote){await env.DB.prepare('DELETE FROM message_votes WHERE message_id = ? AND user_id = ?').bind(messageId,userId).run()}else{await env.DB.prepare('UPDATE message_votes SET vote_type = ? WHERE message_id = ? AND user_id = ?').bind(vote,messageId,userId).run()}}else{await env.DB.prepare('INSERT INTO message_votes (message_id, user_id, vote_type) VALUES (?, ?, ?)').bind(messageId,userId,vote).run()}
const voteResults=await env.DB.prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN vote_type = 'up' THEN 1 ELSE 0 END), 0) as up_count,
        COALESCE(SUM(CASE WHEN vote_type = 'down' THEN 1 ELSE 0 END), 0) as down_count
      FROM message_votes 
      WHERE message_id = ?
    `).bind(messageId).first();const userVote=await env.DB.prepare('SELECT vote_type FROM message_votes WHERE message_id = ? AND user_id = ?').bind(messageId,userId).first();return res({success:!0,karma:{up:voteResults.up_count,down:voteResults.down_count},userVote:userVote?userVote.vote_type:null})}catch(e){console.error('Vote error:',e);return res({error:'Vote failed'},500)}}
async function handleCleanup(r,env){if(r.method!=='POST')return res({error:'Method not allowed'},405);try{const{adminKey}=await r.json();if(adminKey!=='minigeo-setup-2024'){return res({error:'Invalid admin key'},403)}
const rooms=await env.DB.prepare('SELECT name FROM rooms').all();let totalArchived=0;for(const room of rooms.results){const messages=await env.DB.prepare('SELECT * FROM messages WHERE room_name = ? ORDER BY timestamp').bind(room.name).all();if(messages.results.length>0){const archiveKey=`cleanup_${room.name}_${Date.now()}`;const startDate=messages.results[0].timestamp;const endDate=messages.results[messages.results.length-1].timestamp;await env.DB.prepare(`
          INSERT INTO message_archives 
          (archive_key, room_name, message_count, date_range_start, date_range_end, messages_json) 
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(archiveKey,room.name,messages.results.length,startDate,endDate,JSON.stringify(messages.results)).run();totalArchived+=messages.results.length}}
await env.DB.batch([env.DB.prepare('DELETE FROM message_votes'),env.DB.prepare('DELETE FROM messages'),env.DB.prepare('UPDATE room_meta SET message_count = 0, last_activity = datetime("now")')]);return res({success:!0,message:`Archived ${totalArchived} messages and cleaned all rooms`})}catch(e){console.error('Cleanup error:',e);return res({error:'Cleanup failed'},500)}}
async function handleArchive(r,env){if(r.method!=='GET')return res({error:'Method not allowed'},405);try{const u=new URL(r.url);const roomName=u.searchParams.get('room');const archiveId=u.searchParams.get('id');if(!roomName)return res({error:'Room parameter required'},400);if(archiveId){const archive=await env.DB.prepare('SELECT * FROM message_archives WHERE archive_key = ? AND room_name = ?').bind(archiveId,roomName).first();if(!archive)return res({error:'Archive not found'},404);return res({archive:{key:archive.archive_key,roomName:archive.room_name,archivedAt:archive.archived_at,messageCount:archive.message_count,dateRange:{start:archive.date_range_start,end:archive.date_range_end},messages:JSON.parse(archive.messages_json)}})}else{const archives=await env.DB.prepare('SELECT archive_key, archived_at, message_count, date_range_start, date_range_end FROM message_archives WHERE room_name = ? ORDER BY archived_at DESC').bind(roomName).all();const archiveList=archives.results.map(row=>({key:row.archive_key,archivedAt:row.archived_at,messageCount:row.message_count,dateRange:{start:row.date_range_start,end:row.date_range_end}}));return res({archives:archiveList})}}catch(e){console.error('Archive error:',e);return res({error:'Archive failed'},500)}}