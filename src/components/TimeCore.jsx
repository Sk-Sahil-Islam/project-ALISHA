import { useState, useEffect } from 'react';

const TimeCore = ({ meetingDate, onUpdateMeetingDate }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dateInput, setDateInput] = useState('');

    const MET_DATE = new Date('2024-08-30');
    const TOGETHER_DATE = new Date('2025-01-29');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Initialize date input
        const year = meetingDate.getFullYear();
        const month = String(meetingDate.getMonth() + 1).padStart(2, '0');
        const day = String(meetingDate.getDate()).padStart(2, '0');
        setDateInput(`${year}-${month}-${day}`);
    }, [meetingDate]);

    const daysBetween = (a, b) => {
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor((b - a) / oneDay);
    };

    const getTimeUntilMeeting = () => {
        const now = currentTime.getTime();
        const meeting = meetingDate.getTime();
        const diff = meeting - now;

        if (diff <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isPast: true
            };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, isPast: false };
    };

    const timeUntil = getTimeUntilMeeting();
    const daysSinceMet = daysBetween(MET_DATE, currentTime);
    const daysTogether = daysBetween(TOGETHER_DATE, currentTime);

    let nextAnnivYear = currentTime.getFullYear();
    let nextAnniv = new Date(nextAnnivYear, TOGETHER_DATE.getMonth(), TOGETHER_DATE.getDate());
    if (nextAnniv < currentTime) {
        nextAnnivYear += 1;
        nextAnniv = new Date(nextAnnivYear, TOGETHER_DATE.getMonth(), TOGETHER_DATE.getDate());
    }
    const daysToAnniv = daysBetween(currentTime, nextAnniv);

    const affirmations = [
        "You're not alone today.",
        "Proud of you, even on quiet days.",
        "Drink water, okay?",
        "You are doing better than you think.",
        "Your smile is my favorite place.",
        "Even now, you're loved."
    ];

    const affirmationIndex = Math.floor((currentTime.getSeconds() / 10) % affirmations.length);

    const handleUpdateDate = () => {
        if (!dateInput) {
            alert('Please select a date first!');
            return;
        }

        const newDate = new Date(dateInput);
        if (newDate < currentTime) {
            const confirm = window.confirm('This date is in the past. Set it anyway?');
            if (!confirm) return;
        }

        onUpdateMeetingDate(newDate);
    };

    return (
        <div className="box">
            <h2>TIMECORE // TEMPORAL DATA</h2>
            
            {/* COUNTDOWN TIMER */}
            <div className="countdown-container">
                {timeUntil.isPast ? (
                    <div className="countdown-expired">
                        <div className="data-large">TIME'S UP!</div>
                        <div className="small-label">Meeting time has passed</div>
                    </div>
                ) : (
                    <>
                        <div className="small-label" style={{ marginBottom: '10px' }}>COUNTDOWN TO MEETING</div>
                        <div className="countdown-grid">
                            <div className="countdown-item">
                                <div className="countdown-number">{String(timeUntil.days).padStart(2, '0')}</div>
                                <div className="countdown-label">DAYS</div>
                            </div>
                            <div className="countdown-separator">:</div>
                            <div className="countdown-item">
                                <div className="countdown-number">{String(timeUntil.hours).padStart(2, '0')}</div>
                                <div className="countdown-label">HRS</div>
                            </div>
                            <div className="countdown-separator">:</div>
                            <div className="countdown-item">
                                <div className="countdown-number">{String(timeUntil.minutes).padStart(2, '0')}</div>
                                <div className="countdown-label">MIN</div>
                            </div>
                            <div className="countdown-separator">:</div>
                            <div className="countdown-item">
                                <div className="countdown-number">{String(timeUntil.seconds).padStart(2, '0')}</div>
                                <div className="countdown-label">SEC</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="meeting-editor">
                <div className="date-change-row">
                    <input
                        type="date"
                        className="date-input"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                    />
                    <button className="small-btn tiny" onClick={handleUpdateDate}>
                        Set Date
                    </button>
                </div>
            </div>

            <div className="counter-row">
                <span>Days since we met</span>
                <span>{daysSinceMet}</span>
            </div>
            <div className="counter-row">
                <span>Days officially together</span>
                <span>{daysTogether}</span>
            </div>
            <div className="counter-row">
                <span>Next anniversary</span>
                <span>{daysToAnniv} days ({nextAnniv.toLocaleDateString()})</span>
            </div>
            <div className="prompt-text">{affirmations[affirmationIndex]}</div>
        </div>
    );
};

export default TimeCore;
