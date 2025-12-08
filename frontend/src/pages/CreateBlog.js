// frontend/src/pages/CreateBlog.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("published");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Technology", "Lifestyle", "Travel", "Food",
    "Health", "Business", "Entertainment", "Other"
  ];

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required!");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("content", content.trim());
      formData.append("category", category);
      
      const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
      formData.append("tags", JSON.stringify(tagsArray));
      formData.append("status", status);
      
      if (image) {
        formData.append("image", image);
      }

      await axiosInstance.post("/blogs", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Blog created successfully!");
      
      setTitle("");
      setDescription("");
      setContent("");
      setCategory("Technology");
      setTags("");
      setStatus("published");
      setImage(null);
      setImagePreview(null);
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
      setTimeout(() => navigate("/my-blogs"), 1500);
      
    } catch (error) {
      console.error("Error creating blog:", error);
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      "Error creating blog. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '20px', position: 'relative' }}>
      {/* Professional Back Arrow - Top Left */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          position: 'fixed',
          top: '80px',
          left: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: '2px solid #667eea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#667eea';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#fff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Back to Dashboard"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transition: 'all 0.3s ease' }}>
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div style={{ 
        maxWidth: "800px", 
        margin: "0 auto", 
        padding: "40px 20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "30px", color: "#333", fontSize: "32px", fontWeight: "700" }}>
          Create a Blog ✍️
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px", border: "1px solid #ddd",
                borderRadius: "4px", fontSize: "16px", boxSizing: "border-box"
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Description (Short Summary) *
            </label>
            <textarea
              placeholder="Write a brief description of your blog (2-3 sentences)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px", border: "1px solid #ddd",
                borderRadius: "4px", fontSize: "16px", minHeight: "80px",
                fontFamily: "inherit", resize: "vertical", boxSizing: "border-box"
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px", border: "1px solid #ddd",
                borderRadius: "4px", fontSize: "16px", boxSizing: "border-box"
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Tags
            </label>
            <input
              type="text"
              placeholder="AI, Productivity, FutureTech, Innovation"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{
                width: "100%", padding: "12px", border: "1px solid #ddd",
                borderRadius: "4px", fontSize: "16px", boxSizing: "border-box"
              }}
            />
            <small style={{ color: "#666", fontSize: "13px", marginTop: "4px", display: "block" }}>
              Separate tags with commas (optional)
            </small>
          </div>

          {/* Featured Image */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Featured Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: "100%", padding: "12px", border: "1px solid #ddd",
                borderRadius: "4px", boxSizing: "border-box"
              }}
            />
            {image && (
              <div style={{ marginTop: "12px" }}>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                  Selected: {image.name} ({(image.size / 1024).toFixed(2)} KB)
                </p>
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: "300px", maxHeight: "200px", 
                      borderRadius: "4px", border: "1px solid #ddd"
                    }} 
                  />
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Content *
            </label>
            <textarea
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px", border: "1px solid #ddd",
                borderRadius: "4px", fontSize: "16px", minHeight: "300px",
                fontFamily: "inherit", resize: "vertical", boxSizing: "border-box"
              }}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Status *
            </label>
            <div style={{ display: "flex", gap: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="radio"
                  value="published"
                  checked={status === "published"}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ marginRight: "8px", cursor: "pointer" }}
                />
                Publish
              </label>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="radio"
                  value="draft"
                  checked={status === "draft"}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ marginRight: "8px", cursor: "pointer" }}
                />
                Save as Draft
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              backgroundColor: loading ? "#ccc" : "#4F46E5",
              color: "#fff", border: "none", borderRadius: "4px",
              fontSize: "16px", fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = "#4338CA";
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = "#4F46E5";
            }}
          >
            {loading ? "Creating..." : status === "draft" ? "Save Draft" : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}
