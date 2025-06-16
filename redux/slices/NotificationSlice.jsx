import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebaseConfig/Firebase';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';


export const getNotificationByUserId = createAsyncThunk(
    'notification/getNotificationByUserId',
    async ({ userId }, thunkAPI) => {
        try {
            const notifyRef = collection(db, "users", userId, "notification"); // UID ile dokümanı çek
            const querySnapshot = await getDocs(notifyRef);

            const notifications = [];
            querySnapshot.forEach((doc) => {
                notifications.push({ id: doc.id, ...doc.data() });
            });


            return notifications;
        } catch (error) {
            console.error("Firestore Error:", error)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const updateNotification = createAsyncThunk(
    'notification/updateNotification',
    async ({ id, notify, userId }, thunkAPI) => {
        try {
            const notifRef = doc(db, 'users', userId, 'notification', id);
            await updateDoc(notifRef, { notify });

            return { id, notify };
        } catch (error) {
            console.error("Update Notification Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Get
            .addCase(getNotificationByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotificationByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(getNotificationByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //Update
            .addCase(updateNotification.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateNotification.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.notifications.findIndex((n) => n.id === action.payload.id);
                if (index !== -1) {
                    state.notifications[index].notify = action.payload.notify;
                }
            })
            .addCase(updateNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    },
});

export default notificationSlice.reducer;
