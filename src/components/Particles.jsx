import { useEffect } from 'react';
import './Particles.css';

const Particles = () => {
    useEffect(() => {
        const particleContainer = document.getElementById('particle-container');
        if (!particleContainer) return;

        // Create floating particles
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            // Random properties
            const size = Math.random() * 6 + 2;
            const startX = Math.random() * 100;
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.3 + 0.1;
            
            // Random particle type
            const types = ['heart', 'star', 'circle', 'sparkle'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${startX}%`;
            particle.style.opacity = opacity;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            particle.setAttribute('data-type', type);
            
            // Set particle content based on type
            switch(type) {
                case 'heart':
                    particle.innerHTML = '❤️';
                    particle.style.fontSize = `${size}px`;
                    break;
                case 'star':
                    particle.innerHTML = '✨';
                    particle.style.fontSize = `${size}px`;
                    break;
                case 'sparkle':
                    particle.innerHTML = '💫';
                    particle.style.fontSize = `${size}px`;
                    break;
                case 'circle':
                    particle.style.background = `radial-gradient(circle, rgba(0, 243, 255, ${opacity * 2}), transparent)`;
                    particle.style.borderRadius = '50%';
                    break;
            }
            
            particleContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, (duration + delay) * 1000);
        };

        // Create initial particles
        for (let i = 0; i < 30; i++) {
            setTimeout(() => createParticle(), i * 300);
        }

        // Continuously create new particles
        const interval = setInterval(() => {
            createParticle();
        }, 2000);

        return () => {
            clearInterval(interval);
            particleContainer.innerHTML = '';
        };
    }, []);

    return (
        <>
            <div id="particle-container" className="particle-container"></div>
            <div className="aurora-effect"></div>
        </>
    );
};

export default Particles;
