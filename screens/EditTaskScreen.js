import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import { getTaskById, updateTask } from '../database/taskService_firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditTaskScreen({ route, navigation }) {
  const { taskId } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateFin, setDateFin] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const task = await getTaskById(taskId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description || '');
          setDateFin(task.dateFin || '');
        } else {
          Alert.alert("Erreur", "Tâche introuvable");
          navigation.goBack();
        }
      } catch (err) {
        Alert.alert("Erreur", "Impossible de charger la tâche");
        navigation.goBack();
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Erreur", "Le titre est requis");
      return;
    }

    try {
      await updateTask(taskId, { title, description, dateFin });
      Alert.alert("Succès", "Tâche mise à jour !");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", "Échec de la mise à jour");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>📝 Modifier la tâche</Text>

      <Text style={styles.label}>Titre :</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre de la tâche"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description :</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Date de fin :</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-JJ"
        value={dateFin}
        onChangeText={setDateFin}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Enregistrer les modifications</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f5f8ff'
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2a2a72',
    marginBottom: 20
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff'
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
    marginTop: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
