class NPC extends Player{
    constructor(game,spriteRow,startX,startZ,spawnDelay=0,patrolType='circle',idleFrame=0,name=''){
        super(game);
        this.spriteRow=spriteRow;
        this.isNPC=!0;
        this.patrolIndex=0;
        this.startX=startX;
        this.startZ=startZ;
        this.patrolType=patrolType;
        this.patrolPath=patrolType!=='none'?this.generatePatrolPath(patrolType,startX,startZ):[];
        this.isPatrolling=patrolType!=='none';
        this.waitTime=0;
        this.maxWaitTime=1500+Math.random()*1000;
        this.isInteractable=!0;
        this.message=this.generateRandomMessage();
        this.interactionType='npc';
        this.speed=0.03+Math.random()*0.015;
        this.name=name||this.generateRandomName(); // Add name property
        
        this.animations={
            idle:{frames:[{x:idleFrame*64,y:spriteRow*64}],frameCount:1,loop:!0},
            walking:{frames:[{x:64,y:spriteRow*64},{x:128,y:spriteRow*64},{x:192,y:spriteRow*64},{x:256,y:spriteRow*64}],frameCount:4,loop:!0}
        };
        
        this.pos={x:startX,z:startZ};
        this.setPosition(startX,startZ);
        
        if(this.isPatrolling){
            setTimeout(()=>{
                this.startPatrol()
            },1000+spawnDelay)
        }
    }

    generateRandomName(){
        const names = [
            "Elder Marcus", "Merchant Sara", "Guard Tom", 
            "Wise Elena", "Trader Jack", "Hermit Ben",
            "Priestess Anna", "Scout Mike", "Healer Rose"
        ];
        return names[Math.floor(Math.random() * names.length)];
    }

    generateRandomMessage(){
        const messages=[
            "Hello, traveler! Care to trade?",
            "I've seen strange lights in the forest...",
            "The old temple holds many secrets.",
            "Beware of the shadows at night!",
            "I have information about hidden treasures.",
            "The path ahead is dangerous, be careful!",
            "Have you heard the legends of this place?",
            "I can offer you guidance, for a price.",
            "These lands hold ancient mysteries."
        ];
        return messages[Math.floor(Math.random()*messages.length)]
    }

    generatePatrolPath(type,centerX,centerZ){
        switch(type){
            case 'none':return[];
            case 'circle':return this.generateCirclePath(centerX,centerZ);
            case 'square':return this.generateSquarePath(centerX,centerZ);
            case 'line':return this.generateLinePath(centerX,centerZ);
            case 'random':return this.generateRandomPath(centerX,centerZ);
            case 'figure8':return this.generateFigure8Path(centerX,centerZ);
            default:return this.generateCirclePath(centerX,centerZ)
        }
    }

    generateCirclePath(centerX,centerZ){
        return[
            {x:centerX+1,z:centerZ-1},{x:centerX+1,z:centerZ},{x:centerX+1,z:centerZ+1},
            {x:centerX,z:centerZ+1},{x:centerX-1,z:centerZ+1},{x:centerX-1,z:centerZ},
            {x:centerX-1,z:centerZ-1},{x:centerX,z:centerZ-1}
        ]
    }

    generateSquarePath(centerX,centerZ){
        return[
            {x:centerX-2,z:centerZ-2},{x:centerX+2,z:centerZ-2},
            {x:centerX+2,z:centerZ+2},{x:centerX-2,z:centerZ+2}
        ]
    }

    generateLinePath(centerX,centerZ){
        return[
            {x:centerX-3,z:centerZ},{x:centerX+3,z:centerZ},
            {x:centerX,z:centerZ},{x:centerX,z:centerZ-2},{x:centerX,z:centerZ+2}
        ]
    }

    generateRandomPath(centerX,centerZ){
        const points=[];
        for(let i=0;i<5;i++){
            points.push({
                x:Math.floor(centerX+(Math.random()-0.5)*6),
                z:Math.floor(centerZ+(Math.random()-0.5)*6)
            })
        }
        return points
    }

    generateFigure8Path(centerX,centerZ){
        return[
            {x:centerX,z:centerZ-2},{x:centerX+1,z:centerZ-1},{x:centerX,z:centerZ},
            {x:centerX-1,z:centerZ+1},{x:centerX,z:centerZ+2},{x:centerX+1,z:centerZ+1},
            {x:centerX,z:centerZ},{x:centerX-1,z:centerZ-1}
        ]
    }

    startPatrol(){
        if(!this.isPatrolling||this.patrolPath.length===0)return;
        const target=this.patrolPath[this.patrolIndex];
        this.findPath(this.pos,target,path=>{
            this.path=path;
            this.progress=0;
            this.waitTime=0
        })
    }
isPlayerNearby(radius = 2) {
    if (!this.game.player || !this.game.player.pos) return false;
    const dx = this.pos.x - this.game.player.pos.x;
    const dz = this.pos.z - this.game.player.pos.z;
    return Math.sqrt(dx * dx + dz * dz) < radius;
}

    update(){
        if(!this.isPatrolling)return;
        
          if (this.isPlayerNearby()) {
        if (this.animationState !== 'idle') {
            this.animationState = 'idle';
            this.animationFrame = 0;
            this.animationTime = 0;
        }
        this.updateAnimation();
        return; // Stop moving if player is near
    }
    
        if(this.path.length>0){
            super.update();
            return
        }
        
        if(this.patrolPath.length>0){
            this.waitTime+=30;
            if(this.waitTime>=this.maxWaitTime){
                this.patrolIndex=(this.patrolIndex+1)%this.patrolPath.length;
                this.maxWaitTime=1500+Math.random()*1000;
                this.startPatrol()
            }else{
                if(this.animationState!=='idle'){
                    this.animationState='idle';
                    this.animationFrame=0;
                    this.animationTime=0
                }
                this.updateAnimation()
            }
        }
    }

    initInput(){}
}

(function(){
    const initNPCs=()=>{
        if(typeof game!=='undefined'&&game.terrain&&game.scene){
            const npcConfigs=[
                [0,5,5,2000,'circle',0,'Elder Marcus'],
                [2,9,5,2000,'none',0,'Merchant Sara'],
                [3,5,5,2000,'none',1,'Wise Elena'],
                [4,14,2,0,'random',0,'Scout Mike'],
                [4,7,11,3000,'circle',0,'Healer Rose'],
            ];
            
            game.npcs=npcConfigs.map(config=>new NPC(game,...config));
            
            console.log('NPCs created with names and patrol types:');
            game.npcs.forEach((npc,i)=>{
                console.log(`${npc.name}: ${npc.patrolType} patrol, idle frame ${npc.animations.idle.frames[0].x/64}`)
            });
            
            if(game.update){
                const originalUpdate=game.update;
                game.update=function(){
                    originalUpdate.call(this);
                    game.npcs.forEach(npc=>npc.update())
                }
            }
            
            console.log('NPCs initialized with names and interaction support')
        }else{
            setTimeout(initNPCs,100)
        }
    };
    
    if(document.readyState==='loading'){
        document.addEventListener('DOMContentLoaded',initNPCs)
    }else{
        initNPCs()
    }
})()
