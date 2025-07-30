class TerrainWaveCross extends BaseMinigame {
    getDefaultConfig() {
        return {
            mapSize: 16,
            minHeight: 0,
            maxHeight: 8,
            safeHeight: 2,
            waveSpeed: 800, // Slower base speed
            scoreObjectChance: 0.15,
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
        this.wavesPaused = false;
        
        // Improved wave parameters with better defaults
        this.waveAmplitude = 1.5;    // How dramatic height changes are
        this.waveSpeed = 1.0;        // Wave movement speed
        this.waveComplexity = 1.0;   // Pattern complexity
        this.safeZoneBonus = 1.0;    // Safe zone frequency
        
        // Smoothing system to prevent glitches
        this.heightMap = [];
        this.targetHeightMap = [];
        this.initializeHeightMaps();
        
        this.setupInitialTerrain();
        this.positionParticipants();
        this.spawnScoreObjects();
        this.game.showMessage("🌊 Terrain Wave Cross! Cross to the right side before the NPCs!");
    }

    initializeHeightMaps() {
        const { mapSize } = this.config;
        this.heightMap = [];
        this.targetHeightMap = [];
        
        for (let x = 0; x < mapSize; x++) {
            this.heightMap[x] = [];
            this.targetHeightMap[x] = [];
            for (let z = 0; z < mapSize; z++) {
                // Start with safe middle heights
                const height = Math.floor((this.config.minHeight + this.config.maxHeight) / 2);
                this.heightMap[x][z] = height;
                this.targetHeightMap[x][z] = height;
            }
        }
    }

    setupUI() {
        this.createUI('minigameUI', `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 1000;
            max-height: 500px;
            overflow-y: auto;
            min-width: 300px;
            font-size: 13px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        `, `
            <h3 style="margin: 0 0 10px 0; color: #4CAF50;">🌊 Terrain Wave Cross</h3>
            <div style="margin-bottom: 5px;">Goal: Reach the right side of the map</div>
            <div style="margin-bottom: 15px; font-weight: bold;">Score: <span id="scoreDisplay" style="color: #FFD700;">0</span></div>
            
            <div id="raceStatus" style="margin-bottom: 10px; padding: 8px; background: rgba(76, 175, 80, 0.2); border-radius: 5px; text-align: center;">
                🏁 Race in progress!
            </div>
            
            <div id="participantProgress" style="margin-bottom: 15px; font-size: 11px;"></div>
            
            <div style="border-top: 1px solid #555; padding-top: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #2196F3;">⚙️ Wave Controls</h4>
                
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 4px;">Wave Size: <span id="waveAmplitudeValue" style="color: #FFD700;">1.5</span></label>
                    <input type="range" id="waveAmplitude" min="0.5" max="3.0" step="0.1" value="1.5" style="width: 100%; margin-bottom: 2px;">
                    <small style="color: #aaa; font-size: 10px;">Controls height variation intensity</small>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 4px;">Wave Speed: <span id="waveSpeedValue" style="color: #FFD700;">1.0</span></label>
                    <input type="range" id="waveSpeedControl" min="0.2" max="2.0" step="0.1" value="1.0" style="width: 100%; margin-bottom: 2px;">
                    <small style="color: #aaa; font-size: 10px;">How fast the waves move</small>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 4px;">Pattern Complexity: <span id="waveComplexityValue" style="color: #FFD700;">1.0</span></label>
                    <input type="range" id="waveComplexity" min="0.5" max="2.0" step="0.1" value="1.0" style="width: 100%; margin-bottom: 2px;">
                    <small style="color: #aaa; font-size: 10px;">Wave pattern complexity</small>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 4px;">Safe Paths: <span id="safeZoneBonusValue" style="color: #FFD700;">1.0</span></label>
                    <input type="range" id="safeZoneBonus" min="0.3" max="2.0" step="0.1" value="1.0" style="width: 100%; margin-bottom: 2px;">
                    <small style="color: #aaa; font-size: 10px;">Frequency of safe crossing paths</small>
                </div>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <button id="pauseWaves" style="flex: 1; padding: 8px; font-size: 11px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Pause Waves
                    </button>
                    <button id="resetParams" style="flex: 1; padding: 8px; font-size: 11px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Reset
                    </button>
                </div>
            </div>
            
            <button id="quitMinigame" style="width: 100%; padding: 10px; background: #f44336; color: white; border: none; border-radius: 5px; font-size: 12px; cursor: pointer;">
                Quit Game
            </button>
        `);
        this.setupControls();
    }

    setupControls() {
        const controls = [
            { id: 'waveAmplitude', prop: 'waveAmplitude' },
            { id: 'waveSpeedControl', prop: 'waveSpeed' },
            { id: 'waveComplexity', prop: 'waveComplexity' },
            { id: 'safeZoneBonus', prop: 'safeZoneBonus' }
        ];

        controls.forEach(control => {
            const slider = document.getElementById(control.id);
            const valueDisplay = document.getElementById(control.id + 'Value');
            if (slider && valueDisplay) {
                slider.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    valueDisplay.textContent = value.toFixed(1);
                    this[control.prop] = value;
                });
            }
        });

        const pauseBtn = document.getElementById('pauseWaves');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.wavesPaused = !this.wavesPaused;
                pauseBtn.textContent = this.wavesPaused ? 'Resume Waves' : 'Pause Waves';
                pauseBtn.style.background = this.wavesPaused ? '#4CAF50' : '#FF9800';
            });
        }

        const resetBtn = document.getElementById('resetParams');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetWaveParameters();
            });
        }

        const quitBtn = document.getElementById('quitMinigame');
        if (quitBtn) {
            quitBtn.onclick = () => this.manager.endMinigame();
        }
    }

    resetWaveParameters() {
        this.waveAmplitude = 1.5;
        this.waveSpeed = 1.0;
        this.waveComplexity = 1.0;
        this.safeZoneBonus = 1.0;

        const controls = ['waveAmplitude', 'waveSpeedControl', 'waveComplexity', 'safeZoneBonus'];
        controls.forEach(id => {
            const slider = document.getElementById(id);
            const valueDisplay = document.getElementById(id + 'Value');
            if (slider) {
                const defaultValue = id === 'waveAmplitude' ? '1.5' : '1.0';
                slider.value = defaultValue;
                if (valueDisplay) valueDisplay.textContent = defaultValue;
            }
        });
    }

    setupInitialTerrain() {
        const { mapSize, minHeight, maxHeight } = this.config;
        
        // Create safe starting and ending zones
        for (let x = 0; x < mapSize; x++) {
            for (let z = 0; z < mapSize; z++) {
                this.saveTileState(x, z);
                
                let height;
                if (x === 0 || x === mapSize - 1) {
                    // Safe zones at start and end
                    height = Math.max(this.config.safeHeight + 1, Math.floor((minHeight + maxHeight) / 2));
                } else {
                    // Middle area starts with moderate heights
                    height = Math.floor((minHeight + maxHeight) / 2) + Math.floor(Math.random() * 3 - 1);
                    height = Math.max(minHeight, Math.min(maxHeight, height));
                }
                
                this.heightMap[x][z] = height;
                this.targetHeightMap[x][z] = height;
                this.game.terrain.updateTileHeight(x, z, height);
            }
        }
    }

    positionParticipants() {
        const { mapSize } = this.config;
        const startLine = 0;
        
        // Position player
        const playerZ = Math.floor(mapSize / 2);
        this.game.player.setPosition(startLine, playerZ);
        this.participants.push({
            entity: this.game.player,
            type: 'player',
            startPos: { x: startLine, z: playerZ },
            isAlive: true,
            progress: 0,
            stunTimer: 0
        });

        // Position NPCs with better AI
        const NPC_BASE_SPEED = 0.0008; // Slightly slower
        const usedPositions = new Set([playerZ]);

        this.config.participantNPCs.forEach((npcId) => {
            const npc = this.game.npcs.find(n => n.npcId === npcId);
            if (npc) {
                let npcZ;
                do {
                    npcZ = Math.floor(Math.random() * mapSize);
                } while (usedPositions.has(npcZ));
                
                usedPositions.add(npcZ);
                npc.setPosition(startLine, npcZ);
                npc.isPatrolling = false;
                npc.isInteractable = false;
                npc.path = [];
                npc.speed = NPC_BASE_SPEED * (0.8 + Math.random() * 0.4);

                this.participants.push({
                    entity: npc,
                    type: 'npc',
                    startPos: { x: startLine, z: npcZ },
                    isAlive: true,
                    aiTimer: Math.random() * 1000,
                    caution: 0.2 + Math.random() * 0.4, // How careful they are
                    patience: 0.1 + Math.random() * 0.3, // How long they wait
                    progress: 0,
                    stunTimer: 0,
                    lastMoveTime: 0
                });
            }
        });

        setTimeout(() => this.startRace(), 2000);
    }

    startRace() {
        this.game.showMessage("🏁 RACE STARTED! Reach the right side before the NPCs!");
        this.participants.forEach(participant => {
            if (participant.type === 'npc') {
                participant.lastMoveTime = Date.now() + Math.random() * 1000;
                this.scheduleNPCMove(participant);
            }
        });
    }

    scheduleNPCMove(participant) {
        if (this.gameEnded || !participant.isAlive || participant.stunTimer > 0) return;

        const npc = participant.entity;
        const currentTime = Date.now();
        
        if (currentTime < participant.lastMoveTime) {
            setTimeout(() => this.scheduleNPCMove(participant), 100);
            return;
        }

        this.moveNPCIntelligently(participant);
    }

    moveNPCIntelligently(participant) {
        if (this.gameEnded || !participant.isAlive || participant.stunTimer > 0) return;

        const npc = participant.entity;
        const { mapSize } = this.config;
        
        if (npc.pos.x >= mapSize - 1) return; // Already at finish

        // Look ahead for safe paths
        const currentX = Math.floor(npc.pos.x);
        const currentZ = Math.floor(npc.pos.z);
        const lookAhead = Math.min(2, mapSize - currentX - 1);
        
        const possibleMoves = [];
        
        for (let dx = 1; dx <= lookAhead; dx++) {
            const targetX = currentX + dx;
            if (targetX >= mapSize) break;
            
            for (let dz = -1; dz <= 1; dz++) {
                const targetZ = Math.max(0, Math.min(mapSize - 1, currentZ + dz));
                const height = this.heightMap[targetX][targetZ];
                
                if (height > this.config.safeHeight) {
                    const safety = height - this.config.safeHeight;
                    const distance = Math.abs(dz);
                    const progress = dx;
                    
                    possibleMoves.push({
                        x: targetX,
                        z: targetZ,
                        score: safety * 2 + progress * 3 - distance
                    });
                }
            }
        }

        if (possibleMoves.length > 0) {
            // Sort by safety score and add some randomness
            possibleMoves.sort((a, b) => b.score - a.score);
            const topMoves = possibleMoves.slice(0, Math.min(3, possibleMoves.length));
            const chosenMove = topMoves[Math.floor(Math.random() * topMoves.length)];
            
            npc.setPosition(chosenMove.x, chosenMove.z);
            participant.progress = chosenMove.x;
            
            // Schedule next move with some variation
            const baseDelay = 1200 + Math.random() * 800;
            const cautionDelay = participant.caution * 600;
            participant.lastMoveTime = Date.now() + baseDelay + cautionDelay;
            
            setTimeout(() => this.scheduleNPCMove(participant), baseDelay + cautionDelay);
        } else {
            // No safe moves found, wait a bit longer
            participant.lastMoveTime = Date.now() + 1500 + Math.random() * 1000;
            setTimeout(() => this.scheduleNPCMove(participant), 1500);
        }
    }

    spawnScoreObjects() {
        const { mapSize, scoreObjectChance } = this.config;
        
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

        const geometry = new THREE.SphereGeometry(0.25, 12, 8);
        const material = new THREE.MeshLambertMaterial({
            color: 0xFFD700,
            emissive: 0x664400,
            transparent: true,
            opacity: 0.9
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        const height = this.game.terrain.heightScales[tile.height] + 0.6;
        sphere.position.set(tile.mesh.position.x, height, tile.mesh.position.z);
        
        // Add gentle floating animation
        const originalY = height;
        const animate = () => {
            if (sphere.parent) {
                sphere.position.y = originalY + Math.sin(Date.now() * 0.003) * 0.2;
                requestAnimationFrame(animate);
            }
        };
        animate();
        
        this.game.scene.add(sphere);
        return { mesh: sphere, value: 15 };
    }

    updateWave(deltaTime) {
        if (this.wavesPaused) return;

        this.waveTimer += deltaTime;
        const updateInterval = this.config.waveSpeed / this.waveSpeed;
        
        if (this.waveTimer >= updateInterval) {
            this.waveTimer = 0;
            this.wavePhase += 0.5; // Smoother progression
            
            this.generateNewHeights();
            this.smoothHeightTransition();
            this.updateTerrainFromHeightMap();
            this.updateScoreObjectPositions();
        }
    }

    generateNewHeights() {
        const { mapSize, minHeight, maxHeight } = this.config;
        const time = this.wavePhase * 0.1;
        
        for (let x = 1; x < mapSize - 1; x++) {
            for (let z = 0; z < mapSize; z++) {
                // Multiple wave layers for more natural patterns
                const wave1 = Math.sin((x * 0.8 - time * this.waveSpeed) * this.waveComplexity) * 
                             Math.cos((z * 0.6 + time * this.waveSpeed * 0.7) * this.waveComplexity);
                
                const wave2 = Math.cos((x * 0.4 + time * this.waveSpeed * 0.8 - 10) * this.waveComplexity) * 
                             Math.sin((z * 0.9 - time * this.waveSpeed * 0.6 - 5) * this.waveComplexity);
                
                const wave3 = Math.sin((x * 0.6 + z * 0.3 - time * this.waveSpeed * 0.5) * this.waveComplexity);
                
                // Combine waves with different weights
                const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) * this.waveAmplitude;
                
                // Apply safe zone bonus
                let safeZoneBonus = 0;
                if (this.safeZoneBonus > 1.0) {
                    const safePattern = Math.sin(x * 0.7) * Math.cos(z * 0.8);
                    if (safePattern > 0.2) {
                        safeZoneBonus = (this.safeZoneBonus - 1.0) * 0.8;
                    }
                }
                
                // Convert to height value
                let heightFactor = Math.max(0, Math.min(1, (combinedWave + 1 + safeZoneBonus) / 2));
                
                // Ensure some safe paths exist
                if (Math.sin(x * 0.3) * Math.cos(z * 0.4) > 0.6) {
                    heightFactor = Math.max(heightFactor, 0.6);
                }
                
                const targetHeight = Math.round(minHeight + heightFactor * (maxHeight - minHeight));
                this.targetHeightMap[x][z] = Math.max(minHeight, Math.min(maxHeight, targetHeight));
            }
        }
    }

    smoothHeightTransition() {
        const { mapSize } = this.config;
        const smoothingFactor = 0.3; // How quickly heights change
        
        for (let x = 1; x < mapSize - 1; x++) {
            for (let z = 0; z < mapSize; z++) {
                const current = this.heightMap[x][z];
                const target = this.targetHeightMap[x][z];
                const diff = target - current;
                
                // Smooth transition to prevent jarring changes
                this.heightMap[x][z] = current + diff * smoothingFactor;
            }
        }
    }

    updateTerrainFromHeightMap() {
        const { mapSize } = this.config;
        
        for (let x = 1; x < mapSize - 1; x++) {
            for (let z = 0; z < mapSize; z++) {
                const roundedHeight = Math.round(this.heightMap[x][z]);
                this.game.terrain.updateTileHeight(x, z, roundedHeight);
            }
        }
    }

    updateScoreObjectPositions() {
        this.scoreObjects.forEach((scoreObj, key) => {
            const [x, z] = key.split(',').map(Number);
            const tile = this.game.terrain.getTile(x, z);
            if (tile && scoreObj.mesh.parent) {
                const baseHeight = this.game.terrain.heightScales[tile.height] + 0.6;
                const floatOffset = Math.sin(Date.now() * 0.003) * 0.2;
                scoreObj.mesh.position.y = baseHeight + floatOffset;
            }
        });
    }

    checkCollisions() {
        if (this.gameEnded) return;

        this.participants.forEach(participant => {
            if (!participant.isAlive || participant.stunTimer > 0) {
                if (participant.stunTimer > 0) participant.stunTimer -= 16; // Assuming ~60fps
                return;
            }

            const entity = participant.entity;
            const currentPos = {
                x: Math.floor(entity.pos.x),
                z: Math.floor(entity.pos.z)
            };

            const tile = this.game.terrain.getTile(currentPos.x, currentPos.z);
            if (!tile) return;

            participant.progress = currentPos.x;

            // Check for dangerous height
            if (tile.height <= this.config.safeHeight) {
                participant.isAlive = false;
                participant.stunTimer = 2000; // 2 second stun
                
                // Reset position
                entity.pos.x = participant.startPos.x;
                entity.pos.z = participant.startPos.z;
                if (entity.setPosition) entity.setPosition(participant.startPos.x, participant.startPos.z);
                if (entity.path) entity.path = [];
                participant.progress = 0;

                if (participant.type === 'player') {
                    this.game.showMessage("💀 Dangerous height! You're sent back to start!");
                }

                // Respawn after delay
                setTimeout(() => {
                    participant.isAlive = true;
                    participant.stunTimer = 0;
                    if (participant.type === 'npc') {
                        this.scheduleNPCMove(participant);
                    }
                }, 2000);
                return;
            }

            // Check for score objects
            const key = `${currentPos.x},${currentPos.z}`;
            const scoreObj = this.scoreObjects.get(key);
            if (scoreObj) {
                if (participant.type === 'player') {
                    this.score += scoreObj.value;
                }
                this.game.scene.remove(scoreObj.mesh);
                scoreObj.mesh.geometry.dispose();
                scoreObj.mesh.material.dispose();
                this.scoreObjects.delete(key);
            }

            // Check for victory
            if (currentPos.x >= this.config.mapSize - 1) {
                this.gameEnded = true;
                this.winner = participant;
                
                const message = participant.type === 'player' 
                    ? `🎉 VICTORY! You won with ${this.score} points!`
                    : `💔 DEFEAT! ${participant.entity.name} reached the finish first. Your score: ${this.score}`;
                
                this.game.showMessage(message);
                setTimeout(() => this.manager.endMinigame(), 4000);
            }
        });
    }

    updateUI() {
        const scoreDisplay = document.getElementById('scoreDisplay');
        const raceStatus = document.getElementById('raceStatus');
        const progressDisplay = document.getElementById('participantProgress');

        if (scoreDisplay) scoreDisplay.textContent = this.score;

        if (raceStatus && this.gameEnded && this.winner) {
            if (this.winner.type === 'player') {
                raceStatus.innerHTML = '🏆 VICTORY!';
                raceStatus.style.background = 'rgba(76, 175, 80, 0.3)';
            } else {
                raceStatus.innerHTML = '💔 Defeat...';
                raceStatus.style.background = 'rgba(244, 67, 54, 0.3)';
            }
        }

        if (progressDisplay) {
            const sortedParticipants = [...this.participants]
                .filter(p => p.isAlive || p.stunTimer > 0)
                .sort((a, b) => b.progress - a.progress);
            
            let progressHTML = '<div style="font-size: 11px;">';
            sortedParticipants.forEach((participant, index) => {
                const name = participant.type === 'player' ? 'You' : participant.entity.name;
                const progress = Math.floor((participant.progress / (this.config.mapSize - 1)) * 100);
                const status = participant.stunTimer > 0 ? '😵' : (participant.isAlive ? '🏃' : '💀');
                const position = index + 1;
                
                let color = '#fff';
                if (participant.type === 'player') color = '#4CAF50';
                else if (index === 0 && participant.type === 'npc') color = '#FF9800';
                
                progressHTML += `<div style="color: ${color}; margin-bottom: 2px; padding: 2px 4px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                    ${position}° ${name}: ${progress}% ${status}
                </div>`;
            });
            progressHTML += '</div>';
            progressDisplay.innerHTML = progressHTML;
        }
    }

    onUpdate(deltaTime) {
        this.updateWave(deltaTime);
        this.checkCollisions();
        this.updateUI();
    }

    onCleanup() {
        this.scoreObjects.forEach(scoreObj => {
            this.game.scene.remove(scoreObj.mesh);
            scoreObj.mesh.geometry.dispose();
            scoreObj.mesh.material.dispose();
        });
        this.scoreObjects.clear();
        
        // Reset NPC behavior
        this.participants.forEach(participant => {
            if (participant.type === 'npc') {
                const npc = participant.entity;
                npc.isPatrolling = true;
                npc.isInteractable = true;
            }
        });
    }
}