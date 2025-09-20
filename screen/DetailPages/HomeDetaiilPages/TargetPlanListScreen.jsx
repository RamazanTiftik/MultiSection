import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import TargetPlanListRow from '../../../component/FlatListRow/TargetPlanListRow';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTargetPlans } from '../../../redux/slices/pluginSlice/TargetPlannerSlice';
import { SwipeListView } from 'react-native-swipe-list-view';
import { deleteTargetPlan } from '../../../redux/slices/pluginSlice/TargetPlannerSlice';
import CustomAlert from '../../../component/CustomAlert';
import CustomIndicator from '../../../component/CustomIndicator';


const TargetPlanListScreen = ({ navigation }) => {

    //theme
    const secondaryColor = themes.colorTheme.secondary.color

    //redux
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId);
    const targetedPlans = useSelector((state) => state.targetPlanner.targetedPlans);
    //theme - redux
    const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
    const theme = useSelector(state => state.theme.themes[selectedThemeId]);

    //general loading
    const authLoading = useSelector((state) => state.auth.loading)
    const targetPlannerLoading = useSelector((state) => state.targetPlanner.loading)
    const themeLoading = useSelector((state) => state.theme.loading)
    const generalLoading = authLoading || targetPlannerLoading || themeLoading

    //alert
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [targetId, setTargetId] = useState(null);


    //Back Button Func
    const backAction = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }]
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
            headerTitle: "Hedeflerim",

            //back button
            headerLeft: () => (
                <TouchableOpacity onPress={() => backAction()}>
                    <CustomIcons icon={"Back"} />
                </TouchableOpacity>
            ),

            //add user note button
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => addNoteHandle()}>
                    <CustomIcons icon={"Add"} />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: secondaryColor,
            },
        });
    }, [navigation]);


    //when screen focused
    useEffect(() => {
        dispatch(getAllTargetPlans({ userId: userId }))
    }, [dispatch, userId]);


    //add user note handle 
    const addNoteHandle = () => {
        navigation.navigate("Target Planner");
    }

    //Click Row Handle
    const clickRowHandle = (id) => {
        navigation.navigate("Target Planner Detail", { targetId: id })
    }


    //Hidden Delete Handle
    const hiddenDeleteHandle = (id) => {
        setAlertVisible(true)
        setAlertMessage("Hedefi silmek istediğinize emin misiniz?")
        setTargetId(id);
    }


    //alert confirm button
    const alertConfirmHandle = async () => {
        setAlertVisible(false);

        try {
            await dispatch(deleteTargetPlan({ userId: userId, planId: targetId }));

            navigation.reset({
                index: 0,
                routes: [{ name: "Target Planner List" }]
            });

            setPopupMessage("Hedef başarıyla silindi.");
            setPopupType("success");
            setPopupVisible(true);

            // Verileri tekrar çek
            setTimeout(() => {
                dispatch(getAllTargetPlans({ userId: userId }));
            }, 300);

        } catch (error) {
            setPopupMessage("İşlem gerçekleşirken bir hata oluştu.");
            setPopupType("error");
            setPopupVisible(true);
        }
    };



    //alert cancel button
    const alertCancelHandle = () => {
        setAlertVisible(false);
        setAlertMessage("");
    }



    //VIEW
    if (generalLoading) {
        return (
            <View>
                <CustomIndicator />
            </View>
        )

    } else {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor, paddingBottom: 70 }}>

                <SwipeListView
                    data={targetedPlans}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TargetPlanListRow
                            item={item}
                            onPress={() => clickRowHandle(item.id)}
                            theme={theme}
                        />
                    )}
                    renderHiddenItem={({ item }) => (
                        <View style={styles.rowBack}>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => hiddenDeleteHandle(item.id)}
                            >
                                <Text style={styles.deleteText}>Sil</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    rightOpenValue={-75}
                    disableRightSwipe
                    contentContainerStyle={{ paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                    friction={15}
                    tension={40}
                />


                {/* Custom Alert for No */}
                <CustomAlert
                    visible={alertVisible}
                    message={alertMessage}
                    onConfirm={alertConfirmHandle}
                    onCancel={alertCancelHandle}
                />


            </SafeAreaView>
        )
    }
}

export default TargetPlanListScreen

const styles = StyleSheet.create({
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 15,
        marginVertical: 4,
        borderRadius: 8,
    },
    deleteButton: {
        width: 75,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
        borderRadius: 8,
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
