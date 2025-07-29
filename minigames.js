class MinigameManager{constructor(game){this.game=game;this.currentMinigame=null;this.isActive=!1;this.minigameTypes={spiritChase:SpiritChaserGame,fruitRush:MagicalFruitCollectionGame,portalDash:SpiritPortalDashGame,tilePuzzle:ElementalTilePuzzleGame,}}
startMinigame(type,...args){if(this.currentMinigame){this.endCurrentMinigame()}
const MinigameClass=this.minigameTypes[type];if(!MinigameClass){console.error(`Minigame type '${type}' not found`);return}
this.currentMinigame=new MinigameClass(this.game,...args);this.isActive=!0;this.currentMinigame.start()}
endCurrentMinigame(){if(this.currentMinigame){this.currentMinigame.end();this.currentMinigame=null;this.isActive=!1}}
update(){if(this.currentMinigame&&this.isActive){this.currentMinigame.update()}}
startSpiritChaseTag(mode='chase'){this.startMinigame('spiritChase',mode)}
startFruitRush(difficulty='normal'){this.startMinigame('fruitRush',difficulty)}
startPortalDash(difficulty='normal'){this.startMinigame('portalDash',difficulty)}
startTilePuzzle(difficulty='normal'){this.startMinigame('tilePuzzle',difficulty)}}
class BaseMinigame{constructor(game){this.game=game;this.isRunning=!1;this.uiContainer=null;this.cleanupItems=[]}
start(){console.log(`Starting ${this.constructor.name}`);this.game.cameraSystem.saveInitialCameraState();this.isRunning=!0}
update(){}
end(){console.log(`Ending ${this.constructor.name}`);this.cleanup();this.game.cameraSystem.restoreToInitialState(!0);this.isRunning=!1}
cleanup(){if(this.uiContainer){this.uiContainer.remove();this.uiContainer=null}
this.cleanupItems.forEach(item=>{if(item.destroy){item.destroy()}else if(item.geometry||item.material){this.game.scene.remove(item);item.geometry?.dispose();item.material?.dispose()}});this.cleanupItems=[]}
addCleanupItem(item){this.cleanupItems.push(item)}
createUI(content,position='top-left'){this.uiContainer=document.createElement('div');const positions={'top-left':'top: 20px; left: 20px;','top-right':'top: 20px; right: 20px;','center':'top: 50%; left: 50%; transform: translate(-50%, -50%);'};this.uiContainer.style.cssText=`
            position: fixed;
            ${positions[position]}
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 16px;
            z-index: 100;
            min-width: 200px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;this.uiContainer.innerHTML=content;document.body.appendChild(this.uiContainer);return this.uiContainer}}
class SpiritChaserGame extends BaseMinigame{constructor(game,mode='chase'){super(game);this.mode=mode;this.spirits=[];this.gameArea={minX:3,maxX:13,minZ:3,maxZ:13};this.gameTime=30000;this.remainingTime=this.gameTime;this.score=0;this.gameStartTime=0;this.spiritCount=this.mode==='chase'?4:3;this.tagDistance=1.3;this.uiElements={};this.lastSpiritUpdate=0;this.spiritUpdateInterval=150;this.lastUIUpdate=0;this.uiUpdateInterval=100}
start(){super.start();this.game.cameraSystem.setCameraPreset('overview',!0,()=>{this.setupGameArea();this.spawnSpirits();this.createGameUI();this.gameStartTime=Date.now();this.showGameInstructions()})}
setupGameArea(){const boundaryPositions=this.generateBoundaryPositions();boundaryPositions.forEach((pos,index)=>{const tile=this.game.terrain.getTile(Math.floor(pos.x),Math.floor(pos.z));if(tile){const marker=this.createBoundaryMarker(tile,index);this.game.scene.add(marker);this.addCleanupItem(marker)}})}
generateBoundaryPositions(){const positions=[];const{minX,maxX,minZ,maxZ}=this.gameArea;positions.push({x:minX,z:minZ},{x:maxX,z:minZ},{x:maxX,z:maxZ},{x:minX,z:maxZ});for(let x=minX+2;x<maxX;x+=2){positions.push({x,z:minZ},{x,z:maxZ})}
for(let z=minZ+2;z<maxZ;z+=2){positions.push({x:minX,z},{x:maxX,z})}
return positions}
createBoundaryMarker(tile,index){const geometry=new THREE.CylinderGeometry(0.08,0.12,1.5,6);const hue=(index*60)%360;const material=new THREE.MeshLambertMaterial({color:new THREE.Color().setHSL(hue/360,0.7,0.6),emissive:new THREE.Color().setHSL(hue/360,0.5,0.2),transparent:!0,opacity:0.8});const marker=new THREE.Mesh(geometry,material);marker.position.set(tile.mesh.position.x,this.game.terrain.heightScales[tile.height]+0.75,tile.mesh.position.z);const startTime=Date.now();const animate=()=>{if(!marker.parent)return;const elapsed=Date.now()-startTime;const pulse=Math.sin(elapsed*0.003)*0.1+0.9;marker.scale.setScalar(pulse);requestAnimationFrame(animate)};animate();return marker}
spawnSpirits(){const spiritConfigs=this.getSpiritConfigurations();spiritConfigs.forEach((config,index)=>{const spirit=new EnhancedSpiritNPC(this.game,this,index,config);this.spirits.push(spirit);this.addCleanupItem(spirit)})}
getSpiritConfigurations(){const baseConfigs=[{name:'Wisp',color:0x4fc3f7,emissive:0x002244,speed:0.04,behavior:'aggressive',spriteRow:5},{name:'Shade',color:0x9c27b0,emissive:0x220044,speed:0.035,behavior:'smart',spriteRow:6},{name:'Phantom',color:0xff5722,emissive:0x441100,speed:0.03,behavior:'patrol',spriteRow:7},{name:'Specter',color:0x4caf50,emissive:0x004411,speed:0.045,behavior:'random',spriteRow:4}];return baseConfigs.slice(0,this.spiritCount)}
createGameUI(){const modeText=this.mode==='chase'?'TAG THE SPIRITS!':'AVOID THE SPIRITS!';const modeColor=this.mode==='chase'?'#4fc3f7':'#f9844a';const content=`
            <div style="color: ${modeColor}; font-weight: bold; margin-bottom: 10px; text-align: center;">
                ${modeText}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Time:</span> <span id="minigame-time" style="color: #ffeb3b;">30</span>s
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Score:</span> <span id="minigame-score" style="color: #4caf50;">0</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Tagged:</span> <span id="spirits-tagged" style="color: #ff9800;">0/${this.spiritCount}</span>
            </div>
            <div style="font-size: 11px; opacity: 0.8; line-height: 1.3;">
                ${this.mode === 'chase' ? 
                    '🎯 Get close to spirits to tag them!<br>🚫 Stay within green boundary!' : 
                    '🏃 Avoid the hunting spirits!<br>🚫 Stay within green boundary!'}
            </div>
        `;this.createUI(content);this.uiElements.time=document.getElementById('minigame-time');this.uiElements.score=document.getElementById('minigame-score');this.uiElements.tagged=document.getElementById('spirits-tagged')}
showGameInstructions(){const instructions=this.mode==='chase'?'Tag all the different spirits! Each has unique behavior - Wisp is aggressive, Shade is smart, Phantom patrols, Specter is unpredictable!':'Survive the spirit hunt! Different spirits will use different tactics to catch you!';this.game.showInteractionMessage(`Spirit Chase Tag: ${instructions}`)}
update(){if(!this.isRunning)return;const currentTime=Date.now();this.remainingTime=Math.max(0,this.gameTime-(currentTime-this.gameStartTime));if(currentTime-this.lastUIUpdate>this.uiUpdateInterval){this.updateUI();this.lastUIUpdate=currentTime}
if(currentTime-this.lastSpiritUpdate>this.spiritUpdateInterval){this.updateSpirits();this.lastSpiritUpdate=currentTime}
this.checkPlayerBoundary();this.checkTags();this.checkGameEnd()}
updateUI(){this.uiElements.time.textContent=Math.ceil(this.remainingTime/1000);this.uiElements.score.textContent=this.score;if(this.mode==='chase'){const taggedCount=this.spirits.filter(s=>s.isTagged).length;this.uiElements.tagged.textContent=`${taggedCount}/${this.spiritCount}`}}
updateSpirits(){this.spirits.forEach(spirit=>{if(!spirit.isTagged){spirit.updateAI()}})}
checkPlayerBoundary(){const player=this.game.player;if(!player)return;const pos=player.pos;const{minX,maxX,minZ,maxZ}=this.gameArea;if(pos.x<minX||pos.x>maxX||pos.z<minZ||pos.z>maxZ){const newX=Math.max(minX,Math.min(maxX,pos.x));const newZ=Math.max(minZ,Math.min(maxZ,pos.z));if(this.game.terrain.isValidCoordinate(Math.floor(newX),Math.floor(newZ))){player.setPosition(Math.floor(newX),Math.floor(newZ));this.score=Math.max(0,this.score-5);this.game.showInteractionMessage('Stay within bounds!')}}}
checkTags(){const playerPos=this.game.player.pos;this.spirits.forEach((spirit,index)=>{if(spirit.isTagged)return;const distance=Math.sqrt(Math.pow(playerPos.x-spirit.pos.x,2)+Math.pow(playerPos.z-spirit.pos.z,2));if(distance<=this.tagDistance){if(this.mode==='chase'){this.tagSpirit(spirit,index)}else{this.playerCaught(spirit)}}})}
tagSpirit(spirit,index){spirit.isTagged=!0;spirit.onTagged();const baseScore=100;const speedBonus=Math.floor(spirit.baseSpeed*1000);this.score+=baseScore+speedBonus;this.game.showInteractionMessage(`Tagged ${spirit.config.name}! +${baseScore + speedBonus}`);console.log(`Spirit ${spirit.config.name} tagged! Score: ${this.score}`)}
playerCaught(spirit){this.score=Math.max(0,this.score-50);this.endGame('caught',spirit.config.name)}
checkGameEnd(){if(this.remainingTime<=0){this.endGame('timeout')}else if(this.mode==='chase'){const allTagged=this.spirits.every(spirit=>spirit.isTagged);if(allTagged){const timeBonus=Math.floor(this.remainingTime/100);this.score+=timeBonus;this.endGame('success')}}else{this.score+=2}}
endGame(reason,catcherName=''){this.isRunning=!1;let message='';switch(reason){case 'success':message=`🎉 Excellent! All spirits tagged! Time bonus: +${Math.floor(this.remainingTime / 100)} Final Score: ${this.score}`;break;case 'timeout':if(this.mode==='chase'){const tagged=this.spirits.filter(s=>s.isTagged).length;message=`⏰ Time's up! Tagged ${tagged}/${this.spiritCount} spirits. Score: ${this.score}`}else{message=`🛡️ Survived the spirit hunt! Final Score: ${this.score}`}
break;case 'caught':const survived=Math.floor((this.gameTime-this.remainingTime)/1000);message=`👻 Caught by ${catcherName}! Survived ${survived} seconds. Score: ${this.score}`;break}
setTimeout(()=>{this.game.showInteractionMessage(message);this.end()},500)}}
class MagicalFruitCollectionGame extends BaseMinigame{constructor(game,difficulty='normal'){super(game);this.difficulty=difficulty;this.fruits=[];this.gameArea={minX:2,maxX:14,minZ:2,maxZ:14};this.gameTime=45000;this.remainingTime=this.gameTime;this.score=0;this.fruitsCollected=0;this.gameStartTime=0;this.difficultySettings={easy:{fruitCount:8,teleportChance:0.1,spawnRate:3000,moveSpeed:0.02},normal:{fruitCount:12,teleportChance:0.25,spawnRate:2500,moveSpeed:0.035},hard:{fruitCount:16,teleportChance:0.4,spawnRate:2000,moveSpeed:0.05}};this.settings=this.difficultySettings[difficulty]||this.difficultySettings.normal;this.maxFruits=this.settings.fruitCount;this.collectDistance=1.2;this.lastFruitUpdate=0;this.fruitUpdateInterval=100;this.lastSpawnCheck=0;this.fruitSpawnInterval=this.settings.spawnRate;this.uiElements={}}
start(){super.start();this.game.cameraSystem.setCameraPreset('overview',!0,()=>{this.setupGameArea();this.spawnInitialFruits();this.createGameUI();this.gameStartTime=Date.now();this.showGameInstructions()})}
setupGameArea(){const boundaryPositions=this.generateBoundaryPositions();boundaryPositions.forEach((pos,index)=>{const tile=this.game.terrain.getTile(Math.floor(pos.x),Math.floor(pos.z));if(tile){const marker=this.createSparklyMarker(tile,index);this.game.scene.add(marker);this.addCleanupItem(marker)}})}
generateBoundaryPositions(){const positions=[];const{minX,maxX,minZ,maxZ}=this.gameArea;positions.push({x:minX,z:minZ},{x:maxX,z:minZ},{x:maxX,z:maxZ},{x:minX,z:maxZ},{x:(minX+maxX)/2,z:minZ},{x:(minX+maxX)/2,z:maxZ},{x:minX,z:(minZ+maxZ)/2},{x:maxX,z:(minZ+maxZ)/2});return positions}
createSparklyMarker(tile,index){const geometry=new THREE.ConeGeometry(0.15,1.2,6);const material=new THREE.MeshLambertMaterial({color:0xffd700,emissive:0x332200,transparent:!0,opacity:0.7});const marker=new THREE.Mesh(geometry,material);marker.position.set(tile.mesh.position.x,this.game.terrain.heightScales[tile.height]+0.6,tile.mesh.position.z);const startTime=Date.now();const sparkle=()=>{if(!marker.parent)return;const elapsed=Date.now()-startTime;const twinkle=Math.sin(elapsed*0.008)*0.3+0.7;marker.material.emissiveIntensity=twinkle;marker.rotation.y=elapsed*0.002;requestAnimationFrame(sparkle)};sparkle();return marker}
spawnInitialFruits(){for(let i=0;i<Math.min(4,this.maxFruits);i++){setTimeout(()=>{this.spawnFruit()},i*500)}}
spawnFruit(){if(this.fruits.length>=this.maxFruits)return;const position=this.getRandomValidPosition();if(!position)return;const fruitType=this.getRandomFruitType();const fruit=new MagicalFruit(this.game,this,fruitType,position);this.fruits.push(fruit);this.addCleanupItem(fruit);console.log(`Spawned ${fruitType.name} fruit at (${position.x}, ${position.z})`)}
getRandomValidPosition(){const{minX,maxX,minZ,maxZ}=this.gameArea;let attempts=0;while(attempts<20){const x=Math.floor(minX+Math.random()*(maxX-minX));const z=Math.floor(minZ+Math.random()*(maxZ-minZ));const tile=this.game.terrain.getTile(x,z);if(tile&&tile.height<=4){const playerDist=Math.sqrt(Math.pow(x-this.game.player.pos.x,2)+Math.pow(z-this.game.player.pos.z,2));if(playerDist>3){return{x,z}}}
attempts++}
return null}
getRandomFruitType(){const fruitTypes=[{name:'Magic Apple',color:0xff4444,emissive:0x441100,points:10,behavior:'static',size:0.4},{name:'Crystal Berry',color:0x4444ff,emissive:0x001144,points:20,behavior:'moving',size:0.3},{name:'Golden Pear',color:0xffdd44,emissive:0x443300,points:30,behavior:'teleporting',size:0.5},{name:'Mystic Orange',color:0xff8844,emissive:0x442200,points:15,behavior:'bouncing',size:0.35}];return fruitTypes[Math.floor(Math.random()*fruitTypes.length)]}
createGameUI(){const difficultyText=this.difficulty.toUpperCase();const difficultyColor={easy:'#4caf50',normal:'#ff9800',hard:'#f44336'}[this.difficulty]||'#ff9800';const content=`
            <div style="color: #ff6b6b; font-weight: bold; margin-bottom: 10px; text-align: center;">
                🍎 FRUIT COLLECTION RUSH! 🍊
            </div>
            <div style="color: ${difficultyColor}; font-size: 14px; text-align: center; margin-bottom: 8px;">
                ${difficultyText} MODE
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Time:</span> <span id="fruit-time" style="color: #ffeb3b;">45</span>s
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Score:</span> <span id="fruit-score" style="color: #4caf50;">0</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Collected:</span> <span id="fruits-collected" style="color: #ff9800;">0</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Active:</span> <span id="fruits-active" style="color: #9c27b0;">0</span>
            </div>
            <div style="font-size: 11px; opacity: 0.8; line-height: 1.3;">
                🍎 Red = 10pts (static)<br>
                🫐 Blue = 20pts (moves)<br>
                🍐 Gold = 30pts (teleports)<br>
                🍊 Orange = 15pts (bounces)
            </div>
        `;this.createUI(content);this.uiElements.time=document.getElementById('fruit-time');this.uiElements.score=document.getElementById('fruit-score');this.uiElements.collected=document.getElementById('fruits-collected');this.uiElements.active=document.getElementById('fruits-active')}
showGameInstructions(){const instructions=`Collect magical fruits before they disappear! Different fruits have different behaviors - some move, some teleport! ${this.difficulty.toUpperCase()} difficulty.`;this.game.showInteractionMessage(instructions)}
update(){if(!this.isRunning)return;const currentTime=Date.now();this.remainingTime=Math.max(0,this.gameTime-(currentTime-this.gameStartTime));this.updateUI();if(currentTime-this.lastFruitUpdate>this.fruitUpdateInterval){this.updateFruits();this.lastFruitUpdate=currentTime}
if(currentTime-this.lastSpawnCheck>this.fruitSpawnInterval){this.spawnFruit();this.lastSpawnCheck=currentTime}
this.checkCollections();this.checkGameEnd()}
updateUI(){this.uiElements.time.textContent=Math.ceil(this.remainingTime/1000);this.uiElements.score.textContent=this.score;this.uiElements.collected.textContent=this.fruitsCollected;this.uiElements.active.textContent=this.fruits.length}
updateFruits(){this.fruits.forEach(fruit=>{if(fruit.update){fruit.update()}});this.fruits=this.fruits.filter(fruit=>{if(fruit.isExpired&&fruit.isExpired()){fruit.destroy();return!1}
return!0})}
checkCollections(){const playerPos=this.game.player.pos;this.fruits=this.fruits.filter(fruit=>{const distance=Math.sqrt(Math.pow(playerPos.x-fruit.pos.x,2)+Math.pow(playerPos.z-fruit.pos.z,2));if(distance<=this.collectDistance){this.collectFruit(fruit);return!1}
return!0})}
collectFruit(fruit){this.score+=fruit.config.points;this.fruitsCollected++;const timeBonus=Math.floor(this.remainingTime/1000);if(timeBonus>30){this.score+=5}
this.game.showInteractionMessage(`+${fruit.config.points} ${fruit.config.name}!`);fruit.destroy();console.log(`Collected ${fruit.config.name}! Score: ${this.score}`)}
checkGameEnd(){if(this.remainingTime<=0){this.endGame('timeout')}
if(this.fruitsCollected>=this.maxFruits){this.endGame('perfect')}}
endGame(reason){this.isRunning=!1;let message='';let bonusScore=0;switch(reason){case 'perfect':bonusScore=Math.floor(this.remainingTime/100)+100;this.score+=bonusScore;message=`🎉 PERFECT! All fruits collected! Time bonus: +${bonusScore} Final Score: ${this.score}`;break;case 'timeout':bonusScore=this.fruitsCollected*5;this.score+=bonusScore;message=`⏰ Time's up! Collected ${this.fruitsCollected} fruits. Completion bonus: +${bonusScore} Final Score: ${this.score}`;break}
setTimeout(()=>{this.game.showInteractionMessage(message);this.end()},500)}}
class MagicalFruit{constructor(game,minigameRef,config,position){this.game=game;this.minigame=minigameRef;this.config=config;this.pos=position;this.isCollected=!1;this.creationTime=Date.now();this.lifespan=8000+Math.random()*4000;this.moveDirection={x:0,z:0};this.bounceDirection=1;this.lastTeleport=0;this.teleportCooldown=3000+Math.random()*2000;this.createVisual();this.initializeBehavior()}
createVisual(){const geometry=new THREE.SphereGeometry(this.config.size,8,6);const material=new THREE.MeshLambertMaterial({color:this.config.color,emissive:this.config.emissive,emissiveIntensity:0.5,transparent:!0,opacity:0.9});this.mesh=new THREE.Mesh(geometry,material);const tile=this.game.terrain.getTile(this.pos.x,this.pos.z);if(tile){this.mesh.position.set(tile.mesh.position.x,this.game.terrain.heightScales[tile.height]+0.8,tile.mesh.position.z)}
this.game.scene.add(this.mesh);this.mesh.scale.setScalar(0.1);const spawnAnimation=()=>{if(!this.mesh||!this.mesh.parent)return;this.mesh.scale.addScalar(0.05);if(this.mesh.scale.x<1.0){requestAnimationFrame(spawnAnimation)}};spawnAnimation();this.startFloatingAnimation()}
startFloatingAnimation(){const startY=this.mesh.position.y;const startTime=Date.now();const floatSpeed=0.003+Math.random()*0.002;const floatHeight=0.2+Math.random()*0.1;const animate=()=>{if(!this.mesh||!this.mesh.parent||this.isCollected)return;const elapsed=Date.now()-startTime;const offset=Math.sin(elapsed*floatSpeed)*floatHeight;this.mesh.position.y=startY+offset;this.mesh.rotation.y=elapsed*0.001;requestAnimationFrame(animate)};animate()}
initializeBehavior(){switch(this.config.behavior){case 'moving':this.initializeMoving();break;case 'bouncing':this.initializeBouncing();break;case 'teleporting':this.initializeTeleporting();break}}
initializeMoving(){const angle=Math.random()*Math.PI*2;this.moveDirection={x:Math.cos(angle)*this.minigame.settings.moveSpeed,z:Math.sin(angle)*this.minigame.settings.moveSpeed}}
initializeBouncing(){this.bounceDirection=Math.random()>0.5?1:-1}
initializeTeleporting(){this.teleportCooldown=2000+Math.random()*3000}
update(){if(this.isCollected)return;const currentTime=Date.now();switch(this.config.behavior){case 'moving':this.updateMoving();break;case 'bouncing':this.updateBouncing();break;case 'teleporting':this.updateTeleporting(currentTime);break}
this.updateAging(currentTime)}
updateMoving(){const newX=this.pos.x+this.moveDirection.x;const newZ=this.pos.z+this.moveDirection.z;const bounds=this.minigame.gameArea;if(newX<=bounds.minX||newX>=bounds.maxX){this.moveDirection.x*=-1}
if(newZ<=bounds.minZ||newZ>=bounds.maxZ){this.moveDirection.z*=-1}
this.pos.x=Math.max(bounds.minX,Math.min(bounds.maxX,newX));this.pos.z=Math.max(bounds.minZ,Math.min(bounds.maxZ,newZ));this.updateMeshPosition()}
updateBouncing(){const bounceSpeed=0.02;this.pos.x+=this.bounceDirection*bounceSpeed;if(Math.random()<0.05){this.bounceDirection*=-1}
const bounds=this.minigame.gameArea;if(this.pos.x<=bounds.minX||this.pos.x>=bounds.maxX){this.bounceDirection*=-1}
this.pos.x=Math.max(bounds.minX,Math.min(bounds.maxX,this.pos.x));this.updateMeshPosition()}
updateTeleporting(currentTime){if(currentTime-this.lastTeleport>this.teleportCooldown){const newPos=this.minigame.getRandomValidPosition();if(newPos){this.mesh.scale.setScalar(0.1);const teleportEffect=()=>{this.mesh.scale.addScalar(0.1);if(this.mesh.scale.x<1.0){requestAnimationFrame(teleportEffect)}};teleportEffect();this.pos=newPos;this.updateMeshPosition();this.lastTeleport=currentTime;this.teleportCooldown=2000+Math.random()*3000}}}
updateMeshPosition(){const tile=this.game.terrain.getTile(Math.floor(this.pos.x),Math.floor(this.pos.z));if(tile&&this.mesh){this.mesh.position.x=tile.mesh.position.x;this.mesh.position.z=tile.mesh.position.z}}
updateAging(currentTime){const age=currentTime-this.creationTime;const remaining=this.lifespan-age;if(remaining<2000){const fadeRatio=remaining/2000;this.mesh.material.opacity=fadeRatio*0.9;if(remaining<1000){const blink=Math.sin(currentTime*0.01)>0;this.mesh.visible=blink}}}
isExpired(){return Date.now()-this.creationTime>this.lifespan}
destroy(){this.isCollected=!0;if(this.mesh){const shrink=()=>{if(!this.mesh||!this.mesh.parent)return;this.mesh.scale.multiplyScalar(0.9);if(this.mesh.scale.x>0.1){requestAnimationFrame(shrink)}else{this.game.scene.remove(this.mesh);this.mesh.geometry?.dispose();this.mesh.material?.dispose()}};shrink()}}}
class SpiritPortalDashGame extends BaseMinigame{constructor(game,difficulty='normal'){super(game);this.difficulty=difficulty;this.portals=[];this.currentPortalIndex=0;this.gameArea={minX:1,maxX:15,minZ:1,maxZ:15};this.gameTime=60000;this.remainingTime=this.gameTime;this.score=0;this.portalsCompleted=0;this.gameStartTime=0;this.isPlayerInPortal=!1;this.difficultySettings={easy:{portalCount:6,portalLifetime:8000,timeExtension:5000,spawnDelay:2000,portalSize:1.2},normal:{portalCount:8,portalLifetime:6000,timeExtension:4000,spawnDelay:1500,portalSize:1.0},hard:{portalCount:10,portalLifetime:4000,timeExtension:3000,spawnDelay:1000,portalSize:0.8}};this.settings=this.difficultySettings[difficulty]||this.difficultySettings.normal;this.totalPortals=this.settings.portalCount;this.enterDistance=1.5;this.portalSequence=this.generatePortalSequence();this.uiElements={}}
start(){super.start();this.game.cameraSystem.setCameraPreset('followPlayer',!0,()=>{this.setupGameArea();this.createGameUI();this.gameStartTime=Date.now();this.showGameInstructions();setTimeout(()=>{this.spawnNextPortal()},1000)})}
generatePortalSequence(){const sequence=[];const{minX,maxX,minZ,maxZ}=this.gameArea;const positions=[{x:3,z:3},{x:12,z:3},{x:12,z:12},{x:3,z:12},{x:8,z:8},{x:1,z:8},{x:14,z:8},{x:8,z:1},{x:8,z:14},{x:5,z:5},];for(let i=0;i<this.totalPortals;i++){if(i<positions.length){sequence.push(positions[i])}else{sequence.push({x:Math.floor(minX+Math.random()*(maxX-minX)),z:Math.floor(minZ+Math.random()*(maxZ-minZ))})}}
return sequence}
setupGameArea(){const boundaryPositions=[{x:this.gameArea.minX,z:this.gameArea.minZ},{x:this.gameArea.maxX,z:this.gameArea.minZ},{x:this.gameArea.maxX,z:this.gameArea.maxZ},{x:this.gameArea.minX,z:this.gameArea.maxZ}];boundaryPositions.forEach((pos,index)=>{const tile=this.game.terrain.getTile(Math.floor(pos.x),Math.floor(pos.z));if(tile){const marker=this.createMysticalMarker(tile,index);this.game.scene.add(marker);this.addCleanupItem(marker)}})}
createMysticalMarker(tile,index){const geometry=new THREE.OctahedronGeometry(0.3,0);const material=new THREE.MeshLambertMaterial({color:0x9c27b0,emissive:0x4a148c,transparent:!0,opacity:0.8});const marker=new THREE.Mesh(geometry,material);marker.position.set(tile.mesh.position.x,this.game.terrain.heightScales[tile.height]+1.5,tile.mesh.position.z);const startTime=Date.now();const mysticalSpin=()=>{if(!marker.parent)return;const elapsed=Date.now()-startTime;marker.rotation.x=elapsed*0.002;marker.rotation.y=elapsed*0.003;marker.rotation.z=elapsed*0.001;const float=Math.sin(elapsed*0.002)*0.3;marker.position.y=this.game.terrain.heightScales[tile.height]+1.5+float;requestAnimationFrame(mysticalSpin)};mysticalSpin();return marker}
spawnNextPortal(){if(this.currentPortalIndex>=this.totalPortals){this.endGame('completed');return}
const position=this.portalSequence[this.currentPortalIndex];const portal=new MysticalPortal(this.game,this,position,this.currentPortalIndex);this.portals.push(portal);this.addCleanupItem(portal)}
createGameUI(){const content=`<div style="color: #9c27b0; font-weight: bold; margin-bottom: 10px; text-align: center;">🌀 SPIRIT PORTAL DASH! 🌀</div><div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Time:</span> <span id="portal-time" style="color: #ffeb3b;">60</span>s</div><div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Score:</span> <span id="portal-score" style="color: #4caf50;">0</span></div><div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Portal:</span> <span id="portal-current" style="color: #9c27b0;">1/${this.totalPortals}</span></div>`;this.createUI(content);this.uiElements.time=document.getElementById('portal-time');this.uiElements.score=document.getElementById('portal-score');this.uiElements.current=document.getElementById('portal-current')}
showGameInstructions(){this.game.showInteractionMessage(`Portal Dash: Run through mystical portals before they close! ${this.difficulty.toUpperCase()} difficulty.`)}
update(){if(!this.isRunning)return;const currentTime=Date.now();this.remainingTime=Math.max(0,this.gameTime-(currentTime-this.gameStartTime));this.updateUI();this.checkPortalInteraction();this.updatePortals();this.checkGameEnd()}
updateUI(){this.uiElements.time.textContent=Math.ceil(this.remainingTime/1000);this.uiElements.score.textContent=this.score;this.uiElements.current.textContent=`${this.currentPortalIndex + 1}/${this.totalPortals}`}
updatePortals(){this.portals=this.portals.filter(portal=>{if(portal.isExpired&&portal.isExpired()){if(portal.isActive){this.onPortalMissed()}
portal.destroy();return!1}
return!0})}
checkPortalInteraction(){if(this.isPlayerInPortal)return;const playerPos=this.game.player.pos;const activePortal=this.portals.find(p=>p.isActive);if(activePortal){const distance=Math.sqrt(Math.pow(playerPos.x-activePortal.pos.x,2)+Math.pow(playerPos.z-activePortal.pos.z,2));if(distance<=this.enterDistance){this.enterPortal(activePortal)}}}
enterPortal(portal){this.isPlayerInPortal=!0;const timeBonus=Math.floor(portal.getRemainingTime()/100);const baseScore=100;this.score+=baseScore+timeBonus;this.gameTime+=this.settings.timeExtension;this.game.showInteractionMessage(`Portal complete! +${baseScore + timeBonus}`);portal.onPlayerEnter();this.portalsCompleted++;this.currentPortalIndex++;setTimeout(()=>{this.isPlayerInPortal=!1;if(this.currentPortalIndex<this.totalPortals){setTimeout(()=>{this.spawnNextPortal()},this.settings.spawnDelay)}else{this.endGame('completed')}},500)}
onPortalMissed(){this.score=Math.max(0,this.score-50);this.currentPortalIndex++;setTimeout(()=>{if(this.currentPortalIndex<this.totalPortals){this.spawnNextPortal()}else{this.endGame('completed')}},this.settings.spawnDelay)}
checkGameEnd(){if(this.remainingTime<=0){this.endGame('timeout')}}
endGame(reason){this.isRunning=!1;let message='';switch(reason){case 'completed':message=`🎉 All portals completed! Final Score: ${this.score}`;break;case 'timeout':message=`⏰ Time's up! Completed ${this.portalsCompleted}/${this.totalPortals} portals. Final Score: ${this.score}`;break}
setTimeout(()=>{this.game.showInteractionMessage(message);this.end()},500)}}
class MysticalPortal{constructor(game,minigameRef,position,portalIndex){this.game=game;this.minigame=minigameRef;this.pos=position;this.portalIndex=portalIndex;this.isActive=!0;this.creationTime=Date.now();this.lifetime=this.minigame.settings.portalLifetime;this.isEntered=!1;this.createVisual()}
createVisual(){const geometry=new THREE.TorusGeometry(1,0.1,8,16);const material=new THREE.MeshLambertMaterial({color:0x9c27b0,emissive:0x4a148c,transparent:!0,opacity:0.9});this.mesh=new THREE.Mesh(geometry,material);const tile=this.game.terrain.getTile(this.pos.x,this.pos.z);if(tile){this.mesh.position.set(tile.mesh.position.x,this.game.terrain.heightScales[tile.height]+0.5,tile.mesh.position.z)}
this.game.scene.add(this.mesh);const startTime=Date.now();const animate=()=>{if(!this.mesh||!this.mesh.parent)return;const elapsed=Date.now()-startTime;this.mesh.rotation.z=elapsed*0.003;requestAnimationFrame(animate)};animate()}
getRemainingTime(){return Math.max(0,this.lifetime-(Date.now()-this.creationTime))}
isExpired(){return this.getRemainingTime()<=0}
onPlayerEnter(){this.isEntered=!0;this.isActive=!1}
destroy(){if(this.mesh){this.game.scene.remove(this.mesh);this.mesh.geometry?.dispose();this.mesh.material?.dispose()}}}
class ElementalTilePuzzleGame extends BaseMinigame{constructor(game,difficulty='normal'){super(game);this.difficulty=difficulty;this.gameArea={centerX:8,centerZ:8};this.gameTime=180000;this.remainingTime=this.gameTime;this.score=0;this.moves=0;this.gameStartTime=0;this.difficultySettings={easy:{gridSize:3,states:3},normal:{gridSize:4,states:4},hard:{gridSize:5,states:5}};this.settings=this.difficultySettings[difficulty]||this.difficultySettings.normal;this.gridSize=this.settings.gridSize;this.maxStates=this.settings.states;const halfGrid=Math.floor(this.gridSize/2);this.puzzleArea={minX:this.gameArea.centerX-halfGrid,maxX:this.gameArea.centerX+halfGrid,minZ:this.gameArea.centerZ-halfGrid,maxZ:this.gameArea.centerZ+halfGrid};this.currentPattern=[];this.targetPattern=[];this.originalHeights={};this.uiElements={}}
start(){super.start();this.game.cameraSystem.setCameraPreset('overview',!0,()=>{this.setupPuzzleArea();this.generateTargetPattern();this.setupInitialState();this.createGameUI();this.gameStartTime=Date.now();this.showGameInstructions()})}
setupPuzzleArea(){for(let x=this.puzzleArea.minX;x<=this.puzzleArea.maxX;x++){for(let z=this.puzzleArea.minZ;z<=this.puzzleArea.maxZ;z++){const tile=this.game.terrain.getTile(x,z);if(tile){this.originalHeights[`${x},${z}`]=tile.height}}}}
generateTargetPattern(){this.targetPattern=[];for(let x=0;x<this.gridSize;x++){this.targetPattern[x]=[];for(let z=0;z<this.gridSize;z++){this.targetPattern[x][z]=Math.floor(Math.random()*this.maxStates)}}}
setupInitialState(){this.currentPattern=[];for(let x=0;x<this.gridSize;x++){this.currentPattern[x]=[];for(let z=0;z<this.gridSize;z++){let initialState;do{initialState=Math.floor(Math.random()*this.maxStates)}while(initialState===this.targetPattern[x][z]&&Math.random()<0.7);this.currentPattern[x][z]=initialState;const terrainX=this.puzzleArea.minX+x;const terrainZ=this.puzzleArea.minZ+z;if(this.game.terrain.updateTileHeight){this.game.terrain.updateTileHeight(terrainX,terrainZ,initialState)}}}}
createGameUI(){const content=`<div style="color: #ff5722; font-weight: bold; margin-bottom: 10px; text-align: center;">🧩 ELEMENTAL TILE PUZZLE! 🧩</div><div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Time:</span> <span id="puzzle-time" style="color: #ffeb3b;">180</span>s</div><div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Score:</span> <span id="puzzle-score" style="color: #4caf50;">0</span></div><div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Moves:</span> <span id="puzzle-moves" style="color: #ff9800;">0</span></div>`;this.createUI(content);this.uiElements.time=document.getElementById('puzzle-time');this.uiElements.score=document.getElementById('puzzle-score');this.uiElements.moves=document.getElementById('puzzle-moves')}
showGameInstructions(){this.game.showInteractionMessage(`Step on tiles to cycle through states! Match the target pattern. ${this.difficulty.toUpperCase()} difficulty.`)}
update(){if(!this.isRunning)return;const currentTime=Date.now();this.remainingTime=Math.max(0,this.gameTime-(currentTime-this.gameStartTime));this.updateUI();this.checkPlayerMove();this.checkGameEnd()}
updateUI(){this.uiElements.time.textContent=Math.ceil(this.remainingTime/1000);this.uiElements.score.textContent=this.score;this.uiElements.moves.textContent=this.moves}
checkPlayerMove(){const playerPos=this.game.player.pos;if(playerPos.x>=this.puzzleArea.minX&&playerPos.x<=this.puzzleArea.maxX&&playerPos.z>=this.puzzleArea.minZ&&playerPos.z<=this.puzzleArea.maxZ){const puzzleX=playerPos.x-this.puzzleArea.minX;const puzzleZ=playerPos.z-this.puzzleArea.minZ;if(!this.lastPlayerPosition||this.lastPlayerPosition.x!==puzzleX||this.lastPlayerPosition.z!==puzzleZ){this.onTileStep(puzzleX,puzzleZ);this.lastPlayerPosition={x:puzzleX,z:puzzleZ}}}else{this.lastPlayerPosition=null}}
onTileStep(puzzleX,puzzleZ){if(puzzleX<0||puzzleX>=this.gridSize||puzzleZ<0||puzzleZ>=this.gridSize)return;this.currentPattern[puzzleX][puzzleZ]=(this.currentPattern[puzzleX][puzzleZ]+1)%this.maxStates;const terrainX=this.puzzleArea.minX+puzzleX;const terrainZ=this.puzzleArea.minZ+puzzleZ;if(this.game.terrain.updateTileHeight){this.game.terrain.updateTileHeight(terrainX,terrainZ,this.currentPattern[puzzleX][puzzleZ])}
this.moves++;this.game.showInteractionMessage(`Tile cycled! State: ${this.currentPattern[puzzleX][puzzleZ] + 1}`);if(this.isPuzzleComplete()){this.endGame('completed')}}
isPuzzleComplete(){for(let x=0;x<this.gridSize;x++){for(let z=0;z<this.gridSize;z++){if(this.currentPattern[x][z]!==this.targetPattern[x][z])return!1}}
return!0}
checkGameEnd(){if(this.remainingTime<=0){this.endGame('timeout')}}
endGame(reason){this.isRunning=!1;let message='';switch(reason){case 'completed':const timeBonus=Math.floor(this.remainingTime/100);this.score+=timeBonus;message=`🎉 Puzzle solved! Time bonus: +${timeBonus} Final Score: ${this.score}`;break;case 'timeout':message=`⏰ Time's up! Final Score: ${this.score}`;break}
setTimeout(()=>{this.game.showInteractionMessage(message);this.restoreOriginalTerrain();this.end()},500)}
restoreOriginalTerrain(){Object.keys(this.originalHeights).forEach(key=>{const[x,z]=key.split(',').map(Number);const originalHeight=this.originalHeights[key];if(this.game.terrain.updateTileHeight){this.game.terrain.updateTileHeight(x,z,originalHeight)}})}
end(){this.restoreOriginalTerrain();super.end()}}
class EnhancedSpiritNPC extends NPC{constructor(game,minigameRef,spiritIndex,config){const spiritId=`spirit_${spiritIndex}_${Date.now()}`;const tempData={spriteRow:config.spriteRow,position:minigameRef.getRandomSpawnPosition(),spawnDelay:0,patrolType:'none',idleFrame:0,name:config.name,conversations:[{message:"",action:null}]};NPC_DATA[spiritId]=tempData;super(game,spiritId);delete NPC_DATA[spiritId];this.minigame=minigameRef;this.spiritIndex=spiritIndex;this.config=config;this.isTagged=!1;this.isSpirit=!0;this.isInteractable=!1;this.baseSpeed=config.speed;this.speed=this.baseSpeed;this.behavior=config.behavior;this.lastBehaviorUpdate=0;this.behaviorUpdateInterval=800+Math.random()*400;this.targetPosition=null;this.patrolPoints=[];this.currentPatrolIndex=0;this.applyVisualEffects();this.createFallbackVisual();this.initializeBehavior()}
createFallbackVisual(){setTimeout(()=>{if(!this.sprite||!this.sprite.material){const geometry=new THREE.SphereGeometry(0.5,8,6);const material=new THREE.MeshLambertMaterial({color:this.config.color,emissive:this.config.emissive,emissiveIntensity:1.5,transparent:!0,opacity:0.9});this.fallbackSprite=new THREE.Mesh(geometry,material);const tile=this.game.terrain.getTile(this.pos.x,this.pos.z);if(tile){this.fallbackSprite.position.set(tile.mesh.position.x,this.game.terrain.heightScales[tile.height]+1.5,tile.mesh.position.z)}
this.game.scene.add(this.fallbackSprite);this.sprite=this.fallbackSprite;const startY=this.fallbackSprite.position.y;const startTime=Date.now();const animate=()=>{if(!this.fallbackSprite||!this.fallbackSprite.parent)return;const elapsed=Date.now()-startTime;const offset=Math.sin(elapsed*0.003)*0.5;this.fallbackSprite.position.y=startY+offset;this.fallbackSprite.rotation.y=elapsed*0.002;requestAnimationFrame(animate)};animate()}},500)}
applyVisualEffects(){if(this.sprite&&this.sprite.material){this.sprite.material.transparent=!0;this.sprite.material.opacity=0.85;this.sprite.material.emissive=new THREE.Color(this.config.emissive);this.sprite.material.color=new THREE.Color(this.config.color)}}
initializeBehavior(){switch(this.behavior){case 'patrol':this.patrolPoints=this.generatePatrolRoute();break;case 'smart':this.playerHistory=[];break}}
generatePatrolRoute(){const bounds=this.minigame.gameArea;const points=[];const centerX=(bounds.minX+bounds.maxX)/2;const centerZ=(bounds.minZ+bounds.maxZ)/2;for(let i=0;i<6;i++){const angle=(i/6)*Math.PI*2;const radius=3;points.push({x:Math.floor(centerX+Math.cos(angle)*radius),z:Math.floor(centerZ+Math.sin(angle)*radius)})}
return points}
updateAI(){if(this.isTagged||!this.minigame.isRunning)return;const currentTime=Date.now();const playerPos=this.game.player.pos;const distanceToPlayer=Math.sqrt(Math.pow(this.pos.x-playerPos.x,2)+Math.pow(this.pos.z-playerPos.z,2));if(currentTime-this.lastBehaviorUpdate>this.behaviorUpdateInterval){this.executeBehavior(playerPos,distanceToPlayer);this.lastBehaviorUpdate=currentTime}}
executeBehavior(playerPos,distanceToPlayer){const isChaseMode=this.minigame.mode==='chase';switch(this.behavior){case 'aggressive':if(isChaseMode){if(distanceToPlayer<=4){this.fleeFromPlayer(playerPos)}else{this.moveToRandomPosition()}}else{this.chasePlayer(playerPos)};break;case 'smart':if(isChaseMode){this.fleeFromPlayer(playerPos)}else{this.chasePlayer(playerPos)};break;case 'patrol':if(isChaseMode){if(distanceToPlayer<=3){this.fleeFromPlayer(playerPos)}else{this.continuePatrol()}}else{if(distanceToPlayer<=5){this.chasePlayer(playerPos)}else{this.continuePatrol()}};break;case 'random':if(Math.random()<0.6){this.moveToRandomPosition()};break}}
continuePatrol(){if(this.patrolPoints.length===0)return;const target=this.patrolPoints[this.currentPatrolIndex];const distance=Math.sqrt(Math.pow(this.pos.x-target.x,2)+Math.pow(this.pos.z-target.z,2));if(distance<1.5){this.currentPatrolIndex=(this.currentPatrolIndex+1)%this.patrolPoints.length}
this.moveToPosition(target)}
fleeFromPlayer(playerPos){const fleeX=this.pos.x+(this.pos.x-playerPos.x)*2;const fleeZ=this.pos.z+(this.pos.z-playerPos.z)*2;const target=this.clampToBounds(fleeX,fleeZ);this.moveToPosition(target)}
chasePlayer(playerPos){this.moveToPosition(playerPos)}
moveToRandomPosition(){const bounds=this.minigame.gameArea;const target={x:Math.floor(bounds.minX+Math.random()*(bounds.maxX-bounds.minX)),z:Math.floor(bounds.minZ+Math.random()*(bounds.maxZ-bounds.minZ))};this.moveToPosition(target)}
moveToPosition(target){const clampedTarget=this.clampToBounds(target.x,target.z);if(this.game.terrain.isValidCoordinate(clampedTarget.x,clampedTarget.z)){this.findPath(this.pos,clampedTarget,(path)=>{this.path=path;this.progress=0})}}
clampToBounds(x,z){const bounds=this.minigame.gameArea;return{x:Math.max(bounds.minX,Math.min(bounds.maxX,Math.floor(x))),z:Math.max(bounds.minZ,Math.min(bounds.maxZ,Math.floor(z)))}}
onTagged(){if(this.sprite&&this.sprite.material){this.sprite.material.opacity=0.3;this.sprite.material.emissive=new THREE.Color(0x004400)}
this.path=[]}
destroy(){if(this.sprite&&this.sprite!==this.fallbackSprite){this.game.scene.remove(this.sprite);this.sprite.material?.dispose();this.sprite.geometry?.dispose()}
if(this.fallbackSprite){this.game.scene.remove(this.fallbackSprite);this.fallbackSprite.material?.dispose();this.fallbackSprite.geometry?.dispose()}
this.game.interactables=this.game.interactables.filter(i=>i.npcRef!==this)}
setPosition(x,z){super.setPosition(x,z);if(this.fallbackSprite){const tile=this.game.terrain.getTile(x,z);if(tile){this.fallbackSprite.position.set(tile.mesh.position.x,this.game.terrain.heightScales[tile.height]+1.5,tile.mesh.position.z)}}}}
SpiritChaserGame.prototype.getRandomSpawnPosition=function(){const bounds=this.gameArea;let attempts=0;let position;do{position={x:Math.floor(bounds.minX+Math.random()*(bounds.maxX-bounds.minX)),z:Math.floor(bounds.minZ+Math.random()*(bounds.maxZ-bounds.minZ))};attempts++}while(attempts<10&&this.game.terrain.getTile(position.x,position.z)?.height>3);return position};function initializeMinigames(){if(typeof game!=='undefined'&&game.terrain){game.minigameManager=new MinigameManager(game);if(game.update){const originalUpdate=game.update;game.update=function(){originalUpdate.call(this);if(this.minigameManager){this.minigameManager.update()}}}
if(game.npcs&&game.npcs.length>0){const originalExecuteSingleAction=NPC.prototype.executeSingleAction;NPC.prototype.executeSingleAction=function(action,onComplete){if(action.type==='minigame'){if(action.gameType==='spiritChase'){game.minigameManager.startSpiritChaseTag(action.mode)}else if(action.gameType==='fruitRush'){game.minigameManager.startFruitRush(action.difficulty)}else if(action.gameType==='portalDash'){game.minigameManager.startPortalDash(action.difficulty)}else if(action.gameType==='tilePuzzle'){game.minigameManager.startTilePuzzle(action.difficulty)}
onComplete();return}
originalExecuteSingleAction.call(this,action,onComplete)}}
if(game.npcs){const elena=game.npcs.find(npc=>npc.npcId==='wise_elena');if(elena){elena.conversations.push({message:"The ancient spirits await your challenge. Are you ready for the Spirit Chase?",requiresConfirmation:!0,confirmationMessage:"🎯 Chase Mode: Hunt down the fleeing spirits!",confirmationAlternative:"🏃 Evade Mode: Survive the spirit hunt!",action:{type:'choice',onSuccess:{type:'minigame',gameType:'spiritChase',mode:'chase',message:'Elena summons the spirits... they scatter!'},onFailure:{type:'minigame',gameType:'spiritChase',mode:'evade',message:'Elena summons hunting spirits!'}}});}
const traderJill=game.npcs.find(npc=>npc.npcId==='trader_jill');if(traderJill){traderJill.conversations.push({message:"I've got magical fruits! Want to test your collection skills?",requiresConfirmation:!0,confirmationMessage:"🟢 EASY: Slower fruits",confirmationAlternative:"🔴 HARD: Fast teleporting fruits!",action:{type:'choice',onSuccess:{type:'minigame',gameType:'fruitRush',difficulty:'easy',message:'Jill scatters friendly fruits!'},onFailure:{type:'minigame',gameType:'fruitRush',difficulty:'hard',message:'Jill releases chaos fruits!'}}});traderJill.conversations.push({message:"How about a NORMAL fruit challenge?",requiresConfirmation:!1,action:{type:'minigame',gameType:'fruitRush',difficulty:'normal',message:'Jill releases balanced fruits!'}})}
const elderMarcus=game.npcs.find(npc=>npc.npcId==='elder_marcus');if(elderMarcus){elderMarcus.conversations.push({message:"The elemental tiles hold ancient patterns. Can you arrange them correctly?",requiresConfirmation:!0,confirmationMessage:"🟢 EASY: Simple 3x3 pattern",confirmationAlternative:"🔴 HARD: Complex 5x5 pattern!",action:{type:'choice',onSuccess:{type:'minigame',gameType:'tilePuzzle',difficulty:'easy',message:'Marcus creates a gentle pattern!'},onFailure:{type:'minigame',gameType:'tilePuzzle',difficulty:'hard',message:'Marcus channels powerful energies!'}}});elderMarcus.conversations.push({message:"Ready for a BALANCED elemental challenge?",requiresConfirmation:!1,action:{type:'minigame',gameType:'tilePuzzle',difficulty:'normal',message:'Marcus weaves a balanced matrix!'}})}
const healerRose=game.npcs.find(npc=>npc.npcId==='healer_rose');if(healerRose){healerRose.conversations.push({message:"The healing springs connect through mystical portals. Can you dash through them all?",requiresConfirmation:!0,confirmationMessage:"🟢 EASY: Longer portal lifetime",confirmationAlternative:"🔴 HARD: Quick portals, speed challenge!",action:{type:'choice',onSuccess:{type:'minigame',gameType:'portalDash',difficulty:'easy',message:'Rose opens gentle portals!'},onFailure:{type:'minigame',gameType:'portalDash',difficulty:'hard',message:'Rose channels intense energy!'}}});healerRose.conversations.push({message:"Ready for a NORMAL portal challenge?",requiresConfirmation:!1,action:{type:'minigame',gameType:'portalDash',difficulty:'normal',message:'Rose creates balanced portals!'}})}}}
}
console.log('Enhanced Minigame System initialized - All 4 minigames ready!')
  
if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initializeMinigames)
} else {
    initializeMinigames()
}