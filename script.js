'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    const transmitBtn = document.querySelector('.transmit-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');

    // Theme Switching
    const savedTheme = localStorage.getItem('theme-color');
    if (savedTheme) {
        document.documentElement.style.setProperty('--theme-color', savedTheme);
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            document.documentElement.style.setProperty('--theme-color', color);
            localStorage.setItem('theme-color', color);
        });
    });

    // Project Card Interaction
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remove active from others
            projectCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });

        card.addEventListener('click', () => {
            const link = card.querySelector('a');
            if (link) window.open(link.href, '_blank');
        });
    });

    // Transmit Signal Simulation
    if (transmitBtn) {
        transmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = transmitBtn.textContent;
            transmitBtn.textContent = 'TRANSMITTING...';
            transmitBtn.style.opacity = '0.5';
            transmitBtn.disabled = true;

            setTimeout(() => {
                transmitBtn.textContent = 'SIGNAL_DELIVERED';
                transmitBtn.style.backgroundColor = '#00FF00';
                transmitBtn.style.opacity = '1';
                
                setTimeout(() => {
                    transmitBtn.textContent = originalText;
                    transmitBtn.style.backgroundColor = '#FF0000';
                    transmitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // HUD Uptime Incrementer
    const uptimeEl = document.querySelector('.hud-status');
    if (uptimeEl) {
        let uptime = 99.999;
        setInterval(() => {
            uptime += 0.0001;
            uptimeEl.innerHTML = `SYSTEM_UPTIME: ${uptime.toFixed(3)}% // PACKETS_TRANSMITTED: 1.4M+`;
        }, 10000);
    }
});
