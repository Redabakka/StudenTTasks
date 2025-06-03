import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getUserByEmail } from '../database/userService_firebase';
// import { checkTasksAndNotify } from '../notifications/notificationService';

export default function HomeScreen({ navigation, route }) {
  const { user: initialUser } = route.params;
  const [user, setUser] = useState(initialUser);

  // Actualise les infos utilisateur à chaque fois qu'on revient sur cet écran
  useFocusEffect(
    React.useCallback(() => {
      const refreshUser = async () => {
        const updatedUser = await getUserByEmail(initialUser.email);
        if (updatedUser) setUser(updatedUser);
      };

      refreshUser();
      // Optionnel : déclencher les notifications automatiquement
      // await checkTasksAndNotify(initialUser.email);
    }, [initialUser.email])
  );

  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        source={require('../assets/Animation2.json')}
        autoPlay
        loop
        style={styles.animation}
      />

      <Text style={styles.title}>Bienvenue {user.fullName} 👋</Text>
      <Text style={styles.subtitle}>Statut : {user.status}</Text>
      <Text style={styles.subtitle}>Email : {user.email}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TaskList', { user })}
      >
        <Text style={styles.buttonText}>Voir mes tâches</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddTask', { user })}
      >
        <Text style={styles.buttonText}>Ajouter une tâche</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Profile', { email: user.email })}
      >
        <Text style={styles.buttonText}>Mon Profil 👤</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ScanQR', { user })}
      >
        <Text style={styles.buttonText}>Scanner un QR Code 📷</Text>
      </TouchableOpacity>

      <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Dashboard', { user })}
        >
          <Text style={styles.buttonText}>📊 Tableau de bord</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => navigation.replace('Welcome')}
      >
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2a2a72',
    paddingVertical: 14,
    width: '80%',
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    marginTop: 30,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
