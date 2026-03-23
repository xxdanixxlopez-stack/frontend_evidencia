import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext"; // 👈 NUEVO: Importamos el cerebro del carrito

export default function ProductCard({ product }) {
  const [imgOk, setImgOk] = useState(true);
  
  // 👈 NUEVO: Traemos la función para agregar al carrito
  const { addToCart } = useCart(); 

  // Formateador de precio para que se vea: $ 1,500.00
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  return (
    <article className="product-card">
      {/* Contenedor de la Imagen con Efectos */}
      <div className="product-card-image">
        {product.imageUrl && imgOk ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            onError={() => setImgOk(false)} 
            loading="lazy"
          />
        ) : (
          <div className="placeholder-img">
            <i className="fas fa-image"></i>
            <span>Imagen no disponible</span>
          </div>
        )}
        
        {/* Etiqueta Flotante de Disponibilidad */}
        {!product.available && (
          <div className="status-badge out-of-stock">Agotado</div>
        )}
        {product.price < 500 && product.available && (
          <div className="status-badge promo">Oferta</div>
        )}
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="product-card-body">
        <header className="card-header">
          <span className="category-tag">{product.category?.name || "General"}</span>
          <h3 className="product-title" title={product.name}>{product.name}</h3>
          <p className="brand-label">{product.brand || "The House of Beauty"}</p>
        </header>

        <p className="product-excerpt">
          {product.description || "Sin descripción disponible para este artículo."}
        </p>
        
        <footer className="product-card-footer">
          <div className="price-container">
            <span className="price-label">Precio</span>
            <span className="product-price">{formatter.format(product.price)}</span>
          </div>
          
          <div className="action-buttons" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link className="btn-view" to={`/producto/${product._id}`}>
              Detalles
            </Link>
            
            {/* 👈 NUEVO: Botón de Agregar al Carrito */}
            <button 
              onClick={() => addToCart(product)}
              className="btn-whatsapp" // Mantenemos tu clase para que conserve el diseño
              title="Añadir al carrito"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', display: 'flex' }}
            >
              {/* SVG de un Carrito de Compras (mismo tamaño que el tuyo) */}
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}