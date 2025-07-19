# MiniGeo
MiniGEO / Story Island / Isla Historias its a game

STO
RY ISLAND / ISLA HISTO
RIAS
LA IDEA PRINCIPAL
Imagina una isla que crece contigo. Cada vez que vives una historia, ayudas a alguien o aprendes algo
nuevo, tu isla se transforma. Un árbol brota donde antes no había nada. Una piedra especial aparece
junto al lago. Tu isla se convierte en un diario visual de todas las historias que has vivido.
CÓM
O FUNCIONA
Cuando Vives una Historia
Ayudas a alguien que necesita aprender a pescar en lugar de simplemente darle un pescado. De
repente, aparece una caña de pescar en tu isla. Un pastorcito te pide ayuda porque el lobo amenaza
sus ovejas. Después de resolverlo, un pequeño rebaño aparece paciendo en tu isla.
Cada historia deja su huella. Cada experiencia se convierte en algo que puedes tocar y
ver.
Tu Isla, Tu Decisión
No todos los objetos tienen que quedarse siempre en tu isla. Puedes guardar algunos en un almacén
que crece con el tiempo. Empiezas con un cofre pequeño, pero eventualmente tienes un granero
completo. Puedes reorganizar tu isla como quieras, guardando algunas memorias y mostrando otras.
Moldea Tu Paisaje
Con tu dedo, puedes transformar el terreno de tu isla. Desliza hacia arriba y la tierra se eleva. Sigue
subiendo y se convierte en una montaña. Desliza hacia abajo y se forma un valle. Baja más y se llena
de agua, creando un lago o río.
Es simple: arriba = montaña, abajo = agua. Tu isla refleja no solo las historias que vives, sino también
cómo decides que se vea.
ALGUNAS DE LAS HISTO
RIAS QUE VIVIRÁS
Historias de Sabiduría
El Pescador Hambriento: "No le des pescado, enséñale a pescar" - Aparece una caña de pescar
El Pastorcito y el Lobo: Sobre la honestidad y las consecuencias - Aparece un rebaño de ovejas
El Escorpión y la Rana: Sobre la naturaleza inmutable - Aparece un tronco flotante
El Pajarito en Invierno: Sobre la compasión y el silencio - Aparece un nido con comedero
RECO
MPENSAS QUE EVOLUCIONAN
El Pescador que Prospera
Después de ayudar al pescador hambriento, aparece en tu isla pescando tranquilamente. Con el
tiempo, conseguirá un bote. Si le preguntas cómo lo obtu
vo, te dirá orgulloso que vendió el pescado
que le sobraba. Cuando el pescador obtiene su bote, desbloqueas el acceso al océano - tu isla se
conecta con el mundo marítimo.
Progresión Natural
Las historias no siguen un orden fijo. Cada experiencia que vives puede abrir nuevas posibilidades.
Ayudar a ciertos personajes los hace prosperar, y su prosperidad desbloquea nuevas áreas para
explorar. No son niveles secuenciales - es un mundo que responde a tus acciones.
Historias de Perseverancia
La Liebre y la Tortuga: "Lento pero seguro" - Aparece una meta o trofeo
La Hormiga y la Cigarra: Sobre el trabajo y la previsión - Aparece un hormiguero
El Cuervo y el Cántaro: Sobre la creatividad para resolver problemas - Aparece un cántaro con
piedras
Historias de Codicia y Humildad
La Gallina de los Huevos de Oro: Sobre la paciencia vs la codicia - Aparece una gallina dorada
El León y el Ratón: Sobre la ayuda mutua - Aparece una trampa rota
La Lechera: Sobre soñar con los pies en la tierra - Aparece un cántaro
PO
R QUÉ CONECTA CON LAS PERSONAS
Es Personal
Tu isla es única. Nadie más tendrá exactamente la misma combinación de objetos, el mismo paisaje
moldeado, las mismas historias vividas en el mismo orden.
Es Significativo
Cada objeto cuenta una historia. No es decoración vacía - es un recordatorio de algo que aprendiste,
alguien a quien ayudaste, una sabiduría que ganaste.
Es Relajante
No hay prisa. No hay competencia. Solo tú, tu isla, y las historias que vas descubriendo a tu propio
ritmo.
Es Intuitivo
Arriba = montaña, abajo = agua. Toca una historia = aparece un objeto. Drag and drop = reorganiza tu
isla. No hay menús complicados ni controles conf
usos.
LA MAGIA ESTÁ EN LOS DETALLES
Los O
bjetos Recuerdan
Cada objeto que aparece en tu isla puede contarte cómo llegó ahí. Toca la caña de pescar y te
recuerda la historia del pescador hambriento.
El Paisaje Habla
La forma de tu isla refleja tu personalidad. ¿Prefieres montañas altas y
tranquilos y
valles serenos?
vistas panorámicas? ¿O lagos
Las Historias Conectan
Algunas historias en niveles posteriores hacen referencia a personajes que conociste antes. El mundo
se siente vivo y conectado.
La Sabiduría Crece
No se trata solo de coleccionar objetos. Se trata de entender las lecciones detrás de cada historia, de
ver cómo se aplican a tu propia vida.
DIMENSIONES TÉCNICAS
Optimizado para Móviles
Resolución base: 640x360 píxeles (se adapta a cualquier pantalla)
Sprites isométricos: 64x32 píxeles (vista 3D clásica)
Controles táctiles: Gestos simples y naturales
Carga rápida: Funciona en cualquier navegador móvil
Sistema de Escalado
Pantallas pequeñas: Escala 1x
Pantallas medianas: Escala 1.5x
Pantallas grandes: Escala 2x
Tablets: Escala 2.5x
Todo se ajusta automáticamente para que siempre se vea perfecto, sin importar el dispositivo.
ISLA HISTO
RIAS / STO
RY ISLAND
Cada historia tradicional que vives se convierte en parte de tu paisaje personal. Tu isla crece, cambia y
evoluciona, al igual que tú.
Es la combinación perfecta de entretenimiento y sabiduría, de tecnología y tradición, de juego y
contemplación. Simple de entender, no tan fácil de olvidar.
 
 Isometric Tile-Based Game Development Steps

## Step 1: Basic Three.js Setup & Isometric Camera
**Goal**: Create the foundation with Three.js scene, isometric camera, and basic rendering loop
**Test**: Verify scene loads, camera works, and you can see a basic 3D environment

```html
- HTML5 boilerplate with Three.js CDN
- Scene, renderer, isometric camera setup
- Basic render loop (60fps target)
- Responsive canvas sizing
- Basic lighting (ambient + directional)
```

## Step 2: Grid-Based Terrain System
**Goal**: Create the 8-level height system with water, land, and mountain tiles
**Test**: Generate a visible grid with different colored tiles based on height levels

```html
- Grid generation system (configurable size)
- Height levels 0-7 with appropriate colors:
  * 0-1: Water (deep/shallow blue)
  * 2-5: Land (green variations)
  * 6-7: Mountains (gray/brown)
- Basic tile geometry (cubes/planes)
- Height-based positioning
```

## Step 3: Camera Controls & Mobile Input
**Goal**: Implement smooth camera movement with touch/mouse support
**Test**: Pan, zoom, and rotate camera on both desktop and mobile

```html
- Touch gesture handling (pan, pinch-zoom, tap)
- Mouse controls (WASD, wheel zoom, drag)
- Smooth camera interpolation
- Boundary constraints
- Mobile-first responsive behavior
```

## Step 4: Tile Height Editor
**Goal**: Toggle edit mode to modify terrain height by tapping tiles
**Test**: Click/tap tiles to raise/lower height, see visual changes immediately

```html
- Raycasting for tile selection
- Edit mode toggle
- Height modification system
- Visual feedback (highlights, shadows)
- Undo/redo functionality
```

## Step 5: Visual Style & Lighting
**Goal**: Apply Isla Historias aesthetic with proper lighting and colors
**Test**: Scene should look soft, rounded, with warm colors and good ambient lighting

```html
- Teal/turquoise sky background
- Cloud system (simple animated sprites)
- Soft shadow implementation
- Gradient lighting setup
- Warm color palette application
```

## Step 6: Basic Player Character
**Goal**: Add a moveable character with tap-to-move functionality
**Test**: Tap anywhere, character pathfinds and walks there smoothly

```html
- Simple character geometry/sprite
- Pathfinding algorithm (A* or simple grid-based)
- Smooth movement interpolation
- Basic walking animation
- Character positioning on grid
```

## Step 7: Sprite System Foundation
**Goal**: Create the sprite loading and rendering system
**Test**: Load and display a basic sprite sheet with configurable parameters

```html
- Sprite sheet loader
- Configurable sprite parameters (position, scale, frames)
- Layered rendering system
- Basic animation support
- 8-directional sprite support
```

## Step 8: Debug Interface for Sprites
**Goal**: On-screen controls for sprite parameter adjustment
**Test**: Real-time sprite position, scale, and animation tweaking

```html
- Debug UI panel (HTML overlay)
- Position controls (X, Y, Z sliders)
- Scale controls (width, height, depth)
- Animation frame selector
- Parameter copy-paste output
- Collision box visualization
```

## Step 9: Interaction System
**Goal**: Proximity-based interactions and tooltip system
**Test**: Approach objects, see context-sensitive tooltips appear

```html
- Proximity detection (2-3 tile radius)
- Tooltip system with HTML elements
- Context-sensitive messaging
- Smooth tooltip animations
- Object interaction triggers
```

## Step 10: Save/Load & Object Placement
**Goal**: Map editor functionality and persistence
**Test**: Place objects, save map to JSON, reload and verify everything appears correctly

```html
- Object placement system
- JSON map serialization
- Save/load functionality
- Interactive object library
- Map validation
```

## Step 11: Performance Optimization
**Goal**: Ensure 60fps on mobile devices
**Test**: Profile performance, optimize rendering, implement frustum culling

```html
- Frustum culling implementation
- Object pooling for sprites
- Render optimization
- Memory management
- Mobile performance profiling
```

## Step 12: Final Polish & SCSS Styling
**Goal**: Complete the UI styling and final touches
**Test**: Everything looks polished and professional

```scss
- SCSS compilation for UI elements
- Responsive breakpoints
- Animation transitions
- Loading states
- Error handling UI
```

---

## Implementation Notes:
- Each step builds on the previous ones
- Test thoroughly before moving to the next step
- Keep modules separate: Camera, Map, Player, Sprites, Input, UI
- Document sprite integration points clearly
- Prioritize mobile performance throughout

## Recommended Testing Flow:
1. Implement step
2. Test on desktop browser
3. Test on mobile device
4. Verify performance
5. Commit/save progress
6. Move to next step

Would you like me to start implementing Step 1, or would you prefer to begin with a different step?
