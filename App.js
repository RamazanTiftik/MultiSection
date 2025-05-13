import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HomeScreen from "./screen/HomeScreen"
import MyProfileScreen from "./screen/MyProfileScreen"
import { Ionicons } from '@expo/vector-icons';
import SignInScreen from './screen/LoginPages/SignInScreen';
import SignUpScreen from './screen/LoginPages/SignUpScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import PostDataScreen from './screen/HomePages/PostDataScreen';
import { LinearGradient } from 'expo-linear-gradient';
import MainTabsWithStack from './component/Navigation/MainTabsWithStack';


const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // giriş durumu

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabsWithStack />
      ) : (
        <Stack.Navigator screenOptions={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}>
          <Stack.Screen name="SignIn">
            {(props) => <SignInScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {(props) => <SignUpScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
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
  customButtonContainer: {
    top: Platform.OS === 'android' ? -20 : -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#fff',
    transform: [{ scale: 1.05 }],
  },
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
