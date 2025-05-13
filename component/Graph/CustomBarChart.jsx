// components/CustomBarChart.js
import React from 'react';
import { View, Dimensions, Text, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const CustomBarChart = ({ data, labels }) => {
    
    const chartData = {
        labels: labels,
        datasets: [{ data }],
    };

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        fillShadowGradient: '#3498db',
        fillShadowGradientOpacity: 1,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 2,
    };

    return (
        <View style={{ alignItems: 'center'}}>
            <ScrollView
                horizontal={true}
                style={{ backgroundColor: "white" }}
                showsHorizontalScrollIndicator={false}
                decelerationRate={0.2}
            >
                <BarChart
                    data={chartData}
                    width={screenWidth * 3}  // Daha fazla alan ekleyerek yatayda scroll yapabilmesini sağlarız
                    height={250}
                    chartConfig={chartConfig}
                    showValuesOnTopOfBars
                    verticalLabelRotation={40}
                    fromZero
                    withInnerLines={false}
                    withHorizontalLabels={false} // Y ekseni etiketlerini gizler
                    style={{
                        paddingHorizontal: 10,
                        marginLeft: -100, // Sol boşluğu temizler
                    }}
                />
            </ScrollView>
        </View>
    );
};

export default CustomBarChart;
