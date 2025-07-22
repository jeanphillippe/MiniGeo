// Debug module for the isometric game
class DebugSystem {
    constructor(game) {
        this.game = game;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        this.spriteDebugInitialized = false;
        this.init();
    }

    init() {
        this.setupUI();
        this.updateDebugInfo();
    }

    setupUI() {
        // Debug panel toggle
        document.getElementById('debugToggle').style.display = 'inline-block';
        document.getElementById('debugToggle').onclick = () => {
    this.togglePanel('debug');
    document.getElementById('editToggle').style.display = 'inline-block';
    document.getElementById('spriteDebugToggle').style.display = 'inline-block';
};

        
        document.getElementById('spriteDebugToggle').onclick = () => this.togglePanel('spriteDebug');
        
        // Export/Import buttons
        document.getElementById('exportBtn').onclick = () => this.exportSeed();
        document.getElementById('importBtn').onclick = () => this.importSeed();
        const raiseBtn = document.getElementById('raiseTile');
    const lowerBtn = document.getElementById('lowerTile');

if (raiseBtn && lowerBtn) {
    [raiseBtn, lowerBtn].forEach(btn => {
      btn.style.display = 'inline-block';          // make sure they’re visible
      btn.onclick = () => 
        this.selectTool(btn.id === 'raiseTile' ? 'raise' : 'lower');
    });
    this.selectTool('raise');                    // default
}
    }
  selectTool(tool) {
    this.currentTool = tool;
    // toggle “active” class on the two buttons
    document.getElementById('raiseTile')
      .classList.toggle('active', tool === 'raise');
    document.getElementById('lowerTile')
      .classList.toggle('active', tool === 'lower');
  }
    setupSpriteDebug() {
        const terrainToggle = document.getElementById('terrainSpriteToggle');
        const uOffset = document.getElementById('uOffset');
        const vOffset = document.getElementById('vOffset');
        const uScale = document.getElementById('uScale');
        const vScale = document.getElementById('vScale');
        const uOffsetInput = document.getElementById('uOffsetInput');
        const vOffsetInput = document.getElementById('vOffsetInput');
        const uScaleInput = document.getElementById('uScaleInput');
        const vScaleInput = document.getElementById('vScaleInput');
        const resetBtn = document.getElementById('resetTextureBtn');

        terrainToggle.textContent = `Terrain: ${this.game.useTerrainSprites ? 'Sprites' : '3D'}`;
        terrainToggle.onclick = () => this.toggleTerrainMode();

        resetBtn.onclick = () => {
            uOffset.value = uOffsetInput.value = "0";
            vOffset.value = vOffsetInput.value = "0";
            uScale.value = uScaleInput.value = "1";
            vScale.value = vScaleInput.value = "1";
            this.adjustTextureOffset('u', 0);
            this.adjustTextureOffset('v', 0);
            this.adjustTextureScale('u', 1);
            this.adjustTextureScale('v', 1);
        };

        const syncInputs = (slider, input, callback) => {
            slider.oninput = (e) => {
                const value = parseFloat(e.target.value);
                input.value = value;
                callback(value);
            };
            input.oninput = (e) => {
                const value = parseFloat(e.target.value);
                slider.value = value;
                callback(value);
            };
        };

        syncInputs(uOffset, uOffsetInput, (value) => this.adjustTextureOffset('u', value));
        syncInputs(vOffset, vOffsetInput, (value) => this.adjustTextureOffset('v', value));
        syncInputs(uScale, uScaleInput, (value) => this.adjustTextureScale('u', value));
        syncInputs(vScale, vScaleInput, (value) => this.adjustTextureScale('v', value));
    }

    togglePanel(type) {
        if (type === 'debug') {
            const panel = document.getElementById('debugPanel');
            const btn = document.getElementById('debugToggle');
            const isVisible = panel.classList.toggle('visible');
            btn.classList.toggle('active', isVisible);
        } else if (type === 'spriteDebug') {
            const panel = document.getElementById('spriteDebugPanel');
            const btn = document.getElementById('spriteDebugToggle');
            const isVisible = panel.classList.toggle('visible');
            btn.classList.toggle('active', isVisible);
            
            if (isVisible && !this.spriteDebugInitialized) {
                this.setupSpriteDebug();
                this.spriteDebugInitialized = true;
            }
        }
    }

    adjustTextureOffset(axis, value) {
        if (!this.game.useTerrainSprites) return;
        
        this.game.terrain.terrainGroup.children.forEach(tileGroup => {
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
        if (!this.game.useTerrainSprites) return;
        
        this.game.terrain.terrainGroup.children.forEach(tileGroup => {
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

    toggleTerrainMode() {
        this.game.useTerrainSprites = !this.game.useTerrainSprites;
        document.getElementById('terrainSpriteToggle').textContent = `Terrain: ${this.game.useTerrainSprites ? 'Sprites' : '3D'}`;
        
        this.game.scene.remove(this.game.terrain.terrainGroup);
        this.game.terrain = new TerrainSystem(this.game.gridSize, this.game.tileSize, this.game.heightLevels);
        this.game.terrain.generateTerrain();
        this.game.scene.add(this.game.terrain.terrainGroup);
        window.USE_SPRITE_TERRAIN = this.game.useTerrainSprites;
    }

    exportSeed() {
        const seed = this.game.terrain.generateSeed();
        navigator.clipboard.writeText(seed).then(() => {
            this.game.showMessage('Seed copied to clipboard!');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = seed;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.game.showMessage('Seed copied to clipboard!');
        });
        this.updateSeedDisplay();
    }

    importSeed() {
        const seed = prompt('Enter seed to import:');
        if (seed && seed.trim()) {
            const success = this.game.terrain.loadFromSeed(seed.trim());
            if (success) {
                this.game.showMessage('Terrain imported successfully!');
                this.game.clearSelection();
                this.updateSeedDisplay();
            } else {
                this.game.showMessage('Invalid seed format!');
            }
        }
    }

    updateSeedDisplay() {
        const seedElement = document.getElementById('currentSeed');
        if (seedElement) {
            const seed = this.game.terrain.generateSeed();
            seedElement.textContent = seed.substring(0, 20) + (seed.length > 20 ? '...' : '');
            seedElement.title = seed;
        }
    }

    updatePerformanceStats() {
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFpsUpdate >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = now;
            document.getElementById('fps').textContent = fps;
        }
    }
      onTileClick(tile) {
    if (this.currentTool === 'raise') {
      this.game.raiseTile(tile);
    } else {
      this.game.lowerTile(tile);
    }
  }

    updateDebugInfo() {
        const update = () => {
            const pos = this.game.cameraTarget;
            document.getElementById('cameraPos').textContent = `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
            document.getElementById('zoomLevel').textContent = this.game.zoomLevel.toFixed(1);
            requestAnimationFrame(update);
        };
        update();
    }
}
