import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
    const interval = setInterval(fetchBlogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get('/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setBlogs(response.data.data);
      } else if (Array.isArray(response.data.data)) {
        setBlogs(response.data.data);
      } else if (Array.isArray(response.data)) {
        setBlogs(response.data);
      } else {
        setBlogs([]);
      }
      setError('');
    } catch (error) {
      console.error('Error fetching blogs:', error);
      
      if (loading) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Unauthorized. Please login as admin.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response?.status === 404) {
          setError('Blogs endpoint not found. Please check backend API.');
        } else {
          setError(error.message || 'Failed to load blogs');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/admin/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBlogs(blogs.filter(blog => blog._id !== blogId));
      toast.success('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleStatus = async (blogId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(
        `/admin/blogs/${blogId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlogs(blogs.map(blog =>
        blog._id === blogId ? { ...blog, status: newStatus } : blog
      ));

      toast.success(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
    } catch (error) {
      console.error('Error updating blog status:', error);
      toast.error('Failed to update blog status');
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesFilter = filter === 'all' || blog.status === filter;
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
                onClick={fetchBlogs}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors group shadow-sm"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-gray-600 mt-1">View, edit, and manage all platform blogs</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                All ({blogs.length})
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'published'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Published ({blogs.filter(b => b.status === 'published').length})
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'draft'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Drafts ({blogs.filter(b => b.status === 'draft').length})
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!filteredBlogs || filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                      No blogs found
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-gray-900 max-w-[150px] truncate">
                          {blog.title || 'Untitled'}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 truncate max-w-[100px]">
                          {blog.author?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {blog.category || 'Other'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status || 'draft'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {blog.likes?.length || 0}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {blog.commentCount || 0}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {blog.views || 0}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/blog/${blog._id}`}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View Blog"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            to={`/edit-blog/${blog._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Blog"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(blog._id, blog.status)}
                            className={`p-1.5 rounded transition-colors ${
                              blog.status === 'published'
                                ? 'text-orange-600 hover:bg-orange-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={blog.status === 'published' ? 'Unpublish Blog' : 'Publish Blog'}
                          >
                            {blog.status === 'published' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id, blog.title)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Blog"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {blogs && blogs.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <p className="text-gray-500 text-sm font-medium mb-1">Total Blogs</p>
              <p className="text-3xl font-bold text-gray-900">{blogs.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <p className="text-gray-500 text-sm font-medium mb-1">Published</p>
              <p className="text-3xl font-bold text-green-600">
                {blogs.filter(b => b.status === 'published').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <p className="text-gray-500 text-sm font-medium mb-1">Drafts</p>
              <p className="text-3xl font-bold text-yellow-600">
                {blogs.filter(b => b.status === 'draft').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <p className="text-gray-500 text-sm font-medium mb-1">Total Views</p>
              <p className="text-3xl font-bold text-purple-600">
                {blogs.reduce((sum, b) => sum + (b.views || 0), 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}