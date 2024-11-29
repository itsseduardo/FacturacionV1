import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Alert, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../credenciales';
import Icon from 'react-native-vector-icons/Ionicons';
import { eliminarProductoTemporalmente, revertirEliminacionProducto } from '../utils/productos';
import { ThemeContext } from '../context/ThemeContext';

export default function DetalleProductoScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProductos, setFilteredProductos] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const q = query(collection(db, 'productos'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProductos(productosList);
        setFilteredProductos(productosList);
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (searchText === '') {
      setFilteredProductos(productos);
    } else {
      const filtered = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProductos(filtered);
    }
  }, [searchText, productos]);

  const handleDelete = (productoId) => {
    Alert.alert(
      'Confirmación de Eliminación',
      '¿Estás seguro de que deseas eliminar este producto? Tienes 15 días para revertir la decisión.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            await eliminarProductoTemporalmente(productoId);
            Alert.alert('Producto en espera de eliminación', 'Este producto ha sido marcado para eliminación en 15 días.');
          },
        },
      ]
    );
  };

  const placeholderColor = theme.dark ? '#a9a9a9' : '#6e6e6e';
  const restoreButtonBackground = theme.dark ? '#2ecc71' : '#27ae60'; // Green background for restore button
  const deleteButtonBackground = theme.dark ? '#e74c3c' : '#c0392b'; // Red background for delete button

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Mis Productos</Text>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Icon name="search" size={20} color={theme.colors.text} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Buscar producto..."
          placeholderTextColor={placeholderColor}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredProductos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.producto, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.productoNombre, { color: theme.colors.text }]}>{item.nombre}</Text>
            <Text style={[styles.productoPrecio, { color: theme.colors.text }]}>Precio: ${item.precio}</Text>
            <Text style={[styles.productoDescripcion, { color: theme.colors.text }]}>Descripción: {item.descripcion}</Text>
            <Text style={{ color: theme.colors.text }}>Cantidad: {item.cantidad}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('EditarProducto', { productoId: item.id })}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              {item.enEspera ? (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: restoreButtonBackground }]}
                  onPress={async () => {
                    await revertirEliminacionProducto(item.id);
                    Alert.alert('Producto restaurado', 'Este producto ya no está en espera de eliminación.');
                  }}
                >
                  <Text style={styles.buttonText}>Restaurar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: 'red' }]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  producto: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productoPrecio: {
    fontSize: 16,
    marginBottom: 5,
  },
  productoDescripcion: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});