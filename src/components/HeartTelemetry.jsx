import { useState, useEffect } from 'react';
import { database, ref, set, onValue, onDisconnect, serverTimestamp, off } from '../services/firebase';
import "./HeartTelemetry.css";

const HeartTelemetry = ({
  user,
  room,
  partner,
  onLogout,
  showSpecialButton,
  onOpenSpecial,
}) => {
  const [partnerStatus, setPartnerStatus] = useState({ online: false, lastSeen: null });
  const [partnerMood, setPartnerMood] = useState('--');
  const [partnerMessage, setPartnerMessage] = useState('OFFLINE');
  const [myMood, setMyMood] = useState(null);

  const moods = ['🥰', '😴', '😤', '🥹', '🤧'];

  useEffect(() => {
    if (!room || !user) return;

    const presenceRef = ref(database, `/rooms/${room}/presence/${user}`);

    onDisconnect(presenceRef).set({
      online: false,
      lastSeen: serverTimestamp()
    });

    set(presenceRef, {
      online: true,
      lastSeen: serverTimestamp()
    });

    const heartbeat = setInterval(() => {
      set(presenceRef, {
        online: true,
        lastSeen: serverTimestamp()
      });
    }, 30000);

    const presenceListener = ref(database, `/rooms/${room}/presence`);
    const unsubPresence = onValue(presenceListener, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      Object.keys(data).forEach((username) => {
        if (username !== user) {
          const partnerData = data[username];
          setPartnerStatus({
            online: partnerData.online,
            lastSeen: partnerData.lastSeen
          });
        }
      });
    });

    const statusListener = ref(database, `/rooms/${room}/interactions/status`);
    const unsubStatus = onValue(statusListener, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      Object.keys(data).forEach((username) => {
        if (username !== user) {
          setPartnerMessage(data[username] || 'OFFLINE');
        }
      });
    });

    const moodListener = ref(database, `/rooms/${room}/interactions/mood`);
    const unsubMood = onValue(moodListener, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      Object.keys(data).forEach((username) => {
        if (username !== user) {
          setPartnerMood(data[username] || '--');
        }
      });
    });

    const myMoodListener = ref(database, `/rooms/${room}/interactions/mood/${user}`);
    const unsubMyMood = onValue(myMoodListener, (snapshot) => {
      const mood = snapshot.val();
      if (mood) setMyMood(mood);
    });

    return () => {
      clearInterval(heartbeat);

      set(presenceRef, {
        online: false,
        lastSeen: serverTimestamp()
      });

      off(presenceListener);
      off(statusListener);
      off(moodListener);
      off(myMoodListener);
    };
  }, [room, user]);

  const handleMoodClick = (mood) => {
    setMyMood(mood);
    set(ref(database, `/rooms/${room}/interactions/mood/${user}`), mood);
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return '--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="box">
      <h2>HEART TELEMETRY // STATUS</h2>

      {/* COMPACT IDENTITY & ROOM */}
      <div className="identity-compact">
        <div className="identity-row">
          <span className="id-label">YOU:</span>
          <span className="identity-pill-compact">{user}</span>
        </div>

        <div className="identity-row">
          <span className="id-label">ROOM:</span>
          <span className="room-code-pill-compact">{room}</span>

          {/* Special button goes here (inside the card) */}
          {showSpecialButton && (
            <button
              className="small-btn alt special-inline-btn"
              onClick={onOpenSpecial}
              type="button"
            >
              Open Surprise
            </button>
          )}

          <button className="exit-btn" onClick={onLogout} type="button">
            ⎋
          </button>
        </div>
      </div>

      {/* PARTNER STATUS - COMPACT */}
      <div className="partner-status-compact">
        <div className="partner-header">
          <div className={`status-indicator ${partnerStatus.online ? 'online' : 'offline'}`}>
            <div className="pulse-dot"></div>
            <span className="partner-name">
              {partner ? partner.name.toUpperCase() : 'PARTNER'}
            </span>
          </div>
          <span className="last-seen-compact">
            {partnerStatus.online ? 'NOW' : formatLastSeen(partnerStatus.lastSeen)}
          </span>
        </div>

        <div className="partner-message-compact">
          {partner ? partnerMessage : 'Waiting for partner...'}
        </div>
      </div>

      {/* MOODS - SIDE BY SIDE */}
      <div className="moods-compact">
        <div className="mood-section">
          <div className="mood-header">
            <span className="mood-emoji">{partnerMood}</span>
            <span className="mood-name">{partner ? partner.name : 'Partner'}</span>
          </div>
        </div>

        <div className="mood-divider"></div>

        <div className="mood-section">
          <div className="mood-header">
            <span className="mood-emoji">{myMood || '😶'}</span>
            <span className="mood-name">You</span>
          </div>
        </div>
      </div>

      {/* MY MOOD SELECTOR - COMPACT */}
      <div className="mood-selector-compact">
        {moods.map((mood) => (
          <span
            key={mood}
            className={`mood-btn-compact ${myMood === mood ? 'active' : ''}`}
            onClick={() => handleMoodClick(mood)}
          >
            {mood}
          </span>
        ))}
      </div>

      <div className="subtext">LIVE TELEMETRY LINKED</div>
    </div>
  );
};

export default HeartTelemetry;
