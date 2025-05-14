import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getTasksByUser,
  deleteTask,
  toggleTaskStatus
} from '../database/taskService_firebase';

export default function TaskListScreen({ navigation, route }) {
  const { user } = route.params;

  const [tasks, setTasks] = useState([]);

  const chargerTaches = async () => {
    const data = await getTasksByUser(user.email);
    setTasks(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      chargerTaches();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id) => {
    Alert.alert("Supprimer ?", "Confirmer la suppression ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteTask(id);
          chargerTaches();
        }
      }
    ]);
  };

  const handleToggleStatus = async (id, isDone) => {
    await toggleTaskStatus(id, isDone);
    chargerTaches();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      style={styles.card}
    >
      <View style={styles.taskInfo}>
        <Text style={[styles.title, item.isDone && styles.done]}>{item.title}</Text>
        <Text style={styles.date}>📅 Jusqu’au : {new Date(item.dateFin).toLocaleDateString()}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleToggleStatus(item.id, item.isDone)}>
          <Text style={styles.actionButton}>{item.isDone ? "❌" : "✔️"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.actionButton}>🗑️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditTask', { taskId: item.id })}>
          <Text style={styles.actionButton}>✏️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>📝 Mes Tâches</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune tâche pour le moment.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8faff' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2a2a72'
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#ccc',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  taskInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: '500', color: '#333' },
  done: { textDecorationLine: 'line-through', color: '#999' },
  date: { fontSize: 12, color: '#777', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  actionButton: { fontSize: 20, marginLeft: 12 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});
