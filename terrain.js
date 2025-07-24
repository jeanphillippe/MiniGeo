class TerrainSystem {
    constructor(gridSize, tileSize, heightLevels, useSprites = true) {
        this.gridSize = gridSize;
        this.tileSize = tileSize;
        this.heightLevels = heightLevels;
        this.useSprites = useSprites;
        
        // Height scaling for 3D tiles
        let min = 1, max = 3.33;
        this.heightScales = Array.from(
            { length: this.heightLevels }, 
            (_, h) => min + (h / (this.heightLevels - 1)) * (max - min)
        );
        
        this.terrainGroup = new THREE.Group();
        this.tiles = [];
        this.levelColors = [
            0x277da1, 0x4fc3f7, 0x43aa8b, 0x90be6d,
            0xf9c74f, 0xf9844a, 0xf3722c, 0x577590
        ];

        // Sprite terrain setup
        if (this.useSprites) {
            const loader = new THREE.TextureLoader();
            this.terrainTexture = loader.load('https://i.imgur.com/NUCD5KN.png');
            this.terrainTexture.magFilter = THREE.NearestFilter;
            this.terrainTexture.minFilter = THREE.NearestFilter;
            this.spriteSize = 96;
            this.layerHeight = 96;
            this.totalLayers = 3;
        }
    }

    generateSeed() {
        let seed = '';
        for (let x = 0; x < this.gridSize; x++) {
            for (let z = 0; z < this.gridSize; z++) {
                const tile = this.getTile(x, z);
                seed += tile ? tile.height.toString(36) : '0';
            }
        }
        return seed;
    }

    loadFromSeed(seed) {
        if (seed.length !== this.gridSize * this.gridSize) return false;
        
        let index = 0;
        for (let x = 0; x < this.gridSize; x++) {
            for (let z = 0; z < this.gridSize; z++) {
                const height = parseInt(seed[index], 36) || 0;
                const validHeight = Math.max(0, Math.min(this.heightLevels - 1, height));
                this.updateTileHeight(x, z, validHeight);
                index++;
            }
        }
        return true;
    }

    generateTerrain() {
        // Initialize tiles array
        for (let x = 0; x < this.gridSize; x++) {
            this.tiles[x] = [];
            for (let z = 0; z < this.gridSize; z++) {
                const height = this.generateHeightForPosition(x, z);
                const tile = this.createTile(x, z, height);
                tile.castShadow = tile.receiveShadow = true;
                this.tiles[x][z] = { height, mesh: tile };
                this.terrainGroup.add(tile);
            }
        }

        // Update debug display if available
        if (window.game && window.game.debugSystem) {
            window.game.debugSystem.updateSeedDisplay();
        }
    }

    generateHeightForPosition(x, z) {
        const centerX = this.gridSize / 2;
        const centerZ = this.gridSize / 2;
        const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
        const maxDistance = Math.sqrt(centerX ** 2 + centerZ ** 2);
        const normalizedDistance = distanceFromCenter / maxDistance;

        let height = Math.floor((1 - normalizedDistance) * this.heightLevels);
        height += Math.floor((Math.random() - 0.5) * 3);
        return Math.max(0, Math.min(this.heightLevels - 1, height));
    }

    createTile(x, z, height) {
        if (this.useSprites) {
            return this.createSpriteTile(x, z, height);
        } else {
            return this.create3DTile(x, z, height);
        }
    }

    create3DTile(x, z, height) {
        const h = this.heightScales[height];
        const geometry = new THREE.BoxGeometry(this.tileSize * 0.9, h, this.tileSize * 0.9);
        const material = new THREE.MeshLambertMaterial({ color: this.levelColors[height] });
        const mesh = new THREE.Mesh(geometry, material);
        
        const worldX = (x - this.gridSize / 2) * this.tileSize;
        const worldZ = (z - this.gridSize / 2) * this.tileSize;
        mesh.position.set(worldX, h / 2 + 0.05, worldZ);
        mesh.userData = { x, z, height };
        
        return mesh;
    }

    createSpriteTile(x, z, height) {
        const group = new THREE.Group();
        const tileSize = this.tileSize * 0.9;
        const tileHeight = this.heightScales[height];
        const spriteWidth = 1 / 8;
        const spriteU = height * spriteWidth;

        const createFace = (width, height, rotX, rotY, rotZ, posX, posY, posZ, layerType) => {
            const geometry = new THREE.PlaneGeometry(width, height);
            const material = new THREE.MeshLambertMaterial({
                map: this.terrainTexture,
                transparent: true,
                side: THREE.DoubleSide
            });

            const uvs = geometry.attributes.uv;
            const layerV = layerType / this.totalLayers;
            for (let i = 0; i < uvs.count; i++) {
                uvs.setX(i, uvs.getX(i) * spriteWidth + spriteU);
                uvs.setY(i, uvs.getY(i) * (1 / this.totalLayers) + layerV);
            }

            const plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = rotX;
            plane.rotation.y = rotY;
            plane.rotation.z = rotZ;
            plane.position.set(posX, posY, posZ);
            return plane;
        };

        // Create tile faces
        const top = createFace(tileSize, tileSize, -Math.PI / 2, 0, 0, 0, tileHeight, 0, 2);
        const front = createFace(tileSize, tileHeight, 0, 0, 0, 0, tileHeight / 2, tileSize / 2, 0);
        const back = createFace(tileSize, tileHeight, 0, Math.PI, 0, 0, tileHeight / 2, -tileSize / 2, 0);
        const left = createFace(tileSize, tileHeight, 0, -Math.PI / 2, 0, -tileSize / 2, tileHeight / 2, 0, 1);
        const right = createFace(tileSize, tileHeight, 0, Math.PI / 2, 0, tileSize / 2, tileHeight / 2, 0, 1);

        group.add(top, front, back, left, right);

        const worldX = (x - this.gridSize / 2) * this.tileSize;
        const worldZ = (z - this.gridSize / 2) * this.tileSize;
        group.position.set(worldX, 0, worldZ);
        group.userData = { x, z, height };

        // Create invisible raycast plane for interaction
        const raycastGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const raycastMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        const raycastPlane = new THREE.Mesh(raycastGeometry, raycastMaterial);
        raycastPlane.rotation.x = -Math.PI / 2;
        raycastPlane.position.y = tileHeight + 0.01;
        raycastPlane.userData = { x, z, height };
        raycastPlane.material.depthWrite = false;
        raycastPlane.castShadow = false;
        raycastPlane.receiveShadow = true;
        raycastPlane.material.depthTest = false;
        group.add(raycastPlane);

        return group;
    }

    getTile(x, z) {
        return this.tiles[x]?.[z];
    }

    updateTileHeight(x, z, newHeight) {
        const tile = this.getTile(x, z);
        if (!tile) return;

        // Remove old mesh
        this.terrainGroup.remove(tile.mesh);
        if (tile.mesh.isGroup) {
            tile.mesh.children.forEach(child => {
                child.geometry?.dispose();
                child.material?.dispose();
            });
        } else {
            tile.mesh.geometry?.dispose();
            tile.mesh.material?.dispose();
        }

        // Create new mesh
        const newMesh = this.createTile(x, z, newHeight);
        newMesh.castShadow = newMesh.receiveShadow = true;
        if (newMesh.children) {
            newMesh.children.forEach(child => {
                if (child.material.opacity === 0) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                } else {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });
        }

        tile.height = newHeight;
        tile.mesh = newMesh;
        this.terrainGroup.add(newMesh);

        // Update debug display if available
        if (window.game && window.game.debugSystem) {
            window.game.debugSystem.updateSeedDisplay();
        }
    }

    clearTerrain(defaultHeight = 2) {
        for (let x = 0; x < this.gridSize; x++) {
            for (let z = 0; z < this.gridSize; z++) {
                this.updateTileHeight(x, z, defaultHeight);
            }
        }
    }

    // Debug and sprite adjustment methods
    adjustTextureOffset(axis, value) {
        if (!this.useSprites) return;
        
        this.terrainGroup.children.forEach(tileGroup => {
            if (tileGroup.isGroup) {
                tileGroup.children.forEach(child => {
                    child.interactive = true;
                    child.on('pointerdown', () => this.onTileClick(child));
                    if (child.material && child.material.map) {
                        if (axis === 'u') {
                            child.material.map.offset.x = value;
                        } else {
                            child.material.map.offset.y = value;
                        }
                        child.material.map.needsUpdate = true;
                    }
                });
            }
        });
    }

    adjustTextureScale(axis, value) {
        if (!this.useSprites) return;
        
        this.terrainGroup.children.forEach(tileGroup => {
            if (tileGroup.isGroup) {
                tileGroup.children.forEach(child => {
                    if (child.material && child.material.map) {
                        if (axis === 'u') {
                            child.material.map.repeat.x = value;
                        } else {
                            child.material.map.repeat.y = value;
                        }
                        child.material.map.needsUpdate = true;
                    }
                });
            }
        });
    }

    adjustSpriteScale(factor) {
        if (!this.useSprites) return;
        
        this.terrainGroup.children.forEach(tileGroup => {
            if (tileGroup.isGroup) {
                tileGroup.children.forEach(child => {
                    if (child.material && child.material.map) {
                        const uv = child.geometry.attributes.uv;
                        for (let i = 0; i < uv.count; i++) {
                            uv.setX(i, uv.getX(i) * factor);
                            uv.setY(i, uv.getY(i) * factor);
                        }
                        uv.needsUpdate = true;
                    }
                });
            }
        });
    }

    adjustSpriteHeight(height) {
        if (!this.useSprites) return;
        
        this.terrainGroup.children.forEach(sprite => {
            if (sprite.isSprite) {
                sprite.position.y = height * sprite.userData.height;
            }
        });
    }

    toggleTerrainMode() {
        this.useSprites = !this.useSprites;
        
        // Clear current terrain
        while (this.terrainGroup.children.length > 0) {
            const child = this.terrainGroup.children[0];
            this.terrainGroup.remove(child);
            if (child.isGroup) {
                child.children.forEach(subChild => {
                    subChild.geometry?.dispose();
                    subChild.material?.dispose();
                });
            } else {
                child.geometry?.dispose();
                child.material?.dispose();
            }
        }

        // Regenerate terrain with new mode
        this.generateTerrain();
        
        // Update global flag
        window.USE_SPRITE_TERRAIN = this.useSprites;
    }

    // Helper method for tile interaction
    onTileClick(tile) {
        if (window.game && window.game.debugSystem) {
            window.game.debugSystem.onTileClick(tile);
        }
    }

    // Get world position for a tile
    getTileWorldPosition(x, z) {
        const tile = this.getTile(x, z);
        if (!tile) return null;
        return tile.mesh.position.clone();
    }

    // Check if coordinates are valid
    isValidCoordinate(x, z) {
        return x >= 0 && x < this.gridSize && z >= 0 && z < this.gridSize;
    }

    // Get height at specific coordinates
    getHeightAt(x, z) {
        const tile = this.getTile(x, z);
        return tile ? tile.height : 0;
    }
}
