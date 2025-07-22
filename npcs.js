// npcs.js - Include this file after your Player class

class NPC extends Player {
    constructor(game, spriteRow, startX, startZ) {
        super(game);
        this.spriteRow = spriteRow;
        this.isNPC = true;
        this.patrolIndex = 0;
        this.startX = startX;
        this.startZ = startZ;
        this.patrolPath = this.generateCirclePath(startX, startZ);
        
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
        
        // Delay patrol start to ensure proper positioning
        setTimeout(() => this.startPatrol(), 1000);
    }
    
    generateCirclePath(centerX, centerZ) {
        return [
            {x: centerX+1, z: centerZ-1}, {x: centerX+1, z: centerZ}, {x: centerX+1, z: centerZ+1},
            {x: centerX, z: centerZ+1}, {x: centerX-1, z: centerZ+1}, {x: centerX-1, z: centerZ},
            {x: centerX-1, z: centerZ-1}, {x: centerX, z: centerZ-1}
        ];
    }
    
    startPatrol() {
        if (this.patrolPath.length === 0) return;
        const target = this.patrolPath[this.patrolIndex];
        this.findPath(this.pos, target, path => {
            this.path = path;
            this.progress = 0;
        });
    }
    
    update() {
        super.update();
        if (this.path.length === 0 && this.patrolPath.length > 0) {
            this.patrolIndex = (this.patrolIndex + 1) % this.patrolPath.length;
            setTimeout(() => this.startPatrol(), 500);
        }
    }
    
    initInput() {} // NPCs don't respond to clicks
}

// Auto-initialize NPCs when file is included
(function() {
    // Wait for game to be available
    const initNPCs = () => {
        if (typeof game !== 'undefined' && game.terrain && game.scene) {
            const npc1 = new NPC(game, 2, 12, 5); // Row 3, position (2,2) 
            const npc2 = new NPC(game, 3, 7, 11); // Row 5, position (7,7)
            
            game.npcs = [npc1, npc2];
            
            console.log('NPCs created at positions:', npc1.pos, npc2.pos);
            
            // Hook into existing update loop
            if (game.update) {
                const originalUpdate = game.update;
                game.update = function() {
                    originalUpdate.call(this);
                    game.npcs.forEach(npc => npc.update());
                };
            }
            
            console.log('NPCs initialized');
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
