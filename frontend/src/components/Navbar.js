import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { searchProducts } from '../services/api';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${query}`);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Shop<span>AI</span></Link>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products with AI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="welcome">Hi, {user.name.split(' ')[0]}</span>
            <Link to="/orders" className="nav-btn">Orders</Link>
            <button className="nav-btn" onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn primary">Sign Up</Link>
          </>
        )}
        <Link to="/cart" className="cart-btn">
          🛒 <span className="cart-badge">{totalItems}</span>
        </Link>
      </div>
    </nav>
  );
}
