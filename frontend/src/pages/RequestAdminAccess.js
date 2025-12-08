// frontend/src/pages/RequestAdminAccess.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export default function RequestAdminAccess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [requestStatus, setRequestStatus] = useState(null);
  const [reason, setReason] = useState('');
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!currentUser._id) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    // Check if user is already admin
    if (currentUser.role === 'admin') {
      toast.info('You already have admin access!');
      navigate('/admin');
      return;
    }

    checkRequestStatus();
  }, []);

  const checkRequestStatus = async () => {
    try {
      setCheckingStatus(true);
      const response = await axiosInstance.get('/admin-requests/my-admin-request');
      
      if (response.data.request) {
        setRequestStatus(response.data.request);
      }
    } catch (error) {
      // 404 means no request found - that's okay
      if (error.response?.status !== 404) {
        console.error('Error checking request status:', error);
      }
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error('Please provide a reason for your request');
      return;
    }

    if (reason.trim().length < 20) {
      toast.error('Reason must be at least 20 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/admin-requests/request-admin', {
        reason: reason.trim()
      });

      toast.success('Admin access request submitted successfully!');
      setRequestStatus(response.data.request);
      setReason('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit request';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!window.confirm('Are you sure you want to cancel your request?')) {
      return;
    }

    try {
      await axiosInstance.delete('/admin-requests/cancel-request');
      toast.success('Request cancelled successfully');
      setRequestStatus(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to cancel request';
      toast.error(errorMsg);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  if (checkingStatus) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '80vh', flexDirection: 'column'
      }}>
        <div style={{
          width: '50px', height: '50px', border: '4px solid #E5E7EB',
          borderTop: '4px solid #667eea', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '10px', color: '#6B7280' }}>Checking status...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '20px', position: 'relative' }}>
      {/* Back Arrow */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          position: 'fixed', top: '80px', left: '20px',
          width: '40px', height: '40px', borderRadius: '50%',
          backgroundColor: '#fff', border: '2px solid #667eea',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000, transition: 'all 0.3s ease'
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>
            🔑 Request Admin Access
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>
            Submit a request to become an admin and manage the platform
          </p>
        </div>

        {/* Existing Request Status */}
        {requestStatus && (
          <div style={{
            backgroundColor: '#fff', padding: '32px', borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '32px',
            border: `3px solid ${getStatusColor(requestStatus.status)}`
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {getStatusIcon(requestStatus.status)}
              </div>
              <h2 style={{
                fontSize: '24px', fontWeight: '700',
                color: getStatusColor(requestStatus.status),
                textTransform: 'capitalize', marginBottom: '8px'
              }}>
                Request {requestStatus.status}
              </h2>
            </div>

            <div style={{
              backgroundColor: '#F9FAFB', padding: '20px',
              borderRadius: '8px', marginBottom: '16px'
            }}>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                <strong>Your Reason:</strong>
              </p>
              <p style={{ fontSize: '16px', color: '#1F2937' }}>
                {requestStatus.reason}
              </p>
            </div>

            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Submitted:</strong> {new Date(requestStatus.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
              {requestStatus.respondedAt && (
                <p>
                  <strong>Responded:</strong> {new Date(requestStatus.respondedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              )}
            </div>

            {requestStatus.adminResponse && (
              <div style={{
                marginTop: '16px', padding: '16px',
                backgroundColor: '#FEF3C7', borderRadius: '8px',
                borderLeft: '4px solid #F59E0B'
              }}>
                <p style={{ fontSize: '14px', color: '#92400E', marginBottom: '4px' }}>
                  <strong>Admin Response:</strong>
                </p>
                <p style={{ fontSize: '14px', color: '#78350F' }}>
                  {requestStatus.adminResponse}
                </p>
              </div>
            )}

            {requestStatus.status === 'pending' && (
              <div style={{ marginTop: '20px' }}>
                <div style={{
                  padding: '16px', backgroundColor: '#DBEAFE',
                  borderRadius: '8px', textAlign: 'center', marginBottom: '12px'
                }}>
                  <p style={{ fontSize: '14px', color: '#1E40AF', margin: 0 }}>
                    ⏰ Your request is being reviewed. You'll be notified once a decision is made.
                  </p>
                </div>
                <button
                  onClick={handleCancelRequest}
                  style={{
                    width: '100%', padding: '12px',
                    backgroundColor: '#EF4444', color: '#fff',
                    border: 'none', borderRadius: '8px',
                    fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Cancel Request
                </button>
              </div>
            )}

            {requestStatus.status === 'approved' && (
              <div style={{
                marginTop: '20px', padding: '16px',
                backgroundColor: '#D1FAE5', borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '14px', color: '#065F46', marginBottom: '12px' }}>
                  🎉 Congratulations! Please log out and log back in to access admin features.
                </p>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                  }}
                  style={{
                    padding: '10px 24px', backgroundColor: '#10B981',
                    color: '#fff', border: 'none', borderRadius: '6px',
                    fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Logout & Login Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Request Form - Only show if no pending/approved request */}
        {(!requestStatus || requestStatus.status === 'rejected') && (
          <div style={{
            backgroundColor: '#fff', padding: '32px',
            borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '24px', fontWeight: '700',
              color: '#1F2937', marginBottom: '24px'
            }}>
              {requestStatus?.status === 'rejected' ? 'Submit New Request' : 'Submit Request'}
            </h2>

            <form onSubmit={handleSubmitRequest}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block', marginBottom: '8px',
                  fontWeight: '600', color: '#374151'
                }}>
                  Why do you want admin access? *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you need admin access and how you plan to contribute to the platform... (minimum 20 characters)"
                  required
                  style={{
                    width: '100%', padding: '12px',
                    border: '1px solid #D1D5DB', borderRadius: '8px',
                    fontSize: '16px', minHeight: '150px',
                    fontFamily: 'inherit', resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
                <small style={{ display: 'block', marginTop: '8px', color: '#6B7280', fontSize: '14px' }}>
                  {reason.length}/1000 characters (minimum 20 required)
                </small>
              </div>

              <button
                type="submit"
                disabled={loading || reason.length < 20}
                style={{
                  width: '100%', padding: '14px',
                  backgroundColor: loading || reason.length < 20 ? '#D1D5DB' : '#667eea',
                  color: '#fff', border: 'none',
                  borderRadius: '8px', fontSize: '16px',
                  fontWeight: '600', cursor: loading || reason.length < 20 ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => {
                  if (!loading && reason.length >= 20) e.target.style.backgroundColor = '#5568d3';
                }}
                onMouseOut={(e) => {
                  if (!loading && reason.length >= 20) e.target.style.backgroundColor = '#667eea';
                }}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        {/* Info Box */}
        <div style={{
          marginTop: '32px', padding: '20px',
          backgroundColor: '#FEF3C7', borderRadius: '8px',
          border: '1px solid #FCD34D'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>
            ℹ️ Important Information
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#78350F', fontSize: '14px' }}>
            <li style={{ marginBottom: '8px' }}>Admin requests are reviewed manually by existing administrators</li>
            <li style={{ marginBottom: '8px' }}>You can only have one active request at a time</li>
            <li style={{ marginBottom: '8px' }}>If rejected, you can submit a new request with improvements</li>
            <li style={{ marginBottom: '8px' }}>Pending requests can be cancelled at any time</li>
            <li>Once approved, you'll need to log out and log back in to access admin features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}