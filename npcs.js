// npcs.js - Enhanced with multiple patrol route types

class NPC extends Player {
    constructor(game, spriteRow, startX, startZ, spawnDelay = 0, patrolType = 'circle', idleFrame = 0) {
        super(game);
        this.spriteRow = spriteRow;
        this.isNPC = true;
        this.patrolIndex = 0;
        this.startX = startX;
        this.startZ = startZ;
        this.patrolType = patrolType;
        this.patrolPath = patrolType !== 'none' ? this.generatePatrolPath(patrolType, startX, startZ) : [];
        this.isPatrolling = patrolType !== 'none';
        this.waitTime = 0;
        this.maxWaitTime = 1500 + Math.random() * 1000;
        
        this.speed = 0.03 + Math.random() * 0.015;
        
        this.animations = {
            idle: { 
                frames: [{x: idleFrame * 64, y: spriteRow * 64}], 
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
        
        this.pos = { x: startX, z: startZ };
        this.setPosition(startX, startZ);
        
        // Only start patrol if patrol type is not 'none'
        if (this.isPatrolling) {
            setTimeout(() => {
                this.startPatrol();
            }, 1000 + spawnDelay);
        }
    }
    
    generatePatrolPath(type, centerX, centerZ) {
        switch(type) {
            case 'none':
                return [];
            case 'circle':
                return this.generateCirclePath(centerX, centerZ);
            case 'square':
                return this.generateSquarePath(centerX, centerZ);
            case 'line':
                return this.generateLinePath(centerX, centerZ);
            case 'random':
                return this.generateRandomPath(centerX, centerZ);
            case 'figure8':
                return this.generateFigure8Path(centerX, centerZ);
            default:
                return this.generateCirclePath(centerX, centerZ);
        }
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
    
    generateSquarePath(centerX, centerZ) {
        return [
            {x: centerX-2, z: centerZ-2},
            {x: centerX+2, z: centerZ-2},
            {x: centerX+2, z: centerZ+2},
            {x: centerX-2, z: centerZ+2}
        ];
    }
    
    generateLinePath(centerX, centerZ) {
        return [
            {x: centerX-3, z: centerZ},
            {x: centerX+3, z: centerZ},
            {x: centerX, z: centerZ},
            {x: centerX, z: centerZ-2},
            {x: centerX, z: centerZ+2}
        ];
    }
    
     generateRandomPath(centerX, centerZ) {
        const points = [];
        for(let i = 0; i < 5; i++) {
            points.push({
                x: Math.floor(centerX + (Math.random() - 0.5) * 6),
                z: Math.floor(centerZ + (Math.random() - 0.5) * 6)
            });
        }
        return points;
    }
    
    generateFigure8Path(centerX, centerZ) {
        return [
            {x: centerX, z: centerZ-2},
            {x: centerX+1, z: centerZ-1},
            {x: centerX, z: centerZ},
            {x: centerX-1, z: centerZ+1},
            {x: centerX, z: centerZ+2},
            {x: centerX+1, z: centerZ+1},
            {x: centerX, z: centerZ},
            {x: centerX-1, z: centerZ-1}
        ];
    }
    
    startPatrol() {
        if (!this.isPatrolling || this.patrolPath.length === 0) return;
        
        const target = this.patrolPath[this.patrolIndex];
        this.findPath(this.pos, target, path => {
            this.path = path;
            this.progress = 0;
            this.waitTime = 0;
        });
    }
    
    update() {
        if (!this.isPatrolling) return;
        
        if (this.path.length > 0) {
            super.update();
            return;
        }
        
        if (this.patrolPath.length > 0) {
            this.waitTime += 30;
            
            if (this.waitTime >= this.maxWaitTime) {
                this.patrolIndex = (this.patrolIndex + 1) % this.patrolPath.length;
                this.maxWaitTime = 1500 + Math.random() * 1000;
                this.startPatrol();
            } else {
                if (this.animationState !== 'idle') {
                    this.animationState = 'idle';
                    this.animationFrame = 0;
                    this.animationTime = 0;
                }
                this.updateAnimation();
            }
        }
    }
    
    initInput() {}
}

// Usage examples with different patrol types
(function() {
    const initNPCs = () => {
        if (typeof game !== 'undefined' && game.terrain && game.scene) {
            // Create NPCs with different patrol routes and idle frames
            // NPC Configuration: [layer, x, y, delay, patrolType, frame]
            // layer: render layer (0-4)
            // x, y: starting position coordinates
            // delay: movement delay in milliseconds
            // patrolType: 'circle', 'square', 'line', 'random', 'none'
            // frame: sprite frame index
            const npcConfigs = [
                [0, 5, 5, 2000, 'circle', 0],      
                [2, 9, 5, 2000, 'none', 0],      
                [3, 5, 5, 2000, 'none', 1],      
                [4, 14, 2, 0, 'random', 0],      
                [4, 7, 11, 3000, 'circle', 0],   
            ];

            game.npcs = npcConfigs.map(config => new NPC(game, ...config));

            console.log('NPCs created with patrol types and idle frames:');
            game.npcs.forEach((npc, i) => {
                console.log(`NPC${i+1}: ${npc.patrolType} patrol, idle frame ${npc.animations.idle.frames[0].x/64}`);
            });
            
            if (game.update) {
                const originalUpdate = game.update;
                game.update = function() {
                    originalUpdate.call(this);
                    game.npcs.forEach(npc => npc.update());
                };
            }
            
            console.log('NPCs initialized with multiple patrol routes');
        } else {
            setTimeout(initNPCs, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNPCs);
    } else {
        initNPCs();
    }
})();
