"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Shield, Plus, Search, RefreshCw, Filter, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Send, Phone, Trash2, MoreVertical,
  Download, Edit, X, HardHat, Zap, ArrowUpRight, TrendingUp,
  BarChart3, Users, Briefcase, FileDown, List, LayoutGrid,
  Mail, Copy, Share2, Bookmark, PieChart, Package, ShoppingCart,
  AlertTriangle, ThumbsUp, ThumbsDown, Calendar, MapPin, Tag,
  Mountain, Gem, Landmark, Drill, Pickaxe, Factory, UserCheck,
  Building, Settings, Award, Crown, AlertOctagon, FileWarning,
  Target, ClipboardCheck, Flag, Clock4, UserCog, CalendarDays
} from "lucide-react";

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const SHEQ_API = `${API_BASE}/api/sheq`;

// SHEQ Report Types
const SHEQ_TYPES = {
  hazard: {
    name: 'Hazard Report',
    description: 'Report workplace hazards and suggest improvements',
    icon: AlertOctagon,
    color: 'bg-gradient-to-br from-orange-500 to-amber-500',
    formType: 'hazard'
  },
  near_miss: {
    name: 'Near Miss Report',
    description: 'Report incidents that could have resulted in injury',
    icon: FileWarning,
    color: 'bg-gradient-to-br from-amber-500 to-yellow-500',
    formType: 'near_miss'
  },
  incident: {
    name: 'Incident Report',
    description: 'Report actual incidents and injuries',
    icon: AlertTriangle,
    color: 'bg-gradient-to-br from-red-500 to-rose-600',
    formType: 'incident'
  },
  pto: {
    name: 'Planned Task Observation',
    description: 'Supervisor observations of work practices',
    icon: ClipboardCheck,
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    formType: 'pto'
  }
};

// Priority Levels
const PRIORITY_LEVELS = {
  low: { 
    name: 'Low', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    icon: Flag,
    bgColor: 'bg-emerald-100'
  },
  medium: { 
    name: 'Medium', 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    icon: Flag,
    bgColor: 'bg-amber-100'
  },
  high: { 
    name: 'High', 
    color: 'bg-orange-50 text-orange-700 border-orange-200', 
    icon: Flag,
    bgColor: 'bg-orange-100'
  },
  critical: { 
    name: 'Critical', 
    color: 'bg-rose-50 text-rose-700 border-rose-200', 
    icon: Flag,
    bgColor: 'bg-rose-100'
  }
};

// Status Types
const STATUS_TYPES = {
  open: { 
    name: 'Open', 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    icon: Clock,
    bgColor: 'bg-blue-100'
  },
  in_progress: { 
    name: 'In Progress', 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    icon: RefreshCw,
    bgColor: 'bg-amber-100'
  },
  resolved: { 
    name: 'Resolved', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    icon: CheckCircle2,
    bgColor: 'bg-emerald-100'
  },
  closed: { 
    name: 'Closed', 
    color: 'bg-slate-100 text-slate-700 border-slate-300', 
    icon: CheckCircle2,
    bgColor: 'bg-slate-200'
  }
};

// Mine Locations
const MINE_LOCATIONS = {
  'Deep Shaft A': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Drill },
  'Deep Shaft B': { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Drill },
  'Open Pit': { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Mountain },
  'Processing Plant': { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Factory },
  'Workshop': { color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Settings },
  'Surface Operations': { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Landmark },
  'All Areas': { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Gem }
};

// Departments
const DEPARTMENTS = [
  'MAINTENANCE',
  'UNDERGROUND MINING',
  'OPEN PIT MINING',
  'PROCESSING',
  'SAFETY',
  'ADMINISTRATION',
  'LOGISTICS'
];

// Utility Functions
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

const formatDateTime = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// API Functions
const fetchSHEQReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.append(key, value);
      }
    });

    const url = `${SHEQ_API}${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('🔍 Fetching SHEQ reports from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching SHEQ reports:', error);
    throw error;
  }
};

const fetchSHEQStats = async () => {
  try {
    const response = await fetch(`${SHEQ_API}/stats/summary`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching SHEQ stats:', error);
    return null;
  }
};

const fetchEmployeesList = async () => {
  try {
    const response = await fetch(`${SHEQ_API}/employees`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching employees list:', error);
    return [];
  }
};

const createSHEQReport = async (reportData) => {
  try {
    console.log('📝 Creating SHEQ report with data:', reportData);

    const response = await fetch(SHEQ_API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ SHEQ report created successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error creating SHEQ report:', error);
    throw new Error(`Failed to create SHEQ report: ${error.message}`);
  }
};

const updateSHEQReport = async (reportId, reportData) => {
  try {
    const response = await fetch(`${SHEQ_API}/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating SHEQ report:', error);
    throw error;
  }
};

const deleteSHEQReport = async (reportId) => {
  try {
    const response = await fetch(`${SHEQ_API}/${reportId}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting SHEQ report:', error);
    throw error;
  }
};

// Download Functions
const downloadSHEQCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = [
    'Report Type', 'Report ID', 'Employee Name', 'Employee ID', 'Department',
    'Position', 'Location', 'Date Reported', 'Priority', 'Status',
    'Description', 'Hazard Description', 'Incident Description', 'Near Miss Description',
    'Corrective Actions', 'Responsible Person', 'Due Date', 'Reported By'
  ];

  const csvData = data.map(report => [
    `"${SHEQ_TYPES[report.report_type]?.name || report.report_type}"`,
    report.id,
    `"${(report.employee_name || '').replace(/"/g, '""')}"`,
    `"${(report.employee_id || '').replace(/"/g, '""')}"`,
    `"${(report.department || '').replace(/"/g, '""')}"`,
    `"${(report.position || '').replace(/"/g, '""')}"`,
    `"${(report.location || '').replace(/"/g, '""')}"`,
    `"${formatDateTime(report.date_reported)}"`,
    `"${PRIORITY_LEVELS[report.priority]?.name || report.priority}"`,
    `"${STATUS_TYPES[report.status]?.name || report.status}"`,
    `"${(report.description || '').replace(/"/g, '""')}"`,
    `"${(report.hazard_description || '').replace(/"/g, '""')}"`,
    `"${(report.incident_description || '').replace(/"/g, '""')}"`,
    `"${(report.near_miss_description || '').replace(/"/g, '""')}"`,
    `"${(report.corrective_actions || '').replace(/"/g, '""')}"`,
    `"${(report.responsible_person || '').replace(/"/g, '""')}"`,
    `"${formatDate(report.due_date)}"`,
    `"${(report.reported_by || '').replace(/"/g, '""')}"`
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

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = STATUS_TYPES[status] || STATUS_TYPES.open;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-semibold tracking-wide">{config.name}</span>
    </span>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_LEVELS[priority] || PRIORITY_LEVELS.medium;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-semibold tracking-wide">{config.name}</span>
    </span>
  );
};

// Location Badge Component
const LocationBadge = ({ location }) => {
  const config = MINE_LOCATIONS[location] || { color: 'bg-slate-100 text-slate-700 border-slate-300', icon: MapPin };
  const Icon = config.icon || MapPin;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-semibold tracking-wide">{location}</span>
    </span>
  );
};

// Form Field Component
const FormField = ({ label, htmlFor, required, error, children, description }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-semibold text-slate-700 tracking-wide"
      >
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {error && (
        <span className="text-xs font-medium text-rose-600">
          {error}
        </span>
      )}
    </div>
    {description && (
      <p className="text-xs text-slate-500 font-medium">{description}</p>
    )}
    {children}
  </div>
);

// Stat Card Component
const StatCard = ({ title, value, icon, onClick, subtitle, color = "slate", trend }) => {
  const Icon = icon;
  const colorClasses = {
    slate: 'from-slate-600 to-slate-700',
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    rose: 'from-rose-500 to-rose-600',
    orange: 'from-orange-500 to-orange-600',
    amber: 'from-amber-500 to-amber-600'
  };
  
  return (
    <div 
      className="group bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-slate-600 tracking-wide">{title}</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            <TrendingUp className={`h-3 w-3 ${trend > 0 ? '' : 'rotate-180'}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};

// SHEQ Report Card Component
const SHEQReportCard = ({ report, onView, onEdit, onDelete }) => {
  const reportType = SHEQ_TYPES[report.report_type] || SHEQ_TYPES.hazard;
  const Icon = reportType.icon;
  const [showActions, setShowActions] = useState(false);
  
  const isOverdueItem = isOverdue(report.due_date);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${reportType.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-wide">{reportType.name}</h3>
            <p className="text-sm text-slate-600 font-medium">Report #{report.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={report.priority} />
          <StatusBadge status={report.status} />
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-600 border border-slate-200"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-xl z-10 min-w-[180px] overflow-hidden">
                <button 
                  onClick={() => { onView(report); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors border-b border-slate-100 font-semibold"
                >
                  <Eye className="h-4 w-4" /> View Details
                </button>
                <button 
                  onClick={() => { onEdit(report); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors border-b border-slate-100 font-semibold"
                >
                  <Edit className="h-4 w-4" /> Edit Report
                </button>
                <div className="border-t border-slate-200">
                  <button 
                    onClick={() => { onDelete(report.id); setShowActions(false); }}
                    className="w-full px-4 py-3 text-left text-sm text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors font-semibold"
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
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-semibold">Reported By</span>
          <span className="font-bold text-slate-900">{report.employee_name}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-semibold">Employee ID</span>
          <span className="font-medium text-slate-900">{report.employee_id}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-semibold">Department</span>
          <span className="font-medium text-slate-900">{report.department}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-semibold">Location</span>
          <LocationBadge location={report.location} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-semibold">Date Reported</span>
          <span className="font-medium text-slate-900">{formatDateTime(report.date_reported)}</span>
        </div>
        {report.due_date && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-semibold">Due Date</span>
            <span className={`font-medium ${isOverdueItem ? 'text-rose-600' : 'text-slate-900'}`}>
              {formatDate(report.due_date)}
              {isOverdueItem && (
                <span className="ml-1 inline-flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Overdue
                </span>
              )}
            </span>
          </div>
        )}
        {report.responsible_person && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-semibold">Responsible Person</span>
            <span className="font-medium text-slate-900">{report.responsible_person}</span>
          </div>
        )}
      </div>

      {report.description && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed font-medium">{report.description}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={() => onView(report)}
          className="flex-1 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
          View Details
        </button>
        <button 
          onClick={() => onEdit(report)}
          className="px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center"
          title="Edit Report"
          aria-label="Edit report"
        >
          <Edit className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions = ({ onNewReport, onRefresh, onExport, loading, activeForm }) => {
  const reportType = SHEQ_TYPES[activeForm] || SHEQ_TYPES.hazard;
  
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={onExport}
        className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold tracking-wide shadow-sm hover:shadow-md"
        aria-label="Export data"
      >
        <Download className="h-4 w-4" />
        Export Data
      </button>
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="p-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
        aria-label="Refresh data"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      </button>
      <button 
        onClick={onNewReport}
        className="px-5 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl hover:opacity-90 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
        aria-label="Create new report"
      >
        <Plus className="h-4 w-4" />
        New {reportType.name}
      </button>
    </div>
  );
};

// SHEQ Form Component
const SHEQForm = ({ isOpen, onClose, onSubmit, initialData, formType }) => {
  const [formData, setFormData] = useState({
    report_type: formType,
    employee_name: initialData?.employee_name || '',
    employee_id: initialData?.employee_id || '',
    department: initialData?.department || 'MAINTENANCE',
    position: initialData?.position || '',
    location: initialData?.location || 'Workshop',
    date_reported: initialData?.date_reported || new Date().toISOString().split('T')[0],
    time_reported: initialData?.time_reported || new Date().toTimeString().slice(0, 5),
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'open',
    
    // Hazard Report Fields
    hazard_description: initialData?.hazard_description || '',
    risk_assessment: initialData?.risk_assessment || '',
    suggested_improvements: initialData?.suggested_improvements || '',
    requirements: initialData?.requirements || '',
    
    // Near Miss Fields
    near_miss_description: initialData?.near_miss_description || '',
    potential_severity: initialData?.potential_severity || '',
    immediate_causes: initialData?.immediate_causes || '',
    root_causes: initialData?.root_causes || '',
    
    // Incident Fields
    incident_description: initialData?.incident_description || '',
    incident_type: initialData?.incident_type || 'near_miss',
    injury_type: initialData?.injury_type || '',
    property_damage: initialData?.property_damage || '',
    environmental_impact: initialData?.environmental_impact || '',
    immediate_actions: initialData?.immediate_actions || '',
    
    // PTO Fields
    supervisor_name: initialData?.supervisor_name || '',
    supervisor_id: initialData?.supervisor_id || '',
    employee_observed: initialData?.employee_observed || '',
    employee_observed_id: initialData?.employee_observed_id || '',
    task_observed: initialData?.task_observed || '',
    safe_behaviors: initialData?.safe_behaviors || '',
    at_risk_behaviors: initialData?.at_risk_behaviors || '',
    recommendations: initialData?.recommendations || '',
    
    // Common Fields
    description: initialData?.description || '',
    corrective_actions: initialData?.corrective_actions || '',
    responsible_person: initialData?.responsible_person || '',
    due_date: initialData?.due_date || '',
    completion_date: initialData?.completion_date || '',
    notes: initialData?.notes || '',
    reported_by: initialData?.reported_by || '',
    assigned_to: initialData?.assigned_to || ''
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const reportType = SHEQ_TYPES[formType] || SHEQ_TYPES.hazard;

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.employee_name?.trim()) {
      errors.employee_name = 'Employee name is required';
    }
    if (!formData.employee_id?.trim()) {
      errors.employee_id = 'Employee ID is required';
    }
    if (!formData.department?.trim()) {
      errors.department = 'Department is required';
    }
    if (!formData.location?.trim()) {
      errors.location = 'Location is required';
    }
    if (!formData.date_reported) {
      errors.date_reported = 'Date reported is required';
    }

    // Form-specific validations
    if (formType === 'hazard' && !formData.hazard_description?.trim()) {
      errors.hazard_description = 'Hazard description is required';
    }
    if (formType === 'near_miss' && !formData.near_miss_description?.trim()) {
      errors.near_miss_description = 'Near miss description is required';
    }
    if (formType === 'incident' && !formData.incident_description?.trim()) {
      errors.incident_description = 'Incident description is required';
    }
    if (formType === 'pto') {
      if (!formData.supervisor_name?.trim()) {
        errors.supervisor_name = 'Supervisor name is required';
      }
      if (!formData.task_observed?.trim()) {
        errors.task_observed = 'Task observed is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        employee_name: formData.employee_name.trim(),
        employee_id: formData.employee_id.trim(),
        due_date: formData.due_date || null,
        completion_date: formData.completion_date || null,
        reported_by: formData.reported_by || formData.employee_name
      };
      
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 z-10 bg-white p-6 border-b border-slate-200 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${reportType.color} text-white shadow-lg`}>
                <reportType.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {initialData ? 'Edit' : 'New'} {reportType.name}
                </h2>
                <p className="text-sm text-slate-600 font-medium">{reportType.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              type="button"
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
              aria-label="Close form"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Form Errors Summary */}
          {Object.keys(formErrors).length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <p className="text-rose-800 font-semibold">Please fix the following errors:</p>
              </div>
              <ul className="text-sm text-rose-700 list-disc list-inside space-y-1">
                {Object.entries(formErrors).map(([field, error]) => (
                  error && <li key={field} className="font-medium">{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-8">
            {/* Basic Information Section */}
            <section>
              <h3 className="text-base font-bold text-slate-800 mb-4 tracking-wide">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Employee Name" 
                  htmlFor="employee_name"
                  required
                  error={formErrors.employee_name}
                >
                  <input
                    type="text"
                    id="employee_name"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.employee_name ? 'border-rose-300' : 'border-slate-300'
                    }`}
                    placeholder="Enter employee name"
                  />
                </FormField>

                <FormField 
                  label="Employee ID" 
                  htmlFor="employee_id"
                  required
                  error={formErrors.employee_id}
                >
                  <input
                    type="text"
                    id="employee_id"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.employee_id ? 'border-rose-300' : 'border-slate-300'
                    }`}
                    placeholder="Enter employee ID"
                  />
                </FormField>

                <FormField 
                  label="Department" 
                  htmlFor="department"
                  required
                  error={formErrors.department}
                >
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.department ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Position" htmlFor="position">
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    placeholder="Enter position"
                  />
                </FormField>

                <FormField 
                  label="Location" 
                  htmlFor="location"
                  required
                  error={formErrors.location}
                >
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.location ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  >
                    {Object.keys(MINE_LOCATIONS).map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </FormField>

                <FormField 
                  label="Date Reported" 
                  htmlFor="date_reported"
                  required
                  error={formErrors.date_reported}
                >
                  <input
                    type="date"
                    id="date_reported"
                    name="date_reported"
                    value={formData.date_reported}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.date_reported ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                </FormField>

                <FormField label="Time Reported" htmlFor="time_reported">
                  <input
                    type="time"
                    id="time_reported"
                    name="time_reported"
                    value={formData.time_reported}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </FormField>

                <FormField label="Priority" htmlFor="priority">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  >
                    {Object.entries(PRIORITY_LEVELS).map(([key, priority]) => (
                      <option key={key} value={key}>{priority.name}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Status" htmlFor="status">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  >
                    {Object.entries(STATUS_TYPES).map(([key, status]) => (
                      <option key={key} value={key}>{status.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </section>

            {/* Form Specific Fields */}
            {formType === 'hazard' && (
              <section>
                <h3 className="text-base font-bold text-slate-800 mb-4 tracking-wide">Hazard Details</h3>
                <div className="space-y-4">
                  <FormField 
                    label="Hazard Description" 
                    htmlFor="hazard_description"
                    required
                    error={formErrors.hazard_description}
                    description="Describe the hazard in detail"
                  >
                    <textarea
                      id="hazard_description"
                      name="hazard_description"
                      value={formData.hazard_description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none ${
                        formErrors.hazard_description ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder="Describe the hazard in detail..."
                    />
                  </FormField>

                  <FormField 
                    label="Risk Assessment" 
                    htmlFor="risk_assessment"
                    description="Assess the potential risks and consequences"
                  >
                    <textarea
                      id="risk_assessment"
                      name="risk_assessment"
                      value={formData.risk_assessment}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="Assess the potential risks..."
                    />
                  </FormField>

                  <FormField 
                    label="Suggested Improvements" 
                    htmlFor="suggested_improvements"
                    description="Suggest improvements to address the hazard"
                  >
                    <textarea
                      id="suggested_improvements"
                      name="suggested_improvements"
                      value={formData.suggested_improvements}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="Suggest improvements to address the hazard..."
                    />
                  </FormField>

                  <FormField 
                    label="Requirements for Improvement" 
                    htmlFor="requirements"
                    description="List specific requirements needed for improvement"
                  >
                    <textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="List specific requirements needed..."
                    />
                  </FormField>
                </div>
              </section>
            )}

            {formType === 'near_miss' && (
              <section>
                <h3 className="text-base font-bold text-slate-800 mb-4 tracking-wide">Near Miss Details</h3>
                <div className="space-y-4">
                  <FormField 
                    label="Near Miss Description" 
                    htmlFor="near_miss_description"
                    required
                    error={formErrors.near_miss_description}
                    description="Describe what happened and how injury was avoided"
                  >
                    <textarea
                      id="near_miss_description"
                      name="near_miss_description"
                      value={formData.near_miss_description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none ${
                        formErrors.near_miss_description ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder="Describe what happened and how injury was avoided..."
                    />
                  </FormField>

                  <FormField 
                    label="Potential Severity" 
                    htmlFor="potential_severity"
                    description="Select the potential severity of the incident"
                  >
                    <select
                      id="potential_severity"
                      name="potential_severity"
                      value={formData.potential_severity}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    >
                      <option value="">Select Potential Severity</option>
                      <option value="minor">Minor</option>
                      <option value="moderate">Moderate</option>
                      <option value="serious">Serious</option>
                      <option value="severe">Severe</option>
                      <option value="fatal">Fatal</option>
                    </select>
                  </FormField>

                  <FormField 
                    label="Immediate Causes" 
                    htmlFor="immediate_causes"
                    description="What directly caused the near miss?"
                  >
                    <textarea
                      id="immediate_causes"
                      name="immediate_causes"
                      value={formData.immediate_causes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="What directly caused the near miss?"
                    />
                  </FormField>

                  <FormField 
                    label="Root Causes" 
                    htmlFor="root_causes"
                    description="What are the underlying root causes?"
                  >
                    <textarea
                      id="root_causes"
                      name="root_causes"
                      value={formData.root_causes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="What are the underlying root causes?"
                    />
                  </FormField>
                </div>
              </section>
            )}

            {formType === 'incident' && (
              <section>
                <h3 className="text-base font-bold text-slate-800 mb-4 tracking-wide">Incident Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField 
                      label="Incident Description" 
                      htmlFor="incident_description"
                      required
                      error={formErrors.incident_description}
                      description="Describe the incident in detail"
                    >
                      <textarea
                        id="incident_description"
                        name="incident_description"
                        value={formData.incident_description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none ${
                          formErrors.incident_description ? 'border-rose-300' : 'border-slate-300'
                        }`}
                        placeholder="Describe the incident in detail..."
                      />
                    </FormField>
                  </div>

                  <FormField label="Incident Type" htmlFor="incident_type">
                    <select
                      id="incident_type"
                      name="incident_type"
                      value={formData.incident_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    >
                      <option value="near_miss">Near Miss</option>
                      <option value="first_aid">First Aid Case</option>
                      <option value="medical_treatment">Medical Treatment</option>
                      <option value="lost_time">Lost Time Injury</option>
                      <option value="fatality">Fatality</option>
                      <option value="property_damage">Property Damage</option>
                      <option value="environmental">Environmental Incident</option>
                    </select>
                  </FormField>

                  <FormField label="Injury Type (if applicable)" htmlFor="injury_type">
                    <input
                      type="text"
                      id="injury_type"
                      name="injury_type"
                      value={formData.injury_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                      placeholder="Enter injury type"
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Property Damage" htmlFor="property_damage">
                      <textarea
                        id="property_damage"
                        name="property_damage"
                        value={formData.property_damage}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                        placeholder="Describe any property damage..."
                      />
                    </FormField>
                  </div>

                  <div className="md:col-span-2">
                    <FormField label="Environmental Impact" htmlFor="environmental_impact">
                      <textarea
                        id="environmental_impact"
                        name="environmental_impact"
                        value={formData.environmental_impact}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                        placeholder="Describe any environmental impact..."
                      />
                    </FormField>
                  </div>

                  <div className="md:col-span-2">
                    <FormField label="Immediate Actions Taken" htmlFor="immediate_actions">
                      <textarea
                        id="immediate_actions"
                        name="immediate_actions"
                        value={formData.immediate_actions}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                        placeholder="What immediate actions were taken?"
                      />
                    </FormField>
                  </div>
                </div>
              </section>
            )}

            {formType === 'pto' && (
              <section>
                <h3 className="text-base font-bold text-slate-800 mb-4 tracking-wide">Observation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Supervisor Name" 
                    htmlFor="supervisor_name"
                    required
                    error={formErrors.supervisor_name}
                  >
                    <input
                      type="text"
                      id="supervisor_name"
                      name="supervisor_name"
                      value={formData.supervisor_name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                        formErrors.supervisor_name ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder="Enter supervisor name"
                    />
                  </FormField>

                  <FormField label="Supervisor ID" htmlFor="supervisor_id">
                    <input
                      type="text"
                      id="supervisor_id"
                      name="supervisor_id"
                      value={formData.supervisor_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                      placeholder="Enter supervisor ID"
                    />
                  </FormField>

                  <FormField label="Employee Observed" htmlFor="employee_observed">
                    <input
                      type="text"
                      id="employee_observed"
                      name="employee_observed"
                      value={formData.employee_observed}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                      placeholder="Enter employee observed name"
                    />
                  </FormField>

                  <FormField label="Employee Observed ID" htmlFor="employee_observed_id">
                    <input
                      type="text"
                      id="employee_observed_id"
                      name="employee_observed_id"
                      value={formData.employee_observed_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                      placeholder="Enter employee observed ID"
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField 
                      label="Task Observed" 
                      htmlFor="task_observed"
                      required
                      error={formErrors.task_observed}
                      description="Describe the task being observed"
                    >
                      <textarea
                        id="task_observed"
                        name="task_observed"
                        value={formData.task_observed}
                        onChange={handleChange}
                        required
                        rows={3}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none ${
                          formErrors.task_observed ? 'border-rose-300' : 'border-slate-300'
                        }`}
                        placeholder="Describe the task being observed..."
                      />
                    </FormField>
                  </div>

                  <FormField label="Safe Behaviors Observed" htmlFor="safe_behaviors">
                    <textarea
                      id="safe_behaviors"
                      name="safe_behaviors"
                      value={formData.safe_behaviors}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="List safe behaviors observed..."
                    />
                  </FormField>

                  <FormField label="At-Risk Behaviors Observed" htmlFor="at_risk_behaviors">
                    <textarea
                      id="at_risk_behaviors"
                      name="at_risk_behaviors"
                      value={formData.at_risk_behaviors}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="List at-risk behaviors observed..."
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Recommendations" htmlFor="recommendations">
                      <textarea
                        id="recommendations"
                        name="recommendations"
                        value={formData.recommendations}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                        placeholder="Provide recommendations for improvement..."
                      />
                    </FormField>
                  </div>
                </div>
              </section>
            )}

            {/* General Description Section */}
            <section>
              <h3 className="text-base font-bold text-slate-800 mb-4 tracking-wide">Additional Information</h3>
              <FormField 
                label="General Description" 
                htmlFor="description"
                description="Any additional description or notes (optional)"
              >
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                  placeholder="Any additional description or notes..."
                />
              </FormField>
            </section>

            {/* Action Plan Section */}
            <section>
              <h3 className="text-base font-bold text-slate-800 mb-4 tracking-wide">Action Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField 
                    label="Corrective Actions" 
                    htmlFor="corrective_actions"
                    description="Describe corrective actions to be taken"
                  >
                    <textarea
                      id="corrective_actions"
                      name="corrective_actions"
                      value={formData.corrective_actions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="Describe corrective actions to be taken..."
                    />
                  </FormField>
                </div>

                <FormField label="Responsible Person" htmlFor="responsible_person">
                  <input
                    type="text"
                    id="responsible_person"
                    name="responsible_person"
                    value={formData.responsible_person}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    placeholder="Enter responsible person"
                  />
                </FormField>

                <FormField label="Assigned To" htmlFor="assigned_to">
                  <input
                    type="text"
                    id="assigned_to"
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    placeholder="Enter assigned person"
                  />
                </FormField>

                <FormField label="Due Date" htmlFor="due_date">
                  <input
                    type="date"
                    id="due_date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </FormField>

                <FormField label="Completion Date" htmlFor="completion_date">
                  <input
                    type="date"
                    id="completion_date"
                    name="completion_date"
                    value={formData.completion_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Additional Notes" htmlFor="notes">
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="Any additional notes or comments..."
                    />
                  </FormField>
                </div>
              </div>
            </section>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold tracking-wide"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {initialData ? 'Update Report' : 'Create Report'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Report Details Modal
const ReportDetailsModal = ({ report, isOpen, onClose, onEdit }) => {
  const reportType = SHEQ_TYPES[report?.report_type] || SHEQ_TYPES.hazard;
  const Icon = reportType.icon;

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 z-10 bg-white p-6 border-b border-slate-200 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${reportType.color} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {reportType.name} - Report #{report.id}
                </h2>
                <p className="text-sm text-slate-600 font-medium">
                  Reported by {report.employee_name} on {formatDateTime(report.date_reported)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={report.priority} />
              <StatusBadge status={report.status} />
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                aria-label="Close details"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 tracking-wide">Report Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Report Type:</span>
                  <span className="font-bold text-slate-900">{reportType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Reported By:</span>
                  <span className="font-medium text-slate-900">{report.employee_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Employee ID:</span>
                  <span className="font-medium text-slate-900">{report.employee_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Department:</span>
                  <span className="font-medium text-slate-900">{report.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Position:</span>
                  <span className="font-medium text-slate-900">{report.position || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 tracking-wide">Location & Timing</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Location:</span>
                  <LocationBadge location={report.location} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Date Reported:</span>
                  <span className="font-medium text-slate-900">{formatDateTime(report.date_reported)}</span>
                </div>
                {report.due_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-semibold">Due Date:</span>
                    <span className={`font-medium ${isOverdue(report.due_date) ? 'text-rose-600' : 'text-slate-900'}`}>
                      {formatDate(report.due_date)}
                      {isOverdue(report.due_date) && (
                        <span className="ml-1 inline-flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Overdue
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {report.completion_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-semibold">Completion Date:</span>
                    <span className="font-medium text-slate-900">{formatDate(report.completion_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Specific Details */}
          {report.report_type === 'hazard' && report.hazard_description && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 tracking-wide">Hazard Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Hazard Description</label>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.hazard_description}</p>
                  </div>
                </div>
                {report.risk_assessment && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Risk Assessment</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.risk_assessment}</p>
                    </div>
                  </div>
                )}
                {report.suggested_improvements && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Suggested Improvements</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.suggested_improvements}</p>
                    </div>
                  </div>
                )}
                {report.requirements && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Requirements for Improvement</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.requirements}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {report.report_type === 'near_miss' && report.near_miss_description && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 tracking-wide">Near Miss Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.near_miss_description}</p>
                  </div>
                </div>
                {report.potential_severity && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 font-semibold">Potential Severity:</span>
                    <span className="font-medium text-slate-900 capitalize px-3 py-1 bg-slate-100 rounded-full">
                      {report.potential_severity}
                    </span>
                  </div>
                )}
                {report.immediate_causes && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Immediate Causes</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.immediate_causes}</p>
                    </div>
                  </div>
                )}
                {report.root_causes && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Root Causes</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.root_causes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {report.report_type === 'incident' && report.incident_description && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 tracking-wide">Incident Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  {report.incident_type && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-semibold">Incident Type:</span>
                      <span className="font-medium text-slate-900 capitalize px-3 py-1 bg-slate-100 rounded-full">
                        {report.incident_type.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  {report.injury_type && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-semibold">Injury Type:</span>
                      <span className="font-medium text-slate-900">{report.injury_type}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Incident Description</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.incident_description}</p>
                    </div>
                  </div>
                  {report.immediate_actions && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Immediate Actions Taken</label>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.immediate_actions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {report.report_type === 'pto' && report.task_observed && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 tracking-wide">Observation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  {report.supervisor_name && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-semibold">Supervisor:</span>
                      <span className="font-medium text-slate-900">{report.supervisor_name}</span>
                    </div>
                  )}
                  {report.employee_observed && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-semibold">Employee Observed:</span>
                      <span className="font-medium text-slate-900">{report.employee_observed}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Task Observed</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.task_observed}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {report.safe_behaviors && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Safe Behaviors</label>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.safe_behaviors}</p>
                      </div>
                    </div>
                  )}
                  {report.at_risk_behaviors && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">At-Risk Behaviors</label>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.at_risk_behaviors}</p>
                      </div>
                    </div>
                  )}
                  {report.recommendations && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Recommendations</label>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.recommendations}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* General Description */}
          {report.description && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 tracking-wide">General Description</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.description}</p>
              </div>
            </div>
          )}

          {/* Action Plan */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 tracking-wide">Action Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                {report.corrective_actions && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Corrective Actions</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.corrective_actions}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {report.responsible_person && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 font-semibold">Responsible Person:</span>
                    <span className="font-medium text-slate-900">{report.responsible_person}</span>
                  </div>
                )}
                {report.notes && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold tracking-wide"
          >
            Close
          </button>
          <button 
            onClick={() => {
              onEdit(report);
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
          >
            <Edit className="h-4 w-4" />
            Edit Report
          </button>
        </div>
      </div>
    </div>
  );
};

// Backend Status Component
const BackendStatus = ({ isOnline, error, apiBase }) => {
  if (error) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <div className="flex-1">
          <p className="text-amber-800 font-semibold tracking-wide">Connection Issue</p>
          <p className="text-amber-700 text-sm font-medium">
            Unable to connect to backend server at {apiBase}
          </p>
          <p className="text-amber-600 text-xs mt-1">
            Please ensure the backend server is running and check your environment configuration.
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

// Main SHEQ Management Component
export default function SHEQManagement() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeForm, setActiveForm] = useState('hazard');
  const [filters, setFilters] = useState({
    report_type: 'all',
    status: 'all',
    priority: 'all',
    department: 'all',
    location: 'all',
    search: ''
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [backendOnline, setBackendOnline] = useState(true);

  // Enhanced data fetching
  const fetchAllData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🔄 Starting data fetch...');
      console.log('API Base URL:', API_BASE);
      console.log('SHEQ API:', SHEQ_API);
      
      // Test backend connectivity
      try {
        const testResponse = await fetch(API_BASE, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        setBackendOnline(testResponse.ok);
        console.log('Backend status:', testResponse.ok ? 'Online' : 'Offline');
      } catch (testError) {
        setBackendOnline(false);
        console.log('Backend is offline:', testError.message);
      }
      
      const [reportsData, statsData, employeesData] = await Promise.all([
        fetchSHEQReports(filters),
        fetchSHEQStats(),
        fetchEmployeesList()
      ]);
      
      setReports(reportsData || []);
      setStats(statsData);
      setEmployees(employeesData || []);
      
      console.log('✅ Data fetch completed');
      
    } catch (err) {
      console.error('❌ Error in fetchAllData:', err);
      setError(`Failed to load data: ${err.message}`);
      setBackendOnline(false);
      // Set empty arrays when backend is not available
      setReports([]);
      setStats(null);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmitForm = async (formData) => {
    try {
      setError(null);
      let result;
      
      if (editData) {
        result = await updateSHEQReport(editData.id, formData);
        setSuccess('SHEQ report updated successfully');
      } else {
        result = await createSHEQReport(formData);
        setSuccess('SHEQ report created successfully');
      }
      
      // Refresh data
      await fetchAllData();
      
      setShowForm(false);
      setEditData(null);
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(`Failed to ${editData ? 'update' : 'create'} SHEQ report: ${error.message}`);
    }
  };

  // Delete handler
  const handleDeleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this SHEQ report? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteSHEQReport(reportId);
      setReports(prev => prev.filter(report => report.id !== reportId));
      setSuccess('SHEQ report deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to delete SHEQ report: ${error.message}`);
    }
  };

  // Handle view report
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  // Handle edit report
  const handleEditReport = (report) => {
    setEditData(report);
    setActiveForm(report.report_type);
    setShowForm(true);
  };

  // Handle export
  const handleExport = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      downloadSHEQCSV(reports, `sheq-reports-${today}`);
      setSuccess('Reports exported successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to export reports: ${error.message}`);
    }
  };

  // Filter reports when filters change
  useEffect(() => {
    fetchAllData();
  }, [filters]);

  // Initial data fetch
  useEffect(() => { 
    fetchAllData();
  }, []);

  // Calculate enhanced stats
  const enhancedStats = useMemo(() => {
    if (!reports.length) return null;
    
    const totalReports = reports.length;
    const openReports = reports.filter(r => r.status === 'open').length;
    const inProgressReports = reports.filter(r => r.status === 'in_progress').length;
    const resolvedReports = reports.filter(r => r.status === 'resolved' || r.status === 'closed').length;
    const overdue = reports.filter(report => 
      isOverdue(report.due_date) && report.status !== 'closed' && report.status !== 'resolved'
    ).length;
    const highPriority = reports.filter(report => 
      report.priority === 'high' || report.priority === 'critical'
    ).length;

    return {
      total_reports: totalReports,
      open_reports: openReports,
      in_progress_reports: inProgressReports,
      resolved_reports: resolvedReports,
      overdue,
      highPriority
    };
  }, [reports]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SHEQ Management System</h1>
                <p className="text-sm text-slate-600 font-medium">Safety, Health, Environment & Quality</p>
              </div>
            </div>
            
            <QuickActions 
              onNewReport={() => {
                setEditData(null);
                setShowForm(true);
              }}
              onRefresh={fetchAllData}
              onExport={handleExport}
              loading={loading}
              activeForm={activeForm}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Backend Status */}
        {!backendOnline && (
          <BackendStatus isOnline={backendOnline} error={error} apiBase={API_BASE} />
        )}

        {/* Alerts */}
        {error && backendOnline && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 text-rose-600" />
            <div className="flex-1">
              <p className="text-rose-800 font-semibold tracking-wide">Error</p>
              <p className="text-rose-700 text-sm font-medium">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors font-semibold"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div className="flex-1">
              <p className="text-emerald-800 font-semibold tracking-wide">Success</p>
              <p className="text-emerald-700 text-sm font-medium">{success}</p>
            </div>
            <button 
              onClick={() => setSuccess(null)} 
              className="p-1 hover:bg-emerald-200 rounded transition-colors"
              aria-label="Dismiss success message"
            >
              <X className="h-4 w-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Statistics Overview */}
        {enhancedStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Reports" 
              value={enhancedStats.total_reports} 
              icon={FileText} 
              color="slate"
            />
            <StatCard 
              title="Open Reports" 
              value={enhancedStats.open_reports} 
              icon={AlertOctagon} 
              color="orange"
            />
            <StatCard 
              title="Overdue Actions" 
              value={enhancedStats.overdue} 
              icon={Clock4} 
              color="rose"
            />
            <StatCard 
              title="High Priority" 
              value={enhancedStats.highPriority} 
              icon={AlertTriangle} 
              color="amber"
            />
          </div>
        )}

        {/* Report Type Selection */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Select Report Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(SHEQ_TYPES).map(([key, reportType]) => {
                const Icon = reportType.icon;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveForm(key);
                      setEditData(null);
                      setShowForm(true);
                    }}
                    className="p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left group bg-gradient-to-br from-white to-slate-50"
                    aria-label={`Create new ${reportType.name}`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`p-3 rounded-xl ${reportType.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-slate-900 text-lg">{reportType.name}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{reportType.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              {/* Filters and Search */}
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    SHEQ Reports ({reports.length})
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    View and manage all safety, health, environment, and quality reports
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 lg:flex-none min-w-[320px]">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search by employee, location, or description..." 
                      value={filters.search} 
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} 
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                      aria-label="Search reports"
                    />
                  </div>

                  {/* Report Type Filter */}
                  <select 
                    value={filters.report_type} 
                    onChange={(e) => setFilters(prev => ({ ...prev, report_type: e.target.value }))} 
                    className="px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[200px] font-medium bg-white"
                    aria-label="Filter by report type"
                  >
                    <option value="all">All Report Types</option>
                    {Object.entries(SHEQ_TYPES).map(([key, reportType]) => (
                      <option key={key} value={key}>{reportType.name}</option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select 
                    value={filters.status} 
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} 
                    className="px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[200px] font-medium bg-white"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    {Object.entries(STATUS_TYPES).map(([key, status]) => (
                      <option key={key} value={key}>{status.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reports Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-slate-600 mx-auto" />
                    <p className="text-slate-600 font-semibold text-lg">
                      Loading SHEQ reports...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {reports.map((report) => (
                    <SHEQReportCard 
                      key={report.id} 
                      report={report} 
                      onView={handleViewReport}
                      onEdit={handleEditReport}
                      onDelete={handleDeleteReport}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && reports.length === 0 && (
                <div className="text-center py-20">
                  <Shield className="h-20 w-20 mx-auto mb-6 text-slate-300" />
                  <p className="text-xl font-bold text-slate-900 mb-3 tracking-wide">
                    No SHEQ reports found
                  </p>
                  <p className="text-sm text-slate-600 mb-8 font-medium max-w-md mx-auto">
                    Get started by creating your first SHEQ report. Your reports help maintain a safe working environment.
                  </p>
                  <button 
                    onClick={() => {
                      setEditData(null);
                      setShowForm(true);
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide text-lg"
                  >
                    <Plus className="h-5 w-5 inline mr-3" />
                    Create First Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* SHEQ Form Modal */}
      <SHEQForm 
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditData(null);
        }}
        onSubmit={handleSubmitForm}
        initialData={editData}
        formType={editData?.report_type || activeForm}
      />

      {/* Report Details Modal */}
      <ReportDetailsModal 
        report={selectedReport}
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedReport(null);
        }}
        onEdit={handleEditReport}
      />
    </div>
  );
}