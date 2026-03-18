import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllProducts, searchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          const res = await searchProducts(searchQuery);
          setProducts(res.data);
        } else {
          const res = await getAllProducts();
          setProducts(res.data);
        }
      } catch {
        setProducts(DEMO_PRODUCTS);
      }
      setLoading(false);
    };
    load();
  }, [searchQuery]);

  return (
    <div className="products-page container">
      <div className="page-header">
        <h1>{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</h1>
        <span>{products.length} products found</span>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-results">No products found for "{searchQuery}"</div>
      ) : (
        <div className="products-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

const DEMO_PRODUCTS = [
  { id: 1, name: 'ProBass Wireless', price: 1899, originalPrice: 3499, rating: 4.5, category: { name: 'Audio' } },
  { id: 2, name: 'FitPulse X2 Watch', price: 4599, originalPrice: 7999, rating: 4.3, category: { name: 'Wearables' } },
  { id: 3, name: 'UltraBook Pro 15', price: 52999, originalPrice: 69000, rating: 4.7, category: { name: 'Laptops' } },
  { id: 4, name: 'Nova 12 Ultra', price: 24999, originalPrice: 32000, rating: 4.4, category: { name: 'Smartphones' } },
  { id: 5, name: 'GameZone Controller', price: 2299, originalPrice: 3999, rating: 4.2, category: { name: 'Gaming' } },
  { id: 6, name: 'SnapPro 4K Camera', price: 18499, originalPrice: 24000, rating: 4.6, category: { name: 'Cameras' } },
];
