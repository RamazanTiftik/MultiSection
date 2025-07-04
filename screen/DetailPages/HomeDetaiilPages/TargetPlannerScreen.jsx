import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    SafeAreaView,
} from 'react-native';

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

const TargetPlannerScreen = () => {
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [monthlySave, setMonthlySave] = useState('');
    const [downpaymentPercent, setDownpaymentPercent] = useState('20'); // varsayılan %20 peşinat
    const [targetDate, setTargetDate] = useState(''); // yyyy-mm formatında girilecek
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [planResult, setPlanResult] = useState([]);

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

    const handlePlanSelection = (planType) => {
        setSelectedPlan(planType);
        setPlanResult([]); // Önceki sonucu temizle
    };

    const calculatePlan = (planType) => {
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

            case 'downpayment':
                if (!downpayment || downpayment <= 0 || downpayment >= 100) {
                    setPlanResult([]);
                    return;
                }
                {
                    const pesinat = (amount * downpayment) / 100;
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
            alert('Lütfen bir plan seçin.');
            return;
        }
        calculatePlan(selectedPlan);
    };

    const handleSave = () => {
        if (!goalName || !goalAmount || !selectedPlan || planResult.length === 0) {
            alert('Lütfen tüm bilgileri doldurun ve bir plan seçin.');
            return;
        }

        const savedData = {
            hedef: goalName,
            tutar: goalAmount,
            planTuru: selectedPlan,
            aylikPlan: planResult,
        };

        console.log('✅ Kaydedilen Plan:', savedData);
        alert('Plan başarıyla kaydedildi!');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
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

                {/* Peşinat planı için peşinat yüzdesi */}
                {selectedPlan === 'downpayment' && (
                    <TextInput
                        placeholder="Peşinat Yüzdesi (%)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={downpaymentPercent}
                        onChangeText={setDownpaymentPercent}
                    />
                )}

                {/* Tarih bazlı plan için hedef tarih */}
                {selectedPlan === 'dateBased' && (
                    <TextInput
                        placeholder="Hedef Tarih (YYYY-MM)"
                        style={styles.input}
                        value={targetDate}
                        onChangeText={setTargetDate}
                    />
                )}

                <Text style={styles.subtitle}>🧮 Bir Plan Seç</Text>

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

                {/* Hesapla Butonu */}
                <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                    <Text style={styles.buttonText}>Hesapla</Text>
                </TouchableOpacity>

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

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>Kaydet</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TargetPlannerScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#E6F0FF',
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
        padding: 14,
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
