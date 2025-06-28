import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomContainer from '../component/CustomContainer'
import TextView from '../component/TextView'
import { themes } from '../theme/Themes'
import CustomIcons from '../component/CustomIcons'
import CustomFlatList from '../component/CustomFlatlist'
import CustomBarChart from '../component/Graph/CustomBarChart'
import AccountTransactionsRow from '../component/FlatListRow/AccountTransactionsRow'
import { runAI } from '../firebaseConfig/AI'
import { useDispatch, useSelector } from 'react-redux'
import { getFilteredPostData, getYearlyPostData } from '../redux/slices/HomePageSlice'

const HomeScreen = ({ navigation }) => {

  //button
  const [selectedButton, setSelectedButton] = useState("Gelir")

  const data = [
    { label: 'Ocak', value: 50 },
    { label: 'Şubat', value: 70 },
    { label: 'Mart', value: 90 },
    { label: 'Nisan', value: 60 },
    { label: 'Mayıs', value: 40 },
    { label: 'Haziran', value: 100 },
    { label: 'Temmuz', value: 30 },
    { label: 'Ağustos', value: 20 },
    { label: 'Eylül', value: 80 },
    { label: 'Ekim', value: 45 },
    { label: 'Kasım', value: 55 },
    { label: 'Aralık', value: 75 },
  ];

  //redux state
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.auth.userId);
  const postDatas = useSelector((state) => state.homePage.filteredPostDatas);
  const yearlyPostDatas = useSelector((state) => state.homePage.yearlyPostDatas);

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const tertiaryColor = themes.colorTheme.tertiary.color
  const text = themes.textTheme.text
  const card = themes.card.cardView
  const titleTxt = themes.textTheme.titleTxt
  const profileText = themes.textTheme.profileText


  //selectedColumn state from component
  const [selectedItem, setSelectedItem] = useState({})


  //top bar buttons
  const incomeButtonHandle = () => {
    setSelectedButton("Gelir")
  }

  const outcomeButtonHandle = () => {
    setSelectedButton("Gider")
  }

  const summaryButtonHandle = () => {
    setSelectedButton("Özet")
  }


  // Function to generate years dynamically
  const generateYears = (range = 3) => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = -range; i <= range; i++) {
      years.push({ id: currentYear + i, value: String(currentYear + i) });
    }

    return years;
  };

  const [years] = useState(generateYears());
  const [selectedYear, setSelectedYear] = useState(
    years.find(item => item.value === String(new Date().getFullYear()))
  );


  //Get filtered post data based on selected month and year
  useEffect(() => {

    //for graph data
    if (userId && selectedYear && selectedButton) {
      dispatch(getYearlyPostData({
        userId,
        selectedButton,
        year: selectedYear.value,
      }));
    }

    //account transactions
    if (!selectedItem.label) return; // If no month is selected, do not dispatch
    dispatch(getFilteredPostData({
      userId,
      selectedButton,
      month: selectedItem.label,
      year: selectedYear.value
    }));
  }, [userId, selectedButton, selectedItem, selectedYear]);


  // Group yearly post data by month -> for graph
  const groupedData = Array(12).fill(0);

  yearlyPostDatas.forEach(item => {
    if (item.createdAt) {
      const date = new Date(item.createdAt); // ✅ Date objesi
      const monthIndex = date.getMonth(); // ✅ 0-11 arası ay
      groupedData[monthIndex] += item.amount || 0;
    }
  });


  const chartData = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ].map((label, i) => ({
    label,
    value: groupedData[i]
  }));

  const selectedMonthData = chartData.find(item => item.label === selectedItem.label);


  /*   runAI("Merhaba, nasılsın?").then(response => {
      console.log("AI Response:", response);
    }) */

  //VIEW
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor }}>
      <CustomContainer>

        {/* Up Bar Buttons */}
        <View style={styles.upBar}>

          {/* Income Butonu */}
          <LinearGradient
            colors={selectedButton === "Gelir" ? ['#56ab2f', '#a8e063'] : [tertiaryColor, tertiaryColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtn}
          >
            <TouchableOpacity
              style={styles.touchable}
              onPress={incomeButtonHandle}
            >
              <Text style={selectedButton === "Gelir" ? styles.selectedBtnText : styles.btnText}>{"Gelir"}</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Outcome Butonu */}
          <LinearGradient
            colors={selectedButton === "Gider" ? ['#e74c3c', '#f1948a'] : [tertiaryColor, tertiaryColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtn}
          >
            <TouchableOpacity
              style={styles.touchable}
              onPress={outcomeButtonHandle}
            >
              <Text style={selectedButton === "Gider" ? styles.selectedBtnText : styles.btnText}>{"Gider"}</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Summary Butonu */}
          <LinearGradient
            colors={selectedButton === "Özet" ? ['#e74c3c', '#f1948a'] : [tertiaryColor, tertiaryColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtn}
          >
            <TouchableOpacity
              style={styles.touchable}
              onPress={summaryButtonHandle}
            >
              <Text style={selectedButton === "Özet" ? styles.selectedBtnText : styles.btnText}>{"Özet"}</Text>
            </TouchableOpacity>
          </LinearGradient>

        </View>


        {/* Main Card */}
        <View style={[card, { alignItems: "flex-start", marginTop: 15, paddingHorizontal: 15 }]}>

          {/* Top Infos */}
          <View style={styles.upperInUpBar}>

            {/* Mounthly Amount */}
            <TextView
              label={
                selectedMonthData
                  ? `${selectedMonthData.value.toLocaleString("tr-TR")} ₺`
                  : "-"
              }
              textStyle={styles.amountMounthly}
            />


            {/* Years Dropdown */}
            <View>
              <CustomFlatList
                data={years}
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
                width={130}
              />
            </View>

          </View>


          {/* Date */}
          {!!selectedItem.label && (
            <View>
              <TextView label={`${selectedItem.label} ${selectedYear.value}`} textStyle={styles.dateText} />
            </View>
          )}


          {/* Graph */}
          <View style={styles.graphCon}>
            <View style={{ flex: 1 }}>
              <CustomBarChart
                data={chartData}
                onPressAction={(selected) => {
                  setSelectedItem(selected)
                }}
                type={selectedButton}
              />
            </View>
          </View>

        </View>


        {/* Account Transactions */}
        {!!selectedItem.label && (
          <View style={styles.bottomCard}>
            <View style={{ marginBottom: 10 }}>
              <TextView label={`${selectedItem.label} ${selectedYear.value} Hareketleri`} textStyle={titleTxt} />
            </View>

            {postDatas.map(item => (
              <View key={item.id} style={card}>
                <AccountTransactionsRow
                  title={item.description || "Açıklama Yok"}
                  amount={item.amount || "0,00"}
                  date={
                    item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('tr-TR')
                      : "Tarih Yok"
                  }
                  type={item.category ? "Gider" : "Gelir"}
                />
              </View>
            ))}

          </View>
        )}


      </CustomContainer>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  upBar: {
    backgroundColor: "#f3f3f3",
    height: 50,
    width: "100%",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: 5
  },
  gradientBtn: {
    borderRadius: 15,
    width: 115,
    height: 40,
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15
  },
  upperInUpBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  amountMounthly: {
    color: "#007AFF",
    fontSize: 22,
    fontWeight: "600"
  },
  dateText: {
    color: "gray",
    fontSize: 14
  },
  graphCon: {
    width: "100%",
    height: 250,
    backgroundColor: "gray",
    marginTop: 10
  },
  bottomCard: {
    width: "100%",
    height: "auto",
    marginTop: 10
  },
  selectedBtnText: {
    fontWeight: 600,
    fontSize: 18,
    color: "#000000"
  },
  btnText: {
    color: "#999999",
    fontSize: 18,
    fontWeight: 600
  },
})