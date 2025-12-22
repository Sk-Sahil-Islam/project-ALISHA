import { useState, useEffect } from 'react';
import { database, ref, set, onValue, off } from '../services/firebase';
import './Reactor.css';

const Reactor = ({ user, room }) => {
    const [coreText, setCoreText] = useState('TAP TO SEND SIGNAL'); // Changed
    const [myTapCount, setMyTapCount] = useState(0);
    const [partnerTapCount, setPartnerTapCount] = useState(0);
    const [syncMessage, setSyncMessage] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentMood, setCurrentMood] = useState(null);

    const dateKey = () => {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    };

    useEffect(() => {
        if (!room || !user) return;

        // Listen to my mood changes
        const myMoodRef = ref(database, `/rooms/${room}/interactions/mood/${user}`);
        const unsubMyMood = onValue(myMoodRef, (snapshot) => {
            const mood = snapshot.val();
            if (mood) {
                setCurrentMood(mood);
            }
        });

        // Listen to signals FROM PARTNER ONLY
        const signalRef = ref(database, `/rooms/${room}/interactions/signal`);
        const unsubSignal = onValue(signalRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.timestamp && Date.now() - data.timestamp < 2000 && data.sender !== user) {
                createParticles();
                flashScreen();
                setCoreText('SIGNAL RECEIVED'); // Changed
                setTimeout(() => setCoreText('TAP TO SEND SIGNAL'), 1000); // Changed
            }
        });

        // Listen to taps
        const tapsRef = ref(database, `/rooms/${room}/taps`);
        const unsubTaps = onValue(tapsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const todayData = data[dateKey()] || {};
            setMyTapCount(todayData[user] || 0);

            Object.keys(todayData).forEach((username) => {
                if (username !== user) {
                    setPartnerTapCount(todayData[username] || 0);
                }
            });
        });

        // Listen to hugs FROM PARTNER ONLY
        const hugRef = ref(database, `/rooms/${room}/interactions/hug`);
        const unsubHug = onValue(hugRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.timestamp && Date.now() - data.timestamp < 3000 && data.sender !== user) {
                handleHugReceived();
            }
        });

        return () => {
            off(signalRef);
            off(tapsRef);
            off(hugRef);
            off(myMoodRef);
        };
    }, [room, user]);

    const sendSignal = () => {
        // Send signal to partner
        set(ref(database, `/rooms/${room}/interactions/signal`), {
            sender: user,
            timestamp: Date.now()
        });

        const todayKey = dateKey();
        const myCountRef = ref(database, `/rooms/${room}/taps/${todayKey}/${user}`);
        
        // Increment tap count
        onValue(myCountRef, (snapshot) => {
            const current = snapshot.val() || 0;
            set(myCountRef, current + 1);
        }, { onlyOnce: true });

        // Only show "SENT" feedback, no particles for self
        setCoreText('SIGNAL SENT ♥'); // Changed
        setTimeout(() => setCoreText('TAP TO SEND SIGNAL'), 1000); // Changed
    };

    const sendHug = () => {
        // Send hug to partner
        set(ref(database, `/rooms/${room}/interactions/hug`), {
            sender: user,
            timestamp: Date.now()
        });

        setIsAnimating(true);
        setCoreText('HUG SENT 🤗'); // Changed
        
        setTimeout(() => {
            setIsAnimating(false);
            setCoreText('TAP TO SEND SIGNAL'); // Changed
        }, 2000);
    };

    const handleHugReceived = () => {
        setIsAnimating(true);
        createHugParticles();
        flashScreen();
        setCoreText('HUG RECEIVED 🤗'); // Changed
        
        setTimeout(() => {
            setIsAnimating(false);
            setCoreText('TAP TO SEND SIGNAL'); // Changed
        }, 2000);
    };

    const flashScreen = () => {
        document.body.classList.add('pulse-screen');
        setTimeout(() => {
            document.body.classList.remove('pulse-screen');
        }, 600);
    };

    const createParticles = () => {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'heart-particle';
            particle.innerHTML = '❤️';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = '100vh';
            particle.style.fontSize = `${Math.random() * 20 + 10}px`;
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 2000);
        }
    };

    const createHugParticles = () => {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'hug-particle';
            particle.textContent = '🤗';
            
            const angle = (Math.PI * 2 * i) / 12;
            const distance = 100;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.setProperty('--hx', `${dx}px`);
            particle.style.setProperty('--hy', `${dy}px`);
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 2500);
        }
    };

    // Determine reactor color based on mood
    const getReactorStyle = () => {
        switch (currentMood) {
            case '🥰':
                return {
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 75, 163, 0.9), #ff4fa3 40%, #3b0019)',
                    boxShadow: '0 0 40px rgba(255, 75, 163, 0.6), inset 0 0 30px rgba(255, 75, 163, 0.3)',
                    borderColor: 'rgba(255, 75, 163, 0.6)'
                };
            case '😴':
                return {
                    background: 'radial-gradient(circle at 30% 30%, rgba(0, 140, 255, 0.9), #008cff 40%, #001433)',
                    boxShadow: '0 0 40px rgba(0, 140, 255, 0.6), inset 0 0 30px rgba(0, 140, 255, 0.3)',
                    borderColor: 'rgba(0, 140, 255, 0.6)'
                };
            case '😤':
                return {
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 132, 0, 0.9), #ff8400 40%, #3b1b00)',
                    boxShadow: '0 0 40px rgba(255, 132, 0, 0.6), inset 0 0 30px rgba(255, 132, 0, 0.3)',
                    borderColor: 'rgba(255, 132, 0, 0.6)'
                };
            case '🥹':
                return {
                    background: 'radial-gradient(circle at 30% 30%, rgba(106, 92, 255, 0.9), #6a5cff 40%, #1b003b)',
                    boxShadow: '0 0 40px rgba(106, 92, 255, 0.6), inset 0 0 30px rgba(106, 92, 255, 0.3)',
                    borderColor: 'rgba(106, 92, 255, 0.6)'
                };
            case '🤧':
                return {
                    background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 157, 0.9), #00ff9d 40%, #003b20)',
                    boxShadow: '0 0 40px rgba(0, 255, 157, 0.6), inset 0 0 30px rgba(0, 255, 157, 0.3)',
                    borderColor: 'rgba(0, 255, 157, 0.6)'
                };
            default:
                return {
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 0, 85, 0.8), #ff0055 40%, #440011)',
                    boxShadow: '0 0 40px rgba(255, 0, 85, 0.6), inset 0 0 30px rgba(255, 0, 85, 0.3)',
                    borderColor: 'rgba(0, 243, 255, 0.4)'
                };
        }
    };

    const reactorStyle = getReactorStyle();

    // Format text: "TAP TO" on first line, rest on second line
    const formatCoreText = (text) => {
        if (text.startsWith('TAP TO')) {
            return (
                <>
                    TAP TO<br />SEND SIGNAL
                </>
            );
        } else if (text.includes('SIGNAL')) {
            return (
                <>
                    SIGNAL<br />{text.split(' ').slice(1).join(' ')}
                </>
            );
        } else if (text.includes('HUG')) {
            return (
                <>
                    HUG<br />{text.split(' ').slice(1).join(' ')}
                </>
            );
        }
        return text;
    };

    return (
        <div className="center-module">
            <div className="reactor" onClick={sendSignal} style={{ borderColor: reactorStyle.borderColor }}>
                <div className="reactor-core" style={reactorStyle}>
                    {formatCoreText(coreText)}
                </div>
            </div>
            <div className="reactor-footer">QUANTUM UPLINK ACTIVE</div>
            <div style={{ fontSize: '10px', marginTop: '4px' }}>
                Today's taps: <span>{myTapCount}</span> | Partner: <span>{partnerTapCount}</span>
                <br />
                <span style={{ color: 'var(--secondary)' }}>{syncMessage}</span>
            </div>

            <button className={`hug-btn ${isAnimating ? 'hug-animate' : ''}`} onClick={sendHug}>
                <span className="hug-heart">🤗</span>
                <span className="hug-label">Send Hug</span>
                <span className="hug-glow"></span>
            </button>
        </div>
    );
};

export default Reactor;
