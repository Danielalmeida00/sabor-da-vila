import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Cria um novo pedido
 */
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
};

/**
 * Obtém um pedido específico
 */
export const getOrder = async (orderId) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const snapshot = await getDoc(docRef);
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    throw error;
  }
};

/**
 * Obtém todos os pedidos (admin)
 */
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }
};

/**
 * Obtém pedidos de um cliente específico
 */
export const getOrdersByCustomer = async (customerPhone) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('customerPhone', '==', customerPhone),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao buscar pedidos do cliente:', error);
    throw error;
  }
};

/**
 * Atualiza o status de um pedido
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    throw error;
  }
};

/**
 * Atualiza um pedido completo
 */
export const updateOrder = async (orderId, orderData) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      ...orderData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    throw error;
  }
};

/**
 * Obtém últimos N pedidos
 */
export const getRecentOrders = async (count = 10) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao buscar pedidos recentes:', error);
    throw error;
  }
};
