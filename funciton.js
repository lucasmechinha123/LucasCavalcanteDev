
    // ===== HAMBURGER =====
    function toggleMenu() {
      const m = document.getElementById('mobileMenu');
      const h = document.getElementById('hamburger');
      m.classList.toggle('open');
      h.classList.toggle('open');
      document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
    }
    function closeMenu() {
      document.getElementById('mobileMenu').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
      document.body.style.overflow = '';
    }

    // ===== CURSOR =====
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animateCursor() {
      if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
      rx += (mx - rx) * .12; ry += (my - ry) * .12;
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a,button,.skill-card,.project-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // ===== SCROLL REVEAL =====
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: .1 });
    reveals.forEach(r => observer.observe(r));

    // ===== ACTIVE NAV =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
      let cur = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
      navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--accent)' : ''; });
    });

    // ===== COMMIT GRID =====
    const grid = document.getElementById('commitGrid');
    if (grid) {
      const levels = ['', 'c1', 'c2', 'c3', 'c4'];
      for (let i = 0; i < 84; i++) {
        const d = document.createElement('div');
        const r = Math.random();
        d.className = 'exp-commit-day ' + (r < .35 ? '' : r < .6 ? levels[1] : r < .8 ? levels[2] : r < .93 ? levels[3] : levels[4]);
        grid.appendChild(d);
      }
    }

    // ===== 3D AI CHARACTER (Three.js via CDN) =====
    (function () {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = initAI;
      document.head.appendChild(script);

      function initAI() {
        const canvas = document.getElementById('ai-canvas');
        if (!canvas) return;
        const W = canvas.parentElement.offsetWidth || 420;
        const H = canvas.parentElement.offsetHeight || 420;
        canvas.width = W; canvas.height = H;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
        camera.position.set(0, 0, 4.5);

        // Lights
        const amb = new THREE.AmbientLight(0x00FFB2, 0.3);
        scene.add(amb);
        const dir = new THREE.DirectionalLight(0x00C8FF, 1.2);
        dir.position.set(2, 3, 2);
        scene.add(dir);
        const pt1 = new THREE.PointLight(0x00FFB2, 2, 8);
        pt1.position.set(-2, 1, 2);
        scene.add(pt1);
        const pt2 = new THREE.PointLight(0xFF3D6E, 1.5, 8);
        pt2.position.set(2, -1, -2);
        scene.add(pt2);

        // ---- BUILD AI CHARACTER ----
        const group = new THREE.Group();
        scene.add(group);

        const matBody = new THREE.MeshPhongMaterial({ color: 0x0C1419, emissive: 0x00FFB2, emissiveIntensity: .06, shininess: 80, transparent: true, opacity: .95 });
        const matGlow = new THREE.MeshPhongMaterial({ color: 0x00FFB2, emissive: 0x00FFB2, emissiveIntensity: .8, shininess: 200 });
        const matBlue = new THREE.MeshPhongMaterial({ color: 0x00C8FF, emissive: 0x00C8FF, emissiveIntensity: .7, shininess: 200 });
        const matPink = new THREE.MeshPhongMaterial({ color: 0xFF3D6E, emissive: 0xFF3D6E, emissiveIntensity: .7, shininess: 200 });
        const matDark = new THREE.MeshPhongMaterial({ color: 0x050A0E, shininess: 120 });
        const matEdge = new THREE.MeshPhongMaterial({ color: 0x1A3040, emissive: 0x00FFB2, emissiveIntensity: .15, shininess: 60 });

        // HEAD
        const headGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1, 2, 2, 2);
        const head = new THREE.Mesh(headGeo, matBody);
        head.position.y = 0.5;
        group.add(head);

        // HEAD EDGE GLOW — wireframe overlay
        const headWire = new THREE.LineSegments(
          new THREE.EdgesGeometry(headGeo),
          new THREE.LineBasicMaterial({ color: 0x00FFB2, transparent: true, opacity: .35 })
        );
        head.add(headWire);

        // VISOR (eye panel)
        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.25, 0.12), new THREE.MeshPhongMaterial({ color: 0x00C8FF, emissive: 0x00C8FF, emissiveIntensity: .5, shininess: 300, transparent: true, opacity: .85 }));
        visor.position.set(0, 0.05, 0.56);
        head.add(visor);

        // EYES — two glowing dots
        const eyeGeo = new THREE.SphereGeometry(0.07, 8, 8);
        const eyeL = new THREE.Mesh(eyeGeo, matGlow);
        const eyeR = new THREE.Mesh(eyeGeo, matGlow);
        eyeL.position.set(-0.2, 0.05, 0.62);
        eyeR.position.set(0.2, 0.05, 0.62);
        head.add(eyeL, eyeR);

        // MOUTH — small bar
        const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.08), matBlue);
        mouth.position.set(0, -0.15, 0.58);
        head.add(mouth);

        // ANTENNA
        const antBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8), matEdge);
        antBase.position.set(0, 0.67, 0);
        head.add(antBase);
        const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), matPink);
        antTip.position.set(0, 0.82, 0);
        head.add(antTip);

        // EAR PANELS
        [-0.62, 0.62].forEach(x => {
          const ear = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.4, 0.5), matEdge);
          ear.position.set(x, 0.05, 0);
          head.add(ear);
          const earDot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), x < 0 ? matGlow : matBlue);
          earDot.position.set(x < 0 ? -0.07 : 0.07, 0.05, 0.1);
          head.add(earDot);
        });

        // NECK
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.22, 12), matEdge);
        neck.position.y = -0.12;
        group.add(neck);

        // BODY / TORSO
        const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 0.7), matBody);
        torso.position.y = -0.82;
        group.add(torso);
        const torsoWire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 1.0, 0.7)), new THREE.LineBasicMaterial({ color: 0x00FFB2, transparent: true, opacity: .2 }));
        torso.add(torsoWire);

        // CHEST PANEL
        const chest = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.08), matEdge);
        chest.position.set(0, 0.1, 0.4);
        torso.add(chest);

        // CHEST CORE — spinning circle
        const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 8, 32), matGlow);
        coreRing.position.set(0, 0.1, 0.44);
        torso.add(coreRing);
        const coreDot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), matBlue);
        coreDot.position.set(0, 0.1, 0.46);
        torso.add(coreDot);

        // ARMS
        [[-0.72, -0.1], [0.72, -0.1]].forEach(([x, y], i) => {
          const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.22), matBody);
          arm.position.set(x, y, -0.82);
          group.add(arm);
          const hand = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), matEdge);
          hand.position.set(x, y - 0.45, -0.82);
          group.add(hand);
          const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), i === 0 ? matGlow : matBlue);
          knuckle.position.set(0, 0, -0.16);
          hand.add(knuckle);
        });

        // FLOATING PARTICLES
        const partGeo = new THREE.BufferGeometry();
        const pCount = 80;
        const pPos = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
          pPos[i * 3] = (Math.random() - 0.5) * 6;
          pPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
          pPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
        partGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const parts = new THREE.Points(partGeo, new THREE.PointsMaterial({ color: 0x00FFB2, size: .045, transparent: true, opacity: .6 }));
        scene.add(parts);

        // ORBIT RING
        const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.012, 8, 64), new THREE.MeshPhongMaterial({ color: 0x00C8FF, emissive: 0x00C8FF, emissiveIntensity: .5, transparent: true, opacity: .4 }));
        orbitRing.rotation.x = Math.PI / 2.5;
        scene.add(orbitRing);

        // ORBIT DOT
        const orbitDot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), matGlow);
        scene.add(orbitDot);

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', e => {
          mouseX = (e.clientX / window.innerWidth - .5) * 2;
          mouseY = (e.clientY / window.innerHeight - .5) * 2;
        });
        // Touch
        document.addEventListener('touchmove', e => {
          mouseX = (e.touches[0].clientX / window.innerWidth - .5) * 2;
          mouseY = (e.touches[0].clientY / window.innerHeight - .5) * 2;
        }, { passive: true });

        // Resize
        window.addEventListener('resize', () => {
          const W2 = canvas.parentElement.offsetWidth || 420;
          const H2 = canvas.parentElement.offsetHeight || 420;
          camera.aspect = W2 / H2;
          camera.updateProjectionMatrix();
          renderer.setSize(W2, H2);
        });

        let t = 0;
        function animate() {
          requestAnimationFrame(animate);
          t += 0.016;

          // Bobbing
          group.position.y = Math.sin(t * 0.8) * 0.12;
          // Head subtle look
          head.rotation.y = mouseX * 0.35 + Math.sin(t * 0.5) * 0.05;
          head.rotation.x = -mouseY * 0.2 + Math.sin(t * 0.7) * 0.03;
          // Body sway
          group.rotation.y += (mouseX * 0.4 - group.rotation.y) * 0.04;
          // Antenna tip pulse
          const p = 0.9 + Math.sin(t * 2) * 0.1;
          antTip.scale.setScalar(p);
          // Core ring spin
          coreRing.rotation.z += 0.04;
          // Orbit dot
          orbitDot.position.x = Math.cos(t * 0.6) * 1.8;
          orbitDot.position.y = Math.sin(t * 0.6) * 0.72;
          orbitDot.position.z = Math.sin(t * 0.6) * 1.44;
          // Particles drift
          const pp = partGeo.attributes.position.array;
          for (let i = 0; i < pCount; i++) {
            pp[i * 3 + 1] += 0.004;
            if (pp[i * 3 + 1] > 3) pp[i * 3 + 1] = -3;
          }
          partGeo.attributes.position.needsUpdate = true;
          // Eye blink
          const blink = Math.sin(t * 0.3) > 0.97 ? 0 : 1;
          eyeL.scale.y = blink; eyeR.scale.y = blink;

          renderer.render(scene, camera);
        }
        animate();
      }

    })()
    const btnTopo = document.getElementById("btnTopo");

    // Mostrar botão ao rolar
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        btnTopo.style.display = "block";
      } else {
        btnTopo.style.display = "none";
      }
    });
const backTop=document.getElementById("backTop");
window.addEventListener("scroll",()=>{
  backTop.classList.toggle("visible", window.scrollY > 400);
});
