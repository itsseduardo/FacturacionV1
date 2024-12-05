import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db } from '../credenciales'; 
import { collection, addDoc } from 'firebase/firestore';
import { ThemeContext } from '../context/ThemeContext'; 

export default function AgregarClienteScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const { theme } = useContext(ThemeContext);
  const placeholderColor = theme.dark ? '#a9a9a9' : '#6e6e6e';

  const handleAgregarCliente = async () => {
    if (!nombre || !correo || !telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'clientes'), {
        nombre,
        correo,
        telefono,
        direccion,
        creadoEn: new Date().toISOString(),
      });
      Alert.alert('Éxito', 'Cliente agregado correctamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al agregar el cliente.');
      console.error('Error al agregar cliente:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Agregar Cliente</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Nombre del Cliente"
        placeholderTextColor={placeholderColor}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Correo Electrónico"
        placeholderTextColor={placeholderColor}
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Teléfono"
        placeholderTextColor={placeholderColor}
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Dirección"
        placeholderTextColor={placeholderColor}
        value={direccion}
        onChangeText={setDireccion}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleAgregarCliente}
      >
        <Text style={[styles.buttonText]}>Guardar Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
