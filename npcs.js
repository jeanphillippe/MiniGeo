// NPC Data Configuration
const NPC_DATA = {
  'elder_marcus': {
        spriteRow: 0,
        position: { x: 5, z: 5 },
        spawnDelay: 2000,
        patrolType: 'circle',
        idleFrame: 0,
        name: 'Elder Marcus',
        conversations: [
            {
                message: "Greetings, young traveler. Let me show you a better view of our lands...",
                requiresConfirmation: false, // Add this flag
    action: {type: 'move', target: {x: 12, z: 8}, speed: 0.05}
            },
            {
                message: "The ancient temple holds secrets... but first, prove your worth.",
                action: {
                        type: 'moveAndCamera',
                        target: { x: 7, z: 0 },
                        speed: 0.05,
                        cameraPreset: 'thirdPerson',
                        smooth: true
                    },
                requiresConfirmation: true, // Add this flag
                confirmationMessage: "Do you wish to follow me to the ancient temple? The path may be dangerous."
            },
            {
                message: "You followed me here. Good. The real treasure lies beneath the old oak.",
                action: {
                    type: 'camera',
                    preset: 'overview',
                requiresConfirmation: false, // Add this flag
                    smooth: true
                }
            }
        ]
    },
  'merchant_sara': {
    spriteRow: 6,
    position: {x: 9, z: 5},
    spawnDelay: 2000,
    patrolType: 'none',
    idleFrame: 0,
    name: 'Merchant Sara',
    conversations: [
      {
        message: "Welcome to my shop! I have the finest wares in the land.",
        action: null
      },
      {
        message: "Hmm, you look like someone who appreciates quality. Follow me to my secret stash.",
        action: {type: 'move', target: {x: 12, z: 8}, speed: 0.05}
      },
      {
        message: "Here are my rarest items. Choose wisely, traveler.",
        action: {
                    type: 'camera',
                    preset: 'overview',
                requiresConfirmation: false, // Add this flag
                    smooth: true
                }
      }
    ]
  },
  'merchant_mara': {
    spriteRow: 7,
    position: {x: 1, z: 3},
    spawnDelay: 2000,
    patrolType: 'none',
    idleFrame: 0,
    name: 'Merchant Mara',
    conversations: [
      {
        message: "Welcome to my shop! I have the finest wares in the land.",
        action: null
      },
      {
        message: "Hmm, you look like someone who appreciates quality. Follow me to my secret stash.",
        action: {type: 'move', target: {x: 12, z: 8}, speed: 0.05}
      },
      {
        message: "Here are my rarest items. Choose wisely, traveler.",
        action: {type: 'disappear', delay: 3000}
      }
    ]
  },
  'wise_elena': {
    spriteRow: 5,
    position: {x: 5, z: 5},
    spawnDelay: 2000,
    patrolType: 'none',
    idleFrame: 0,
    name: 'Wise Elena',
    conversations: [
      {
        message: "The spirits whisper of your arrival...",
        action: null
      },
      {
        message: "They tell me you seek knowledge. Come, let me show you the sacred grove.",
        action: {type: 'move', target: {x: 2, z: 2}, speed: 0.05}
      },
      {
        message: "This place holds ancient magic. Use it wisely.",
        action: {type: 'patrol', patrolType: 'circle'}
      }
    ]
  },
  'scout_mike': {
    spriteRow: 4,
    position: {x: 14, z: 2},
    spawnDelay: 0,
    patrolType: 'random',
    idleFrame: 0,
    name: 'Scout Mike',
    conversations: [
      {
        message: "I've been watching the perimeter. Strange movements in the eastern woods.",
        action: null
      },
      {
        message: "Come, I'll show you the patrol route. Stay close and stay quiet.",
        action: {type: 'move', target: {x: 10, z: 6}, speed: 0.05}
      },
      {
        message: "From here you can see the entire valley. Remember this vantage point.",
        action: {type: 'patrol', patrolType: 'random'}
      }
    ]
  },
  'healer_rose': {
    spriteRow: 7,
    position: {x: 7, z: 11},
    spawnDelay: 3000,
    patrolType: 'circle',
    idleFrame: 0,
    name: 'Healer Rose',
    conversations: [
      {
        message: "You look weary, traveler. Rest here a moment and let me tend to your wounds.",
        action: null
      },
      {
        message: "The healing herbs grow wild near the spring. Let me show you where to find them.",
        action: {type: 'move', target: {x: 4, z: 14}, speed: 0.05}
      },
      {
        message: "These plants will serve you well on your journey. May they keep you safe.",
        action: {type: 'patrol', patrolType: 'line'}
      }
    ]
  },
  'guard_tom': {
    spriteRow: 1,
    position: {x: 10, z: 10},
    spawnDelay: 1000,
    patrolType: 'square',
    idleFrame: 0,
    name: 'Guard Tom',
    conversations: [
      {
        message: "Halt! State your business in these lands.",
        action: null
      },
      {
        message: "Very well. But I must escort you to the checkpoint for verification.",
        action: {type: 'move', target: {x: 13, z: 13}, speed: 0.055}
      },
      {
        message: "You check out. But remember - I'll be watching.",
        action: {type: 'patrol', patrolType: 'square'}
      }
    ]
  },
  'trader_jack': {
    spriteRow: 2,
    position: {x: 3, z: 8},
    spawnDelay: 1500,
    patrolType: 'line',
    idleFrame: 0,
    name: 'Trader Jack',
    conversations: [
      {
        message: "Ah, a fellow traveler! I deal in rare goods and information.",
        action: null
      },
      {
        message: "I know of a hidden cache nearby. Care to make a deal?",
        action: {type: 'move', target: {x: 1, z: 5}, speed: 0.05}
      },
      {
        message: "Here's your share. May fortune favor your travels!",
        action: {type: 'disappear', delay: 2000}
      }
    ]
  },
  'trader_jill': {
    spriteRow: 3,
    position: {x: 13, z: 8},
    spawnDelay: 1500,
    patrolType: 'line',
    idleFrame: 0,
    name: 'Trader Jull',
    conversations: [
      {
        message: "Ah, a fellow traveler! I deal in rare goods and information.",
        action: null
      },
      {
        message: "I know of a hidden cache nearby. Care to make a deal?",
        action: {type: 'move', target: {x: 1, z: 5}, speed: 0.05}
      },
      {
        message: "Here's your share. May fortune favor your travels!",
        action: {type: 'disappear', delay: 2000}
      }
    ]
  }
};
const STATIC_OBJECT_TEMPLATES = {
    'statue_fish': {spriteRow: 8, spriteCol: 0, name: 'Ancient Statue'},
    'statue_dog': {spriteRow: 8, spriteCol: 1, name: 'Stone Monument'},
    'statue_turtle': {spriteRow: 8, spriteCol: 2, name: 'Mystic Pillar'},
    'house': {spriteRow: 8, spriteCol: 3, name: 'Guardian Statue'},
    'singlepine': {spriteRow: 8, spriteCol: 4, name: 'Guardian Statue'},
    'finishline': {spriteRow: 9, spriteCol: 0, name: 'Ancient Idol'},
    'forest_round': {spriteRow: 9, spriteCol: 1, name: 'Runed Obelisk'},
    'forest_pines': {spriteRow: 9, spriteCol: 2, name: 'Marbled Sentinel'},
    'mountain': {spriteRow: 9, spriteCol: 3, name: 'Forest Watcher'},
    'crate': {spriteRow: 9, spriteCol: 4, name: 'Sacred Totem'}
};

const STATIC_OBJECT_INSTANCES = [
    {template: 'statue_fish', position: {x: 1, z: 1},mirrored: true},
    {template: 'statue_dog', position: {x: 2, z: 1}},
    {template: 'statue_turtle', position: {x: 1, z: 2}},
    {template: 'house', position: {x: 11, z: 4}},
    {template: 'singlepine', position: {x: 10, z: 5}},
    {template: 'singlepine', position: {x: 2, z: 13}},
    {template: 'finishline', position: {x: 2, z: 11},mirrored: true},
    {template: 'forest_round', position: {x: 4, z: 10}},
    {template: 'forest_round', position: {x: 4, z: 1}},
    {template: 'forest_round', position: {x: 3, z: 1}},
    {template: 'forest_round', position: {x: 1, z: 4}},
    {template: 'forest_round', position: {x: 1, z: 3}},
    {template: 'forest_pines', position: {x: 1, z: 12}},
    {template: 'forest_pines', position: {x: 2, z: 12}},
    {template: 'forest_pines', position: {x: 3, z: 13}},
    {template: 'forest_pines', position: {x: 3, z: 14}},
    {template: 'mountain', position: {x: 14, z: 1}},
    {template: 'mountain', position: {x: 13, z: 1}},
    {template: 'crate', position: {x: 12, z: 11}}
];

class NPC extends Player {
  constructor(game, npcId) {
    super(game);
    
    // Load NPC data
    const data = NPC_DATA[npcId];
    if (!data) throw new Error(`NPC data not found for ID: ${npcId}`);
    
    this.npcId = npcId;
    this.spriteRow = data.spriteRow;
    this.isNPC = true;
    this.patrolIndex = 0;
    this.startX = data.position.x;
    this.startZ = data.position.z;
    this.patrolType = data.patrolType;
    this.patrolPath = data.patrolType !== 'none' ? this.generatePatrolPath(data.patrolType, data.position.x, data.position.z) : [];
    this.isPatrolling = data.patrolType !== 'none';
    this.waitTime = 0;
    this.maxWaitTime = 1500 + Math.random() * 1000;
    this.isInteractable = true;
    this.name = data.name;
    this.speed = 0.05 + Math.random() * 0.015;
    
    // Conversation system
    this.conversations = data.conversations;
    this.conversationIndex = 0;
    this.message = this.conversations[0].message;
    this.interactionType = 'npc';
    this.isExecutingAction = false;
    
    this.animations = {
      idle: {
        frames: [{x: data.idleFrame * 64, y: data.spriteRow * 64}],
        frameCount: 1,
        loop: true
      },
      walking: {
        frames: [
          {x: 64, y: data.spriteRow * 64},
          {x: 128, y: data.spriteRow * 64},
          {x: 192, y: data.spriteRow * 64},
          {x: 256, y: data.spriteRow * 64}
        ],
        frameCount: 4,
        loop: true
      }
    };
    
    this.pos = {x: data.position.x, z: data.position.z};
    this.setPosition(data.position.x, data.position.z);
    
    if (this.isPatrolling) {
      setTimeout(() => {
        this.startPatrol();
      }, 1000 + data.spawnDelay);
    }
  }
  interact(){
    // Get the current conversation
    const currentConversation = this.conversations[this.conversationIndex];
    
    // If current conversation requires confirmation, show it first
    if(currentConversation.requiresConfirmation){
        const mockInteractable = {
            type:'npc_confirmation',
            message: currentConversation.confirmationMessage || "Are you sure you want to continue?",
            npcRef: this
        };
        this.game.showConfirmationDialog(mockInteractable, (confirmed) => {
            if(confirmed){
                // Execute current conversation's action
                if(currentConversation.action && !this.isExecutingAction){
                    this.executeAction(currentConversation.action);
                }
                // Advance to next conversation
                this.advanceToNextConversation();
            }
        });
        return this.message;
    }
    
    // No confirmation needed for current conversation
    // Execute the current conversation's action if it exists
    if(currentConversation.action && !this.isExecutingAction){
        this.executeAction(currentConversation.action);
    }
    
    // Advance to next conversation for the NEXT interaction
    this.advanceToNextConversation();
    
    // Return the message that was just shown (before advancing)
    return currentConversation.message;
}

advanceToNextConversation(){
    // Only advance if there are more conversations
    if(this.conversationIndex < this.conversations.length - 1){
        this.conversationIndex++;
        this.message = this.conversations[this.conversationIndex].message;
    }
}
  executeAction(action) {
    console.log(`Executing action: ${action.type}`, action);
    this.isExecutingAction = true;
    
    switch (action.type) {
      case 'move':
        console.log(`Moving from (${this.pos.x}, ${this.pos.z}) to (${action.target.x}, ${action.target.z})`);
        this.isPatrolling = false; // Stop current patrol
        this.speed = action.speed || this.speed;
        this.findPath(this.pos, action.target, (path) => {
          console.log(`Path found with ${path.length} steps:`, path);
          this.path = path;
          this.progress = 0;
          this.onReachTarget = () => {
            console.log(`Reached target at (${this.pos.x}, ${this.pos.z})`);
            this.isExecutingAction = false;
            this.onReachTarget = null;
          };
        });
        break;
case 'moveAndCamera':
    console.log(`Changing camera then moving`);
    // Change camera first
    this.game.setCameraPreset(action.cameraPreset, action.smooth !== false, () => {
        console.log(`Camera changed, now moving`);
        // After camera change completes, start movement
        this.isPatrolling = false;
        this.speed = action.speed || this.speed;
        this.findPath(this.pos, action.target, (path) => {
            this.path = path;
            this.progress = 0;
            this.onReachTarget = () => {
                console.log(`Reached target after camera change`);
                this.isExecutingAction = false;
                this.onReachTarget = null;
            };
        });
    });
    break;
    case 'camera':
        console.log(`Changing camera to: ${action.preset}`);
        
        // Close any open dialogs first
        const existingDialog = document.getElementById('confirmationDialog');
        if (existingDialog) existingDialog.remove();
        const npcDialog = document.getElementById('npcQuestionDialog');
        if (npcDialog) npcDialog.remove();
        
        // Small delay to ensure dialogs are closed
        setTimeout(() => {
            this.game.setCameraPreset(action.preset, action.smooth !== false, () => {
                console.log(`Camera preset '${action.preset}' applied`);
                this.isExecutingAction = false;
            });
        }, 100);
        break;
      case 'patrol':
        console.log(`Changing patrol type to: ${action.patrolType}`);
        this.patrolType = action.patrolType;
        this.patrolPath = action.patrolType !== 'none' ? 
          this.generatePatrolPath(action.patrolType, this.pos.x, this.pos.z) : [];
        this.isPatrolling = action.patrolType !== 'none';
        this.patrolIndex = 0;
        if (this.isPatrolling) {
          this.startPatrol();
        }
        this.isExecutingAction = false;
        break;
        case 'drop':
  console.log(`Dropping in ${action.delay || 0}ms`);
  setTimeout(() => {
    this.isInteractable = false;
    this.isPatrolling = false;
    
    // Visual drop animation with physics
    if (this.sprite) {
      let velocity = 0;
      const gravity = 0.01;
      const rotationSpeed = 0.01;
      const startY = this.sprite.position.y;
      
      const dropAnimation = () => {
        if (!this.sprite.material) return;
        
        // Apply gravity physics
        velocity += gravity;
        this.sprite.position.y -= velocity;
        
        // Add spinning effect while falling
        this.sprite.rotation.z += rotationSpeed;
        
        // Optional: Slight fade as it falls (looks more dramatic)
        if (this.sprite.position.y < startY - 3) {
          this.sprite.material.opacity = Math.max(0, this.sprite.material.opacity - 0.02);
        }
        
        // Remove when fallen far enough or fully transparent
        if (this.sprite.position.y < startY - 8 || this.sprite.material.opacity <= 0) {
          // Completely fallen - remove from scene and interactables
          this.game.scene.remove(this.sprite);
          
          // Remove from interactables array
          this.game.interactables = this.game.interactables.filter(
            interactable => interactable.npcRef !== this
          );
          
          this.isExecutingAction = false;
          console.log('NPC dropped out of sight');
        } else {
          // Continue falling
          requestAnimationFrame(dropAnimation);
        }
      };
      
      // Make sure material supports transparency for the fade effect
      this.sprite.material.transparent = true;
      dropAnimation();
    } else {
      this.isExecutingAction = false;
      console.log('NPC dropped (no sprite)');
    }
  }, action.delay || 0);
  break;
      case 'disappear':
  console.log(`Disappearing in ${action.delay || 0}ms`);
  setTimeout(() => {
    this.isInteractable = false;
    this.isPatrolling = false;
    
    // Visual fade out animation
    if (this.sprite) {
      const fadeOut = () => {
        if (!this.sprite.material) return;
        
        // Reduce opacity gradually
        this.sprite.material.opacity -= 0.05;
        
        if (this.sprite.material.opacity <= 0) {
          // Completely hidden - remove from scene and interactables
          this.game.scene.remove(this.sprite);
          
          // Remove from interactables array
          this.game.interactables = this.game.interactables.filter(
            interactable => interactable.npcRef !== this
          );
          
          this.isExecutingAction = false;
          console.log('NPC disappeared');
        } else {
          // Continue fading
          requestAnimationFrame(fadeOut);
        }
      };
      
      // Make sure material is transparent
      this.sprite.material.transparent = true;
      fadeOut();
    } else {
      this.isExecutingAction = false;
      console.log('NPC disappeared (no sprite)');
    }
  }, action.delay || 0);
  break;
    }
  }

  update(){
    if(!this.isPatrolling && !this.isExecutingAction) return;
    
    if(this.isExecutingAction){
        if(this.path.length > 0){
            super.update();
            if(this.onReachTarget && this.path.length === 0){
                this.onReachTarget();
            }
        }
        return;
    }
    
    // Only stop for nearby player if NOT executing an action
    if(this.isPlayerNearby() && !this.isExecutingAction){
        if(this.animationState !== 'idle'){
            this.animationState = 'idle';
            this.animationFrame = 0;
            this.animationTime = 0;
        }
        this.updateAnimation();
        return;
    }
    
    if(this.path.length > 0){
        super.update();
        return;
    }
    
    if(this.patrolPath.length > 0 && this.isPatrolling){
        this.waitTime += 30;
        if(this.waitTime >= this.maxWaitTime){
            this.patrolIndex = (this.patrolIndex + 1) % this.patrolPath.length;
            this.maxWaitTime = 1500 + Math.random() * 1000;
            this.startPatrol();
        } else {
            if(this.animationState !== 'idle'){
                this.animationState = 'idle';
                this.animationFrame = 0;
                this.animationTime = 0;
            }
            this.updateAnimation();
        }
    }
}

  // Keep existing methods unchanged
  generatePatrolPath(type, centerX, centerZ) {
    switch (type) {
      case 'none': return [];
      case 'circle': return this.generateCirclePath(centerX, centerZ);
      case 'square': return this.generateSquarePath(centerX, centerZ);
      case 'line': return this.generateLinePath(centerX, centerZ);
      case 'random': return this.generateRandomPath(centerX, centerZ);
      case 'figure8': return this.generateFigure8Path(centerX, centerZ);
      default: return this.generateCirclePath(centerX, centerZ);
    }
  }

  generateCirclePath(centerX, centerZ) {
    return [
      {x: centerX + 1, z: centerZ - 1}, {x: centerX + 1, z: centerZ},
      {x: centerX + 1, z: centerZ + 1}, {x: centerX, z: centerZ + 1},
      {x: centerX - 1, z: centerZ + 1}, {x: centerX - 1, z: centerZ},
      {x: centerX - 1, z: centerZ - 1}, {x: centerX, z: centerZ - 1}
    ];
  }

  generateSquarePath(centerX, centerZ) {
    return [
      {x: centerX - 2, z: centerZ - 2}, {x: centerX + 2, z: centerZ - 2},
      {x: centerX + 2, z: centerZ + 2}, {x: centerX - 2, z: centerZ + 2}
    ];
  }

  generateLinePath(centerX, centerZ) {
    return [
      {x: centerX - 3, z: centerZ}, {x: centerX + 3, z: centerZ},
      {x: centerX, z: centerZ}, {x: centerX, z: centerZ - 2}, {x: centerX, z: centerZ + 2}
    ];
  }

  generateRandomPath(centerX, centerZ) {
    const points = [];
    for (let i = 0; i < 5; i++) {
      points.push({
        x: Math.floor(centerX + (Math.random() - 0.5) * 6),
        z: Math.floor(centerZ + (Math.random() - 0.5) * 6)
      });
    }
    return points;
  }

  generateFigure8Path(centerX, centerZ) {
    return [
      {x: centerX, z: centerZ - 2}, {x: centerX + 1, z: centerZ - 1},
      {x: centerX, z: centerZ}, {x: centerX - 1, z: centerZ + 1},
      {x: centerX, z: centerZ + 2}, {x: centerX + 1, z: centerZ + 1},
      {x: centerX, z: centerZ}, {x: centerX - 1, z: centerZ - 1}
    ];
  }

  startPatrol() {
    if (!this.isPatrolling || this.patrolPath.length === 0) return;
    const target = this.patrolPath[this.patrolIndex];
    this.findPath(this.pos, target, (path) => {
      this.path = path;
      this.progress = 0;
      this.waitTime = 0;
    });
  }

  isPlayerNearby(radius = 2) {
    if (!this.game.player || !this.game.player.pos) return false;
    const dx = this.pos.x - this.game.player.pos.x;
    const dz = this.pos.z - this.game.player.pos.z;
    return Math.sqrt(dx * dx + dz * dz) < radius;
  }

  initInput() {}
}

class StaticObject extends NPC {
    constructor(game, template, position, instanceId, mirrored = false) {
        const templateData = STATIC_OBJECT_TEMPLATES[template];
        if (!templateData) throw new Error(`Static object template not found: ${template}`);
        
        const uniqueId = `${template}_${instanceId}`;
        const fakeNpcData = {
            spriteRow: templateData.spriteRow,
            position: position,
            spawnDelay: 0,
            patrolType: 'none',
            idleFrame: templateData.spriteCol,
            name: templateData.name,
            conversations: [{message: "", action: null}]
        };
        
        NPC_DATA[uniqueId] = fakeNpcData;
        super(game, uniqueId);
        delete NPC_DATA[uniqueId];
        
        this.isStatic = true;
        this.isInteractable = false;
        this.isPatrolling = false;
        this.conversations = [];
        this.message = "";
        
        // Set mirroring and apply it
        this.shouldMirror = mirrored;
        console.log(`StaticObject ${this.name} created, shouldMirror: ${mirrored}`);
        
        if (this.shouldMirror) {
            this.applyMirroringWhenReady();
        }
    }
    
    applyMirroringWhenReady() {
        console.log(`Attempting to mirror ${this.name}`);
        
        const checkAndApply = () => {
            console.log(`Checking sprite for ${this.name}:`, {
                hasSprite: !!this.sprite,
                hasMaterial: !!(this.sprite && this.sprite.material),
                hasMap: !!(this.sprite && this.sprite.material && this.sprite.material.map),
                currentScaleX: this.sprite ? this.sprite.scale.x : 'no sprite'
            });
            
            if (this.sprite && this.sprite.material && this.sprite.material.map) {
                // Try multiple approaches
                console.log(`Before mirroring - scale.x: ${this.sprite.scale.x}`);
                
                // Approach 1: Scale flip
                this.sprite.scale.x = Math.abs(this.sprite.scale.x) * -1;
                console.log(`After scale flip - scale.x: ${this.sprite.scale.x}`);
                
                // Approach 2: Also try UV flipping if we have the UV method
                if (this.setFrameUV && this.texW && this.texH) {
                    this.facingLeft = true;
                    const frame = this.animations.idle.frames[0];
                    this.setFrameUV(frame.x, frame.y, 64, 64, this.texW, this.texH);
                    console.log(`Applied UV flipping for ${this.name}`);
                }
                
                console.log(`✓ Applied mirroring to ${this.name}`);
                return;
            } else {
                // Keep checking until sprite is ready
                setTimeout(checkAndApply, 100);
            }
        };
        
        checkAndApply();
    }
    
    interact() { return null; }
    update() { return; }
}
// Modified initialization
(function() {
  const initNPCs = () => {
    if (typeof game !== 'undefined' && game.terrain && game.scene) {
      // Create NPCs from data
        //const npcIds = ['elder_marcus','merchant_sara','merchant_mara','wise_elena','scout_mike','healer_rose','guard_tom','trader_jack'];
      const npcIds = ['elder_marcus', 'merchant_sara', 'merchant_mara', 'wise_elena', 'scout_mike', 'healer_rose', 'guard_tom', 'trader_jack'];
//const staticObjectIds = [   'statue_fish',   'statue_dog',   'statue_turtle',   'house',   'singlepine',   'finishline',  'forest_round',   'forest_pines',   'mountain',   'crate'];


game.npcs = npcIds.map(id => new NPC(game, id));
game.staticObjects = STATIC_OBJECT_INSTANCES.map((instance, index) => 
    new StaticObject(game, instance.template, instance.position, index, instance.mirrored)
);
console.log('Static objects created:');
game.staticObjects.forEach((obj) => {
    console.log(`${obj.name} at (${obj.pos.x}, ${obj.pos.z})`);
});
      
      console.log('NPCs created from data:');
      game.npcs.forEach((npc, i) => {
        console.log(`${npc.name}: ${npc.patrolType} patrol, conversations: ${npc.conversations.length}`);
      });
      
      // Add NPCs to interactables system
      game.npcs.forEach(npc => {
        const tile = game.terrain.getTile(npc.pos.x, npc.pos.z);
        if (tile) {
          game.interactables.push({
            mesh: npc.sprite || { position: { x: tile.mesh.position.x, y: tile.mesh.position.y + 1, z: tile.mesh.position.z } },
            x: npc.pos.x,
            z: npc.pos.z,
            type: 'npc',
            message: npc.name,
            interact: 'Press E to talk',
            inRange: false,
            npcRef: npc
          });
        }
      });
      
      if (game.update) {
        const originalUpdate = game.update;
        game.update = function() {
          originalUpdate.call(this);
          game.npcs.forEach(npc => npc.update());
          
          // Update NPC interactable positions
          game.npcs.forEach(npc => {
            const interactable = game.interactables.find(i => i.npcRef === npc);
            if (interactable) {
              interactable.x = npc.pos.x;
              interactable.z = npc.pos.z;
              const tile = game.terrain.getTile(npc.pos.x, npc.pos.z);
              if (tile && interactable.mesh.position) {
                interactable.mesh.position.x = tile.mesh.position.x;
                interactable.mesh.position.z = tile.mesh.position.z;
              }
            }
          });
        };
      }
      
      console.log('NPCs initialized with conversation chains and actions');
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
