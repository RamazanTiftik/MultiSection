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


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator()


function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.customButtonContainer}
    >
      <View style={styles.customButton}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          height: 60,
          elevation: 10,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={24} />
          )
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostDataScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="add" color="#fff" size={32} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          )
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={24} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <- Giriş durumu

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabs />
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
});
