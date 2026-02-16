"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Wrench, Shield, Plus, Search, RefreshCw, Filter, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Trash2, MoreVertical,
  Download, Edit, X, HardHat, Zap, ArrowUpRight, TrendingUp,
  BarChart3, Users, Briefcase, FileDown, List, LayoutGrid,
  Mail, Copy, Share2, Bookmark, PieChart, Package, ShoppingCart,
  AlertTriangle, ThumbsUp, ThumbsDown, Calendar, MapPin, Tag,
  Building, Settings, Award, Crown, AlertOctagon, FileWarning,
  Target, ClipboardCheck, Flag, Clock4, UserCog, CalendarDays,
  Bell, Check, ChevronRight, ExternalLink, FileBarChart, Printer,
  Star, Table, UserPlus, Hash, BriefcaseIcon, Expand, ChevronLeft,
  Database, Activity, Gauge, TrendingDown, Thermometer,
  BarChart4, CircleAlert, Percent, Square, Archive, SquareDashed,
  Info, Paperclip, Repeat, Scale, Gavel, FolderOpen,
  Globe, UserCheck  // <-- Added missing icons
} from "lucide-react";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ============= API Configuration =============
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const SCHEDULES_API = `${API_BASE}/api/schedules`;
const EMPLOYEES_API = `${API_BASE}/api/employees`;   // Assumes employees router exists
const EQUIPMENT_API = `${API_BASE}/api/equipment`;   // Assumes equipment router exists

// ============= Type Definitions =============
interface Employee {
  employee_id: string;
  name: string;
  department: string;
  position?: string;
}

interface Equipment {
  id: number;
  name: string;
  code?: string;
  department?: string;
  location?: string;
}

interface Task {
  id: number;
  title: string;
  category: 'maintenance' | 'compliance';
  type: string;
  description?: string;
  location: string;
  frequency: string;
  next_due: string;
  last_completed?: string;
  estimated_hours?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  assigned_to_id?: string;
  assigned_to_name?: string;
  department?: string;
  notes?: string;
  // Maintenance specific
  equipment_id?: number;
  equipment?: Equipment;
  parts_required?: string;
  work_order_number?: string;
  // Compliance specific
  regulation?: string;
  jurisdiction?: string;
  responsible_officer?: string;
  findings?: string;
  created_at: string;
  updated_at: string;
}

// ============= Constants =============
const TASK_CATEGORIES = {
  maintenance: { key: 'maintenance', name: 'Maintenance', icon: Wrench },
  compliance: { key: 'compliance', name: 'Compliance', icon: Shield },
};

const TASK_TYPES = {
  preventive: { key: 'preventive', name: 'Preventive', category: 'maintenance', icon: RefreshCw },
  corrective: { key: 'corrective', name: 'Corrective', category: 'maintenance', icon: Wrench },
  predictive: { key: 'predictive', name: 'Predictive', category: 'maintenance', icon: TrendingUp },
  calibration: { key: 'calibration', name: 'Calibration', category: 'maintenance', icon: Gauge },
  inspection: { key: 'inspection', name: 'Inspection', category: 'maintenance', icon: Eye },
  legal: { key: 'legal', name: 'Legal', category: 'compliance', icon: Scale },
  regulatory: { key: 'regulatory', name: 'Regulatory', category: 'compliance', icon: Gavel },
  audit: { key: 'audit', name: 'Audit', category: 'compliance', icon: ClipboardCheck },
  permit: { key: 'permit', name: 'Permit', category: 'compliance', icon: FileText },
};

const FREQUENCIES = {
  once: 'One-time',
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  semiannual: 'Semi-annual',
  annual: 'Annual',
  custom: 'Custom',
};

const PRIORITY_LEVELS = {
  low: { name: 'Low', variant: 'outline', icon: Gauge },
  medium: { name: 'Medium', variant: 'secondary', icon: Gauge },
  high: { name: 'High', variant: 'default', icon: Gauge },
  critical: { name: 'Critical', variant: 'destructive', icon: Gauge },
} as const;

// FIXED: Use className instead of invalid variant
const STATUS_TYPES = {
  open: {
    name: 'Open',
    className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
    icon: Clock,
  },
  in_progress: {
    name: 'In Progress',
    className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
    icon: RefreshCw,
  },
  completed: {
    name: 'Completed',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  overdue: {
    name: 'Overdue',
    className: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400',
    icon: AlertTriangle,
  },
  cancelled: {
    name: 'Cancelled',
    className: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
    icon: XCircle,
  },
} as const;

// ============= Utility Functions =============
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
};

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateString;
  }
};

const isOverdue = (dueDate?: string, status?: string) => {
  if (!dueDate || status === 'completed' || status === 'cancelled') return false;
  return new Date(dueDate) < new Date();
};

// ============= API Functions =============

// Fetch employees from the employees table
const fetchEmployees = async (): Promise<Employee[]> => {
  const res = await fetch(EMPLOYEES_API);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
};

// Fetch equipment from the equipment table
const fetchEquipment = async (): Promise<Equipment[]> => {
  const res = await fetch(EQUIPMENT_API);
  if (!res.ok) throw new Error('Failed to fetch equipment');
  return res.json();
};

// Fetch tasks with filters
const fetchTasks = async (filters: any): Promise<Task[]> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all' && value !== '') {
      params.append(key, value as string);
    }
  });
  const url = `${SCHEDULES_API}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

// Fetch task statistics
const fetchTaskStats = async () => {
  const res = await fetch(`${SCHEDULES_API}/stats/summary`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

// Fetch unique departments (for filter dropdown)
const fetchDepartments = async (): Promise<string[]> => {
  const res = await fetch(`${SCHEDULES_API}/departments/list`);
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
};

// Create a new task
const createTask = async (data: any) => {
  const res = await fetch(SCHEDULES_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

// Update an existing task
const updateTask = async (id: number, data: any) => {
  const res = await fetch(`${SCHEDULES_API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

// Delete a task
const deleteTask = async (id: number) => {
  const res = await fetch(`${SCHEDULES_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
};

// Bulk update task status
const bulkUpdateStatus = async (ids: number[], status: string) => {
  const res = await fetch(`${SCHEDULES_API}/bulk/status-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status }),
  });
  if (!res.ok) throw new Error('Bulk update failed');
  return res.json();
};

// Download data as CSV
const downloadCSV = (data: Task[], filename: string) => {
  if (!data || data.length === 0) return;
  const headers = [
    'ID', 'Title', 'Category', 'Type', 'Description', 'Location', 'Frequency',
    'Next Due', 'Last Completed', 'Est. Hours', 'Priority', 'Status',
    'Assigned To', 'Assigned ID', 'Department', 'Notes',
    'Equipment ID', 'Parts Required', 'Work Order',
    'Regulation', 'Jurisdiction', 'Responsible Officer', 'Findings',
    'Created At', 'Updated At'
  ];

  const csvData = data.map(task => [
    task.id,
    `"${(task.title || '').replace(/"/g, '""')}"`,
    task.category,
    task.type,
    `"${(task.description || '').replace(/"/g, '""')}"`,
    `"${(task.location || '').replace(/"/g, '""')}"`,
    task.frequency,
    task.next_due,
    task.last_completed || '',
    task.estimated_hours || '',
    task.priority,
    task.status,
    `"${(task.assigned_to_name || '').replace(/"/g, '""')}"`,
    `"${(task.assigned_to_id || '').replace(/"/g, '""')}"`,
    `"${(task.department || '').replace(/"/g, '""')}"`,
    `"${(task.notes || '').replace(/"/g, '""')}"`,
    task.equipment_id || '',
    `"${(task.parts_required || '').replace(/"/g, '""')}"`,
    `"${(task.work_order_number || '').replace(/"/g, '""')}"`,
    `"${(task.regulation || '').replace(/"/g, '""')}"`,
    `"${(task.jurisdiction || '').replace(/"/g, '""')}"`,
    `"${(task.responsible_officer || '').replace(/"/g, '""')}"`,
    `"${(task.findings || '').replace(/"/g, '""')}"`,
    task.created_at || '',
    task.updated_at || ''
  ]);

  const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// ============= Component Sub‑components =============

// Badges
const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_TYPES[status as keyof typeof STATUS_TYPES] || STATUS_TYPES.open;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`gap-1 ${config.className}`}>
      {React.createElement(Icon, { className: "h-3 w-3" })}
      {config.name}
    </Badge>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const config = PRIORITY_LEVELS[priority as keyof typeof PRIORITY_LEVELS] || PRIORITY_LEVELS.medium;
  return (
    <Badge variant={config.variant} className="gap-1">
      <Gauge className="h-3 w-3" />
      {config.name}
    </Badge>
  );
};

const CategoryBadge = ({ category }: { category: string }) => {
  const config = TASK_CATEGORIES[category as keyof typeof TASK_CATEGORIES] || TASK_CATEGORIES.maintenance;
  return (
    <Badge variant="outline" className="gap-1">
      {React.createElement(config.icon, { className: "h-3 w-3" })}
      {config.name}
    </Badge>
  );
};

const FrequencyBadge = ({ frequency }: { frequency: string }) => {
  const name = FREQUENCIES[frequency as keyof typeof FREQUENCIES] || frequency;
  return (
    <Badge variant="outline" className="gap-1">
      <Repeat className="h-3 w-3" />
      {name}
    </Badge>
  );
};

// Employee Select (fetches from employees table)
const EmployeeSelect = ({ value, onChange, disabled }: { value?: string; onChange: (emp: Employee) => void; disabled?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchEmployees()
        .then(setEmployees)
        .catch(err => toast.error(err.message))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const selected = employees.find(e => e.employee_id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between h-10" disabled={disabled}>
          {selected ? (
            <span className="truncate">{selected.name} ({selected.department})</span>
          ) : (
            <span className="text-muted-foreground">Select employee...</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput placeholder="Search employees..." />
          <CommandList>
            <CommandEmpty>No employees found.</CommandEmpty>
            <CommandGroup>
              {loading ? (
                <div className="py-6 text-center text-sm">Loading...</div>
              ) : (
                employees.map(emp => (
                  <CommandItem
                    key={emp.employee_id}
                    value={emp.employee_id}
                    onSelect={() => { onChange(emp); setOpen(false); }}
                    className="flex flex-col items-start gap-1 py-2"
                  >
                    <span className="font-medium">{emp.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {emp.employee_id} • {emp.department} {emp.position ? `• ${emp.position}` : ''}
                    </span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Equipment Select (fetches from equipment table)
const EquipmentSelect = ({ value, onChange, disabled }: { value?: number; onChange: (eq: Equipment) => void; disabled?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchEquipment()
        .then(setEquipment)
        .catch(err => toast.error(err.message))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const selected = equipment.find(e => e.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between h-10" disabled={disabled}>
          {selected ? (
            <span className="truncate">{selected.name} ({selected.code || '–'})</span>
          ) : (
            <span className="text-muted-foreground">Select equipment...</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput placeholder="Search equipment..." />
          <CommandList>
            <CommandEmpty>No equipment found.</CommandEmpty>
            <CommandGroup>
              {loading ? (
                <div className="py-6 text-center text-sm">Loading...</div>
              ) : (
                equipment.map(eq => (
                  <CommandItem
                    key={eq.id}
                    value={String(eq.id)}
                    onSelect={() => { onChange(eq); setOpen(false); }}
                    className="flex flex-col items-start gap-1 py-2"
                  >
                    <span className="font-medium">{eq.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {eq.code || 'No code'} • {eq.department || '–'} • {eq.location || '–'}
                    </span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// ============= Form Schema =============
const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(['maintenance', 'compliance']),
  type: z.string().min(1, "Task type is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  frequency: z.string().min(1, "Frequency is required"),
  next_due: z.string().min(1, "Next due date is required"),
  last_completed: z.string().optional(),
  estimated_hours: z.coerce.number().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['open', 'in_progress', 'completed', 'overdue', 'cancelled']),
  assigned_to_id: z.string().optional(),
  assigned_to_name: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  notes: z.string().optional(),
  // Maintenance specific
  equipment_id: z.coerce.number().optional(),
  parts_required: z.string().optional(),
  work_order_number: z.string().optional(),
  // Compliance specific
  regulation: z.string().optional(),
  jurisdiction: z.string().optional(),
  responsible_officer: z.string().optional(),
  findings: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

// ============= Form Component =============
interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task | null;
  loading?: boolean;
}

const TaskForm = ({ isOpen, onClose, onSubmit, initialData, loading = false }: TaskFormProps) => {
  const category = initialData?.category || 'maintenance';
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      category: initialData?.category || 'maintenance',
      type: initialData?.type || 'preventive',
      description: initialData?.description || '',
      location: initialData?.location || '',
      frequency: initialData?.frequency || 'monthly',
      next_due: initialData?.next_due || '',
      last_completed: initialData?.last_completed || '',
      estimated_hours: initialData?.estimated_hours || 1,
      priority: initialData?.priority || 'medium',
      status: initialData?.status || 'open',
      assigned_to_id: initialData?.assigned_to_id || '',
      assigned_to_name: initialData?.assigned_to_name || '',
      department: initialData?.department || '',
      notes: initialData?.notes || '',
      equipment_id: initialData?.equipment_id || undefined,
      parts_required: initialData?.parts_required || '',
      work_order_number: initialData?.work_order_number || '',
      regulation: initialData?.regulation || '',
      jurisdiction: initialData?.jurisdiction || '',
      responsible_officer: initialData?.responsible_officer || '',
      findings: initialData?.findings || '',
    },
  });

  const watchCategory = form.watch('category');

  const handleEmployeeSelect = (emp: Employee) => {
    form.setValue('assigned_to_id', emp.employee_id);
    form.setValue('assigned_to_name', emp.name);
    form.setValue('department', emp.department);
  };

  const handleEquipmentSelect = (eq: Equipment) => {
    form.setValue('equipment_id', eq.id);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'New'} Task</DialogTitle>
          <DialogDescription>Fill in the details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                <TabsTrigger value="assignment">Assignment</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Lubricate CNC Spindle" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Task Type</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(TASK_TYPES)
                          .filter(([_, t]) => t.category === watchCategory)
                          .map(([k, t]) => (
                            <SelectItem key={k} value={k}>{t.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Workshop A" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem><FormLabel>Priority</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(PRIORITY_LEVELS).map(([k, p]) => <SelectItem key={k} value={k}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(STATUS_TYPES).map(([k, s]) => <SelectItem key={k} value={k}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                  )} />
                </div>
              </TabsContent>

              <TabsContent value="scheduling" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="frequency" render={({ field }) => (
                    <FormItem><FormLabel>Frequency</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(FREQUENCIES).map(([k, name]) => <SelectItem key={k} value={k}>{name}</SelectItem>)}
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="next_due" render={({ field }) => (
                    <FormItem><FormLabel>Next Due Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="last_completed" render={({ field }) => (
                    <FormItem><FormLabel>Last Completed</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="estimated_hours" render={({ field }) => (
                    <FormItem><FormLabel>Est. Hours</FormLabel><FormControl><Input type="number" min="0" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </TabsContent>

              <TabsContent value="assignment" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="assigned_to_id" render={({ field }) => (
                    <FormItem><FormLabel>Assigned To</FormLabel><FormControl><EmployeeSelect value={field.value} onChange={handleEmployeeSelect} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="department" render={({ field }) => (
                    <FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} placeholder="Auto-filled" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                {watchCategory === 'maintenance' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Maintenance Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="equipment_id" render={({ field }) => (
                        <FormItem><FormLabel>Equipment</FormLabel><FormControl><EquipmentSelect value={field.value} onChange={handleEquipmentSelect} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="work_order_number" render={({ field }) => (
                        <FormItem><FormLabel>Work Order #</FormLabel><FormControl><Input placeholder="e.g., WO-2025-001" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="parts_required" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Parts Required</FormLabel><FormControl><Textarea placeholder="List parts or tools" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>
                )}
                {watchCategory === 'compliance' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Compliance Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="regulation" render={({ field }) => (
                        <FormItem><FormLabel>Regulation</FormLabel><FormControl><Input placeholder="e.g., OSHA 1910.147" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="jurisdiction" render={({ field }) => (
                        <FormItem><FormLabel>Jurisdiction</FormLabel><FormControl><Input placeholder="e.g., Federal" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="responsible_officer" render={({ field }) => (
                        <FormItem><FormLabel>Responsible Officer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="findings" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Findings</FormLabel><FormControl><Textarea placeholder="Any findings or notes" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{initialData ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// ============= Task Card (Grid View) =============
interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard = ({ task, onView, onEdit, onDelete }: TaskCardProps) => {
  const isOverdueItem = isOverdue(task.next_due, task.status);
  const category = TASK_CATEGORIES[task.category];

  return (
    <Card className={`group relative hover:shadow-md transition-shadow ${isOverdueItem ? 'border-destructive/50 bg-destructive/5' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              {React.createElement(category.icon, { className: "h-4 w-4" })}
            </div>
            <div>
              <CardTitle className="text-base font-semibold line-clamp-1">{task.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <CategoryBadge category={task.category} />
                <Badge variant="outline" className="text-xs">#{task.id}</Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(task)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</span><span className="font-medium">{task.location}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Next Due</span>
            <span className={isOverdueItem ? 'text-destructive font-medium' : ''}>{formatDate(task.next_due)} {isOverdueItem && <AlertTriangle className="h-3 w-3 inline ml-1" />}</span>
          </div>
          <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Est. Hours</span><span>{task.estimated_hours || '—'}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Priority</span><PriorityBadge priority={task.priority} /></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={task.status} /></div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground border-t flex justify-between items-center">
        <span>{task.assigned_to_name || 'Unassigned'}</span>
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => onView(task)}>View <ChevronRight className="h-3 w-3 ml-1" /></Button>
      </CardFooter>
    </Card>
  );
};

// ============= Task Details Modal =============
interface TaskDetailsProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onExport: (data: Task[], filename: string) => void;
}

const TaskDetails = ({ task, isOpen, onClose, onEdit, onExport }: TaskDetailsProps) => {
  if (!task || !isOpen) return null;
  const category = TASK_CATEGORIES[task.category];
  const isOverdueItem = isOverdue(task.next_due, task.status);

  const fields = [
    { label: 'ID', value: `#${task.id}`, icon: Hash },
    { label: 'Title', value: task.title, icon: FileText },
    { label: 'Category', value: category.name, icon: category.icon },
    { label: 'Type', value: TASK_TYPES[task.type as keyof typeof TASK_TYPES]?.name || task.type, icon: Tag },
    { label: 'Location', value: task.location, icon: MapPin },
    { label: 'Frequency', value: FREQUENCIES[task.frequency as keyof typeof FREQUENCIES] || task.frequency, icon: Repeat },
    { label: 'Next Due', value: formatDate(task.next_due), icon: Calendar },
    { label: 'Last Completed', value: formatDate(task.last_completed) || '—', icon: Clock },
    { label: 'Est. Hours', value: task.estimated_hours || '—', icon: Clock4 },
    { label: 'Priority', value: PRIORITY_LEVELS[task.priority]?.name, icon: Gauge },
    { label: 'Status', value: STATUS_TYPES[task.status]?.name, icon: Activity },
    { label: 'Assigned To', value: task.assigned_to_name || '—', icon: User },
    { label: 'Department', value: task.department || '—', icon: Building },
  ];
  if (task.category === 'maintenance') {
    fields.push(
      { label: 'Equipment', value: task.equipment?.name || (task.equipment_id ? `ID ${task.equipment_id}` : '—'), icon: Package },
      { label: 'Work Order', value: task.work_order_number || '—', icon: Hash }
    );
  } else {
    fields.push(
      { label: 'Regulation', value: task.regulation || '—', icon: Scale },
      { label: 'Jurisdiction', value: task.jurisdiction || '—', icon: Globe },
      { label: 'Responsible Officer', value: task.responsible_officer || '—', icon: UserCheck }
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task.title} #{task.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fields.map((f, i) => (
              <div key={i} className="flex items-start gap-2 p-2 border rounded-lg bg-muted/30">
                <f.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">{f.label}</p><p className="font-medium text-sm">{f.value}</p></div>
              </div>
            ))}
          </div>
          {task.description && (
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">Description</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap">{task.description}</p></CardContent></Card>
          )}
          {task.category === 'maintenance' && task.parts_required && (
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">Parts Required</CardTitle></CardHeader><CardContent><p>{task.parts_required}</p></CardContent></Card>
          )}
          {task.category === 'compliance' && task.findings && (
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">Findings</CardTitle></CardHeader><CardContent><p>{task.findings}</p></CardContent></Card>
          )}
          {task.notes && (
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">Notes</CardTitle></CardHeader><CardContent><p>{task.notes}</p></CardContent></Card>
          )}
          <div className="flex gap-4 text-sm text-muted-foreground border-t pt-4">
            {isOverdueItem && <div className="flex items-center gap-1 text-destructive"><AlertTriangle className="h-4 w-4" /> Overdue</div>}
            <div className="flex items-center gap-1 ml-auto"><CalendarDays className="h-4 w-4" /> Created: {formatDateTime(task.created_at)}</div>
            {task.updated_at && <div className="flex items-center gap-1"><RefreshCw className="h-4 w-4" /> Updated: {formatDateTime(task.updated_at)}</div>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onExport([task], `task-${task.id}`)}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => { onEdit(task); onClose(); }}><Edit className="h-4 w-4 mr-2" />Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ============= Stats Card =============
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  progress?: number;
}

const StatsCard = ({ title, value, icon: Icon, trend, progress }: StatsCardProps) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{value}</span>
            {trend !== undefined && (
              <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
          {progress !== undefined && (
            <div className="w-full mt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Completion</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </div>
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ============= Quick Actions Bar =============
interface QuickActionsBarProps {
  onNewTask: (category: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
  viewMode: string;
  onViewModeChange: (mode: string) => void;
  onClearFilters: () => void;
  filtersActive: boolean;
}

const QuickActionsBar = ({ onNewTask, onRefresh, onExport, loading, viewMode, onViewModeChange, onClearFilters, filtersActive }: QuickActionsBarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <Button onClick={() => onNewTask('maintenance')} className="gap-2">
        <Plus className="h-4 w-4" /> New Task
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> Quick Add <ChevronDown className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onNewTask('maintenance')}><Wrench className="h-4 w-4 mr-2" /> Maintenance</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNewTask('compliance')}><Shield className="h-4 w-4 mr-2" /> Compliance</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Label className="text-sm">View:</Label>
        <Select value={viewMode} onValueChange={onViewModeChange}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="grid"><div className="flex items-center gap-2"><LayoutGrid className="h-4 w-4" /> Grid</div></SelectItem>
            <SelectItem value="list"><div className="flex items-center gap-2"><List className="h-4 w-4" /> List</div></SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TooltipProvider>
        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}</Button></TooltipTrigger><TooltipContent>Refresh</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={onExport}><Download className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Export CSV</TooltipContent></Tooltip>
        {filtersActive && (
          <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={onClearFilters}><X className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Clear Filters</TooltipContent></Tooltip>
        )}
      </TooltipProvider>
    </div>
  </div>
);

// ============= Main Page =============
export default function MaintenanceCompliancePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editData, setEditData] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    status: 'all',
    priority: 'all',
    department: 'all',
    location: 'all',
    date_from: '',
    date_to: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [backendOnline, setBackendOnline] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  const enhancedStats = useMemo(() => {
    if (!tasks.length) return null;
    const total = tasks.length;
    const overdue = tasks.filter(t => isOverdue(t.next_due, t.status)).length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const complianceRate = tasks.filter(t => t.category === 'compliance' && t.status === 'completed').length /
      (tasks.filter(t => t.category === 'compliance').length || 1) * 100;
    const maintenanceBacklog = tasks.filter(t => t.category === 'maintenance' && t.status !== 'completed').length;
    return { total, overdue, inProgress, completed, complianceRate: Math.round(complianceRate), maintenanceBacklog };
  }, [tasks]);

  const filtersActive = useMemo(() => {
    return Object.entries(filters).some(([k, v]) => k !== 'search' && v && v !== 'all' && v !== '');
  }, [filters]);

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(err => toast.error(err.message));
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.allSettled([
        fetchTasks(filters),
        fetchTaskStats()
      ]);
      if (tasksData.status === 'fulfilled') setTasks(tasksData.value);
      else toast.error(tasksData.reason?.message || 'Failed to fetch tasks');
      if (statsData.status === 'fulfilled') setStats(statsData.value);
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [filters]);

  const handleSubmitForm = async (formData: TaskFormData) => {
    setFormLoading(true);
    try {
      if (editData) {
        await updateTask(editData.id, formData);
        toast.success("Task updated");
      } else {
        await createTask(formData);
        toast.success("Task created");
      }
      fetchAllData();
      setShowForm(false);
      setEditData(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Deleted');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedTasks.length} tasks?`)) return;
    try {
      await Promise.all(selectedTasks.map(id => deleteTask(id)));
      toast.success(`Deleted ${selectedTasks.length} tasks`);
      setSelectedTasks([]);
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    try {
      await bulkUpdateStatus(selectedTasks, status);
      toast.success(`Updated to ${STATUS_TYPES[status as keyof typeof STATUS_TYPES]?.name}`);
      setSelectedTasks([]);
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleExport = (data = tasks, filename = `tasks-${new Date().toISOString().split('T')[0]}`) => {
    downloadCSV(data, filename);
    toast.success(`Exported ${data.length} tasks`);
  };

  const handleClearFilters = () => setFilters({
    category: 'all', type: 'all', status: 'all', priority: 'all', department: 'all', location: 'all',
    date_from: '', date_to: '', search: ''
  });

  const getStartOfWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };

  const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
        active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:bg-muted'
      }`}
    >
      {label}
    </button>
  );

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedTasks(tasks.map(t => t.id));
    else setSelectedTasks([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="px-4 md:px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Asset & Compliance Manager</h1>
              <p className="text-sm text-muted-foreground">Schedule, track, and report on all maintenance and compliance activities</p>
            </div>
          </div>
          <Avatar className="h-9 w-9"><AvatarFallback>JD</AvatarFallback></Avatar>
        </div>
      </header>

      <main className="px-4 md:px-6 py-6 max-w-7xl mx-auto space-y-8">
        {!backendOnline && (
          <Alert variant="destructive"><AlertTriangle className="h-5 w-5" /><AlertTitle>Connection Issue</AlertTitle><AlertDescription>Cannot reach backend at {API_BASE}</AlertDescription></Alert>
        )}

        {/* KPI Dashboard */}
        {enhancedStats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatsCard title="Total Tasks" value={enhancedStats.total} icon={FileText} />
            <StatsCard title="Overdue" value={enhancedStats.overdue} icon={AlertTriangle} trend={enhancedStats.overdue > 0 ? 15 : 0} />
            <StatsCard title="In Progress" value={enhancedStats.inProgress} icon={RefreshCw} />
            <StatsCard title="Completed" value={enhancedStats.completed} icon={CheckCircle2} trend={8} />
            <StatsCard title="Compliance Rate" value={`${enhancedStats.complianceRate}%`} icon={Shield} progress={enhancedStats.complianceRate} />
            <StatsCard title="Maintenance Backlog" value={enhancedStats.maintenanceBacklog} icon={Package} />
          </div>
        )}

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Tasks <span className="text-muted-foreground text-lg font-normal">({tasks.length})</span>
                </CardTitle>
              </div>
              <QuickActionsBar
                onNewTask={(cat: string) => { setEditData(null); setShowForm(true); }}
                onRefresh={fetchAllData}
                onExport={handleExport}
                loading={loading}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onClearFilters={handleClearFilters}
                filtersActive={filtersActive}
              />
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                  <Filter className="h-4 w-4" /> {showFilters ? 'Hide Filters' : 'Show Filters'} {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <div className="flex-1 max-w-md relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search tasks..." className="pl-9 h-10 text-sm w-full" value={filters.search} onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))} />
                </div>
                {filtersActive && <Badge variant="secondary">Filters active</Badge>}
              </div>
              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border rounded-xl bg-muted/30 mb-6">
                  <div><Label>Category</Label><Select value={filters.category} onValueChange={(v) => setFilters(p => ({ ...p, category: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem><SelectItem value="compliance">Compliance</SelectItem></SelectContent></Select></div>
                  <div><Label>Status</Label><Select value={filters.status} onValueChange={(v) => setFilters(p => ({ ...p, status: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.keys(STATUS_TYPES).map(k => <SelectItem key={k} value={k}>{STATUS_TYPES[k as keyof typeof STATUS_TYPES].name}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Priority</Label><Select value={filters.priority} onValueChange={(v) => setFilters(p => ({ ...p, priority: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.keys(PRIORITY_LEVELS).map(k => <SelectItem key={k} value={k}>{PRIORITY_LEVELS[k as keyof typeof PRIORITY_LEVELS].name}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Department</Label><Select value={filters.department} onValueChange={(v) => setFilters(p => ({ ...p, department: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Location</Label><Input placeholder="Filter by location..." value={filters.location === 'all' ? '' : filters.location} onChange={(e) => setFilters(p => ({ ...p, location: e.target.value || 'all' }))} /></div>
                  <div><Label>Date From</Label><Input type="date" value={filters.date_from} onChange={(e) => setFilters(p => ({ ...p, date_from: e.target.value }))} /></div>
                  <div><Label>Date To</Label><Input type="date" value={filters.date_to} onChange={(e) => setFilters(p => ({ ...p, date_to: e.target.value }))} /></div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <FilterChip label="Overdue" active={filters.status === 'overdue'} onClick={() => setFilters(p => ({ ...p, status: 'overdue' }))} />
                  <FilterChip label="Critical" active={filters.priority === 'critical'} onClick={() => setFilters(p => ({ ...p, priority: 'critical' }))} />
                  <FilterChip label="This Week" active={filters.date_from === getStartOfWeek()} onClick={() => { const start = getStartOfWeek(); setFilters(p => ({ ...p, date_from: start, date_to: new Date().toISOString().split('T')[0] })); }} />
                </div>
                <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-2"><X className="h-4 w-4" />Clear all filters</Button></div>
              </CollapsibleContent>
            </Collapsible>

            {/* Bulk actions */}
            {selectedTasks.length > 0 && (
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg mb-4">
                <span className="text-sm font-medium">{selectedTasks.length} selected</span>
                <div className="flex gap-2">
                  <Select onValueChange={handleBulkStatusUpdate}>
                    <SelectTrigger className="w-[150px] h-8"><SelectValue placeholder="Update status" /></SelectTrigger>
                    <SelectContent>
                      {['open', 'in_progress', 'completed', 'cancelled'].map(s => (
                        <SelectItem key={s} value={s}>{STATUS_TYPES[s as keyof typeof STATUS_TYPES]?.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete} className="text-destructive"><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedTasks([])}><X className="h-4 w-4 mr-1" />Clear</Button>
                </div>
              </div>
            )}

            {/* Tasks grid/list */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-16">
                <Wrench className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold mb-3">No tasks found</h3>
                <p className="text-muted-foreground mb-8">{filters.search || filtersActive ? 'Try adjusting your filters' : 'Create your first task'}</p>
                <Button onClick={() => { setEditData(null); setShowForm(true); }} size="lg"><Plus className="h-5 w-5 mr-2" />New Task</Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task, idx) => (
                  <div key={task.id} className="relative">
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                      <Checkbox checked={selectedTasks.includes(task.id)} onCheckedChange={() => setSelectedTasks(prev => prev.includes(task.id) ? prev.filter(id => id !== task.id) : [...prev, task.id])} />
                      <span className="text-xs font-mono bg-muted/80 px-1.5 py-0.5 rounded-md backdrop-blur-sm">#{idx + 1}</span>
                    </div>
                    <TaskCard task={task} onView={() => { setSelectedTask(task); setShowDetails(true); }} onEdit={(t) => { setEditData(t); setShowForm(true); }} onDelete={handleDeleteTask} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Table header – fixed widths with truncation */}
                <div className="hidden md:flex items-center px-4 py-2 bg-muted/50 rounded-lg text-xs font-medium sticky top-0 z-10">
                  <div className="w-8 flex-shrink-0"><Checkbox onCheckedChange={toggleSelectAll} /></div>
                  <div className="w-12 flex-shrink-0">#</div>
                  <div className="w-16 flex-shrink-0">ID</div>
                  <div className="w-20 flex-shrink-0">Category</div>
                  <div className="min-w-[200px] flex-1">Title</div>
                  <div className="w-20 flex-shrink-0">Priority</div>
                  <div className="w-20 flex-shrink-0">Status</div>
                  <div className="w-24 flex-shrink-0">Due</div>
                  <div className="w-32 flex-shrink-0">Assigned</div>
                  <div className="w-20 flex-shrink-0">Actions</div>
                </div>

                {tasks.map((task, idx) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-4 md:w-8 flex-shrink-0">
                          <Checkbox checked={selectedTasks.includes(task.id)} onCheckedChange={() => setSelectedTasks(prev => prev.includes(task.id) ? prev.filter(id => id !== task.id) : [...prev, task.id])} />
                        </div>
                        <div className="md:w-12 text-sm font-mono text-muted-foreground flex-shrink-0">#{idx + 1}</div>
                        <div className="md:w-16 text-sm font-mono text-muted-foreground flex-shrink-0">#{task.id}</div>
                        <div className="flex items-center gap-3 md:w-20 flex-shrink-0">
                          <div className="p-2 rounded-md bg-primary/10 text-primary">
                            {React.createElement(TASK_CATEGORIES[task.category].icon, { className: "h-4 w-4" })}
                          </div>
                          <span className="text-sm font-medium">{TASK_CATEGORIES[task.category].name}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate" title={task.title}>{task.title}</div>
                          <div className="text-xs text-muted-foreground truncate" title={task.location}>{task.location}</div>
                        </div>
                        <div className="md:w-20 flex-shrink-0"><PriorityBadge priority={task.priority} /></div>
                        <div className="md:w-20 flex-shrink-0"><StatusBadge status={task.status} /></div>
                        <div className="md:w-24 text-sm flex-shrink-0">{formatDate(task.next_due)}</div>
                        <div className="md:w-32 text-sm truncate flex-shrink-0" title={task.assigned_to_name || '—'}>
                          {task.assigned_to_name || '—'}
                        </div>
                        <div className="flex items-center gap-2 md:w-20 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedTask(task); setShowDetails(true); }}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditData(task); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <TaskForm isOpen={showForm} onClose={() => { setShowForm(false); setEditData(null); }} onSubmit={handleSubmitForm} initialData={editData} loading={formLoading} />
      <TaskDetails task={selectedTask} isOpen={showDetails} onClose={() => setShowDetails(false)} onEdit={(t) => { setEditData(t); setShowForm(true); }} onExport={handleExport} />
    </div>
  );
}