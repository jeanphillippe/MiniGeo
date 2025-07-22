// npcs.js - Include this file after your Player class

class NPC extends Player {
    constructor(game, spriteRow, startX, startZ, spawnDelay = 0) {
        super(game);
        this.spriteRow = spriteRow;
        this.isNPC = true;
        this.patrolIndex = 0;
        this.startX = startX;
        this.startZ = startZ;
        this.patrolPath = this.generateCirclePath(startX, startZ);
        this.isPatrolling = false;
        this.waitTime = 0;
        this.maxWaitTime = 1500 + Math.random() * 1000; // Random wait between 1.5-2.5 seconds
        
        // Make NPCs move slower than the player for more natural movement
        this.speed = 0.03 + Math.random() * 0.015; // Random speed between 0.03-0.045 (slower than player's 0.05)
        
        // Override sprite row for animations
        this.animations = {
            idle: { 
                frames: [{x: 0, y: spriteRow * 64}], 
                frameCount: 1,
                loop: true 
            },
            walking: { 
                frames: [
                    {x: 64, y: spriteRow * 64},
                    {x: 128, y: spriteRow * 64},
                    {x: 192, y: spriteRow * 64},
                    {x: 256, y: spriteRow * 64}
                ],
                frameCount: 4,
                loop: true 
            }
        };
        
        // Set initial position explicitly
        this.pos = { x: startX, z: startZ };
        this.setPosition(startX, startZ);
        
        // Delay patrol start to ensure proper positioning and stagger NPCs
        setTimeout(() => {
            this.isPatrolling = true;
            this.startPatrol();
        }, 1000 + spawnDelay);
    }
    
    generateCirclePath(centerX, centerZ) {
        return [
            {x: centerX+1, z: centerZ-1}, 
            {x: centerX+1, z: centerZ}, 
            {x: centerX+1, z: centerZ+1},
            {x: centerX, z: centerZ+1}, 
            {x: centerX-1, z: centerZ+1}, 
            {x: centerX-1, z: centerZ},
            {x: centerX-1, z: centerZ-1}, 
            {x: centerX, z: centerZ-1}
        ];
    }
    
    startPatrol() {
        if (!this.isPatrolling || this.patrolPath.length === 0) return;
        
        const target = this.patrolPath[this.patrolIndex];
        this.findPath(this.pos, target, path => {
            this.path = path;
            this.progress = 0;
            this.waitTime = 0; // Reset wait time when starting new path
        });
    }
    
    update() {
        if (!this.isPatrolling) return;
        
        // If we have a path to follow, move along it
        if (this.path.length > 0) {
            super.update(); // Call parent update to handle movement and animation
            return;
        }
        
        // If we're not moving and have a patrol path, wait then move to next point
        if (this.patrolPath.length > 0) {
            this.waitTime += 30; // Assuming ~60fps (16ms per frame)
            
            if (this.waitTime >= this.maxWaitTime) {
                // Move to next patrol point
                this.patrolIndex = (this.patrolIndex + 1) % this.patrolPath.length;
                
                // Add some randomization to make movement feel more natural
                this.maxWaitTime = 1500 + Math.random() * 1000; // 1.5-2.5 seconds
                
                this.startPatrol();
            } else {
                // Still waiting - make sure we're in idle state
                if (this.animationState !== 'idle') {
                    this.animationState = 'idle';
                    this.animationFrame = 0;
                    this.animationTime = 0;
                }
                this.updateAnimation();
            }
        }
    }
    
    initInput() {} // NPCs don't respond to clicks
}

// Auto-initialize NPCs when file is included
(function() {
    // Wait for game to be available
    const initNPCs = () => {
        if (typeof game !== 'undefined' && game.terrain && game.scene) {
            // Create NPCs with staggered spawn delays (in milliseconds)
            const npc1 = new NPC(game, 2, 12, 5, 0);     // Row 3, position (12,5), no delay
            const npc3 = new NPC(game, 3, 5, 5, 1000);     // Row 3, position (12,5), no delay
            const npc2 = new NPC(game, 1, 7, 11, 2000);  // Row 4, position (7,11), 2 second delay
            const npc4 = new NPC(game, 4, 9, 5, 1000);     // Row 3, position (12,5), no delay
            
            game.npcs = [npc1, npc2];
            
            console.log('NPCs created at positions:', npc1.pos, npc2.pos);
            console.log('NPC spawn delays: 0ms, 2000ms');
            
            // Hook into existing update loop
            if (game.update) {
                const originalUpdate = game.update;
                game.update = function() {
                    originalUpdate.call(this);
                    game.npcs.forEach(npc => npc.update());
                };
            }
            
            console.log('NPCs initialized with improved movement timing');
        } else {
            setTimeout(initNPCs, 100); // Retry in 100ms
        }
    };
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNPCs);
    } else {
        initNPCs();
    }
})();
