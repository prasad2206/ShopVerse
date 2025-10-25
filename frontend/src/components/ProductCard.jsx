import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, clearCart, cartItems, updateQuantity, removeFromCart } =
    useCart();

  const handleBuyNow = (product) => {
    clearCart();
    addToCart(product);
    navigate("/cart");
  };

  const image =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl.startsWith("http")
        ? product.imageUrl
        : `http://localhost:5133${product.imageUrl}`
      : "http://localhost:5133/Images/product1.png";

  const name = product.name ?? product.title ?? "Unnamed Product";
  const price = product.price ?? product.amount ?? 0;
  const category = product.category ?? product.categoryName ?? "";
  const shortDesc =
    product.description && product.description.length > 120
      ? product.description.slice(0, 117) + "..."
      : (product.description ?? "");

  const itemInCart = cartItems.find((i) => i.id === product.id);

  return (
    <div className="card shadow-sm border-0 p-3 h-100">
      <div style={{ height: 200, overflow: "hidden" }}>
        <img src={image} alt={name} className="card-img-top product-img" />
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title" title={name}>
          {name}
        </h5>
        {category && (
          <p className="text-muted mb-1" style={{ fontSize: 13 }}>
            {category}
          </p>
        )}
        {shortDesc ? (
          <p className="card-text" style={{ fontSize: 13 }}>
            {shortDesc}
          </p>
        ) : (
          <p className="card-text text-muted" style={{ fontSize: 13 }}>
            No description
          </p>
        )}

        <div className="mt-auto pt-2">
          <div className="fw-bold mb-2 text-success fs-6">₹{price}</div>

          {/* Conditional rendering based on cart */}
          {itemInCart ? (
            <div className="d-flex align-items-center justify-content-between gap-2">
              {/* Remove Button */}
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeFromCart(product.id)}
              >
                Remove
              </button>

              {/* Quantity Controller */}
              <div
                className="input-group input-group-sm"
                style={{ width: "120px" }}
              >
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    if (itemInCart.qty === 1) {
                      removeFromCart(product.id);
                    } else {
                      updateQuantity(product.id, itemInCart.qty - 1);
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={itemInCart.qty}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => updateQuantity(product.id, itemInCart.qty + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-primary flex-fill"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-primary flex-fill"
                onClick={() => handleBuyNow(product)}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
