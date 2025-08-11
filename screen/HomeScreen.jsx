import { LinearGradient } from 'expo-linear-gradient'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import CustomContainer from '../component/CustomContainer'
import TextView from '../component/TextView'
import { themes } from '../theme/Themes'
import CustomFlatList from '../component/CustomFlatlist'
import CustomBarChart from '../component/Graph/CustomBarChart'
import AccountTransactionsRow from '../component/FlatListRow/AccountTransactionsRow'
import { useDispatch, useSelector } from 'react-redux'
import { getFilteredPostData, getYearlyPostData } from '../redux/slices/HomePageSlice'
import ModalContent from '../component/ModalContent'

const HomeScreen = ({ navigation }) => {

  //button
  const [selectedButton, setSelectedButton] = useState("Gelir")

  //redux state
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.auth.userId);
  const postDatas = useSelector((state) => state.homePage.filteredPostDatas);
  const yearlyPostDatas = useSelector((state) => state.homePage.yearlyPostDatas);
  const incomeYearlyPostDatas = useSelector((state) => state.homePage.incomeYearlyPostDatas);
  const expenseYearlyPostDatas = useSelector((state) => state.homePage.expenseYearlyPostDatas);
  //theme - redux
  const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
  const theme = useSelector(state => state.theme.themes[selectedThemeId]);

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const tertiaryColor = themes.colorTheme.tertiary.color
  const card = themes.card.cardView
  const titleTxt = themes.textTheme.titleTxt

  //local account transactions state
  const [transactionsToShow, setTransactionsToShow] = useState([])


  //selectedColumn state from component
  const [selectedItem, setSelectedItem] = useState({})

  //modal visible state
  const [isModalVisible, setIsModalVisible] = useState(false);



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
    if (userId && selectedYear) {
      dispatch(getYearlyPostData({ userId, selectedButton: "Gelir", year: selectedYear.value }))
      dispatch(getYearlyPostData({ userId, selectedButton: "Gider", year: selectedYear.value }))
    }

    //account transactions
    if (!selectedItem.label) return; // If no month is selected, do not dispatch

    else if (selectedButton === "Özet") {
      dispatch(getYearlyPostData({ userId, year: selectedYear.value }));

    } else {
      dispatch(getFilteredPostData({
        userId,
        selectedButton,
        month: selectedItem.label,
        year: selectedYear.value
      }));
    }

  }, [userId, selectedButton, selectedItem, selectedYear]);


  // Group yearly post data by month -> for graph
  const groupedData = Array(12).fill(0);

  selectedButton === "Gelir"
    ? incomeYearlyPostDatas.forEach(item => {
      if (item.createdAt) {
        const date = new Date(item.createdAt); // ✅ Date objesi
        const monthIndex = date.getMonth(); // ✅ 0-11 arası ay
        groupedData[monthIndex] += item.amount || 0;
      }
    })
    : expenseYearlyPostDatas.forEach(item => {
      if (item.createdAt) {
        const date = new Date(item.createdAt); // ✅ Date objesi
        const monthIndex = date.getMonth(); // ✅ 0-11 arası ay
        groupedData[monthIndex] += item.amount || 0;
      }
    })


  // Prepare chart data -> for graph
  const chartData = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ].map((label, i) => ({
    label,
    value: groupedData[i]
  }));

  const selectedMonthData = chartData.find(item => item.label === selectedItem.label);


  // Prepare summary chart data -> for summary graph
  const summaryChartData = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ].map((label, i) => {
    const income = incomeYearlyPostDatas.reduce((acc, item) => {
      const date = new Date(item.createdAt);
      if (date.getMonth() === i) acc += item.amount || 0;
      return acc;
    }, 0);

    const expense = expenseYearlyPostDatas.reduce((acc, item) => {
      const date = new Date(item.createdAt);
      if (date.getMonth() === i) acc += item.amount || 0;
      return acc;
    }, 0);

    return {
      label,
      income,
      expense
    };
  });

  const selectedSummaryMonthData = summaryChartData.find(item => item.label === selectedItem.label);


  // Prepare transactions to show based on selected button
  useEffect(() => {
    if (selectedButton === "Özet") {
      if (!selectedItem.label) return;

      const monthNameToNumber = {
        "Ocak": 0, "Şubat": 1, "Mart": 2, "Nisan": 3, "Mayıs": 4, "Haziran": 5,
        "Temmuz": 6, "Ağustos": 7, "Eylül": 8, "Ekim": 9, "Kasım": 10, "Aralık": 11
      };

      const selectedMonthIndex = monthNameToNumber[selectedItem.label];

      const filtered = yearlyPostDatas.filter(item => {
        const date = new Date(item.createdAt);
        return (
          date.getMonth() === selectedMonthIndex &&
          date.getFullYear() === Number(selectedYear.value)
        );
      });

      setTransactionsToShow(filtered);
    } else {
      setTransactionsToShow(postDatas);
    }
  }, [selectedButton, postDatas, yearlyPostDatas, selectedItem, selectedYear]);


  // Modal AI Chat Handle
  const modalAIAnalysisHandle = () => {
    navigation.navigate("AI Analysis");
  }

  // Modal User Target Handle
  const modalUserTargetHandle = () => {
    navigation.navigate("Target Planner List");
  }

  // Modal AI Chat Handle
  const modalAIChatHandle = () => {
    navigation.navigate("AI Chat");
  }

  // Modal AI Chat Handle
  const modalSetThemeHandle = () => {
    navigation.navigate("Set Theme");
  }



  //VIEW
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor }}>

      {/* Fab Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Image
          source={require('../assets/fab_button.png')}
          style={styles.fabIcon}
        />
      </TouchableOpacity>

      <CustomContainer>


        {/* Up Bar Buttons */}
        <View style={styles.upBar}>

          {/* Income Butonu */}
          <LinearGradient
            colors={selectedButton === "Gelir" ? [theme.income1 || '#56ab2f', theme.income2 || '#a8e063'] : [tertiaryColor, tertiaryColor]}
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
            colors={selectedButton === "Gider" ? [theme.outcome1 || '#e74c3c', theme.outcome2 || '#f1948a'] : [tertiaryColor, tertiaryColor]}
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
            colors={selectedButton === "Özet" ? [theme.summary1 || '#e74c3c', theme.summary2 || '#f1948a'] : [tertiaryColor, tertiaryColor]}
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
                selectedButton === "Özet" && selectedSummaryMonthData
                  ? `${(selectedSummaryMonthData.income - selectedSummaryMonthData.expense).toLocaleString("tr-TR", {
                    signDisplay: "always",
                  })} ₺`
                  : selectedMonthData
                    ? `${selectedMonthData.value.toLocaleString("tr-TR")} ₺`
                    : "-"
              }
              textStyle={[styles.amountMounthly, { color: theme.text || "#007AFF" }]}
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
          {selectedButton === "Özet" ? (
            <View style={styles.graphCon}>
              <View style={{ flex: 1 }}>
                <CustomBarChart
                  data={summaryChartData}
                  onPressAction={(selected) => {
                    setSelectedItem(selected)
                  }}
                  type={selectedButton}
                />
              </View>
            </View>

          ) : (
            <View style={styles.graphCon}>
              <View style={{ flex: 1 }}>
                <CustomBarChart
                  data={chartData}
                  onPressAction={(selected) => {
                    setSelectedItem(selected)
                  }}
                  type={selectedButton}
                  winter1={theme.winter1}
                  winter2={theme.winter2}
                  spring1={theme.spring1}
                  spring2={theme.spring2}
                  summer1={theme.summer1}
                  summer2={theme.summer2}
                  autumn1={theme.autumn1}
                  autumn2={theme.autumn2}
                />
              </View>
            </View>
          )}

        </View>


        {/* Fab Button - Modal */}
        {isModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Eklentiler</Text>

              <View style={styles.modalGrid}>

                {/* AI Chat */}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={modalAIAnalysisHandle}
                >
                  <ModalContent tabTitle={"AIAnaliz"} tabImage={require("./../assets/robot.jpg")} />
                </TouchableOpacity>


                {/* User Target */}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={modalUserTargetHandle}
                >
                  <ModalContent tabTitle={"Hedeflerim"} tabImage={require("./../assets/target.jpg")} />
                </TouchableOpacity>


                {/* AI Chat */}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={modalAIChatHandle}
                >
                  <ModalContent tabTitle={"AISor"} tabImage={require("./../assets/aiAsk.jpg")} />
                </TouchableOpacity>


                {/* Theme */}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={modalSetThemeHandle}
                >
                  <ModalContent tabTitle={"Tema"} tabImage={require("./../assets/colorTheme.jpg")} />
                </TouchableOpacity>

              </View>


              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={[styles.modalCloseBtn, {backgroundColor: theme.mainButton1 || "#007AFF"}]}>
                <Text style={{ color: "#fff" }}>Kapat</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}


        {/* Account Transactions */}
        {!!selectedItem.label && (
          <View style={styles.bottomCard}>

            <View style={{ marginBottom: 10 }}>
              <TextView label={`${selectedItem.label} ${selectedYear.value} Hareketleri`} textStyle={titleTxt} />
            </View>

            {transactionsToShow.map(item => (
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
    </SafeAreaView >
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
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    backgroundColor: '#9baec3ff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99,
    marginBottom: 100
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  modalContent: {
    width: '90%',
    height: 550,
    padding: 10,
    backgroundColor: 'rgba(235, 228, 228, 1)',
    borderRadius: 10,
    alignItems: 'center',
    borderRadius: 20
  },
  modalCloseBtn: {
    marginTop: 20,
    width: 120,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: "gray",
    width: "45%", // veya sabit: 140
    height: 210,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,

  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fabIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
    opacity: 0.9
  }
})