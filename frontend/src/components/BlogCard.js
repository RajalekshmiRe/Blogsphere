import { Link } from 'react-router-dom';

export default function BlogCard({ blog }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
    >
      {/* Card Content */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category Badge */}
        {blog.category && (
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: '#667eea',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '12px',
            alignSelf: 'flex-start'
          }}>
            {blog.category}
          </span>
        )}

        {/* Title */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '12px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4'
        }}>
          {blog.title}
        </h3>

        {/* Content Preview */}
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '16px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.6',
          flex: 1
        }}>
          {blog.content}
        </p>

        {/* Author & Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid #E5E7EB',
          marginTop: 'auto'
        }}>
          {/* Author */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {blog.author?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                {blog.author?.name || 'Unknown'}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                margin: 0
              }}>
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Unknown date'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '12px',
            fontSize: '14px',
            color: '#6B7280'
          }}>
            <span title="Views">👁️ {blog.views || 0}</span>
            <span title="Likes">❤️ {blog.likes?.length || 0}</span>
          </div>
        </div>

        {/* Read More Button */}
        <Link
          to={`/blog/${blog._id}`}
          style={{
            display: 'block',
            marginTop: '16px',
            padding: '10px',
            backgroundColor: '#667eea',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5568d3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}