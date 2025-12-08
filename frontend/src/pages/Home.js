import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import BlogCard from '../components/BlogCard';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('token');

  const categories = [
    'All',
    'Technology',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Business',
    'Entertainment'
  ];

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let url = '/blogs?status=published';
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      if (selectedCategory !== 'All') {
        url += `&category=${selectedCategory}`;
      }
      
      url += `&page=${currentPage}`;

      const response = await axiosInstance.get(url);
      
      setBlogs(response.data.data || response.data.blogs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          margin: '0 0 16px 0'
        }}>
          Welcome to BlogSphere 🌍
        </h1>
        <p style={{
          fontSize: '20px',
          margin: '0 0 32px 0',
          opacity: 0.9
        }}>
          Share your thoughts, stories, and experiences with the world.
        </p>
        
        {token ? (
          <Link to="/create-blog" style={{
            display: 'inline-block',
            backgroundColor: '#fff',
            color: '#667eea',
            padding: '12px 32px',
            borderRadius: '24px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '16px'
          }}>
            Start Writing ✍️
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{
              display: 'inline-block',
              backgroundColor: '#fff',
              color: '#667eea',
              padding: '12px 32px',
              borderRadius: '24px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '16px'
            }}>
              Login
            </Link>
            <Link to="/register" style={{
              display: 'inline-block',
              backgroundColor: 'transparent',
              color: '#fff',
              padding: '12px 32px',
              borderRadius: '24px',
              border: '2px solid #fff',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '16px'
            }}>
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Search & Filter Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="🔍 Search blogs..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxSizing: 'border-box',
              maxWidth: '600px',
              margin: '0 auto',
              display: 'block'
            }}
          />
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === category ? '#667eea' : '#fff',
                color: selectedCategory === category ? '#fff' : '#6B7280',
                border: selectedCategory === category ? 'none' : '1px solid #E5E7EB',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1F2937',
            margin: '0 0 8px 0'
          }}>
            Latest Blogs
          </h2>
          <p style={{
            color: '#6B7280',
            margin: 0
          }}>
            Discover inspiring stories from our community
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6B7280'
          }}>
            Loading blogs...
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#fff',
            borderRadius: '8px'
          }}>
            <p style={{
              fontSize: '18px',
              color: '#6B7280',
              margin: '0 0 16px 0'
            }}>
              No blogs found. Be the first to write one! 📝
            </p>
            {token && (
              <Link to="/create-blog" style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Create Blog →
              </Link>
            )}
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && blogs.length > 0 && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === 1 ? '#F3F4F6' : '#667eea',
                    color: currentPage === 1 ? '#9CA3AF' : '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: currentPage === page ? '#667eea' : '#fff',
                      color: currentPage === page ? '#fff' : '#6B7280',
                      border: currentPage === page ? 'none' : '1px solid #E5E7EB',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === totalPages ? '#F3F4F6' : '#667eea',
                    color: currentPage === totalPages ? '#9CA3AF' : '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

