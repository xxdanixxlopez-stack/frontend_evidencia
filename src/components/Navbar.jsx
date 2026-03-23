import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png"; // Ajusta la ruta si es necesario

export default function Navbar() {
  const { user, login, logout } = useAuth();
  
  // Tu lógica de administrador (mantengo tus emails)
  const adminEmails = ["xxdanixxlopez@gmail.com", "bryanfabrizzio33@gmail.com"];
  const isAdmin = adminEmails.includes(user?.email);

  return (
  <nav className="nav">
    <div className="nav-inner">
      {/* LOGO Y MARCA CENTRADA CON EL NOMBRE CORREGIDO */}
      <Link to="/" className="brand-container" style={{ textDecoration: 'none' }}>
        {/* Tu logo HB con bordes redondeados */}
        <img src={logo} alt="The House of Beauty" style={{ width: '55px', borderRadius: '10px' }} />

        {/* TEXTO DE MARCA ARREGLADO */}
        <div style={{ marginTop: '5px' }}>
          {/* Nombre Oficial en fuente elegante */}
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', margin: '0', color: '#1a1a1a' }}>
            The House of Beauty
          </h1>
          {/* Subtítulo sutil en Dorado */}
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#D4AF37', fontWeight: 'bold' }}>
            Cosmética & Novedades
          </span>
        </div>
      </Link>

      {/* ENLACES SEPARADOS */}
      <div className="nav-links">
        <Link to="/">Catálogo</Link>

        {isAdmin && (
          <>
            <Link to="/admin/categorias">Admin Categorías</Link>
            <Link to="/admin/productos">Admin Productos</Link>
          </>
        )}

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
  </nav>
);
}