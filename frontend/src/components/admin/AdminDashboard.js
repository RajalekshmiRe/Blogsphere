import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminStats } from "../../api/adminApi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalComments: 0,
    publishedBlogs: 0,
    pendingRequests: 0,
    totalAdmins: 0,
    activeUsers: 0,
    bannedUsers: 0,
    draftBlogs: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const result = await getAdminStats();
      
      if (result.success && result.data) {
        setStats({
          totalUsers: result.data.totalUsers || 0,
          totalBlogs: result.data.totalBlogs || 0,
          totalComments: result.data.totalComments || 0,
          publishedBlogs: result.data.publishedBlogs || 0,
          pendingRequests: result.data.pendingRequests || 0,
          totalAdmins: result.data.totalAdmins || 0,
          activeUsers: result.data.activeUsers || 0,
          bannedUsers: result.data.bannedUsers || 0,
          draftBlogs: result.data.draftBlogs || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 128px)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-red-200">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={fetchStats}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Total Blogs",
      value: stats.totalBlogs,
      icon: "📝",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Published Blogs",
      value: stats.publishedBlogs,
      icon: "✅",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: "⏳",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      pulse: stats.pendingRequests > 0
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: "✨",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      title: "Total Admins",
      value: stats.totalAdmins,
      icon: "👑",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    }
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View, ban, or activate users",
      link: "/admin/users",
      icon: "👥",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Manage Blogs",
      description: "View, edit, and delete blogs",
      link: "/admin/blogs",
      icon: "📝",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Admin Requests",
      description: "Review admin access requests",
      link: "/admin/requests",
      icon: "📋",
      color: "from-purple-500 to-pink-500",
      badge: stats.pendingRequests > 0 ? stats.pendingRequests : null
    },
    {
      title: "Analytics",
      description: "View detailed statistics",
      link: "/admin/analytics",
      icon: "📈",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 ${
              stat.pulse ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.color} opacity-5 rounded-bl-full group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className="relative flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {action.title}
                    </h4>
                    {action.badge && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  <div className="flex items-center text-indigo-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Go to {action.title}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Health */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">Platform Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Active Users</p>
            <p className="text-3xl font-bold">{stats.activeUsers}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Published Content</p>
            <p className="text-3xl font-bold">{stats.publishedBlogs}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Pending Items</p>
            <p className="text-3xl font-bold">{stats.pendingRequests}</p>
          </div>
        </div>
      </div>
    </div>
  );
}