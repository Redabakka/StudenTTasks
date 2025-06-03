import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';

// 🔹 Ajouter un utilisateur avec ID auto
export const addUser = async (userData) => {
  return await addDoc(collection(db, USERS_COLLECTION), userData);
};

// 🔹 Récupérer un utilisateur par email (pour le login)
export const getUserByEmail = async (email) => {
  const q = query(collection(db, USERS_COLLECTION), where('email', '==', email));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) return snapshot.docs[0].data();
  return null;
};

// 🔹 Mettre à jour les infos d’un utilisateur
export const updateUserInfo = async (email, updates) => {
  const q = query(collection(db, USERS_COLLECTION), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, USERS_COLLECTION, userDoc.id), updates);
  } else {
    throw new Error('Utilisateur introuvable');
  }
};
