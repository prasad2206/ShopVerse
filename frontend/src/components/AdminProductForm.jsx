// src/components/AdminProductForm.jsx
import React from "react";

/**
 * Props:
 * - showModal: boolean
 * - isEditMode: boolean
 * - form: object
 * - setForm: function
 * - imageFileRef: ref
 * - modalLoading: boolean
 * - onClose: function
 * - onSubmit: function
 */
const AdminProductForm = ({
  showModal,
  isEditMode,
  form,
  setForm,
  imageFileRef,
  modalLoading,
  onClose,
  onSubmit,
}) => {
  if (!showModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    imageFileRef.current = file;
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <form onSubmit={onSubmit} className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditMode ? "Edit Product" : "Add Product"}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Price</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Stock Quantity</label>
                <input
                  name="stockQuantity"
                  type="number"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="form-control"
                />
              </div>

              <div className="col-md-8">
                <label className="form-label">Image URL (optional)</label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="https://..."
                />
                <small className="text-muted">If you upload a file, it will be used instead.</small>
              </div>

              <div className="col-md-4">
                <label className="form-label">Upload Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={modalLoading}>
              {modalLoading ? "Saving..." : isEditMode ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
