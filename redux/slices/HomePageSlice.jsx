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
            })

            return results;
        } catch (error) {
            console.error("Filtered Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// Get yearly post data based on userId, selectedButton, and year -> for group up by month
export const getYearlyPostData = createAsyncThunk(
    'homePage/getYearlyPostData',
    async ({ userId, selectedButton = null, year }, thunkAPI) => {
        try {
            const start = Timestamp.fromDate(new Date(`${year}-01-01`));
            const end = Timestamp.fromDate(new Date(`${parseInt(year) + 1}-01-01`));

            const getData = async (type) => {
                const collectionName = type === "Gelir" ? "Income" : "Expense";
                const ref = collection(db, "users", userId, collectionName);
                const q = query(ref, where("createdAt", ">=", start), where("createdAt", "<", end));
                const snapshot = await getDocs(q);

                return snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        createdAt: data.createdAt?.toDate().toISOString() ?? null
                    };
                });
            };

            // Tek tip istenirse
            if (selectedButton === "Gelir" || selectedButton === "Gider") {
                const posts = await getData(selectedButton);
                return { type: selectedButton, posts };
            }

            // Hem gelir hem gider istenirse
            const [incomePosts, expensePosts] = await Promise.all([
                getData("Gelir"),
                getData("Gider")
            ]);

            return {
                type: "Hepsi",
                incomePosts,
                expensePosts,
                all: [...incomePosts, ...expensePosts],
            };

        } catch (error) {
            console.error("Yıl verisi alınamadı:", error);
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
        yearlyPostDatas: [],
        incomeYearlyPostDatas: [],
        expenseYearlyPostDatas: [],
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
            })

            // Get yearly post data (income / expense / both)
            .addCase(getYearlyPostData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getYearlyPostData.fulfilled, (state, action) => {
                state.loading = false;
                const { type } = action.payload;

                if (type === "Gelir") {
                    state.incomeYearlyPostDatas = action.payload.posts;
                } else if (type === "Gider") {
                    state.expenseYearlyPostDatas = action.payload.posts;
                } else if (type === "Hepsi") {
                    state.incomeYearlyPostDatas = action.payload.incomePosts;
                    state.expenseYearlyPostDatas = action.payload.expensePosts;
                }

                state.yearlyPostDatas = [...state.incomeYearlyPostDatas, ...state.expenseYearlyPostDatas];
            })
            .addCase(getYearlyPostData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },

});

export default homePageSlice.reducer;
