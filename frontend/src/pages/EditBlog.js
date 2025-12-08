// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../api/axiosInstance";
// import { toast } from "react-toastify";

// export default function EditBlog() {
//   const { blogId } = useParams();
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [content, setContent] = useState("");
//   const [image, setImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState("");
//   const [status, setStatus] = useState("draft");
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchBlog();
//   }, [blogId]);

//   const fetchBlog = async () => {
//     try {
//       const res = await axiosInstance.get(`/blogs/${blogId}`);
//       const b = res.data.data;

//       setTitle(b.title);
//       setCategory(b.category);
//       setContent(b.content);
//       setPreviewImage(b.image);
//       setStatus(b.status);

//       setLoading(false);
//     } catch (error) {
//       toast.error("Error loading blog");
//       navigate("/my-blogs");
//     }
//   };

//   const handleUpdateBlog = async (publish = false) => {
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("category", category);
//     formData.append("content", content);
//     formData.append("status", publish ? "published" : "draft");
//     if (image) formData.append("image", image);

//     try {
//       await axiosInstance.put(`/blogs/${blogId}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       toast.success(publish ? "Blog Published!" : "Draft Updated!");
//       navigate("/my-blogs");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update blog");
//     }
//   };

//   if (loading) {
//     return (
//       <h2 style={{ textAlign: "center", marginTop: 50 }}>
//         Loading...
//       </h2>
//     );
//   }

//   const styles = {
//     wrapper: {
//       maxWidth: 600,
//       margin: "40px auto",
//       padding: "0 15px",
//       boxSizing: "border-box",
//     },
//     formGroup: {
//       display: "flex",
//       flexDirection: "column",
//       marginBottom: 20,
//       textAlign: "left",
//     },
//     label: {
//       fontWeight: "bold",
//       marginBottom: 8,
//     },
//     input: {
//       padding: "8px 12px",
//       fontSize: "1rem",
//       border: "1px solid #ccc",
//       borderRadius: 4,
//       boxSizing: "border-box",
//     },
//     textarea: {
//       padding: "8px 12px",
//       fontSize: "1rem",
//       border: "1px solid #ccc",
//       borderRadius: 4,
//       boxSizing: "border-box",
//       resize: "vertical",
//     },
//     previewImage: {
//       width: 150,
//       marginTop: 10,
//       borderRadius: 5,
//     },
//     btnGroup: {
//       display: "flex",
//       gap: 10,
//       justifyContent: "flex-start",
//       marginTop: 20,
//     },
//     btn: {
//       padding: "8px 16px",
//       fontSize: "1rem",
//       cursor: "pointer",
//       border: "none",
//       borderRadius: 4,
//     },
//     btnSecondary: {
//       backgroundColor: "#6c757d",
//       color: "white",
//     },
//     btnPrimary: {
//       backgroundColor: "#007bff",
//       color: "white",
//     },
//   };

//   return (
//     <div style={styles.wrapper}>
//       <h1>Edit Blog</h1>
//       <div style={{ display: "flex", flexDirection: "column" }}>
//         <div style={styles.formGroup}>
//           <label style={styles.label} htmlFor="blog-title">Blog Title</label>
//           <input
//             id="blog-title"
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter blog title"
//             style={styles.input}
//           />
//         </div>

//         <div style={styles.formGroup}>
//           <label style={styles.label} htmlFor="blog-category">Category</label>
//           <input
//             id="blog-category"
//             type="text"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             placeholder="Enter category"
//             style={styles.input}
//           />
//         </div>

//         <div style={styles.formGroup}>
//           <label style={styles.label} htmlFor="blog-content">Blog Content</label>
//           <textarea
//             id="blog-content"
//             rows={10}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Write your blog content..."
//             style={styles.textarea}
//           />
//         </div>

//         <div style={styles.formGroup}>
//           <label style={styles.label} htmlFor="blog-image">Upload Image</label>
//           <input
//             id="blog-image"
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               setImage(e.target.files[0]);
//               setPreviewImage(URL.createObjectURL(e.target.files[0]));
//             }}
//             style={styles.input}
//           />

//           {previewImage && (
//             <img
//               src={previewImage}
//               alt="preview"
//               style={styles.previewImage}
//             />
//           )}
//         </div>

//         <div style={styles.btnGroup}>
//           <button
//             type="button"
//             onClick={() => handleUpdateBlog(false)}
//             style={{ ...styles.btn, ...styles.btnSecondary }}
//           >
//             Save Draft
//           </button>

//           <button
//             type="button"
//             onClick={() => handleUpdateBlog(true)}
//             style={{ ...styles.btn, ...styles.btnPrimary }}
//           >
//             Publish Blog
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




// frontend/src/pages/EditBlog.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function EditBlog() {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Food', 'Education', 'Entertainment', 'Other'];

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    } else {
      setError('Blog ID is missing');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      console.log('Fetching blog with ID:', blogId);
      const res = await axiosInstance.get(`/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Blog data received:', res.data);

      // Handle different response structures
      let blog;
      if (res.data?.success && res.data?.data) {
        // Structure: { success: true, data: {...} }
        blog = res.data.data;
      } else if (res.data?.blog) {
        // Structure: { blog: {...} }
        blog = res.data.blog;
      } else if (res.data?.data) {
        // Structure: { data: {...} }
        blog = res.data.data;
      } else {
        // Direct object
        blog = res.data;
      }

      if (!blog || typeof blog !== 'object' || !blog._id) {
        console.error('Invalid blog data:', blog);
        throw new Error('Invalid blog data received from server');
      }

      console.log('Extracted blog:', blog);

      setTitle(blog.title || "");
      setDescription(blog.description || "");
      setCategory(blog.category || "Technology");
      setContent(blog.content || "");
      setTags(Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''));
      setPreviewImage(blog.image || blog.coverImage || "");
      setStatus(blog.status || "draft");

      setLoading(false);
    } catch (error) {
      console.error("Error loading blog:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error loading blog";
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        setTimeout(() => navigate('/login'), 1500);
      } else if (error.response?.status === 404) {
        setTimeout(() => navigate('/my-blogs'), 1500);
      }
      setLoading(false);
    }
  };

  const handleUpdateBlog = async (publish = false) => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("content", content);
    formData.append("status", publish ? "published" : "draft");
    
    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      formData.append('tags', JSON.stringify(tagsArray));
    }
    
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      await axiosInstance.put(`/blogs/${blogId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success(publish ? "Blog Published! 🎉" : "Draft Updated! ✅");
      navigate("/my-blogs");
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update blog";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{error}</h3>
            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={() => navigate('/my-blogs')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Back to My Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-blogs')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 mb-4 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Blogs
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
          <p className="text-gray-600 mt-2">Update your blog post</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter blog description"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content..."
                rows="12"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. react, javascript, web development"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Featured Image
              </label>
              {previewImage && (
                <div className="mb-4">
                  <img
                    src={previewImage}
                    alt="preview"
                    className="h-48 w-full object-cover rounded-lg border border-gray-200"
                  />
                  <p className="text-sm text-gray-600 mt-2">Current image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error('Image size must be less than 5MB');
                      return;
                    }
                    setImage(file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {image && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  ✓ New image selected: {image.name}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">Max size: 5MB. Formats: JPG, PNG, GIF</p>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => handleUpdateBlog(false)}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                {submitting ? "Saving..." : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={() => handleUpdateBlog(true)}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                {submitting ? "Publishing..." : "Publish Blog"}
              </button>

              <button
                type="button"
                onClick={() => navigate('/my-blogs')}
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}