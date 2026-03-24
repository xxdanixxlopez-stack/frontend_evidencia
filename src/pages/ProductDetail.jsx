import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error al cargar el producto:", err);
        setError("No pudimos encontrar el producto que buscas.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  if (loading) return (
    <div className="container" style={{textAlign: 'center', padding: '100px'}}>
      <p style={{fontFamily: 'Playfair Display', fontSize: '1.2rem', color: '#666'}}>Cargando detalles de lujo...</p>
    </div>
  );
  
  if (error) return (
    <div className="container" style={{textAlign: 'center', padding: '100px'}}>
      <div className="toast">{error}</div>
      <Link to="/" className="btn-back" style={{marginTop: '20px', display: 'inline-block'}}>Volver al Catálogo</Link>
    </div>
  );
  
  if (!product) return null;

  const whatsappMessage = encodeURIComponent(
    `¡Hola! Me interesa este producto de *The House of Beauty*:\n\n*Producto:* ${product.name}\n*Precio:* ${formatter.format(product.price)}\n\n¿Tienen disponibilidad?`
  );

  return (
    <main className="main-wrapper">
      <div className="container">
        <div className="product-detail-wrapper">
          <div className="product-detail-container">
            
            <div className="product-detail-image">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} loading="lazy" />
              ) : (
                <div style={{color: '#bbb', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                  Sin imagen disponible
                </div>
              )}
            </div>

            <div className="product-detail-info">
              <header>
                <span className="detail-category">{product.category?.name || "General"}</span>
                <h1 className="detail-name">{product.name}</h1>
                <p className="detail-brand">por {product.brand || "The House of Beauty"}</p>
              </header>

              <p className="detail-description">
                {product.description || "Este producto de alta gama no tiene descripción detallada disponible en este momento."}
              </p>
              
              <footer className="detail-footer">
                <span className="detail-price">{formatter.format(product.price)}</span>
                
                <div className="detail-actions">
                  <Link className="btn-back" to="/">
                    Volver
                  </Link>
                  
                  <a 
                    href={`https://wa.me/529621218419?text=${whatsappMessage}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-whatsapp-detail"
                  >
                    Pedir por WhatsApp
                  </a>
                </div>
              </footer>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}