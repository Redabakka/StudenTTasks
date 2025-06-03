import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../database/firebase';
import { checkTasksAndNotify } from '../notifications/notificationService'; // ✅ Notification auto

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        if (userData.password === password) {
          Alert.alert('Connexion réussie', `Bienvenue ${userData.fullName}`);

          // ✅ Notifications en fonction des tâches
          await checkTasksAndNotify(userData.email);

          // ✅ Remplace l'écran (pas juste empiler)
          navigation.replace('Home', { user: userData });
        } else {
          Alert.alert('Erreur', 'Mot de passe incorrect.');
        }
      } else {
        Alert.alert('Erreur', 'Utilisateur introuvable.');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Connexion</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>

          <Text onPress={() => navigation.navigate('Register')} style={styles.link}>
            Pas encore de compte ? S'inscrire
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    justifyContent: 'center',
    backgroundColor: '#f9fafe',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    backgroundColor: '#2a2a72',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    color: '#2a2a72',
    textAlign: 'center',
    fontSize: 15,
  },
});
