import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const RESTAURANT_DOC_ID = 'main';

// Obter informações do restaurante
export const getRestaurantInfo = async () => {
  try {
    const docRef = doc(db, 'restaurantes', RESTAURANT_DOC_ID);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Criar/atualizar informações do restaurante
export const setRestaurantInfo = async (restaurantData) => {
  try {
    const docRef = doc(db, 'restaurantes', RESTAURANT_DOC_ID);
    await setDoc(docRef, restaurantData, { merge: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Atualizar informações do restaurante
export const updateRestaurantInfo = async (restaurantData) => {
  try {
    const docRef = doc(db, 'restaurantes', RESTAURANT_DOC_ID);
    await updateDoc(docRef, {
      ...restaurantData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
