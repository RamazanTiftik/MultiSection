import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';


const CustomFlatBarChart = ({ data, onPressAction, type, winter1, winter2, spring1, spring2, summer1, summer2, autumn1, autumn2 }) => {

    //change column colors according to seasons
    const getSeasonColor = (label) => {
        const winter = ['Aralık', 'Ocak', 'Şubat'];
        const spring = ['Mart', 'Nisan', 'Mayıs'];
        const summer = ['Haziran', 'Temmuz', 'Ağustos'];
        const autumn = ['Eylül', 'Ekim', 'Kasım'];

        if (winter.includes(label)) return [winter1 || '#a2d4f7', winter2 || '#71bde6'];
        if (spring.includes(label)) return [spring1 || '#b0f2b6', spring2 || '#81e58b'];
        if (summer.includes(label)) return [summer1 || '#ffe29a', summer2 || '#ffd36b'];
        if (autumn.includes(label)) return [autumn1 || '#ffccaa', autumn2 || '#ffb488'];
        return '#ddd';
    };

    const [selectedItem, setSelectedItem] = useState("");

    const maxValue = Math.max(...data.map(item => {
        return type === "Özet"
            ? Math.max(item.income || 0, item.expense || 0)
            : item.value || 0;
    }));
    const chartHeight = 200;

    const columnClickHandle = (item) => {
        setSelectedItem(item);
        onPressAction?.(item);
    };

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: "#ffffff" }}>
            <FlatList
                horizontal
                data={data}
                keyExtractor={(item) => item.label}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isSelected = selectedItem?.label === item.label;

                    if (type === "Özet") {
                        // Çift sütunlu görünüm: income ve expense
                        const incomeHeight = (item.income / maxValue) * chartHeight;
                        const expenseHeight = (item.expense / maxValue) * chartHeight;

                        return (
                            <TouchableOpacity
                                onPress={() => columnClickHandle(item)}
                                style={{ alignItems: 'center', marginHorizontal: 8 }}
                            >
                                <View style={{ height: chartHeight, flexDirection: "row", alignItems: 'flex-end' }}>
                                    {/* Income bar */}
                                    <View style={{
                                        height: incomeHeight || 4,
                                        width: 18,
                                        backgroundColor: "#56ab2f",
                                        marginHorizontal: 2,
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4,
                                        borderWidth: isSelected ? 2 : 0,
                                        borderColor: isSelected ? "#0275d8" : "transparent"
                                    }} />
                                    {/* Expense bar */}
                                    <View style={{
                                        height: expenseHeight || 4,
                                        width: 18,
                                        backgroundColor: "#e74c3c",
                                        marginHorizontal: 2,
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4,
                                        borderWidth: isSelected ? 2 : 0,
                                        borderColor: isSelected ? "#0275d8" : "transparent"
                                    }} />
                                </View>
                                <Text style={{ marginTop: 5, fontSize: 12 }}>{item.label}</Text>
                            </TouchableOpacity>
                        );
                    }

                    // Tek sütun: Gelir veya Gider
                    const barHeight = (item.value / maxValue) * chartHeight;
                    const gradientColors = getSeasonColor(item.label);

                    return (
                        <TouchableOpacity
                            onPress={() => columnClickHandle(item)}
                            style={{ alignItems: 'center', marginHorizontal: 8 }}
                        >
                            <View style={{
                                height: chartHeight,
                                width: 50,
                                position: 'relative',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}>
                                <LinearGradient
                                    colors={gradientColors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        height: barHeight || 3,
                                        width: 50,
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4,
                                        borderWidth: isSelected ? 2 : 0,
                                        borderColor: isSelected ? (type === "Gelir" ? '#56ab2f' : "#e74c3c") : 'transparent',
                                        shadowColor: isSelected ? '#000' : undefined,
                                        shadowOffset: isSelected ? { width: 0, height: 2 } : undefined,
                                        shadowOpacity: isSelected ? 0.25 : 0,
                                        shadowRadius: isSelected ? 3.84 : 0,
                                        elevation: isSelected ? 5 : 0
                                    }}
                                />
                            </View>
                            <Text style={{ marginTop: 5 }}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};


export default CustomFlatBarChart;

