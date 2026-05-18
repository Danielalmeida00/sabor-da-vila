import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Erro ao carregar carrinho:', err);
      }
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (dish) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === dish.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1 }];
    });
  };

  const removeItem = (dishId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== dishId));
  };

  const updateQuantity = (dishId, quantity) => {
    if (quantity <= 0) {
      removeItem(dishId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const applyCoupon = (code, discountPercent) => {
    setCoupon(code);
    setDiscountPercentage(discountPercent);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountPercentage(0);
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setDiscountPercentage(0);
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercentage) / 100;
  const total = subtotal - discountAmount;

  const value = {
    items,
    coupon,
    discountPercentage,
    subtotal,
    discountAmount,
    total,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
