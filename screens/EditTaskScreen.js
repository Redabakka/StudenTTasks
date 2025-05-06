import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { getTaskById, updateTask } from '../database/taskService_firebase';

export default function EditTaskScreen({ route, navigation }) {
  const { taskId } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateFin, setDateFin] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const task = await getTaskById(taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setDateFin(task.dateFin || '');
      } else {
        Alert.alert("Erreur", "Tâche introuvable");
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
    await updateTask(taskId, { title, description, dateFin });
    Alert.alert("Succès", "Tâche mise à jour !");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titre :</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre de la tâche"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description :</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Date de fin :</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-JJ"
        value={dateFin}
        onChangeText={setDateFin}
      />

      <Button title="Enregistrer les modifications" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginBottom: 5, marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
});
