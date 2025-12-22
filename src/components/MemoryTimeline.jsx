import { useState, useEffect } from 'react';
import { database, ref, set, onValue, remove, off } from '../services/firebase';

const MemoryTimeline = ({ user, room }) => {
    const [memories, setMemories] = useState({});
    const [newMemory, setNewMemory] = useState('');
    const [memoryDate, setMemoryDate] = useState('');

    useEffect(() => {
        if (!room) return;

        const memoriesRef = ref(database, `/rooms/${room}/memories`);
        const unsubMemories = onValue(memoriesRef, (snapshot) => {
            setMemories(snapshot.val() || {});
        });

        return () => off(memoriesRef);
    }, [room]);

    const handleAddMemory = () => {
        if (!newMemory.trim() || !memoryDate) return;

        const id = Date.now();
        set(ref(database, `/rooms/${room}/memories/${id}`), {
            text: newMemory.trim(),
            date: memoryDate,
            addedBy: user,
            timestamp: Date.now()
        });

        setNewMemory('');
        setMemoryDate('');
    };

    const handleDeleteMemory = (id) => {
        remove(ref(database, `/rooms/${room}/memories/${id}`));
    };

    // Sort memories by date
    const sortedMemories = Object.entries(memories).sort((a, b) => {
        return new Date(b[1].date) - new Date(a[1].date);
    });

    return (
        <div className="box">
            <h2>MEMORY BANK // TIMELINE</h2>

            <div className="memory-input-section">
                <input
                    type="date"
                    value={memoryDate}
                    onChange={(e) => setMemoryDate(e.target.value)}
                    className="memory-date-input"
                />
                <textarea
                    value={newMemory}
                    onChange={(e) => setNewMemory(e.target.value)}
                    placeholder="Add a special moment..."
                    rows="2"
                    className="memory-text-input"
                />
                <button className="small-btn alt" onClick={handleAddMemory}>
                    Add Memory
                </button>
            </div>

            <div className="memory-timeline">
                {sortedMemories.length > 0 ? (
                    sortedMemories.map(([id, memory]) => (
                        <div key={id} className="memory-item">
                            <div className="memory-date-badge">
                                {new Date(memory.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                            <div className="memory-content">
                                <div className="memory-text">{memory.text}</div>
                                <div className="memory-meta">
                                    <span className="memory-author">by {memory.addedBy}</span>
                                    <button
                                        className="delete-memory-btn"
                                        onClick={() => handleDeleteMemory(id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-memories">
                        <div className="no-memories-icon">📸</div>
                        <div className="no-memories-text">No memories yet. Start adding some!</div>
                    </div>
                )}
            </div>

            <div className="subtext">Shared memories, forever saved</div>
        </div>
    );
};

export default MemoryTimeline;
