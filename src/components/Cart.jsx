import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return alert("Tu carrito está vacío");

    const phoneNumber = "529621218419"; 
    let message = "¡Hola! Me gustaría hacer un pedido en *The House of Beauty*:\n\n";
    
    cart.forEach((item) => {
      const cleanName = item.name.trim(); 
      const subtotal = Number(item.price * item.quantity).toFixed(2);
      message += `- ${cleanName} (Cant: ${item.quantity}) - $${subtotal}\n`;
    });
    
    const finalTotal = Number(totalPrice).toFixed(2);
    message += `\n*Total a pagar: $${finalTotal}*`;
    message += `\n\n¡Quedo a la espera de la confirmación!`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, "_blank");
    clearCart();
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, width: '350px', height: '100vh', 
      backgroundColor: '#fff', boxShadow: '-5px 0 15px rgba(0,0,0,0.2)', 
      padding: '20px', zIndex: 1000, overflowY: 'auto', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', margin: 0, color: '#1a1a1a' }}>Tu Carrito 🛒</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}>❌</button>
      </div>
      
      {cart.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>No hay productos en tu carrito aún.</p>
      ) : (
        <div style={{ flex: 1 }}>
          {cart.map((item) => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f5f5f5', paddingBottom: '15px', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{item.name}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Cant: {item.quantity} x ${item.price}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: 'bold', color: '#1a1a1a', marginBottom: '5px' }}>${Number(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div style={{ borderTop: '2px solid #eee', paddingTop: '20px', marginTop: 'auto' }}>
          <h3 style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 20px 0', color: '#1a1a1a' }}>
            <span>Total:</span>
            <span>${Number(totalPrice).toFixed(2)}</span>
          </h3>
          
          <button 
            onClick={handleSendWhatsApp} 
            style={{ 
              width: '100%', padding: '15px', backgroundColor: '#25D366', 
              color: 'white', border: 'none', borderRadius: '8px', 
              cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
            }}
          >
            Pedir por WhatsApp 📲
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;