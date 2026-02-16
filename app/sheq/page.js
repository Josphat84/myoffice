"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Shield, Plus, Search, RefreshCw, Filter, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Send, Phone, Trash2, MoreVertical,
  Download, Edit, X, HardHat, Zap, ArrowUpRight, TrendingUp,
  BarChart3, Users, Briefcase, FileDown, List, LayoutGrid,
  Mail, Copy, Share2, Bookmark, PieChart, Package, ShoppingCart,XIcon,
  AlertTriangle, ThumbsUp, ThumbsDown, Calendar, MapPin, Tag,
  Mountain, Gem, Landmark, Drill, Pickaxe, Factory, UserCheck,
  Building, Settings, Award, Crown, AlertOctagon, FileWarning,
  Target, ClipboardCheck, Flag, Clock4, UserCog, CalendarDays,
  Bell, Check, ChevronRight, ExternalLink, FileBarChart, Printer,
  Star, Table, UserPlus, Hash, BriefcaseIcon, Expand, ChevronLeft,
  Database, Wrench, Activity, Gauge, TrendingDown, Thermometer,
  BarChart4, CircleAlert, Percent, Square, Archive, SquareDashed,
  File, Info, AlertCircle as AlertCircleIcon
} from "lucide-react";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ============= API Configuration =============
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const SHEQ_API = `${API_BASE}/api/sheq`;

// ============= SHEQ Indicator Types =============
const SHEQ_INDICATOR_TYPES = {
  hazard: {
    key: 'hazard',
    name: 'Hazard Indicator',
    shortName: 'Hazard',
    description: 'Monitor and track workplace hazards for proactive safety management',
    icon: AlertOctagon,
    color: 'bg-gradient-to-br from-orange-500 to-amber-500',
    badgeVariant: "destructive",
    gradient: 'bg-gradient-to-br from-orange-500/10 via-orange-200/20 to-amber-500/10',
    textColor: 'text-orange-600 dark:text-orange-400'
  },
  near_miss: {
    key: 'near_miss',
    name: 'Near Miss Indicator',
    shortName: 'Near Miss',
    description: 'Track potential incidents to prevent future injuries',
    icon: FileWarning,
    color: 'bg-gradient-to-br from-amber-500 to-yellow-500',
    badgeVariant: "warning",
    gradient: 'bg-gradient-to-br from-amber-500/10 via-amber-200/20 to-yellow-500/10',
    textColor: 'text-amber-600 dark:text-amber-400'
  },
  incident: {
    key: 'incident',
    name: 'Incident Indicator',
    shortName: 'Incident',
    description: 'Track actual incidents for continuous improvement',
    icon: AlertTriangle,
    color: 'bg-gradient-to-br from-red-500 to-rose-600',
    badgeVariant: "destructive",
    gradient: 'bg-gradient-to-br from-red-500/10 via-rose-200/20 to-rose-600/10',
    textColor: 'text-red-600 dark:text-red-400'
  },
  pto: {
    key: 'pto',
    name: 'PTO Indicator',
    shortName: 'PTO',
    description: 'Monitor planned task observations for safety compliance',
    icon: ClipboardCheck,
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    badgeVariant: "default",
    gradient: 'bg-gradient-to-br from-blue-500/10 via-blue-200/20 to-indigo-600/10',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  performance: {
    key: 'performance',
    name: 'Performance Indicator',
    shortName: 'Performance',
    description: 'Track safety performance metrics and KPIs',
    icon: TrendingUp,
    color: 'bg-gradient-to-br from-emerald-500 to-green-600',
    badgeVariant: "success",
    gradient: 'bg-gradient-to-br from-emerald-500/10 via-emerald-200/20 to-green-600/10',
    textColor: 'text-emerald-600 dark:text-emerald-400'
  },
  audit: {
    key: 'audit',
    name: 'Audit Indicator',
    shortName: 'Audit',
    description: 'Monitor compliance and audit findings',
    icon: Shield,
    color: 'bg-gradient-to-br from-purple-500 to-violet-600',
    badgeVariant: "secondary",
    gradient: 'bg-gradient-to-br from-purple-500/10 via-purple-200/20 to-violet-600/10',
    textColor: 'text-purple-600 dark:text-purple-400'
  }
};

// Fallback function to get type from key (used as backup)
const getIndicatorType = (indicatorTypeKey) => {
  if (!indicatorTypeKey) {
    return SHEQ_INDICATOR_TYPES.hazard;
  }
  const normalizedKey = indicatorTypeKey.toLowerCase().trim();
  if (SHEQ_INDICATOR_TYPES[normalizedKey]) {
    return SHEQ_INDICATOR_TYPES[normalizedKey];
  }
  // Map common variations
  if (normalizedKey.includes('near') || normalizedKey.includes('miss')) return SHEQ_INDICATOR_TYPES.near_miss;
  if (normalizedKey.includes('incident') || normalizedKey.includes('accident')) return SHEQ_INDICATOR_TYPES.incident;
  if (normalizedKey.includes('pto') || normalizedKey.includes('planned') || normalizedKey.includes('task')) return SHEQ_INDICATOR_TYPES.pto;
  if (normalizedKey.includes('performance') || normalizedKey.includes('kpi')) return SHEQ_INDICATOR_TYPES.performance;
  if (normalizedKey.includes('audit') || normalizedKey.includes('compliance')) return SHEQ_INDICATOR_TYPES.audit;
  return SHEQ_INDICATOR_TYPES.hazard;
};

// Determine the correct indicator type based on which description field is filled
const getIndicatorTypeFromData = (indicator) => {
  if (!indicator) return 'hazard';

  // Check for type‑specific description fields
  if (indicator.hazard_description && indicator.hazard_description.trim() !== '') {
    return 'hazard';
  }
  if (indicator.near_miss_description && indicator.near_miss_description.trim() !== '') {
    return 'near_miss';
  }
  if (indicator.incident_description && indicator.incident_description.trim() !== '') {
    return 'incident';
  }

  // For PTO, check relevant fields
  if (indicator.task_observed && indicator.task_observed.trim() !== '') {
    return 'pto';
  }
  if (indicator.safe_behaviors && indicator.safe_behaviors.trim() !== '') {
    return 'pto';
  }
  if (indicator.at_risk_behaviors && indicator.at_risk_behaviors.trim() !== '') {
    return 'pto';
  }
  if (indicator.recommendations && indicator.recommendations.trim() !== '') {
    return 'pto';
  }

  // Fallback to the database value (or hazard)
  return indicator.report_type && SHEQ_INDICATOR_TYPES[indicator.report_type]
    ? indicator.report_type
    : 'hazard';
};

// Convenience function to get the full type object from an indicator
const getIndicatorTypeFromIndicator = (indicator) => {
  const key = getIndicatorTypeFromData(indicator);
  return getIndicatorType(key);
};

// ============= Priority Levels =============
const PRIORITY_LEVELS = {
  low: {
    name: 'Low',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
    icon: Gauge,
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    variant: "outline",
    textColor: 'text-emerald-700 dark:text-emerald-400',
    score: 1
  },
  medium: {
    name: 'Medium',
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
    icon: Gauge,
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    variant: "warning",
    textColor: 'text-amber-700 dark:text-amber-400',
    score: 2
  },
  high: {
    name: 'High',
    color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400',
    icon: Gauge,
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    variant: "secondary",
    textColor: 'text-orange-700 dark:text-orange-400',
    score: 3
  },
  critical: {
    name: 'Critical',
    color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400',
    icon: Gauge,
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    variant: "destructive",
    textColor: 'text-rose-700 dark:text-rose-400',
    score: 4
  }
};

// ============= Status Types =============
const STATUS_TYPES = {
  draft: {
    name: 'Draft',
    color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
    icon: FileText,
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    variant: "outline",
    textColor: 'text-slate-700 dark:text-slate-400'
  },
  open: {
    name: 'Open',
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
    icon: Activity,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    variant: "outline",
    textColor: 'text-blue-700 dark:text-blue-400'
  },
  in_progress: {
    name: 'In Progress',
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
    icon: RefreshCw,
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    variant: "secondary",
    textColor: 'text-amber-700 dark:text-amber-400'
  },
  under_review: {
    name: 'Under Review',
    color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
    icon: Eye,
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    variant: "outline",
    textColor: 'text-purple-700 dark:text-purple-400'
  },
  resolved: {
    name: 'Resolved',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
    icon: CheckCircle2,
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    variant: "success",
    textColor: 'text-emerald-700 dark:text-emerald-400'
  },
  closed: {
    name: 'Closed',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400',
    icon: CheckCircle2,
    bgColor: 'bg-slate-200 dark:bg-slate-700',
    variant: "outline",
    textColor: 'text-slate-700 dark:text-slate-400'
  },
  archived: {
    name: 'Archived',
    color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
    icon: Archive,
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    variant: "outline",
    textColor: 'text-gray-700 dark:text-gray-400'
  }
};

// ============= Risk Levels =============
const RISK_LEVELS = {
  low: {
    name: 'Low Risk',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300',
    icon: Thermometer,
    score: 1,
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-700 dark:text-emerald-300'
  },
  medium: {
    name: 'Medium Risk',
    color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
    icon: Thermometer,
    score: 2,
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-700 dark:text-amber-300'
  },
  high: {
    name: 'High Risk',
    color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
    icon: Thermometer,
    score: 3,
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-700 dark:text-orange-300'
  },
  extreme: {
    name: 'Extreme Risk',
    color: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300',
    icon: Thermometer,
    score: 4,
    bgColor: 'bg-rose-500',
    textColor: 'text-rose-700 dark:text-rose-300'
  }
};

// ============= Impact Levels =============
const IMPACT_LEVELS = {
  minor: {
    name: 'Minor Impact',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
    icon: Square,
    score: 1,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  moderate: {
    name: 'Moderate Impact',
    color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
    icon: Square,
    score: 2,
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-700 dark:text-amber-300'
  },
  major: {
    name: 'Major Impact',
    color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
    icon: Square,
    score: 3,
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-700 dark:text-orange-300'
  },
  severe: {
    name: 'Severe Impact',
    color: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300',
    icon: Square,
    score: 4,
    bgColor: 'bg-rose-500',
    textColor: 'text-rose-700 dark:text-rose-300'
  }
};

// ============= Utility Functions =============
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// Normalize employee data from API
const normalizeEmployeeData = (data) => {
  if (!data) return [];
  let employeesArray = [];
  if (Array.isArray(data)) employeesArray = data;
  else if (data.data && Array.isArray(data.data)) employeesArray = data.data;
  else if (data.employees && Array.isArray(data.employees)) employeesArray = data.employees;
  else if (typeof data === 'object' && data !== null) employeesArray = [data];

  return employeesArray.map(emp => {
    let fullName = emp.name || emp.full_name || (emp.first_name && emp.last_name ? `${emp.first_name} ${emp.last_name}` : emp.employee_name) || 'Unknown Employee';
    const employeeId = emp.employee_id || emp.id || emp.employeeId || emp.empId;
    const department = emp.department || emp.dept || emp.dept_name || '';
    const position = emp.position || emp.job_title || emp.jobTitle || emp.role || '';
    return { id: emp.id || employeeId, employee_id: employeeId, name: fullName, department, position };
  }).filter(emp => emp.name !== 'Unknown Employee' && emp.employee_id);
};

// ============= API Functions =============

// Fetch employees from the employees table only
const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/employees`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch employees: ${response.status}`);
    }
    const data = await response.json();
    return normalizeEmployeeData(data);
  } catch (error) {
    console.error('Error fetching employees:', error);
    toast.error('Could not load employee list. Please check backend.');
    return []; // Return empty array on error
  }
};

// Fetch departments dropdown
const fetchDepartmentsDropdown = async () => {
  try {
    const response = await fetch(`${SHEQ_API}/dropdowns/departments`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch departments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    // Fallback to a static list (but ideally the backend should provide it)
    return [
      'MAINTENANCE', 'UNDERGROUND MINING', 'OPEN PIT MINING', 'PROCESSING',
      'SAFETY', 'ADMINISTRATION', 'LOGISTICS', 'ENGINEERING', 'GEOLOGY',
      'HUMAN RESOURCES', 'FINANCE'
    ];
  }
};

// Fetch SHEQ indicators with filters
const fetchSHEQIndicators = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') params.append(key, value);
    });
    const url = `${SHEQ_API}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching SHEQ indicators:', error);
    throw error;
  }
};

// Fetch SHEQ stats
const fetchSHEQStats = async () => {
  try {
    const response = await fetch(`${SHEQ_API}/stats/summary`, { cache: 'no-store' });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching SHEQ stats:', error);
    return null;
  }
};

// Create a new SHEQ indicator
const createSHEQIndicator = async (indicatorData) => {
  const response = await fetch(SHEQ_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicatorData),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return await response.json();
};

// Update an existing SHEQ indicator
const updateSHEQIndicator = async (indicatorId, indicatorData) => {
  const response = await fetch(`${SHEQ_API}/${indicatorId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicatorData),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return await response.json();
};

// Delete a SHEQ indicator
const deleteSHEQIndicator = async (indicatorId) => {
  const response = await fetch(`${SHEQ_API}/${indicatorId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return await response.json();
};

// Fix database indicator types (optional)
const fixDatabaseIndicatorTypesAPI = async () => {
  const response = await fetch(`${SHEQ_API}/fix-report-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`Failed to fix indicator types: ${response.status}`);
  return await response.json();
};

// Download data as CSV
const downloadSHEQCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = [
    'Indicator ID', 'Indicator Type', 'Employee Name', 'Employee ID', 'Department',
    'Position', 'Location', 'Date Reported', 'Time Reported', 'Priority', 'Status',
    'Description', 'Hazard Description', 'Near Miss Description', 'Incident Description',
    'Corrective Actions', 'Responsible Person', 'Due Date', 'Notes',
    'Created At', 'Updated At', 'Reported By'
  ];

  const csvData = data.map(indicator => {
    const indicatorType = getIndicatorTypeFromIndicator(indicator);
    return [
      indicator.id,
      `"${indicatorType.name}"`,
      `"${(indicator.employee_name || '').replace(/"/g, '""')}"`,
      `"${(indicator.employee_id || '').replace(/"/g, '""')}"`,
      `"${(indicator.department || '').replace(/"/g, '""')}"`,
      `"${(indicator.position || '').replace(/"/g, '""')}"`,
      `"${(indicator.location || '').replace(/"/g, '""')}"`,
      `"${formatDate(indicator.date_reported)}"`,
      `"${(indicator.time_reported || '').replace(/"/g, '""')}"`,
      `"${PRIORITY_LEVELS[indicator.priority]?.name || indicator.priority}"`,
      `"${STATUS_TYPES[indicator.status]?.name || indicator.status}"`,
      `"${(indicator.description || '').replace(/"/g, '""')}"`,
      `"${(indicator.hazard_description || '').replace(/"/g, '""')}"`,
      `"${(indicator.near_miss_description || '').replace(/"/g, '""')}"`,
      `"${(indicator.incident_description || '').replace(/"/g, '""')}"`,
      `"${(indicator.corrective_actions || '').replace(/"/g, '""')}"`,
      `"${(indicator.responsible_person || '').replace(/"/g, '""')}"`,
      `"${formatDate(indicator.due_date)}"`,
      `"${(indicator.notes || '').replace(/"/g, '""')}"`,
      `"${formatDateTime(indicator.created_at || indicator.date_reported)}"`,
      `"${formatDateTime(indicator.updated_at || indicator.date_reported)}"`,
      `"${(indicator.reported_by || indicator.employee_name || '').replace(/"/g, '""')}"`
    ];
  });

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

// Status Badge
const StatusBadge = ({ status }) => {
  const config = STATUS_TYPES[status] || STATUS_TYPES.open;
  const Icon = config.icon;
  return (
    <ShadcnBadge variant={config.variant || "outline"} className="gap-1.5">
      <Icon className="h-3 w-3" />
      {config.name}
    </ShadcnBadge>
  );
};

// Priority Badge
const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_LEVELS[priority] || PRIORITY_LEVELS.medium;
  const Icon = config.icon;
  return (
    <ShadcnBadge variant={config.variant || "outline"} className="gap-1.5">
      <Icon className="h-3 w-3" />
      {config.name}
    </ShadcnBadge>
  );
};

// Location Badge (now just shows the text)
const LocationBadge = ({ location }) => {
  return (
    <ShadcnBadge variant="outline" className="gap-1.5">
      <MapPin className="h-3 w-3" />
      {location || 'Not specified'}
    </ShadcnBadge>
  );
};

// Indicator Type Badge (uses the inferred type)
const IndicatorTypeBadge = ({ indicator }) => {
  const indicatorType = getIndicatorTypeFromIndicator(indicator);
  const Icon = indicatorType.icon;
  return (
    <ShadcnBadge variant={indicatorType.badgeVariant || "outline"} className="gap-1.5">
      <Icon className="h-3 w-3" />
      {indicatorType.shortName}
    </ShadcnBadge>
  );
};

// Employee Select (fetches real employees from the employees table)
const EmployeeSelect = ({ value, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchEmployees().then(data => {
        setEmployees(data);
        setLoading(false);
      });
    }
  }, [open]);

  const filteredEmployees = useMemo(() => {
    if (!search) return employees;
    const lowerSearch = search.toLowerCase();
    return employees.filter(emp => 
      emp.name?.toLowerCase().includes(lowerSearch) ||
      emp.employee_id?.toLowerCase().includes(lowerSearch) ||
      emp.department?.toLowerCase().includes(lowerSearch)
    );
  }, [employees, search]);

  const selectedEmployee = employees.find(emp => emp.employee_id === value);

  const handleSelect = (emp) => {
    onChange(emp);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-auto py-2"
          disabled={disabled}
        >
          {selectedEmployee ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {selectedEmployee.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-medium text-sm">{selectedEmployee.name}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedEmployee.employee_id} • {selectedEmployee.department}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Select employee...</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Search employees..." value={search} onValueChange={setSearch} className="h-10" />
          </div>
          <CommandList>
            <CommandEmpty>No employees found.</CommandEmpty>
            <CommandGroup>
              {loading ? (
                <div className="py-6 text-center text-sm">Loading...</div>
              ) : (
                filteredEmployees.map(emp => (
                  <CommandItem
                    key={emp.employee_id}
                    value={emp.employee_id}
                    onSelect={() => handleSelect(emp)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {emp.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{emp.name}</div>
                        <div className="text-xs text-muted-foreground">{emp.employee_id} • {emp.department}</div>
                      </div>
                    </div>
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

// SHEQ Form Schema
const sheqFormSchema = z.object({
  report_type: z.string().min(1, "Indicator type is required"),
  employee_name: z.string().min(1, "Employee name is required"),
  employee_id: z.string().min(1, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  date_reported: z.string().min(1, "Date is required"),
  time_reported: z.string().optional(),
  priority: z.string(),
  status: z.string(),
  description: z.string().optional(),
  corrective_actions: z.string().optional(),
  responsible_person: z.string().optional(),
  due_date: z.string().optional(),
  notes: z.string().optional(),
  hazard_description: z.string().optional(),
  near_miss_description: z.string().optional(),
  incident_description: z.string().optional(),
  risk_level: z.string().optional(),
  impact_level: z.string().optional(),
});

// Enhanced SHEQ Form Component
const EnhancedSHEQForm = ({ isOpen, onClose, onSubmit, initialData, formType, departments = [], loading = false }) => {
  const actualFormType = initialData ? getIndicatorTypeFromData(initialData) : formType;
  const indicatorType = getIndicatorType(actualFormType);

  const form = useForm({
    resolver: zodResolver(sheqFormSchema),
    defaultValues: {
      report_type: actualFormType,
      employee_name: initialData?.employee_name || '',
      employee_id: initialData?.employee_id || '',
      department: initialData?.department || '',
      position: initialData?.position || '',
      location: initialData?.location || '',
      date_reported: initialData?.date_reported || new Date().toISOString().split('T')[0],
      time_reported: initialData?.time_reported || '',
      priority: initialData?.priority || 'medium',
      status: initialData?.status || 'draft',
      hazard_description: initialData?.hazard_description || '',
      near_miss_description: initialData?.near_miss_description || '',
      incident_description: initialData?.incident_description || '',
      description: initialData?.description || '',
      corrective_actions: initialData?.corrective_actions || '',
      responsible_person: initialData?.responsible_person || '',
      due_date: initialData?.due_date || '',
      notes: initialData?.notes || '',
      risk_level: initialData?.risk_level || 'medium',
      impact_level: initialData?.impact_level || 'moderate',
    },
  });

  const handleEmployeeSelect = (emp) => {
    form.setValue('employee_name', emp.name);
    form.setValue('employee_id', emp.employee_id);
    form.setValue('department', emp.department);
    form.setValue('position', emp.position || '');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${indicatorType.color} text-white`}>
              <indicatorType.icon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>{initialData ? 'Edit' : 'New'} {indicatorType.name}</DialogTitle>
              <DialogDescription>{indicatorType.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="report_type"
              render={({ field }) => <input type="hidden" {...field} />}
            />

            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="risk">Risk</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employee_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <FormControl>
                          <EmployeeSelect
                            value={form.watch('employee_id')}
                            onChange={handleEmployeeSelect}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location field - now a free text input */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location (e.g., Workshop, Shaft A, etc.)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date_reported"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Reported</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time_reported"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time (optional)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(PRIORITY_LEVELS).map(([key, p]) => (
                              <SelectItem key={key} value={key}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(STATUS_TYPES).map(([key, s]) => (
                              <SelectItem key={key} value={key}>{s.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                {actualFormType === 'hazard' && (
                  <FormField
                    control={form.control}
                    name="hazard_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hazard Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the hazard..." className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {actualFormType === 'near_miss' && (
                  <FormField
                    control={form.control}
                    name="near_miss_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Near Miss Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the near miss..." className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {actualFormType === 'incident' && (
                  <FormField
                    control={form.control}
                    name="incident_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the incident..." className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="risk" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="risk_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(RISK_LEVELS).map(([key, r]) => (
                              <SelectItem key={key} value={key}>{r.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impact_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impact Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(IMPACT_LEVELS).map(([key, i]) => (
                              <SelectItem key={key} value={key}>{i.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="corrective_actions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrective Actions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Actions to address the issue..." className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="responsible_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsible Person</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Internal notes (admin only)..." className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced SHEQ Indicator Card
const EnhancedSHEQIndicatorCard = ({ indicator, onView, onEdit, onDelete }) => {
  const indicatorType = getIndicatorTypeFromIndicator(indicator);
  const Icon = indicatorType.icon;
  const isOverdueItem = isOverdue(indicator.due_date);

  const getDescription = () => {
    if (indicator.hazard_description && indicator.report_type === 'hazard') return indicator.hazard_description;
    if (indicator.near_miss_description && indicator.report_type === 'near_miss') return indicator.near_miss_description;
    if (indicator.incident_description && indicator.report_type === 'incident') return indicator.incident_description;
    return indicator.description || 'No description';
  };

  return (
    <Card className={`group transition-all hover:shadow-lg hover:border-primary/50 ${isOverdueItem ? 'border-destructive/20 bg-destructive/5' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${indicatorType.color} text-white shadow-md mt-1`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-semibold">{indicatorType.name}</CardTitle>
                <IndicatorTypeBadge indicator={indicator} />
                <ShadcnBadge variant="outline" className="text-xs">#{indicator.id}</ShadcnBadge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span className="truncate">{indicator.employee_name || 'Unknown'}</span>
                <ShadcnBadge variant="outline" className="text-xs">{indicator.department || 'UNKNOWN'}</ShadcnBadge>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <PriorityBadge priority={indicator.priority} />
            <StatusBadge status={indicator.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Location
            </span>
            <LocationBadge location={indicator.location} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Reported
            </span>
            <span>{formatDate(indicator.date_reported)}</span>
          </div>
          {indicator.due_date && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Due
              </span>
              <span className={isOverdueItem ? 'text-destructive font-medium' : ''}>
                {formatDate(indicator.due_date)}
                {isOverdueItem && <AlertTriangle className="h-3.5 w-3.5 inline ml-1" />}
              </span>
            </div>
          )}
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">{getDescription()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => onView(indicator)}>
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(indicator)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(indicator.id)} className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

// Enhanced Indicator Details Modal
const EnhancedIndicatorDetails = ({ indicator, isOpen, onClose, onEdit, onExport }) => {
  if (!indicator || !isOpen) return null;
  const indicatorType = getIndicatorTypeFromIndicator(indicator);
  const isOverdueItem = isOverdue(indicator.due_date);

  const fields = [
    { label: 'ID', value: `#${indicator.id}`, icon: Hash },
    { label: 'Employee', value: indicator.employee_name, icon: User },
    { label: 'Employee ID', value: indicator.employee_id, icon: UserCog },
    { label: 'Department', value: indicator.department, icon: Building },
    { label: 'Position', value: indicator.position || '—', icon: Briefcase },
    { label: 'Location', value: indicator.location, icon: MapPin },
    { label: 'Date Reported', value: formatDate(indicator.date_reported), icon: Calendar },
    { label: 'Time', value: indicator.time_reported || '—', icon: Clock },
    { label: 'Priority', value: PRIORITY_LEVELS[indicator.priority]?.name || indicator.priority, icon: Gauge },
    { label: 'Status', value: STATUS_TYPES[indicator.status]?.name || indicator.status, icon: Activity },
    { label: 'Reported By', value: indicator.reported_by || '—', icon: User },
  ];

  const getPrimaryDescription = () => {
    if (indicator.hazard_description && indicator.report_type === 'hazard') return indicator.hazard_description;
    if (indicator.near_miss_description && indicator.report_type === 'near_miss') return indicator.near_miss_description;
    if (indicator.incident_description && indicator.report_type === 'incident') return indicator.incident_description;
    return indicator.description || 'No description';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${indicatorType.color} text-white`}>
              <indicatorType.icon className="h-5 w-5" />
            </div>
            <DialogTitle>{indicatorType.name} #{indicator.id}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fields.map((field, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 border rounded-lg bg-muted/30">
                <field.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <p className="font-medium text-sm">{field.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Primary Description */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {indicatorType.shortName} Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{getPrimaryDescription()}</p>
            </CardContent>
          </Card>

          {/* Corrective Actions */}
          {indicator.corrective_actions && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Corrective Actions</CardTitle>
              </CardHeader>
              <CardContent><p>{indicator.corrective_actions}</p></CardContent>
            </Card>
          )}

          {/* Notes */}
          {indicator.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent><p>{indicator.notes}</p></CardContent>
            </Card>
          )}

          {/* Dates */}
          <div className="flex gap-4 text-sm text-muted-foreground border-t pt-4">
            {indicator.due_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Due: {formatDate(indicator.due_date)} {isOverdueItem && '(Overdue)'}
              </div>
            )}
            <div className="flex items-center gap-1 ml-auto">
              <CalendarDays className="h-4 w-4" />
              Created: {formatDateTime(indicator.created_at)}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onExport([indicator], `indicator-${indicator.id}`)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => { onEdit(indicator); onClose(); }}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Quick Stats Bar
const StatsBar = ({ stats }) => {
  if (!stats) return null;
  const items = [
    { label: 'Total', value: stats.total_indicators, icon: FileText, color: 'bg-blue-500' },
    { label: 'Open', value: stats.open_indicators, icon: Activity, color: 'bg-amber-500' },
    { label: 'In Progress', value: stats.in_progress_indicators, icon: RefreshCw, color: 'bg-purple-500' },
    { label: 'Overdue', value: stats.overdue, icon: Clock4, color: 'bg-red-500' },
    { label: 'Resolved', value: stats.resolved_indicators, icon: CheckCircle2, color: 'bg-green-500' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map(item => (
        <Card key={item.label} className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{item.label}</p>
              <p className="text-3xl font-bold">{item.value}</p>
            </div>
            <div className={`p-3 rounded-full ${item.color} bg-opacity-10`}>
              <item.icon className={`h-5 w-5 ${item.color.replace('bg-', 'text-')}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Quick Actions Bar
const QuickActionsBar = ({ onNewIndicator, onRefresh, onExport, loading, activeForm, viewMode, onViewModeChange, onClearFilters, filtersActive, onFixDatabase }) => {
  const indicatorType = getIndicatorType(activeForm);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button onClick={() => onNewIndicator(activeForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          New {indicatorType.shortName}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Quick Indicator
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Create New Indicator</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(SHEQ_INDICATOR_TYPES).map(([key, type]) => (
              <DropdownMenuItem key={key} onClick={() => onNewIndicator(key)} className="gap-2">
                {React.createElement(type.icon, { className: "h-4 w-4" })}
                <span>{type.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm whitespace-nowrap">View:</Label>
          <Select value={viewMode} onValueChange={onViewModeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Grid
                </div>
              </SelectItem>
              <SelectItem value="list">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading} className="h-10 w-10">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onExport} className="h-10 w-10">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export CSV</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onFixDatabase} disabled={loading} className="h-10 w-10">
                <Wrench className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fix Database</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {filtersActive && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onClearFilters} className="h-10 w-10">
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear Filters</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

// ============= Main Component =============
export default function EnhancedSHEQManagement() {
  const [indicators, setIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
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
    date_from: '',
    date_to: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [fixingDatabase, setFixingDatabase] = useState(false);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Enhanced stats derived from indicators
  const enhancedStats = useMemo(() => {
    if (!indicators.length) return null;
    const total = indicators.length;
    const open = indicators.filter(i => i.status === 'open').length;
    const inProgress = indicators.filter(i => i.status === 'in_progress').length;
    const resolved = indicators.filter(i => i.status === 'resolved' || i.status === 'closed').length;
    const overdue = indicators.filter(i => isOverdue(i.due_date) && i.status !== 'closed' && i.status !== 'resolved').length;
    return { total_indicators: total, open_indicators: open, in_progress_indicators: inProgress, resolved_indicators: resolved, overdue };
  }, [indicators]);

  const filtersActive = useMemo(() => {
    return Object.entries(filters).some(([key, val]) => key !== 'search' && val && val !== 'all' && val !== '');
  }, [filters]);

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartmentsDropdown().then(setDepartments);
  }, []);

  // Data fetching
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [indicatorsData, statsData] = await Promise.allSettled([
        fetchSHEQIndicators(filters),
        fetchSHEQStats(),
      ]);
      setIndicators(indicatorsData.status === 'fulfilled' ? indicatorsData.value : []);
      setStats(statsData.status === 'fulfilled' ? statsData.value : null);
      setBackendOnline(true);
    } catch (err) {
      console.error(err);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [filters]);

  const handleSubmitForm = async (formData) => {
    setFormLoading(true);
    try {
      if (editData) {
        await updateSHEQIndicator(editData.id, formData);
        toast.success("Indicator updated");
      } else {
        await createSHEQIndicator(formData);
        toast.success("Indicator created");
      }
      fetchAllData();
      setShowForm(false);
      setEditData(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFixDatabase = async () => {
    if (!confirm('This will analyze and fix indicator types. Continue?')) return;
    setFixingDatabase(true);
    try {
      const result = await fixDatabaseIndicatorTypesAPI();
      toast.success(result.message || 'Database fixed');
      fetchAllData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFixingDatabase(false);
    }
  };

  const handleDeleteIndicator = async (id) => {
    if (!confirm('Delete indicator?')) return;
    try {
      await deleteSHEQIndicator(id);
      toast.success('Deleted');
      fetchAllData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIndicators.length} indicators?`)) return;
    try {
      await Promise.all(selectedIndicators.map(id => deleteSHEQIndicator(id)));
      toast.success(`Deleted ${selectedIndicators.length} indicators`);
      setSelectedIndicators([]);
      fetchAllData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleExport = (data = indicators, filename = `sheq-${new Date().toISOString().split('T')[0]}`) => {
    downloadSHEQCSV(data, filename);
    toast.success('Exported');
  };

  const handleClearFilters = () => setFilters({
    report_type: 'all', status: 'all', priority: 'all', department: 'all', location: 'all',
    date_from: '', date_to: '', search: ''
  });

  const getStartOfWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };

  const FilterChip = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
        active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:bg-muted'
      }`}
    >
      {label}
    </button>
  );

  const toggleSelectAll = (checked) => {
    if (checked) setSelectedIndicators(indicators.map(i => i.id));
    else setSelectedIndicators([]);
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-background via-background to-primary/5 backdrop-blur">
        <div className="px-4 md:px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  SHEQ Management
                </h1>
                <p className="text-sm text-muted-foreground">Safety, Health, Environment & Quality</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-6 py-6 max-w-7xl mx-auto space-y-8">
        {!backendOnline && (
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Connection Issue</AlertTitle>
            <AlertDescription>Cannot reach backend at {API_BASE}</AlertDescription>
          </Alert>
        )}

        {enhancedStats && <StatsBar stats={enhancedStats} />}

        {/* Quick indicator cards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Indicator Creation
            </CardTitle>
            <CardDescription>Select an indicator type to start</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(SHEQ_INDICATOR_TYPES).map(([key, type]) => (
                <button
                  key={key}
                  onClick={() => { setActiveForm(key); setShowForm(true); }}
                  className="group relative overflow-hidden rounded-xl border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className={`absolute inset-0 ${type.gradient} opacity-0 group-hover:opacity-100`} />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`p-4 rounded-xl ${type.color} text-white shadow-lg`}>
                      {React.createElement(type.icon, { className: "h-6 w-6" })}
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{type.shortName}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main content card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  SHEQ Indicators <span className="text-muted-foreground text-lg font-normal">({indicators.length})</span>
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Manage and analyse all SHEQ records
                </CardDescription>
              </div>
              <QuickActionsBar
                onNewIndicator={(type) => { setActiveForm(type); setShowForm(true); }}
                onRefresh={fetchAllData}
                onExport={handleExport}
                loading={loading}
                activeForm={activeForm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onClearFilters={handleClearFilters}
                filtersActive={filtersActive}
                onFixDatabase={handleFixDatabase}
              />
            </div>
          </CardHeader>

          <CardContent>
            {/* Filters */}
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                  <Filter className="h-4 w-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <div className="flex-1 max-w-md relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 h-10 text-sm w-full"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                {filtersActive && <ShadcnBadge variant="secondary">Filters active</ShadcnBadge>}
              </div>

              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border rounded-xl bg-muted/30 mb-6">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={filters.report_type} onValueChange={(v) => setFilters(p => ({ ...p, report_type: v }))}>
                      <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {Object.keys(SHEQ_INDICATOR_TYPES).map(key => (
                          <SelectItem key={key} value={key}>{SHEQ_INDICATOR_TYPES[key].name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={filters.status} onValueChange={(v) => setFilters(p => ({ ...p, status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {Object.keys(STATUS_TYPES).map(key => (
                          <SelectItem key={key} value={key}>{STATUS_TYPES[key].name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={filters.priority} onValueChange={(v) => setFilters(p => ({ ...p, priority: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {Object.keys(PRIORITY_LEVELS).map(key => (
                          <SelectItem key={key} value={key}>{PRIORITY_LEVELS[key].name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={filters.department} onValueChange={(v) => setFilters(p => ({ ...p, department: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Filter by location..."
                      value={filters.location === 'all' ? '' : filters.location}
                      onChange={(e) => setFilters(p => ({ ...p, location: e.target.value || 'all' }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date From</Label>
                    <Input type="date" value={filters.date_from} onChange={(e) => setFilters(p => ({ ...p, date_from: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date To</Label>
                    <Input type="date" value={filters.date_to} onChange={(e) => setFilters(p => ({ ...p, date_to: e.target.value }))} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <FilterChip label="Open" active={filters.status === 'open'} onClick={() => setFilters(p => ({ ...p, status: 'open' }))} />
                  <FilterChip label="Critical" active={filters.priority === 'critical'} onClick={() => setFilters(p => ({ ...p, priority: 'critical' }))} />
                  <FilterChip label="This Week" active={filters.date_from === getStartOfWeek()} onClick={() => {
                    const start = getStartOfWeek();
                    setFilters(p => ({ ...p, date_from: start, date_to: new Date().toISOString().split('T')[0] }));
                  }} />
                </div>

                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-2">
                    <XIcon className="h-4 w-4" />
                    Clear all filters
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Bulk actions */}
            {selectedIndicators.length > 0 && (
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg mb-4">
                <span className="text-sm font-medium">{selectedIndicators.length} selected</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleBulkDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedIndicators([])}>
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Indicators grid/list */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-5 space-y-3">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between pt-3">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : indicators.length === 0 ? (
              <div className="text-center py-16">
                <Shield className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold mb-3">No indicators found</h3>
                <p className="text-muted-foreground mb-8">
                  {filters.search || filtersActive ? 'Try adjusting your filters' : 'Create your first indicator'}
                </p>
                <Button onClick={() => { setActiveForm('hazard'); setShowForm(true); }} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  New Indicator
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {indicators.map((indicator, idx) => (
                  <div key={indicator.id} className="relative">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1">
                      <Checkbox
                        checked={selectedIndicators.includes(indicator.id)}
                        onCheckedChange={() => setSelectedIndicators(prev =>
                          prev.includes(indicator.id) ? prev.filter(id => id !== indicator.id) : [...prev, indicator.id]
                        )}
                      />
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-md">
                        #{idx + 1}
                      </span>
                    </div>
                    <EnhancedSHEQIndicatorCard
                      indicator={indicator}
                      onView={() => { setSelectedIndicator(indicator); setShowDetails(true); }}
                      onEdit={(ind) => { setEditData(ind); setShowForm(true); }}
                      onDelete={handleDeleteIndicator}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Table header */}
                <div className="hidden md:flex items-center px-4 py-2 bg-muted/50 rounded-lg text-xs font-medium">
                  <div className="w-8"><Checkbox onCheckedChange={toggleSelectAll} /></div>
                  <div className="w-12">#</div>
                  <div className="w-16">ID</div>
                  <div className="w-24">Type</div>
                  <div className="flex-1">Description / Employee</div>
                  <div className="w-24">Priority</div>
                  <div className="w-24">Status</div>
                  <div className="w-24">Location</div>
                  <div className="w-24">Date</div>
                  <div className="w-20">Actions</div>
                </div>

                {indicators.map((indicator, idx) => {
                  const rt = getIndicatorTypeFromIndicator(indicator);
                  return (
                    <Card key={indicator.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex items-center gap-4 md:w-8">
                            <Checkbox
                              checked={selectedIndicators.includes(indicator.id)}
                              onCheckedChange={() => setSelectedIndicators(prev =>
                                prev.includes(indicator.id) ? prev.filter(id => id !== indicator.id) : [...prev, indicator.id]
                              )}
                            />
                          </div>
                          <div className="md:w-12 text-sm font-mono text-muted-foreground">
                            #{idx + 1}
                          </div>
                          <div className="md:w-16 text-sm font-mono">#{indicator.id}</div>
                          <div className="flex items-center gap-3 md:w-24">
                            <div className={`p-2 rounded-lg ${rt.color} text-white`}>
                              {React.createElement(rt.icon, { className: "h-4 w-4" })}
                            </div>
                            <span className="text-sm font-medium">{rt.shortName}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {indicator.hazard_description || indicator.near_miss_description || indicator.incident_description || indicator.description || 'No description'}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {indicator.employee_name} • {indicator.department}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 md:w-24">
                            <PriorityBadge priority={indicator.priority} />
                          </div>
                          <div className="md:w-24">
                            <StatusBadge status={indicator.status} />
                          </div>
                          <div className="md:w-24 text-sm text-muted-foreground truncate">
                            {indicator.location || '—'}
                          </div>
                          <div className="md:w-24 text-sm text-muted-foreground">
                            {formatDate(indicator.date_reported)}
                          </div>
                          <div className="flex items-center gap-2 md:w-20">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedIndicator(indicator); setShowDetails(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditData(indicator); setShowForm(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {indicators.length} indicators {selectedIndicators.length > 0 && `(${selectedIndicators.length} selected)`}
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Modals */}
      <EnhancedSHEQForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditData(null); }}
        onSubmit={handleSubmitForm}
        initialData={editData}
        formType={editData ? getIndicatorTypeFromData(editData) : activeForm}
        departments={departments}
        loading={formLoading}
      />

      <EnhancedIndicatorDetails
        indicator={selectedIndicator}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onEdit={(ind) => { setEditData(ind); setShowForm(true); }}
        onExport={handleExport}
      />
    </div>
  );
}