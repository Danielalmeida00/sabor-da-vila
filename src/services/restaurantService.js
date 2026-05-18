import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Obtém informações do restaurante
 */
export const getRestaurantInfo = async () => {
  try {
    const restaurantsRef = collection(db, 'restaurantes');
    const q = query(restaurantsRef, limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.warn('Nenhum restaurante cadastrado');
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Erro ao buscar informações do restaurante:', error);
    throw error;
  }
};

/**
 * Atualiza informações do restaurante
 */
export const updateRestaurantInfo = async (restaurantId, infoData) => {
  try {
    const docRef = doc(db, 'restaurantes', restaurantId);
    await updateDoc(docRef, {
      ...infoData,
      updatedAt: serverTimestamp(),
    });
    return { id: restaurantId, ...infoData };
  } catch (error) {
    console.error('Erro ao atualizar informações do restaurante:', error);
    throw error;
  }
};

/**
 * Obtém horários do restaurante
 */
export const getHours = async () => {
  try {
    const restaurantInfo = await getRestaurantInfo();
    return restaurantInfo?.hours || {};
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
};

/**
 * Obtém telefone do restaurante
 */
export const getPhoneNumbers = async () => {
  try {
    const restaurantInfo = await getRestaurantInfo();
    return {
      phone: restaurantInfo?.phone,
      whatsapp: restaurantInfo?.whatsapp,
    };
  } catch (error) {
    console.error('Erro ao buscar telefones:', error);
    throw error;
  }
};
