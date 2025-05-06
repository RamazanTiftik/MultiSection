import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StatisticsScreen from "./screen/StatisticsScreen"
import MyProfileScreen from "./screen/MyProfileScreen"
import { Ionicons } from '@expo/vector-icons';
import SignInScreen from './screen/LoginPages/SignInScreen';
import SignUpScreen from './screen/LoginPages/SignUpScreen';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='SignIn'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = route.name === 'Home' ? 'home' : 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >

        <Tab.Screen name='SignIn' component={SignInScreen} />

        <Tab.Screen name='SignUp' component={SignUpScreen} />

        <Tab.Screen name="Home" component={StatisticsScreen} />

        <Tab.Screen name="MyProfile" component={MyProfileScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
