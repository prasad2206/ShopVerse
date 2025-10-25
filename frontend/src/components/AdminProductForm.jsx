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
        <div className="card p-4 shadow-sm w-100">
          <form onSubmit={onSubmit} className="modal-content border-0 bg-transparent">
            <div className="modal-header border-0">
              <h5 className="modal-title">
                {isEditMode ? "Edit Product" : "Add Product"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-8">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control mb-3"
                    required
                    placeholder="Name"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Category"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="form-control mb-3"
                    required
                    placeholder="Price"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    name="stockQuantity"
                    type="number"
                    value={form.stockQuantity}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Stock Quantity"
                  />
                </div>

                <div className="col-12">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="form-control mb-3"
                    placeholder="Description"
                  />
                </div>

                <div className="col-md-8">
                  <input
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="form-control mb-3"
                    placeholder="Image URL (optional)"
                  />
                  <small className="text-muted">
                    If you upload a file, it will be used instead.
                  </small>
                </div>

                <div className="col-md-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={modalLoading}
              >
                {modalLoading
                  ? "Saving..."
                  : isEditMode
                  ? "Save changes"
                  : "Create product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
