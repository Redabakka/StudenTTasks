import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { addTask } from '../database/taskService_firebase';

export default function ScanQRScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission(); // Demande la permission dès que le composant se monte
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed = JSON.parse(data);

      if (!parsed.title || !parsed.description || !parsed.dateFin) {
        throw new Error('Champs manquants dans le QR');
      }

      await addTask(parsed.title, parsed.description, parsed.dateFin);

      Alert.alert(
        "QR Code détecté",
        `📌 Tâche ajoutée : ${parsed.title}`,
        [
          {
            text: "Voir mes tâches",
            onPress: () => {
              setScanned(false);
              navigation.navigate('TaskList');
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Erreur", "Impossible de lire ce QR Code.");
      setScanned(false);
    }
  };

  if (!permission) return <Text>Chargement des permissions...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Permission caméra non accordée.</Text>
        <Button title="Autoriser la caméra" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Text style={styles.text}>
          ✅ QR scanné — Recharge pour scanner à nouveau
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: {
    position: 'absolute',
    bottom: 40,
    textAlign: 'center',
    width: '100%',
    fontSize: 18,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
});
