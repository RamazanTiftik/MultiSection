import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { useEffect, useState } from 'react';
import { themes } from '../../../theme/Themes';
import CustomIcons from '../../../component/CustomIcons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTargetPlan, getAllTargetPlans, getTargetPlanById, updateTargetPlanResult } from '../../../redux/slices/pluginSlice/TargetPlannerSlice';
import CustomAlert from '../../../component/CustomAlert';
import CustomPopup from '../../../component/CustomPopup';

const TargetPlanDetail = ({ route, navigation }) => {

  //route
  const { targetId } = route.params;

  //local plan state
  const [planData, setPlanData] = useState([]);

  //redux
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const plan = useSelector((state) => state.targetPlanner.selectedPlan);
  //theme - redux
  const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
  const theme = useSelector(state => state.theme.themes[selectedThemeId]);

  //theme
  const secondaryColor = themes.colorTheme.secondary.color;

  //alert - popup
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [popupType, setPopupType] = useState("success")

  //get the start date of plan
  const planStartDate = new Date(plan.createdAt);
  const now = new Date();

  //calculate to month differrent
  const monthDiff =
    (now.getFullYear() - planStartDate.getFullYear()) * 12 +
    (now.getMonth() - planStartDate.getMonth());

  //if selected plan is downpayment, month index +1
  const isDownpayment = plan.selectedPlan === 'downpayment';
  const currentPlanIndex = isDownpayment ? monthDiff + 1 : monthDiff;

  //sort to plan according to month
  useEffect(() => {
    if (plan && plan.planResult) {
      const sorted = Object.values(plan.planResult).sort((a, b) => {
        const aNo = parseInt(a.ay.replace('Ay ', ''), 10);
        const bNo = parseInt(b.ay.replace('Ay ', ''), 10);
        return aNo - bNo;
      });
      setPlanData(sorted);
    }
  }, [plan]);


  //plan type name converter
  const planTypeName = (key) => {
    switch (key) {
      case 'fixed': return 'Sabit Aylık Ödeme';
      case 'increasing': return 'Artan Ödeme';
      case 'downpayment': return 'Peşinat + Taksit';
      case 'dateBased': return 'Tarihe Göre Plan';
      default: return 'Bilinmeyen';
    }
  };


  //back button action
  const backAction = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Target Planner List" }]
    });
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleStyle: {
        color: theme.text || "#007AFF",
        fontSize: 18,
      },
      headerTitle: "Hedef Detay",
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


  useEffect(() => {
    dispatch(getTargetPlanById({ userId, id: targetId }));
  }, [dispatch, targetId])


  // success handle
  const handleSuccess = (index) => {
    dispatch(updateTargetPlanResult({
      id: plan.id,
      userId: userId,
      month: index,
      isCompeleted: true,
      result: "success"
    }))

    const updatedPlan = [...planData];
    updatedPlan[index] = { ...updatedPlan[index], tamamlandi: true, durum: 'success' };
    setPlanData(updatedPlan);
  };

  //failuer handle
  const handleFailure = (index) => {
    dispatch(updateTargetPlanResult({
      id: plan.id,
      userId: userId,
      month: index,
      isCompeleted: true,
      result: "fail"
    }))

    const updatedPlan = [...planData];
    updatedPlan[index] = { ...updatedPlan[index], tamamlandi: true, durum: 'fail' };
    setPlanData(updatedPlan);

    //alert
    setAlertVisible(true)
    setAlertMessage("Geciken tutarı sonraki aylara paylaştırmak ister misiniz?")
  };


  //alert confirm button
  const alertConfirmHandle = async () => {
    const missedAmount = parseFloat(planData[currentPlanIndex].birikim);

    //mark current month as completed
    const updatedPlan = [...planData];
    updatedPlan[currentPlanIndex] = {
      ...updatedPlan[currentPlanIndex],
      tamamlandi: true,
      durum: 'fail',
    };

    //Get remaining months (uncompleted months after current month)
    const remainingMonths = updatedPlan.filter((_, index) => {
      return index > currentPlanIndex && !updatedPlan[index].tamamlandi;
    });

    //If no remaining months, show error
    if (remainingMonths.length === 0) {
      setPopupMessage("Kalan ay bulunamadığı için dağıtım yapılamadı.");
      setPopupType("error");
      setPopupVisible(true);
      return;
    }

    const extraPerMonth = parseFloat((missedAmount / remainingMonths.length).toFixed(2));

    // Dağıt
    const newUpdatedPlan = updatedPlan.map((item, index) => {
      if (index > currentPlanIndex && !item.tamamlandi) {
        const yeniTutar = (parseFloat(item.birikim) + extraPerMonth).toFixed(2);
        return { ...item, birikim: yeniTutar };
      }
      return item;
    });

    // Firebase'e kaydetmek için objeye çevir
    const resultToFirebase = {};
    newUpdatedPlan.forEach((item) => {
      resultToFirebase[item.key] = item;
    });

    try {
      // Firebase güncellemesi
      await dispatch(updateTargetPlanResult({
        id: plan.id,
        userId: userId,
        planResult: resultToFirebase, // tüm planResult'u gönder
      }));

      setPlanData(newUpdatedPlan);
      setAlertVisible(false);
      setPopupMessage("Kalan tutar başarılı şekilde diğer aylara dağıtıldı.");
      setPopupType("success");
      setPopupVisible(true);
    } catch (error) {
      console.error(error);
      setPopupMessage("Güncelleme sırasında hata oluştu.");
      setPopupType("error");
      setPopupVisible(true);
    }
  };


  //alert cancel button
  const alertCancelHandle = () => {
    const response = dispatch(deleteTargetPlan({ userId: userId, planId: targetId }))

    if (response) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Target Planner List" }]
      });
      setPopupMessage("Hedef başarıyla silindi.");
      setPopupType("success")
      setPopupVisible(true);

    } else {
      setPopupMessage("İşlem gerçekleşirken bir hata gerçekleşti.");
      setPopupType("error")
      setPopupVisible(true);
    }
    setTimeout(() => {
      dispatch(getAllTargetPlans({ userId: userId }))
    }, 300)
  }


  //VIEW
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Info Card */}
        <View style={[styles.infoCard, { borderLeftColor: theme.text || "#007AFF" }]}>
          <Text style={[styles.infoTitle, { color: theme.text || "#007AFF" }]}>{plan.goalName}</Text>
          <Text style={styles.infoAmount}>🎯 Toplam Tutar: {parseFloat(plan.goalAmount).toFixed(2)} ₺</Text>
          <Text style={styles.infoType}>📌 Plan Türü: {planTypeName(plan.selectedPlan)}</Text>
        </View>


        {/* Static Text */}
        <Text style={styles.sectionTitle}>📅 Aylık Plan</Text>


        {/* Güncel ay sorusu */}
        {
          currentPlanIndex < planData.length &&
          !planData[currentPlanIndex].tamamlandi &&
          now.getDate() >= 25 && (
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>
                📅 Bu ay için <Text style={{ fontWeight: 'bold' }}>{planData[currentPlanIndex].birikim} ₺</Text> ayırmanız gerekiyordu. Hedefi gerçekleştirdiniz mi?
              </Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.successBtn}
                  onPress={() => handleSuccess(currentPlanIndex)}
                >
                  <Text style={styles.btnText}>✅ Evet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.failBtn}
                  onPress={() => handleFailure(currentPlanIndex)}
                >
                  <Text style={styles.btnText}>❌ Hayır</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }


        {/* Plan Listesi */}
        <View style={styles.planContainer}>
          {planData.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.planItem,
                item.durum === 'success'
                  ? styles.successBackground
                  : item.durum === 'fail'
                    ? styles.failBackground
                    : styles.pendingBackground
              ]}
            >
              <Text style={styles.planText}>{item.ay}</Text>
              <Text style={styles.planText}>{item.birikim} ₺</Text>
              <Text style={styles.statusIcon}>
                {item.durum === 'success' ? '✅' : item.durum === 'fail' ? '❌' : '🕒'}
              </Text>
            </View>
          ))}
        </View>



        {/* Custom Alert for No */}
        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onConfirm={alertConfirmHandle}
          onCancel={alertCancelHandle}
          isDelete={"Sil"}
        />

        {/* Custom Popup */}
        <CustomPopup
          visible={popupVisible}
          message={popupMessage}
          onClose={() => setPopupVisible(false)}
          type={popupType}
        />

      </ScrollView >
    </SafeAreaView >
  );
};

export default TargetPlanDetail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  planContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Info Card
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderLeftColor: '#007AFF',
    borderLeftWidth: 5,
  },

  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },

  infoAmount: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },

  infoType: {
    fontSize: 15,
    color: '#555',
  },

  // Plan Item
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  successBackground: {
    backgroundColor: '#e0f7ec', // yeşilimsi açık ton
    borderLeftColor: '#2ecc71',
    borderLeftWidth: 5,
  },

  failBackground: {
    backgroundColor: '#fdecea', // kırmızımsı açık ton
    borderLeftColor: '#e74c3c',
    borderLeftWidth: 5,
  },

  pendingBackground: {
    backgroundColor: '#f7f9fc', // griye yakın
    borderLeftColor: '#95a5a6',
    borderLeftWidth: 5,
  },

  planText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },

  statusIcon: {
    fontSize: 20,
    textAlign: 'right',
    width: 30,
  },

  // Question Card
  questionCard: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },

  questionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },

  //Buttons
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  successBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  failBtn: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
