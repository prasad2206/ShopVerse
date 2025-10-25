// src/pages/MyOrders.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ref to hold last fetched token value (prevents duplicate fetches in StrictMode)
  const lastFetchedTokenRef = useRef(null);

  useEffect(() => {
    // Only fetch orders when we have a token
    if (!token) {
      console.log("MyOrders: no token available, skipping fetch");
      return;
    }

  // prevent duplicate fetches in React StrictMode during development
  // Track the last token value we fetched for
  const lastFetchedToken = lastFetchedTokenRef.current;
  if (lastFetchedToken === token) return;
  lastFetchedTokenRef.current = token;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        // rely on api interceptor to attach Authorization header
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Note: in React StrictMode this effect may run twice in dev; ensure backend/requests are idempotent
  }, [token]);

  // (ref declared above)

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h3 className="mb-4 fw-bold">My Orders</h3>
      {orders.length === 0 ? (
        <p className="text-muted">No orders yet.</p>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div className="col-12 col-md-6 col-lg-4" key={order.id}>
              <div className="card shadow-sm border-0 p-3">
                <h5 className="fw-semibold mb-2">Order #{order.id}</h5>
                <p className="text-muted mb-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="mb-1">Total: ₹{order.totalAmount}</p>
                <p className="text-success fw-semibold mb-1">
                  Status: {order.status}
                </p>
                <ul className="list-group small mt-2">
                  {order.items && order.items.map((item) => (

                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={item.productId}
                    >
                      {item.productName}
                      <span className="fw-semibold">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
