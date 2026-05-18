import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...orderData };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get all orders (admin)
  async getAllOrders() {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get orders by phone number (customer)
  async getOrdersByPhone(phone) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('customerPhone', '==', phone),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get single order
  async getOrder(orderId) {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update order status (admin)
  async updateOrderStatus(orderId, status) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Subscribe to orders (real-time)
  subscribeToOrders(callback) {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(orders);
    });
  },
};
