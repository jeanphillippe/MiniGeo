class Player {
    constructor(game) {
        this.game = game;
        this.speed = 0.05;
        this.path = [];
        this.progress = 0;
        this._vA = new THREE.Vector3();
        this._vB = new THREE.Vector3();
        this.pos = { x: 8, z: 8 };

        if (USE_SPRITE_PLAYER) {
            const loader = new THREE.TextureLoader();
            loader.load('https://i.imgur.com/9QK0Xou.png', texture => {
                texture.magFilter = texture.minFilter = THREE.NearestFilter;
                this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
                this.sprite.scale.setScalar(1);
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
            this.sprite.material.map.offset.set(x / texW, 1 - (y + h) / texH);
            this.sprite.material.map.repeat.set(w / texW, h / texH);
        }
    }

    setPosition(x, z) {
        const tile = this.game.terrain.getTile(x, z);
        if (!tile || !this.sprite) return;
        const height = 0.5 + tile.height * 0.5;
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
        if (!this.path.length || !this.sprite) return;
        
        const next = this.path[0];
        const currentTile = this.game.terrain.getTile(this.pos.x, this.pos.z);
        const nextTile = this.game.terrain.getTile(next.x, next.z);
        
        if (!nextTile || !currentTile) {
            this.path = [];
            return;
        }

        if (this.progress === 0) {
            const a = currentTile.mesh.position, b = nextTile.mesh.position;
            this._vA.set(a.x, 0.5 + currentTile.height * 0.5, a.z);
            this._vB.set(b.x, 0.5 + nextTile.height * 0.5, b.z);
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
