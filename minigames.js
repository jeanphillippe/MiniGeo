// minigames.js - Spirit Chase Tag Implementation

class MinigameManager {
    constructor(game) {
        this.game = game;
        this.currentMinigame = null;
        this.isActive = false;
    }

    startSpiritChaseTag(gameMode = 'chase') {
        if (this.currentMinigame) {
            this.endCurrentMinigame();
        }
        
        this.currentMinigame = new SpiritChaserGame(this.game, gameMode);
        this.isActive = true;
        this.currentMinigame.start();
    }

    endCurrentMinigame() {
        if (this.currentMinigame) {
            this.currentMinigame.end();
            this.currentMinigame = null;
            this.isActive = false;
        }
    }

    update() {
        if (this.currentMinigame && this.isActive) {
            this.currentMinigame.update();
        }
    }
}

class SpiritChaserGame {
    constructor(game, mode = 'chase') {
        this.game = game;
        this.mode = mode; // 'chase' or 'evade'
        this.spirits = [];
        this.gameArea = { minX: 3, maxX: 13, minZ: 3, maxZ: 13 }; // Bounded area
        this.gameTime = 30000; // 30 seconds
        this.remainingTime = this.gameTime;
        this.score = 0;
        this.isRunning = false;
        this.gameStartTime = 0;
        
        // Game settings
        this.spiritCount = this.mode === 'chase' ? 4 : 3;
        this.spiritSpeed = this.mode === 'chase' ? 0.03 : 0.035;
        this.tagDistance = 1.2;
        
        this.uiElements = {};
        this.lastUpdateTime = 0;
        this.spiritUpdateInterval = 200; // Update spirit AI every 200ms
    }

    start() {
        console.log(`Starting Spirit Chase Tag in ${this.mode} mode`);
        
        // Save initial camera state and set game camera
        this.game.cameraSystem.saveInitialCameraState();
        this.game.cameraSystem.setCameraPreset('overview', true, () => {
            this.setupGameArea();
            this.spawnSpirits();
            this.createUI();
            this.isRunning = true;
            this.gameStartTime = Date.now();
            this.showGameInstructions();
        });
    }

    setupGameArea() {
        // Create visual boundary markers
        this.boundaryMarkers = [];
        const boundaryPositions = [
            // Corners
            {x: this.gameArea.minX, z: this.gameArea.minZ},
            {x: this.gameArea.maxX, z: this.gameArea.minZ},
            {x: this.gameArea.maxX, z: this.gameArea.maxZ},
            {x: this.gameArea.minX, z: this.gameArea.maxZ},
            // Mid points for visibility
            {x: (this.gameArea.minX + this.gameArea.maxX) / 2, z: this.gameArea.minZ},
            {x: (this.gameArea.minX + this.gameArea.maxX) / 2, z: this.gameArea.maxZ},
            {x: this.gameArea.minX, z: (this.gameArea.minZ + this.gameArea.maxZ) / 2},
            {x: this.gameArea.maxX, z: (this.gameArea.minZ + this.gameArea.maxZ) / 2}
        ];

        boundaryPositions.forEach(pos => {
            const tile = this.game.terrain.getTile(Math.floor(pos.x), Math.floor(pos.z));
            if (tile) {
                const geometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
                const material = new THREE.MeshLambertMaterial({
                    color: 0x00ff00,
                    emissive: 0x002200,
                    transparent: true,
                    opacity: 0.7
                });
                const marker = new THREE.Mesh(geometry, material);
                marker.position.set(
                    tile.mesh.position.x,
                    this.game.terrain.heightScales[tile.height] + 1,
                    tile.mesh.position.z
                );
                this.game.scene.add(marker);
                this.boundaryMarkers.push(marker);
            }
        });
    }

    spawnSpirits() {
        for (let i = 0; i < this.spiritCount; i++) {
            const spirit = new SpiritNPC(this.game, this, i);
            this.spirits.push(spirit);
        }
    }

    createUI() {
        // Create minigame UI container
        this.uiContainer = document.createElement('div');
        this.uiContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 16px;
            z-index: 100;
            min-width: 200px;
        `;

        // Game mode display
        const modeText = this.mode === 'chase' ? 'TAG THE SPIRITS!' : 'AVOID THE SPIRITS!';
        const modeColor = this.mode === 'chase' ? '#4fc3f7' : '#f9844a';
        
        this.uiContainer.innerHTML = `
            <div style="color: ${modeColor}; font-weight: bold; margin-bottom: 10px;">
                ${modeText}
            </div>
            <div>Time: <span id="minigame-time">30</span>s</div>
            <div>Score: <span id="minigame-score">0</span></div>
            <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">
                ${this.mode === 'chase' ? 'Get close to spirits to tag them!' : 'Stay away from the spirits!'}
            </div>
            <div style="font-size: 12px; opacity: 0.8;">
                Stay within the green boundary!
            </div>
        `;

        document.body.appendChild(this.uiContainer);
        
        this.uiElements.time = document.getElementById('minigame-time');
        this.uiElements.score = document.getElementById('minigame-score');
    }

    showGameInstructions() {
        const instructions = this.mode === 'chase' 
            ? 'Tag all the spirits by getting close to them! They will try to run away.'
            : 'Avoid the spirits! They will chase you. Survive as long as possible.';
            
        this.game.showInteractionMessage(`Spirit Chase Tag: ${instructions}`);
    }

    update() {
        if (!this.isRunning) return;

        const currentTime = Date.now();
        this.remainingTime = Math.max(0, this.gameTime - (currentTime - this.gameStartTime));

        // Update UI
        this.uiElements.time.textContent = Math.ceil(this.remainingTime / 1000);
        this.uiElements.score.textContent = this.score;

        // Check boundary violations for player
        this.checkPlayerBoundary();

        // Update spirits AI less frequently for performance
        if (currentTime - this.lastUpdateTime > this.spiritUpdateInterval) {
            this.spirits.forEach(spirit => spirit.updateAI());
            this.lastUpdateTime = currentTime;
        }

        // Check for tags
        this.checkTags();

        // Check win/lose conditions
        this.checkGameEnd();
    }

    checkPlayerBoundary() {
        const player = this.game.player;
        if (!player) return;

        const pos = player.pos;
        let outOfBounds = false;

        if (pos.x < this.gameArea.minX || pos.x > this.gameArea.maxX ||
            pos.z < this.gameArea.minZ || pos.z > this.gameArea.maxZ) {
            outOfBounds = true;
        }

        if (outOfBounds) {
            // Push player back into bounds
            const newX = Math.max(this.gameArea.minX, Math.min(this.gameArea.maxX, pos.x));
            const newZ = Math.max(this.gameArea.minZ, Math.min(this.gameArea.maxZ, pos.z));
            
            // Find nearest valid tile within bounds
            if (this.game.terrain.isValidCoordinate(Math.floor(newX), Math.floor(newZ))) {
                player.setPosition(Math.floor(newX), Math.floor(newZ));
            }
            
            // Small penalty
            this.score = Math.max(0, this.score - 5);
        }
    }

    checkTags() {
        const playerPos = this.game.player.pos;
        
        this.spirits.forEach((spirit, index) => {
            if (spirit.isTagged) return;
            
            const distance = Math.sqrt(
                Math.pow(playerPos.x - spirit.pos.x, 2) + 
                Math.pow(playerPos.z - spirit.pos.z, 2)
            );

            if (distance <= this.tagDistance) {
                if (this.mode === 'chase') {
                    // Player tags spirit
                    this.tagSpirit(spirit, index);
                } else {
                    // Spirit catches player
                    this.playerCaught();
                }
            }
        });
    }

    tagSpirit(spirit, index) {
        spirit.isTagged = true;
        spirit.onTagged();
        this.score += 100;
        
        // Visual feedback
        this.game.showInteractionMessage('Tagged!');
        
        console.log(`Spirit ${index} tagged! Score: ${this.score}`);
    }

    playerCaught() {
        // End game immediately in evade mode
        this.score = Math.max(0, this.score - 50);
        this.endGame('caught');
    }

    checkGameEnd() {
        if (this.remainingTime <= 0) {
            this.endGame('timeout');
        } else if (this.mode === 'chase') {
            // Check if all spirits are tagged
            const allTagged = this.spirits.every(spirit => spirit.isTagged);
            if (allTagged) {
                this.endGame('success');
            }
        } else {
            // In evade mode, add survival bonus
            this.score += 1;
        }
    }

    endGame(reason) {
        this.isRunning = false;
        
        let message = '';
        switch (reason) {
            case 'success':
                message = `Excellent! You tagged all spirits! Final Score: ${this.score}`;
                break;
            case 'timeout':
                if (this.mode === 'chase') {
                    message = `Time's up! You tagged ${this.spirits.filter(s => s.isTagged).length}/${this.spiritCount} spirits. Score: ${this.score}`;
                } else {
                    message = `Survived! Great evasion skills! Final Score: ${this.score}`;
                }
                break;
            case 'caught':
                message = `Caught! You survived ${Math.floor((this.gameTime - this.remainingTime) / 1000)} seconds. Score: ${this.score}`;
                break;
        }

        // Show results
        setTimeout(() => {
            this.game.showInteractionMessage(message);
            this.end();
        }, 500);
    }

    end() {
        console.log('Ending Spirit Chase Tag minigame');
        
        // Clean up spirits
        this.spirits.forEach(spirit => spirit.destroy());
        this.spirits = [];

        // Clean up boundary markers
        this.boundaryMarkers.forEach(marker => {
            this.game.scene.remove(marker);
            marker.geometry?.dispose();
            marker.material?.dispose();
        });
        this.boundaryMarkers = [];

        // Clean up UI
        if (this.uiContainer) {
            this.uiContainer.remove();
        }

        // Restore camera
        this.game.cameraSystem.restoreToInitialState(true, () => {
            console.log('Camera restored after minigame');
        });

        this.isRunning = false;
    }
}

class SpiritNPC extends NPC {
    constructor(game, minigameRef, spiritIndex) {
        // Create temporary NPC data
        const spiritId = `spirit_${spiritIndex}_${Date.now()}`;
        const tempData = {
            spriteRow: 6, // Use merchant sprite row for spirits
            position: minigameRef.getRandomSpawnPosition(),
            spawnDelay: 0,
            patrolType: 'none',
            idleFrame: 0,
            name: `Spirit ${spiritIndex + 1}`,
            conversations: [{ message: "", action: null }]
        };
        
        // Temporarily add to NPC_DATA
        NPC_DATA[spiritId] = tempData;
        
        super(game, spiritId);
        
        // Clean up temporary data
        delete NPC_DATA[spiritId];
        
        this.minigame = minigameRef;
        this.spiritIndex = spiritIndex;
        this.isTagged = false;
        this.isSpirit = true;
        this.isInteractable = false;
        this.targetUpdateInterval = 1000 + Math.random() * 1000; // 1-2 seconds
        this.lastTargetUpdate = 0;
        
        // Spirit-specific properties
        this.speed = minigameRef.spiritSpeed + (Math.random() * 0.01 - 0.005); // Slight speed variation
        this.fleeDistance = 3; // Distance to start fleeing from player
        this.panicSpeed = this.speed * 1.5; // Speed when panicking
        
        // Make sprite more ghostly
        if (this.sprite && this.sprite.material) {
            this.sprite.material.transparent = true;
            this.sprite.material.opacity = 0.8;
            this.sprite.material.emissive = new THREE.Color(0x002244);
        }
        
        console.log(`Spirit ${spiritIndex} spawned at (${this.pos.x}, ${this.pos.z})`);
    }

    updateAI() {
        if (this.isTagged || !this.minigame.isRunning) return;

        const currentTime = Date.now();
        const playerPos = this.game.player.pos;
        const distanceToPlayer = Math.sqrt(
            Math.pow(this.pos.x - playerPos.x, 2) + 
            Math.pow(this.pos.z - playerPos.z, 2)
        );

        // Choose behavior based on game mode and distance
        if (this.minigame.mode === 'chase') {
            this.chaseModeBehavior(playerPos, distanceToPlayer, currentTime);
        } else {
            this.evadeModeBehavior(playerPos, distanceToPlayer, currentTime);
        }
    }

    chaseModeBehavior(playerPos, distanceToPlayer, currentTime) {
        // In chase mode, spirits flee from the player
        if (distanceToPlayer <= this.fleeDistance) {
            // Flee from player
            this.fleeFromPlayer(playerPos);
        } else if (currentTime - this.lastTargetUpdate > this.targetUpdateInterval) {
            // Random movement when safe
            this.moveToRandomPosition();
            this.lastTargetUpdate = currentTime;
        }
    }

    evadeModeBehavior(playerPos, distanceToPlayer, currentTime) {
        // In evade mode, spirits chase the player
        if (distanceToPlayer > 2) {
            // Chase player
            this.chasePlayer(playerPos);
        } else if (currentTime - this.lastTargetUpdate > this.targetUpdateInterval) {
            // Move to intercept player if they're close
            this.interceptPlayer(playerPos);
            this.lastTargetUpdate = currentTime;
        }
    }

    fleeFromPlayer(playerPos) {
        // Calculate flee direction (away from player)
        const fleeX = this.pos.x + (this.pos.x - playerPos.x) * 2;
        const fleeZ = this.pos.z + (this.pos.z - playerPos.z) * 2;
        
        // Clamp to game bounds
        const target = this.clampToBounds(fleeX, fleeZ);
        
        this.speed = this.panicSpeed; // Move faster when fleeing
        this.moveToPosition(target);
    }

    chasePlayer(playerPos) {
        // Move towards player position
        this.speed = this.minigame.spiritSpeed;
        this.moveToPosition(playerPos);
    }

    interceptPlayer(playerPos) {
        // Try to predict where player is going and intercept
        const prediction = {
            x: playerPos.x + (Math.random() - 0.5) * 4,
            z: playerPos.z + (Math.random() - 0.5) * 4
        };
        
        const target = this.clampToBounds(prediction.x, prediction.z);
        this.moveToPosition(target);
    }

    moveToRandomPosition() {
        const bounds = this.minigame.gameArea;
        const target = {
            x: Math.floor(bounds.minX + Math.random() * (bounds.maxX - bounds.minX)),
            z: Math.floor(bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ))
        };
        
        this.speed = this.minigame.spiritSpeed;
        this.moveToPosition(target);
    }

    moveToPosition(target) {
        if (this.game.terrain.isValidCoordinate(target.x, target.z)) {
            this.findPath(this.pos, target, (path) => {
                this.path = path;
                this.progress = 0;
            });
        }
    }

    clampToBounds(x, z) {
        const bounds = this.minigame.gameArea;
        return {
            x: Math.max(bounds.minX, Math.min(bounds.maxX, Math.floor(x))),
            z: Math.max(bounds.minZ, Math.min(bounds.maxZ, Math.floor(z)))
        };
    }

    onTagged() {
        // Visual effect when tagged
        if (this.sprite && this.sprite.material) {
            this.sprite.material.opacity = 0.3;
            this.sprite.material.emissive = new THREE.Color(0x004400);
        }
        
        // Stop moving
        this.path = [];
        this.isPatrolling = false;
        
        console.log(`Spirit ${this.spiritIndex} was tagged!`);
    }

    destroy() {
        // Remove from scene
        if (this.sprite) {
            this.game.scene.remove(this.sprite);
            this.sprite.material?.dispose();
            this.sprite.geometry?.dispose();
        }
        
        // Remove from interactables if present
        this.game.interactables = this.game.interactables.filter(i => i.npcRef !== this);
        
        console.log(`Spirit ${this.spiritIndex} destroyed`);
    }
}

// Add helper method to SpiritChaserGame
SpiritChaserGame.prototype.getRandomSpawnPosition = function() {
    const bounds = this.gameArea;
    let attempts = 0;
    let position;
    
    do {
        position = {
            x: Math.floor(bounds.minX + Math.random() * (bounds.maxX - bounds.minX)),
            z: Math.floor(bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ))
        };
        attempts++;
    } while (attempts < 10 && this.game.terrain.getTile(position.x, position.z)?.height > 3);
    
    return position;
};

// Integration with Elena's conversation system
function initializeMinigames() {
    if (typeof game !== 'undefined' && game.terrain) {
        // Add minigame manager to game
        game.minigameManager = new MinigameManager(game);
        
        // Hook into game update loop
        if (game.update) {
            const originalUpdate = game.update;
            game.update = function() {
                originalUpdate.call(this);
                if (this.minigameManager) {
                    this.minigameManager.update();
                }
            };
        }
        
        // Update Elena's conversations to include minigame options
        if (game.npcs) {
            const elena = game.npcs.find(npc => npc.npcId === 'wise_elena');
            if (elena) {
                elena.conversations.push({
                    message: "Would you like to test your skills in the ancient Spirit Chase? I can summon spirits for you to compete against.",
                    requiresConfirmation: true,
                    confirmationMessage: "Chase Mode: Tag all the spirits before time runs out!",
                    confirmationAlternative: "Evade Mode: Avoid the spirits as long as possible!",
                    action: {
                        type: 'choice',
                        onSuccess: {
                            type: 'custom',
                            customAction: () => {
                                game.minigameManager.startSpiritChaseTag('chase');
                            }
                        },
                        onFailure: {
                            type: 'custom',
                            customAction: () => {
                                game.minigameManager.startSpiritChaseTag('evade');
                            }
                        }
                    }
                });
            }
        }
        
        console.log('Minigames initialized - Spirit Chase Tag ready!');
    } else {
        setTimeout(initializeMinigames, 100);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMinigames);
} else {
    initializeMinigames();
}
