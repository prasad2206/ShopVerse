import React, { useEffect, useState } from "react";
import api from "../services/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(""); // category name as string

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
      

      const res = await api.get("/products", { params });
      console.log("API response:", res.data);


      setProducts(res.data.products);
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
  }, [debouncedSearch, category]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-64"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Loader */}
      {loading && <p>Loading products...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 && !loading && !error && (
          <p>No products found.</p>
        )}

        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow-sm p-4 hover:shadow-md transition"
          >
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h3 className="font-medium text-lg">{p.name}</h3>
            <p className="text-gray-600 text-sm mb-1">{p.categoryName}</p>
            <p className="font-semibold text-green-700">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
