import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar carrito al iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart_beauty');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Error leyendo carrito:", e);
      setCart([]);
    }
  }, []);

  // Guardar carrito cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem('cart_beauty', JSON.stringify(cart));
    } catch (e) {
      console.error("Error guardando carrito:", e);
    }
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

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);