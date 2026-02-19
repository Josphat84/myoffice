"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar, Plus, Search, RefreshCw, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Send, Phone, Trash2, MoreVertical,
  Download, List, LayoutGrid, X, Edit, ArrowUpRight,
  Stethoscope, Shield, Heart, Users, GraduationCap,
  CalendarDays, BookOpen, Database, Layers, Server, Home as HomeIcon,
  BarChart3, PieChart, Mail, ExternalLink, Filter, FilterX,
  ArrowUpDown, SortAsc, SortDesc, EyeOff
} from "lucide-react";
import Link from "next/link";

// Shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`Failed to fetch leaves: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return [];
  }
};

const fetchLeaveBalance = async (employeeId: string = 'MNT001'): Promise<LeaveBalance> => {
  try {
    const response = await fetch(`${LEAVES_API}/balance/${employeeId}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) return getDefaultBalance();
    return await response.json();
  } catch (error) {
    console.error('Error fetching balance:', error);
    return getDefaultBalance();
  }
};

const createLeave = async (leaveData: Partial<Leave>): Promise<Leave> => {
  const response = await fetch(LEAVES_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
};

const updateLeave = async (leaveId: string, leaveData: Partial<Leave>): Promise<Leave> => {
  const response = await fetch(`${LEAVES_API}/${leaveId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...leaveData,
      total_days: calculateDays(leaveData.start_date, leaveData.end_date)
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update leave: ${response.status} - ${errorText}`);
  }

  // Check if response has content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    return data;
  } else {
    // No content returned, assume success and construct a response
    // Use the provided leaveData plus the id
    return {
      ...leaveData,
      id: leaveId,
      total_days: calculateDays(leaveData.start_date, leaveData.end_date),
    } as Leave;
  }
};

const updateLeaveStatus = async (leaveId: string, status: Leave['status'], notes?: string): Promise<Leave> => {
  const response = await fetch(`${LEAVES_API}/${leaveId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update status: ${response.status} - ${errorText}`);
  }
  return await response.json();
};

const deleteLeave = async (leaveId: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${LEAVES_API}/${leaveId}`, { method: 'DELETE' });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete leave: ${response.status} - ${errorText}`);
  }
  return await response.json();
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
      variant: 'secondary' as const, 
      icon: Clock, 
      label: 'Pending Review' 
    },
    approved: { 
      variant: 'success' as const, 
      icon: CheckCircle2, 
      label: 'Approved' 
    },
    rejected: { 
      variant: 'destructive' as const, 
      icon: XCircle, 
      label: 'Rejected' 
    }
  }[status] || { 
    variant: 'outline' as const, 
    icon: Clock, 
    label: 'Unknown' 
  };

  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1 px-2 py-1 whitespace-nowrap">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, onClick, subtitle }: {
  title: string;
  value: number | string;
  icon: React.ComponentType<any>;
  color?: string;
  onClick?: () => void;
  subtitle?: string;
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${onClick ? 'hover:scale-[1.02]' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br from-${color || 'slate'}-600 to-${color || 'slate'}-700 text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {onClick && (
            <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Leave Balance Card Component
const LeaveBalanceCard = ({ type, data }: { type: keyof typeof LEAVE_TYPES; data: LeaveBalanceData }) => {
  const leaveType = LEAVE_TYPES[type] || LEAVE_TYPES.annual;
  const Icon = leaveType.icon;
  const percentage = data.total ? (data.used / data.total) * 100 : 0;
  
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${leaveType.bgColor} border ${leaveType.borderColor}`}>
            <Icon className={`h-5 w-5 ${leaveType.textColor}`} />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{leaveType.name}</CardTitle>
            <CardDescription className="text-xs">{leaveType.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.remaining}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Available</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{data.used}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Used</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{data.total}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Total</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Usage</span>
              <span className="font-medium" style={{ color: leaveType.color }}>
                {Math.round(percentage)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full transition-all duration-1000 ease-out"
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
              <span className="text-sm font-medium">{data.pending} days pending approval</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Leave Card Component (Grid View)
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
    if (!confirm('Delete this leave request?')) return;
    setDeleting(true);
    try {
      await onDelete(leave.id);
      setShowActions(false);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="group relative hover:shadow-lg transition-all cursor-pointer" onClick={() => onView(leave)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-xl ${leaveType.bgColor} border ${leaveType.borderColor} group-hover:scale-110 transition-transform`}>
              <Icon className={`h-4 w-4 ${leaveType.textColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">{leave.employee_name}</CardTitle>
              <CardDescription className="text-xs truncate">
                {leave.position} • {leave.employee_id}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(leave); }}>
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(leave); }}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                  disabled={deleting}
                >
                  {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Leave Type</span>
            <span className="font-medium">{leaveType.shortName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{formatDays(leave.total_days)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dates</span>
            <span className="font-medium text-xs">{formatDate(leave.start_date)} – {formatDate(leave.end_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={leave.status} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Applied</span>
            <span className="font-medium text-xs">{formatDateTime(leave.applied_date)}</span>
          </div>
        </div>
        {leave.reason && (
          <div className="mt-3 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground line-clamp-2">
            {leave.reason}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); onView(leave); }}>
          <Eye className="h-3.5 w-3.5 mr-2" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Leave Application Form (fixed controlled inputs and error handling)
const LeaveApplicationForm = ({ onClose, onSuccess, editData, employeeId = 'MNT001' }: {
  onClose: () => void;
  onSuccess: (message: string, leave?: Leave) => void;
  editData?: Leave | null;
  employeeId?: string;
}) => {
  const [formData, setFormData] = useState<Partial<Leave>>(
    editData ? {
      employee_id: editData.employee_id || employeeId,
      employee_name: editData.employee_name || '',
      position: editData.position || '',
      leave_type: editData.leave_type || 'annual',
      start_date: editData.start_date || '',
      end_date: editData.end_date || '',
      reason: editData.reason || '',
      contact_number: editData.contact_number || '',
      emergency_contact: editData.emergency_contact || '',
      handover_to: editData.handover_to || '',
      department: editData.department || '',
      manager_name: editData.manager_name || '',
      applied_date: editData.applied_date // keep original applied date for updates
    } : {
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
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof Leave, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => { const { [field]: _, ...rest } = prev; return rest; });
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
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Leave Application' : 'New Leave Request'}</DialogTitle>
          <DialogDescription>
            Fill in the details below. All fields marked * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_name">Full Name *</Label>
              <Input
                id="employee_name"
                required
                value={formData.employee_name || ''}
                onChange={(e) => handleChange('employee_name', e.target.value)}
                placeholder="e.g., John Smith"
              />
              {validationErrors.employee_name && (
                <p className="text-sm text-destructive">{validationErrors.employee_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee ID *</Label>
              <Input
                id="employee_id"
                required
                value={formData.employee_id || ''}
                onChange={(e) => handleChange('employee_id', e.target.value)}
                placeholder="e.g., MNT001"
                disabled={!!editData}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                required
                value={formData.position || ''}
                onChange={(e) => handleChange('position', e.target.value)}
                placeholder="e.g., Senior Technician"
              />
              {validationErrors.position && (
                <p className="text-sm text-destructive">{validationErrors.position}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="e.g., Engineering"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number *</Label>
              <Input
                id="contact_number"
                required
                value={formData.contact_number || ''}
                onChange={(e) => handleChange('contact_number', e.target.value)}
                placeholder="+263 XXX XXX XXX"
              />
              {validationErrors.contact_number && (
                <p className="text-sm text-destructive">{validationErrors.contact_number}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager_name">Manager Name</Label>
              <Input
                id="manager_name"
                value={formData.manager_name || ''}
                onChange={(e) => handleChange('manager_name', e.target.value)}
                placeholder="Your direct supervisor"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leave_type">Leave Type *</Label>
              <Select
                value={formData.leave_type || 'annual'}
                onValueChange={(val) => handleChange('leave_type', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAVE_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className={`p-3 rounded-lg ${selectedLeaveType.bgColor} border ${selectedLeaveType.borderColor}`}>
                <p className="text-xs font-medium">{selectedLeaveType.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                type="date"
                id="start_date"
                required
                value={formData.start_date || ''}
                onChange={(e) => handleChange('start_date', e.target.value)}
                // No min attribute – allows past dates
              />
              {validationErrors.start_date && (
                <p className="text-sm text-destructive">{validationErrors.start_date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                type="date"
                id="end_date"
                required
                value={formData.end_date || ''}
                onChange={(e) => handleChange('end_date', e.target.value)}
                min={formData.start_date} // keep relative validation
              />
              {validationErrors.end_date && (
                <p className="text-sm text-destructive">{validationErrors.end_date}</p>
              )}
            </div>
          </div>

          {calculatedDays > 0 && (
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Leave Days</p>
              <p className="text-2xl font-bold">{calculatedDays} days</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave *</Label>
            <Textarea
              id="reason"
              required
              rows={4}
              value={formData.reason || ''}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="Please provide detailed reasons..."
            />
            {validationErrors.reason && (
              <p className="text-sm text-destructive">{validationErrors.reason}</p>
            )}
          </div>

          {/* Additional info (emergency contact, handover) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                value={formData.emergency_contact || ''}
                onChange={(e) => handleChange('emergency_contact', e.target.value)}
                placeholder="Name and phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handover_to">Handover To</Label>
              <Input
                id="handover_to"
                value={formData.handover_to || ''}
                onChange={(e) => handleChange('handover_to', e.target.value)}
                placeholder="Colleague's name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editData ? 'Update Request' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Leave Details Modal
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

  const handleStatusChange = async (newStatus: Leave['status']) => {
    setUpdating(true);
    try {
      await onStatusUpdate(leave.id, newStatus);
      setShowStatusActions(false);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this leave request?')) return;
    setUpdating(true);
    try {
      await onDelete(leave.id);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${selectedLeaveType.bgColor} border ${selectedLeaveType.borderColor}`}>
              {React.createElement(selectedLeaveType.icon, { className: `h-5 w-5 ${selectedLeaveType.textColor}` })}
            </div>
            Leave Request #{leave.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {updating && (
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm font-medium">Updating...</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Employee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Name:</span> {leave.employee_name}</div>
                <div><span className="text-muted-foreground">ID:</span> {leave.employee_id}</div>
                <div><span className="text-muted-foreground">Position:</span> {leave.position}</div>
                <div><span className="text-muted-foreground">Department:</span> {leave.department || '—'}</div>
                <div><span className="text-muted-foreground">Contact:</span> {leave.contact_number}</div>
                {leave.emergency_contact && <div><span className="text-muted-foreground">Emergency:</span> {leave.emergency_contact}</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Leave Type</span>
                  <span className="font-medium">{selectedLeaveType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={leave.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{formatDate(leave.start_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">{formatDate(leave.end_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{formatDays(leave.total_days)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applied</span>
                  <span className="font-medium">{formatDateTime(leave.applied_date)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" /> Reason
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">{leave.reason}</p>
            </CardContent>
          </Card>

          {/* Approval statuses if present */}
          {(leave.manager_approval || leave.hr_approval) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approval Status</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {leave.manager_approval && (
                  <div>
                    <p className="text-xs text-muted-foreground">Manager</p>
                    <Badge variant={leave.manager_approval === 'approved' ? 'success' : leave.manager_approval === 'rejected' ? 'destructive' : 'secondary'}>
                      {leave.manager_approval}
                    </Badge>
                  </div>
                )}
                {leave.hr_approval && (
                  <div>
                    <p className="text-xs text-muted-foreground">HR</p>
                    <Badge variant={leave.hr_approval === 'approved' ? 'success' : leave.hr_approval === 'rejected' ? 'destructive' : 'secondary'}>
                      {leave.hr_approval}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Supporting documents */}
          {leave.supporting_docs && leave.supporting_docs.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Supporting Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leave.supporting_docs.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
                      <span className="text-sm">Document {i+1}</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-2" /> View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={() => { onEdit(leave); onClose(); }}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <DropdownMenu open={showStatusActions} onOpenChange={setShowStatusActions}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Update Status <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleStatusChange('approved')}>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>
                  <XCircle className="h-4 w-4 mr-2 text-destructive" /> Reject
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" /> Mark Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="destructive" onClick={handleDelete} disabled={updating}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export default function LeaveManagementPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Leave | null>(null);
  const [filter, setFilter] = useState<string>('all'); // status filter
  const [typeFilter, setTypeFilter] = useState<string>('all'); // leave type filter
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, days-desc, days-asc, name-asc, name-desc
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({ leaves: true, stats: false, balance: false });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>(getDefaultBalance());
  const [showBalance, setShowBalance] = useState(false); // toggle for leave balances
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
  const [selectedEmployeeId] = useState('MNT001'); // simplified – just current user

  const fetchAllData = async () => {
    try {
      setError(null);
      setLoading(prev => ({ ...prev, leaves: true, stats: true, balance: true }));
      
      const [leavesData, balanceData] = await Promise.all([
        fetchLeaves(),
        fetchLeaveBalance(selectedEmployeeId)
      ]);
      
      setLeaves(leavesData);
      setLeaveBalance(balanceData);
      
      const today = new Date().toISOString().split('T')[0];
      const approvedLeaves = leavesData.filter(l => l.status === 'approved');
      const rejectedLeaves = leavesData.filter(l => l.status === 'rejected');
      const decided = approvedLeaves.length + rejectedLeaves.length;
      const approvalRate = decided > 0 ? Math.round((approvedLeaves.length / decided) * 100) : 0;
      const totalDays = leavesData.reduce((sum, l) => sum + (l.total_days || 0), 0);
      const avgDays = leavesData.length > 0 ? Math.round(totalDays / leavesData.length) : 0;
      
      setStats({
        total: leavesData.length,
        pending: leavesData.filter(l => l.status === 'pending').length,
        approved: approvedLeaves.length,
        rejected: rejectedLeaves.length,
        on_leave_now: approvedLeaves.filter(l => l.start_date <= today && l.end_date >= today).length,
        approvalRate,
        total_days_requested: totalDays,
        average_days: avgDays
      });
      
      setLoading(prev => ({ ...prev, leaves: false, stats: false, balance: false }));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      setLoading(prev => ({ ...prev, leaves: false, stats: false, balance: false }));
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFormSuccess = (message: string) => {
    toast.success(message);
    fetchAllData();
  };

  const handleStatusUpdate = async (id: string, status: Leave['status']) => {
    try {
      await updateLeaveStatus(id, status);
      toast.success(`Status updated to ${status}`);
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLeave(id);
      toast.success('Leave deleted');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Filtering and sorting
  const filteredLeaves = useMemo(() => {
    let filtered = leaves;

    // Status filter
    if (filter !== 'all') filtered = filtered.filter(l => l.status === filter);

    // Leave type filter
    if (typeFilter !== 'all') filtered = filtered.filter(l => l.leave_type === typeFilter);

    // Date range filter
    if (dateFrom) filtered = filtered.filter(l => l.start_date >= dateFrom);
    if (dateTo) filtered = filtered.filter(l => l.end_date <= dateTo);

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(l =>
        l.employee_name?.toLowerCase().includes(term) ||
        l.employee_id?.toLowerCase().includes(term) ||
        l.position?.toLowerCase().includes(term) ||
        l.department?.toLowerCase().includes(term)
      );
    }

    // Sorting
    const [sortField, sortDirection] = sortBy.split('-');
    filtered.sort((a, b) => {
      if (sortField === 'date') {
        const aVal = new Date(a.applied_date).getTime();
        const bVal = new Date(b.applied_date).getTime();
        return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
      } else if (sortField === 'days') {
        return sortDirection === 'desc' ? b.total_days - a.total_days : a.total_days - b.total_days;
      } else if (sortField === 'name') {
        const compare = a.employee_name.localeCompare(b.employee_name);
        return sortDirection === 'desc' ? -compare : compare;
      }
      return 0;
    });

    return filtered;
  }, [leaves, filter, typeFilter, dateFrom, dateTo, searchTerm, sortBy]);

  const clearFilters = () => {
    setFilter('all');
    setTypeFilter('all');
    setDateFrom('');
    setDateTo('');
    setSearchTerm('');
    setSortBy('date-desc');
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded bg-primary p-1.5">
                <Database className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">MyOffice HR</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <nav className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Home</Link>
              </Button>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-medium">Leaves</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedEmployeeId}
            </span>
            <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading.leaves}>
              {loading.leaves ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" /> New Leave
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage employee leave requests, track balances, and approve time off.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Requests" value={stats.total} icon={FileText} color="slate" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="amber" onClick={() => setFilter('pending')} />
          <StatCard title="Approved" value={stats.approved} icon={CheckCircle2} color="emerald" onClick={() => setFilter('approved')} />
          <StatCard title="On Leave Now" value={stats.on_leave_now} icon={User} color="purple" subtitle={`${stats.approvalRate}% approval`} />
        </div>

        {/* Leave Balance with toggle */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Leave Balance</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowBalance(!showBalance)} className="gap-2">
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showBalance ? 'Hide' : 'Show'} Balance
              </Button>
            </div>
            <CardDescription>Available leave days for {selectedEmployeeId}</CardDescription>
          </CardHeader>
          {showBalance && (
            <CardContent>
              {loading.balance ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(leaveBalance).map(([key, data]) => (
                    <LeaveBalanceCard key={key} type={key as keyof typeof LEAVE_TYPES} data={data} />
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Main content with advanced filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Leave Requests</CardTitle>
                <CardDescription>
                  {filteredLeaves.length} of {leaves.length} requests
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Sort dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="days-desc">Days (High-Low)</SelectItem>
                    <SelectItem value="days-asc">Days (Low-High)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>

                {/* View toggle */}
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced filters row */}
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status filter */}
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Leave type filter */}
                <div>
                  <Label className="text-xs">Leave Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(LEAVE_TYPES).map(([key, type]) => (
                        <SelectItem key={key} value={key}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date from */}
                <div>
                  <Label className="text-xs">From Date</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Date to */}
                <div>
                  <Label className="text-xs">To Date</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                  <FilterX className="h-3 w-3" /> Clear Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading.leaves ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No leave requests found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {leaves.length === 0 ? 'Create your first request.' : 'Try adjusting your filters.'}
                </p>
                {leaves.length === 0 && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" /> New Leave
                  </Button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLeaves.map((leave) => (
                  <LeaveCard
                    key={leave.id}
                    leave={leave}
                    onView={setSelectedLeave}
                    onEdit={(l) => { setEditData(l); setShowForm(true); }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaves.map((leave) => (
                      <TableRow
                        key={leave.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedLeave(leave)}
                      >
                        <TableCell>
                          <div className="font-medium">{leave.employee_name}</div>
                          <div className="text-xs text-muted-foreground">{leave.employee_id}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            {React.createElement(LEAVE_TYPES[leave.leave_type]?.icon || FileText, { className: "h-3 w-3" })}
                            {LEAVE_TYPES[leave.leave_type]?.shortName || leave.leave_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">
                          {formatDate(leave.start_date)} – {formatDate(leave.end_date)}
                        </TableCell>
                        <TableCell>{formatDays(leave.total_days)}</TableCell>
                        <TableCell>
                          <StatusBadge status={leave.status} />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTime(leave.applied_date)}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedLeave(leave)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setEditData(leave); setShowForm(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      {showForm && (
        <LeaveApplicationForm
          onClose={() => { setShowForm(false); setEditData(null); }}
          onSuccess={handleFormSuccess}
          editData={editData}
          employeeId={selectedEmployeeId}
        />
      )}

      {selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
          onEdit={(l) => { setEditData(l); setShowForm(true); setSelectedLeave(null); }}
          onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}