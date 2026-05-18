import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

// Obter todas as categorias
export const getCategories = async () => {
  try {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obter todos os pratos
export const getMenuItems = async () => {
  try {
    const q = query(collection(db, 'menu_items'), where('isAvailable', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obter pratos por categoria
export const getMenuItemsByCategory = async (categoryId) => {
  try {
    const q = query(
      collection(db, 'menu_items'),
      where('category', '==', categoryId),
      where('isAvailable', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obter um prato específico
export const getMenuItem = async (itemId) => {
  try {
    const docRef = doc(db, 'menu_items', itemId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Adicionar novo prato
export const addMenuItem = async (itemData) => {
  try {
    const docRef = await addDoc(collection(db, 'menu_items'), {
      ...itemData,
      createdAt: new Date().toISOString(),
      rating: 0,
      reviews: 0,
      isAvailable: true,
    });
    return { id: docRef.id, ...itemData };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Atualizar prato
export const updateMenuItem = async (itemId, itemData) => {
  try {
    const docRef = doc(db, 'menu_items', itemId);
    await updateDoc(docRef, {
      ...itemData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Deletar prato
export const deleteMenuItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'menu_items', itemId));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Adicionar categoria
export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Atualizar categoria
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await updateDoc(docRef, categoryData);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Deletar categoria
export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error) {
    throw new Error(error.message);
  }
};
