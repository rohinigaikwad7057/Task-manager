import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import useTasks from "../Fetures/Hooks/useTasks";

const LandingDashboard = () => {
  const { task } = useTasks();

  // 📊 Stats
  const total = task.length;
  const todo = task.filter((t) => t.status === "todo").length;
  const progress = task.filter((t) => t.status === "progress").length;
  const completed = task.filter((t) => t.status === "completed").length;

  const highPriority = task.filter((t) => t.priority === "high").length;

  const completionRate = total
    ? Math.round((completed / total) * 100)
    : 0;

  const recentTasks = [...task].slice(-5).reverse();

  // 📊 Chart Data
  const statusData = [
    { name: "Todo", value: todo },
    { name: "In Progress", value: progress },
    { name: "Completed", value: completed },
  ];

  const priorityData = [
    { name: "Low", value: task.filter((t) => t.priority === "low").length },
    { name: "Medium", value: task.filter((t) => t.priority === "medium").length },
    { name: "High", value: task.filter((t) => t.priority === "high").length },
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-100 min-h-screen">

      {/* 🟢 Welcome Banner */}
      <div className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow">
        <h2 className="text-lg md:text-xl font-semibold">
          Welcome back 👋
        </h2>
        <p className="text-sm mt-1 opacity-90">
          You have {todo + progress} pending and {highPriority} high priority tasks
        </p>
      </div>

      {/* 🔥 Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

  {[
    { label: "Total", value: total },
    { label: "Todo", value: todo },
    { label: "In Progress", value: progress },
    { label: "Completed", value: completed },
  ].map((item, i) => (
    <div
      key={i}
      className="bg-white p-4 rounded-xl border hover:shadow-md transition"
    >
      <p className="text-xs text-gray-500">{item.label}</p>
      <h2 className="text-2xl font-semibold mt-1">
        {item.value}
      </h2>
    </div>
  ))}

</div>

      {/* 📊 Charts Section */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* PIE CHART */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-sm text-gray-500 mb-3">
            Task Distribution
          </h3>

          {total === 0 ? (
            <p className="text-gray-400 text-sm">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  outerRadius={80}
                  label
                  isAnimationActive
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-sm text-gray-500 mb-3">
            Priority Breakdown
          </h3>

          {total === 0 ? (
            <p className="text-gray-400 text-sm">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* 📊 Extra Insights */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Completion Rate */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-sm text-gray-500 mb-2">Completion Rate</h3>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>

          <p className="text-sm mt-2 text-gray-600">
            {completionRate}% completed
          </p>
        </div>

        {/* High Priority */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-sm text-gray-500">High Priority Tasks</h3>
          <p className="text-2xl font-semibold text-red-500 mt-2">
            {highPriority}
          </p>
        </div>

      </div>

      {/* 📌 Recent Tasks */}
      <div className="bg-white p-4 rounded-xl shadow-sm">

        <h3 className="text-md font-semibold mb-3">
          Recent Tasks
        </h3>

        {recentTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks yet</p>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-sm text-gray-700">
                  {t.title}
                </span>

                <span className="text-xs text-gray-400 capitalize">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default LandingDashboard;