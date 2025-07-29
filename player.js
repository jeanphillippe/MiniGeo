class Player {
    constructor(game) {
        this.game = game;
        this.speed = 0.5;
        this.path = [];
        this.facingLeft = false;
        this.progress = 0;
        this._vA = new THREE.Vector3();
        this._vB = new THREE.Vector3();
        this.pos = { x: 10, z: 9 };
        this.pathLines = [];
this.pathAnimationTime = 0;
        this.animationState = 'idle'; // 'idle', 'walking'
this.animationFrame = 0;
this.animationTime = 0;
this.animationSpeed = 0.15; // Adjust for faster/slower animation
this.spriteRow = 0; // Player uses row 0 (first row)
// Animation frame definitions for a typical sprite sheet
this.animations = {
    idle: { 
        frames: [{x: 0, y: 0}], // Single frame for idle
        frameCount: 1,
        loop: true 
    },
    walking: { 
        frames: [
            {x: 64, y: 0},   // Frame 1
            {x: 128, y: 0},  // Frame 2  
            {x: 192, y: 0},  // Frame 3
            {x: 256, y: 0}   // Frame 4
        ],
        frameCount: 4,
        loop: true 
    }
};

        if (USE_SPRITE_PLAYER) {
            const loader = new THREE.TextureLoader();
            loader.load('https://i.imgur.com/4lded4b.png', texture => {
                texture.magFilter = texture.minFilter = THREE.NearestFilter;
                this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
                this.sprite.scale.setScalar(2);
                
  // ===> STORE THESE FOR LATER
  this.texW = texture.image.width;   // e.g. 320
  this.texH = texture.image.height;  // e.g. 384
// NEW: use the first idle frame your animations table defines
const idleFrame = this.animations.idle.frames[0];
this.setFrameUV(
  idleFrame.x,
  idleFrame.y,
  64, 64,
  this.texW,
  this.texH
);

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
createPathLine() { return;
    // Clean up existing lines
    this.pathLines.forEach(line => {
        this.game.scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    });
    this.pathLines = [];
    
    if (!this.path.length) return;
    
    const allPoints = [];
    const currentTile = this.game.terrain.getTile(this.pos.x, this.pos.z);
    if (currentTile) {
        allPoints.push(new THREE.Vector3(
            currentTile.mesh.position.x,
            this.game.terrain.heightScales[currentTile.height] + 0.3,
            currentTile.mesh.position.z
        ));
    }
    
    // Add all path points
    this.path.forEach(point => {
        const tile = this.game.terrain.getTile(point.x, point.z);
        if (tile) {
            allPoints.push(new THREE.Vector3(
                tile.mesh.position.x,
                this.game.terrain.heightScales[tile.height] + 0.3,
                tile.mesh.position.z
            ));
        }
    });
    
    if (allPoints.length < 2) return;
    
    // Create intermittent line segments
    const segmentLength = 0.6; // Length of each black segment
    const gapLength = 0.6; // Length of each gap
    const totalSegmentLength = segmentLength + gapLength;
    
    // Calculate total path length
    let totalDistance = 0;
    const distances = [0];
    for (let i = 1; i < allPoints.length; i++) {
        const dist = allPoints[i].distanceTo(allPoints[i-1]);
        totalDistance += dist;
        distances.push(totalDistance);
    }
    
    // Create line segments
    let currentDistance = 0;
    while (currentDistance < totalDistance) {
        const segmentStart = currentDistance;
        const segmentEnd = Math.min(currentDistance + segmentLength, totalDistance);
        
        const segmentPoints = this.getPointsAtDistance(allPoints, distances, segmentStart, segmentEnd);
        
        if (segmentPoints.length >= 2) {
            // Create thick line using multiple parallel lines
            const offsets = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.03, 0, 0), new THREE.Vector3(-0.03, 0, 0),
    new THREE.Vector3(0, 0, 0.03), new THREE.Vector3(0, 0, -0.03),
    new THREE.Vector3(0.015, 0, 0.015), new THREE.Vector3(-0.015, 0, -0.015)
];
            
            offsets.forEach(offset => {
                const offsetPoints = segmentPoints.map(p => p.clone().add(offset));
                const geometry = new THREE.BufferGeometry().setFromPoints(offsetPoints);
                const material = new THREE.LineBasicMaterial({
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.9
                });
                
                const line = new THREE.Line(geometry, material);
                this.pathLines.push(line);
                this.game.scene.add(line);
            });
        }
        
        currentDistance += totalSegmentLength;
    }
}

// Helper method to get points at specific distances along the path
getPointsAtDistance(allPoints, distances, startDist, endDist) {
    const result = [];
    
    for (let i = 0; i < allPoints.length - 1; i++) {
        const segStart = distances[i];
        const segEnd = distances[i + 1];
        
        if (segEnd < startDist || segStart > endDist) continue;
        
        const actualStart = Math.max(startDist, segStart);
        const actualEnd = Math.min(endDist, segEnd);
        
        if (actualStart >= actualEnd) continue;
        
        const segLength = segEnd - segStart;
        const startRatio = (actualStart - segStart) / segLength;
        const endRatio = (actualEnd - segStart) / segLength;
        
        const startPoint = allPoints[i].clone().lerp(allPoints[i + 1], startRatio);
        const endPoint = allPoints[i].clone().lerp(allPoints[i + 1], endRatio);
        
        if (result.length === 0 || !result[result.length - 1].equals(startPoint)) {
            result.push(startPoint);
        }
        result.push(endPoint);
    }
    
    return result;
}

// Add this method to animate the line forward
updatePathLine() {
    if (this.pathLines.length === 0 || !this.path.length) return;
    
    this.pathAnimationTime += 0.04; // Speed of forward movement
    
    // Get path points starting from ahead of player to avoid character interference
    const allPoints = [];
    
    // Start the line a bit ahead of the player to avoid visual interference
    if (this.sprite && this.path.length > 0) {
        const nextTile = this.game.terrain.getTile(this.path[0].x, this.path[0].z);
        if (nextTile) {
            // Start from the first path point instead of player position
            allPoints.push(new THREE.Vector3(
                nextTile.mesh.position.x,
                this.game.terrain.heightScales[nextTile.height] + 0.3,
                nextTile.mesh.position.z
            ));
        }
    }
    
    // Add remaining path points (skip first since we already added it)
    this.path.slice(1).forEach(point => {
        const tile = this.game.terrain.getTile(point.x, point.z);
        if (tile) {
            allPoints.push(new THREE.Vector3(
                tile.mesh.position.x,
                this.game.terrain.heightScales[tile.height] + 0.3,
                tile.mesh.position.z
            ));
        }
    });
    
    if (allPoints.length < 2) return;
    
    // Clean up existing lines first
    this.pathLines.forEach(line => {
        this.game.scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    });
    this.pathLines = [];
    
    // Segment configuration
    const segmentLength = 0.6;
    const gapLength = 0.6;
    const totalSegmentLength = segmentLength + gapLength;
    
    // Calculate total path length
    let totalDistance = 0;
    const distances = [0];
    for (let i = 1; i < allPoints.length; i++) {
        const dist = allPoints[i].distanceTo(allPoints[i-1]);
        totalDistance += dist;
        distances.push(totalDistance);
    }
    
    // Create continuous flowing animation without restart
    // Use modulo to create seamless loop
    const animationOffset = this.pathAnimationTime * 0.5;
    
    // Create line segments with continuous flow
    let currentDistance = animationOffset % totalSegmentLength;
    
    // Generate multiple cycles to ensure continuous coverage
    for (let cycle = 0; cycle < Math.ceil(totalDistance / totalSegmentLength) + 2; cycle++) {
        const segmentStart = currentDistance + (cycle * totalSegmentLength);
        const segmentEnd = segmentStart + segmentLength;
        
        // Only create segment if it overlaps with the path
        if (segmentStart < totalDistance && segmentEnd > 0) {
            const segmentPoints = this.getPointsAtDistance(allPoints, distances, 
                Math.max(0, segmentStart), Math.min(totalDistance, segmentEnd));
            
            if (segmentPoints.length >= 2) {
                // Add fade effect near the end to make disappearance smooth
                const fadeDistance = 0.8; // Distance from end where fade starts
                const distanceFromEnd = totalDistance - segmentStart;
                const fadeOpacity = distanceFromEnd < fadeDistance ? 
                    Math.max(0.2, distanceFromEnd / fadeDistance) : 1.0;
                
                // Create thick line using multiple parallel lines
                const offsets = [
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0.03, 0, 0), new THREE.Vector3(-0.03, 0, 0),
                    new THREE.Vector3(0, 0, 0.03), new THREE.Vector3(0, 0, -0.03),
                    new THREE.Vector3(0.015, 0, 0.015), new THREE.Vector3(-0.015, 0, -0.015)
                ];
                
                offsets.forEach(offset => {
                    const offsetPoints = segmentPoints.map(p => p.clone().add(offset));
                    const geometry = new THREE.BufferGeometry().setFromPoints(offsetPoints);
                    const material = new THREE.LineBasicMaterial({
                        color: 0x000000,
                        transparent: true,
                        opacity: 0.9 * fadeOpacity
                    });
                    
                    const line = new THREE.Line(geometry, material);
                    this.pathLines.push(line);
                    this.game.scene.add(line);
                });
            }
        }
    }
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

 this.setFrameUV(
   frame.x,         // column X
   frame.y,         // row Y (spriteRow * 64 for NPCs)
   64, 64,
   this.texW,       // full sheet width
  this.texH        // full sheet height
);


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
                    this.createPathLine();
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
        if (this.pathLines.length > 0 && this.path.length === 0) {
    this.pathLines.forEach(line => {
        this.game.scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    });
    this.pathLines = [];
}
        this.progress = 0;
    } else {
        this.sprite.position.lerpVectors(this._vA, this._vB, this.progress);
        this.sprite.position.y += Math.sin(this.progress * Math.PI) * 0.5;
    }
this.updatePathLine();
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
