/**
 * PRANAV GHOSH - 3D ANIMATED AVATAR ENGINE
 * Stylized executive 3D character with real-time waving, mouse tracking,
 * natural eye blinking, floating idle animations, and glassmorphic speech bubble.
 */

(function () {
  'use strict';

  class PranavAvatar3D {
    constructor() {
      this.container = document.getElementById('avatar-3d-widget');
      this.canvas = document.getElementById('avatar-3d-canvas');
      this.speechBubble = document.getElementById('avatar-speech-bubble');
      this.toggleBtn = document.getElementById('avatar-toggle-btn');
      this.closeBubbleBtn = document.getElementById('avatar-close-bubble');

      if (!this.container || !this.canvas) return;

      this.scene = null;
      this.camera = null;
      this.renderer = null;

      // Rigging Groups
      this.characterGroup = null;
      this.headGroup = null;
      this.bodyGroup = null;
      this.armRightGroup = null;
      this.forearmRight = null;
      this.handRight = null;
      this.armLeftGroup = null;
      this.eyeLeft = null;
      this.eyeRight = null;

      // Mouse & Tracking
      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.clock = new THREE.Clock();

      // State & Animations
      this.isWaving = true;
      this.waveIntensity = 1.0;
      this.lastBlinkTime = 0;
      this.nextBlinkInterval = 3.5;
      this.isBlinking = false;
      this.blinkProgress = 0;
      this.isJumping = false;
      this.jumpProgress = 0;
      this.spinProgress = 0;
      this.isBubbleVisible = true;

      this.init();
    }

    init() {
      // 1. Scene Setup
      this.scene = new THREE.Scene();

      // 2. Camera Setup (Centered on Upper Body & Head)
      const width = this.canvas.clientWidth || 110;
      const height = this.canvas.clientHeight || 110;
      this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
      this.camera.position.set(0, 1.45, 4.4);
      this.camera.lookAt(0, 1.25, 0);

      // 3. Renderer with High-DPI and Alpha Transparency
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;

      // 4. Studio Lighting
      this.setupLights();

      // 5. Build 3D Character
      this.buildCharacter();

      // 6. Bind Events
      this.bindEvents();

      // 7. Start Render Loop
      this.animate();

      // 8. Entrance Animation
      setTimeout(() => {
        this.container.classList.add('visible');
      }, 500);

      // Auto-hide speech bubble after 14s if user doesn't interact, but keep it accessible
      this.bubbleTimeout = setTimeout(() => {
        if (this.speechBubble && this.isBubbleVisible) {
          this.speechBubble.classList.add('bubble-minimized');
        }
      }, 14000);
    }

    setupLights() {
      // Ambient Soft Light
      const ambientLight = new THREE.AmbientLight(0xFFFBF4, 0.95);
      this.scene.add(ambientLight);

      // Main Front-Top Key Light
      const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.25);
      keyLight.position.set(2.5, 4, 3.5);
      this.scene.add(keyLight);

      // Warm Golden Fill Light (Accent)
      const fillLight = new THREE.DirectionalLight(0xF59E0B, 0.55);
      fillLight.position.set(-3, 2, 2.5);
      this.scene.add(fillLight);

      // Crisp Rim/Backlight (Subtle Emerald/Teal Glow)
      const rimLight = new THREE.DirectionalLight(0x34D399, 0.7);
      rimLight.position.set(0, 3, -3);
      this.scene.add(rimLight);
    }

    buildCharacter() {
      this.characterGroup = new THREE.Group();
      this.characterGroup.position.set(0, 0.15, 0);

      // Shared Materials
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xE8BA9B,
        roughness: 0.55,
        metalness: 0.05
      });

      const darkSuitMat = new THREE.MeshStandardMaterial({
        color: 0x14171D,
        roughness: 0.45,
        metalness: 0.1
      });

      const whiteShirtMat = new THREE.MeshStandardMaterial({
        color: 0xFDFBF7,
        roughness: 0.35,
        metalness: 0.05
      });

      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xD89823,
        roughness: 0.3,
        metalness: 0.65
      });

      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x1A1C20,
        roughness: 0.65,
        metalness: 0.15
      });

      const glassFrameMat = new THREE.MeshStandardMaterial({
        color: 0x0E1013,
        roughness: 0.2,
        metalness: 0.8
      });

      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111317 });
      const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

      // ==========================================
      // A. TORSO & SUIT
      // ==========================================
      this.bodyGroup = new THREE.Group();

      // Torso (Executive Blazer)
      const torsoGeo = new THREE.CylinderGeometry(0.55, 0.68, 1.15, 16);
      torsoGeo.scale(1.15, 1, 0.75);
      const torsoMesh = new THREE.Mesh(torsoGeo, darkSuitMat);
      torsoMesh.position.y = 0.55;
      this.bodyGroup.add(torsoMesh);

      // Shirt Collar (V-Neck Insert)
      const shirtGeo = new THREE.CylinderGeometry(0.24, 0.38, 0.55, 12);
      shirtGeo.scale(1, 1, 0.45);
      const shirtMesh = new THREE.Mesh(shirtGeo, whiteShirtMat);
      shirtMesh.position.set(0, 0.82, 0.24);
      this.bodyGroup.add(shirtMesh);

      // Golden Necktie
      const tieGeo = new THREE.ConeGeometry(0.08, 0.45, 6);
      tieGeo.scale(1.2, 1, 0.4);
      const tieMesh = new THREE.Mesh(tieGeo, goldMat);
      tieMesh.position.set(0, 0.72, 0.33);
      tieMesh.rotation.x = Math.PI;
      this.bodyGroup.add(tieMesh);

      // Lapels
      const lapelLeftGeo = new THREE.BoxGeometry(0.12, 0.55, 0.08);
      const lapelLeft = new THREE.Mesh(lapelLeftGeo, darkSuitMat);
      lapelLeft.position.set(-0.16, 0.82, 0.28);
      lapelLeft.rotation.z = -0.25;
      this.bodyGroup.add(lapelLeft);

      const lapelRightGeo = new THREE.BoxGeometry(0.12, 0.55, 0.08);
      const lapelRight = new THREE.Mesh(lapelRightGeo, darkSuitMat);
      lapelRight.position.set(0.16, 0.82, 0.28);
      lapelRight.rotation.z = 0.25;
      this.bodyGroup.add(lapelRight);

      // Golden Pocket Square
      const pocketSquareGeo = new THREE.BoxGeometry(0.14, 0.04, 0.02);
      const pocketSquare = new THREE.Mesh(pocketSquareGeo, goldMat);
      pocketSquare.position.set(-0.35, 0.76, 0.3);
      pocketSquare.rotation.z = 0.12;
      this.bodyGroup.add(pocketSquare);

      // ==========================================
      // B. LEFT ARM (RESTING)
      // ==========================================
      this.armLeftGroup = new THREE.Group();
      this.armLeftGroup.position.set(-0.62, 0.95, 0);

      const armLeftUpperGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.55, 12);
      const armLeftUpper = new THREE.Mesh(armLeftUpperGeo, darkSuitMat);
      armLeftUpper.position.y = -0.25;
      armLeftUpper.rotation.z = 0.18;
      this.armLeftGroup.add(armLeftUpper);

      const handLeftGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const handLeft = new THREE.Mesh(handLeftGeo, skinMat);
      handLeft.position.set(-0.06, -0.58, 0.05);
      this.armLeftGroup.add(handLeft);

      this.bodyGroup.add(this.armLeftGroup);

      // ==========================================
      // C. RIGHT ARM (WAVING GESTURE)
      // ==========================================
      this.armRightGroup = new THREE.Group();
      this.armRightGroup.position.set(0.62, 0.95, 0);

      // Upper arm angled upwards
      const armRightUpperGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.52, 12);
      const armRightUpper = new THREE.Mesh(armRightUpperGeo, darkSuitMat);
      armRightUpper.position.set(0.18, 0.18, 0);
      armRightUpper.rotation.z = -1.25;
      this.armRightGroup.add(armRightUpper);

      // Forearm bent upright
      this.forearmRight = new THREE.Group();
      this.forearmRight.position.set(0.38, 0.35, 0.05);

      const forearmGeo = new THREE.CylinderGeometry(0.12, 0.11, 0.42, 12);
      const forearmMesh = new THREE.Mesh(forearmGeo, darkSuitMat);
      forearmMesh.position.y = 0.2;
      forearmMesh.rotation.z = 0.35;
      this.forearmRight.add(forearmMesh);

      // Hand (Waving Palm)
      this.handRight = new THREE.Group();
      this.handRight.position.set(0.08, 0.45, 0);

      const palmGeo = new THREE.SphereGeometry(0.13, 12, 12);
      palmGeo.scale(1.1, 1.25, 0.65);
      const palmMesh = new THREE.Mesh(palmGeo, skinMat);
      this.handRight.add(palmMesh);

      // Cute Fingers
      for (let i = -1.5; i <= 1.5; i += 1) {
        const fingerGeo = new THREE.CylinderGeometry(0.028, 0.024, 0.14, 8);
        const fingerMesh = new THREE.Mesh(fingerGeo, skinMat);
        fingerMesh.position.set(i * 0.045, 0.13, 0);
        this.handRight.add(fingerMesh);
      }

      // Thumb
      const thumbGeo = new THREE.CylinderGeometry(0.03, 0.025, 0.11, 8);
      const thumbMesh = new THREE.Mesh(thumbGeo, skinMat);
      thumbMesh.position.set(-0.11, 0.03, 0.03);
      thumbMesh.rotation.z = 0.75;
      this.handRight.add(thumbMesh);

      this.forearmRight.add(this.handRight);
      this.armRightGroup.add(this.forearmRight);
      this.bodyGroup.add(this.armRightGroup);

      this.characterGroup.add(this.bodyGroup);

      // ==========================================
      // D. HEAD & FACIAL FEATURES
      // ==========================================
      this.headGroup = new THREE.Group();
      this.headGroup.position.set(0, 1.48, 0);

      // Neck
      const neckGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.25, 12);
      const neckMesh = new THREE.Mesh(neckGeo, skinMat);
      neckMesh.position.y = -0.22;
      this.headGroup.add(neckMesh);

      // Head Base
      const headGeo = new THREE.SphereGeometry(0.56, 20, 20);
      headGeo.scale(1.0, 1.12, 0.96);
      const headMesh = new THREE.Mesh(headGeo, skinMat);
      this.headGroup.add(headMesh);

      // Ears
      const earLeftGeo = new THREE.SphereGeometry(0.12, 10, 10);
      earLeftGeo.scale(0.5, 1.2, 0.8);
      const earLeft = new THREE.Mesh(earLeftGeo, skinMat);
      earLeft.position.set(-0.56, 0.02, -0.05);
      this.headGroup.add(earLeft);

      const earRightGeo = new THREE.SphereGeometry(0.12, 10, 10);
      earRightGeo.scale(0.5, 1.2, 0.8);
      const earRight = new THREE.Mesh(earRightGeo, skinMat);
      earRight.position.set(0.56, 0.02, -0.05);
      this.headGroup.add(earRight);

      // Modern Hairstyle
      const hairBaseGeo = new THREE.SphereGeometry(0.58, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.58);
      hairBaseGeo.scale(1.02, 1.14, 1.02);
      const hairBase = new THREE.Mesh(hairBaseGeo, hairMat);
      hairBase.position.set(0, 0.05, -0.04);
      this.headGroup.add(hairBase);

      // Stylish Front Hair Quiff / Volume
      const quiffGeo = new THREE.CylinderGeometry(0.15, 0.42, 0.65, 12);
      quiffGeo.scale(1.3, 0.6, 0.8);
      const quiff = new THREE.Mesh(quiffGeo, hairMat);
      quiff.position.set(-0.06, 0.6, 0.22);
      quiff.rotation.set(-0.28, 0.1, -0.2);
      this.headGroup.add(quiff);

      // Eyebrows
      const browMat = new THREE.MeshBasicMaterial({ color: 0x1A1C20 });
      const browGeo = new THREE.BoxGeometry(0.16, 0.035, 0.02);

      const browLeft = new THREE.Mesh(browGeo, browMat);
      browLeft.position.set(-0.21, 0.21, 0.52);
      browLeft.rotation.z = 0.08;
      this.headGroup.add(browLeft);

      const browRight = new THREE.Mesh(browGeo, browMat);
      browRight.position.set(0.21, 0.21, 0.52);
      browRight.rotation.z = -0.08;
      this.headGroup.add(browRight);

      // Eyes (Blinking Support)
      this.eyeLeft = new THREE.Group();
      this.eyeLeft.position.set(-0.2, 0.08, 0.5);

      const eyeWhiteLeft = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), eyeWhiteMat);
      this.eyeLeft.add(eyeWhiteLeft);

      const pupilLeft = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), eyeMat);
      pupilLeft.position.set(0, 0, 0.05);
      this.eyeLeft.add(pupilLeft);

      const glintLeft = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), eyeWhiteMat);
      glintLeft.position.set(0.02, 0.02, 0.08);
      this.eyeLeft.add(glintLeft);

      this.headGroup.add(this.eyeLeft);

      this.eyeRight = new THREE.Group();
      this.eyeRight.position.set(0.2, 0.08, 0.5);

      const eyeWhiteRight = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), eyeWhiteMat);
      this.eyeRight.add(eyeWhiteRight);

      const pupilRight = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), eyeMat);
      pupilRight.position.set(0, 0, 0.05);
      this.eyeRight.add(pupilRight);

      const glintRight = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), eyeWhiteMat);
      glintRight.position.set(0.02, 0.02, 0.08);
      this.eyeRight.add(glintRight);

      this.headGroup.add(this.eyeRight);

      // Designer Glasses (Sleek Dark Frames)
      const glassesGroup = new THREE.Group();
      glassesGroup.position.set(0, 0.08, 0.52);

      const frameShapeLeft = new THREE.TorusGeometry(0.125, 0.02, 8, 20);
      const frameLeft = new THREE.Mesh(frameShapeLeft, glassFrameMat);
      frameLeft.position.x = -0.21;
      glassesGroup.add(frameLeft);

      const frameShapeRight = new THREE.TorusGeometry(0.125, 0.02, 8, 20);
      const frameRight = new THREE.Mesh(frameShapeRight, glassFrameMat);
      frameRight.position.x = 0.21;
      glassesGroup.add(frameRight);

      // Glasses Bridge
      const bridgeGeo = new THREE.BoxGeometry(0.14, 0.025, 0.02);
      const bridge = new THREE.Mesh(bridgeGeo, glassFrameMat);
      bridge.position.set(0, 0.02, 0);
      glassesGroup.add(bridge);

      // Glasses Temples
      const templeLeftGeo = new THREE.BoxGeometry(0.02, 0.02, 0.42);
      const templeLeft = new THREE.Mesh(templeLeftGeo, glassFrameMat);
      templeLeft.position.set(-0.34, 0.03, -0.2);
      glassesGroup.add(templeLeft);

      const templeRightGeo = new THREE.BoxGeometry(0.02, 0.02, 0.42);
      const templeRight = new THREE.Mesh(templeRightGeo, glassFrameMat);
      templeRight.position.set(0.34, 0.03, -0.2);
      glassesGroup.add(templeRight);

      this.headGroup.add(glassesGroup);

      // Cute Smile
      const smileGeo = new THREE.TorusGeometry(0.1, 0.022, 8, 16, Math.PI * 0.7);
      const smileMat = new THREE.MeshBasicMaterial({ color: 0x994D38 });
      const smileMesh = new THREE.Mesh(smileGeo, smileMat);
      smileMesh.position.set(0, -0.16, 0.52);
      smileMesh.rotation.z = Math.PI * 1.15;
      this.headGroup.add(smileMesh);

      this.characterGroup.add(this.headGroup);
      this.scene.add(this.characterGroup);
    }

    bindEvents() {
      // Mouse Move Tracking across the Window
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.mouse.targetX = x;
        this.mouse.targetY = y;
      }, { passive: true });

      // Click Avatar to Trigger Bounce & Toggle Speech Bubble
      this.canvas.addEventListener('click', () => {
        this.triggerJoyfulReaction();
      });

      // Toggle Speech Bubble button if present
      this.toggleBtn?.addEventListener('click', () => {
        this.toggleBubble();
      });

      // Close Speech Bubble button
      this.closeBubbleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeBubble();
      });

      // Speech bubble action buttons
      document.querySelectorAll('.avatar-action-chip').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.getAttribute('data-action');
          if (action === 'copilot') {
            document.getElementById('copilot-modal')?.classList.add('open');
          } else if (action === 'connect') {
            document.getElementById('connect-modal')?.classList.add('open');
          } else if (action === 'journey') {
            const journeyBtn = document.getElementById('nav-btn-journey');
            journeyBtn?.click();
          }
        });
      });

      // Window Resize Handler
      window.addEventListener('resize', () => {
        if (!this.canvas || !this.renderer || !this.camera) return;
        const width = this.canvas.clientWidth || 110;
        const height = this.canvas.clientHeight || 110;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      }, { passive: true });
    }

    triggerJoyfulReaction() {
      this.isJumping = true;
      this.jumpProgress = 0;
      this.spinProgress = 0;
      this.waveIntensity = 2.2;
      this.toggleBubble(true);
    }

    toggleBubble(forceOpen = false) {
      if (forceOpen || !this.isBubbleVisible) {
        this.speechBubble?.classList.remove('bubble-minimized');
        this.isBubbleVisible = true;
      } else {
        this.speechBubble?.classList.add('bubble-minimized');
        this.isBubbleVisible = false;
      }
    }

    closeBubble() {
      this.speechBubble?.classList.add('bubble-minimized');
      this.isBubbleVisible = false;
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Smooth Mouse Easing
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      // 1. Idle Sinusoidal Floating Bob
      const idleBob = Math.sin(time * 2.2) * 0.045;
      let jumpY = 0;

      // 2. Click Jump / Bounce Reaction
      if (this.isJumping) {
        this.jumpProgress += delta * 4;
        this.spinProgress += delta * 6;
        jumpY = Math.sin(this.jumpProgress) * 0.25;

        if (this.characterGroup) {
          this.characterGroup.rotation.y = Math.sin(this.spinProgress) * 0.4;
        }

        if (this.jumpProgress >= Math.PI) {
          this.isJumping = false;
          this.jumpProgress = 0;
          this.spinProgress = 0;
          this.waveIntensity = 1.0;
          if (this.characterGroup) {
            this.characterGroup.rotation.y = 0;
          }
        }
      }

      if (this.characterGroup) {
        this.characterGroup.position.y = 0.15 + idleBob + Math.max(0, jumpY);
      }

      // 3. Head Tracking Cursor
      if (this.headGroup && !this.isJumping) {
        const targetRotY = this.mouse.x * 0.45;
        const targetRotX = -this.mouse.y * 0.3;
        this.headGroup.rotation.y += (targetRotY - this.headGroup.rotation.y) * 0.08;
        this.headGroup.rotation.x += (targetRotX - this.headGroup.rotation.x) * 0.08;
        this.headGroup.rotation.z = Math.sin(time * 1.5) * 0.03;
      }

      // 4. Waving Hand Animation (Fluid Sine Wave Gesture)
      if (this.forearmRight && this.handRight) {
        const waveSpeed = 5.5 * this.waveIntensity;
        const waveWave = Math.sin(time * waveSpeed);

        this.forearmRight.rotation.z = 0.35 + waveWave * 0.32;
        this.forearmRight.rotation.y = Math.cos(time * waveSpeed) * 0.18;
        this.handRight.rotation.z = waveWave * 0.4;
      }

      // 5. Breathing Upper Body Motion
      if (this.bodyGroup) {
        this.bodyGroup.scale.x = 1 + Math.sin(time * 1.8) * 0.015;
        this.bodyGroup.scale.z = 1 + Math.sin(time * 1.8) * 0.015;
      }

      // 6. Natural Eye Blinking Logic
      if (!this.isBlinking && time - this.lastBlinkTime > this.nextBlinkInterval) {
        this.isBlinking = true;
        this.blinkProgress = 0;
        this.lastBlinkTime = time;
        this.nextBlinkInterval = 2.8 + Math.random() * 3.5;
      }

      if (this.isBlinking) {
        this.blinkProgress += delta * 12;
        const scaleY = Math.max(0.08, Math.abs(Math.cos(this.blinkProgress)));

        if (this.eyeLeft && this.eyeRight) {
          this.eyeLeft.scale.y = scaleY;
          this.eyeRight.scale.y = scaleY;
        }

        if (this.blinkProgress >= Math.PI) {
          this.isBlinking = false;
          if (this.eyeLeft && this.eyeRight) {
            this.eyeLeft.scale.y = 1;
            this.eyeRight.scale.y = 1;
          }
        }
      }

      // Render Scene
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PranavAvatar3D());
  } else {
    new PranavAvatar3D();
  }
})();
