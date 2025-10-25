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
        <div className="card p-4 shadow-sm">
          <h2 className="mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Name"
            />
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Email"
            />
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Password"
            />
            <button
              className="btn btn-primary w-100"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
