import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
/* import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai"; */


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


/* // Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });



// Wrap in an async function so you can use await
export async function runAI(prompt) {
    // Provide a prompt that contains text
    const prompt = "Write a story about a magic backpack."

    // To generate text output, call generateContent with the text input
    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    console.log(text);
}
 */

export { auth, db }