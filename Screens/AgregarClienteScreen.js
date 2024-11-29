import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db } from '../credenciales'; // Ajusta la ruta si es necesario
import { collection, addDoc } from 'firebase/firestore';

export default function AgregarClienteScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

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
      navigation.goBack(); // Regresa a la pantalla anterior (ClientesScreen)
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al agregar el cliente.');
      console.error('Error al agregar cliente:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Cliente"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      <TouchableOpacity style={styles.button} onPress={handleAgregarCliente}>
        <Text style={styles.buttonText}>Guardar Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
