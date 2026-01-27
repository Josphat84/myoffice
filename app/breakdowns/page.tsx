// app/breakdowns/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  AlertCircle, CheckCircle, Clock, Download, Edit, Filter, 
  Loader2, Plus, RefreshCw, Search, Trash2, 
  TrendingUp, Wrench, X, Calendar, Eye, BarChart3,
  AlertTriangle, Users, CalendarDays, FileSpreadsheet, Activity,
  Grid, List, Package, Timer, MapPin, Building, Zap, Building2,
  ChevronDown, ChevronUp, DollarSign, Target, User, Clock4,
  FileText, Printer, Share2, ArrowUpRight, MoreVertical,
  PieChart, LineChart, Database, Layers, TimerOff, TimerReset,
  Watch, BarChart2, Gauge, Rocket, Shield, ToolCase,
  Smartphone, BarChart, CheckSquare, Crosshair, TrendingDown,
  FileDown, Upload, Settings, Star, ThumbsUp, DownloadCloud,
  ExternalLink, Award, Briefcase, Flag, Flame, FolderOpen,
  Heart, Home, Key, Link, Mail, Navigation, Paperclip,
  Phone, Power, Save, Scan, Send, Server, ShieldCheck,
  ShoppingCart, StarHalf, Tag, Terminal, Ticket, Trophy,
  Truck, Umbrella, Video, Volume, Wallet, Wind, ZapOff,
  Lightbulb, Target as TargetIcon, AlertOctagon,
  Grid3x3, Columns, TrendingUp as TrendingUpIcon, Download as DownloadIcon,
  Filter as FilterIcon, MoreHorizontal, ChevronRight, ChevronLeft,
  PlayCircle, PauseCircle, CheckCheck, Clock as ClockIcon,
  Calendar as CalendarIcon, Building as BuildingIcon, User as UserIcon,
  BarChart as BarChartIcon, PieChart as PieChartIcon,
  FileType, FileText as FileTextIcon, Download as DownloadIcon2,
  TrendingUp as TrendingUpIcon2, TrendingDown as TrendingDownIcon,
  Thermometer, Gauge as GaugeIcon, Target as TargetIcon2,
  LineChart as LineChartIcon, PieChart as PieChartIcon2,
  BarChart as BarChartIcon2, ChartBar as ChartBarIcon,
  Activity as ActivityIcon, AlertOctagon as AlertOctagonIcon,
  ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon,
  Circle, Square, Triangle, Hexagon, Octagon,
  Tag as TagIcon, Hash, Info, ExternalLink as ExternalLinkIcon,
  Maximize2, Minimize2, Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon3, TrendingDown as TrendingDownIcon2
} from 'lucide-react';

// API Configuration
const getApiBase = (): string => {
  const endpoints = [
    process.env.NEXT_PUBLIC_API_URL,
    'http://localhost:8000',
    'http://127.0.0.1:8000',
  ];
  
  for (const endpoint of endpoints) {
    if (endpoint && endpoint.trim() !== '') {
      return endpoint;
    }
  }
  
  return 'http://localhost:8000';
};

const API_BASE = getApiBase();
const BREAKDOWN_API = `${API_BASE}/api/breakdowns`;

// Utility function to test if backend is available
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BREAKDOWN_API}/health/check`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      mode: 'cors',
      signal: AbortSignal.timeout(3000)
    });
    
    return response.ok;
  } catch {
    return false;
  }
};

// Type Definitions
interface StatusType {
  name: string;
  color: string;
  icon: any;
  gradient: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
}

interface PriorityType {
  name: string;
  color: string;
  icon: any;
  gradient: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
}

interface BreakdownType {
  name: string;
  color: string;
  icon: any;
  gradient: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
}

interface SparePart {
  name: string;
  quantity: number;
  part_number?: string;
  unit_price: number;
  total_cost: number;
}

interface Breakdown {
  id?: string;
  breakdown_uid?: string;
  machine_id: string;
  machine_name: string;
  machine_description?: string;
  artisan_name: string;
  department: string;
  location: string;
  breakdown_date: string;
  breakdown_type: string;
  work_done?: string;
  artisan_recommendations?: string;
  status: string;
  priority: string;
  breakdown_start?: string;
  breakdown_end?: string;
  work_start?: string;
  work_end?: string;
  response_time_minutes?: number;
  repair_time_minutes?: number;
  downtime_minutes?: number;
  net_downtime_minutes?: number;
  total_spare_cost?: number;
  created_at?: string;
  updated_at?: string;
  breakdown_description?: string;
  spares_used?: SparePart[] | string;
}

interface BreakdownFormData {
  machine_id: string;
  machine_name: string;
  breakdown_description: string;
  machine_description?: string;
  artisan_name: string;
  breakdown_date: string;
  location: string;
  department: string;
  breakdown_type: string;
  work_done: string;
  artisan_recommendations: string;
  status: string;
  priority: string;
  breakdown_start: string;
  breakdown_end: string;
  work_start: string;
  work_end: string;
  spares_used: SparePart[];
}

interface Filters {
  status: string;
  breakdown_type: string;
  priority: string;
  department: string;
  location: string;
}

interface Metrics {
  total_breakdowns: number;
  active_breakdowns: number;
  avg_resolution_hours: number;
  total_cost: number;
  trend_total: number;
  critical_priority: number;
  week_breakdowns: number;
  open_breakdowns: number;
  total_downtime_hours: number;
  avg_downtime_hours: number;
  efficiency_score: number;
  resolved_this_week: number;
}

interface TimeDisplay {
  minutes: number;
  hours: number;
  display: string;
  decimal: number;
}

interface ChartDataItem {
  label: string;
  value: number;
  color?: string;
}

// Enhanced Configuration constants
const STATUS_TYPES: Record<string, StatusType> = {
  logged: { 
    name: 'Logged', 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    icon: ClockIcon,
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500'
  },
  in_progress: { 
    name: 'In Progress', 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    icon: PlayCircle,
    gradient: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-500'
  },
  resolved: { 
    name: 'Resolved', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    icon: CheckCheck,
    gradient: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    iconColor: 'text-emerald-500'
  },
  closed: { 
    name: 'Closed', 
    color: 'bg-slate-50 text-slate-700 border-slate-200', 
    icon: CheckCircle,
    gradient: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-500',
    textColor: 'text-slate-700',
    iconColor: 'text-slate-500'
  },
  cancelled: { 
    name: 'Cancelled', 
    color: 'bg-rose-50 text-rose-700 border-rose-200', 
    icon: X,
    gradient: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-500',
    textColor: 'text-rose-700',
    iconColor: 'text-rose-500'
  }
};

const PRIORITY_TYPES: Record<string, PriorityType> = {
  critical: { 
    name: 'Critical', 
    color: 'bg-rose-50 text-rose-700 border-rose-200', 
    icon: AlertCircle,
    gradient: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-500',
    textColor: 'text-rose-700',
    iconColor: 'text-rose-500'
  },
  high: { 
    name: 'High', 
    color: 'bg-orange-50 text-orange-700 border-orange-200', 
    icon: AlertTriangle,
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-700',
    iconColor: 'text-orange-500'
  },
  medium: { 
    name: 'Medium', 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    icon: Clock,
    gradient: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-500'
  },
  low: { 
    name: 'Low', 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    icon: Clock4,
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500'
  }
};

const BREAKDOWN_TYPES: Record<string, BreakdownType> = {
  mechanical: { 
    name: 'Mechanical', 
    color: 'bg-slate-50 text-slate-700 border-slate-200', 
    icon: Wrench,
    gradient: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-500',
    textColor: 'text-slate-700',
    iconColor: 'text-slate-500'
  },
  electrical: { 
    name: 'Electrical', 
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
    icon: Zap,
    gradient: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    iconColor: 'text-yellow-500'
  },
  hydraulic: { 
    name: 'Hydraulic', 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    icon: Activity,
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500'
  },
  pneumatic: { 
    name: 'Pneumatic', 
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200', 
    icon: Wind,
    gradient: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500',
    textColor: 'text-indigo-700',
    iconColor: 'text-indigo-500'
  },
  electronic: { 
    name: 'Electronic', 
    color: 'bg-purple-50 text-purple-700 border-purple-200', 
    icon: Shield,
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-700',
    iconColor: 'text-purple-500'
  },
  other: { 
    name: 'Other', 
    color: 'bg-gray-50 text-gray-700 border-gray-200', 
    icon: ToolCase,
    gradient: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-500',
    textColor: 'text-gray-700',
    iconColor: 'text-gray-500'
  }
};

const DEPARTMENTS: string[] = ['Maintenance', 'Production', 'Engineering', 'Quality', 'Safety', 'Operations'];
const LOCATIONS: string[] = [
  'Production Line A', 'Production Line B', 'Warehouse', 'Workshop', 
  'Boiler Room', 'Compressor Room', 'Electrical Room', 'Yard',
  'Main Plant', 'Storage Area', 'Loading Bay', 'Office Complex'
];

// Helper Functions
const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  } catch {
    return 0;
  }
};

const minutesToDisplay = (minutes: number): TimeDisplay => {
  if (!minutes && minutes !== 0) return { minutes: 0, hours: 0, display: '0m', decimal: 0.0 };
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const decimal = parseFloat((minutes / 60).toFixed(2));
  
  let display = '';
  if (hours > 0) {
    display = `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
  } else {
    display = `${mins}m`;
  }
  
  return {
    minutes,
    hours,
    display,
    decimal
  };
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateString: string | null | undefined, timeString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  if (timeString) {
    return `${formattedDate} ${timeString}`;
  }
  
  return formattedDate;
};

// Enhanced function to calculate downtime from start and end times
const calculateDowntime = (breakdownStart: string | undefined, breakdownEnd: string | undefined, workStart: string | undefined, workEnd: string | undefined): number => {
  if (!breakdownStart || !breakdownEnd) return 0;
  
  try {
    const startTime = timeToMinutes(breakdownStart);
    const endTime = timeToMinutes(breakdownEnd);
    
    // If end time is before start time (overnight), add 24 hours
    const downtime = endTime >= startTime ? endTime - startTime : (endTime + 1440) - startTime;
    return Math.max(0, downtime);
  } catch {
    return 0;
  }
};

// Enhanced function to calculate time difference between two times
const calculateTimeDifference = (startTime: string | undefined, endTime: string | undefined): number => {
  if (!startTime || !endTime) return 0;
  
  try {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    
    // Handle overnight (end time earlier than start time)
    return end >= start ? end - start : (end + 1440) - start;
  } catch {
    return 0;
  }
};

// Calculate total downtime for all breakdowns
const calculateTotalDowntime = (breakdowns: Breakdown[]): number => {
  if (!breakdowns || !Array.isArray(breakdowns)) return 0;
  
  return breakdowns.reduce((total, breakdown) => {
    const downtime = calculateDowntime(
      breakdown.breakdown_start,
      breakdown.breakdown_end,
      breakdown.work_start,
      breakdown.work_end
    );
    return total + downtime;
  }, 0);
};

// API Functions - FIXED for UUID
const fetchBreakdowns = async (filters: Record<string, string> = {}): Promise<Breakdown[]> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.append(key, String(value));
      }
    });

    const url = `${BREAKDOWN_API}/get-breakdowns?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      // Return empty array if fetch fails
      return [];
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching breakdowns:', error);
    // Return empty array on error
    return [];
  }
};

// Function to calculate metrics from breakdowns data
const calculateMetricsFromBreakdowns = (breakdowns: Breakdown[]): Metrics => {
  if (!breakdowns || !Array.isArray(breakdowns)) {
    return {
      total_breakdowns: 0,
      active_breakdowns: 0,
      avg_resolution_hours: 0,
      total_cost: 0,
      trend_total: 0,
      critical_priority: 0,
      week_breakdowns: 0,
      open_breakdowns: 0,
      total_downtime_hours: 0,
      avg_downtime_hours: 0,
      efficiency_score: 0,
      resolved_this_week: 0
    };
  }

  const total_breakdowns = breakdowns.length;
  
  // Calculate active breakdowns (logged or in_progress)
  const active_breakdowns = breakdowns.filter(b => 
    b.status === 'logged' || b.status === 'in_progress'
  ).length;
  
  // Calculate critical priority breakdowns
  const critical_priority = breakdowns.filter(b => 
    b.priority === 'critical'
  ).length;
  
  // Calculate total cost from spares
  const total_cost = breakdowns.reduce((total, b) => {
    if (b.spares_used && Array.isArray(b.spares_used)) {
      const spareCost = (b.spares_used as SparePart[]).reduce((sum: number, spare: SparePart) => {
        return sum + (parseFloat(spare.total_cost.toString()) || 0);
      }, 0);
      return total + spareCost;
    }
    return total;
  }, 0);
  
  // Calculate downtime metrics
  const total_downtime_minutes = calculateTotalDowntime(breakdowns);
  const total_downtime_hours = total_downtime_minutes / 60;
  
  // Calculate average resolution time from breakdown start to end
  const resolvedBreakdowns = breakdowns.filter(b => 
    b.status === 'resolved' || b.status === 'closed'
  );
  
  let avg_resolution_hours = 0;
  let avg_downtime_hours = 0;
  
  if (resolvedBreakdowns.length > 0) {
    const resolvedDowntime = calculateTotalDowntime(resolvedBreakdowns);
    avg_resolution_hours = parseFloat((resolvedDowntime / 60 / resolvedBreakdowns.length).toFixed(1));
    avg_downtime_hours = parseFloat((total_downtime_hours / breakdowns.length).toFixed(1));
  }
  
  // Calculate trends (this week vs last week)
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  
  const thisWeekBreakdowns = breakdowns.filter(b => {
    if (!b.breakdown_date) return false;
    const breakdownDate = new Date(b.breakdown_date);
    return breakdownDate >= oneWeekAgo && breakdownDate <= today;
  });
  
  const resolved_this_week = thisWeekBreakdowns.filter(b => 
    b.status === 'resolved' || b.status === 'closed'
  ).length;
  
  const lastWeekBreakdowns = breakdowns.filter(b => {
    if (!b.breakdown_date) return false;
    const twoWeeksAgo = new Date(oneWeekAgo);
    twoWeeksAgo.setDate(oneWeekAgo.getDate() - 7);
    const breakdownDate = new Date(b.breakdown_date);
    return breakdownDate >= twoWeeksAgo && breakdownDate < oneWeekAgo;
  }).length;
  
  const trend_total = lastWeekBreakdowns > 0 ? 
    Math.round(((thisWeekBreakdowns.length - lastWeekBreakdowns) / lastWeekBreakdowns) * 100) : 0;

  // Calculate efficiency score (higher is better)
  const efficiency_score = resolvedBreakdowns.length > 0 ? 
    Math.min(100, Math.round((100 - (avg_resolution_hours / 24 * 10)))) : 100;

  return {
    total_breakdowns,
    active_breakdowns,
    critical_priority,
    total_cost,
    avg_resolution_hours,
    trend_total,
    week_breakdowns: thisWeekBreakdowns.length,
    open_breakdowns: active_breakdowns,
    total_downtime_hours: parseFloat(total_downtime_hours.toFixed(1)),
    avg_downtime_hours: parseFloat(avg_downtime_hours.toFixed(1)),
    efficiency_score,
    resolved_this_week
  };
};

// FIXED: Use correct endpoint for UUID
const createBreakdown = async (breakdownData: BreakdownFormData): Promise<any> => {
  try {
    const cleanData = { 
      machine_id: breakdownData.machine_id || '',
      machine_name: breakdownData.machine_name || '',
      breakdown_description: breakdownData.breakdown_description || '',
      machine_description: breakdownData.breakdown_description || '',
      artisan_name: breakdownData.artisan_name || '',
      breakdown_date: breakdownData.breakdown_date || new Date().toISOString().split('T')[0],
      location: breakdownData.location || '',
      department: breakdownData.department || '',
      breakdown_type: breakdownData.breakdown_type || 'mechanical',
      work_done: breakdownData.work_done || '',
      artisan_recommendations: breakdownData.artisan_recommendations || '',
      status: breakdownData.status || 'logged',
      priority: breakdownData.priority || 'medium',
      breakdown_start: breakdownData.breakdown_start || '',
      breakdown_end: breakdownData.breakdown_end || '',
      work_start: breakdownData.work_start || '',
      work_end: breakdownData.work_end || '',
      spares_used: breakdownData.spares_used || []
    };
    
    // breakdown_date is already a string from form, no conversion needed
    
    if (!Array.isArray(cleanData.spares_used)) {
      try {
        if (typeof cleanData.spares_used === 'string') {
          cleanData.spares_used = JSON.parse(cleanData.spares_used);
        } else {
          cleanData.spares_used = [];
        }
      } catch (e) {
        cleanData.spares_used = [];
      }
    }
    
    cleanData.spares_used = cleanData.spares_used.map((spare: any) => ({
      name: spare.name || '',
      quantity: spare.quantity || 1,
      part_number: spare.part_number || '',
      unit_price: spare.unit_price || 0,
      total_cost: (spare.quantity || 1) * (spare.unit_price || 0)
    }));
    
    const response = await fetch(`${BREAKDOWN_API}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating breakdown:', error);
    throw error;
  }
};

// FIXED: Use correct endpoint for UUID - Use breakdown_uid instead of id
const updateBreakdown = async (breakdownId: string, breakdownData: BreakdownFormData): Promise<any> => {
  try {
    const cleanData = { 
      machine_id: breakdownData.machine_id || '',
      machine_name: breakdownData.machine_name || '',
      breakdown_description: breakdownData.breakdown_description || '',
      machine_description: breakdownData.breakdown_description || '',
      artisan_name: breakdownData.artisan_name || '',
      breakdown_date: breakdownData.breakdown_date || '',
      location: breakdownData.location || '',
      department: breakdownData.department || '',
      breakdown_type: breakdownData.breakdown_type || 'mechanical',
      work_done: breakdownData.work_done || '',
      artisan_recommendations: breakdownData.artisan_recommendations || '',
      status: breakdownData.status || 'logged',
      priority: breakdownData.priority || 'medium',
      breakdown_start: breakdownData.breakdown_start || '',
      breakdown_end: breakdownData.breakdown_end || '',
      work_start: breakdownData.work_start || '',
      work_end: breakdownData.work_end || '',
      spares_used: breakdownData.spares_used || []
    };
    
    if (
      cleanData.breakdown_date &&
      typeof cleanData.breakdown_date === 'object' &&
      cleanData.breakdown_date !== null &&
      (cleanData.breakdown_date as Object) instanceof Date
    ) {
      cleanData.breakdown_date = (cleanData.breakdown_date as Date).toISOString().split('T')[0];
    }
    
    if (!Array.isArray(cleanData.spares_used)) {
      try {
        if (typeof cleanData.spares_used === 'string') {
          cleanData.spares_used = JSON.parse(cleanData.spares_used);
        } else {
          cleanData.spares_used = [];
        }
      } catch (e) {
        cleanData.spares_used = [];
      }
    }
    
    cleanData.spares_used = cleanData.spares_used.map((spare: any) => ({
      name: spare.name || '',
      quantity: spare.quantity || 1,
      part_number: spare.part_number || '',
      unit_price: spare.unit_price || 0,
      total_cost: (spare.quantity || 1) * (spare.unit_price || 0)
    }));
    
    // Use breakdown_uid for UUID endpoints
    const response = await fetch(`${BREAKDOWN_API}/breakdown_uid/${breakdownId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update breakdown');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating breakdown:', error);
    throw error;
  }
};

// FIXED: Use correct endpoint for UUID
const deleteBreakdown = async (breakdownId: string): Promise<any> => {
  try {
    const response = await fetch(`${BREAKDOWN_API}/breakdown_uid/${breakdownId}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete breakdown');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting breakdown:', error);
    throw error;
  }
};

// Shadcn-inspired Typography Components
const Typography = {
  H1: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h1 className={`text-3xl font-bold tracking-tight text-gray-900 ${className}`}>
      {children}
    </h1>
  ),
  H2: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`text-2xl font-semibold tracking-tight text-gray-900 ${className}`}>
      {children}
    </h2>
  ),
  H3: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h3 className={`text-xl font-semibold tracking-tight text-gray-900 ${className}`}>
      {children}
    </h3>
  ),
  H4: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h4 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h4>
  ),
  H5: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h5 className={`text-base font-semibold text-gray-900 ${className}`}>
      {children}
    </h5>
  ),
  H6: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h6 className={`text-sm font-semibold text-gray-900 ${className}`}>
      {children}
    </h6>
  ),
  Lead: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <p className={`text-lg text-gray-600 ${className}`}>
      {children}
    </p>
  ),
  P: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <p className={`text-sm text-gray-700 leading-relaxed ${className}`}>
      {children}
    </p>
  ),
  Small: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <p className={`text-xs text-gray-500 ${className}`}>
      {children}
    </p>
  ),
  Muted: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <p className={`text-xs text-gray-400 ${className}`}>
      {children}
    </p>
  ),
  Blockquote: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <blockquote className={`border-l-2 border-gray-200 pl-3 italic text-gray-600 ${className}`}>
      {children}
    </blockquote>
  )
};

// Enhanced Badge Components with shadcn styling
const StatusBadge = ({ status, size = 'sm' }: { status: string; size?: 'xs' | 'sm' }) => {
  const statusConfig = STATUS_TYPES[status] || STATUS_TYPES.logged;
  const Icon = statusConfig.icon;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  
  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-md font-medium border ${statusConfig.color} transition-all`}>
      <Icon className="h-3 w-3" />
      <span className="font-semibold">{statusConfig.name}</span>
    </span>
  );
};

const PriorityBadge = ({ priority, size = 'sm' }: { priority: string; size?: 'xs' | 'sm' }) => {
  const priorityConfig = PRIORITY_TYPES[priority] || PRIORITY_TYPES.medium;
  const Icon = priorityConfig.icon;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  
  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-md font-medium border ${priorityConfig.color} transition-all`}>
      <Icon className="h-3 w-3" />
      <span className="font-semibold">{priorityConfig.name}</span>
    </span>
  );
};

const TypeBadge = ({ type, size = 'sm' }: { type: string; size?: 'xs' | 'sm' }) => {
  const typeConfig = BREAKDOWN_TYPES[type] || BREAKDOWN_TYPES.other;
  const Icon = typeConfig.icon;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  
  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-md font-medium border ${typeConfig.color} transition-all`}>
      <Icon className="h-3 w-3" />
      <span className="font-semibold">{typeConfig.name}</span>
    </span>
  );
};

// Enhanced Metric Card Component with shadcn styling
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  description, 
  loading, 
  trend, 
  change 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string; 
  description?: string; 
  loading?: boolean; 
  trend?: number; 
  change?: number;
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-8 w-8 bg-gray-200 rounded-lg mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const colorConfig = {
    blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600' },
    emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600' },
    rose: { bg: 'bg-rose-500', light: 'bg-rose-100', text: 'text-rose-600' }
  }[color] || { bg: 'bg-gray-500', light: 'bg-gray-100', text: 'text-gray-600' };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all hover:border-blue-300">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorConfig.bg} text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <div className={`px-2 py-1 rounded text-xs font-medium ${colorConfig.light} ${colorConfig.text}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
        {description && (
          <Typography.Small className="mt-2">{description}</Typography.Small>
        )}
        {change !== undefined && (
          <div className={`mt-2 text-xs flex items-center gap-1 ${change > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {change > 0 ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
            <span>{Math.abs(change)}% from last week</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Dashboard Metrics Component
const DashboardMetrics = ({ breakdowns, loading }: { breakdowns: Breakdown[]; loading: boolean }) => {
  const metrics = useMemo(() => {
    if (!breakdowns || !Array.isArray(breakdowns)) {
      return {
        total_breakdowns: 0,
        active_breakdowns: 0,
        avg_resolution_hours: 0,
        total_cost: 0,
        trend_total: 0,
        total_downtime_hours: 0,
        avg_downtime_hours: 0,
        efficiency_score: 0,
        resolved_this_week: 0
      };
    }
    
    return calculateMetricsFromBreakdowns(breakdowns);
  }, [breakdowns]);

  // Calculate week-over-week changes
  const weekChanges = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const twoWeeksAgo = new Date(oneWeekAgo);
    twoWeeksAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeek = breakdowns?.filter(b => {
      if (!b.breakdown_date) return false;
      const date = new Date(b.breakdown_date);
      return date >= oneWeekAgo && date <= today;
    }).length || 0;
    
    const lastWeek = breakdowns?.filter(b => {
      if (!b.breakdown_date) return false;
      const date = new Date(b.breakdown_date);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length || 0;
    
    return {
      breakdowns_change: lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0,
      thisWeek,
      lastWeek
    };
  }, [breakdowns]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Breakdowns"
        value={metrics.total_breakdowns || 0}
        icon={AlertTriangle}
        color="blue"
        description="All recorded breakdowns"
        loading={loading}
        trend={weekChanges.breakdowns_change}
        change={weekChanges.breakdowns_change}
      />
      <MetricCard
        title="Active Issues"
        value={metrics.active_breakdowns || 0}
        icon={Clock}
        color="amber"
        description="Requiring attention"
        loading={loading}
      />
      <MetricCard
        title="Avg. Resolution"
        value={metrics.avg_resolution_hours ? `${metrics.avg_resolution_hours}h` : '0h'}
        icon={Timer}
        color="emerald"
        description="Mean time to repair"
        loading={loading}
      />
      <MetricCard
        title="Total Downtime"
        value={metrics.total_downtime_hours ? `${metrics.total_downtime_hours}h` : '0h'}
        icon={TimerOff}
        color="purple"
        description="Total equipment downtime"
        loading={loading}
      />
    </div>
  );
};

// Date Range Picker Component
const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onApply, 
  loading 
}: { 
  startDate: string; 
  endDate: string; 
  onStartDateChange: (date: string) => void; 
  onEndDateChange: (date: string) => void; 
  onApply?: () => void; 
  loading: boolean;
}) => {
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setTempStartDate(start.toISOString().split('T')[0]);
    setTempEndDate(end.toISOString().split('T')[0]);
  };

  const handleApply = () => {
    onStartDateChange(tempStartDate);
    onEndDateChange(tempEndDate);
    if (onApply) onApply();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <Typography.H5 className="text-gray-900 mb-3">Date Range</Typography.H5>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={tempStartDate}
            onChange={(e) => setTempStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={tempEndDate}
            onChange={(e) => setTempEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="mb-4">
        <Typography.Small className="text-gray-600 mb-2 block">Quick Select</Typography.Small>
        <div className="flex flex-wrap gap-2">
          {[7, 30, 90, 365].map((days) => (
            <button
              key={days}
              onClick={() => handleQuickSelect(days)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Last {days} days
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleApply}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
      >
        {loading ? 'Applying...' : 'Apply Date Range'}
      </button>
    </div>
  );
};

// Enhanced Filter Bar Component with Date Range
const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onRefresh, 
  loading, 
  searchTerm, 
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  showDateRange,
  onToggleDateRange 
}: { 
  filters: Filters; 
  onFilterChange: (name: string, value: string) => void; 
  onRefresh: () => void; 
  loading: boolean; 
  searchTerm: string; 
  onSearchChange: (value: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  showDateRange: boolean;
  onToggleDateRange: () => void;
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="space-y-1">
          <Typography.H4 className="text-gray-900">Breakdown Records</Typography.H4>
          <Typography.Muted>Monitor and manage equipment breakdowns</Typography.Muted>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-48 text-sm"
            />
          </div>
          
          <button
            onClick={() => onToggleDateRange()}
            className={`px-3 py-2 border ${showDateRange ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-700'} rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Date Range
          </button>
          
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm"
          >
            <FilterIcon className="h-3.5 w-3.5" />
            Filters
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1.5 font-medium text-sm"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </button>
        </div>
      </div>
      
      {/* Date Range Picker */}
      {showDateRange && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            loading={loading}
          />
        </div>
      )}
      
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[
              { label: 'Status', name: 'status', options: STATUS_TYPES },
              { label: 'Type', name: 'breakdown_type', options: BREAKDOWN_TYPES },
              { label: 'Priority', name: 'priority', options: PRIORITY_TYPES },
              { label: 'Department', name: 'department', options: DEPARTMENTS },
              { label: 'Location', name: 'location', options: LOCATIONS }
            ].map(({ label, name, options }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <select
                  value={filters[name as keyof Filters]}
                  onChange={(e) => onFilterChange(name, e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All {label}</option>
                  {Array.isArray(options) 
                    ? options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))
                    : Object.entries(options).map(([key, config]) => (
                        <option key={key} value={key}>{config.name}</option>
                      ))
                  }
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Breakdown Card Component (Grid View)
const BreakdownCard = ({ 
  breakdown, 
  onView, 
  onEdit, 
  onDelete 
}: { 
  breakdown: Breakdown; 
  onView: (breakdown: Breakdown) => void; 
  onEdit: (breakdown: Breakdown) => void; 
  onDelete: (breakdown: Breakdown) => void;
}) => {
  // Calculate downtime from start and end times
  const downtime = minutesToDisplay(
    calculateDowntime(breakdown.breakdown_start, breakdown.breakdown_end, breakdown.work_start, breakdown.work_end)
  );
  
  const totalSparesCost = (breakdown.spares_used && Array.isArray(breakdown.spares_used)) 
    ? breakdown.spares_used.reduce((total: number, spare: any) => {
        return total + (parseFloat(spare.total_cost?.toString() || '0') || 0);
      }, 0) 
    : 0;
  
  const statusConfig = STATUS_TYPES[breakdown.status] || STATUS_TYPES.logged;
  const priorityConfig = PRIORITY_TYPES[breakdown.priority] || PRIORITY_TYPES.medium;
  const typeConfig = BREAKDOWN_TYPES[breakdown.breakdown_type] || BREAKDOWN_TYPES.other;
  
  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
      {/* Header with status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gray-50 rounded border border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
            <typeConfig.icon className={`h-4 w-4 ${typeConfig.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <Typography.H5 className="text-gray-900 truncate mb-0.5">{breakdown.machine_name}</Typography.H5>
            <Typography.Small className="text-gray-500">ID: {breakdown.machine_id}</Typography.Small>
          </div>
        </div>
        <StatusBadge status={breakdown.status} size="xs" />
      </div>
      
      {/* Description Preview */}
      <div className="mb-3">
        <Typography.P className="text-gray-700 text-sm line-clamp-2 leading-snug">
          {breakdown.breakdown_description || 'No description available'}
        </Typography.P>
      </div>

      {/* Critical Information */}
      <div className="space-y-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={breakdown.priority} size="xs" />
          <TypeBadge type={breakdown.breakdown_type} size="xs" />
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600">
            <BuildingIcon className="h-3 w-3" />
            <span className="truncate">{breakdown.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <UserIcon className="h-3 w-3" />
            <span className="truncate">{breakdown.artisan_name || 'Unassigned'}</span>
          </div>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 rounded p-2 text-center">
          <div className="text-sm font-semibold text-gray-900">{downtime.display}</div>
          <div className="text-xs text-gray-500">Downtime</div>
        </div>
        <div className="bg-gray-50 rounded p-2 text-center">
          <div className="text-sm font-semibold text-gray-900">${totalSparesCost.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Cost</div>
        </div>
      </div>
      
      {/* Footer with date and actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <CalendarIcon className="h-3 w-3" />
          <span>{formatDate(breakdown.breakdown_date)}</span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(breakdown)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View details"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onEdit(breakdown)}
            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
            title="Edit"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(breakdown)}
            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Breakdown Table Component (List View)
const BreakdownTable = ({ 
  breakdowns, 
  onView, 
  onEdit, 
  onDelete, 
  sortField, 
  sortDirection, 
  onSort 
}: { 
  breakdowns: Breakdown[]; 
  onView: (breakdown: Breakdown) => void; 
  onEdit: (breakdown: Breakdown) => void; 
  onDelete: (breakdown: Breakdown) => void; 
  sortField: string; 
  sortDirection: string; 
  onSort: (field: string) => void;
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(breakdowns.map(b => (b.id || b.breakdown_uid) as string)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const SortableHeader = ({ 
    field, 
    label, 
    currentSort, 
    currentDirection, 
    onSort 
  }: { 
    field: string; 
    label: string; 
    currentSort: string; 
    currentDirection: string; 
    onSort: (field: string) => void;
  }) => {
    const isActive = currentSort === field;
    return (
      <th
        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center justify-between">
          <span>{label}</span>
          <div className="flex flex-col ml-1">
            <ChevronUp 
              className={`h-3 w-3 -mb-1 ${isActive && currentDirection === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} 
            />
            <ChevronDown 
              className={`h-3 w-3 ${isActive && currentDirection === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} 
            />
          </div>
        </div>
      </th>
    );
  };

  if (!breakdowns.length) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <Typography.H3 className="text-gray-500 mb-2">No breakdowns found</Typography.H3>
        <Typography.Muted>Try adjusting your filters or create a new breakdown</Typography.Muted>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-blue-700">
              {selectedRows.size} selected
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-sm rounded hover:bg-blue-50">
                Export Selected
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Bulk Update
              </button>
            </div>
          </div>
          <button 
            onClick={() => setSelectedRows(new Set())}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedRows.size === breakdowns.length && breakdowns.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <SortableHeader
                field="machine_name"
                label="Machine"
                currentSort={sortField}
                currentDirection={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                field="breakdown_date"
                label="Date"
                currentSort={sortField}
                currentDirection={sortDirection}
                onSort={onSort}
              />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Downtime
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {breakdowns.map((breakdown) => {
              const downtime = minutesToDisplay(
                calculateDowntime(breakdown.breakdown_start, breakdown.breakdown_end, breakdown.work_start, breakdown.work_end)
              );
              
              const totalSparesCost = (breakdown.spares_used && Array.isArray(breakdown.spares_used)) 
                ? breakdown.spares_used.reduce((total: number, spare: any) => {
                    return total + (parseFloat(spare.total_cost?.toString() || '0') || 0);
                  }, 0) 
                : 0;

              const breakdownId = (breakdown.id || breakdown.breakdown_uid) as string;

              return (
                <tr key={breakdownId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(breakdownId)}
                      onChange={(e) => handleSelectRow(breakdownId, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {breakdown.machine_name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {breakdown.machine_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{formatDate(breakdown.breakdown_date)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={breakdown.status} size="xs" />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={breakdown.priority} size="xs" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{downtime.display}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      ${totalSparesCost.toFixed(0)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onView(breakdown)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(breakdown)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(breakdown)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Enhanced Pie Chart Component
const PieChartComponent = ({ 
  title, 
  data, 
  loading, 
  colors 
}: { 
  title: string; 
  data: ChartDataItem[]; 
  loading: boolean; 
  colors: string[];
}) => {
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Typography.H4 className="text-gray-900 mb-4">{title}</Typography.H4>
        <div className="h-48 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <Typography.H4 className="text-gray-900 mb-4">{title}</Typography.H4>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const x1 = 50 + 40 * Math.cos((cumulativeAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((cumulativeAngle * Math.PI) / 180);
              
              const x2 = 50 + 40 * Math.cos(((cumulativeAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((cumulativeAngle + angle) * Math.PI) / 180);
              
              const pathData = `
                M 50 50
                L ${x1} ${y1}
                A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;
              
              const segment = (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  className="cursor-pointer hover:opacity-90 transition-all"
                  onMouseEnter={() => setSelectedSegment(index)}
                  onMouseLeave={() => setSelectedSegment(null)}
                />
              );
              
              cumulativeAngle += angle;
              return segment;
            })}
            <circle cx="50" cy="50" r="15" fill="white" />
          </svg>
          
          {selectedSegment !== null && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-lg font-bold">{data[selectedSegment].label}</div>
              <div className="text-sm">{data[selectedSegment].value} ({Math.round((data[selectedSegment].value / total) * 100)}%)</div>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="space-y-2">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                onMouseEnter={() => setSelectedSegment(index)}
                onMouseLeave={() => setSelectedSegment(null)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{item.value}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round((item.value / total) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total</span>
              <span className="font-bold">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Line Chart Component with Date Range
const LineChartComponent = ({ 
  title, 
  data, 
  loading, 
  color = 'blue', 
  period = '7d' 
}: { 
  title: string; 
  data: ChartDataItem[]; 
  loading: boolean; 
  color?: string; 
  period?: string;
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Typography.H4 className="text-gray-900 mb-4">{title}</Typography.H4>
        <div className="h-48 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const values = data.map(item => item.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  
  const colorClasses = {
    blue: { line: 'stroke-blue-500', fill: 'fill-blue-50', dot: 'fill-blue-500' },
    emerald: { line: 'stroke-emerald-500', fill: 'fill-emerald-50', dot: 'fill-emerald-500' },
    rose: { line: 'stroke-rose-500', fill: 'fill-rose-50', dot: 'fill-rose-500' },
    amber: { line: 'stroke-amber-500', fill: 'fill-amber-50', dot: 'fill-amber-500' }
  }[color] || { line: 'stroke-blue-500', fill: 'fill-blue-50', dot: 'fill-blue-500' };

  const width = 600;
  const height = 200;
  const padding = 40;
  
  const xScale = (index: number) => padding + (index * (width - 2 * padding) / (data.length - 1));
  const yScale = (value: number) => height - padding - ((value - minValue) * (height - 2 * padding) / range);
  
  const points = data.map((item, index) => ({
    x: xScale(index),
    y: yScale(item.value),
    label: item.label,
    value: item.value
  }));
  
  const linePath = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  const areaPath = `
    M ${points[0].x} ${points[0].y}
    ${points.slice(1).map(point => `L ${point.x} ${point.y}`).join(' ')}
    L ${points[points.length - 1].x} ${height - padding}
    L ${points[0].x} ${height - padding}
    Z
  `;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <Typography.H4 className="text-gray-900">{title}</Typography.H4>
        <div className="text-sm text-gray-500">
          Period: {period}
        </div>
      </div>
      <div className="relative h-48">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - padding - (ratio * (height - 2 * padding));
            return (
              <g key={ratio}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text
                  x={padding - 10}
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-xs fill-gray-400"
                >
                  {Math.round(minValue + (ratio * range))}
                </text>
              </g>
            );
          })}
          
          {/* Area under line */}
          <path d={areaPath} className={colorClasses.fill} />
          
          {/* Line */}
          <path d={linePath} className={colorClasses.line} fill="none" strokeWidth="2" />
          
          {/* Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                className={`${colorClasses.dot} cursor-pointer transition-all ${
                  hoverIndex === index ? 'r-6' : ''
                }`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              />
              
              {/* Hover tooltip */}
              {hoverIndex === index && (
                <g>
                  <rect
                    x={point.x - 40}
                    y={point.y - 50}
                    width="80"
                    height="40"
                    rx="4"
                    className="fill-white stroke-gray-200"
                    strokeWidth="1"
                  />
                  <text
                    x={point.x}
                    y={point.y - 35}
                    textAnchor="middle"
                    className="text-sm font-semibold fill-gray-900"
                  >
                    {point.label}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {point.value} breakdowns
                  </text>
                </g>
              )}
            </g>
          ))}
          
          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-0.5 ${colorClasses.line} bg-current`} />
          <span className="text-sm text-gray-600">{title}</span>
        </div>
        <div className="text-sm text-gray-500">
          {data.length} points • Range: {minValue} - {maxValue}
        </div>
      </div>
    </div>
  );
};

// Enhanced Real-Time Bar Graph Component
const RealTimeBarGraph = ({ 
  title, 
  data, 
  loading, 
  color = 'blue' 
}: { 
  title: string; 
  data: ChartDataItem[]; 
  loading: boolean; 
  color?: string;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Typography.H4 className="text-gray-900 mb-4">{title}</Typography.H4>
        <div className="h-48 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value), 1);
  const colorClasses = {
    blue: 'bg-gradient-to-t from-blue-500 to-blue-600',
    amber: 'bg-gradient-to-t from-amber-500 to-amber-600',
    emerald: 'bg-gradient-to-t from-emerald-500 to-emerald-600',
    rose: 'bg-gradient-to-t from-rose-500 to-rose-600',
    purple: 'bg-gradient-to-t from-purple-500 to-purple-600'
  }[color] || 'bg-gradient-to-t from-blue-500 to-blue-600';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <Typography.H4 className="text-gray-900">{title}</Typography.H4>
        <div className="text-sm text-gray-500">
          Total: {data.reduce((sum, item) => sum + item.value, 0)}
        </div>
      </div>
      <div className="h-48">
        <div className="flex items-end h-full gap-2">
          {data.map((item, index) => {
            const height = Math.max((item.value / maxValue) * 100, 5);
            const delay = index * 50;
            
            return (
              <div 
                key={item.label} 
                className="flex-1 flex flex-col items-center group"
                style={{ 
                  height: '100%',
                  animation: isAnimating ? `barGrow 1s ${delay}ms ease-out forwards` : 'none'
                }}
              >
                <div className="flex-1 w-full flex items-end relative">
                  <div
                    className={`w-full ${colorClasses} rounded-t transition-all duration-300 group-hover:opacity-90 relative`}
                    style={{ height: `${height}%` }}
                  >
                    {/* Value label on hover */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 w-full text-center">
                  <span className="text-xs font-medium text-gray-600 truncate block px-1">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @keyframes barGrow {
          0% { transform: scaleY(0); transform-origin: bottom; }
          100% { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>
    </div>
  );
};

// Statistics Dashboard Component with Date Range
const StatisticsDashboard = ({ 
  breakdowns, 
  loading, 
  startDate, 
  endDate, 
  onDateRangeChange 
}: { 
  breakdowns: Breakdown[]; 
  loading: boolean; 
  startDate: string; 
  endDate: string; 
  onDateRangeChange: () => void;
}) => {
  const metrics = useMemo(() => {
    return calculateMetricsFromBreakdowns(breakdowns);
  }, [breakdowns]);

  // Filter breakdowns by date range if provided
  const filteredBreakdowns = useMemo(() => {
    if (!breakdowns || !Array.isArray(breakdowns)) return [];
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return breakdowns.filter(breakdown => {
        if (!breakdown.breakdown_date) return false;
        const breakdownDate = new Date(breakdown.breakdown_date);
        return breakdownDate >= start && breakdownDate <= end;
      });
    }
    
    return breakdowns;
  }, [breakdowns, startDate, endDate]);

  // Prepare data for charts based on date range
  const chartData = useMemo(() => {
    if (!filteredBreakdowns || !Array.isArray(filteredBreakdowns)) {
      return {
        byStatus: [],
        byType: [],
        byPriority: [],
        weeklyTrend: [],
        byDepartment: [],
        dailyBreakdowns: []
      };
    }

    // Status distribution
    const byStatus = Object.keys(STATUS_TYPES).map(status => ({
      label: STATUS_TYPES[status].name,
      value: filteredBreakdowns.filter(b => b.status === status).length,
      color: STATUS_TYPES[status].bgColor
    }));

    // Type distribution
    const byType = Object.keys(BREAKDOWN_TYPES).map(type => ({
      label: BREAKDOWN_TYPES[type].name,
      value: filteredBreakdowns.filter(b => b.breakdown_type === type).length,
      color: BREAKDOWN_TYPES[type].bgColor
    }));

    // Priority distribution
    const byPriority = Object.keys(PRIORITY_TYPES).map(priority => ({
      label: PRIORITY_TYPES[priority].name,
      value: filteredBreakdowns.filter(b => b.priority === priority).length,
      color: PRIORITY_TYPES[priority].bgColor
    }));

    // Calculate date range for trend
    const rangeStart = startDate ? new Date(startDate) : new Date();
    const rangeEnd = endDate ? new Date(endDate) : new Date();
    
    if (!startDate) {
      rangeStart.setDate(rangeEnd.getDate() - 30); // Default to last 30 days
    }
    
    const daysDiff = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
    const dailyBreakdowns: ChartDataItem[] = [];
    const weeklyTrend: ChartDataItem[] = [];
    
    // Daily breakdowns
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(rangeStart);
      date.setDate(rangeStart.getDate() + i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayBreakdowns = filteredBreakdowns.filter(b => {
        if (!b.breakdown_date) return false;
        const breakdownDate = new Date(b.breakdown_date);
        return breakdownDate.toDateString() === date.toDateString();
      }).length;
      
      dailyBreakdowns.push({
        label: dateStr,
        value: dayBreakdowns
      });
    }
    
    // Weekly trend (group by week if range is long)
    if (daysDiff > 14) {
      const weeks = Math.ceil(daysDiff / 7);
      for (let i = 0; i < weeks; i++) {
        const weekStart = new Date(rangeStart);
        weekStart.setDate(rangeStart.getDate() + (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekBreakdowns = filteredBreakdowns.filter(b => {
          if (!b.breakdown_date) return false;
          const breakdownDate = new Date(b.breakdown_date);
          return breakdownDate >= weekStart && breakdownDate <= weekEnd;
        }).length;
        
        weeklyTrend.push({
          label: `Week ${i + 1}`,
          value: weekBreakdowns
        });
      }
    } else {
      weeklyTrend.push(...dailyBreakdowns);
    }

    // Department distribution
    const byDepartment = DEPARTMENTS.map(dept => ({
      label: dept,
      value: filteredBreakdowns.filter(b => b.department === dept).length
    })).filter(item => item.value > 0);

    return {
      byStatus,
      byType,
      byPriority,
      weeklyTrend,
      byDepartment,
      dailyBreakdowns
    };
  }, [filteredBreakdowns, startDate, endDate]);

  // Calculate period label
  const periodLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${start} - ${end}`;
    }
    return 'Last 30 days';
  }, [startDate, endDate]);

  // Color palettes for charts
  const chartColors = [
    '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#ec4899'
  ];

  const priorityColors = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6'];
  const statusColors = ['#3b82f6', '#f59e0b', '#10b981', '#64748b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Date Range Header */}
      <div className="flex items-center justify-between">
        <Typography.H3 className="text-gray-900">Statistics Dashboard</Typography.H3>
        <div className="text-sm text-gray-600">
          Period: {periodLabel} • {filteredBreakdowns.length} breakdowns
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 opacity-75" />
            <span className="text-xs opacity-75">MTTR</span>
          </div>
          <div className="text-2xl font-bold">{metrics.avg_resolution_hours.toFixed(1)}h</div>
          <div className="text-sm opacity-90">Avg. Resolution Time</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <GaugeIcon className="h-5 w-5 opacity-75" />
            <span className="text-xs opacity-75">Efficiency</span>
          </div>
          <div className="text-2xl font-bold">{metrics.efficiency_score}%</div>
          <div className="text-sm opacity-90">Operational Efficiency</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Timer className="h-5 w-5 opacity-75" />
            <span className="text-xs opacity-75">Downtime</span>
          </div>
          <div className="text-2xl font-bold">{metrics.total_downtime_hours}h</div>
          <div className="text-sm opacity-90">Total Downtime</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUpIcon className="h-5 w-5 opacity-75" />
            <span className="text-xs opacity-75">Resolved</span>
          </div>
          <div className="text-2xl font-bold">{metrics.resolved_this_week}</div>
          <div className="text-sm opacity-90">This Week</div>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <Typography.H5 className="text-gray-900">Select Date Range for Statistics</Typography.H5>
          <button
            onClick={() => onDateRangeChange()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Change Date Range
          </button>
        </div>
        {startDate && endDate && (
          <div className="text-sm text-gray-600">
            Showing data from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          title={`Breakdowns Trend (${periodLabel})`}
          data={chartData.dailyBreakdowns}
          loading={loading}
          color="blue"
          period={periodLabel}
        />
        
        <PieChartComponent
          title="Breakdowns by Priority"
          data={chartData.byPriority}
          loading={loading}
          colors={priorityColors}
        />
        
        <RealTimeBarGraph
          title="Breakdowns by Type"
          data={chartData.byType}
          loading={loading}
          color="amber"
        />
        
        <PieChartComponent
          title="Breakdowns by Status"
          data={chartData.byStatus}
          loading={loading}
          colors={statusColors}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Typography.H5 className="text-gray-900 mb-3">Cost Analysis</Typography.H5>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Total Spares Cost</span>
                <span className="font-medium">${metrics.total_cost.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${Math.min(100, (metrics.total_cost / 10000) * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Avg. Cost per Breakdown</span>
                <span className="font-medium">
                  ${filteredBreakdowns.length > 0 ? (metrics.total_cost / filteredBreakdowns.length).toFixed(0) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Typography.H5 className="text-gray-900 mb-3">Performance Metrics</Typography.H5>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Resolution Rate</span>
                <span className="font-medium">
                  {filteredBreakdowns.length > 0 ? 
                    `${Math.round((filteredBreakdowns.filter(b => b.status === 'resolved' || b.status === 'closed').length / filteredBreakdowns.length) * 100)}%` 
                    : '0%'}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${filteredBreakdowns.length > 0 ? 
                    Math.round((filteredBreakdowns.filter(b => b.status === 'resolved' || b.status === 'closed').length / filteredBreakdowns.length) * 100) 
                    : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Critical Response</span>
                <span className="font-medium">
                  {filteredBreakdowns.filter(b => b.priority === 'critical').length} issues
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Typography.H5 className="text-gray-900 mb-3">Time Analysis</Typography.H5>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Avg. Downtime</span>
                <span className="font-medium">{metrics.avg_downtime_hours.toFixed(1)}h</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${Math.min(100, (metrics.avg_downtime_hours / 24) * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Total Active Hours</span>
                <span className="font-medium">{metrics.total_downtime_hours.toFixed(0)}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 text-white">
        <Typography.H4 className="text-white mb-4">Statistics Summary</Typography.H4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{filteredBreakdowns.length}</div>
            <div className="text-sm text-gray-300">Total Breakdowns</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-300">
              {filteredBreakdowns.filter(b => b.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-300">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-300">
              {filteredBreakdowns.filter(b => b.priority === 'critical').length}
            </div>
            <div className="text-sm text-gray-300">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-300">
              {filteredBreakdowns.filter(b => b.status === 'resolved' || b.status === 'closed').length}
            </div>
            <div className="text-sm text-gray-300">Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Breakdown Details Modal Component
const BreakdownDetailsModal = ({ 
  breakdown, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: { 
  breakdown: Breakdown | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onEdit: (breakdown: Breakdown) => void; 
  onDelete: (breakdown: Breakdown) => void;
}) => {
  if (!isOpen || !breakdown) return null;

  const downtime = minutesToDisplay(
    calculateDowntime(breakdown.breakdown_start, breakdown.breakdown_end, breakdown.work_start, breakdown.work_end)
  );
  
  const totalSparesCost = (breakdown.spares_used && Array.isArray(breakdown.spares_used)) 
    ? breakdown.spares_used.reduce((total: number, spare: any) => {
        return total + (parseFloat(spare.total_cost?.toString() || '0') || 0);
      }, 0) 
    : 0;

  const statusConfig = STATUS_TYPES[breakdown.status] || STATUS_TYPES.logged;
  const priorityConfig = PRIORITY_TYPES[breakdown.priority] || PRIORITY_TYPES.medium;
  const typeConfig = BREAKDOWN_TYPES[breakdown.breakdown_type] || BREAKDOWN_TYPES.other;

  // FIXED: Use breakdown_uid for UUID
  const breakdownId = breakdown.breakdown_uid || breakdown.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${statusConfig.bgColor} text-white`}>
              <typeConfig.icon className="h-6 w-6" />
            </div>
            <div>
              <Typography.H2 className="text-gray-900">{breakdown.machine_name}</Typography.H2>
              <Typography.Muted>ID: {breakdown.machine_id} • {formatDate(breakdown.breakdown_date)}</Typography.Muted>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status Bar */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <Typography.Small className="text-gray-600">Status</Typography.Small>
              <div className="mt-1">
                <StatusBadge status={breakdown.status} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
              <Typography.Small className="text-gray-600">Priority</Typography.Small>
              <div className="mt-1">
                <PriorityBadge priority={breakdown.priority} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
              <Typography.Small className="text-gray-600">Type</Typography.Small>
              <div className="mt-1">
                <TypeBadge type={breakdown.breakdown_type} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <Typography.Small className="text-gray-600">Downtime</Typography.Small>
              <Typography.H5 className="mt-1">{downtime.display}</Typography.H5>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <Typography.H4 className="text-gray-900 mb-3">Breakdown Description</Typography.H4>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                  <Typography.P className="text-gray-700 leading-relaxed">
                    {breakdown.breakdown_description || 'No description provided'}
                  </Typography.P>
                </div>
              </div>

              {/* Work Done */}
              {breakdown.work_done && (
                <div>
                  <Typography.H4 className="text-gray-900 mb-3">Work Performed</Typography.H4>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <Typography.P className="text-gray-700 leading-relaxed">{breakdown.work_done}</Typography.P>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {breakdown.artisan_recommendations && (
                <div>
                  <Typography.H4 className="text-gray-900 mb-3">Recommendations</Typography.H4>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
                    <Typography.P className="text-gray-700 leading-relaxed">{breakdown.artisan_recommendations}</Typography.P>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Details Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5">
                <Typography.H4 className="text-gray-900 mb-4">Breakdown Details</Typography.H4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography.Small className="text-gray-500">Location</Typography.Small>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <Typography.P className="font-medium">{breakdown.location}</Typography.P>
                      </div>
                    </div>
                    <div>
                      <Typography.Small className="text-gray-500">Department</Typography.Small>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <Typography.P className="font-medium">{breakdown.department}</Typography.P>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Typography.Small className="text-gray-500">Assigned Artisan</Typography.Small>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <Typography.P className="font-medium">{breakdown.artisan_name || 'Unassigned'}</Typography.P>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography.Small className="text-gray-500">Breakdown Time</Typography.Small>
                      <div className="mt-1">
                        {breakdown.breakdown_start ? (
                          <Typography.P className="font-medium">
                            {breakdown.breakdown_start} - {breakdown.breakdown_end || 'Ongoing'}
                          </Typography.P>
                        ) : (
                          <Typography.P className="text-gray-400">Not recorded</Typography.P>
                        )}
                      </div>
                    </div>
                    <div>
                      <Typography.Small className="text-gray-500">Work Time</Typography.Small>
                      <div className="mt-1">
                        {breakdown.work_start ? (
                          <Typography.P className="font-medium">
                            {breakdown.work_start} - {breakdown.work_end || 'Ongoing'}
                          </Typography.P>
                        ) : (
                          <Typography.P className="text-gray-400">Not recorded</Typography.P>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spares Used */}
              {breakdown.spares_used && Array.isArray(breakdown.spares_used) && breakdown.spares_used.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <Typography.H4 className="text-gray-900">Spares Used</Typography.H4>
                    <div className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm font-medium">
                      Total: ${totalSparesCost.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {breakdown.spares_used.map((spare: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                        <div>
                          <Typography.P className="font-medium">{spare.name}</Typography.P>
                          <Typography.Small className="text-gray-500">{spare.part_number}</Typography.Small>
                        </div>
                        <div className="text-right">
                          <Typography.P className="font-medium">${spare.total_cost?.toFixed(2)}</Typography.P>
                          <Typography.Small className="text-gray-500">
                            {spare.quantity} × ${spare.unit_price?.toFixed(2)}
                          </Typography.Small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Summary */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-5">
                <Typography.H4 className="text-gray-900 mb-4">Cost Summary</Typography.H4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Typography.Small className="text-gray-600">Spares Cost</Typography.Small>
                    <Typography.P className="font-medium">${totalSparesCost.toFixed(2)}</Typography.P>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography.Small className="text-gray-600">Downtime Cost</Typography.Small>
                    <Typography.P className="font-medium">
                      ${(downtime.decimal * 500).toFixed(2)}*
                    </Typography.P>
                  </div>
                  <div className="pt-3 border-t border-emerald-200">
                    <div className="flex justify-between items-center">
                      <Typography.P className="font-medium text-gray-900">Estimated Total</Typography.P>
                      <Typography.H5 className="text-emerald-700">
                        ${(totalSparesCost + (downtime.decimal * 500)).toFixed(2)}
                      </Typography.H5>
                    </div>
                    <Typography.Small className="text-gray-500 mt-1 block">
                      *Based on $500/hour operational cost
                    </Typography.Small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Created: {formatDate(breakdown.created_at)}</span>
            </div>
            {breakdown.updated_at && (
              <div className="flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4" />
                <span>Updated: {formatDate(breakdown.updated_at)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(breakdown)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Breakdown
            </button>
            <button
              onClick={() => onDelete(breakdown)}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Create/Edit Breakdown Modal
const BreakdownFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  mode = 'create' 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (formData: BreakdownFormData) => Promise<void>; 
  initialData: Breakdown | null; 
  mode?: 'create' | 'edit';
}) => {
  const [formData, setFormData] = useState<BreakdownFormData>({
    machine_id: '',
    machine_name: '',
    breakdown_description: '',
    artisan_name: '',
    breakdown_date: new Date().toISOString().split('T')[0],
    location: '',
    department: '',
    breakdown_type: 'mechanical',
    work_done: '',
    artisan_recommendations: '',
    status: 'logged',
    priority: 'medium',
    breakdown_start: '',
    breakdown_end: '',
    work_start: '',
    work_end: '',
    spares_used: []
  });

  const [spareForm, setSpareForm] = useState({
    name: '',
    part_number: '',
    quantity: 1,
    unit_price: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (initialData) {
      setFormData({
        machine_id: initialData.machine_id || '',
        machine_name: initialData.machine_name || '',
        breakdown_description: initialData.breakdown_description || '',
        artisan_name: initialData.artisan_name || '',
        breakdown_date: initialData.breakdown_date
          ? new Date(initialData.breakdown_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        location: initialData.location || '',
        department: initialData.department || '',
        breakdown_type: initialData.breakdown_type || 'mechanical',
        work_done: initialData.work_done || '',
        artisan_recommendations: initialData.artisan_recommendations || '',
        status: initialData.status || 'logged',
        priority: initialData.priority || 'medium',
        breakdown_start: initialData.breakdown_start ?? '',
        breakdown_end: initialData.breakdown_end ?? '',
        work_start: initialData.work_start ?? '',
        work_end: initialData.work_end ?? '',
        spares_used: Array.isArray(initialData.spares_used) ? initialData.spares_used : []
      });
    } else {
      // Reset form for create mode
      setFormData({
        machine_id: '',
        machine_name: '',
        breakdown_description: '',
        artisan_name: '',
        breakdown_date: new Date().toISOString().split('T')[0],
        location: '',
        department: '',
        breakdown_type: 'mechanical',
        work_done: '',
        artisan_recommendations: '',
        status: 'logged',
        priority: 'medium',
        breakdown_start: '',
        breakdown_end: '',
        work_start: '',
        work_end: '',
        spares_used: []
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.machine_name.trim()) newErrors.machine_name = 'Machine name is required';
    if (!formData.breakdown_description.trim()) newErrors.breakdown_description = 'Description is required';
    if (!formData.artisan_name.trim()) newErrors.artisan_name = 'Artisan name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.department) newErrors.department = 'Department is required';
    
    // Validate time ranges
    if (formData.breakdown_start && formData.breakdown_end) {
      const start = timeToMinutes(formData.breakdown_start);
      const end = timeToMinutes(formData.breakdown_end);
      if (end < start) {
        newErrors.breakdown_end = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to save breakdown' });
    } finally {
      setLoading(false);
    }
  };

  const addSpare = () => {
    if (!spareForm.name.trim()) {
      setErrors({ ...errors, spare: 'Spare part name is required' });
      return;
    }
    
    const totalCost = spareForm.quantity * spareForm.unit_price;
    const newSpare: SparePart = {
      ...spareForm,
      total_cost: totalCost
    };
    
    setFormData(prev => ({
      ...prev,
      spares_used: [...prev.spares_used, newSpare]
    }));
    
    setSpareForm({
      name: '',
      part_number: '',
      quantity: 1,
      unit_price: 0
    });
    
    setErrors({ ...errors, spare: '' });
  };

  const removeSpare = (index: number) => {
    setFormData(prev => ({
      ...prev,
      spares_used: prev.spares_used.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <Typography.H2>{mode === 'create' ? 'Create New Breakdown' : 'Edit Breakdown'}</Typography.H2>
            <Typography.Muted className="mt-1">
              {mode === 'create' ? 'Add a new equipment breakdown record' : 'Update breakdown details'}
            </Typography.Muted>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 px-6">
            {['basic', 'details', 'spares', 'timing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Machine Name *
                  </label>
                  <input
                    type="text"
                    value={formData.machine_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, machine_name: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.machine_name ? 'border-rose-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter machine name"
                  />
                  {errors.machine_name && (
                    <p className="mt-2 text-sm text-rose-600">{errors.machine_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Machine ID
                  </label>
                  <input
                    type="text"
                    value={formData.machine_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, machine_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breakdown Description *
                </label>
                <textarea
                  value={formData.breakdown_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, breakdown_description: e.target.value }))}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.breakdown_description ? 'border-rose-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the breakdown in detail"
                />
                {errors.breakdown_description && (
                  <p className="mt-2 text-sm text-rose-600">{errors.breakdown_description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artisan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.artisan_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, artisan_name: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.artisan_name ? 'border-rose-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter artisan name"
                  />
                  {errors.artisan_name && (
                    <p className="mt-2 text-sm text-rose-600">{errors.artisan_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breakdown Date *
                  </label>
                  <input
                    type="date"
                    value={formData.breakdown_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, breakdown_date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(STATUS_TYPES).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(PRIORITY_TYPES).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breakdown Type *
                  </label>
                  <select
                    value={formData.breakdown_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, breakdown_type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(BREAKDOWN_TYPES).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.location ? 'border-rose-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select location</option>
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="mt-2 text-sm text-rose-600">{errors.location}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.department ? 'border-rose-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-2 text-sm text-rose-600">{errors.department}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Done
                </label>
                <textarea
                  value={formData.work_done}
                  onChange={(e) => setFormData(prev => ({ ...prev, work_done: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the work performed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendations
                </label>
                <textarea
                  value={formData.artisan_recommendations}
                  onChange={(e) => setFormData(prev => ({ ...prev, artisan_recommendations: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter recommendations for prevention"
                />
              </div>
            </div>
          )}

          {activeTab === 'spares' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5">
                <Typography.H4 className="text-gray-900 mb-4">Add Spare Parts</Typography.H4>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Part Name *
                    </label>
                    <input
                      type="text"
                      value={spareForm.name}
                      onChange={(e) => setSpareForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Enter part name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Part Number
                    </label>
                    <input
                      type="text"
                      value={spareForm.part_number}
                      onChange={(e) => setSpareForm(prev => ({ ...prev, part_number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Enter part number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={spareForm.quantity}
                      onChange={(e) => setSpareForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Unit Price ($)
                    </label>
                    <input
                      type="number"
                      value={spareForm.unit_price}
                      onChange={(e) => setSpareForm(prev => ({ ...prev, unit_price: parseFloat(e.target.value) || 0 }))}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addSpare}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Spare Part
                </button>
                {errors.spare && (
                  <p className="mt-2 text-sm text-rose-600">{errors.spare}</p>
                )}
              </div>

              {formData.spares_used.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <Typography.H5 className="text-gray-900">Spare Parts Used</Typography.H5>
                      <div className="text-sm font-medium text-gray-600">
                        Total: ${formData.spares_used.reduce((sum, spare) => sum + spare.total_cost, 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Part Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Part No.</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Qty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Unit Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {formData.spares_used.map((spare, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{spare.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{spare.part_number || '-'}</td>
                            <td className="px-4 py-3 text-sm">{spare.quantity}</td>
                            <td className="px-4 py-3 text-sm">${spare.unit_price?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm font-medium">${spare.total_cost?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                type="button"
                                onClick={() => removeSpare(index)}
                                className="text-rose-600 hover:text-rose-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <Typography.P className="text-gray-500">No spare parts added yet</Typography.P>
                  <Typography.Small className="text-gray-400 mt-1">
                    Add spare parts used in the repair
                  </Typography.Small>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breakdown Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.breakdown_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, breakdown_start: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breakdown End Time
                  </label>
                  <input
                    type="time"
                    value={formData.breakdown_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, breakdown_end: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.breakdown_end ? 'border-rose-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.breakdown_end && (
                    <p className="mt-2 text-sm text-rose-600">{errors.breakdown_end}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.work_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, work_start: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work End Time
                  </label>
                  <input
                    type="time"
                    value={formData.work_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, work_end: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Calculated Downtime */}
              {(formData.breakdown_start && formData.breakdown_end) && (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-5">
                  <Typography.H4 className="text-gray-900 mb-3">Calculated Downtime</Typography.H4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography.P className="text-gray-600">Breakdown Duration</Typography.P>
                      <Typography.H5 className="mt-1">
                        {minutesToDisplay(calculateTimeDifference(formData.breakdown_start, formData.breakdown_end)).display}
                      </Typography.H5>
                    </div>
                    {formData.work_start && formData.work_end && (
                      <div>
                        <Typography.P className="text-gray-600">Work Duration</Typography.P>
                        <Typography.H5 className="mt-1">
                          {minutesToDisplay(calculateTimeDifference(formData.work_start, formData.work_end)).display}
                        </Typography.H5>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {errors.submit && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-600" />
                <Typography.P className="text-sm text-rose-600">{errors.submit}</Typography.P>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'details' ? 'basic' : 
                                         activeTab === 'spares' ? 'details' : 'spares')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Typography.Small className="text-gray-500">
              {activeTab === 'basic' && '1/4: Basic Information'}
              {activeTab === 'details' && '2/4: Classification & Details'}
              {activeTab === 'spares' && '3/4: Spare Parts'}
              {activeTab === 'timing' && '4/4: Timing Information'}
            </Typography.Small>
            
            {activeTab !== 'timing' ? (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'basic' ? 'details' : 
                                         activeTab === 'details' ? 'spares' : 'timing')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Create Breakdown' : 'Update Breakdown'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Breakdowns Page Component
const BreakdownsPage = () => {
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([]);
  const [filteredBreakdowns, setFilteredBreakdowns] = useState<Breakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortField, setSortField] = useState('breakdown_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'statistics'
  
  // Filter states
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    breakdown_type: 'all',
    priority: 'all',
    department: 'all',
    location: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Date range states
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [showDateRange, setShowDateRange] = useState(false);
  
  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState<Breakdown | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  // Backend availability
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Load breakdowns with date range filtering
  const loadBreakdowns = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const available = await isBackendAvailable();
      setBackendAvailable(available);
      
      if (!available) {
        setBreakdowns([]);
        setFilteredBreakdowns([]);
        setLoading(false);
        return;
      }
      
      // Build query with date range
      const queryFilters: Record<string, string> = { ...filters };
      if (startDate && endDate) {
        queryFilters.start_date = startDate;
        queryFilters.end_date = endDate;
      }
      
      const data = await fetchBreakdowns(queryFilters);
      setBreakdowns(data);
      setFilteredBreakdowns(data);
    } catch (err) {
      console.error('Failed to load breakdowns:', err);
      setError('Failed to load breakdowns. Please try again.');
      setBreakdowns([]);
      setFilteredBreakdowns([]);
    } finally {
      setLoading(false);
    }
  }, [filters, startDate, endDate]);

  // Apply filters and search
  useEffect(() => {
    let result = [...breakdowns];
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(breakdown => breakdown[key as keyof Breakdown] === value);
      }
    });
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(breakdown =>
        breakdown.machine_name?.toLowerCase().includes(term) ||
        breakdown.machine_id?.toLowerCase().includes(term) ||
        breakdown.breakdown_description?.toLowerCase().includes(term) ||
        breakdown.artisan_name?.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aVal = a[sortField as keyof Breakdown];
      let bVal = b[sortField as keyof Breakdown];

      // Handle dates
      if (sortField === 'breakdown_date') {
        const aDate = new Date(aVal as string);
        const bDate = new Date(bVal as string);
        if (aDate < bDate) return sortDirection === 'asc' ? -1 : 1;
        if (aDate > bDate) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }

      // Handle numeric values (downtime, cost)
      if (sortField === 'downtime_minutes' || sortField === 'total_cost') {
        const aNum = parseFloat(aVal as string) || 0;
        const bNum = parseFloat(bVal as string) || 0;
        if (aNum < bNum) return sortDirection === 'asc' ? -1 : 1;
        if (aNum > bNum) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredBreakdowns(result);
  }, [breakdowns, filters, searchTerm, sortField, sortDirection]);

  // Load breakdowns on mount and when date range changes
  useEffect(() => {
    loadBreakdowns();
  }, [loadBreakdowns]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleView = (breakdown: Breakdown) => {
    setSelectedBreakdown(breakdown);
    setDetailsModalOpen(true);
  };

  const handleEdit = (breakdown: Breakdown) => {
    setSelectedBreakdown(breakdown);
    setFormMode('edit');
    setFormModalOpen(true);
  };

  const handleDelete = async (breakdown: Breakdown) => {
    // FIXED: Use breakdown_uid for UUID
    const breakdownId = breakdown.breakdown_uid || breakdown.id;
    
    if (window.confirm(`Are you sure you want to delete breakdown for "${breakdown.machine_name}"?`)) {
      try {
        await deleteBreakdown(breakdownId as string);
        await loadBreakdowns();
      } catch (err) {
        console.error('Failed to delete breakdown:', err);
        setError('Failed to delete breakdown. Please try again.');
      }
    }
  };

  const handleCreate = () => {
    setSelectedBreakdown(null);
    setFormMode('create');
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: BreakdownFormData) => {
    try {
      if (formMode === 'create') {
        await createBreakdown(formData);
      } else {
        // FIXED: Use breakdown_uid for UUID
        const breakdownId = selectedBreakdown?.breakdown_uid || selectedBreakdown?.id;
        if (!breakdownId) throw new Error('Breakdown ID not found');
        await updateBreakdown(breakdownId, formData);
      }
      await loadBreakdowns();
    } catch (err) {
      console.error('Failed to save breakdown:', err);
      throw err;
    }
  };

  // Export functionality
  const exportToCSV = () => {
    const headers = [
      'Machine Name',
      'Machine ID',
      'Description',
      'Status',
      'Priority',
      'Type',
      'Location',
      'Department',
      'Artisan',
      'Date',
      'Downtime',
      'Cost',
      'Work Done',
      'Recommendations'
    ];

    const csvRows = [
      headers.join(','),
      ...filteredBreakdowns.map(breakdown => {
        const downtime = minutesToDisplay(
          calculateDowntime(breakdown.breakdown_start, breakdown.breakdown_end, breakdown.work_start, breakdown.work_end)
        );
        
        const totalSparesCost = (breakdown.spares_used && Array.isArray(breakdown.spares_used)) 
          ? breakdown.spares_used.reduce((total: number, spare: any) => {
              return total + (parseFloat(spare.total_cost?.toString() || '0') || 0);
            }, 0) 
          : 0;

        const row = [
          `"${breakdown.machine_name || ''}"`,
          `"${breakdown.machine_id || ''}"`,
          `"${(breakdown.breakdown_description || '').replace(/"/g, '""')}"`,
          `"${STATUS_TYPES[breakdown.status]?.name || ''}"`,
          `"${PRIORITY_TYPES[breakdown.priority]?.name || ''}"`,
          `"${BREAKDOWN_TYPES[breakdown.breakdown_type]?.name || ''}"`,
          `"${breakdown.location || ''}"`,
          `"${breakdown.department || ''}"`,
          `"${breakdown.artisan_name || ''}"`,
          `"${formatDate(breakdown.breakdown_date)}"`,
          `"${downtime.display}"`,
          `"${totalSparesCost.toFixed(2)}"`,
          `"${(breakdown.work_done || '').replace(/"/g, '""')}"`,
          `"${(breakdown.artisan_recommendations || '').replace(/"/g, '""')}"`
        ];
        
        return row.join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `breakdowns_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Print functionality
  const printBreakdowns = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Breakdown Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f9fafb; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
          </style>
        </head>
        <body>
          <h1>Breakdown Report - ${new Date().toLocaleDateString()}</h1>
          <p>Total: ${filteredBreakdowns.length} breakdowns</p>
          <table>
            <thead>
              <tr>
                <th>Machine</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Downtime</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              ${filteredBreakdowns.map(breakdown => {
                const downtime = minutesToDisplay(
                  calculateDowntime(breakdown.breakdown_start, breakdown.breakdown_end, breakdown.work_start, breakdown.work_end)
                );
                
                const totalSparesCost = (breakdown.spares_used && Array.isArray(breakdown.spares_used)) 
                  ? breakdown.spares_used.reduce((total: number, spare: any) => {
                      return total + (parseFloat(spare.total_cost?.toString() || '0') || 0);
                    }, 0) 
                  : 0;

                return `
                  <tr>
                    <td>${breakdown.machine_name}</td>
                    <td>${breakdown.breakdown_description || ''}</td>
                    <td><span class="badge">${STATUS_TYPES[breakdown.status]?.name || ''}</span></td>
                    <td><span class="badge">${PRIORITY_TYPES[breakdown.priority]?.name || ''}</span></td>
                    <td>${formatDate(breakdown.breakdown_date)}</td>
                    <td>${downtime.display}</td>
                    <td>$${totalSparesCost.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Show connection error if backend is unavailable
  if (!backendAvailable && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-rose-600" />
            </div>
            <Typography.H2 className="text-gray-900 mb-3">Backend Unavailable</Typography.H2>
            <Typography.P className="text-gray-600 mb-8 max-w-md mx-auto">
              Unable to connect to the backend server. Please ensure the backend is running on http://localhost:8000
            </Typography.P>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={loadBreakdowns}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Connection
              </button>
              <button
                onClick={() => setBackendAvailable(true)} // Allow demo mode
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue in Demo Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <Typography.H1 className="text-gray-900">Equipment Breakdowns</Typography.H1>
            <Typography.Lead>Monitor and manage equipment maintenance issues</Typography.Lead>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={printBreakdowns}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              New Breakdown
            </button>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-4 w-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'statistics'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Statistics
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                {/* Error Display */}
                {error && (
                  <div className="bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-rose-700">
                      <AlertCircle className="h-5 w-5" />
                      <Typography.P>{error}</Typography.P>
                    </div>
                  </div>
                )}

                {/* Dashboard Metrics */}
                <DashboardMetrics 
                  breakdowns={breakdowns} 
                  loading={loading}
                />

                {/* Filters and Controls with Date Range */}
                <FilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onRefresh={loadBreakdowns}
                  loading={loading}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  showDateRange={showDateRange}
                  onToggleDateRange={() => setShowDateRange(!showDateRange)}
                />

                {/* View Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-700">
                      {filteredBreakdowns.length} breakdowns
                      {filteredBreakdowns.length !== breakdowns.length && (
                        <span className="text-gray-500 ml-2">
                          (filtered from {breakdowns.length})
                        </span>
                      )}
                    </div>
                    {filteredBreakdowns.length !== breakdowns.length && (
                      <button
                        onClick={() => {
                          setFilters({
                            status: 'all',
                            breakdown_type: 'all',
                            priority: 'all',
                            department: 'all',
                            location: 'all'
                          });
                          setSearchTerm('');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white border border-gray-300 rounded-lg flex">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 text-sm flex items-center gap-2 ${
                          viewMode === 'grid' 
                            ? 'bg-blue-50 text-blue-600 border-r border-gray-300' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 text-sm flex items-center gap-2 ${
                          viewMode === 'list' 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <List className="h-4 w-4" />
                        List
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBreakdowns.map((breakdown) => (
                      <BreakdownCard
                        key={breakdown.breakdown_uid || breakdown.id}
                        breakdown={breakdown}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <BreakdownTable
                    breakdowns={filteredBreakdowns}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                )}

                {/* Empty State */}
                {!loading && filteredBreakdowns.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="h-10 w-10 text-gray-400" />
                    </div>
                    <Typography.H3 className="text-gray-500 mb-2">No breakdowns found</Typography.H3>
                    <Typography.Muted className="mb-6 max-w-md mx-auto">
                      Try adjusting your filters or create a new breakdown record
                    </Typography.Muted>
                    <button
                      onClick={handleCreate}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all inline-flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      Create First Breakdown
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <StatisticsDashboard
                breakdowns={breakdowns}
                loading={loading}
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={() => setShowDateRange(true)}
              />
            )}
          </div>
        </div>

        {/* Footer Stats */}
        {!loading && filteredBreakdowns.length > 0 && activeTab === 'overview' && (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{filteredBreakdowns.length}</div>
                <div className="text-sm text-gray-300">Total Filtered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-300">
                  {filteredBreakdowns.filter(b => b.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-300">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-300">
                  {filteredBreakdowns.filter(b => b.priority === 'critical').length}
                </div>
                <div className="text-sm text-gray-300">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-300">
                  {filteredBreakdowns.filter(b => b.status === 'resolved' || b.status === 'closed').length}
                </div>
                <div className="text-sm text-gray-300">Resolved</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedBreakdown && (
        <BreakdownDetailsModal
          breakdown={selectedBreakdown}
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <BreakdownFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedBreakdown}
        mode={formMode}
      />
    </div>
  );
};

export default BreakdownsPage;