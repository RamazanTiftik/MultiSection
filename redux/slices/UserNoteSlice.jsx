import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebaseConfig/Firebase';
import { doc, getDoc, setDoc, query, collection, Timestamp, deleteDoc, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


// get all user note
export const getAllUserNotes = createAsyncThunk(
    'userNote/getAllUserNotes',
    async ({ userId }, thunkAPI) => {
        try {
            //reference to the user note collection
            const notesRef = collection(db, "users", userId, "notes");
            const q = query(notesRef);
            const querySnapshot = await getDocs(q);

            // Clean up the data to ensure createdAt is in ISO string format
            const notes = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdDate: doc.data().createdDate?.toDate().toISOString() || null
            }));

            return notes;
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


//get selected user note by id
export const getNoteById = createAsyncThunk(
    'userNote/getNoteById',
    async ({ userId, noteId }, thunkAPI) => {
        try {
            const noteRef = doc(db, "users", userId, "notes", noteId);
            const docSnap = await getDoc(noteRef);

            if (!docSnap.exists()) {
                throw new Error("Note not found");
            }

            const noteData = docSnap.data();

            return {
                id: docSnap.id,
                ...noteData,
                createdDate: noteData.createdDate?.toDate().toISOString() || null
            };
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


//save user note
export const saveUserNote = createAsyncThunk(
    'userNote/saveUserNote',
    async ({ userId, content }, thunkAPI) => {
        try {
            const noteId = uuidv4(); // rastgele bir ID üret
            const noteRef = doc(db, "users", userId, "notes", noteId);

            //save to firestore
            await setDoc(noteRef, {
                id: noteId,
                content: content,
                createdAt: Timestamp.now()
            });

            return {
                id: noteId,
                content,
                createdAt: new Date().toISOString(), // UI için
            };
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


//update selected user note
export const updateNoteById = createAsyncThunk(
    'userNote/updateNoteById',
    async ({ userId, noteId, content }, thunkAPI) => {
        try {
            //reference to the user note
            const noteRef = doc(db, "users", userId, "notes", noteId);

            //update firebase document
            await setDoc(noteRef, {
                content: content,
            }, { merge: true });

            return { id: noteId, content }
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


//delete to selected user note
export const deleteNoteById = createAsyncThunk(
    'userNote/deleteNoteById',
    async ({ userId, noteId }, thunkAPI) => {
        try {
            const noteRef = doc(db, "users", userId, "notes", noteId);
            await deleteDoc(noteRef);

            return noteId;
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



const userNoteSlice = createSlice({
    name: 'userNote',
    initialState: {
        userNotes: [],
        selectedNote: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // getAllUserNotes
            .addCase(getAllUserNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUserNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.userNotes = action.payload;
            })
            .addCase(getAllUserNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // getNoteById
            .addCase(getNoteById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNoteById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedNote = action.payload;
            })
            .addCase(getNoteById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // saveUserNote
            .addCase(saveUserNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveUserNote.fulfilled, (state, action) => {
                state.loading = false;
                state.userNotes.push(action.payload);
            })
            .addCase(saveUserNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // updateNoteById
            .addCase(updateNoteById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNoteById.fulfilled, (state, action) => {
                state.loading = false;
                //change document in userNotes when it changed
                state.userNotes = state.userNotes.map(note =>
                    note.id === action.payload.id ? { ...note, ...action.payload } : note
                );

                //if selectedNote is in this, change this too
                if (state.selectedNote?.id === action.payload.id) {
                    state.selectedNote = { ...state.selectedNote, ...action.payload };
                }
            })
            .addCase(updateNoteById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            //deleteUserNote
            .addCase(deleteNoteById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNoteById.fulfilled, (state, action) => {
                state.loading = false;
                state.userNotes = state.userNotes.filter(note => note.id !== action.payload);

                //if deleted to selectedNote, so make null to selectedNote
                if (state.selectedNote?.id === action.payload) {
                    state.selectedNote = null;
                }
            })
            .addCase(deleteNoteById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default userNoteSlice.reducer;
