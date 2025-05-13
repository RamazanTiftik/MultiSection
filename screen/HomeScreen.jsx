import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomContainer from '../component/CustomContainer'
import TextView from '../component/TextView'
import { themes } from '../theme/Themes'
import CustomIcons from '../component/CustomIcons'
import CustomFlatList from '../component/CustomFlatlist'
import CustomBarChart from '../component/Graph/CustomBarChart'

const HomeScreen = ({ navigation }) => {

  //button
  const [selectedButton, setSelectedButton] = useState("Gelir")

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const tertiaryColor = themes.colorTheme.tertiary.color
  const text = themes.textTheme.text
  const card = themes.card.cardView
  const titleTxt = themes.textTheme.titleTxt
  const profileText = themes.textTheme.profileText

  const years = [
    { id: 1, value: "2023" }, { id: 2, value: "2024" },
    { id: 3, value: "2025" }, { id: 4, value: "2026" }
  ]

  //local states
  const [selectedYear, setSelectedYear] = useState(years[2])



  //top bar buttons
  const incomeButtonHandle = () => {
    setSelectedButton("Gelir")
  }

  const outcomeButtonHandle = () => {
    setSelectedButton("Gider")
  }


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

        </View>


        {/* Main Card */}
        <View style={[card, { alignItems: "flex-start", marginTop: 15, paddingHorizontal: 15 }]}>

          {/* Top Infos */}
          <View style={styles.upperInUpBar}>

            {/* Mounthly Amount */}
            <TextView label={"21.203$"} textStyle={styles.amountMounthly} />

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
          <View style>
            <TextView label={"Nisan 2025"} textStyle={styles.dateText} />
          </View>


          {/* Graph */}
          <View style={styles.graphCon}>
            <View style={{ flex: 1 }}>
              <CustomBarChart
                data={[20, 30, 40, 10, 25, 50, 70, 65, 45, 30, 15, 10]}
                labels={[
                  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
                  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
                ]}
              />
            </View>
          </View>


        </View>


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
    width: 175,
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
    color: "blue",
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
  }
})