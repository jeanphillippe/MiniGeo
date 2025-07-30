class MinigameManager {
    constructor(game) {
        this.game = game;
        this.activeMinigame = null;
        this.minigameRegistry = {};
        this.originalNPCStates = new Map();
        this.originalPlayerState = null;
        this.loadedModules = new Set();
        
        // Mobile-friendly timing
        this.lastFrameTime = performance.now();
        this.deltaTime = 0;
    }

    // Register a minigame class (can be called by external modules)
    registerMinigame(name, minigameClass) {
        this.minigameRegistry[name] = minigameClass;
        console.log(`Minigame '${name}' registered`);
    }

    // Load a minigame module dynamically
    async loadMinigame(name) {
        if (this.loadedModules.has(name)) {
            return true; // Already loaded
        }

        try {
            // In a real implementation, you'd load from separate files
            // For now, we'll check if the class exists in window scope
            if (name === 'terrain_wave_cross' && typeof TerrainWaveCross !== 'undefined') {
                this.registerMinigame(name, TerrainWaveCross);
                this.loadedModules.add(name);
                return true;
            }
            
            console.error(`Minigame module '${name}' not found`);
            return false;
        } catch (error) {
            console.error(`Failed to load minigame '${name}':`, error);
            return false;
        }
    }

    async startMinigame(name, config = {}) {
        if (this.activeMinigame) {
            console.warn('Minigame already active, ending current one');
            this.endMinigame();
        }
        
        // Try to load the minigame if not already loaded
        const loaded = await this.loadMinigame(name);
        if (!loaded) {
            return false;
        }
        
        const MinigameClass = this.minigameRegistry[name];
        if (!MinigameClass) {
            console.error(`Minigame '${name}' not found in registry`);
            return false;
        }
        
        this.saveGameState();
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
        
        if (this.game.player) {
            this.originalPlayerState = {
                pos: { ...this.game.player.pos },
                path: [...this.game.player.path],
                speed: this.game.player.speed
            };
        }
        
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
        
        this.originalInteractables = [...this.game.interactables];
        this.game.interactables = [];
        
        if (this.game.activeTooltip) {
            this.game.hideTooltip();
        }
    }

    restoreGameState() {
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
        
        if (this.game.player && this.originalPlayerState) {
            this.game.player.pos = { ...this.originalPlayerState.pos };
            this.game.player.setPosition(this.originalPlayerState.pos.x, this.originalPlayerState.pos.z);
            this.game.player.path = [];
            this.game.player.speed = this.originalPlayerState.speed;
        }
        
        if (this.originalStaticObjects) {
            this.originalStaticObjects.forEach(({ object, visible }) => {
                if (object.sprite) {
                    object.sprite.visible = visible;
                }
            });
            this.originalStaticObjects = null;
        }
        
        if (this.originalInteractables) {
            this.game.interactables = this.originalInteractables;
            this.originalInteractables = null;
        }
    }

    // Mobile-optimized update with consistent timing
    update() {
        const currentTime = performance.now();
        this.deltaTime = Math.min(currentTime - this.lastFrameTime, 33.33); // Cap at ~30fps for stability
        this.lastFrameTime = currentTime;
        
        if (this.activeMinigame) {
            this.activeMinigame.update(this.deltaTime);
        }
    }

    // Get list of available minigames
    getAvailableMinigames() {
        return Object.keys(this.minigameRegistry);
    }

    // Check if a minigame is loaded
    isMinigameLoaded(name) {
        return this.loadedModules.has(name);
    }
}

// =============================================================================
// BASE MINIGAME CLASS - Shared functionality for all minigames
// =============================================================================

class BaseMinigame {
    constructor(game, manager, config) {
        this.game = game;
        this.manager = manager;
        this.config = { ...this.getDefaultConfig(), ...config };
        this.isActive = false;
        this.originalTerrain = new Map();
        this.uiElements = [];
        
        // Mobile-friendly timing
        this.lastUpdateTime = 0;
        this.frameCount = 0;
    }

    getDefaultConfig() {
        return {};
    }

    start() {
        this.isActive = true;
        this.lastUpdateTime = performance.now();
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
        // Override in child classes
    }

    cleanupUI() {
        this.uiElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.uiElements = [];
    }

    // Terrain management utilities
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

    // UI creation helper
    createUI(id, styles, content) {
        const element = document.createElement('div');
        element.id = id;
        element.style.cssText = styles;
        element.innerHTML = content;
        document.body.appendChild(element);
        this.uiElements.push(element);
        return element;
    }

    // Mobile-optimized update with frame limiting
    update(deltaTime) {
        if (!this.isActive) return;
        
        const currentTime = performance.now();
        const timeSinceLastUpdate = currentTime - this.lastUpdateTime;
        
        // Limit updates to 60fps max for mobile performance
        if (timeSinceLastUpdate < 16.67) return;
        
        this.lastUpdateTime = currentTime;
        this.frameCount++;
        
        this.onUpdate(deltaTime);
    }

    // Override these in child classes
    initializeMinigame() {}
    onUpdate(deltaTime) {}
    onCleanup() {}
}
document.head.append(Object.assign(document.createElement('script'), {src: 'minigame-terrain_wave_cross.js'}));

// =============================================================================
// INITIALIZATION - Mobile-optimized
// =============================================================================

(function() {
    const initMinigames = () => {
        if (typeof game !== 'undefined' && game.terrain) {
            game.minigameManager = new MinigameManager(game);
            
            // Mobile-optimized game loop integration
            const originalUpdate = game.update;
            game.update = function() {
                originalUpdate.call(this);
                if (this.minigameManager) {
                    this.minigameManager.update();
                }
            };
            
            // Add minigame to Elena's conversations
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
                
                // Extend Elena's executeAction to handle minigames
                const originalExecuteAction = elena.executeAction;
                elena.executeAction = function(action) {
                    if (action.type === 'startMinigame') {
                        game.minigameManager.startMinigame(action.minigame);
                        return;
                    }
                    originalExecuteAction.call(this, action);
                };
            }
            
            console.log('Modular Minigame System initialized - Mobile optimized');
            console.log('Available minigames:', game.minigameManager.getAvailableMinigames());
        } else {
            setTimeout(initMinigames, 100);
        }
    };

    // Ensure proper initialization timing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMinigames);
    } else {
        initMinigames();
    }
})();