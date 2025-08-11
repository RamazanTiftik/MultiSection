import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomIcons from '../../../../component/CustomIcons';
import { themes } from '../../../../theme/Themes';
import AiAnalysisCard from '../../../../component/FlatListRow/AiAnalysisCard';
import { fetchExpense, fetchIncome } from '../../../../redux/slices/pluginSlice/AiAnalysisSlice';
import { runAI } from '../../../../firebaseConfig/AI'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomContainer from '../../../../component/CustomContainer';
import CustomIndicator from '../../../../component/CustomIndicator';


const AIAnalysisScreen = ({ navigation }) => {

    //ai chat
    const [aiResponse, setAiResponse] = useState('');

    //redux state
    const dispatch = useDispatch()
    const userId = useSelector((state) => state.auth.userId);
    const { income, expense } = useSelector(state => state.aiAnalysis);
    //theme - redux
    const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
    const theme = useSelector(state => state.theme.themes[selectedThemeId]);
    //loading - redux
    const authLoading = useSelector((state) => state.auth.loading)
    const aiAnalysisLoading = useSelector((state) => state.aiAnalysis.loading)
    const themeLoading = useSelector(state => state.theme.loading);
    const generalLoading = authLoading || aiAnalysisLoading || themeLoading

    //theme
    const secondaryColor = themes.colorTheme.secondary.color

    //ai chat loading 
    const [loading, setLoading] = useState(false);

    //local states
    const [totalIncomeLength, setTotalIncomeLength] = useState("0")
    const [totalExpenseLength, setTotalExpenseLength] = useState("0")
    const [monthlyIncome, setMonthlyIncome] = useState("0")
    const [monthlyExpense, setMonthlyExpense] = useState("0")
    const [dailyAverageIncome, setDailyAverageIncome] = useState("0");
    const [dailyAverageExpense, setDailyAverageExpense] = useState("0");
    const [repeatingIncomeCount, setRepeatingIncomeCount] = useState("0");
    const [repeatingExpenseCount, setRepeatingExpenseCount] = useState("0");
    const [lastIncome, setLastIncome] = useState("0");
    const [lastExpense, setLastExpense] = useState("0");
    const [maxIncomeBank, setMaxIncomeBank] = useState('');
    const [maxExpenseBank, setMaxExpenseBank] = useState('');
    const [maxIncome, setMaxIncome] = useState({ description: '', amount: 0 });
    const [maxExpense, setMaxExpense] = useState({ description: '', amount: 0 });
    const [balance, setBalance] = useState("0");
    const [mostExpenseCategory, setMostExpenseCategory] = useState("");


    //Back Button Func
    const backAction = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }]
        });
        return true;
    };

    //back button listener
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove()
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitleStyle: {
                color: theme.text || "#007AFF",
                fontSize: 18,
            },
            headerTitle: "Yapay Zeka Analizi",

            //back button
            headerLeft: () => (
                <TouchableOpacity onPress={() => backAction()}>
                    <CustomIcons icon={"Back"} />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: secondaryColor,
            },
        });
    }, [navigation]);


    //when screen focused
    useEffect(() => {
        //fetch income and expense data
        dispatch(fetchIncome({ userId }));
        dispatch(fetchExpense({ userId }));

    }, [dispatch, userId]);


    //CALCULATIONS
    useEffect(() => {

        //Monthly income and expense
        const totalMonthlyIncome = income.reduce((sum, item) => sum + item.amount, 0);
        const totalMonthlyExpense = expense.reduce((sum, item) => sum + item.amount, 0);
        setMonthlyIncome(totalMonthlyIncome.toString());
        setMonthlyExpense(totalMonthlyExpense.toString());


        //total income and expense length
        setTotalIncomeLength(income.length.toString());
        setTotalExpenseLength(expense.length.toString());


        //Average daily income and expense
        const daysInMonth = new Date().getDate(); //get current day of the month
        const avgDailyIncome = totalMonthlyIncome / daysInMonth;
        const avgDailyExpense = totalMonthlyExpense / daysInMonth;
        setDailyAverageIncome(avgDailyIncome.toFixed(2).toString());
        setDailyAverageExpense(avgDailyExpense.toFixed(2).toString());


        //Repeating income and expense count
        const repeatingIncomes = income.filter(item => item.isMonthly === true).length;
        const repeatingExpenses = expense.filter(item => item.isMonthly === true).length;
        setRepeatingIncomeCount(repeatingIncomes.toString());
        setRepeatingExpenseCount(repeatingExpenses.toString());


        //Last income
        if (income.length > 0) {
            const latestIncome = income.reduce((latest, item) => {
                return new Date(item.createdAt) > new Date(latest.createdAt) ? item : latest;
            });
            setLastIncome(latestIncome.amount.toString());
        } else {
            setLastIncome("0");
        }
        //Last expense
        if (expense.length > 0) {
            const latestExpense = expense.reduce((latest, item) => {
                return new Date(item.createdAt) > new Date(latest.createdAt) ? item : latest;
            });
            setLastExpense(latestExpense.amount.toString());
        } else {
            setLastExpense("0");
        }


        //Most income bank
        const incomeByBank = income.reduce((acc, item) => {
            acc[item.bankName] = (acc[item.bankName] || 0) + item.amount.toFixed(2).toString();
            return acc;
        }, {});
        const maxIncomeBank = Object.entries(incomeByBank).reduce(
            (max, [bank, amount]) => (amount > max.amount ? { bank, amount } : max),
            { bank: '', amount: 0 }
        );
        //Most expense bank
        const expenseByBank = expense.reduce((acc, item) => {
            acc[item.bankName] = (acc[item.bankName] || 0) + item.amount.toFixed(2).toString();
            return acc;
        }, {});
        const maxExpenseBank = Object.entries(expenseByBank).reduce(
            (max, [bank, amount]) => (amount > max.amount ? { bank, amount } : max),
            { bank: '', amount: 0 }
        );
        setMaxIncomeBank(maxIncomeBank.bank);
        setMaxExpenseBank(maxExpenseBank.bank);


        //Max income
        if (income.length > 0) {
            const highestIncome = income.reduce((prev, current) =>
                current.amount > prev.amount ? current : prev
            );
            setMaxIncome(highestIncome);
        }
        //Max expense
        if (expense.length > 0) {
            const highestExpense = expense.reduce((prev, current) =>
                current.amount > prev.amount ? current : prev
            );
            setMaxExpense(highestExpense);
        }


        //Balance
        const calculatedBalance = totalMonthlyIncome - totalMonthlyExpense;
        setBalance(calculatedBalance.toString());


        //Most expense category
        if (expense.length > 0) {
            const categoryCount = {};
            expense.forEach(item => {
                if (item.category in categoryCount) {
                    categoryCount[item.category]++;
                } else {
                    categoryCount[item.category] = 1;
                }
            });

            const mostUsed = Object.entries(categoryCount).reduce((prev, current) =>
                current[1] > prev[1] ? current : prev
            );

            setMostExpenseCategory(mostUsed[0]);
        }

    }, [income, expense]);


    const handleAnalyze = async () => {
        setLoading(true);
        setAiResponse('');

        const prompt = `
Aşağıdaki kullanıcı finansal verilerini analiz et:

Toplam Gelir: ${monthlyIncome}₺
Toplam Gider: ${monthlyExpense}₺
Günlük Ortalama Gelir: ${dailyAverageIncome}₺
Günlük Ortalama Gider: ${dailyAverageExpense}₺
Düzenli Gelir Sayısı: ${repeatingIncomeCount}
Düzenli Gider Sayısı: ${repeatingExpenseCount}
Son Gelir: ${lastIncome}₺
Son Gider: ${lastExpense}₺
En Yüksek Gelir: ${maxIncome.description} - ${maxIncome.amount}₺
En Yüksek Gider: ${maxExpense.description} - ${maxExpense.amount}₺
En Çok Gider Yapılan Kategori: ${mostExpenseCategory}
Gelir Bankası (en çok): ${maxIncomeBank}
Gider Bankası (en çok): ${maxExpenseBank}
Bilanço: ${balance}₺

Bu verileri değerlendirerek kısa ve sade bir mali analiz yap. Gerekiyorsa tasarruf önerileri ver. Giderlerde dikkat çeken kalemleri belirt. Yanıtın sade, net ve kullanıcı dostu olsun.
`;

        try {
            const response = await runAI(prompt);
            setAiResponse(response);
        } catch (error) {
            setAiResponse("Bir hata oluştu, lütfen tekrar deneyin.");
            console.error("AI Error:", error);
        } finally {
            setLoading(false);
        }
    };


    //VIEW
    if (generalLoading) {
        return (
            <View>
                <CustomIndicator />
            </View>
        )

    } else {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor, paddingTop: -30 }}>
                <CustomContainer>
                    <Text style={styles.header}>🧠 Harcama Analizi</Text>

                    {/* Özet Kartlar */}
                    <View style={styles.cardsContainer}>

                        {/* Mevcut kartlar */}
                        <AiAnalysisCard title="Aylık Gelir" value={monthlyIncome} type="money" />
                        <AiAnalysisCard title="Aylık Harcama" value={monthlyExpense} type="money" />

                        <AiAnalysisCard title="Günlük Ortalama Gelir" value={dailyAverageIncome} type="money" />
                        <AiAnalysisCard title="Günlük Ortalama Harcama" value={dailyAverageExpense} type="money" />

                        <AiAnalysisCard title="Toplam Gelir İşlemi" value={`${totalIncomeLength} işlem`} />
                        <AiAnalysisCard title="Toplam Harcama İşlemi" value={`${totalExpenseLength} işlem`} />

                        <AiAnalysisCard title="Aylık Düzenli Gelir Sayısı" value={`${repeatingIncomeCount} işlem`} />
                        <AiAnalysisCard title="Aylık Düzenli Harcama Sayısı" value={`${repeatingExpenseCount} işlem`} />

                        <AiAnalysisCard title="En Çok Gelir Alınan Banka" value={maxIncomeBank || 'Yok'} />
                        <AiAnalysisCard title="En Çok Harcama Yapılan Banka" value={maxExpenseBank || 'Yok'} />

                        <AiAnalysisCard title="Son Gelir" value={lastIncome} type="money" />
                        <AiAnalysisCard title="Son Harcama" value={lastExpense} type="money" />

                        <AiAnalysisCard
                            title="En Yüksek Gelir"
                            value={`${maxIncome.description} - ${maxIncome.amount}₺`}
                        />
                        <AiAnalysisCard
                            title="En Yüksek Harcama"
                            value={`${maxExpense.description} - ${maxExpense.amount}₺`}
                        />

                        <AiAnalysisCard
                            title="Bilanço (Gelir - Gider)"
                            value={`${balance}₺`}
                        />
                        <AiAnalysisCard
                            title="En Çok Harcama Kategorisi"
                            value={mostExpenseCategory}
                        />

                    </View>


                    {/* Analiz Butonu */}
                    <TouchableOpacity style={[styles.analyzeButton, { backgroundColor: theme.income1 || "#007AFF" }]} onPress={handleAnalyze} disabled={loading}>
                        <Text style={styles.analyzeButtonText}>
                            {loading ? "Analiz Ediliyor..." : "🧾 Analizi Başlat"}
                        </Text>
                    </TouchableOpacity>

                    {/* Loading */}
                    {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

                    {/* AI Yanıtı */}
                    {aiResponse !== '' && (
                        <View style={styles.resultBox}>
                            <Text style={styles.resultText}>{aiResponse}</Text>
                        </View>
                    )}
                </CustomContainer>
            </SafeAreaView>
        );
    }
};

export default AIAnalysisScreen;

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#007AFF',
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    analyzeButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    analyzeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loader: {
        marginTop: 20,
    },
    resultBox: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#e3f2fd',
        borderRadius: 12,
        borderLeftWidth: 5,
        borderLeftColor: '#007AFF',
    },
    resultText: {
        fontSize: 16,
        color: '#343a40',
        lineHeight: 24,
    },
});
