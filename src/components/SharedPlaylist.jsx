import { useState, useEffect } from 'react';
import { database, ref, set, onValue, remove, off } from '../services/firebase';

const SharedPlaylist = ({ user, room }) => {
    const [songs, setSongs] = useState({});
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songNote, setSongNote] = useState('');

    useEffect(() => {
        if (!room) return;

        const songsRef = ref(database, `/rooms/${room}/playlist`);
        const unsubSongs = onValue(songsRef, (snapshot) => {
            setSongs(snapshot.val() || {});
        });

        return () => off(songsRef);
    }, [room]);

    const handleAddSong = () => {
        if (!songTitle.trim() || !songArtist.trim()) return;

        const id = Date.now();
        set(ref(database, `/rooms/${room}/playlist/${id}`), {
            title: songTitle.trim(),
            artist: songArtist.trim(),
            note: songNote.trim() || '',
            addedBy: user,
            timestamp: Date.now()
        });

        setSongTitle('');
        setSongArtist('');
        setSongNote('');
    };

    const handleDeleteSong = (id) => {
        remove(ref(database, `/rooms/${room}/playlist/${id}`));
    };

    // Sort songs by timestamp (newest first)
    const sortedSongs = Object.entries(songs).sort((a, b) => {
        return b[1].timestamp - a[1].timestamp;
    });

    return (
        <div className="box">
            <h2>SHARED WAVES // PLAYLIST</h2>

            <div className="song-input-section">
                <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="Song title"
                    className="song-input"
                />
                <input
                    type="text"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                    placeholder="Artist"
                    className="song-input"
                />
                <input
                    type="text"
                    value={songNote}
                    onChange={(e) => setSongNote(e.target.value)}
                    placeholder="Why this song? (optional)"
                    className="song-input"
                />
                <button className="small-btn" onClick={handleAddSong}>
                    Add Song
                </button>
            </div>

            <div className="playlist-container">
                {sortedSongs.length > 0 ? (
                    sortedSongs.map(([id, song]) => (
                        <div key={id} className="song-card">
                            <div className="song-icon">
                                {song.addedBy === user ? '🎵' : '🎶'}
                            </div>
                            <div className="song-details">
                                <div className="song-title">{song.title}</div>
                                <div className="song-artist">{song.artist}</div>
                                {song.note && (
                                    <div className="song-note">"{song.note}"</div>
                                )}
                                <div className="song-meta">
                                    <span className="song-author">
                                        {song.addedBy === user ? 'You' : song.addedBy}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="delete-song-btn"
                                onClick={() => handleDeleteSong(id)}
                                title="Remove song"
                            >
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-songs">
                        <div className="no-songs-icon">🎧</div>
                        <div className="no-songs-text">Your shared playlist is empty</div>
                        <div className="no-songs-subtext">Add songs that remind you of each other</div>
                    </div>
                )}
            </div>

            {/* <div className="subtext">Songs that tell our story</div> */}
        </div>
    );
};

export default SharedPlaylist;
