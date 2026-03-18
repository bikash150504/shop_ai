import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getAlsoBought } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [alsoBought, setAlsoBought] = useState([]);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data)).catch(() => {});
    getAlsoBought(id).then(res => setAlsoBought(res.data.alsoBought || [])).catch(() => {});
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return <div className="loading-product">Loading...</div>;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="detail-page container">
      <div className="detail-layout">
        <div className="detail-img">📦</div>
        <div className="detail-info">
          <div className="detail-cat">{product.category?.name}</div>
          <h1>{product.name}</h1>
          <div className="detail-rating">{'⭐'.repeat(Math.round(product.rating || 0))} {product.rating} rating</div>
          <p className="detail-desc">{product.description || 'Premium quality product with great features and value for money.'}</p>
          <div className="detail-price-row">
            <span className="detail-price">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="detail-original">₹{product.originalPrice?.toLocaleString()}</span>
                <span className="detail-discount">{discount}% OFF</span>
              </>
            )}
          </div>
          <button className="detail-add-btn" onClick={handleAdd}>
            {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>

      {alsoBought.length > 0 && (
        <div className="also-section">
          <h2>🔗 People Also Bought</h2>
          <div className="also-grid">
            {alsoBought.map(p => (
              <div key={p.id} className="also-mini">
                <div>📦</div>
                <div className="also-mini-name">{p.name}</div>
                <div className="also-mini-price">₹{p.price?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
