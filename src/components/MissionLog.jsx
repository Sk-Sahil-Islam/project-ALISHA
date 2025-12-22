import { useState, useEffect } from 'react';
import { database, ref, set, onValue, off } from '../services/firebase';

const MissionLog = ({ user, room }) => {
    const [logText, setLogText] = useState('');
    const [prompt, setPrompt] = useState('');

    const prompts = [
        "Tell me one thing that made you think of me today.",
        "Describe a hug in one sentence.",
        "What do you want our next date to feel like?",
        "One small win you had today?",
        "Tell me something you didn't tell anyone else today.",
        "What song reminds you of us right now?"
    ];

    useEffect(() => {
        // Pick random prompt
        setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);

        // Restore draft
        const draft = localStorage.getItem(`ldr_log_draft_${user}`);
        if (draft) setLogText(draft);

        // Listen to shared log
        if (!room) return;
        const logRef = ref(database, `/rooms/${room}/interactions/log`);
        const unsubLog = onValue(logRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setLogText(`[${data.time}] ${data.author}: ${data.text}`);
            }
        });

        return () => off(logRef);
    }, [room, user]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLogText(value);
        localStorage.setItem(`ldr_log_draft_${user}`, value);
    };

    const handleSave = () => {
        set(ref(database, `/rooms/${room}/interactions/log`), {
            text: logText || '',
            author: user,
            time: new Date().toLocaleTimeString()
        });
        localStorage.removeItem(`ldr_log_draft_${user}`);
    };

    return (
        <div className="box">
            <h2>MISSION LOG // NOTES</h2>
            <textarea
                rows="3"
                value={logText}
                onChange={handleInputChange}
                placeholder="Leave a note..."
                style={{ resize: 'none', fontSize: '12px' }}
            />
            <button className="small-btn" onClick={handleSave}>
                Save Entry
            </button>
            <div className="prompt-text">Prompt: {prompt}</div>
            <div className="subtext">Latest entry is shared and synced.</div>
        </div>
    );
};

export default MissionLog;
