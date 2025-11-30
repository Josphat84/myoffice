"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Calendar, Plus, Search, RefreshCw, Filter, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Send, Phone, Trash2, MoreVertical,
  Download, Edit, X, Clock9, DollarSign, ArrowUpRight,
  TrendingUp, BarChart3, Users, Briefcase, Zap, FileDown,
  List, LayoutGrid, Mail, Copy, Share2, Bookmark, PieChart
} from "lucide-react";

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const OVERTIME_API = `${API_BASE}/api/overtime`;

// Enhanced Overtime Types with premium styling
const OVERTIME_TYPES = {
  regular: { 
    name: 'Regular Overtime', 
    shortName: 'Regular', 
    color: '#2563eb', 
    rate: 1.5, 
    icon: Clock9,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Standard overtime hours'
  },
  weekend: { 
    name: 'Weekend Overtime', 
    shortName: 'Weekend', 
    color: '#dc2626', 
    rate: 2.0, 
    icon: Calendar,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    gradient: 'from-red-500 to-red-600',
    description: 'Weekend and holiday work'
  },
  emergency: { 
    name: 'Emergency Overtime', 
    shortName: 'Emergency', 
    color: '#d97706', 
    rate: 2.5, 
    icon: AlertCircle,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    gradient: 'from-amber-500 to-amber-600',
    description: 'Urgent and critical work'
  },
  project: { 
    name: 'Project Overtime', 
    shortName: 'Project', 
    color: '#7c3aed', 
    rate: 1.75, 
    icon: FileText,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Project-based overtime'
  }
};

// Enhanced Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

const formatDateForExport = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  try {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  } catch {
    return timeString;
  }
};

const calculateHours = (startTime, endTime, date) => {
  if (!startTime || !endTime || !date) return 0;
  try {
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (end < start) end.setDate(end.getDate() + 1);
    const diffMs = end.getTime() - start.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  } catch {
    return 0;
  }
};

const calculateEarnings = (hours, rate, hourlyRate = 25) => {
  return hours * rate * hourlyRate;
};

// API Functions
const fetchOvertime = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.append(key, value);
    });

    const url = params.toString() ? `${OVERTIME_API}?${params.toString()}` : OVERTIME_API;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching overtime:', error);
    throw error;
  }
};

const createOvertime = async (overtimeData) => {
  try {
    const response = await fetch(OVERTIME_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overtimeData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error creating overtime:', error);
    throw error;
  }
};

const updateOvertime = async (overtimeId, overtimeData) => {
  try {
    const response = await fetch(`${OVERTIME_API}/${overtimeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overtimeData),
    });

    if (!response.ok) throw new Error(`Failed to update: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error updating overtime:', error);
    throw error;
  }
};

const updateOvertimeStatus = async (overtimeId, status) => {
  try {
    const response = await fetch(`${OVERTIME_API}/${overtimeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error(`Failed to update status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error updating overtime status:', error);
    throw error;
  }
};

const deleteOvertime = async (overtimeId) => {
  try {
    const response = await fetch(`${OVERTIME_API}/${overtimeId}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error deleting overtime:', error);
    throw error;
  }
};

// Download Functions
const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = [
    'Employee Name', 'Employee ID', 'Position', 'Overtime Type',
    'Date', 'Start Time', 'End Time', 'Total Hours', 'Hourly Rate',
    'Overtime Rate', 'Total Earnings', 'Status', 'Contact Number',
    'Reason', 'Applied Date'
  ];

  const csvData = data.map(row => {
    const overtimeType = OVERTIME_TYPES[row.overtime_type] || OVERTIME_TYPES.regular;
    const hours = calculateHours(row.start_time, row.end_time, row.date);
    const earnings = calculateEarnings(hours, overtimeType.rate, row.hourly_rate);
    
    return [
      `"${(row.employee_name || '').replace(/"/g, '""')}"`,
      `"${(row.employee_id || '').replace(/"/g, '""')}"`,
      `"${(row.position || '').replace(/"/g, '""')}"`,
      `"${overtimeType.name}"`,
      `"${formatDateForExport(row.date)}"`,
      `"${formatTime(row.start_time)}"`,
      `"${formatTime(row.end_time)}"`,
      hours,
      row.hourly_rate || 25,
      overtimeType.rate,
      earnings.toFixed(2),
      `"${(row.status || '').charAt(0).toUpperCase() + (row.status || '').slice(1)}"`,
      `"${(row.contact_number || '').replace(/"/g, '""')}"`,
      `"${(row.reason || '').replace(/"/g, '""')}"`,
      `"${formatDate(row.applied_date)}"`
    ];
  });

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const downloadPDF = async (data, filename, type = 'individual') => {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let content = '';
  
  if (type === 'individual') {
    const overtimeType = OVERTIME_TYPES[data.overtime_type] || OVERTIME_TYPES.regular;
    const hours = calculateHours(data.start_time, data.end_time, data.date);
    const earnings = calculateEarnings(hours, overtimeType.rate, data.hourly_rate);
    
    content = `
OVERTIME APPLICATION REPORT
===========================

Employee Information:
---------------------
Name: ${data.employee_name}
Employee ID: ${data.employee_id}
Position: ${data.position}

Overtime Details:
-----------------
Type: ${overtimeType.name}
Date: ${formatDateForExport(data.date)}
Time: ${formatTime(data.start_time)} - ${formatTime(data.end_time)}
Duration: ${hours} hours
Hourly Rate: $${data.hourly_rate || 25}/hour
Overtime Multiplier: ${overtimeType.rate}x
Total Earnings: $${earnings.toFixed(2)}
Status: ${data.status.toUpperCase()}
Applied: ${formatDate(data.applied_date)}

Contact Information:
--------------------
Phone: ${data.contact_number}
${data.emergency_contact ? `Emergency Contact: ${data.emergency_contact}` : ''}

Reason for Overtime:
--------------------
${data.reason}

Report Generated: ${today}
===========================
    `;
  } else {
    const approved = data.filter(l => l.status === 'approved').length;
    const pending = data.filter(l => l.status === 'pending').length;
    const rejected = data.filter(l => l.status === 'rejected').length;
    const totalHours = data.reduce((sum, ot) => {
      const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
      return sum + hours;
    }, 0);
    const totalEarnings = data.reduce((sum, ot) => {
      const overtimeType = OVERTIME_TYPES[ot.overtime_type] || OVERTIME_TYPES.regular;
      const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
      const earnings = calculateEarnings(hours, overtimeType.rate, ot.hourly_rate);
      return sum + earnings;
    }, 0);
    
    content = `
COMPREHENSIVE OVERTIME REPORT
==============================

Executive Summary:
------------------
Total Records: ${data.length}
Approved Overtime: ${approved}
Pending Review: ${pending}
Rejected: ${rejected}
Total Hours: ${Math.round(totalHours * 100) / 100}
Total Earnings: $${Math.round(totalEarnings * 100) / 100}
Report Date: ${today}

Detailed Records:
-----------------
${data.map((overtime, index) => {
  const otType = OVERTIME_TYPES[overtime.overtime_type] || OVERTIME_TYPES.regular;
  const hours = calculateHours(overtime.start_time, overtime.end_time, overtime.date);
  const earnings = calculateEarnings(hours, otType.rate, overtime.hourly_rate);
  
  return `
${index + 1}. ${overtime.employee_name} (${overtime.employee_id})
   Position: ${overtime.position}
   Overtime Type: ${otType.name}
   Date: ${formatDateForExport(overtime.date)}
   Time: ${formatTime(overtime.start_time)} - ${formatTime(overtime.end_time)}
   Duration: ${hours} hours
   Earnings: $${earnings.toFixed(2)}
   Status: ${overtime.status.toUpperCase()}
   Applied: ${formatDate(overtime.applied_date)}
`}).join('\n')}

End of Report
=============
    `;
  }

  const blob = new Blob([content], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Enhanced Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    pending: { 
      color: 'bg-amber-50 text-amber-700 border-amber-200', 
      icon: Clock, 
      label: 'Under Review' 
    },
    approved: { 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2, 
      label: 'Approved' 
    },
    rejected: { 
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle, 
      label: 'Not Approved' 
    },
    paid: { 
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: DollarSign, 
      label: 'Paid' 
    }
  }[status] || config.pending;

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-medium tracking-wide">{config.label}</span>
    </span>
  );
};

// Premium Stat Card Component
const StatCard = ({ title, value, icon, onClick, subtitle, color = "blue" }) => {
  const Icon = icon;
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  };
  
  return (
    <div 
      className="group bg-gradient-to-br from-white to-gray-50/80 rounded-2xl border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-xl hover:border-gray-300/80 cursor-pointer hover:scale-[1.02] backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-gray-600 tracking-wide">{title}</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

// Download Modal Component
const DownloadModal = ({ isOpen, onClose, onDownload, data, type = 'individual' }) => {
  const [format, setFormat] = useState('pdf');
  const [scope, setScope] = useState(type);

  if (!isOpen) return null;

  const handleDownload = () => {
    onDownload(data, format, scope);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200/60">
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl border border-blue-200">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-wide">Export Report</h2>
                <p className="text-sm text-gray-600 font-medium">Choose your preferred format</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">Format</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'pdf', label: 'PDF Document', color: 'bg-red-500' },
                { value: 'excel', label: 'Excel Sheet', color: 'bg-green-500' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    format === option.value 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${option.color} flex items-center justify-center mb-2`}>
                    <FileDown className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm tracking-wide">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">Scope</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'individual', label: 'This Record', description: 'Current selection' },
                { value: 'all', label: 'All Records', description: 'Complete dataset' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setScope(option.value)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    scope === option.value 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center mb-2">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm tracking-wide">{option.label}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200/60">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold tracking-wide"
          >
            Cancel
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Overtime Card Component
const OvertimeCard = ({ overtime, onView, onEdit, onDelete, onDownload }) => {
  const overtimeType = OVERTIME_TYPES[overtime.overtime_type] || OVERTIME_TYPES.regular;
  const Icon = overtimeType.icon;
  const [showActions, setShowActions] = useState(false);
  
  const calculatedHours = calculateHours(overtime.start_time, overtime.end_time, overtime.date);
  const earnings = calculateEarnings(calculatedHours, overtimeType.rate, overtime.hourly_rate);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/80 rounded-2xl border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-xl hover:border-gray-300/80 group hover:scale-[1.02] backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${overtimeType.bgColor} border ${overtimeType.borderColor} group-hover:scale-110 transition-transform shadow-sm`}>
            <Icon className={`h-4 w-4 ${overtimeType.textColor}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg tracking-wide">{overtime.employee_name}</h3>
            <p className="text-sm text-gray-500 font-medium">{overtime.position} • {overtime.employee_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={overtime.status} />
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600 border border-gray-200"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200/60 rounded-xl shadow-xl z-10 min-w-[180px] overflow-hidden backdrop-blur-sm">
                <button 
                  onClick={() => { onView(overtime); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-100 font-medium"
                >
                  <Eye className="h-4 w-4" /> View Details
                </button>
                <button 
                  onClick={() => { onEdit(overtime); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-100 font-medium"
                >
                  <Edit className="h-4 w-4" /> Edit Request
                </button>
                <button 
                  onClick={() => { onDownload(overtime); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-100 font-medium"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <div className="border-t border-gray-200">
                  <button 
                    onClick={() => { onDelete(overtime.id); setShowActions(false); }}
                    className="w-full px-4 py-3 text-left text-sm text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(overtime.date)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-semibold">Time</span>
          <span className="font-bold text-gray-900">
            {formatTime(overtime.start_time)} - {formatTime(overtime.end_time)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-semibold">Hours</span>
          <span className="font-bold text-gray-900">{calculatedHours}h</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-semibold">Earnings</span>
          <span className="font-bold text-green-600">${earnings.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-semibold">Rate</span>
          <span className="font-medium">${overtime.hourly_rate || 25}/hour × {overtimeType.rate}x</span>
        </div>
      </div>

      {overtime.reason && (
        <div className="mb-4 p-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">{overtime.reason}</p>
        </div>
      )}

      {overtime.contact_number && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Phone className="h-3 w-3" />
          <span>{overtime.contact_number}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={() => onView(overtime)}
          className="flex-1 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 group/btn border border-gray-200 hover:border-gray-300"
        >
          <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
          View Details
        </button>
        <button 
          onClick={() => onDownload(overtime)}
          className="px-3 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-200 flex items-center justify-center border border-blue-200 hover:border-blue-300"
          title="Download Report"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions = ({ onNewRequest, onRefresh, onExport, loading }) => {
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={onExport}
        className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold tracking-wide shadow-sm hover:shadow-md"
      >
        <Download className="h-4 w-4" />
        Export Data
      </button>
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="p-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      </button>
      <button 
        onClick={onNewRequest}
        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-bold tracking-wide"
      >
        <Plus className="h-4 w-4" />
        New Overtime
      </button>
    </div>
  );
};

// Enhanced Overtime Details Modal
const OvertimeDetailsModal = ({ overtime, onClose, onStatusUpdate, onDelete, onEdit, onDownload }) => {
  const [showActions, setShowActions] = useState(false);
  const [updating, setUpdating] = useState(false);
  const overtimeType = OVERTIME_TYPES[overtime.overtime_type] || OVERTIME_TYPES.regular;
  const Icon = overtimeType.icon;

  const calculatedHours = calculateHours(overtime.start_time, overtime.end_time, overtime.date);
  const earnings = calculateEarnings(calculatedHours, overtimeType.rate, overtime.hourly_rate);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(overtime.id, newStatus);
      setShowActions(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this overtime application? This action cannot be undone.')) {
      return;
    }

    setUpdating(true);
    try {
      await onDelete(overtime.id);
      setShowActions(false);
    } catch (error) {
      console.error('Error deleting overtime:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = () => {
    onEdit(overtime);
    onClose();
  };

  const handleDownload = () => {
    onDownload(overtime, 'pdf', 'individual');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/60">
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${overtimeType.bgColor} border ${overtimeType.borderColor}`}>
                <Icon className={`h-6 w-6 ${overtimeType.textColor}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-wide">Overtime Application Details</h2>
                <p className="text-sm text-gray-600 font-medium">{overtimeType.name} • {overtime.employee_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <div className="relative">
                <button onClick={() => setShowActions(!showActions)} disabled={updating} className="p-2 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors text-gray-400 hover:text-gray-600 border border-gray-200">
                  <MoreVertical className="h-5 w-5" />
                </button>
                {showActions && (
                  <div className="absolute right-0 top-10 bg-white border border-gray-200/60 rounded-xl shadow-2xl z-10 min-w-[200px] overflow-hidden backdrop-blur-sm">
                    <button onClick={() => handleStatusUpdate('approved')} disabled={updating} className="w-full px-4 py-3 text-left text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 disabled:opacity-50 transition-colors border-b border-gray-100 font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Approve Request
                    </button>
                    <button onClick={() => handleStatusUpdate('rejected')} disabled={updating} className="w-full px-4 py-3 text-left text-sm text-rose-700 hover:bg-rose-50 flex items-center gap-2 disabled:opacity-50 transition-colors border-b border-gray-100 font-semibold">
                      <XCircle className="h-4 w-4" /> Decline Request
                    </button>
                    <button onClick={() => handleStatusUpdate('pending')} disabled={updating} className="w-full px-4 py-3 text-left text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2 disabled:opacity-50 transition-colors font-semibold">
                      <Clock className="h-4 w-4" /> Set as Pending
                    </button>
                    <div className="border-t border-gray-200">
                      <button onClick={handleDelete} disabled={updating} className="w-full px-4 py-3 text-left text-sm text-rose-700 hover:bg-rose-50 flex items-center gap-2 disabled:opacity-50 transition-colors font-semibold">
                        <Trash2 className="h-4 w-4" /> Delete Application
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={onClose} disabled={updating} className="p-2 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors text-gray-400 hover:text-gray-600 border border-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {updating && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
              <span className="text-blue-700 font-semibold">Updating request...</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50/50 border border-gray-200/60 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                  <User className="h-5 w-5 text-gray-600" />
                  Employee Information
                </h3>
                <div className="space-y-3">
                  <div><p className="text-sm text-gray-600 font-semibold">Full Name</p><p className="font-bold text-gray-900">{overtime.employee_name}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Employee ID</p><p className="font-bold text-gray-900">{overtime.employee_id}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Position</p><p className="font-bold text-gray-900">{overtime.position}</p></div>
                </div>
              </div>

              <div className="bg-gray-50/50 border border-gray-200/60 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                  <Phone className="h-5 w-5 text-gray-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div><p className="text-sm text-gray-600 font-semibold">Contact Number</p><p className="font-bold text-gray-900">{overtime.contact_number}</p></div>
                  {overtime.emergency_contact && (
                    <div><p className="text-sm text-gray-600 font-semibold">Emergency Contact</p><p className="font-bold text-gray-900">{overtime.emergency_contact}</p></div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Overtime Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${overtimeType.bgColor} border ${overtimeType.borderColor}`}>
                      <Icon className={`h-4 w-4 ${overtimeType.textColor}`} />
                    </div>
                    <div><p className="text-sm text-gray-600 font-semibold">Overtime Type</p><p className="font-bold text-gray-900">{overtimeType.name}</p></div>
                  </div>
                  <div><p className="text-sm text-gray-600 font-semibold">Status</p><div className="mt-1"><StatusBadge status={overtime.status} /></div></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Date</p><p className="font-bold text-gray-900">{formatDate(overtime.date)}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Time</p><p className="font-bold text-gray-900">{formatTime(overtime.start_time)} - {formatTime(overtime.end_time)}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Total Hours</p><p className="font-bold text-gray-900">{calculatedHours}h</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Hourly Rate</p><p className="font-bold text-gray-900">${overtime.hourly_rate}/hour</p></div>
                </div>
              </div>

              <div className="bg-green-50/50 border border-green-200/60 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Earnings Calculation
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Rate</span>
                    <span className="font-bold">${overtime.hourly_rate}/h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overtime Multiplier</span>
                    <span className="font-bold">{overtimeType.rate}x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Hours</span>
                    <span className="font-bold">{calculatedHours}h</span>
                  </div>
                  <div className="border-t border-green-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-900">Total Earnings</span>
                      <span className="text-green-600">${earnings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/50 border border-gray-200/60 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
              <FileText className="h-5 w-5 text-gray-600" />
              Reason for Overtime
            </h3>
            <div className="bg-white border border-gray-200/60 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed font-semibold">{overtime.reason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Overtime Application Form
const OvertimeApplicationForm = ({ onClose, onSuccess, editData, onUpdate }) => {
  const [formData, setFormData] = useState(editData || {
    employee_name: '', employee_id: '', position: '', overtime_type: 'regular',
    date: new Date().toISOString().split('T')[0], start_time: '18:00', end_time: '20:00',
    reason: '', contact_number: '', emergency_contact: '', hourly_rate: 25
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.employee_name || !formData.employee_id || !formData.position || 
          !formData.date || !formData.start_time || !formData.end_time || !formData.reason || !formData.contact_number) {
        throw new Error('Please fill in all required fields');
      }

      if (new Date(formData.end_time) < new Date(formData.start_time)) {
        throw new Error('End time must be after start time');
      }

      if (editData) {
        await onUpdate(editData.id, formData);
      } else {
        await createOvertime(formData);
      }
      
      onSuccess(editData ? 'Overtime application updated successfully!' : 'Overtime application submitted successfully!');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculatedHours = calculateHours(formData.start_time, formData.end_time, formData.date);
  const selectedOvertimeType = OVERTIME_TYPES[formData.overtime_type];
  const earnings = calculateEarnings(calculatedHours, selectedOvertimeType.rate, formData.hourly_rate);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/60">
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-wide">
              {editData ? 'Edit Overtime Application' : 'New Overtime Request'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-red-800 font-bold tracking-wide">Error</p>
                <p className="text-red-700 text-sm font-semibold">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Full Name', field: 'employee_name', type: 'text', placeholder: 'Enter your full name', required: true },
              { label: 'Employee ID', field: 'employee_id', type: 'text', placeholder: 'e.g., EMP001', required: true },
              { label: 'Position', field: 'position', type: 'text', placeholder: 'e.g., Senior Technician', required: true },
              { label: 'Contact Number', field: 'contact_number', type: 'tel', placeholder: '+263 XXX XXX XXX', required: true }
            ].map(({ label, field, type, placeholder, required }) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input 
                  type={type} 
                  required={required}
                  value={formData[field]} 
                  onChange={(e) => handleChange(field, e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
                  placeholder={placeholder} 
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                Overtime Type <span className="text-red-500">*</span>
              </label>
              <select 
                required 
                value={formData.overtime_type} 
                onChange={(e) => handleChange('overtime_type', e.target.value)} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
              >
                {Object.entries(OVERTIME_TYPES).map(([key, type]) => 
                  <option key={key} value={key}>{type.name} ({type.rate}x rate)</option>
                )}
              </select>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedOvertimeType.bgColor} border-2 ${selectedOvertimeType.borderColor}`}>
                  {React.createElement(selectedOvertimeType.icon, { className: `h-5 w-5 ${selectedOvertimeType.textColor}` })}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedOvertimeType.name}</p>
                  <p className="text-sm text-gray-600 font-medium">{selectedOvertimeType.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                required 
                value={formData.date} 
                onChange={(e) => handleChange('date', e.target.value)} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input 
                type="time" 
                required 
                value={formData.start_time} 
                onChange={(e) => handleChange('start_time', e.target.value)} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                End Time <span className="text-red-500">*</span>
              </label>
              <input 
                type="time" 
                required 
                value={formData.end_time} 
                onChange={(e) => handleChange('end_time', e.target.value)} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
              />
            </div>
          </div>

          {calculatedHours > 0 && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Total Hours</p>
                  <p className="text-lg font-bold text-emerald-600">{calculatedHours}h</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Rate Multiplier</p>
                  <p className="text-lg font-bold text-emerald-600">{selectedOvertimeType.rate}x</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Estimated Earnings</p>
                  <p className="text-lg font-bold text-emerald-600">${earnings.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              Reason for Overtime <span className="text-red-500">*</span>
            </label>
            <textarea 
              required 
              value={formData.reason} 
              onChange={(e) => handleChange('reason', e.target.value)} 
              rows={4} 
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
              placeholder="Please provide details about why overtime is required..." 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Hourly Rate ($)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={formData.hourly_rate} 
                onChange={(e) => handleChange('hourly_rate', parseFloat(e.target.value) || 25)} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold text-gray-900">Additional Information</span>
              {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {showAdvanced && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Emergency Contact</label>
                    <input 
                      type="text" 
                      value={formData.emergency_contact} 
                      onChange={(e) => handleChange('emergency_contact', e.target.value)} 
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
                      placeholder="Name and phone number" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold tracking-wide"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {editData ? 'Update Request' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component - Premium Overtime Management
export default function OvertimeManagement() {
  const [overtime, setOvertime] = useState([]);
  const [selectedOvertime, setSelectedOvertime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadData, setDownloadData] = useState(null);

  // Enhanced data fetching
  const fetchAllData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const data = await fetchOvertime();
      setOvertime(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Enhanced form success handler
  const handleFormSuccess = (message) => {
    setSuccess(message);
    fetchAllData();
    setTimeout(() => setSuccess(null), 5000);
  };

  // Enhanced status update
  const handleStatusUpdate = async (overtimeId, newStatus) => {
    try {
      await updateOvertimeStatus(overtimeId, newStatus);
      setOvertime(prev => prev.map(ot => 
        ot.id === overtimeId ? { ...ot, status: newStatus } : ot
      ));
      setSuccess(`Overtime status updated to ${newStatus}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to update overtime status: ${error.message}`);
    }
  };

  // Enhanced overtime update handler
  const handleOvertimeUpdate = async (overtimeId, overtimeData) => {
    try {
      const updatedOvertime = await updateOvertime(overtimeId, overtimeData);
      setOvertime(prev => prev.map(ot => 
        ot.id === overtimeId ? { ...ot, ...updatedOvertime } : ot
      ));
      setEditData(null);
      setSuccess('Overtime application updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to update overtime: ${error.message}`);
    }
  };

  // Enhanced delete handler with confirmation
  const handleDeleteOvertime = async (overtimeId) => {
    if (!confirm('Are you sure you want to delete this overtime application? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteOvertime(overtimeId);
      setOvertime(prev => prev.filter(ot => ot.id !== overtimeId));
      setSelectedOvertime(null);
      setSuccess('Overtime application deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to delete overtime: ${error.message}`);
    }
  };

  // Enhanced download handler
  const handleDownload = async (data, format, scope) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const filename = scope === 'individual' 
        ? `overtime-${data.employee_id}-${today}`
        : `overtime-report-${today}`;
      
      if (format === 'excel') {
        downloadCSV(scope === 'individual' ? [data] : overtime, filename);
      } else {
        await downloadPDF(scope === 'individual' ? data : overtime, filename, scope);
      }
      
      setSuccess(`Report downloaded successfully as ${format.toUpperCase()}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to download report');
    }
  };

  // Enhanced filtering with better search
  const filteredOvertime = useMemo(() => {
    let filtered = overtime;
    
    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(ot => ot.status === filter);
    }
    
    // Enhanced search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ot => 
        ot.employee_name?.toLowerCase().includes(searchLower) ||
        ot.overtime_type?.toLowerCase().includes(searchLower) ||
        ot.employee_id?.toLowerCase().includes(searchLower) ||
        ot.position?.toLowerCase().includes(searchLower) ||
        ot.contact_number?.includes(searchTerm)
      );
    }
    
    return filtered;
  }, [overtime, filter, searchTerm]);

  // Calculate real-time stats from actual data
  const stats = useMemo(() => {
    const total = overtime.length;
    const pending = overtime.filter(ot => ot.status === 'pending').length;
    const approved = overtime.filter(ot => ot.status === 'approved').length;
    const rejected = overtime.filter(ot => ot.status === 'rejected').length;
    
    // Calculate total hours and earnings
    const totalHours = overtime.reduce((sum, ot) => {
      const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
      return sum + hours;
    }, 0);
    
    const totalEarnings = overtime.reduce((sum, ot) => {
      const overtimeType = OVERTIME_TYPES[ot.overtime_type] || OVERTIME_TYPES.regular;
      const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
      const earnings = calculateEarnings(hours, overtimeType.rate, ot.hourly_rate);
      return sum + earnings;
    }, 0);

    return { 
      total, 
      pending, 
      approved, 
      rejected, 
      totalHours: Math.round(totalHours * 100) / 100,
      totalEarnings: Math.round(totalEarnings * 100) / 100
    };
  }, [overtime]);

  // Initial data fetch
  useEffect(() => { 
    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 font-sans">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <Clock9 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overtime Management</h1>
                <p className="text-sm text-gray-600 font-medium">Professional overtime tracking platform</p>
              </div>
            </div>
            
            <QuickActions 
              onNewRequest={() => setShowForm(true)}
              onRefresh={fetchAllData}
              onExport={() => {
                setDownloadData(overtime);
                setShowDownloadModal(true);
              }}
              loading={loading}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="text-red-800 font-bold tracking-wide">Error</p>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
            <button onClick={fetchAllData} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors font-semibold">
              Retry
            </button>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div className="flex-1">
              <p className="text-emerald-800 font-bold tracking-wide">Success</p>
              <p className="text-emerald-700 text-sm font-medium">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="p-1 hover:bg-emerald-200 rounded transition-colors">
              <X className="h-4 w-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Premium Statistics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard 
            title="Total Requests" 
            value={stats.total} 
            icon={FileText} 
            onClick={() => setFilter('all')}
            color="blue"
          />
          <StatCard 
            title="Pending Review" 
            value={stats.pending} 
            icon={Clock} 
            onClick={() => setFilter('pending')}
            color="amber"
          />
          <StatCard 
            title="Approved" 
            value={stats.approved} 
            icon={CheckCircle2} 
            onClick={() => setFilter('approved')}
            color="green"
          />
          <StatCard 
            title="Total Hours" 
            value={stats.totalHours} 
            icon={TrendingUp} 
            subtitle="hours"
            color="purple"
          />
          <StatCard 
            title="Total Earnings" 
            value={`$${stats.totalEarnings}`} 
            icon={DollarSign} 
            color="green"
          />
        </div>

        {/* Premium Overtime Records Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-200/60">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 tracking-wide">Overtime Requests</h2>
                <p className="text-sm text-gray-600 font-medium">Manage and review all overtime applications</p>
              </div>
              
              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all tracking-wide flex items-center gap-2 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-300' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all tracking-wide flex items-center gap-2 ${
                      viewMode === 'table' 
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-300' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-4 w-4" />
                    List View
                  </button>
                </div>

                {/* Enhanced Search */}
                <div className="relative flex-1 lg:flex-none min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name, ID, position, or phone..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>

                {/* Enhanced Filter */}
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)} 
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[180px] font-semibold"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Not Approved</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                  <p className="text-gray-600 font-semibold">Loading overtime records...</p>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              // Enhanced Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOvertime.map((ot) => (
                  <OvertimeCard 
                    key={ot.id} 
                    overtime={ot} 
                    onView={setSelectedOvertime}
                    onEdit={setEditData}
                    onDelete={handleDeleteOvertime}
                    onDownload={(data) => {
                      setDownloadData(data);
                      setShowDownloadModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              // Enhanced List View
              <div className="overflow-x-auto rounded-xl border border-gray-200/60 backdrop-blur-sm">
                <table className="w-full">
                  <thead className="bg-gray-50/80 border-b border-gray-200/60">
                    <tr>
                      {['Employee', 'Overtime Type', 'Date', 'Time', 'Hours', 'Earnings', 'Status', 'Applied', 'Actions'].map(header => (
                        <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200/60">
                    {filteredOvertime.map((ot) => {
                      const overtimeType = OVERTIME_TYPES[ot.overtime_type] || OVERTIME_TYPES.regular;
                      const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
                      const earnings = calculateEarnings(hours, overtimeType.rate, ot.hourly_rate);
                      
                      return (
                        <tr key={ot.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-gray-900">{ot.employee_name}</p>
                              <p className="text-sm text-gray-500 font-medium">{ot.position} • {ot.employee_id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${overtimeType.bgColor} border ${overtimeType.borderColor}`}>
                                {React.createElement(overtimeType.icon, { 
                                  className: `h-3.5 w-3.5 ${overtimeType.textColor}` 
                                })}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {overtimeType.shortName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                            {formatDate(ot.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {formatTime(ot.start_time)} - {formatTime(ot.end_time)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                            {hours}h
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">
                            ${earnings.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={ot.status} />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                            {formatDate(ot.applied_date)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setSelectedOvertime(ot)}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </button>
                              <button 
                                onClick={() => {
                                  setDownloadData(ot);
                                  setShowDownloadModal(true);
                                }}
                                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredOvertime.length === 0 && (
              <div className="text-center py-16">
                <Clock9 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-bold text-gray-900 mb-2 tracking-wide">No overtime requests found</p>
                <p className="text-sm text-gray-600 mb-6 font-medium">
                  {overtime.length === 0 
                    ? "Get started by creating your first overtime request." 
                    : "No requests match your current filters."
                  }
                </p>
                {overtime.length === 0 && (
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-bold tracking-wide"
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
                    Create First Request
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Modals */}
      {showForm && (
        <OvertimeApplicationForm 
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }} 
          onSuccess={handleFormSuccess}
          editData={editData}
          onUpdate={handleOvertimeUpdate}
        />
      )}

      {selectedOvertime && (
        <OvertimeDetailsModal 
          overtime={selectedOvertime} 
          onClose={() => setSelectedOvertime(null)} 
          onStatusUpdate={handleStatusUpdate} 
          onDelete={handleDeleteOvertime} 
          onEdit={setEditData}
          onDownload={handleDownload}
        />
      )}

      {showDownloadModal && (
        <DownloadModal 
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          onDownload={handleDownload}
          data={downloadData}
          type={Array.isArray(downloadData) ? 'all' : 'individual'}
        />
      )}

      {/* Edit Modal */}
      {editData && (
        <OvertimeApplicationForm 
          onClose={() => setEditData(null)} 
          onSuccess={handleFormSuccess}
          editData={editData}
          onUpdate={handleOvertimeUpdate}
        />
      )}
    </div>
  );
}