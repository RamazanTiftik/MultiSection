import { LinearGradient } from 'expo-linear-gradient'
import { Alert, BackHandler, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import CustomContainer from '../../../component/CustomContainer';
import TextView from '../../../component/TextView';
import Input from '../../../component/Input';
import { auth } from '../../../firebaseConfig/Firebase';
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../firebaseConfig/Firebase';


const FeedBackScreen = ({ navigation }) => {

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const card = themes.card.cardView

  //local text states
  const [feedBackText, setFeedBackText] = useState("")
  const [hasFeedBackTextError, setHasFeedBackTextError] = useState(false)

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
        color: "#007AFF",
        fontSize: 18,
        backgroundColor: "red"
      },
      headerTitle: "Geri",
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


  //add income collection for user
  const saveFeedback = async () => {
    try {
      //get current user id
      const userId = auth.currentUser.uid;

      //Get the user document information
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        throw new Error("Kullanıcı verisi bulunamadı.");
      }

      const userData = userSnap.data();
      const userName = userData.name || "";

      //users/{userId}/feedback -> collection reference
      const feedbackRef = collection(db, "users", userId, "feedback");

      //add document to feedback collection
      const docRef = await addDoc(feedbackRef, {
        userName: userName,
        createdDate: new Date(),
        userId: userId,
        id: "",  // empty for now, will set later
        feedback: feedBackText
      });

      //set document id
      await updateDoc(docRef, {
        id: docRef.id
      });

    } catch (error) {
      Alert.alert("Hata", "Hata.")
    }
  };


  //sent button func
  const buttonClickHandle = () => {
    if (!feedBackText) {
      setHasFeedBackTextError(true);

    } else {
      setLoading(true);
      saveFeedback()
        .then(() => {
          setLoading(false);
          /* navigation.reset({
            index: 0,
            routes: [{ name: "MyProfile" }]
          }); */
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
      case 'feedback':
        setFeedBackText(enteredValue);
        if (enteredValue.trim() !== "") setHasFeedBackTextError(false);
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
                colors={['#56ab2f', '#a8e063']}
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
  }
})
