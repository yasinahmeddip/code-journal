document.addEventListener('DOMContentLoaded', () => {
    // --- Three.js Background ---
    const initThree = () => {
        const canvas = document.querySelector('#bg-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particlesGeometry = new THREE.BufferGeometry();
        const count = 1000;
        const posArray = new Float32Array(count * 3);

        for(let i = 0; i < count * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const material = new THREE.PointsMaterial({ size: 0.005, color: '#3b82f6', transparent: true, opacity: 0.5 });
        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        camera.position.z = 2;

        function animate() {
            requestAnimationFrame(animate);
            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x += 0.0005;
            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    };

    // --- Navigation Logic ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.view-section');
    const viewTitle = document.getElementById('view-title');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(sec => {
                gsap.to(sec, { duration: 0.2, opacity: 0, y: 10, display: 'none' });
            });

            const activeSec = document.getElementById(target);
            viewTitle.textContent = btn.textContent.trim();

            gsap.fromTo(activeSec, 
                { opacity: 0, y: 10, display: 'none' }, 
                { duration: 0.5, opacity: 1, y: 0, display: 'block', delay: 0.2 }
            );
        });
    });

    // --- Fetch Data & Init Charts ---
    const initDashboard = async () => {
        try {
            const response = await fetch('data.json');
            const data = await response.json();

            document.getElementById('stat-nodes').textContent = data.stats.nodes;
            document.getElementById('stat-uptime').textContent = data.stats.uptime;
            document.getElementById('stat-hash').textContent = data.stats.hashrate;

            const ctx = document.getElementById('mainChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.chart.labels,
                    datasets: [{
                        label: 'Performance',
                        data: data.chart.values,
                        borderColor: '#60a5fa',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#60a5fa'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        } catch (err) {
            console.error('Data load error:', err);
        }
    };

    // --- Fetch Markdown ---
    const initMarkdown = async () => {
        try {
            const response = await fetch('notes.md');
            const text = await response.text();
            document.getElementById('markdown-content').innerHTML = marked.parse(text);
        } catch (err) {
            document.getElementById('markdown-content').innerHTML = "Error loading documentation.";
        }
    };

    // --- Entry Animations ---
    gsap.from('aside', { duration: 1, x: -100, opacity: 0, ease: 'power4.out' });
    gsap.from('header', { duration: 1, y: -50, opacity: 0, ease: 'power4.out', delay: 0.2 });
    
    initThree();
    initDashboard();
    initMarkdown();
});