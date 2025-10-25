// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import AdminProductForm from "../components/AdminProductForm";

/**
 * AdminDashboard
 * - Products tab with list, add, edit, delete
 * - Uses Bootstrap modal for Add/Edit (multipart/form-data for image upload)
 *
 * Notes:
 * - Uses your existing `api` axios instance which already attaches the token.
 * - Matches coding style of other pages (functional component, default export).
 */

const AdminDashboard = () => {
  // UI state
  const [activeTab, setActiveTab] = useState("products");

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Orders state (for Orders tab)
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // Pagination (server supports pageNumber/pageSize)
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state (add/edit)
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Form state for add/edit
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    category: "",
    imageUrl: "",
    // we'll keep `imageFile` in a separate ref so it doesn't re-render on file selection
  });
  const imageFileRef = useRef(null);

  // For delete confirmation
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch paginated product list (admin view: uses GET /api/products)
  const fetchProducts = async (page = pageNumber) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        pageNumber: page,
        pageSize,
      };

      const res = await api.get("/products", { params });

      // Your backend returns { TotalItems, PageNumber, PageSize, TotalPages, Products }
      const data = res.data;
      setProducts(data.products ?? data.Products ?? []);
      setPageNumber(data.pageNumber ?? data.PageNumber ?? page);
      setTotalPages(data.totalPages ?? data.TotalPages ?? 1);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.response?.data?.message || "Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  // Fetch all orders for admin
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError("");
      const res = await api.get("/orders"); // GET /api/orders (Admin only)
      setOrders(res.data ?? []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrdersError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "products") fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  // Pagination change
  const goToPage = (n) => {
    setPageNumber(n);
    fetchProducts(n);
  };

  // Open "Add Product" modal
  const openAddModal = () => {
    setIsEditMode(false);
    setForm({
      id: null,
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      category: "",
      imageUrl: "",
    });
    imageFileRef.current = null;
    setShowModal(true);
  };

  // Open "Edit Product" modal
  const openEditModal = (p) => {
    setIsEditMode(true);
    setForm({
      id: p.id,
      name: p.name ?? "",
      description: p.description ?? "",
      price: p.price ?? "",
      stockQuantity: p.stockQuantity ?? p.stock ?? 0,
      category: p.category ?? "",
      imageUrl: p.imageUrl ?? p.imageURL ?? "",
    });
    imageFileRef.current = null;
    setShowModal(true);
  };

  // Handle form input changes (text/number)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    imageFileRef.current = file;
  };

  // Submit Add or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      if (!form.name || !form.price) {
        toast.error("Please provide product name and price.");
        setModalLoading(false);
        return;
      }

      if (isEditMode) {
        const fd = new FormData();
        fd.append("Name", form.name);
        fd.append("Description", form.description || "");
        fd.append("Price", form.price || 0);
        fd.append("StockQuantity", form.stockQuantity || 0);
        fd.append("Category", form.category || "");
        fd.append("ImageUrl", form.imageUrl || "");

        if (imageFileRef.current) {
          fd.append("ImageFile", imageFileRef.current);
        }

        const token = localStorage.getItem("token");
        const resp = await api.put(`/products/${form.id}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Product updated");
        setShowModal(false);
        fetchProducts(pageNumber);
      } else {
        const fd = new FormData();
        fd.append("Name", form.name);
        fd.append("Description", form.description || "");
        fd.append("Price", form.price || 0);
        fd.append("StockQuantity", form.stockQuantity || 0);
        fd.append("Category", form.category || "");
        if (form.imageUrl) fd.append("ImageUrl", form.imageUrl);
        if (imageFileRef.current) fd.append("ImageFile", imageFileRef.current);

        const token = localStorage.getItem("token");
        const resp = await api.post("/products", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Product created");
        setShowModal(false);
        fetchProducts(1);
      }
    } catch (err) {
      console.error("Save failed:", err);
      const msg = err.response?.data?.message || err.message || "Save failed";
      toast.error(msg);
    } finally {
      setModalLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setDeleteLoading(true);
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts(pageNumber);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Render product row
  const ProductRow = ({ p }) => {
    const image =
      p.imageUrl && p.imageUrl.trim() !== ""
        ? p.imageUrl.startsWith("http")
          ? p.imageUrl
          : `http://localhost:5133${p.imageUrl}`
        : "http://localhost:5133/Images/product1.png";

    return (
      <tr>
        <td style={{ width: 120 }}>
          <img
            src={image}
            alt={p.name}
            style={{ width: 100, height: 60, objectFit: "cover" }}
            className="rounded"
          />
        </td>
        <td>{p.name}</td>
        <td>{p.category}</td>
        <td>₹{p.price}</td>
        <td>{p.stockQuantity ?? p.stock ?? "-"}</td>
        <td>
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => openEditModal(p)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(p.id)}
            disabled={deleteLoading}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </li>
      </ul>

      {/* Products tab */}
      {activeTab === "products" && (
        <div className="p-4 bg-white rounded shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="m-0">Manage Products</h4>
            <div>
              <button className="btn btn-success" onClick={openAddModal}>
                + Add Product
              </button>
            </div>
          </div>

          {loading && (
            <div className="d-flex align-items-center gap-2">
              <div className="spinner-border" role="status" />
              <span>Loading products...</span>
            </div>
          )}
          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && (
            <>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th style={{ width: 180 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => <ProductRow key={p.id} p={p} />)
                    )}
                  </tbody>
                </table>
              </div>

              <nav className="d-flex justify-content-center">
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      pageNumber === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => goToPage(Math.max(1, pageNumber - 1))}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        pageNumber === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      pageNumber === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        goToPage(Math.min(totalPages, pageNumber + 1))
                      }
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      )}

      {/* Orders tab */}
      {activeTab === "orders" && (
        <div className="p-4 bg-white rounded shadow-sm">
          <h4>Orders</h4>

          {ordersLoading && (
            <div className="d-flex align-items-center gap-2">
              <div className="spinner-border" role="status" />
              <span>Loading orders...</span>
            </div>
          )}

          {!ordersLoading && ordersError && (
            <div className="alert alert-danger">{ordersError}</div>
          )}

          {!ordersLoading && !ordersError && (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Payment ID</th>
                    <th>Customer Name</th>
                    <th>Customer Email</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{new Date(o.orderDate).toLocaleString()}</td>
                        <td>₹{o.totalAmount}</td>
                        <td>{o.status}</td>
                        <td>{o.paymentId}</td>
                        <td>{o.customer?.name}</td>
                        <td>{o.customer?.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal (Bootstrap markup) */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <AdminProductForm
            showModal={showModal}
            isEditMode={isEditMode}
            form={form}
            setForm={setForm}
            imageFileRef={imageFileRef}
            modalLoading={modalLoading}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
