import * as Notifications from 'expo-notifications';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../database/firebase';

export const checkTasksAndNotify = async (userEmail) => {
  try {
    const q = query(collection(db, 'tasks'), where('emailUtilisateur', '==', userEmail));
    const snapshot = await getDocs(q);

    const now = new Date();

    snapshot.forEach(doc => {
      const task = doc.data();
      if (task.isDone) return;

      const dateFin = new Date(task.dateFin);
      const diffMs = dateFin - now;
      const diffHrs = diffMs / (1000 * 60 * 60);

      if (diffHrs <= 24 && diffHrs > 0) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: `⏳ Bientôt fini`,
            body: `La tâche "${task.title}" se termine bientôt.`,
          },
          trigger: null,
        });
      }

      if (diffHrs <= 0) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: `❗ Délai dépassé`,
            body: `La tâche "${task.title}" a dépassé la date limite.`,
          },
          trigger: null,
        });
      }
    });

  } catch (error) {
    console.error('Erreur de notification :', error);
  }
};
