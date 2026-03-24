import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  const categoryName = typeof product.category === "object" && product.category !== null
    ? (product.category.name || product.category.Nombre || "")
    : (product.category || "");

  return (
    <div className="product-card">
      <Link to={`/producto/${product._id}`}>
        <div className="product-card-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} loading="lazy" />
          ) : (
            <div className="product-card-no-image">Sin imagen</div>
          )}
        </div>
      </Link>

      <div className="product-card-info">
        {categoryName && (
          <span className="product-card-category">{categoryName}</span>
        )}
        <h3 className="product-card-name">{product.name}</h3>
        {product.brand && (
          <p className="product-card-brand">por {product.brand}</p>
        )}
        <p className="product-card-price">{formatter.format(product.price)}</p>

        <div className="product-card-actions">
          <button
            className="btn-add-cart"
            onClick={() => addToCart(product)}
          >
            Agregar al carrito
          </button>
          <Link to={`/producto/${product._id}`} className="btn-view-detail">
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  );
}