const USE_SPRITE_PLAYER=!0;const USE_SPRITE_TERRAIN=!0;class GameEngine{constructor(){this.gridSize=16;this.tileSize=2;this.heightLevels=8;this.editMode=!1;this.selectedTile=null;this.raycaster=new THREE.Raycaster();this.mouse=new THREE.Vector2();this.initialCameraState={position:new THREE.Vector3(),target:new THREE.Vector3(),zoom:1.0,preset:'default'};this.input={keys:{},mouse:{x:0,y:0,pressed:!1},touch:{active:!1,pinchDistance:0,moved:!1}};this.debugSystem=typeof DebugSystem!=='undefined'?new DebugSystem(this):null;this.cloudSprites=[];this.terrainSystem=new TerrainSystem(this.gridSize,this.tileSize,this.heightLevels,USE_SPRITE_TERRAIN);this.interactables=[];this.proximityRadius=2.5;this.activeTooltip=null;this.cameraSystem=new CameraSystem(this);this.init()}
init(){this.setupRenderer();this.cameraSystem.setupCamera();this.camera=this.cameraSystem.camera;this.setupScene();this.setupLighting();this.setupClouds();this.setupTerrain();this.setupInput();this.setupUI();this.setupInteractables();this.player=new Player(this);this.setupIntro();this.start()}
setupIntro(){this.cameraSystem.setCameraPreset('overview',!1);const introOverlay=document.getElementById('introOverlay');const startButton=document.getElementById('startButton');startButton.onclick=()=>{this.cameraSystem.setCameraPreset('default',!0,()=>{console.log('Camera transition to default completed')});introOverlay.classList.add('hidden');setTimeout(()=>{introOverlay.style.display='none'},500)}}
setupRenderer(){this.canvas=document.getElementById('gameCanvas');this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:!0});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.setSize(innerWidth,innerHeight);this.renderer.setClearColor(0x4FB3D9);this.renderer.shadowMap.enabled=!0;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap}
setCameraPreset(presetName,smooth=!0,callback=null){const existingDialog=document.getElementById('confirmationDialog');if(existingDialog)existingDialog.remove();const npcDialog=document.getElementById('npcQuestionDialog');if(npcDialog)npcDialog.remove();this.cameraSystem.setCameraPreset(presetName,smooth,callback)}
setupScene(){this.scene=new THREE.Scene();this.scene.fog=new THREE.Fog(0x4FB3D9,30,100)}
setupLighting(){this.scene.add(new THREE.AmbientLight(0xffffff,0.4));this.directionalLight=new THREE.DirectionalLight(0xfff6e0,0.95);this.directionalLight.position.set(50,50,25);this.directionalLight.castShadow=!0;this.directionalLight.shadow.mapSize.setScalar(2048);Object.assign(this.directionalLight.shadow.camera,{near:0.1,far:200,left:-50,right:50,top:50,bottom:-50});this.scene.add(this.directionalLight)}
setupClouds(){const loader=new THREE.TextureLoader();loader.load('https://i.imgur.com/mYRt74O.png',texture=>{for(let i=0;i<6;i++){const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,opacity:0.7,transparent:!0}));sprite.position.set((Math.random()-0.5)*this.gridSize*this.tileSize,8+Math.random()*2,(Math.random()-0.5)*this.gridSize*this.tileSize);sprite.scale.set(8+Math.random()*6,4+Math.random()*2,1);sprite.userData.speed=0.01*(0.5+Math.random()*0.2);this.scene.add(sprite);this.cloudSprites.push(sprite)}})}
setupTerrain(){this.terrainSystem.generateTerrain();const seed="9877766666677789877665555556677877665544445566777665444334445667765443333334456765543322223345566544321111234456654332100123345665433210012334566544321111234456655433222233455676544333333445677665444334445667776655444455667787766555555667789877766666677789";this.terrainSystem.loadFromSeed(seed);this.scene.add(this.terrainSystem.terrainGroup);this.terrain=this.terrainSystem}
setupInput(){['keydown','keyup'].forEach(evt=>addEventListener(evt,e=>this.input.keys[e.code]=evt==='keydown'));['mousedown','mousemove','mouseup'].forEach(evt=>this.canvas.addEventListener(evt,e=>this.handleMouse(evt,e)));this.canvas.addEventListener('click',e=>this.editMode&&this.handleTileClick(e));this.canvas.addEventListener('wheel',e=>{e.preventDefault();this.cameraSystem.zoomCamera(e.deltaY>0?0.1:-0.1)});['touchstart','touchmove','touchend'].forEach(evt=>{const methodName='handleTouch'+evt.slice(5).charAt(0).toUpperCase()+evt.slice(6);this.canvas.addEventListener(evt,e=>{e.preventDefault();if(typeof this[methodName]==='function'){this[methodName](e)}})});addEventListener('resize',()=>this.handleResize())}
setupUI(){document.getElementById('editToggle').onclick=()=>this.togglePanel('edit');document.getElementById('raiseBtn').onclick=()=>this.modifySelected(1);document.getElementById('lowerBtn').onclick=()=>this.modifySelected(-1);document.getElementById('clearBtn').onclick=()=>confirm('Clear all terrain?')&&this.clearTerrain();const slider=document.getElementById('lightSlider');slider.oninput=e=>{this.directionalLight.intensity=parseFloat(e.target.value)};['lx','ly','lz'].forEach(axis=>{document.getElementById(axis).oninput=e=>this.directionalLight.position[axis[1]]=parseFloat(e.target.value)});document.getElementById('lcolor').oninput=e=>this.directionalLight.color.set(e.target.value)}
togglePanel(type){this.editMode=!this.editMode;const panel=document.getElementById('editPanel');const btn=document.getElementById('editToggle');const ind=document.getElementById('editIndicator');panel.classList.toggle('visible',this.editMode);btn.classList.toggle('active',this.editMode);ind.classList.toggle('visible',this.editMode);this.canvas.style.cursor=this.editMode?'crosshair':'grab';if(!this.editMode)this.clearSelection();}
handleMouse(evt,e){const m=this.input.mouse;if(evt==='mousedown'){m.pressed=!0;m.x=e.clientX;m.y=e.clientY}else if(evt==='mousemove'&&m.pressed&&!this.editMode){this.cameraSystem.panCamera(e.clientX-m.x,e.clientY-m.y)}else if(evt==='mouseup'){m.pressed=!1}
if(evt!=='mouseup'){m.x=e.clientX;m.y=e.clientY}}
handleTileClick(e){const rect=this.canvas.getBoundingClientRect();this.mouse.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1);this.raycaster.setFromCamera(this.mouse,this.camera);const intersects=this.raycaster.intersectObjects(this.terrainSystem.terrainGroup.children,!0);if(intersects.length){const tile=intersects[0].object.userData;this.selectTile(tile.x,tile.z);if(e.shiftKey)this.modifyTileHeight(tile.x,tile.z,-1);else if(e.ctrlKey||e.metaKey)this.setTileHeight(tile.x,tile.z,0);else this.modifyTileHeight(tile.x,tile.z,1)}}
selectTile(x,z){const tile=this.terrainSystem.getTile(x,z);if(tile){this.selectedTile={x,z,height:tile.height};this.updateEditUI();this.highlightTile(tile.mesh)}}
clearSelection(){this.selectedTile=null;this.updateEditUI();this.removeHighlight()}
highlightTile(mesh){this.removeHighlight();if(USE_SPRITE_TERRAIN&&mesh.isGroup){const tileSize=this.tileSize*0.9;const geometry=new THREE.RingGeometry(tileSize*0.6,tileSize*0.65,16);const material=new THREE.MeshBasicMaterial({color:0xffffff,transparent:!0,opacity:0.8,side:THREE.DoubleSide});this.tileHighlight=new THREE.Mesh(geometry,material);this.tileHighlight.rotation.x=-Math.PI/2;this.tileHighlight.position.copy(mesh.position);const tile=this.getTileFromMesh(mesh);if(tile){this.tileHighlight.position.y=0.5+tile.height*0.5+0.02}
this.scene.add(this.tileHighlight)}else{const edges=new THREE.EdgesGeometry(mesh.geometry);this.tileHighlight=new THREE.LineSegments(edges,new THREE.LineBasicMaterial({color:0xffffff,linewidth:3}));this.tileHighlight.position.copy(mesh.position);this.tileHighlight.position.y+=0.01;this.scene.add(this.tileHighlight)}}
getTileFromMesh(mesh){if(mesh.userData&&mesh.userData.x!==undefined){return this.terrainSystem.getTile(mesh.userData.x,mesh.userData.z)}
return null}
removeHighlight(){if(this.tileHighlight){this.scene.remove(this.tileHighlight);this.tileHighlight.geometry.dispose();this.tileHighlight.material.dispose();this.tileHighlight=null}}
modifySelected(delta){this.selectedTile&&this.modifyTileHeight(this.selectedTile.x,this.selectedTile.z,delta)}
modifyTileHeight(x,z,delta){const tile=this.terrainSystem.getTile(x,z);if(tile){const newHeight=Math.max(0,Math.min(this.heightLevels-1,tile.height+delta));if(newHeight!==tile.height){this.terrainSystem.updateTileHeight(x,z,newHeight);if(this.selectedTile?.x===x&&this.selectedTile?.z===z){this.selectedTile.height=newHeight;this.updateEditUI();this.highlightTile(tile.mesh)}}}}
setTileHeight(x,z,height){const tile=this.terrainSystem.getTile(x,z);if(tile&&tile.height!==height){this.terrainSystem.updateTileHeight(x,z,height);if(this.selectedTile?.x===x&&this.selectedTile?.z===z){this.selectedTile.height=height;this.updateEditUI();this.highlightTile(tile.mesh)}}}
clearTerrain(){this.terrainSystem.clearTerrain();this.clearSelection()}
updateEditUI(){const elems=['selectedTile','selectedHeight','raiseBtn','lowerBtn'].map(id=>document.getElementById(id));if(this.selectedTile){elems[0].textContent=`${this.selectedTile.x},${this.selectedTile.z}`;elems[1].textContent=this.selectedTile.height;elems[2].disabled=!this.editMode||this.selectedTile.height>=this.heightLevels-1;elems[3].disabled=!this.editMode||this.selectedTile.height<=0}else{elems[0].textContent='None';elems[1].textContent='-';elems.slice(2).forEach(btn=>btn.disabled=!0)}}
handleTouchStart(e){const touches=e.touches;if(touches.length===1){Object.assign(this.input.touch,{active:!0,moved:!1,start:{x:touches[0].clientX,y:touches[0].clientY}})}else if(touches.length===2){this.input.touch.pinchDistance=Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);this.input.touch.moved=!1}}
handleTouchMove(e){const touches=e.touches;if(touches.length===1&&this.input.touch.active){const delta={x:(touches[0].clientX-this.input.touch.start.x)/window.innerWidth,y:(touches[0].clientY-this.input.touch.start.y)/window.innerHeight};const distance=Math.hypot(delta.x,delta.y);if(distance>0&&!this.editMode){this.input.touch.moved=!0;this.cameraSystem.panCamera(delta.x*70,delta.y*70)}}else if(touches.length===2){const currentDist=Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);this.cameraSystem.zoomCamera((this.input.touch.pinchDistance-currentDist)*0.01);this.input.touch.pinchDistance=currentDist;this.input.touch.moved=!0}}
handleTouchEnd(e){if(this.input.touch.active&&e.changedTouches.length===1){const touch=e.changedTouches[0];const wasShortTap=!this.input.touch.moved;if(this.editMode&&wasShortTap){this.handleTileClick({clientX:touch.clientX,clientY:touch.clientY,shiftKey:!1,ctrlKey:!1,metaKey:!1})}else if(!this.editMode&&wasShortTap){const rect=this.canvas.getBoundingClientRect();this.mouse.set(((touch.clientX-rect.left)/rect.width)*2-1,-((touch.clientY-rect.top)/rect.height)*2+1);this.raycaster.setFromCamera(this.mouse,this.camera);const hits=this.raycaster.intersectObjects(this.terrainSystem.terrainGroup.children,!0);if(hits.length){const{x,z}=hits[0].object.userData;if(this.player&&this.player.sprite){this.player.findPath(this.player.pos,{x,z},path=>{this.player.path=path;this.player.progress=0})}}}}
Object.assign(this.input.touch,{active:!1,start:null,moved:!1})}
handleKeyboardInput(){this.cameraSystem.handleKeyboardCameraInput();if(this.input.keys.KeyE&&!this.input.keys._ePressed){this.input.keys._ePressed=!0;this.handleInteraction()}else if(!this.input.keys.KeyE){this.input.keys._ePressed=!1}}
handleResize(){this.cameraSystem.handleResize();this.renderer.setSize(innerWidth,innerHeight);this.renderer.setPixelRatio(Math.min(devicePixelRatio,2))}
start(){this.animate()}
animate(){requestAnimationFrame(()=>this.animate());this.update();this.render();if(this.debugSystem){this.debugSystem.updatePerformanceStats()}}
update(){this.handleKeyboardInput();this.cameraSystem.update();this.cloudSprites.forEach(c=>{c.position.x+=c.userData.speed;if(c.position.x>this.gridSize*this.tileSize)
c.position.x=-this.gridSize*this.tileSize});if(this.selectedTile&&this.tileHighlight){const tile=this.terrainSystem.getTile(this.selectedTile.x,this.selectedTile.z);if(tile){this.tileHighlight.position.copy(tile.mesh.position);if(USE_SPRITE_TERRAIN){this.tileHighlight.position.y=0.5+tile.height*0.5+0.02}else{this.tileHighlight.position.y+=0.01}}}
if(this.player)this.player.update();this.checkProximityInteractions()}
render(){this.renderer.render(this.scene,this.camera)}
setupInteractables(){const interactableData=[{x:12,z:11,type:'chest',message:'Ancient Chest',interact:'Press E to open'},{x:7,z:11,type:'crystal',message:'Magic Crystal',interact:'Press E to collect'},{x:14,z:14,type:'shrine',message:'Mysterious Shrine',interact:'Press E to pray'}];interactableData.forEach(data=>{const tile=this.terrainSystem.getTile(data.x,data.z);if(!tile)return;const obj=this.createInteractableObject(data.type,data.x,data.z);if(obj){this.scene.add(obj);this.interactables.push({mesh:obj,x:data.x,z:data.z,type:data.type,message:data.message,interact:data.interact,inRange:!1})}});setTimeout(()=>{if(this.npcs){this.npcs.forEach(npc=>{if(npc.isInteractable){this.interactables.push({mesh:npc.sprite,x:npc.pos.x,z:npc.pos.z,type:'npc',message:npc.name||'Friendly NPC',interact:'Press E to talk',inRange:!1,npcRef:npc})}})}},500)}
createInteractableObject(type,x,z){const tile=this.terrainSystem.getTile(x,z);if(!tile)return null;let geometry,material,obj;const height=0.5+tile.height*0.5;switch(type){case 'chest':geometry=new THREE.BoxGeometry(0.3,0.3,0.3);material=new THREE.MeshLambertMaterial({color:0x8B4513});obj=new THREE.Mesh(geometry,material);obj.position.set(tile.mesh.position.x,height+0.3,tile.mesh.position.z);break;case 'crystal':geometry=new THREE.OctahedronGeometry(0.4,0);material=new THREE.MeshLambertMaterial({color:0x00FFFF,transparent:!0,opacity:0.8,emissive:0x004444});obj=new THREE.Mesh(geometry,material);obj.position.set(tile.mesh.position.x,height+0.4,tile.mesh.position.z);break;case 'shrine':const base=new THREE.CylinderGeometry(0.6,0.8,0.3,8);const pillar=new THREE.CylinderGeometry(0.15,0.15,1.2,8);const top=new THREE.SphereGeometry(0.25,8,6);obj=new THREE.Group();const baseMesh=new THREE.Mesh(base,new THREE.MeshLambertMaterial({color:0x708090}));const pillarMesh=new THREE.Mesh(pillar,new THREE.MeshLambertMaterial({color:0x708090}));const topMesh=new THREE.Mesh(top,new THREE.MeshLambertMaterial({color:0xFFD700,emissive:0x332200}));baseMesh.position.y=0.15;pillarMesh.position.y=0.9;topMesh.position.y=1.65;obj.add(baseMesh,pillarMesh,topMesh);obj.position.set(tile.mesh.position.x,height,tile.mesh.position.z);break;default:return null}
if(obj){obj.castShadow=obj.receiveShadow=!0;if(obj.children){obj.children.forEach(child=>{child.castShadow=child.receiveShadow=!0})}}
return obj}
checkProximityInteractions(){if(!this.player||!this.player.sprite)return;let closestInteractable=null;let minDistance=Infinity;this.interactables.forEach(interactable=>{if(!interactable.mesh)return;if(interactable.type==='npc'&&interactable.npcRef){interactable.x=interactable.npcRef.pos.x;interactable.z=interactable.npcRef.pos.z}
const distance=Math.sqrt(Math.pow(this.player.pos.x-interactable.x,2)+Math.pow(this.player.pos.z-interactable.z,2));const wasInRange=interactable.inRange;interactable.inRange=distance<=this.proximityRadius;if(interactable.inRange&&!wasInRange){this.addGlowEffect(interactable.mesh)}else if(!interactable.inRange&&wasInRange){this.removeGlowEffect(interactable.mesh)}
if(interactable.inRange&&distance<minDistance){minDistance=distance;closestInteractable=interactable}});this.updateTooltip(closestInteractable)}
addGlowEffect(mesh){if(!mesh.userData)mesh.userData={};if(mesh.userData.glowAdded)return;const addGlowTo=(m)=>{if(!m.userData)m.userData={};if(m.material&&m.material.emissive){const originalEmissive=m.material.emissive.clone();m.userData.originalEmissive=originalEmissive;m.userData.glowAdded=!0;const animate=()=>{if(!m.userData.glowAdded)return;const intensity=(Math.sin(Date.now()*0.003)+1)*0.1;m.material.emissive.setRGB(originalEmissive.r+intensity,originalEmissive.g+intensity,originalEmissive.b+intensity);requestAnimationFrame(animate)};animate()}};if(mesh.isGroup){mesh.children.forEach(addGlowTo)}else{addGlowTo(mesh)}
mesh.userData.glowAdded=!0}
removeGlowEffect(mesh){if(!mesh.userData)mesh.userData={};const removeGlowFrom=(m)=>{if(!m.userData)m.userData={};if(m.userData.glowAdded){m.userData.glowAdded=!1;if(m.material&&m.material.emissive&&m.userData.originalEmissive){m.material.emissive.copy(m.userData.originalEmissive)}}};if(mesh.isGroup){mesh.children.forEach(removeGlowFrom)}else{removeGlowFrom(mesh)}
mesh.userData.glowAdded=!1}
updateTooltip(interactable){const container=document.getElementById('tooltipContainer');if(!interactable){this.hideTooltip();return}
this.activeTooltip=interactable;const canInteract=this.getDistanceToInteractable(interactable)<=1.5;const tooltipDiv=document.createElement('div');tooltipDiv.className=`tooltip interact visible ${canInteract ? 'clickable' : ''}`;tooltipDiv.innerHTML=`
            <strong>${interactable.message}</strong>
            <div class="interact-prompt">${canInteract ? 'Click to interact' : interactable.interact}</div>
        `;const oldHandler=container._clickHandler;if(oldHandler){container.removeEventListener('click',oldHandler);container.removeEventListener('mousedown',oldHandler)}
if(canInteract){tooltipDiv.style.cursor='pointer';container.style.pointerEvents='auto';container.style.zIndex='999';const handleInteraction=(e)=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(this._isInteracting)return;this._isInteracting=!0;setTimeout(()=>this._isInteracting=!1,500);if(this.activeTooltip.type==='npc'&&this.activeTooltip.npcRef){const message=this.activeTooltip.npcRef.interact();if(message){this.showInteractionMessage(message)}}else{this.executeInteraction(this.activeTooltip)}};container.addEventListener('click',handleInteraction);container.addEventListener('mousedown',handleInteraction);container.addEventListener('touchstart',(e)=>{e.preventDefault();e.stopPropagation();if(this._isInteracting)return;this._isInteracting=!0;setTimeout(()=>this._isInteracting=!1,500);if(this.activeTooltip.type==='npc'&&this.activeTooltip.npcRef){const message=this.activeTooltip.npcRef.interact();if(message){this.showInteractionMessage(message)}}else{this.executeInteraction(this.activeTooltip)}});container._clickHandler=handleInteraction}else{container.style.pointerEvents='auto';tooltipDiv.style.cursor='default'}
container.innerHTML='';container.appendChild(tooltipDiv);this.positionTooltip(interactable)}
positionTooltip(interactable){const container=document.getElementById('tooltipContainer');const worldPos=new THREE.Vector3(interactable.mesh.position.x,interactable.mesh.position.y+1.5,interactable.mesh.position.z);const screenPos=worldPos.project(this.camera);const x=(screenPos.x+1)/2*window.innerWidth;const y=-(screenPos.y-1)/2*window.innerHeight;container.style.left=`${x}px`;container.style.top=`${y}px`;container.style.transform='translate(-50%, -100%)'}
hideTooltip(){if(!this.activeTooltip)return;this.activeTooltip=null;const container=document.getElementById('tooltipContainer');const tooltips=container.querySelectorAll('.tooltip');tooltips.forEach(tooltip=>{if(tooltip._clickHandler){tooltip.removeEventListener('click',tooltip._clickHandler)}});container.innerHTML=''}
getDistanceToInteractable(interactable){if(!this.player)return Infinity;return Math.sqrt(Math.pow(this.player.pos.x-interactable.x,2)+Math.pow(this.player.pos.z-interactable.z,2))}
handleInteraction(){if(!this.activeTooltip)return;const distance=this.getDistanceToInteractable(this.activeTooltip);if(distance>1.5)return;const obj=this.activeTooltip;if(obj.type==='npc'&&obj.npcRef){const message=obj.npcRef.interact();if(message){this.showInteractionMessage(message)}
return}
this.executeInteraction(obj)}
executeInteraction(interactable){let message='';switch(interactable.type){case 'npc':if(interactable.npcRef){message=interactable.npcRef.interact();if(message){this.showInteractionMessage(message)}
return}else{message="The NPC nods at you silently."}
break;case 'chest':message='You found 50 gold coins!';break;case 'crystal':message='The crystal glows brightly and fills you with energy!';this.scene.remove(interactable.mesh);this.interactables=this.interactables.filter(i=>i!==interactable);this.hideTooltip();break;case 'shrine':message='You feel blessed by an ancient power...';break}
if(message){this.showInteractionMessage(message)}}
showInteractionMessage(message){const overlay=document.createElement('div');overlay.style.cssText=`
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
        `;overlay.textContent=message;if(!document.getElementById('interactionStyles')){const style=document.createElement('style');style.id='interactionStyles';style.textContent=`
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) translateY(20px); }
                    20%, 80% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
                    100% { opacity: 0; transform: translate(-50%, -50%) translateY(-20px); }
                }
            `;document.head.appendChild(style)}
document.body.appendChild(overlay);setTimeout(()=>overlay.remove(),3000)}
showMessage(text){this.showInteractionMessage(text)}
showConfirmationDialog(interactable,callback){const existingDialog=document.getElementById('confirmationDialog');if(existingDialog)existingDialog.remove();const dialog=document.createElement('div');dialog.id='confirmationDialog';dialog.style.cssText=`
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
        `;const message=this.getConfirmationMessage(interactable);dialog.innerHTML=`
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
        `;document.body.appendChild(dialog);const yesBtn=dialog.querySelector('#confirmYes');const noBtn=dialog.querySelector('#confirmNo');yesBtn.onmouseover=()=>yesBtn.style.background='#4fc3f7';yesBtn.onmouseout=()=>yesBtn.style.background='#43aa8b';noBtn.onmouseover=()=>noBtn.style.background='#f9844a';noBtn.onmouseout=()=>noBtn.style.background='#f3722c';yesBtn.onclick=()=>{dialog.remove();callback(!0)};noBtn.onclick=()=>{dialog.remove();callback(!1)};const handleKeydown=(e)=>{if(e.key==='Escape'){dialog.remove();document.removeEventListener('keydown',handleKeydown);callback(!1)}};document.addEventListener('keydown',handleKeydown)}
getConfirmationMessage(interactable){switch(interactable.type){case 'npc':return'Do you want to talk to this NPC? They might have useful information or quests.';case 'npc_confirmation':return interactable.message;case 'chest':return'Do you want to open this ancient chest? It might contain treasure... or traps.';case 'tree':return'Do you want to examine this old tree? The whispers might reveal ancient secrets.';case 'crystal':return'Do you want to collect this magical crystal? It will disappear forever.';case 'shrine':return'Do you want to pray at this mysterious shrine? Ancient powers await.';default:return'Do you want to interact with this object?'}}}
window.game=new GameEngine()
