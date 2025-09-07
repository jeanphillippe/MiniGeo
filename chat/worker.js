// ===== IMPROVED CLOUDFLARE WORKER - CHAT APPLICATION =====

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let response;
      
      // Rate limiting check
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateLimitKey = `rate_limit:${clientIP}`;
      const rateLimitData = await env.CHAT_KV.get(rateLimitKey);
      
      if (rateLimitData) {
        const { count, resetTime } = JSON.parse(rateLimitData);
        if (count > 100 && Date.now() < resetTime) { // 100 requests per minute
          return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Update rate limit counter
      await updateRateLimit(clientIP, env);
      
      // API Routes
      switch (url.pathname) {
        case '/api/rooms':
          response = await handleRooms(request, env);
          break;
        case '/api/messages':
          response = await handleMessages(request, env);
          break;
        case '/api/users':
          response = await handleUsers(request, env);
          break;
        case '/api/join-room':
          response = await handleJoinRoom(request, env);
          break;
        case '/api/leave-room':
          response = await handleLeaveRoom(request, env);
          break;
        case '/api/health':
          response = new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
            headers: { 'Content-Type': 'application/json' }
          });
          break;
        default:
          response = new Response('Not Found', { status: 404 });
      }

      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// ===== RATE LIMITING =====
async function updateRateLimit(clientIP, env) {
  const rateLimitKey = `rate_limit:${clientIP}`;
  const now = Date.now();
  const oneMinute = 60 * 1000;
  
  try {
    const existing = await env.CHAT_KV.get(rateLimitKey);
    let count = 1;
    let resetTime = now + oneMinute;
    
    if (existing) {
      const data = JSON.parse(existing);
      if (now < data.resetTime) {
        count = data.count + 1;
        resetTime = data.resetTime;
      }
    }
    
    await env.CHAT_KV.put(rateLimitKey, JSON.stringify({ count, resetTime }), {
      expirationTtl: 120 // 2 minutes TTL
    });
  } catch (error) {
    console.error('Rate limit update failed:', error);
  }
}

// ===== ROOM MANAGEMENT =====
async function handleRooms(request, env) {
  if (request.method === 'GET') {
    try {
      const roomsList = await env.CHAT_KV.get('system:rooms_list');
      const rooms = roomsList ? JSON.parse(roomsList) : [];
      
      // Update user counts for each room
      const roomsWithCounts = await Promise.all(
        rooms.map(async (room) => {
          const usersData = await env.CHAT_KV.get(`room:${room.name}:users`);
          const users = usersData ? JSON.parse(usersData) : [];
          const activeUsers = users.filter(user => {
            const lastSeen = new Date(user.lastSeen);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            return lastSeen > fiveMinutesAgo;
          });
          
          return {
            ...room,
            userCount: activeUsers.length
          };
        })
      );
      
      return new Response(JSON.stringify({ rooms: roomsWithCounts }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch rooms' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { roomName, createdBy } = body;
      
      if (!roomName || !createdBy) {
        return new Response(JSON.stringify({ error: 'Room name and creator required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Sanitize and validate room name
      const sanitizedName = sanitizeRoomName(roomName);
      if (!sanitizedName) {
        return new Response(JSON.stringify({ error: 'Invalid room name' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Check if room already exists
      const roomsList = await env.CHAT_KV.get('system:rooms_list');
      const rooms = roomsList ? JSON.parse(roomsList) : [];
      
      if (rooms.find(r => r.name === sanitizedName)) {
        return new Response(JSON.stringify({ error: 'Room already exists' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Add new room
      rooms.push({
        name: sanitizedName,
        displayName: roomName.trim(),
        createdBy: sanitizeInput(createdBy),
        createdAt: new Date().toISOString(),
        userCount: 0
      });
      
      // Save rooms list and initialize room data
      await Promise.all([
        env.CHAT_KV.put('system:rooms_list', JSON.stringify(rooms)),
        env.CHAT_KV.put(`room:${sanitizedName}:messages`, JSON.stringify([])),
        env.CHAT_KV.put(`room:${sanitizedName}:users`, JSON.stringify([])),
        env.CHAT_KV.put(`room:${sanitizedName}:metadata`, JSON.stringify({
          created: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          messageCount: 0
        }))
      ]);

      return new Response(JSON.stringify({ 
        success: true, 
        roomName: sanitizedName,
        displayName: roomName.trim()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to create room' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// ===== MESSAGE HANDLING =====
async function handleMessages(request, env) {
  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const roomName = url.searchParams.get('room');
      const since = url.searchParams.get('since');
      const limit = Math.min(parseInt(url.searchParams.get('limit')) || 50, 100);
      
      if (!roomName) {
        return new Response(JSON.stringify({ error: 'Room name required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const messagesData = await env.CHAT_KV.get(`room:${roomName}:messages`);
      let messages = messagesData ? JSON.parse(messagesData) : [];
      
      // Filter messages since timestamp if provided
      if (since) {
        const sinceTime = new Date(since);
        messages = messages.filter(msg => new Date(msg.timestamp) > sinceTime);
      }
      
      // Limit number of messages returned
      messages = messages.slice(-limit);

      return new Response(JSON.stringify({ 
        messages,
        hasMore: messages.length === limit
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { roomName, userId, message, userName } = body;
      
      // Validate required fields
      if (!roomName || !userId || !message || !userName) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Validate message content
      const sanitizedMessage = sanitizeMessage(message);
      if (!sanitizedMessage) {
        return new Response(JSON.stringify({ error: 'Invalid message content' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Check if user is muted
      const mutedUsersData = await env.CHAT_KV.get('muted_users');
      const mutedUsers = mutedUsersData ? JSON.parse(mutedUsersData) : {};
      const userMute = mutedUsers[userId];
      
      if (userMute && new Date(userMute.mutedUntil) > new Date()) {
        const remainingTime = Math.ceil((new Date(userMute.mutedUntil) - new Date()) / 1000);
        return new Response(JSON.stringify({ 
          error: 'You are muted',
          mutedUntil: userMute.mutedUntil,
          remainingSeconds: remainingTime,
          reason: userMute.reason
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get existing messages
      const messagesData = await env.CHAT_KV.get(`room:${roomName}:messages`);
      const messages = messagesData ? JSON.parse(messagesData) : [];
      
      // Create new message
      const newMessage = {
        id: generateId(),
        userId: sanitizeInput(userId),
        userName: sanitizeInput(userName),
        message: sanitizedMessage,
        timestamp: new Date().toISOString(),
        roomName
      };
      
      messages.push(newMessage);
      
      // Keep only last 200 messages per room for efficiency
      if (messages.length > 200) {
        messages.splice(0, messages.length - 200);
      }
      
      // Save messages and update room metadata
      await Promise.all([
        env.CHAT_KV.put(`room:${roomName}:messages`, JSON.stringify(messages)),
        updateRoomActivity(roomName, env),
        updateUserLastSeen(userId, env)
      ]);
      
      return new Response(JSON.stringify({ 
        success: true, 
        messageId: newMessage.id,
        timestamp: newMessage.timestamp
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// ===== USER MANAGEMENT =====
async function handleUsers(request, env) {
  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');
      
      if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const userData = await env.CHAT_KV.get(`user:${userId}:characteristics`);
      const user = userData ? JSON.parse(userData) : {
        id: userId,
        name: `User${userId.slice(-4)}`,
        label: 'New User',
        joinedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      };

      return new Response(JSON.stringify({ user }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  if (request.method === 'PUT') {
    try {
      const body = await request.json();
      const { userId, name, label } = body;
      
      if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Validate and sanitize inputs
      const sanitizedName = sanitizeInput(name);
      const sanitizedLabel = sanitizeInput(label);
      
      if (!sanitizedName) {
        return new Response(JSON.stringify({ error: 'Valid name required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get existing user data
      const userData = await env.CHAT_KV.get(`user:${userId}:characteristics`);
      const user = userData ? JSON.parse(userData) : { 
        id: userId,
        joinedAt: new Date().toISOString()
      };
      
      // Update fields
      user.name = sanitizedName;
      user.label = sanitizedLabel || 'User';
      user.lastUpdated = new Date().toISOString();
      user.lastSeen = new Date().toISOString();
      
      // Save updated user
      await env.CHAT_KV.put(`user:${userId}:characteristics`, JSON.stringify(user));

      return new Response(JSON.stringify({ success: true, user }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to update user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// ===== ROOM JOIN/LEAVE =====
async function handleJoinRoom(request, env) {
  try {
    const body = await request.json();
    const { userId, roomName, userName } = body;
    
    if (!userId || !roomName || !userName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get room users
    const usersData = await env.CHAT_KV.get(`room:${roomName}:users`);
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Update or add user
    const existingUserIndex = users.findIndex(u => u.userId === userId);
    const userInfo = {
      userId: sanitizeInput(userId),
      userName: sanitizeInput(userName),
      joinedAt: existingUserIndex === -1 ? new Date().toISOString() : users[existingUserIndex].joinedAt,
      lastSeen: new Date().toISOString()
    };
    
    if (existingUserIndex !== -1) {
      users[existingUserIndex] = userInfo;
    } else {
      users.push(userInfo);
    }
    
    // Clean up users not seen in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const activeUsers = users.filter(user => new Date(user.lastSeen) > tenMinutesAgo);
    
    await Promise.all([
      env.CHAT_KV.put(`room:${roomName}:users`, JSON.stringify(activeUsers)),
      updateUserActiveRooms(userId, roomName, 'join', env)
    ]);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to join room' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleLeaveRoom(request, env) {
  try {
    const body = await request.json();
    const { userId, roomName } = body;
    
    if (!userId || !roomName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Remove user from room
    const usersData = await env.CHAT_KV.get(`room:${roomName}:users`);
    const users = usersData ? JSON.parse(usersData) : [];
    
    const filteredUsers = users.filter(u => u.userId !== userId);
    
    await Promise.all([
      env.CHAT_KV.put(`room:${roomName}:users`, JSON.stringify(filteredUsers)),
      updateUserActiveRooms(userId, roomName, 'leave', env)
    ]);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to leave room' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ===== HELPER FUNCTIONS =====

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().substring(0, 50).replace(/[<>&"']/g, '');
}

function sanitizeMessage(message) {
  if (typeof message !== 'string') return '';
  const cleaned = message.trim().substring(0, 1000);
  if (cleaned.length === 0) return '';
  return cleaned.replace(/[<>&"']/g, '');
}

function sanitizeRoomName(roomName) {
  if (typeof roomName !== 'string') return '';
  const cleaned = roomName.trim().toLowerCase().replace(/[^a-z0-9-_\s]/g, '').substring(0, 30);
  return cleaned.replace(/\s+/g, '-');
}

async function updateRoomActivity(roomName, env) {
  try {
    const metadataData = await env.CHAT_KV.get(`room:${roomName}:metadata`);
    const metadata = metadataData ? JSON.parse(metadataData) : {};
    
    metadata.lastActivity = new Date().toISOString();
    metadata.messageCount = (metadata.messageCount || 0) + 1;
    
    await env.CHAT_KV.put(`room:${roomName}:metadata`, JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to update room activity:', error);
  }
}

async function updateUserLastSeen(userId, env) {
  try {
    const userData = await env.CHAT_KV.get(`user:${userId}:characteristics`);
    const user = userData ? JSON.parse(userData) : { id: userId };
    
    user.lastSeen = new Date().toISOString();
    
    await env.CHAT_KV.put(`user:${userId}:characteristics`, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to update user last seen:', error);
  }
}

async function updateUserActiveRooms(userId, roomName, action, env) {
  try {
    const roomsData = await env.CHAT_KV.get(`user:${userId}:active_rooms`);
    const rooms = roomsData ? JSON.parse(roomsData) : [];
    
    if (action === 'join' && !rooms.includes(roomName)) {
      rooms.push(roomName);
    } else if (action === 'leave') {
      const index = rooms.indexOf(roomName);
      if (index > -1) rooms.splice(index, 1);
    }
    
    await env.CHAT_KV.put(`user:${userId}:active_rooms`, JSON.stringify(rooms), {
      expirationTtl: 24 * 60 * 60 // 24 hours TTL
    });
  } catch (error) {
    console.error('Failed to update user active rooms:', error);
  }
}
