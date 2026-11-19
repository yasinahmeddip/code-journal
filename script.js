document.addEventListener('DOMContentLoaded', () => {
  initThree();
  initDashboard();
});

function initThree() {
  const canvas = document.getElementById('hero-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const geometry = new THREE.IcosahedronGeometry(10, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.15 });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  camera.position.z = 25;

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.002;
    sphere.rotation.x += 0.001;
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

async function initDashboard() {
  try {
    const [dataRes, mdRes] = await Promise.all([
      fetch('data.json'),
      fetch('notes.md')
    ]);

    const data = await dataRes.json();
    const mdText = await mdRes.text();

    // Render Chart.js
    const ctx = document.getElementById('mainChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: data.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b' } },
          x: { grid: { display: false }, ticks: { color: '#64748b' } }
        }
      }
    });

    // Render Markdown
    document.getElementById('md-render').innerHTML = marked.parse(mdText);

    // Entrance Animations
    gsap.from('.logo-anim', { rotation: 360, duration: 2, ease: 'elastic.out(1, 0.3)' });
    gsap.from('aside', { x: -80, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('main > div > *', {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power4.out',
      delay: 0.2
    });

  } catch (err) {
    console.error('Data loading error:', err);
  }
}