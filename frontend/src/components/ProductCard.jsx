// src/components/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * ProductCard props:
 * - product: { id, name, price, imageURL|imageUrl, category|categoryName, description }
 * - onAddToCart: optional callback
 */
const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();

  // "Buy Now" handler: clears existing cart, adds current product, and redirects to cart
  const handleBuyNow = (product) => {
    clearCart();        // empty old cart
    addToCart(product); // add single product
    navigate("/cart");  // redirect to cart
  };

  // Safe field mapping: Handles multiple possible field names for image
  const image =
    product.imageURL ?? // Prefer imageURL if available
    product.imageUrl ?? // Fallback to imageUrl
    product.image ?? // Fallback to image
    "https://via.placeholder.com/400x300?text=No+Image"; // Placeholder image if none found

  const name = product.name ?? product.title ?? "Unnamed Product"; // Prefer name or title, default to "Unnamed Product"
  const price = product.price ?? product.amount ?? 0; // Default price to 0 if not provided
  const category = product.category ?? product.categoryName ?? ""; // Handle category variations
  const shortDesc =
    product.description && product.description.length > 120 // If description is too long, truncate it
      ? product.description.slice(0, 117) + "..." // Truncate to 120 chars
      : (product.description ?? ""); // Default to empty string if no description

  return (
    <div className="card shadow-sm border-0 p-3 h-100">
      <div style={{ height: 200, overflow: "hidden" }}>
        {/* Image with fallback */}
        <img
          src={image}
          alt={name}
          className="card-img-top product-img"
        />
      </div>

      <div className="card-body d-flex flex-column">
        {/* Product name with title tooltip */}
        <h5 className="card-title" title={name}>
          {name}
        </h5>

        {/* Category (if available), in smaller text */}
        {category && (
          <p className="text-muted mb-1" style={{ fontSize: 13 }}>
            {category}
          </p>
        )}

        {/* Short description, truncated or 'No description' if empty */}
        {shortDesc ? (
          <p className="card-text" style={{ fontSize: 13 }}>
            {shortDesc}
          </p>
        ) : (
          <p className="card-text text-muted" style={{ fontSize: 13 }}>
            No description
          </p>
        )}

        {/* Price and action buttons */}
        <div className="mt-auto pt-2">
          <div className="fw-bold mb-2 text-success fs-6">₹{price}</div>

          {/* Button section with Add to Cart and Buy Now */}
          <div className="d-flex flex-wrap gap-2 mt-2">
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
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
