import { useEffect } from 'react';
import TimeCore from './TimeCore';
import HeartTelemetry from './HeartTelemetry';
import Reactor from './Reactor';
import FieldReport from './FieldReport';
import SharedPlaylist from './SharedPlaylist';
import BucketList from './BucketList';
import MemoryTimeline from './MemoryTimeline';
import Particles from './Particles';
import CanvasCursor from './CanvasCursor';
import './Dashboard.css';

const Dashboard = ({ user, room, roomData, onLogout }) => {
    return (
        <>
            <Particles />
            <div className="dashboard">
                {/* TOP GRID SECTION */}
                <div className="top-grid">
                    <div className="grid-item">
                        <TimeCore 
                            meetingDate={roomData.meetingDate}
                            onUpdateMeetingDate={roomData.updateMeetingDate}
                        />
                    </div>
                    
                    <div className="grid-item">
                        <HeartTelemetry 
                            user={user}
                            room={room}
                            partner={roomData.partnerData}
                            onLogout={onLogout}
                        />
                    </div>
                </div>

                {/* CENTERED REACTOR */}
                <div className="reactor-section">
                    <Reactor 
                        user={user}
                        room={room}
                    />
                </div>

                {/* BOTTOM MASONRY SECTION - Specific Order */}
                <div className="bottom-masonry">
                    {/* LEFT COLUMN */}
                    <div className="grid-item">
                        <SharedPlaylist 
                            user={user}
                            room={room}
                        />
                    </div>
                    
                    <div className="grid-item">
                        <FieldReport 
                            user={user}
                            room={room}
                        />
                    </div>
                    
                    {/* RIGHT COLUMN */}
                    <div className="grid-item">
                        <MemoryTimeline 
                            user={user}
                            room={room}
                        />
                    </div>
                    
                    <div className="grid-item">
                        <BucketList 
                            room={room}
                        />
                    </div>
                </div>
            </div>
            <CanvasCursor />
        </>
    );
};

export default Dashboard;
