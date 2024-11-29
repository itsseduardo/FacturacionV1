import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../credenciales';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ThemeContext } from '../context/ThemeContext';

export default function EditarClienteScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { clienteId } = route.params;
  const [cliente, setCliente] = useState(null);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const docRef = doc(db, 'clientes', clienteId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const clienteData = docSnap.data();
          setCliente(clienteData);
          setNombre(clienteData.nombre);
          setTelefono(clienteData.telefono);
          setDireccion(clienteData.direccion);
        } else {
          Alert.alert('Error', 'No se encontró el cliente.');
        }
      } catch (error) {
        console.error('Error al cargar cliente:', error);
      }
    };

    cargarCliente();
  }, [clienteId]);

  const guardarCambios = async () => {
    try {
      const docRef = doc(db, 'clientes', clienteId);
      await updateDoc(docRef, { nombre, telefono, direccion });

      Alert.alert('Cliente actualizado', 'Los datos del cliente se han actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el cliente.');
      console.error('Error al actualizar cliente:', error);
    }
  };

  if (!cliente) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Editar Cliente</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
        placeholder="Nombre"
        placeholderTextColor={theme.colors.placeholder}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
        placeholder="Teléfono"
        placeholderTextColor={theme.colors.placeholder}
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
        placeholder="Dirección"
        placeholderTextColor={theme.colors.placeholder}
        value={direccion}
        onChangeText={setDireccion}
      />
      <TouchableOpacity style={styles.botonGuardar} onPress={guardarCambios}>
        <Text style={styles.botonTexto}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  botonGuardar: {
    padding: 15,
    backgroundColor: '#28A745',
    borderRadius: 8,
  },
  botonTexto: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
