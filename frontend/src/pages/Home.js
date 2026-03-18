import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopProducts, getRecommendations, getAlsoBought } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [alsoBought, setAlsoBought] = useState([]);
  const [query, setQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load top products or personalized recommendations
    const loadProducts = async () => {
      try {
        if (user) {
          const res = await getRecommendations(user.id);
          if (res.data.recommendations?.length > 0) {
            setProducts(res.data.recommendations);
          } else {
            const top = await getTopProducts();
            setProducts(top.data);
          }
        } else {
          const res = await getTopProducts();
          setProducts(res.data);
        }
      } catch {
        // Fallback demo products if backend not running
        setProducts(DEMO_PRODUCTS);
      }
    };

    const loadAlsoBought = async () => {
      try {
        const res = await getAlsoBought(3);
        setAlsoBought(res.data.alsoBought || []);
      } catch {
        setAlsoBought(DEMO_ALSO_BOUGHT);
      }
    };

    loadProducts();
    loadAlsoBought();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${query}`);
  };

  return (
    <div className="home">
      {/* HERO */}
      <div className="hero">
        <div className="hero-text">
          <div className="hero-badge">✦ AI-Powered Shopping</div>
          <h1>Shop Smarter<br />with <span>AI</span></h1>
          <p>Personalized recommendations, smart search, and AI chatbot — all in one place.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search: wireless headphones, laptop under ₹50000..."
            />
            <button type="submit">Search</button>
          </form>
          <div className="quick-tags">
            {['Gaming laptop', 'Wireless earbuds', 'Smartwatch', 'Camera'].map(t => (
              <span key={t} onClick={() => { setQuery(t); navigate(`/products?search=${t}`); }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI FEATURES */}
      <div className="features container">
        {[
          { icon: '🧠', title: 'AI Recommendations', desc: 'Personalized picks based on your behaviour' },
          { icon: '💬', title: 'AI Chatbot', desc: '24/7 customer support powered by AI' },
          { icon: '🔍', title: 'Smart Search', desc: 'Search in natural language' },
          { icon: '🔗', title: 'People Also Bought', desc: 'Collaborative filtering suggestions' },
        ].map(f => (
          <div className="feature-card" key={f.title}>
            <span>{f.icon}</span>
            <div>
              <b>{f.title}</b>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="container section">
        <div className="section-head">
          <h2>{user ? '🧠 Recommended For You' : '⭐ Top Products'}</h2>
          <button onClick={() => navigate('/products')}>View All →</button>
        </div>
        <div className="products-grid">
          {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* PEOPLE ALSO BOUGHT */}
      {alsoBought.length > 0 && (
        <div className="container section">
          <h2>🔗 People Also Bought</h2>
          <div className="also-row">
            {alsoBought.map((p, i) => (
              <div key={p.id} className="also-card" onClick={() => navigate(`/products/${p.id}`)}>
                <div className="also-emoji">📦</div>
                <div className="also-name">{p.name}</div>
                <div className="also-price">₹{p.price?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Demo data when backend is not running
const DEMO_PRODUCTS = [
  { id: 1, name: 'ProBass Wireless', price: 1899, originalPrice: 3499, rating: 4.5, category: { name: 'Audio' } },
  { id: 2, name: 'FitPulse X2 Watch', price: 4599, originalPrice: 7999, rating: 4.3, category: { name: 'Wearables' } },
  { id: 3, name: 'UltraBook Pro 15', price: 52999, originalPrice: 69000, rating: 4.7, category: { name: 'Laptops' } },
  { id: 4, name: 'Nova 12 Ultra', price: 24999, originalPrice: 32000, rating: 4.4, category: { name: 'Smartphones' } },
  { id: 5, name: 'GameZone Controller', price: 2299, originalPrice: 3999, rating: 4.2, category: { name: 'Gaming' } },
  { id: 6, name: 'SnapPro 4K Camera', price: 18499, originalPrice: 24000, rating: 4.6, category: { name: 'Cameras' } },
  { id: 7, name: 'SoundBox 360', price: 3199, originalPrice: 5500, rating: 4.1, category: { name: 'Audio' } },
  { id: 8, name: 'ViewMax 27" Monitor', price: 15999, originalPrice: 21000, rating: 4.5, category: { name: 'Electronics' } },
];

const DEMO_ALSO_BOUGHT = [
  { id: 9, name: 'Tech Backpack', price: 1499 },
  { id: 10, name: 'Wireless Mouse', price: 699 },
  { id: 11, name: 'Mech Keyboard', price: 2799 },
  { id: 12, name: 'LED Desk Lamp', price: 899 },
  { id: 13, name: 'PowerBank 20000', price: 1199 },
];
