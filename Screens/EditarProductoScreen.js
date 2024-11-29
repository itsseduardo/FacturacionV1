import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../credenciales';
import { ThemeContext } from '../context/ThemeContext';

export default function EditarProductoScreen({ route, navigation }) {
  const { productoId } = route.params;
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
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
          cantidad: parseInt(cantidad),
        });
        Alert.alert('Producto actualizado', `El producto ${nombre} fue actualizado con éxito`);
        navigation.goBack();
      } catch (error) {
        console.error('Error al actualizar el producto: ', error);
      }
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos.');
    }
  };

  const placeholderColor = theme.dark ? '#a9a9a9' : '#6e6e6e';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Editar Producto</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}
        placeholder="Nombre del producto"
        placeholderTextColor={placeholderColor}
        value={nombre}
        onChangeText={setNombre}
        selectionColor={theme.colors.primary}
      />
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}
        placeholder="Precio"
        keyboardType="numeric"
        placeholderTextColor={placeholderColor}
        value={precio}
        onChangeText={setPrecio}
        selectionColor={theme.colors.primary}
      />
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}
        placeholder="Descripción"
        placeholderTextColor={placeholderColor}
        value={descripcion}
        onChangeText={setDescripcion}
        selectionColor={theme.colors.primary}
      />
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}
        placeholder="Cantidad"
        keyboardType="numeric"
        placeholderTextColor={placeholderColor}
        value={cantidad}
        onChangeText={setCantidad}
        selectionColor={theme.colors.primary}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleActualizarProducto}>
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
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
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