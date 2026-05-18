import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Obtém todas as categorias de menu
 */
export const getCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

/**
 * Obtém uma categoria específica
 */
export const getCategory = async (categoryId) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    const snapshot = await getDoc(docRef);
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    throw error;
  }
};

/**
 * Cria uma nova categoria
 */
export const createCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
};

/**
 * Atualiza uma categoria
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: serverTimestamp(),
    });
    return { id: categoryId, ...categoryData };
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
};

/**
 * Deleta uma categoria
 */
export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    throw error;
  }
};

/**
 * Obtém todos os pratos
 */
export const getMenuItems = async () => {
  try {
    const itemsRef = collection(db, 'menu_items');
    const snapshot = await getDocs(itemsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao buscar pratos:', error);
    throw error;
  }
};

/**
 * Obtém pratos de uma categoria específica
 */
export const getMenuItemsByCategory = async (categoryId) => {
  try {
    const itemsRef = collection(db, 'menu_items');
    const q = query(itemsRef, where('categoryId', '==', categoryId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao buscar pratos por categoria:', error);
    throw error;
  }
};

/**
 * Obtém um prato específico
 */
export const getMenuItem = async (itemId) => {
  try {
    const docRef = doc(db, 'menu_items', itemId);
    const snapshot = await getDoc(docRef);
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error('Erro ao buscar prato:', error);
    throw error;
  }
};

/**
 * Cria um novo prato
 */
export const createMenuItem = async (itemData) => {
  try {
    const docRef = await addDoc(collection(db, 'menu_items'), {
      ...itemData,
      isAvailable: true,
      rating: 0,
      reviews: 0,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...itemData };
  } catch (error) {
    console.error('Erro ao criar prato:', error);
    throw error;
  }
};

/**
 * Atualiza um prato
 */
export const updateMenuItem = async (itemId, itemData) => {
  try {
    const docRef = doc(db, 'menu_items', itemId);
    await updateDoc(docRef, {
      ...itemData,
      updatedAt: serverTimestamp(),
    });
    return { id: itemId, ...itemData };
  } catch (error) {
    console.error('Erro ao atualizar prato:', error);
    throw error;
  }
};

/**
 * Deleta um prato
 */
export const deleteMenuItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'menu_items', itemId));
  } catch (error) {
    console.error('Erro ao deletar prato:', error);
    throw error;
  }
};
