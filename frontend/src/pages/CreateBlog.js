// frontend/src/pages/CreateBlog.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Technology',
    tags: '',
    image: null,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      console.log('📁 Image selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('content', formData.content.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);

      // Parse and send tags
      if (formData.tags.trim()) {
        const tagsArray = formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag);
        formDataToSend.append('tags', JSON.stringify(tagsArray));
      }

      // ✅ CRITICAL: Change 'featuredImage' to 'image' to match backend
      // Check your backend multer config - it's likely expecting 'image'
      if (formData.image) {
        formDataToSend.append('image', formData.image);
        console.log('📤 Uploading image as "image":', formData.image.name);
      } else {
        console.log('⚠️ No image selected');
      }

      // Log what we're sending (for debugging)
      console.log('📦 Sending form data:');
      for (let pair of formDataToSend.entries()) {
        if (pair[0] === 'image') {
          console.log(pair[0], ':', pair[1].name, pair[1].type, pair[1].size, 'bytes');
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }

      const response = await axiosInstance.post('/blogs', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Blog created:', response.data);
      toast.success('Blog created successfully!');
      navigate('/my-blogs');
    } catch (error) {
      console.error('❌ Error creating blog:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create blog';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
          <p className="text-gray-600 mt-2">Share your thoughts with the world</p>
        </div>

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
                placeholder="Enter a brief description of your blog"
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
                placeholder="Write your blog content here..."
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

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Featured Image
              </label>

              {/* Image Preview */}
              {formData.image && (
                <div className="mb-4 relative group">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="h-48 w-full object-cover rounded-lg border-2 border-indigo-400 shadow-md"
                  />
                  <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Image Selected
                  </div>
                  <p className="text-sm text-indigo-600 font-medium mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {formData.image.name} ({(formData.image.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}

              {/* No image placeholder */}
              {!formData.image && (
                <div className="mb-4 h-48 w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No image selected</p>
                    <p className="mt-1 text-xs text-gray-400">Choose an image below</p>
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
                Max size: 5MB. Formats: JPG, PNG, GIF, WebP
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
                    Creating...
                  </span>
                ) : 'Create Blog'}
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