import { useState, useEffect } from "react";

const toYYYYMMDD = (d) => {
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TimeCore = ({
  meetingDate,
  onUpdateMeetingDate,
  lastMetDate,
  onUpdateLastMetDate,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [meetingInput, setMeetingInput] = useState("");
  const [lastMetInput, setLastMetInput] = useState("");

  const MET_DATE = new Date("2024-08-30");
  const TOGETHER_DATE = new Date("2025-01-29");
  const DEFAULT_LAST_MET = new Date("2025-11-30");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMeetingInput(toYYYYMMDD(meetingDate));
  }, [meetingDate]);

  useEffect(() => {
    const d = lastMetDate instanceof Date ? lastMetDate : DEFAULT_LAST_MET;
    setLastMetInput(toYYYYMMDD(d));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMetDate]);

  const daysBetween = (a, b) => {
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor((b - a) / oneDay);
  };

  const getTimeUntilMeeting = () => {
    const now = currentTime.getTime();
    const meeting = meetingDate.getTime();
    const diff = meeting - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
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

  const effectiveLastMetDate =
    lastMetDate instanceof Date
      ? lastMetDate
      : lastMetInput
        ? new Date(lastMetInput)
        : DEFAULT_LAST_MET;

  const daysSinceLastMet = daysBetween(effectiveLastMetDate, currentTime);

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
    "Even now, you're loved.",
    "Slow progress is still progress.",
    "If today is heavy, you don’t have to carry it perfectly.",
    "One small step is enough for today.",
    "You deserve rest without guilt.",
    "You are safe here.",
    "Your effort matters more than the noise in your head.",
    "Breathe. Then breathe again.",
    "You’re allowed to take up space.",
    "Tomorrow can be softer.",
    "I’m proud of the way you keep going.",
    "You don’t need to earn love.",
    "You’re doing the brave thing by trying.",
    "Even your quiet days count.",
    "You are more than your mood.",
    "Soft hearts are strong hearts.",
    "You don’t have to be perfect to be loved.",
    "The world is better with you in it.",
    "Take it minute by minute.",
    "You’re doing enough.",
  ];

  // changes every 10 seconds and cycles through the full array
    const affirmationIndex = Math.floor(Date.now() / 10000) % affirmations.length;

  const handleUpdateMeetingDate = () => {
    if (!meetingInput) return alert("Please select a date first!");

    const newDate = new Date(meetingInput);
    if (newDate < currentTime) {
      const confirmPast = window.confirm("This meeting date is in the past. Set it anyway?");
      if (!confirmPast) return;
    }
    onUpdateMeetingDate(newDate);
  };

  const handleUpdateLastMet = () => {
    if (!lastMetInput) return alert("Please select a date first!");

    const newDate = new Date(lastMetInput);
    if (newDate > currentTime) {
      const confirmFuture = window.confirm("This 'Last we met' date is in the future. Set it anyway?");
      if (!confirmFuture) return;
    }

    if (onUpdateLastMetDate) onUpdateLastMetDate(newDate);
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
            <div className="small-label" style={{ marginBottom: "10px" }}>
              COUNTDOWN TO MEETING
            </div>

            <div className="countdown-grid">
              <div className="countdown-item">
                <div className="countdown-number">{String(timeUntil.days).padStart(2, "0")}</div>
                <div className="countdown-label">DAYS</div>
              </div>

              <div className="countdown-separator">:</div>

              <div className="countdown-item">
                <div className="countdown-number">{String(timeUntil.hours).padStart(2, "0")}</div>
                <div className="countdown-label">HRS</div>
              </div>

              <div className="countdown-separator">:</div>

              <div className="countdown-item">
                <div className="countdown-number">{String(timeUntil.minutes).padStart(2, "0")}</div>
                <div className="countdown-label">MIN</div>
              </div>

              <div className="countdown-separator">:</div>

              <div className="countdown-item">
                <div className="countdown-number">{String(timeUntil.seconds).padStart(2, "0")}</div>
                <div className="countdown-label">SEC</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* DATES (side-by-side) */}
      <div className="dates-row">
        <div className="date-block">
          <div className="small-label">MEETING DATE</div>
          <div className="date-change-row compact">
            <input
              type="date"
              className="date-input"
              value={meetingInput}
              onChange={(e) => setMeetingInput(e.target.value)}
            />
            <button className="small-btn tiny" onClick={handleUpdateMeetingDate} type="button">
              Set
            </button>
          </div>
        </div>

        <div className="date-block">
          <div className="small-label">LAST WE MET</div>
          <div className="date-change-row compact">
            <input
              type="date"
              className="date-input"
              value={lastMetInput}
              onChange={(e) => setLastMetInput(e.target.value)}
            />
            <button className="small-btn tiny alt" onClick={handleUpdateLastMet} type="button">
              Set
            </button>
          </div>
        </div>
      </div>

      {/* Counters */}
      <div className="counter-row">
        <span>Days since we met</span>
        <span>{daysSinceMet}</span>
      </div>

      <div className="counter-row">
        <span>Days officially together</span>
        <span>{daysTogether}</span>
      </div>

      <div className="counter-row">
        <span>Days since last we met</span>
        <span>
          {daysSinceLastMet} ({effectiveLastMetDate.toLocaleDateString()})
        </span>
      </div>

      <div className="counter-row">
        <span>Next anniversary</span>
        <span>
          {daysToAnniv} days ({nextAnniv.toLocaleDateString()})
        </span>
      </div>

      <div className="prompt-text">{affirmations[affirmationIndex]}</div>
    </div>
  );
};

export default TimeCore;
