// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATIfTMSStZsIlPAZ1MROl5kr3EodWRZuo",
  authDomain: "projetmobile-62895.firebaseapp.com",
  projectId: "projetmobile-62895",
  storageBucket: "projetmobile-62895.appspot.com",
  messagingSenderId: "390835263751",
  appId: "1:390835263751:web:3aebbc60f555fab259cda2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

export default db; 
