import { useState, useEffect } from 'react';
import { database, ref, set, onValue, off } from '../services/firebase';

const DailySnapshot = ({ user, room }) => {
    const [snapshotUrl, setSnapshotUrl] = useState('');
    const [currentSnapshot, setCurrentSnapshot] = useState(null);

    useEffect(() => {
        if (!room) return;

        const snapshotRef = ref(database, `/rooms/${room}/snapshot`);
        const unsubSnapshot = onValue(snapshotRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.url) {
                setCurrentSnapshot(data);
            } else {
                setCurrentSnapshot(null);
            }
        });

        return () => off(snapshotRef);
    }, [room]);

    const handleUpdate = () => {
        if (!snapshotUrl.trim()) return;
        set(ref(database, `/rooms/${room}/snapshot`), {
            url: snapshotUrl,
            author: user,
            time: new Date().toLocaleTimeString()
        });
        setSnapshotUrl('');
    };

    return (
        <div className="box">
            <h2>WINDOW // DAILY SNAPSHOT</h2>
            <input
                type="text"
                value={snapshotUrl}
                onChange={(e) => setSnapshotUrl(e.target.value)}
                placeholder="Paste image URL from your world"
            />
            <button className="small-btn" onClick={handleUpdate}>
                Update snapshot
            </button>
            {currentSnapshot && (
                <img
                    src={currentSnapshot.url}
                    alt="Daily snapshot"
                    className="snapshot-img"
                    style={{ display: 'block' }}
                />
            )}
            <div className="subtext">One shared window, updating in real time.</div>
        </div>
    );
};

export default DailySnapshot;
