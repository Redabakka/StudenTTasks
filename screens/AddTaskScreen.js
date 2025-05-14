import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { addTask } from '../database/taskService_firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTaskScreen({ route, navigation }) {
  const { user } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateFin, setDateFin] = useState('');

  const handleAdd = async () => {
    if (!title || !dateFin) {
      Alert.alert('Champs requis', 'Veuillez remplir le titre et la date de fin.');
      return;
    }

    try {
      await addTask(title, description, dateFin, user.email);
      Alert.alert('Succès', 'Tâche ajoutée avec succès.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Échec lors de l’ajout de la tâche.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>➕ Nouvelle Tâche</Text>

      <TextInput
        style={styles.input}
        placeholder="Titre de la tâche"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Description (facultatif)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Date de fin (ex: 2025-05-15)"
        value={dateFin}
        onChangeText={setDateFin}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Ajouter la tâche</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f8ff',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2a2a72',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2a2a72',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
