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
  Target, ClipboardCheck, Flag, Clock4, UserCog, CalendarDays,
  Bell, Check, ChevronRight, ExternalLink, FileBarChart, Printer,
  Star, Table, UserPlus, Hash, BriefcaseIcon, Expand, ChevronLeft,
  Database, Wrench, Activity, Gauge, TrendingDown, Thermometer,
  BarChart4, CircleAlert, Percent, Square, Archive, SquareDashed,
  File, Info, AlertCircle as AlertCircleIcon
} from "lucide-react";

// Import shadcn components
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

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const SHEQ_API = `${API_BASE}/api/sheq`;

// UPDATED: SHEQ Indicator Types - Changed terminology from "Report" to "Indicator"
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

// Simple function to get indicator type - uses exact database values
const getIndicatorType = (indicatorTypeKey) => {
  if (!indicatorTypeKey) {
    console.warn('No indicator type provided, defaulting to hazard');
    return SHEQ_INDICATOR_TYPES.hazard;
  }
  
  const normalizedKey = indicatorTypeKey.toLowerCase().trim();
  
  // Direct match with our defined keys
  if (SHEQ_INDICATOR_TYPES[normalizedKey]) {
    return SHEQ_INDICATOR_TYPES[normalizedKey];
  }
  
  // Try to map common variations
  if (normalizedKey.includes('near') || normalizedKey.includes('miss')) {
    return SHEQ_INDICATOR_TYPES.near_miss;
  }
  
  if (normalizedKey.includes('incident') || normalizedKey.includes('accident')) {
    return SHEQ_INDICATOR_TYPES.incident;
  }
  
  if (normalizedKey.includes('pto') || normalizedKey.includes('planned') || normalizedKey.includes('task')) {
    return SHEQ_INDICATOR_TYPES.pto;
  }
  
  if (normalizedKey.includes('performance') || normalizedKey.includes('kpi')) {
    return SHEQ_INDICATOR_TYPES.performance;
  }
  
  if (normalizedKey.includes('audit') || normalizedKey.includes('compliance')) {
    return SHEQ_INDICATOR_TYPES.audit;
  }
  
  if (normalizedKey.includes('hazard')) {
    return SHEQ_INDICATOR_TYPES.hazard;
  }
  
  // Default fallback
  console.warn(`Unknown indicator type in database: "${indicatorTypeKey}", defaulting to hazard`);
  return SHEQ_INDICATOR_TYPES.hazard;
};

// Priority Levels - Enhanced with metrics
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

// Status Types - Enhanced with workflow
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

// Risk Assessment Levels
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

// Impact Assessment - Using Square icon instead of SquareAlert
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

// Mine Locations - Enhanced
const MINE_LOCATIONS = {
  'Deep Shaft A': { 
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400', 
    icon: Drill,
    area: 'Underground',
    riskLevel: 'high'
  },
  'Deep Shaft B': { 
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400', 
    icon: Drill,
    area: 'Underground',
    riskLevel: 'high'
  },
  'Open Pit': { 
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400', 
    icon: Mountain,
    area: 'Surface',
    riskLevel: 'medium'
  },
  'Processing Plant': { 
    color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400', 
    icon: Factory,
    area: 'Plant',
    riskLevel: 'medium'
  },
  'Workshop': { 
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400', 
    icon: Settings,
    area: 'Maintenance',
    riskLevel: 'medium'
  },
  'Surface Operations': { 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400', 
    icon: Landmark,
    area: 'Surface',
    riskLevel: 'low'
  },
  'All Areas': { 
    color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400', 
    icon: Gem,
    area: 'All',
    riskLevel: 'variable'
  }
};

// Departments
const DEPARTMENTS = [
  { value: 'MAINTENANCE', label: 'Maintenance', color: 'bg-blue-500' },
  { value: 'UNDERGROUND MINING', label: 'Underground Mining', color: 'bg-indigo-500' },
  { value: 'OPEN PIT MINING', label: 'Open Pit Mining', color: 'bg-amber-500' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-purple-500' },
  { value: 'SAFETY', label: 'Safety', color: 'bg-green-500' },
  { value: 'ADMINISTRATION', label: 'Administration', color: 'bg-slate-500' },
  { value: 'LOGISTICS', label: 'Logistics', color: 'bg-orange-500' },
  { value: 'ENGINEERING', label: 'Engineering', color: 'bg-red-500' },
  { value: 'GEOLOGY', label: 'Geology', color: 'bg-emerald-500' }
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

// Helper function to generate mock employees
const generateMockEmployees = () => {
  const mockEmployees = [
    { 
      id: 1, 
      employee_id: 'EMP001', 
      name: 'John Smith', 
      department: 'SAFETY', 
      position: 'Safety Officer' 
    },
    { 
      id: 2, 
      employee_id: 'EMP002', 
      name: 'Sarah Johnson', 
      department: 'MAINTENANCE', 
      position: 'Maintenance Supervisor' 
    },
    { 
      id: 3, 
      employee_id: 'EMP003', 
      name: 'Mike Williams', 
      department: 'UNDERGROUND MINING', 
      position: 'Mine Foreman' 
    },
    { 
      id: 4, 
      employee_id: 'EMP004', 
      name: 'Lisa Brown', 
      department: 'PROCESSING', 
      position: 'Plant Operator' 
    },
    { 
      id: 5, 
      employee_id: 'EMP005', 
      name: 'David Miller', 
      department: 'ENGINEERING', 
      position: 'Project Engineer' 
    },
    { 
      id: 6, 
      employee_id: 'EMP006', 
      name: 'Robert Davis', 
      department: 'LOGISTICS', 
      position: 'Logistics Manager' 
    },
    { 
      id: 7, 
      employee_id: 'EMP007', 
      name: 'Jennifer Wilson', 
      department: 'ADMINISTRATION', 
      position: 'HR Manager' 
    },
    { 
      id: 8, 
      employee_id: 'EMP008', 
      name: 'Thomas Moore', 
      department: 'OPEN PIT MINING', 
      position: 'Excavator Operator' 
    },
    { 
      id: 9, 
      employee_id: 'EMP009', 
      name: 'Patricia Taylor', 
      department: 'GEOLOGY', 
      position: 'Geologist' 
    },
    { 
      id: 10, 
      employee_id: 'EMP010', 
      name: 'Michael Anderson', 
      department: 'SAFETY', 
      position: 'Safety Inspector' 
    }
  ];
  
  console.log('Using mock employees:', mockEmployees);
  return mockEmployees;
};

// Helper function to normalize employee data
const normalizeEmployeeData = (data) => {
  if (!data) return [];
  
  let employeesArray = [];
  
  // Handle different data structures
  if (Array.isArray(data)) {
    employeesArray = data;
  } else if (data.data && Array.isArray(data.data)) {
    employeesArray = data.data;
  } else if (data.employees && Array.isArray(data.employees)) {
    employeesArray = data.employees;
  } else if (typeof data === 'object' && data !== null) {
    // If it's a single object, wrap it in an array
    employeesArray = [data];
  }
  
  // Map to standard format
  const normalized = employeesArray.map(emp => {
    if (!emp) return null;
    
    // Determine full name
    let fullName = '';
    if (emp.name) {
      fullName = emp.name;
    } else if (emp.full_name) {
      fullName = emp.full_name;
    } else if (emp.first_name || emp.last_name) {
      fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.trim();
    } else if (emp.firstName || emp.lastName) {
      fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim();
    } else if (emp.employee_name) {
      fullName = emp.employee_name;
    } else {
      fullName = 'Unknown Employee';
    }
    
    // Determine employee ID
    const employeeId = emp.employee_id || emp.id || emp.employeeId || emp.empId || 'EMP' + (emp.id || Math.random().toString(36).substr(2, 9));
    
    // Determine department
    const department = emp.department || emp.dept || emp.dept_name || 'UNKNOWN';
    
    // Determine position
    const position = emp.position || emp.job_title || emp.jobTitle || emp.role || emp.job_position || '';
    
    return {
      id: emp.id || employeeId,
      employee_id: employeeId,
      name: fullName,
      department: department.toUpperCase(),
      position: position,
      // Keep original data for debugging
      _original: emp
    };
  }).filter(emp => emp !== null && emp.name && emp.name !== 'Unknown Employee');
  
  return normalized;
};

// FIXED: API Functions with proper indicator type handling
const fetchSHEQIndicators = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.append(key, value);
      }
    });

    const url = `${SHEQ_API}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // CRITICAL: Debug what's actually in the database
    console.log('🔍 DATABASE ANALYSIS - Raw report_type values:');
    const typeCounts = {};
    data.forEach(indicator => {
      const type = indicator.report_type || 'NULL';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    console.log('Database indicator_type distribution:', typeCounts);
    
    // Log first 5 indicators for inspection
    data.slice(0, 5).forEach(indicator => {
      console.log(`Indicator ${indicator.id}:`, {
        report_type: `"${indicator.report_type}"`,
        display: getIndicatorType(indicator.report_type).name,
        has_hazard_desc: !!indicator.hazard_description,
        has_near_miss_desc: !!indicator.near_miss_description,
        has_incident_desc: !!indicator.incident_description
      });
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching SHEQ indicators:', error);
    throw error;
  }
};

const fetchSHEQStats = async () => {
  try {
    const response = await fetch(`${SHEQ_API}/stats/summary`, {
      cache: 'no-store'
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching SHEQ stats:', error);
    return null;
  }
};

const fetchEmployeesList = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/employees`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn(`Employees API returned ${response.status}, returning mock data`);
      return generateMockEmployees();
    }
    
    const data = await response.json();
    return normalizeEmployeeData(data);
    
  } catch (error) {
    console.error('Error fetching employees list:', error);
    return generateMockEmployees();
  }
};

// CRITICAL FIX: Create SHEQ Indicator with EXACT report_type values
const createSHEQIndicator = async (indicatorData) => {
  try {
    console.log('🚀 Creating SHEQ indicator with:', {
      report_type: indicatorData.report_type,
      expected_display: getIndicatorType(indicatorData.report_type).name
    });
    
    // VALIDATION: Ensure report_type is one of our exact keys
    const validIndicatorTypes = ['hazard', 'near_miss', 'incident', 'pto', 'performance', 'audit'];
    const indicatorType = indicatorData.report_type;
    
    if (!validIndicatorTypes.includes(indicatorType)) {
      console.error('❌ Invalid indicator type:', indicatorType);
      throw new Error(`Invalid indicator type: ${indicatorType}. Must be one of: ${validIndicatorTypes.join(', ')}`);
    }
    
    // Prepare data - ensure we only send description for the selected type
    const payload = {
      ...indicatorData,
      // Clear other description fields to avoid confusion
      hazard_description: indicatorType === 'hazard' ? (indicatorData.hazard_description || '') : '',
      near_miss_description: indicatorType === 'near_miss' ? (indicatorData.near_miss_description || '') : '',
      incident_description: indicatorType === 'incident' ? (indicatorData.incident_description || '') : '',
    };
    
    console.log('📤 Sending to API:', payload);
    
    const response = await fetch(SHEQ_API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Created successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error creating SHEQ indicator:', error);
    throw new Error(`Failed to create SHEQ indicator: ${error.message}`);
  }
};

// FIXED: Update SHEQ Indicator
const updateSHEQIndicator = async (indicatorId, indicatorData) => {
  try {
    console.log('✏️ Updating indicator', indicatorId, 'with:', {
      report_type: indicatorData.report_type,
      display: getIndicatorType(indicatorData.report_type).name
    });
    
    // Validate indicator type
    const validIndicatorTypes = ['hazard', 'near_miss', 'incident', 'pto', 'performance', 'audit'];
    const indicatorType = indicatorData.report_type;
    
    if (!validIndicatorTypes.includes(indicatorType)) {
      throw new Error(`Invalid indicator type: ${indicatorType}`);
    }
    
    const payload = {
      ...indicatorData,
      hazard_description: indicatorType === 'hazard' ? (indicatorData.hazard_description || '') : '',
      near_miss_description: indicatorType === 'near_miss' ? (indicatorData.near_miss_description || '') : '',
      incident_description: indicatorType === 'incident' ? (indicatorData.incident_description || '') : '',
    };
    
    const response = await fetch(`${SHEQ_API}/${indicatorId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error updating SHEQ indicator:', error);
    throw error;
  }
};

const deleteSHEQIndicator = async (indicatorId) => {
  try {
    const response = await fetch(`${SHEQ_API}/${indicatorId}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting SHEQ indicator:', error);
    throw error;
  }
};

// NEW: Function to FIX database indicator types
const fixDatabaseIndicatorTypesAPI = async () => {
  try {
    console.log('🛠️ Starting database fix...');
    const response = await fetch(`${SHEQ_API}/fix-report-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fix indicator types: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Database fix result:', result);
    return result;
    
  } catch (error) {
    console.error('Error fixing database indicator types:', error);
    throw error;
  }
};

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
    const indicatorType = getIndicatorType(indicator.report_type);
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
    <ShadcnBadge variant={config.variant || "outline"} className="gap-1.5">
      <Icon className="h-3 w-3" />
      {config.name}
    </ShadcnBadge>
  );
};

// Priority Badge Component
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

// Location Badge Component
const LocationBadge = ({ location }) => {
  const config = MINE_LOCATIONS[location] || { color: 'bg-slate-100 text-slate-700 border-slate-300', icon: MapPin };
  const Icon = config.icon || MapPin;

  return (
    <ShadcnBadge variant="outline" className="gap-1.5">
      <Icon className="h-3 w-3" />
      {location}
    </ShadcnBadge>
  );
};

// Indicator Type Badge Component - Shows correct type
const IndicatorTypeBadge = ({ indicatorTypeKey }) => {
  const indicatorType = getIndicatorType(indicatorTypeKey);
  const Icon = indicatorType.icon;

  return (
    <ShadcnBadge 
      variant={indicatorType.badgeVariant || "outline"} 
      className="gap-1.5"
    >
      <Icon className="h-3 w-3" />
      {indicatorType.shortName}
    </ShadcnBadge>
  );
};

// Enhanced Employee Select component
const EnhancedEmployeeSelect = ({ 
  employees = [], 
  formData, 
  onChange,
  className = "",
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('sheq_favorite_employees') || '[]');
      } catch {
        return [];
      }
    }
    return [];
  });

  // Filter out invalid employees
  const validEmployees = useMemo(() => {
    const filtered = employees.filter(emp => {
      const isValid = emp && 
                     (emp.employee_id || emp.id) && 
                     (emp.name || emp.employee_id || emp.id);
      
      return isValid;
    });
    
    return filtered;
  }, [employees]);

  // Group employees by department
  const employeesByDepartment = validEmployees.reduce((acc, employee) => {
    const dept = employee.department || 'Unknown Department';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(employee);
    return acc;
  }, {});

  const favoriteEmployees = validEmployees.filter(emp => 
    favorites.includes(emp.employee_id)
  );

  const filteredEmployees = validEmployees.filter(emp => {
    const searchTerm = search.toLowerCase();
    return (
      (emp.name || '').toLowerCase().includes(searchTerm) ||
      (emp.employee_id || '').toLowerCase().includes(searchTerm) ||
      (emp.department || '').toLowerCase().includes(searchTerm) ||
      (emp.position || '').toLowerCase().includes(searchTerm)
    );
  });

  const selectedEmployee = validEmployees.find(emp => 
    emp.employee_id === formData.employee_id
  );

  const toggleFavorite = (employeeId, e) => {
    e.stopPropagation();
    e.preventDefault();
    const newFavorites = favorites.includes(employeeId)
      ? favorites.filter(id => id !== employeeId)
      : [...favorites, employeeId];
    
    setFavorites(newFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sheq_favorite_employees', JSON.stringify(newFavorites));
    }
  };

  const handleSelect = (employee) => {
    onChange("employee_name", employee.name || '');
    onChange("employee_id", employee.employee_id || '');
    onChange("department", employee.department || '');
    onChange("position", employee.position || '');
    setOpen(false);
    setSearch("");
  };

  const handleQuickSelect = () => {
    const currentUser = {
      name: "John Doe",
      employee_id: "EMP001",
      department: "SAFETY",
      position: "Safety Officer"
    };
    
    onChange("employee_name", currentUser.name);
    onChange("employee_id", currentUser.employee_id);
    onChange("department", currentUser.department);
    onChange("position", currentUser.position);
    setOpen(false);
  };

  if (disabled) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {selectedEmployee?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NA'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium">{selectedEmployee?.name || 'No employee selected'}</div>
          <div className="text-xs text-muted-foreground">
            {selectedEmployee?.employee_id ? `${selectedEmployee.employee_id} • ${selectedEmployee.department}` : 'Select an employee'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between h-auto py-2 ${className}`}
          disabled={disabled}
        >
          {selectedEmployee ? (
            <div className="flex items-center gap-2 flex-1 text-left">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedEmployee.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'EMP'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{selectedEmployee.name || 'Unknown Employee'}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {selectedEmployee.employee_id || 'No ID'} • {selectedEmployee.department || 'Unknown'}
                </div>
              </div>
              {favorites.includes(selectedEmployee.employee_id) && (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">
              {validEmployees.length > 0 ? 'Select employee...' : 'Loading employees...'}
            </span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search employees..." 
              value={search}
              onValueChange={setSearch}
              className="border-none focus:ring-0 h-11"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="py-6 text-center">
              <User className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No employees found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {validEmployees.length === 0 ? 'Employee list is empty' : 'Try a different search'}
              </p>
            </CommandEmpty>
            
            {/* Quick Actions */}
            {!search && (
              <CommandGroup heading="Quick Actions">
                <CommandItem onSelect={handleQuickSelect} className="cursor-pointer">
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Use My Details</span>
                  <ShadcnBadge variant="outline" className="ml-auto text-xs">
                    Quick Fill
                  </ShadcnBadge>
                </CommandItem>
              </CommandGroup>
            )}

            {/* Favorites Section */}
            {!search && favoriteEmployees.length > 0 && (
              <CommandGroup heading="Favorites">
                {favoriteEmployees.map((employee) => (
                  <CommandItem
                    key={employee.employee_id || employee.id}
                    onSelect={() => handleSelect(employee)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/10">
                          {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'EMP'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{employee.name || 'Unknown Employee'}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {employee.employee_id || 'No ID'} • {employee.department || 'Unknown'}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => toggleFavorite(employee.employee_id, e)}
                    >
                      <Star className={`h-3 w-3 ${favorites.includes(employee.employee_id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Search Results */}
            {search && filteredEmployees.length > 0 && (
              <CommandGroup heading="Search Results">
                {filteredEmployees.map((employee) => (
                  <CommandItem
                    key={employee.employee_id || employee.id}
                    onSelect={() => handleSelect(employee)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'EMP'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{employee.name || 'Unknown Employee'}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {employee.employee_id || 'No ID'} • {employee.department || 'Unknown'}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => toggleFavorite(employee.employee_id, e)}
                    >
                      <Star className={`h-3 w-3 ${favorites.includes(employee.employee_id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Browse by Department */}
            {!search && Object.keys(employeesByDepartment).map((dept) => (
              <CommandGroup key={dept} heading={dept}>
                {employeesByDepartment[dept].map((employee) => (
                  <CommandItem
                    key={employee.employee_id || employee.id}
                    onSelect={() => handleSelect(employee)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'EMP'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{employee.name || 'Unknown Employee'}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {employee.employee_id || 'No ID'}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => toggleFavorite(employee.employee_id, e)}
                    >
                      <Star className={`h-3 w-3 ${favorites.includes(employee.employee_id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
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

// FIXED: Enhanced SHEQ Form Component - ensures correct report_type is saved
const EnhancedSHEQForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  formType, 
  employees = [],
  loading = false 
}) => {
  // Use formType for new indicators, initialData.report_type for edits
  const actualFormType = initialData ? initialData.report_type : formType;
  const indicatorType = getIndicatorType(actualFormType);
  
  console.log('📝 Form configuration:', {
    formType,
    actualFormType,
    indicatorTypeName: indicatorType.name,
    isEdit: !!initialData
  });
  
  const form = useForm({
    resolver: zodResolver(sheqFormSchema),
    defaultValues: {
      // CRITICAL: Use the exact report_type value
      report_type: actualFormType,
      employee_name: initialData?.employee_name || '',
      employee_id: initialData?.employee_id || '',
      department: initialData?.department || 'MAINTENANCE',
      position: initialData?.position || '',
      location: initialData?.location || 'Workshop',
      date_reported: initialData?.date_reported || new Date().toISOString().split('T')[0],
      time_reported: initialData?.time_reported || new Date().toTimeString().slice(0, 5),
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

  const handleFormSubmit = async (formData) => {
    try {
      console.log('📤 Submitting form:', {
        report_type: formData.report_type,
        display: getIndicatorType(formData.report_type).name
      });
      
      await onSubmit(formData);
    } catch (error) {
      throw error;
    }
  };

  const handleFieldChange = (field, value) => {
    form.setValue(field, value);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${indicatorType.color} text-white flex-shrink-0`}>
              <indicatorType.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl break-words">
                {initialData ? 'Edit' : 'New'} {indicatorType.name}
              </DialogTitle>
              <DialogDescription className="break-words">
                {indicatorType.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* CRITICAL: Hidden field ensures report_type is always sent */}
            <FormField
              control={form.control}
              name="report_type"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
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
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Employee
                          <ShadcnBadge variant="outline" className="text-xs">
                            Required
                          </ShadcnBadge>
                        </FormLabel>
                        <FormControl>
                          <EnhancedEmployeeSelect
                            employees={employees}
                            formData={{
                              employee_name: field.value,
                              employee_id: form.getValues("employee_id"),
                              department: form.getValues("department"),
                              position: form.getValues("position"),
                            }}
                            onChange={handleFieldChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Select employee from database
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(MINE_LOCATIONS).map((location) => (
                              <SelectItem key={location} value={location}>
                                <div className="flex items-center gap-2">
                                  {React.createElement(MINE_LOCATIONS[location].icon, { className: "h-4 w-4" })}
                                  {location}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <FormLabel>Time Reported</FormLabel>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(PRIORITY_LEVELS).map(([key, priority]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  {React.createElement(priority.icon, { className: "h-4 w-4" })}
                                  {priority.name}
                                </div>
                              </SelectItem>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(STATUS_TYPES).map(([key, status]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  {React.createElement(status.icon, { className: "h-4 w-4" })}
                                  {status.name}
                                </div>
                              </SelectItem>
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
                        <FormLabel className="flex items-center gap-2">
                          <AlertOctagon className="h-4 w-4" />
                          Hazard Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the hazard in detail including location, nature, and potential risks..." 
                            className="min-h-[140px] resize-y font-sans text-base leading-relaxed break-words" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-sm break-words">
                          Be specific about the location, nature, and potential risks. Include any immediate dangers.
                        </FormDescription>
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
                        <FormLabel className="flex items-center gap-2">
                          <FileWarning className="h-4 w-4" />
                          Near Miss Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what happened, how injury was avoided, and the potential severity..." 
                            className="min-h-[140px] resize-y font-sans text-base leading-relaxed break-words" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-sm break-words">
                          Include details about the potential severity and immediate causes. What prevented the incident?
                        </FormDescription>
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
                        <FormLabel className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Incident Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the incident in detail including timeline, people involved, and immediate response..." 
                            className="min-h-[140px] resize-y font-sans text-base leading-relaxed break-words" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-sm break-words">
                          Include all relevant details about the incident including timeline and immediate actions taken.
                        </FormDescription>
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
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Additional Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional notes, observations, or context for this indicator..." 
                          className="min-h-[100px] resize-y font-sans text-base leading-relaxed break-words" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm break-words">
                        Optional notes that provide additional context for this indicator.
                      </FormDescription>
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
                        <FormLabel className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Risk Level Assessment
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(RISK_LEVELS).map(([key, risk]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <div className={`h-2 w-2 rounded-full ${risk.color.split(' ')[0]}`} />
                                  {risk.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-sm break-words">
                          Assess the probability and severity of the risk
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impact_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Square className="h-4 w-4" />
                          Impact Assessment
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select impact level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(IMPACT_LEVELS).map(([key, impact]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <div className={`h-2 w-2 rounded-full ${impact.color.split(' ')[0]}`} />
                                  {impact.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-sm break-words">
                          Assess the potential impact on operations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2 break-words">
                    <BarChart4 className="h-4 w-4" />
                    Risk Matrix
                  </h4>
                  <div className="text-sm text-muted-foreground break-words">
                    Based on your selections, this indicator will be positioned in the SHEQ risk matrix for tracking and analysis.
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="corrective_actions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4" />
                        Corrective Actions
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe corrective actions to be taken to address this indicator..." 
                          className="min-h-[120px] resize-y font-sans text-base leading-relaxed break-words" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm break-words">
                        Specific actions required to mitigate the risk or address the issue
                      </FormDescription>
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
                        <FormLabel className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Responsible Person
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name or ID of responsible person" {...field} className="break-words" />
                        </FormControl>
                        <FormDescription className="text-sm break-words">
                          Person accountable for implementing corrective actions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Target Completion Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription className="text-sm break-words">
                          Date by which corrective actions should be completed
                        </FormDescription>
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
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Internal Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Internal notes and comments for administrative use..." 
                          className="min-h-[120px] resize-y font-sans text-base leading-relaxed break-words" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm break-words">
                        These notes are only visible to administrators and SHEQ managers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="urgent-review" className="cursor-pointer font-medium break-words">
                      Flag for Urgent Review
                    </Label>
                    <Switch id="urgent-review" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="follow-up" className="cursor-pointer font-medium break-words">
                      Schedule Follow-up Review
                    </Label>
                    <Switch id="follow-up" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="escalate" className="cursor-pointer font-medium break-words">
                      Escalate to Management
                    </Label>
                    <Switch id="escalate" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2 flex-col sm:flex-row">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? 'Update Indicator' : 'Create Indicator'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced SHEQ Indicator Card - Shows CORRECT indicator type
const EnhancedSHEQIndicatorCard = ({ indicator, onView, onEdit, onDelete }) => {
  const indicatorType = getIndicatorType(indicator.report_type);
  const Icon = indicatorType.icon;
  const [isHovered, setIsHovered] = useState(false);

  const isOverdueItem = isOverdue(indicator.due_date);

  return (
    <Card 
      className={`group transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:scale-[1.02] ${
        isOverdueItem ? 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${indicatorType.color} text-white shadow-md mt-1 flex-shrink-0`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-semibold tracking-tight break-words">
                  {indicatorType.name}
                </CardTitle>
                <IndicatorTypeBadge indicatorTypeKey={indicator.report_type} />
                <ShadcnBadge variant="outline" className="text-xs font-normal bg-muted/50">
                  #{indicator.id}
                </ShadcnBadge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span className="font-medium tracking-tight truncate">{indicator.employee_name || 'Unknown Employee'}</span>
                </div>
                <ShadcnBadge variant="outline" className="text-xs font-medium truncate max-w-[120px]">
                  {indicator.department || 'UNKNOWN'}
                </ShadcnBadge>
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
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <MapPin className="h-3.5 w-3.5" />
              Location
            </span>
            <LocationBadge location={indicator.location} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              Reported
            </span>
            <div className="flex flex-col items-end">
              <span className="font-medium tracking-tight">{formatDate(indicator.date_reported)}</span>
              <span className="text-xs text-muted-foreground">{indicator.time_reported || 'Not specified'}</span>
            </div>
          </div>
          {indicator.due_date && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5" />
                Target Date
              </span>
              <span className={`font-medium tracking-tight flex items-center gap-1.5 ${isOverdueItem ? 'text-destructive' : 'text-foreground'}`}>
                {formatDate(indicator.due_date)}
                {isOverdueItem && (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
              </span>
            </div>
          )}
          {/* Show appropriate description */}
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2 font-sans leading-relaxed break-words">
              {indicator.hazard_description && indicator.report_type === 'hazard' && indicator.hazard_description}
              {indicator.near_miss_description && indicator.report_type === 'near_miss' && indicator.near_miss_description}
              {indicator.incident_description && indicator.report_type === 'incident' && indicator.incident_description}
              {indicator.description && indicator.description}
              {!indicator.hazard_description && !indicator.near_miss_description && !indicator.incident_description && !indicator.description && 
                `No ${indicatorType.shortName.toLowerCase()} description provided`}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 gap-1.5 hover:bg-primary/10 hover:text-primary font-medium"
          onClick={() => onView(indicator)}
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onView(indicator)} className="gap-2 cursor-pointer">
              <Eye className="h-4 w-4" />
              <span className="font-medium">View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(indicator)} className="gap-2 cursor-pointer">
              <Edit className="h-4 w-4" />
              <span className="font-medium">Edit Indicator</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(indicator.id)}
              className="gap-2 text-destructive focus:text-destructive cursor-pointer font-medium"
            >
              <Trash2 className="h-4 w-4" />
              Delete Indicator
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

// ENHANCED: SHEQ Indicator Details Component - POLISHED VERSION
const EnhancedIndicatorDetails = ({ 
  indicator, 
  isOpen, 
  onClose, 
  onEdit,
  onExport
}) => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    actions: true,
    notes: true,
    system: false
  });
  
  if (!indicator || !isOpen) return null;
  
  const indicatorType = getIndicatorType(indicator.report_type || 'hazard');

  // Calculate risk score if available
  const riskLevel = RISK_LEVELS[indicator.risk_level] || RISK_LEVELS.medium;
  const impactLevel = IMPACT_LEVELS[indicator.impact_level] || IMPACT_LEVELS.moderate;
  const riskScore = riskLevel.score * impactLevel.score;
  const maxRiskScore = 16;
  const riskPercentage = Math.round((riskScore / maxRiskScore) * 100);

  // Determine if overdue
  const isOverdueItem = isOverdue(indicator.due_date);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Basic information fields
  const basicInfo = [
    { label: 'Indicator ID', value: `#${indicator.id || 'N/A'}`, icon: Hash },
    { label: 'Employee Name', value: indicator.employee_name || 'Not specified', icon: User },
    { label: 'Employee ID', value: indicator.employee_id || 'Not specified', icon: UserCog },
    { label: 'Department', value: indicator.department || 'Not specified', icon: Building },
    { label: 'Position', value: indicator.position || 'Not specified', icon: Briefcase },
    { label: 'Location', value: indicator.location || 'Not specified', icon: MapPin },
    { label: 'Date Reported', value: formatDate(indicator.date_reported), icon: Calendar },
    { label: 'Time Reported', value: indicator.time_reported || 'Not specified', icon: Clock },
    ...(indicator.due_date ? [{ 
      label: 'Target Completion', 
      value: formatDate(indicator.due_date), 
      icon: Clock4,
      isOverdue: isOverdueItem 
    }] : []),
    ...(indicator.responsible_person ? [{ 
      label: 'Responsible Person', 
      value: indicator.responsible_person, 
      icon: UserCheck 
    }] : []),
  ];

  // Get primary description content
  const getPrimaryDescription = () => {
    if (indicator.hazard_description && indicator.report_type === 'hazard') {
      return indicator.hazard_description;
    }
    if (indicator.near_miss_description && indicator.report_type === 'near_miss') {
      return indicator.near_miss_description;
    }
    if (indicator.incident_description && indicator.report_type === 'incident') {
      return indicator.incident_description;
    }
    if (indicator.description) {
      return indicator.description;
    }
    return 'No description provided';
  };

  const primaryDescription = getPrimaryDescription();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] w-full max-h-[90vh] p-0 gap-0 overflow-hidden bg-background rounded-xl">
        {/* Header Section */}
        <DialogHeader className="px-6 lg:px-8 pt-6 lg:pt-8 pb-4 lg:pb-6 border-b bg-gradient-to-r from-background via-background to-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <div className={`p-3 rounded-xl ${indicatorType.color} text-white shadow-lg flex-shrink-0`}>
                <indicatorType.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <DialogTitle className="text-xl lg:text-2xl font-bold tracking-tight break-words text-foreground">
                    {indicatorType.name} Details
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={indicator.priority} />
                    <StatusBadge status={indicator.status} />
                  </div>
                </div>
                <div className="text-sm lg:text-base text-muted-foreground break-words mt-2">
  <div className="flex flex-wrap items-center gap-2 lg:gap-4">
    <span className="inline-flex items-center gap-1.5">
      <Hash className="h-3.5 w-3.5" />
      Indicator #{indicator.id || 'N/A'}
    </span>
    <span className="hidden sm:inline">•</span>
    <span className="inline-flex items-center gap-1.5">
      <Calendar className="h-3.5 w-3.5" />
      Reported {formatDate(indicator.date_reported)}
    </span>
    {indicator.location && (
      <>
        <span className="hidden sm:inline">•</span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {indicator.location}
        </span>
      </>
    )}
  </div>
</div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <ScrollArea className="flex-1 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 h-[calc(90vh-200px)]">
          <div className="space-y-6 lg:space-y-8">
            {/* Risk Assessment Card - Top Section */}
            {(indicator.risk_level || indicator.impact_level) && (
              <div className="bg-gradient-to-br from-card to-card/80 border rounded-2xl p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-8">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                      <Activity className="h-5 w-5 text-primary" />
                      Risk Assessment Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {indicator.risk_level && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
                            <ShadcnBadge className={`${riskLevel.color} font-medium`}>
                              {riskLevel.name}
                            </ShadcnBadge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full ${riskLevel.bgColor} rounded-full`}
                                style={{ width: `${(riskLevel.score / 4) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{riskLevel.score}/4</span>
                          </div>
                        </div>
                      )}
                      {indicator.impact_level && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Impact Level</span>
                            <ShadcnBadge className={`${impactLevel.color} font-medium`}>
                              {impactLevel.name}
                            </ShadcnBadge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full ${impactLevel.bgColor} rounded-full`}
                                style={{ width: `${(impactLevel.score / 4) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{impactLevel.score}/4</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border min-w-[140px]">
                    <div className="text-3xl font-bold text-primary mb-1">{riskScore}</div>
                    <div className="text-sm font-medium text-muted-foreground">Risk Score</div>
                    <div className="text-xs text-muted-foreground mt-1">out of {maxRiskScore}</div>
                    <div className="w-full mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                      <Progress value={riskPercentage} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Basic Information
                </h3>
                <span className="text-sm text-muted-foreground">{basicInfo.length} items</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {basicInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className={`group flex flex-col p-4 rounded-xl border bg-card hover:bg-accent/30 transition-all duration-200 hover:shadow-sm ${info.isOverdue ? 'border-destructive/20 bg-destructive/5' : ''}`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${info.isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {React.createElement(info.icon, { className: "h-4 w-4" })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-muted-foreground mb-1 truncate">
                          {info.label}
                        </div>
                        <div className={`font-medium text-sm lg:text-base tracking-tight break-words ${info.isOverdue ? 'text-destructive' : 'text-foreground'}`}>
                          {info.value}
                          {info.isOverdue && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                              <AlertTriangle className="h-3 w-3" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {info.label === 'Department' && indicator.department && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <ShadcnBadge 
                          variant="outline" 
                          className="text-xs font-normal"
                        >
                          {DEPARTMENTS.find(d => d.value === indicator.department)?.label || indicator.department}
                        </ShadcnBadge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Description Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {indicatorType.shortName} Description
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('description')}
                  className="h-8 gap-1"
                >
                  {expandedSections.description ? 'Collapse' : 'Expand'}
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.description ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              <Collapsible open={expandedSections.description}>
                <div className="rounded-xl border overflow-hidden bg-card">
                  <CollapsibleContent>
                    <div className="p-5 lg:p-6">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-base lg:text-lg leading-relaxed whitespace-pre-wrap break-words text-foreground">
                          {primaryDescription}
                        </div>
                      </div>
                      {primaryDescription.length > 500 && (
                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {primaryDescription.length} characters
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(primaryDescription);
                              toast.success("Description copied to clipboard");
                            }}
                            className="h-8 gap-2"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </Button>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </div>

            {/* Additional Notes Section */}
            {indicator.description && indicator.description !== primaryDescription && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Additional Notes
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('notes')}
                    className="h-8 gap-1"
                  >
                    {expandedSections.notes ? 'Collapse' : 'Expand'}
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.notes ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
                
                <Collapsible open={expandedSections.notes}>
                  <div className="rounded-xl border overflow-hidden bg-card">
                    <CollapsibleContent>
                      <div className="p-5 lg:p-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div className="text-base leading-relaxed whitespace-pre-wrap break-words text-foreground">
                            {indicator.description}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>
            )}

            {/* Corrective Actions Section */}
            {indicator.corrective_actions && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    Corrective Actions
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('actions')}
                    className="h-8 gap-1"
                  >
                    {expandedSections.actions ? 'Collapse' : 'Expand'}
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.actions ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
                
                <Collapsible open={expandedSections.actions}>
                  <div className="rounded-xl border overflow-hidden bg-card">
                    <CollapsibleContent>
                      <div className="p-5 lg:p-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div className="text-base leading-relaxed whitespace-pre-wrap break-words text-foreground">
                            {indicator.corrective_actions}
                          </div>
                        </div>
                        {indicator.due_date && (
                          <div className={`mt-4 pt-4 border-t border-border flex items-center justify-between ${isOverdueItem ? 'text-destructive' : 'text-muted-foreground'}`}>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">Target Completion:</span>
                              <span>{formatDate(indicator.due_date)}</span>
                            </div>
                            {isOverdueItem && (
                              <ShadcnBadge variant="destructive" className="gap-1.5">
                                <AlertTriangle className="h-3 w-3" />
                                Overdue
                              </ShadcnBadge>
                            )}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>
            )}

            {/* Internal Notes Section */}
            {indicator.notes && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Internal Notes
                    <ShadcnBadge variant="outline" className="text-xs font-normal">
                      Admin Only
                    </ShadcnBadge>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('notes')}
                    className="h-8 gap-1"
                  >
                    {expandedSections.notes ? 'Collapse' : 'Expand'}
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.notes ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
                
                <Collapsible open={expandedSections.notes}>
                  <div className="rounded-xl border overflow-hidden bg-card">
                    <CollapsibleContent>
                      <div className="p-5 lg:p-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div className="text-base leading-relaxed whitespace-pre-wrap break-words text-foreground">
                            {indicator.notes}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>
            )}

            {/* System Information Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  System Information
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('system')}
                  className="h-8 gap-1"
                >
                  {expandedSections.system ? 'Collapse' : 'Expand'}
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.system ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              <Collapsible open={expandedSections.system}>
                <div className="rounded-xl border overflow-hidden bg-card">
                  <CollapsibleContent>
                    <div className="p-5 lg:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {indicator.created_at && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-md bg-primary/10">
                              <CalendarDays className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Created At</div>
                              <div className="font-medium text-sm">{formatDateTime(indicator.created_at)}</div>
                            </div>
                          </div>
                        )}
                        {indicator.updated_at && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-md bg-primary/10">
                              <RefreshCw className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Last Updated</div>
                              <div className="font-medium text-sm">{formatDateTime(indicator.updated_at)}</div>
                            </div>
                          </div>
                        )}
                        {indicator.reported_by && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                            <div className="p-2 rounded-md bg-primary/10">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Reported By (System)</div>
                              <div className="font-medium text-sm">{indicator.reported_by}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </div>
          </div>
        </ScrollArea>

        {/* Footer with Actions */}
        <DialogFooter className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 border-t bg-gradient-to-r from-background to-muted/30 gap-3 flex-col sm:flex-row">
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <LocationBadge location={indicator.location} />
              <ShadcnBadge variant="outline" className="gap-1.5">
                <File className="h-3 w-3" />
                {indicatorType.shortName}
              </ShadcnBadge>
              {indicator.risk_level && (
                <ShadcnBadge variant="outline" className={`gap-1.5 ${riskLevel.textColor}`}>
                  <Thermometer className="h-3 w-3" />
                  {riskLevel.name}
                </ShadcnBadge>
              )}
              {indicator.impact_level && (
                <ShadcnBadge variant="outline" className={`gap-1.5 ${impactLevel.textColor}`}>
                  <Square className="h-3 w-3" />
                  {impactLevel.name}
                </ShadcnBadge>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => onExport([indicator], `sheq-indicator-${indicator.id || 'unknown'}`)}
              className="gap-2 font-medium h-10 flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button 
              variant="outline"
              onClick={onClose}
              className="font-medium h-10 flex-1 sm:flex-none"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                onEdit(indicator);
                onClose();
              }}
              className="gap-2 font-medium h-10 flex-1 sm:flex-none"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Quick Stats Bar
const StatsBar = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    { label: 'Total', value: stats.total_indicators, icon: FileText, color: 'bg-blue-500' },
    { label: 'Open', value: stats.open_indicators, icon: Activity, color: 'bg-amber-500' },
    { label: 'In Progress', value: stats.in_progress_indicators, icon: RefreshCw, color: 'bg-purple-500' },
    { label: 'Overdue', value: stats.overdue, icon: Clock4, color: 'bg-red-500' },
    { label: 'Resolved', value: stats.resolved_indicators, icon: CheckCircle2, color: 'bg-green-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((item) => (
        <div key={item.label} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{item.label}</p>
              <p className="text-2xl font-bold tracking-tight">{item.value}</p>
            </div>
            <div className={`p-3 rounded-full ${item.color} bg-opacity-10`}>
              <item.icon className={`h-5 w-5 ${item.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Quick Actions Bar
const QuickActionsBar = ({ 
  onNewIndicator, 
  onRefresh, 
  onExport, 
  loading, 
  activeForm, 
  viewMode, 
  onViewModeChange,
  onClearFilters,
  filtersActive,
  onFixDatabase
}) => {
  const indicatorType = getIndicatorType(activeForm);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => onNewIndicator(activeForm)}
          className="gap-2 font-medium"
        >
          <Plus className="h-4 w-4" />
          New {indicatorType.shortName}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 font-medium">
              <Plus className="h-4 w-4" />
              Quick Indicator
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Create New Indicator</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(SHEQ_INDICATOR_TYPES).map(([key, type]) => (
              <DropdownMenuItem 
                key={key}
                onClick={() => onNewIndicator(key)}
                className="gap-2 cursor-pointer"
              >
                {React.createElement(type.icon, { className: "h-4 w-4" })}
                <span className="font-medium">{type.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center space-x-3">
          <Label htmlFor="view-mode" className="text-sm font-medium whitespace-nowrap">View:</Label>
          <Select value={viewMode} onValueChange={onViewModeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">
                <div className="flex items-center gap-2 font-medium">
                  <LayoutGrid className="h-4 w-4" />
                  Grid View
                </div>
              </SelectItem>
              <SelectItem value="list">
                <div className="flex items-center gap-2 font-medium">
                  <List className="h-4 w-4" />
                  List View
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onRefresh}
                disabled={loading}
                className="h-10 w-10"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh Data</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onExport}
                className="h-10 w-10"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export as CSV</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onFixDatabase}
                disabled={loading}
                className="h-10 w-10"
              >
                <Wrench className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fix Database Indicator Types</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {filtersActive && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onClearFilters}
                  className="h-10 w-10"
                >
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

// Main SHEQ Management Component
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
    search: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [backendOnline, setBackendOnline] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [fixingDatabase, setFixingDatabase] = useState(false);

  // Enhanced data fetching
  const fetchAllData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Test backend connectivity
      try {
        const testResponse = await fetch(API_BASE, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });
        setBackendOnline(testResponse.ok);
      } catch (testError) {
        setBackendOnline(false);
      }
      
      const [indicatorsData, statsData] = await Promise.allSettled([
        fetchSHEQIndicators(filters),
        fetchSHEQStats(),
      ]);
      
      const fetchedIndicators = indicatorsData.status === 'fulfilled' ? indicatorsData.value : [];
      
      // Log what we got
      console.log('📊 Loaded indicators:', fetchedIndicators.length);
      
      setIndicators(fetchedIndicators);
      setStats(statsData.status === 'fulfilled' ? statsData.value : null);
      
      // Fetch employees
      try {
        const employeesData = await fetchEmployeesList();
        setEmployees(employeesData);
      } catch (empError) {
        console.error('Error fetching employees:', empError);
        setEmployees(generateMockEmployees());
      }
      
    } catch (err) {
      console.error('Error in fetchAllData:', err);
      setError(`Failed to load data: ${err.message}`);
      setBackendOnline(false);
      setIndicators([]);
      setStats(null);
      setEmployees(generateMockEmployees());
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmitForm = async (formData) => {
    setFormLoading(true);
    try {
      console.log('🚀 Submitting form with report_type:', formData.report_type);
      
      let result;
      
      if (editData) {
        result = await updateSHEQIndicator(editData.id, formData);
        toast.success("SHEQ indicator updated successfully");
      } else {
        result = await createSHEQIndicator(formData);
        toast.success("SHEQ indicator created successfully");
      }
      
      await fetchAllData();
      setShowForm(false);
      setEditData(null);
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      toast.error(`Failed to ${editData ? 'update' : 'create'} SHEQ indicator: ${error.message}`);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  // CRITICAL: Function to fix database indicator types
  const handleFixDatabase = async () => {
    if (!confirm('This will analyze and fix indicator types in the database based on description fields. Continue?')) {
      return;
    }

    setFixingDatabase(true);
    try {
      console.log('🛠️ Starting database fix...');
      
      // First, analyze what we have
      const typeAnalysis = indicators.reduce((acc, indicator) => {
        const currentType = indicator.report_type || 'unknown';
        acc[currentType] = (acc[currentType] || 0) + 1;
        return acc;
      }, {});
      
      console.log('Current database state:', typeAnalysis);
      
      // Call the API endpoint to fix indicator types
      const result = await fixDatabaseIndicatorTypesAPI();
      
      toast.success(`Database fixed: ${result.message || 'Indicator types updated'}`);
      
      // Refresh data
      await fetchAllData();
      
    } catch (error) {
      console.error('❌ Error fixing database:', error);
      toast.error(`Failed to fix database: ${error.message}`);
    } finally {
      setFixingDatabase(false);
    }
  };

  // Delete handler
  const handleDeleteIndicator = async (indicatorId) => {
    if (!confirm('Are you sure you want to delete this SHEQ indicator? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteSHEQIndicator(indicatorId);
      setIndicators(prev => prev.filter(indicator => indicator.id !== indicatorId));
      toast.success("SHEQ indicator deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete SHEQ indicator: ${error.message}`);
    }
  };

  // Handle view indicator
  const handleViewIndicator = (indicator) => {
    console.log('👁️ Viewing indicator:', {
      id: indicator.id,
      report_type: indicator.report_type,
      display: getIndicatorType(indicator.report_type).name
    });
    setSelectedIndicator(indicator);
    setShowDetails(true);
  };

  // Handle edit indicator
  const handleEditIndicator = (indicator) => {
    console.log('✏️ Editing indicator:', {
      id: indicator.id,
      report_type: indicator.report_type,
      display: getIndicatorType(indicator.report_type).name
    });
    setEditData(indicator);
    setActiveForm(indicator.report_type);
    setShowForm(true);
  };

  // Handle export
  const handleExport = (data = indicators, filename = `sheq-indicators-${new Date().toISOString().split('T')[0]}`) => {
    try {
      downloadSHEQCSV(data, filename);
      toast.success("Indicators exported successfully");
    } catch (error) {
      toast.error(`Failed to export indicators: ${error.message}`);
    }
  };

  // Handle new indicator with type
  const handleNewIndicator = (type = activeForm) => {
    console.log('🆕 Creating new indicator type:', type);
    setActiveForm(type);
    setEditData(null);
    setShowForm(true);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      report_type: 'all',
      status: 'all',
      priority: 'all',
      department: 'all',
      location: 'all',
      search: ''
    });
  };

  // Check if filters are active
  const filtersActive = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => 
      key !== 'search' && value !== 'all' && value !== ''
    );
  }, [filters]);

  // Filter indicators when filters change
  useEffect(() => {
    fetchAllData();
  }, [filters]);

  // Initial data fetch
  useEffect(() => { 
    console.log('🔄 Initial data fetch...');
    fetchAllData();
  }, []);

  // Calculate enhanced stats
  const enhancedStats = useMemo(() => {
    if (!indicators.length) return null;
    
    const totalIndicators = indicators.length;
    const openIndicators = indicators.filter(r => r.status === 'open').length;
    const inProgressIndicators = indicators.filter(r => r.status === 'in_progress').length;
    const resolvedIndicators = indicators.filter(r => r.status === 'resolved' || r.status === 'closed').length;
    const overdue = indicators.filter(indicator => 
      isOverdue(indicator.due_date) && indicator.status !== 'closed' && indicator.status !== 'resolved'
    ).length;

    return {
      total_indicators: totalIndicators,
      open_indicators: openIndicators,
      in_progress_indicators: inProgressIndicators,
      resolved_indicators: resolvedIndicators,
      overdue
    };
  }, [indicators]);

  // Analyze indicator types for display
  const indicatorTypeAnalysis = useMemo(() => {
    if (!indicators.length) return {};
    
    const analysis = {
      byDatabaseValue: {},
      byDisplayName: {}
    };
    
    indicators.forEach(indicator => {
      const dbValue = indicator.report_type || 'unknown';
      const displayName = getIndicatorType(dbValue).name;
      
      analysis.byDatabaseValue[dbValue] = (analysis.byDatabaseValue[dbValue] || 0) + 1;
      analysis.byDisplayName[displayName] = (analysis.byDisplayName[displayName] || 0) + 1;
    });
    
    return analysis;
  }, [indicators]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md flex-shrink-0">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">SHEQ Indicators Management</h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 break-words">Safety, Health, Environment & Quality Performance Tracking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarFallback className="font-medium">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 md:px-6 py-6 space-y-8">
        {/* Database Status & Fix Tool */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl break-words">
              <Database className="h-5 w-5 flex-shrink-0" />
              Database Indicator Types Analysis
            </CardTitle>
            <CardDescription className="text-base break-words">
              Current state of indicator types in the database for SHEQ tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Database Values</h4>
                  <div className="space-y-2">
                    {Object.entries(indicatorTypeAnalysis.byDatabaseValue || {}).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between text-sm p-3 rounded-lg border bg-muted/30">
                        <code className="px-3 py-1 bg-muted rounded-md text-xs font-medium truncate max-w-[150px]">{type}</code>
                        <span className="font-semibold">{count} indicators</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3">Display Names</h4>
                  <div className="space-y-2">
                    {Object.entries(indicatorTypeAnalysis.byDisplayName || {}).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between text-sm p-3 rounded-lg border bg-muted/30">
                        <span className="font-medium truncate max-w-[150px]">{type}</span>
                        <span className="font-semibold">{count} indicators</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Alert variant="warning" className="mt-4">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-base font-semibold break-words">Database Issue Detected</AlertTitle>
                <AlertDescription className="mt-2">
                  {Object.keys(indicatorTypeAnalysis.byDatabaseValue || {}).length === 1 && 
                   Object.keys(indicatorTypeAnalysis.byDatabaseValue || {})[0] === 'hazard' ? (
                    <p className="text-sm break-words">All indicators are currently stored as 'hazard' in the database. Click "Fix Database" to automatically correct them based on content analysis.</p>
                  ) : (
                    <p className="text-sm break-words">Some indicators may have incorrect types. Use the fix tool below to analyze descriptions and correct indicator types.</p>
                  )}
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleFixDatabase}
                  disabled={fixingDatabase || loading}
                  variant="warning"
                  className="gap-2 font-medium"
                >
                  {fixingDatabase ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wrench className="h-4 w-4" />
                  )}
                  {fixingDatabase ? 'Fixing Database...' : 'Fix Database Indicator Types'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log('🔍 Database Analysis:', indicatorTypeAnalysis);
                    console.log('📋 Sample Indicators:', indicators.slice(0, 3).map(r => ({
                      id: r.id,
                      report_type: r.report_type,
                      display: getIndicatorType(r.report_type).name
                    })));
                  }}
                  className="font-medium"
                >
                  Debug Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backend Status */}
        {!backendOnline && (
          <Alert variant="destructive" className="border-destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-semibold break-words">Connection Issue</AlertTitle>
            <AlertDescription className="break-words">
              Unable to connect to backend server. Please ensure the backend is running at {API_BASE}
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Overview */}
        {enhancedStats && <StatsBar stats={enhancedStats} />}

        {/* Indicator Type Selection */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl break-words">Quick Indicator Creation</CardTitle>
            <CardDescription className="text-base break-words">
              Select an indicator type to track SHEQ performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(SHEQ_INDICATOR_TYPES).map(([key, indicatorType]) => {
                const Icon = indicatorType.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleNewIndicator(key)}
                    className="group relative overflow-hidden rounded-xl border bg-card p-4 lg:p-5 text-left transition-all hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <div className={`absolute inset-0 ${indicatorType.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative z-10 flex flex-col items-center gap-3 lg:gap-4">
                      <div className={`p-3 lg:p-4 rounded-xl ${indicatorType.color} text-white shadow-lg`}>
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                      </div>
                      <div className="space-y-1 lg:space-y-2 text-center">
                        <div className="font-semibold text-xs lg:text-sm tracking-tight break-words">{indicatorType.name}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed line-clamp-3 break-words">
                          {indicatorType.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <Card className="border shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold break-words">SHEQ Indicators ({indicators.length})</CardTitle>
                <CardDescription className="text-sm sm:text-base mt-2 break-words">
                  View and manage all safety, health, environment, and quality performance indicators
                </CardDescription>
              </div>
              
              <QuickActionsBar 
                onNewIndicator={handleNewIndicator}
                onRefresh={fetchAllData}
                onExport={() => handleExport()}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2 font-medium"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {showFilters ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {filtersActive && (
                    <ShadcnBadge variant="secondary" className="gap-1.5 font-medium">
                      <Filter className="h-3.5 w-3.5" />
                      Filtered
                    </ShadcnBadge>
                  )}
                </div>
                
                <div className="relative w-full sm:w-auto sm:max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search indicators by description, employee, or location..." 
                    className="pl-12 h-11 text-base"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
              </div>
              
              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-6 border rounded-xl bg-gradient-to-br from-muted/30 to-background">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Indicator Type</Label>
                    <Select 
                      value={filters.report_type} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, report_type: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium">All Indicator Types</SelectItem>
                        {Object.entries(SHEQ_INDICATOR_TYPES).map(([key, type]) => (
                          <SelectItem key={key} value={key} className="font-medium">
                            <div className="flex items-center gap-2">
                              {React.createElement(type.icon, { className: "h-4 w-4" })}
                              {type.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Status</Label>
                    <Select 
                      value={filters.status} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium">All Status</SelectItem>
                        {Object.entries(STATUS_TYPES).map(([key, status]) => (
                          <SelectItem key={key} value={key} className="font-medium">
                            <div className="flex items-center gap-2">
                              {React.createElement(status.icon, { className: "h-4 w-4" })}
                              {status.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Priority</Label>
                    <Select 
                      value={filters.priority} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="All Priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium">All Priorities</SelectItem>
                        {Object.entries(PRIORITY_LEVELS).map(([key, priority]) => (
                          <SelectItem key={key} value={key} className="font-medium">
                            <div className="flex items-center gap-2">
                              {React.createElement(priority.icon, { className: "h-4 w-4" })}
                              {priority.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Department</Label>
                    <Select 
                      value={filters.department} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium">All Departments</SelectItem>
                        {DEPARTMENTS.map(dept => (
                          <SelectItem key={dept.value} value={dept.value} className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className={`h-2.5 w-2.5 rounded-full ${dept.color}`} />
                              {dept.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Location</Label>
                    <Select 
                      value={filters.location} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium">All Locations</SelectItem>
                        {Object.keys(MINE_LOCATIONS).map(location => (
                          <SelectItem key={location} value={location} className="font-medium">
                            <div className="flex items-center gap-2">
                              {React.createElement(MINE_LOCATIONS[location].icon, { className: "h-4 w-4" })}
                              {location}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="lg:col-span-5 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={handleClearFilters}
                      className="w-full h-11 font-medium"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Indicators Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : indicators.length === 0 ? (
              <div className="text-center py-16">
                <Shield className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold mb-3 break-words">No indicators found</h3>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-base break-words">
                  {filters.search || filtersActive
                    ? 'Try adjusting your filters or search criteria to find SHEQ indicators'
                    : 'Get started by creating your first SHEQ performance indicator'}
                </p>
                <Button onClick={() => handleNewIndicator()} size="lg" className="gap-2 font-medium">
                  <Plus className="h-5 w-5" />
                  Create First Indicator
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {indicators.map((indicator) => (
                  <EnhancedSHEQIndicatorCard 
                    key={indicator.id} 
                    indicator={indicator} 
                    onView={handleViewIndicator}
                    onEdit={handleEditIndicator}
                    onDelete={handleDeleteIndicator}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {indicators.map((indicator) => {
                  const indicatorType = getIndicatorType(indicator.report_type);
                  
                  return (
                    <Card key={indicator.id} className="hover:bg-muted/30 transition-colors">
                      <CardContent className="p-4 lg:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className={`p-3 rounded-xl ${indicatorType.color} text-white shadow-md flex-shrink-0`}>
                              {React.createElement(indicatorType.icon, { 
                                className: "h-5 w-5" 
                              })}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-lg tracking-tight truncate break-words">
                                {indicatorType.name} 
                                <span className="text-muted-foreground font-normal ml-3">#{indicator.id}</span>
                              </div>
                              <div className="text-sm text-muted-foreground truncate mt-1 break-words">
                                {indicator.employee_name || 'Unknown Employee'} • {indicator.department || 'UNKNOWN'} • {formatDateTime(indicator.date_reported)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="hidden lg:flex items-center gap-3">
                              <PriorityBadge priority={indicator.priority} />
                              <StatusBadge status={indicator.status} />
                              <LocationBadge location={indicator.location} />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewIndicator(indicator)}
                                className="h-9 w-9"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuItem onClick={() => handleViewIndicator(indicator)} className="gap-2 font-medium cursor-pointer">
                                    <Eye className="h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditIndicator(indicator)} className="gap-2 font-medium cursor-pointer">
                                    <Edit className="h-4 w-4" />
                                    Edit Indicator
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteIndicator(indicator.id)}
                                    className="gap-2 text-destructive font-medium cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Indicator
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        {/* Show description based on indicator type */}
                        <div className="mt-4 text-sm text-muted-foreground line-clamp-2 font-sans leading-relaxed break-words">
                          {indicator.hazard_description && indicator.report_type === 'hazard' && indicator.hazard_description}
                          {indicator.near_miss_description && indicator.report_type === 'near_miss' && indicator.near_miss_description}
                          {indicator.incident_description && indicator.report_type === 'incident' && indicator.incident_description}
                          {indicator.description && indicator.description}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="text-sm text-muted-foreground font-medium">
              Showing {indicators.length} of {indicators.length} indicators
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="font-medium">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                1
              </Button>
              <Button variant="outline" size="sm" disabled className="font-medium">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Enhanced Form Modal */}
      <EnhancedSHEQForm 
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditData(null);
        }}
        onSubmit={handleSubmitForm}
        initialData={editData}
        formType={editData?.report_type || activeForm}
        employees={employees}
        loading={formLoading}
      />

      {/* Enhanced Indicator Details Modal - POLISHED VERSION */}
      <EnhancedIndicatorDetails 
        indicator={selectedIndicator}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onEdit={handleEditIndicator}
        onExport={handleExport}
      />
    </div>
  );
}