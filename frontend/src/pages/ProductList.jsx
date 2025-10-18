import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const ProductList = () => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart(); // Access cart state and methods
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(""); // category name as string
  const [minPrice, setMinPrice] = useState(""); // minimum price filter
  const [maxPrice, setMaxPrice] = useState(""); // maximum price filter
  const [page, setPage] = useState(1); // current page
  const [pageSize] = useState(8); // fixed page size
  const [totalPages, setTotalPages] = useState(1); // from backend response

  // ✅ debounce search input (wait 500ms after typing)
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // ✅ fetch products (with filters)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category; // send category name
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      params.page = page;
      params.pageSize = pageSize;

      const res = await api.get("/products", { params });
      console.log("API response:", res.data);

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages || 1); // ✅ update pagination count if backend sends it
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const resp = await api.get("/products/categories");
      setCategories(resp.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  // load initial data
  useEffect(() => {
    fetchCategories();
  }, []);

  // re-fetch products when filters/search change
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category, minPrice, maxPrice, page]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      {/* ✅ Filters Section */}
      <div className="row mb-4">
        {/* Search */}
        <div className="col-md-3 mb-2">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Category */}
        <div className="col-md-3 mb-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Price Range */}
        <div className="col-md-2 mb-2">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-2 mb-2">
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Apply/Reset */}
        <div className="col-md-2 mb-2 d-flex gap-2">
          {/* <button
            className="btn btn-primary w-50"
            onClick={() => fetchProducts()} // apply filters
          >
            Apply
          </button> */}
          <button
            className="btn btn-secondary w-50"
            onClick={() => {
              setSearch("");
              setCategory("");
              setMinPrice("");
              setMaxPrice("");
              setPage(1);
            }} // reset filters
          >
            Reset
          </button>
        </div>
      </div>

      {/* ✅ Loader - Bootstrap spinner */}
      {loading && (
        <div className="d-flex flex-column align-items-center justify-content-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Loading products...</p>
        </div>
      )}

      {/* ✅ Error - Bootstrap alert */}
      {!loading && error && (
        <div className="alert alert-danger mt-3" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* ✅ Product grid container */}
      <div className="row">
        {/* No products message */}
        {products.length === 0 && !loading && !error && (
          <div className="text-center text-muted py-5">
            No products found 🙁
          </div>
        )}

        {/* ✅ Product cards grid */}
        {products.map((p) => {
          const image =
            p.imageUrl ||
            p.imageURL ||
            "https://via.placeholder.com/400x300?text=No+Image"; // fallback image
          const name = p.name || "Unnamed Product"; // safe name
          const category = p.categoryName || p.category || "General"; // safe category
          const price = p.price || 0; // safe price
          const desc = p.description
            ? p.description.slice(0, 100) + "..."
            : "No description available"; // short desc

          return (
            <div key={p.id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={image}
                  className="card-img-top"
                  alt={name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{name}</h5>
                  <p className="text-muted mb-1">{category}</p>
                  <p className="card-text text-truncate" title={desc}>
                    {desc}
                  </p>
                  <p className="fw-bold text-success mt-auto mb-2">₹{price}</p>
                  {/* ✅ If product is already in cart → show counter + remove button */}
                  {(() => {
                    const itemInCart = cartItems.find((i) => i.id === p.id);

                    if (itemInCart) {
                      return (
                        <div className="d-flex align-items-center justify-content-between mt-auto gap-2">
                          {/* Remove button */}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(p.id)}
                          >
                            Remove
                          </button>

                          {/* Counter */}
                          <div
                            className="input-group input-group-sm"
                            style={{ width: "120px" }}
                          >
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                if (itemInCart.qty === 1) {
                                  removeFromCart(p.id); // remove product if qty reaches 0
                                } else {
                                  updateQuantity(p.id, itemInCart.qty - 1); // decrease qty
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
                              onClick={() =>
                                updateQuantity(p.id, itemInCart.qty + 1)
                              } // increase qty
                            >
                              +
                            </button>
                          </div>

                          
                        </div>
                      );
                    }

                    // ✅ If product not in cart → show "Add to Cart" button
                    return (
                      <button
                        className="btn btn-primary btn-sm mt-auto"
                        onClick={() => addToCart(p)}
                      >
                        Add to Cart
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                Previous
              </button>
            </li>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(page + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProductList;
