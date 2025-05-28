import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import SignInScreen from '../../screen/LoginPages/SignInScreen';
import SignUpScreen from '../../screen/LoginPages/SignUpScreen';
import MainTabsWithStack from '../Navigation/MainTabsWithStack';
import ResetPasswordScreen from '../../screen/LoginPages/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default function MainApp() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <MainTabsWithStack />
            ) : (
                <Stack.Navigator
                    screenOptions={{
                        headerTitle: '',
                        headerStyle: {
                            backgroundColor: '#fff',
                            elevation: 0,
                            shadowOpacity: 0,
                            borderBottomWidth: 0,
                        },
                    }}
                >
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Reset Password" component={ResetPasswordScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}
