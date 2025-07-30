// Minigames System - Modular and Efficient
class MinigameManager {
    constructor(game) {
        this.game = game;
        this.activeMinigame = null;
        this.minigameRegistry = {};
        this.originalNPCStates = new Map();
        this.originalPlayerState = null;
        
        // Register available minigames
        this.registerMinigame('terrain_wave_cross', TerrainWaveCross);
    }

    registerMinigame(name, minigameClass) {
        this.minigameRegistry[name] = minigameClass;
    }

    startMinigame(name, config = {}) {
        if (this.activeMinigame) {
            console.warn('Minigame already active, ending current one');
            this.endMinigame();
        }

        const MinigameClass = this.minigameRegistry[name];
        if (!MinigameClass) {
            console.error(`Minigame '${name}' not found`);
            return false;
        }

        // Save current game state
        this.saveGameState();
        
        // Create and start minigame
        this.activeMinigame = new MinigameClass(this.game, this, config);
        this.activeMinigame.start();
        
        console.log(`Started minigame: ${name}`);
        return true;
    }

    endMinigame() {
        if (!this.activeMinigame) return;
        
        this.activeMinigame.cleanup();
        this.activeMinigame = null;
        this.restoreGameState();
        
        console.log('Minigame ended, game state restored');
    }

    saveGameState() {
        // Save NPC states
        this.originalNPCStates.clear();
        if (this.game.npcs) {
            this.game.npcs.forEach(npc => {
                this.originalNPCStates.set(npc.npcId, {
                    pos: { ...npc.pos },
                    isPatrolling: npc.isPatrolling,
                    isInteractable: npc.isInteractable,
                    patrolType: npc.patrolType,
                    speed: npc.speed,
                    path: [...npc.path],
                    isExecutingAction: npc.isExecutingAction
                });
            });
        }

        // Save player state
        if (this.game.player) {
            this.originalPlayerState = {
                pos: { ...this.game.player.pos },
                path: [...this.game.player.path],
                speed: this.game.player.speed
            };
        }

        // Save and hide static objects
        this.originalStaticObjects = [];
        if (this.game.staticObjects) {
            this.game.staticObjects.forEach(obj => {
                if (obj.sprite) {
                    this.originalStaticObjects.push({
                        object: obj,
                        visible: obj.sprite.visible
                    });
                    obj.sprite.visible = false;
                }
            });
        }

        // Save and hide interactables (remove tooltips)
        this.originalInteractables = [...this.game.interactables];
        this.game.interactables = [];
        if (this.game.activeTooltip) {
            this.game.hideTooltip();
        }
    }

    restoreGameState() {
        // Restore NPCs
        if (this.game.npcs) {
            this.game.npcs.forEach(npc => {
                const saved = this.originalNPCStates.get(npc.npcId);
                if (saved) {
                    npc.pos = { ...saved.pos };
                    npc.setPosition(saved.pos.x, saved.pos.z);
                    npc.isPatrolling = saved.isPatrolling;
                    npc.isInteractable = saved.isInteractable;
                    npc.patrolType = saved.patrolType;
                    npc.speed = saved.speed;
                    npc.path = [];
                    npc.isExecutingAction = saved.isExecutingAction;
                }
            });
        }

        // Restore player
        if (this.game.player && this.originalPlayerState) {
            this.game.player.pos = { ...this.originalPlayerState.pos };
            this.game.player.setPosition(this.originalPlayerState.pos.x, this.originalPlayerState.pos.z);
            this.game.player.path = [];
            this.game.player.speed = this.originalPlayerState.speed;
        }

        // Restore static objects visibility
        if (this.originalStaticObjects) {
            this.originalStaticObjects.forEach(({ object, visible }) => {
                if (object.sprite) {
                    object.sprite.visible = visible;
                }
            });
            this.originalStaticObjects = null;
        }

        // Restore interactables
        if (this.originalInteractables) {
            this.game.interactables = this.originalInteractables;
            this.originalInteractables = null;
        }
    }

    update() {
        if (this.activeMinigame) {
            this.activeMinigame.update();
        }
    }
}

// Base Minigame Class
class BaseMinigame {
    constructor(game, manager, config) {
        this.game = game;
        this.manager = manager;
        this.config = { ...this.getDefaultConfig(), ...config };
        this.isActive = false;
        this.originalTerrain = new Map();
        this.uiElements = [];
    }

    getDefaultConfig() {
        return {};
    }

    start() {
        this.isActive = true;
        this.setupUI();
        this.initializeMinigame();
    }

    cleanup() {
        this.isActive = false;
        this.restoreTerrain();
        this.cleanupUI();
        this.onCleanup();
    }

    setupUI() {
        // Override in subclasses
    }

    cleanupUI() {
        this.uiElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.uiElements = [];
    }

    saveTileState(x, z) {
        const key = `${x},${z}`;
        const tile = this.game.terrain.getTile(x, z);
        if (tile && !this.originalTerrain.has(key)) {
            this.originalTerrain.set(key, tile.height);
        }
    }

    restoreTerrain() {
        this.originalTerrain.forEach((height, key) => {
            const [x, z] = key.split(',').map(Number);
            this.game.terrain.updateTileHeight(x, z, height);
        });
        this.originalTerrain.clear();
    }

    createUI(id, styles, content) {
        const element = document.createElement('div');
        element.id = id;
        element.style.cssText = styles;
        element.innerHTML = content;
        document.body.appendChild(element);
        this.uiElements.push(element);
        return element;
    }

    initializeMinigame() {
        // Override in subclasses
    }

    update() {
        // Override in subclasses
    }

    onCleanup() {
        // Override in subclasses
    }
}

// Terrain Wave Cross Minigame
class TerrainWaveCross extends BaseMinigame {
    getDefaultConfig() {
        return {
            mapSize: 16,
            minHeight: 0,
            maxHeight: 4,
            waveSpeed: 1000,
            scoreObjectChance: 0.2,
            participantNPCs: ['scout_mike', 'guard_tom', 'merchant_sara', 'healer_rose']
        };
    }

    initializeMinigame() {
        this.score = 0;
        this.wavePhase = 0;
        this.waveTimer = 0;
        this.scoreObjects = new Map();
        this.participants = [];
        this.gameEnded = false;
        this.winner = null;
        
        this.setupFullMapWave();
        this.positionParticipants();
        this.spawnScoreObjects();
        
        this.game.showMessage("¡Terrain Wave Cross! Cruza de lado a lado antes que los NPCs - ¡No toques alturas bajas!");
    }

    setupFullMapWave() {
        const { mapSize } = this.config;
        
        // Save and setup wave terrain (skip first and last rows)
        for (let x = 1; x < mapSize - 1; x++) { // Skip x=0 (start) and x=15 (goal)
            for (let z = 0; z < mapSize; z++) {
                this.saveTileState(x, z);
                // Initialize with varied heights for interesting starting pattern
                const initialHeight = Math.floor(this.config.maxHeight * (Math.sin(x * 0.5) + Math.cos(z * 0.3) + 2) / 4);
                this.game.terrain.updateTileHeight(x, z, Math.max(this.config.minHeight, Math.min(this.config.maxHeight, initialHeight)));
            }
        }
    }

positionParticipants(){
    const{mapSize}=this.config;
    const startLine=0;
    const playerZ=Math.floor(Math.random()*mapSize);
    this.game.player.setPosition(startLine,playerZ);
    this.participants.push({entity:this.game.player,type:'player',startPos:{x:startLine,z:playerZ},isAlive:!0,progress:0});
    
    // TWEAK: Single variable to control all NPC speeds - easily adjustable
    const NPC_BASE_SPEED = 0.001; // Change this one value to adjust all NPC speeds!
    
    this.config.participantNPCs.forEach((npcId,index)=>{
        const npc=this.game.npcs.find(n=>n.npcId===npcId);
        if(npc){
            let npcZ;
            do{npcZ=Math.floor(Math.random()*mapSize)}while(npcZ===playerZ);
            npc.setPosition(startLine,npcZ);
            npc.isPatrolling=!1;
            npc.isInteractable=!1;
            npc.path=[];
            // TWEAK: Make NPCs much slower and more variable
            npc.speed=NPC_BASE_SPEED * (0.7 + Math.random() * 0.4); // Range: 0.7x to 1.1x base speed
            this.participants.push({
                entity:npc,
                type:'npc',
                startPos:{x:startLine,z:npcZ},
                isAlive:!0,
                aiTimer:Math.random()*1000, // Increased from 500
                aiState:'racing',
                progress:0,
                stuckTimer:0,
                // TWEAK: Add confusion and hesitation
                confusionLevel: 0.3 + Math.random() * 0.4, // 0.3 to 0.7
                hesitationChance: 0.25 + Math.random() * 0.25, // 0.25 to 0.5
                baseSpeed: NPC_BASE_SPEED // Store base speed for reference
            })
        }
    });
    setTimeout(()=>{this.startRace()},1000)
}

    startRace() {
        this.game.showMessage("🏁 ¡LA CARRERA COMENZÓ! ¡Llega al lado derecho antes que los NPCs!");
        
        // Make all NPCs start racing toward the goal using patrolnpc system
        this.participants.forEach(participant => {
            if (participant.type === 'npc') {
                const npc = participant.entity;
                participant.aiState = 'racing';
                
                // Use patrolnpc with null type to move to goal
                this.executePatrolNPC(npc.npcId, null, this.config.mapSize - 1, npc.pos.z, NPC_BASE_SPEED);
            }
        });
    }

    executePatrolNPC(npcId, patrolType, centerX, centerZ, speed) {
        const npc = this.game.npcs.find(n => n.npcId === npcId);
        if (npc) {
            npc.path = [];
            npc.onReachTarget = null;
            
            if (patrolType === null) {
                npc.isPatrolling = false;
                npc.isExecutingAction = true;
                npc.speed = speed || 0.3;
                
                npc.findPath(npc.pos, { x: centerX, z: centerZ }, (path) => {
                    npc.path = path;
                    npc.progress = 0;
                    npc.onReachTarget = () => {
                        npc.isExecutingAction = false;
                        npc.onReachTarget = null;
                        // Continue racing - find next safe tile forward
                        this.continueNPCRacing(npc);
                    };
                });
            }
        }
    }

continueNPCRacing(npc){
    if(this.gameEnded)return;
    const goalX=this.config.mapSize-1;
    if(npc.pos.x>=goalX)return;
    
    const participant = this.participants.find(p => p.entity === npc);
    const NPC_BASE_SPEED = 0.001; // Same base speed variable
    
    // TWEAK: Add hesitation - sometimes NPCs just wait
    if(Math.random() < participant.hesitationChance){
        setTimeout(()=>this.continueNPCRacing(npc), 800 + Math.random() * 1200);
        return;
    }
    
    // TWEAK: Reduce forward progress and add randomness
    const baseProgress = 1;
    const randomProgress = Math.random() < participant.confusionLevel ? 
        Math.floor(Math.random() * 2) : // Sometimes move 0-1 tiles
        Math.floor(Math.random() * 2) + 1; // Sometimes move 1-2 tiles
    
    const targetX=Math.min(npc.pos.x + randomProgress, goalX);
    const safeTiles=[];
    
    // TWEAK: Reduce search range and make NPCs pickier about tiles
    for(let dz=-1;dz<=1;dz++){ // Reduced from -2 to 2
        const checkZ=Math.max(0,Math.min(this.config.mapSize-1,npc.pos.z+dz));
        const tile=this.game.terrain.getTile(targetX,checkZ);
        if(tile && tile.height > 1){
            // TWEAK: Add some randomness to tile selection priority
            const randomFactor = Math.random() * participant.confusionLevel;
            safeTiles.push({
                x:targetX,
                z:checkZ,
                priority: targetX + Math.random() - randomFactor
            });
        }
    }
    
    if(safeTiles.length>0){
        // TWEAK: Sometimes NPCs pick suboptimal tiles
        if(Math.random() < participant.confusionLevel){
            // Pick a random safe tile instead of the best one
            const randomTile = safeTiles[Math.floor(Math.random() * safeTiles.length)];
            this.executePatrolNPC(npc.npcId,null,randomTile.x,randomTile.z,0.02); // Slower speed
        } else {
            safeTiles.sort((a,b)=>b.priority-a.priority);
            const target=safeTiles[0];
            this.executePatrolNPC(npc.npcId,null,target.x,target.z,0.025);
        }
    }else{
        // TWEAK: Increase wait time when stuck
        setTimeout(()=>this.continueNPCRacing(npc), 700 + Math.random() * 800);
    }
}

    spawnScoreObjects() {
        const { mapSize, scoreObjectChance } = this.config;
        
        // Spawn score objects across the middle sections of the map
        for (let x = 2; x < mapSize - 2; x++) {
            for (let z = 0; z < mapSize; z++) {
                if (Math.random() < scoreObjectChance) {
                    const scoreObj = this.createScoreObject(x, z);
                    if (scoreObj) {
                        this.scoreObjects.set(`${x},${z}`, scoreObj);
                    }
                }
            }
        }
    }

    createScoreObject(x, z) {
        const tile = this.game.terrain.getTile(x, z);
        if (!tile) return null;

        const geometry = new THREE.SphereGeometry(0.2, 8, 6);
        const material = new THREE.MeshLambertMaterial({
            color: 0xFFD700,
            emissive: 0x332200,
            transparent: true,
            opacity: 0.9
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        const height = this.game.terrain.heightScales[tile.height] + 0.5;
        sphere.position.set(tile.mesh.position.x, height, tile.mesh.position.z);
        
        this.game.scene.add(sphere);
        
        // Floating animation
        const startY = sphere.position.y;
        const animate = () => {
            if (!this.isActive) return;
            sphere.position.y = startY + Math.sin(Date.now() * 0.005) * 0.2;
            sphere.rotation.y += 0.02;
            requestAnimationFrame(animate);
        };
        animate();
        
        return { mesh: sphere, value: 10 };
    }

    setupUI() {
        this.createUI('minigameUI', `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            z-index: 1000;
            min-width: 250px;
        `, `
            <h3>🌊 Terrain Wave Cross</h3>
            <div>Objetivo: Llegar al lado derecho del mapa</div>
            <div>Puntuación: <span id="scoreDisplay">0</span></div>
            <div style="margin-top: 10px; font-size: 12px;">
                <div id="raceStatus">🏁 ¡La carrera comenzó!</div>
                <div id="participantProgress"></div>
            </div>
            <button id="quitMinigame" style="margin-top: 10px; padding: 5px 10px; background: #f44; color: white; border: none; border-radius: 4px;">Rendirse</button>
        `);

        document.getElementById('quitMinigame').onclick = () => {
            this.manager.endMinigame();
        };
    }

    updateWave() {
        this.waveTimer += this.game.deltaTime;
        
        if (this.waveTimer >= this.config.waveSpeed) {
            this.waveTimer = 0;
            this.wavePhase = (this.wavePhase + 1) % 8; // More wave variations
            
            const { mapSize, minHeight, maxHeight } = this.config;
            
            // Create complex wave patterns (skip first and last rows)
            for (let x = 1; x < mapSize - 1; x++) { // Skip x=0 (start) and x=15 (goal)
                for (let z = 0; z < mapSize; z++) {
                    // Multiple wave functions for complex terrain
                    const wave1 = Math.sin((x + this.wavePhase) * 0.4) * 0.5;
                    const wave2 = Math.cos((z + this.wavePhase * 0.7) * 0.3) * 0.5;
                    const wave3 = Math.sin((x + z + this.wavePhase * 1.2) * 0.2) * 0.3;
                    
                    const combinedWave = (wave1 + wave2 + wave3 + 1.5) / 3;
                    const height = Math.floor(minHeight + combinedWave * (maxHeight - minHeight));
                    
                    this.game.terrain.updateTileHeight(x, z, Math.max(minHeight, Math.min(maxHeight, height)));
                    
                    // Update score objects positions
                    const key = `${x},${z}`;
                    const scoreObj = this.scoreObjects.get(key);
                    if (scoreObj) {
                        const tile = this.game.terrain.getTile(x, z);
                        if (tile) {
                            const newHeight = this.game.terrain.heightScales[tile.height] + 0.5;
                            scoreObj.mesh.position.y = newHeight;
                        }
                    }
                }
            }
        }
    }
checkCollisions(){
    if(this.gameEnded)return;
    this.participants.forEach(participant=>{
        if(!participant.isAlive)return;
        const entity=participant.entity;
        const tile=this.game.terrain.getTile(entity.pos.x,entity.pos.z);
        if(tile){
            participant.progress=entity.pos.x;
            if(tile.height<=1){
                participant.isAlive=!1;
                entity.setPosition(participant.startPos.x,participant.startPos.z);
                participant.progress=0;
                if(participant.type==='player'){
                    this.game.showMessage("¡Tocaste una altura peligrosa! Vuelves al inicio.");
                } else {
                    // TWEAK: NPCs get more confused after failing
                    participant.confusionLevel = Math.min(0.8, participant.confusionLevel + 0.2);
                    participant.hesitationChance = Math.min(0.6, participant.hesitationChance + 0.15);
                }
                
                // TWEAK: NPCs take longer to recover
                const recoveryTime = participant.type === 'player' ? 1500 : 2000 + Math.random() * 1500;
                setTimeout(()=>{
                    participant.isAlive=!0;
                }, recoveryTime);
                return;
            }
            
            const key=`${entity.pos.x},${entity.pos.z}`;
            const scoreObj=this.scoreObjects.get(key);
            if(scoreObj){
                if(participant.type==='player'){
                    this.score+=scoreObj.value;
                }
                this.game.scene.remove(scoreObj.mesh);
                scoreObj.mesh.geometry.dispose();
                scoreObj.mesh.material.dispose();
                this.scoreObjects.delete(key);
            }
            
            if(entity.pos.x>=this.config.mapSize-1){
                this.gameEnded=!0;
                this.winner=participant;
                if(participant.type==='player'){
                    this.game.showMessage(`¡🎉 GANASTE! Llegaste primero con ${this.score} puntos!`);
                }else{
                    this.game.showMessage(`💔 PERDISTE! ${participant.entity.name} llegó primero. Tu puntuación: ${this.score}`);
                }
                setTimeout(()=>this.manager.endMinigame(),3000);
                return;
            }
        }
    });
}

 updateNPCAI(){
    this.participants.forEach(participant=>{
        if(participant.type!=='npc'||!participant.isAlive||this.gameEnded)return;
        const npc=participant.entity;
        
        // TWEAK: Add thinking time - NPCs don't move immediately
        participant.aiTimer -= this.game.deltaTime;
        
        if(!npc.isExecutingAction && npc.path.length===0 && npc.pos.x<this.config.mapSize-1){
            if(participant.aiTimer <= 0){
                // TWEAK: Reset timer with more variation
                participant.aiTimer = 300 + Math.random() * 700 + (participant.confusionLevel * 500);
                this.continueNPCRacing(npc);
            }
        }
    });
}

    updateUI() {
        const scoreDisplay = document.getElementById('scoreDisplay');
        const raceStatus = document.getElementById('raceStatus');
        const progressDisplay = document.getElementById('participantProgress');
        
        if (scoreDisplay) {
            scoreDisplay.textContent = this.score;
        }
        
        if (raceStatus && this.gameEnded && this.winner) {
            if (this.winner.type === 'player') {
                raceStatus.innerHTML = '🏆 ¡VICTORIA!';
                raceStatus.style.color = '#4CAF50';
            } else {
                raceStatus.innerHTML = '💔 Derrota...';
                raceStatus.style.color = '#f44336';
            }
        }
        
        if (progressDisplay) {
            let progressHTML = '<div style="font-size: 11px; margin-top: 5px;">';
            
            // Sort participants by progress
            const sortedParticipants = [...this.participants].sort((a, b) => b.progress - a.progress);
            
            sortedParticipants.forEach((participant, index) => {
                const name = participant.type === 'player' ? 'Tú' : participant.entity.name;
                const progress = Math.floor((participant.progress / (this.config.mapSize - 1)) * 100);
                const status = participant.isAlive ? '🏃' : '💀';
                const position = index + 1;
                
                let color = '#fff';
                if (participant.type === 'player') color = '#4CAF50';
                else if (index === 0 && participant.type === 'npc') color = '#ff9800';
                
                progressHTML += `<div style="color: ${color};">
                    ${position}° ${name}: ${progress}% ${status}
                </div>`;
            });
            
            progressHTML += '</div>';
            progressDisplay.innerHTML = progressHTML;
        }
    }

    update() {
        if (!this.isActive) return;
        
        this.updateWave();
        this.checkCollisions();
        this.updateNPCAI();
        this.updateUI();
    }

    onCleanup() {
        // Cleanup score objects
        this.scoreObjects.forEach(scoreObj => {
            this.game.scene.remove(scoreObj.mesh);
            scoreObj.mesh.geometry.dispose();
            scoreObj.mesh.material.dispose();
        });
        this.scoreObjects.clear();
    }
}

// Integration with main game
(function() {
    const initMinigames = () => {
        if (typeof game !== 'undefined' && game.terrain) {
            // Add minigame manager to game
            game.minigameManager = new MinigameManager(game);
            
            // Extend game update loop
            const originalUpdate = game.update;
            game.update = function() {
                originalUpdate.call(this);
                if (this.minigameManager) {
                    this.minigameManager.update();
                }
            };
            
            // Add minigame trigger to Wise Elena
            const elena = game.npcs?.find(npc => npc.npcId === 'wise_elena');
            if (elena && elena.conversations) {
                elena.conversations.push({
                    message: "¿Quieres probar el desafío de las ondas del terreno? Es peligroso pero gratificante.",
                    requiresConfirmation: true,
                    confirmationMessage: "Comenzar Terrain Wave Cross",
                    confirmationAlternative: "Tal vez más tarde",
                    action: {
                        type: 'choice',
                        onSuccess: {
                            type: 'startMinigame',
                            minigame: 'terrain_wave_cross'
                        },
                        onFailure: {
                            type: 'message',
                            message: "Sabio. Regresa cuando estés preparado."
                        }
                    }
                });
                
                // Extend NPC action execution to handle minigames
                const originalExecuteAction = elena.executeAction;
                elena.executeAction = function(action) {
                    if (action.type === 'startMinigame') {
                        game.minigameManager.startMinigame(action.minigame);
                        return;
                    }
                    originalExecuteAction.call(this, action);
                };
            }
            
            console.log('Minigames system initialized');
        } else {
            setTimeout(initMinigames, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMinigames);
    } else {
        initMinigames();
    }
})();