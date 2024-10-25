import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { collection, query, where, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../credenciales';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener este paquete instalado

export default function DetalleProductoScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProductos, setFilteredProductos] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const q = query(collection(db, 'productos'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(productosList);
        setFilteredProductos(productosList); // Inicialmente todos los productos
      });

      // Limpiar la suscripción al desmontar el componente
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    // Filtrar productos según el texto de búsqueda
    if (searchText === '') {
      setFilteredProductos(productos);
    } else {
      const filtered = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProductos(filtered);
    }
  }, [searchText, productos]);

  const handleDelete = async (productoId) => {
    try {
      await deleteDoc(doc(db, 'productos', productoId));
      Alert.alert('Producto eliminado', 'El producto ha sido eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Productos</Text>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#333" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredProductos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.producto}>
            <Text style={styles.productoNombre}>{item.nombre}</Text>
            <Text style={styles.productoPrecio}>Precio: ${item.precio}</Text>
            <Text style={styles.productoDescripcion}>Descripción: {item.descripcion}</Text>
            <Text>Cantidad: {item.cantidad}</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Editar"
                onPress={() => navigation.navigate('EditarProducto', { productoId: item.id })}
              />
              <Button
                title="Eliminar"
                color="red"
                onPress={() => handleDelete(item.id)}
              />
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
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  producto: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
    elevation: 3, // Para sombra en Android
    shadowColor: '#000', // Para sombra en iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productoNombre: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productoPrecio: {
    fontSize: 16,
    color: '#4CAF50',
  },
  productoDescripcion: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
