import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export default function ExportReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const [statsRes, usersRes, blogsRes] = await Promise.all([
        axiosInstance.get('/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axiosInstance.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axiosInstance.get('/admin/blogs', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats({
        ...statsRes.data.data,
        users: usersRes.data.data || [],
        blogs: blogsRes.data.data || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportUsers = () => {
    if (!stats?.users) return;
    
    setExporting(true);
    const headers = ['Name', 'Email', 'Role', 'Status', 'Joined Date'];
    const rows = stats.users.map(user => [
      user.name || '',
      user.email || '',
      user.role || 'user',
      user.isActive ? 'Active' : 'Banned',
      new Date(user.createdAt).toLocaleDateString()
    ]);
    
    exportToCSV([headers, ...rows], `users_report_${Date.now()}.csv`);
    setExporting(false);
    toast.success('Users report exported successfully!');
  };

  const handleExportBlogs = () => {
    if (!stats?.blogs) return;
    
    setExporting(true);
    const headers = ['Title', 'Author', 'Category', 'Status', 'Likes', 'Views', 'Created Date'];
    const rows = stats.blogs.map(blog => [
      (blog.title || '').replace(/,/g, ';'),
      blog.author?.name || '',
      blog.category || 'Other',
      blog.status || 'draft',
      blog.likes?.length || 0,
      blog.views || 0,
      new Date(blog.createdAt).toLocaleDateString()
    ]);
    
    exportToCSV([headers, ...rows], `blogs_report_${Date.now()}.csv`);
    setExporting(false);
    toast.success('Blogs report exported successfully!');
  };

  const handleExportSummary = () => {
    if (!stats) return;
    
    setExporting(true);
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Users', stats.totalUsers || 0],
      ['Active Users', stats.activeUsers || 0],
      ['Banned Users', stats.bannedUsers || 0],
      ['Admin Users', stats.totalAdmins || 0],
      ['Total Blogs', stats.totalBlogs || 0],
      ['Published Blogs', stats.publishedBlogs || 0],
      ['Draft Blogs', stats.draftBlogs || 0],
      ['Total Comments', stats.totalComments || 0],
      ['Pending Admin Requests', stats.pendingRequests || 0],
      ['Report Generated', new Date().toLocaleString()]
    ];
    
    exportToCSV([headers, ...rows], `summary_report_${Date.now()}.csv`);
    setExporting(false);
    toast.success('Summary report exported successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors group shadow-sm"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                Export Reports
              </h1>
              <p className="text-gray-600">
                Download platform data in CSV format
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Users Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Export all user data including names, emails, roles, and status
            </p>
            <button
              onClick={handleExportUsers}
              disabled={exporting || !stats?.users?.length}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {exporting ? 'Exporting...' : 'Export Users CSV'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.totalBlogs || 0}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Blogs Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Export all blog data including titles, authors, categories, and engagement metrics
            </p>
            <button
              onClick={handleExportBlogs}
              disabled={exporting || !stats?.blogs?.length}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {exporting ? 'Exporting...' : 'Export Blogs CSV'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Summary Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Export a comprehensive summary of all platform statistics and metrics
            </p>
            <button
              onClick={handleExportSummary}
              disabled={exporting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {exporting ? 'Exporting...' : 'Export Summary CSV'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Blogs</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.totalBlogs || 0}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats?.publishedBlogs || 0}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
              <p className="text-2xl font-bold text-orange-600">{stats?.pendingRequests || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}