import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet } from 'react-native';

import HomeScreen from '../../screen/HomeScreen'
import PostDataScreen from '../../screen/HomePages/PostDataScreen';
import MyProfileScreen from '../../screen/MyProfileScreen';
import FeedBackScreen from '../../screen/DetailPages/ProfileDetailPages/FeedBackScreen';
import MonthlyInfoScreen from '../../screen/DetailPages/ProfileDetailPages/MonthlyInfoScreen';
import UserNoteScreen from '../../screen/DetailPages/ProfileDetailPages/UserNoteScreen';
import NotificationScreen from '../../screen/DetailPages/ProfileDetailPages/NotificationScreen';
import SingleUserNoteScreen from '../../screen/DetailPages/UserNoteDetailPages/SingleUserNoteScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// Profile Stack
function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MyProfile" component={MyProfileScreen} />
            <Stack.Screen name="FeedBack" component={FeedBackScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="User Note" component={UserNoteScreen} />
            <Stack.Screen name="Mouthly Info" component={MonthlyInfoScreen} />
            <Stack.Screen name="User Note Detail" component={SingleUserNoteScreen} />
        </Stack.Navigator>
    );
}

// Ana Tab Yapısı
export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: '#fff',
                    height: 70,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    elevation: 10,
                    justifyContent: "center",
                    paddingTop: 15,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="home" size={focused ? 30 : 24} color={focused ? '#007AFF' : 'gray'} />
                    ),
                }}
            />
            <Tab.Screen
                name="Post"
                component={PostDataScreen}
                options={{
                    tabBarIcon: () => (
                        <LinearGradient colors={['#00c6ff', '#007AFF']} style={styles.postButton}>
                            <Ionicons name="add" size={32} color="#fff" />
                        </LinearGradient>
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileStack"
                component={ProfileStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="person" size={focused ? 30 : 24} color={focused ? '#007AFF' : 'gray'} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    postButton: {
        width: 70,
        height: 70,
        borderRadius: 155,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
        elevation: 8,
    },
});
