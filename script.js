document.addEventListener('DOMContentLoaded', () => {
    initThree();
    fetchDashboardData();
    renderMarkdown();
    initAnimations();
});

function initThree() {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(20), THREE.MathUtils.randFloatSpread(20), THREE.MathUtils.randFloatSpread(20));
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.02 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    function animate() {
        requestAnimationFrame(animate);
        points.rotation.x += 0.0005;
        points.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

async function fetchDashboardData() {
    try {
        const response = await fetch('data.json');
        const config = await response.json();
        const ctx = document.getElementById('mainChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: config.labels,
                datasets: [{
                    label: 'Efficiency',
                    data: config.performanceData,
                    borderColor: '#22d3ee',
                    backgroundColor: 'rgba(34, 211, 238, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    } catch (e) { console.error('Data load error', e); }
}

async function renderMarkdown() {
    try {
        const response = await fetch('notes.md');
        const text = await response.text();
        document.getElementById('markdown-content').innerHTML = marked.parse(text);
    } catch (e) { console.error('MD load error', e); }
}

function initAnimations() {
    const tl = gsap.timeline();
    tl.to('#hero h1', { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' })
      .to('#hero p', { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.6')
      .to('.glass-card', { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'elastic.out(1, 0.8)' }, '-=0.4');
}