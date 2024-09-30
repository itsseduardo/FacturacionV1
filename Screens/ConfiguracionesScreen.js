import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import Styles from '../estilos/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfiguracionesScreen({ navigation }) {

  const handleLogout = async () => {
    try {
      // Elimina el token de usuario
      await AsyncStorage.removeItem('userToken');
      // Redirige a la pantalla de bienvenida
      navigation.replace('Welcome');
    } catch (e) {
      console.log('Error al cerrar sesión');
    }
  };

  return (
    <View style={Styles.container}>
      {/* Agregar imagen */}
      <Image 
        source={require('../assets/gear_850666.png')} 
        style={Styles.image}  // Usar el estilo global para la imagen
      />
      
      {/* Texto centrado */}
      <Text style={Styles.titleText}>Pantalla de Configuraciones</Text>
      
      {/* Botón de cerrar sesión */}
      <View style={Styles.buttonContainer}>
        <Button title="Cerrar sesión" onPress={handleLogout} />
      </View>
    </View>
  );
}
