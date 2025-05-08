import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomContainer from '../../component/CustomContainer'
import CustomFlatlist from '../../component/CustomFlatlist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { themes } from '../../theme/Themes'
import CustomButton from '../../component/CustomButton'
import CustomIcons from '../../component/CustomIcons'
import TextView from '../../component/TextView'
import Input from '../../component/Input'

const PostDataScreen = ({ navigation }) => {

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const tertiaryColor = themes.colorTheme.tertiary.color
  const text = themes.textTheme.text
  const card = themes.card.cardView

  //button
  const [selectedButton, setSelectedButton] = useState("Gelir")

  //datas
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

  //datas local state
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [selectedYear, setSelectedYear] = useState(years[2])

  //input states
  const [description, setDescription] = useState("")

  //input error
  const [hasDescriptionError, setHasDescriptionError] = useState(false)


  const incomeButtonHandle = () => {
    setSelectedButton("Gelir")
  }

  const outcomeButtonHandle = () => {
    setSelectedButton("Gider")
  }


  function updateInput(inputType, enteredValue) {
    switch (inputType) {
      case 'description':
        setDescription(enteredValue);
        if (enteredValue.trim() !== "") setHasDescriptionError(false);
        break;

    }
  }


  //VIEW
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor }}>

      <View style={[styles.topBar, { backgroundColor: tertiaryColor }]}>
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

        {/* Up Bar Buttons */}
        <View style={styles.upBar}>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: selectedButton === "Gelir" ? "red" : tertiaryColor }]}
            onPress={incomeButtonHandle}
          >
            <Text style={selectedButton === "Gelir" ? styles.selectedBtnText : styles.btnText}>{"Gelir"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: selectedButton === "Gider" ? "red" : tertiaryColor }]}
            onPress={outcomeButtonHandle}
          >
            <Text style={selectedButton === "Gider" ? styles.selectedBtnText : styles.btnText}>{"Gider"}</Text>
          </TouchableOpacity>

        </View>


        {/*  */}
        <View>

          {/* Username */}
          <View style={[card, { flexDirection: "row", paddingRight: 55 }]}>
            <CustomIcons icon={"Username"} />
            <View style={styles.inputContainer}>
              <TextView label={"Açıklama:"} textStyle={text} />
              <Input
                onUpdateValue={updateInput.bind(this, "description")}
                value={description}
                label={"Açıklama giriniz"}
                hasError={hasDescriptionError}
              />
            </View>
          </View>

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
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  upBar: {
    backgroundColor: "#f3f3f3",
    height: 50,
    width: "100%",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 15
  },
  btn: {
    borderRadius: 15,
    width: 175,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#999999",
    fontSize: 18,
    fontWeight: 600
  },
  selectedBtnText: {
    fontWeight: 600,
    fontSize: 18,
    color: "#000000"
  }
})
