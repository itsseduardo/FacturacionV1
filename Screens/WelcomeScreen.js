import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen({ navigation }) {
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleRegister = async () => {
    if (username && email && password) {
      // Simula el registro guardando el token de usuario
      await AsyncStorage.setItem('userToken', 'abc123');
      // Aquí puedes implementar la lógica de registro real (API, validaciones, etc.)
      Alert.alert('Registro exitoso', `Bienvenido, ${username}!`);
      navigation.replace('MainApp');
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/Welcome.jpg')}  // Asegúrate de que la imagen esté en la carpeta assets
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {!isRegistering ? (
          <>
            <Text style={styles.title}>Bienvenido a su app de Facturación e Inventario</Text>

            {/* Botón de Iniciar Sesión */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            {/* Botón de Crear Cuenta */}
            <TouchableOpacity style={styles.button} onPress={() => setIsRegistering(true)}>
              <Text style={styles.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Crear Cuenta</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor="#ccc"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} onPress={() => setIsRegistering(false)}>
              <Text style={styles.linkText}>Volver</Text>
            </TouchableOpacity>
          </>
        )}
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
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    color: '#000',
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#3498db',
    fontSize: 16,
  },
});