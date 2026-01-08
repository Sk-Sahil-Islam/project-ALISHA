import { useRef, useState } from "react";
import TimeCore from "./TimeCore";
import HeartTelemetry from "./HeartTelemetry";
import Reactor from "./Reactor";
import FieldReport from "./FieldReport";
import SharedPlaylist from "./SharedPlaylist";
import BucketList from "./BucketList";
import MemoryTimeline from "./MemoryTimeline";
import SpecialVideo from "./SpecialVideo";
import Particles from "./Particles";
import BackgroundMusic from "./BackgroundMusic";
import "./Dashboard.css";
import romanticPiano from "../audio/romantic-piano.mp3";
const SPECIAL_ROOM = "special08092711";

export default function Dashboard({ user, room, roomData, onLogout }) {
  const [specialOpen, setSpecialOpen] = useState(false);
  const specialVideoRef = useRef(null);

  return (
    <>
      <Particles />

      <BackgroundMusic
        src={romanticPiano}
        videoRef={specialVideoRef}
        defaultOn={true}
        forcePause={specialOpen}   // <-- THIS is the “pause immediately on open”
      />

      <SpecialVideo
        open={specialOpen}
        onClose={() => setSpecialOpen(false)}
        videoRef={specialVideoRef}
      />

      <div className="dashboard">
        <div className="top-grid">
          <div className="grid-item">
            <TimeCore
              meetingDate={roomData.meetingDate}
              onUpdateMeetingDate={roomData.updateMeetingDate}
              lastMetDate={roomData.lastMetDate}
              onUpdateLastMetDate={roomData.updateLastMetDate}
            />
          </div>

          <div className="grid-item">
            <HeartTelemetry
              user={user}
              room={room}
              partner={roomData.partnerData}
              onLogout={onLogout}
              showSpecialButton={room === SPECIAL_ROOM}
              onOpenSpecial={() => setSpecialOpen(true)}
            />
          </div>
        </div>

        <div className="reactor-section">
          <Reactor user={user} room={room} />
        </div>

        <div className="bottom-masonry">
          <div className="grid-item">
            <SharedPlaylist user={user} room={room} />
          </div>

          <div className="grid-item">
            <FieldReport user={user} room={room} />
          </div>

          <div className="grid-item">
            <MemoryTimeline user={user} room={room} />
          </div>

          <div className="grid-item">
            <BucketList room={room} />
          </div>
        </div>
      </div>
    </>
  );
}
