import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../../firebaseConfig/Firebase';
import { doc, getDoc, setDoc, query, collection, Timestamp, getDocs, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


// get all target plans
export const getAllTargetPlans = createAsyncThunk(
    'targetPlan/getAllTargetPlans',
    async ({ userId }, thunkAPI) => {
        try {
            //reference to the target plans collection
            const targetPlansRef = collection(db, "users", userId, "Target Plan");
            const q = query(targetPlansRef);
            const querySnapshot = await getDocs(q);

            const targetPlans = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
                };
            });

            return targetPlans;
        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


//update to target plan 
export const updateTargetPlanResult = createAsyncThunk(
    'targetPlan/updateTargetPlanResult',
    async ({ id, userId, month, isCompeleted, planResult }, thunkAPI) => {
        try {
            const targetRef = doc(db, 'users', userId, 'Target Plan', id);

            // If planResult is provided, use it to update the plan
            if (planResult) {

                // Firestore'da önce eski planResult'ı tamamen temizle
                await setDoc(targetRef, { planResult: {} }, { merge: true });

                // Sonra güncel veriyi yaz
                await setDoc(targetRef, { planResult }, { merge: true });

                return { id, planResult };
            }


            const docSnap = await getDoc(targetRef);

            if (!docSnap.exists()) {
                throw new Error('Plan bulunamadı');
            }

            const data = docSnap.data();

            // planResult object → array
            const updatedPlanResult = Object.values(data.planResult);

            if (updatedPlanResult[month]) {
                updatedPlanResult[month].tamamlandi = isCompeleted;
                updatedPlanResult[month].durum = isCompeleted ? 'success' : 'fail';
            }

            // array → object
            const newPlanResult = updatedPlanResult.reduce((acc, item, idx) => {
                acc[idx] = item;
                return acc;
            }, {});

            await setDoc(targetRef, { planResult: newPlanResult }, { merge: true });

            return { id, month, isCompeleted };
        } catch (error) {
            console.error("Update Target Plan Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// get a single target plan by ID
export const getTargetPlanById = createAsyncThunk(
    'targetPlan/getTargetPlanById',
    async ({ userId, id }, thunkAPI) => {
        try {
            const targetRef = doc(db, 'users', userId, 'Target Plan', id);
            const docSnap = await getDoc(targetRef);

            if (!docSnap.exists()) {
                throw new Error('Plan bulunamadı');
            }

            const data = docSnap.data();

            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
            };
        } catch (error) {
            console.error("Get Target Plan By ID Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// delete target plan
export const deleteTargetPlan = createAsyncThunk(
    'targetPlanner/deleteTargetPlan',
    async ({ userId, planId }, thunkAPI) => {
        try {
            const docRef = doc(db, 'users', userId, 'Target Plan', planId);
            await deleteDoc(docRef);
            return planId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


//save target plan
export const saveTargetPlan = createAsyncThunk(
    'targetPlan/saveTargetPlan',
    async ({ userId, goalName, goalAmount, selectedPlan, planResult, monthlySave, targetDate, downpaymentPercent }, thunkAPI) => {
        try {

            const targetPlanId = uuidv4(); // random id for target plan
            let targetPlanRef = ""

            targetPlanRef = doc(db, "users", userId, "Target Plan", targetPlanId);

            //save to firestore
            await setDoc(targetPlanRef, {
                id: targetPlanId,
                selectedPlan: selectedPlan,
                goalName: goalName,
                goalAmount: goalAmount,
                planResult: planResult.map(item => ({
                    ay: item.ay,
                    birikim: item.birikim,
                    key: item.key,
                    tamamlandi: false,
                    durum: ""
                })),
                monthlySave: monthlySave,
                targetDate: targetDate,
                downpaymentPercent: downpaymentPercent,
                createdAt: Timestamp.now(),
            });

            return {
                id: targetPlanId,
                selectedPlan,
                goalName,
                goalAmount,
                planResult,
                monthlySave,
                targetDate,
                downpaymentPercent,
                createdAt: new Date().toISOString() // Serileştir
            };

        } catch (error) {
            console.error("Firestore Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const targetPlannerSlice = createSlice({
    name: 'targetPlanner',
    initialState: {
        targetedPlans: [],
        loading: false,
        error: null,
        selectedPlan: {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Save Target Plan
            .addCase(saveTargetPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveTargetPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.targetedPlans.push(action.payload);
            })
            .addCase(saveTargetPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All Target Plans
            .addCase(getAllTargetPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTargetPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.targetedPlans = action.payload;
            })
            .addCase(getAllTargetPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Target Plan Result
            .addCase(updateTargetPlanResult.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTargetPlanResult.fulfilled, (state, action) => {
                state.loading = false;
                const { id, month, isCompeleted } = action.payload;

                const updatedPlan = state.targetedPlans.find(plan => plan.id === id);
                if (updatedPlan && updatedPlan.planResult && updatedPlan.planResult[month]) {
                    updatedPlan.planResult[month].tamamlandi = isCompeleted;
                    updatedPlan.planResult[month].durum = isCompeleted ? 'success' : 'fail';
                }
            })
            .addCase(updateTargetPlanResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Target Plan By ID
            .addCase(getTargetPlanById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTargetPlanById.fulfilled, (state, action) => {
                state.loading = false;

                const existingIndex = state.targetedPlans.findIndex(plan => plan.id === action.payload.id);
                if (existingIndex !== -1) {
                    // Plan zaten varsa güncelle
                    state.targetedPlans[existingIndex] = action.payload;
                } else {
                    // Plan listede yoksa ekle
                    state.targetedPlans.push(action.payload);
                }

                // Seçilen planı ayrı olarak sakla
                state.selectedPlan = action.payload;
            })
            .addCase(getTargetPlanById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Target Plan
            .addCase(deleteTargetPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTargetPlan.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;

                // targetedPlans listesinden çıkar
                state.targetedPlans = state.targetedPlans.filter(plan => plan.id !== action.payload);

                // Eğer silinen plan seçili plansa, temizle
                if (state.selectedPlan && state.selectedPlan.id === deletedId) {
                    state.selectedPlan = {};
                }
            })
            .addCase(deleteTargetPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    }

});

export default targetPlannerSlice.reducer;
