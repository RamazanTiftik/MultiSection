import { LinearGradient } from 'expo-linear-gradient'
import { BackHandler, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import CustomContainer from '../../../component/CustomContainer';
import TextView from '../../../component/TextView';
import Input from '../../../component/Input';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfoById, updateUserDataById } from '../../../redux/slices/UserInfoSlice';


const MonthlyInfoScreen = ({ navigation }) => {

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const card = themes.card.cardView
  const text = themes.textTheme.text

  //redux
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const userInfo = useSelector((state) => state.userInfo.userInfo) || [];
  const { name, email, salary, expense } = userInfo;
  //theme - redux
  const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
  const theme = useSelector(state => state.theme.themes[selectedThemeId]);

  //user data input state
  const [userEmail, setUserEmail] = useState(email || "")
  const [userSalary, setUserSalary] = useState(salary || 0.0)
  const [userExpense, setUserExpense] = useState(expense || 0.0)
  const [userName, setUserName] = useState(name || "")

  //local text states
  const [hasUserEmailTextError, setHasUserEmailTextError] = useState(false)
  const [hasUserNameTextError, setHasUserNameTextError] = useState(false)
  const [hasUserSalaryTextError, setHasUserSalaryTextError] = useState(false)
  const [hasUserExpenseTextError, setHasUserExpenseTextError] = useState(false)


  //loading state
  const [loading, setLoading] = useState(false)


  //Back Button Func
  const backAction = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MyProfile" }]
    });
    return true;
  };

  //back button listener
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove()
  }, [])

  //Back Button and Header Options
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleStyle: {
        color: theme.text || "#007AFF",
        fontSize: 18,
        backgroundColor: "red"
      },
      headerTitle: "Kullanıcı Bilgilerim",
      headerLeft: () => (
        <TouchableOpacity onPress={() => backAction()}>
          <CustomIcons icon={"Back"} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: secondaryColor,
      },
    });
  }, [navigation]);


  //when screen is focused
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      /* await getUserData() */
      await dispatch(getUserInfoById({ userId }))
      setLoading(false)
    }
    fetchData()
  }, [])


  //parse currency from formatted string
  const parseCurrencyTR = (formatted) => {
    if (!formatted) return 0;
    return parseFloat(
      formatted.replace(/\./g, "").replace(",", ".") // "3.500,00" → 3500.00
    );
  };


  //set user data to firestore
  async function setUserData(setName, setSalary, setExpense) {
    try {
      const numericValueSalary = parseCurrencyTR(setSalary)
      const numericValueExpense = parseCurrencyTR(setExpense)

      dispatch(updateUserDataById({ userId, name: setName, salary: parseFloat(numericValueSalary), expense: parseFloat(numericValueExpense) }))
    } catch (error) {
      console.error("Veri güncellenirken hata oluştu:", error);
    }
  }


  //sent button func
  const buttonClickHandle = () => {
    if (!userName || !parseFloat(userSalary) || !parseFloat(userExpense)) {
      // Check if any field is empty
      if (!userName) setHasUserNameTextError(true);
      if (!userSalary) setHasUserSalaryTextError(true);
      if (!userExpense) setHasUserExpenseTextError(true);
    } else {
      // If all fields are filled, proceed to set user data
      setLoading(true);
      setUserData(userName, userSalary, userExpense)
        .then(() => {
          setLoading(false);
          navigation.reset({
            index: 0,
            routes: [{ name: "MyProfile" }]
          });
        })
        .catch((error) => {
          console.error("Error setting user data:", error);
          setLoading(false);
        });
    }
  }


  //Input func
  function updateInput(inputType, enteredValue) {
    switch (inputType) {
      case 'userName':
        setUserName(enteredValue);
        if (enteredValue.trim() !== "") setHasUserNameTextError(false);
        break;
      case 'userSalary':
        setUserSalary(enteredValue);
        if (enteredValue.trim() !== "") setHasUserSalaryTextError(false);
        break;
      case 'userExpense':
        setUserExpense(enteredValue);
        if (enteredValue.trim() !== "") setHasUserExpenseTextError(false);
        break;
      default:
        break;
    }
  }

  //VIEW
  if (loading) {
    <View>

    </View>
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor }}>
        <CustomContainer>

          <View style={[card, { alignItems: "center" }]}>

            {/* Name & Surname */}
            <View style={[styles.inputContainer, { flexDirection: "row" }]}>
              <CustomIcons icon={"Role"} />
              <View>
                <TextView label={"Ad Soyad:"} textStyle={text} />
                <Input
                  keyboardType="email-address"
                  onUpdateValue={updateInput.bind(this, 'userName')}
                  value={userName}
                  label={"Ad ve Soyadınızı girin"}
                  hasError={hasUserNameTextError}
                />
              </View>
            </View>


            {/* Email -> Disabled */}
            <View style={[styles.inputContainer, { flexDirection: "row" }]}>
              <CustomIcons icon={"Mail"} />
              <View>
                <TextView label={"E-Posta:"} textStyle={text} />
                <Input
                  keyboardType="email-address"
                  onUpdateValue={updateInput.bind(this, 'userMail')}
                  value={userEmail}
                  label={"E-Postanızı girin"}
                  hasError={false}
                  disabled // disable input
                />
              </View>
            </View>


            {/* Salary */}
            <View style={[styles.inputContainer, { flexDirection: "row" }]}>
              <CustomIcons icon={"Amount"} />
              <View>
                <TextView label={"Gelir (Aylık):"} textStyle={text} />
                <Input
                  keyboardType="numeric"
                  onUpdateValue={updateInput.bind(this, 'userSalary')}
                  value={userSalary}
                  label={"1.000,00"}
                  hasError={hasUserSalaryTextError}
                  currency={"tl"}
                />
              </View>
            </View>


            {/* Expense */}
            <View style={[styles.inputContainer, { flexDirection: "row" }]}>
              <CustomIcons icon={"Amount"} />
              <View>
                <TextView label={"Harcama (Aylık):"} textStyle={text} />
                <Input
                  keyboardType="numeric"
                  onUpdateValue={updateInput.bind(this, 'userExpense')}
                  value={userExpense}
                  label={"1.000,00"}
                  hasError={hasUserExpenseTextError}
                  currency={"tl"}
                />
              </View>
            </View>


            {/* Save Button */}
            <View style={{ marginTop: 15, width: 150 }}>
              <LinearGradient
                colors={[theme.income1 || '#56ab2f', theme.income2 || '#a8e063']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonHandle}
              >
                <TouchableOpacity
                  style={styles.touchable}
                  onPress={buttonClickHandle}
                >
                  <Text style={styles.btnText}>{"Gönder"}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

          </View>

        </CustomContainer>
      </SafeAreaView >
    )
  }
}

export default MonthlyInfoScreen

const styles = StyleSheet.create({
  addButtonHandle: {
    borderRadius: 15,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    width: 150,
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  btnText: {
    /* color: "white", */
    fontSize: 16,
    fontWeight: "500"
  },
  inputContainer: {
    marginLeft: -25,
    marginBottom: 25
  }
})
