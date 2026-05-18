import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const couponService = {
  // Validate coupon
  async validateCoupon(code) {
    try {
      const q = query(
        collection(db, 'coupons'),
        where('code', '==', code.toUpperCase()),
        where('active', '==', true)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Cupom não encontrado');
      }

      const coupon = querySnapshot.docs[0].data();

      // Check if coupon is expired
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        throw new Error('Cupom expirado');
      }

      // Check if coupon has reached max uses
      if (coupon.maxUses && coupon.usedTimes >= coupon.maxUses) {
        throw new Error('Cupom já foi utilizado o número máximo de vezes');
      }

      return { id: querySnapshot.docs[0].id, ...coupon };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Use coupon
  async useCoupon(couponId) {
    try {
      const couponRef = doc(db, 'coupons', couponId);
      const couponSnap = await getDoc(couponRef);
      const currentUses = couponSnap.data().usedTimes || 0;

      await updateDoc(couponRef, {
        usedTimes: currentUses + 1,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Add coupon (admin)
  async addCoupon(couponData) {
    try {
      const docRef = await addDoc(collection(db, 'coupons'), {
        ...couponData,
        code: couponData.code.toUpperCase(),
        usedTimes: 0,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
