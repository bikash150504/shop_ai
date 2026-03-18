import { useEffect, useState } from 'react';
import { getOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getOrders(user.id)
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  }, [user]);

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div>📦</div>
        <h2>No orders yet</h2>
        <p>Start shopping to see your orders here!</p>
        <button onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  const STATUS_COLORS = {
    CONFIRMED: '#00b894', PENDING: '#fdcb6e',
    SHIPPED: '#74b9ff', DELIVERED: '#00cec9', CANCELLED: '#ff6b6b'
  };

  return (
    <div className="orders-page container">
      <h1>My Orders 📦</h1>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <div className="order-id">Order #{order.id}</div>
              <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="order-status" style={{ color: STATUS_COLORS[order.status] }}>
              ● {order.status}
            </div>
            <div className="order-total">₹{order.totalAmount?.toLocaleString()}</div>
          </div>
          <div className="order-items">
            {order.items?.map(item => (
              <span key={item.id} className="order-item-tag">
                {item.product?.name} × {item.quantity}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
