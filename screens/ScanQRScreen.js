import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { addTask } from '../database/taskService_firebase';

export default function ScanQRScreen({ navigation, route }) {
  const { user } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(true); // 👈 État pour activer/désactiver la caméra

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    // 🔐 Désactive immédiatement la caméra
    setCameraActive(false);

    try {
      const parsed = JSON.parse(data);

      if (!parsed.title || !parsed.description || !parsed.dateFin) {
        throw new Error("QR incomplet");
      }

      await addTask(parsed.title, parsed.description, parsed.dateFin, user.email);
      console.log("✅ Tâche ajoutée avec succès");

      Alert.alert(
        "QR Code détecté",
        `📌 Tâche ajoutée : ${parsed.title}`,
        [
          {
            text: "Voir mes tâches",
            onPress: () => navigation.navigate("TaskList", { user })
          }
        ]
      );
    } catch (err) {
      console.error("Erreur QR :", err.message);
      Alert.alert("Erreur", "QR invalide.");
    }
  };

  if (!permission) return <Text>Chargement permissions...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Caméra non autorisée</Text>
        <Button title="Demander permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraActive ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
        />
      ) : (
        <Text style={styles.text}>✅ Scan terminé. Redirection...</Text>
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
