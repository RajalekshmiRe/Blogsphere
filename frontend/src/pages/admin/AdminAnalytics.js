import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const navigate = useNavigate();

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axiosInstance.get(`/admin/analytics?timeRange=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Analytics error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [timeRange, navigate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Admin Panel</span>
          </button>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600">Analytics data is currently unavailable.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
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
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                  Reports & Analytics
                </h1>
                <p className="text-gray-600">
                  Comprehensive platform statistics and insights
                </p>
              </div>
            </div>

            <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
                { value: 'all', label: 'All Time' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                    timeRange === value
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                {timeRange !== 'all' && stats.newUsers > 0 && (
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    +{stats.newUsers} new
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium mb-1 opacity-90">Total Users</h3>
              <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                {timeRange !== 'all' && stats.newBlogs > 0 && (
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    +{stats.newBlogs} new
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium mb-1 opacity-90">Total Blogs</h3>
              <p className="text-3xl font-bold">{stats.totalBlogs || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Soon</span>
              </div>
              <h3 className="text-sm font-medium mb-1 opacity-90">Total Comments</h3>
              <p className="text-3xl font-bold">{stats.totalComments || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Soon</span>
              </div>
              <h3 className="text-sm font-medium mb-1 opacity-90">Total Views</h3>
              <p className="text-3xl font-bold">{stats.totalViews || '0'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                <h3 className="text-xl font-bold text-gray-900">Platform Growth</h3>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <span>Users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span>Blogs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-pink-600 rounded-full"></div>
                    <span>Comments</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.growthData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                  <Line type="monotone" dataKey="blogs" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                  <Line type="monotone" dataKey="comments" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Blog Categories</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categoryData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(stats.categoryData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">User Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-semibold text-gray-900">{stats.activeUsers || '0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Users (period)</span>
                  <span className="font-semibold text-gray-900">{stats.newUsers || '0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Banned Users</span>
                  <span className="font-semibold text-red-600">{stats.bannedUsers || '0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Admin Users</span>
                  <span className="font-semibold text-indigo-600">{stats.adminUsers || '0'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Content Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Published Blogs</span>
                  <span className="font-semibold text-gray-900">{stats.publishedBlogs || '0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Draft Blogs</span>
                  <span className="font-semibold text-gray-900">{stats.draftBlogs || '0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Comments/Blog</span>
                  <span className="font-semibold text-gray-900">
                    {stats.totalBlogs && stats.totalComments 
                      ? (stats.totalComments / stats.totalBlogs).toFixed(1)
                      : '0'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Categories</span>
                  <span className="font-semibold text-gray-900">{stats.totalCategories || '0'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Likes</span>
                  <span className="font-semibold text-gray-400">{stats.totalLikes || 'Coming Soon'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shares</span>
                  <span className="font-semibold text-gray-400">{stats.totalShares || 'Coming Soon'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Read Time</span>
                  <span className="font-semibold text-gray-400">{stats.avgReadTime || 'Coming Soon'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bounce Rate</span>
                  <span className="font-semibold text-gray-400">{stats.bounceRate || 'Coming Soon'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}