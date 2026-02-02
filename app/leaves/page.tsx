"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Calendar, Plus, Search, RefreshCw, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Send, Phone, Trash2, MoreVertical,
  Download, List, LayoutGrid, X, Edit, ArrowUpRight,
  Stethoscope, Shield, Heart, Users, GraduationCap,
  CalendarDays, BookOpen, Database, Layers, Server, Home as HomeIcon,
  BarChart3, PieChart, Mail, ExternalLink
} from "lucide-react";
import Link from "next/link";

// Type definitions
interface LeaveType {
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface LeaveBalanceData {
  total: number;
  used: number;
  pending: number;
  remaining: number;
}

interface Leave {
  id: string;
  employee_name: string;
  employee_id: string;
  position: string;
  leave_type: keyof typeof LEAVE_TYPES;
  start_date: string;
  end_date: string;
  reason: string;
  contact_number: string;
  emergency_contact?: string;
  handover_to?: string;
  status: 'pending' | 'approved' | 'rejected';
  total_days: number;
  applied_date: string;
  updated_at?: string;
  department?: string;
  manager_name?: string;
  manager_approval?: 'pending' | 'approved' | 'rejected';
  hr_approval?: 'pending' | 'approved' | 'rejected';
  supporting_docs?: string[];
}

interface LeaveBalance {
  annual: LeaveBalanceData;
  sick: LeaveBalanceData;
  emergency: LeaveBalanceData;
  compassionate: LeaveBalanceData;
  maternity: LeaveBalanceData;
  study: LeaveBalanceData;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  on_leave_now: number;
  approvalRate: number;
  total_days_requested: number;
  average_days: number;
}

// API Configuration - Ensure it works in both dev and prod
const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: Use environment variable or fallback
    return process.env.NEXT_PUBLIC_API_URL || window.location.origin;
  }
  // Server-side: Use environment variable
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

const API_BASE = getApiBase();
const LEAVES_API = `${API_BASE}/api/leaves`;

// Leave Types Constants
const LEAVE_TYPES: Record<string, LeaveType> = {
  annual: { 
    name: 'Annual Leave', 
    shortName: 'Annual', 
    color: '#2563eb', 
    bgColor: 'bg-blue-50', 
    textColor: 'text-blue-700', 
    borderColor: 'border-blue-200',
    icon: CalendarDays,
    description: 'Paid vacation time for rest and relaxation'
  },
  sick: { 
    name: 'Sick Leave', 
    shortName: 'Sick', 
    color: '#dc2626', 
    bgColor: 'bg-red-50', 
    textColor: 'text-red-700', 
    borderColor: 'border-red-200',
    icon: Stethoscope,
    description: 'Medical and health-related absences'
  },
  emergency: { 
    name: 'Emergency Leave', 
    shortName: 'Emergency', 
    color: '#d97706', 
    bgColor: 'bg-amber-50', 
    textColor: 'text-amber-700', 
    borderColor: 'border-amber-200',
    icon: Shield,
    description: 'Urgent personal or family matters'
  },
  compassionate: { 
    name: 'Compassionate Leave', 
    shortName: 'Compassionate', 
    color: '#7c3aed', 
    bgColor: 'bg-purple-50', 
    textColor: 'text-purple-700', 
    borderColor: 'border-purple-200',
    icon: Heart,
    description: 'Bereavement and family emergencies'
  },
  maternity: { 
    name: 'Maternity Leave', 
    shortName: 'Maternity', 
    color: '#db2777', 
    bgColor: 'bg-pink-50', 
    textColor: 'text-pink-700', 
    borderColor: 'border-pink-200',
    icon: Users,
    description: 'Parental leave for childbirth'
  },
  study: { 
    name: 'Study Leave', 
    shortName: 'Study', 
    color: '#059669', 
    bgColor: 'bg-emerald-50', 
    textColor: 'text-emerald-700', 
    borderColor: 'border-emerald-200',
    icon: GraduationCap,
    description: 'Professional development and education'
  }
};

// Utility functions
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return 'Invalid date';
  }
};

const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch {
    return '';
  }
};

const calculateDays = (startDate: string | undefined, endDate: string | undefined): number => {
  if (!startDate || !endDate) return 0;
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  } catch {
    return 0;
  }
};

const formatDays = (days: number): string => {
  if (days === 1) return '1 day';
  return `${days} days`;
};

// API Functions
const fetchLeaves = async (filters: Record<string, string> = {}): Promise<Leave[]> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.append(key, value);
    });

    const url = params.toString() ? `${LEAVES_API}?${params.toString()}` : LEAVES_API;
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to fetch leaves: ${response.status} ${errorData.message || ''}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching leaves:', error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

const fetchLeaveBalance = async (employeeId: string = 'MNT001'): Promise<LeaveBalance> => {
  try {
    const response = await fetch(`${LEAVES_API}/balance/${employeeId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      return getDefaultBalance();
    }
    
    const data = await response.json();
    return data as LeaveBalance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return getDefaultBalance();
  }
};

const createLeave = async (leaveData: Partial<Leave>): Promise<Leave> => {
  try {
    const response = await fetch(LEAVES_API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...leaveData,
        applied_date: new Date().toISOString(),
        status: 'pending',
        total_days: calculateDays(leaveData.start_date, leaveData.end_date)
      }),
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

const updateLeave = async (leaveId: string, leaveData: Partial<Leave>): Promise<Leave> => {
  try {
    const response = await fetch(`${LEAVES_API}/${leaveId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...leaveData,
        total_days: calculateDays(leaveData.start_date, leaveData.end_date)
      }),
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

const updateLeaveStatus = async (leaveId: string, status: Leave['status'], notes?: string): Promise<Leave> => {
  try {
    const response = await fetch(`${LEAVES_API}/${leaveId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) throw new Error(`Failed to update leave status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error updating leave status:', error);
    throw error;
  }
};

const deleteLeave = async (leaveId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${LEAVES_API}/${leaveId}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
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

const getDefaultBalance = (): LeaveBalance => ({
  annual: { total: 21, used: 0, pending: 0, remaining: 21 },
  sick: { total: 10, used: 0, pending: 0, remaining: 10 },
  emergency: { total: 5, used: 0, pending: 0, remaining: 5 },
  compassionate: { total: 5, used: 0, pending: 0, remaining: 5 },
  maternity: { total: 90, used: 0, pending: 0, remaining: 90 },
  study: { total: 10, used: 0, pending: 0, remaining: 10 }
});

// Status Badge Component
const StatusBadge = ({ status }: { status: Leave['status'] }) => {
  const config = {
    pending: { 
      color: 'bg-amber-50 text-amber-700 border-amber-200', 
      icon: Clock, 
      label: 'Pending Review' 
    },
    approved: { 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2, 
      label: 'Approved' 
    },
    rejected: { 
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle, 
      label: 'Rejected' 
    }
  }[status] || { 
    color: 'bg-gray-50 text-gray-700 border-gray-200', 
    icon: Clock, 
    label: 'Unknown' 
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-medium tracking-wide">{config.label}</span>
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, onClick, subtitle }: {
  title: string;
  value: number | string;
  icon: React.ComponentType<any>;
  color?: string;
  onClick?: () => void;
  subtitle?: string;
}) => {
  const Icon = icon;
  
  return (
    <div 
      className="group bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${color || 'bg-gray-50'} border border-gray-200 group-hover:scale-110 transition-transform`}>
              <Icon className={`h-5 w-5 ${color ? 'text-white' : 'text-gray-600'}`} />
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

// Leave Card Component
const LeaveCard = ({ leave, onView, onEdit, onDelete }: {
  leave: Leave;
  onView: (leave: Leave) => void;
  onEdit: (leave: Leave) => void;
  onDelete: (leaveId: string) => Promise<void>;
}) => {
  const leaveType = LEAVE_TYPES[leave.leave_type] || LEAVE_TYPES.annual;
  const Icon = leaveType.icon;
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this leave application? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await onDelete(leave.id);
      setShowActions(false);
    } catch (error) {
      console.error('Error deleting leave:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDocument = () => {
    if (leave.supporting_docs && leave.supporting_docs.length > 0 && leave.supporting_docs[0]) {
      window.open(leave.supporting_docs[0], '_blank');
    }
  };

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
            {leave.department && (
              <p className="text-xs text-gray-400 mt-1">{leave.department}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={leave.status} />
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              disabled={deleting}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600 border border-gray-200 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
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
                <div className="border-t border-gray-200">
                  <button 
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full px-4 py-3 text-left text-sm text-rose-700 hover:bg-rose-50 flex items-center gap-2 disabled:opacity-50 transition-colors font-medium"
                  >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
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
          <span className="font-bold text-gray-900">{formatDays(leave.total_days)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-semibold">Applied On</span>
          <span className="text-gray-500 font-medium">{formatDateTime(leave.applied_date)}</span>
        </div>
        {leave.updated_at && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-semibold">Last Updated</span>
            <span className="text-gray-500 font-medium">{formatDateTime(leave.updated_at)}</span>
          </div>
        )}
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
        {leave.supporting_docs && leave.supporting_docs.length > 0 && leave.supporting_docs[0] && (
          <button 
            onClick={handleViewDocument}
            className="px-3 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-200 flex items-center justify-center border-2 border-blue-200 hover:border-blue-300"
            title="View Supporting Documents"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Leave Application Form Component
const LeaveApplicationForm = ({ onClose, onSuccess, editData, employeeId = 'MNT001' }: {
  onClose: () => void;
  onSuccess: (message: string, leave?: Leave) => void;
  editData?: Leave | null;
  employeeId?: string;
}) => {
  const [formData, setFormData] = useState<Partial<Leave>>(editData || {
    employee_id: employeeId,
    employee_name: '',
    position: '',
    leave_type: 'annual',
    start_date: '',
    end_date: '',
    reason: '',
    contact_number: '',
    emergency_contact: '',
    handover_to: '',
    department: '',
    manager_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.employee_name?.trim()) errors.employee_name = 'Full name is required';
    if (!formData.position?.trim()) errors.position = 'Position is required';
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (!formData.end_date) errors.end_date = 'End date is required';
    if (!formData.reason?.trim()) errors.reason = 'Reason is required';
    if (!formData.contact_number?.trim()) errors.contact_number = 'Contact number is required';
    
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) errors.end_date = 'End date must be after start date';
      
      // Validate that dates are not in the past (for new requests)
      if (!editData && start < new Date()) {
        errors.start_date = 'Start date cannot be in the past';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof Leave, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      let result: Leave;
      if (editData && editData.id) {
        result = await updateLeave(editData.id, formData);
      } else {
        result = await createLeave(formData);
      }
      
      onSuccess(editData ? 'Leave application updated successfully!' : 'Leave application submitted successfully!', result);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculatedDays = calculateDays(formData.start_date, formData.end_date);
  const selectedLeaveType = LEAVE_TYPES[formData.leave_type || 'annual'];

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
              { label: 'Department', field: 'department', type: 'text', placeholder: 'e.g., Engineering', required: false },
              { label: 'Contact Number', field: 'contact_number', type: 'tel', placeholder: '+263 XXX XXX XXX', required: true },
              { label: 'Manager Name', field: 'manager_name', type: 'text', placeholder: 'Your direct supervisor', required: false }
            ].map(({ label, field, type, placeholder, required }) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input 
                  type={type} 
                  required={required}
                  value={formData[field as keyof Leave] as string || ''} 
                  onChange={(e) => handleChange(field as keyof Leave, e.target.value)} 
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold ${
                    validationErrors[field] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={placeholder}
                  disabled={field === 'employee_id' && editData}
                />
                {validationErrors[field] && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors[field]}</p>
                )}
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
                min={editData ? undefined : new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold ${
                  validationErrors.start_date ? 'border-red-300' : 'border-gray-300'
                }`} 
              />
              {validationErrors.start_date && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.start_date}</p>
              )}
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold ${
                  validationErrors.end_date ? 'border-red-300' : 'border-gray-300'
                }`} 
              />
              {validationErrors.end_date && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.end_date}</p>
              )}
            </div>
          </div>

          {calculatedDays > 0 && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Total Leave Days:</span>
                  <p className="text-xs text-gray-500 mt-1">Including both start and end dates</p>
                </div>
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
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold ${
                validationErrors.reason ? 'border-red-300' : 'border-gray-300'
              }`} 
              placeholder="Please provide detailed reasons for your leave request..." 
            />
            {validationErrors.reason && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.reason}</p>
            )}
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
                      value={formData.emergency_contact || ''} 
                      onChange={(e) => handleChange('emergency_contact', e.target.value)} 
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
                      placeholder="Name and phone number" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Handover To</label>
                    <input 
                      type="text" 
                      value={formData.handover_to || ''} 
                      onChange={(e) => handleChange('handover_to', e.target.value)} 
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold" 
                      placeholder="Colleague's name and contact" 
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

// Leave Details Modal Component
const LeaveDetailsModal = ({ leave, onClose, onEdit, onDelete, onStatusUpdate }: {
  leave: Leave;
  onClose: () => void;
  onEdit: (leave: Leave) => void;
  onDelete: (leaveId: string) => Promise<void>;
  onStatusUpdate: (leaveId: string, status: Leave['status']) => Promise<void>;
}) => {
  const selectedLeaveType = LEAVE_TYPES[leave.leave_type] || LEAVE_TYPES.annual;
  const [updating, setUpdating] = useState(false);
  const [showStatusActions, setShowStatusActions] = useState(false);

  const handleStatusUpdate = async (newStatus: Leave['status']) => {
    setUpdating(true);
    try {
      await onStatusUpdate(leave.id, newStatus);
      setShowStatusActions(false);
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
      onClose();
    } catch (error) {
      console.error('Error deleting leave:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleViewDocument = (docUrl: string) => {
    window.open(docUrl, '_blank');
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
              <button 
                onClick={() => onEdit(leave)}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <div className="relative">
                <button onClick={() => setShowStatusActions(!showStatusActions)} disabled={updating} className="p-2 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors text-gray-400 hover:text-gray-600 border-2 border-gray-200">
                  <MoreVertical className="h-5 w-5" />
                </button>
                {showStatusActions && (
                  <div className="absolute right-0 top-10 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-10 min-w-[200px] overflow-hidden">
                    <button onClick={() => handleStatusUpdate('approved')} disabled={updating} className="w-full px-4 py-3 text-left text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 disabled:opacity-50 transition-colors border-b border-gray-100 font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Approve Request
                    </button>
                    <button onClick={() => handleStatusUpdate('rejected')} disabled={updating} className="w-full px-4 py-3 text-left text-sm text-rose-700 hover:bg-rose-50 flex items-center gap-2 disabled:opacity-50 transition-colors border-b border-gray-100 font-semibold">
                      <XCircle className="h-4 w-4" /> Reject Request
                    </button>
                    <button onClick={() => handleStatusUpdate('pending')} disabled={updating} className="w-full px-4 py-3 text-left text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2 disabled:opacity-50 transition-colors font-semibold">
                      <Clock className="h-4 w-4" /> Set as Pending
                    </button>
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
              <span className="text-blue-700 font-semibold">Updating...</span>
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
                  {leave.department && <div><p className="text-sm text-gray-600 font-semibold">Department</p><p className="font-bold text-gray-900">{leave.department}</p></div>}
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
                  {leave.manager_name && <div><p className="text-sm text-gray-600 font-semibold">Reporting Manager</p><p className="font-bold text-gray-900">{leave.manager_name}</p></div>}
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
                  <div><p className="text-sm text-gray-600 font-semibold">Total Days</p><p className="font-bold text-gray-900">{formatDays(leave.total_days)}</p></div>
                  <div><p className="text-sm text-gray-600 font-semibold">Applied On</p><p className="font-bold text-gray-900">{formatDateTime(leave.applied_date)}</p></div>
                  {leave.updated_at && <div><p className="text-sm text-gray-600 font-semibold">Last Updated</p><p className="font-bold text-gray-900">{formatDateTime(leave.updated_at)}</p></div>}
                </div>
              </div>

              {/* Approval Status */}
              {(leave.manager_approval || leave.hr_approval) && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                    <CheckCircle2 className="h-5 w-5 text-amber-600" />
                    Approval Status
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {leave.manager_approval && (
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Manager Approval</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          leave.manager_approval === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          leave.manager_approval === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {leave.manager_approval.charAt(0).toUpperCase() + leave.manager_approval.slice(1)}
                        </span>
                      </div>
                    )}
                    {leave.hr_approval && (
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">HR Approval</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          leave.hr_approval === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          leave.hr_approval === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {leave.hr_approval.charAt(0).toUpperCase() + leave.hr_approval.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reason for Leave */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
              <FileText className="h-5 w-5 text-gray-600" />
              Reason for Leave
            </h3>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed font-semibold whitespace-pre-wrap">{leave.reason}</p>
            </div>
          </div>

          {/* Supporting Documents */}
          {leave.supporting_docs && leave.supporting_docs.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-wide">
                <FileText className="h-5 w-5 text-blue-600" />
                Supporting Documents
              </h3>
              <div className="space-y-2">
                {leave.supporting_docs.map((doc, index) => (
                  doc && (
                    <div key={index} className="flex items-center justify-between bg-white border-2 border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">Document {index + 1}</span>
                      </div>
                      <button 
                        onClick={() => handleViewDocument(doc)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 transition-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </button>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
            <button 
              onClick={() => onEdit(leave)}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              <Edit className="h-4 w-4" />
              Edit Application
            </button>
            <button 
              onClick={handleDelete}
              disabled={updating}
              className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Leave Balance Card Component
const LeaveBalanceCard = ({ type, data }: { type: keyof typeof LEAVE_TYPES; data: LeaveBalanceData }) => {
  const leaveType = LEAVE_TYPES[type] || LEAVE_TYPES.annual;
  const Icon = leaveType.icon;
  const percentage = data.total ? (data.used / data.total) * 100 : 0;
  
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl ${leaveType.bgColor} border-2 ${leaveType.borderColor}`}>
          <Icon className={`h-6 w-6 ${leaveType.textColor}`} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg tracking-wide">{leaveType.name}</h3>
          <p className="text-sm text-gray-500 font-medium">{leaveType.description}</p>
        </div>
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

        {/* Progress Bar */}
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
  );
};

// Main Component
export default function LeaveManagementPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Leave | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({ leaves: true, stats: false, balance: false });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>(getDefaultBalance());
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    on_leave_now: 0,
    approvalRate: 0,
    total_days_requested: 0,
    average_days: 0
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('MNT001');

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setError(null);
      setLoading({ leaves: true, stats: true, balance: true });
      
      const [leavesData, balanceData] = await Promise.all([
        fetchLeaves(),
        fetchLeaveBalance(selectedEmployeeId)
      ]);
      
      setLeaves(leavesData);
      setLeaveBalance(balanceData);
      
      // Calculate stats from real data
      const today = new Date().toISOString().split('T')[0];
      const approvedLeaves = leavesData.filter(leave => leave.status === 'approved');
      const rejectedLeaves = leavesData.filter(leave => leave.status === 'rejected');
      const decided = approvedLeaves.length + rejectedLeaves.length;
      const approvalRate = decided > 0 ? Math.round((approvedLeaves.length / decided) * 100) : 0;
      const totalDaysRequested = leavesData.reduce((sum, leave) => sum + (leave.total_days || 0), 0);
      const averageDays = leavesData.length > 0 ? Math.round(totalDaysRequested / leavesData.length) : 0;
      
      setStats({
        total: leavesData.length,
        pending: leavesData.filter(leave => leave.status === 'pending').length,
        approved: approvedLeaves.length,
        rejected: rejectedLeaves.length,
        on_leave_now: approvedLeaves.filter(leave => 
          leave.start_date <= today && leave.end_date >= today
        ).length,
        approvalRate,
        total_days_requested: totalDaysRequested,
        average_days: averageDays
      });
      
      setLoading({ leaves: false, stats: false, balance: false });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      setLoading({ leaves: false, stats: false, balance: false });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [selectedEmployeeId]);

  const handleFormSuccess = (message: string, newLeave?: Leave) => {
    setSuccess(message);
    fetchAllData();
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleStatusUpdate = async (leaveId: string, status: Leave['status']) => {
    try {
      setLoading({ leaves: false, stats: true, balance: false });
      const updatedLeave = await updateLeaveStatus(leaveId, status);
      
      setLeaves(prev => prev.map(leave => 
        leave.id === leaveId ? { ...leave, ...updatedLeave, status } : leave
      ));
      
      setSuccess(`Leave status updated to ${status}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError(`Failed to update leave status: ${error.message}`);
    } finally {
      setLoading({ leaves: false, stats: false, balance: false });
    }
  };

  const handleDeleteLeave = async (leaveId: string) => {
    try {
      const result = await deleteLeave(leaveId);
      setLeaves(prev => prev.filter(leave => leave.id !== leaveId));
      setSelectedLeave(null);
      setSuccess(result.message || 'Leave application deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError(`Failed to delete leave: ${error.message}`);
    }
  };

  const filteredLeaves = useMemo(() => {
    let filtered = leaves;
    
    if (filter !== 'all') {
      filtered = filtered.filter(leave => leave.status === filter);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(leave => 
        (leave.employee_name?.toLowerCase() || '').includes(searchLower) ||
        (leave.leave_type?.toLowerCase() || '').includes(searchLower) ||
        (leave.employee_id?.toLowerCase() || '').includes(searchLower) ||
        (leave.position?.toLowerCase() || '').includes(searchLower) ||
        (leave.department?.toLowerCase() || '').includes(searchLower) ||
        (leave.contact_number || '').includes(searchTerm)
      );
    }
    
    return filtered.sort((a, b) => new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime());
  }, [leaves, filter, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 opacity-50" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600">
                    <Database className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">MyOffice HR System</span>
                </Link>
                
                <div className="hidden md:flex items-center gap-1">
                  <Link href="/" className="text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center gap-1">
                    <HomeIcon className="h-3 w-3" />
                    Dashboard
                  </Link>
                  <div className="text-sm text-gray-500">/</div>
                  <span className="text-sm font-medium text-gray-900 px-2">Leave Management</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <select 
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    className="px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold"
                  >
                    <option value="MNT001">My Leave (MNT001)</option>
                    <option value="MNT002">Jane Smith (MNT002)</option>
                    <option value="MNT003">Robert Johnson (MNT003)</option>
                  </select>
                </div>
                <button 
                  onClick={fetchAllData}
                  disabled={loading.leaves || loading.stats}
                  className="p-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                >
                  {loading.leaves ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </button>
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-bold tracking-wide"
                >
                  <Plus className="h-4 w-4" />
                  New Leave Request
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <Calendar className="h-8 w-8 text-indigo-600" />
                  <Layers className="h-8 w-8 text-indigo-500" />
                  <Server className="h-8 w-8 text-indigo-400" />
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Professional Leave Management System
                </h1>
                <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                  Track, approve, and manage employee leave requests with our structured system. 
                  All leave data is securely stored and easily accessible in real-time.
                </p>
              </div>
            </div>
          </section>

          {/* Alerts */}
          {error && (
            <div className="container mx-auto px-4 mb-6">
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-red-800 font-bold tracking-wide">Error</p>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
                <button onClick={fetchAllData} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors font-semibold">
                  Retry
                </button>
                <button onClick={() => setError(null)} className="p-1 hover:bg-red-200 rounded transition-colors">
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="container mx-auto px-4 mb-6">
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
            </div>
          )}

          {/* Statistics Overview */}
          <section className="pb-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Leave Analytics Dashboard
                </h2>
                <p className="text-gray-600 text-sm">
                  Real-time overview of leave requests and status (Auto-refreshes every 30s)
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Requests" 
                  value={stats.total} 
                  icon={FileText}
                  color="bg-blue-500"
                  onClick={() => setFilter('all')}
                />
                <StatCard 
                  title="Pending Review" 
                  value={stats.pending} 
                  icon={Clock}
                  color="bg-amber-500"
                  onClick={() => setFilter('pending')}
                />
                <StatCard 
                  title="Approved" 
                  value={stats.approved} 
                  icon={CheckCircle2}
                  color="bg-emerald-500"
                  onClick={() => setFilter('approved')}
                />
                <StatCard 
                  title="On Leave Now" 
                  value={stats.on_leave_now} 
                  icon={User}
                  color="bg-purple-500"
                  subtitle={`${stats.approvalRate}% approval rate`}
                />
              </div>
              
              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Total Days Requested</h3>
                      <p className="text-sm text-gray-600">Across all leave applications</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_days_requested} days</p>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Average Leave Duration</h3>
                      <p className="text-sm text-gray-600">Per application</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.average_days} days</p>
                </div>
              </div>
            </div>
          </section>

          {/* Leave Balance Summary */}
          <section className="pb-8">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b-2 border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-bold text-gray-900 tracking-wide">My Leave Balance</h2>
                      <p className="text-sm text-gray-600 font-medium">Available leave days and usage overview for {selectedEmployeeId}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gray-50">
                  {loading.balance ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                      <span className="text-gray-700 font-semibold">Loading leave balances...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(leaveBalance).map(([key, data]) => (
                        <LeaveBalanceCard 
                          key={key} 
                          type={key as keyof typeof LEAVE_TYPES} 
                          data={data} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Leave Records Section */}
          <section className="pb-12">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b-2 border-gray-200">
                  <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900 tracking-wide">Leave Requests</h2>
                      <p className="text-sm text-gray-600 font-medium">
                        {loading.leaves ? 'Loading...' : `Showing ${filteredLeaves.length} of ${leaves.length} total requests`}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                      {/* View Mode Toggle */}
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
                          Grid View
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

                      {/* Search */}
                      <div className="relative flex-1 lg:flex-none min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search by name, ID, position, department, or phone..." 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
                          disabled={loading.leaves}
                        />
                      </div>

                      {/* Filter */}
                      <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)} 
                        className="px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[180px] font-semibold"
                        disabled={loading.leaves}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {loading.leaves ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center space-y-3">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                        <p className="text-gray-600 font-semibold">Loading leave records from database...</p>
                        <p className="text-sm text-gray-500">Fetching real-time data from {API_BASE}</p>
                      </div>
                    </div>
                  ) : viewMode === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredLeaves.map((leave) => (
                        <LeaveCard 
                          key={leave.id} 
                          leave={leave} 
                          onView={setSelectedLeave}
                          onEdit={setEditData}
                          onDelete={handleDeleteLeave}
                        />
                      ))}
                    </div>
                  ) : (
                    // Table View
                    <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr>
                            {['Employee', 'Leave Type', 'Period', 'Duration', 'Department', 'Status', 'Applied', 'Actions'].map(header => (
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
                                  <div className={`p-1.5 rounded-lg ${LEAVE_TYPES[leave.leave_type]?.bgColor || 'bg-gray-50'} border-2 ${LEAVE_TYPES[leave.leave_type]?.borderColor || 'border-gray-200'}`}>
                                    {React.createElement(LEAVE_TYPES[leave.leave_type]?.icon || FileText, { 
                                      className: `h-3.5 w-3.5 ${LEAVE_TYPES[leave.leave_type]?.textColor || 'text-gray-600'}` 
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
                                {formatDays(leave.total_days)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                {leave.department || 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                <StatusBadge status={leave.status} />
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                {formatDateTime(leave.applied_date)}
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
                          ? "No leave requests in the system yet. Create the first request!" 
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
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center">
                <div className="flex justify-center mb-3">
                  <Calendar className="h-8 w-8 text-indigo-600" />
                </div>
                
                <h3 className="font-bold text-gray-900 mb-3">
                  Need Help with Leave Management?
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 max-w-lg mx-auto">
                  Our structured system ensures all your leave data is organized, 
                  secure, and easily accessible. Track balances, approve requests, and 
                  generate reports all in one place with real-time data synchronization.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
                    New Leave Request
                  </button>
                  <button 
                    onClick={fetchAllData}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  >
                    <RefreshCw className="h-4 w-4 inline mr-2" />
                    Refresh Data
                  </button>
                  <Link href="/" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 border-t">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-5 w-5 text-indigo-400" />
                  <span className="font-bold text-white">MyOffice HR</span>
                </div>
                <p className="text-gray-400 text-xs">
                  Professional leave management system
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2 text-sm">Modules</h4>
                <ul className="space-y-1">
                  <li><Link href="/employees" className="text-xs text-gray-400 hover:text-white">Personnel</Link></li>
                  <li><Link href="/leaves" className="text-xs text-gray-400 hover:text-white">Leaves</Link></li>
                  <li><Link href="/sheq" className="text-xs text-gray-400 hover:text-white">SHEQ</Link></li>
                  <li><Link href="/reports" className="text-xs text-gray-400 hover:text-white">Reports</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2 text-sm">Resources</h4>
                <ul className="space-y-1">
                  <li><Link href="/support" className="text-xs text-gray-400 hover:text-white">Support</Link></li>
                  <li><Link href="/contact" className="text-xs text-gray-400 hover:text-white">Contact HR</Link></li>
                  <li><Link href="/calendar" className="text-xs text-gray-400 hover:text-white">Leave Calendar</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2 text-sm">System</h4>
                <ul className="space-y-1">
                  <li><span className="text-xs text-gray-400">API: {API_BASE}</span></li>
                  <li><span className="text-xs text-gray-400">Status: {loading.leaves ? 'Loading...' : 'Connected'}</span></li>
                  <li><span className="text-xs text-gray-400">Requests: {leaves.length}</span></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 my-4"></div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} MyOffice Leave Management System • Data refreshes automatically • v2.0
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      {showForm && (
        <LeaveApplicationForm 
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }} 
          onSuccess={handleFormSuccess}
          editData={editData}
          employeeId={selectedEmployeeId}
        />
      )}

      {selectedLeave && (
        <LeaveDetailsModal 
          leave={selectedLeave} 
          onClose={() => setSelectedLeave(null)} 
          onEdit={setEditData}
          onDelete={handleDeleteLeave}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {editData && (
        <LeaveApplicationForm 
          onClose={() => setEditData(null)} 
          onSuccess={handleFormSuccess}
          editData={editData}
          employeeId={selectedEmployeeId}
        />
      )}
    </div>
  );
}