import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const RESTAURANT_DOC_ID = 'main';

export const restaurantService = {
  // Get restaurant info
  async getRestaurantInfo() {
    try {
      const docRef = doc(db, 'restaurantes', RESTAURANT_DOC_ID);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update restaurant info (admin)
  async updateRestaurantInfo(data) {
    try {
      const restaurantRef = doc(db, 'restaurantes', RESTAURANT_DOC_ID);
      await updateDoc(restaurantRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Subscribe to restaurant changes (real-time)
  subscribeToRestaurant(callback) {
    const docRef = doc(db, 'restaurantes', RESTAURANT_DOC_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    });
  },
};
