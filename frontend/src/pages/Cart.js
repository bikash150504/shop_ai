import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Shopping Cart 🛒</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-emoji">📦</div>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-cat">{item.category?.name}</div>
                <div className="item-price">₹{item.price?.toLocaleString()}</div>
              </div>
              <div className="item-qty">Qty: {item.quantity}</div>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free">{totalPrice > 499 ? 'FREE' : '₹49'}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{(totalPrice + (totalPrice > 499 ? 0 : 49)).toLocaleString()}</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
