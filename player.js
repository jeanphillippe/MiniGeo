class Player {
    constructor(game) {
        this.game = game;
        this.speed = 0.05;
        this.path = [];
        this.facingLeft = false;
        this.progress = 0;
        this._vA = new THREE.Vector3();
        this._vB = new THREE.Vector3();
        this.pos = { x: 8, z: 8 };
        this.animationState = 'idle'; // 'idle', 'walking'
this.animationFrame = 0;
this.animationTime = 0;
this.animationSpeed = 0.15; // Adjust for faster/slower animation
this.spriteRow = 0; // Player uses row 0 (first row)
// Animation frame definitions for a typical sprite sheet
this.animations = {
    idle: { 
        frames: [{x: 0, y: 128}], // Single frame for idle
        frameCount: 1,
        loop: true 
    },
    walking: { 
        frames: [
            {x: 64, y: 128},   // Frame 1
            {x: 128, y: 128},  // Frame 2  
            {x: 192, y: 128},  // Frame 3
            {x: 256, y: 128}   // Frame 4
        ],
        frameCount: 4,
        loop: true 
    }
};

        if (USE_SPRITE_PLAYER) {
            const loader = new THREE.TextureLoader();
            loader.load('https://i.imgur.com/JDz4FCW.png', texture => {
                texture.magFilter = texture.minFilter = THREE.NearestFilter;
                this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
                this.sprite.scale.setScalar(2);
                this.setFrameUV(0, 0, 64, 64, 64, 64);
                this.game.scene.add(this.sprite);
                this.setPosition(this.pos.x, this.pos.z);
            });
        } else {
            const geometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
            const material = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
            this.sprite = new THREE.Mesh(geometry, material);
            this.sprite.castShadow = true;
            this.game.scene.add(this.sprite);
            this.setPosition(this.pos.x, this.pos.z);
        }
        this.initInput();
    }

    setFrameUV(x, y, w, h, texW, texH) {
    if (this.sprite.material.map) {
        // For flipped sprites, we need to adjust the UV mapping
        if (this.facingLeft) {
            this.sprite.material.map.offset.set((x + w) / texW, 1 - (y + h) / texH);
            this.sprite.material.map.repeat.set(-w / texW, h / texH);
        } else {
            this.sprite.material.map.offset.set(x / texW, 1 - (y + h) / texH);
            this.sprite.material.map.repeat.set(w / texW, h / texH);
        }
    }}
updateAnimation(deltaTime) {
    if (!this.sprite || !this.sprite.material.map) return;
    
    const currentAnim = this.animations[this.animationState];
    if (!currentAnim) return;
    
    // Update animation timer
    this.animationTime += deltaTime || 0.016; // Default to ~60fps
    
    // Check if we should advance to next frame
    if (this.animationTime >= this.animationSpeed) {
        this.animationTime = 0;
        
        if (currentAnim.frameCount > 1) {
            this.animationFrame++;
            if (this.animationFrame >= currentAnim.frameCount) {
                this.animationFrame = currentAnim.loop ? 0 : currentAnim.frameCount - 1;
            }
        }
    }
    
    // Apply the current frame
    const frame = currentAnim.frames[this.animationFrame];
     this.setFrameUV(frame.x, frame.y, 64, 64, 320, 256); // 320px wide, 256px tall (4 rows × 64px)

}


    setPosition(x, z) {
    const tile = this.game.terrain.getTile(x, z);
    if (!tile || !this.sprite) return;
    
    // Fix: Use the actual terrain height scale and add proper clearance
    const tileHeight = this.game.terrain.heightScales[tile.height];
    const height = tileHeight + 1.0; // Player positioned well above the tile surface
    
    this.sprite.position.set(tile.mesh.position.x, height, tile.mesh.position.z);
    this.pos = { x, z };
}

    initInput() {
        this.game.canvas.addEventListener('click', e => {
            const rect = this.game.canvas.getBoundingClientRect();
            this.game.mouse.set(
                ((e.clientX - rect.left) / rect.width) * 2 - 1,
                -((e.clientY - rect.top) / rect.height) * 2 + 1
            );
            this.game.raycaster.setFromCamera(this.game.mouse, this.game.camera);
            const hits = this.game.raycaster.intersectObjects(this.game.terrain.terrainGroup.children, true);
            if (hits.length) {
                const { x, z } = hits[0].object.userData;
                this.findPath(this.pos, { x, z }, path => {
                    this.path = path;
                    this.progress = 0;
                });
            }
        });
    }

    update() {
    if (!this.path.length || !this.sprite) {
        // Player is idle
        if (this.animationState !== 'idle') {
            this.animationState = 'idle';
            this.animationFrame = 0;
            this.animationTime = 0;
        }
        this.updateAnimation();
        return;
    }

    // Player is moving - set walking animation
    if (this.animationState !== 'walking') {
        this.animationState = 'walking';
        this.animationFrame = 0;
        this.animationTime = 0;
    }
        
    const next = this.path[0];
    const currentTile = this.game.terrain.getTile(this.pos.x, this.pos.z);
    const nextTile = this.game.terrain.getTile(next.x, next.z);
    
    if (!nextTile || !currentTile) {
        this.path = [];
        return;
    }

    // NEW: Determine movement direction and flip sprite if needed
    if (this.progress === 0) {
    const deltaX = next.x - this.pos.x;
    const deltaZ = next.z - this.pos.z;
    
    // Calculate screen-space movement direction
    // In your isometric view, moving left on screen = negative X + positive Z
    // Moving right on screen = positive X + negative Z
    const screenDeltaX = deltaX - deltaZ;
    
    if (screenDeltaX !== 0) {
        const shouldFaceLeft = screenDeltaX < 0;
        
        if (shouldFaceLeft !== this.facingLeft) {
            this.facingLeft = shouldFaceLeft;
            // Use scale.x directly for sprite flipping
            this.sprite.scale.x = Math.abs(this.sprite.scale.x) * (this.facingLeft ? -1 : 1);
        }
    }
    
    const a = currentTile.mesh.position, b = nextTile.mesh.position;
    this._vA.set(a.x, this.game.terrain.heightScales[currentTile.height] + 1.0, a.z);
    this._vB.set(b.x, this.game.terrain.heightScales[nextTile.height] + 1.0, b.z);
}

    this.progress += this.speed;
    if (this.progress >= 1) {
        this.setPosition(next.x, next.z);
        this.path.shift();
        this.progress = 0;
    } else {
        this.sprite.position.lerpVectors(this._vA, this._vB, this.progress);
        this.sprite.position.y += Math.sin(this.progress * Math.PI) * 0.5;
    }

    this.updateAnimation();
}

    findPath(start, end, callback) {
        setTimeout(() => {
            const grid = this.game.terrain.tiles.map(row => row.map(t => t.height < this.game.heightLevels));
            const open = [start], cameFrom = {}, g = { [`${start.x},${start.z}`]: 0 };
            const h = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.z - b.z);

            while (open.length) {
                open.sort((a, b) => (g[`${a.x},${a.z}`] + h(a, end)) - (g[`${b.x},${b.z}`] + h(b, end)));
                const current = open.shift();
                if (current.x === end.x && current.z === end.z) break;

                for (let d of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                    const nx = current.x + d[0], nz = current.z + d[1], key = `${nx},${nz}`;
                    if (!grid[nx]?.[nz]) continue;
                    const cost = g[`${current.x},${current.z}`] + 1;
                    if (!(key in g) || cost < g[key]) {
                        g[key] = cost;
                        cameFrom[key] = current;
                        open.push({ x: nx, z: nz });
                    }
                }
            }

            const path = [];
            let curr = end, key = `${curr.x},${curr.z}`;
            while (cameFrom[key]) {
                path.unshift(curr);
                curr = cameFrom[key];
                key = `${curr.x},${curr.z}`;
            }
            callback(path);
        }, 0);
    }
}
