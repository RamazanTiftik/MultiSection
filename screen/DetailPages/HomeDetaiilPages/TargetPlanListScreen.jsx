import { BackHandler, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import TargetPlanListRow from '../../../component/FlatListRow/TargetPlanListRow';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTargetPlans } from '../../../redux/slices/pluginSlice/TargetPlannerSlice';

const TargetPlanListScreen = ({ navigation }) => {

    //theme
    const secondaryColor = themes.colorTheme.secondary.color
    const card = themes.card.cardView
    const text = themes.textTheme.text

    //redux
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId);
    const targetedPlans = useSelector((state) => state.targetPlanner.targetedPlans);


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
                color: "#007AFF",
                fontSize: 18,
                backgroundColor: "red"
            },
            headerTitle: "Hedeflerim",
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


    //when screen focused
    useEffect(() => {
        dispatch(getAllTargetPlans({ userId: userId }))
    }, [dispatch, userId]);


    //add user note handle 
    const addNoteHandle = () => {
        navigation.navigate("Target Planner");
    }

    //Add User Note Button
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => addNoteHandle()}>
                    <CustomIcons icon={"Add"} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    //Click Row Handle
    const clickRowHandle = (id) => {
        navigation.navigate("Target Planner Detail", { targetId: id })
    }


    //VIEW
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor, paddingBottom: 70 }}>

            <FlatList
                style={{ paddingTop: 10 }}
                data={targetedPlans}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TargetPlanListRow
                        item={item}
                        onPress={() => clickRowHandle(item.id)}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
            />

        </SafeAreaView>
    )
}

export default TargetPlanListScreen

const styles = StyleSheet.create({})