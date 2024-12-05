import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import AkomodasiDashboard from './src/screens/AkomodasiDashboard';
import WisataDashboard from './src/screens/WisataDashboard';
import KulinerDashboard from './src/screens/KulinerDashboard';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer> 
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                <Stack.Screen name="WisataDashboard" component={WisataDashboard} />
                <Stack.Screen name="AkomodasiDashboard" component={AkomodasiDashboard} />
                <Stack.Screen name="KulinerDashboard" component={KulinerDashboard} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
