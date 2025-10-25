import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const handleLogout = () => {
    logout(); // clear token & user from context
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4 py-2">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-4" to="/products">
          ShopVerse
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto">
            {/* Always visible links */}
            {/* <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={token ? "/cart" : "/login?redirect=cart"} // redirect param if not logged in
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Cart{" "}
                {token && cartItems.length > 0 && (
                  <span className="cart-count">({cartItems.length})</span>
                )}
              </NavLink>
            </li>

            {/* For non-authenticated users */}
            {!token && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {/* For logged-in users */}
            {token && (
              <>
                {user?.role === "Admin" && (
                  <li className="nav-item">
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                )}
                {user?.role === "Customer" && (
                  <li className="nav-item">
                    <NavLink
                      to="/orders"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      My Orders
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <span className="nav-link">
                    Hi, {user?.name ?? user?.email ?? "User"}
                  </span>
                </li>
                <li className="nav-item d-flex align-items-center">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm ms-3"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
