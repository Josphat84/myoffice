"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Calendar, Plus, Search, RefreshCw, Filter, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Send, Phone, Info, Trash2, MoreVertical,
  Download, FileDown, List, LayoutGrid, X, Edit, ArrowUpRight,
  TrendingUp, Copy, Share2, Bookmark, BookOpen, Heart, Brain,
  Briefcase, Stethoscope, Shield, GraduationCap, Zap, Users,
  BarChart3, PieChart, Settings, Bell, HelpCircle, Mail,
  CopyCheck, CalendarDays, Workflow, Target, Sparkles
} from "lucide-react";

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const LEAVES_API = `${API_BASE}/api/leaves`;

// Enhanced Constants with elegant icons
const LEAVE_TYPES = {
  annual: { 
    name: 'Annual Leave', shortName: 'Annual', color: '#2563eb', 
    bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200',
    icon: CalendarDays, gradient: 'from-blue-500 to-blue-600',
    description: 'Paid vacation time'
  },
  sick: { 
    name: 'Sick Leave', shortName: 'Sick', color: '#dc2626', 
    bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200',
    icon: Stethoscope, gradient: 'from-red-500 to-red-600',
    description: 'Medical and health-related'
  },
  emergency: { 
    name: 'Emergency Leave', shortName: 'Emergency', color: '#d97706', 
    bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200',
    icon: Shield, gradient: 'from-amber-500 to-amber-600',
    description: 'Urgent personal matters'
  },
  compassionate: { 
    name: 'Compassionate Leave', shortName: 'Compassionate', color: '#7c3aed', 
    bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200',
    icon: Heart, gradient: 'from-purple-500 to-purple-600',
    description: 'Family emergencies'
  },
  maternity: { 
    name: 'Maternity Leave', shortName: 'Maternity', color: '#db2777', 
    bgColor: 'bg-pink-50', textColor: 'text-pink-700', borderColor: 'border-pink-200',
    icon: Users, gradient: 'from-pink-500 to-pink-600',
    description: 'Parental leave'
  },
  study: { 
    name: 'Study Leave', shortName: 'Study', color: '#059669', 
    bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200',
    icon: GraduationCap, gradient: 'from-emerald-500 to-emerald-600',
    description: 'Professional development'
  }
};

// Enhanced Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatDateForExport = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// API Functions - FIXED: Use PATCH for updates instead of PUT
const fetchLeaves = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.append(key, value);
    });

    const url = params.toString() ? `${LEAVES_API}?${params.toString()}` : LEAVES_API;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch leaves: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaves:', error);
    throw error;
  }
};

const fetchLeaveStats = async () => {
  try {
    const response = await fetch(`${LEAVES_API}/stats/summary`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};

const fetchLeaveBalance = async () => {
  try {
    const response = await fetch(`${LEAVES_API}/balance/MNT001`);
    if (!response.ok) return getDefaultBalance();
    return await response.json();
  } catch (error) {
    console.error('Error fetching balance:', error);
    return getDefaultBalance();
  }
};

const createLeave = async (leaveData) => {
  try {
    const response = await fetch(LEAVES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create leave: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating leave:', error);
    throw error;
  }
};

// FIXED: Use PATCH method instead of PUT to avoid 405 error
const updateLeave = async (leaveId, leaveData) => {
  try {
    const response = await fetch(`${LEAVES_API}/${leaveId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update leave: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating leave:', error);
    throw error;
  }
};

const updateLeaveStatus = async (leaveId, status) => {
  try {
    const response = await fetch(`${LEAVES_API}/${leaveId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error(`Failed to update leave status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error updating leave status:', error);
    throw error;
  }
};

const deleteLeave = async (leaveId) => {
  try {
    const response = await fetch(`${LEAVES_API}/${leaveId}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete leave: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting leave:', error);
    throw error;
  }
};

const getDefaultBalance = () => ({
  annual: { total: 21, used: 0, pending: 0, remaining: 21 },
  sick: { total: 10, used: 0, pending: 0, remaining: 10 },
  emergency: { total: 5, used: 0, pending: 0, remaining: 5 },
  compassionate: { total: 5, used: 0, pending: 0, remaining: 5 },
  maternity: { total: 90, used: 0, pending: 0, remaining: 90 },
  study: { total: 10, used: 0, pending: 0, remaining: 10 }
});

// Fixed Excel Download with proper column alignment
const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = [
    'Employee Name', 'Employee ID', 'Position', 'Leave Type',
    'Start Date', 'End Date', 'Total Days', 'Status',
    'Contact Number', 'Applied Date', 'Reason', 'Emergency Contact', 'Handover To'
  ];

  const csvData = data.map(row => [
    `"${(row.employee_name || '').replace(/"/g, '""')}"`,
    `"${(row.employee_id || '').replace(/"/g, '""')}"`,
    `"${(row.position || '').replace(/"/g, '""')}"`,
    `"${LEAVE_TYPES[row.leave_type]?.name || row.leave_type || ''}"`,
    `"${formatDateForExport(row.start_date)}"`,
    `"${formatDateForExport(row.end_date)}"`,
    row.total_days || 0,
    `"${(row.status || '').charAt(0).toUpperCase() + (row.status || '').slice(1)}"`,
    `"${(row.contact_number || '').replace(/"/g, '""')}"`,
    `"${formatTime(row.applied_date)}"`,
    `"${(row.reason || '').replace(/"/g, '""')}"`,
    `"${(row.emergency_contact || '').replace(/"/g, '""')}"`,
    `"${(row.handover_to || '').replace(/"/g, '""')}"`
  ]);

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

// Enhanced PDF Download
const downloadPDF = async (data, filename, type = 'individual') => {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let content = '';
  
  if (type === 'individual') {
    content = `
LEAVE APPLICATION REPORT
========================

Employee Information:
---------------------
Name: ${data.employee_name}
Employee ID: ${data.employee_id}
Position: ${data.position}

Leave Details:
--------------
Type: ${LEAVE_TYPES[data.leave_type]?.name || data.leave_type}
Start Date: ${formatDateForExport(data.start_date)}
End Date: ${formatDateForExport(data.end_date)}
Duration: ${data.total_days} days
Status: ${data.status.toUpperCase()}
Applied: ${formatTime(data.applied_date)}

Contact Information:
--------------------
Phone: ${data.contact_number}
Emergency Contact: ${data.emergency_contact || 'Not provided'}
Handover To: ${data.handover_to || 'Not specified'}

Reason for Leave:
-----------------
${data.reason}

Report Generated: ${today}
=========================
    `;
  } else {
    const approved = data.filter(l => l.status === 'approved').length;
    const pending = data.filter(l => l.status === 'pending').length;
    const rejected = data.filter(l => l.status === 'rejected').length;
    
    content = `
COMPREHENSIVE LEAVE REPORT
==========================

Executive Summary:
------------------
Total Records: ${data.length}
Approved Leaves: ${approved}
Pending Review: ${pending}
Rejected: ${rejected}
Report Date: ${today}

Detailed Records:
-----------------
${data.map((leave, index) => `
${index + 1}. ${leave.employee_name} (${leave.employee_id})
   Position: ${leave.position}
   Leave Type: ${LEAVE_TYPES[leave.leave_type]?.name || leave.leave_type}
   Period: ${formatDateForExport(leave.start_date)} to ${formatDateForExport(leave.end_date)}
   Duration: ${leave.total_days} days
   Status: ${leave.status.toUpperCase()}
   Applied: ${formatTime(leave.applied_date)}
`).join('\n')}

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

// Elegant Stat Card Component
const StatCard = ({ title, value, icon, onClick, subtitle }) => {
  const Icon = icon;
  
  return (
    <div 
      className="group bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-xl border border-gray-200 group-hover:scale-110 transition-transform">
              <Icon className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 tracking-wide">{title}</span>
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

// Enhanced Leave Balance Card
const LeaveBalanceCard = ({ type, data, isExpanded, onToggle }) => {
  const leaveType = LEAVE_TYPES[type];
  const Icon = leaveType.icon;
  const percentage = data.total ? (data.used / data.total) * 100 : 0;
  
  return (
    <div className={`bg-white rounded-2xl border-2 ${leaveType.borderColor} transition-all duration-300 hover:shadow-lg group ${
      isExpanded ? 'ring-2 ring-blue-100' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${leaveType.bgColor} border-2 ${leaveType.borderColor} group-hover:scale-105 transition-transform`}>
              <Icon className={`h-6 w-6 ${leaveType.textColor}`} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg tracking-wide">{leaveType.name}</h3>
              <p className="text-sm text-gray-500 font-medium">{leaveType.description}</p>
            </div>
          </div>
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600 border border-gray-200"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{data.remaining}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Available</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">{data.used}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Used</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">{data.total}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total</div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-semibold">Usage Progress</span>
              <span className="font-bold" style={{ color: leaveType.color }}>
                {Math.round(percentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden border border-gray-200">
              <div 
                className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: leaveType.color,
                }}
              />
            </div>
          </div>

          {data.pending > 0 && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">{data.pending} days pending approval</span>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold">Total Allocation</p>
              <p className="font-bold text-gray-900 text-lg">{data.total} days</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold">Used This Year</p>
              <p className="font-bold text-gray-900 text-lg">{data.used} days</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold">Pending Approval</p>
              <p className="font-bold text-amber-600 text-lg">{data.pending} days</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold">Available Balance</p>
              <p className="font-bold text-emerald-600 text-lg">{data.remaining} days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Leave Card Component
const LeaveCard = ({ leave, onView, onDownload, onEdit, onDelete }) => {
  const leaveType = LEAVE_TYPES[leave.leave_type];
  const Icon = leaveType.icon;
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-gray-300 group hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${leaveType.bgColor} border-2 ${leaveType.borderColor} group-hover:scale-110 transition-transform`}>
            <Icon className={`h-4 w-4 ${leaveType.textColor}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg tracking-wide">{leave.employee_name}</h3>
            <p className="text-sm text-gray-500 font-medium">{leave.position} • {leave.employee_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={leave.status} />
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600 border border-gray-200"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-10 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 min-w-[180px] overflow-hidden">
                <button 
                  onClick={() => { onView(leave); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-100 font-medium"
                >
                  <Eye className="h-4 w-4" /> View Details
                </button>
                <button 
                  onClick={() => { onEdit(leave); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-100 font-medium"
                >
                  <Edit className="h-4 w-4" /> Edit Request
                </button>
                <button 
                  onClick={() => { onDownload(leave); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-100 font-medium"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <div className="border-t border-gray-200">
                  <button 
                    onClick={() => { onDelete(leave.id); setShowActions(false); }}
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
          <span>{formatDate(leave.start_date)} - {formatDate(leave.end_date)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-semibold">Duration</span>
          <span className="font-bold text-gray-900">{leave.total_days} days</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-semibold">Applied</span>
          <span className="text-gray-500 font-medium">{formatTime(leave.applied_date)}</span>
        </div>
      </div>

      {leave.reason && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">{leave.reason}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={() => onView(leave)}
          className="flex-1 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 group/btn border-2 border-gray-200 hover:border-gray-300"
        >
          <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
          View Details
        </button>
        <button 
          onClick={() => onDownload(leave)}
          className="px-3 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-200 flex items-center justify-center border-2 border-blue-200 hover:border-blue-300"
          title="Download Report"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Enhanced Download Modal
const DownloadModal = ({ isOpen, onClose, onDownload, data, type = 'individual' }) => {
  const [format, setFormat] = useState('pdf');
  const [scope, setScope] = useState(type);

  if (!isOpen) return null;

  const handleDownload = () => {
    onDownload(data, format, scope);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border-2 border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg border-2 border-blue-200">
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
          {/* Format Selection */}
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

          {/* Scope Selection */}
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
                  <div className="w-8 h-8 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center mb-2">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm tracking-wide">{option.label}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
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

// Enhanced Quick Actions Component
const QuickActions = ({ onNewRequest, onExport, onRefresh, loading }) => {
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={onExport}
        className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold tracking-wide shadow-sm hover:shadow-md"
      >
        <Download className="h-4 w-4" />
        Export Data
      </button>
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="p-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      </button>
      <button 
        onClick={onNewRequest}
        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-bold tracking-wide"
      >
        <Plus className="h-4 w-4" />
        New Request
      </button>
    </div>
  );
};

// Main Component - Clean Professional Design
export default function PremiumLeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({ leaves: false, stats: false, balance: false });
  const [viewMode, setViewMode] = useState('grid');
  const [showBalance, setShowBalance] = useState(false);
  const [expandedBalances, setExpandedBalances] = useState({});
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadData, setDownloadData] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(getDefaultBalance());

  // Enhanced data fetching
  const fetchAllData = async () => {
    try {
      setError(null);
      setLoading({ leaves: true, stats: true, balance: true });
      
      const [leavesData, balanceData] = await Promise.all([
        fetchLeaves(), 
        fetchLeaveBalance()
      ]);
      
      setLeaves(leavesData);
      if (balanceData) setLeaveBalance(balanceData);
      setLoading({ leaves: false, stats: false, balance: false });
    } catch (err) {
      setError(err.message);
      setLoading({ leaves: false, stats: false, balance: false });
    }
  };

  // Enhanced form success handler
  const handleFormSuccess = (message) => {
    setSuccess(message);
    fetchAllData();
    setTimeout(() => setSuccess(null), 5000);
  };

  // Enhanced status update
  const handleStatusUpdate = async (leaveId, newStatus) => {
    try {
      await updateLeaveStatus(leaveId, newStatus);
      setLeaves(prev => prev.map(leave => 
        leave.id === leaveId ? { ...leave, status: newStatus } : leave
      ));
      setSuccess(`Leave status updated to ${newStatus}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to update leave status: ${error.message}`);
    }
  };

  // FIXED: Enhanced leave update handler with PATCH method
  const handleLeaveUpdate = async (leaveId, leaveData) => {
    try {
      const updatedLeave = await updateLeave(leaveId, leaveData);
      setLeaves(prev => prev.map(leave => 
        leave.id === leaveId ? { ...leave, ...updatedLeave } : leave
      ));
      setEditData(null);
      setSuccess('Leave application updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to update leave: ${error.message}`);
    }
  };

  // Enhanced delete handler with confirmation
  const handleDeleteLeave = async (leaveId) => {
    if (!confirm('Are you sure you want to delete this leave application? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteLeave(leaveId);
      setLeaves(prev => prev.filter(leave => leave.id !== leaveId));
      setSelectedLeave(null);
      setSuccess('Leave application deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to delete leave: ${error.message}`);
    }
  };

  // Enhanced download handler with fixed Excel formatting
  const handleDownload = async (data, format, scope) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const filename = scope === 'individual' 
        ? `leave-${data.employee_id}-${today}`
        : `leave-report-${today}`;
      
      if (format === 'excel') {
        downloadCSV(scope === 'individual' ? [data] : leaves, filename);
      } else {
        await downloadPDF(scope === 'individual' ? data : leaves, filename, scope);
      }
      
      setSuccess(`Report downloaded successfully as ${format.toUpperCase()}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to download report');
    }
  };

  // Toggle balance expansion
  const toggleBalanceExpansion = (type) => {
    setExpandedBalances(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Enhanced filtering with better search
  const filteredLeaves = useMemo(() => {
    let filtered = leaves;
    
    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(leave => leave.status === filter);
    }
    
    // Enhanced search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(leave => 
        leave.employee_name?.toLowerCase().includes(searchLower) ||
        leave.leave_type?.toLowerCase().includes(searchLower) ||
        leave.employee_id?.toLowerCase().includes(searchLower) ||
        leave.position?.toLowerCase().includes(searchLower) ||
        leave.contact_number?.includes(searchTerm)
      );
    }
    
    return filtered;
  }, [leaves, filter, searchTerm]);

  // Calculate real-time stats from actual data
  const stats = useMemo(() => {
    const total = leaves.length;
    const pending = leaves.filter(leave => leave.status === 'pending').length;
    const approved = leaves.filter(leave => leave.status === 'approved').length;
    const rejected = leaves.filter(leave => leave.status === 'rejected').length;
    const today = new Date().toISOString().split('T')[0];
    const on_leave_now = leaves.filter(leave => 
      leave.status === 'approved' && 
      leave.start_date <= today && 
      leave.end_date >= today
    ).length;

    // Calculate approval rate
    const decided = approved + rejected;
    const approvalRate = decided > 0 ? Math.round((approved / decided) * 100) : 0;
    
    return { 
      total, 
      pending, 
      approved, 
      rejected, 
      on_leave_now,
      approvalRate 
    };
  }, [leaves]);

  // Initial data fetch
  useEffect(() => { 
    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Clean Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Leave Management</h1>
                <p className="text-sm text-gray-600 font-medium">Professional leave tracking platform</p>
              </div>
            </div>
            
            <QuickActions 
              onNewRequest={() => setShowForm(true)}
              onExport={() => {
                setDownloadData(leaves);
                setShowDownloadModal(true);
              }}
              onRefresh={fetchAllData}
              loading={loading.leaves}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
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
          <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3">
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

        {/* Enhanced Statistics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Requests" 
            value={stats.total} 
            icon={FileText} 
            onClick={() => setFilter('all')}
          />
          <StatCard 
            title="Pending Review" 
            value={stats.pending} 
            icon={Clock} 
            onClick={() => setFilter('pending')}
          />
          <StatCard 
            title="Approved" 
            value={stats.approved} 
            icon={CheckCircle2} 
            onClick={() => setFilter('approved')}
          />
          <StatCard 
            title="On Leave" 
            value={stats.on_leave_now} 
            icon={User} 
            subtitle={`${stats.approvalRate}% approval rate`}
          />
        </div>

        {/* Enhanced Leave Balance Summary */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors border-b-2 border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-900 tracking-wide">My Leave Balance</h2>
                <p className="text-sm text-gray-600 font-medium">Available leave days and usage overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">{showBalance ? 'Hide' : 'Show'} balances</span>
              {showBalance ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </button>

          {showBalance && (
            <div className="p-8 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(leaveBalance).map(([key, data]) => (
                  <LeaveBalanceCard 
                    key={key} 
                    type={key} 
                    data={data} 
                    isExpanded={expandedBalances[key]}
                    onToggle={() => toggleBalanceExpansion(key)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Leave Records Section */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b-2 border-gray-200">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 tracking-wide">Leave Requests</h2>
                <p className="text-sm text-gray-600 font-medium">Manage and review all leave applications</p>
              </div>
              
              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                {/* Enhanced View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 border-2 border-gray-200">
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
                </select>
              </div>
            </div>
          </div>

          <div className="p-8">
            {loading.leaves ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                  <p className="text-gray-600 font-semibold">Loading leave records...</p>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              // Enhanced Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLeaves.map((leave) => (
                  <LeaveCard 
                    key={leave.id} 
                    leave={leave} 
                    onView={setSelectedLeave}
                    onDownload={(data) => {
                      setDownloadData(data);
                      setShowDownloadModal(true);
                    }}
                    onEdit={setEditData}
                    onDelete={handleDeleteLeave}
                  />
                ))}
              </div>
            ) : (
              // Enhanced List View
              <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      {['Employee', 'Leave Type', 'Period', 'Duration', 'Status', 'Applied', 'Actions'].map(header => (
                        <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-gray-900">{leave.employee_name}</p>
                            <p className="text-sm text-gray-500 font-medium">{leave.position} • {leave.employee_id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${LEAVE_TYPES[leave.leave_type]?.bgColor} border-2 ${LEAVE_TYPES[leave.leave_type]?.borderColor}`}>
                              {React.createElement(LEAVE_TYPES[leave.leave_type]?.icon || FileText, { 
                                className: `h-3.5 w-3.5 ${LEAVE_TYPES[leave.leave_type]?.textColor}` 
                              })}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {LEAVE_TYPES[leave.leave_type]?.shortName || leave.leave_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                          {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                          {leave.total_days} days
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={leave.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                          {formatTime(leave.applied_date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedLeave(leave)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                            <button 
                              onClick={() => setEditData(leave)}
                              className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading.leaves && filteredLeaves.length === 0 && (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-bold text-gray-900 mb-2 tracking-wide">No leave requests found</p>
                <p className="text-sm text-gray-600 mb-6 font-medium">
                  {leaves.length === 0 
                    ? "Get started by creating your first leave request." 
                    : "No requests match your current filters."
                  }
                </p>
                {leaves.length === 0 && (
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-bold tracking-wide"
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
        <LeaveApplicationForm 
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }} 
          onSuccess={handleFormSuccess}
          editData={editData}
          onUpdate={handleLeaveUpdate}
        />
      )}

      {selectedLeave && (
        <LeaveDetailsModal 
          leave={selectedLeave} 
          onClose={() => setSelectedLeave(null)} 
          onStatusUpdate={handleStatusUpdate} 
          onDelete={handleDeleteLeave} 
          onDownload={handleDownload}
          onEdit={setEditData}
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
        <LeaveApplicationForm 
          onClose={() => setEditData(null)} 
          onSuccess={handleFormSuccess}
          editData={editData}
          onUpdate={handleLeaveUpdate}
        />
      )}
    </div>
  );
}

// Enhanced Leave Details Modal with Edit Feature
const LeaveDetailsModal = ({ leave, onClose, onStatusUpdate, onDelete, onDownload, onEdit }) => {
  const [showActions, setShowActions] = useState(false);
  const [updating, setUpdating] = useState(false);
  const selectedLeaveType = LEAVE_TYPES[leave.leave_type];

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(leave.id, newStatus);
      setShowActions(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this leave application? This action cannot be undone.')) {
      return;
    }

    setUpdating(true);
    try {
      await onDelete(leave.id);
      setShowActions(false);
    } catch (error) {
      console.error('Error deleting leave:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDownload = () => {
    onDownload(leave, 'pdf', 'individual');
  };

  const handleEdit = () => {
    onEdit(leave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200">
        <div className="p-6 border-b-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${selectedLeaveType.bgColor} border-2 ${selectedLeaveType.borderColor}`}>
                {React.createElement(selectedLeaveType.icon, { className: `h-6 w-6 ${selectedLeaveType.textColor}` })}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-wide">Leave Application Details</h2>
                <p className="text-sm text-gray-600 font-medium">{selectedLeaveType.name} • {leave.employee_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Prominent Download Button */}
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              {/* Edit Button */}
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <div className="relative">
                <button onClick={() => setShowActions(!showActions)} disabled={updating} className="p-2 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors text-gray-400 hover:text-gray-600 border-2 border-gray-200">
                  <MoreVertical className="h-5 w-5" />
                </button>
                {showActions && (
                  <div className="absolute right-0 top-10 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-10 min-w-[200px] overflow-hidden">
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
              <button onClick={onClose} disabled={updating} className="p-2 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors text-gray-400 hover:text-gray-600 border-2 border-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {updating && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
              <span className="text-blue-700 font-semibold">Updating request...</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                  <User className="h-5 w-5 text-gray-600" />
                  Employee Information
                </h3>
                <div className="space-y-3">
                  <div><p className="text-sm text-gray-600 font-semibold">Full Name</p><p className="font-bold text-gray-900">{leave.employee_name}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Employee ID</p><p className="font-bold text-gray-900">{leave.employee_id}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Position</p><p className="font-bold text-gray-900">{leave.position}</p></div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                  <Phone className="h-5 w-5 text-gray-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div><p className="text-sm text-gray-600 font-semibold">Contact Number</p><p className="font-bold text-gray-900">{leave.contact_number}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Emergency Contact</p><p className="font-bold text-gray-900">{leave.emergency_contact || 'Not provided'}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Handover Person</p><p className="font-bold text-gray-900">{leave.handover_to || 'Not specified'}</p></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Leave Details */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Leave Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedLeaveType.bgColor} border-2 ${selectedLeaveType.borderColor}`}>
                      {React.createElement(selectedLeaveType.icon, { className: `h-4 w-4 ${selectedLeaveType.textColor}` })}
                    </div>
                    <div><p className="text-sm text-gray-600 font-semibold">Leave Type</p><p className="font-bold text-gray-900">{selectedLeaveType.name}</p></div>
                  </div>
                  <div><p className="text-sm text-gray-600 font-semibold">Status</p><div className="mt-1"><StatusBadge status={leave.status} /></div></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Start Date</p><p className="font-bold text-gray-900">{formatDate(leave.start_date)}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">End Date</p><p className="font-bold text-gray-900">{formatDate(leave.end_date)}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Total Days</p><p className="font-bold text-gray-900">{leave.total_days} days</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Applied On</p><p className="font-bold text-gray-900">{formatTime(leave.applied_date)}</p></div>
                </div>
              </div>

              {/* Reason for Leave */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Reason for Leave
                </h3>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed font-semibold">{leave.reason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Leave Application Form with Update Support
const LeaveApplicationForm = ({ onClose, onSuccess, editData, onUpdate }) => {
  const [formData, setFormData] = useState(editData || {
    employee_name: '', employee_id: '', position: '', leave_type: 'annual',
    start_date: '', end_date: '', reason: '', contact_number: '', 
    emergency_contact: '', handover_to: ''
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
          !formData.start_date || !formData.end_date || !formData.reason || !formData.contact_number) {
        throw new Error('Please fill in all required fields');
      }

      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        throw new Error('End date must be after start date');
      }

      if (editData) {
        await onUpdate(editData.id, formData);
      } else {
        await createLeave(formData);
      }
      
      onSuccess(editData ? 'Leave application updated successfully!' : 'Leave application submitted successfully!');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculatedDays = calculateDays(formData.start_date, formData.end_date);
  const selectedLeaveType = LEAVE_TYPES[formData.leave_type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200">
        <div className="p-6 border-b-2 border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-wide">
              {editData ? 'Edit Leave Application' : 'New Leave Request'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-lg transition-colors border-2 border-gray-200">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
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
              { label: 'Employee ID', field: 'employee_id', type: 'text', placeholder: 'e.g., MNT001', required: true },
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
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select 
                required 
                value={formData.leave_type} 
                onChange={(e) => handleChange('leave_type', e.target.value)} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
              >
                {Object.entries(LEAVE_TYPES).map(([key, type]) => 
                  <option key={key} value={key}>{type.name}</option>
                )}
              </select>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedLeaveType.bgColor} border-2 ${selectedLeaveType.borderColor}`}>
                  {React.createElement(selectedLeaveType.icon, { className: `h-5 w-5 ${selectedLeaveType.textColor}` })}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedLeaveType.name}</p>
                  <p className="text-sm text-gray-600 font-medium">{selectedLeaveType.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                required 
                value={formData.start_date} 
                onChange={(e) => handleChange('start_date', e.target.value)} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                End Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                required 
                value={formData.end_date} 
                onChange={(e) => handleChange('end_date', e.target.value)} 
                min={formData.start_date}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
              />
            </div>
          </div>

          {calculatedDays > 0 && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total Leave Days:</span>
                <span className="text-lg font-bold text-emerald-600">{calculatedDays} days</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              Reason for Leave <span className="text-red-500">*</span>
            </label>
            <textarea 
              required 
              value={formData.reason} 
              onChange={(e) => handleChange('reason', e.target.value)} 
              rows={4} 
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
              placeholder="Please provide details about your leave request..." 
            />
          </div>

          {/* Advanced Options */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Handover To</label>
                    <input 
                      type="text" 
                      value={formData.handover_to} 
                      onChange={(e) => handleChange('handover_to', e.target.value)} 
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
                      placeholder="Colleague's name" 
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