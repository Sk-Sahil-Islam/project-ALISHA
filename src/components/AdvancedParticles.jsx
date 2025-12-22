import { useEffect } from 'react';
import './Particles.css';

const AdvancedParticles = () => {
    useEffect(() => {
        // Shooting stars
        const createShootingStar = () => {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight * 0.5;
            
            star.style.left = `${startX}px`;
            star.style.top = `${startY}px`;
            
            document.body.appendChild(star);
            
            setTimeout(() => star.remove(), 3000);
        };

        // Create shooting stars occasionally
        const shootingStarInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                createShootingStar();
            }
        }, 5000);

        // Glowing orbs
        const createGlowingOrbs = () => {
            const orbs = [];
            const colors = [
                'rgba(0, 243, 255, 0.1)',
                'rgba(255, 0, 85, 0.1)',
                'rgba(184, 32, 255, 0.1)'
            ];

            for (let i = 0; i < 5; i++) {
                const orb = document.createElement('div');
                orb.className = 'glowing-orb';
                
                const size = Math.random() * 200 + 100;
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const duration = Math.random() * 10 + 15;
                
                orb.style.width = `${size}px`;
                orb.style.height = `${size}px`;
                orb.style.left = `${x}px`;
                orb.style.top = `${y}px`;
                orb.style.background = color;
                orb.style.animationDuration = `${duration}s`;
                orb.style.animationDelay = `${i * 2}s`;
                
                document.body.appendChild(orb);
                orbs.push(orb);
            }

            return orbs;
        };

        const orbs = createGlowingOrbs();

        return () => {
            clearInterval(shootingStarInterval);
            orbs.forEach(orb => orb.remove());
        };
    }, []);

    return null;
};

export default AdvancedParticles;
