// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(form);
    setSubmitting(false);
    if (res.success) {
      toast.success("Login successful");
      // if user is admin, redirect to admin; else home
      const user = res.data.user;
      if (user?.role === "Admin") {
        navigate("/admin");
      } else {
        navigate(redirect ? `/${redirect}` : "/");
      }
    } else {
      toast.error(res.message || "Login failed");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4 shadow-sm">
          <h2 className="mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
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
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
