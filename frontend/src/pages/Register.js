import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await registerAPI(form);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account ✨</h2>
        <p>Join ShopAI for a smarter shopping experience</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text" required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Alok Shaw"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" required minLength={6}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up →'}
          </button>
        </form>

        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
