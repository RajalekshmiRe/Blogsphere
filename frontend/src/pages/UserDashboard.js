// frontend/src/pages/UserDashboard.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export default function UserDashboard() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalLikes: 0,
    totalViews: 0
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser?.role === 'admin'; // ✅ Added admin check

  useEffect(() => {
    if (!currentUser._id) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch only one endpoint → includes BOTH published + drafts
      const response = await axiosInstance.get(`/blogs/author/${currentUser._id}`);

      const allBlogs = response.data.blogs || response.data.data || [];

      // Filter for published and drafts
      const publishedBlogs = allBlogs.filter(b => b.status === "published");
      const draftBlogs = allBlogs.filter(b => b.status === "draft");

      // Calculate stats
      const totalLikes = allBlogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0);
      const totalViews = allBlogs.reduce((sum, b) => sum + (b.views || 0), 0);

      setStats({
        totalBlogs: allBlogs.length,
        publishedBlogs: publishedBlogs.length,
        draftBlogs: draftBlogs.length,
        totalLikes,
        totalViews
      });

      // Sort by creation date
      const sortedBlogs = [...allBlogs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRecentBlogs(sortedBlogs.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/blogs/${blogId}`);
      
      if (response.data.success) {
        toast.success('Blog deleted successfully!');
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #E5E7EB',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '10px', fontSize: '18px', color: '#6B7280' }}>Loading dashboard...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '8px'
          }}>
            Welcome, {currentUser.name}! 👋
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6B7280'
          }}>
            Here's an overview of your blogging activity
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #667eea'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Total Blogs
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1F2937',
              margin: 0
            }}>
              {stats.totalBlogs}
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #10B981'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Published
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#10B981',
              margin: 0
            }}>
              {stats.publishedBlogs}
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #F59E0B'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Drafts
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#F59E0B',
              margin: 0
            }}>
              {stats.draftBlogs}
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #EF4444'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Total Likes
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#EF4444',
              margin: 0
            }}>
              {stats.totalLikes}
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #8B5CF6'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Total Views
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#8B5CF6',
              margin: 0
            }}>
              {stats.totalViews}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Create Blog Card */}
          <Link to="/create-blog" style={{
            backgroundColor: '#667eea',
            color: '#fff',
            padding: '24px',
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              ✍️ Create New Blog
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Start writing your next amazing blog post
            </p>
          </Link>

          {/* My Blogs Card */}
          <Link to="/my-blogs" style={{
            backgroundColor: '#fff',
            color: '#1F2937',
            padding: '24px',
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px solid #E5E7EB',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#667eea'
            }}>
              📚 My Blogs
            </h3>
            <p style={{ margin: 0, color: '#6B7280' }}>
              View and manage all your blog posts
            </p>
          </Link>

          {/* Request Admin Access Card - Only show if user is NOT admin */}
          {currentUser.role !== 'admin' && (
            <Link to="/request-admin" style={{
              backgroundColor: '#fff',
              color: '#1F2937',
              padding: '24px',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #F59E0B',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '8px',
                color: '#F59E0B'
              }}>
                🔑 Request Admin Access
              </h3>
              <p style={{ margin: 0, color: '#6B7280' }}>
                Apply to become a platform administrator
              </p>
            </Link>
          )}

          {/* Admin Dashboard Card - Only show if user IS admin */}
          {currentUser.role === 'admin' && (
            <Link to="/admin" style={{
              backgroundColor: '#10B981',
              color: '#fff',
              padding: '24px',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                👑 Admin Dashboard
              </h3>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Manage users, blogs, and admin requests
              </p>
            </Link>
          )}
        </div>

        {/* Recent Blogs */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '24px'
          }}>
            Recent Blogs
          </h2>

          {recentBlogs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6B7280'
            }}>
              <p style={{ marginBottom: '16px' }}>
                You haven't created any blogs yet.
              </p>
              <Link to="/create-blog" style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Create your first blog →
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {recentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  style={{
                    padding: '20px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Featured Image Thumbnail */}
                  {blog.featuredImage && (
                    <img
                      src={`http://localhost:5000${blog.featuredImage}`}
                      alt={blog.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      style={{
                        width: '120px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        flexShrink: 0
                      }}
                    />
                  )}

                  <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1F2937',
                        marginBottom: '8px'
                      }}>
                        {blog.title}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          backgroundColor: blog.status === 'published' ? '#10B981' : '#F59E0B',
                          color: '#fff',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {blog.status}
                        </span>
                        
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                          👁️ {blog.views || 0} views
                        </span>
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                          ❤️ {blog.likes?.length || 0} likes
                        </span>
                      </div>

                      <p style={{
                        fontSize: '13px',
                        color: '#9CA3AF',
                        margin: 0
                      }}>
                        Created {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <Link
                        to={`/blog/${blog._id}`}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#667eea',
                          color: '#fff',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        View
                      </Link>
                      {/* ✅ FIXED: Admin routing for Edit button */}
                      <Link
                        to={isAdmin ? `/admin/edit-blog/${blog._id}` : `/edit-blog/${blog._id}`}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#10B981',
                          color: '#fff',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#EF4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}