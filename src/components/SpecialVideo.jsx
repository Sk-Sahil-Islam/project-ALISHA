import { useEffect } from "react";
import specialVideo from "../assets/alisha-special.mp4";
import "./SpecialVideo.css";

export default function SpecialVideo({ open, onClose, videoRef }) {
  useEffect(() => {
    if (!open) return;
    const v = videoRef?.current;
    if (!v) return;

    // attempt autoplay (may be blocked on mobile); controls still available
    const play = async () => {
      try {
        v.currentTime = 0;
        await v.play(); // returns Promise [web:99]
      } catch {}
    };

    play();
  }, [open, videoRef]);

  if (!open) return null;

  return (
    <div className="special-overlay" role="dialog" aria-modal="true">
      <div className="special-card">
        <button className="special-close" onClick={onClose} aria-label="Close" type="button">
          ✕
        </button>

        <div className="special-title">For Alisha</div>
        <div className="special-subtitle">A little 20‑second surprise</div>

        <video
          ref={videoRef}
          className="special-video"
          src={specialVideo}
          controls
          playsInline
          preload="auto"
        />

        <button
          className="small-btn"
          type="button"
          onClick={() => {
            const v = videoRef?.current;
            if (!v) return;
            v.currentTime = 0;
            v.play(); // Promise; ok to ignore here [web:99]
          }}
        >
          Play again
        </button>
      </div>
    </div>
  );
}
