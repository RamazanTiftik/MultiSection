import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebaseConfig/Firebase';
import { query, collection, Timestamp, getDocs, where } from 'firebase/firestore';


// Mapping month names to their respective numeric values
const monthNameToNumber = {
    'Ocak': 1,
    'Şubat': 2,
    'Mart': 3,
    'Nisan': 4,
    'Mayıs': 5,
    'Haziran': 6,
    'Temmuz': 7,
    'Ağustos': 8,
    'Eylül': 9,
    'Ekim': 10,
    'Kasım': 11,
    'Aralık': 12,
};


// Function to get the start and end timestamps for a given month and year
const getDateRangeFromMonthAndYear = (month, year) => {
    const numericMonth = typeof month === 'string' ? monthNameToNumber[month] : Number(month);
    const numericYear = Number(year);

    if (isNaN(numericMonth) || isNaN(numericYear)) {
        throw new Error(`Invalid month (${month}) or year (${year})`);
    }

    const startDate = new Date(numericYear, numericMonth - 1, 1);
    const endDate = new Date(numericYear, numericMonth, 0);
    endDate.setHours(23, 59, 59, 999);

    return {
        startTimestamp: Timestamp.fromDate(startDate),
        endTimestamp: Timestamp.fromDate(endDate),
    };
};


// Get filtered post data based on userId, selectedButton, month, and year
export const getFilteredPostData = createAsyncThunk(
    'postData/getFilteredPostData',
    async ({ userId, selectedButton, month, year }, thunkAPI) => {
        try {
            const { startTimestamp, endTimestamp } = getDateRangeFromMonthAndYear(month, year);

            const collectionName = selectedButton === 'Gelir' ? 'Income' : 'Expense';
            const dataRef = collection(db, 'users', userId, collectionName);

            const q = query(
                dataRef,
                where("createdAt", ">=", startTimestamp),
                where("createdAt", "<=", endTimestamp)
            );

            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => {
                const data = doc.data();

                return {
                    id: doc.id,
                    ...data,
                    createdAt: (data.createdAt?.toDate?.() || data.createdAt)?.toString() ?? null

                };
            });



            return results;
        } catch (error) {
            console.error("Filtered Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);




const homePageSlice = createSlice({
    name: 'homePage',
    initialState: {
        loading: false,
        error: null,
        filteredPostDatas: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            //Get filtered post data
            .addCase(getFilteredPostData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFilteredPostData.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredPostDatas = action.payload;
            })
            .addCase(getFilteredPostData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },

});

export default homePageSlice.reducer;
