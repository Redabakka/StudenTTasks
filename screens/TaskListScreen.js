// Nouveau TaskListScreen.js avec DropDownPicker pour iOS/Android

import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  getTasksByUser,
  deleteTask,
  toggleTaskStatus
} from '../database/taskService_firebase';

export default function TaskListScreen({ navigation, route }) {
  const { user } = route.params;
  const [tasks, setTasks] = useState([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('date');
  const [items, setItems] = useState([
    { label: 'Date', value: 'date' },
    { label: 'Terminées', value: 'done' },
    { label: 'En cours', value: 'inProgress' },
    { label: 'En retard', value: 'late' }
  ]);

  const chargerTaches = async () => {
    const data = await getTasksByUser(user.email);
    const now = new Date();

    let sortedTasks = [...data];
    sortedTasks.forEach(task => {
      task.dateObj = task.dateFin?.toDate?.() || new Date(task.dateFin);
    });

    switch (value) {
      case 'done':
        sortedTasks = sortedTasks.filter(t => t.isDone);
        sortedTasks.sort((a, b) => a.dateObj - b.dateObj);
        break;
      case 'late':
        sortedTasks = sortedTasks.filter(t => !t.isDone && t.dateObj < now);
        sortedTasks.sort((a, b) => a.dateObj - b.dateObj);
        break;
      case 'inProgress':
        sortedTasks = sortedTasks.filter(t => !t.isDone && t.dateObj >= now);
        sortedTasks.sort((a, b) => a.dateObj - b.dateObj);
        break;
      case 'date':
      default:
        sortedTasks.sort((a, b) => a.dateObj - b.dateObj);
    }

    setTasks(sortedTasks);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      chargerTaches();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    chargerTaches();
  }, [value]);

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

  const renderItem = ({ item }) => {
    const date = item.dateObj;
    const isLate = !item.isDone && date < new Date();

    let badge = '🟡';
    if (item.isDone) badge = '🟢';
    else if (isLate) badge = '🔴';

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
        style={styles.card}
      >
        <View style={styles.taskInfo}>
          <Text style={[styles.title, item.isDone && styles.done]}>{item.title}</Text>
          <Text style={styles.date}>
            📅 Jusqu’au : {date.toLocaleString('fr-FR', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </Text>
          <Text style={{ fontSize: 20 }}>{badge}</Text>
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>📝 Mes Tâches</Text>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>🔽 Tri par :</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          containerStyle={{ width: 180 }}
          style={styles.picker}
          dropDownContainerStyle={{ backgroundColor: '#fff' }}
          textStyle={{ color: '#2a2a72' }}
          zIndex={1000}
        />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune tâche à afficher.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8faff' },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#2a2a72' },
  sortContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, zIndex: 1000 },
  sortLabel: { fontSize: 16, color: '#2a2a72', marginRight: 8 },
  picker: { backgroundColor: '#e3e7ff', borderColor: '#2a2a72' },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 10, shadowColor: '#ccc', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  taskInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: '500', color: '#333' },
  done: { textDecorationLine: 'line-through', color: '#999' },
  date: { fontSize: 12, color: '#777', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  actionButton: { fontSize: 20, marginLeft: 12 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});