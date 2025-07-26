class CameraSystem {
    constructor(game) {
        this.game = game;
        this.cameraTarget = new THREE.Vector3();
        this.cameraOffset = new THREE.Vector3(10, 10, 10);
        this.zoomLevel = 1.0;
        this.followTarget = null;
         this.initialCameraState = {
        position: new THREE.Vector3(),
        target: new THREE.Vector3(),
        zoom: 1.0,
        preset: 'default'
    };
        this.cameraPresets = {
            default: {
                type: 'orthographic',
                offset: new THREE.Vector3(10, 10, 10),
                zoom: 1.0,
                followPlayer: false,
                lookAtTarget: true
            },
            followPlayer: {
                type: 'orthographic',
                offset: new THREE.Vector3(6, 9, 10),
                zoom: 0.753,
                followPlayer: true,
                lookAtTarget: true
            },
            overview: {
                type: 'orthographic',
                offset: new THREE.Vector3(20, 25, 20),
                zoom: 2.5,
                followPlayer: false,
                lookAtTarget: true,
                centerTarget: true
            },
            thirdPerson: {
                type: 'perspective',
                offset: new THREE.Vector3(3, 10, 3),
                fov: 22,
                followPlayer: true,
                lookAtPlayer: true
            },
            followAndMove: {
    type: 'perspective',
    offset: new THREE.Vector3(5, 8, 5),
    fov: 60,
    followPlayer: true,
    lookAtPlayer: true,
    smoothFollow: true
}
        };
        
        this.cameraTransition = {
            active: false,
            duration: 2000,
            startTime: 0,
            fromPosition: new THREE.Vector3(),
            toPosition: new THREE.Vector3(),
            fromTarget: new THREE.Vector3(),
            toTarget: new THREE.Vector3(),
            fromZoom: 1.0,
            toZoom: 1.0,
            callback: null
        };
        
        this.currentCameraPreset = 'default';
        this._hue = undefined;
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20 * this.zoomLevel;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            -100,
            1000
        );
        this.updateCameraPosition();
    }

    setCameraPreset(presetName, smooth = true, callback = null) {
        console.log(`CameraSystem: Setting camera preset to ${presetName}`);
        
        // Clean up any existing dialogs - moved here to ensure it happens
        const existingDialog = document.getElementById('confirmationDialog');
        if (existingDialog) {
            console.log('CameraSystem: Removing existing dialog');
            existingDialog.remove();
        }
        const npcDialog = document.getElementById('npcQuestionDialog');
        if (npcDialog) {
            console.log('CameraSystem: Removing NPC dialog');
            npcDialog.remove();
        }

        if (!this.cameraPresets[presetName]) {
            console.warn(`Camera preset '${presetName}' not found`);
            return;
        }

        const preset = this.cameraPresets[presetName];
        this.currentCameraPreset = presetName;
        
        console.log(`CameraSystem: Applying preset ${presetName}`, preset);

        // Switch camera type if needed
        if (preset.type !== this.getCameraType()) {
            console.log(`CameraSystem: Switching camera type to ${preset.type}`);
            this.switchCameraType(preset.type, preset);
        }

        if (smooth && this.camera) {
            console.log('CameraSystem: Starting smooth transition');
            this.cameraTransition.active = true;
            this.cameraTransition.startTime = Date.now();
            this.cameraTransition.callback = callback;
            this.cameraTransition.fromPosition.copy(this.camera.position);
            this.cameraTransition.fromTarget.copy(this.cameraTarget);
            this.cameraTransition.fromZoom = this.zoomLevel;

            this.calculateCameraTarget(preset, this.cameraTransition.toTarget);
            this.cameraTransition.toPosition.copy(this.cameraTransition.toTarget).add(preset.offset);
            this.cameraTransition.toZoom = preset.zoom || 1.0;
        } else {
            console.log('CameraSystem: Applying preset immediately');
            this.applyCameraPreset(preset);
            if (callback) callback();
        }
    }

    getCameraType() {
        return this.camera.isOrthographicCamera ? 'orthographic' : 'perspective';
    }

    switchCameraType(type, preset) {
        const currentPos = this.camera.position.clone();
        const aspect = window.innerWidth / window.innerHeight;

        if (type === 'perspective' && this.camera.isOrthographicCamera) {
            this.camera = new THREE.PerspectiveCamera(preset.fov || 60, aspect, 0.1, 1000);
        } else if (type === 'orthographic' && this.camera.isPerspectiveCamera) {
            const frustumSize = 20 * (preset.zoom || 1.0);
            this.camera = new THREE.OrthographicCamera(
                frustumSize * aspect / -2,
                frustumSize * aspect / 2,
                frustumSize / 2,
                frustumSize / -2,
                -100,
                1000
            );
        }

        this.camera.position.copy(currentPos);
        
        // Update the game's camera reference
        this.game.camera = this.camera;
    }

calculateCameraTarget(preset, targetVector) {
    if (preset.followPlayer && this.game.player && this.game.player.sprite) {
        targetVector.copy(this.game.player.sprite.position);
        targetVector.y = 0;
        
        // Add screen offset for followPlayer preset to show player lower on screen
        if (this.currentCameraPreset === 'followPlayer') {
            // Offset the target so player appears lower on screen
            // Adjust these values to control where the player appears
            const screenOffsetX = -2;  // Negative moves player right on screen
            const screenOffsetZ = 3;   // Positive moves player down on screen
            targetVector.x += screenOffsetX;
            targetVector.z += screenOffsetZ;
        }
    } else if (preset.centerTarget) {
        targetVector.set(0, 0, 0);
    } else {
        targetVector.copy(this.cameraTarget);
    }
}

    applyCameraPreset(preset) {
        this.calculateCameraTarget(preset, this.cameraTarget);

        if (preset.type === 'perspective') {
            if (preset.followPlayer && this.game.player && this.game.player.sprite) {
                this.camera.position.copy(this.game.player.sprite.position).add(preset.offset);
                
                if (preset.lookAtPlayer) {
                    this.camera.lookAt(this.game.player.sprite.position);
                } else if (preset.lookDirection) {
                    const lookTarget = this.game.player.sprite.position.clone()
                        .add(preset.lookDirection.clone().multiplyScalar(100));
                    this.camera.lookAt(lookTarget);
                }
            }
        } else {
            this.zoomLevel = preset.zoom || 1.0;
            this.cameraOffset.copy(preset.offset);
            this.updateCameraPosition();

            const aspect = window.innerWidth / window.innerHeight;
            const frustumSize = 20 * this.zoomLevel;
            this.camera.left = frustumSize * aspect / -2;
            this.camera.right = frustumSize * aspect / 2;
            this.camera.top = frustumSize / 2;
            this.camera.bottom = frustumSize / -2;
            this.camera.updateProjectionMatrix();
        }
    }

    panCamera(deltaX, deltaY) {
        const speed = 0.01 * this.zoomLevel;
        const moveX = new THREE.Vector3(1, 0, -1).normalize();
        const moveY = new THREE.Vector3(1, 0, 1).normalize();
        
        this.cameraTarget.add(moveX.clone().multiplyScalar(-deltaX * speed));
        this.cameraTarget.add(moveY.clone().multiplyScalar(-deltaY * speed));
        
        const maxBounds = this.game.gridSize * this.game.tileSize / 2;
        this.cameraTarget.x = Math.max(-maxBounds, Math.min(maxBounds, this.cameraTarget.x));
        this.cameraTarget.z = Math.max(-maxBounds, Math.min(maxBounds, this.cameraTarget.z));
    }

    zoomCamera(delta) {
        this.zoomLevel = Math.max(0.3, Math.min(3, this.zoomLevel + delta));
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20 * this.zoomLevel;
        
        Object.assign(this.camera, {
            left: frustumSize * aspect / -2,
            right: frustumSize * aspect / 2,
            top: frustumSize / 2,
            bottom: frustumSize / -2
        });
        
        this.camera.updateProjectionMatrix();
    }

    updateCameraPosition() {
        this.camera.position.copy(this.cameraTarget.clone().add(this.cameraOffset));
        this.camera.lookAt(this.cameraTarget);
    }

    handleKeyboardCameraInput() {
        const speed = 0.3;
        const keys = this.game.input.keys;
        const direction = new THREE.Vector3();

        // Camera movement
        if (keys.KeyW || keys.ArrowUp) direction.add(new THREE.Vector3(-1, 0, -1));
        if (keys.KeyS || keys.ArrowDown) direction.add(new THREE.Vector3(1, 0, 1));
        if (keys.KeyA || keys.ArrowLeft) direction.add(new THREE.Vector3(-1, 0, 1));
        if (keys.KeyD || keys.ArrowRight) direction.add(new THREE.Vector3(1, 0, -1));

        // Camera preset keys
        if (this.game.input.keys.Digit1 && !this.game.input.keys._1Pressed) {
            this.game.input.keys._1Pressed = true;
            this.setCameraPreset('default', true);
            this.game.showInteractionMessage('Camera: Default View');
        } else if (!this.game.input.keys.Digit1) {
            this.game.input.keys._1Pressed = false;
        }

        if (this.game.input.keys.Digit2 && !this.game.input.keys._2Pressed) {
            this.game.input.keys._2Pressed = true;
            this.setCameraPreset('followPlayer', true);
            this.game.showInteractionMessage('Camera: Follow Player');
        } else if (!this.game.input.keys.Digit2) {
            this.game.input.keys._2Pressed = false;
        }

        if (this.game.input.keys.Digit3 && !this.game.input.keys._3Pressed) {
            this.game.input.keys._3Pressed = true;
            this.setCameraPreset('overview', true);
            this.game.showInteractionMessage('Camera: Overview');
        } else if (!this.game.input.keys.Digit3) {
            this.game.input.keys._3Pressed = false;
        }

        if (this.game.input.keys.Digit4 && !this.game.input.keys._4Pressed) {
            this.game.input.keys._4Pressed = true;
            this.setCameraPreset('thirdPerson', true);
            this.game.showInteractionMessage('Camera: Third Person');
        } else if (!this.game.input.keys.Digit4) {
            this.game.input.keys._4Pressed = false;
        }

        if (this.game.input.keys.Digit5 && !this.game.input.keys._5Pressed) {
            this.game.input.keys._5Pressed = true;
            this.setCameraPreset('firstPerson', true);
            this.game.showInteractionMessage('Camera: First Person');
        } else if (!this.game.input.keys.Digit5) {
            this.game.input.keys._5Pressed = false;
        }

        // Lighting controls
        if (this.game.input.keys.KeyI) {
            this.game.directionalLight.intensity = Math.min(2.0, this.game.directionalLight.intensity + 0.01);
        }

        if (this.game.input.keys.KeyK) {
            this.game.directionalLight.intensity = Math.max(0.0, this.game.directionalLight.intensity - 0.01);
        }

        if (this.game.input.keys.KeyJ) {
            this._hue = (this._hue || 0) + 1;
            this.game.directionalLight.color.setHSL((this._hue % 360) / 360, 1, 0.9);
        }

        if (this.game.input.keys.KeyL) {
            this._hue = (this._hue || 0) - 1;
            this.game.directionalLight.color.setHSL((this._hue % 360) / 360, 1, 0.9);
        }

        if (this.game.input.keys.KeyU) {
            this.game.directionalLight.color.set(0xfff6e0);
            this._hue = undefined;
        }

        // Apply movement
        if (direction.lengthSq() > 0) {
            direction.normalize().multiplyScalar(speed);
            this.cameraTarget.add(direction);
        }

        // Zoom controls
        if (keys.KeyQ) this.zoomCamera(0.02);
        if (keys.KeyE) this.zoomCamera(-0.02);

        // Clamp camera bounds
        const maxBounds = this.game.gridSize * this.game.tileSize / 2;
        this.cameraTarget.clamp(
            new THREE.Vector3(-maxBounds, 0, -maxBounds),
            new THREE.Vector3(maxBounds, 0, maxBounds)
        );
    }

    updateCameraTransition() {
        if (this.cameraTransition && this.cameraTransition.active) {
            const elapsed = Date.now() - this.cameraTransition.startTime;
            const progress = Math.min(elapsed / this.cameraTransition.duration, 1.0);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            this.camera.position.lerpVectors(
                this.cameraTransition.fromPosition,
                this.cameraTransition.toPosition,
                easeProgress
            );
            
            this.cameraTarget.lerpVectors(
                this.cameraTransition.fromTarget,
                this.cameraTransition.toTarget,
                easeProgress
            );

            if (this.camera.isOrthographicCamera) {
                this.zoomLevel = THREE.MathUtils.lerp(
                    this.cameraTransition.fromZoom,
                    this.cameraTransition.toZoom,
                    easeProgress
                );
                
                const aspect = window.innerWidth / window.innerHeight;
                const frustumSize = 20 * this.zoomLevel;
                this.camera.left = frustumSize * aspect / -2;
                this.camera.right = frustumSize * aspect / 2;
                this.camera.top = frustumSize / 2;
                this.camera.bottom = frustumSize / -2;
                this.camera.updateProjectionMatrix();
            }

            if (progress >= 1.0) {
                console.log('CameraSystem: Transition completed');
                this.cameraTransition.active = false;
                if (this.cameraTransition.callback) {
                    this.cameraTransition.callback();
                }
            }
        }
    }
updateFollowPlayer(){
    const currentPreset=this.cameraPresets?.[this.currentCameraPreset];
    if(currentPreset&&currentPreset.followPlayer&&this.game.player&&this.game.player.sprite){
        if(!this.cameraTransition.active){
            if(currentPreset.type==='perspective'){
                this.camera.position.copy(this.game.player.sprite.position).add(currentPreset.offset);
                if(currentPreset.lookAtPlayer){
                    this.camera.lookAt(this.game.player.sprite.position)
                }else if(currentPreset.lookDirection){
                    let lookDirection=new THREE.Vector3(0,0,-1);
                    if(this.game.player.path&&this.game.player.path.length>0){
                        const next=this.game.player.path[0];
                        const dx=next.x-this.game.player.pos.x;
                        const dz=next.z-this.game.player.pos.z;
                        if(dx!==0||dz!==0){
                            lookDirection.set(dx,0,dz).normalize()
                        }
                    }else if(this.game.player.facingLeft!==undefined){
                        lookDirection.set(this.game.player.facingLeft?-1:1,0,0)
                    }
                    const lookTarget=this.game.player.sprite.position.clone().add(lookDirection.multiplyScalar(50));
                    this.camera.lookAt(lookTarget)
                }
            }else{
                // For orthographic isometric camera
                this.cameraTarget.copy(this.game.player.sprite.position);
                this.cameraTarget.y=0;
                
                // Offset the target in isometric coordinates to show player lower on screen
                if(this.currentCameraPreset === 'followPlayer') {
                    // In isometric view, to move player down on screen we need to move target forward
                    this.cameraTarget.x += -5;  // Move target forward (player appears lower)
                    this.cameraTarget.z += -5;  // Move target forward (player appears lower)
                }
            }
        }
    }
}
// In camera.js - Add this method to set follow target:
setFollowTarget(target) {
    this.followTarget = target;
}
saveInitialCameraState() {
    if (this.camera) {
        this.initialCameraState.position.copy(this.camera.position);
        this.initialCameraState.target.copy(this.cameraTarget);
        this.initialCameraState.zoom = this.zoomLevel;
        this.initialCameraState.preset = this.currentCameraPreset;
        console.log('Initial camera state saved:', this.initialCameraState);
    }
}
restoreToInitialState(smooth = true, callback = null) {
    console.log('Restoring to initial camera state');
    
    if (smooth && this.camera) {
        this.cameraTransition.active = true;
        this.cameraTransition.startTime = Date.now();
        this.cameraTransition.callback = callback;
        this.cameraTransition.fromPosition.copy(this.camera.position);
        this.cameraTransition.fromTarget.copy(this.cameraTarget);
        this.cameraTransition.fromZoom = this.zoomLevel;
        
        this.cameraTransition.toPosition.copy(this.initialCameraState.position);
        this.cameraTransition.toTarget.copy(this.initialCameraState.target);
        this.cameraTransition.toZoom = this.initialCameraState.zoom;
        
        // Set the preset without applying it immediately (transition handles it)
        this.currentCameraPreset = this.initialCameraState.preset;
    } else {
        // Immediate restore
        this.camera.position.copy(this.initialCameraState.position);
        this.cameraTarget.copy(this.initialCameraState.target);
        this.zoomLevel = this.initialCameraState.zoom;
        this.currentCameraPreset = this.initialCameraState.preset;
        this.updateCameraPosition();
        
        if (this.camera.isOrthographicCamera) {
            const aspect = window.innerWidth / window.innerHeight;
            const frustumSize = 20 * this.zoomLevel;
            this.camera.left = frustumSize * aspect / -2;
            this.camera.right = frustumSize * aspect / 2;
            this.camera.top = frustumSize / 2;
            this.camera.bottom = frustumSize / -2;
            this.camera.updateProjectionMatrix();
        }
        
        if (callback) callback();
    }
}
// In camera.js - Add this method to clear follow target:
clearFollowTarget() {
    this.followTarget = null;
}


    handleResize() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20 * this.zoomLevel;
        
        Object.assign(this.camera, {
            left: frustumSize * aspect / -2,
            right: frustumSize * aspect / 2,
            top: frustumSize / 2,
            bottom: frustumSize / -2
        });
        
        this.camera.updateProjectionMatrix();
    }

    update() {
        this.updateCameraTransition();
        this.updateFollowPlayer();
        this.updateCameraPosition();
    }
}
