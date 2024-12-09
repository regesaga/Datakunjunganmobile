import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import AkomodasiDashboard from './src/screens/AkomodasiDashboard';
import WisataDashboard from './src/screens/WisataDashboard';
import KulinerDashboard from './src/screens/KulinerDashboard';

import CreateWisnuWisata from './src/screens/Wisata/CreateWisnuWisata';
import CreateWisnuAkomodasi from './src/screens/Akomodasi/CreateWisnuAkomodasi';
import CreateWisnuKuliner from './src/screens/Kuliner/CreateWisnuKuliner';


import KunjunganWisata from './src/screens/Wisata/KunjunganWisata';
import KunjunganAkomodasi from './src/screens/Akomodasi/KunjunganAkomodasi';
import KunjunganKuliner from './src/screens/Kuliner/KunjunganKuliner';


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

                <Stack.Screen name="CreateWisnuWisata" component={CreateWisnuWisata} />
                <Stack.Screen name="CreateWisnuKuliner" component={CreateWisnuKuliner} />
                <Stack.Screen name="CreateWisnuAkomodasi" component={CreateWisnuAkomodasi} />



                <Stack.Screen name="KunjunganWisata" component={KunjunganWisata} />
                <Stack.Screen name="KunjunganKuliner" component={KunjunganKuliner} />
                <Stack.Screen name="KunjunganAkomodasi" component={KunjunganAkomodasi} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
