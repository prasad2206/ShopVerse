// src/pages/OrderSummary.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const OrderSummary = () => {
  const { id } = useParams(); // orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return <div className="container py-5 text-center">Loading order...</div>;
  if (!order)
    return <div className="container py-5 text-center">Order not found.</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4">Order Summary</h3>

      <div className="card mb-4">
        <div className="card-body">
          <h5>Order ID: #{order.id}</h5>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
          <p>
            Status: <span className="badge bg-success">{order.status}</span>
          </p>
          <h5 className="mt-3">Total: ₹{order.totalAmount}</h5>
        </div>
      </div>

      <h5>Ordered Items</h5>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
