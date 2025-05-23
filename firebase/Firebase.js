import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Eğer auth kullanacaksan
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBIsIgoXlK2DkJ7iPtINbTLpD75kgparX0",
    authDomain: "walletapp-ce690.firebaseapp.com",
    projectId: "walletapp-ce690",
    storageBucket: "walletapp-ce690.firebasestorage.app",
    messagingSenderId: "342743455734",
    appId: "1:342743455734:web:d8a18dbacb5526dd6d59d7",
    measurementId: "G-HVPW4N99PW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
