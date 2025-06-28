import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebaseConfig/Firebase';
import { doc, getDoc, setDoc, query, collection, Timestamp, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


// get all banks
export const getAllBankNames = createAsyncThunk(
    'postData/getAllBankNames',
    async (thunkAPI) => {
        try {
            //reference to the feedbacks collection
            const banksRef = collection(db, "banks");
            const q = query(banksRef);
            const querySnapshot = await getDocs(q);

            const banks = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                };
            });

            return banks;
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// get all categories
export const getAllCategories = createAsyncThunk(
    'postData/getAllCategories',
    async (thunkAPI) => {
        try {
            //reference to the categories collection
            const categoriesRef = collection(db, "expenseCategories");
            const q = query(categoriesRef);
            const querySnapshot = await getDocs(q);

            const categories = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                };
            });

            return categories;
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


//save feedback
export const savePostData = createAsyncThunk(
    'postData/savePostData',
    async ({ userId, selectedButton, amount, description, bankName, createdAt, isMonthly, category }, thunkAPI) => {
        try {

            const postDataId = uuidv4(); // random id for postData
            let postDataRef = ""

            if (selectedButton === "Gelir") {
                postDataRef = doc(db, "users", userId, "Income", postDataId);

                //save to firestore
                await setDoc(postDataRef, {
                    id: postDataId,
                    amount: amount,
                    description: description || "Açıklama Yok",
                    bankName: bankName,
                    isMonthly: isMonthly, // düzenli aylık gelir mi? -> true/false
                    createdAt: createdAt
                });

            } else if (selectedButton === "Gider") {
                postDataRef = doc(db, "users", userId, "Expense", postDataId);

                //save to firestore
                await setDoc(postDataRef, {
                    id: postDataId,
                    amount: amount,
                    description: description || "Açıklama Yok",
                    bankName: bankName,
                    category: category,
                    isMonthly: isMonthly, // düzenli aylık gelir mi? -> true/false
                    createdAt: createdAt
                });
            }

            return {
                isSuccess: true,
            };
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



const postDataSlice = createSlice({
    name: 'postData',
    initialState: {
        postDatas: [],
        loading: false,
        error: null,
        categories: [],
        bankNames: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // savePostData
            .addCase(savePostData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(savePostData.fulfilled, (state, action) => {
                state.loading = false;
                state.postDatas.push(action.payload);
            })
            .addCase(savePostData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllBankNames
            .addCase(getAllBankNames.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBankNames.fulfilled, (state, action) => {
                state.loading = false;
                state.bankNames = action.payload;
            })
            .addCase(getAllBankNames.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllCategories
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default postDataSlice.reducer;
