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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Cria um novo cupom de desconto
 */
export const createCoupon = async (couponData) => {
  try {
    const docRef = await addDoc(collection(db, 'coupons'), {
      ...couponData,
      usedTimes: 0,
      active: true,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...couponData };
  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    throw error;
  }
};

/**
 * Obtém um cupom pelo código
 */
export const getCouponByCode = async (code) => {
  try {
    const couponsRef = collection(db, 'coupons');
    const q = query(
      couponsRef,
      where('code', '==', code.toUpperCase()),
      where('active', '==', true)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const coupon = snapshot.docs[0];
    return { id: coupon.id, ...coupon.data() };
  } catch (error) {
    console.error('Erro ao buscar cupom:', error);
    throw error;
  }
};

/**
 * Valida um cupom
 */
export const validateCoupon = async (code) => {
  try {
    const coupon = await getCouponByCode(code);
    
    if (!coupon) {
      return { valid: false, message: 'Cupom não encontrado' };
    }
    
    if (!coupon.active) {
      return { valid: false, message: 'Cupom inativo' };
    }
    
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt.toDate?.() || coupon.expiresAt)) {
      return { valid: false, message: 'Cupom expirado' };
    }
    
    if (coupon.maxUses && coupon.usedTimes >= coupon.maxUses) {
      return { valid: false, message: 'Cupom já atingiu o limite de usos' };
    }
    
    return { valid: true, coupon };
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    throw error;
  }
};

/**
 * Usa um cupom (incrementa contador)
 */
export const useCoupon = async (couponId) => {
  try {
    const docRef = doc(db, 'coupons', couponId);
    const coupon = await getDoc(docRef);
    const currentUses = coupon.data().usedTimes || 0;
    
    await updateDoc(docRef, {
      usedTimes: currentUses + 1,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao usar cupom:', error);
    throw error;
  }
};

/**
 * Obtém todos os cupons (admin)
 */
export const getAllCoupons = async () => {
  try {
    const couponsRef = collection(db, 'coupons');
    const snapshot = await getDocs(couponsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao buscar cupons:', error);
    throw error;
  }
};

/**
 * Atualiza um cupom
 */
export const updateCoupon = async (couponId, couponData) => {
  try {
    const docRef = doc(db, 'coupons', couponId);
    await updateDoc(docRef, {
      ...couponData,
      updatedAt: serverTimestamp(),
    });
    return { id: couponId, ...couponData };
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error);
    throw error;
  }
};

/**
 * Deleta um cupom
 */
export const deleteCoupon = async (couponId) => {
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
  } catch (error) {
    console.error('Erro ao deletar cupom:', error);
    throw error;
  }
};
