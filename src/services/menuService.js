import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export const menuService = {
  // Get all menu items
  async getAllItems() {
    try {
      const q = query(collection(db, 'menu_items'), where('isAvailable', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get items by category
  async getItemsByCategory(categoryId) {
    try {
      const q = query(
        collection(db, 'menu_items'),
        where('category', '==', categoryId),
        where('isAvailable', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get single item
  async getItem(itemId) {
    try {
      const docRef = doc(db, 'menu_items', itemId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get all categories
  async getCategories() {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Subscribe to real-time menu updates
  subscribeToMenuItems(callback) {
    const q = query(collection(db, 'menu_items'), where('isAvailable', '==', true));
    return onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(items);
    });
  },

  // Add new menu item (admin)
  async addItem(itemData) {
    try {
      const docRef = await addDoc(collection(db, 'menu_items'), {
        ...itemData,
        createdAt: new Date().toISOString(),
        rating: 0,
        reviews: 0,
      });
      return docRef.id;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update menu item (admin)
  async updateItem(itemId, itemData) {
    try {
      const itemRef = doc(db, 'menu_items', itemId);
      await updateDoc(itemRef, {
        ...itemData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Delete menu item (admin)
  async deleteItem(itemId) {
    try {
      await deleteDoc(doc(db, 'menu_items', itemId));
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
