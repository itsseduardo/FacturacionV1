import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './Screens/WelcomeScreen';
import TabNavigator from './navegacion/TabNavigator';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <NavigationContainer theme={theme}>
            <Stack.Navigator initialRouteName="Welcome">
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MainApp"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>            
          </NavigationContainer>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}