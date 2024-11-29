import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function VistaPreviaFactura({ route, navigation }) {
  const { cliente, productosSeleccionados, total, cantidades } = route.params;
  const [cantidadesEditadas, setCantidadesEditadas] = useState(cantidades);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productosActualizados, setProductosActualizados] = useState(productosSeleccionados);
  const { theme } = useContext(ThemeContext);

  const eliminarProducto = (productoId) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            const nuevosProductos = productosActualizados.filter((p) => p.id !== productoId);
            const nuevasCantidades = { ...cantidadesEditadas };
            delete nuevasCantidades[productoId];

            setProductosActualizados(nuevosProductos);
            setCantidadesEditadas(nuevasCantidades);

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
      return total + producto.precio * cantidad;
    }, 0);
  };

  const formatearTotal = (total) => {
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const iniciarEdicion = (producto) => {
    setProductoEditando(producto.id);
  };

  const confirmarEdicion = (productoId, cantidad) => {
    const nuevaCantidad = parseInt(cantidad, 10);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
      return;
    }

    const nuevasCantidades = { ...cantidadesEditadas, [productoId]: nuevaCantidad };
    setCantidadesEditadas(nuevasCantidades);
    setProductoEditando(null);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.productoItem, { backgroundColor: theme.colors.card }]} >
      <Text style={[styles.text, { color: theme.colors.text }]}>{item.nombre}</Text>
      {productoEditando === item.id ? (
        <TextInput
          style={[
            styles.inputCantidad,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          keyboardType="numeric"
          defaultValue={cantidadesEditadas[item.id].toString()}
          onChangeText={(cantidad) => confirmarEdicion(item.id, cantidad)}
          onBlur={() => setProductoEditando(null)}
          placeholder="Editar cantidad"
          placeholderTextColor={theme.colors.placeholder}
        />
      ) : (
        <View>
          <Text style={[styles.text, { color: theme.colors.text }]}>Cantidad: {cantidadesEditadas[item.id]}</Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>Precio: ${formatearTotal(item.precio)}</Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>Total: ${formatearTotal(item.precio * cantidadesEditadas[item.id])}</Text>
        </View>
      )}
      <View style={styles.botones}>
        <TouchableOpacity
          style={[styles.boton, styles.botonEditar]}
          onPress={() => iniciarEdicion(item)}
        >
          <Text style={[styles.botonText]}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.boton, styles.botonEliminar]}
          onPress={() => eliminarProducto(item.id)}
        >
          <Text style={[styles.botonText]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Vista Previa de Factura</Text>
      <Text style={[styles.text, { color: theme.colors.text }]}>Cliente: {cliente.nombre}</Text>

      <FlatList
        data={productosActualizados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Text style={[styles.total, { color: theme.colors.text }]}>Total: ${formatearTotal(calcularNuevoTotal())}</Text>

      <TouchableOpacity
        style={[styles.botonFinalizar]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.botonTextFinalizar]}>Finalizar Factura</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 5,
  },
  productoItem: {
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  inputCantidad: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
    marginTop: 10,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  boton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  botonEditar: {
    backgroundColor: '#007AFF',
  },
  botonEliminar: {
    backgroundColor: '#FF3B30',
  },
  botonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  botonFinalizar: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#34C759',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  botonTextFinalizar: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});
