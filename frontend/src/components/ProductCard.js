import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const EMOJIS = {
    Electronics: '🖥️', Audio: '🎧', Wearables: '⌚',
    Laptops: '💻', Smartphones: '📱', Gaming: '🎮',
    Cameras: '📷', Accessories: '🎒'
  };
  const emoji = EMOJIS[product.category?.name] || '📦';

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-img">
          <span>{emoji}</span>
          {discount > 0 && <div className="discount-badge">{discount}% OFF</div>}
        </div>
      </Link>
      <div className="product-info">
        <div className="product-category">{product.category?.name}</div>
        <Link to={`/products/${product.id}`}>
          <div className="product-name">{product.name}</div>
        </Link>
        <div className="rating">{'⭐'.repeat(Math.round(product.rating || 0))} ({product.rating})</div>
        <div className="product-bottom">
          <div>
            <span className="price">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="original-price">₹{product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
          <button className="add-cart-btn" onClick={() => addToCart(product)}>+ Add</button>
        </div>
      </div>
    </div>
  );
}
