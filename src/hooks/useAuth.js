import { useState, useEffect } from 'react';
import { database, ref, onValue, set, off } from '../services/firebase';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [roomStatus, setRoomStatus] = useState(null); // 'new', 'waiting', 'ready'

    useEffect(() => {
        // Check localStorage for existing session
        const storedUser = localStorage.getItem('ldr_user');
        const storedRoom = localStorage.getItem('ldr_room');
        
        if (storedUser && storedRoom) {
            setUser(storedUser);
            setRoom(storedRoom);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (username, roomCode) => {
        try {
            setError(null);
            
            // Validate inputs
            if (!username || !roomCode) {
                throw new Error('Username and room code are required');
            }

            // Check room status
            const roomRef = ref(database, `/rooms/${roomCode}/users`);
            
            return new Promise((resolve, reject) => {
                onValue(roomRef, (snapshot) => {
                    const users = snapshot.val() || {};
                    const userList = Object.keys(users).filter(u => users[u].active);
                    
                    // Check if room is full (excluding current user)
                    const otherUsers = userList.filter(u => u !== username);
                    if (otherUsers.length >= 2) {
                        setError('Room is full (max 2 users)');
                        reject(new Error('Room is full'));
                        off(roomRef);
                        return;
                    }

                    // Add user to room
                    set(ref(database, `/rooms/${roomCode}/users/${username}`), {
                        joinedAt: Date.now(),
                        active: true
                    });

                    // Determine room status
                    if (userList.length === 0) {
                        // Brand new room - first user
                        setRoomStatus('new');
                    } else if (otherUsers.length === 0 && userList.includes(username)) {
                        // Only current user (rejoining)
                        setRoomStatus('waiting');
                    } else {
                        // Partner is present or joined
                        setRoomStatus('ready');
                    }

                    // Save to localStorage
                    localStorage.setItem('ldr_user', username);
                    localStorage.setItem('ldr_room', roomCode);
                    
                    setUser(username);
                    setRoom(roomCode);
                    
                    off(roomRef);
                    resolve({ status: userList.length === 0 ? 'new' : otherUsers.length > 0 ? 'ready' : 'waiting' });
                }, { onlyOnce: true });
            });
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const checkRoomStatus = (roomCode, username) => {
        return new Promise((resolve) => {
            const roomRef = ref(database, `/rooms/${roomCode}/users`);
            const unsubscribe = onValue(roomRef, (snapshot) => {
                const users = snapshot.val() || {};
                const userList = Object.keys(users).filter(u => users[u].active);
                const otherUsers = userList.filter(u => u !== username);
                
                if (otherUsers.length > 0) {
                    resolve('ready');
                } else if (userList.includes(username)) {
                    resolve('waiting');
                } else {
                    resolve('new');
                }
            });
        });
    };

    const logout = () => {
        if (user && room) {
            // Mark user as inactive
            set(ref(database, `/rooms/${room}/users/${user}/active`), false);
        }
        
        localStorage.removeItem('ldr_user');
        localStorage.removeItem('ldr_room');
        setUser(null);
        setRoom(null);
        setIsAuthenticated(false);
        setRoomStatus(null);
    };

    return { user, room, isAuthenticated, error, roomStatus, login, checkRoomStatus, logout };
};
