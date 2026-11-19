document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js Background
    const initThree = () => {
        const canvas = document.querySelector('#bg-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const geometry = new THREE.IcosahedronGeometry(10, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.1 });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        camera.position.z = 20;

        function animate() {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.001;
            sphere.rotation.y += 0.002;
            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    };

    // Handle Tab Navigation
    const initNavigation = () => {
        const buttons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.view-section');
        const title = document.querySelector('#view-title');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                
                buttons.forEach(b => b.classList.remove('active'));
                sections.forEach(s => s.classList.add('hidden'));
                
                btn.classList.add('active');
                document.getElementById(target).classList.remove('hidden');
                title.innerText = btn.innerText;

                gsap.from(`#${target}`, { opacity: 0, y: 20, duration: 0.4 });
            });
        });
    };

    // Fetch and Initialize Charts
    const initCharts = async () => {
        try {
            const response = await fetch('data.json');
            const data = await response.json();

            const ctx = document.getElementById('mainChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.months,
                    datasets: [{
                        label: 'Revenue Trend',
                        data: data.revenue,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { grid: { color: '#1e293b' } }, x: { grid: { display: false } } }
                }
            });

            const pieCtx = document.getElementById('pieChart').getContext('2d');
            new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ['SaaS', 'Services', 'Partners'],
                    datasets: [{
                        data: [55, 25, 20],
                        backgroundColor: ['#6366f1', '#a855f7', '#ec4899']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });

            const barCtx = document.getElementById('barChart').getContext('2d');
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: data.months,
                    datasets: [{
                        label: 'New Customers',
                        data: data.customers,
                        backgroundColor: '#6366f1'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });

        } catch (err) {
            console.error('Failed to load chart data:', err);
        }
    };

    // Fetch and Parse Markdown
    const initMarkdown = async () => {
        try {
            const response = await fetch('notes.md');
            const text = await response.text();
            document.getElementById('markdown-content').innerHTML = marked.parse(text);
        } catch (err) {
            console.error('Failed to load notes:', err);
        }
    };

    // Run
    initThree();
    initNavigation();
    initCharts();
    initMarkdown();

    // Intro GSAP
    gsap.from('aside', { x: -100, opacity: 0, duration: 1, ease: 'power4.out' });
    gsap.from('header', { y: -50, opacity: 0, duration: 1, delay: 0.2, ease: 'power4.out' });
    gsap.from('.stat-card', { opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.8, delay: 0.5 });
});