import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Registrar novo usuário (admin)
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Atualizar perfil
    await updateProfile(user, { displayName });

    // Salvar dados do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fazer login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Monitorar estado de autenticação
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Obter dados do usuário logado
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Obter informações completas do usuário no Firestore
export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    throw new Error(error.message);
  }
};
