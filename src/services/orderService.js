import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

// Criar novo pedido
export const createOrder = async (orderData) => {
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
};

// Obter todos os pedidos (admin)
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obter pedidos por telefone do cliente
export const getOrdersByPhone = async (customerPhone) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('customerPhone', '==', customerPhone),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Atualizar status do pedido
export const updateOrderStatus = async (orderId, status) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obter estatísticas de vendas
export const getSalesStats = async () => {
  try {
    const orders = await getAllOrders();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const completedOrders = orders.filter((o) => o.status === 'completed').length;

    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
