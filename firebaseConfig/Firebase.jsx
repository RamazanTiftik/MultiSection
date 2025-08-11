import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyBIsIgoXlK2DkJ7iPtINbTLpD75kgparX0",
    authDomain: "walletapp-ce690.firebaseapp.com",
    projectId: "walletapp-ce690",
    storageBucket: "walletapp-ce690.appspot.com",
    messagingSenderId: "342743455734",
    appId: "1:342743455734:web:d8a18dbacb5526dd6d59d7",
    measurementId: "G-HVPW4N99PW"
}


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }