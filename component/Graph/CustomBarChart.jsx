import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import TextView from '../TextView';


const { width: screenWidth } = Dimensions.get('window');

//change column colors according to seasons
const getSeasonColor = (label) => {
    const winter = ['Aralık', 'Ocak', 'Şubat'];
    const spring = ['Mart', 'Nisan', 'Mayıs'];
    const summer = ['Haziran', 'Temmuz', 'Ağustos'];
    const autumn = ['Eylül', 'Ekim', 'Kasım'];

    if (winter.includes(label)) return ['#a2d4f7', '#71bde6'];
    if (spring.includes(label)) return ['#b0f2b6', '#81e58b'];
    if (summer.includes(label)) return ['#ffe29a', '#ffd36b'];
    if (autumn.includes(label)) return ['#ffccaa', '#ffb488'];
    return '#ddd';
};


const CustomFlatBarChart = ({ data, onPressAction, type }) => {

    const [bgColor, setBgColor] = useState('#ffffff');
    const [selectedItem, setSelectedItem] = useState("")

    const maxValue = Math.max(...data.map(item => item.value));
    const chartHeight = 200;


    const columnClickHandle = (item) => {
        setSelectedItem(item)
        onPressAction?.(item)
    }


    return (
        <View style={{ flex: 1, backgroundColor: bgColor, padding: 10 }}>
            <FlatList
                horizontal
                data={data}
                keyExtractor={(item) => item.label}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => {
                    const barHeight = (item.value / maxValue) * chartHeight;
                    const gradientColors = getSeasonColor(item.label);
                    const isSelected = selectedItem?.label === item.label;

                    return (
                        <TouchableOpacity
                            onPress={() => columnClickHandle(item)}
                            style={{ alignItems: 'center', marginHorizontal: 8 }}
                        >
                            <View style={{
                                height: chartHeight,
                                justifyContent: 'flex-end',
                                alignItems: "center"
                            }}>
                                <TextView
                                    label={item.value}
                                    textStyle={{ fontSize: 16, fontWeight: "500", color: "gray" }}
                                />

                                <LinearGradient
                                    colors={gradientColors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={{
                                        height: barHeight,
                                        width: 50,
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4,
                                        borderWidth: isSelected ? 2 : 0,
                                        borderColor: isSelected ? type==="Gelir" ? '#56ab2f' : "#e74c3c" : 'transparent',
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
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default CustomFlatBarChart;

