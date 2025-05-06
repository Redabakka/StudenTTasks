// taskService_firebase.js
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import db from '../database/firebase';
import { getDoc } from 'firebase/firestore'; 

const TASKS_COLLECTION = 'tasks';

// Lire une tâche par ID
export const getTaskById = async (id) => {
  try {
    const docRef = doc(db, TASKS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn("❗ Aucune tâche trouvée avec l'id :", id);
      return null;
    }
  } catch (error) {
    console.error("❌ Erreur getTaskById :", error);
    return null;
  }
};


// Ajouter une tâche
export const addTask = async (title, description, dateFin) => {
  try {
    const dateCreation = new Date().toISOString(); // ajuste la date de la creation en in real time
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      title,
      description,
      dateCreation,
      dateFin,
      isDone: false,
    });
    console.log("✅ Tâche ajoutée avec ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Erreur ajout tâche:", error);
  }
};

// Lire toutes les tâches
export const getAllTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, TASKS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Erreur lecture tâches:", error);
    return [];
  }
};

// Supprimer une tâche
export const deleteTask = async (id) => {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, id));
    console.log("🗑️ Tâche supprimée:", id);
  } catch (error) {
    console.error("❌ Erreur suppression:", error);
  }
};

// Marquer une tâche comme faite / non faite
export const toggleTaskStatus = async (id, isDone) => {
  try {
    await updateDoc(doc(db, TASKS_COLLECTION, id), {
      isDone: !isDone,
    });
    console.log("✔️ Statut mis à jour pour:", id);
  } catch (error) {
    console.error("❌ Erreur mise à jour statut:", error);
  }
};

// Mettre à jour une tâche
export const updateTask = async (id, updatedFields) => {
  try {
    await updateDoc(doc(db, 'tasks', id), updatedFields);
    console.log("📝 Tâche mise à jour :", id);
  } catch (error) {
    console.error("❌ Erreur update :", error);
  }
};

