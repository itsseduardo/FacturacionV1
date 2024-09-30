import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
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
    <ImageBackground 
    source={require('../assets/Welcome.jpg')}  // Asegúrate de que la imagen esté en la carpeta assets
    style={styles.backgroundImage}
    resizeMode="cover"
  >
    <View style={styles.overlay}>
      <Text style={styles.title}>Bienvenido a su app de Facturación e Inventario</Text>

      {/* Botón de Iniciar Sesión */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* Botón de Crear Cuenta */}
      <TouchableOpacity style={styles.button} onPress={() => alert('Funcionalidad de crear cuenta')}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Añade un overlay semi-transparente
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
