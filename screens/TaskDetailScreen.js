import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTaskById } from '../database/taskService_firebase';

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

  const formatDateTime = (input) => {
    const dateObj = input?.toDate?.() || new Date(input);
    if (isNaN(dateObj.getTime())) return 'Date inconnue';
    return dateObj.toLocaleString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2a2a72" />
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Tâche introuvable.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>

      <Text style={styles.label}>Description :</Text>
      <Text style={styles.text}>{task.description || 'Aucune'}</Text>

      <Text style={styles.label}>Créée le :</Text>
      <Text style={styles.text}>{formatDateTime(task.dateCreation)}</Text>

      <Text style={styles.label}>À finir avant :</Text>
      <Text style={styles.text}>{formatDateTime(task.dateFin)}</Text>

      <Text style={styles.label}>Statut :</Text>
      <Text style={[styles.text, { color: task.isDone ? 'green' : 'red', fontWeight: 'bold' }]}>
        {task.isDone ? '✔️ Terminée' : '⏳ En cours'}
      </Text>

      {task.emailUtilisateur && (
        <>
          <Text style={styles.label}>Créée par :</Text>
          <Text style={styles.text}>{task.emailUtilisateur}</Text>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8faff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2a2a72',
    textAlign: 'center'
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444'
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50
  }
});
