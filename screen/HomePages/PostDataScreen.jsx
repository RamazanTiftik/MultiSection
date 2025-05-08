import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomContainer from '../../component/CustomContainer'
import CustomFlatlist from '../../component/CustomFlatlist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { themes } from '../../theme/Themes'

const PostDataScreen = ({ navigation }) => {

  //theme
  const primaryColor = themes.colorTheme.primary.color
  const secondaryColor = themes.colorTheme.secondary.color

  const months = [
    { id: 1, value: "Ocak" }, { id: 2, value: "Şubat" }, { id: 3, value: "Mart" },
    { id: 4, value: "Nisan" }, { id: 5, value: "Mayıs" }, { id: 6, value: "Haziran" },
    { id: 7, value: "Temmuz" }, { id: 8, value: "Ağustos" }, { id: 9, value: "Eylül" },
    { id: 10, value: "Ekim" }, { id: 11, value: "Kasım" }, { id: 12, value: "Aralık" }
  ]
  const years = [
    { id: 1, value: "2023" }, { id: 2, value: "2024" },
    { id: 3, value: "2025" }, { id: 4, value: "2026" }
  ]

  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [selectedYear, setSelectedYear] = useState(years[2])

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={[styles.topBar, { backgroundColor: secondaryColor }]}>
        <CustomFlatlist
          data={months}
          selectedValue={selectedMonth}
          onValueChange={setSelectedMonth}
          onDropdownOpen={() => setDropdownVisible(true)}
          onDropdownClose={() => setDropdownVisible(false)}
        />

        <CustomFlatlist
          data={years}
          selectedValue={selectedYear}
          onValueChange={setSelectedYear}
          onDropdownOpen={() => setDropdownVisible(true)}
          onDropdownClose={() => setDropdownVisible(false)}
        />
      </View>

      <CustomContainer>

        <View style={styles.upBar}>

        </View>

      </CustomContainer>

    </SafeAreaView >
  )
}

export default PostDataScreen

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1000,
    width: "100%",
    height: 75,
    paddingTop: 15,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  upBar: {
    backgroundColor: "gray",
    height: 50,
    width: "100%",
    borderRadius: 15
  }
})
