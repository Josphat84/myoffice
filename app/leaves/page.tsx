"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Calendar, Plus, Search, RefreshCw, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Send, Phone, Trash2, MoreVertical,
  Download, List, LayoutGrid, X, Edit, ArrowUpRight,
  Stethoscope, Shield, Heart, Users, GraduationCap
} from "lucide-react";
import Link from "next/link";

// Simple type definitions
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
}

// Simple Constants
const LEAVE_TYPES: Record<string, LeaveType> = {
  annual: { 
    name: 'Annual Leave', shortName: 'Annual', color: '#2563eb', 
    bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200',
    icon: Calendar, gradient: 'from-blue-500 to-blue-600',
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

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const LEAVES_API = `${API_BASE}/api/leaves`;

// Utility functions
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return 'Invalid date';
  }
};

const calculateDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// Status Badge Component
const StatusBadge = ({ status }: { status: Leave['status'] }) => {
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
  }[status];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-medium tracking-wide">{config.label}</span>
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, onClick, subtitle }: {
  title: string;
  value: number | string;
  icon: React.ComponentType<any>;
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

// Leave Card Component
const LeaveCard = ({ leave, onView, onEdit, onDelete }: {
  leave: Leave;
  onView: (leave: Leave) => void;
  onEdit: (leave: Leave) => void;
  onDelete: (leaveId: string) => void;
}) => {
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
          <span className="text-gray-600 font-semibold">Leave Type</span>
          <span className="font-bold" style={{ color: leaveType.color }}>{leaveType.shortName}</span>
        </div>
      </div>

      {leave.reason && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">{leave.reason}</p>
        </div>
      )}

      <button 
        onClick={() => onView(leave)}
        className="w-full py-2.5 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 group/btn border-2 border-gray-200 hover:border-gray-300"
      >
        <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
        View Details
      </button>
    </div>
  );
};

// Leave Application Form Component
const LeaveApplicationForm = ({ onClose, onSuccess, editData }: {
  onClose: () => void;
  onSuccess: (message: string) => void;
  editData?: Leave | null;
}) => {
  const [formData, setFormData] = useState<Partial<Leave>>(editData || {
    employee_name: '', employee_id: '', position: '', leave_type: 'annual',
    start_date: '', end_date: '', reason: '', contact_number: '', 
    emergency_contact: '', handover_to: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof Leave, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.employee_name || !formData.employee_id || !formData.position || 
          !formData.start_date || !formData.end_date || !formData.reason || !formData.contact_number) {
        throw new Error('Please fill in all required fields');
      }

      if (new Date(formData.end_date!) < new Date(formData.start_date!)) {
        throw new Error('End date must be after start date');
      }

      const response = await fetch(LEAVES_API, {
        method: editData ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData ? { ...formData, id: editData.id } : formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editData ? 'update' : 'create'} leave`);
      }

      onSuccess(editData ? 'Leave application updated successfully!' : 'Leave application submitted successfully!');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculatedDays = calculateDays(formData.start_date || '', formData.end_date || '');
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
              { label: 'Contact Number', field: 'contact_number', type: 'tel', placeholder: '+263 XXX XXX XXX', required: true }
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

// Leave Details Modal
const LeaveDetailsModal = ({ leave, onClose, onEdit, onDelete }: {
  leave: Leave;
  onClose: () => void;
  onEdit: (leave: Leave) => void;
  onDelete: (leaveId: string) => void;
}) => {
  const selectedLeaveType = LEAVE_TYPES[leave.leave_type];

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
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600 border-2 border-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
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
                </div>
              </div>

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

          <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
            <button 
              onClick={() => onEdit(leave)}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              <Edit className="h-4 w-4" />
              Edit Application
            </button>
            <button 
              onClick={() => onDelete(leave.id)}
              className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              <Trash2 className="h-4 w-4" />
              Delete Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function PremiumLeaveManagement() {
  const [leaves, setLeaves] = useState<Leave[]>([
    {
      id: '1',
      employee_name: 'John Doe',
      employee_id: 'MNT001',
      position: 'Senior Technician',
      leave_type: 'annual',
      start_date: '2024-01-15',
      end_date: '2024-01-20',
      reason: 'Family vacation',
      contact_number: '+263 77 123 4567',
      status: 'approved',
      total_days: 6,
      applied_date: '2024-01-10'
    },
    {
      id: '2',
      employee_name: 'Jane Smith',
      employee_id: 'MNT002',
      position: 'Manager',
      leave_type: 'sick',
      start_date: '2024-01-18',
      end_date: '2024-01-20',
      reason: 'Medical appointment',
      contact_number: '+263 77 234 5678',
      status: 'pending',
      total_days: 3,
      applied_date: '2024-01-17'
    },
    {
      id: '3',
      employee_name: 'Robert Johnson',
      employee_id: 'MNT003',
      position: 'Engineer',
      leave_type: 'emergency',
      start_date: '2024-01-22',
      end_date: '2024-01-24',
      reason: 'Family emergency',
      contact_number: '+263 77 345 6789',
      status: 'approved',
      total_days: 3,
      applied_date: '2024-01-20'
    }
  ]);
  
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Leave | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleFormSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleDeleteLeave = async (leaveId: string) => {
    if (!confirm('Are you sure you want to delete this leave application? This action cannot be undone.')) {
      return;
    }

    try {
      setLeaves(prev => prev.filter(leave => leave.id !== leaveId));
      setSelectedLeave(null);
      setSuccess('Leave application deleted successfully');
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
        leave.employee_name?.toLowerCase().includes(searchLower) ||
        leave.leave_type?.toLowerCase().includes(searchLower) ||
        leave.employee_id?.toLowerCase().includes(searchLower) ||
        leave.position?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [leaves, filter, searchTerm]);

  const stats = useMemo(() => {
    const total = leaves.length;
    const pending = leaves.filter(leave => leave.status === 'pending').length;
    const approved = leaves.filter(leave => leave.status === 'approved').length;
    const rejected = leaves.filter(leave => leave.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  }, [leaves]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">Leave Management</span>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={async () => {
                    setLoading(true);
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setLoading(false);
                  }}
                  disabled={loading}
                  className="p-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </button>
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-bold tracking-wide"
                >
                  <Plus className="h-4 w-4" />
                  New Request
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Alerts */}
          {error && (
            <div className="container mx-auto px-4 mb-6">
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-red-800 font-bold tracking-wide">Error</p>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
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

          {/* Statistics */}
          <section className="pb-8 pt-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Leave Analytics
                </h2>
                <p className="text-gray-600 text-sm">
                  Overview of leave requests and status
                </p>
              </div>

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
                  title="Not Approved" 
                  value={stats.rejected} 
                  icon={XCircle} 
                />
              </div>
            </div>
          </section>

          {/* Leave Records */}
          <section className="pb-12">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b-2 border-gray-200">
                  <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900 tracking-wide">Leave Requests</h2>
                      <p className="text-sm text-gray-600 font-medium">Manage and review all leave applications</p>
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

                      {/* Search */}
                      <div className="relative flex-1 lg:flex-none min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search by name, ID, or position..." 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
                        />
                      </div>

                      {/* Filter */}
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
                  {viewMode === 'grid' ? (
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
                    <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr>
                            {['Employee', 'Leave Type', 'Period', 'Duration', 'Status', 'Actions'].map(header => (
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
                                  <div className={`p-1.5 rounded-lg ${LEAVE_TYPES[leave.leave_type].bgColor} border-2 ${LEAVE_TYPES[leave.leave_type].borderColor}`}>
                                    {React.createElement(LEAVE_TYPES[leave.leave_type].icon, { 
                                      className: `h-3.5 w-3.5 ${LEAVE_TYPES[leave.leave_type].textColor}` 
                                    })}
                                  </div>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {LEAVE_TYPES[leave.leave_type].shortName}
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

                  {filteredLeaves.length === 0 && (
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
                  Track, approve, and manage employee leave requests in one place.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
                    New Leave Request
                  </button>
                  <Link href="/" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-gray-900 text-gray-300 border-t">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Leave Management System
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
        />
      )}

      {selectedLeave && (
        <LeaveDetailsModal 
          leave={selectedLeave} 
          onClose={() => setSelectedLeave(null)} 
          onEdit={setEditData}
          onDelete={handleDeleteLeave}
        />
      )}

      {editData && (
        <LeaveApplicationForm 
          onClose={() => setEditData(null)} 
          onSuccess={handleFormSuccess}
          editData={editData}
        />
      )}
    </div>
  );
}