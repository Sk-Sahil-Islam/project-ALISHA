import { useState, useEffect } from 'react';
import { database, ref, set, onValue, off } from '../services/firebase';

export const useRoomData = (room, user) => {
    const [meetingDate, setMeetingDate] = useState(new Date('2026-03-10'));
    const [partnerData, setPartnerData] = useState(null);
    const [roomUsers, setRoomUsers] = useState([]);

    useEffect(() => {
        if (!room) return;

        // Listen to meeting date (synced across users)
        const meetingRef = ref(database, `/rooms/${room}/meetingDate`);
        const unsubMeeting = onValue(meetingRef, (snapshot) => {
            const date = snapshot.val();
            if (date) {
                setMeetingDate(new Date(date));
            }
        });

        // Listen to users in room
        const usersRef = ref(database, `/rooms/${room}/users`);
        const unsubUsers = onValue(usersRef, (snapshot) => {
            const users = snapshot.val() || {};
            const userList = Object.keys(users).filter(u => users[u].active);
            setRoomUsers(userList);
            
            // Find partner
            const partner = userList.find(u => u !== user);
            if (partner) {
                setPartnerData({ name: partner });
            } else {
                setPartnerData(null);
            }
        });

        return () => {
            off(meetingRef);
            off(usersRef);
        };
    }, [room, user]);

    const updateMeetingDate = (newDate) => {
        if (!room) return;
        set(ref(database, `/rooms/${room}/meetingDate`), newDate.toISOString());
    };

    return {
        meetingDate,
        updateMeetingDate,
        partnerData,
        roomUsers
    };
};
