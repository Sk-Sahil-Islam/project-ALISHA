import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic({
  videoRef,
  src,
  defaultOn = true,
  forcePause = false,
}) {
  const audioRef = useRef(null);
  const [isOn, setIsOn] = useState(defaultOn);
  const [unlocked, setUnlocked] = useState(false);

  // Unlock audio after first user gesture (autoplay policy). [web:80]
  useEffect(() => {
    const unlock = async () => {
      setUnlocked(true);
      if (isOn && !forcePause) {
        try { await audioRef.current?.play(); } catch {}
      }
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [isOn, forcePause]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = true;
    a.volume = 0.35;
  }, []);

  // Force pause when modal opens; resume when modal closes (if music is ON).
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    if (forcePause) {
      a.pause(); // pause() pauses playback; no-op if already paused. [web:105]
      return;
    }

    if (isOn && unlocked) {
      a.play().catch(() => {}); // play() returns a Promise. [web:99]
    }
  }, [forcePause, isOn, unlocked]);

  // Video cross-control (still useful once video starts playing)
  useEffect(() => {
    const v = videoRef?.current;
    const a = audioRef.current;
    if (!v || !a) return;

    const onVideoPlay = () => a.pause(); // [web:105]
    const onVideoPauseOrEnd = async () => {
      if (!isOn || !unlocked || forcePause) return;
      try { await a.play(); } catch {}
    };

    v.addEventListener("play", onVideoPlay);
    v.addEventListener("pause", onVideoPauseOrEnd);
    v.addEventListener("ended", onVideoPauseOrEnd);

    return () => {
      v.removeEventListener("play", onVideoPlay);
      v.removeEventListener("pause", onVideoPauseOrEnd);
      v.removeEventListener("ended", onVideoPauseOrEnd);
    };
  }, [videoRef, isOn, unlocked, forcePause]);

  const turnOn = async () => {
    setIsOn(true);
    if (!unlocked || forcePause) return;
    try { await audioRef.current?.play(); } catch {}
  };

  const turnOff = () => {
    setIsOn(false);
    audioRef.current?.pause(); // [web:105]
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />

      <button
        type="button"
        className={`music-fab ${isOn ? "on" : "off"}`}
        onClick={() => (isOn ? turnOff() : turnOn())}
        title={isOn ? "Pause music" : "Play music"}
      >
        {isOn ? "⏸" : "▶"}
      </button>
    </>
  );
}
