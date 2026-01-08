import { useState, useEffect } from "react";
import { database, ref, set, onValue, off } from "../services/firebase";

export const useRoomData = (room, user) => {
  const [meetingDate, setMeetingDate] = useState(new Date("2026-03-10"));
  const [lastMetDate, setLastMetDate] = useState(new Date("2025-11-30")); // default
  const [partnerData, setPartnerData] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    if (!room) return;

    // meeting date
    const meetingRef = ref(database, `/rooms/${room}/meetingDate`);
    const unsubMeeting = onValue(meetingRef, (snapshot) => {
      const date = snapshot.val();
      if (date) setMeetingDate(new Date(date));
    });

    // last met date (NEW)
    const lastMetRef = ref(database, `/rooms/${room}/lastMetDate`);
    const unsubLastMet = onValue(lastMetRef, (snapshot) => {
      const date = snapshot.val();
      if (date) setLastMetDate(new Date(date));
    });

    // users
    const usersRef = ref(database, `/rooms/${room}/users`);
    const unsubUsers = onValue(usersRef, (snapshot) => {
      const users = snapshot.val() || {};
      const userList = Object.keys(users).filter((u) => users[u].active);
      setRoomUsers(userList);

      const partner = userList.find((u) => u !== user);
      setPartnerData(partner ? { name: partner } : null);
    });

    return () => {
      off(meetingRef);
      off(lastMetRef);
      off(usersRef);
    };
  }, [room, user]);

  const updateMeetingDate = (newDate) => {
    if (!room) return;
    set(ref(database, `/rooms/${room}/meetingDate`), newDate.toISOString());
  };

  const updateLastMetDate = (newDate) => {
    if (!room) return;
    set(ref(database, `/rooms/${room}/lastMetDate`), newDate.toISOString());
  };

  return {
    meetingDate,
    updateMeetingDate,
    lastMetDate,
    updateLastMetDate,
    partnerData,
    roomUsers,
  };
};
