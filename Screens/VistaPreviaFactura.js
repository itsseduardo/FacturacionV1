import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

export default function VistaPreviaFactura({ route, navigation }) {
  const { cliente, productosSeleccionados, total, cantidades } = route.params;
  const [cantidadesEditadas, setCantidadesEditadas] = useState(cantidades);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productosActualizados, setProductosActualizados] = useState(productosSeleccionados);

  const eliminarProducto = (productoId) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const nuevosProductos = productosActualizados.filter(p => p.id !== productoId);
            const nuevasCantidades = { ...cantidadesEditadas };
            delete nuevasCantidades[productoId];

            // Actualizar el estado de productos y cantidades
            setProductosActualizados(nuevosProductos);
            setCantidadesEditadas(nuevasCantidades);

            // Si el producto eliminado estaba siendo editado, cerramos la edición
            if (productoEditando === productoId) {
              setProductoEditando(null);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const calcularNuevoTotal = () => {
    return productosActualizados.reduce((total, producto) => {
      const cantidad = cantidadesEditadas[producto.id] || 0;
      return total + (producto.precio * cantidad);
    }, 0);
  };

  const formatearTotal = (total) => {
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const iniciarEdicion = (producto) => {
    setProductoEditando(producto.id);
  };

  const confirmarEdicion = (productoId, cantidad) => {
    const nuevaCantidad = parseInt(cantidad);
    
    // Si la cantidad es NaN o menor que 0, no hacemos nada
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
      return;
    }

    const nuevasCantidades = { ...cantidadesEditadas, [productoId]: nuevaCantidad };
    setCantidadesEditadas(nuevasCantidades);
    setProductoEditando(null); // Cerrar el modo de edición
  };

  const renderItem = ({ item }) => (
    <View style={styles.productoItem}>
      <Text>{item.nombre}</Text>
      {productoEditando === item.id ? (
        <TextInput
          style={styles.inputCantidad}
          keyboardType="numeric"
          defaultValue={cantidadesEditadas[item.id].toString()} // Usamos defaultValue aquí
          onChangeText={(cantidad) => confirmarEdicion(item.id, cantidad)}
          onBlur={() => setProductoEditando(null)} // Cerrar la edición al perder el foco
        />
      ) : (
        <View>
          <Text>Cantidad: {cantidadesEditadas[item.id]}</Text>
          <Text>Precio: ${formatearTotal(item.precio)}</Text>
          <Text>Total: ${formatearTotal(item.precio * cantidadesEditadas[item.id])}</Text>
        </View>
      )}
      <View style={styles.botones}>
        <TouchableOpacity
          style={styles.boton}
          onPress={() => iniciarEdicion(item)} // Inicia el modo de edición
        >
          <Text style={styles.botonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.boton, styles.botonEliminar]}
          onPress={() => eliminarProducto(item.id)}
        >
          <Text style={styles.botonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vista Previa de Factura</Text>
      <Text style={styles.cliente}>Cliente: {cliente}</Text>
      <FlatList
        data={productosActualizados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <Text style={styles.total}>Total: ${formatearTotal(calcularNuevoTotal())}</Text>
      <TouchableOpacity 
        style={styles.botonFinalizar} 
        onPress={() => navigation.navigate('CrearFactura')}
      >
        <Text style={styles.botonText}>Finalizar Factura</Text>
      </TouchableOpacity>
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
  cliente: {
    fontSize: 20,
    marginBottom: 15,
    color: '#333',
  },
  productoItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boton: {
    backgroundColor: '#4c68af',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  botonEliminar: {
    backgroundColor: '#d9534f',
  },
  botonText: {
    color: '#fff',
  },
  total: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  botonFinalizar: {
    backgroundColor: '#4c68af',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  inputCantidad: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
