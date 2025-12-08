import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get('/admin/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setRequests(response.data.data);
      } else if (Array.isArray(response.data)) {
        setRequests(response.data);
      } else {
        setRequests([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Unauthorized access');
        navigate('/login');
      } else {
        toast.error('Failed to load requests');
      }
      setLoading(false);
    }
  };

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = requests;

    if (filter !== 'all') {
      filtered = requests.filter(req => req.status === filter);
    }

    return filtered.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;

      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
  }, [requests, filter]);

  const handleAction = async (requestId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) {
      return;
    }

    try {
      setProcessingId(requestId);
      const token = localStorage.getItem('token');
      
      const endpoint = action === 'accept' 
        ? `/admin/requests/${requestId}/approve`
        : `/admin/requests/${requestId}/reject`;

      await axiosInstance.post(
        endpoint,
        { response: `Your admin request has been ${action}ed` },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Request ${action}ed successfully!`);
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === requestId
            ? { ...req, status: action === 'accept' ? 'approved' : 'rejected', respondedAt: new Date().toISOString() }
            : req
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      const errorMsg = error.response?.data?.message || `Failed to ${action} request`;
      toast.error(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return styles[status] || styles.pending;
  };

  const getFilterButton = (filterValue, label) => {
    const isActive = filter === filterValue;
    const count = filterValue === 'all' 
      ? requests.length 
      : requests.filter(req => req.status === filterValue).length;

    return (
      <button
        onClick={() => setFilter(filterValue)}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          isActive
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        {label}
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
          isActive ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading requests...</p>
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
                title="Back to Admin Panel"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  Admin Access Requests
                </h1>
                <p className="text-gray-600">
                  Review and manage requests for admin access
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {getFilterButton('pending', 'Pending')}
            {getFilterButton('approved', 'Approved')}
            {getFilterButton('rejected', 'Rejected')}
            {getFilterButton('all', 'All Requests')}
          </div>
        </div>

        {filteredAndSortedRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600">
              No {filter !== 'all' ? filter : ''} admin access requests at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAndSortedRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {request.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {request.user?.name || 'Unknown User'}
                        </h3>
                        <p className="text-gray-600 truncate">{request.user?.email || 'No email'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(request.status)} capitalize`}>
                        {request.status}
                      </span>
                    </div>

                    {request.reason && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Reason:</p>
                        <p className="text-gray-800 whitespace-pre-wrap">{request.reason}</p>
                      </div>
                    )}

                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Submitted: {new Date(request.createdAt).toLocaleString()}</span>
                      </div>
                      {request.respondedAt && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Responded: {new Date(request.respondedAt).toLocaleString()}</span>
                        </div>
                      )}
                      {request.adminResponse && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-blue-700">Admin Response:</p>
                          <p className="text-sm text-blue-900 mt-1">{request.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-3 ml-4 shrink-0">
                      <button
                        onClick={() => handleAction(request._id, 'accept')}
                        disabled={processingId === request._id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium"
                      >
                        {processingId === request._id ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                            Processing...
                          </span>
                        ) : (
                          'Accept'
                        )}
                      </button>

                      <button
                        onClick={() => handleAction(request._id, 'reject')}
                        disabled={processingId === request._id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium"
                      >
                        {processingId === request._id ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                            Processing...
                          </span>
                        ) : (
                          'Reject'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}