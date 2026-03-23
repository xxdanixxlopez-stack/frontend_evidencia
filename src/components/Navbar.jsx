import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Cart from "./Cart"; 
import logo from "../assets/logo.png"; 

export default function Navbar() {
  const { user, login, logout } = useAuth();

  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const adminEmails = ["xxdanixxlopez@gmail.com", "bryanfabrizzio33@gmail.com", "thehausebeauty@gmail.com"];
  const isAdmin = adminEmails.includes(user?.email);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand-container" style={{ textDecoration: 'none' }}>
          <img src={logo} alt="The House of Beauty" style={{ width: '55px', borderRadius: '10px' }} />

          <div style={{ marginTop: '5px' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', margin: '0', color: '#1a1a1a' }}>
              The House of Beauty
            </h1>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#D4AF37', fontWeight: 'bold' }}>
              Cosmética & Novedades
            </span>
          </div>
        </Link>

        <div className="nav-links">
          <Link to="/">Catálogo</Link>

          {isAdmin && (
            <>
              <Link to="/admin/categorias">Admin Categorías</Link>
              <Link to="/admin/productos">Admin Productos</Link>
            </>
          )}

          <button
            className="btn-detail"
            onClick={() => setIsCartOpen(true)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#D4AF37', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
          >
            🛒 Carrito ({totalItems})
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>{user.email}</span>
              <button className="btn-detail" onClick={logout} style={{ cursor: 'pointer' }}>Salir</button>
            </div>
          ) : (
            <button className="btn-detail" onClick={login} style={{ cursor: 'pointer' }}>Entrar con Google</button>
          )}
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}