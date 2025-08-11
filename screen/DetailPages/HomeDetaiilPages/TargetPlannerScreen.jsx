import  { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    SafeAreaView,
    BackHandler,
} from 'react-native';
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import CustomPopup from '../../../component/CustomPopup';
import { useDispatch, useSelector } from 'react-redux';
import { saveTargetPlan } from '../../../redux/slices/pluginSlice/TargetPlannerSlice';
import CustomFlatList from '../../../component/CustomFlatlist';


const plans = [
    {
        id: '1',
        title: 'Sabit Aylık Ödeme',
        description: 'Her ay sabit miktarda ödeme yaparak hedefe ulaş.',
        type: 'fixed',
    },
    {
        id: '2',
        title: 'Artan Ödeme Planı',
        description: 'Her ay ödeme miktarını artırarak hedefe daha hızlı ulaş.',
        type: 'increasing',
    },
    {
        id: '3',
        title: 'Peşinat + Taksit',
        description: 'İlk peşinatla başla, kalanını aylık taksitlerle tamamla.',
        type: 'downpayment',
    },
    {
        id: '4',
        title: 'Tarih Belirle',
        description: 'Bir hedef tarihi gir, ne kadar biriktirmen gerektiğini öğren.',
        type: 'dateBased',
    },
];


const TargetPlannerScreen = ({ navigation }) => {

    //theme
    const secondaryColor = themes.colorTheme.secondary.color
    const card = themes.card.cardView
    const text = themes.textTheme.text

    //redux
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId);
    //theme - redux
    const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
    const theme = useSelector(state => state.theme.themes[selectedThemeId]);

    //loading state
    const [loading, setLoading] = useState(false)

    //local state variables
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [monthlySave, setMonthlySave] = useState('');
    const [downpaymentPercent, setDownpaymentPercent] = useState('');
    const [targetDate, setTargetDate] = useState(''); // yyyy-mm formatında girilecek
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [planResult, setPlanResult] = useState([]);
    const [isCalculated, setIsCalculated] = useState(false)

    //popup alert visible
    const [showPopup, setShowPopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState("")
    const [popupType, setpopupType] = useState("")

    //dataBased plan state
    const years = [
        { id: 1, value: 2025 }, { id: 2, value: 2026 }, { id: 3, value: 2027 },
        { id: 4, value: 2028 }, { id: 5, value: 2029 }, { id: 6, value: 2030 },
        { id: 7, value: 2031 }, { id: 8, value: 2032 }, { id: 9, value: 2033 },
        { id: 10, value: 2034 }, { id: 11, value: 2035 }, { id: 12, value: 2036 }
    ]
    const months = [
        { id: 1, value: "Ocak" }, { id: 2, value: "Şubat" }, { id: 3, value: "Mart" },
        { id: 4, value: "Nisan" }, { id: 5, value: "Mayıs" }, { id: 6, value: "Haziran" },
        { id: 7, value: "Temmuz" }, { id: 8, value: "Ağustos" }, { id: 9, value: "Eylül" },
        { id: 10, value: "Ekim" }, { id: 11, value: "Kasım" }, { id: 12, value: "Aralık" }
    ]

    const [selectedYear, setSelectedYear] = useState(years[0]);
    const [selectedMonth, setSelectedMonth] = useState(months[0]);

    //Back Button Func
    const backAction = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "Target Planner List" }]
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

    //Back Button and Header Options
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitleStyle: {
                color: theme.text || "#007AFF",
                fontSize: 18,
                backgroundColor: "red"
            },
            headerTitle: "Hedef Planlama",
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


    // Aylar farkı hesapla (yyyy-mm format)
    const getMonthsDiff = (target) => {
        if (!target) return 0;
        const [year, month] = target.split('-').map(Number);
        if (!year || !month) return 0;
        const now = new Date();
        const targetDateObj = new Date(year, month - 1);
        let diff = (targetDateObj.getFullYear() - now.getFullYear()) * 12;
        diff += targetDateObj.getMonth() - now.getMonth();
        return diff > 0 ? diff : 0;
    };


    //cahnge target date when year or month changes
    useEffect(() => {
        if (selectedYear && selectedMonth) {
            setTargetDate(`${selectedYear.value}-${selectedMonth.id}`);
        }
    }, [selectedYear, selectedMonth]);


    //handle plan selection
    const handlePlanSelection = (planType) => {
        setSelectedPlan(planType);
        setPlanResult([]); //clear previous results
    };


    //after popup closed
    const navigateHandle = () => {
        setGoalAmount('')
        setGoalName('')
        setMonthlySave('')
        setDownpaymentPercent('')
        setTargetDate('')
        setSelectedPlan(null)
        setPlanResult([])
        setShowPopup(false)

        if (popupType === 'success') {
            //navigate to list screen
            navigation.navigate("Target Planner List")

            setpopupType('')
            setPopupMessage('')
        } else {
            setpopupType('')
            setPopupMessage('')
        }

    }


    //calculate plan based on selected type
    const calculatePlan = (planType) => {

        //for save button
        setIsCalculated(true);

        const amount = parseFloat(goalAmount);
        const monthly = parseFloat(monthlySave);
        const downpayment = parseFloat(downpaymentPercent);
        const monthsToTarget = getMonthsDiff(targetDate);

        if (!amount || amount <= 0) {
            setPlanResult([]);
            return;
        }

        let newPlan = [];

        switch (planType) {

            // Sabit Aylık Ödeme Planı
            case 'fixed':
                if (!monthly || monthly <= 0) {
                    setPlanResult([]);
                    return;
                }
                {
                    const months = Math.ceil(amount / monthly);
                    for (let i = 1; i <= months; i++) {
                        const ay = `Ay ${i}`;
                        const birikim = i < months ? monthly : (amount - monthly * (months - 1));
                        newPlan.push({ key: `${i}`, ay, birikim: birikim.toFixed(2) });
                    }
                }
                break;

            // Artan Ödeme Planı
            case 'increasing':
                if (!monthly || monthly <= 0) {
                    setPlanResult([]);
                    return;
                }
                {
                    const increaseRate = 0.1; // %10 artış
                    let totalSaved = 0;
                    let payment = monthly;
                    let i = 1;
                    while (totalSaved < amount) {
                        const ay = `Ay ${i}`;
                        let birikim = payment;
                        if (totalSaved + birikim > amount) {
                            birikim = amount - totalSaved;
                        }
                        newPlan.push({ key: `${i}`, ay, birikim: birikim.toFixed(2) });
                        totalSaved += birikim;
                        payment = payment * (1 + increaseRate);
                        i++;
                    }
                }
                break;

            // Peşinat + Taksit Planı
            case 'downpayment':
                if (!downpayment || downpayment <= 0) {
                    setPlanResult([]);
                    return;
                }
                {
                    const pesinat = downpayment;
                    const kalan = amount - pesinat;
                    if (!monthly || monthly <= 0) {
                        setPlanResult([]);
                        return;
                    }
                    const taksitSayisi = Math.ceil(kalan / monthly);

                    newPlan.push({ key: '0', ay: 'Peşinat', birikim: pesinat.toFixed(2) });
                    for (let i = 1; i <= taksitSayisi; i++) {
                        const ay = `Taksit ${i}`;
                        const birikim = i < taksitSayisi ? monthly : (kalan - monthly * (taksitSayisi - 1));
                        newPlan.push({ key: `${i}`, ay, birikim: birikim.toFixed(2) });
                    }
                }
                break;

            // Tarih Bazlı Plan
            case 'dateBased':
                if (!targetDate || monthsToTarget <= 0) {
                    setPlanResult([]);
                    return;
                }
                {
                    const months = monthsToTarget;
                    const aylik = amount / months;
                    for (let i = 1; i <= months; i++) {
                        const ay = `Ay ${i}`;
                        newPlan.push({ key: `${i}`, ay, birikim: aylik.toFixed(2) });
                    }
                }
                break;

            default:
                newPlan = [];
        }

        setPlanResult(newPlan);
    };

    const handleCalculate = () => {
        if (!selectedPlan) {
            setPopupMessage('Lütfen bir plan seçin.');
            setpopupType('error');
            setShowPopup(true);
            return;

        } else if (!goalName || !goalAmount || (selectedPlan !== 'dateBased' && !monthlySave) || (selectedPlan === 'downpayment' && !downpaymentPercent)) {
            setPopupMessage('Lütfen tüm bilgileri doldurun.');
            setpopupType('error');
            setShowPopup(true);
            return;

        } else {
            //calculate the plan
            calculatePlan(selectedPlan);
        }
    }

    const handleSave = () => {
        if (isCalculated) {
            if (!selectedPlan) {
                setPopupMessage('Lütfen bir plan seçin.');
                setpopupType('error');
                setShowPopup(true);
                return;

            } else if (!goalName || !goalAmount || (selectedPlan !== 'dateBased' && !monthlySave) || (selectedPlan === 'downpayment' && !downpaymentPercent)) {
                setPopupMessage('Lütfen tüm bilgileri doldurun.');
                setpopupType('error');
                setShowPopup(true);
                return;

            } else {
                const isSaved = dispatch(saveTargetPlan({ userId, selectedPlan, goalName, goalAmount, selectedPlan, planResult, monthlySave, targetDate, downpaymentPercent }));

                if (isSaved) {
                    setPopupMessage('Hedefiniz başarıyla kaydedilmiştir.');
                    setpopupType('success');
                    setShowPopup(true);
                }
            }
            setIsCalculated(false); // Reset after saving

        } else {
            setPopupMessage('Lütfen önce planı hesaplayın.');
            setpopupType('error');
            setShowPopup(true);
        }

    };


    //VIEW
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: secondaryColor }]}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <Text style={styles.title}>🎯 Hedef Planlayıcı</Text>

                <TextInput
                    placeholder="Hedef Adı"
                    style={styles.input}
                    value={goalName}
                    onChangeText={setGoalName}
                />

                <TextInput
                    placeholder="Hedef Tutarı (₺)"
                    style={styles.input}
                    keyboardType="numeric"
                    value={goalAmount}
                    onChangeText={setGoalAmount}
                />


                {/* Sabit ve Artan ödeme planları için aylık tasarruf */}
                {(selectedPlan === 'fixed' || selectedPlan === 'increasing' || selectedPlan === 'downpayment') && (
                    <TextInput
                        placeholder="Aylık Tasarruf Miktarı (₺)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={monthlySave}
                        onChangeText={setMonthlySave}
                    />
                )}


                {/* Peşinat planı için peşinat miktarı */}
                {selectedPlan === 'downpayment' && (
                    <TextInput
                        placeholder="Peşinat Miktarı (₺)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={downpaymentPercent}
                        onChangeText={setDownpaymentPercent}
                    />
                )}


                {/* Tarih bazlı plan için hedef tarih */}
                {selectedPlan === 'dateBased' && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <CustomFlatList
                                data={years}
                                selectedValue={selectedYear}
                                onValueChange={setSelectedYear}
                                width={170}
                            />
                        </View>

                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <CustomFlatList
                                data={months}
                                selectedValue={selectedMonth}
                                onValueChange={setSelectedMonth}
                                width={170}
                            />
                        </View>
                    </View>
                )}


                <Text style={styles.subtitle}>🧮 Bir Plan Seç</Text>

                {/* Plans */}
                <FlatList
                    data={plans}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.planCard,
                                selectedPlan === item.type && styles.planCardSelected,
                            ]}
                            onPress={() => handlePlanSelection(item.type)}
                        >
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDesc}>{item.description}</Text>
                        </TouchableOpacity>
                    )}
                />


                {/* Calculate Button */}
                <TouchableOpacity style={[styles.calculateButton, {backgroundColor: theme.summary1 || "#007bff"}]} onPress={handleCalculate}>
                    <Text style={styles.buttonText}>Hesapla</Text>
                </TouchableOpacity>


                {/* Target Plan Results */}
                {planResult.length > 0 && (
                    <View style={styles.planContainer}>
                        <Text style={styles.planTitle}>📅 Aylık Plan ({goalName})</Text>
                        {planResult.map((item) => (
                            <View key={item.key} style={styles.planItem}>
                                <Text>{item.ay}</Text>
                                <Text>{item.birikim} ₺</Text>
                            </View>
                        ))}
                    </View>
                )}


                {/* Save Button */}
                <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.income1 || "#28A745" }]} onPress={handleSave}>
                    <Text style={styles.buttonText}>Kaydet</Text>
                </TouchableOpacity>


                {/* Custom Popup */}
                <CustomPopup
                    visible={showPopup}
                    message={popupMessage}
                    onClose={navigateHandle}
                    type={popupType}
                />


            </ScrollView>
        </SafeAreaView>
    );
};


export default TargetPlannerScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 16,
        paddingBottom: 110,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    subtitle: {
        fontSize: 18,
        marginVertical: 10,
        fontWeight: '600',
    },
    planCard: {
        backgroundColor: '#ffffffcc',
        padding: 17,
        borderRadius: 12,
        marginRight: 10,
        width: 220,
        elevation: 3,
    },
    planCardSelected: {
        borderColor: '#4A90E2',
        borderWidth: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 14,
        color: '#444',
    },
    calculateButton: {
        backgroundColor: '#007bff',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    saveButton: {
        backgroundColor: '#28A745',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    planContainer: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    planItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});
