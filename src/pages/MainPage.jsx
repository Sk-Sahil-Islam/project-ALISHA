import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { useRoomData } from '../hooks/useRoomData';
import CanvasCursor from '../components/CanvasCursor';

const MainPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('ldr_user');
        const storedRoom = localStorage.getItem('ldr_room');

        if (!storedUser || !storedRoom) {
            navigate('/');
            return;
        }

        setUser(storedUser);
        setRoom(storedRoom);
    }, [navigate]);

    const roomData = useRoomData(room, user);

    const handleLogout = () => {
        localStorage.removeItem('ldr_user');
        localStorage.removeItem('ldr_room');
        navigate('/');
    };

    if (!user || !room) {
        return <div>Loading...</div>;
    }

    return (
        <Dashboard 
            user={user} 
            room={room} 
            roomData={roomData}
            onLogout={handleLogout}
        />
    );
};

export default MainPage;
