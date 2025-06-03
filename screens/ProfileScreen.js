import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { getUserByEmail, updateUserInfo } from '../database/userService_firebase';

export default function ProfileScreen({ navigation, route }) {
  const { email } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserByEmail(email);
      if (data) {
        setUser(data);
        setNewName(data.fullName);
        setNewStatus(data.status);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!newName.trim() || !newStatus.trim()) {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return;
    }

    try {
      await updateUserInfo(email, {
        fullName: newName,
        status: newStatus
      });
      setUser({ ...user, fullName: newName, status: newStatus });
      setIsEditing(false);
      Alert.alert("Succès", "Profil mis à jour.");
    } catch (error) {
      Alert.alert("Erreur", "Échec de la mise à jour.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a2a72" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Utilisateur introuvable.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nom :</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={newName} onChangeText={setNewName} />
        ) : (
          <Text style={styles.value}>{user.fullName}</Text>
        )}

        <Text style={styles.label}>Email :</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Statut :</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={newStatus} onChangeText={setNewStatus} />
        ) : (
          <Text style={styles.value}>{user.status}</Text>
        )}

        {isEditing ? (
          <TouchableOpacity style={styles.smallButton} onPress={handleSave}>
            <Text style={styles.smallButtonText}>💾 Enregistrer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.smallButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.smallButtonText}>✏️ Modifier le profil</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Welcome')}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6ff',
    paddingHorizontal: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f6ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  smallButton: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  smallButtonText: {
    fontSize: 14,
    color: '#2a2a72',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2a2a72',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  link: {
    color: '#2a2a72',
    fontSize: 16,
  },
});
