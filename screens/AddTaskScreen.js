import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addTask } from '../database/taskService_firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTaskScreen({ route, navigation }) {
  const { user } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateFin, setDateFin] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAdd = async () => {
    if (!title || !dateFin) {
      Alert.alert('Champs requis', 'Veuillez remplir le titre et la date de fin.');
      return;
    }

    try {
      // ✅ ENVOYER UN OBJET Date et non une string
      await addTask(title, description, dateFin, user.email);
      Alert.alert('Succès', 'Tâche ajoutée avec succès.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Échec lors de l’ajout de la tâche.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const updatedDate = new Date(dateFin);
      updatedDate.setFullYear(selectedDate.getFullYear());
      updatedDate.setMonth(selectedDate.getMonth());
      updatedDate.setDate(selectedDate.getDate());
      setDateFin(updatedDate);
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'set' && selectedTime) {
      const updatedDate = new Date(dateFin);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setDateFin(updatedDate);
    }
    setShowTimePicker(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>📅 {dateFin.toLocaleDateString('fr-FR')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
            <Text>🕒 {dateFin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateFin}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={dateFin}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Ajouter la tâche</Text>
          </TouchableOpacity>

        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#f5f8ff',
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
