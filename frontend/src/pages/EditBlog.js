// frontend/src/pages/EditBlog.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export default function EditBlog() {
  const navigate = useNavigate();
  const { blogId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Technology',
    tags: '',
    image: null,
    currentImage: null,
    status: 'draft'
  });

  const categories = [
    'Technology',
    'Lifestyle',
    'Business',
    'Health',
    'Travel',
    'Food',
    'Education',
    'Entertainment',
    'Other'
  ];

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    } else {
      setError('Blog ID is missing');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  // ✅ ENHANCED: Image URL handler with better debugging
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.log('⚠️ No image path provided');
      return null;
    }

    console.log('🔍 Processing image path:', imagePath);

    // Cloudinary or absolute URL
    if (imagePath.startsWith('http')) {
      console.log('✅ Using absolute URL:', imagePath);
      return imagePath;
    }

    // Backend base URL (from env or default to Render)
    const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://blogsphere-sgud.onrender.com';
    
    // Build the full URL
    const fullUrl = `${API_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    console.log('✅ Built image URL:', fullUrl);
    
    return fullUrl;
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError('');
      setImageError(false);

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      console.log('📡 Fetching blog:', blogId);
      const response = await axiosInstance.get(`/blogs/${blogId}`);
      console.log('📦 Full API Response:', response.data);
      
      const blog = response.data?.blog || response.data?.data || response.data;

      if (!blog) throw new Error('Invalid blog data');

      console.log('📝 Blog data:', blog);

      // Try multiple possible field names for the image
      const rawImagePath =
        blog.featuredImage ||
        blog.image ||
        blog.coverImage ||
        blog.cover ||
        blog.thumbnail ||
        '';

      console.log('🖼️ Raw image path from API:', rawImagePath);

      const processedImageUrl = getImageUrl(rawImagePath);
      console.log('🎨 Processed image URL:', processedImageUrl);

      setFormData({
        title: blog.title || '',
        description: blog.description || blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || 'Technology',
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
        image: null,
        currentImage: processedImageUrl,
        status: blog.status || 'draft'
      });

      setImageError(false);
    } catch (err) {
      console.error('❌ Error fetching blog:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to load blog';
      setError(msg);
      toast.error(msg);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setTimeout(() => navigate('/login'), 1500);
      } else if (err.response?.status === 404) {
        setTimeout(() => navigate('/my-blogs'), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    console.log('📁 New image selected:', file.name, file.size, 'bytes');
    setFormData(prev => ({ ...prev, image: file }));
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('❌ Image failed to load:', formData.currentImage);
    setImageError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      toast.error('All required fields must be filled');
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);

      if (formData.tags) {
        const tagsArray = formData.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);
        formDataToSend.append('tags', JSON.stringify(tagsArray));
      }

      // ✅ CRITICAL FIX: Use 'image' to match CreateBlog.js and backend
      if (formData.image) {
        formDataToSend.append('image', formData.image);
        console.log('📤 Uploading new image as "image":', formData.image.name);
      } else {
        console.log('ℹ️ No new image selected, keeping current image');
      }

      console.log('📦 Sending update for blog:', blogId);
      const response = await axiosInstance.put(`/blogs/${blogId}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('✅ Blog updated:', response.data);
      toast.success('Blog updated successfully!');
      navigate('/my-blogs');
    } catch (err) {
      console.error('❌ Error updating blog:', err);
      console.error('Error response:', err.response?.data);
      const msg = err.response?.data?.message || err.message || 'Failed to update blog';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================= UI BELOW ======================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-red-600">{error}</p>
          <button onClick={() => navigate('/my-blogs')} className="mt-4 btn">
            Back
          </button>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter blog description"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter full blog content"
                rows="12"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
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
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. react, javascript, web development"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
            </div>

            {/* ✅ ENHANCED: Image Preview Section with Better Debugging */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Featured Image
              </label>

              {/* Show current image if exists and no new image selected */}
              {formData.currentImage && !formData.image && !imageError && (
                <div className="mb-4 relative group">
                  <img
                    src={formData.currentImage}
                    alt="Current featured"
                    className="h-48 w-full object-cover rounded-lg border-2 border-gray-200 shadow-sm transition-all group-hover:border-indigo-300"
                    onError={handleImageError}
                    onLoad={() => console.log('✅ Image loaded successfully:', formData.currentImage)}
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                    Current Image
                  </div>
                </div>
              )}

              {/* Show error if image failed to load */}
              {formData.currentImage && !formData.image && imageError && (
                <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-yellow-700 font-medium">
                        Current image could not be loaded
                      </p>
                      <p className="text-xs text-yellow-600 mt-1 break-all font-mono">
                        {formData.currentImage}
                      </p>
                      <p className="text-sm text-yellow-700 mt-2">
                        You can upload a new image below
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show new image preview */}
              {formData.image && (
                <div className="mb-4 relative group">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="New preview"
                    className="h-48 w-full object-cover rounded-lg border-2 border-green-400 shadow-md"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    New Image
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {formData.image.name} ({(formData.image.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}

              {/* Show placeholder if no image at all */}
              {!formData.currentImage && !formData.image && (
                <div className="mb-4 h-48 w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No image uploaded</p>
                    <p className="mt-1 text-xs text-gray-400">Upload an image below</p>
                  </div>
                </div>
              )}

              {/* File input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              <p className="mt-2 text-sm text-gray-500">
                {formData.currentImage && !formData.image 
                  ? 'Upload a new image to replace the current one' 
                  : 'Max size: 5MB. Formats: JPG, PNG, GIF, WebP'}
              </p>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : 'Update Blog'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-blogs')}
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}