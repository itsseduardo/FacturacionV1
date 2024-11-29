import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; 
import { getAuth, updatePassword, signOut } from 'firebase/auth';

export default function UpdatePasswordScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState('');
  const { theme } = useContext(ThemeContext);

  const handlePasswordUpdate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!newPassword) {
      Alert.alert('Error', 'Por favor, ingresa una nueva contraseña');
      return;
    }

    try {
      await updatePassword(user, newPassword);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      await signOut(auth);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña. Intenta nuevamente.');
      console.log(error);
    }
  };

  const placeholderColor = theme.dark ? '#a9a9a9' : '#6e6e6e';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Actualizar Contraseña</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Nueva contraseña"
        placeholderTextColor={placeholderColor}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handlePasswordUpdate}>
        <Text style={styles.buttonText}>Actualizar Contraseña</Text>
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