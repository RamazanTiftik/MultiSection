import { LinearGradient } from 'expo-linear-gradient'
import { BackHandler, Button, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import CustomContainer from '../../../component/CustomContainer';
import TextView from '../../../component/TextView';
import Input from '../../../component/Input';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfoById } from '../../../redux/slices/UserInfoSlice';
import { getAllFeedbacks, saveFeedback } from '../../../redux/slices/FeedbackSlice';
import CustomPopup from '../../../component/CustomPopup';
import CustomIndicator from '../../../component/CustomIndicator';


const FeedBackScreen = ({ navigation }) => {

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const card = themes.card.cardView

  //local text states
  const [feedBackText, setFeedBackText] = useState("")
  const [hasFeedBackTextError, setHasFeedBackTextError] = useState(false)

  //redux
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const userInfo = useSelector((state) => state.userInfo.userInfo) || [];
  const { name } = userInfo;
  const feedbacks = useSelector((state) => state.feedback.feedbacks) || [];
  //theme - redux
  const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
  const theme = useSelector(state => state.theme.themes[selectedThemeId]);

  //general loading
  const authLoading = useSelector((state) => state.auth.loading)
  const userInfoLoading = useSelector((state) => state.userInfo.loading)
  const themeLoading = useSelector((state) => state.theme.loading)
  const feedbackLoading = useSelector((state) => state.feedback.loading)
  const generalLoading = authLoading || userInfoLoading || themeLoading || feedbackLoading

  //modal visible
  const [modalVisible, setModalVisible] = useState(false);

  //selected feedback state
  const [selectedFeedback, setSelectedFeedback] = useState({});

  //popup alert visible
  const [showPopup, setShowPopup] = useState(false)


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
      headerTitle: "Sorun Bildir",
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
      /* await getUserData() */
      await dispatch(getUserInfoById({ userId }))
    }
    fetchData()
  }, [])


  //fetch feedbacks
  const fetchData = async () => {
    /* await getUserData() */
    await dispatch(getAllFeedbacks())
  }

  //when screen is focused
  useEffect(() => {
    fetchData()
  }, [])


  //after popup closed
  const navigateHandle = () => {
    fetchData()
    setShowPopup(false)
  }

  //save feedback handler
  const saveFeedbackHandle = async () => {
    dispatch(saveFeedback({ createdId: userId, createdName: name, feedbackText: feedBackText }))
    setFeedBackText("");
    setHasFeedBackTextError(false);
    setShowPopup(true);
  };

  //feedback row clicked
  const feedbackRowClickHandle = (item) => {
    setSelectedFeedback(item);
    setModalVisible(true);
  }


  //sent button func
  const buttonClickHandle = () => {
    if (!feedBackText) {
      setHasFeedBackTextError(true);

    } else {
      saveFeedbackHandle()
        .catch((error) => {
          console.error("Error setting user data:", error);
        });
    }
  }


  //Input func
  function updateInput(inputType, enteredValue) {
    switch (inputType) {
      case 'feedback':
        setFeedBackText(enteredValue);
        if (enteredValue.trim() !== "") setHasFeedBackTextError(false);
        break;

    }
  }


  //VIEW
  if (generalLoading) {
    <View>
      <CustomIndicator />
    </View>

  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor }}>
        <CustomContainer>

          <View style={[card, { alignItems: "center" }]}>
            <TextView label={"Uygulamayla ilgili herhangi bir geri bildiriminiz varsa bildirebilirsiniz."} />

            <View>
              <Input
                label={"Geri bildiriminizi yazınız"}
                onUpdateValue={updateInput.bind(this, "feedback")}
                value={feedBackText}
                hasError={hasFeedBackTextError}
                width={320}
              />
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


          {/* Static Text */}
          <TextView label={"SIKÇA SORULANLAR"} textStyle={[styles.staticText, { color: theme.text || "#007AFF" }]} />


          {/* FeedBack List */}
          <View style={[card, { alignItems: "center", width: "100%" }]}>

            {feedbacks.filter(item => item.isAccepted).length === 0 ? (
              <Text style={{ marginTop: 10, fontStyle: "italic" }}>Henüz onaylanmış bir geri bildirim yok.</Text>
            ) : (
              feedbacks
                .filter(item => item.isAccepted)
                .map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      marginVertical: 5,
                      width: "100%",
                      padding: 10,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 10,
                    }}
                    onPress={() => { feedbackRowClickHandle(item) }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{item.createdName}</Text>
                    <Text>{item.feedbackText || "Henüz cevap verilmedi."}</Text>
                    <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Tarih yok"}
                    </Text>
                  </TouchableOpacity>
                ))
            )}

          </View>


          {/* Save Feedback Popup */}
          <CustomPopup
            visible={showPopup}
            message={"Geri bildiriminiz başarıyla gönderilmiştir."}
            onClose={navigateHandle}
            type={"Success"}
          />


          {/* Selected feedback modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              padding: 20,
            }}>
              <View style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 20,
                maxHeight: '80%',
              }}>
                <ScrollView>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
                    {selectedFeedback?.createdName || 'İsim yok'}
                  </Text>
                  <Text style={{ marginBottom: 15 }}>
                    {selectedFeedback?.answer || 'Geri bildirim yok.'}
                  </Text>
                  <Text style={{ fontSize: 12, color: 'gray' }}>
                    {selectedFeedback?.createdAt ? new Date(selectedFeedback.createdAt).toLocaleString() : ''}
                  </Text>
                </ScrollView>
                <Button title="Kapat" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>

        </CustomContainer>
      </SafeAreaView >
    )
  }
}

export default FeedBackScreen

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
  staticText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginVertical: 10,
    textAlign: "center",
  }
})
