import React, { useContext } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import Styles from '../estilos/Styles';

export default function ConfiguracionesScreen({ navigation }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      Alert.alert('Sesión cerrada', 'Has salido de tu cuenta correctamente.');
      navigation.replace('Welcome');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar la sesión. Inténtalo de nuevo.');
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={[Styles.container, { backgroundColor: theme?.colors?.background || '#FFF' }]}>
      <Text style={[Styles.titleText, { color: theme?.colors?.text || '#000' }]}>
        Configuración
      </Text>

      <TouchableOpacity
        style={Styles.button}
        onPress={() => navigation.navigate('UpdatePassword')} // Nombre definido en el Stack.Navigator
      >
        <Text style={Styles.buttonText}>Actualizar contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.button} onPress={toggleTheme}>
        <Text style={Styles.buttonText}>Cambiar tema</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.button} onPress={handleLogout}>
        <Text style={Styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
