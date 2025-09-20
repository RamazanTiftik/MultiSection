import { BackHandler, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import CustomContainer from '../../../component/CustomContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationByUserId, updateNotification } from '../../../redux/slices/NotificationSlice';
import TextView from '../../../component/TextView';
import CustomIndicator from '../../../component/CustomIndicator';

const NotificationScreen = ({ navigation }) => {

    //theme
    const secondaryColor = themes.colorTheme.secondary.color;
    const card = themes.card.cardView;
    const text = themes.textTheme.text;

    //redux
    const userId = useSelector((state) => state.auth.userId);
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notification.notifications) || [];
    //theme - redux
    const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
    const theme = useSelector(state => state.theme.themes[selectedThemeId]);
    //general loading
    const authLoading = useSelector((state) => state.auth.loading)
    const notificationLoading = useSelector((state) => state.notification.loading)
    const themeLoading = useSelector((state) => state.theme.loading)
    const generalLoading = authLoading || notificationLoading || themeLoading

    //loading
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        dispatch(getNotificationByUserId({ userId }));
    }, []);


    //back button handler
    const backAction = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "MyProfile" }]
        });
        return true;
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Bildirim Ayarları",
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: '600',
                color: theme.text || "#007AFF",
            },
            headerLeft: () => (
                <TouchableOpacity onPress={backAction}>
                    <CustomIcons icon={"Back"} />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: secondaryColor,
                elevation: 0,
                shadowOpacity: 0,
            },
        });
    }, [navigation]);


    //toggle switch handler
    const toggleSwitch = (id, currentValue) => {
        dispatch(updateNotification({ id, notify: !currentValue, userId }))
            .unwrap()
            .then(() => {
                dispatch(getNotificationByUserId({ userId }));
            });
    };


    //VIEW
    if (generalLoading) {
        <View>
            <CustomIndicator />
        </View>
    } else {
        return (
            <CustomContainer>
                {notifications.map((notif) => (
                    <View key={notif.id} style={[card, styles.card]}>

                        <TextView textStyle={text} label={notif.notifyName} />
                        <Switch
                            value={notif.notify}
                            onValueChange={() => toggleSwitch(notif.id, notif.notify)}
                            thumbColor={notif.notify ? '#007AFF' : '#ccc'}
                            trackColor={{ false: '#d1d1d1', true: '#b3d7ff' }}
                        />

                    </View>
                ))}
            </CustomContainer>
        );
    }
};

export default NotificationScreen;

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20
    },
});
