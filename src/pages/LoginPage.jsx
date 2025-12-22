import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, ref, onValue, set, off } from '../services/firebase';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [waitingMessage, setWaitingMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if already logged in
        const storedUser = localStorage.getItem('ldr_user');
        const storedRoom = localStorage.getItem('ldr_room');
        
        if (storedUser && storedRoom) {
            navigate('/dashboard');
        }
    }, [navigate]);

    useEffect(() => {
        let roomListener;
        
        if (isWaiting && roomCode && username) {
            // Listen for partner joining
            const roomRef = ref(database, `/rooms/${roomCode}/users`);
            roomListener = onValue(roomRef, (snapshot) => {
                const users = snapshot.val() || {};
                const userList = Object.keys(users).filter(u => users[u].active);
                const otherUsers = userList.filter(u => u !== username);
                
                if (otherUsers.length > 0) {
                    // Partner joined!
                    setWaitingMessage('Partner detected! Establishing connection...');
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                }
            });
        }

        return () => {
            if (roomListener) {
                off(ref(database, `/rooms/${roomCode}/users`));
            }
        };
    }, [isWaiting, roomCode, username, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsScanning(true);

        try {
            if (!username.trim() || !roomCode.trim()) {
                throw new Error('Username and room code are required');
            }

            // Check room capacity
            const roomRef = ref(database, `/rooms/${roomCode}/users`);
            
            onValue(roomRef, (snapshot) => {
                const users = snapshot.val() || {};
                const userList = Object.keys(users).filter(u => users[u].active);
                const otherUsers = userList.filter(u => u !== username.trim());
                
                // Check if room is full
                if (otherUsers.length >= 2) {
                    setError('Room is full (max 2 users)');
                    setIsScanning(false);
                    off(roomRef);
                    return;
                }

                // Add user to room
                set(ref(database, `/rooms/${roomCode}/users/${username.trim()}`), {
                    joinedAt: Date.now(),
                    active: true
                });

                // Save to localStorage
                localStorage.setItem('ldr_user', username.trim());
                localStorage.setItem('ldr_room', roomCode.trim());

                // Simulate biometric scan
                setTimeout(() => {
                    setIsScanning(false);
                    
                    if (otherUsers.length === 0) {
                        // Show waiting screen
                        setIsWaiting(true);
                        setWaitingMessage(
                            userList.length === 0 
                                ? 'New room created! Waiting for your partner to join...' 
                                : 'Waiting for your partner to join...'
                        );
                    } else {
                        // Partner is already there, proceed to dashboard
                        navigate('/dashboard');
                    }
                }, 2000);

                off(roomRef);
            }, { onlyOnce: true });

        } catch (err) {
            setIsScanning(false);
            setError(err.message || 'Failed to join room');
        }
    };

    const handleBackToLogin = () => {
        setIsWaiting(false);
        setWaitingMessage('');
        // Mark user as inactive
        if (username && roomCode) {
            set(ref(database, `/rooms/${roomCode}/users/${username}/active`), false);
        }
    };

    if (isWaiting) {
        return (
            <div className="login-page">
                <div className="login-container waiting-container">
                    <div className="waiting-animation">
                        <div className="pulse-rings">
                            <div className="pulse-ring"></div>
                            <div className="pulse-ring"></div>
                            <div className="pulse-ring"></div>
                        </div>
                        <div className="waiting-icon">👥</div>
                    </div>
                    
                    <h2 className="waiting-title glitch" data-text={waitingMessage}>
                        {waitingMessage}
                    </h2>
                    
                    <div className="waiting-details">
                        <div className="detail-item">
                            <span className="label">Room Code:</span>
                            <span className="value">{roomCode}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Your Identity:</span>
                            <span className="value">{username}</span>
                        </div>
                    </div>

                    <div className="waiting-instructions">
                        <p>* Share this room code with your partner</p>
                        <p>* They need to use the same room code to join</p>
                        <p>* You'll be connected automatically once they join</p>
                    </div>

                    <button className="small-btn alt" onClick={handleBackToLogin}>
                        Cancel & Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-container">
                {!isScanning ? (
                    <>
                        <div className="login-header">
                            <h1 className="glitch" data-text="PROJECT ALISHA">PROJECT ALISHA</h1>
                            <p className="subtitle">QUANTUM LINK AUTHENTICATION</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label htmlFor="username">IDENTITY</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    maxLength={20}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="roomCode">ROOM CODE</label>
                                <input
                                    id="roomCode"
                                    type="text"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value)}
                                    placeholder="Enter couple room code"
                                    required
                                    maxLength={30}
                                />
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button type="submit" className="login-btn">
                                <span>ESTABLISH LINK</span>
                                <div className="btn-glow"></div>
                            </button>

                            <div className="login-info">
                                <p>Room capacity: 2 users maximum</p>
                                <p>Both users must use the same room code</p>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="scanning">
                        <div className="scanner-animation">
                            <div className="scan-line"></div>
                        </div>
                        <p className="glitch" data-text="BIOMETRIC AUTHENTICATION">BIOMETRIC AUTHENTICATION</p>
                        <p className="scan-text">Establishing quantum link...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
