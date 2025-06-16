import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebaseConfig/Firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';


//get user data by id
export const getUserInfoById = createAsyncThunk(
    'userInfo/getUserInfoById',
    async ({ userId }, thunkAPI) => {
        try {
            //reference to the user document
            const userRef = doc(db, "users", userId);
            const docSnap = await getDoc(userRef);

            const userData = docSnap.data();

            // Clean up the data to ensure createdAt is in ISO string format
            const cleanedData = {
                ...userData,
                createdAt: userData.createdAt?.toDate().toISOString() || null
            };

            return cleanedData;
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


//update user data by id
export const updateUserDataById = createAsyncThunk(
    'userInfo/updateUserDataById',
    async ({ userId, name, salary, expense }, thunkAPI) => {
        try {
            //reference to the user document
            const userRef = doc(db, "users", userId);

            await setDoc(userRef, {
                name: name,
                salary: salary,
                expense: expense,
            }, { merge: true }) // Merge to update only the specified fields

            return { userId, name, salary, expense };
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        userInfo: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get
            .addCase(getUserInfoById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserInfoById.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(getUserInfoById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateUserDataById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserDataById.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = {
                    ...state.userInfo,
                    ...action.payload,
                };
            })
            .addCase(updateUserDataById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default userInfoSlice.reducer;
