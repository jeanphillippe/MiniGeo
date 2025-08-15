      const CONFIG = {
        player: {
          acc: 0.1,
          maxSpeed: 0.8,
          friction: 0.92,
          health: 1000
        },
        space: {
          starCount: 1000,
          rotSpeed: 0.0001,
          size: 600
        },
        enemy: {
          orbitMod: 8,
          baseSpeed: 0.015,
          speedVar: 0.005,
          attackRange: 40,
          health: 30,
          chaseSpeed: 0.3,
          retSpeed: 0.3,
          shootCooldown: 120,
          minDistance: 4
        },
        bullet: {
          speed: 2,
          life: 80,
          damage: 10,
          enemySpeed: 1.5,
          enemyDamage: 15
        },
        weapons: {
          laser: {
            damage: 20,
            width: 10,
            maxDist: 100
          }
        },
        audio: {
          speed: {
            color: 0x00ff00,
            effect: 'speed',
            mult: 1.5,
            duration: 30000
          },
          damage: {
            color: 0xff0000,
            effect: 'damage',
            mult: 2,
            duration: 30000
          },
          health: {
            color: 0x0088ff,
            effect: 'health',
            amount: 200,
            duration: 0
          }
        }
      };
      class ShipFactory {
        static templates = {
          player: {
            type: 'tie',
            scale: 0.9,
            cockpit: 'octahedron',
            cockpitScale: 1.5,
            panelCount: 2,
            panelShape: 'diamond',
            panelSize: 4,
            panelDist: 2.2,
            panelThick: 0.1,
            panelY: 0.2,
            panelZ: 0.1,
            panelRotX: -50,
            panelRotY: 0,
            panelAngle: 0,
            hasStruts: !0,
            strutType: 'hexagonal',
            strutThick: 0.19,
            strutCount: 1,
            strutAngle: -90,
            primaryColor: 0x3742fa,
            secondaryColor: 0x2f3542,
            accentColor: 0x70a1ff,
            cockpitColor: 0xff4757
          },
          fighter: {
            type: 'classic',
            scale: 1,
            bodyWidth: 1.5,
            bodyHeight: 0.2,
            bodyLength: 3,
            hasWings: !0,
            wingSpan: 3,
            wingThick: 0.15,
            wingPos: 0,
            wingRotY: 0,
            wingDihedral: 0,
            engineCount: 2,
            engineSize: 0.25,
            enginePosZ: -1.5,
            engineSpacing: 1.5,
            hasCockpit: !0,
            cockpit: 'sphere',
            cockpitScale: 0.3,
            cockpitY: 0.2,
            cockpitZ: 1,
            primaryColor: 0xff4757,
            secondaryColor: 0xff3838,
            accentColor: 0xff6b6b,
            cockpitColor: 0x2f3542
          },
          interceptor: {
            type: 'tie',
            scale: 1.33,
            cockpit: 'sphere',
            cockpitScale: 1.2,
            panelCount: 2,
            panelShape: 'hexagon',
            panelSize: 2,
            panelDist: 2.5,
            panelThick: 0.1,
            panelY: 0,
            panelZ: 0,
            panelRotX: 5,
            panelRotY: -90,
            panelAngle: 90,
            hasStruts: !0,
            strutType: 'cylinder',
            strutThick: 0.11,
            strutCount: 1,
            strutAngle: 90,
            primaryColor: 0x9b59b6,
            secondaryColor: 0x8e44ad,
            accentColor: 0xd63031,
            cockpitColor: 0x2d3436
          },
          heavy: {
            type: 'classic',
            scale: 1.2,
            bodyWidth: 2.5,
            bodyHeight: 0.4,
            bodyLength: 5,
            hasWings: !0,
            wingSpan: 5,
            wingThick: 0.3,
            wingPos: -1.5,
            wingRotY: 0,
            wingDihedral: 0,
            engineCount: 4,
            engineSize: 0.4,
            enginePosZ: -2.5,
            engineSpacing: 1.5,
            hasCockpit: !0,
            cockpit: 'sphere',
            cockpitScale: 0.5,
            cockpitY: 0.4,
            cockpitZ: 1.5,
            primaryColor: 0x2ed573,
            secondaryColor: 0x1e90ff,
            accentColor: 0x7bed9f,
            cockpitColor: 0xff5252
          },
          scout: {
            type: 'classic',
            scale: 1.6,
            bodyWidth: 1.2,
            bodyHeight: 0.6,
            bodyLength: 4.6,
            hasWings: !0,
            wingSpan: 5.6,
            wingThick: 0.15,
            wingPos: -1.5,
            wingRotY: 0,
            wingDihedral: 0,
            engineCount: 2,
            engineSize: 0.4,
            enginePosZ: -2,
            engineSpacing: 1.6,
            hasCockpit: !0,
            cockpit: 'sphere',
            cockpitScale: 0.5,
            cockpitY: 0.3,
            cockpitZ: -0.5,
            primaryColor: 0xfeca57,
            secondaryColor: 0x2ed9ff,
            accentColor: 0xfeca57,
            cockpitColor: 0x616161
          },
          purplediamond: {
            type: 'tie',
            scale: 1.8,
            cockpit: 'octahedron',
            cockpitScale: 2.1,
            panelCount: 2,
            panelShape: 'triangle',
            panelSize: 1.4,
            panelDist: 2,
            panelThick: 0.5,
            panelY: 0,
            panelZ: 0.1,
            panelRotX: 35,
            panelRotY: 5,
            panelAngle: 0,
            hasStruts: !1,
            strutType: 'cylinder',
            strutThick: 0.19,
            strutCount: 3,
            strutAngle: -10,
            primaryColor: 0x5f27cd,
            secondaryColor: 0xfeca57,
            accentColor: 0x96ceb4,
            cockpitColor: 0x5f27cd
          },
          doradito: {
            type: 'tie',
            scale: 0.5,
            cockpit: 'dodecahedron',
            cockpitScale: 2.1,
            panelCount: 2,
            panelShape: 'diamond',
            panelSize: 4,
            panelDist: 3.3,
            panelThick: 0.4,
            panelY: 0.2,
            panelZ: -2,
            panelRotX: -90,
            panelRotY: 90,
            panelAngle: 0,
            hasStruts: !0,
            strutType: 'box',
            strutThick: 0.29,
            strutCount: 2,
            strutAngle: -40,
            primaryColor: 0xff9f43,
            secondaryColor: 0xff6b6b,
            accentColor: 0xfeca57,
            cockpitColor: 0xfeca57
          }
        };
        static geometries = {
          hexagon: (sz) => new THREE.CylinderGeometry(sz, sz, 0.1, 6),
          square: (sz) => new THREE.BoxGeometry(sz, sz, 0.1),
          diamond: (sz) => {
            const g = new THREE.OctahedronGeometry(sz / 1.4);
            g.scale(1, 1, 0.1);
            return g
          },
          circle: (sz) => new THREE.CylinderGeometry(sz / 2, sz / 2, 0.1, 16),
          triangle: (sz) => {
            const g = new THREE.ConeGeometry(sz, 0.1, 3);
            g.rotateX(Math.PI / 2);
            return g
          },
          star: (sz) => {
            const shape = new THREE.Shape();
            const outerRadius = sz;
            const innerRadius = sz * 0.5;
            const spikes = 5;
            for (let i = 0; i < spikes * 2; i++) {
              const angle = (i / (spikes * 2)) * Math.PI * 2;
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              if (i === 0) shape.moveTo(x, y);
              else shape.lineTo(x, y)
            }
            return new THREE.ExtrudeGeometry(shape, {
              depth: 0.1,
              bevelEnabled: !1
            })
          }
        };
        static create(templateName, customProps = {}) {
          const template = {
            ...this.templates[templateName],
            ...customProps
          };
          if (!template) {
            console.warn(`Ship template '${templateName}' not found`);
            return this.create('fighter')
          }
          return template.type === 'tie' ? this.createTieShip(template) : this.createClassicShip(template)
        }
        static createTieShip(cfg) {
          const ship = new THREE.Group();
          const sc = cfg.scale || 1.8;
          let cockpitGeom;
          switch (cfg.cockpit || 'sphere') {
            case 'sphere':
              cockpitGeom = new THREE.SphereGeometry((cfg.cockpitScale || 1.2) * sc, 12, 12);
              break;
            case 'box':
              cockpitGeom = new THREE.BoxGeometry((cfg.cockpitScale || 1.2) * sc, (cfg.cockpitScale || 1.2) * sc, (cfg.cockpitScale || 1.2) * sc);
              break;
            case 'octahedron':
              cockpitGeom = new THREE.OctahedronGeometry((cfg.cockpitScale || 1.2) * sc);
              break;
            case 'cylinder':
              cockpitGeom = new THREE.CylinderGeometry((cfg.cockpitScale || 1.2) * sc, (cfg.cockpitScale || 1.2) * sc, (cfg.cockpitScale || 1.2) * sc, 8);
              break;
            case 'dodecahedron':
              cockpitGeom = new THREE.DodecahedronGeometry((cfg.cockpitScale || 1.2) * sc);
              break;
            default:
              cockpitGeom = new THREE.SphereGeometry((cfg.cockpitScale || 1.2) * sc, 12, 12)
          }
          const cockpitMat = new THREE.MeshLambertMaterial({
            color: cfg.cockpitColor || 0xff5252
          });
          const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat);
          ship.add(cockpit);
          for (let i = 0; i < (cfg.panelCount || 2); i++) {
            const panelGeom = this.geometries[cfg.panelShape || 'hexagon']((cfg.panelSize || 2) * sc);
            panelGeom.scale(1, 1, (cfg.panelThick || 0.1) * sc * 10);
            const panelMat = new THREE.MeshLambertMaterial({
              color: cfg.primaryColor || 0x2ed573
            });
            const panel = new THREE.Mesh(panelGeom, panelMat);
            const angle = (i * Math.PI * 2) / (cfg.panelCount || 2);
            const x = Math.cos(angle) * (cfg.panelDist || 2.5) * sc;
            const z = Math.sin(angle) * (cfg.panelDist || 2.5) * sc;
            panel.position.set(x, (cfg.panelY || 0) * sc, z + (cfg.panelZ || 0) * sc);
            panel.rotation.x = ((cfg.panelRotX || 0) * Math.PI) / 180;
            panel.rotation.y = angle + Math.PI / 2 + ((cfg.panelRotY || 0) * Math.PI) / 180;
            panel.rotation.z = ((cfg.panelAngle || 0) * Math.PI) / 180;
            ship.add(panel);
            if (cfg.hasStruts !== !1) {
              for (let s = 0; s < (cfg.strutCount || 1); s++) {
                let strutGeom;
                const strutLength = (cfg.panelDist || 2.5) * sc * 0.8;
                switch (cfg.strutType || 'cylinder') {
                  case 'cylinder':
                    strutGeom = new THREE.CylinderGeometry((cfg.strutThick || 0.1) * sc, (cfg.strutThick || 0.1) * sc, strutLength, 8);
                    break;
                  case 'box':
                    strutGeom = new THREE.BoxGeometry((cfg.strutThick || 0.1) * sc * 2, strutLength, (cfg.strutThick || 0.1) * sc * 2);
                    break;
                  case 'hexagonal':
                    strutGeom = new THREE.CylinderGeometry((cfg.strutThick || 0.1) * sc, (cfg.strutThick || 0.1) * sc, strutLength, 6);
                    break;
                  default:
                    strutGeom = new THREE.CylinderGeometry((cfg.strutThick || 0.1) * sc, (cfg.strutThick || 0.1) * sc, strutLength, 8)
                }
                const strutMat = new THREE.MeshLambertMaterial({
                  color: cfg.secondaryColor || 0x1e90ff
                });
                const strut = new THREE.Mesh(strutGeom, strutMat);
                const strutOffset = (cfg.strutCount || 1) > 1 ? (s - ((cfg.strutCount || 1) - 1) / 2) * 0.3 * sc : 0;
                const strutX = x / 2;
                const strutZ = (z + (cfg.panelZ || 0) * sc) / 2 + strutOffset;
                strut.position.set(strutX, (cfg.panelY || 0) * sc / 2, strutZ);
                strut.rotation.z = -angle + ((cfg.strutAngle || 0) * Math.PI) / 180;
                if ((cfg.strutType || 'cylinder') === 'box') {
                  strut.rotation.y = angle
                }
                ship.add(strut)
              }
            }
          }
          return ship
        }
        static createClassicShip(cfg) {
          const ship = new THREE.Group();
          const sc = cfg.scale || 1.8;
          const bodyGeom = new THREE.BoxGeometry((cfg.bodyWidth || 2) * sc, (cfg.bodyHeight || 0.3) * sc, (cfg.bodyLength || 4) * sc);
          const bodyMat = new THREE.MeshLambertMaterial({
            color: cfg.primaryColor || 0x2ed573
          });
          const body = new THREE.Mesh(bodyGeom, bodyMat);
          ship.add(body);
          if (cfg.hasWings !== !1) {
            const wingGeom = new THREE.BoxGeometry((cfg.wingSpan || 4) * sc, (cfg.wingThick || 0.2) * sc, 1 * sc);
            const wingMat = new THREE.MeshLambertMaterial({
              color: cfg.secondaryColor || 0x1e90ff
            });
            const wing = new THREE.Mesh(wingGeom, wingMat);
            wing.position.set(0, -0.1 * sc, (cfg.wingPos || -1) * sc);
            wing.rotation.z = ((cfg.wingRotY || 0) * Math.PI) / 180;
            wing.rotation.x = ((cfg.wingDihedral || 0) * Math.PI) / 180;
            ship.add(wing)
          }
          const engineCount = cfg.engineCount || 2;
          const engineSpacing = cfg.engineSpacing || 1.5;
          const enginePositions = [];
          if (engineCount === 1) {
            enginePositions.push([0, 0])
          } else if (engineCount === 2) {
            enginePositions.push([-(engineSpacing * sc), 0], [engineSpacing * sc, 0])
          } else if (engineCount === 3) {
            enginePositions.push([0, 0], [-(engineSpacing * sc), 0], [engineSpacing * sc, 0])
          } else if (engineCount === 4) {
            enginePositions.push([-(engineSpacing * sc), 0], [engineSpacing * sc, 0], [-(engineSpacing * sc), 0.3 * sc], [engineSpacing * sc, 0.3 * sc])
          } else if (engineCount === 6) {
            enginePositions.push([-(engineSpacing * sc), 0], [engineSpacing * sc, 0], [-(engineSpacing * sc) * 0.7, 0.3 * sc], [engineSpacing * sc * 0.7, 0.3 * sc], [-(engineSpacing * sc) * 0.7, -0.3 * sc], [engineSpacing * sc * 0.7, -0.3 * sc])
          }
          for (let i = 0; i < enginePositions.length; i++) {
            const engineGeom = new THREE.SphereGeometry((cfg.engineSize || 0.3) * sc, 8, 8);
            const engineMat = new THREE.MeshBasicMaterial({
              color: cfg.accentColor || 0x7bed9f,
              transparent: !0,
              opacity: 0.8
            });
            const engine = new THREE.Mesh(engineGeom, engineMat);
            engine.position.set(enginePositions[i][0], enginePositions[i][1], (cfg.enginePosZ || -2) * sc);
            ship.add(engine)
          }
          if (cfg.hasCockpit !== !1) {
            let cockpitGeom;
            switch (cfg.cockpit || 'sphere') {
              case 'sphere':
                cockpitGeom = new THREE.SphereGeometry((cfg.cockpitScale || 0.4) * sc, 8, 8);
                break;
              case 'box':
                cockpitGeom = new THREE.BoxGeometry((cfg.cockpitScale || 0.4) * sc, (cfg.cockpitScale || 0.4) * sc, (cfg.cockpitScale || 0.4) * sc);
                break;
              case 'cylinder':
                cockpitGeom = new THREE.CylinderGeometry((cfg.cockpitScale || 0.4) * sc, (cfg.cockpitScale || 0.4) * sc, (cfg.cockpitScale || 0.4) * sc, 8);
                break;
              case 'cone':
                cockpitGeom = new THREE.ConeGeometry((cfg.cockpitScale || 0.4) * sc, (cfg.cockpitScale || 0.4) * sc * 1.5, 8);
                break;
              default:
                cockpitGeom = new THREE.SphereGeometry((cfg.cockpitScale || 0.4) * sc, 8, 8)
            }
            const cockpitMat = new THREE.MeshLambertMaterial({
              color: cfg.cockpitColor || 0xff5252
            });
            const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat);
            cockpit.position.set(0, (cfg.cockpitY || 0.3) * sc, (cfg.cockpitZ || 0.5) * sc);
            ship.add(cockpit)
          }
          return ship
        }
      }
      class EnemyFactory {
        static types = {
          'f': {
            shipType: 'fighter',
            health: 30,
            chaseSpeed: 0.4,
            weaponType: 'rapid',
            attackRange: 40,
            score: 100
          },
          'i': {
            shipType: 'interceptor',
            health: 50,
            chaseSpeed: 0.5,
            weaponType: 'burst',
            attackRange: 40,
            score: 150
          },
          's': {
            shipType: 'scout',
            health: 50,
            chaseSpeed: 0.6,
            weaponType: 'burst',
            attackRange: 40,
            score: 150
          },
          'd': {
            shipType: 'doradito',
            health: 50,
            chaseSpeed: 0.6,
            weaponType: 'burst',
            attackRange: 40,
            score: 150
          },
          'p': {
            shipType: 'purplediamond',
            health: 50,
            chaseSpeed: 0.6,
            weaponType: 'burst',
            attackRange: 40,
            score: 150
          },
          'h': {
            shipType: 'heavy',
            health: 100,
            chaseSpeed: 0.3,
            weaponType: 'heavy',
            attackRange: 45,
            score: 200
          }
        };
        static create(type, planet, index, totalCount) {
          const config = this.types[type];
          if (!config) {
            console.warn(`Enemy type '${type}' not found`);
            return null
          }
          const ship = ShipFactory.create(config.shipType);
          const angle = (index * Math.PI * 2) / totalCount;
          return {
            mesh: ship,
            planet: planet,
            angle: angle,
            originalAngle: angle,
            speed: CONFIG.enemy.baseSpeed + Math.random() * CONFIG.enemy.speedVar,
            attackRange: config.attackRange,
            attacking: !1,
            retreating: !1,
            health: config.health,
            maxHealth: config.health,
            type: type,
            chaseSpeed: config.chaseSpeed,
            shootCooldown: 0,
            weaponType: config.weaponType,
            score: config.score,
            stuck: !1
          }
        }
      }
      class PlanetFactory {
        static configs = [{
          radius: 18,
          color: 0xff6b6b,
          distance: 100,
          enemyCount: 9,
          enemyType: 'f',
           style: 'sharp',          // 🔧 Angular mining/industrial surface
          irregularity: 0,   
          health: 200,
          orbitCenter: {
            x: 0,
            z: 0
          },
          orbitSpeed: 0.005,
          startAngle: 0,
          dialogue: {
            name: 'Asteria Prime',
            image: './quantumfrontier/assets/images/planets.jpeg',
             setStoryWaypoint:'Helion IV',
            baseText: 'Asteria Prime fue una vez el mayor exportador de minerales raros del sector, con flotas de cargueros despegando diariamente hacia los mundos centrales. Ahora solo quedan torres de perforación oxidadas y pueblos fantasma barridos por tormentas de polvo. Entre los datos fragmentados de las últimas semanas antes del abandono, algo no encaja. Transferencias nocturnas, códigos de embarque alterados, y un patrón que solo alguien con tu experiencia podría reconocer: contrabando a gran escala.El rastro apunta hacia los cañones rocosos de Helion IV, donde los mercenarios no hacen preguntas.',
            flagTexts: {
              visited_proxima: 'Energy readings from Proxima Centauri b indicate this planet was part of an interconnected network.',
              visited_trappist: 'The quantum signatures resonate with TRAPPIST-1e readings - confirming the ancient network theory.'
            }
          }
        }, {
          radius: 25,
          color: 0xff0000,
          distance: 180,
          enemyCount: 6,
          enemyType: 'd',
          health: 300,
          orbitCenter: {
            x: 0,
            z: 0
          },
          orbitSpeed: 0.003,
          startAngle: Math.PI / 4,
          dialogue: {
            name: 'Pyrrhos',
             setStoryWaypoint:'Helion IV',
            image: './quantumfrontier/assets/images/planets44.jpeg',
            baseText: 'Pyrrhos es un infierno de lava y roca fundida donde los ríos de magma serpentean entre picos de basalto negro. El calor es tan intenso que incluso los drones más resistentes fallan después de pocas horas de exposición. Aquí, la supervivencia se mide en minutos. Enterrada en las profundidades rocosas, una forja milenaria late con el resplandor de cristales semi-formados. Los grabados en las paredes hablan de una civilización que dominaba energías capaces de abrir puertas entre mundos. Pero también advierten sobre el precio de tal poder. Las inscripciones apuntan hacia "los guardianes del mundo verde" en Viridara, donde el conocimiento ancestral aguarda entre las ruinas envueltas en vegetación.',
            flagTexts: {
              visited_kepler: 'The crystalline formations here match those found on Kepler-442b - part of the same stellar engineering project.',
              visited_trappist: 'Cross-referencing with TRAPPIST-1e data reveals this is a mining outpost for the ancient network.'
            }
          }
        }, {
          radius: 25,
          color: 0x00ff88,
          distance: 220,
          enemyCount: 6,
          irregularity: 0.4,   
          enemyType: 'p',
          health: 300,
          orbitCenter: {
            x: 50,
            z: 50
          },
          orbitSpeed: 0.002,
          startAngle: Math.PI / 2,
          dialogue: {
            name: 'Helion IV',
            image: 'quantumfrontier/assets/images/planets3.jpeg',
            baseText: 'Los cañones de arenisca roja de Helion IV ocultan una de las fortalezas mercenarias más temidas del sector exterior. Durante décadas, estas paredes rocosas han protegido operaciones que los mundos centrales prefieren ignorar: tráfico de armas, información clasificada, y cargamentos que oficialmente nunca existieron. Las patrullas aéreas que surcan los desfiladeros son solo la primera advertencia. Aquí, la lealtad se compra con créditos y las preguntas equivocadas pueden costarte más que tu nave. Pero los registros de Asteria Prime no mienten: algo importante pasó por esta fortaleza. Un contacto en las cantinas subterráneas menciona algo perturbador: el FSA intentó un asalto reciente que terminó en desastre. Los mercenarios hablan de "fragmentos cristalinos" y una guerra que apenas está comenzando.',
            flagTexts: {
              visited_kepler: 'The quantum signatures here resonate with similar readings from Kepler-442b. This confirms the ancient network theory.',
              visited_proxima: 'Data correlation with Proxima Centauri b suggests this was the central hub of an ancient civilization.'
            }
          }
        }, {
          radius: 15,
          color: 0x87ceeb,
          distance: 140,
          enemyCount: 4,
          enemyType: 'f',
          irregularity: 0,
          health: 150,
          orbitCenter: {
            x: -30,
            z: 20
          },
          orbitSpeed: 0.007,
          startAngle: Math.PI,
          dialogue: {
            name: 'Glacialis',
            image: './quantumfrontier/assets/images/planets.jpeg',
            setStoryWaypoint: 'Asteria Prime',
            baseText: 'Glacialis es un mundo de hielo eterno donde las temperaturas nunca superan los -200°C. Vastas llanuras de hielo azul se extienden hasta el horizonte, interrumpidas por imponentes cordilleras cristalinas que brillan bajo la luz de estrellas distantes. Bajo la superficie helada, antiguos complejos de investigación permanecen preservados en el tiempo. Los laboratorios criogénicos aún funcionan con energía geotérmica, manteniendo muestras de civilizaciones perdidas y experimentos que desafían la comprensión actual. Los registros hablan de "muestras de Asteria Prime" almacenadas en las bóvedas más profundas.',
            flagTexts: {
              visited_asteria: 'Cryogenic logs confirm mineral samples from Asteria Prime were stored here before the evacuation.',
              visited_pyrrhos: 'Temperature differential studies between this ice world and Pyrrhos reveal connected research projects.'
            }
          }
        }, {
          radius: 35,
          color: 0x4b0082,
          distance: 320,
          enemyCount: 12,
          enemyType: 'd',
          irregularity: 0.6,
          health: 500,
          orbitCenter: {
            x: 0,
            z: 0
          },
          orbitSpeed: 0.001,
          startAngle: Math.PI / 6,
          dialogue: {
            name: 'Tempest Major',
            image: './quantumfrontier/assets/images/planets44.jpeg',
            setStoryWaypoint: 'Pyrrhos',
            baseText: 'Tempest Major es un gigante gaseoso de tormentas perpetuas donde vientos de 2000 km/h crean un ballet caótico de nubes violetas y relámpagos plasmáticos. Sus tres lunas principales orbitan en formación, cada una equipada con estaciones de investigación atmosférica abandonadas. En las capas superiores de la atmósfera, plataformas flotantes extraen gases raros utilizados en la fabricación de cristales de energía. Los trabajadores que sobrevivieron al abandono masivo hablan de extrañas resonancias que emergían desde las profundidades del planeta. Las frecuencias registradas coinciden con las emanaciones cristalinas de Pyrrhos.',
            flagTexts: {
              visited_pyrrhos: 'Atmospheric resonance patterns match the crystal formations found on Pyrrhos.',
              visited_helion: 'Gas extraction records show shipments to mercenary bases on Helion IV.'
            }
          }
        }, {
          radius: 20,
          color: 0xffa500,
          distance: 260,
          enemyCount: 8,
          enemyType: 'p',
          style: 'sharp',
          irregularity: 0.2,
          health: 250,
          orbitCenter: {
            x: 80,
            z: -40
          },
          orbitSpeed: 0.004,
          startAngle: Math.PI / 3,
          dialogue: {
            name: 'Aridus',
            image: './quantumfrontier/assets/images/planets3.jpeg',
            setStoryWaypoint: 'Glacialis',
            baseText: 'Aridus es un desierto sin fin de dunas doradas que cambian con los vientos solares. Dos soles gemelos baten este mundo durante 30 horas al día, creando un paisaje de espejismos y oasis efímeros donde la realidad se distorsiona. Ocultas entre las dunas, estructuras piramidales de metal oxidado emergen ocasionalmente después de las tormentas. Estas ruinas contienen archivos holográficos de una civilización nómada que dominaba la navegación interdimensional. Los archivos mencionan "refugios de hielo" donde guardaban sus descubrimientos más valiosos.',
            flagTexts: {
              visited_glacialis: 'Archive cross-references confirm research caches were hidden on the ice world Glacialis.',
              visited_tempest: 'Navigation records show this civilization used gas giant gravitational fields for interdimensional travel.'
            }
          }
        }];

        static createPlanetTexture(color, radius, type) {
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext('2d');
          const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
          if (type === 'gas') {
            gradient.addColorStop(0, `hsl(${(color >> 16) & 255}, 70%, 60%)`);
            gradient.addColorStop(0.3, `hsl(${((color >> 8) & 255) + 20}, 80%, 45%)`);
            gradient.addColorStop(0.7, `hsl(${(color & 255) + 40}, 60%, 35%)`);
            gradient.addColorStop(1, `hsl(${(color >> 16) & 255}, 50%, 25%)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);
            for (let i = 0; i < 8; i++) {
              ctx.strokeStyle = `hsla(${((color >> 8) & 255) + i * 10}, 60%, ${40 + i * 3}%, 0.6)`;
              ctx.lineWidth = 2 + Math.random() * 3;
              ctx.beginPath();
              ctx.moveTo(0, 100 + i * 40 + Math.sin(i) * 20);
              for (let x = 0; x < 512; x += 10) {
                ctx.lineTo(x, 100 + i * 40 + Math.sin(x * 0.02 + i) * 15 + Math.cos(x * 0.01) * 10)
              }
              ctx.stroke()
            }
          } else if (type === 'ice') {
            const iceGrad = ctx.createLinearGradient(0, 0, 512, 512);
            iceGrad.addColorStop(0, '#b3e5fc');
            iceGrad.addColorStop(0.5, '#81d4fa');
            iceGrad.addColorStop(1, '#4fc3f7');
            ctx.fillStyle = iceGrad;
            ctx.fillRect(0, 0, 512, 512);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            for (let i = 0; i < 200; i++) {
              const x = Math.random() * 512;
              const y = Math.random() * 512;
              const size = Math.random() * 3 + 1;
              ctx.fillRect(x, y, size, size)
            }
            for (let i = 0; i < 50; i++) {
              ctx.strokeStyle = 'rgba(200, 230, 255, 0.6)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 20 + 5, 0, Math.PI * 2);
              ctx.stroke()
            }
          } else {
            const baseHue = (color >> 16) & 255;
            ctx.fillStyle = `hsl(${baseHue}, 40%, 35%)`;
            ctx.fillRect(0, 0, 512, 512);
            for (let i = 0; i < 100; i++) {
              const x = Math.random() * 512;
              const y = Math.random() * 512;
              const size = Math.random() * 15 + 5;
              ctx.fillStyle = `hsla(${baseHue + Math.random() * 30 - 15}, 50%, ${25 + Math.random() * 20}%, 0.7)`;
              ctx.beginPath();
              ctx.arc(x, y, size, 0, Math.PI * 2);
              ctx.fill()
            }
            for (let i = 0; i < 50; i++) {
              const x = Math.random() * 512;
              const y = Math.random() * 512;
              const size = Math.random() * 8 + 3;
              ctx.fillStyle = `hsla(${baseHue}, 30%, 20%, 0.8)`;
              ctx.beginPath();
              ctx.arc(x, y, size, 0, Math.PI * 2);
              ctx.fill()
            }
          }
          return new THREE.CanvasTexture(canvas)
        }
static createIrregularPlanet(radius, irregularity = 0, style = 'highdetail') {
  // Configurar subdivisiones según el estilo
   
  let subdivisions;
  switch(style) {
    case 'lowpoly':     subdivisions = [8, 6];   break;  // 🔧 Muy angular
    case 'sharp':       subdivisions = [16, 12]; break;  // 🔧 Angular pero con más detalle
    case 'medium':      subdivisions = [32, 24]; break;  // 🔧 Balance
    case 'smooth':      subdivisions = [64, 64]; break;  // 🔧 Suave (original)
    case 'highdetail':  subdivisions = [128, 96]; break; // 🔧 Muy detallado
    default:            subdivisions = [32, 24];
  }
  
  const geometry = new THREE.SphereGeometry(radius, subdivisions[0], subdivisions[1]);
  const positions = geometry.attributes.position.array;
  const noise = new PerlinNoise(Math.random());
  
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const distance = Math.sqrt(x*x + y*y + z*z);
    
    const nx = x / radius;
    const ny = y / radius;
    const nz = z / radius;
    
    // Aplicar ruido según el estilo
    let heightVariation = 0;
    
    if (style === 'lowpoly') {
      // 🔧 ESTILO LOW POLY - Pocos detalles, cambios dramáticos
      heightVariation += noise.noise(nx * 2, ny * 2, nz * 2) * 0.8;
      heightVariation += noise.noise(nx * 4, ny * 4, nz * 4) * 0.4;
      
      // Cuantizar para crear "steps" más marcados
      heightVariation = Math.floor(heightVariation * 4) / 4;
      
    } else if (style === 'sharp') {
      // 🔧 ESTILO SHARP - Detalles medios con bordes definidos
      heightVariation += noise.noise(nx * 3, ny * 3, nz * 3) * 0.7;
      heightVariation += noise.noise(nx * 6, ny * 6, nz * 6) * 0.3;
      heightVariation += noise.noise(nx * 12, ny * 12, nz * 12) * 0.1;
      
      // Aplicar función que acentúa los contrastes
      heightVariation = Math.sign(heightVariation) * Math.pow(Math.abs(heightVariation), 0.7);
      
    } else if (style === 'terraced') {
      // 🔧 ESTILO TERRAZAS - Como mesas/escalones
      heightVariation += noise.noise(nx * 4, ny * 4, nz * 4) * 0.6;
      heightVariation += noise.noise(nx * 8, ny * 8, nz * 8) * 0.3;
      
      // Crear terrazas/escalones
      const steps = 6;
      heightVariation = Math.floor(heightVariation * steps) / steps;
      
    } else {
      // 🔧 ESTILO SMOOTH (original)
      heightVariation += noise.noise(nx * 4, ny * 4, nz * 4) * 0.6;
      heightVariation += noise.noise(nx * 8, ny * 8, nz * 8) * 0.3;
      heightVariation += noise.noise(nx * 16, ny * 16, nz * 16) * 0.1;
    }
    
    const newDistance = radius + (heightVariation * irregularity * radius);
    const factor = newDistance / distance;
    
    positions[i] = x * factor;
    positions[i + 1] = y * factor;
    positions[i + 2] = z * factor;
  }
  
  geometry.attributes.position.needsUpdate = true;
  
  // 🔧 CONTROL DE SUAVIZADO
  if (style === 'lowpoly' || style === 'sharp' || style === 'terraced') {
    // NO computar normales suaves = mantener bordes sharp
    geometry.computeFaceNormals();
  } else {
    // Computar normales suaves para apariencia "blobby"
    geometry.computeVertexNormals();
  }
  
  return geometry;
}
 static create(index,config=null){
    const cfg=config||this.configs[index%this.configs.length];
    const planetTypes=['rocky','ice','rocky','rocky','gas'];
    const initialAngle=cfg.startAngle||((Math.PI*2/this.configs.length)*index);
    let planetGeom;
    const irregularity=cfg.irregularity!==undefined?cfg.irregularity:0.3;
    if(irregularity===0){
        planetGeom=new THREE.SphereGeometry(cfg.radius,32,24)
    }else{
        planetGeom=this.createIrregularPlanet(cfg.radius,irregularity,cfg.style||'medium')
    }
    
    // Don't use complex textures for highly emissive objects (like suns)
    const isHighlyEmissive = cfg.emissiveIntensity && cfg.emissiveIntensity > 0.5;
    const texture = isHighlyEmissive ? null : this.createPlanetTexture(cfg.color,cfg.radius,planetTypes[index%planetTypes.length]);
    const materialProps = texture ? {map:texture,color:cfg.color} : {color:cfg.color};
    
    if(cfg.emissive!==undefined){
        materialProps.emissive=new THREE.Color(cfg.emissive);
        materialProps.emissiveIntensity=cfg.emissiveIntensity||0.3
    }
    
    let planetMat;
    if(cfg.emissiveIntensity&&cfg.emissiveIntensity>0.5){
        // Fix: MeshBasicMaterial doesn't support emissiveIntensity, so we multiply the color
        const emissiveColor = materialProps.emissive || new THREE.Color(cfg.color);
        const intensity = cfg.emissiveIntensity || 1.0;
        emissiveColor.multiplyScalar(intensity);
        
        const basicMaterialProps = {
            color:cfg.color,
            emissive:emissiveColor
        };
        if(texture) basicMaterialProps.map = texture;
        
        planetMat=new THREE.MeshBasicMaterial(basicMaterialProps)
    }else{
        const lambertMaterialProps = {color: cfg.color};
        if(texture) lambertMaterialProps.map = texture;
        if(materialProps.emissive) lambertMaterialProps.emissive = materialProps.emissive;
        if(materialProps.emissiveIntensity) lambertMaterialProps.emissiveIntensity = materialProps.emissiveIntensity;
        
        planetMat=new THREE.MeshLambertMaterial(lambertMaterialProps)
    }
    
    const planet=new THREE.Mesh(planetGeom,planetMat);
    const x=(cfg.orbitCenter?.x||0)+Math.cos(initialAngle)*cfg.distance;
    const z=(cfg.orbitCenter?.z||0)+Math.sin(initialAngle)*cfg.distance;
    planet.position.set(x,0,z);
    planet.rotation.y=Math.random()*Math.PI*2;
    const orbitRadius=cfg.radius+CONFIG.enemy.orbitMod;
    
    return{
        mesh:planet,
        radius:orbitRadius,
        center:planet.position.clone(),
        config:cfg,
        health:cfg.health,
        maxHealth:cfg.health,
        destroyed:!1,
        orbitCenter:{x:cfg.orbitCenter?.x||0,z:cfg.orbitCenter?.z||0},
        orbitDistance:cfg.distance,
        orbitSpeed:cfg.orbitSpeed||0.001,
        currentAngle:initialAngle
    }
}

      }
      class PerlinNoise {
        constructor(seed = Math.random()) {
          this.seed = seed;
          this.p = [];
          for (let i = 0; i < 512; i++) {
            this.p[i] = Math.floor(Math.random() * 256)
          }
          for (let i = 0; i < 256; i++) {
            this.p[256 + i] = this.p[i]
          }
        }
        fade(t) {
          return t * t * t * (t * (t * 6 - 15) + 10)
        }
        lerp(t, a, b) {
          return a + t * (b - a)
        }
        grad(hash, x, y, z) {
          const h = hash & 15;
          const u = h < 8 ? x : y;
          const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
          return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
        }
        noise(x, y, z) {
          const X = Math.floor(x) & 255;
          const Y = Math.floor(y) & 255;
          const Z = Math.floor(z) & 255;
          x -= Math.floor(x);
          y -= Math.floor(y);
          z -= Math.floor(z);
          const u = this.fade(x);
          const v = this.fade(y);
          const w = this.fade(z);
          const A = this.p[X] + Y;
          const AA = this.p[A] + Z;
          const AB = this.p[A + 1] + Z;
          const B = this.p[X + 1] + Y;
          const BA = this.p[B] + Z;
          const BB = this.p[B + 1] + Z;
          return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)), this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))), this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)), this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))))
        }
        turbulence2d(x, y, octaves, persistence) {
          let value = 0;
          let amplitude = 1;
          let frequency = 1;
          let maxValue = 0;
          for (let i = 0; i < octaves; i++) {
            value += Math.abs(this.noise(x * frequency, y * frequency, 0)) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2
          }
          return value / maxValue
        }
      }
      class Gradient {
        constructor() {
          this.points = []
        }
        add(point) {
          this.points.push(point);
          this.points.sort((a, b) => a[0] - b[0])
        }
        get(t) {
          if (this.points.length === 0) return [0, 0, 0];
          if (t <= this.points[0][0]) return [this.points[0][1], this.points[0][2], this.points[0][3]];
          if (t >= this.points[this.points.length - 1][0]) {
            const last = this.points[this.points.length - 1];
            return [last[1], last[2], last[3]]
          }
          for (let i = 0; i < this.points.length - 1; i++) {
            const p1 = this.points[i];
            const p2 = this.points[i + 1];
            if (t >= p1[0] && t <= p2[0]) {
              const factor = (t - p1[0]) / (p2[0] - p1[0]);
              return [Math.floor(p1[1] + (p2[1] - p1[1]) * factor), Math.floor(p1[2] + (p2[2] - p1[2]) * factor), Math.floor(p1[3] + (p2[3] - p1[3]) * factor)]
            }
          }
          return [0, 0, 0]
        }
      }
      class DeepSpaceGenerator {
        constructor() {
          this.createTexture()
        }
        createTexture() {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1024;
          const ctx = canvas.getContext('2d');
          const imageData = ctx.getImageData(0, 0, 1024, 1024);
          const noise1 = new PerlinNoise(Math.random());
          const noise2 = new PerlinNoise(Math.random());
          const noise3 = new PerlinNoise(Math.random());
          const gradient = new Gradient();
          const colorThemes = [
            [
              [5, 5, 15],
              [15, 25, 45],
              [25, 15, 60],
              [10, 5, 25]
            ],
            [
              [15, 5, 5],
              [45, 15, 25],
              [60, 25, 15],
              [25, 10, 5]
            ],
            [
              [5, 15, 10],
              [15, 45, 35],
              [25, 60, 45],
              [10, 25, 15]
            ],
            [
              [15, 5, 15],
              [35, 15, 45],
              [50, 25, 60],
              [20, 10, 25]
            ]
          ];
          const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
          gradient.add([0, theme[0][0], theme[0][1], theme[0][2]]);
          gradient.add([0.3, theme[1][0], theme[1][1], theme[1][2]]);
          gradient.add([0.6, theme[2][0], theme[2][1], theme[2][2]]);
          gradient.add([1, theme[3][0], theme[3][1], theme[3][2]]);
          const data = imageData.data;
          for (let y = 0; y < 1024; y++) {
            for (let x = 0; x < 1024; x++) {
              const nx = x / 1024 * 8;
              const ny = y / 1024 * 8;
              let noiseValue = noise1.turbulence2d(nx, ny, 8, 0.6);
              noiseValue += noise2.turbulence2d(nx * 2, ny * 2, 4, 0.3) * 0.5;
              noiseValue += noise3.noise(nx * 4, ny * 4, 0) * 0.3;
              noiseValue = Math.pow(Math.max(0, Math.min(1, noiseValue)), 2);
              const color = gradient.get(noiseValue);
              const index = (y * 1024 + x) * 4;
              data[index] = color[0];
              data[index + 1] = color[1];
              data[index + 2] = color[2];
              data[index + 3] = 255
            }
          }
          ctx.putImageData(imageData, 0, 0);
          const texture = new THREE.CanvasTexture(canvas);
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(1, 1);
          texture.needsUpdate = !0;
          const geometry = new THREE.PlaneGeometry(3000, 3000);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: !1,
              depthWrite: false,  // ADD THIS LINE
        depthTest: true,     // ADD THIS LINE
            opacity: 1
          });
          this.mesh = new THREE.Mesh(geometry, material);
          this.mesh.position.z = -800;
          this.mesh.renderOrder = -1000; 
          this.texture = texture
        }
        update(playerX, playerZ) {
          this.mesh.position.x = playerX * 0.2;
          this.mesh.position.y = playerZ * 0.2;
          this.texture.offset.x += 0.000005;
          this.texture.offset.y += 0.000005;
          this.texture.offset.x += playerX * 0.0000009;
          this.texture.offset.y += playerZ * 0.0000009
        }
      }
      class NebulaGenerator {
        constructor() {
          this.group = new THREE.Group();
          this.createNebulas()
        }
        createNebulas() {
          const nebulaColors = [
  [[0,0,0],[30,60,120],[60,150,255],[120,200,255]],     // Brighter blue
  [[0,0,0],[120,30,60],[255,80,150],[255,150,200]],     // Brighter pink
  [[0,0,0],[30,80,60],[100,255,150],[150,255,200]],     // Brighter green
  [[0,0,0],[80,30,120],[180,100,255],[220,150,255]],    // Brighter purple
  [[0,0,0],[120,60,30],[255,150,100],[255,200,150]]     // Brighter orange
];

          for (let layer = 0; layer < 1; layer++) {
            const nebulaTexture = this.createNebulaTexture(layer, nebulaColors[layer]);
            const size = 800 + layer * 200;
            const geometry = new THREE.PlaneGeometry(size, size);
            const material = new THREE.MeshBasicMaterial({
              map: nebulaTexture,
              transparent: !0,
              opacity: 0.33 - layer * 0.03,
              blending: THREE.AdditiveBlending,    depthWrite: false,  // ADD THIS LINE
            depthTest: true     // ADD THIS LINE
            });
            const nebula = new THREE.Mesh(geometry, material);
  //          nebula.position.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, -300 - layer * 150);
            // Change Z position:
nebula.position.set(
  (Math.random() - 0.5) * 1000,
  (Math.random() - 0.5) * 1000,
  -100 - layer * 50    // Closer to camera
);
            nebula.rotation.z = Math.random() * Math.PI * 2;
             nebula.renderOrder = -900 + layer; 
            this.group.add(nebula)
          }
        }
        createNebulaTexture(layer, colorScheme) {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 512;
          const ctx = canvas.getContext('2d');
          const imageData = ctx.getImageData(0, 0, 512, 512);
          const noise = new PerlinNoise(Math.random());
          const gradient = new Gradient();
          gradient.add([0, colorScheme[0][0], colorScheme[0][1], colorScheme[0][2]]);
          gradient.add([0.2, colorScheme[1][0], colorScheme[1][1], colorScheme[1][2]]);
          gradient.add([0.6, colorScheme[2][0], colorScheme[2][1], colorScheme[2][2]]);
          gradient.add([1, colorScheme[3][0], colorScheme[3][1], colorScheme[3][2]]);
          const data = imageData.data;
          for (let y = 0; y < 512; y++) {
            for (let x = 0; x < 512; x++) {
              const nx = (x - 256) / 512 * 8;
              const ny = (y - 256) / 512 * 8;
              const distance = Math.sqrt(nx * nx + ny * ny);
              const angle = Math.atan2(ny, nx);
              const spiral = Math.sin(angle * 3 + distance * 2) * 0.3;
              const radialFalloff = Math.max(0, (1 - distance / 4) + spiral * 0.2);
              let noiseValue = noise.turbulence2d(x / 80, y / 80, 6, 0.6);
              noiseValue += noise.turbulence2d(x / 40, y / 40, 4, 0.4) * 0.7;
              noiseValue += noise.noise(x / 20, y / 20, layer * 5) * 0.5;
              const flow = Math.sin(x / 30 + y / 20) * Math.cos(y / 25) * 0.3;
              noiseValue += flow;
              let intensity = noiseValue * radialFalloff;
              intensity = Math.pow(Math.max(0, Math.min(1, intensity)), 1.8);
              const color = gradient.get(intensity);
              const index = (y * 512 + x) * 4;
              data[index] = color[0];
              data[index + 1] = color[1];
              data[index + 2] = color[2];
              data[index + 3] = Math.floor(intensity * 200 * radialFalloff)
            }
          }
          ctx.putImageData(imageData, 0, 0);
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = !0;
          return texture
        }
        update(playerX, playerZ) {
          this.group.children.forEach((nebula, index) => {
            const parallax = 0.005 + index * 0.02;
            const targetX = playerX * parallax + (index - 2) * 200;
            const targetY = playerZ * parallax + (index - 2) * 150;
            nebula.position.x += (targetX - nebula.position.x) * 0.01;
            nebula.position.y += (targetY - nebula.position.y) * 0.01;
            nebula.rotation.z += 0.0001 * (index + 1)
          })
        }
      }
      class BackgroundManager {
        constructor(scene) {
          this.scene = scene;
          this.createStarField();
          this.createDeepSpace();
          this.createNebulas()
        }
        createStarField() {
          const starGeom = new THREE.BufferGeometry();
          const starCount = CONFIG.space.starCount;
          const positions = new Float32Array(starCount * 3);
          const colors = new Float32Array(starCount * 3);
          const sizes = new Float32Array(starCount);
          for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * CONFIG.space.size;
            positions[i3 + 1] = (Math.random() - 0.5) * CONFIG.space.size;
            positions[i3 + 2] = (Math.random() - 0.5) * CONFIG.space.size;
            const starType = Math.random();
            if (starType < 0.7) {
              colors[i3] = colors[i3 + 1] = colors[i3 + 2] = 1.0
            } else if (starType < 0.85) {
              colors[i3] = 0.7;
              colors[i3 + 1] = 0.8;
              colors[i3 + 2] = 1.0
            } else if (starType < 0.95) {
              colors[i3] = 1.0;
              colors[i3 + 1] = 1.0;
              colors[i3 + 2] = 0.7
            } else {
              colors[i3] = 1.0;
              colors[i3 + 1] = 0.7;
              colors[i3 + 2] = 0.7
            }
            sizes[i] = Math.random() * 2 + 0.5
          }
          starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          starGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          starGeom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
          const starMat = new THREE.PointsMaterial({
            size: 1.0,
            vertexColors: !0,
            transparent: !0,
            opacity: 0.8,
            sizeAttenuation: !0
          });
          this.stars = new THREE.Points(starGeom, starMat);
          this.scene.add(this.stars)
        }
        createDeepSpace() {
          this.deepSpaceGenerator = new DeepSpaceGenerator();
          this.scene.add(this.deepSpaceGenerator.mesh)
        }
        createNebulas() {
          this.nebulaGenerator = new NebulaGenerator();
          this.scene.add(this.nebulaGenerator.group)
        }
        update(playerX, playerZ) {
          this.stars.rotation.y += CONFIG.space.rotSpeed;
          if (this.deepSpaceGenerator) {
            this.deepSpaceGenerator.update(playerX, playerZ)
          }
          if (this.nebulaGenerator) {
            this.nebulaGenerator.update(playerX, playerZ)
          }
        }
      }
      class MinimapManager {
        constructor() {
          this.canvas = document.getElementById('minimapCanvas');
          this.ctx = this.canvas.getContext('2d');
          this.expanded = !1;
            this.waypoint = null;
          this.setupEvents()
        }
setupEvents(){
    document.getElementById('minimapToggle').addEventListener('click',()=>{
        this.toggleExpanded();
    });
    
    // Desktop click events - only when expanded, with delay to prevent accidental clicks
    this.canvas.addEventListener('click',(e)=>{
        if(this.expanded){
            e.preventDefault();
            e.stopPropagation();
            // Agregar pequeño delay para evitar clicks accidentales durante disparos
            setTimeout(() => {
                this.setWaypoint(e);
            }, 50);
        }
    });
    
    // Mobile touch events - only when expanded
    this.canvas.addEventListener('touchstart',(e)=>{
        if(this.expanded){
            e.preventDefault();
            e.stopPropagation();
        }
    });
    
    this.canvas.addEventListener('touchend',(e)=>{
        if(this.expanded){
            e.preventDefault();
            e.stopPropagation();
            const touch=e.changedTouches[0];
            if(touch){
                const touchEvent={clientX:touch.clientX,clientY:touch.clientY};
                // Agregar pequeño delay para evitar touches accidentales durante disparos
                setTimeout(() => {
                    this.setWaypoint(touchEvent);
                }, 50);
            }
        }
    });
    
    this.canvas.addEventListener('touchmove',(e)=>{
        if(this.expanded){
            e.preventDefault();
        }
    });
}

        updateWaypoint() {
    if (this.waypoint && this.waypoint.type === 'planet' && this.waypoint.planet) {
        // Update waypoint position to follow the planet
        this.waypoint.x = this.waypoint.planet.center.x;
        this.waypoint.z = this.waypoint.planet.center.z;
    }
}
setWaypoint(event){
    const rect=this.canvas.getBoundingClientRect();
    
    // Get actual canvas size (not just CSS size)
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    // Calculate click position relative to canvas, accounting for any scaling
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;
    
    const size = this.expanded ? 300 : 120;
    const scale = this.expanded ? 0.8 : 0.3;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Convert canvas coordinates to world coordinates
    const worldX = (clickX - centerX) / scale + game.playerShip.position.x;
    const worldZ = (clickY - centerY) / scale + game.playerShip.position.z;
    
    let targetPlanet = null;
    let minDistance = Infinity;
    
    // Check for planet clicks with better precision
    game.planets.forEach(planet => {
        if(planet.destroyed) return;
        
        const distance = Math.sqrt(Math.pow(worldX - planet.center.x, 2) + Math.pow(worldZ - planet.center.z, 2));
        const clickRadius = Math.max(planet.config.radius + 10, 20); // Increased minimum click radius for mobile
        
        if(distance < clickRadius && distance < minDistance){
            minDistance = distance;
            targetPlanet = planet;
        }
    });
    
    if(targetPlanet){
        this.waypoint = {
            x: targetPlanet.center.x,
            z: targetPlanet.center.z,
            planet: targetPlanet,
            type: 'planet'
        };
    } else {
        this.waypoint = {
            x: worldX,
            z: worldZ,
            type: 'static'
        };
    }
    
    this.showWaypointSetFeedback(event.clientX, event.clientY);
}
        toggleExpanded() {
          this.expanded = !this.expanded;
          const minimap = document.getElementById('minimap');
          const toggle = document.getElementById('minimapToggle');
          if (this.expanded) {
            minimap.classList.add('expanded');
            toggle.textContent = '⊟';
            this.canvas.width = this.canvas.height = 300
          } else {
            minimap.classList.remove('expanded');
            toggle.textContent = '⊞';
            this.canvas.width = this.canvas.height = 120
          }
        }
update(playerPos,planets,enemies){
    const ctx=this.ctx;
    const size=this.expanded?300:120;
    const scale=this.expanded?0.8:0.3;
    const centerX=size/2;
    const centerY=size/2;
    
    ctx.clearRect(0,0,size,size);
    ctx.fillStyle='rgba(0, 0, 20, 0.9)';
    ctx.fillRect(0,0,size,size);
    ctx.strokeStyle='rgba(79, 172, 254, 0.3)';
    ctx.lineWidth=1;
    ctx.strokeRect(1,1,size-2,size-2);
    
    // Draw orbits when expanded - show all planet orbits
    if(this.expanded){
        planets.forEach(planet=>{
            if(planet.destroyed) return;
            
            // Use the correct orbit properties from the planet object
            const orbitCenterX = (planet.orbitCenter.x - playerPos.x) * scale + centerX;
            const orbitCenterY = (planet.orbitCenter.z - playerPos.z) * scale + centerY;
            const orbitRadius = planet.orbitDistance * scale;
            
            // Show orbit if it has a meaningful radius (skip the sun at center)
            if(orbitRadius > 1) {
                ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.arc(orbitCenterX, orbitCenterY, orbitRadius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        });
    }
    
    // Draw planets - show all planets when expanded, with broader view when collapsed
    planets.forEach(planet=>{
        if(planet.destroyed) return;
        
        const relX = (planet.center.x - playerPos.x) * scale + centerX;
        const relY = (planet.center.z - playerPos.z) * scale + centerY;
        
        // Expanded minimap shows all planets, collapsed shows nearby ones
        const boundary = this.expanded ? size * 2 : 10; // Much larger boundary for expanded view
        
        if(relX >= -boundary && relX <= size + boundary && relY >= -boundary && relY <= size + boundary){
            const radius = Math.max(2, planet.config.radius * scale * 0.3);
            ctx.fillStyle = `#${planet.config.color.toString(16).padStart(6, '0')}`;
            ctx.beginPath();
            ctx.arc(relX, relY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            if(this.expanded && planet.config.dialogue){
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(planet.config.dialogue.name, relX, relY - radius - 5);
            }
        }
    });
    
    // Draw enemies
    enemies.forEach(enemy=>{
        if(enemy.health<=0)return;
        const relX=(enemy.mesh.position.x-playerPos.x)*scale+centerX;
        const relY=(enemy.mesh.position.z-playerPos.z)*scale+centerY;
        
        if(relX>=-5&&relX<=size+5&&relY>=-5&&relY<=size+5){
            ctx.fillStyle=enemy.attacking?'#ff4757':'#ff9f43';
            ctx.beginPath();
            ctx.arc(relX,relY,2,0,Math.PI*2);
            ctx.fill();
        }
    });
    
    // Draw waypoint
    if(this.waypoint){
        const waypointX=(this.waypoint.x-playerPos.x)*scale+centerX;
        const waypointY=(this.waypoint.z-playerPos.z)*scale+centerY;
        
        if(waypointX>=-10&&waypointX<=size+10&&waypointY>=-10&&waypointY<=size+10){
            ctx.fillStyle='#feca57';
            ctx.strokeStyle='#ffffff';
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.arc(waypointX,waypointY,4,0,Math.PI*2);
            ctx.fill();
            ctx.stroke();
            
            ctx.strokeStyle='#000000';
            ctx.lineWidth=1;
            ctx.beginPath();
            ctx.moveTo(waypointX-2,waypointY-2);
            ctx.lineTo(waypointX+2,waypointY+2);
            ctx.moveTo(waypointX+2,waypointY-2);
            ctx.lineTo(waypointX-2,waypointY+2);
            ctx.stroke();
        }
        
        // Draw waypoint compass arrow
        const dx=this.waypoint.x-playerPos.x;
        const dz=this.waypoint.z-playerPos.z;
        const distance=Math.sqrt(dx*dx+dz*dz);
        
        if(distance>5){
            const angle=Math.atan2(dx,dz);
            const compassRadius=size*0.35;
            const arrowX=centerX+Math.sin(angle)*compassRadius;
            const arrowY=centerY+Math.cos(angle)*compassRadius;
            
            ctx.strokeStyle='#feca57';
            ctx.fillStyle='#feca57';
            ctx.lineWidth=2;
            const arrowSize=6;
            ctx.beginPath();
            ctx.moveTo(arrowX,arrowY);
            ctx.lineTo(arrowX-arrowSize*Math.sin(angle+0.5),arrowY-arrowSize*Math.cos(angle+0.5));
            ctx.lineTo(arrowX-arrowSize*Math.sin(angle-0.5),arrowY-arrowSize*Math.cos(angle-0.5));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    
    // Draw player
    ctx.fillStyle='#00f2fe';
    ctx.strokeStyle='#ffffff';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(centerX,centerY,4,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
    
    // Draw player direction indicator
    const angle=Math.atan2(0,1);
    const arrowLength=8;
    const arrowX=centerX+Math.cos(angle)*arrowLength;
    const arrowY=centerY+Math.sin(angle)*arrowLength;
    ctx.strokeStyle='#00f2fe';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.lineTo(arrowX,arrowY);
    ctx.stroke();
}
clearWaypoint() {
    this.waypoint = null;
}
      }

class AudioManager {
    constructor() {
        this.initialized = false;
        this.audioContext = null;
        this.audioBuffer = null;
        this.masterGain = null;
        this.lastDamageTime=0;
        // Sprite definitions (start time in seconds, duration in seconds)
        this.spriteMap = {
            blaster: [0, 0.132],
            enemyShot: [0.392, 0.628],
            scatter: [0.630, 1.372],
            shotgun: [0.242, 0.553],
            laser: [4.252, 4.425],
            explosion: [1.996, 2.527],
            damage: [3.092, 3.542],
            collision: [6.144, 6.530],
            enemyHit: [2.538, 3.034],
            weaponSwitch: [5.278, 5.573],
            powerUp: [5.278, 5.573],
            mine: [5.278, 5.573],
            landing: [5.607, 7.007],
            takeoff: [7.112, 8.414]
        };
        
        // Sound management
        this.activeSounds = new Map();
        this.maxConcurrentSounds = {
            blaster: 3,
            enemyShot: 4,
            explosion: 2,
            collision: 1
        };
        
        // Timing constraints
        this.lastCollisionTime = 0;
        this.lastBlasterTime = 0;
        this.lastEnemyShotTime = 0;
        
        // Laser state
        this.laserActive = false;
        this.laserSource = null;
        this.laserGain = null;
        
        // Volume settings
        this.masterVolume = 0.7;
        this.sfxVolume = 0.7;
        
        this.setup();
    }
    
    async setup() {
        try {
            // Initialize Web Audio Context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            // Load audio file
            await this.loadAudioFile('sfx-sprite.mp3');
            
        } catch (error) {
            console.warn('Audio setup failed:', error);
        }
    }
    
    async loadAudioFile(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.warn('Failed to load audio file:', error);
            throw error;
        }
    }
    
    async start() {
        if (!this.initialized) {
            try {
                // Resume context if suspended (required for mobile)
                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }
                this.initialized = true;
            } catch (error) {
                console.warn('Audio start failed:', error);
            }
        }
    }
    
    createSpatialAudioSource(spriteName, sourcePos = null, listenerPos = null, baseVolume = 1.0) {
        if (!this.audioBuffer || !this.initialized) return null;
        
        const sprite = this.spriteMap[spriteName];
        if (!sprite) {
            console.warn(`Sprite '${spriteName}' not found`);
            return null;
        }
        
        // Create audio nodes
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const pannerNode = this.audioContext.createPanner();
        
        // Configure source
        source.buffer = this.audioBuffer;
        
        // Configure panner for 3D spatial audio
        pannerNode.panningModel = 'HRTF';
        pannerNode.distanceModel = 'inverse';
        pannerNode.refDistance = 10;
        pannerNode.maxDistance = 200;
        pannerNode.rolloffFactor = 2;
        pannerNode.coneInnerAngle = 360;
        pannerNode.coneOuterAngle = 0;
        pannerNode.coneOuterGain = 0;
        
        // Calculate spatial positioning and volume
        let finalVolume = baseVolume * this.sfxVolume;
        
        if (sourcePos && listenerPos) {
            // Set 3D position
            pannerNode.positionX.value = sourcePos.x;
            pannerNode.positionY.value = sourcePos.y;
            pannerNode.positionZ.value = sourcePos.z;
            
            // Calculate distance-based volume
            const distance = sourcePos.distanceTo(listenerPos);
            const maxDistance = 100;
            if (distance >= maxDistance) {
                finalVolume = 0;
            } else {
                const spatialVolume = Math.max(0, 1 - (distance / maxDistance));
                finalVolume *= spatialVolume;
            }
            
            // Set listener position (assuming listener is always at origin in local space)
            if (this.audioContext.listener.positionX) {
                this.audioContext.listener.positionX.value = listenerPos.x;
                this.audioContext.listener.positionY.value = listenerPos.y;
                this.audioContext.listener.positionZ.value = listenerPos.z;
            } else {
                // Fallback for older browsers
                this.audioContext.listener.setPosition(listenerPos.x, listenerPos.y, listenerPos.z);
            }
        }
        
        // Set volume
        gainNode.gain.value = finalVolume;
        
        // Connect nodes
        if (sourcePos && listenerPos) {
            source.connect(pannerNode);
            pannerNode.connect(gainNode);
        } else {
            source.connect(gainNode);
        }
        gainNode.connect(this.masterGain);
        
        return { source, gainNode, pannerNode };
    }
    
    playSprite(spriteName, sourcePos = null, listenerPos = null, baseVolume = 1.0, loop = false) {
        if (!this.initialized || !this.audioBuffer) return null;
        
        const sprite = this.spriteMap[spriteName];
        if (!sprite) return null;
        
        // Check concurrent sound limits
        if (!this.canPlaySound(spriteName)) return null;
        
        const audioNodes = this.createSpatialAudioSource(spriteName, sourcePos, listenerPos, baseVolume);
        if (!audioNodes) return null;
        
        const { source, gainNode } = audioNodes;
        const [startTime, endTime] = sprite;
const duration = endTime - startTime;
        
        // Configure playback
        source.loop = loop;
        if (loop) {
            source.loopStart = startTime;
            source.loopEnd = startTime + duration;
        }
        
        // Start playback
        source.start(0, startTime, loop ? undefined : duration);
        
        // Track the sound
        const soundId = this.generateSoundId();
        this.trackSound(spriteName, soundId);
        
        // Clean up when sound ends
        if (!loop) {
            source.onended = () => {
                this.removeSoundFromTracking(spriteName, soundId);
            };
        }
        
        return { source, gainNode, soundId };
    }
    
    generateSoundId() {
        return Date.now() + Math.random();
    }
    
    canPlaySound(soundType) {
        const maxConcurrent = this.maxConcurrentSounds[soundType] || 1;
        const activeSoundsOfType = this.activeSounds.get(soundType) || [];
        return activeSoundsOfType.length < maxConcurrent;
    }
    
    trackSound(soundType, soundId) {
        if (!this.activeSounds.has(soundType)) {
            this.activeSounds.set(soundType, []);
        }
        this.activeSounds.get(soundType).push(soundId);
    }
    
    removeSoundFromTracking(soundType, soundId) {
        const sounds = this.activeSounds.get(soundType);
        if (sounds) {
            const index = sounds.indexOf(soundId);
            if (index > -1) {
                sounds.splice(index, 1);
            }
        }
    }
    
    // Public API methods (maintaining compatibility with existing code)
    playBlaster(sourcePos = null, listenerPos = null) {
        if (!this.initialized) return;
        
        const currentTime = Date.now();
        if (currentTime - this.lastBlasterTime < 50) return;
        this.lastBlasterTime = currentTime;
        
        this.playSprite('blaster', sourcePos, listenerPos, 0.7);
    }
    
    playEnemyShot(sourcePos = null, listenerPos = null) {
        if (!this.initialized) return;
        
        const currentTime = Date.now();
        if (currentTime - this.lastEnemyShotTime < 30) return;
        this.lastEnemyShotTime = currentTime;
        
        this.playSprite('enemyShot', sourcePos, listenerPos, 0.6);
    }
    
    playExplosion(size = 1, sourcePos = null, listenerPos = null) {
        if (!this.initialized) return;
        
        const volume = Math.min(size * 0.7, 1.0);
        this.playSprite('explosion', sourcePos, listenerPos, volume);
    }
    
    playCollision(sourcePos=null,listenerPos=null){
    if(!this.initialized)return;
    const currentTime=Date.now();
    if(currentTime-this.lastCollisionTime<300)return;
    this.lastCollisionTime=currentTime;
    this.playSprite('collision',sourcePos,listenerPos,0.8)
}
playDamage(sourcePos=null,listenerPos=null){
    if(!this.initialized)return;
    const currentTime=Date.now();
    if(currentTime-this.lastDamageTime<200)return;  // Changed from lastCollisionTime
    this.lastDamageTime=currentTime;                // Changed from lastCollisionTime
    this.playSprite('damage',sourcePos,listenerPos,0.7)
}
    
    playLaser() {
        if (!this.initialized || this.laserActive) return;
        
        try {
            const audioNodes = this.playSprite('laser', null, null, 0.5, true);
            if (audioNodes) {
                this.laserActive = true;
                this.laserSource = audioNodes.source;
                this.laserGain = audioNodes.gainNode;
            }
        } catch (e) {
            this.laserActive = false;
        }
    }
    
    stopLaser() {
        if (!this.initialized || !this.laserActive || !this.laserSource) return;
        
        try {
            this.laserSource.stop();
            this.laserActive = false;
            this.laserSource = null;
            this.laserGain = null;
        } catch (e) {
            this.laserActive = false;
        }
    }
    
    playScatter() {
        if (this.initialized) {
            this.playSprite('scatter', null, null, 0.6);
        }
    }
    
    playShotgun() {
        if (this.initialized) {
            this.playSprite('shotgun', null, null, 0.7);
        }
    }
    
    playEnemyHit() {
        if (this.initialized) {
            this.playSprite('enemyHit', null, null, 0.5);
        }
    }
    
    playWeaponSwitch() {
        if (this.initialized) {
            this.playSprite('weaponSwitch', null, null, 0.6);
        }
    }
    
    playPowerUp() {
        if (this.initialized) {
            this.playSprite('powerUp', null, null, 0.6);
        }
    }
    
    playMine() {
        if (this.initialized) {
            this.playSprite('mine', null, null, 0.5);
        }
    }
    
    playLanding() {
        if (this.initialized) {
            this.playSprite('landing', null, null, 0.7);
        }
    }
    
    playTakeoff() {
        if (this.initialized) {
            this.playSprite('takeoff', null, null, 0.7);
        }
    }
    
    // Volume controls
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    mute() {
        if (this.masterGain) {
            this.masterGain.gain.value = 0;
        }
    }
    
    unmute() {
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }
    
    // Legacy compatibility methods (empty implementations to maintain interface)
    startBackgroundMusic() {}
    stopBackgroundMusic() {}
    pauseBackgroundMusic() {}
    resumeBackgroundMusic() {}
    startEngine() {}
    stopEngine() {}
    setMusicVolume(volume) {}
    setEngineVolume(volume) {}
    
    dispose() {
        try {
            this.stopLaser();
            
            // Stop all active sounds
            this.activeSounds.clear();
            
            if (this.audioContext && this.audioContext.state !== 'closed') {
                this.audioContext.close();
            }
            
            this.audioContext = null;
            this.audioBuffer = null;
            this.masterGain = null;
            this.initialized = false;
        } catch (error) {
            console.warn('Audio disposal error:', error);
        }
    }
}
      class SpaceShooter {
        constructor() {
          this.initializeRenderer();
          this.initializeGameState();
          this.initializeScene();
          this.setupEventListeners();
          this.animate()
        }

        
// 2. Add helper method to find planet by name (add to SpaceShooter class)
findPlanetByName(planetName){
    return this.planets.find(planet => 
        planet.config.dialogue && 
        planet.config.dialogue.name === planetName
    );
}

// 3. Add method to show navigation notification (add to SpaceShooter class)
showNavigationNotification(targetName){
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: #00ff88;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        font-weight: bold;
        text-shadow: 0 0 15px rgba(0, 255, 136, 0.9);
        background: rgba(0, 0, 0, 0.8);
        padding: 15px 25px;
        border-radius: 10px;
        border: 2px solid rgba(0, 255, 136, 0.6);
        z-index: 1000;
        animation: waypointFadeTop 3s ease-out forwards;
        pointer-events: none;
        backdrop-filter: blur(5px);
    `;
    notification.textContent = `Ve a: ${targetName}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

        updatePlanets() {
          this.planets.forEach(planet => {
            if (planet.destroyed) return;
            planet.currentAngle += planet.orbitSpeed;
            const newX = planet.orbitCenter.x + Math.cos(planet.currentAngle) * planet.orbitDistance;
            const newZ = planet.orbitCenter.z + Math.sin(planet.currentAngle) * planet.orbitDistance;
            planet.mesh.position.set(newX, 0, newZ);
            planet.center.set(newX, 0, newZ);
            planet.mesh.rotation.y += 0.01
          })
        }
        initializeRenderer() {
          this.scene = new THREE.Scene();
          const aspectRatio = window.innerWidth / window.innerHeight;
          const distance = 44;
          this.camera = new THREE.OrthographicCamera(-distance * aspectRatio, distance * aspectRatio, distance, -distance, 0.1, 2000);
          this.renderer = new THREE.WebGLRenderer({
            antialias: !0
          });
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.renderer.setClearColor(0x000011);
          this.renderer.sortObjects = !0;
          document.getElementById('gameContainer').appendChild(this.renderer.domElement)
        }
        spawnAlly(shipType = "f"){
    const ally = EnemyFactory.create(shipType, null, 0, 1);
    if(!ally) return;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 10;
    ally.mesh.position.set(
        this.playerShip.position.x + Math.cos(angle) * distance,
        5,
        this.playerShip.position.z + Math.sin(angle) * distance
    );
    
    // Set ally properties
    ally.isAlly = true;
    ally.followSide = Math.random() < 0.5 ? -1 : 1;
    ally.healCooldown = 0;
    ally.targetPosition = new THREE.Vector3();
    ally.health = ally.maxHealth; // Ensure health is properly set
    
    this.allies.push(ally);
    this.scene.add(ally.mesh);
}
calculateFormationPosition(allyIndex){
    const positions = [
        {x: 0, z: 18},     // directly behind
        {x: -15, z: 28},   // left back
        {x: 15, z: 28},    // right back
        {x: -25, z: 40},   // far left
        {x: 25, z: 40},    // far right
        {x: 0, z: 45}      // rear guard
    ];
    const pos = positions[allyIndex % positions.length];
    
    // Transform relative to player's orientation
    const playerAngle = this.playerShip.rotation.y;
    const cos = Math.cos(playerAngle);
    const sin = Math.sin(playerAngle);
    
    return new THREE.Vector3(
        this.playerShip.position.x + (pos.x * cos - pos.z * sin),
        5,
        this.playerShip.position.z + (pos.x * sin + pos.z * cos)
    );
}
createWaypointIndicator() {
    this.removeWaypointIndicator();
    
    // Create a bigger arrow indicator
    const arrowGeometry = new THREE.ConeGeometry(1.2, 4, 8); // CHANGED: bigger size (was 0.5, 2)
    const arrowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6EFFEE, 
        transparent: true, 
        opacity: 0.8 
    });
    this.waypointIndicator = new THREE.Mesh(arrowGeometry, arrowMaterial);
    // REMOVED: this.waypointIndicator.rotation.x = -Math.PI / 2; // Let lookAt handle direction
    this.scene.add(this.waypointIndicator);
}

removeWaypointIndicator() {
    if (this.waypointIndicator) {
        this.scene.remove(this.waypointIndicator);
        this.waypointIndicator = null;
    }
}

updateWaypointIndicator() {
    const waypoint = this.minimapManager.waypoint;
    
    if (!waypoint) {
        this.removeWaypointIndicator();
        return;
    }
    
    // Check if we've reached the waypoint
    const distance = Math.sqrt(
        Math.pow(this.playerShip.position.x - waypoint.x, 2) + 
        Math.pow(this.playerShip.position.z - waypoint.z, 2)
    );
    
    const reachDistance = waypoint.type === 'planet' ? 
        (waypoint.planet ? waypoint.planet.config.radius + 25 : 20) : 20;
    
    if (distance < reachDistance) {
        if (this.waypointReachedCooldown <= 0) {
            this.showWaypointReachedNotification(waypoint);
            this.minimapManager.waypoint = null; // Clear waypoint
            this.removeWaypointIndicator();
            this.waypointReachedCooldown = 180; // 3 second cooldown
        }
        return;
    }
    
    // Create indicator if it doesn't exist
    if (!this.waypointIndicator) {
        this.createWaypointIndicator();
    }
    
    // Position the indicator
    const direction = new THREE.Vector3(
        waypoint.x - this.playerShip.position.x,
        0,
        waypoint.z - this.playerShip.position.z
    ).normalize();
    
    // Place indicator in front of player
    const indicatorDistance = 8;
    this.waypointIndicator.position.copy(this.playerShip.position);
    this.waypointIndicator.position.add(direction.multiplyScalar(indicatorDistance));
    this.waypointIndicator.position.y = 6;
    
    // Point toward waypoint
    // Point toward waypoint - UPDATED FOR PROPER DIRECTION
const waypointTarget = new THREE.Vector3(waypoint.x, this.waypointIndicator.position.y, waypoint.z);
this.waypointIndicator.lookAt(waypointTarget);
this.waypointIndicator.rotateX(Math.PI / 2); // ADDED: Adjust for cone orientation
    
    // Add subtle pulsing animation
    const pulse = 0.8 + 0.2 * Math.sin(Date.now() * 0.005);
    this.waypointIndicator.scale.setScalar(pulse);
    // Animate rings
this.waypointIndicator.children.forEach(child => {
    if (child.userData.ringIndex !== undefined) {
        child.rotation.z += 0.02 * (child.userData.ringIndex + 1);
        child.material.opacity = (0.4 - child.userData.ringIndex * 0.1) * pulse;
    }
});
}

showWaypointReachedNotification(waypoint) {
    // Create subtle notification - POSITIONED NEAR TOP
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: #feca57;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        font-weight: bold;
        text-shadow: 0 0 15px rgba(254, 202, 87, 0.9);
        background: rgba(0, 0, 0, 0.8);
        padding: 15px 25px;
        border-radius: 10px;
        border: 2px solid rgba(254, 202, 87, 0.6);
        z-index: 1000;
        animation: waypointFadeTop 2s ease-out forwards;
        pointer-events: none;
        backdrop-filter: blur(5px);
    `;
    
    const message = waypoint.type === 'planet' && waypoint.planet?.config.dialogue ?
        `Llegaste a: ${waypoint.planet.config.dialogue.name}` :
        'Haz llegado';
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add CSS animation if not exists - UPDATED ANIMATION NAME
    if (!document.querySelector('#waypointStyles')) {
        const style = document.createElement('style');
        style.id = 'waypointStyles';
        style.textContent = `
            @keyframes waypointFadeTop {
                0% { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(-20px) scale(0.8); 
                }
                20% { 
                    opacity: 1; 
                    transform: translateX(-50%) translateY(0px) scale(1); 
                }
                80% { 
                    opacity: 1; 
                    transform: translateX(-50%) translateY(0px) scale(1); 
                }
                100% { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(-10px) scale(1.05); 
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove notification after animation
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
    
    // Play subtle sound
    this.audioManager.playWeaponSwitch();
}
showWaypointSetFeedback(x, y) {
    // Create brief visual feedback for mobile users
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        border: 2px solid #feca57;
        border-radius: 50%;
        background: rgba(254, 202, 87, 0.3);
        transform: translate(-50%, -50%);
        z-index: 1001;
        pointer-events: none;
        animation: waypointSetPulse 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(feedback);
    
    // Add CSS if not exists
    if (!document.querySelector('#waypointSetStyles')) {
        const style = document.createElement('style');
        style.id = 'waypointSetStyles';
        style.textContent = `
            @keyframes waypointSetPulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        if (document.body.contains(feedback)) {
            document.body.removeChild(feedback);
        }
    }, 600);
}
        initializeGameState(){
    this.gameStarted=!1;
    this.trails=[];
    this.allies=[];
    this.waypointIndicator=null;
    this.waypointReachedCooldown=0;
    this.initialWaypointSet=!1; // Bandera para evitar setear waypoint inicial múltiples veces
    this.collisionEnabled=!0;
    this.trailStyle='nebula';
    this.player={health:CONFIG.player.health,score:0,currentWeapon:1,effects:{speed:{active:!1,endTime:0},damage:{active:!1,endTime:0}}};
    this.keys={};
    this.bullets=[];
    this.enemyBullets=[];
    this.artifacts=[];
    this.mines=[];
    this.enemies=[];
    this.planets=[];
    this.stars=[];
    this.collisionCooldown=0;
    this.shootPressed=!1;
    this.playerShip=null;
    this.playerVelocity=new THREE.Vector3();
    this.laserBeam=null;
    this.empBursts = [];
this.homingMissiles = [];
this.tractorBeam = null;
    this.landingGlow=null;
    this.originalPlayerMaterials=null;
    this.touchControls={moveX:0,moveY:0,firing:!1};
    this.audioManager=new AudioManager();
    this.minimapManager=new MinimapManager();
    this.explosions=[];
    this.landingState='none';
    this.landingTarget=null;
    this.landingStartPos=null;
    this.landingProgress=0;
    this.landingDuration=5000;
    this.landingStartTime=0;
    this.wasPlayerVisible=!0;
    this.visitedPlanets=new Set();
    this.typewriterSpeed=7
    this.selectedShipType = 'player'; ;
}
        initializeScene() {
          this.camera.position.set(0, 60, 60);
          this.camera.lookAt(0, 0, 0);
          const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
          this.scene.add(ambientLight);
          const directionalLight = new THREE.DirectionalLight(0xffeedd, 0.8);
          directionalLight.position.set(1, 10, 5);
          this.scene.add(directionalLight);
          this.backgroundManager = new BackgroundManager(this.scene);
          //this.createPlayer();
          this.createPlanets();
          this.createEnemies();
          //this.spawnAlly();
          //this.spawnAlly('i');
          //this.spawnAlly('s');
          //this.spawnAlly('d');
          //this.spawnAlly('p');
          //this.spawnAlly('h');
        }
        createPlayer(){
    this.playerShip = ShipFactory.create(this.selectedShipType);
    this.playerShip.userData.shipType = this.selectedShipType; // Add this line
    this.playerShip.position.set(-142, 5, -177);
    this.scene.add(this.playerShip);
}
        createPlanets() {
          const sunConfig = {
            radius: 10,
            color: 0xffdf22,
            distance: 0,
            enemyCount: 0,
            irregularity:0,
               emissive: 0xffffff,        // 🔧 Orange-yellow glow
    emissiveIntensity: 1,    // 🔧 Triggers MeshBasicMaterial
    
    enemyType: 'f',
            health: 1000,
            orbitCenter: {
              x: 0,
              z: 0
            },
            orbitSpeed: 0,
            startAngle: 0
          };
          const sun = PlanetFactory.create(0, sunConfig);
          
          this.planets.push(sun);
          this.scene.add(sun.mesh);
           // Add point light at sun position for realistic lighting
  const sunLight = new THREE.PointLight(0xffaa00, 1, 1000);
  sunLight.position.copy(sun.mesh.position);
  this.scene.add(sunLight);


          for (let i = 0; i < PlanetFactory.configs.length; i++) {
            const planet = PlanetFactory.create(i);
            this.planets.push(planet);
            this.scene.add(planet.mesh)
          }
        }
        createEnemies() {
          this.planets.forEach((planet, planetIndex) => {
            const config = planet.config;
            for (let i = 0; i < config.enemyCount; i++) {
              const enemy = EnemyFactory.create(config.enemyType, planet, i, config.enemyCount);
              if (enemy) {
                this.updateEnemyPosition(enemy);
                this.enemies.push(enemy);
                this.scene.add(enemy.mesh)
              }
            }
          })
        }
        updateEnemyPosition(enemy) {
          const x = enemy.planet.center.x + Math.cos(enemy.angle) * enemy.planet.radius;
          const z = enemy.planet.center.z + Math.sin(enemy.angle) * enemy.planet.radius;
          enemy.mesh.position.set(x, 5, z)
        }
        switchWeapon(weaponNumber){
    if(weaponNumber >= 1 && weaponNumber <= 8){
        this.player.currentWeapon = weaponNumber;
        const weaponNames = ['Blaster', 'Scatter', 'Shotgun', 'Mines', 'Laser', 'EMP', 'Homing', 'Tractor'];
        document.getElementById('currentWeapon').textContent = `${weaponNames[weaponNumber-1]}`;
        document.getElementById('weaponBtn').innerHTML = `W<br>${weaponNumber}`;
        
        if(this.laserBeam){
            this.scene.remove(this.laserBeam);
            this.laserBeam = null;
            this.audioManager.stopLaser();
        }
        if(this.tractorBeam){
            this.scene.remove(this.tractorBeam);
            this.tractorBeam = null;
            this.audioManager.stopLaser();
        }
        this.audioManager.playWeaponSwitch();
    }
}
        cycleWeapon() {
          const nextWeapon = this.player.currentWeapon % 8 + 1;
          this.switchWeapon(nextWeapon)
        }
        isPlanetLandable(planet){
    if(planet.destroyed) return false;
    
    // Don't allow landing on emissive planets (like the sun)
    if(planet.config.emissiveIntensity && planet.config.emissiveIntensity > 0.5) return false;
    
    const livingEnemies = this.enemies.filter(enemy => 
        enemy.planet === planet && enemy.health > 0
    ).length;
    
    return livingEnemies === 0;
}
        renderLandingPrompts() {
          const promptsContainer = document.getElementById('landingPrompts');
          if (!promptsContainer) {
            const container = document.createElement('div');
            container.id = 'landingPrompts';
            container.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 150;`;
            document.getElementById('gameContainer').appendChild(container)
          }
          promptsContainer.innerHTML = '';
          if (this.landingState !== 'none') return;
          this.planets.forEach(planet => {
            if (!this.isPlanetLandable(planet)) return;
            const distanceToPlayer = planet.center.distanceTo(this.playerShip.position);
            if (distanceToPlayer > 80) return;
            const vector = planet.center.clone();
            vector.project(this.camera);
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
            if (x >= -100 && x <= window.innerWidth + 100 && y >= -100 && y <= window.innerHeight + 100) {
              const planetName = document.createElement('div');
              planetName.style.cssText = `position: absolute;left: ${x}px;top: ${y - 70}px;transform: translateX(-50%);color: #4facfe;font-family: 'Courier New', monospace;font-size: 18px;font-weight: bold;text-shadow: 0 0 15px rgba(79, 172, 254, 0.9);text-align: center;`;
              planetName.textContent = this.getPlanetName(planet);
              promptsContainer.appendChild(planetName);
              const prompt = document.createElement('div');
              prompt.style.cssText = `position: absolute;left: ${x}px;top: ${y - 45}px;transform: translateX(-50%);color: #00ff88;font-family: 'Courier New', monospace;font-size: 14px;font-weight: bold;text-shadow: 0 0 10px rgba(0, 255, 136, 0.8);background: rgba(0, 0, 0, 0.8);padding: 6px 14px;border-radius: 15px;border: 2px solid rgba(0, 255, 136, 0.6);animation: landingPulse 2s infinite;backdrop-filter: blur(3px);pointer-events: auto;cursor: pointer;user-select: none;`;
              prompt.textContent = 'Press [E] to Land';
              prompt.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startLanding()
              });
              prompt.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startLanding()
              });
              promptsContainer.appendChild(prompt)
            }
          })
        }
        startLanding() {
          if (this.landingState !== 'none') return;
          let nearestPlanet = null;
          let nearestDistance = Infinity;
          this.planets.forEach(planet => {
            if (!this.isPlanetLandable(planet)) return;
            const distance = planet.center.distanceTo(this.playerShip.position);
            if (distance < 80 && distance < nearestDistance) {
              nearestDistance = distance;
              nearestPlanet = planet
            }
          });
          if (!nearestPlanet) return;
          this.landingState = 'landing';
          this.landingTarget = nearestPlanet;
          this.landingStartPos = this.playerShip.position.clone();
          this.landingStartTime = Date.now();
          this.landingProgress = 0;
          this.wasPlayerVisible = this.playerShip.visible;
          this.audioManager.playLanding()
        }
        updateLanding() {
          if (this.landingState === 'none') return;
          // Safety check - if landing target is null, reset landing state
          if (!this.landingTarget || !this.landingTarget.center) {
            console.warn('Landing target is null, resetting landing state');
            this.landingState = 'none';
            this.landingTarget = null;
            this.removeLandingGlow();
            this.restorePlayerDepth();  
            this.collisionEnabled = true;
            // Ensure player is visible and properly positioned
            if (this.playerShip) {
              this.playerShip.visible = true;
              this.playerShip.scale.setScalar(1.0);
            }
            return;
          }
          const currentTime = Date.now();
          const elapsedTime = currentTime - this.landingStartTime;
          this.landingProgress = Math.min(elapsedTime / this.landingDuration, 1);
          if (this.landingState === 'landing') {
            this.collisionEnabled = false;
            if (this.landingProgress >= 1) {
              this.removeLandingGlow();
              this.restorePlayerDepth();
              this.landingState = 'landed';
              this.showDialogue();
              return;
            }
            this.playerShip.visible = true;
            const planetCenter = this.landingTarget.center.clone();
            const targetPos = planetCenter.clone();
            const currentPos = this.landingStartPos.clone().lerp(targetPos, this.easeInOutCubic(this.landingProgress));
            this.playerShip.position.copy(currentPos);
            this.makePlayerAlwaysVisible();
            this.createLandingGlow();
            const scale = 1.0 - (this.landingProgress * 0.95);
            this.playerShip.scale.setScalar(Math.max(0.05, scale));
            const planetRadius = this.landingTarget.config.radius;
            const cameraDistance = planetRadius * 2.2;
            const cameraHeight = planetRadius * 1.2;
            const cameraAngle = this.landingProgress * 0.3;
            const cameraPos = new THREE.Vector3(planetCenter.x + Math.cos(cameraAngle) * cameraDistance, planetCenter.y + cameraHeight, planetCenter.z + Math.sin(cameraAngle) * cameraDistance);
            this.camera.position.copy(cameraPos);
            this.camera.lookAt(currentPos);
            this.playerVelocity.set(0, 0, 0);
          } else if (this.landingState === 'taking_off') {
            this.collisionEnabled = false;
            if (this.landingProgress >= 1) {
              this.landingState = 'none';
              this.removeLandingGlow();
              this.restorePlayerDepth();
              this.playerShip.visible = this.wasPlayerVisible;
              this.scheduleCollisionReactivation();
              return;
            }
            const planetCenter = this.landingTarget.center.clone();
            const safeDistance = this.landingTarget.config.radius + 20;
            let bestDirection = this.findSafeTakeoffDirection(planetCenter);
            const endPos = planetCenter.clone().add(bestDirection.multiplyScalar(safeDistance));
            endPos.y = 5;
            this.makePlayerAlwaysVisible();
            this.createLandingGlow();
            const startCameraPos = new THREE.Vector3(planetCenter.x, planetCenter.y + 20, planetCenter.z + 30);
            const endCameraPos = new THREE.Vector3(endPos.x, 60, endPos.z + 60);
            const progress = this.easeInOutCubic(this.landingProgress);
            const currentCameraPos = startCameraPos.clone().lerp(endCameraPos, progress);
            this.camera.position.copy(currentCameraPos);
            const currentPlayerPos = planetCenter.clone().lerp(endPos, progress);
            this.playerShip.position.copy(currentPlayerPos);
            const scale = 0.05 + (this.landingProgress * 0.95);
            this.playerShip.scale.setScalar(scale);
            if (this.landingProgress > 0.98) {
              this.playerShip.scale.setScalar(1.0);
            }
            this.audioManager.playTakeoff();
            this.playerShip.visible = this.wasPlayerVisible;
            this.camera.lookAt(this.playerShip.position);
          }
        }
        findSafeTakeoffDirection(planetCenter) {
          const testDirections = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1), new THREE.Vector3(0.707, 0, 0.707), new THREE.Vector3(-0.707, 0, 0.707), new THREE.Vector3(0.707, 0, -0.707), new THREE.Vector3(-0.707, 0, -0.707)];
          let bestDirection = testDirections[0];
          let maxMinDistance = 0;
          for (let direction of testDirections) {
            const testPoint = planetCenter.clone().add(direction.clone().multiplyScalar(this.landingTarget.config.radius + 25));
            let minDistance = Infinity;
            for (let planet of this.planets) {
              if (planet === this.landingTarget || planet.destroyed) continue;
              const distance = testPoint.distanceTo(planet.center) - planet.config.radius;
              minDistance = Math.min(minDistance, distance)
            }
            if (minDistance > maxMinDistance) {
              maxMinDistance = minDistance;
              bestDirection = direction
            }
          }
          return bestDirection.normalize()
        }
        scheduleCollisionReactivation() {
          let consecutiveFramesAtSafeDistance = 0;
          const requiredFrames = 10;
          const checkDistance = () => {
            // Safety check
            if (!this.landingTarget || !this.landingTarget.center) {
              this.collisionEnabled = true;
              this.landingTarget = null;
              return;
            }
            const distanceFromPlanet = this.playerShip.position.distanceTo(this.landingTarget.center);
            const safeDistance = this.landingTarget.config.radius + 15;
            const playerToPlanet = new THREE.Vector3().subVectors(this.landingTarget.center, this.playerShip.position);
            const isMovingAway = this.playerVelocity.dot(playerToPlanet) < 0;
            if (distanceFromPlanet > safeDistance && (isMovingAway || this.playerVelocity.length() < 0.1)) {
              consecutiveFramesAtSafeDistance++;
              if (consecutiveFramesAtSafeDistance >= requiredFrames) {
                this.collisionEnabled = true;
                this.landingTarget = null;
                return;
              }
            } else {
              consecutiveFramesAtSafeDistance = 0;
            }
            requestAnimationFrame(checkDistance);
          };
          requestAnimationFrame(checkDistance);
        }
        easeInOutCubic(t) {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        }
        easeInOutQuad(t) {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        }
        showDialogue() {
          const dialogueSystem = document.getElementById('dialogueSystem');
          if (!dialogueSystem) {
            const dialogue = document.createElement('div');
            dialogue.id = 'dialogueSystem';
            dialogue.className = 'hidden';
            dialogue.innerHTML = `
                                                                                
              <div id="dialogueBox">
                <div id="dialogueContent">
                  <div id="planetImage"></div>
                  <h3 id="dialogueTitle">Planet</h3>
                  <p id="dialogueText"></p>
                  <div id="dialogueOptions">
                    <button class="dialogue-btn" onclick="game.closeDialogue()">Take Off</button>
                  </div>
                </div>
              </div>`;
            document.getElementById('gameContainer').appendChild(dialogue)
          }
          document.getElementById('dialogueSystem').classList.remove('hidden');
          const planetConfig = this.landingTarget.config;
          const dialogue = planetConfig.dialogue;
          //document.getElementById('planetImage').textContent = dialogue.image || '🪐';
          function setPlanetImage(dialogue) {
  const planetImageElement = document.getElementById('planetImage');
  
  if (!planetImageElement) {
    console.error('Element with id "planetImage" not found');
    return;
  }
  
  const imageContent = dialogue.image || '🪐';
  
  // Limpiar el contenido actual
  planetImageElement.innerHTML = '';
  
  // Verificar si es una ruta de imagen (más flexible)
  const isImagePath = imageContent.includes('/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imageContent);
  
  if (isImagePath) {
    // Crear elemento img para rutas de imagen
    const imgElement = document.createElement('img');
    imgElement.src = imageContent;
    imgElement.alt = dialogue.name || 'Planet';
    imgElement.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
    `;
    
    // Manejar error de carga - fallback al emoji por defecto
    imgElement.onerror = () => {
      console.warn(`Failed to load image: ${imageContent}`);
      planetImageElement.innerHTML = '';
      planetImageElement.textContent = '🪐';
    };
    
    // Confirmar que la imagen se está cargando
    imgElement.onload = () => {
      console.log(`Image loaded successfully: ${imageContent}`);
    };
    
    planetImageElement.appendChild(imgElement);
  } else {
    // Si no es una ruta de imagen, usar como emoji/texto
    planetImageElement.textContent = imageContent;
  }
}
 setPlanetImage(dialogue);
          document.getElementById('dialogueTitle').textContent = `${dialogue.name}`;
          let dialogueText = dialogue.baseText;
          if (dialogue.flagTexts) {
            for (const [flag, text] of Object.entries(dialogue.flagTexts)) {
              if (this.visitedPlanets.has(flag)) {
                dialogueText += ' ' + text;
                break
              }
            }
          }
          this.typeWriter(dialogueText, 'dialogueText');
          const planetKey = `visited_${dialogue.name.toLowerCase().replace(/[^a-z]/g,'')}`;
          this.visitedPlanets.add(planetKey)
        }
        typeWriter(text, elementId, index = 0) {
  const element = document.getElementById(elementId);
  if (index === 0) element.textContent = '';
  
  if (index < text.length) {
    element.textContent += text.charAt(index);
    
    // Auto-scroll to bottom to show newly typed content
    element.scrollTop = element.scrollHeight;
    
    setTimeout(() => this.typeWriter(text, elementId, index + 1), this.typewriterSpeed);
  }
}
        closeDialogue(){
    const currentPlanet = this.landingTarget;
    const storyWaypoint = currentPlanet.config.dialogue?.setStoryWaypoint;
    
    document.getElementById('dialogueSystem').classList.add('hidden');
    this.landingState = 'taking_off';
    this.landingStartTime = Date.now();
    this.landingProgress = 0;
    this.playerShip.visible = false;
    
    // Set story waypoint based on type (coordinates or planet name)
    if (storyWaypoint) {
        let waypointData = null;
        let displayName = '';
        
        // Check if it's coordinates (object with x, z properties)
        if (typeof storyWaypoint === 'object' && storyWaypoint.x !== undefined && storyWaypoint.z !== undefined) {
            waypointData = {
                x: storyWaypoint.x,
                z: storyWaypoint.z,
                type: 'static'
            };
            displayName = `Coordinates (${storyWaypoint.x}, ${storyWaypoint.z})`;
        }
        // Otherwise treat as planet name
        else if (typeof storyWaypoint === 'string') {
            const targetPlanet = this.findPlanetByName(storyWaypoint);
            if (targetPlanet) {
                waypointData = {
                    x: targetPlanet.center.x,
                    z: targetPlanet.center.z,
                    planet: targetPlanet,
                    type: 'planet'
                };
                displayName = storyWaypoint;
            }
        }
        
        // Set the waypoint and show notification
        if (waypointData) {
            this.minimapManager.waypoint = waypointData;
            
            // Show navigation notification after a short delay
            setTimeout(() => {
                this.showNavigationNotification(displayName);
                //this.audioManager.playWeaponSwitch(); // Reuse power-up sound
            }, 100);
        }
    }
}
        getPlanetName(planet) {
          return planet.config.dialogue?.name || `Planet ${this.planets.indexOf(planet) + 1}`
        }
       fireWeapon(){
    switch(this.player.currentWeapon){
        case 1: this.fireBlaster(); break;
        case 2: this.fireScatter(3); break;
        case 3: this.fireScatter(5); break;
        case 4: this.fireMine(); break;
        case 5: this.fireLaser(); break;
        case 6: this.fireEMPBurst(); break;
        case 7: this.fireHomingMissile(); break;
        case 8: this.activateTractorBeam(); break;
    }
}
fireEMPBurst(){
    //const empGeom = new THREE.SphereGeometry(2, 8, 6); // Reduced segments for mobile
    const empGeom = new THREE.SphereGeometry(2, 16, 16);
    const empMat = new THREE.MeshBasicMaterial({
        color: 0x4169E1,
        emissive: 0x1E90FF,
        emissiveIntensity: 0.8, // Reduced intensity
        transparent: true,
        opacity: 0.6,
        wireframe: true,
        depthTest: true,     // ADD THIS LINE
        depthWrite: true  
    });
    const empSphere = new THREE.Mesh(empGeom, empMat);
    empSphere.position.copy(this.playerShip.position);
    empSphere.position.y = 5;
    empSphere.renderOrder = 150; 
    this.empBursts = this.empBursts || [];
    this.empBursts.push({
        mesh: empSphere,
        life: 40, // Slightly shorter for performance
        maxLife: 40,
        expansion: 0.8, // Start bigger, expand faster
        maxRadius: 25,
        updateCounter: 0 // For throttled updates
    });
    this.scene.add(empSphere);
    this.audioManager.playWeaponSwitch();
}

// 4. TRACTOR BEAM WEAPON
activateTractorBeam(){
    if(this.tractorBeam){
        this.scene.remove(this.tractorBeam);
    }
    
    // Create beam geometry extending forward
    const direction = new THREE.Vector3(
        Math.sin(this.playerShip.rotation.y), 0, 
        Math.cos(this.playerShip.rotation.y)
    );
    const beamEnd = this.playerShip.position.clone()
        .add(direction.clone().multiplyScalar(40));
    
    // Create wider beam using cylinder
    const beamGeom = new THREE.CylinderGeometry(0.5, 2, 40, 12);
    const beamMat = new THREE.MeshBasicMaterial({
        color: 0xFF69B4,
        emissive: 0xFF1493,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.4
    });
    
    this.tractorBeam = new THREE.Mesh(beamGeom, beamMat);
    this.tractorBeam.position.copy(this.playerShip.position);
    this.tractorBeam.position.add(direction.multiplyScalar(20));
    this.tractorBeam.lookAt(beamEnd);
    this.tractorBeam.rotateX(Math.PI / 2);
    
    this.scene.add(this.tractorBeam);
    this.audioManager.playLaser();
}
// 6. UPDATE EMP BURSTS
updateEMPBursts(){
    if(!this.empBursts) return;
    
    this.empBursts = this.empBursts.filter(emp => {
        emp.life--;
        emp.expansion += 0.8;
        
        const currentRadius = Math.min(emp.expansion, emp.maxRadius);
        emp.mesh.scale.setScalar(currentRadius / 2);
        emp.mesh.material.opacity = (emp.life / emp.maxLife) * 0.6;
        emp.mesh.rotation.y += 0.1;
        emp.mesh.rotation.x += 0.05;
        
        // Apply EMP effect to enemies in range
        this.enemies.forEach(enemy => {
            if(enemy.health > 0 && !enemy.empDisabled){
                const dist = enemy.mesh.position.distanceTo(emp.mesh.position);
                if(dist < currentRadius){
                    enemy.empDisabled = true;
                    enemy.empDuration = 300; // 5 seconds
                    enemy.originalSpeed = enemy.speed;
                    enemy.originalChaseSpeed = enemy.chaseSpeed;
                    enemy.speed = 0;
                    enemy.chaseSpeed = 0;
                    
                    // Visual feedback - make enemy flash blue
                    enemy.mesh.traverse(child => {
                        if(child.isMesh){
                            child.material.emissive = new THREE.Color(0x4169E1);
                            child.material.emissiveIntensity = 0.3;
                        }
                    });
                }
            }
        });
        
        if(emp.life <= 0){
            this.scene.remove(emp.mesh);
            return false;
        }
        return true;
    });
}

// 7. UPDATE TRACTOR BEAM
updateTractorBeam(){
    if(!this.tractorBeam) return;
    
    // Update beam position and rotation
    const direction = new THREE.Vector3(
        Math.sin(this.playerShip.rotation.y), 0,
        Math.cos(this.playerShip.rotation.y)
    );
    
    this.tractorBeam.position.copy(this.playerShip.position);
    this.tractorBeam.position.add(direction.clone().multiplyScalar(20));
    this.tractorBeam.lookAt(this.playerShip.position.clone().add(direction.multiplyScalar(60)));
    this.tractorBeam.rotateX(Math.PI / 2);
    
    // Animate beam
    this.tractorBeam.material.emissiveIntensity = 0.4 + 0.3 * Math.sin(Date.now() * 0.01);
    
    // Apply tractor effect to enemies
    this.enemies.forEach(enemy => {
        if(enemy.health <= 0) return;
        
        const enemyToPlayer = new THREE.Vector3()
            .subVectors(this.playerShip.position, enemy.mesh.position);
        const distance = enemyToPlayer.length();
        
        // Check if enemy is in beam cone
        const beamDirection = direction.clone().normalize();
        const enemyDirection = enemyToPlayer.clone().normalize();
        const angle = beamDirection.angleTo(enemyDirection);
        
        if(distance < 40 && angle < Math.PI / 8){ // 22.5 degree cone
            // Pull enemy toward player
            const pullForce = Math.max(0.5, (40 - distance) / 40 * 2);
            const pullVector = enemyToPlayer.normalize().multiplyScalar(pullForce);
            
            const newPos = enemy.mesh.position.clone().add(pullVector);
            if(!this.checkPlanetCollision(newPos)){
                enemy.mesh.position.copy(newPos);
            }
            
            // Damage enemy
            enemy.health -= 2;
            if(enemy.health <= 0){
                this.createExplosion(enemy.mesh.position);
                this.audioManager.playExplosion();
                enemy.mesh.visible = false;
                this.player.score += enemy.score;
                this.dropArtifact(enemy.mesh.position);
                this.updateHUD();
            }
        }
    });
}

// 8. UPDATE TIME DILATION
updateTimeDilation(){
    if(!this.timeDilationActive) return;
    
    this.timeDilationDuration--;
    
    // Update visual effect
    if(this.timeDilationEffect){
        this.timeDilationEffect.position.copy(this.playerShip.position);
        this.timeDilationEffect.rotation.z += 0.02;
        this.timeDilationEffect.material.opacity = (this.timeDilationDuration / 300) * 0.3;
        
        // Pulsing effect
        const pulse = 1 + 0.2 * Math.sin(Date.now() * 0.008);
        this.timeDilationEffect.scale.setScalar(pulse);
    }
    
    if(this.timeDilationDuration <= 0){
        this.timeDilationActive = false;
        this.timeScale = 1.0;
        
        if(this.timeDilationEffect){
            this.scene.remove(this.timeDilationEffect);
            this.timeDilationEffect = null;
        }
    }
}

// 9. UPDATE ENEMY RECOVERY FROM EMP
updateEnemyEMPRecovery(){
    this.enemies.forEach(enemy => {
        if(enemy.empDisabled){
            enemy.empDuration--;
            
            if(enemy.empDuration <= 0){
                enemy.empDisabled = false;
                enemy.speed = enemy.originalSpeed || CONFIG.enemy.baseSpeed;
                enemy.chaseSpeed = enemy.originalChaseSpeed || CONFIG.enemy.chaseSpeed;
                
                // Restore original material
                enemy.mesh.traverse(child => {
                    if(child.isMesh){
                        child.material.emissive = new THREE.Color(0x000000);
                        child.material.emissiveIntensity = 0;
                    }
                });
            }
        }
    });
}

updateHomingMissiles(){
    if(!this.homingMissiles) return;
    
    this.homingMissiles = this.homingMissiles.filter(missile => {
        missile.life--;
        missile.currentDelay--;
        
        // Animate glowing tip
        if(missile.tip){
            const tipPulse = 0.8 + 0.4 * Math.sin(Date.now() * 0.02);
            missile.tip.material.emissiveIntensity = tipPulse;
        }
        
        // First phase: go forward, then start homing
        if(missile.currentDelay > 0){
            // Still in forward-only phase
            missile.mesh.position.add(missile.velocity);
        } else {
            // Homing phase begins
            if(missile.target && missile.target.health > 0){
                // Calculate direction to target
                const targetDir = new THREE.Vector3()
                    .subVectors(missile.target.mesh.position, missile.mesh.position)
                    .normalize();
                
                // Gradually turn velocity toward target (homing behavior)
                missile.velocity.lerp(targetDir.multiplyScalar(missile.speed), missile.turnRate);
            }
            
            // Move missile
            missile.mesh.position.add(missile.velocity);
            
            // Orient missile in direction of movement
            missile.mesh.lookAt(missile.mesh.position.clone().add(missile.velocity));
        }
        
        // Check collision with target
        if(missile.target && missile.target.health > 0){
            const distance = missile.mesh.position.distanceTo(missile.target.mesh.position);
            if(distance < 2.5){
                missile.target.health -= missile.damage;
                this.createExplosion(missile.mesh.position);
                this.audioManager.playExplosion();
                
                if(missile.target.health <= 0){
                    missile.target.mesh.visible = false;
                    this.player.score += missile.target.score;
                    this.dropArtifact(missile.target.mesh.position);
                    this.updateHUD();
                } else {
                    this.audioManager.playEnemyHit();
                }
                
                this.scene.remove(missile.mesh);
                return false;
            }
        }
        
        // Check collision with other enemies if original target is gone
        if(!missile.target || missile.target.health <= 0){
            for(let enemy of this.enemies){
                if(enemy.health > 0){
                    const distance = missile.mesh.position.distanceTo(enemy.mesh.position);
                    if(distance < 2.5){
                        enemy.health -= missile.damage;
                        this.createExplosion(missile.mesh.position);
                        this.audioManager.playExplosion();
                        
                        if(enemy.health <= 0){
                            enemy.mesh.visible = false;
                            this.player.score += enemy.score;
                            this.dropArtifact(enemy.mesh.position);
                            this.updateHUD();
                        } else {
                            this.audioManager.playEnemyHit();
                        }
                        
                        this.scene.remove(missile.mesh);
                        return false;
                    }
                }
            }
        }
        
        if(missile.life <= 0){
            this.scene.remove(missile.mesh);
            return false;
        }
        return true;
    });
}

// Homing Missiles (weapon 7)
fireHomingMissile(){
    // Find nearest enemy
    let target = null;
    let minDist = Infinity;
    this.enemies.forEach(enemy => {
        if(enemy.health > 0){
            const dist = enemy.mesh.position.distanceTo(this.playerShip.position);
            if(dist < minDist && dist < 80){
                minDist = dist;
                target = enemy;
            }
        }
    });
    
    if(!target) return;
    
    // Create missile body
    const missileGeom = new THREE.SphereGeometry(0.4, 8, 8);
    const missileMat = new THREE.MeshBasicMaterial({
        color: 0xfeca57,
        emissive: 0xff9500,
        emissiveIntensity: 0.6
    });
    const missile = new THREE.Mesh(missileGeom, missileMat);
    missile.position.copy(this.playerShip.position);
    missile.position.y += 0.5;
    
    // Create glowing tip
    const tipGeom = new THREE.SphereGeometry(0.15, 6, 6);
    const tipMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1.0
    });
    const tip = new THREE.Mesh(tipGeom, tipMat);
    tip.position.set(0, 0, 0.5); // Position at front of missile
    missile.add(tip);
    
    // Initial forward direction from ship
    const forwardDirection = new THREE.Vector3(
        Math.sin(this.playerShip.rotation.y),
        0,
        Math.cos(this.playerShip.rotation.y)
    ).normalize().multiplyScalar(1.8);
    
    this.homingMissiles = this.homingMissiles || [];
    this.homingMissiles.push({
        mesh: missile,
        tip: tip,
        target: target,
        velocity: forwardDirection,
        speed: 1.8,
        life: 120,
        turnRate: 0.12,
        damage: 35,
        homingDelay: 20, // Frames before homing kicks in
        currentDelay: 20
    });
    this.scene.add(missile);
    this.audioManager.playBlaster(this.playerShip.position, this.playerShip.position);
}

        fireBlaster() {
    this.createBullet(0);
    this.audioManager.playBlaster(this.playerShip.position, this.playerShip.position); // Same position for player sounds
}

        fireScatter(count) {
          const spreadAngle = Math.PI / 6;
          for (let i = 0; i < count; i++) {
            const angleOffset = (i - (count - 1) / 2) * (spreadAngle / (count - 1));
            this.createBullet(angleOffset)
          }
          if (count === 3) {
            this.audioManager.playScatter()
          } else {
            this.audioManager.playShotgun()
          }
        }
        createBullet(angleOffset = 0) {
          try {
            const bulletGeom = new THREE.SphereGeometry(0.2, 8, 8);
            const bulletMat = new THREE.MeshBasicMaterial({
              color: 0x00f2fe,
            depthTest: true,     // ADD THIS LINE
            depthWrite: true  
            });
            const bullet = new THREE.Mesh(bulletGeom, bulletMat);
               bullet.renderOrder = 60;
            if (!this.playerShip || !this.playerShip.position) {
              console.warn('Player ship not available for bullet creation');
              return;
            }
            bullet.position.copy(this.playerShip.position);
            bullet.position.y += 0.5;
            const direction = new THREE.Vector3(Math.sin(this.playerShip.rotation.y + angleOffset), 0, Math.cos(this.playerShip.rotation.y + angleOffset));
            const bulletVelocity = direction.clone().multiplyScalar(CONFIG.bullet.speed);
            const bulletObject = {
              mesh: bullet,
              velocity: bulletVelocity,
              life: CONFIG.bullet.life
            };
            this.bullets.push(bulletObject);
            this.scene.add(bullet);
          } catch (e) {
            console.error('Failed to create bullet:', e);
          }
        }
        fireMine(){
    const mineGeom = new THREE.SphereGeometry(0.6, 12, 12);
    const mineMat = new THREE.MeshBasicMaterial({
        color: 0xff4757,
        emissive: 0xff2030,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9
    });
    const mine = new THREE.Mesh(mineGeom, mineMat);
    mine.position.copy(this.playerShip.position);
    mine.position.y += 0.5;
    
    // Add pulsing animation data
    this.mines.push({
        mesh: mine,
        life: 600,
        exploded: false,
        pulseTime: 0,
        pulseSpeed: 0.08 + Math.random() * 0.04 // Slight variation
    });
    this.scene.add(mine);
    this.audioManager.playWeaponSwitch();
}

        fireLaser() {
          if (this.laserBeam) {
            this.scene.remove(this.laserBeam)
          }
          const direction = new THREE.Vector3(Math.sin(this.playerShip.rotation.y), 0, Math.cos(this.playerShip.rotation.y));
          const laserEnd = this.playerShip.position.clone().add(direction.clone().multiplyScalar(CONFIG.weapons.laser.maxDist));
          const laserGeom = new THREE.BufferGeometry().setFromPoints([this.playerShip.position.clone().add(new THREE.Vector3(0, 0.5, 0)), laserEnd]);
          const laserMat = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            transparent: !0,
            opacity: 0.8,
        depthTest: true,     // ADD THIS LINE
        depthWrite: true
          });
          this.laserBeam = new THREE.Line(laserGeom, laserMat);
          this.laserBeam.renderOrder = 100;
          this.scene.add(this.laserBeam);
          this.audioManager.playLaser();
          let hitSomething = !1;
          const damage = this.player.effects.damage.active ? CONFIG.weapons.laser.damage * CONFIG.audio.damage.mult : CONFIG.weapons.laser.damage;
          this.enemies.forEach(enemy => {
            if (enemy.health > 0) {
              const distanceToLine = this.distancePointToLine(enemy.mesh.position, this.playerShip.position, laserEnd);
              if (distanceToLine < 2) {
                enemy.health -= damage;
                hitSomething = !0;
                if (enemy.health <= 0) {
                  this.createExplosion(enemy.mesh.position);
                  this.audioManager.playExplosion();
                  enemy.mesh.visible = !1;
                  this.player.score += enemy.score;
                  this.dropArtifact(enemy.mesh.position);
                  this.updateHUD()
                } else {
                  this.audioManager.playEnemyHit()
                }
              }
            }
          });
          this.planets.forEach(planet => {
            if (!planet.destroyed) {
              const distanceToLine = this.distancePointToLine(planet.center, this.playerShip.position, laserEnd);
              if (distanceToLine < planet.config.radius) {
                planet.health -= damage;
                hitSomething = !0;
                if (planet.health <= 0) {
                  this.destroyPlanet(planet)
                }
              }
            }
          })
        }
        distancePointToLine(point, lineStart, lineEnd) {
          const lineDir = new THREE.Vector3().subVectors(lineEnd, lineStart);
          const pointToStart = new THREE.Vector3().subVectors(point, lineStart);
          const t = Math.max(0, Math.min(1, pointToStart.dot(lineDir) / lineDir.dot(lineDir)));
          const projection = lineStart.clone().add(lineDir.multiplyScalar(t));
          return point.distanceTo(projection)
        }
        makePlayerAlwaysVisible() {
          if (!this.originalPlayerMaterials) {
            this.originalPlayerMaterials = [];
            this.playerShip.traverse((child) => {
              if (child.isMesh) {
                this.originalPlayerMaterials.push({
                  mesh: child,
                  material: child.material.clone()
                })
              }
            })
          }
          this.playerShip.traverse((child) => {
            if (child.isMesh) {
              child.material.depthTest = !1;
              child.material.depthWrite = !1;
              child.renderOrder = 999
            }
          });
          this.playerShip.renderOrder = 999
        }
        restorePlayerDepth(){
    if(this.originalPlayerMaterials){
        this.originalPlayerMaterials.forEach(({mesh,material})=>{
            // ✅ Actually restore the original material
            mesh.material = material;
            mesh.renderOrder = 0;
        });
        this.playerShip.renderOrder = 0;
        // Clear the backup to prevent memory leaks
        this.originalPlayerMaterials = null;
    }
}
        createLandingGlow() {
          this.removeLandingGlow();
          this.landingGlow = this.playerShip.clone();
          this.landingGlow.scale.multiplyScalar(1.3);
          this.landingGlow.traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: !0,
                opacity: 0.4,
                side: THREE.DoubleSide,
                depthTest: !1,
                depthWrite: !1
              });
              child.renderOrder = 998
            }
          });
          this.landingGlow.renderOrder = 998;
          this.scene.add(this.landingGlow)
        }
        removeLandingGlow() {
          if (this.landingGlow) {
            this.scene.remove(this.landingGlow);
            this.landingGlow = null
          }
        }
        updateLandingGlowEffect() {
          if (this.landingGlow && this.playerShip) {
            this.landingGlow.position.copy(this.playerShip.position);
            this.landingGlow.rotation.copy(this.playerShip.rotation);
            const baseScale = this.playerShip.scale.x * 1.3;
            this.landingGlow.scale.setScalar(baseScale);
            const pulseIntensity = 0.2 + 0.8 * Math.sin(Date.now() * 0.008);
            this.landingGlow.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.opacity = 0.2 + pulseIntensity * 0.4;
                const hue = (Date.now() * 0.001) % 1;
                child.material.color.setHSL(0.5 + hue * 0.2, 1, 0.6)
              }
            })
          }
        }
        update() {
          if (!this.gameStarted) return;
          this.updateLanding();
          this.updateLandingGlowEffect();
          this.renderLandingPrompts();
          if (this.landingState === 'none' || this.landingState === 'landed') {
            this.updatePlayer()
          }
          this.updateTrails();
          this.updatePlanets();
          this.updateEnemies();
          this.updateAllies();
          this.updateBullets();
          this.updateEnemyBullets();
          this.updateArtifacts();
          this.updateMines();
this.updateEMPBursts();
this.updateHomingMissiles(); 
this.updateTractorBeam();
this.updateEnemyEMPRecovery();
          this.updateCollisions();
          this.updateBackground();
          this.updateEffects();
           this.minimapManager.updateWaypoint(); // Update planet waypoints
    this.updateWaypointIndicator(); // Update 3D indicator
    if (this.waypointReachedCooldown > 0) this.waypointReachedCooldown--;
          this.updateMinimap();
          this.updateExplosions()
        }
 updateAllies(){
    this.allies = this.allies.filter(ally => {
        if(ally.health <= 0){
          this.audioManager.playDamage();
            this.scene.remove(ally.mesh);
            return false;
        }
        
        // Define all distances at the start to avoid scoping issues
        const distanceToPlayer = ally.mesh.position.distanceTo(this.playerShip.position);
        const combatRadius = 50;
        const followDistance = 25;
        const preferredCombatDistance = 20;
        
        // Check if player is stationary (for formation flying)
        const playerStationary = this.playerVelocity.length() < 0.05;
        
        // Find nearby enemies and check if this ally is being targeted
        const nearbyEnemies = this.enemies.filter(enemy => 
            enemy.health > 0 && 
            enemy.mesh.position.distanceTo(ally.mesh.position) < combatRadius
        );
        
        // Check if ally is being targeted by any enemy
        const beingTargeted = this.enemies.some(enemy => 
            enemy.health > 0 && 
            enemy.attacking && 
            enemy.currentTarget === ally.mesh
        );
        
        // Find closest threatening enemy to this ally
        let closestThreat = null;
        let closestThreatDistance = Infinity;
        nearbyEnemies.forEach(enemy => {
            const distance = enemy.mesh.position.distanceTo(ally.mesh.position);
            if(distance < closestThreatDistance) {
                closestThreat = enemy;
                closestThreatDistance = distance;
            }
        });
        
        let moveDirection = new THREE.Vector3();
        let targetLookAt = null;
        
        if(closestThreat || beingTargeted){
            // Combat mode - maintain distance and shoot
            const threat = closestThreat;
            const distanceToThreat = ally.mesh.position.distanceTo(threat.mesh.position);
            
            if(distanceToThreat < preferredCombatDistance * 0.7) {
                // Too close - back away while shooting
                moveDirection.subVectors(ally.mesh.position, threat.mesh.position).normalize();
                ally.mesh.position.add(moveDirection.multiplyScalar(0.6));
            } else if(distanceToThreat > preferredCombatDistance * 1.3) {
                // Too far - move closer to effective range
                moveDirection.subVectors(threat.mesh.position, ally.mesh.position).normalize();
                ally.mesh.position.add(moveDirection.multiplyScalar(0.4));
            } else {
                // Good distance - strafe around enemy
                const strafeAngle = Math.atan2(
                    threat.mesh.position.z - ally.mesh.position.z,
                    threat.mesh.position.x - ally.mesh.position.x
                ) + Math.PI/2 + (ally.followSide * 0.5);
                
                moveDirection.set(Math.cos(strafeAngle), 0, Math.sin(strafeAngle));
                ally.mesh.position.add(moveDirection.multiplyScalar(0.3));
            }
            
            // Always look at the threat when in combat
            targetLookAt = threat.mesh.position;
            
            // Shoot at threat
            ally.shootCooldown--;
            if(ally.shootCooldown <= 0 && distanceToThreat < 35){
                this.createAllyBullet(ally, threat);
                ally.shootCooldown = 35 + Math.random() * 10;
            }
            
        } else if(playerStationary && distanceToPlayer < followDistance * 1.5){
            // Formation mode - arrange in formation behind player
            const allyIndex = this.allies.indexOf(ally);
            const formationPosition = this.calculateFormationPosition(allyIndex);
            const distanceToFormation = ally.mesh.position.distanceTo(formationPosition);
            
            // Only move if significantly out of position (reduces twitching)
            if(distanceToFormation > 5) {
                moveDirection.subVectors(formationPosition, ally.mesh.position).normalize();
                const moveSpeed = Math.min(0.25, distanceToFormation * 0.08);
                ally.mesh.position.add(moveDirection.multiplyScalar(moveSpeed));
            }
            
            // In formation, look at player or same direction as player
            if(distanceToFormation > 8) {
                targetLookAt = this.playerShip.position;
            } else {
                // Face same direction as player when in formation
                ally.mesh.rotation.y = this.playerShip.rotation.y;
            }
            
        } else {
            // Follow mode - standard following behavior
            if(distanceToPlayer > followDistance){
                moveDirection.subVectors(this.playerShip.position, ally.mesh.position).normalize();
                ally.mesh.position.add(moveDirection.multiplyScalar(0.7));
                targetLookAt = this.playerShip.position;
            } else {
                // Escort positioning with smoother movement
                const baseDistance = 15 + (ally.followSide * 3);
                const sideAngle = ally.followSide * Math.PI/4 + (Math.sin(Date.now() * 0.0008 + ally.followSide) * 0.05);
                const behindOffset = new THREE.Vector3(
                    Math.sin(this.playerShip.rotation.y + sideAngle) * baseDistance,
                    0,
                    Math.cos(this.playerShip.rotation.y + sideAngle) * baseDistance
                );
                
                ally.targetPosition.copy(this.playerShip.position).add(behindOffset);
                const distanceToTarget = ally.mesh.position.distanceTo(ally.targetPosition);
                
                // Smoother following with deadzone
                if(distanceToTarget > 4){
                    moveDirection.subVectors(ally.targetPosition, ally.mesh.position).normalize();
                    const moveSpeed = Math.min(0.35, distanceToTarget * 0.12);
                    ally.mesh.position.add(moveDirection.multiplyScalar(moveSpeed));
                    
                    const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
                    ally.mesh.rotation.y += (targetRotation - ally.mesh.rotation.y) * 0.08;
                } else {
                    // When close to position, face same direction as player
                    ally.mesh.rotation.y += (this.playerShip.rotation.y - ally.mesh.rotation.y) * 0.05;
                }
            }
            
            // Healing logic (only when not in combat)
            ally.healCooldown--;
const healingRange=35; // Add healing range limit

if(ally.healCooldown<=0&&this.player.health<CONFIG.player.health&&distanceToPlayer<=healingRange){
    this.player.health=Math.min(CONFIG.player.health,this.player.health+3);
    ally.healCooldown=45;
    this.updateHUD();
    this.createHealingBeam(ally,this.playerShip)
}
        }
        
        // Apply rotation smoothly if we have a target to look at
        if(targetLookAt) {
            const direction = new THREE.Vector3().subVectors(targetLookAt, ally.mesh.position);
            const targetRotation = Math.atan2(direction.x, direction.z);
            const rotationDiff = targetRotation - ally.mesh.rotation.y;
            
            // Normalize rotation difference to [-π, π]
            let normalizedDiff = ((rotationDiff % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
            ally.mesh.rotation.y += normalizedDiff * 0.15;
        }
        
        // Avoidance between allies (with deadzone to reduce twitching)
        const avoidanceRadius = 12;
        this.allies.forEach(otherAlly => {
            if(otherAlly === ally) return;
            const distance = ally.mesh.position.distanceTo(otherAlly.mesh.position);
            if(distance < avoidanceRadius && distance > 0.5) {
                const avoidDirection = new THREE.Vector3()
                    .subVectors(ally.mesh.position, otherAlly.mesh.position)
                    .normalize().multiplyScalar((avoidanceRadius - distance) * 0.8);
                ally.mesh.position.add(avoidDirection);
            }
        });
        
        ally.mesh.position.y = 5;
        return true;
    });
}

createAllyBullet(ally, target){
    const bulletGeom = new THREE.SphereGeometry(0.25, 8, 8);
    const bulletMat = new THREE.MeshBasicMaterial({color: 0x00ff88});
    const bullet = new THREE.Mesh(bulletGeom, bulletMat);
    
    bullet.position.copy(ally.mesh.position);
    bullet.position.y += 0.5;
    
    // Predictive shooting - aim where target will be
    let targetPosition = target.mesh.position.clone();
    
    if(target.attacking && target.currentTarget) {
        // If enemy is moving towards their target, predict their movement
        const enemyDirection = new THREE.Vector3()
            .subVectors(target.currentTarget.position, target.mesh.position)
            .normalize();
        targetPosition.add(enemyDirection.multiplyScalar(3));
    }
    
    const direction = new THREE.Vector3()
        .subVectors(targetPosition, ally.mesh.position)
        .normalize();
    const bulletVelocity = direction.multiplyScalar(CONFIG.bullet.speed * 1.8);
    
    this.bullets.push({
        mesh: bullet,
        velocity: bulletVelocity,
        life: CONFIG.bullet.life,
        isAlly: true,
        damage: 30
    });
    this.scene.add(bullet);
    
    this.audioManager.playBlaster(ally.mesh.position, this.playerShip.position);
}

        createTrail(){
    if(Math.random()>0.3)return;
    const trailCount=3;
    const coneAngle=Math.PI/4;
    const behindDistance=3;
    for(let i=0;i<trailCount;i++){
        const spreadAngle=(Math.random()-0.5)*coneAngle;
        const playerAngle=this.playerShip.rotation.y+Math.PI;
        const finalAngle=playerAngle+spreadAngle;
        const distance=behindDistance+Math.random()*2;
        const x=this.playerShip.position.x+Math.sin(finalAngle)*distance;
        const z=this.playerShip.position.z+Math.cos(finalAngle)*distance;
        const noiseValue=new PerlinNoise().noise(x*0.1,z*0.1,Date.now()*0.001);
        const intensity=Math.abs(noiseValue);
        const trailGeom=new THREE.SphereGeometry(0.3+intensity*0.5,6,6);
        const hue=(intensity*360+200)%360;
        const trailMat=new THREE.MeshBasicMaterial({
            color:new THREE.Color().setHSL(hue/360,0.8,0.6),
            transparent:!0,
            opacity:0.7,
            depthTest: true,  // ✅ Ensure proper depth testing
            depthWrite: false // ✅ Prevent z-fighting
        });
        const trail=new THREE.Mesh(trailGeom,trailMat);
        trail.position.set(x, 3.5 + Math.random() * 0.5, z);
        trail.renderOrder = 50; 
        this.trails.push({mesh:trail,life:60+Math.random()*40,maxLife:60+Math.random()*40});
        this.scene.add(trail);
    }
}

        updateTrails() {
          this.trails = this.trails.filter(trail => {
            trail.life--;
            const fadeRatio = trail.life / trail.maxLife;
            trail.mesh.material.opacity = fadeRatio * 0.7;
            trail.mesh.scale.setScalar(fadeRatio);
            if (trail.life <= 0) {
              this.scene.remove(trail.mesh);
              return !1
            }
            return !0
          })
        }
        updatePlayer() {
          let moveX = 0,
            moveZ = 0;
          if (this.keys.KeyW || this.keys.ArrowUp || this.touchControls.moveY < -0.3) moveZ -= 1;
          if (this.keys.KeyS || this.keys.ArrowDown || this.touchControls.moveY > 0.3) moveZ += 1;
          if (this.keys.KeyA || this.keys.ArrowLeft || this.touchControls.moveX < -0.3) moveX -= 1;
          if (this.keys.KeyD || this.keys.ArrowRight || this.touchControls.moveX > 0.3) moveX += 1;
          if (moveX !== 0 || moveZ !== 0) {
            if (moveX !== 0 && moveZ !== 0) {
              moveX *= Math.SQRT1_2;
              moveZ *= Math.SQRT1_2
            }
            const speedMultiplier = this.player.effects.speed.active ? CONFIG.audio.speed.mult : 1;
            this.playerVelocity.x += moveX * CONFIG.player.acc * speedMultiplier;
            this.playerVelocity.z += moveZ * CONFIG.player.acc * speedMultiplier
          }
          this.playerVelocity.multiplyScalar(CONFIG.player.friction);
          const maxSpeed = CONFIG.player.maxSpeed * (this.player.effects.speed.active ? CONFIG.audio.speed.mult : 1);
          const clampedVelocity = this.playerVelocity.clone().clampLength(0, maxSpeed);
          this.playerVelocity.copy(clampedVelocity);
          const newPosition = this.playerShip.position.clone().add(this.playerVelocity);
          if (!this.checkPlanetCollision(newPosition, !0)) {
            this.playerShip.position.copy(newPosition);
            this.playerShip.position.y = 5
          }
          if (this.playerVelocity.length() > 0.1) {
            this.createTrail()
          }
          if (this.playerVelocity.length() > 0.1) {
            const angle = Math.atan2(this.playerVelocity.x, this.playerVelocity.z);
            this.playerShip.rotation.y = angle
          }
          if((this.keys.Space && !this.shootPressed) || this.touchControls.firing){
    this.fireWeapon();
    this.shootPressed = true;
} else if(!this.keys.Space && !this.touchControls.firing){
    this.shootPressed = false;
    
    // Stop continuous weapons
    if(this.laserBeam){
        this.scene.remove(this.laserBeam);
        this.laserBeam = null;
        this.audioManager.stopLaser();
    }
    if(this.tractorBeam){
        this.scene.remove(this.tractorBeam);
        this.tractorBeam = null;
        this.audioManager.stopLaser();
    }
}
          const targetCameraX = this.playerShip.position.x;
          const targetCameraZ = this.playerShip.position.z + 60;
          const cameraPosition = new THREE.Vector3(targetCameraX, 60, targetCameraZ);
          if (!this.checkCameraCollision(cameraPosition)) {
            this.camera.position.copy(cameraPosition)
          } else {
            this.adjustCameraForCollision()
          }
          this.camera.lookAt(this.playerShip.position);
          this.updateCoordinates()
        }
        handleWeaponRelease(){
    if(!this.keys.Space && !this.touchControls.firing){
        this.shootPressed = false;
        
        // Stop laser
        if(this.laserBeam){
            this.scene.remove(this.laserBeam);
            this.laserBeam = null;
            this.audioManager.stopLaser();
        }
        
        // Stop tractor beam
        if(this.tractorBeam){
            this.scene.remove(this.tractorBeam);
            this.tractorBeam = null;
            this.audioManager.stopLaser();
        }
    }
}

        updateEnemies(){

    this.enemies.forEach(enemy=>{
        if(enemy.health<=0||enemy.stuck)return;
        
        // Find closest viable target (player + allies)
        let closestTarget = this.playerShip;
        let closestDistance = enemy.mesh.position.distanceTo(this.playerShip.position);
        
        // Check all allies as potential targets
        this.allies.forEach(ally => {
            if(ally.health > 0) {
                const distanceToAlly = enemy.mesh.position.distanceTo(ally.mesh.position);
                if(distanceToAlly < closestDistance) {
                    closestTarget = ally.mesh;
                    closestDistance = distanceToAlly;
                }
            }
        });
        
        enemy.shootCooldown--;
        
        if(closestDistance < enemy.attackRange && !enemy.attacking){
            enemy.attacking = true;
            enemy.retreating = false;
            enemy.currentTarget = closestTarget; // Store current target
        }
            if(enemy.attacking && closestTarget) {
    enemy.currentTarget = closestTarget; // Update target while attacking
} else if(!enemy.attacking) {
    enemy.currentTarget = null; // Clear target when not attacking
}
        
        if(enemy.attacking){
            const avoidanceForce = this.calculateEnemyAvoidance(enemy);
            
            if(closestDistance > CONFIG.enemy.minDistance * 1.5){
                const directionToTarget = new THREE.Vector3()
                    .subVectors(closestTarget.position, enemy.mesh.position).normalize();
                const combinedDirection = directionToTarget.add(avoidanceForce).normalize();
                const moveDistance = Math.min(enemy.chaseSpeed, closestDistance - CONFIG.enemy.minDistance);
                const movement = combinedDirection.multiplyScalar(moveDistance);
                const newPosition = enemy.mesh.position.clone().add(movement);
                
                if(!this.checkPlanetCollision(newPosition)){
                    enemy.mesh.position.copy(newPosition);
                    enemy.mesh.position.y = 5;
                }
            } else {
                // Circle around target
                const tangentAngle = Math.atan2(
                    closestTarget.position.z - enemy.mesh.position.z,
                    closestTarget.position.x - enemy.mesh.position.x
                ) + Math.PI/2;
                const circleDirection = new THREE.Vector3(Math.cos(tangentAngle), 0, Math.sin(tangentAngle));
                const combinedDirection = circleDirection.add(avoidanceForce.multiplyScalar(2)).normalize();
                const movement = combinedDirection.multiplyScalar(enemy.chaseSpeed * 0.7);
                const newPosition = enemy.mesh.position.clone().add(movement);
                
                if(!this.checkPlanetCollision(newPosition)){
                    enemy.mesh.position.copy(newPosition);
                    enemy.mesh.position.y = 5;
                }
            }
            
            enemy.mesh.lookAt(closestTarget.position);
            
            if(enemy.shootCooldown <= 0 && closestDistance < 30 && closestDistance > CONFIG.enemy.minDistance * 0.8){
                this.enemyShoot(enemy, closestTarget); // Pass target to shoot method
                enemy.shootCooldown = this.getShootCooldown(enemy.weaponType);
            }
            
            if(closestDistance > enemy.attackRange * 2.5){
                enemy.attacking = false;
                enemy.retreating = true;
                enemy.currentTarget = null;
            }
        } else if(enemy.retreating){
             const distanceToPlayer=enemy.mesh.position.distanceTo(this.playerShip.position);
    if(distanceToPlayer<enemy.attackRange*1.2){
  enemy.attacking = true;
  enemy.retreating = false;
  return;
}
              if(closestDistance < enemy.attackRange * 1.2){
                enemy.attacking = true;
                enemy.retreating = false;
                return;
            }
            
            const targetPosition = new THREE.Vector3(
                enemy.planet.center.x + Math.cos(enemy.originalAngle) * enemy.planet.radius,
                5,
                enemy.planet.center.z + Math.sin(enemy.originalAngle) * enemy.planet.radius
            );
            const distanceToTarget = enemy.mesh.position.distanceTo(targetPosition);
            
            if(distanceToTarget > 2){
                const direction = new THREE.Vector3()
                    .subVectors(targetPosition, enemy.mesh.position)
                    .normalize().multiplyScalar(CONFIG.enemy.retSpeed);
                const newPos = enemy.mesh.position.clone().add(direction);
                newPos.y = 5;
                enemy.mesh.position.copy(newPos);
                const lookAhead = enemy.mesh.position.clone().add(direction);
                enemy.mesh.lookAt(lookAhead);
            } else {
                enemy.retreating = false;
                enemy.angle = enemy.originalAngle;
            }
            } else {
              enemy.angle += enemy.speed;
              this.updateEnemyPosition(enemy);
              const nextAngle = enemy.angle + enemy.speed;
              const nextX = enemy.planet.center.x + Math.cos(nextAngle) * enemy.planet.radius;
              const nextZ = enemy.planet.center.z + Math.sin(nextAngle) * enemy.planet.radius;
              const nextPosition = new THREE.Vector3(nextX, 5, nextZ);
              enemy.mesh.lookAt(nextPosition)
            }
          })
        }
        calculateEnemyAvoidance(currentEnemy) {
          const avoidanceForce = new THREE.Vector3();
          let neighborCount = 0;
          this.enemies.forEach(otherEnemy => {
            if (otherEnemy === currentEnemy || otherEnemy.health <= 0) return;
            const distance = currentEnemy.mesh.position.distanceTo(otherEnemy.mesh.position);
            const avoidanceRadius = 12;
            if (distance < avoidanceRadius && distance > 0) {
              const repelDirection = new THREE.Vector3().subVectors(currentEnemy.mesh.position, otherEnemy.mesh.position);
              const repelStrength = Math.max(0.3, (avoidanceRadius - distance) / avoidanceRadius * 2);
              repelDirection.normalize().multiplyScalar(repelStrength);
              avoidanceForce.add(repelDirection);
              neighborCount++
            }
          });
          const playerDistance = currentEnemy.mesh.position.distanceTo(this.playerShip.position);
          if (playerDistance < CONFIG.enemy.minDistance) {
            const repelFromPlayer = new THREE.Vector3().subVectors(currentEnemy.mesh.position, this.playerShip.position);
            const repelStrength = Math.max(0.5, (CONFIG.enemy.minDistance - playerDistance) / CONFIG.enemy.minDistance * 3);
            repelFromPlayer.normalize().multiplyScalar(repelStrength);
            avoidanceForce.add(repelFromPlayer)
          }
          if (neighborCount > 0) {
            avoidanceForce.divideScalar(Math.max(1, neighborCount * 0.5))
          }
          return avoidanceForce
        }
        enemyShoot(enemy, target = null){
    const actualTarget = target || this.playerShip;
    
    const weaponTypes = {
        'rapid': () => {
            this.createEnemyBullet(enemy, actualTarget);
            this.audioManager.playEnemyShot(enemy.mesh.position, this.playerShip.position);
        },
        'burst': () => {
            for(let i = 0; i < 3; i++){
                setTimeout(() => {
                    if(enemy.health > 0){
                        this.createEnemyBullet(enemy, actualTarget);
                        this.audioManager.playEnemyShot(enemy.mesh.position, this.playerShip.position);
                    }
                }, i * 100);
            }
        },
        'heavy': () => {
            this.createEnemyBullet(enemy, actualTarget);
            this.audioManager.playEnemyShot(enemy.mesh.position, this.playerShip.position);
        }
    };
    
    const shootFunction = weaponTypes[enemy.weaponType] || weaponTypes.rapid;
    shootFunction();
}
        createEnemyBullet(enemy, target = null){
    const actualTarget = target || this.playerShip;
    
    const bulletGeom = new THREE.SphereGeometry(0.3, 8, 8);
    const bulletMat = new THREE.MeshBasicMaterial({
        color: 0xff4757,
        emissive: 0xff2030,
        emissiveIntensity: 0.5
    });
    const bullet = new THREE.Mesh(bulletGeom, bulletMat);
    
    bullet.position.copy(enemy.mesh.position);
    bullet.position.y = 5;
    
    const direction = new THREE.Vector3()
        .subVectors(actualTarget.position, enemy.mesh.position).normalize();
    const bulletVelocity = direction.clone().multiplyScalar(CONFIG.bullet.enemySpeed);
    
    this.enemyBullets.push({
        mesh: bullet,
        velocity: bulletVelocity,
        life: CONFIG.bullet.life
    });
    this.scene.add(bullet);
}
        getShootCooldown(weaponType) {
          const cooldowns = {
            'rapid': 60,
            'burst': 180,
            'heavy': 150
          };
          return cooldowns[weaponType] || 120
        }
        updateBullets() {
          this.bullets = this.bullets.filter(bullet => {
            // Safety check
            if (!bullet || !bullet.mesh || !bullet.velocity) {
              return false;
            }
            bullet.mesh.position.add(bullet.velocity);
            bullet.life--;
            const damage = this.player.effects.damage.active ? CONFIG.bullet.damage * CONFIG.audio.damage.mult : CONFIG.bullet.damage;
            // Check enemy collisions
            for (let enemy of this.enemies) {
              if (!enemy || !enemy.mesh || !enemy.mesh.position || enemy.health <= 0) continue;
              try {
                if (bullet.mesh.position.distanceTo(enemy.mesh.position) < 3) {
                  const bulletDamage = bullet.isAlly ? (bullet.damage || 25) : 
                        (this.player.effects.damage.active ? CONFIG.bullet.damage * CONFIG.audio.damage.mult : CONFIG.bullet.damage);
    enemy.health -= bulletDamage;
                  enemy.attacking = true;
                  enemy.retreating = false;
                  this.audioManager.playEnemyHit();
                  if (enemy.health <= 0) {
                    this.createExplosion(enemy.mesh.position);
                    this.audioManager.playExplosion();
                    enemy.mesh.visible = false;
                    this.player.score += enemy.score;
                    this.dropArtifact(enemy.mesh.position);
                    this.updateHUD();
                  }
                  try {
                    this.scene.remove(bullet.mesh);
                  } catch (e) {
                    console.warn('Failed to remove bullet from scene:', e);
                  }
                  return false;
                }
              } catch (e) {
                console.warn('Error in bullet-enemy collision:', e);
                continue;
              }
            }
            // Check planet collisions
            for (let planet of this.planets) {
              if (!planet || !planet.center || planet.destroyed) continue;
              try {
                if (bullet.mesh.position.distanceTo(planet.center) < planet.config.radius) {
                  planet.health -= damage;
                  if (planet.health <= 0) {
                    this.destroyPlanet(planet);
                  }
                  try {
                    this.scene.remove(bullet.mesh);
                  } catch (e) {
                    console.warn('Failed to remove bullet from scene:', e);
                  }
                  return false;
                }
              } catch (e) {
                console.warn('Error in bullet-planet collision:', e);
                continue;
              }
            }
            // Check bullet lifetime
            if (bullet.life <= 0) {
              try {
                this.scene.remove(bullet.mesh);
              } catch (e) {
                console.warn('Failed to remove expired bullet:', e);
              }
              return false;
            }
            return true;
          });
        }
        updateEnemyBullets(){
    this.enemyBullets = this.enemyBullets.filter(bullet => {
        if(!bullet || !bullet.mesh || !bullet.velocity){
            return false;
        }
        
        bullet.mesh.position.add(bullet.velocity);
        bullet.life--;
        
        // Check collision with player
        if(this.landingState === 'none' && this.playerShip && this.playerShip.position){
            try{
                const distance = bullet.mesh.position.distanceTo(this.playerShip.position);
                if(distance < 3){
                    this.player.health -= CONFIG.bullet.enemyDamage;
                    const damageVariants = ['damage', 'enemyHit'];
const randomSound = damageVariants[Math.floor(Math.random() * damageVariants.length)];
this.audioManager.playSprite(randomSound, this.playerShip.position, this.playerShip.position, 0.7);
                    this.createDamageEffect(this.playerShip.position);
                    this.updateHUD();
                    if(this.player.health <= 0){
                        this.gameOver();
                    }
                    
                    try{
                        this.scene.remove(bullet.mesh);
                    }catch(e){
                        console.warn('Failed to remove enemy bullet from scene:', e);
                    }
                    return false;
                }
            }catch(e){
                console.warn('Error in enemy bullet-player collision:', e);
            }
        }
        
        // Check collision with allies
        for(let ally of this.allies){
            if(!ally || !ally.mesh || !ally.mesh.position || ally.health <= 0) continue;
            
            try{
                const distance = bullet.mesh.position.distanceTo(ally.mesh.position);
                if(distance < 3){
                    ally.health -= CONFIG.bullet.enemyDamage;
                    this.audioManager.playDamage();
                    this.createDamageEffect(ally.mesh.position);
                    
                    // Ally destroyed
                    if(ally.health <= 0){
                        this.createExplosion(ally.mesh.position);
                        this.audioManager.playExplosion();
                    }
                    
                    try{
                        this.scene.remove(bullet.mesh);
                    }catch(e){
                        console.warn('Failed to remove enemy bullet from scene:', e);
                    }
                    return false;
                }
            }catch(e){
                console.warn('Error in enemy bullet-ally collision:', e);
                continue;
            }
        }
        
        if(bullet.life <= 0){
            try{
                this.scene.remove(bullet.mesh);
            }catch(e){
                console.warn('Failed to remove expired enemy bullet:', e);
            }
            return false;
        }
        
        return true;
    });
}
        updateArtifacts(){
    this.artifacts = this.artifacts.filter(artifact => {
        artifact.life--;
        
        // Enhanced bobbing and rotation
        artifact.mesh.position.y = 1 + Math.sin(Date.now() * 0.005 + artifact.bobOffset) * 0.8;
        artifact.mesh.rotation.y += 0.08;
        artifact.mesh.rotation.x += 0.03;
        
        // Pulsing effect on the main body and edges
        const pulse = 0.3 + 0.4 * Math.sin(Date.now() * 0.008 + artifact.pulseOffset);
        artifact.mainBody.material.emissiveIntensity = pulse;
        artifact.mainBody.material.opacity = 0.7 + 0.2 * pulse;
        artifact.edges.material.opacity = 0.6 + 0.3 * pulse;
        
        const playerPosition = this.playerShip.position.clone();
        playerPosition.y = artifact.mesh.position.y;
        const distance = artifact.mesh.position.distanceTo(playerPosition);
        
        if(distance < 6){
            this.applyArtifactEffect(artifact.type);
            this.scene.remove(artifact.mesh);
            return false;
        }
        
        if(artifact.life <= 0){
            this.scene.remove(artifact.mesh);
            return false;
        }
        
        return true;
    });
}
        updateMines(){
    this.mines = this.mines.filter(mine => {
        mine.life--;
        mine.pulseTime += mine.pulseSpeed;
        
        // Enhanced pulsing effect
        const pulse = 0.3 + 0.7 * Math.sin(mine.pulseTime);
        mine.mesh.material.emissiveIntensity = pulse;
        mine.mesh.material.opacity = 0.7 + 0.3 * pulse;
        
        // Subtle scale pulsing
        const scalePulse = 1.0 + 0.1 * Math.sin(mine.pulseTime * 0.7);
        mine.mesh.scale.setScalar(scalePulse);
        
        if(mine.life <= 0 && !mine.exploded){
            this.scene.remove(mine.mesh);
            return false;
        }
        
        if(!mine.exploded){
            const nearbyEnemies = this.enemies.filter(enemy => 
                enemy.health > 0 && 
                mine.mesh.position.distanceTo(enemy.mesh.position) < 8
            );
            if(nearbyEnemies.length > 0){
                mine.exploded = true;
                this.explodeMine(mine);
                this.scene.remove(mine.mesh);
                return false;
            }
        }
        
        return !mine.exploded;
    });
}
        updateCollisions() {
          if (this.collisionCooldown > 0) {
            this.collisionCooldown--;
            return
          }
          if (this.landingState !== 'none') return;
          this.enemies.forEach(enemy => {
    if (enemy.health > 0 && !enemy.isAlly && 
        enemy.mesh.position.distanceTo(this.playerShip.position) < 4) {
        this.player.health -= 5;
        this.collisionCooldown = 60;
        this.audioManager.playCollision(enemy.mesh.position,this.playerShip.position);
        this.updateHUD();
        if (this.player.health <= 0) {
            this.gameOver();
        }
    }
});
        }
        updateBackground() {
          if (this.backgroundManager) {
            this.backgroundManager.update(this.playerShip.position.x, this.playerShip.position.z)
          }
        }
        updateMinimap() {
          if (this.minimapManager) {
            this.minimapManager.update(this.playerShip.position, this.planets, this.enemies)
          }
        }
        updateCoordinates() {
          document.getElementById('posX').textContent = Math.round(this.playerShip.position.x);
          document.getElementById('posZ').textContent = Math.round(this.playerShip.position.z)
        }
        updateEffects() {
          const currentTime = Date.now();
          let effectsText = '';
          if (this.player.effects.speed.active) {
            if (currentTime > this.player.effects.speed.endTime) {
              this.player.effects.speed.active = !1
            } else {
              const remaining = Math.ceil((this.player.effects.speed.endTime - currentTime) / 1000);
              effectsText += `VELOCIDAD: ${remaining}s
                                                                                                                  
              <br>`
            }
          }
          if (this.player.effects.damage.active) {
            if (currentTime > this.player.effects.damage.endTime) {
              this.player.effects.damage.active = !1
            } else {
              const remaining = Math.ceil((this.player.effects.damage.endTime - currentTime) / 1000);
              effectsText += `DAÑO EXTRA: ${remaining}s
                                                                                                                    
                <br>`
            }
          }
          document.getElementById('effects').innerHTML = effectsText
        }
        updateExplosions() {
          this.explosions = this.explosions.filter(explosion => {
            explosion.scale += 0.1;
            explosion.mesh.scale.setScalar(explosion.scale);
            explosion.mesh.material.opacity = Math.max(0, 0.8 - explosion.scale * 0.4);
            if (explosion.scale >= 2) {
              this.scene.remove(explosion.mesh);
              return !1
            }
            return !0
          })
        }
        checkPlanetCollision(newPosition, isPlayer = !1) {
          if (isPlayer && this.landingState === 'taking_off' && this.landingTarget) {
            for (let planet of this.planets) {
              if (planet.destroyed || planet === this.landingTarget) continue;
              const distance = newPosition.distanceTo(planet.center);
              const collisionDistance = planet.config.radius + 3;
              if (distance < collisionDistance) {
                return !0
              }
            }
            return !1
          }
          if (!this.collisionEnabled && isPlayer) {
            return !1
          }
          for (let planet of this.planets) {
            if (planet.destroyed) continue;
            if (isPlayer && this.landingTarget && planet === this.landingTarget) {
              continue
            }
            const distance = newPosition.distanceTo(planet.center);
            const collisionDistance = planet.config.radius + (isPlayer ? 3 : 2);
            if (distance < collisionDistance) {
              if (isPlayer) {
                const bounceDirection = new THREE.Vector3().subVectors(newPosition, planet.center).normalize();
                this.playerVelocity.copy(bounceDirection.multiplyScalar(0.5));
                this.player.health -= 10;
                this.createDamageEffect(this.playerShip.position);
                this.audioManager.playSprite('collision', planet.center, this.playerShip.position, 0.8);
setTimeout(() => {
    this.audioManager.playSprite('damage', this.playerShip.position, this.playerShip.position, 0.6);
}, 50); // Slight delay for impact feel
                this.updateHUD();
                if (this.player.health <= 0) {
                  this.gameOver()
                }
              }
              return !0
            }
          }
          return !1
        }
        checkCameraCollision(cameraPosition) {
          for (let planet of this.planets) {
            if (planet.destroyed) continue;
            const distance = cameraPosition.distanceTo(planet.center);
            const collisionDistance = planet.config.radius + 15;
            if (distance < collisionDistance) {
              return !0
            }
          }
          return !1
        }
        adjustCameraForCollision() {
          let bestPosition = null;
          let maxDistance = 0;
          const baseDistance = 60;
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            const offsetX = Math.sin(angle) * baseDistance;
            const offsetZ = Math.cos(angle) * baseDistance;
            const testPosition = new THREE.Vector3(this.playerShip.position.x + offsetX, 60, this.playerShip.position.z + offsetZ);
            if (!this.checkCameraCollision(testPosition)) {
              const distanceFromIdeal = testPosition.distanceTo(new THREE.Vector3(this.playerShip.position.x, 60, this.playerShip.position.z + baseDistance));
              if (!bestPosition || distanceFromIdeal < maxDistance) {
                bestPosition = testPosition;
                maxDistance = distanceFromIdeal
              }
            }
          }
          if (bestPosition) {
            this.camera.position.copy(bestPosition)
          } else {
            this.camera.position.set(this.playerShip.position.x, 80, this.playerShip.position.z)
          }
        }
        createArtifact(position, type) {
    const config = CONFIG.audio[type];
    
    // Single optimized geometry - rounded rectangular cassette
    const artifactGeom = new THREE.BoxGeometry(2.0, 0.6, 1.2);
    const artifactMat = new THREE.MeshBasicMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9
    });
    const artifact = new THREE.Mesh(artifactGeom, artifactMat);
    
    // Clean border lines for definition
    const edgesGeom = new THREE.EdgesGeometry(artifactGeom);
    const edgesMat = new THREE.LineBasicMaterial({
        color: config.color,
        opacity: 0.8,
        transparent: true
    });
    const edges = new THREE.LineSegments(edgesGeom, edgesMat);
    
    // Group them together
    const artifactGroup = new THREE.Group();
    artifactGroup.add(artifact);
    artifactGroup.add(edges);
    
    // Position and rotate
    artifactGroup.position.copy(position);
    artifactGroup.position.y = 1;
    artifactGroup.rotation.y = Math.random() * Math.PI * 2;
    artifactGroup.rotation.x = (Math.random() - 0.5) * 0.2;
    
    const artifactObj = {
        mesh: artifactGroup,
        type: type,
        life: 500,
        bobOffset: Math.random() * Math.PI * 2,
        pulseOffset: Math.random() * Math.PI * 2,
        sparkles: [],
        mainBody: artifact,
        edges: edges
    };
    
    this.artifacts.push(artifactObj);
    this.scene.add(artifactGroup);
    return artifactObj;
}

        dropArtifact(position) {
          const artifactTypes = ['speed', 'damage', 'health'];
          const randomType = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];
          this.createArtifact(position, randomType)
        }
        applyArtifactEffect(type) {
          const artifactConfig = CONFIG.audio[type];
          const currentTime = Date.now();
          if (type === 'health') {
            this.player.health = Math.min(CONFIG.player.health, this.player.health + artifactConfig.amount)
          } else {
            this.player.effects[type].active = !0;
            this.player.effects[type].endTime = currentTime + artifactConfig.duration
          }
          this.audioManager.playWeaponSwitch();
          this.updateHUD()
        }
        createExplosion(position, size = 5) {
          const explosionGeom = new THREE.SphereGeometry(size, 16, 16);
          const explosionMat = new THREE.MeshBasicMaterial({
            color: 0xff4757,
            transparent: !0,
            opacity: 0.8
          });
          const explosion = new THREE.Mesh(explosionGeom, explosionMat);
          explosion.position.copy(position);
          this.scene.add(explosion);
          this.explosions.push({
            mesh: explosion,
            scale: 0
          })
        }
        createDamageEffect(position) {
          const damageGeom = new THREE.SphereGeometry(3, 32, 32);
          const damageMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: !0,
            opacity: 0.6
          });
          const damage = new THREE.Mesh(damageGeom, damageMat);
          damage.position.copy(position);
          this.scene.add(damage);
          this.explosions.push({
            mesh: damage,
            scale: 0
          })
        }
        destroyPlanet(planet) {
    planet.destroyed = true;
    this.createExplosion(planet.center, planet.config.radius);
    this.audioManager.playExplosion(2, planet.center, this.playerShip.position); // Updated call
    this.scene.remove(planet.mesh);
    this.player.score += 500;
    this.updateHUD();
    
    this.enemies = this.enemies.filter(enemy => {
        if (enemy.planet === planet) {
            this.scene.remove(enemy.mesh);
            return false;
        }
        return true;
    });
}
        explodeMine(mine) {
    const explosionGeom = new THREE.SphereGeometry(8, 16, 16);
    const explosionMat = new THREE.MeshBasicMaterial({ color: 0xff4757, transparent: true, opacity: 0.6 });
    const explosion = new THREE.Mesh(explosionGeom, explosionMat);
    explosion.position.copy(mine.mesh.position);
    this.scene.add(explosion);
    this.explosions.push({ mesh: explosion, scale: 0 });
    
    this.audioManager.playExplosion(1.5, mine.mesh.position, this.playerShip.position); // Updated call
    
    this.enemies.forEach(enemy => {
        if (enemy.health > 0 && explosion.position.distanceTo(enemy.mesh.position) < 8) {
            enemy.health -= 50;
            //this.audioManager.playEnemyHit();
            if (enemy.health <= 0) {
                this.createExplosion(enemy.mesh.position);
                //this.audioManager.playExplosion(1, enemy.mesh.position, this.playerShip.position); // Updated call
                enemy.mesh.visible = false;
                enemy.stuck = true;
                this.player.score += enemy.score;
                this.dropArtifact(enemy.mesh.position);
                this.updateHUD();
            }
        }
    });
}
        updateHUD() {
          document.getElementById('health').textContent = this.player.health;
          document.getElementById('score').textContent = this.player.score
        }
        gameOver() {
          this.gameStarted = !1;
          this.audioManager.stopLaser();
          setTimeout(() => {
            this.showGameOverScreen()
          }, 500)
        }
        showGameOverScreen() {
          const intro = document.getElementById('intro');
          const introContent = intro.innerHTML;
          intro.innerHTML = `
        
                                                                                                                                  
                  <h1>Game Over</h1>
                  <div style="font-size: 2rem; color: #feca57; margin: 20px 0; text-shadow: 0 0 15px rgba(254,202,87,0.8);">
            Puntuación Final: ${this.player.score}
        </div>
                  <p>Tu misión terminó. La galaxia recuerda tu coraje.</p>
                  <button id="playAgainBtn">Juega de Nuevo</button>
                  <button id="backToMenuBtn">Menu Principal</button>
    `;
          intro.classList.remove('hidden');
          document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.resetGame();
            intro.innerHTML = introContent;
            intro.classList.add('hidden');
            this.gameStarted = !0
          });
          document.getElementById('backToMenuBtn').addEventListener('click', () => {
            intro.innerHTML = introContent;
            this.resetGame()
          })
        }
        createHealingBeam(ally, target) {
    const healGeom = new THREE.BufferGeometry().setFromPoints([
        ally.mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0)),
        target.position.clone().add(new THREE.Vector3(0, 0.5, 0))
    ]);
    const healMat = new THREE.LineBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.8
    });
    const healBeam = new THREE.Line(healGeom, healMat);
    this.scene.add(healBeam);
    
    // Remove beam after short time
    setTimeout(() => {
        this.scene.remove(healBeam);
    }, 200);
}
        resetGame(){
    this.player.health=CONFIG.player.health;
    this.player.score=0;
    this.player.currentWeapon=1;
    this.player.effects.speed.active=!1;
    this.player.effects.damage.active=!1;
    this.switchWeapon(1);
    this.playerShip.position.set(50,5,50);
    this.playerVelocity.set(0,0,0);
    this.collisionCooldown=0;
    this.visitedPlanets.clear();
    this.landingState='none';
    this.landingTarget=null;
    this.removeLandingGlow();
    this.restorePlayerDepth();
    this.minimapManager.waypoint=null;
    this.removeWaypointIndicator();
    this.waypointReachedCooldown=0;
    this.initialWaypointSet=!1; // Resetear bandera de waypoint inicial para permitir nuevo seteo
    
    // Clean up allies
    this.allies.forEach(ally=>this.scene.remove(ally.mesh));
    this.allies=[];
    
    // Reset enemies
    this.enemies.forEach(enemy=>{
        const enemyConfig=EnemyFactory.types[enemy.type];
        enemy.health=enemyConfig.health;
        enemy.attacking=!1;
        enemy.retreating=!1;
        enemy.shootCooldown=0;
        enemy.stuck=!1;
        enemy.mesh.visible=!0;
        enemy.angle=enemy.originalAngle;
        this.updateEnemyPosition(enemy);
    });
    
    // Reset planets
    this.planets.forEach(planet=>{
        if(planet.destroyed){
            planet.destroyed=!1;
            planet.health=planet.maxHealth;
            this.scene.add(planet.mesh);
        }else{
            planet.health=planet.maxHealth;
        }
    });
    
    if(this.empBursts){
    this.empBursts.forEach(emp => this.scene.remove(emp.mesh));
    this.empBursts = [];
}
if(this.homingMissiles){
    this.homingMissiles.forEach(missile => this.scene.remove(missile.mesh));
    this.homingMissiles = [];
}
if(this.tractorBeam){
    this.scene.remove(this.tractorBeam);
    this.tractorBeam = null;
}

// Reset enemy EMP states
this.enemies.forEach(enemy => {
    if(enemy.empDisabled){
        enemy.empDisabled = false;
        enemy.speed = enemy.originalSpeed || CONFIG.enemy.baseSpeed;
        enemy.chaseSpeed = enemy.originalChaseSpeed || CONFIG.enemy.chaseSpeed;
        enemy.mesh.traverse(child => {
            if(child.isMesh){
                child.material.emissive = new THREE.Color(0x000000);
                child.material.emissiveIntensity = 0;
            }
        });
    }
});
    // Clean up game objects
    this.trails.forEach(trail=>this.scene.remove(trail.mesh));
    this.trails=[];
    this.collisionEnabled=!0;
    this.bullets.forEach(bullet=>this.scene.remove(bullet.mesh));
    this.bullets=[];
    this.enemyBullets.forEach(bullet=>this.scene.remove(bullet.mesh));
    this.enemyBullets=[];
    this.artifacts.forEach(artifact=>this.scene.remove(artifact.mesh));
    this.artifacts=[];
    this.mines.forEach(mine=>this.scene.remove(mine.mesh));
    this.mines=[];
    this.explosions.forEach(explosion=>this.scene.remove(explosion.mesh));
    this.explosions=[];
    
    if(this.laserBeam){
        this.scene.remove(this.laserBeam);
        this.laserBeam=null;
    }
    
    // Clean up UI
    const dialogueSystem=document.getElementById('dialogueSystem');
    if(dialogueSystem){
        dialogueSystem.classList.add('hidden');
    }
    
    const landingPrompts=document.getElementById('landingPrompts');
    if(landingPrompts){
        landingPrompts.innerHTML='';
    }
    // Recrear nave si cambió
if(this.playerShip && this.playerShip.userData.shipType !== this.selectedShipType){
    this.scene.remove(this.playerShip);
    this.createPlayer();
}
    this.updateHUD();
}
        setupEventListeners() {
          document.addEventListener('keydown', (e) => {
            this.keys[e.code] = !0;
            if (e.code === 'KeyE') {
              this.startLanding()
            }
            if (e.code === 'KeyF') {
    this.spawnAlly();
}
            if (e.code.startsWith('Digit')) {
              const weaponNumber = parseInt(e.code.charAt(5));
              this.switchWeapon(weaponNumber)
            }
          });
          document.addEventListener('keyup', (e) => {
            this.keys[e.code] = !1
          });
          document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame()
          });
          this.setupMobileControls();
          window.addEventListener('resize', () => {
            const aspectRatio = window.innerWidth / window.innerHeight;
            const distance = 60;
            this.camera.left = -distance * aspectRatio;
            this.camera.right = distance * aspectRatio;
            this.camera.top = distance;
            this.camera.bottom = -distance;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight)
          })
        }
        setupMobileControls(){
    const dpad=document.getElementById('dpad');
    const dpadInner=document.getElementById('dpadInner');
    const fireBtn=document.getElementById('fireBtn');
    const weaponBtn=document.getElementById('weaponBtn');
    let dpadPressed=!1;
    
    const updateDpad=(clientX,clientY)=>{
        const rect=dpad.getBoundingClientRect();
        const centerX=rect.left+rect.width/2;
        const centerY=rect.top+rect.height/2;
        const deltaX=clientX-centerX;
        const deltaY=clientY-centerY;
        const distance=Math.sqrt(deltaX*deltaX+deltaY*deltaY);
        const maxDistance=40;
        
        if(distance<=maxDistance){
            dpadInner.style.transform=`translate(${deltaX}px, ${deltaY}px)`;
            this.touchControls.moveX=deltaX/maxDistance;
            this.touchControls.moveY=deltaY/maxDistance;
        }else{
            const angle=Math.atan2(deltaY,deltaX);
            const limitedX=Math.cos(angle)*maxDistance;
            const limitedY=Math.sin(angle)*maxDistance;
            dpadInner.style.transform=`translate(${limitedX}px, ${limitedY}px)`;
            this.touchControls.moveX=limitedX/maxDistance;
            this.touchControls.moveY=limitedY/maxDistance;
        }
    };
    
    const resetDpad=()=>{
        dpadInner.style.transform='translate(0px, 0px)';
        this.touchControls.moveX=0;
        this.touchControls.moveY=0;
        dpadPressed=!1;
    };
    
    // D-pad events - prevent propagation to minimap
    dpad.addEventListener('touchstart',(e)=>{
        e.preventDefault();
        e.stopPropagation(); // Evita que se propague al minimapa
        dpadPressed=!0;
        const touch=e.touches[0];
        updateDpad(touch.clientX,touch.clientY);
    });
    
    dpad.addEventListener('touchmove',(e)=>{
        e.preventDefault();
        e.stopPropagation(); // Evita que se propague al minimapa
        if(dpadPressed){
            const touch=e.touches[0];
            updateDpad(touch.clientX,touch.clientY);
        }
    });
    
    dpad.addEventListener('touchend',(e)=>{
        e.preventDefault();
        e.stopPropagation(); // Evita que se propague al minimapa
        resetDpad();
    });
    
    // Fire button events - prevent propagation to minimap
    fireBtn.addEventListener('touchstart',(e)=>{
        e.preventDefault();
        e.stopPropagation(); // Evita que se propague al minimapa
        this.touchControls.firing=!0;
    });
    
    fireBtn.addEventListener('touchend',(e)=>{
        e.preventDefault();
        e.stopPropagation(); // Evita que se propague al minimapa
        this.touchControls.firing=!1;
    });
    
    // Weapon button events - prevent propagation to minimap
    weaponBtn.addEventListener('touchstart',(e)=>{
        e.preventDefault();
        e.stopPropagation(); // Evita que se propague al minimapa
        this.cycleWeapon();
    });
}
        async startGame(){
    document.getElementById('intro').classList.add('hidden');
    this.showShipSelector(); // Mostrar selector en lugar de empezar directamente
}
showShipSelector(){
    const selector = document.createElement('div');
    selector.id = 'shipSelector';
    selector.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(45deg, #0a0a0a, #1a1a2e);
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; z-index: 1000;
    `;
    
    const title = document.createElement('h2');
    title.textContent = 'SELECT YOUR SHIP';
    title.style.cssText = `
        color: #00f2fe; font-family: 'Courier New', monospace;
        font-size: clamp(24px, 4vw, 48px); margin-bottom: 40px;
        text-shadow: 0 0 20px rgba(0,242,254,0.8);
    `;
    
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 20px; max-width: 90vw; width: 800px;
    `;
    
    const ships = ['player', 'fighter', 'interceptor', 'heavy', 'scout', 'purplediamond', 'doradito'];
    
    ships.forEach(shipType => {
        const shipCard = document.createElement('div');
        shipCard.style.cssText = `
            aspect-ratio: 1; background: rgba(0,242,254,0.1);
            border: 2px solid rgba(0,242,254,0.3); border-radius: 15px;
            cursor: pointer; position: relative; overflow: hidden;
            transition: all 0.3s ease;
        `;
        
        shipCard.addEventListener('mouseenter', () => {
            shipCard.style.borderColor = '#00f2fe';
            shipCard.style.transform = 'scale(1.05)';
            shipCard.style.boxShadow = '0 0 30px rgba(0,242,254,0.6)';
        });
        
        shipCard.addEventListener('mouseleave', () => {
            shipCard.style.borderColor = 'rgba(0,242,254,0.3)';
            shipCard.style.transform = 'scale(1)';
            shipCard.style.boxShadow = 'none';
        });
        
        shipCard.addEventListener('click', () => this.selectShip(shipType));
        
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 200;
        canvas.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
        
        this.renderShipPreview(canvas, shipType);
        shipCard.appendChild(canvas);
        grid.appendChild(shipCard);
    });
    
    selector.appendChild(title);
    selector.appendChild(grid);
    document.body.appendChild(selector);
}
renderShipPreview(canvas, shipType){
    const ctx = canvas.getContext('2d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0);
    
    const ship = ShipFactory.create(shipType);
    ship.rotation.y = Math.PI * 0.25;
    ship.rotation.x = -Math.PI * 0.1;
    scene.add(ship);
    
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    
    camera.position.set(8, 4, 8);
    camera.lookAt(0, 0, 0);
    
    const animate = () => {
        ship.rotation.y += 0.02;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
}
async selectShip(shipType){
    this.selectedShipType = shipType;
     if(!this.playerShip) {
        this.createPlayer();
    }
    // Remover selector
    const selector = document.getElementById('shipSelector');
    if(selector) selector.remove();
    
    // Continuar con el inicio del juego
    await this.audioManager.start();
    this.audioManager.playPowerUp();
    this.gameStarted = true;
    
    if(!this.initialWaypointSet){
        const asteriaPlanet = this.findPlanetByName('Asteria Prime');
        if(asteriaPlanet){
            this.minimapManager.waypoint = {
                x: asteriaPlanet.center.x, 
                z: asteriaPlanet.center.z, 
                planet: asteriaPlanet, 
                type: 'planet'
            };
            this.initialWaypointSet = true;
            setTimeout(() => {
                this.showNavigationNotification('Asteria Prime');
            }, 500);
        }
    }
}
        animate() {
          requestAnimationFrame(() => this.animate());
          this.update();
          this.renderer.render(this.scene, this.camera)
        }
      }
      const game = new SpaceShooter();