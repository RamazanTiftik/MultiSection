import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig/Firebase';


const STORAGE_KEY_EMAIL = 'user_email';
const STORAGE_KEY_PASSWORD = 'user_password';


//save user credentials to AsyncStorage
export async function saveUserCredentials(email, password) {
    try {
        await AsyncStorage.setItem(STORAGE_KEY_EMAIL, email);
        await AsyncStorage.setItem(STORAGE_KEY_PASSWORD, password);
    } catch (e) {
        console.error("Error saving credentials", e);
    }
}


//clear user credentials from AsyncStorage
export async function clearUserCredentials() {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY_EMAIL);
        await AsyncStorage.removeItem(STORAGE_KEY_PASSWORD);
    } catch (e) {
        console.error("Error clearing credentials", e);
    }
}


//login func
export const loginHandle = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await saveUserCredentials(email, password);

            return { userId: userCredential.user.uid };
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message || "Giriş sırasında hata oluştu");
        }
    }
);


//logout func
export const logoutHandle = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await clearUserCredentials();
            await signOut(auth);

            return true;
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu", error);
            return rejectWithValue(error.message || "Çıkış sırasında hata oluştu");
        }
    }
);


//auto sign-in func
export const autoSignInHandle = createAsyncThunk(
    "auth/autoSignIn",
    async (_, { rejectWithValue }) => {
        try {
            const email = await AsyncStorage.getItem(STORAGE_KEY_EMAIL);
            const password = await AsyncStorage.getItem(STORAGE_KEY_PASSWORD);

            if (email && password) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                return { userId: userCredential.user.uid };
            }

            return rejectWithValue("Giriş yaparken bir hata oluştu.");
        } catch (error) {
            return rejectWithValue(error.message || "Otomatik giriş hatası");
        }
    }
);


//change password func
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async ({ oldPassword, newPassword }, { rejectWithValue }) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return rejectWithValue("Kullanıcı oturumu bulunamadı.");
            }

            const credential = EmailAuthProvider.credential(
                user.email,
                oldPassword
            );

            // 1. Re-authenticate
            await reauthenticateWithCredential(user, credential);

            // 2. Update password
            await updatePassword(user, newPassword);

            return true;
        } catch (error) {
            console.error("Şifre güncelleme hatası:", error);
            return rejectWithValue(error.message || "Şifre güncellenemedi");
        }
    }
);


const initialState = {
    isLoggedIn: false,
    userId: null,
    loading: false,
    error: null,
};

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder

            //login
            .addCase(loginHandle.pending, (state) => {
                state.loading = true
                state.error = null;
            })
            .addCase(loginHandle.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.userId = action.payload.userId;
            })
            .addCase(loginHandle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Giriş başarısız";
            })

            //logout
            .addCase(logoutHandle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutHandle.fulfilled, (state) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.userId = null;
            })
            .addCase(logoutHandle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Çıkış başarısız";
            })

            //auto sign-in
            .addCase(autoSignInHandle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(autoSignInHandle.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.userId = action.payload.userId;
            })
            .addCase(autoSignInHandle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Otomatik giriş başarısız";
            })

            // change password
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Şifre değiştirme başarısız";
            })


    }
});

export default AuthSlice.reducer;