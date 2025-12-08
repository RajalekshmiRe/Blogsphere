import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("published");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Technology",
    "Lifestyle",
    "Travel",
    "Food",
    "Health",
    "Business",
    "Entertainment",
    "Other"
  ];

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("category", category);
      
      // Handle tags - convert to array
      const tagsArray = tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Send tags as JSON string or individual items
      formData.append("tags", JSON.stringify(tagsArray));
      
      formData.append("status", status);
      
      // Only append image if one is selected
      if (image) {
        formData.append("featuredImage", image);
      }

      console.log("Submitting blog...");
      console.log("Title:", title);
      console.log("Category:", category);
      console.log("Tags:", tagsArray);
      console.log("Has Image:", !!image);

      const response = await axiosInstance.post("/blogs", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Success Response:", response.data);
      alert("Blog created successfully!");
      
      // Reset form
      setTitle("");
      setContent("");
      setCategory("Technology");
      setTags("");
      setStatus("published");
      setImage(null);
      setImagePreview(null);
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.error("=== ERROR DETAILS ===");
      console.error("Full Error:", error);
      console.error("Error Response:", error.response?.data);
      console.error("Error Status:", error.response?.status);
      console.error("Error Message:", error.message);
      
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message ||
                      "Error creating blog. Please check console for details.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "800px", 
      margin: "40px auto", 
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "30px", color: "#333" }}>Create a Blog</h2>
      
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
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
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
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
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
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
          <small style={{ color: "#666", fontSize: "13px", marginTop: "4px", display: "block" }}>
            Separate tags with commas
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
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px"
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
                    maxWidth: "300px", 
                    maxHeight: "200px", 
                    borderRadius: "4px",
                    border: "1px solid #ddd"
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
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              minHeight: "300px",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          ></textarea>
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
                style={{ marginRight: "8px" }}
              />
              Publish
            </label>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="radio"
                value="draft"
                checked={status === "draft"}
                onChange={(e) => setStatus(e.target.value)}
                style={{ marginRight: "8px" }}
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
            width: "100%",
            padding: "14px",
            backgroundColor: loading ? "#ccc" : "#4F46E5",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "600",
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
  );
}