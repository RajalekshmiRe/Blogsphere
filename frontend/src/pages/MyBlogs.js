// frontend/src/pages/MyBlogs.js
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser?.role === 'admin';

  const fetchMyBlogs = useCallback(async () => {
    if (!currentUser?._id) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/blogs/author/${currentUser._id}`);

      let blogsData = [];
      if (Array.isArray(response.data.blogs)) blogsData = response.data.blogs;
      else if (Array.isArray(response.data.data)) blogsData = response.data.data;
      else if (Array.isArray(response.data)) blogsData = response.data;

      setBlogs(blogsData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load your blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (!currentUser?._id) {
      toast.error('Please login to view your blogs');
      navigate('/login');
      return;
    }
    fetchMyBlogs();
  }, [currentUser?._id, navigate, fetchMyBlogs]);

  const handleDelete = async (blogId, blogTitle) => {
    if (!window.confirm(`Delete "${blogTitle}"?`)) return;

    try {
      const response = await axiosInstance.delete(`/blogs/${blogId}`);
      if (response?.data?.success || response.status === 200) {
        toast.success('Blog deleted successfully!');
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    }
  };

  // ✅ Navigate to edit with state to track origin
  const handleEdit = (blogId) => {
    if (isAdmin) {
      navigate(`/admin/edit-blog/${blogId}`, { 
        state: { from: '/my-blogs' } 
      });
    } else {
      navigate(`/edit-blog/${blogId}`);
    }
  };

  const totalBlogs = blogs.length;
  const publishedCount = blogs.filter((b) => b.status === 'published').length;
  const draftCount = blogs.filter((b) => b.status === 'draft').length;
  const filteredBlogs = blogs.filter((b) => (filter === 'all' ? true : b.status === filter));

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{
          width: '50px', height: '50px', border: '4px solid #E5E7EB',
          borderTop: '4px solid #667eea', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '10px', color: '#6B7280' }}>Loading your blogs...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
          alignItems: 'center', marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937' }}>My Blogs 📚</h1>
            <p style={{ color: '#6B7280' }}>Manage all your blog posts</p>
          </div>

          <Link to="/create-blog" style={{
            padding: '12px 24px', backgroundColor: '#667eea', color: '#fff',
            borderRadius: '8px', textDecoration: 'none', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            ✍️ Create New Blog
          </Link>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('all')} style={{
            padding: '10px 20px',
            backgroundColor: filter === 'all' ? '#667eea' : '#fff',
            color: filter === 'all' ? '#fff' : '#6B7280',
            borderRadius: '8px', border: filter === 'all' ? 'none' : '1px solid #E5E7EB',
            cursor: 'pointer', fontWeight: '600'
          }}>
            All ({totalBlogs})
          </button>

          <button onClick={() => setFilter('published')} style={{
            padding: '10px 20px',
            backgroundColor: filter === 'published' ? '#667eea' : '#fff',
            color: filter === 'published' ? '#fff' : '#6B7280',
            borderRadius: '8px', border: filter === 'published' ? 'none' : '1px solid #E5E7EB',
            cursor: 'pointer', fontWeight: '600'
          }}>
            Published ({publishedCount})
          </button>

          <button onClick={() => setFilter('draft')} style={{
            padding: '10px 20px',
            backgroundColor: filter === 'draft' ? '#667eea' : '#fff',
            color: filter === 'draft' ? '#fff' : '#6B7280',
            borderRadius: '8px', border: filter === 'draft' ? 'none' : '1px solid #E5E7EB',
            cursor: 'pointer', fontWeight: '600'
          }}>
            Draft ({draftCount})
          </button>
        </div>

        {/* No Blogs */}
        {filteredBlogs.length === 0 && (
          <div style={{
            backgroundColor: '#fff', padding: '60px 20px', textAlign: 'center',
            borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2>📝 No {filter} blogs found.</h2>
            <Link to="/create-blog" style={{ color: '#667eea', fontWeight: '600', fontSize: '16px', textDecoration: 'none' }}>
              Create your first blog →
            </Link>
          </div>
        )}

        {/* Blog Cards */}
        {filteredBlogs.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {filteredBlogs.map((blog) => (
              <article key={blog._id} style={{
                backgroundColor: '#fff', padding: '24px',
                borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: blog.status === 'published' ? '#10B981' : '#F59E0B',
                    color: '#fff', borderRadius: '16px', fontSize: '12px'
                  }}>
                    {blog.status === 'published' ? '✅ Published' : '📝 Draft'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{blog.category}</span>
                </div>

                <h3 style={{ marginTop: '12px', fontSize: '20px', fontWeight: '700' }}>{blog.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '14px', margin: '10px 0' }}>
                  {blog.content.slice(0, 120)}...
                </p>

                <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </p>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <Link to={`/blog/${blog._id}`} style={{
                    flex: 1, backgroundColor: '#667eea', color: '#fff',
                    padding: '10px', borderRadius: '6px', textAlign: 'center', textDecoration: 'none'
                  }}>
                    View
                  </Link>

                  {/* ✅ FIXED: Use button with handleEdit to pass state */}
                  <button 
                    onClick={() => handleEdit(blog._id)}
                    style={{
                      flex: 1, backgroundColor: '#10B981', color: '#fff',
                      padding: '10px', borderRadius: '6px', textAlign: 'center',
                      border: 'none', cursor: 'pointer', fontWeight: '400'
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDelete(blog._id, blog.title)} style={{
                    flex: 1, backgroundColor: '#EF4444', color: '#fff',
                    padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer'
                  }}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}