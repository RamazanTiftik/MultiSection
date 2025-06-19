import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebaseConfig/Firebase';
import { doc, getDoc, setDoc, query, collection, Timestamp, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


// get all feedback
export const getAllFeedbacks = createAsyncThunk(
    'feedback/getAllFeedbacks',
    async (thunkAPI) => {
        try {
            //reference to the feedbacks collection
            const feedbackRef = collection(db, "feedbacks");
            const q = query(feedbackRef);
            const querySnapshot = await getDocs(q);

            // Clean up the data to ensure createdAt is in ISO string format
            const feedbacks = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate().toISOString() || null,
                };
            });

            return feedbacks;
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



//save feedback
export const saveFeedback = createAsyncThunk(
    'feedback/saveFeedback',
    async ({ createdId, createdName, feedbackText }, thunkAPI) => {
        try {
            const feedbackId = uuidv4(); // random id for feedback
            const feedbackRef = doc(db, "feedbacks", feedbackId);

            //save to firestore
            await setDoc(feedbackRef, {
                id: feedbackId,
                feedbackText: feedbackText,
                createdId: createdId,
                createdName: createdName,
                answer: "",
                isAccepted: false,
                createdAt: Timestamp.now()
            });

            return {
                id: feedbackId,
                createdName: createdName,
                createdAt: new Date().toISOString(), // for UI
            };
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


//get feedback by id
export const getFeedbackById = createAsyncThunk(
    'feedback/getFeedbackById',
    async ({ feedbackId }, thunkAPI) => {
        try {
            const feedbackRef = doc(db, "feedbacks", feedbackId);
            const docSnap = await getDoc(feedbackRef);

            if (!docSnap.exists()) {
                throw new Error("Feedback not found");
            }

            const feedbackData = docSnap.data();

            return {
                id: docSnap.id,
                ...feedbackData,
                createdAt: feedbackData.createdAt?.toDate().toISOString() || null,
            };
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



const feedBackSlice = createSlice({
    name: 'feedback',
    initialState: {
        feedbacks: [],
        loading: false,
        error: null,
        selectedFeedback: {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // getAllFeedbacks
            .addCase(getAllFeedbacks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFeedbacks.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbacks = action.payload;
            })
            .addCase(getAllFeedbacks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // getFeedbackById
            .addCase(getFeedbackById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedbackById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFeedback = action.payload;
            })
            .addCase(getFeedbackById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // saveFeedback
            .addCase(saveFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbacks.push(action.payload);
            })
            .addCase(saveFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    },
});

export default feedBackSlice.reducer;
