import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';


// function principale du home screen qui affiche tous les informations
export default function HomeScreen({ navigation }) {
  return (
    // ici unr animation depuis lottiefiles
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation2.json')} 
        autoPlay
        loop
        style={styles.animation}
      />

      <Text style={styles.title}>Bienvenue sur StudentTasks 🎓</Text>
      <Text style={styles.subtitle}>Organise tes tâches facilement et reste productif !</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TaskList')}>
        <Text style={styles.buttonText}>Voir mes tâches</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.buttonText}>Ajouter une tâche</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.buttonText}>Mon Profil 👤</Text>
      </TouchableOpacity>

    </View>
  );
}
// le style pour notre page 
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2a2a72',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
