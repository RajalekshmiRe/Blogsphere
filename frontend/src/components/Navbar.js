// frontend/src/components/Navbar.js
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <nav style={{
        backgroundColor: "#001A4D",
        padding: "16px 24px",
        color: "#fff"
      }}>
        Loading...
      </nav>
    );
  }

  return (
    <nav style={{
      backgroundColor: "#001A4D",
      color: "#fff",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontSize: "24px",
        fontWeight: "700",
        textDecoration: "none",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "opacity 0.3s ease"
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
      >
        BlogSphere 🌍
      </Link>

      {/* Navigation Links */}
      <div style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <Link to="/" style={{
          color: "#fff",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "16px",
          padding: "8px 12px",
          borderRadius: "4px",
          transition: "background-color 0.3s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Home
        </Link>

        {user ? (
          <>
            {/* DASHBOARD LINK - FOR ALL LOGGED IN USERS */}
            <Link to="/dashboard" style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background-color 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              📊 Dashboard
            </Link>

            {/* MY BLOGS LINK - FOR ALL LOGGED IN USERS */}
            <Link to="/my-blogs" style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background-color 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              📚 My Blogs
            </Link>

            {/* ADMIN PANEL LINK - ONLY FOR ADMINS */}
            {user?.role === 'admin' && (
              <Link to="/admin" style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                padding: "8px 12px",
                borderRadius: "4px",
                backgroundColor: "rgba(255,255,255,0.15)",
                transition: "background-color 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
              >
                ⚙️ Admin Panel
              </Link>
            )}

            {/* CREATE BLOG - FOR ALL LOGGED IN USERS */}
            <Link to="/create-blog" style={{
              backgroundColor: "#667eea",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "24px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
              transition: "background-color 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#5568d3"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#667eea"}
            >
              ✍️ Create Blog
            </Link>

            {/* User Info Section */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              paddingLeft: "16px",
              borderLeft: "1px solid rgba(255,255,255,0.2)"
            }}>
              <span style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: "500"
              }}>
                👤 {user?.name || "User"}
              </span>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#FF6B6B",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "24px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "background-color 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FF5252"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF6B6B"}
              >
                🚪 Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Login Link */}
            <Link to="/login" style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background-color 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              🔐 Login
            </Link>

            {/* Register Button */}
            <Link to="/register" style={{
              backgroundColor: "#667eea",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "24px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
              transition: "background-color 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#5568d3"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#667eea"}
            >
              📝 Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}