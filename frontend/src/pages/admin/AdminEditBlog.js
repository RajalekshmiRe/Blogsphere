// // /pages/admin/AdminEditBlog.js
// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../../api/axiosInstance';
// import { toast } from 'react-toastify';

// export default function AdminEditBlog() {
//   const navigate = useNavigate();
//   const { blogId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     content: '',
//     category: 'Technology',
//     tags: '',
//     image: null,
//     currentImage: null,
//     status: 'draft'
//   });

//   const categories = ['Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Food', 'Education', 'Entertainment', 'Other'];

//   useEffect(() => {
//     if (blogId) {
//       fetchBlog();
//     } else {
//       setError('Blog ID is missing');
//       setLoading(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [blogId]);

//   const fetchBlog = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const token = localStorage.getItem('token');

//       if (!token) {
//         toast.error('Please login to continue');
//         navigate('/login');
//         return;
//       }

//       console.log('Fetching blog with ID:', blogId);

//       // ✅ FIXED: Use admin route instead of public route
//       const response = await axiosInstance.get(`/admin/blogs/${blogId}`);

//       console.log('Blog data received:', response.data);

//       // Accept multiple possible response shapes: { blog }, { data }, direct object
//       const blog = response.data?.blog || response.data?.data || response.data;

//       if (!blog || typeof blog !== 'object') {
//         throw new Error('Invalid blog data received from server');
//       }
      
//       setFormData({
//         title: blog.title || '',
//         description: blog.description || '',
//         content: blog.content || '',
//         category: blog.category || 'Technology',
//         tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
//         image: null,
//         currentImage: blog.image || blog.coverImage || blog.cover || null,
//         status: blog.status || 'draft'
//       });
//     } catch (error) {
//       console.error('Error fetching blog:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to load blog';
//       setError(errorMessage);
//       toast.error(errorMessage);
      
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         setTimeout(() => navigate('/login'), 1500);
//       } else if (error.response?.status === 404) {
//         setTimeout(() => navigate('/admin/blogs'), 1500);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Image size must be less than 5MB');
//         return;
//       }
//       setFormData(prev => ({
//         ...prev,
//         image: file
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.title.trim()) {
//       toast.error('Title is required');
//       return;
//     }
//     if (!formData.description.trim()) {
//       toast.error('Description is required');
//       return;
//     }
//     if (!formData.content.trim()) {
//       toast.error('Content is required');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem('token');

//       if (!token) {
//         toast.error('Please login to continue');
//         navigate('/login');
//         return;
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append('title', formData.title);
//       formDataToSend.append('description', formData.description);
//       formDataToSend.append('content', formData.content);
//       formDataToSend.append('category', formData.category);
//       formDataToSend.append('status', formData.status);
      
//       if (formData.tags) {
//         const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
//         formDataToSend.append('tags', JSON.stringify(tagsArray));
//       }
      
//       if (formData.image) {
//         formDataToSend.append('image', formData.image);
//       }

//       // ✅ FIXED: Use admin route for updating
//       await axiosInstance.put(`/admin/blogs/${blogId}`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       toast.success('Blog updated successfully!');
//       navigate('/admin/blogs');
//     } catch (error) {
//       console.error('Error updating blog:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to update blog';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-medium">Loading blog...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !formData.title) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
//           <div className="text-center">
//             <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//             <h3 className="mt-4 text-lg font-medium text-gray-900">{error}</h3>
//             <div className="mt-6 flex gap-4 justify-center">
//               <button
//                 onClick={() => navigate('/admin/blogs')}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//               >
//                 Back to Blogs
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate('/admin/blogs')}
//             className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 mb-4 font-medium"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back to Admin Blogs
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Edit Blog (Admin)</h1>
//           <p className="text-gray-600 mt-2">Update blog post as administrator</p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="Enter blog title"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Enter blog description"
//                 rows="3"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Content <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="content"
//                 value={formData.content}
//                 onChange={handleChange}
//                 placeholder="Enter full blog content"
//                 rows="12"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-2">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   required
//                 >
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-2">
//                   Status <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   required
//                 >
//                   <option value="draft">Draft</option>
//                   <option value="published">Published</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Tags (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="e.g. react, javascript, web development"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Featured Image
//               </label>
//               {formData.currentImage && !formData.image && (
//                 <div className="mb-4">
//                   <img 
//                     src={formData.currentImage} 
//                     alt="Current" 
//                     className="h-48 w-full object-cover rounded-lg border border-gray-200" 
//                   />
//                   <p className="text-sm text-gray-600 mt-2">Current image</p>
//                 </div>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               {formData.image && (
//                 <p className="mt-2 text-sm text-green-600 font-medium">
//                   ✓ New image selected: {formData.image.name}
//                 </p>
//               )}
//               <p className="mt-1 text-sm text-gray-500">Max size: 5MB. Formats: JPG, PNG, GIF</p>
//             </div>

//             <div className="flex gap-4 pt-4 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
//               >
//                 {submitting ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Updating...
//                   </span>
//                 ) : 'Update Blog'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate('/admin/blogs')}
//                 className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




// // /pages/admin/AdminEditBlog.js
// import { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import axiosInstance from '../../api/axiosInstance';
// import { toast } from 'react-toastify';

// export default function AdminEditBlog() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { blogId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     content: '',
//     category: 'Technology',
//     tags: '',
//     image: null,
//     currentImage: null,
//     status: 'draft'
//   });

//   // ✅ Determine where to go back based on location state or default to /admin/blogs
//   const backPath = location.state?.from || '/admin/blogs';
//   const backLabel = location.state?.from === '/my-blogs' || location.state?.from === '/dashboard' 
//     ? 'Back to My Blogs' 
//     : 'Back to Admin Blogs';

//   const categories = ['Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Food', 'Education', 'Entertainment', 'Other'];

//   useEffect(() => {
//     if (blogId) {
//       fetchBlog();
//     } else {
//       setError('Blog ID is missing');
//       setLoading(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [blogId]);

//   const fetchBlog = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const token = localStorage.getItem('token');

//       if (!token) {
//         toast.error('Please login to continue');
//         navigate('/login');
//         return;
//       }

//       console.log('Fetching blog with ID:', blogId);

//       const response = await axiosInstance.get(`/admin/blogs/${blogId}`);

//       console.log('Blog data received:', response.data);

//       const blog = response.data?.blog || response.data?.data || response.data;

//       if (!blog || typeof blog !== 'object') {
//         throw new Error('Invalid blog data received from server');
//       }
      
//       setFormData({
//         title: blog.title || '',
//         description: blog.description || '',
//         content: blog.content || '',
//         category: blog.category || 'Technology',
//         tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
//         image: null,
//         currentImage: blog.image || blog.coverImage || blog.cover || null,
//         status: blog.status || 'draft'
//       });
//     } catch (error) {
//       console.error('Error fetching blog:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to load blog';
//       setError(errorMessage);
//       toast.error(errorMessage);
      
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         setTimeout(() => navigate('/login'), 1500);
//       } else if (error.response?.status === 404) {
//         setTimeout(() => navigate(backPath), 1500);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Image size must be less than 5MB');
//         return;
//       }
//       setFormData(prev => ({
//         ...prev,
//         image: file
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.title.trim()) {
//       toast.error('Title is required');
//       return;
//     }
//     if (!formData.description.trim()) {
//       toast.error('Description is required');
//       return;
//     }
//     if (!formData.content.trim()) {
//       toast.error('Content is required');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem('token');

//       if (!token) {
//         toast.error('Please login to continue');
//         navigate('/login');
//         return;
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append('title', formData.title);
//       formDataToSend.append('description', formData.description);
//       formDataToSend.append('content', formData.content);
//       formDataToSend.append('category', formData.category);
//       formDataToSend.append('status', formData.status);
      
//       if (formData.tags) {
//         const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
//         formDataToSend.append('tags', JSON.stringify(tagsArray));
//       }
      
//       if (formData.image) {
//         formDataToSend.append('image', formData.image);
//       }

//       await axiosInstance.put(`/admin/blogs/${blogId}`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       toast.success('Blog updated successfully!');
//       // ✅ Navigate back to where the user came from
//       navigate(backPath);
//     } catch (error) {
//       console.error('Error updating blog:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to update blog';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ✅ Handle back navigation
//   const handleBack = () => {
//     navigate(backPath);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-medium">Loading blog...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !formData.title) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
//           <div className="text-center">
//             <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//             <h3 className="mt-4 text-lg font-medium text-gray-900">{error}</h3>
//             <div className="mt-6 flex gap-4 justify-center">
//               <button
//                 onClick={handleBack}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//               >
//                 Go Back
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={handleBack}
//             className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 mb-4 font-medium transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             {backLabel}
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Edit Blog (Admin)</h1>
//           <p className="text-gray-600 mt-2">Update blog post as administrator</p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="Enter blog title"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Enter blog description"
//                 rows="3"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Content <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="content"
//                 value={formData.content}
//                 onChange={handleChange}
//                 placeholder="Enter full blog content"
//                 rows="12"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-2">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   required
//                 >
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-2">
//                   Status <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   required
//                 >
//                   <option value="draft">Draft</option>
//                   <option value="published">Published</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Tags (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="e.g. react, javascript, web development"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">
//                 Featured Image
//               </label>
//               {formData.currentImage && !formData.image && (
//                 <div className="mb-4">
//                   <img 
//                     src={formData.currentImage} 
//                     alt="Current" 
//                     className="h-48 w-full object-cover rounded-lg border border-gray-200" 
//                   />
//                   <p className="text-sm text-gray-600 mt-2">Current image</p>
//                 </div>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               {formData.image && (
//                 <p className="mt-2 text-sm text-green-600 font-medium">
//                   ✓ New image selected: {formData.image.name}
//                 </p>
//               )}
//               <p className="mt-1 text-sm text-gray-500">Max size: 5MB. Formats: JPG, PNG, GIF</p>
//             </div>

//             <div className="flex gap-4 pt-4 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
//               >
//                 {submitting ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Updating...
//                   </span>
//                 ) : 'Update Blog'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleBack}
//                 className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




// /pages/admin/AdminEditBlog.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export default function AdminEditBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const { blogId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
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

  // ✅ Determine where to go back based on location state or default to /admin/blogs
  const backPath = location.state?.from || '/admin/blogs';
  const backLabel = location.state?.from === '/my-blogs' || location.state?.from === '/dashboard' 
    ? 'Back to My Blogs' 
    : 'Back to Admin Blogs';

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
      setError('');
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      console.log('Fetching blog with ID:', blogId);

      const response = await axiosInstance.get(`/admin/blogs/${blogId}`);

      console.log('Blog data received:', response.data);

      const blog = response.data?.blog || response.data?.data || response.data;

      if (!blog || typeof blog !== 'object') {
        throw new Error('Invalid blog data received from server');
      }
      
      setFormData({
        title: blog.title || '',
        description: blog.description || '',
        content: blog.content || '',
        category: blog.category || 'Technology',
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
        image: null,
        currentImage: blog.image || blog.coverImage || blog.cover || null,
        status: blog.status || 'draft'
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load blog';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        setTimeout(() => navigate('/login'), 1500);
      } else if (error.response?.status === 404) {
        setTimeout(() => navigate(backPath), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

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
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        formDataToSend.append('tags', JSON.stringify(tagsArray));
      }
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await axiosInstance.put(`/admin/blogs/${blogId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Blog updated successfully!');
      // ✅ Navigate back to where the user came from
      navigate(backPath);
    } catch (error) {
      console.error('Error updating blog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update blog';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle back navigation
  const handleBack = () => {
    navigate(backPath);
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

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{error}</h3>
            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Go Back
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
            onClick={handleBack}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 mb-4 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog (Admin)</h1>
          <p className="text-gray-600 mt-2">Update blog post as administrator</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
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
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Featured Image
              </label>
              {formData.currentImage && !formData.image && (
                <div className="mb-4">
                  <img 
                    src={formData.currentImage} 
                    alt="Current" 
                    className="h-48 w-full object-cover rounded-lg border border-gray-200" 
                  />
                  <p className="text-sm text-gray-600 mt-2">Current image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {formData.image && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  ✓ New image selected: {formData.image.name}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">Max size: 5MB. Formats: JPG, PNG, GIF</p>
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
                onClick={handleBack}
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