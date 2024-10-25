import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../credenciales';

export default function EditarProductoScreen({ route, navigation }) {
  const { productoId } = route.params;
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');

  useEffect(() => {
    // Cargar datos del producto para editar
    const cargarProducto = async () => {
      try {
        const productoRef = doc(db, 'productos', productoId);
        const productoSnap = await getDoc(productoRef);

        if (productoSnap.exists()) {
          const productoData = productoSnap.data();
          setNombre(productoData.nombre);
          setPrecio(productoData.precio.toString());
          setDescripcion(productoData.descripcion);
          setCantidad(productoData.cantidad.toString());
        }
      } catch (error) {
        console.error('Error al cargar el producto: ', error);
      }
    };

    cargarProducto();
  }, [productoId]);

  const handleActualizarProducto = async () => {
    if (nombre && precio && descripcion && cantidad) {
      try {
        const productoRef = doc(db, 'productos', productoId);
        await updateDoc(productoRef, {
          nombre,
          precio: parseFloat(precio),
          descripcion,
          cantidad: parseInt(cantidad), // Actualizamos el stock
        });
        Alert.alert('Producto actualizado', `El producto ${nombre} fue actualizado con éxito`);
        navigation.goBack(); // Vuelve a la pantalla anterior
      } catch (error) {
        console.error('Error al actualizar el producto: ', error);
      }
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
      />
      <TouchableOpacity style={styles.button} onPress={handleActualizarProducto}>
        <Text style={styles.buttonText}>Actualizar Producto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4c68af',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
