// // frontend/src/pages/Register.js
// import { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { AuthContext } from "../context/AuthContext";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { register, user } = useContext(AuthContext);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user) {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//     if (error) setError("");
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Frontend validation
//     if (formData.name.trim().length < 3) {
//       setError("Name must be at least 3 characters");
//       toast.error("Name must be at least 3 characters");
//       setLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       toast.error("Password must be at least 6 characters");
//       setLoading(false);
//       return;
//     }

//     try {
//       const result = await register(formData.name, formData.email, formData.password);

//       if (result.success) {
//         toast.success(`🎉 Welcome ${formData.name}! Your account is created.`);
//         // Navigation will be handled by useEffect
//       } else {
//         let msg = result.message || "Registration failed. Please try again.";
//         toast.error(msg);
//         setError(msg);
//       }
//     } catch (error) {
//       console.error("Register error:", error);

//       let msg =
//         error?.response?.data?.message ||
//         "Something went wrong. Please try again.";

//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
//       <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
//         <h2 className="text-3xl font-bold text-center mb-2 text-indigo-600">
//           Create Account
//         </h2>
//         <p className="text-center text-gray-500 mb-6">Join BlogSphere today!</p>

//         {/* Error Message (field-level) */}
//         {error && (
//           <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}

//         <form className="space-y-5" onSubmit={handleRegister}>
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter your full name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               minLength={3}
//               className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Create a strong password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               minLength={6}
//               className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
//           >
//             {loading ? "Creating account..." : "Create Account"}
//           </button>
//         </form>

//         {/* Login link */}
//         <div className="mt-6 text-center">
//           <p className="text-gray-600">
//             Already have an account?{" "}
//             <a
//               href="/login"
//               className="text-indigo-600 font-semibold hover:text-indigo-800"
//             >
//               Login here
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }




// frontend/src/pages/Register.js
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, user } = useContext(AuthContext);

  // Redirect if already logged in - EVERYONE goes to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Frontend validation
    if (formData.name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      toast.error("Name must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData.name, formData.email, formData.password);

      if (result.success) {
        toast.success(`🎉 Welcome ${formData.name}! Your account is created.`);
        // Navigation will be handled by useEffect
      } else {
        let msg = result.message || "Registration failed. Please try again.";
        toast.error(msg);
        setError(msg);
      }
    } catch (error) {
      console.error("Register error:", error);

      let msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-2 text-indigo-600">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">Join BlogSphere today!</p>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={3}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}