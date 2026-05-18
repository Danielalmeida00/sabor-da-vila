import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// Criar cupom
export const createCoupon = async (couponData) => {
  try {
    const docRef = await addDoc(collection(db, 'coupons'), {
      ...couponData,
      usedTimes: 0,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...couponData };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Validar e obter cupom
export const validateCoupon = async (couponCode) => {
  try {
    const q = query(
      collection(db, 'coupons'),
      where('code', '==', couponCode),
      where('active', '==', true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Cupom não encontrado ou inativo');
    }

    const coupon = snapshot.docs[0].data();
    const now = new Date();
    const expiresAt = coupon.expiresAt?.toDate() || new Date();

    if (now > expiresAt) {
      throw new Error('Cupom expirado');
    }

    if (coupon.usedTimes >= coupon.maxUses) {
      throw new Error('Cupom atingiu o limite de uso');
    }

    return { id: snapshot.docs[0].id, ...coupon };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Usar cupom (incrementar contador)
export const useCoupon = async (couponId) => {
  try {
    const docRef = doc(db, 'coupons', couponId);
    const couponSnap = await getDoc(docRef);
    const coupon = couponSnap.data();

    await updateDoc(docRef, {
      usedTimes: (coupon.usedTimes || 0) + 1,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Deletar cupom
export const deleteCoupon = async (couponId) => {
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obter todos os cupons (admin)
export const getAllCoupons = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'coupons'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

import { getDoc } from 'firebase/firestore';
