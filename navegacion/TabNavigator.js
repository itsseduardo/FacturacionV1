import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';

// Importa los StackNavigators
import ProductosStack from './ProductosStacks';
import FacturacionStack from './FacturacionStacks';
import ReportesScreen from '../Screens/ReportesScreen'; // Si tienes un stack para reportes
import ClientesScreen from '../Screens/ClientesScreen';  // Stack para clientes
import ConfiguracionesScreen from '../Screens/ConfiguracionesScreen';// Stack para configuraciones

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
    
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Productos') {
            iconName = 'cube-outline';
          } else if (route.name === 'Facturación') {
            iconName = 'document-text-outline';
          } else if (route.name === 'Reportes') {
            iconName = 'bar-chart-outline';
          } else if (route.name === 'Clientes') {
            iconName = 'people-outline';
          } else if (route.name === 'Configuraciones') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Productos" component={ProductosStack} options={{ headerShown: false }}/>
      
      <Tab.Screen name="Facturación" component={FacturacionStack} options={{ headerShown: false }}/>

      <Tab.Screen name="Reportes" component={ReportesScreen} />
      <Tab.Screen name="Clientes" component={ClientesScreen} />
      <Tab.Screen name="Configuraciones" component={ConfiguracionesScreen} />
    </Tab.Navigator>
  );
}
