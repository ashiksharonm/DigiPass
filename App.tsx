import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import PassengerHomeScreen from './src/screens/PassengerHomeScreen';
import ApplyPassScreen from './src/screens/ApplyPassScreen';
import PassDetailsScreen from './src/screens/PassDetailsScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';
import TravelHistoryScreen from './src/screens/TravelHistoryScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ConductorHomeScreen from './src/screens/ConductorHomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function PassengerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PassengerHome" component={PassengerHomeScreen} />
      <Stack.Screen name="ApplyPass" component={ApplyPassScreen} />
      <Stack.Screen name="PassDetails" component={PassDetailsScreen} />
      <Stack.Screen name="QRCode" component={QRCodeScreen} />
      <Stack.Screen name="History" component={TravelHistoryScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
    </Stack.Navigator>
  );
}

function ConductorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConductorHome" component={ConductorHomeScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  if (user?.role === 'conductor') {
    return <ConductorStack />;
  }

  return <PassengerStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#7B2FBE" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
