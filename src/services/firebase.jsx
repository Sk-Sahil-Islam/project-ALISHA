import { initializeApp } from 'firebase/app';
import { 
    getDatabase, 
    ref, 
    set, 
    onValue, 
    onDisconnect, 
    serverTimestamp,
    off,
    remove as firebaseRemove
} from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB8cd9Qf_m5sIZg887JFmdxd_iFeA28bHE",
    authDomain: "project-alisha-41577.firebaseapp.com",
    databaseURL: "https://project-alisha-41577-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "project-alisha-41577",
    storageBucket: "project-alisha-41577.firebasestorage.app",
    messagingSenderId: "850178821766",
    appId: "1:850178821766:web:8d9806e1286f1c37e60b07"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { 
    database, 
    ref, 
    set, 
    onValue, 
    onDisconnect, 
    serverTimestamp,
    off,
    firebaseRemove as remove
};
