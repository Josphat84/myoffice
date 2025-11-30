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
    color: 'bg-orange-500',
    formType: 'hazard'
  },
  near_miss: {
    name: 'Near Miss Report',
    description: 'Report incidents that could have resulted in injury',
    icon: FileWarning,
    color: 'bg-amber-500',
    formType: 'near_miss'
  },
  incident: {
    name: 'Incident Report',
    description: 'Report actual incidents and injuries',
    icon: AlertTriangle,
    color: 'bg-red-500',
    formType: 'incident'
  },
  pto: {
    name: 'Planned Task Observation',
    description: 'Supervisor observations of work practices',
    icon: ClipboardCheck,
    color: 'bg-blue-500',
    formType: 'pto'
  }
};

// Priority Levels
const PRIORITY_LEVELS = {
  low: { name: 'Low', color: 'bg-green-100 text-green-800 border-green-200', icon: Flag },
  medium: { name: 'Medium', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Flag },
  high: { name: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Flag },
  critical: { name: 'Critical', color: 'bg-red-100 text-red-800 border-red-200', icon: Flag }
};

// Status Types
const STATUS_TYPES = {
  open: { name: 'Open', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
  in_progress: { name: 'In Progress', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: RefreshCw },
  resolved: { name: 'Resolved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  closed: { name: 'Closed', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: CheckCircle2 }
};

// Mine Locations
const MINE_LOCATIONS = {
  'Deep Shaft A': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Drill },
  'Deep Shaft B': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Drill },
  'Open Pit': { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Mountain },
  'Processing Plant': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Factory },
  'Workshop': { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Settings },
  'Surface Operations': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Landmark },
  'All Areas': { color: 'bg-rose-100 text-rose-800 border-rose-200', icon: Gem }
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
      <span className="text-sm font-medium tracking-wide">{config.name}</span>
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
      <span className="text-sm font-medium tracking-wide">{config.name}</span>
    </span>
  );
};

// Location Badge Component
const LocationBadge = ({ location }) => {
  const config = MINE_LOCATIONS[location] || { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: MapPin };
  const Icon = config.icon || MapPin;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-medium tracking-wide">{location}</span>
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, onClick, subtitle, color = "slate", trend }) => {
  const Icon = icon;
  const colorClasses = {
    slate: 'from-slate-600 to-slate-700',
    blue: 'from-blue-600 to-blue-700',
    emerald: 'from-emerald-600 to-emerald-700',
    rose: 'from-rose-600 to-rose-700',
    orange: 'from-orange-600 to-orange-700',
    amber: 'from-amber-600 to-amber-700'
  };
  
  return (
    <div 
      className="group bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg group-hover:scale-110 transition-transform`}>
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
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
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
          <div className={`p-2 rounded-xl ${reportType.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
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
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-xl z-10 min-w-[180px] overflow-hidden">
                <button 
                  onClick={() => { onView(report); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors border-b border-slate-100 font-medium"
                >
                  <Eye className="h-4 w-4" /> View Details
                </button>
                <button 
                  onClick={() => { onEdit(report); setShowActions(false); }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors border-b border-slate-100 font-medium"
                >
                  <Edit className="h-4 w-4" /> Edit Report
                </button>
                <div className="border-t border-slate-200">
                  <button 
                    onClick={() => { onDelete(report.id); setShowActions(false); }}
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
              {isOverdueItem && ' ⚠️'}
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
          className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
          View Details
        </button>
        <button 
          onClick={() => onEdit(report)}
          className="px-3 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
          title="Edit Report"
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
      >
        <Download className="h-4 w-4" />
        Export Data
      </button>
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="p-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      </button>
      <button 
        onClick={onNewReport}
        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
      >
        <Plus className="h-4 w-4" />
        New {reportType.name}
      </button>
    </div>
  );
};

// Autocomplete Input Component
const AutocompleteInput = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  onSelect,
  field = 'employee_id',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  const filteredOptions = options.filter(option =>
    option[field]?.toLowerCase().includes(inputValue.toLowerCase()) ||
    option.employee_name?.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (option) => {
    setInputValue(option[field]);
    onSelect(option);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Update the form data immediately for validation
    onChange({
      target: {
        name: field,
        value: newValue
      }
    });
    
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
      />
      
      {isOpen && inputValue && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-slate-900">{option[field]}</div>
              <div className="text-sm text-slate-600">{option.employee_name} • {option.position}</div>
            </button>
          ))}
        </div>
      )}
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

  // Validate form before submission - FIXED: Made description optional
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

    // Form-specific validations - use the specific description fields instead of generic description
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
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${reportType.color} text-white shadow-lg`}>
                <reportType.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-wide">
                  {initialData ? 'Edit' : 'New'} {reportType.name}
                </h2>
                <p className="text-sm text-slate-600 font-medium">{reportType.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              type="button"
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Form Errors Summary */}
          {Object.keys(formErrors).length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <p className="text-rose-800 font-semibold">Please fix the following errors:</p>
              </div>
              <ul className="text-sm text-rose-700 list-disc list-inside space-y-1">
                {Object.entries(formErrors).map(([field, error]) => (
                  error && <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Employee Name *
                    {formErrors.employee_name && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.employee_name})</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.employee_name ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Employee ID *
                    {formErrors.employee_id && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.employee_id})</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.employee_id ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department *
                    {formErrors.department && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.department})</span>
                    )}
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.department ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location *
                    {formErrors.location && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.location})</span>
                    )}
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.location ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  >
                    {Object.keys(MINE_LOCATIONS).map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date Reported *
                    {formErrors.date_reported && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.date_reported})</span>
                    )}
                  </label>
                  <input
                    type="date"
                    name="date_reported"
                    value={formData.date_reported}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.date_reported ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Time Reported</label>
                  <input
                    type="time"
                    name="time_reported"
                    value={formData.time_reported}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  >
                    {Object.entries(PRIORITY_LEVELS).map(([key, priority]) => (
                      <option key={key} value={key}>{priority.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  >
                    {Object.entries(STATUS_TYPES).map(([key, status]) => (
                      <option key={key} value={key}>{status.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Specific Fields */}
            {formType === 'hazard' && (
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Hazard Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Hazard Description *
                      {formErrors.hazard_description && (
                        <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.hazard_description})</span>
                    )}
                    </label>
                    <textarea
                      name="hazard_description"
                      value={formData.hazard_description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none ${
                        formErrors.hazard_description ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder="Describe the hazard in detail..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Risk Assessment</label>
                    <textarea
                      name="risk_assessment"
                      value={formData.risk_assessment}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="Assess the potential risks..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Suggested Improvements</label>
                    <textarea
                      name="suggested_improvements"
                      value={formData.suggested_improvements}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="Suggest improvements to address the hazard..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Requirements for Improvement</label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="List specific requirements needed..."
                    />
                  </div>
                </div>
              </div>
            )}

            {formType === 'near_miss' && (
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Near Miss Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Near Miss Description *
                      {formErrors.near_miss_description && (
                        <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.near_miss_description})</span>
                    )}
                    </label>
                    <textarea
                      name="near_miss_description"
                      value={formData.near_miss_description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none ${
                        formErrors.near_miss_description ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder="Describe what happened and how injury was avoided..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Potential Severity</label>
                    <select
                      name="potential_severity"
                      value={formData.potential_severity}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    >
                      <option value="">Select Potential Severity</option>
                      <option value="minor">Minor</option>
                      <option value="moderate">Moderate</option>
                      <option value="serious">Serious</option>
                      <option value="severe">Severe</option>
                      <option value="fatal">Fatal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Immediate Causes</label>
                    <textarea
                      name="immediate_causes"
                      value={formData.immediate_causes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="What directly caused the near miss?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Root Causes</label>
                    <textarea
                      name="root_causes"
                      value={formData.root_causes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="What are the underlying root causes?"
                    />
                  </div>
                </div>
              </div>
            )}

            {formType === 'incident' && (
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Incident Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Incident Description *
                      {formErrors.incident_description && (
                        <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.incident_description})</span>
                    )}
                    </label>
                    <textarea
                      name="incident_description"
                      value={formData.incident_description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none ${
                        formErrors.incident_description ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder="Describe the incident in detail..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Incident Type</label>
                    <select
                      name="incident_type"
                      value={formData.incident_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    >
                      <option value="near_miss">Near Miss</option>
                      <option value="first_aid">First Aid Case</option>
                      <option value="medical_treatment">Medical Treatment</option>
                      <option value="lost_time">Lost Time Injury</option>
                      <option value="fatality">Fatality</option>
                      <option value="property_damage">Property Damage</option>
                      <option value="environmental">Environmental Incident</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Injury Type (if applicable)</label>
                    <input
                      type="text"
                      name="injury_type"
                      value={formData.injury_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Property Damage</label>
                    <textarea
                      name="property_damage"
                      value={formData.property_damage}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="Describe any property damage..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Environmental Impact</label>
                    <textarea
                      name="environmental_impact"
                      value={formData.environmental_impact}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="Describe any environmental impact..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Immediate Actions Taken</label>
                    <textarea
                      name="immediate_actions"
                      value={formData.immediate_actions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="What immediate actions were taken?"
                    />
                  </div>
                </div>
              </div>
            )}

            {formType === 'pto' && (
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Observation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Supervisor Name *
                      {formErrors.supervisor_name && (
                        <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.supervisor_name})</span>
                    )}
                    </label>
                    <input
                      type="text"
                      name="supervisor_name"
                      value={formData.supervisor_name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                        formErrors.supervisor_name ? 'border-rose-300' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Supervisor ID</label>
                    <input
                      type="text"
                      name="supervisor_id"
                      value={formData.supervisor_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Employee Observed</label>
                    <input
                      type="text"
                      name="employee_observed"
                      value={formData.employee_observed}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Employee Observed ID</label>
                    <input
                      type="text"
                      name="employee_observed_id"
                      value={formData.employee_observed_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Task Observed *
                      {formErrors.task_observed && (
                        <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.task_observed})</span>
                    )}
                    </label>
                    <textarea
                      name="task_observed"
                      value={formData.task_observed}
                      onChange={handleChange}
                      required
                      rows={3}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none ${
                        formErrors.task_observed ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder="Describe the task being observed..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Safe Behaviors Observed</label>
                    <textarea
                      name="safe_behaviors"
                      value={formData.safe_behaviors}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="List safe behaviors observed..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">At-Risk Behaviors Observed</label>
                    <textarea
                      name="at_risk_behaviors"
                      value={formData.at_risk_behaviors}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="List at-risk behaviors observed..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Recommendations</label>
                    <textarea
                      name="recommendations"
                      value={formData.recommendations}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                      placeholder="Provide recommendations for improvement..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Common Description Field - Made Optional */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Additional Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">General Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                    placeholder="Any additional description or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Action Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Corrective Actions</label>
                  <textarea
                    name="corrective_actions"
                    value={formData.corrective_actions}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                    placeholder="Describe corrective actions to be taken..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Responsible Person</label>
                  <input
                    type="text"
                    name="responsible_person"
                    value={formData.responsible_person}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assigned To</label>
                  <input
                    type="text"
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Completion Date</label>
                  <input
                    type="date"
                    name="completion_date"
                    value={formData.completion_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                    placeholder="Any additional notes or comments..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
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
              className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {initialData ? 'Update Report' : 'Create Report'}
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
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${reportType.color} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-wide">
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
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Report Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Report Type:</span>
                  <span className="font-bold text-slate-900">{reportType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Reported By:</span>
                  <span className="font-medium text-slate-900">{report.employee_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Employee ID:</span>
                  <span className="font-medium text-slate-900">{report.employee_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Department:</span>
                  <span className="font-medium text-slate-900">{report.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Position:</span>
                  <span className="font-medium text-slate-900">{report.position || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Location & Timing</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Location:</span>
                  <LocationBadge location={report.location} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Date Reported:</span>
                  <span className="font-medium text-slate-900">{formatDateTime(report.date_reported)}</span>
                </div>
                {report.due_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Due Date:</span>
                    <span className={`font-medium ${isOverdue(report.due_date) ? 'text-rose-600' : 'text-slate-900'}`}>
                      {formatDate(report.due_date)}
                      {isOverdue(report.due_date) && ' ⚠️ Overdue'}
                    </span>
                  </div>
                )}
                {report.completion_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Completion Date:</span>
                    <span className="font-medium text-slate-900">{formatDate(report.completion_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Specific Details */}
          {report.report_type === 'hazard' && report.hazard_description && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Hazard Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Hazard Description</label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap">{report.hazard_description}</p>
                  </div>
                </div>
                {report.risk_assessment && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Risk Assessment</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.risk_assessment}</p>
                    </div>
                  </div>
                )}
                {report.suggested_improvements && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Suggested Improvements</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.suggested_improvements}</p>
                    </div>
                  </div>
                )}
                {report.requirements && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Requirements for Improvement</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.requirements}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {report.report_type === 'near_miss' && report.near_miss_description && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Near Miss Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap">{report.near_miss_description}</p>
                  </div>
                </div>
                {report.potential_severity && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Potential Severity:</span>
                    <span className="font-medium text-slate-900 capitalize">{report.potential_severity}</span>
                  </div>
                )}
                {report.immediate_causes && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Immediate Causes</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.immediate_causes}</p>
                    </div>
                  </div>
                )}
                {report.root_causes && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Root Causes</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.root_causes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {report.report_type === 'incident' && report.incident_description && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Incident Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {report.incident_type && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Incident Type:</span>
                      <span className="font-medium text-slate-900 capitalize">{report.incident_type.replace('_', ' ')}</span>
                    </div>
                  )}
                  {report.injury_type && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Injury Type:</span>
                      <span className="font-medium text-slate-900">{report.injury_type}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Incident Description</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.incident_description}</p>
                    </div>
                  </div>
                  {report.immediate_actions && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Immediate Actions Taken</label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-slate-700 whitespace-pre-wrap">{report.immediate_actions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {report.report_type === 'pto' && report.task_observed && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Observation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {report.supervisor_name && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Supervisor:</span>
                      <span className="font-medium text-slate-900">{report.supervisor_name}</span>
                    </div>
                  )}
                  {report.employee_observed && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Employee Observed:</span>
                      <span className="font-medium text-slate-900">{report.employee_observed}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Task Observed</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.task_observed}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {report.safe_behaviors && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Safe Behaviors</label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-slate-700 whitespace-pre-wrap">{report.safe_behaviors}</p>
                      </div>
                    </div>
                  )}
                  {report.at_risk_behaviors && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">At-Risk Behaviors</label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-slate-700 whitespace-pre-wrap">{report.at_risk_behaviors}</p>
                      </div>
                    </div>
                  )}
                  {report.recommendations && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Recommendations</label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-slate-700 whitespace-pre-wrap">{report.recommendations}</p>
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
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">General Description</h3>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-700 whitespace-pre-wrap">{report.description}</p>
              </div>
            </div>
          )}

          {/* Action Plan */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Action Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {report.corrective_actions && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Corrective Actions</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.corrective_actions}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {report.responsible_person && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Responsible Person:</span>
                    <span className="font-medium text-slate-900">{report.responsible_person}</span>
                  </div>
                )}
                {report.notes && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap">{report.notes}</p>
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
            className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">SHEQ Management System</h1>
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

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Backend Status */}
        {!backendOnline && (
          <BackendStatus isOnline={backendOnline} error={error} apiBase={API_BASE} />
        )}

        {/* Alerts */}
        {error && backendOnline && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600" />
            <div className="flex-1">
              <p className="text-rose-800 font-semibold tracking-wide">Error</p>
              <p className="text-rose-700 text-sm font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors font-semibold">
              Dismiss
            </button>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div className="flex-1">
              <p className="text-emerald-800 font-semibold tracking-wide">Success</p>
              <p className="text-emerald-700 text-sm font-medium">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="p-1 hover:bg-emerald-200 rounded transition-colors">
              <X className="h-4 w-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Statistics Overview */}
        {enhancedStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide mb-4">Select Report Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    className="p-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${reportType.color} text-white group-hover:scale-110 transition-transform`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">{reportType.name}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{reportType.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {/* Filters and Search */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 tracking-wide">
                    SHEQ Reports ({reports.length})
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    View and manage all safety, health, environment, and quality reports
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 lg:flex-none min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search by employee, location, or description..." 
                      value={filters.search} 
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} 
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    />
                  </div>

                  {/* Report Type Filter */}
                  <select 
                    value={filters.report_type} 
                    onChange={(e) => setFilters(prev => ({ ...prev, report_type: e.target.value }))} 
                    className="px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[180px] font-medium bg-white"
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
                    className="px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[180px] font-medium bg-white"
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
                <div className="flex items-center justify-center py-16">
                  <div className="text-center space-y-3">
                    <Loader2 className="h-12 w-12 animate-spin text-slate-600 mx-auto" />
                    <p className="text-slate-600 font-semibold">
                      Loading SHEQ reports...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <div className="text-center py-16">
                  <Shield className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-bold text-slate-900 mb-2 tracking-wide">
                    No SHEQ reports found
                  </p>
                  <p className="text-sm text-slate-600 mb-6 font-medium">
                    Get started by creating your first SHEQ report
                  </p>
                  <button 
                    onClick={() => {
                      setEditData(null);
                      setShowForm(true);
                    }}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
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