import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import ProductosStack from './ProductosStacks';
import FacturacionStack from './FacturacionStacks';
import ReportesScreen from '../Screens/ReportesScreen';
import ClientesStack from './ClientesStack';
import { ThemeContext } from '../context/ThemeContext';
import ConfiguracionesStack from './ConfiguracionesStack';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Productos') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Facturación') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Reportes') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Clientes') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Configuraciones') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
        },
      })}
    >
      <Tab.Screen name="Productos" component={ProductosStack} options={{ headerShown: false }} />
      <Tab.Screen name="Facturación" component={FacturacionStack} options={{ headerShown: false }} />
      <Tab.Screen name="Reportes" component={ReportesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Clientes" component={ClientesStack} options={{ headerShown: false }} />
      <Tab.Screen name="Configuraciones" component={ConfiguracionesStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}