import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Recuperamos el carrito guardado para que no se borre al refrescar
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart_beauty');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardamos el carrito en la memoria cada vez que cambia
  useEffect(() => {
    localStorage.setItem('cart_beauty', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const isItemInCart = prev.find((item) => item._id === product._id);
      if (isItemInCart) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  // Calcula el total automáticamente
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);