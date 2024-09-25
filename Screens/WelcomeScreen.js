import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen({ navigation }) {
  
  const checkSession = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        // Si ya ha iniciado sesión, navega al TabNavigator
        navigation.replace('MainApp');
      }
    } catch (e) {
      console.log('Error al recuperar la sesión');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogin = async () => {
    try {
      // Simula el inicio de sesión guardando un token de usuario
      await AsyncStorage.setItem('userToken', 'abc123');
      // Navega a la app principal
      navigation.replace('MainApp');
    } catch (e) {
      console.log('Error al iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Bienvenido a la app de Facturación e Inventario</Text>
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Button title="Crear cuenta" onPress={() => alert('Funcionalidad de crear cuenta')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
