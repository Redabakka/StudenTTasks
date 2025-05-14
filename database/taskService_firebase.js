import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

const TASKS_COLLECTION = 'tasks';

// 🔹 Lire une tâche par ID
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

// 🔹 Ajouter une tâche liée à un utilisateur
export const addTask = async (title, description, dateFin, emailUtilisateur) => {
  try {
    const dateCreation = new Date().toISOString();
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      title,
      description,
      dateCreation,
      dateFin,
      isDone: false,
      emailUtilisateur, // 🔗 Lien avec l'utilisateur
    });
    console.log("✅ Tâche ajoutée avec ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Erreur ajout tâche:", error);
  }
};

// 🔹 Lire toutes les tâches de l'utilisateur
export const getTasksByUser = async (emailUtilisateur) => {
  try {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('emailUtilisateur', '==', emailUtilisateur)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Erreur lecture tâches utilisateur:", error);
    return [];
  }
};

// 🔹 Supprimer une tâche
export const deleteTask = async (id) => {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, id));
    console.log("🗑️ Tâche supprimée:", id);
  } catch (error) {
    console.error("❌ Erreur suppression:", error);
  }
};

// 🔹 Marquer une tâche comme faite / non faite
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

// 🔹 Mettre à jour une tâche (titre, description, etc.)
export const updateTask = async (id, updatedFields) => {
  try {
    await updateDoc(doc(db, TASKS_COLLECTION, id), updatedFields);
    console.log("📝 Tâche mise à jour :", id);
  } catch (error) {
    console.error("❌ Erreur update :", error);
  }
};
