import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export default function CommentSection({ blogId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingComments, setFetchingComments] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch comments
  const fetchComments = async () => {
    try {
      setFetchingComments(true);
      const res = await axiosInstance.get(`/comments/blog/${blogId}`);
      
      console.log('Fetched comments:', res.data); // Debug log
      
      if (res.data.success) {
        setComments(res.data.comments || []);
      } else if (Array.isArray(res.data)) {
        setComments(res.data);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
    } finally {
      setFetchingComments(false);
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (!currentUser._id) {
      toast.error('Please login to comment');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/comments', { 
        blogId, 
        content: content.trim() 
      });
      
      console.log('Add comment response:', res.data); // Debug log
      
      if (res.data.success) {
        toast.success('Comment added successfully!');
        
        // Use the populated comment from backend
        const newComment = res.data.comment;
        
        setComments((prev) => [newComment, ...prev]);
        setContent('');
      } else {
        toast.error(res.data.message || 'Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/comments/${id}`);
      
      if (res.data.success) {
        toast.success('Comment deleted successfully!');
        setComments((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(res.data.message || 'Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  // Check if current user can delete a comment
  const canDeleteComment = (comment) => {
    if (!currentUser._id) return false;
    return (
      currentUser._id === comment.author?._id || 
      currentUser.role === 'admin'
    );
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '24px',
      marginTop: '32px'
    }}>
      <h3 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '24px',
        color: '#1F2937'
      }}>
        Add Comment
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleAddComment} style={{ marginBottom: '32px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          disabled={loading || !currentUser._id}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '16px',
            resize: 'vertical',
            minHeight: '100px',
            boxSizing: 'border-box'
          }}
          rows={4}
        />
        <button
          type="submit"
          disabled={loading || !currentUser._id || !content.trim()}
          style={{
            marginTop: '12px',
            padding: '10px 24px',
            backgroundColor: loading || !content.trim() ? '#9CA3AF' : '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || !content.trim() ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
        
        {!currentUser._id && (
          <p style={{
            marginTop: '12px',
            color: '#6B7280',
            fontSize: '14px'
          }}>
            Please login to add comments
          </p>
        )}
      </form>

      {/* Comments List */}
      <div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '24px',
          color: '#1F2937'
        }}>
          Comments
        </h3>

        {fetchingComments ? (
          <p style={{ color: '#6B7280', padding: '20px 0' }}>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p style={{ 
            color: '#6B7280', 
            padding: '20px 0',
            textAlign: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px'
          }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {comments.map((comment) => (
              <div
                key={comment._id}
                style={{
                  padding: '16px',
                  backgroundColor: '#F9FAFB',
                  borderLeft: '4px solid #667eea',
                  borderRadius: '8px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <p style={{
                      fontWeight: '600',
                      color: '#1F2937',
                      marginBottom: '4px'
                    }}>
                      {comment.author?.name || 'Anonymous User'}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280'
                    }}>
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Invalid Date'}
                    </p>
                  </div>
                  
                  {canDeleteComment(comment) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      style={{
                        color: '#EF4444',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 8px'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                
                <p style={{
                  color: '#374151',
                  lineHeight: '1.6'
                }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}