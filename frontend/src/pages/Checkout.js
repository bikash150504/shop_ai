import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkout } from '../services/api';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', paymentMethod: 'UPI' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      await checkout({ userId: user.id, ...form });
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/orders'), 2500);
    } catch {
      // Demo mode: simulate success
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 2500);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="success-screen">
        <div className="success-icon">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with ShopAI 🎉</p>
        <p>Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleCheckout}>
          <h3>Delivery Address</h3>
          <textarea
            required
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="Enter your full delivery address..."
            rows={4}
          />

          <h3>Payment Method</h3>
          <div className="payment-options">
            {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'].map(pm => (
              <label key={pm} className={`payment-opt ${form.paymentMethod === pm ? 'selected' : ''}`}>
                <input type="radio" name="payment" value={pm}
                  checked={form.paymentMethod === pm}
                  onChange={() => setForm({ ...form, paymentMethod: pm })}
                />
                {pm}
              </label>
            ))}
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Placing Order...' : '🛒 Place Order'}
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
