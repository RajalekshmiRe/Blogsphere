import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function RequestAdminAccess() {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingRequests, setFetchingRequests] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [myRequests, setMyRequests] = useState([]);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setFetchingRequests(true);
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/users/my-admin-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Sort requests by date (newest first)
        const sortedRequests = (response.data.data || []).sort((a, b) => {
          const dateA = new Date(a.requestedAt || a.createdAt);
          const dateB = new Date(b.requestedAt || b.createdAt);
          return dateB - dateA;
        });

        setMyRequests(sortedRequests);
        
        // Check if there's a pending request
        const hasPending = sortedRequests.some(req => req.status === 'pending');
        setShowForm(!hasPending);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load your request history'
      });
    } finally {
      setFetchingRequests(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (reason.trim().length < 10) {
      setMessage({
        type: 'error',
        text: 'Please provide a detailed reason (minimum 10 characters)'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(
        '/users/request-admin',
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Admin access request submitted successfully! We will review it shortly.'
        });
        setReason('');
        setShowForm(false);
        await fetchMyRequests();
      }
    } catch (error) {
      console.error('Error requesting admin access:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Pending Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Approved' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Rejected' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <h2 className="text-3xl font-bold text-white mb-2">Request Admin Access</h2>
          <p className="text-indigo-100">Submit a request to become an administrator</p>
        </div>

        <div className="p-8">
          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <svg className="w-6 h-6 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <p className={`font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          )}

          {/* Request Form */}
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want admin access? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={6}
                  placeholder="Please provide a detailed explanation of why you need admin access. Include your experience, qualifications, and how you plan to contribute..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors"
                  required
                />
                <p className={`mt-2 text-sm ${reason.length >= 10 ? 'text-green-600' : 'text-gray-500'}`}>
                  {reason.length} / 10 characters minimum
                  {reason.length >= 10 && ' ✓'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Before submitting:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Provide specific reasons for your request</li>
                      <li>Mention any relevant experience or qualifications</li>
                      <li>Explain how you'll contribute to the platform</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || reason.trim().length < 10}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Request
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Pending</h3>
              <p className="text-gray-600 mb-4">
                You already have a pending admin request. Please wait for it to be reviewed.
              </p>
              <button
                onClick={() => fetchMyRequests()}
                disabled={fetchingRequests}
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
              >
                {fetchingRequests ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-indigo-600"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Status
                  </>
                )}
              </button>
            </div>
          )}

          {/* Previous Requests */}
          {fetchingRequests && myRequests.length === 0 ? (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading your request history...</span>
              </div>
            </div>
          ) : myRequests.length > 0 ? (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Your Request History</h3>
                <button
                  onClick={() => fetchMyRequests()}
                  disabled={fetchingRequests}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                >
                  {fetchingRequests ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <div className="space-y-4">
                {myRequests.map((request) => {
                  const badge = getStatusBadge(request.status);
                  return (
                    <div
                      key={request._id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {new Date(request.requestedAt || request.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="bg-white rounded p-3 mb-2">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Reason:</p>
                        <p className="text-gray-800 text-sm whitespace-pre-wrap">{request.reason}</p>
                      </div>
                      {(request.processedAt || request.respondedAt) && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            Processed on {new Date(request.processedAt || request.respondedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}