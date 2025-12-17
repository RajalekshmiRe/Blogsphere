// frontend/src/pages/Login.js
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  // Redirect if already logged in - EVERYONE goes to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success(`🎉 Welcome back! Login successful.`);
        
        // EVERYONE redirects to dashboard (admins and regular users)
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setError(result.message || "Invalid response from server. Please try again.");
        toast.error(result.message || "Login failed");
      }
      
    } catch (error) {
      console.error("Login error:", error);

      let errorMsg = "An unexpected error occurred. Please try again.";
      
      if (error.response?.status === 401) {
        errorMsg = "Invalid email or password";
      } else if (error.response?.status === 403) {
        errorMsg = "Your account has been deactivated. Please contact admin.";
      } else if (error.response?.status === 400) {
        errorMsg = "Please provide both email and password";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.request) {
        errorMsg = "Cannot connect to server. Please check if backend is running.";
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-2 text-indigo-600">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}