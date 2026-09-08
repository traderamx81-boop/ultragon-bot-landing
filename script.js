// Ultragon hero - Three.js scene with subtle interaction
(() => {
  const canvas = document.getElementById('hero-canvas');
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  const fov = 45;
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  // responsive resize
  function resize(){
    const w = window.innerWidth;
    const h = Math.max(window.innerHeight, 520);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambient);
  const p1 = new THREE.PointLight(0x7b61ff, 1.2, 20);
  p1.position.set(5,5,5);
  scene.add(p1);
  const p2 = new THREE.PointLight(0x00eaff, 0.9, 20);
  p2.position.set(-5,-3,5);
  scene.add(p2);

  // Geometry: layered torus knots for a rich look
  const group = new THREE.Group();
  const geometries = [];
  for(let i=0;i<3;i++){
    const g = new THREE.TorusKnotGeometry(1.2 - i*0.18, 0.25 - i*0.04, 200, 32, 2 + i, 3 + i);
    geometries.push(g);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.72 - i*0.06, 0.7, 0.5 + i*0.03),
      metalness: 0.4 - i*0.08,
      roughness: 0.3 + i*0.05,
      emissive: new THREE.Color(0x220022)
    });

    const mesh = new THREE.Mesh(g, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.multiplyScalar(1 - i*0.08);
    group.add(mesh);
  }
  scene.add(group);

  // subtle float animation using GSAP
  gsap.to(group.rotation, {y: Math.PI * 2, duration: 40, ease: 'none', repeat: -1});
  gsap.to(group.position, {y: 0.25, duration: 6, yoyo:true, repeat:-1, ease:'sine.inOut'});

  // parallax on mouse
  const state = {mx:0,my:0};
  window.addEventListener('mousemove', (e)=>{
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    state.mx = nx; state.my = ny;
  }, {passive:true});

  // animate
  function render(t){
    // interpolate toward mouse
    group.rotation.x += (state.my * 0.3 - group.rotation.x) * 0.05;
    group.rotation.y += (state.mx * 0.6 - group.rotation.y) * 0.05;

    // slight continuous spin
    group.children.forEach((m,i)=>{
      m.rotation.x += 0.002 + i*0.001;
      m.rotation.z += 0.0015 + i*0.0007;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // DOM entrance animations
  gsap.from('.hero-content h1', {y:40, opacity:0, duration:0.9, delay:0.3, ease:'power3.out'});
  gsap.from('.tagline', {y:20, opacity:0, duration:0.9, delay:0.45});
  gsap.from('.cta-row .btn', {scale:0.95, opacity:0, duration:0.7, delay:0.6, stagger:0.08});

  // CTA hook: placeholder link
  const inviteLinks = document.querySelectorAll('#invite-cta, #invite-bottom, #invite-btn');
  inviteLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      // replace with your bot invite link
      window.open('https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot%20applications.commands&permissions=8', '_blank');
    });
  });
})();
