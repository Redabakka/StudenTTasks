import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { addTask } from '../database/taskService_firebase';

export default function ScanQRScreen({ navigation, route }) {
  const { user } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(true);
  const scannedRef = useRef(false); // ✅ Ref = stable, évite les re-render async

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scannedRef.current) return;
    scannedRef.current = true; // ✅ blocage immédiat

    setCameraActive(false);

    try {
      const parsed = JSON.parse(data);

      if (!parsed.title || !parsed.dateFin) {
        throw new Error("QR incomplet");
      }

      await addTask(parsed.title, parsed.description || '', parsed.dateFin, user.email);

      Alert.alert(
        "✅ Tâche ajoutée",
        `📌 ${parsed.title}`,
        [
          {
            text: "Voir mes tâches",
            onPress: () => navigation.navigate("TaskList", { user }),
          },
          {
            text: "Scanner à nouveau",
            onPress: () => {
              scannedRef.current = false;
              setCameraActive(true);
            }
          }
        ]
      );
    } catch (err) {
      console.error("Erreur QR :", err.message);
      Alert.alert("Erreur", "QR Code invalide.");
      scannedRef.current = false;
      setCameraActive(true);
    }
  };

  if (!permission) return <Text>Chargement permissions...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>📵 Caméra non autorisée</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.retryButton}>
          <Text style={styles.retryText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraActive ? (
        <>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
          <Text style={styles.instruction}>📷 Scannez un QR Code</Text>
        </>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.successText}>✅ Scan terminé</Text>
          <TouchableOpacity
            onPress={() => {
              scannedRef.current = false;
              setCameraActive(true);
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>🔄 Scanner un autre</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafe', justifyContent: 'center', alignItems: 'center' },
  instruction: {
    position: 'absolute',
    bottom: 60,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 8,
  },
  successText: {
    fontSize: 18,
    color: '#2a2a72',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2a2a72',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  centered: {
    alignItems: 'center',
  },
});
