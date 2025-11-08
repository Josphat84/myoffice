// frontend/components/maintenance/StatCard.js
"use client";

export default function StatCard({ title, value, icon: Icon, trend, color = "slate", className = "" }) {
  const colorClasses = {
    slate: "bg-slate-50 border-slate-200 text-slate-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700"
  };

  const iconColorClasses = {
    slate: "text-slate-600",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    amber: "text-amber-600",
    purple: "text-purple-600"
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconColorClasses[color]} bg-white bg-opacity-50`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}