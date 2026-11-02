/**
 * PRANAV GHOSH - 3D WEBGL MOTION GRAPHICS & SCROLL DEPTH ENGINE
 * Architectural Palette: Warm Beige, Obsidian Charcoal, Pure White & Subtle Amber Gold (#D89823)
 * Full 3D Spatial Trajectory, Multi-Plane Parallax, Interactive Holographic Lighting & Sculptures
 */

(function () {
  'use strict';

  class MotionScene3D {
    constructor() {
      this.canvas = document.getElementById('webgl-canvas');
      if (!this.canvas) return;

      this.scene = null;
      this.camera = null;
      this.renderer = null;

      // 3D Objects & Meshes
      this.sculptureGroup = null;
      this.morphMesh = null;
      this.wireMesh = null;
      this.coreOrb = null;
      this.glowSprite = null;
      this.ringsGroup = null;
      this.ring1 = null;
      this.ring2 = null;
      this.ring3 = null;
      this.floatingCrystalsGroup = null;
      this.particleSystem = null;
      this.particlePositions = null;
      this.particleBasePositions = null;
      this.particleVelocities = null;

      // Morphing Vertex Data
      this.vertexCount = 0;
      this.currentPositions = null;
      this.shapePositions = [];
      this.activeShapeIndex = 0;
      this.targetShapeIndex = 0;
      this.morphProgress = 1.0;
      this.morphSpeed = 1.6;

      // Motion & State
      this.clock = new THREE.Clock();
      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.scroll = {
        current: 0,
        target: 0,
        max: 1000,
        progress: 0,
        velocity: 0,
        lastScroll: 0
      };
      this.currentSection = 'dashboard';

      // Shockwave state
      this.shockwave = {
        active: false,
        time: 0,
        origin: new THREE.Vector3(0, 0, 0),
        maxRadius: 12,
        speed: 18
      };

      // Configurable Parameters
      this.params = {
        rotationSpeed: 0.85,
        particleSpeed: 0.75,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      };

      // Camera Presets per Page View (Position & LookAt)
      this.pagePresets = {
        dashboard: {
          pos: new THREE.Vector3(0, 0.4, 7.8),
          lookAt: new THREE.Vector3(0, 0, 0),
          shape: 0,
          coreScale: 0.7
        },
        journey: {
          pos: new THREE.Vector3(-2.4, 0.9, 6.4),
          lookAt: new THREE.Vector3(-0.4, 0.1, 0),
          shape: 1,
          coreScale: 0.85
        },
        experience: {
          pos: new THREE.Vector3(2.8, -0.6, 6.6),
          lookAt: new THREE.Vector3(0.5, -0.1, 0),
          shape: 2,
          coreScale: 0.75
        },
        products: {
          pos: new THREE.Vector3(-2.6, -1.0, 6.2),
          lookAt: new THREE.Vector3(-0.5, -0.2, 0),
          shape: 3,
          coreScale: 0.9
        },
        projects: {
          pos: new THREE.Vector3(2.5, 1.1, 6.8),
          lookAt: new THREE.Vector3(0.4, 0.2, 0),
          shape: 4,
          coreScale: 0.8
        },
        skills: {
          pos: new THREE.Vector3(0.0, -1.8, 7.2),
          lookAt: new THREE.Vector3(0.0, -0.2, 0),
          shape: 5,
          coreScale: 0.82
        },
        education: {
          pos: new THREE.Vector3(-1.8, 1.5, 6.5),
          lookAt: new THREE.Vector3(-0.3, 0.3, 0),
          shape: 6,
          coreScale: 0.78
        }
      };

      // Camera dynamic lerp vectors
      this.cameraCurrentPos = new THREE.Vector3(0, 0.4, 7.8);
      this.cameraTargetPos = new THREE.Vector3(0, 0.4, 7.8);
      this.cameraCurrentLook = new THREE.Vector3(0, 0, 0);
      this.cameraTargetLook = new THREE.Vector3(0, 0, 0);

      this.init();
    }

    init() {
      // 1. Scene Setup (Transparent WebGL Context)
      this.scene = new THREE.Scene();

      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      this.camera.position.copy(this.cameraCurrentPos);

      // 2. High-Performance Renderer with Alpha Channel
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;

      // 3. Dynamic Studio Lighting
      this.setupLighting();

      // 4. Central Sculpture Group
      this.sculptureGroup = new THREE.Group();
      this.scene.add(this.sculptureGroup);

      // 5. Build Procedural Morphing Shapes (7 Architectural Forms)
      this.buildMorphingShapes();

      // 6. Build Glowing Central Orb & Halo Sprite
      this.buildGlowAura();

      // 7. Build Gyroscopic Orbital Rings
      this.buildOrbitalRings();

      // 8. Build Floating Decorative Polyhedra
      this.buildFloatingCrystals();

      // 9. Build 3D Multi-Layer Star Swarm
      this.buildParticleSwarm();

      // 10. Bind Event Listeners
      this.bindEvents();

      // 11. Start Render Loop
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    setupLighting() {
      // Soft ambient light
      const ambientLight = new THREE.AmbientLight(0xFFFDF8, 1.8);
      this.scene.add(ambientLight);

      // Warm Amber Gold Key Light
      this.lightYellow = new THREE.PointLight(0xD89823, 3.2, 30);
      this.lightYellow.position.set(4.0, 4.5, 3.5);
      this.scene.add(this.lightYellow);

      // Cool Charcoal Rim Light
      this.lightCharcoal = new THREE.PointLight(0x2E323A, 2.0, 25);
      this.lightCharcoal.position.set(-4.0, -3.5, 2.5);
      this.scene.add(this.lightCharcoal);

      // Pure White Focus Highlight
      this.lightWhite = new THREE.PointLight(0xFFFFFF, 1.9, 22);
      this.lightWhite.position.set(0, 3.0, -2.5);
      this.scene.add(this.lightWhite);
    }

    buildMorphingShapes() {
      const baseRadius = 1.95;
      const detail = 4;
      const baseGeo = new THREE.IcosahedronGeometry(baseRadius, detail);
      const geo = baseGeo.toNonIndexed();
      const posAttr = geo.attributes.position;
      this.vertexCount = posAttr.count;

      this.currentPositions = new Float32Array(this.vertexCount * 3);
      const posArray = posAttr.array;

      for (let i = 0; i < this.vertexCount * 3; i++) {
        this.currentPositions[i] = posArray[i];
      }

      // Helper to generate normalized vertex vector
      const getNormVec = (idx) => {
        return new THREE.Vector3(posArray[idx], posArray[idx + 1], posArray[idx + 2]).normalize();
      };

      // -------------------------------------------------------------
      // Shape 0: Neural Lattice (Dashboard) - Harmonic faceted sphere
      // -------------------------------------------------------------
      const s0 = new Float32Array(this.vertexCount * 3);
      for (let i = 0; i < this.vertexCount; i++) {
        const idx = i * 3;
        const v = getNormVec(idx);
        const r = baseRadius * (1 + 0.09 * Math.sin(v.x * 6) * Math.cos(v.y * 6) * Math.sin(v.z * 6));
        s0[idx] = v.x * r;
        s0[idx + 1] = v.y * r;
        s0[idx + 2] = v.z * r;
      }
      this.shapePositions.push(s0);

      // -------------------------------------------------------------
      // Shape 1: Chrono Ribbon Knot (Journey) - Flowing helix knot
      // -------------------------------------------------------------
      const s1 = new Float32Array(this.vertexCount * 3);
      const p1 = 2, q1 = 3, R1 = 1.65, r1 = 0.65;
      for (let i = 0; i < this.vertexCount; i++) {
        const idx = i * 3;
        const u = (i / this.vertexCount) * Math.PI * 2 * p1;
        const v = ((i % 120) / 120) * Math.PI * 2;
        const rCenter = R1 + r1 * Math.cos(q1 * u);
        s1[idx] = rCenter * Math.cos(u) * 0.95;
        s1[idx + 1] = rCenter * Math.sin(u) * 0.95;
        s1[idx + 2] = (-r1 * Math.sin(q1 * u) + 0.35 * Math.sin(v)) * 0.95;
      }
      this.shapePositions.push(s1);

      // -------------------------------------------------------------
      // Shape 2: Enterprise Dual-Prism (Experience) - Geometric quartz block
      // -------------------------------------------------------------
      const s2 = new Float32Array(this.vertexCount * 3);
      for (let i = 0; i < this.vertexCount; i++) {
        const idx = i * 3;
        const v = getNormVec(idx);
        const prism = Math.max(Math.abs(v.x), Math.abs(v.y) * 0.8, Math.abs(v.z));
        const r = 2.05 / Math.max(prism, 0.6);
        s2[idx] = v.x * r * 0.88;
        s2[idx + 1] = v.y * r * 1.05;
        s2[idx + 2] = v.z * r * 0.88;
      }
      this.shapePositions.push(s2);

      // -------------------------------------------------------------
      // Shape 3: Quantum Torus (Products) - Cyber toroid with energy ribs
      // -------------------------------------------------------------
      const s3 = new Float32Array(this.vertexCount * 3);
      const p3 = 3, q3 = 5, R3 = 1.7, r3 = 0.58;
      for (let i = 0; i < this.vertexCount; i++) {
        const idx = i * 3;
        const u = (i / this.vertexCount) * Math.PI * 2 * p3;
        const v = ((i % 140) / 140) * Math.PI * 2;
        const rCenter = R3 + r3 * Math.cos(q3 * u);
        s3[idx] = rCenter * Math.cos(u) * 0.92;
        s3[idx + 1] = rCenter * Math.sin(u) * 0.92;
        s3[idx + 2] = (-r3 * Math.sin(q3 * u) + 0.28 * Math.cos(v)) * 0.92;
      }
      this.shapePositions.push(s3);

      // -------------------------------------------------------------
      // Shape 4: Cyber Octahedron (Projects) - Faceted stepped crystal
      // -------------------------------------------------------------
      const s4 = new Float32Array(this.vertexCount * 3);
      for (let i = 0; i < this.vertexCount; i++) {
        const idx = i * 3;
        const v = getNormVec(idx);
        const manhattan = Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
        const scale = 2.2 / Math.max(manhattan, 0.72);
        s4[idx] = v.x * scale;
        s4[idx + 1] = v.y * scale;
        s4[idx + 2] = v.z * scale;
      }
      this.shapePositions.push(s4);

      // -------------------------------------------------------------
      // Shape 5: Gyroscopic Core (Skills) - Dual ringed sphere
      // -------------------------------------------------------------
      const s5 = new Float32Array(this.vertexCount * 3);
      for (let i = 0; i < this.vertexCount; i++) {
        const idx = i * 3;
        const v = getNormVec(idx);
        const theta = Math.atan2(v.y, v.x);
        const phi = Math.acos(v.z);
        const r = 1.9 + 0.35 * Math.sin(4 * theta) * Math.cos(3 * phi);
        s5[idx] = v.x * r;
        s5[idx + 1] = v.y * r;
        s5[idx + 2] = v.z * r;
      }
      this.shapePositions.push(s5);

      // -------------------------------------------------------------
      // Shape 6: Ascension Monolith (Education) - Tapered crystal tower
      // -------------------------------------------------------------
      const s6 = new Float32Array(this.vertexCount * 3);
      for (let i = 0; i < this.vertexCount; i++) {
        const idx = i * 3;
        const v = getNormVec(idx);
        const taper = 1.0 - v.y * 0.25;
        const r = baseRadius * 1.05 * taper;
        s6[idx] = v.x * r;
        s6[idx + 1] = v.y * (r * 1.3);
        s6[idx + 2] = v.z * r;
      }
      this.shapePositions.push(s6);

      // Dynamic BufferGeometry for smooth morphing
      this.morphGeo = new THREE.BufferGeometry();
      this.morphGeo.setAttribute('position', new THREE.BufferAttribute(this.currentPositions, 3));
      this.morphGeo.computeVertexNormals();

      // Semi-Translucent Frosted Glass Material
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        emissive: 0xD89823,
        emissiveIntensity: 0.08,
        metalness: 0.12,
        roughness: 0.18,
        transmission: 0.88,
        opacity: 0.82,
        transparent: true,
        side: THREE.DoubleSide
      });
      this.morphMesh = new THREE.Mesh(this.morphGeo, glassMaterial);
      this.sculptureGroup.add(this.morphMesh);

      // Dark Obsidian Wireframe Overlay with Crisp Facets
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x181A1E,
        wireframe: true,
        transparent: true,
        opacity: 0.22
      });
      this.wireMesh = new THREE.Mesh(this.morphGeo, wireMaterial);
      this.wireMesh.scale.set(1.002, 1.002, 1.002);
      this.sculptureGroup.add(this.wireMesh);
    }

    buildGlowAura() {
      // Golden Central Orb
      const coreGeo = new THREE.SphereGeometry(0.68, 32, 32);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xD89823,
        transparent: true,
        opacity: 0.72
      });
      this.coreOrb = new THREE.Mesh(coreGeo, coreMat);
      this.sculptureGroup.add(this.coreOrb);

      // Radial Bloom Sprite
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(216, 152, 35, 0.48)');
      grad.addColorStop(0.35, 'rgba(237, 176, 49, 0.18)');
      grad.addColorStop(0.75, 'rgba(245, 242, 235, 0.04)');
      grad.addColorStop(1, 'rgba(245, 242, 235, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);

      const haloTexture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: haloTexture,
        transparent: true,
        opacity: 0.65
      });
      this.glowSprite = new THREE.Sprite(spriteMat);
      this.glowSprite.scale.set(7.4, 7.4, 1);
      this.sculptureGroup.add(this.glowSprite);
    }

    buildOrbitalRings() {
      this.ringsGroup = new THREE.Group();

      // Ring 1: Obsidian Charcoal Gyro Orbit
      const ringGeo1 = new THREE.TorusGeometry(3.3, 0.022, 16, 120);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0x181A1E,
        transparent: true,
        opacity: 0.32
      });
      this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      this.ring1.rotation.x = Math.PI / 3;
      this.ring1.rotation.y = Math.PI / 6;
      this.ringsGroup.add(this.ring1);

      // Ring 2: Subtle Golden Amber Orbit
      const ringGeo2 = new THREE.TorusGeometry(3.7, 0.018, 16, 120);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0xD89823,
        transparent: true,
        opacity: 0.48
      });
      this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      this.ring2.rotation.x = -Math.PI / 4;
      this.ring2.rotation.z = Math.PI / 5;
      this.ringsGroup.add(this.ring2);

      // Ring 3: Fine Outer Horizon Ring
      const ringGeo3 = new THREE.TorusGeometry(4.2, 0.012, 16, 120);
      const ringMat3 = new THREE.MeshBasicMaterial({
        color: 0x8A8374,
        transparent: true,
        opacity: 0.22
      });
      this.ring3 = new THREE.Mesh(ringGeo3, ringMat3);
      this.ring3.rotation.y = Math.PI / 2.5;
      this.ringsGroup.add(this.ring3);

      this.sculptureGroup.add(this.ringsGroup);
    }

    buildFloatingCrystals() {
      this.floatingCrystalsGroup = new THREE.Group();

      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        emissive: 0xD89823,
        emissiveIntensity: 0.04,
        roughness: 0.25,
        transmission: 0.85,
        opacity: 0.65,
        transparent: true
      });

      const crystalCoords = [
        { x: -4.8, y: 2.2, z: -2.0, scale: 0.45 },
        { x: 5.2, y: -2.6, z: -1.5, scale: 0.55 },
        { x: -3.5, y: -3.8, z: 1.2, scale: 0.38 },
        { x: 4.2, y: 3.4, z: -3.0, scale: 0.5 },
        { x: -1.5, y: -4.5, z: -2.5, scale: 0.42 }
      ];

      this.crystals = [];
      crystalCoords.forEach((coord, i) => {
        const geo = i % 2 === 0 ? new THREE.OctahedronGeometry(1, 0) : new THREE.DodecahedronGeometry(0.85, 0);
        const mesh = new THREE.Mesh(geo, crystalMat);
        mesh.position.set(coord.x, coord.y, coord.z);
        mesh.scale.setScalar(coord.scale);
        mesh.userData = {
          baseX: coord.x,
          baseY: coord.y,
          baseZ: coord.z,
          speed: 0.6 + i * 0.15,
          rotX: 0.005 + i * 0.002,
          rotY: 0.007 + i * 0.003
        };
        this.floatingCrystalsGroup.add(mesh);
        this.crystals.push(mesh);
      });

      this.scene.add(this.floatingCrystalsGroup);
    }

    buildParticleSwarm() {
      const particleCount = 2800;
      const geometry = new THREE.BufferGeometry();
      this.particlePositions = new Float32Array(particleCount * 3);
      this.particleBasePositions = new Float32Array(particleCount * 3);
      this.particleVelocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorBlack = new THREE.Color(0x181A1E);
      const colorYellow = new THREE.Color(0xD89823);
      const colorSand = new THREE.Color(0xD5CEBE);
      const colorWhite = new THREE.Color(0xFFFFFF);

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const radius = 2.2 + Math.random() * 14.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        this.particlePositions[idx] = x;
        this.particlePositions[idx + 1] = y;
        this.particlePositions[idx + 2] = z;

        this.particleBasePositions[idx] = x;
        this.particleBasePositions[idx + 1] = y;
        this.particleBasePositions[idx + 2] = z;

        this.particleVelocities[idx] = 0;
        this.particleVelocities[idx + 1] = 0;
        this.particleVelocities[idx + 2] = 0;

        const rChoice = Math.random();
        let c;
        if (rChoice < 0.38) c = colorBlack;
        else if (rChoice < 0.65) c = colorYellow;
        else if (rChoice < 0.85) c = colorSand;
        else c = colorWhite;

        colors[idx] = c.r;
        colors[idx + 1] = c.g;
        colors[idx + 2] = c.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Circular particle texture
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 32;
      pCanvas.height = 32;
      const pCtx = pCanvas.getContext('2d');
      const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      pGrad.addColorStop(0.4, 'rgba(216, 152, 35, 0.7)');
      pGrad.addColorStop(1, 'rgba(216, 152, 35, 0)');
      pCtx.fillStyle = pGrad;
      pCtx.beginPath();
      pCtx.arc(16, 16, 16, 0, Math.PI * 2);
      pCtx.fill();

      const pTexture = new THREE.CanvasTexture(pCanvas);
      const material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        map: pTexture,
        transparent: true,
        opacity: 0.62,
        depthWrite: false
      });

      this.particleSystem = new THREE.Points(geometry, material);
      this.scene.add(this.particleSystem);
    }

    bindEvents() {
      // Window Resize Handler
      window.addEventListener('resize', () => {
        if (!this.renderer || !this.camera) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      // Mouse Move Tracking
      window.addEventListener('mousemove', (e) => {
        this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
      });

      // Accessibility: prefers-reduced-motion
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      motionQuery.addEventListener('change', (e) => {
        this.params.reducedMotion = e.matches;
      });
    }

    // -------------------------------------------------------------
    // INTERACTIVE PUBLIC API: SCROLL, SHAPE MORPH & SHOCKWAVE
    // -------------------------------------------------------------

    /**
     * Called by main.js scroll driver on every scroll tick.
     * @param {number} scrollY - Current scroll offset in pixels
     * @param {number} maxScroll - Maximum scrollable height
     * @param {number} velocity - Current instantaneous scroll velocity
     */
    onScroll(scrollY, maxScroll, velocity = 0) {
      this.scroll.target = scrollY;
      this.scroll.max = Math.max(maxScroll, 1);
      this.scroll.progress = Math.min(Math.max(scrollY / this.scroll.max, 0), 1);
      this.scroll.velocity = velocity;
    }

    /**
     * Morph smoothly to target shape index.
     * @param {number} shapeIndex - 0 to 6
     */
    morphToShape(shapeIndex) {
      if (shapeIndex === this.targetShapeIndex && this.morphProgress >= 1.0) return;
      this.activeShapeIndex = this.targetShapeIndex;
      this.targetShapeIndex = shapeIndex % this.shapePositions.length;
      this.morphProgress = 0.0;

      if (this.glowSprite) {
        this.glowSprite.scale.set(8.8, 8.8, 1);
      }
    }

    /**
     * Smoothly transitions the 3D camera & morph when the user switches tabs.
     * @param {string} pageId - 'dashboard' | 'journey' | 'experience' | etc.
     */
    onPageChange(pageId) {
      const preset = this.pagePresets[pageId] || this.pagePresets.dashboard;
      this.currentSection = pageId;

      this.cameraTargetPos.copy(preset.pos);
      this.cameraTargetLook.copy(preset.lookAt);

      if (typeof preset.shape === 'number') {
        this.morphToShape(preset.shape);
      }

      if (this.coreOrb && preset.coreScale) {
        const s = preset.coreScale;
        this.coreOrb.scale.set(s, s, s);
      }
    }

    /**
     * Emits a dynamic 3D shockwave ripple from click coordinates.
     * @param {number} clientX - Screen X position
     * @param {number} clientY - Screen Y position
     */
    triggerShockwave(clientX, clientY) {
      if (this.params.reducedMotion) return;

      const normX = (clientX / window.innerWidth - 0.5) * 8;
      const normY = -(clientY / window.innerHeight - 0.5) * 5;

      this.shockwave.active = true;
      this.shockwave.time = 0;
      this.shockwave.origin.set(normX, normY, 2.0);

      if (this.glowSprite) {
        this.glowSprite.scale.set(9.5, 9.5, 1);
      }
      if (this.lightYellow) {
        this.lightYellow.intensity = 5.2;
      }
    }

    // -------------------------------------------------------------
    // MAIN ANIMATION RENDER LOOP
    // -------------------------------------------------------------
    animate() {
      requestAnimationFrame(this.animate);

      const delta = Math.min(this.clock.getDelta(), 0.1);
      const elapsedTime = this.clock.getElapsedTime();

      // 1. Mouse Lerping (Smooth Spring Tracking)
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

      // 2. Scroll Progress & Velocity Lerp
      this.scroll.current += (this.scroll.target - this.scroll.current) * 0.08;
      const scrollNorm = this.scroll.max > 0 ? this.scroll.current / this.scroll.max : 0;
      const scrollV = this.scroll.velocity;

      // 3. Cinematic 3D Camera Trajectory with Scroll Depth
      const preset = this.pagePresets[this.currentSection] || this.pagePresets.dashboard;

      // Calculate 3D Depth Offsets based on scroll progress
      // Mid-scroll swoops into the scene (Z plunges from 7.8 toward 4.8), then recovers
      const depthDolly = Math.sin(scrollNorm * Math.PI) * 2.4;
      const swayX = Math.sin(scrollNorm * Math.PI * 1.5) * 1.8;
      const elevationY = (0.5 - scrollNorm) * 2.8;

      const targetPos = preset.pos.clone();
      targetPos.x += swayX + this.mouse.x * 0.85;
      targetPos.y += elevationY + this.mouse.y * 0.45;
      targetPos.z -= depthDolly;

      // Dynamic Field-of-View reaction to scroll velocity (Dolly-Zoom sensation)
      const targetFov = 45 + Math.min(Math.abs(scrollV) * 0.06, 5);
      this.camera.fov += (targetFov - this.camera.fov) * 0.08;
      this.camera.updateProjectionMatrix();

      // Smooth Camera Lerp
      const lerpSpeed = 0.052;
      this.cameraCurrentPos.lerp(targetPos, lerpSpeed);
      this.cameraCurrentLook.lerp(preset.lookAt, lerpSpeed);

      this.camera.position.copy(this.cameraCurrentPos);
      this.camera.lookAt(this.cameraCurrentLook);

      // Subtle roll bank on horizontal mouse / scroll velocity
      this.camera.rotation.z = (this.mouse.x * 0.035) + (scrollV * 0.00015);

      // 4. Dynamic Shape Morphing
      if (this.morphGeo && this.shapePositions.length > 0) {
        if (this.morphProgress < 1.0) {
          this.morphProgress += delta * this.morphSpeed;
          if (this.morphProgress > 1.0) this.morphProgress = 1.0;
        }

        // Smooth cubic ease
        const t = this.morphProgress * this.morphProgress * (3 - 2 * this.morphProgress);
        const srcShape = this.shapePositions[this.activeShapeIndex];
        const tgtShape = this.shapePositions[this.targetShapeIndex];

        const posAttr = this.morphGeo.attributes.position;
        const positions = posAttr.array;

        const noiseAmp = 0.032 * (this.params.reducedMotion ? 0.2 : 1.0);
        const waveFreq = elapsedTime * 1.4;

        for (let i = 0; i < this.vertexCount; i++) {
          const idx = i * 3;
          const sx = srcShape[idx];
          const sy = srcShape[idx + 1];
          const sz = srcShape[idx + 2];

          const tx = tgtShape[idx];
          const ty = tgtShape[idx + 1];
          const tz = tgtShape[idx + 2];

          const mx = sx + (tx - sx) * t;
          const my = sy + (ty - sy) * t;
          const mz = sz + (tz - sz) * t;

          const ripple = Math.sin(waveFreq + (mx + my) * 2.2) * noiseAmp;
          positions[idx] = mx * (1 + ripple);
          positions[idx + 1] = my * (1 + ripple);
          positions[idx + 2] = mz * (1 + ripple);
        }

        posAttr.needsUpdate = true;
        this.morphGeo.computeVertexNormals();
      }

      // 5. Continuous Sculpture Rotation & Kinetic Momentum
      const rotSpeed = (this.params.reducedMotion ? 0.15 : 1.0) * this.params.rotationSpeed * delta;
      const scrollRotBoost = Math.abs(scrollV) * 0.001;

      if (this.sculptureGroup) {
        this.sculptureGroup.rotation.y += rotSpeed * 0.35 + scrollRotBoost;
        this.sculptureGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.12 + this.mouse.y * 0.15;
        this.sculptureGroup.rotation.z = this.mouse.x * 0.1;
      }

      // 6. Gyroscopic Rings Multi-Axis Rotation
      if (this.ring1 && this.ring2 && this.ring3) {
        this.ring1.rotation.z += rotSpeed * 0.52;
        this.ring2.rotation.y -= rotSpeed * 0.44;
        this.ring3.rotation.x += rotSpeed * 0.28;
      }

      // 7. Floating Crystals Ambient Orbit
      if (this.crystals && this.crystals.length > 0) {
        this.crystals.forEach((mesh) => {
          const d = mesh.userData;
          mesh.rotation.x += d.rotX;
          mesh.rotation.y += d.rotY;
          mesh.position.y = d.baseY + Math.sin(elapsedTime * d.speed) * 0.4;
          mesh.position.x = d.baseX + Math.cos(elapsedTime * d.speed * 0.8) * 0.25;
        });
      }

      // 8. Particle Swarm Simulation & Shockwave Propagation
      if (this.particleSystem && this.particlePositions) {
        const pRot = (this.params.reducedMotion ? 0.05 : 1.0) * this.params.particleSpeed * delta;
        this.particleSystem.rotation.y += pRot * 0.05;
        this.particleSystem.rotation.x += pRot * 0.02;

        const posAttr = this.particleSystem.geometry.attributes.position;
        const positions = posAttr.array;
        const base = this.particleBasePositions;

        // Shockwave update
        let swActive = this.shockwave.active;
        let swRadius = 0;
        if (swActive) {
          this.shockwave.time += delta;
          swRadius = this.shockwave.time * this.shockwave.speed;
          if (swRadius > this.shockwave.maxRadius) {
            this.shockwave.active = false;
            swActive = false;
          }
        }

        const count = positions.length / 3;
        for (let i = 0; i < count; i += 3) { // Staggered update for high performance
          const idx = i * 3;
          let bx = base[idx];
          let by = base[idx + 1];
          let bz = base[idx + 2];

          // Gentle ambient float
          const fTime = elapsedTime * 0.6 + i;
          let px = bx + Math.sin(fTime) * 0.18;
          let py = by + Math.cos(fTime * 0.8) * 0.18;
          let pz = bz;

          // Shockwave displacement
          if (swActive) {
            const dx = px - this.shockwave.origin.x;
            const dy = py - this.shockwave.origin.y;
            const dz = pz - this.shockwave.origin.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            const diff = Math.abs(dist - swRadius);
            if (diff < 1.4) {
              const push = (1.4 - diff) * 0.6;
              px += (dx / dist) * push;
              py += (dy / dist) * push;
              pz += (dz / dist) * push;
            }
          }

          positions[idx] = px;
          positions[idx + 1] = py;
          positions[idx + 2] = pz;
        }

        posAttr.needsUpdate = true;
      }

      // 9. Core Orb & Sprite Pulsing
      if (this.coreOrb) {
        const pulse = 0.68 + 0.08 * Math.sin(elapsedTime * 2.8);
        this.coreOrb.scale.set(pulse, pulse, pulse);
      }
      if (this.glowSprite) {
        const spriteScale = 7.4 + 0.5 * Math.sin(elapsedTime * 2.2);
        this.glowSprite.scale.set(spriteScale, spriteScale, 1);
      }

      // 10. Orbiting Lights Dynamics
      if (this.lightYellow) {
        const lTime = elapsedTime * 0.65;
        this.lightYellow.position.x = Math.sin(lTime) * 4.5;
        this.lightYellow.position.z = Math.cos(lTime) * 4.5;
        if (this.lightYellow.intensity > 3.2) {
          this.lightYellow.intensity -= delta * 2.5;
        }
      }

      // 11. Render Scene
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Instantiate globally when DOM is ready
  window.motionScene = new MotionScene3D();

})();
