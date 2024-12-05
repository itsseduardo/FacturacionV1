import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { app } from '../credenciales';

const auth = getAuth(app);
const db = getFirestore(app);

export const registrarUsuario = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    
    await setDoc(doc(db, "users", user.uid), { email, password });
    return user;
  } catch (error) {
    console.error("Error en el registro:", error);
    throw error;
  }
};

export const iniciarSesion = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Referencia al documento del usuario
    const userDoc = doc(db, "users", user.uid);

    // Verificar si el documento del usuario existe
    const docSnap = await getDoc(userDoc);
    if (!docSnap.exists()) {
      // Si no existe, lo creamos
      await setDoc(userDoc, { email, password });
    } else {
      // Si existe, actualizamos el campo de contraseña
      await setDoc(userDoc, { password });
    }

    return user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const obtenerPasswordActual = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().password;
    } else {
      throw new Error("No se encontró el usuario.");
    }
  } catch (error) {
    console.error("Error al obtener la contraseña actual:", error);
    throw error;
  }
};


export const enviarCorreoReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error al enviar correo de restablecimiento:", error);
    throw error;
  }
};