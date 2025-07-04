import { LinearGradient } from 'expo-linear-gradient'
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { use, useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { getAllBankNames, getAllCategories, postDataUserData, savePostData } from '../../redux/slices/PostDataSlice'
import { Timestamp } from 'firebase/firestore'
import { getFilteredPostData } from '../../redux/slices/HomePageSlice'


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
  const yesOrNo = [
    { id: 1, value: "No" }, { id: 2, value: "Yes" }
  ]

  //redux state
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.auth.userId);
  const categories = useSelector((state) => state.postData.categories);
  const banks = useSelector((state) => state.postData.bankNames);
  const postDatas = useSelector((state) => state.homePage.filteredPostDatas);

  //datas local state
  const [selectedMonth, setSelectedMonth] = useState(months[5])
  const [selectedBank, setSelectedBank] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedChoose, setSelectedChoose] = useState(yesOrNo[0])

  //input states
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")

  //input error
  const [hasDescriptionError, setHasDescriptionError] = useState(false)
  const [hasAmountError, setHasAmountError] = useState(false)

  //date time picker 
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  //get phone theme (light & dark)
  const theme = useColorScheme();


  //top bar buttons
  const incomeButtonHandle = () => {
    setSelectedButton("Gelir")
  }

  const outcomeButtonHandle = () => {
    setSelectedButton("Gider")
  }


  useEffect(() => {
    dispatch(getFilteredPostData({ userId, selectedButton, month: selectedMonth.value, year: selectedYear.value }))
  }, [userId, selectedButton, selectedMonth, selectedYear])


  //fetch banks and categories when the component mounts
  useEffect(() => {
    // Fetch banks and categories when the component mounts
    dispatch(getAllBankNames());
    dispatch(getAllCategories());
  }, [dispatch])


  //set default bank and category when data is fetched
  useEffect(() => {
    if (banks && banks.length > 0 && !selectedBank) {
      setSelectedBank(banks[0]);
    }
  }, [banks]);

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);


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
    setSelectedDate(date)
    hideDatePicker();
  };


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


  //parse currency from formatted string
  const parseCurrencyTR = (formatted) => {
    if (!formatted) return 0;
    return parseFloat(
      formatted.replace(/\./g, "").replace(",", ".") // "3.500,00" → 3500.00
    );
  };


  //add btn handle
  const addButtonHandle = () => {
    if (!parseCurrencyTR(amount) || !selectedDate) {
      if (!amount) {
        setHasAmountError(true)
      } else if (!selectedDate) {
        //maybe pop-up or toast message
      }

    } else {
      //check is it income or outcome
      if (selectedButton === "Gelir") {

        //parse amount 
        const numericValueAmount = parseCurrencyTR(amount)

        //save income data to redux
        const isSuccess = dispatch(savePostData({
          userId: userId,
          selectedButton: selectedButton,
          amount: parseFloat(numericValueAmount),
          description: description,
          bankName: selectedBank.value,
          isMonthly: selectedChoose.value === "Yes" ? true : false,
          createdAt: selectedDate instanceof Date
            ? Timestamp.fromDate(selectedDate)
            : Timestamp.now()
        }))

        //save user data to redux
        dispatch(postDataUserData({
          userId: userId,
          selectedButton: selectedButton,
          amount: parseFloat(numericValueAmount),
        }))

        // Reset input fields after adding income
        setDescription("");
        setAmount("");
        setSelectedDate("");
        setSelectedBank(banks[0]);
        setSelectedChoose(yesOrNo[0]);

        if (isSuccess) {
          // Navigate to the home screen after adding income
          navigation.navigate("Home");
        }

      }
      else if (selectedButton === "Gider") {

        //parse amount 
        const numericValueAmount = parseCurrencyTR(amount)

        //save income data to redux
        const isSuccess = dispatch(savePostData({
          userId: userId,
          selectedButton: selectedButton,
          amount: parseFloat(numericValueAmount),
          description: description,
          bankName: selectedBank.value,
          category: selectedCategory.value,
          isMonthly: selectedChoose.value === "Yes" ? true : false,
          createdAt: selectedDate instanceof Date
            ? Timestamp.fromDate(selectedDate)
            : Timestamp.fromDate(new Date(selectedDate))

        }))

        //save user data to redux
        dispatch(postDataUserData({
          userId: userId,
          selectedButton: selectedButton,
          amount: parseFloat(numericValueAmount),
        }))

        // Reset input fields after adding income
        setDescription("");
        setAmount("");
        setSelectedDate("");
        setSelectedBank(banks[0]);
        setSelectedChoose(yesOrNo[0]);

        if (isSuccess) {
          // Navigate to the home screen after adding income
          navigation.navigate("Home");
        }

      }

    }
  }


  //Text update func
  function updateInput(inputType, enteredValue) {
    switch (inputType) {
      case 'description':
        setDescription(enteredValue);
        if (enteredValue.trim() !== "") setHasDescriptionError(false);
        break;

      case 'amount':
        setAmount(enteredValue);
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
                <CustomIcons icon={"Amount"} />
                <View style={[styles.inputContainer]}>
                  <TextView label={"Miktar:"} textStyle={[text, { marginLeft: 3 }]} />
                  <Input
                    onUpdateValue={updateInput.bind(this, "amount")}
                    value={amount}
                    label={"0.00"}
                    hasError={hasAmountError}
                    keyboardType={"numeric"}
                    currency={"tl"}
                  />
                </View>
              </View>


              {/* Date */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Date"} />

                <View style={styles.dateContainer}>
                  <TextView label={"Tarih:"} textStyle={text} />
                  <Pressable onPress={showDatePicker} style={styles.dateInput}>
                    <TextView
                      label={
                        selectedDate
                          ? selectedDate.toLocaleDateString('tr-TR')
                          : "Tarih Seçiniz"
                      }
                      textStyle={text}
                    />
                  </Pressable>

                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    textColor={theme === 'dark' ? '#fff' : '#000'}
                    themeVariant="light"
                    display="spinner"
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


              {/* Monthly Choose */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Task"} />

                <View style={styles.categoryCon}>
                  <TextView label={"Düzenli (Aylık) Gelir Mi?"} textStyle={text} />
                  <View>
                    <CustomFlatlist
                      data={yesOrNo}
                      selectedValue={selectedChoose}
                      onValueChange={setSelectedChoose}
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
                <CustomIcons icon={"Amount"} />
                <View style={[styles.inputContainer]}>
                  <TextView label={"Miktar:"} textStyle={[text, { marginLeft: 3 }]} />
                  <Input
                    onUpdateValue={updateInput.bind(this, "amount")}
                    value={amount}
                    label={"0.00"}
                    hasError={hasAmountError}
                    keyboardType={"numeric"}
                    currency={"tl"}
                  />
                </View>
              </View>


              {/* Date */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Date"} />

                <View style={styles.dateContainer}>
                  <TextView label={"Tarih:"} textStyle={text} />
                  <Pressable onPress={showDatePicker} style={styles.dateInput}>
                    <TextView
                      label={
                        selectedDate
                          ? selectedDate.toLocaleDateString('tr-TR')
                          : "Tarih Seçiniz"
                      }
                      textStyle={text}
                    />
                  </Pressable>

                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    textColor={theme === 'dark' ? '#fff' : '#000'}
                    themeVariant="light"
                    display="spinner"
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


              {/* Monthly Choose */}
              <View style={styles.inputCard}>
                <CustomIcons icon={"Task"} />

                <View style={styles.categoryCon}>
                  <TextView label={"Düzenli (Aylık) Gider Mi?"} textStyle={text} />
                  <View>
                    <CustomFlatlist
                      data={yesOrNo}
                      selectedValue={selectedChoose}
                      onValueChange={setSelectedChoose}
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


      </CustomContainer>

    </SafeAreaView >
  )
}

export default PostDataScreen

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 75,
    paddingTop: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
