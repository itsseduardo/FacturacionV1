// utils/productos.js

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../credenciales';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

export const agregarProducto = async (producto) => {
  try {
    // Agregar el producto a la colección "productos" en Firestore, con los campos adicionales
    await addDoc(collection(db, 'productos'), {
      ...producto,             // Incluye los datos del producto que pasas como parámetro
      enEspera: false,          // Estado inicial de eliminación en false
      fechaEliminacion: null,   // Fecha de eliminación inicial como null
    });
    console.log('Producto agregado con éxito');
  } catch (error) {
    console.error('Error al agregar producto:', error);
  }
};

export const eliminarProductoTemporalmente = async (productoId) => {
    const fechaActual = Timestamp.now();
    const fechaEliminacion = new Date();
    fechaEliminacion.setDate(fechaEliminacion.getDate() + 15);
  
    try {
      const productoRef = doc(db, 'productos', productoId);
      await updateDoc(productoRef, {
        enEspera: true,
        fechaEliminacion: Timestamp.fromDate(fechaEliminacion),
      });
      console.log('Producto marcado para eliminación en 15 días');
    } catch (error) {
      console.error('Error al marcar el producto para eliminación:', error);
    }
  };

  export const revertirEliminacionProducto = async (productoId) => {
    try {
      const productoRef = doc(db, 'productos', productoId);
      await updateDoc(productoRef, {
        enEspera: false,
        fechaEliminacion: null,
      });
      console.log('El producto ha sido restaurado y ya no está en espera de eliminación');
    } catch (error) {
      console.error('Error al restaurar el producto:', error);
    }
  };