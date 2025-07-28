
const NPC_DATA = {
    'trader_jack': {
    spriteRow: 2,
    position: {x: 9, z: 5},
    spawnDelay: 1500,
    patrolType: 'none',
    idleFrame: 0,
    name: 'Juan Pescador',
    conversations: [
        {
            message: "Antes tenía una caña de pescar... Alguien me la pidió prestada y nunca volvió.",
            requiresConfirmation: true,
            confirmationMessage: "¿Y si buscamos con qué hacer otra?",
            confirmationAlternative: "Esperemos un poco más.",
            action: {
                type: 'choice',
                onSuccess: {type: 'followAndMove', target: {x: 10, z: 10}, speed: 0.05},
                onFailure: {
                    type: 'setConversations',
                    newConversations: [
                        {
                            message: "Supongo que seguiré esperando...",
                            action: {type: 'patrol', patrolType: 'random', speed: 0.02}
                        }
                    ]
                }
            }
        },
        {
            message: "¿Qué buscamos exactamente?",
            requiresConfirmation: true,
            confirmationMessage: "No lo sé. Seguro algo aparecerá si caminamos con los ojos abiertos.",
            confirmationAlternative: "Quiero la caña perfecta.",
            action: {
                type: 'choice',
                onSuccess: {type: 'followAndMove', target: {x: 5, z: 10}, speed: 0.05, smooth: true},
                onFailure: {
                    type: 'setConversations',
                    newConversations: [
                        {
                            message: "Quizá tengas razón... pero nunca no encontraremos lo perfecto.",
                            action: {type: 'move', target: {x: 9, z: 5}, speed: 0.05}
                        }
                    ]
                }
            }
        },
        {
                message: "Mira, una cuerda vieja colgando de ese árbol...",
                requiresConfirmation: true,
                confirmationMessage: "Hey, si lo juntas con ese palo, puede ser una caña!",
                confirmationAlternative: "No parece gran cosa. No creo que sirva",
                action: {
                      type: 'choice',
                      onSuccess: {
                        type: 'giveObject',
                        template: 'boat1',
                        position: {
                          x: 7,
                          z: 8
                        },
                        message: "Gracias por creen en mí. No sabía que podía hacerlo.",
                        nextAction: {
                          type: 'followAndMove',
                          delay: 3000,
                            message: "Me voy al mar!",
                          target: {
                            x: 7,
                            z: 8
                          },
                          speed: 0.05,
                          nextAction: {
                            type: 'disappear',
                            delay: 500,
                            message: "Nos vemos!"
                          }
                        },
                        mirrored: false
                      },
                      onFailure: {
                        type: 'setConversations',
                        newConversations: [
                          {
                            message: "Tal vez nada es suficiente después de todo...",
                            action: {
                              type: 'disappear',
                              delay: 3000
                            }
                          }
                        ]
                      }
                    }
            },
            {message: "Here's your share. May fortune favor your travels!", action: {
    type: 'removeObject',
    position: {x: 6, z: 12},
    message: "El bote se desvanece misteriosamente..."
}},
            {message: "Chau!", action: {type: 'disappear', delay: 100}}
    ]
},
    'elder_marcus': {
        spriteRow: 0,
        position: {x: 5, z: 5},
        spawnDelay: 2000,
        patrolType: 'circle',
        idleFrame: 0,
        name: 'Elder Marcus',
        conversations: [
            {
                message: "Greetings, young traveler. Let me show you a better view of our lands...",
                requiresConfirmation: false,
                action: {type: 'followAndMove', target: {x: 12, z: 8}, speed: 0.05,smooth: true}
            },
            {message:"The ancient temple holds secrets... but first, prove your worth.",action:{type:'followAndMove',target:{x:7,z:0},speed:0.05,smooth:!0,usePerspective:true},requiresConfirmation:!0,confirmationMessage:"Do you wish to follow me to the ancient temple? The path may be dangerous."},
            {
                message: "You followed me here. Good. The real treasure lies beneath the old oak.",
                action: {type: 'camera', preset: 'followPlayer', requiresConfirmation: false, smooth: true}
            }
        ]
    },
    'merchant_sara': {
        spriteRow: 6,
        position: {x: 4, z: 13},
        spawnDelay: 2000,
        patrolType: 'none',
        idleFrame: 0,
        name: 'Merchant Sara',
        conversations: [
            {message: "Welcome to my shop! I have the finest wares in the land.", action: null},
            {message: "Hmm, you look like someone who appreciates quality. Follow me to my secret stash.", action: {type: 'move', target: {x: 12, z: 8}, speed: 0.05}},
            {message: "Here are my rarest items. Choose wisely, traveler.", action: {type: 'camera', preset: 'overview', requiresConfirmation: false, smooth: true}}
        ]
    },
    'merchant_mara': {
        spriteRow: 7,
        position: {x: 4, z: 12},
        spawnDelay: 2000,
        patrolType: 'none',
        idleFrame: 0,
        name: 'Merchant Mara',
        conversations: [
            {message: "Welcome to my shop! I have the finest wares in the land.", action: null},
            {message: "Hmm, you look like someone who appreciates quality. Follow me to my secret stash.", action: {type: 'move', target: {x: 12, z: 8}, speed: 0.05}},
            {message: "Here are my rarest items. Choose wisely, traveler.", action: {type: 'disappear', delay: 3000}}
        ]
    },
    'wise_elena': {
        spriteRow: 5,
        position: {x: 5, z: 12},
        spawnDelay: 2000,
        patrolType: 'none',
        idleFrame: 0,
        name: 'Wise Elena',
        conversations: [
            {message: "The spirits whisper of your arrival...", action: null},
            {message: "They tell me you seek knowledge. Come, let me show you the sacred grove.", action: {type: 'move', target: {x: 2, z: 2}, speed: 0.05}},
            {message: "This place holds ancient magic. Use it wisely.", action: {type: 'patrol', patrolType: 'circle'}}
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
            {message: "I've been watching the perimeter. Strange movements in the eastern woods.", action: null},
            {message: "Come, I'll show you the patrol route. Stay close and stay quiet.", action: {type: 'move', target: {x: 10, z: 6}, speed: 0.05}},
            {message: "From here you can see the entire valley. Remember this vantage point.", action: {type: 'patrol', patrolType: 'random'}}
        ]
    },
    'healer_rose': {
        spriteRow: 7,
        position: {x: 5, z: 14},
        spawnDelay: 3000,
        patrolType: 'circle',
        idleFrame: 0,
        name: 'Healer Rose',
        conversations: [
            {message: "You look weary, traveler. Rest here a moment and let me tend to your wounds.", action: null},
            {message: "The healing herbs grow wild near the spring. Let me show you where to find them.", action: {type: 'move', target: {x: 4, z: 14}, speed: 0.05}},
            {message: "These plants will serve you well on your journey. May they keep you safe.", action: {type: 'patrol', patrolType: 'line'}}
        ]
    },
    'guard_tom': {
        spriteRow: 1,
        position: {x: 4, z: 14},
        spawnDelay: 1000,
        patrolType: 'square',
        idleFrame: 0,
        name: 'Guard Tom',
        conversations: [
            {message: "Halt! State your business in these lands.", action: null},
            {message: "Very well. But I must escort you to the checkpoint for verification.", action: {type: 'move', target: {x: 13, z: 13}, speed: 0.055}},
            {message: "You check out. But remember - I'll be watching.", action: {type: 'patrol', patrolType: 'square'}}
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
            {message: "Ah, a fellow traveler! I deal in rare goods and information.", action: null},
            {message: "I know of a hidden cache nearby. Care to make a deal?", action: {type: 'move', target: {x: 1, z: 5}, speed: 0.05}},
            {message: "Here's your share. May fortune favor your travels!", action: {type: 'disappear', delay: 2000}}
        ]
    }
};

const STATIC_OBJECT_TEMPLATES = {
    'statue_fish': {spriteRow: 8, spriteCol: 0, name: 'Ancient Statue'},
    'statue_dog': {spriteRow: 8, spriteCol: 1, name: 'Stone Monument'},
    'statue_turtle': {spriteRow: 8, spriteCol: 2, name: 'Mystic Pillar'},
    'statue_rabbit': {spriteRow: 12, spriteCol: 1, name: 'Roger Rabbit'},
    'house': {spriteRow: 8, spriteCol: 3, name: 'Guardian Statue'},
    'finishline': {spriteRow: 9, spriteCol: 0, name: 'Ancient Idol'},
    'singlepine': {spriteRow: 8, spriteCol: 4, name: 'Guardian Statue'},
    'bush': {spriteRow: 11, spriteCol: 0, name: 'bush'},
    'darkbush': {spriteRow: 12, spriteCol: 0, name: 'darkbush'},
    'campfire': {spriteRow: 11, spriteCol: 3, name: 'campfire'},
    'table': {spriteRow: 11, spriteCol: 4, name: 'table'},
    'crate': {spriteRow: 9, spriteCol: 4, name: 'crate'},
    'cactus': {spriteRow: 11, spriteCol: 2, name: 'cactus'},
    'forest_round': {spriteRow: 9, spriteCol: 1, name: 'Runed Obelisk'},
    'forest_pines': {spriteRow: 9, spriteCol: 2, name: 'Marbled Sentinel'},
    'mountain': {spriteRow: 9, spriteCol: 3, name: 'Forest Watcher'},
    'boat1': {spriteRow: 10, spriteCol: 0, name: 'boat1'},
    'boat2': {spriteRow: 10, spriteCol: 4, name: 'boat2'},
    'check1': {spriteRow: 10, spriteCol: 1, name: 'check1'},
    'check2': {spriteRow: 10, spriteCol: 2, name: 'check2'},
    'check3': {spriteRow: 10, spriteCol: 3, name: 'check3'},
    'check4': {spriteRow: 11, spriteCol: 1, name: 'check4'}
};

const STATIC_OBJECT_INSTANCES = [
    {template: 'statue_fish', position: {x: 1, z: 1}, mirrored: true},
    {template: 'statue_dog', position: {x: 2, z: 1}},
    {template: 'statue_turtle', position: {x: 1, z: 2}},
    {template: 'statue_rabbit', position: {x: 2, z: 2}},
    {template: 'house', position: {x: 11, z: 4}},
    {template: 'singlepine', position: {x: 10, z: 5}},
    {template: 'singlepine', position: {x: 2, z: 13}},
    {template: 'singlepine', position: {x: 14, z: 2}},
    {template: 'finishline', position: {x: 2, z: 11}, mirrored: true},
    {template: 'forest_round', position: {x: 4, z: 10}},
    {template: 'forest_round', position: {x: 4, z: 1}},
    {template: 'forest_round', position: {x: 3, z: 1}},
    {template: 'forest_round', position: {x: 1, z: 4}},
    {template: 'forest_round', position: {x: 1, z: 3}},
    {template: 'forest_pines', position: {x: 1, z: 12}},
    {template: 'forest_pines', position: {x: 2, z: 12}},
    {template: 'forest_pines', position: {x: 3, z: 13}},
    {template: 'forest_pines', position: {x: 3, z: 14}},
    {template: 'forest_pines', position: {x: 14, z: 3}},
    {template: 'forest_pines', position: {x: 13, z: 2}},
    {template: 'mountain', position: {x: 14, z: 1}},
    {template: 'mountain', position: {x: 13, z: 1}},
    {template: 'crate', position: {x: 12, z: 11}},
    {template: 'campfire', position: {x: 11, z: 6}, belowPlayer: true},
    //{template: 'boat1', position: {x: 7, z: 8}},
    //{template: 'boat2', position: {x: 7, z: 7}},
    {template: 'table', position: {x: 7, z: 6}, belowPlayer: true},
    {template: 'bush', position: {x: 7, z: 2}},
    {template: 'darkbush', position: {x: 5, z: 10}},
    {template: 'cactus', position: {x: 7, z: 1}}
];

class NPC extends Player {
    constructor(game, npcId) {
        super(game);
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
    const currentConversation=this.conversations[this.conversationIndex];
    if(currentConversation.requiresConfirmation){
        const mockInteractable={
            type:'npc_choice',
            message: currentConversation.message, // Usar el mensaje de la conversación como título
            confirmationMessage:currentConversation.confirmationMessage,
            confirmationAlternative:currentConversation.confirmationAlternative,
            npcRef:this
        };
        this.game.showConfirmationDialog(mockInteractable,(choiceA)=>{
            if(currentConversation.action&&currentConversation.action.type==='choice'){
                if(choiceA&&currentConversation.action.onSuccess){
                    this.executeAction(currentConversation.action.onSuccess);
                    if(currentConversation.action.onSuccess.type!=='setConversations'){
                        this.advanceToNextConversation()
                    }
                }else if(!choiceA&&currentConversation.action.onFailure){
                    this.executeAction(currentConversation.action.onFailure)
                }
            }else{
                if(choiceA&&currentConversation.action){
                    this.executeAction(currentConversation.action);
                    this.advanceToNextConversation()
                }
            }
        });
        return null; // Cambiar de this.message a null para no mostrar el toast
    }
    
    if(currentConversation.action&&!this.isExecutingAction){
        this.executeAction(currentConversation.action)
    }
    
    this.advanceToNextConversation();
    return currentConversation.message
}

    advanceToNextConversation() {
        if (this.conversationIndex < this.conversations.length - 1) {
            this.conversationIndex++;
            this.message = this.conversations[this.conversationIndex].message;
        }
    }

    executeAction(action) {
    console.log(`Executing action: ${action.type}`, action);
    this.isExecutingAction = true;
    
    // Helper function to execute the next action in chain
    const executeNextAction = () => {
        if (action.nextAction) {
            console.log('Executing chained action:', action.nextAction);
            // Support delay for any nextAction
            const delay = action.nextAction.delay || 0;
            if (delay > 0) {
                console.log(`Delaying next action by ${delay}ms`);
                setTimeout(() => {
                    this.executeAction(action.nextAction);
                }, delay);
            } else {
                this.executeAction(action.nextAction);
            }
        } else {
            this.isExecutingAction = false;
        }
    };

    // Show message for this action if it has one
    if (action.message) {
        this.game.showMessage(action.message);
    }

    switch (action.type) {
        case 'move':
            console.log(`Moving from (${this.pos.x}, ${this.pos.z}) to (${action.target.x}, ${action.target.z})`);
            this.isPatrolling = false;
            this.speed = action.speed || this.speed;
            this.findPath(this.pos, action.target, (path) => {
                console.log(`Path found with ${path.length} steps:`, path);
                this.path = path;
                this.progress = 0;
                this.onReachTarget = () => {
                    console.log(`Reached target at (${this.pos.x}, ${this.pos.z})`);
                    this.onReachTarget = null;
                    executeNextAction(); // Execute next action after reaching target
                };
            });
            break;

        case 'choice':
            executeNextAction(); // Immediately proceed to next action for choice type
            break;

        case 'setConversations':
            if (action.newConversations && action.newConversations.length > 0) {
                this.conversations = action.newConversations;
                this.conversationIndex = 0;
                this.message = this.conversations[0].message;
                console.log(`Updated conversations for ${this.name}:`, this.conversations);
            }
            executeNextAction();
            break;

        case 'moveAndCamera':
            console.log(`Changing camera then moving`);
            this.game.setCameraPreset(action.cameraPreset, action.smooth !== false, () => {
                console.log(`Camera changed, now moving`);
                this.isPatrolling = false;
                this.speed = action.speed || this.speed;
                this.findPath(this.pos, action.target, (path) => {
                    this.path = path;
                    this.progress = 0;
                    this.onReachTarget = () => {
                        console.log(`Reached target after camera change`);
                        this.onReachTarget = null;
                        executeNextAction();
                    };
                });
            });
            break;

        case 'camera':
            console.log(`Changing camera to: ${action.preset}`);
            const existingDialog = document.getElementById('confirmationDialog');
            if (existingDialog) existingDialog.remove();
            const npcDialog = document.getElementById('npcQuestionDialog');
            if (npcDialog) npcDialog.remove();
            setTimeout(() => {
                this.game.setCameraPreset(action.preset, action.smooth !== false, () => {
                    console.log(`Camera preset '${action.preset}' applied`);
                    executeNextAction();
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
            executeNextAction();
            break;

        case 'giveObject':
            console.log(`Giving object: ${action.template} at (${action.position.x}, ${action.position.z})`);
            const objectId = this.game.staticObjects ? this.game.staticObjects.length : 0;
            const newObject = new StaticObject(this.game, action.template, action.position, objectId, action.mirrored || false);
            if (!this.game.staticObjects) {
                this.game.staticObjects = [];
            }
            this.game.staticObjects.push(newObject);
            executeNextAction();
            break;

        case 'removeObject':
            console.log(`Removing object at (${action.position.x}, ${action.position.z})`);
            if (this.game.staticObjects) {
                const objectIndex = this.game.staticObjects.findIndex(obj => 
                    obj.pos.x === action.position.x && obj.pos.z === action.position.z);
                if (objectIndex !== -1) {
                    const removedObject = this.game.staticObjects[objectIndex];
                    if (removedObject.sprite) {
                        this.game.scene.remove(removedObject.sprite);
                        if (removedObject.sprite.material) {
                            removedObject.sprite.material.dispose();
                        }
                        if (removedObject.sprite.geometry) {
                            removedObject.sprite.geometry.dispose();
                        }
                    }
                    this.game.staticObjects.splice(objectIndex, 1);
                    console.log(`Removed object: ${removedObject.name} from (${action.position.x}, ${action.position.z})`);
                } else {
                    console.log(`No object found at (${action.position.x}, ${action.position.z})`);
                }
            }
            executeNextAction();
            break;

        case 'followAndMove':
            console.log(`Setting camera to follow NPC and moving`);
            this.game.cameraSystem.saveInitialCameraState();
            this.game.cameraSystem.setFollowTarget(this);
            this.game.setCameraPreset('followAndMove', action.smooth !== false, () => {
                console.log(`Camera now following NPC, starting movement`);
                this.isPatrolling = false;
                this.speed = action.speed || this.speed;
                this.findPath(this.pos, action.target, (path) => {
                    this.path = path;
                    this.progress = 0;
                    this.onReachTarget = () => {
                        console.log(`NPC reached target, restoring to initial camera state`);
                        this.game.cameraSystem.clearFollowTarget();
                        this.game.cameraSystem.restoreToInitialState(true, () => {
                            this.onReachTarget = null;
                            executeNextAction();
                        });
                    };
                });
            });
            break;

        case 'drop':
            console.log(`Dropping in ${action.delay || 0}ms`);
            setTimeout(() => {
                this.isInteractable = false;
                this.isPatrolling = false;
                if (this.sprite) {
                    let velocity = 0;
                    const gravity = 0.01;
                    const rotationSpeed = 0.01;
                    const startY = this.sprite.position.y;
                    const dropAnimation = () => {
                        if (!this.sprite.material) return;
                        velocity += gravity;
                        this.sprite.position.y -= velocity;
                        this.sprite.rotation.z += rotationSpeed;
                        if (this.sprite.position.y < startY - 3) {
                            this.sprite.material.opacity = Math.max(0, this.sprite.material.opacity - 0.02);
                        }
                        if (this.sprite.position.y < startY - 8 || this.sprite.material.opacity <= 0) {
                            this.game.scene.remove(this.sprite);
                            this.game.interactables = this.game.interactables.filter(interactable => interactable.npcRef !== this);
                            executeNextAction();
                            console.log('NPC dropped out of sight');
                        } else {
                            requestAnimationFrame(dropAnimation);
                        }
                    };
                    this.sprite.material.transparent = true;
                    dropAnimation();
                } else {
                    executeNextAction();
                    console.log('NPC dropped (no sprite)');
                }
            }, action.delay || 0);
            break;

        case 'disappear':
            console.log(`Disappearing in ${action.delay || 0}ms`);
            setTimeout(() => {
                this.isInteractable = false;
                this.isPatrolling = false;
                if (this.sprite) {
                    const fadeOut = () => {
                        if (!this.sprite.material) return;
                        this.sprite.material.opacity -= 0.05;
                        if (this.sprite.material.opacity <= 0) {
                            this.game.scene.remove(this.sprite);
                            this.game.interactables = this.game.interactables.filter(interactable => interactable.npcRef !== this);
                            executeNextAction();
                            console.log('NPC disappeared');
                        } else {
                            requestAnimationFrame(fadeOut);
                        }
                    };
                    this.sprite.material.transparent = true;
                    fadeOut();
                } else {
                    executeNextAction();
                    console.log('NPC disappeared (no sprite)');
                }
            }, action.delay || 0);
            break;

    }
}


    update() {
        if (!this.isPatrolling && !this.isExecutingAction) return;

        if (this.isExecutingAction) {
            if (this.path.length > 0) {
                super.update();
                if (this.onReachTarget && this.path.length === 0) {
                    this.onReachTarget();
                }
            }
            return;
        }

        if (this.isPlayerNearby() && !this.isExecutingAction) {
            if (this.animationState !== 'idle') {
                this.animationState = 'idle';
                this.animationFrame = 0;
                this.animationTime = 0;
            }
            this.updateAnimation();
            return;
        }

        if (this.path.length > 0) {
            super.update();
            return;
        }

        if (this.patrolPath.length > 0 && this.isPatrolling) {
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

    // Unified patrol path generation
    generatePatrolPath(type, centerX, centerZ) {
        const generators = {
            circle: () => [
                {x: centerX + 1, z: centerZ - 1}, {x: centerX + 1, z: centerZ}, {x: centerX + 1, z: centerZ + 1},
                {x: centerX, z: centerZ + 1}, {x: centerX - 1, z: centerZ + 1}, {x: centerX - 1, z: centerZ},
                {x: centerX - 1, z: centerZ - 1}, {x: centerX, z: centerZ - 1}
            ],
            square: () => [
                {x: centerX - 2, z: centerZ - 2}, {x: centerX + 2, z: centerZ - 2},
                {x: centerX + 2, z: centerZ + 2}, {x: centerX - 2, z: centerZ + 2}
            ],
            line: () => [
                {x: centerX - 3, z: centerZ}, {x: centerX + 3, z: centerZ}, {x: centerX, z: centerZ},
                {x: centerX, z: centerZ - 2}, {x: centerX, z: centerZ + 2}
            ],
            random: () => Array.from({length: 5}, () => ({
                x: Math.floor(centerX + (Math.random() - 0.5) * 6),
                z: Math.floor(centerZ + (Math.random() - 0.5) * 6)
            })),
            figure8: () => [
                {x: centerX, z: centerZ - 2}, {x: centerX + 1, z: centerZ - 1}, {x: centerX, z: centerZ},
                {x: centerX - 1, z: centerZ + 1}, {x: centerX, z: centerZ + 2}, {x: centerX + 1, z: centerZ + 1},
                {x: centerX, z: centerZ}, {x: centerX - 1, z: centerZ - 1}
            ]
        };

        return generators[type] ? generators[type]() : generators.circle();
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

    initInput() {
        // Override empty method from Player
    }
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
                console.log(`Before mirroring - scale.x: ${this.sprite.scale.x}`);
                this.sprite.scale.x = Math.abs(this.sprite.scale.x) * -1;
                console.log(`After scale flip - scale.x: ${this.sprite.scale.x}`);

                if (this.setFrameUV && this.texW && this.texH) {
                    this.facingLeft = true;
                    const frame = this.animations.idle.frames[0];
                    this.setFrameUV(frame.x, frame.y, 64, 64, this.texW, this.texH);
                    console.log(`Applied UV flipping for ${this.name}`);
                }

                console.log(`✓ Applied mirroring to ${this.name}`);
                return;
            } else {
                setTimeout(checkAndApply, 100);
            }
        };

        checkAndApply();
    }

    interact() {
        return null;
    }

    update() {
        return;
    }
}

// Initialization function
(function() {
    const initNPCs = () => {
        if (typeof game !== 'undefined' && game.terrain && game.scene) {
            const npcIds = ['elder_marcus', 'merchant_sara', 'merchant_mara', 'wise_elena', 'scout_mike', 'healer_rose', 'guard_tom', 'trader_jack', 'trader_jill'];
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

            game.npcs.forEach(npc => {
                const tile = game.terrain.getTile(npc.pos.x, npc.pos.z);
                if (tile) {
                    game.interactables.push({
                        mesh: npc.sprite || {
                            position: {
                                x: tile.mesh.position.x,
                                y: tile.mesh.position.y + 1,
                                z: tile.mesh.position.z
                            }
                        },
                        x: npc.pos.x,
                        z: npc.pos.z,
                        type: 'npc',
                        message: npc.name || 'Friendly NPC',
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
