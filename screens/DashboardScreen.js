import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTasksByUser } from '../database/taskService_firebase';
import * as Progress from 'react-native-progress';

const quotes = [
  "Chaque jour compte 💡",
  "Commencez par le plus dur 🚀",
  "Les petits progrès font les grandes réussites",
  "Reste concentré, reste motivé 🧠",
];

export default function DashboardScreen({ route }) {
  const { user } = route.params;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tasks = await getTasksByUser(user.email);
        const total = tasks.length;
        const completed = tasks.filter(t => t.isDone).length;
        const inProgress = total - completed;
        const late = tasks.filter(t => !t.isDone && new Date(t.dateFin) < new Date()).length;
        setStats({ total, inProgress, completed, late });
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      } catch (err) {
        setStats({ total: 0, inProgress: 0, completed: 0, late: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.email]);

  if (loading || !stats) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a2a72" />
      </SafeAreaView>
    );
  }

  const progress = stats.total > 0 ? stats.completed / stats.total : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📊 Tableau de bord</Text>

      <LottieView
        source={require('../assets/Animation3.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={styles.quote}>"{quote}"</Text>

      <Progress.Bar
        progress={progress}
        width={Dimensions.get('window').width * 0.8}
        height={16}
        color="#2a2a72"
        borderRadius={10}
        style={{ alignSelf: 'center', marginVertical: 20 }}
      />

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Totales</Text>
          <Text style={styles.cardValue}>{stats.total}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>En cours</Text>
          <Text style={styles.cardValue}>{stats.inProgress}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Terminées</Text>
          <Text style={styles.cardValue}>{stats.completed}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>En retard</Text>
          <Text style={styles.cardValue}>{stats.late}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2a2a72',
    textAlign: 'center',
    marginBottom: 10,
  },
  lottie: {
    width: Dimensions.get('window').width * 0.7,
    height: 160,
    alignSelf: 'center',
    marginBottom: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#555',
    marginVertical: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#2a2a72',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
  },
});
