// src/pages/Register.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // adjust payload fields to backend expectations
      await register(form);
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
