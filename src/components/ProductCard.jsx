import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [imgOk, setImgOk] = useState(true);

  // Formateador de precio para que se vea: $ 1,500.00
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  // Texto para el mensaje de WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Hola! Me interesa este producto de The House of Beauty:\n\n*Producto:* ${product.name}\n*Precio:* ${formatter.format(product.price)}\n\n¿Tienen disponibilidad?`
  );

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
          
          <div className="action-buttons">
            <Link className="btn-view" to={`/producto/${product._id}`}>
              Detalles
            </Link>
            
            <a 
              href={`https://wa.me/521XXXXXXXXXX?text=${whatsappMessage}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp"
              title="Pedir por WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.766-5.764-5.766zm3.376 8.21c-.19.533-.961.914-1.326.966-.365.053-.67.107-1.127-.107-.457-.214-1.953-.721-2.975-1.631-1.022-.91-1.678-2.022-1.868-2.555-.19-.533-.02-.821.147-1.011.167-.19.333-.334.5-.5.167-.167.222-.278.333-.445.111-.167.056-.334-.028-.5-.084-.167-.75-1.808-.944-2.279-.194-.471-.389-.417-.5-.417h-.417c-.167 0-.444.056-.666.278-.222.222-.889.889-.889 2.168 0 1.279.944 2.5 1.083 2.668.139.167 1.805 2.724 4.388 3.834.615.263 1.094.421 1.468.539.617.196 1.178.168 1.621.102.494-.074 1.528-.625 1.741-1.229.213-.604.213-1.127.149-1.229-.064-.102-.234-.167-.5-.302z"/>
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </article>
  );
}