import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../../firebaseConfig/Firebase';
import { collection, query, getDocs } from 'firebase/firestore';


// Helper function to get the current month and year
const getCurrentMonthYear = () => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed: 0 = Ocak
    const currentYear = now.getFullYear();
    return { currentMonth, currentYear };
};


//get income data
export const fetchIncome = createAsyncThunk(
    'aiAnalysis/fetchIncome',
    async ({ userId }, thunkAPI) => {
        try {
            const incomeRef = collection(db, "users", userId, "Income");
            const q = query(incomeRef);
            const snapshot = await getDocs(q);

            const { currentMonth, currentYear } = getCurrentMonthYear();

            const incomeData = snapshot.docs
                .map(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate();
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: createdAt?.toISOString() ?? null,
                        _createdDate: createdAt, // Geçici: filtre için
                    };
                })
                .filter(item => {
                    if (!item._createdDate) return false;
                    return (
                        item._createdDate.getMonth() === currentMonth &&
                        item._createdDate.getFullYear() === currentYear
                    );
                })
                .map(({ _createdDate, ...rest }) => rest); // Geçici alanı temizle

            return incomeData;
        } catch (error) {
            console.error("Income fetch error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



//get expense data
export const fetchExpense = createAsyncThunk(
    'aiAnalysis/fetchExpense',
    async ({ userId }, thunkAPI) => {
        try {
            const expenseRef = collection(db, "users", userId, "Expense");
            const q = query(expenseRef);
            const snapshot = await getDocs(q);

            const { currentMonth, currentYear } = getCurrentMonthYear();

            const expenseData = snapshot.docs
                .map(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate();
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: createdAt?.toISOString() ?? null,
                        _createdDate: createdAt,
                    };
                })
                .filter(item => {
                    if (!item._createdDate) return false;
                    return (
                        item._createdDate.getMonth() === currentMonth &&
                        item._createdDate.getFullYear() === currentYear
                    );
                })
                .map(({ _createdDate, ...rest }) => rest);

            return expenseData;
        } catch (error) {
            console.error("Expense fetch error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const aiAnalysisSlice = createSlice({
    name: 'aiAnalysis',
    initialState: {
        income: [],
        expense: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // INCOME
            .addCase(fetchIncome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncome.fulfilled, (state, action) => {
                state.loading = false;
                state.income = action.payload;
            })
            .addCase(fetchIncome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // EXPENSE
            .addCase(fetchExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expense = action.payload;
            })
            .addCase(fetchExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default aiAnalysisSlice.reducer;
