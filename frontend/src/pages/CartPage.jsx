// src/pages/CartPage.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } =
    useCart();
  const navigate = useNavigate();

  // ✅ If cart empty → show message
  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4 className="mb-3">Your cart is empty 🛒</h4>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products")}
        >
          Browse Products
        </button>
      </div>
    );
  }

  // ✅ Checkout & place order via backend
  const handleCheckout = async () => {
    try {
      // build order payload
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.qty,
          price: item.price,
        })),
        totalAmount: totalAmount,
      };

      // call backend
      const res = await api.post("/orders", payload);

      // show confirmation + clear cart
      alert("✅ " + (res.data.message || "Order placed successfully!"));
      const newOrderId = res.data.orderId;

      clearCart();
      navigate(`/ordersummary/${newOrderId}`);
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("❌ Failed to place order. Please try again.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Your Shopping Cart</h3>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td className="d-flex align-items-center gap-3">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/80"}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    className="rounded"
                  />
                  <div>
                    <div className="fw-semibold">{item.name}</div>
                    <small className="text-muted">{item.categoryName}</small>
                  </div>
                </td>

                <td>₹{item.price}</td>

                {/* ✅ Quantity control */}
                <td>
                  <div
                    className="input-group input-group-sm"
                    style={{ width: "110px" }}
                  >
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={item.qty}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>₹{(item.price * item.qty).toFixed(2)}</td>

                {/* ✅ Remove button */}
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Cart summary + checkout */}
      <div className="d-flex justify-content-end align-items-center mt-4">
        <div className="text-end">
          <h5>Total Amount: ₹{totalAmount.toFixed(2)}</h5>
          <div className="d-flex gap-2 mt-3 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={clearCart}>
              Clear Cart
            </button>
            <button className="btn btn-success" onClick={handleCheckout}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
