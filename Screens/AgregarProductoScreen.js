import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../credenciales';
import { getAuth } from 'firebase/auth';

export default function AgregarProductoScreen({ navigation }) {
  const { theme } = useContext(ThemeContext); 
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');

  const handleAgregarProducto = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (nombre && precio && descripcion && cantidad) {
      try {
        await addDoc(collection(db, 'productos'), {
          nombre,
          precio: parseFloat(precio),
          descripcion,
          cantidad: parseInt(cantidad),
          userId: user.uid,
          enEspera: false,
          fechaEliminacion: null,
        });

        Alert.alert('Producto agregado', `El producto ${nombre} fue agregado con éxito`, [
          {
            text: 'OK',
            onPress: limpiarCampos,
          },
        ]);

        navigation.navigate('MainApp', {
          screen: 'ProductosStacks',
          params: {
            screen: 'DetalleProducto',
            params: { nombre, precio, descripcion, cantidad },
          },
        });
      } catch (error) {
        console.error('Error al agregar el producto: ', error);
      }
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos.');
    }
  };

  const limpiarCampos = () => {
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setCantidad('');
  };

  const placeholderColor = theme.dark ? '#a9a9a9' : '#6e6e6e';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Agregar Producto</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border },
        ]}
        placeholder="Nombre del producto"
        placeholderTextColor={placeholderColor}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border },
        ]}
        placeholder="Precio"
        keyboardType="numeric"
        placeholderTextColor={placeholderColor}
        value={precio}
        onChangeText={setPrecio}
      />
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border },
        ]}
        placeholder="Descripción"
        placeholderTextColor={placeholderColor}
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border },
        ]}
        placeholder="Cantidad"
        keyboardType="numeric"
        placeholderTextColor={placeholderColor}
        value={cantidad}
        onChangeText={setCantidad}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleAgregarProducto}>
        <Text style={styles.buttonText}>Agregar Producto</Text>
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
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 1,
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