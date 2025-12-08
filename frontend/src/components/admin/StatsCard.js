// src/components/admin/StatsCard.js
export default function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
