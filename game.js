
        const USE_SPRITE_PLAYER = true; // Set to false for cylinder player
        const USE_SPRITE_TERRAIN = true; // Set to true for sprite terrain, false for 3D tiles
        class GameEngine {
            constructor() {
                this.gridSize = 16; this.tileSize = 2; this.heightLevels = 8;
                this.cameraTarget = new THREE.Vector3(); this.cameraOffset = new THREE.Vector3(10, 10, 10); this.zoomLevel = 1.0;
                this.editMode = false; this.selectedTile = null; this.raycaster = new THREE.Raycaster(); this.mouse = new THREE.Vector2();
                this.input = { keys: {}, mouse: { x: 0, y: 0, pressed: false }, touch: { active: false, pinchDistance: 0, moved: false } };
                this.debugSystem = typeof DebugSystem !== 'undefined' ? new DebugSystem(this) : null;
                this.cloudSprites = [];
                this.terrainSystem = new TerrainSystem(this.gridSize, this.tileSize, this.heightLevels, USE_SPRITE_TERRAIN);
                this.interactables = [];
                this.proximityRadius = 2.5;
                this.activeTooltip = null;
                this.init();
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
        offset: new THREE.Vector3(8, 8, 8),
        zoom: 0.7,
        followPlayer: true,
        lookAtTarget: true
    },
    overview: {
        type: 'orthographic',
        offset: new THREE.Vector3(20, 25, 20),
        zoom: 2.5,
        followPlayer: false,
        lookAtTarget: true,
        centerTarget: true // Center on map
    },
    thirdPerson: {
        type: 'perspective',
        offset: new THREE.Vector3(3, 4, 3),
        fov: 60,
        followPlayer: true,
        lookAtPlayer: true
    },
    firstPerson: {
        type: 'perspective',
        offset: new THREE.Vector3(0, 1.5, 0),
        fov: 75,
        followPlayer: true,
        lookAtPlayer: false,
        lookDirection: new THREE.Vector3(0, 0, -1)
    }
};

this.cameraTransition = {
    active: false,
    duration: 2000, // 2 seconds
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

            }

            init() {
                this.setupRenderer(); this.setupCamera(); this.setupScene(); this.setupLighting();
                this.setupClouds(); 
                this.setupTerrain(); 
                this.setupInput(); this.setupUI();this.setupInteractables();
                this.player = new Player(this); this.start();
            }

            setupRenderer() {
                this.canvas = document.getElementById('gameCanvas');
                this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
                this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); this.renderer.setSize(innerWidth, innerHeight);
                this.renderer.setClearColor(0x4FB3D9); this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            }

            setupCamera() {
    const aspect = innerWidth / innerHeight, frustumSize = 20 * this.zoomLevel;
    this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, -100, 1000);
    this.updateCameraPosition();
}


setCameraPreset(presetName, smooth = true, callback = null) {
    // Close any dialogs that might interfere
    const existingDialog = document.getElementById('confirmationDialog');
    if (existingDialog) existingDialog.remove();
    const npcDialog = document.getElementById('npcQuestionDialog');
    if (npcDialog) npcDialog.remove();

    if (!this.cameraPresets[presetName]) {
        console.warn(`Camera preset '${presetName}' not found`);
        return;
    }

    const preset = this.cameraPresets[presetName];
    this.currentCameraPreset = presetName;

    // Switch camera type first if needed
    if (preset.type !== this.getCameraType()) {
        this.switchCameraType(preset.type, preset);
    }

    if (smooth && this.camera) {
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
        this.applyCameraPreset(preset);
        if (callback) callback();
    }
}

// Add this method to GameEngine class
getCameraType() {
    return this.camera.isOrthographicCamera ? 'orthographic' : 'perspective';
}

// Add this method to GameEngine class
switchCameraType(type, preset) {
    const currentPos = this.camera.position.clone();
    const aspect = window.innerWidth / window.innerHeight;
    
    if (type === 'perspective' && this.camera.isOrthographicCamera) {
        // Switch to perspective camera
        this.camera = new THREE.PerspectiveCamera(
            preset.fov || 60,
            aspect,
            0.1,
            1000
        );
    } else if (type === 'orthographic' && this.camera.isPerspectiveCamera) {
        // Switch to orthographic camera
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
}

calculateCameraTarget(preset, targetVector) {
    if (preset.followPlayer && this.player && this.player.sprite) {
        targetVector.copy(this.player.sprite.position);
        targetVector.y = 0; // Keep target at ground level
    } else if (preset.centerTarget) {
        // Center on map
        targetVector.set(0, 0, 0);
    } else {
        // Use current target or default
        targetVector.copy(this.cameraTarget);
    }
}


applyCameraPreset(preset) {
    this.calculateCameraTarget(preset, this.cameraTarget);
    
    if (preset.type === 'perspective') {
        if (preset.followPlayer && this.player && this.player.sprite) {
            this.camera.position.copy(this.player.sprite.position).add(preset.offset);
            
            if (preset.lookAtPlayer) {
                this.camera.lookAt(this.player.sprite.position);
            } else if (preset.lookDirection) {
                // Fix: For first-person, use a much longer look distance
                const lookTarget = this.player.sprite.position.clone().add(preset.lookDirection.clone().multiplyScalar(100));
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

            setupScene() { this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(0x4FB3D9, 30, 100); }

            setupLighting() {
                this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
                this.directionalLight = new THREE.DirectionalLight(0xfff6e0, 0.95);
                this.directionalLight.position.set(50, 50, 25); this.directionalLight.castShadow = true;
                this.directionalLight.shadow.mapSize.setScalar(2048);
                Object.assign(this.directionalLight.shadow.camera, { near: 0.1, far: 200, left: -50, right: 50, top: 50, bottom: -50 });
                this.scene.add(this.directionalLight);
            }
showConfirmationDialog(interactable, callback) {
    // Remove any existing dialog
    const existingDialog = document.getElementById('confirmationDialog');
    if (existingDialog) existingDialog.remove();

    const dialog = document.createElement('div');
    dialog.id = 'confirmationDialog';
    dialog.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 20px;
        border-radius: 12px;
        border: 0px solid #4fc3f7;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
        z-index: 1000;
        min-width: 280px;
        text-align: center;
        font-family: Arial, sans-serif;
    `;

    const message = this.getConfirmationMessage(interactable);
    
    dialog.innerHTML = `
        <div style="font-size: 16px; margin-bottom: 16px; line-height: 1.4;">
            <strong>${interactable.message}</strong>
            <div style="margin-top: 8px; font-size: 14px; opacity: 0.9;">
                ${message}
            </div>
        </div>
        <div style="display: flex; gap: 12px; justify-content: center;">
            <button id="confirmYes" style="
                background: #43aa8b;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            ">Yes</button>
            <button id="confirmNo" style="
                background: #f3722c;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            ">No</button>
        </div>
    `;

    document.body.appendChild(dialog);

    // Add hover effects
    const yesBtn = dialog.querySelector('#confirmYes');
    const noBtn = dialog.querySelector('#confirmNo');
    
    yesBtn.onmouseover = () => yesBtn.style.background = '#4fc3f7';
    yesBtn.onmouseout = () => yesBtn.style.background = '#43aa8b';
    noBtn.onmouseover = () => noBtn.style.background = '#f9844a';
    noBtn.onmouseout = () => noBtn.style.background = '#f3722c';

    // Handle responses
    yesBtn.onclick = () => {
        dialog.remove();
        callback(true);
    };
    
    noBtn.onclick = () => {
        dialog.remove();
        callback(false);
    };

    // Allow ESC to cancel
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            dialog.remove();
            document.removeEventListener('keydown', handleKeydown);
            callback(false);
        }
    };
    document.addEventListener('keydown', handleKeydown);
}


getConfirmationMessage(interactable) {
    switch(interactable.type) {
        case 'npc':
            return 'Do you want to talk to this NPC? They might have useful information or quests.';
        case 'npc_confirmation': // Add this new case
            return interactable.message; // Use the custom confirmation message
        case 'chest':
            return 'Do you want to open this ancient chest? It might contain treasure... or traps.';
        case 'tree':
            return 'Do you want to examine this old tree? The whispers might reveal ancient secrets.';
        case 'crystal':
            return 'Do you want to collect this magical crystal? It will disappear forever.';
        case 'shrine':
            return 'Do you want to pray at this mysterious shrine? Ancient powers await.';
        default:
            return 'Do you want to interact with this object?';
    }
}


executeInteraction(interactable){
    let message='';
    switch(interactable.type){
        case 'npc':
            if(interactable.npcRef){
                message = interactable.npcRef.interact();
                // Only show the message if it's not a confirmation dialog
                if(message){
                    this.showInteractionMessage(message);
                }
                return; // Important: return early to avoid showing generic message
            }else{
                message="The NPC nods at you silently.";
            }
            break;
        case 'chest':
            message='You found 50 gold coins!';
            break;
        case 'tree':
            message='The ancient tree whispers secrets of the forest...';
            break;
        case 'crystal':
            message='The crystal glows brightly and fills you with energy!';
            this.scene.remove(interactable.mesh);
            this.interactables=this.interactables.filter(i=>i!==interactable);
            this.hideTooltip();
            break;
        case 'shrine':
            message='You feel blessed by an ancient power...';
            break;
    }
    
    if(message){
        this.showInteractionMessage(message);
    }
}

showMessage(text) {
    // Reuse existing interaction message system
    this.showInteractionMessage(text);
}
            setupClouds() {
                const loader = new THREE.TextureLoader();
                loader.load('https://i.imgur.com/mYRt74O.png', texture => {
                    for (let i = 0; i < 6; i++) {
                        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, opacity: 0.7, transparent: true }));
                        sprite.position.set((Math.random() - 0.5) * this.gridSize * this.tileSize, 8 + Math.random() * 2, (Math.random() - 0.5) * this.gridSize * this.tileSize);
                        sprite.scale.set(8 + Math.random() * 6, 4 + Math.random() * 2, 1);
                        sprite.userData.speed = 0.01 * (0.5 + Math.random() * 0.2);
                        this.scene.add(sprite); this.cloudSprites.push(sprite);
                    }
                });
            }
// const seed = "0000000000000000000003333332000000003344443320000003477777743200003473322337432003373222222373300347322222237430034722222222743003472222222274300347321111237430033732222223733000347332233743200023477777743200000233444433220000002333333200000000000000000000";

setupTerrain() {
    this.terrainSystem.generateTerrain();
    const seed = "9877766666677789877665555556677877665544445566777665444334445667765443333334456765543322223345566544321111234456654332100123345665433210012334566544321111234456655433222233455676544333333445677665444334445667776655444455667787766555555667789877766666677789";
    this.terrainSystem.loadFromSeed(seed);
    this.scene.add(this.terrainSystem.terrainGroup);
    
    // Make terrain accessible for backward compatibility
    this.terrain = this.terrainSystem;
}

            setupInput() {
                ['keydown', 'keyup'].forEach(evt => addEventListener(evt, e => this.input.keys[e.code] = evt === 'keydown'));
                ['mousedown', 'mousemove', 'mouseup'].forEach(evt => this.canvas.addEventListener(evt, e => this.handleMouse(evt, e)));
                this.canvas.addEventListener('click', e => this.editMode && this.handleTileClick(e));
                this.canvas.addEventListener('wheel', e => { e.preventDefault(); this.zoomCamera(e.deltaY > 0 ? 0.1 : -0.1); });
                ['touchstart', 'touchmove', 'touchend'].forEach(evt => {
    const methodName = 'handleTouch' + evt.slice(5).charAt(0).toUpperCase() + evt.slice(6);
    this.canvas.addEventListener(evt, e => {
        e.preventDefault();
        if (typeof this[methodName] === 'function') {
            this[methodName](e);
        }
    });
});

                addEventListener('resize', () => this.handleResize());
            }

            setupUI() {
                 document.getElementById('editToggle').onclick = () => this.togglePanel('edit');
    document.getElementById('raiseBtn').onclick = () => this.modifySelected(1);
    document.getElementById('lowerBtn').onclick = () => this.modifySelected(-1);
    document.getElementById('clearBtn').onclick = () => confirm('Clear all terrain?') && this.clearTerrain();
const slider = document.getElementById('lightSlider');
slider.oninput = e => {
  this.directionalLight.intensity = parseFloat(e.target.value);
};

['lx','ly','lz'].forEach(axis => {
  document.getElementById(axis).oninput = e =>
    this.directionalLight.position[axis[1]] = parseFloat(e.target.value);
});
document.getElementById('lcolor').oninput = e =>
  this.directionalLight.color.set(e.target.value);

            }


            togglePanel(type) {
    // Keep only the edit mode logic, remove debug and spriteDebug cases
    this.editMode = !this.editMode;
    const panel = document.getElementById('editPanel');
    const btn = document.getElementById('editToggle');
    const ind = document.getElementById('editIndicator');
    
    panel.classList.toggle('visible', this.editMode);
    btn.classList.toggle('active', this.editMode);
    ind.classList.toggle('visible', this.editMode);
    
    this.canvas.style.cursor = this.editMode ? 'crosshair' : 'grab';
    if (!this.editMode) this.clearSelection();
}

            handleMouse(evt, e) {
                const m = this.input.mouse;
                if (evt === 'mousedown') { m.pressed = true; m.x = e.clientX; m.y = e.clientY; }
                else if (evt === 'mousemove' && m.pressed && !this.editMode) this.panCamera(e.clientX - m.x, e.clientY - m.y);
                else if (evt === 'mouseup') m.pressed = false;
                if (evt !== 'mouseup') { m.x = e.clientX; m.y = e.clientY; }
            }

            handleTileClick(e) {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.terrainSystem.terrainGroup.children, true);
                if (intersects.length) {
                    const tile = intersects[0].object.userData;
                    this.selectTile(tile.x, tile.z);
                    if (e.shiftKey) this.modifyTileHeight(tile.x, tile.z, -1);
                    else if (e.ctrlKey || e.metaKey) this.setTileHeight(tile.x, tile.z, 0);
                    else this.modifyTileHeight(tile.x, tile.z, 1);
                }
            }

            selectTile(x, z) {
                const tile = this.terrainSystem.getTile(x, z);
                if (tile) { 
                    this.selectedTile = { x, z, height: tile.height }; 
                    this.updateEditUI(); this.highlightTile(tile.mesh); 
                }
            }

            clearSelection() { this.selectedTile = null; this.updateEditUI(); this.removeHighlight(); }

            highlightTile(mesh) {
    this.removeHighlight();
    
    if (USE_SPRITE_TERRAIN && mesh.isGroup) {
        // For sprite terrain, create a simple outline around the tile base
        const tileSize = this.tileSize * 0.9;
        const geometry = new THREE.RingGeometry(tileSize * 0.6, tileSize * 0.65, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            transparent: true, 
            opacity: 0.8,
            side: THREE.DoubleSide 
        });
        
        this.tileHighlight = new THREE.Mesh(geometry, material);
        this.tileHighlight.rotation.x = -Math.PI / 2;
        this.tileHighlight.position.copy(mesh.position);
        
        // Position slightly above the tile
        const tile = this.getTileFromMesh(mesh);
        if (tile) {
            this.tileHighlight.position.y = 0.5 + tile.height * 0.5 + 0.02;
        }
        
        this.scene.add(this.tileHighlight);
    } else {
        // Original 3D tile highlighting
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        this.tileHighlight = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 }));
        this.tileHighlight.position.copy(mesh.position); 
        this.tileHighlight.position.y += 0.01; 
        this.scene.add(this.tileHighlight);
    }
}
getTileFromMesh(mesh) {
    if (mesh.userData && mesh.userData.x !== undefined) {
        return this.terrainSystem.getTile(mesh.userData.x, mesh.userData.z);
    }
    return null;
}

            removeHighlight() {
                if (this.tileHighlight) { 
                    this.scene.remove(this.tileHighlight); 
                    this.tileHighlight.geometry.dispose(); 
                    this.tileHighlight.material.dispose(); 
                    this.tileHighlight = null; 
                }
            }

            modifySelected(delta) { this.selectedTile && this.modifyTileHeight(this.selectedTile.x, this.selectedTile.z, delta); }

            modifyTileHeight(x, z, delta) {
                const tile = this.terrainSystem.getTile(x, z);
                if (tile) {
                    const newHeight = Math.max(0, Math.min(this.heightLevels - 1, tile.height + delta));
                    if (newHeight !== tile.height) {
                        this.terrainSystem.updateTileHeight(x, z, newHeight);
                        if (this.selectedTile?.x === x && this.selectedTile?.z === z) { 
                            this.selectedTile.height = newHeight; 
                            this.updateEditUI(); 
                            this.highlightTile(tile.mesh); 
                        }
                    }
                }
            }

            setTileHeight(x, z, height) {
                const tile = this.terrainSystem.getTile(x, z);
                if (tile && tile.height !== height) {
                    this.terrainSystem.updateTileHeight(x, z, height);
                    if (this.selectedTile?.x === x && this.selectedTile?.z === z) { 
                        this.selectedTile.height = height; 
                        this.updateEditUI(); 
                        this.highlightTile(tile.mesh); 
                    }
                }
            }

            clearTerrain() {
    this.terrainSystem.clearTerrain();
    this.clearSelection();
}

            updateEditUI() {
                const elems = ['selectedTile', 'selectedHeight', 'raiseBtn', 'lowerBtn'].map(id => document.getElementById(id));
                if (this.selectedTile) {
                    elems[0].textContent = `${this.selectedTile.x},${this.selectedTile.z}`; 
                    elems[1].textContent = this.selectedTile.height;
                    elems[2].disabled = !this.editMode || this.selectedTile.height >= this.heightLevels - 1;
                    elems[3].disabled = !this.editMode || this.selectedTile.height <= 0;
                } else {
                    elems[0].textContent = 'None'; elems[1].textContent = '-';
                    elems.slice(2).forEach(btn => btn.disabled = true);
                }
            }

            handleTouchStart(e) {
                const touches = e.touches;
                if (touches.length === 1) {
                    Object.assign(this.input.touch, { active: true, moved: false, start: { x: touches[0].clientX, y: touches[0].clientY } });
                } else if (touches.length === 2) {
                    this.input.touch.pinchDistance = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
                    this.input.touch.moved = false;
                }
            }

          // In handleTouchMove function, replace this section:

handleTouchMove(e){
    const touches=e.touches;
    if(touches.length===1&&this.input.touch.active){
        const delta={x:(touches[0].clientX-this.input.touch.start.x)/window.innerWidth,y:(touches[0].clientY-this.input.touch.start.y)/window.innerHeight};
        const distance=Math.hypot(delta.x,delta.y);
        
        // Remove the delay threshold - respond immediately to any movement
        if(distance > 0 && !this.editMode){
            this.input.touch.moved = true;
            this.panCamera(delta.x * 70, delta.y * 70);
        }
    }else if(touches.length===2){
        const currentDist=Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
        this.zoomCamera((this.input.touch.pinchDistance-currentDist)*0.01);
        this.input.touch.pinchDistance=currentDist;
        this.input.touch.moved=!0
    }
}
handleTouchEnd(e) {
    if (this.input.touch.active && e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const wasShortTap = !this.input.touch.moved;
        
        if (this.editMode && wasShortTap) {
            // Handle tile editing
            this.handleTileClick({
                clientX: touch.clientX,
                clientY: touch.clientY,
                shiftKey: false,
                ctrlKey: false,
                metaKey: false
            });
        } else if (!this.editMode && wasShortTap) {
            // Handle player movement - only for short taps
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.set(
                ((touch.clientX - rect.left) / rect.width) * 2 - 1,
                -((touch.clientY - rect.top) / rect.height) * 2 + 1
            );
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const hits = this.raycaster.intersectObjects(this.terrainSystem.terrainGroup.children, true);
            
            if (hits.length) {
                const { x, z } = hits[0].object.userData;
                // Make sure we have a valid player before trying to move
                if (this.player && this.player.sprite) {
                    this.player.findPath(this.player.pos, { x, z }, path => {
                        this.player.path = path;
                        this.player.progress = 0;
                    });
                }
            }
        }
    }
    
    // Reset touch state
    Object.assign(this.input.touch, { active: false, start: null, moved: false });
}

            panCamera(deltaX, deltaY) {
    const speed = 0.01 * this.zoomLevel; // Reduce la velocidad para un movimiento más controlado
    const moveX = new THREE.Vector3(1, 0, -1).normalize();
    const moveY = new THREE.Vector3(1, 0, 1).normalize();
    this.cameraTarget.add(moveX.clone().multiplyScalar(-deltaX * speed));
    this.cameraTarget.add(moveY.clone().multiplyScalar(-deltaY * speed));

    const maxBounds = this.gridSize * this.tileSize / 2;
    this.cameraTarget.x = Math.max(-maxBounds, Math.min(maxBounds, this.cameraTarget.x));
    this.cameraTarget.z = Math.max(-maxBounds, Math.min(maxBounds, this.cameraTarget.z));
}

            zoomCamera(delta) {
                this.zoomLevel = Math.max(0.3, Math.min(3, this.zoomLevel + delta));
                const aspect = innerWidth / innerHeight, frustumSize = 20 * this.zoomLevel;
                Object.assign(this.camera, { left: frustumSize * aspect / -2, right: frustumSize * aspect / 2, top: frustumSize / 2, bottom: frustumSize / -2 });
                this.camera.updateProjectionMatrix();
            }

            updateCameraPosition() { this.camera.position.copy(this.cameraTarget.clone().add(this.cameraOffset)); this.camera.lookAt(this.cameraTarget); }

            handleKeyboardInput() {
                const speed = 0.3, keys = this.input.keys, direction = new THREE.Vector3();
                if (keys['KeyW'] || keys['ArrowUp']) direction.add(new THREE.Vector3(-1, 0, -1));
                if (keys['KeyS'] || keys['ArrowDown']) direction.add(new THREE.Vector3(1, 0, 1));
                if (keys['KeyA'] || keys['ArrowLeft']) direction.add(new THREE.Vector3(-1, 0, 1));
                if (keys['KeyD'] || keys['ArrowRight']) direction.add(new THREE.Vector3(1, 0, -1));
if (this.input.keys.Digit1 && !this.input.keys._1Pressed) {
    this.input.keys._1Pressed = true;
    this.setCameraPreset('default', true);
    this.showInteractionMessage('Camera: Default View');
} else if (!this.input.keys.Digit1) {
    this.input.keys._1Pressed = false;
}

if (this.input.keys.Digit2 && !this.input.keys._2Pressed) {
    this.input.keys._2Pressed = true;
    this.setCameraPreset('followPlayer', true);
    this.showInteractionMessage('Camera: Follow Player');
} else if (!this.input.keys.Digit2) {
    this.input.keys._2Pressed = false;
}

if (this.input.keys.Digit3 && !this.input.keys._3Pressed) {
    this.input.keys._3Pressed = true;
    this.setCameraPreset('overview', true);
    this.showInteractionMessage('Camera: Overview');
} else if (!this.input.keys.Digit3) {
    this.input.keys._3Pressed = false;
}

if (this.input.keys.Digit4 && !this.input.keys._4Pressed) {
    this.input.keys._4Pressed = true;
    this.setCameraPreset('thirdPerson', true);
    this.showInteractionMessage('Camera: Third Person');
} else if (!this.input.keys.Digit4) {
    this.input.keys._4Pressed = false;
}

if (this.input.keys.Digit5 && !this.input.keys._5Pressed) {
    this.input.keys._5Pressed = true;
    this.setCameraPreset('firstPerson', true);
    this.showInteractionMessage('Camera: First Person');
} else if (!this.input.keys.Digit5) {
    this.input.keys._5Pressed = false;
}

                   if (this.input.keys.KeyI) {
      this.directionalLight.intensity = Math.min(2.0, this.directionalLight.intensity + 0.01);
    }
    if (this.input.keys.KeyK) {
      this.directionalLight.intensity = Math.max(0.0, this.directionalLight.intensity - 0.01);
    }
     if (this.input.keys.KeyJ) {
      this._hue = (this._hue || 0) + 1;                  // keep a hue accumulator
      this.directionalLight.color.setHSL((this._hue%360)/360, 1, 0.9);
    }
    if (this.input.keys.KeyL) {
      this._hue = (this._hue || 0) - 1;
      this.directionalLight.color.setHSL((this._hue%360)/360, 1, 0.9);
    }
    if (this.input.keys.KeyU) {
      // back to neutral warm-white
      this.directionalLight.color.set(0xfff6e0);
      this._hue = undefined;
    }
                if (direction.lengthSq() > 0) {
                    direction.normalize().multiplyScalar(speed);
                    this.cameraTarget.add(direction);
                }
                if (keys['KeyQ']) this.zoomCamera(0.02); if (keys['KeyE']) this.zoomCamera(-0.02);
                const maxBounds = this.gridSize * this.tileSize / 2;
                this.cameraTarget.clamp(new THREE.Vector3(-maxBounds, 0, -maxBounds), new THREE.Vector3(maxBounds, 0, maxBounds));
                if (this.input.keys['KeyE'] && !this.input.keys._ePressed) {
                    this.input.keys._ePressed = true;
                    this.handleInteraction();
                } else if (!this.input.keys['KeyE']) {
                    this.input.keys._ePressed = false;
                }
            }

            handleResize() {
                const aspect = innerWidth / innerHeight, frustumSize = 20 * this.zoomLevel;
                Object.assign(this.camera, { left: frustumSize * aspect / -2, right: frustumSize * aspect / 2, top: frustumSize / 2, bottom: frustumSize / -2 });
                this.camera.updateProjectionMatrix(); this.renderer.setSize(innerWidth, innerHeight); this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
            }

            start() { this.animate(); }

            animate() {
    requestAnimationFrame(() => this.animate());
    this.update();
    this.render();
    if (this.debugSystem) {
    this.debugSystem.updatePerformanceStats();
}
}

            update() {
                this.handleKeyboardInput(); 

// Handle camera transitions
if (this.cameraTransition && this.cameraTransition.active) {

    const elapsed = Date.now() - this.cameraTransition.startTime;
    const progress = Math.min(elapsed / this.cameraTransition.duration, 1.0);
    
    // Smooth easing function
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    // Interpolate position and target
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
    
    // Interpolate zoom for orthographic cameras
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
        this.cameraTransition.active = false;
        if (this.cameraTransition.callback) {
            this.cameraTransition.callback();
        }
    }
}


// Handle camera following for active presets
 
const currentPreset = this.cameraPresets?.[this.currentCameraPreset];
if (currentPreset && currentPreset.followPlayer && this.player && this.player.sprite) {
    if (!this.cameraTransition.active) {
        if (currentPreset.type === 'perspective') {
            this.camera.position.copy(this.player.sprite.position).add(currentPreset.offset);
            
            if (currentPreset.lookAtPlayer) {
                this.camera.lookAt(this.player.sprite.position);
            } else if (currentPreset.lookDirection) {
                // Fix: First-person - calculate direction based on player movement or facing
                let lookDirection = new THREE.Vector3(0, 0, -1); // default forward
                
                if (this.player.path && this.player.path.length > 0) {
                    // Player is moving - look in movement direction
                    const next = this.player.path[0];
                    const dx = next.x - this.player.pos.x;
                    const dz = next.z - this.player.pos.z;
                    if (dx !== 0 || dz !== 0) {
                        lookDirection.set(dx, 0, dz).normalize();
                    }
                } else if (this.player.facingLeft !== undefined) {
                    // Player is idle - use facing direction
                    lookDirection.set(this.player.facingLeft ? -1 : 1, 0, 0);
                }
                
                const lookTarget = this.player.sprite.position.clone().add(lookDirection.multiplyScalar(50));
                this.camera.lookAt(lookTarget);
            }
        } else {
            this.cameraTarget.copy(this.player.sprite.position);
            this.cameraTarget.y = 0;
        }
    }
}


this.updateCameraPosition();
                this.checkProximityInteractions();
                this.cloudSprites.forEach(c => {
                    c.position.x += c.userData.speed;
                    if (c.position.x > this.gridSize * this.tileSize) c.position.x = -this.gridSize * this.tileSize;
                });
                if (this.selectedTile && this.tileHighlight) {
    const tile = this.terrainSystem.getTile(this.selectedTile.x, this.selectedTile.z);
    if (tile) { 
        this.tileHighlight.position.copy(tile.mesh.position); 
        if (USE_SPRITE_TERRAIN) {
            this.tileHighlight.position.y = 0.5 + tile.height * 0.5 + 0.02;
        } else {
            this.tileHighlight.position.y += 0.01;
        }
    }
}
                if (this.player) this.player.update();
            }

            render() { this.renderer.render(this.scene, this.camera); }

          

          


setupInteractables(){
    const interactableData=[
        {x:3,z:3,type:'chest',message:'Ancient Chest',interact:'Press E to open'},
        {x:12,z:5,type:'tree',message:'Old Oak Tree',interact:'Press E to examine'},
        {x:7,z:11,type:'crystal',message:'Magic Crystal',interact:'Press E to collect'},
        {x:14,z:14,type:'shrine',message:'Mysterious Shrine',interact:'Press E to pray'}
    ];
    
    interactableData.forEach(data=>{
        const tile=this.terrainSystem.getTile(data.x,data.z);
        if(!tile)return;
        const obj=this.createInteractableObject(data.type,data.x,data.z);
        if(obj){
            this.scene.add(obj);
            this.interactables.push({
                mesh:obj,
                x:data.x,
                z:data.z,
                type:data.type,
                message:data.message,
                interact:data.interact,
                inRange:!1
            });
        }
    });
    
    // Add NPCs to interactables after they're created
    setTimeout(() => {
        if (this.npcs) {
            this.npcs.forEach(npc => {
                if (npc.isInteractable) {
                    this.interactables.push({
                        mesh: npc.sprite,
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
        }
    }, 500);
}
createInteractableObject(type, x, z) {
    const tile = this.terrainSystem.getTile(x, z);
    if (!tile) return null;

    let geometry, material, obj;
    const height = 0.5 + tile.height * 0.5;

    switch (type) {
        case 'chest':
            geometry = new THREE.BoxGeometry(0.8, 0.6, 0.6);
            material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            obj = new THREE.Mesh(geometry, material);
            obj.position.set(tile.mesh.position.x, height + 0.3, tile.mesh.position.z);
            break;

        case 'tree':
            const trunk = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8);
            const leaves = new THREE.SphereGeometry(0.8, 8, 6);
            obj = new THREE.Group();
            
            const trunkMesh = new THREE.Mesh(trunk, new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
            const leavesMesh = new THREE.Mesh(leaves, new THREE.MeshLambertMaterial({ color: 0x228B22 }));
            
            trunkMesh.position.y = 0.75;
            leavesMesh.position.y = 1.3;
            
            obj.add(trunkMesh, leavesMesh);
            obj.position.set(tile.mesh.position.x, height, tile.mesh.position.z);
            break;

        case 'crystal':
            geometry = new THREE.OctahedronGeometry(0.4, 0);
            material = new THREE.MeshLambertMaterial({ 
                color: 0x00FFFF, 
                transparent: true, 
                opacity: 0.8,
                emissive: 0x004444
            });
            obj = new THREE.Mesh(geometry, material);
            obj.position.set(tile.mesh.position.x, height + 0.4, tile.mesh.position.z);
            break;

        case 'shrine':
            const base = new THREE.CylinderGeometry(0.6, 0.8, 0.3, 8);
            const pillar = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8);
            const top = new THREE.SphereGeometry(0.25, 8, 6);
            
            obj = new THREE.Group();
            const baseMesh = new THREE.Mesh(base, new THREE.MeshLambertMaterial({ color: 0x708090 }));
            const pillarMesh = new THREE.Mesh(pillar, new THREE.MeshLambertMaterial({ color: 0x708090 }));
            const topMesh = new THREE.Mesh(top, new THREE.MeshLambertMaterial({ 
                color: 0xFFD700, 
                emissive: 0x332200 
            }));
            
            baseMesh.position.y = 0.15;
            pillarMesh.position.y = 0.9;
            topMesh.position.y = 1.65;
            
            obj.add(baseMesh, pillarMesh, topMesh);
            obj.position.set(tile.mesh.position.x, height, tile.mesh.position.z);
            break;

        default:
            return null;
    }

    if (obj) {
        obj.castShadow = obj.receiveShadow = true;
        if (obj.children) {
            obj.children.forEach(child => {
                child.castShadow = child.receiveShadow = true;
            });
        }
    }

    return obj;
}

checkProximityInteractions(){
    if(!this.player||!this.player.sprite)return;
    let closestInteractable=null;
    let minDistance=Infinity;
    
    this.interactables.forEach(interactable=>{
        // Skip if mesh doesn't exist
        if (!interactable.mesh) return;
        
        // Update NPC position if it's an NPC interactable
        if (interactable.type === 'npc' && interactable.npcRef) {
            interactable.x = interactable.npcRef.pos.x;
            interactable.z = interactable.npcRef.pos.z;
        }
        
        const distance=Math.sqrt(Math.pow(this.player.pos.x-interactable.x,2)+Math.pow(this.player.pos.z-interactable.z,2));
        const wasInRange=interactable.inRange;
        interactable.inRange=distance<=this.proximityRadius;
        
        if(interactable.inRange&&!wasInRange){
            this.addGlowEffect(interactable.mesh);
        }else if(!interactable.inRange&&wasInRange){
            this.removeGlowEffect(interactable.mesh);
        }
        
        if(interactable.inRange&&distance<minDistance){
            minDistance=distance;
            closestInteractable=interactable;
        }
    });
    
    this.updateTooltip(closestInteractable);
}

addGlowEffect(mesh) {
    // Initialize userData if it doesn't exist
    if (!mesh.userData) {
        mesh.userData = {};
    }
    
    if (mesh.userData.glowAdded) return;

    // Helper function to add glow to a mesh or group
    const addGlowTo = m => {
        // Initialize userData for child meshes too
        if (!m.userData) {
            m.userData = {};
        }
        
        if (m.material && m.material.emissive) {
            const originalEmissive = m.material.emissive.clone();
            m.userData.originalEmissive = originalEmissive;
            m.userData.glowAdded = true;

            const animate = () => {
                if (!m.userData.glowAdded) return;
                const intensity = (Math.sin(Date.now() * 0.003) + 1) * 0.1;
                m.material.emissive.setRGB(
                    originalEmissive.r + intensity,
                    originalEmissive.g + intensity,
                    originalEmissive.b + intensity
                );
                requestAnimationFrame(animate);
            };
            animate();
        }
    };

    if (mesh.isGroup) {
        mesh.children.forEach(addGlowTo);
    } else {
        addGlowTo(mesh);
    }
    mesh.userData.glowAdded = true; // Mark group as processed
}

removeGlowEffect(mesh) {
    // Initialize userData if it doesn't exist
    if (!mesh.userData) {
        mesh.userData = {};
    }
    
    // Helper function to remove glow from a mesh or group
    const removeGlowFrom = m => {
        // Initialize userData for child meshes too
        if (!m.userData) {
            m.userData = {};
        }
        
        if (m.userData.glowAdded) {
            m.userData.glowAdded = false;
            if (m.material && m.material.emissive && m.userData.originalEmissive) {
                m.material.emissive.copy(m.userData.originalEmissive);
            }
        }
    };

    if (mesh.isGroup) {
        mesh.children.forEach(removeGlowFrom);
    } else {
        removeGlowFrom(mesh);
    }
    mesh.userData.glowAdded = false; // Mark group as processed
}

updateTooltip(interactable) {
    const container = document.getElementById('tooltipContainer');
    if (!interactable) {
        this.hideTooltip();
        return;
    }

    this.activeTooltip = interactable;
    const canInteract = this.getDistanceToInteractable(interactable) <= 1.5;
    const tooltipDiv = document.createElement('div');
    tooltipDiv.className = `tooltip interact visible ${canInteract ? 'clickable' : ''}`;
    tooltipDiv.innerHTML = `
        <strong>${interactable.message}</strong>
        <div class="interact-prompt">${canInteract ? 'Click to interact' : interactable.interact}</div>
    `;

    const oldHandler = container._clickHandler;
    if (oldHandler) {
        container.removeEventListener('click', oldHandler);
        container.removeEventListener('mousedown', oldHandler);
    }

    if (canInteract) {
        tooltipDiv.style.cursor = 'pointer';
        container.style.pointerEvents = 'auto';
        container.style.zIndex = '999';
        
        const handleInteraction = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('Mobile/Desktop interaction triggered!');
            
            // Prevent double-interactions
            if (this._isInteracting) return;
            this._isInteracting = true;
            setTimeout(() => this._isInteracting = false, 500);
            
            // NEW: Handle NPCs the same way as desktop
            if (this.activeTooltip.type === 'npc' && this.activeTooltip.npcRef) {
                const message = this.activeTooltip.npcRef.interact();
                if (message) {
                    this.showInteractionMessage(message);
                }
            } else {
                // For non-NPCs, use the original logic
                this.executeInteraction(this.activeTooltip);
            }
        };

        container.addEventListener('click', handleInteraction);
        container.addEventListener('mousedown', handleInteraction);
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Prevent double-interactions
            if (this._isInteracting) return;
            this._isInteracting = true;
            setTimeout(() => this._isInteracting = false, 500);
            
            // NEW: Handle NPCs the same way as desktop for touch
            if (this.activeTooltip.type === 'npc' && this.activeTooltip.npcRef) {
                const message = this.activeTooltip.npcRef.interact();
                if (message) {
                    this.showInteractionMessage(message);
                }
            } else {
                // For non-NPCs, use the original logic
                this.executeInteraction(this.activeTooltip);
            }
        });
        container._clickHandler = handleInteraction;
    } else {
        container.style.pointerEvents = 'auto';
        tooltipDiv.style.cursor = 'default';
    }

    container.innerHTML = '';
    container.appendChild(tooltipDiv);
    this.positionTooltip(interactable);
}
positionTooltip(interactable) {
    const container = document.getElementById('tooltipContainer');
    const worldPos = new THREE.Vector3(
        interactable.mesh.position.x,
        interactable.mesh.position.y + 1.5,
        interactable.mesh.position.z
    );
    
    const screenPos = worldPos.project(this.camera);
    const x = (screenPos.x + 1) / 2 * window.innerWidth;
    const y = -(screenPos.y - 1) / 2 * window.innerHeight;
    
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.transform = 'translate(-50%, -100%)';
}

hideTooltip(){
    if(!this.activeTooltip)return;
    this.activeTooltip=null;
    const container=document.getElementById('tooltipContainer');
    const tooltips=container.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip=>{
        if(tooltip._clickHandler){
            tooltip.removeEventListener('click', tooltip._clickHandler);
        }
    });
    container.innerHTML='';
}

getDistanceToInteractable(interactable) {
    if (!this.player) return Infinity;
    return Math.sqrt(
        Math.pow(this.player.pos.x - interactable.x, 2) + 
        Math.pow(this.player.pos.z - interactable.z, 2)
    );
}



handleInteraction() {
    if (!this.activeTooltip) return;
    const distance = this.getDistanceToInteractable(this.activeTooltip);
    if (distance > 1.5) return;

    const obj = this.activeTooltip;
    
    // Handle NPCs using their interact() method
    if (obj.type === 'npc' && obj.npcRef) {
        const message = obj.npcRef.interact();
        if (message) {
            this.showInteractionMessage(message);
        }
        return;
    }

    // Handle other interactables
    let message = '';
    switch (obj.type) {
        case 'chest':
            message = 'You found 50 gold coins!';
            break;
        case 'tree':
            message = 'The ancient tree whispers secrets of the forest...';
            break;
        case 'crystal':
            message = 'The crystal glows brightly and fills you with energy!';
            this.scene.remove(obj.mesh);
            this.interactables = this.interactables.filter(i => i !== obj);
            this.hideTooltip();
            break;
        case 'shrine':
            message = 'You feel blessed by an ancient power...';
            break;
    }

    if (message) {
        this.showInteractionMessage(message);
    }
}

showInteractionMessage(message) {
    // Create temporary message overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 200;
        animation: fadeInOut 3s ease forwards;
    `;
    overlay.textContent = message;
    
    // Add CSS animation
    if (!document.getElementById('interactionStyles')) {
        const style = document.createElement('style');
        style.id = 'interactionStyles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) translateY(20px); }
                20%, 80% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
                100% { opacity: 0; transform: translate(-50%, -50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 3000);
}
        }



        // Initialize the game
        window.game = new GameEngine();
