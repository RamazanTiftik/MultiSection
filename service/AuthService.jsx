import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig/Firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const STORAGE_KEY_EMAIL = 'user_email';
const STORAGE_KEY_PASSWORD = 'user_password';

export async function saveUserCredentials(email, password) {
    try {
        await AsyncStorage.setItem(STORAGE_KEY_EMAIL, email);
        await AsyncStorage.setItem(STORAGE_KEY_PASSWORD, password);
    } catch (e) {
        console.error("Error saving credentials", e);
    }
}

export async function clearUserCredentials() {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY_EMAIL);
        await AsyncStorage.removeItem(STORAGE_KEY_PASSWORD);
    } catch (e) {
        console.error("Error clearing credentials", e);
    }
}

export async function autoSignIn() {
    try {
        const email = await AsyncStorage.getItem(STORAGE_KEY_EMAIL);
        const password = await AsyncStorage.getItem(STORAGE_KEY_PASSWORD);

        if (email && password) {
            await signInWithEmailAndPassword(auth, email, password);
            return true; //login is successful
        }

        return false; // no credentials found
    } catch (e) {
        console.error("Auto sign-in failed", e);
        return false;
    }
}

export async function logoutFirebase() {
    try {
        await clearUserCredentials();
        await signOut(auth);
    } catch (e) {
        console.error("Logout failed", e);
    }
}
