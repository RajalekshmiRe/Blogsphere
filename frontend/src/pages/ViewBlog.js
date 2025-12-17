import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import CommentSection from '../components/CommentSection';
import { toast } from 'react-toastify';

export default function ViewBlog() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // ✅ Suppress permission popups - INSIDE component
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.permissions) {
      try {
        navigator.permissions.query({ name: 'camera' }).catch(() => {});
        navigator.permissions.query({ name: 'microphone' }).catch(() => {});
      } catch (e) {
        // Silently ignore any permission errors
      }
    }
  }, []);

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/blogs/${blogId}`);
      
      const blogData = response.data.data || response.data.blog || response.data;
      setBlog(blogData);
      
      // Set likes
      const likes = blogData.likes || [];
      setLikesCount(likes.length);
      setLiked(currentUser._id && likes.includes(currentUser._id));
      
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog. It may have been deleted or you may not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!token) {
      toast.error('Please login to like this blog');
      return;
    }

    try {
      const response = await axiosInstance.post(`/blogs/${blogId}/like`);
      
      if (response.data.success) {
        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);
        toast.success(liked ? 'Blog unliked!' : 'Blog liked!');
      }
    } catch (err) {
      console.error('Error liking blog:', err);
      toast.error('Failed to like blog');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/blogs/${blogId}`);
      
      if (response.data.success) {
        toast.success('Blog deleted successfully!');
        navigate('/');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error('Failed to delete blog');
    }
  };

  const canEditOrDelete = () => {
    if (!currentUser._id) return false;
    return currentUser._id === blog?.author?._id || currentUser.role === 'admin';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          <p style={{ fontSize: '18px' }}>Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '18px', color: '#EF4444', marginBottom: '16px' }}>
            {error || 'Blog not found'}
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 24px',
              backgroundColor: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#F9FAFB',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Blog Header */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Category Badge */}
          {blog.category && (
            <span style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: '#667eea',
              color: '#fff',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {blog.category}
            </span>
          )}

          {/* Title */}
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            {blog.title}
          </h1>

          {/* Author & Date Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid #E5E7EB',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '600',
                fontSize: '18px'
              }}>
                {blog.author?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p style={{
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: 0
                }}>
                  {blog.author?.name || 'Unknown Author'}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Unknown date'}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginLeft: 'auto'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6B7280'
              }}>
                <span>👁️</span>
                <span>{blog.views || 0} views</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6B7280'
              }}>
                <span>❤️</span>
                <span>{likesCount} likes</span>
              </div>
            </div>
          </div>

          {/* Featured Image - FIXED for Cloudinary + Local */}
          {blog.featuredImage && (
            <div style={{
              marginBottom: '32px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <img
                src={
                  blog.featuredImage.startsWith('http') 
                    ? blog.featuredImage
                    : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${blog.featuredImage}`
                }
                alt={blog.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.error('Failed to load image:', blog.featuredImage);
                }}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}>
            <button
              onClick={handleLike}
              disabled={!token}
              style={{
                padding: '10px 24px',
                backgroundColor: liked ? '#EF4444' : '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: token ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '16px',
                opacity: !token ? 0.6 : 1
              }}
            >
              {liked ? '❤️ Liked' : '🤍 Like'}
            </button>

            {canEditOrDelete() && (
              <>
                <button
                  onClick={() => navigate(`/edit-blog/${blogId}`)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#10B981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#EF4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>

          {/* Blog Content */}
          <div style={{
            fontSize: '18px',
            lineHeight: '1.8',
            color: '#374151',
            whiteSpace: 'pre-wrap'
          }}>
            {blog.content}
          </div>

          {/* Tags Section */}
          {blog.tags && blog.tags.length > 0 && (
            <div style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #E5E7EB'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '12px',
                fontWeight: '600'
              }}>
                Tags:
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#F3F4F6',
                      color: '#4B5563',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comment Section */}
        <CommentSection blogId={blogId} />
      </div>
    </div>
  );
}