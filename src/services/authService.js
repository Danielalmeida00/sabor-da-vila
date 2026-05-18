import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Registra um novo usuário (admin)
 */
export const registerAdmin = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    // Salva informações do admin no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      displayName: displayName,
      role: 'admin',
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error('Erro ao registrar admin:', error);
    throw error;
  }
};

/**
 * Faz login de um usuário (admin)
 */
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

/**
 * Faz logout do usuário atual
 */
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

/**
 * Monitora o estado de autenticação do usuário
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Busca dados do usuário no Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      callback({ ...user, ...userDoc.data() });
    } else {
      callback(null);
    }
  });
};

/**
 * Obtém o usuário atual
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
