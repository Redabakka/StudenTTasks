// AddTaskScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addTask } from '../database/taskService_firebase';
import { useNavigation } from '@react-navigation/native';

// Ajouter une tache a partir d'un formulaire 
export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateFin, setDateFin] = useState('');
  const navigation = useNavigation();

  const handleAdd = async () => {
    if (!title || !dateFin) {
      Alert.alert('Champs requis', 'Veuillez remplir le titre et la date de fin.');
      return;
    }

    await addTask(title, description, dateFin);
    Alert.alert('Succès', 'Tâche ajoutée avec succès.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f8ff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#2a2a72' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 15, backgroundColor: '#fff'
  },
  multiline: { height: 100, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#2a2a72', paddingVertical: 14,
    borderRadius: 8, alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
