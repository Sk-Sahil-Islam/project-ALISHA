import { useState, useEffect } from 'react';
import { database, ref, set } from '../services/firebase';

const FieldReport = ({ user, room }) => {
    const [statusText, setStatusText] = useState('');
    const [statusInfo, setStatusInfo] = useState('Draft saved locally.');

    useEffect(() => {
        // Restore draft from localStorage
        const draft = localStorage.getItem(`ldr_status_draft_${user}`);
        if (draft) setStatusText(draft);
    }, [user]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setStatusText(value);
        localStorage.setItem(`ldr_status_draft_${user}`, value);
        setStatusInfo('Draft saved locally.');
    };

    const handleBroadcast = () => {
        set(ref(database, `/rooms/${room}/interactions/status/${user}`), statusText || '');
        setStatusInfo('Broadcasted.');
    };

    return (
        <div className="box">
            <h2>FIELD REPORT // MY STATUS</h2>
            <input
                type="text"
                value={statusText}
                onChange={handleInputChange}
                placeholder="What are you doing right now?"
            />
            <button className="small-btn" onClick={handleBroadcast}>
                Broadcast
            </button>
            <div className="subtext">{statusInfo}</div>
        </div>
    );
};

export default FieldReport;
