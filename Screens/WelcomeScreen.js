import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, Modal } from 'react-native';
import { iniciarSesion, registrarUsuario, enviarCorreoReset } from '../utils/autenticacion';

export default function WelcomeScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetModalVisible, setResetModalVisible] = useState(false);

  
  const handleLogin = async () => {
    if (email && password) {
      try {
        await iniciarSesion(email, password);
        Alert.alert('Inicio de sesión exitoso', 'Has iniciado sesión correctamente.');
        navigation.replace('MainApp');
      } catch (error) {
        Alert.alert('Error al iniciar sesión', error.message);
      }
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  const handleRegister = async () => {
    if (email && password) {
      try {
        await registrarUsuario(email, password);
        Alert.alert('Registro exitoso', 'Has sido registrado con éxito.');
        navigation.replace('MainApp'); 
      } catch (error) {
        Alert.alert('Error en el registro', error.message);
      }
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor, ingresa tu correo electrónico.');
      return;
    }
    try {
      await enviarCorreoReset(email);
      Alert.alert('Correo enviado', 'Hemos enviado un enlace de restablecimiento de contraseña a tu correo.');
      setResetModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'No pudimos enviar el correo. Verifica tu email.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Welcome.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Bienvenido a tu App de facturación</Text>

        {/* Campo de correo electrónico */}
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />

        {/* Campo de contraseña */}
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Contenedor para botones de iniciar sesión y crear cuenta */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>

        {/* Botón para contraseñas olvidadas */}
        <TouchableOpacity onPress={() => setResetModalVisible(true)}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Modal para restablecer contraseña */}
        <Modal
          transparent
          visible={resetModalVisible}
          animationType="slide"
          onRequestClose={() => setResetModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Restablecer contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Enviar enlace</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonCancel} onPress={() => setResetModalVisible(false)}>
                <Text style={styles.buttonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: '#333',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '48%',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonCancel: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  buttonTextCancel: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
});