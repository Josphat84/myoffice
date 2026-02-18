"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar, Plus, Search, RefreshCw, Filter, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Send, Trash2, MoreVertical,
  Download, Edit, X, ArrowUpRight,
  TrendingUp, BarChart3, Users, Briefcase, Zap, FileDown,
  List, LayoutGrid, Home as HomeIcon, Database, Layers, Server,
  Link as LinkIcon, FilterX, CalendarRange, UserCheck, ChevronLeft, ChevronRight,
  ArrowUpDown, SortAsc, SortDesc
} from "lucide-react";
import Link from "next/link";

// shadcn/ui imports
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

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const OVERTIME_API = `${API_BASE}/api/overtime`;

// Overtime Types (no rate info in UI)
const OVERTIME_TYPES = {
  regular: {
    name: 'Regular Overtime',
    shortName: 'Regular',
    icon: Clock,
    variant: 'default',
  },
  weekend: {
    name: 'Weekend Overtime',
    shortName: 'Weekend',
    icon: Calendar,
    variant: 'secondary',
  },
  emergency: {
    name: 'Emergency Overtime',
    shortName: 'Emergency',
    icon: AlertCircle,
    variant: 'destructive',
  },
  project: {
    name: 'Project Overtime',
    shortName: 'Project',
    icon: FileText,
    variant: 'outline',
  },
};

// Status configurations
const STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'secondary', icon: Clock },
  approved: { label: 'Approved', variant: 'success', icon: CheckCircle2 },
  rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
  paid: { label: 'Paid', variant: 'default', icon: TrendingUp },
};

// Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      hour12: true,
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

// API Functions
const fetchOvertime = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.overtime_type && filters.overtime_type !== 'all') params.append('overtime_type', filters.overtime_type);
  if (filters.employee_id && filters.employee_id !== 'all') params.append('employee_id', filters.employee_id);
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);
  
  const url = params.toString() ? `${OVERTIME_API}?${params.toString()}` : OVERTIME_API;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch overtime');
  return res.json();
};

const createOvertime = async (data) => {
  const res = await fetch(OVERTIME_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create overtime');
  return res.json();
};

const updateOvertime = async (id, data) => {
  const res = await fetch(`${OVERTIME_API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update overtime');
  return res.json();
};

const updateOvertimeStatus = async (id, status) => {
  return updateOvertime(id, { status });
};

const deleteOvertime = async (id) => {
  const res = await fetch(`${OVERTIME_API}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete overtime');
  return res.json();
};

// ============= Export to Excel (CSV) =============
const exportToExcel = (data, filename = `overtime-${new Date().toISOString().split('T')[0]}.csv`) => {
  if (!data || data.length === 0) {
    toast.warning('No data to export');
    return;
  }

  const headers = [
    'ID', 'Employee Name', 'Employee ID', 'Position', 'Overtime Type',
    'Date', 'Start Time', 'End Time', 'Hours', 'Reason',
    'Contact Number', 'Emergency Contact', 'Status', 'Applied Date',
    'Notes', 'Hourly Rate', 'Created At',
  ];

  const rows = data.map((item) => {
    const hours = calculateHours(item.start_time, item.end_time, item.date);
    return [
      item.id,
      item.employee_name,
      item.employee_id,
      item.position,
      item.overtime_type,
      item.date,
      item.start_time,
      item.end_time,
      hours.toFixed(2),
      item.reason,
      item.contact_number,
      item.emergency_contact || '',
      item.status,
      item.applied_date || '',
      item.notes || '',
      item.hourly_rate || '',
      item.created_at || '',
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  toast.success(`Exported ${data.length} records`);
};

// ============= Component Sub‑components =============

// Status Badge
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="gap-1 px-2 py-1 whitespace-nowrap">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Type Badge
const TypeBadge = ({ type }) => {
  const config = OVERTIME_TYPES[type] || OVERTIME_TYPES.regular;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="gap-1 px-2 py-1 whitespace-nowrap">
      <Icon className="h-3 w-3" />
      {config.shortName}
    </Badge>
  );
};

// Stat Card
const StatCard = ({ title, value, icon: Icon, onClick }) => (
  <Card
    className={`cursor-pointer transition-all hover:shadow-lg ${onClick ? '' : 'cursor-default'}`}
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Overtime Card (Grid View) with inline expand/collapse and visible label
const OvertimeCard = ({ overtime, onView, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = OVERTIME_TYPES[overtime.overtime_type];
  const Icon = typeConfig.icon;
  const hours = calculateHours(overtime.start_time, overtime.end_time, overtime.date);

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Card className="group relative hover:shadow-lg transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="rounded-full bg-primary/10 p-2 text-primary flex-shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">{overtime.employee_name}</CardTitle>
              <CardDescription className="text-xs truncate">
                {overtime.position} • {overtime.employee_id}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1"
              onClick={handleExpandClick}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="hidden sm:inline text-xs">{expanded ? 'Hide details' : 'View details'}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(overtime); }}>
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(overtime); }}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(overtime.id); }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{formatDate(overtime.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">
              {formatTime(overtime.start_time)} – {formatTime(overtime.end_time)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hours</span>
            <span className="font-medium">{hours} h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type</span>
            <TypeBadge type={overtime.overtime_type} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={overtime.status} />
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3 w-full">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Reason</p>
              <p className="text-sm bg-muted/50 p-2 rounded-md break-words whitespace-pre-wrap">{overtime.reason || 'No reason provided'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="font-medium break-words">{overtime.contact_number}</p>
              </div>
              {overtime.emergency_contact && (
                <div>
                  <p className="text-xs text-muted-foreground">Emergency</p>
                  <p className="font-medium break-words">{overtime.emergency_contact}</p>
                </div>
              )}
            </div>
            {overtime.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="text-sm break-words whitespace-pre-wrap">{overtime.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full" onClick={() => onView(overtime)}>
          <Eye className="h-3.5 w-3.5 mr-2" /> View Full Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Overtime Application Form
const OvertimeApplicationForm = ({ onClose, onSuccess, editData, onUpdate }) => {
  const [formData, setFormData] = useState(
    editData || {
      employee_name: '',
      employee_id: '',
      position: '',
      overtime_type: 'regular',
      date: new Date().toISOString().split('T')[0],
      start_time: '18:00',
      end_time: '20:00',
      reason: '',
      contact_number: '',
      emergency_contact: '',
      hourly_rate: 25,
    }
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        await onUpdate(editData.id, formData);
        toast.success('Overtime application updated');
      } else {
        await createOvertime(formData);
        toast.success('Overtime application submitted');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const hours = calculateHours(formData.start_time, formData.end_time, formData.date);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit' : 'New'} Overtime Request</DialogTitle>
          <DialogDescription>
            Fill in the details below. All fields marked * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                required
                value={formData.employee_name}
                onChange={(e) => handleChange('employee_name', e.target.value)}
                placeholder="e.g., John Smith"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee ID *</label>
              <Input
                required
                value={formData.employee_id}
                onChange={(e) => handleChange('employee_id', e.target.value)}
                placeholder="e.g., EMP001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position *</label>
              <Input
                required
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                placeholder="e.g., Technician"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number *</label>
              <Input
                required
                value={formData.contact_number}
                onChange={(e) => handleChange('contact_number', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Overtime Type *</label>
              <Select
                value={formData.overtime_type}
                onValueChange={(val) => handleChange('overtime_type', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OVERTIME_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date *</label>
              <Input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time *</label>
              <Input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time *</label>
              <Input
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
              />
            </div>
          </div>

          {hours > 0 && (
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">{hours} h</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Overtime *</label>
            <Textarea
              required
              rows={4}
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="Please provide details about why overtime is required..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Emergency Contact (optional)</label>
            <Input
              value={formData.emergency_contact}
              onChange={(e) => handleChange('emergency_contact', e.target.value)}
              placeholder="Name and phone number"
            />
          </div>

          <input type="hidden" name="hourly_rate" value={formData.hourly_rate} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editData ? 'Update' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Overtime Details Modal
const OvertimeDetailsModal = ({ overtime, onClose, onStatusUpdate, onDelete, onEdit }) => {
  const [updating, setUpdating] = useState(false);
  const typeConfig = OVERTIME_TYPES[overtime.overtime_type];
  const hours = calculateHours(overtime.start_time, overtime.end_time, overtime.date);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(overtime.id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this overtime request?')) return;
    setUpdating(true);
    try {
      await onDelete(overtime.id);
      toast.success('Request deleted');
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {React.createElement(typeConfig.icon, { className: "h-5 w-5" })}
            </div>
            Overtime Request #{overtime.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Employee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {overtime.employee_name}</p>
                <p><span className="text-muted-foreground">ID:</span> {overtime.employee_id}</p>
                <p><span className="text-muted-foreground">Position:</span> {overtime.position}</p>
                <p><span className="text-muted-foreground">Contact:</span> {overtime.contact_number}</p>
                {overtime.emergency_contact && (
                  <p><span className="text-muted-foreground">Emergency:</span> {overtime.emergency_contact}</p>
                )}
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
                  <span className="text-muted-foreground">Type</span>
                  <TypeBadge type={overtime.overtime_type} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={overtime.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{formatDate(overtime.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">
                    {formatTime(overtime.start_time)} – {formatTime(overtime.end_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours</span>
                  <span className="font-medium">{hours} h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applied</span>
                  <span className="font-medium">{formatDate(overtime.applied_date)}</span>
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
              <p className="whitespace-pre-wrap text-sm break-words">{overtime.reason}</p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={() => { onEdit(overtime); onClose(); }}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <DropdownMenu>
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

// Employee Summary Component
const EmployeeSummary = ({ data, show, onToggle, sortBy, sortOrder }) => {
  const summary = useMemo(() => {
    const map = new Map();
    data.forEach((item) => {
      const id = item.employee_id;
      if (!map.has(id)) {
        map.set(id, {
          employee_name: item.employee_name,
          employee_id: id,
          count: 0,
          totalHours: 0,
        });
      }
      const entry = map.get(id);
      entry.count += 1;
      entry.totalHours += calculateHours(item.start_time, item.end_time, item.date);
    });

    let sorted = Array.from(map.values());
    
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.employee_name.localeCompare(b.employee_name));
    } else if (sortBy === 'hours') {
      sorted.sort((a, b) => a.totalHours - b.totalHours);
    } else {
      sorted.sort((a, b) => b.totalHours - a.totalHours);
    }

    if (sortOrder === 'desc' && sortBy !== 'hours') {
      if (sortBy === 'name') sorted.reverse();
    } else if (sortOrder === 'asc' && sortBy === 'hours') {
      // already asc
    } else if (sortOrder === 'desc' && sortBy === 'hours') {
      sorted.reverse();
    }

    return sorted;
  }, [data, sortBy, sortOrder]);

  if (summary.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" /> Employee Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="hide-summary" className="text-sm">Hide</Label>
            <Switch
              id="hide-summary"
              checked={!show}
              onCheckedChange={(checked) => onToggle(!checked)}
            />
          </div>
        </div>
        <CardDescription>
          Total hours and requests per employee (based on current filters)
        </CardDescription>
      </CardHeader>
      {show && (
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">Requests</TableHead>
                  <TableHead className="text-right">Total Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.map((emp) => (
                  <TableRow key={emp.employee_id}>
                    <TableCell>
                      <div className="font-medium break-words">{emp.employee_name}</div>
                      <div className="text-xs text-muted-foreground">{emp.employee_id}</div>
                    </TableCell>
                    <TableCell className="text-right">{emp.count}</TableCell>
                    <TableCell className="text-right font-medium">
                      {Math.round(emp.totalHours * 100) / 100} h
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// ============= Main Page =============
export default function OvertimeManagementPage() {
  const [overtime, setOvertime] = useState([]);
  const [selectedOvertime, setSelectedOvertime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState('all'); // status filter
  const [typeFilter, setTypeFilter] = useState('all'); // overtime type filter
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  // Sorting
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'hours'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  // Expanded rows in table view
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Get unique employees for dropdown
  const employeeOptions = useMemo(() => {
    const map = new Map();
    overtime.forEach((ot) => {
      if (!map.has(ot.employee_id)) {
        map.set(ot.employee_id, {
          id: ot.employee_id,
          name: ot.employee_name,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [overtime]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const apiFilters = {
        status: filter === 'all' ? null : filter,
        overtime_type: typeFilter === 'all' ? null : typeFilter,
        employee_id: employeeFilter === 'all' ? null : employeeFilter,
        date_from: dateFrom || null,
        date_to: dateTo || null,
      };
      const data = await fetchOvertime(apiFilters);
      setOvertime(data);
    } catch (error) {
      toast.error('Failed to load overtime data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [filter, typeFilter, employeeFilter, dateFrom, dateTo]);

  const handleCreate = async (data) => {
    const newItem = await createOvertime(data);
    setOvertime((prev) => [...prev, newItem]);
  };

  const handleUpdate = async (id, data) => {
    const updated = await updateOvertime(id, data);
    setOvertime((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleStatusUpdate = async (id, status) => {
    await updateOvertimeStatus(id, status);
    setOvertime((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleDelete = async (id) => {
    await deleteOvertime(id);
    setOvertime((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleRowExpanded = (id, e) => {
    e.stopPropagation();
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const processedOvertime = useMemo(() => {
    let filtered = overtime;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ot) =>
          ot.employee_name?.toLowerCase().includes(term) ||
          ot.employee_id?.toLowerCase().includes(term) ||
          ot.position?.toLowerCase().includes(term)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      let compare = 0;
      if (sortBy === 'date') {
        compare = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'name') {
        compare = a.employee_name.localeCompare(b.employee_name);
      } else if (sortBy === 'hours') {
        const hoursA = calculateHours(a.start_time, a.end_time, a.date);
        const hoursB = calculateHours(b.start_time, b.end_time, b.date);
        compare = hoursA - hoursB;
      }
      return sortOrder === 'asc' ? compare : -compare;
    });

    return sorted;
  }, [overtime, searchTerm, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = processedOvertime.length;
    const pending = processedOvertime.filter((ot) => ot.status === 'pending').length;
    const approved = processedOvertime.filter((ot) => ot.status === 'approved').length;
    const rejected = processedOvertime.filter((ot) => ot.status === 'rejected').length;
    const totalHours = processedOvertime.reduce((sum, ot) => {
      const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
      return sum + hours;
    }, 0);
    return { total, pending, approved, rejected, totalHours: Math.round(totalHours * 100) / 100 };
  }, [processedOvertime]);

  const clearFilters = () => {
    setEmployeeFilter('all');
    setTypeFilter('all');
    setDateFrom('');
    setDateTo('');
    setFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded bg-primary p-1.5">
                <Database className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">MyOffice</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <nav className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Home</Link>
              </Button>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-medium">Overtime</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToExcel(processedOvertime)}
              title="Export to Excel"
            >
              <FileDown className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" /> New Overtime
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Overtime Management</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track, review, and manage all overtime requests.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Requests" value={stats.total} icon={FileText} />
          <StatCard
            title="Pending"
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
          <StatCard title="Total Hours" value={`${stats.totalHours} h`} icon={TrendingUp} />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Overtime Requests</h2>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
                  const [by, order] = val.split('-');
                  setSortBy(by);
                  setSortOrder(order);
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="hours-desc">Hours (High-Low)</SelectItem>
                    <SelectItem value="hours-asc">Hours (Low-High)</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
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

            {showAdvancedFilters && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Filter Options</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                    <FilterX className="h-4 w-4 mr-2" /> Clear all
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Employee</label>
                    <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {employeeOptions.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name} ({emp.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Overtime Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {Object.entries(OVERTIME_TYPES).map(([key, type]) => (
                          <SelectItem key={key} value={key}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Date From</label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Date To</label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Status</label>
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {processedOvertime.length > 0 && (
              <EmployeeSummary
                data={processedOvertime}
                show={showSummary}
                onToggle={setShowSummary}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : processedOvertime.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No overtime requests found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {overtime.length === 0
                    ? 'Get started by creating your first request.'
                    : 'Try adjusting your filters.'}
                </p>
                {overtime.length === 0 && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" /> New Request
                  </Button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {processedOvertime.map((ot) => (
                  <OvertimeCard
                    key={ot.id}
                    overtime={ot}
                    onView={setSelectedOvertime}
                    onEdit={(ot) => { setEditData(ot); setShowForm(true); }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedOvertime.map((ot) => {
                      const hours = calculateHours(ot.start_time, ot.end_time, ot.date);
                      const isExpanded = expandedRows.has(ot.id);
                      return (
                        <React.Fragment key={ot.id}>
                          <TableRow
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedOvertime(ot)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 gap-1 text-xs"
                                onClick={(e) => toggleRowExpanded(ot.id, e)}
                              >
                                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                <span className="hidden sm:inline">{isExpanded ? 'Hide details' : 'View details'}</span>
                              </Button>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <div className="font-medium break-words">{ot.employee_name}</div>
                              <div className="text-xs text-muted-foreground break-words">{ot.employee_id}</div>
                            </TableCell>
                            <TableCell>
                              <TypeBadge type={ot.overtime_type} />
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{formatDate(ot.date)}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatTime(ot.start_time)} – {formatTime(ot.end_time)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{hours} h</TableCell>
                            <TableCell>
                              <StatusBadge status={ot.status} />
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setSelectedOvertime(ot)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => { setEditData(ot); setShowForm(true); }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow className="bg-muted/20">
                              <TableCell colSpan={8} className="p-4">
                                <div className="space-y-3 w-full">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Reason</p>
                                    <p className="text-sm break-words whitespace-pre-wrap">{ot.reason || 'No reason provided'}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Contact</p>
                                      <p className="font-medium break-words">{ot.contact_number}</p>
                                    </div>
                                    {ot.emergency_contact && (
                                      <div>
                                        <p className="text-xs text-muted-foreground">Emergency</p>
                                        <p className="font-medium break-words">{ot.emergency_contact}</p>
                                      </div>
                                    )}
                                  </div>
                                  {ot.notes && (
                                    <div>
                                      <p className="text-xs text-muted-foreground">Notes</p>
                                      <p className="text-sm break-words whitespace-pre-wrap">{ot.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {showForm && (
        <OvertimeApplicationForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSuccess={() => {
            fetchAllData();
            setShowForm(false);
            setEditData(null);
          }}
          editData={editData}
          onUpdate={handleUpdate}
        />
      )}

      {selectedOvertime && (
        <OvertimeDetailsModal
          overtime={selectedOvertime}
          onClose={() => setSelectedOvertime(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          onEdit={(ot) => { setEditData(ot); setShowForm(true); }}
        />
      )}
    </div>
  );
}