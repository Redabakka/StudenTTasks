import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getTaskById } from '../database/taskService_firebase';

// Voire en detail les informations d'une taches 
export default function TaskDetailScreen({ route }) {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const data = await getTaskById(taskId);
      setTask(data);
      setLoading(false);
    };
    fetchTask();
  }, [taskId]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2a2a72" />;
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Tâche introuvable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.label}>Description :</Text>
      <Text style={styles.text}>{task.description || 'Aucune'}</Text>
      <Text style={styles.label}>Date de création :</Text>
      <Text style={styles.text}>{new Date(task.dateCreation).toLocaleString()}</Text>
      <Text style={styles.label}>Date de fin :</Text>
      <Text style={styles.text}>{new Date(task.dateFin).toLocaleDateString()}</Text>
      <Text style={styles.label}>Statut :</Text>
      <Text style={[styles.text, { color: task.isDone ? 'green' : 'red' }]}>
        {task.isDone ? 'Terminée' : 'En cours'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8faff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2a2a72' },
  label: { fontWeight: 'bold', marginTop: 10, color: '#444' },
  text: { fontSize: 16, color: '#555' },
  error: { fontSize: 18, color: 'red', textAlign: 'center' },
});
