import { LinearGradient } from 'expo-linear-gradient'
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomContainer from '../../component/CustomContainer'
import CustomFlatlist from '../../component/CustomFlatlist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { themes } from '../../theme/Themes'
import CustomButton from '../../component/CustomButton'
import CustomIcons from '../../component/CustomIcons'
import TextView from '../../component/TextView'
import Input from '../../component/Input'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AccountTransactionsRow from '../../component/FlatListRow/AccountTransactionsRow'



const PostDataScreen = ({ navigation }) => {

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const tertiaryColor = themes.colorTheme.tertiary.color
  const text = themes.textTheme.text
  const card = themes.card.cardView
  const titleTxt = themes.textTheme.titleTxt

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
  const banks = [
    { id: 1, value: "Akbank" }, { id: 2, value: "Yapı Kredi" }, { id: 3, value: "Garanti" },
    { id: 4, value: "Qnb" }, { id: 5, value: "Ziraat" }, { id: 6, value: "Vakıfbank" }
  ]
  const categories = [
    { id: 1, value: "Market" }, { id: 2, value: "Giysi" }, { id: 3, value: "Kozmetik" },
    { id: 4, value: "Eğlence" }, { id: 5, value: "Ev Kirası" }, { id: 6, value: "Diğer" }
  ]

  //datas local state
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [selectedYear, setSelectedYear] = useState(years[2])
  const [selectedBank, setSelectedBank] = useState(banks[0])
  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  //input states
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")

  //input error
  const [hasDescriptionError, setHasDescriptionError] = useState(false)
  const [hasAmountError, setHasAmountError] = useState(false)

  //date time picker 
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");


  //top bar buttons
  const incomeButtonHandle = () => {
    setSelectedButton("Gelir")
  }

  const outcomeButtonHandle = () => {
    setSelectedButton("Gider")
  }


  //remove data when button focus is changed
  useEffect(() => {
    setSelectedBank(banks[0])
    setSelectedDate("")
    setSelectedCategory(categories[0])
    setSelectedMonth(months[0])
    setSelectedYear(years[0])
    setDescription("")
    setAmount("")
  }, [selectedButton])


  //date time picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setSelectedDate(date.toLocaleDateString());
    hideDatePicker();
  };


  //add btn handle
  const addButtonHandle = () => {
    if (!amount || !selectedDate) {
      if (!amount) {
        setHasAmountError(true)
      } else if (!selectedDate) {
        //maybe pop-up or toast message
      }

    } else {
      //make it 
      console.log("bas")
    }
  }


  function updateInput(inputType, enteredValue) {
    switch (inputType) {
      case 'description':
        setDescription(enteredValue);
        if (enteredValue.trim() !== "") setHasDescriptionError(false);
        break;

      case 'amount':
        // Sadece sayılar ve tek bir nokta (.) izin ver
        const filtered = enteredValue.replace(/[^0-9.]/g, '');

        // Eğer birden fazla nokta varsa sadece ilkini bırak
        const parts = filtered.split('.');
        const sanitized = parts.length > 2
          ? parts[0] + '.' + parts.slice(1).join('').replace(/\./g, '')
          : filtered;

        setAmount(sanitized);
        if (enteredValue.trim() !== "") setHasAmountError(false);
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
        />

        <CustomFlatlist
          data={years}
          selectedValue={selectedYear}
          onValueChange={setSelectedYear}
        />
      </View>

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

        {
          selectedButton === "Gelir" ? (
            //INCOME BUTTON

            <View style={card}>

              {/* Description */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Description"} />
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


              {/* Amount */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Description"} />
                <View style={[styles.inputContainer]}>
                  <TextView label={"Miktar:"} textStyle={text} />
                  <Input
                    onUpdateValue={updateInput.bind(this, "amount")}
                    value={amount}
                    label={"0.00$"}
                    hasError={hasAmountError}
                    keyboardType={"numeric"}
                  />
                </View>
              </View>


              {/* Date */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Date"} />

                <View style={styles.dateContainer}>
                  <TextView label={"Tarih:"} textStyle={text} />
                  <Pressable onPress={showDatePicker} style={styles.dateInput}>
                    <TextView label={selectedDate || "Tarih Seçininiz"} textStyle={text} />
                  </Pressable>

                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </View>
              </View>


              {/* Bank */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Bank"} />

                <View style={styles.categoryCon}>
                  <TextView label={"Banka"} textStyle={text} />
                  <View>
                    <CustomFlatlist
                      data={banks}
                      selectedValue={selectedBank}
                      onValueChange={setSelectedBank}
                      width={280}
                    />
                  </View>
                </View>
              </View>


              {/* Add Buttons */}
              <View style={[styles.inputCard, { paddingHorizontal: 20, marginTop: 15 }]}>
                <LinearGradient
                  colors={['#56ab2f', '#a8e063']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addButtonHandle}
                >
                  <TouchableOpacity
                    style={styles.touchable}
                    onPress={addButtonHandle}
                  >
                    <Text style={styles.selectedBtnText}>{"Gelir Ekle"}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

            </View>

          ) : (
            //OUTCOME BUTTON

            <View style={card}>

              {/* Description */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Description"} />
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


              {/* Amount */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Description"} />
                <View style={[styles.inputContainer]}>
                  <TextView label={"Miktar:"} textStyle={text} />
                  <Input
                    onUpdateValue={updateInput.bind(this, "amount")}
                    value={amount}
                    label={"0.00$"}
                    hasError={hasAmountError}
                    keyboardType={"numeric"}
                  />
                </View>
              </View>


              {/* Date */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Date"} />

                <View style={styles.dateContainer}>
                  <TextView label={"Tarih:"} textStyle={text} />
                  <Pressable onPress={showDatePicker} style={styles.dateInput}>
                    <TextView label={selectedDate || "Tarih Seçininiz"} textStyle={text} />
                  </Pressable>

                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </View>
              </View>


              {/* Bank */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Bank"} />

                <View style={styles.categoryCon}>
                  <TextView label={"Banka"} textStyle={text} />
                  <View>
                    <CustomFlatlist
                      data={banks}
                      selectedValue={selectedBank}
                      onValueChange={setSelectedBank}
                      width={280}
                    />
                  </View>
                </View>
              </View>


              {/* Outcome Category */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Category"} />

                <View style={styles.categoryCon}>
                  <TextView label={"Kategori"} textStyle={text} />
                  <View>
                    <CustomFlatlist
                      data={categories}
                      selectedValue={selectedCategory}
                      onValueChange={setSelectedCategory}
                      width={280}
                    />
                  </View>
                </View>
              </View>


              {/* Add Buttons */}
              <View style={[styles.inputCard, { paddingHorizontal: 20, marginTop: 15 }]}>
                <LinearGradient
                  colors={['#e74c3c', '#f1948a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addButtonHandle}
                >
                  <TouchableOpacity
                    style={styles.touchable}
                    onPress={addButtonHandle}
                  >
                    <Text style={styles.selectedBtnText}>{"Gider Ekle"}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

            </View>
          )
        }


        {/* Account Transactions */}
        <View style={styles.bottomCard}>
          <View style={{ marginBottom: 10 }}>
            <TextView label={`${selectedMonth.value} ${selectedYear.value} Hareketleri`} textStyle={titleTxt} />
          </View>

          <FlatList
            data={years}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={card}>
                <AccountTransactionsRow
                  title={[]}
                  amount={amount}
                  date={selectedDate}
                  type={selectedButton}
                />
              </View>
            )}
          />
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
  btnText: {
    color: "#999999",
    fontSize: 18,
    fontWeight: 600
  },
  selectedBtnText: {
    fontWeight: 600,
    fontSize: 18,
    color: "#000000"
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
  inputCard: {
    flexDirection: "row",
    marginBottom: 20
  },
  dateContainer: {
    width: "280",
  },
  dateInput: {
    backgroundColor: '#dee2e6', // beyaz arka plan
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc", // ince gri kenarlık
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dateInputText: {
    fontSize: 16,
  },
  addButtonHandle: {
    borderRadius: 15,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  categoryCon: {
    flexDirection: "column",
    justifyContent: "center",
  },
  bottomCard: {
    width: "100%",
    height: "auto",
    marginTop: 10
  }
})
