// src/components/ProductCard.jsx
import React from "react";

/**
 * ProductCard props:
 * - product: { id, name, price, imageURL|imageUrl, category|categoryName, description }
 * - onAddToCart: optional callback
 */
const ProductCard = ({ product, onAddToCart }) => {
  // Safe field mapping: Handles multiple possible field names for image
  const image =
    product.imageURL ??  // Prefer imageURL if available
    product.imageUrl ??  // Fallback to imageUrl
    product.image ??     // Fallback to image
    "https://via.placeholder.com/400x300?text=No+Image"; // Placeholder image if none found

  const name = product.name ?? product.title ?? "Unnamed Product"; // Prefer name or title, default to "Unnamed Product"
  const price = product.price ?? product.amount ?? 0; // Default price to 0 if not provided
  const category = product.category ?? product.categoryName ?? ""; // Handle category variations
  const shortDesc =
    product.description && product.description.length > 120 // If description is too long, truncate it
      ? product.description.slice(0, 117) + "..." // Truncate to 120 chars
      : product.description ?? ""; // Default to empty string if no description

  return (
    <div className="card h-100">
      <div style={{ height: 200, overflow: "hidden" }}>
        {/* Image with fallback */}
        <img
          src={image}
          alt={name}
          className="card-img-top"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        {/* Product name with title tooltip */}
        <h5 className="card-title" title={name}>
          {name}
        </h5>

        {/* Category (if available), in smaller text */}
        {category && <p className="text-muted mb-1" style={{ fontSize: 13 }}>{category}</p>}

        {/* Short description, truncated or 'No description' if empty */}
        {shortDesc ? (
          <p className="card-text" style={{ fontSize: 13 }}>{shortDesc}</p>
        ) : (
          <p className="card-text text-muted" style={{ fontSize: 13 }}>No description</p>
        )}

        <div className="mt-auto d-flex justify-content-between align-items-center">
          {/* Display price */}
          <div className="fw-bold">₹{price}</div>
          {/* Show 'Add to Cart' button if onAddToCart is provided */}
          {onAddToCart ? (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => onAddToCart(product)}
            >
              Add
            </button>
          ) : (
            // 'View' button is shown if no onAddToCart is provided
            <button className="btn btn-sm btn-primary" disabled>
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
