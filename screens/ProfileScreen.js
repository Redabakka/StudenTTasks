// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllTasks } from '../database/taskService_firebase';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [stats, setStats] = useState({ done: 0, pending: 0 });

  useEffect(() => {
    loadProfile();
    fetchStats();
  }, []);

  const loadProfile = async () => {
    const savedName = await AsyncStorage.getItem('user_name');
    const savedEmail = await AsyncStorage.getItem('user_email');
    const savedStatus = await AsyncStorage.getItem('user_status');
    const savedImage = await AsyncStorage.getItem('user_image');

    if (savedName && savedEmail && savedStatus) {
      setName(savedName);
      setEmail(savedEmail);
      setStatus(savedStatus);
      setImage(savedImage);
      setIsEditing(false);
    }
  };

  const fetchStats = async () => {
    const tasks = await getAllTasks();
    const done = tasks.filter(t => t.isDone).length;
    const pending = tasks.filter(t => !t.isDone).length;
    setStats({ done, pending });
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Autorisez l’accès aux photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const saveProfile = async () => {
    if (!name || !email || !status) return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    await AsyncStorage.setItem('user_name', name);
    await AsyncStorage.setItem('user_email', email);
    await AsyncStorage.setItem('user_status', status);
    if (image) await AsyncStorage.setItem('user_image', image);
    setIsEditing(false);
  };

  const resetProfile = async () => {
    await AsyncStorage.multiRemove(['user_name', 'user_email', 'user_image', 'user_status']);
    setName('');
    setEmail('');
    setStatus('');
    setImage(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>👤 Crée ton profil</Text>
        <TextInput placeholder="Nom" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Statut (étudiant, prof, ...)" value={status} onChangeText={setStatus} style={styles.input} />
        <Button title="Choisir une image" onPress={handleImagePick} />
        <Button title="Valider le profil" onPress={saveProfile} color="#2a2a72" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {image ? <Image source={{ uri: image }} style={styles.image} /> : <View style={styles.placeholderImage} />}
      <Text style={styles.name}>{name || "Nom non fourni"}</Text>
      <Text style={styles.email}>{email || "Email non fourni"}</Text>
      <Text style={styles.status}>{status ? `Statut : ${status}` : "Statut non défini"}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
        <Text style={styles.buttonText}>Modifier le profil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={resetProfile}>
        <Text style={styles.buttonText}>Réinitialiser</Text>
      </TouchableOpacity>
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>📊 Statistiques :</Text>
        <Text>✅ Terminées : {stats.done}</Text>
        <Text>⏳ En cours : {stats.pending}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#e6f0ff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#2a2a72' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, width: '90%', marginBottom: 15, borderRadius: 8, backgroundColor: '#fff' },
  image: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  placeholderImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ccc', marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#2a2a72' },
  email: { fontSize: 16, color: '#555' },
  status: { fontSize: 16, color: '#333', marginBottom: 20 },
  button: { backgroundColor: '#2a2a72', padding: 10, borderRadius: 20, marginTop: 10, width: '80%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  stats: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginTop: 30, width: '90%' },
  statsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#2a2a72' },
});
