"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const API_BASE = "/api/engineering-reports";

export default function EngineeringDashboard() {
  // =========================
  // STATE
  // =========================
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("report_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Modal editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    report_date: "",
    engineer_name: "",
    supervisor: "",
    shift: "",
    overview: "",
    maintenance_completed: "",
    breakdowns: "",
    spares_used: "",
    safety_notes: "",
    availability: "",
    equipment_availability: "{}",
  });

  // =========================
  // FETCH REPORTS
  // =========================
  const fetchReports = async () => {
    const res = await fetch(API_BASE);
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // =========================
  // SEARCH & SORT
  // =========================
  useEffect(() => {
    let filtered = [...reports];
    if (searchTerm) {
      filtered = filtered.filter((r) =>
        [r.engineer_name, r.overview, r.breakdowns, r.safety_notes]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      if (sortField === "availability") {
        return sortOrder === "asc"
          ? (a[sortField] || 0) - (b[sortField] || 0)
          : (b[sortField] || 0) - (a[sortField] || 0);
      } else {
        return sortOrder === "asc"
          ? a[sortField]?.localeCompare(b[sortField])
          : b[sortField]?.localeCompare(a[sortField]);
      }
    });
    setFilteredReports(filtered);
    setPage(1);
  }, [reports, searchTerm, sortField, sortOrder]);

  // =========================
  // FORM HANDLERS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      availability: parseFloat(form.availability),
      equipment_availability: JSON.parse(form.equipment_availability || "{}"),
    };
    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? "PATCH" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error submitting report");
      alert(editingId ? "Report updated!" : "Report created!");
      setForm({
        report_date: "",
        engineer_name: "",
        supervisor: "",
        shift: "",
        overview: "",
        maintenance_completed: "",
        breakdowns: "",
        spares_used: "",
        safety_notes: "",
        availability: "",
        equipment_availability: "{}",
      });
      setEditingId(null);
      setModalOpen(false);
      fetchReports();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (report) => {
    setForm({
      ...report,
      availability: report.availability || "",
      equipment_availability: JSON.stringify(report.equipment_availability || {}),
    });
    setEditingId(report.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    alert("Report deleted!");
    fetchReports();
  };

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(filteredReports.length / PAGE_SIZE);
  const paginatedReports = filteredReports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // =========================
  // KPI CALCULATIONS
  // =========================
  const averageAvailability = reports.length
    ? (reports.reduce((a, r) => a + (r.availability || 0), 0) / reports.length).toFixed(2)
    : 0;
  const totalBreakdowns = reports.reduce((a, r) => a + (r.breakdowns ? 1 : 0), 0);

  // =========================
  // CHARTS DATA
  // =========================
  const lineData = reports.map((r) => ({ date: r.report_date, availability: r.availability || 0 }));
  const breakdownsByEngineer = reports.reduce((acc, r) => {
    if (r.breakdowns) acc[r.engineer_name] = (acc[r.engineer_name] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(breakdownsByEngineer).map(([engineer, count]) => ({ engineer, count }));
  const equipmentPieData = [];
  reports.forEach((r) => {
    for (let eq in r.equipment_availability || {}) {
      const val = r.equipment_availability[eq] || 0;
      equipmentPieData.push({ name: eq, value: val });
    }
  });
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DD0", "#FF6666"];

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4">Engineering Dashboard</h1>

      {/* KPI Panel */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded shadow text-center">
          <div className="text-gray-500">Average Availability</div>
          <div className="text-xl font-bold">{averageAvailability}%</div>
        </div>
        <div className="p-4 bg-blue-100 rounded shadow text-center">
          <div className="text-gray-500">Total Reports</div>
          <div className="text-xl font-bold">{reports.length}</div>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow text-center">
          <div className="text-gray-500">Breakdowns</div>
          <div className="text-xl font-bold">{totalBreakdowns}</div>
        </div>
        <div className="p-4 bg-purple-100 rounded shadow text-center">
          <div className="text-gray-500">Equipment Entries</div>
          <div className="text-xl font-bold">{equipmentPieData.length}</div>
        </div>
      </div>

      {/* =========================
          FORM
      ========================= */}
      <div className="max-w-3xl mb-6 p-6 bg-gray-50 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Report" : "New Engineering Report"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="date" name="report_date" value={form.report_date} onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="engineer_name" placeholder="Engineer Name" value={form.engineer_name} onChange={handleChange} required className="p-2 border rounded" />
            <input type="text" name="supervisor" placeholder="Supervisor" value={form.supervisor} onChange={handleChange} className="p-2 border rounded" />
            <input type="text" name="shift" placeholder="Shift" value={form.shift} onChange={handleChange} className="p-2 border rounded" />
            <input type="number" step="0.01" name="availability" placeholder="Availability %" value={form.availability} onChange={handleChange} className="p-2 border rounded" />
          </div>

          <textarea name="overview" placeholder="Overview" value={form.overview} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="maintenance_completed" placeholder="Maintenance Completed" value={form.maintenance_completed} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="breakdowns" placeholder="Breakdowns" value={form.breakdowns} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="spares_used" placeholder="Spares Used" value={form.spares_used} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="safety_notes" placeholder="Safety Notes" value={form.safety_notes} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="equipment_availability" placeholder='Equipment Availability JSON e.g. {"Pump": 90}' value={form.equipment_availability} onChange={handleChange} className="w-full p-2 border rounded" />

          <div className="flex justify-end space-x-2 mt-2">
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ report_date:"", engineer_name:"", supervisor:"", shift:"", overview:"", maintenance_completed:"",breakdowns:"", spares_used:"", safety_notes:"", availability:"", equipment_availability:"{}" }); }} className="px-4 py-2 border rounded">Cancel</button>}
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editingId ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>

      {/* =========================
          SEARCH + TABLE
      ========================= */}
      <div className="flex justify-between mb-4 items-center">
        <input placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 border rounded w-1/3" />
        <div>
          <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="p-2 border rounded mr-2">
            <option value="report_date">Date</option>
            <option value="engineer_name">Engineer</option>
            <option value="availability">Availability</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="px-2 py-1 border rounded">{sortOrder === "asc" ? "↑" : "↓"}</button>
        </div>
      </div>

      <table className="w-full border-collapse mb-4">
        <thead className="bg-blue-100">
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Engineer</th>
            <th className="border p-2">Shift</th>
            <th className="border p-2">Availability</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border p-2">{r.report_date}</td>
              <td className="border p-2">{r.engineer_name}</td>
              <td className="border p-2">{r.shift}</td>
              <td className={`border p-2 font-bold ${r.availability>=90?"text-green-600":r.availability>=70?"text-yellow-600":"text-red-600"}`}>{r.availability || "-"}</td>
              <td className="border p-2 space-x-2">
                <button onClick={()=>handleEdit(r)} className="px-2 py-1 bg-yellow-400 text-white rounded">Edit</button>
                <button onClick={()=>handleDelete(r.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-2 flex justify-center space-x-2">
        <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-3 py-1 border rounded">Prev</button>
        <span className="px-3 py-1 border rounded">{page}</span>
        <button disabled={page===totalPages} onClick={()=>setPage(page+1)} className="px-3 py-1 border rounded">Next</button>
      </div>

      {/* =========================
          CHARTS
      ========================= */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="p-4 bg-gray-50 rounded shadow">
          <div className="font-bold mb-2">Availability Trend</div>
          <LineChart width={300} height={200} data={lineData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="availability" stroke="#8884d8" />
          </LineChart>
        </div>
        <div className="p-4 bg-gray-50 rounded shadow">
          <div className="font-bold mb-2">Breakdowns by Engineer</div>
          <BarChart width={300} height={200} data={barData}>
            <XAxis dataKey="engineer" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
        <div className="p-4 bg-gray-50 rounded shadow">
          <div className="font-bold mb-2">Equipment Availability</div>
          <PieChart width={300} height={200}>
            <Pie data={equipmentPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
              {equipmentPieData.map((entry,index)=> <Cell key={index} fill={COLORS[index % COLORS.length]}/>)}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
