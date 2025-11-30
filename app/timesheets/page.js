'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Calendar,
  Download,
  Calculator,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Settings,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  BarChart3,
  Moon,
  Sun,
  CalendarDays,
  Plane,
  PartyPopper,
  UserPlus,
  Trash2,
  Copy,
  RotateCcw,
  Play,
  Square,
  FastForward,
  RefreshCw,
  Database,
  Cloud,
  CloudOff
} from 'lucide-react';

// API service for FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const timesheetsApi = {
  // Employees
  async getEmployees(filters = {}) {
    const params = new URLSearchParams();
    if (filters.department && filters.department !== 'all') {
      params.append('department', filters.department);
    }
    
    const response = await fetch(`${API_BASE_URL}/employees?${params}`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return await response.json();
  },

  async createEmployee(employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return await response.json();
  },

  async updateEmployee(employeeId, employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return await response.json();
  },

  async deleteEmployee(employeeId) {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete employee');
    return await response.json();
  },

  // Timesheets
  async getTimesheets(filters = {}) {
    const params = new URLSearchParams();
    if (filters.employeeId) params.append('employee_id', filters.employeeId);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.department && filters.department !== 'all') {
      params.append('department', filters.department);
    }
    
    const response = await fetch(`${API_BASE_URL}/timesheets?${params}`);
    if (!response.ok) throw new Error('Failed to fetch timesheets');
    return await response.json();
  },

  async createTimesheetEntry(entryData) {
    const response = await fetch(`${API_BASE_URL}/timesheets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData)
    });
    if (!response.ok) throw new Error('Failed to create timesheet entry');
    return await response.json();
  },

  async updateTimesheetEntry(entryId, entryData) {
    const response = await fetch(`${API_BASE_URL}/timesheets/${entryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData)
    });
    if (!response.ok) throw new Error('Failed to update timesheet entry');
    return await response.json();
  },

  async deleteTimesheetEntry(entryId) {
    const response = await fetch(`${API_BASE_URL}/timesheets/${entryId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete timesheet entry');
    return await response.json();
  },

  // Bulk operations
  async applyShiftToRange(bulkData) {
    const response = await fetch(`${API_BASE_URL}/timesheets/apply-shift`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bulkData)
    });
    if (!response.ok) throw new Error('Failed to apply shift to range');
    return await response.json();
  },

  // Holidays
  async getHolidays(filters = {}) {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    const response = await fetch(`${API_BASE_URL}/holidays?${params}`);
    if (!response.ok) throw new Error('Failed to fetch holidays');
    return await response.json();
  },

  async createHoliday(holidayData) {
    const response = await fetch(`${API_BASE_URL}/holidays`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(holidayData)
    });
    if (!response.ok) throw new Error('Failed to create holiday');
    return await response.json();
  },

  async deleteHoliday(holidayId) {
    const response = await fetch(`${API_BASE_URL}/holidays/${holidayId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete holiday');
    return await response.json();
  },

  // Leave Days
  async getLeaveDays(filters = {}) {
    const params = new URLSearchParams();
    if (filters.employeeId) params.append('employee_id', filters.employeeId);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    const response = await fetch(`${API_BASE_URL}/leave-days?${params}`);
    if (!response.ok) throw new Error('Failed to fetch leave days');
    return await response.json();
  },

  async createLeaveDay(leaveData) {
    const response = await fetch(`${API_BASE_URL}/leave-days`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData)
    });
    if (!response.ok) throw new Error('Failed to create leave day');
    return await response.json();
  },

  async deleteLeaveDay(leaveDayId) {
    const response = await fetch(`${API_BASE_URL}/leave-days/${leaveDayId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete leave day');
    return await response.json();
  },

  // Statistics
  async getMonthlySummary(year, month, department = null) {
    const params = new URLSearchParams();
    params.append('year', year);
    params.append('month', month);
    if (department && department !== 'all') params.append('department', department);
    
    const response = await fetch(`${API_BASE_URL}/stats/monthly-summary?${params}`);
    if (!response.ok) throw new Error('Failed to fetch monthly summary');
    return await response.json();
  },

  async getEmployeeSummary(employeeId, year, month) {
    const params = new URLSearchParams();
    params.append('year', year);
    params.append('month', month);
    
    const response = await fetch(`${API_BASE_URL}/stats/employee-summary/${employeeId}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch employee summary');
    return await response.json();
  },

  async getSystemOverview() {
    const response = await fetch(`${API_BASE_URL}/stats/overview`);
    if (!response.ok) throw new Error('Failed to fetch system overview');
    return await response.json();
  }
};

// Status types
const STATUS_TYPES = {
  WORK: 'work',
  LEAVE: 'leave',
  OFF: 'off',
  ABSENT: 'absent',
  HOLIDAY: 'holiday'
};

const STATUS_CONFIG = {
  [STATUS_TYPES.LEAVE]: { label: 'Leave', color: 'bg-blue-100 text-blue-800', hours: 8 },
  [STATUS_TYPES.OFF]: { label: 'Off', color: 'bg-gray-100 text-gray-800', hours: 8 },
  [STATUS_TYPES.ABSENT]: { label: 'Absent', color: 'bg-red-100 text-red-800', hours: 0 },
  [STATUS_TYPES.HOLIDAY]: { label: 'Holiday', color: 'bg-purple-100 text-purple-800', hours: 8 },
  [STATUS_TYPES.WORK]: { label: 'Work', color: 'bg-green-100 text-green-800', hours: 0 }
};

// Department options
const DEPARTMENTS = ['Engineering', 'Design', 'Management', 'Marketing', 'Sales', 'Support', 'HR'];

// Color options for employees
const COLOR_OPTIONS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500', 'bg-orange-500',
  'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'
];

// Common shift patterns
const SHIFT_PRESETS = [
  { name: 'Standard 9-5', start: '09:00', end: '17:00', break: 60 },
  { name: 'Early 7-3', start: '07:00', end: '15:00', break: 30 },
  { name: 'Late 12-8', start: '12:00', end: '20:00', break: 45 },
  { name: 'Night 22-6', start: '22:00', end: '06:00', break: 60 },
  { name: 'Flexible 10-6', start: '10:00', end: '18:00', break: 60 }
];

const TimesheetsSystem = () => {
  const [isClient, setIsClient] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [leaveDays, setLeaveDays] = useState([]);
  const [activeTab, setActiveTab] = useState('monthly-view');
  const [settings, setSettings] = useState({
    autoOvertime: true,
    overtimeThreshold: 8,
    darkMode: false,
    showWeekends: true,
    holidayOvertimeRate: 2.0,
    enableTimer: true,
    autoCopyPrevious: false
  });
  const [filters, setFilters] = useState({
    department: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTimers, setActiveTimers] = useState({});
  const [quickEntryMode, setQuickEntryMode] = useState(false);
  const [selectedShift, setSelectedShift] = useState(SHIFT_PRESETS[0]);

  // Initialize component
  useEffect(() => {
    setIsClient(true);
    loadAllData();
    
    // Check online status
    setIsOnline(navigator.onLine);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  // Load all data from API
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      
      const [employeesData, timesheetsData, holidaysData, leaveDaysData, overviewData] = await Promise.all([
        timesheetsApi.getEmployees(),
        timesheetsApi.getTimesheets(),
        timesheetsApi.getHolidays(),
        timesheetsApi.getLeaveDays(),
        timesheetsApi.getSystemOverview()
      ]);

      setEmployees(employeesData);
      setTimesheets(timesheetsData);
      setHolidays(holidaysData);
      setLeaveDays(leaveDaysData);
      
      toast.success('Data loaded successfully');
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data from server');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    await loadAllData();
  };

  // Get all days in current month
  const getDaysInMonth = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  // Memoized days in month
  const daysInMonth = useMemo(() => getDaysInMonth(), [getDaysInMonth]);

  // Check if date is holiday
  const isHoliday = useCallback((date) => {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(holiday => holiday.date === dateStr);
  }, [holidays]);

  // Check if date is leave/off/absent
  const getDayStatus = useCallback((employeeId, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const employeeLeaveDay = leaveDays.find(ld => 
      ld.employee_id === employeeId && ld.date === dateStr
    );
    return employeeLeaveDay ? employeeLeaveDay.status : STATUS_TYPES.WORK;
  }, [leaveDays]);

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Validate time format (HH:MM)
  const isValidTime = (time) => {
    if (!time) return false;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Format time input
  const formatTimeInput = (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
    }
  };

  // Calculate hours from start/end times
  const calculateHoursFromTimes = useCallback((startTime, endTime, breakMinutes = 60) => {
    if (!startTime || !endTime || !isValidTime(startTime) || !isValidTime(endTime)) {
      return { regularHours: 0, overtimeHours: 0, holidayOvertimeHours: 0, totalHours: 0 };
    }

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    totalMinutes -= breakMinutes;
    
    const totalHours = Math.max(0, totalMinutes / 60);
    
    if (settings.autoOvertime && totalHours > settings.overtimeThreshold) {
      return {
        regularHours: settings.overtimeThreshold,
        overtimeHours: totalHours - settings.overtimeThreshold,
        holidayOvertimeHours: 0,
        totalHours
      };
    } else {
      return {
        regularHours: totalHours,
        overtimeHours: 0,
        holidayOvertimeHours: 0,
        totalHours
      };
    }
  }, [settings.autoOvertime, settings.overtimeThreshold]);

  // Update time entry
  const updateTimeEntry = async (employeeId, date, field, value) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const existingEntry = timesheets.find(ts => 
        ts.employee_id === employeeId && ts.date === dateStr
      );

      let entryData = {
        employee_id: employeeId,
        date: dateStr,
        [field]: value
      };

      // If updating times, calculate hours
      if (field === 'startTime' || field === 'endTime' || field === 'breakMinutes') {
        const currentEntry = existingEntry || {};
        const startTime = field === 'startTime' ? value : currentEntry.start_time;
        const endTime = field === 'endTime' ? value : currentEntry.end_time;
        const breakMins = field === 'breakMinutes' ? value : currentEntry.break_minutes;

        if (startTime && endTime) {
          const hours = calculateHoursFromTimes(startTime, endTime, breakMins);
          Object.assign(entryData, hours);
        }
      }

      if (existingEntry) {
        // Update existing entry
        const updated = await timesheetsApi.updateTimesheetEntry(existingEntry.id, entryData);
        setTimesheets(prev => prev.map(ts => 
          ts.id === existingEntry.id ? { ...ts, ...updated } : ts
        ));
      } else {
        // Create new entry
        const newEntry = await timesheetsApi.createTimesheetEntry({
          ...entryData,
          status: STATUS_TYPES.WORK
        });
        setTimesheets(prev => [...prev, newEntry]);
      }

      toast.success('Timesheet updated');
    } catch (error) {
      console.error('Failed to update timesheet:', error);
      toast.error('Failed to update timesheet');
    }
  };

  // Update day status (leave, off, absent, etc.)
  const updateDayStatus = async (employeeId, date, status) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      if (status === STATUS_TYPES.WORK) {
        // Remove leave day and clear timesheet
        const existingLeaveDay = leaveDays.find(ld => 
          ld.employee_id === employeeId && ld.date === dateStr
        );
        
        if (existingLeaveDay) {
          await timesheetsApi.deleteLeaveDay(existingLeaveDay.id);
          setLeaveDays(prev => prev.filter(ld => ld.id !== existingLeaveDay.id));
        }

        const existingTimesheet = timesheets.find(ts => 
          ts.employee_id === employeeId && ts.date === dateStr
        );
        
        if (existingTimesheet) {
          await timesheetsApi.deleteTimesheetEntry(existingTimesheet.id);
          setTimesheets(prev => prev.filter(ts => ts.id !== existingTimesheet.id));
        }
      } else {
        // Add leave day
        const leaveData = {
          employee_id: employeeId,
          date: dateStr,
          status
        };
        
        const newLeaveDay = await timesheetsApi.createLeaveDay(leaveData);
        setLeaveDays(prev => [...prev, newLeaveDay]);

        // Set automatic hours for leave/off days
        const statusConfig = STATUS_CONFIG[status];
        if (statusConfig.hours > 0) {
          const timesheetData = {
            employee_id: employeeId,
            date: dateStr,
            start_time: '09:00',
            end_time: '17:00',
            break_minutes: 60,
            regular_hours: statusConfig.hours,
            overtime_hours: 0,
            holiday_overtime_hours: 0,
            total_hours: statusConfig.hours,
            status
          };
          
          const newTimesheet = await timesheetsApi.createTimesheetEntry(timesheetData);
          setTimesheets(prev => [...prev, newTimesheet]);
        }
      }

      toast.success(`Status updated to ${STATUS_CONFIG[status].label}`);
    } catch (error) {
      console.error('Failed to update day status:', error);
      toast.error('Failed to update day status');
    }
  };

  // Add/remove holiday
  const toggleHoliday = async (date) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const existingHoliday = holidays.find(h => h.date === dateStr);

      if (existingHoliday) {
        await timesheetsApi.deleteHoliday(existingHoliday.id);
        setHolidays(prev => prev.filter(h => h.id !== existingHoliday.id));
        toast.success('Holiday removed');
      } else {
        const newHoliday = await timesheetsApi.createHoliday({
          date: dateStr,
          name: 'Holiday'
        });
        setHolidays(prev => [...prev, newHoliday]);
        toast.success('Holiday added');
      }
    } catch (error) {
      console.error('Failed to toggle holiday:', error);
      toast.error('Failed to update holiday');
    }
  };

  // Get hours for an employee on a specific date
  const getHours = useCallback((employeeId, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const entry = timesheets.find(ts => 
      ts.employee_id === employeeId && ts.date === dateStr
    );
    const status = getDayStatus(employeeId, date);
    const isHolidayDay = isHoliday(date);
    
    if (isHolidayDay && status === STATUS_TYPES.WORK) {
      return {
        startTime: '',
        endTime: '',
        regularHours: 0,
        overtimeHours: 0,
        holidayOvertimeHours: 0,
        totalHours: 0,
        breakMinutes: 60,
        status: STATUS_TYPES.HOLIDAY
      };
    }
    
    if (status !== STATUS_TYPES.WORK) {
      const statusConfig = STATUS_CONFIG[status];
      return {
        startTime: '09:00',
        endTime: '17:00',
        regularHours: statusConfig.hours,
        overtimeHours: 0,
        holidayOvertimeHours: 0,
        totalHours: statusConfig.hours,
        breakMinutes: 60,
        status: status
      };
    }
    
    if (!entry) {
      return {
        startTime: '',
        endTime: '',
        regularHours: 0,
        overtimeHours: 0,
        holidayOvertimeHours: 0,
        totalHours: 0,
        breakMinutes: 60,
        status: STATUS_TYPES.WORK
      };
    }
    
    return {
      startTime: entry.start_time || '',
      endTime: entry.end_time || '',
      regularHours: entry.regular_hours || 0,
      overtimeHours: entry.overtime_hours || 0,
      holidayOvertimeHours: entry.holiday_overtime_hours || 0,
      totalHours: entry.total_hours || 0,
      breakMinutes: entry.break_minutes || 60,
      status: entry.status || STATUS_TYPES.WORK
    };
  }, [timesheets, getDayStatus, isHoliday]);

  // Calculate monthly totals for an employee
  const calculateEmployeeTotals = useCallback((employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return { totalRegular: 0, totalOvertime: 0, totalHolidayOvertime: 0, totalHours: 0, totalDaysWorked: 0, totalPay: 0 };
    
    let totalRegular = 0;
    let totalOvertime = 0;
    let totalHolidayOvertime = 0;
    let totalDaysWorked = 0;

    daysInMonth.forEach(day => {
      const hours = getHours(employeeId, day);
      if (hours.totalHours > 0) {
        totalDaysWorked++;
      }
      totalRegular += hours.regularHours;
      totalOvertime += hours.overtimeHours;
      totalHolidayOvertime += hours.holidayOvertimeHours;
    });

    const totalHours = totalRegular + totalOvertime + totalHolidayOvertime;
    const totalPay = (totalRegular * employee.rate) + 
                   (totalOvertime * employee.rate * 1.5) + 
                   (totalHolidayOvertime * employee.rate * settings.holidayOvertimeRate);

    return {
      totalRegular,
      totalOvertime,
      totalHolidayOvertime,
      totalHours,
      totalDaysWorked,
      totalPay
    };
  }, [employees, daysInMonth, getHours, settings.holidayOvertimeRate]);

  // Calculate overall monthly totals
  const calculateMonthlyTotals = useCallback(() => {
    let totalRegular = 0;
    let totalOvertime = 0;
    let totalHolidayOvertime = 0;
    let totalHours = 0;
    let totalPay = 0;
    let totalDaysWorked = 0;

    employees.forEach(employee => {
      const totals = calculateEmployeeTotals(employee.id);
      totalRegular += totals.totalRegular;
      totalOvertime += totals.totalOvertime;
      totalHolidayOvertime += totals.totalHolidayOvertime;
      totalHours += totals.totalHours;
      totalPay += totals.totalPay;
      totalDaysWorked += totals.totalDaysWorked;
    });

    return { totalRegular, totalOvertime, totalHolidayOvertime, totalHours, totalPay, totalDaysWorked };
  }, [employees, calculateEmployeeTotals]);

  // Quick add common shifts
  const quickAddShift = useCallback((employeeId, date, shiftType) => {
    const shifts = {
      'standard': { start: '09:00', end: '17:00', break: 60 },
      'early': { start: '07:00', end: '15:00', break: 30 },
      'late': { start: '12:00', end: '20:00', break: 45 },
      'double': { start: '08:00', end: '20:00', break: 60 }
    };
    
    const shift = shifts[shiftType];
    if (shift) {
      updateTimeEntry(employeeId, date, 'startTime', shift.start);
      updateTimeEntry(employeeId, date, 'endTime', shift.end);
      updateTimeEntry(employeeId, date, 'breakMinutes', shift.break);
    }
  }, [updateTimeEntry]);

  // Add new employee
  const addEmployee = async (employeeData) => {
    try {
      const newEmployee = await timesheetsApi.createEmployee({
        ...employeeData,
        color: COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)]
      });
      
      setEmployees(prev => [...prev, newEmployee]);
      toast.success(`Employee ${employeeData.name} added successfully`);
    } catch (error) {
      console.error('Failed to add employee:', error);
      toast.error('Failed to add employee');
    }
  };

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee) return;

      await timesheetsApi.deleteEmployee(employeeId);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      
      // Remove related timesheets and leave days from state
      setTimesheets(prev => prev.filter(ts => ts.employee_id !== employeeId));
      setLeaveDays(prev => prev.filter(ld => ld.employee_id !== employeeId));
      
      toast.success(`Employee ${employee.name} deleted successfully`);
    } catch (error) {
      console.error('Failed to delete employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  // Apply shift to date range
  const applyShiftToRange = async (employeeId, startDate, endDate, shift) => {
    try {
      const bulkData = {
        employee_id: employeeId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        start_time: shift.start,
        end_time: shift.end,
        break_minutes: shift.break
      };

      const results = await timesheetsApi.applyShiftToRange(bulkData);
      setTimesheets(prev => [...prev, ...results]);
      toast.success(`Applied ${shift.name} to selected range`);
    } catch (error) {
      console.error('Failed to apply shift to range:', error);
      toast.error('Failed to apply shift to range');
    }
  };

  // Copy previous day's times
  const copyPreviousDay = useCallback((employeeId, currentDate) => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    const prevHours = getHours(employeeId, prevDate);
    
    if (prevHours.totalHours > 0) {
      updateTimeEntry(employeeId, currentDate, 'startTime', prevHours.startTime);
      updateTimeEntry(employeeId, currentDate, 'endTime', prevHours.endTime);
      updateTimeEntry(employeeId, currentDate, 'breakMinutes', prevHours.breakMinutes);
      toast.success('Copied previous day\'s times');
    } else {
      toast.error('No previous day data found');
    }
  }, [getHours, updateTimeEntry]);

  // Start/stop timer
  const toggleTimer = useCallback((employeeId, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const timerKey = `${employeeId}-${dateStr}`;
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    setActiveTimers(prev => {
      const newTimers = { ...prev };
      
      if (newTimers[timerKey]) {
        // Stop timer and set end time
        updateTimeEntry(employeeId, date, 'endTime', currentTime);
        delete newTimers[timerKey];
        toast.success('Timer stopped');
      } else {
        // Start timer and set start time
        updateTimeEntry(employeeId, date, 'startTime', currentTime);
        newTimers[timerKey] = now.getTime();
        toast.success('Timer started');
      }
      
      return newTimers;
    });
  }, [updateTimeEntry]);

  // Get timer status
  const getTimerStatus = useCallback((employeeId, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const timerKey = `${employeeId}-${dateStr}`;
    return activeTimers[timerKey];
  }, [activeTimers]);

  // Quick fill current time
  const fillCurrentTime = useCallback((employeeId, date, field) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    updateTimeEntry(employeeId, date, field, currentTime);
    toast.success(`Set ${field} to current time`);
  }, [updateTimeEntry]);

  // Enhanced Time Input Component
  const TimeInput = React.memo(({ 
    value, 
    onChange, 
    placeholder, 
    disabled,
    className = '',
    onNowClick,
    showQuickActions = false
  }) => {
    const handleChange = (e) => {
      const formattedValue = formatTimeInput(e.target.value);
      onChange(formattedValue);
    };

    const handleBlur = (e) => {
      const time = e.target.value;
      if (time && isValidTime(time)) {
        const [hours, minutes] = time.split(':');
        const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        onChange(formattedTime);
      }
    };

    return (
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-7 text-xs pr-8 ${className} ${
            value && !isValidTime(value) ? 'border-red-500' : ''
          } ${settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}`}
        />
        {showQuickActions && onNowClick && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-7 w-7 p-0 hover:bg-transparent"
                  onClick={onNowClick}
                  disabled={disabled}
                >
                  <Clock className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Set to current time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  });

  TimeInput.displayName = 'TimeInput';

  // Status Badge Component
  const StatusBadge = React.memo(({ status }) => {
    const config = STATUS_CONFIG[status];
    if (!config) return null;
    
    return (
      <Badge variant="secondary" className={`text-xs ${config.color}`}>
        {config.label}
      </Badge>
    );
  });

  StatusBadge.displayName = 'StatusBadge';

  // Enhanced Day Cell Component
  const DayCell = React.memo(({ employeeId, day, hours }) => {
    const isHolidayDay = isHoliday(day);
    const status = hours.status;
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const isToday = day.toDateString() === new Date().toDateString();
    const hasTimer = getTimerStatus(employeeId, day);
    
    return (
      <td className={`text-center p-1 ${
        isWeekend ? (settings.darkMode ? 'bg-slate-700/50' : 'bg-slate-50') : ''
      } ${
        isHolidayDay ? (settings.darkMode ? 'bg-purple-900/20' : 'bg-purple-50') : ''
      } ${
        isToday ? (settings.darkMode ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-500') : ''
      }`}>
        <div className="space-y-1">
          {/* Date and Status */}
          <div className="flex justify-between items-center px-1">
            <div className={`text-xs font-medium ${
              isToday ? 'text-blue-600 font-bold' : 
              settings.darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {day.getDate()}
            </div>
            <div className="flex gap-1">
              {isHolidayDay && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <PartyPopper className="w-3 h-3 text-purple-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Holiday</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Timer Button */}
          {settings.enableTimer && status === STATUS_TYPES.WORK && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={hasTimer ? "destructive" : "outline"}
                    size="sm"
                    className={`h-6 w-full text-xs ${
                      hasTimer ? 'animate-pulse' : ''
                    }`}
                    onClick={() => toggleTimer(employeeId, day)}
                  >
                    {hasTimer ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{hasTimer ? 'Stop timer' : 'Start timer'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Time Inputs */}
          <div className="space-y-1">
            <TimeInput
              value={hours.startTime}
              onChange={(value) => updateTimeEntry(employeeId, day, 'startTime', value)}
              placeholder="09:00"
              disabled={status !== STATUS_TYPES.WORK}
              showQuickActions={true}
              onNowClick={() => fillCurrentTime(employeeId, day, 'startTime')}
            />
            <TimeInput
              value={hours.endTime}
              onChange={(value) => updateTimeEntry(employeeId, day, 'endTime', value)}
              placeholder="17:00"
              disabled={status !== STATUS_TYPES.WORK}
              showQuickActions={true}
              onNowClick={() => fillCurrentTime(employeeId, day, 'endTime')}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1 justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyPreviousDay(employeeId, day)}
                    disabled={status !== STATUS_TYPES.WORK}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy previous day</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Zap className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className={settings.darkMode ? 'bg-slate-800' : ''}>
                <DialogHeader>
                  <DialogTitle>Quick Actions</DialogTitle>
                  <DialogDescription>
                    Quick actions for {day.toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Set Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
                        <Button
                          key={statusKey}
                          variant={hours.status === statusKey ? "default" : "outline"}
                          onClick={() => updateDayStatus(employeeId, day, statusKey)}
                          className="justify-start"
                        >
                          {config.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Quick Shifts</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {SHIFT_PRESETS.map(preset => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          onClick={() => {
                            updateTimeEntry(employeeId, day, 'startTime', preset.start);
                            updateTimeEntry(employeeId, day, 'endTime', preset.end);
                            updateTimeEntry(employeeId, day, 'breakMinutes', preset.break);
                          }}
                          disabled={status !== STATUS_TYPES.WORK}
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Hours Display */}
          <div className={`text-xs font-medium ${
            hours.holidayOvertimeHours > 0 ? 'text-purple-600' :
            hours.overtimeHours > 0 ? 'text-orange-600' : 
            hours.totalHours > 0 ? 'text-green-600' :
            settings.darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {hours.totalHours > 0 ? `${hours.totalHours.toFixed(1)}h` : '-'}
            {hours.overtimeHours > 0 && ` (+${hours.overtimeHours.toFixed(1)})`}
            {hours.holidayOvertimeHours > 0 && ` (+${hours.holidayOvertimeHours.toFixed(1)} HOT)`}
          </div>
        </div>
      </td>
    );
  });

  DayCell.displayName = 'DayCell';

  // Quick Entry Panel Component
  const QuickEntryPanel = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(employees[0]?.id);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
      // Set default dates to current week
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
      
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() - today.getDay() + 5); // Friday
      
      setStartDate(startOfWeek.toISOString().split('T')[0]);
      setEndDate(endOfWeek.toISOString().split('T')[0]);
    }, []);

    const applyToRange = () => {
      if (!selectedEmployee || !startDate || !endDate) {
        toast.error('Please select employee and date range');
        return;
      }

      applyShiftToRange(selectedEmployee, new Date(startDate), new Date(endDate), selectedShift);
    };

    return (
      <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
        <CardHeader>
          <CardTitle>Quick Shift Entry</CardTitle>
          <CardDescription>Apply shifts to multiple days quickly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Shift Preset</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {SHIFT_PRESETS.map(preset => (
                <Button
                  key={preset.name}
                  variant={selectedShift.name === preset.name ? "default" : "outline"}
                  onClick={() => setSelectedShift(preset)}
                  className="h-16"
                >
                  <div className="text-xs">
                    <div className="font-semibold">{preset.name}</div>
                    <div>{preset.start} - {preset.end}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={applyToRange} className="w-full" size="lg">
            <FastForward className="w-4 h-4 mr-2" />
            Apply to Selected Range
          </Button>

          <div className="text-xs text-slate-500 text-center">
            This will apply the selected shift to all weekdays in the date range
          </div>
        </CardContent>
      </Card>
    );
  };

  // Add Employee Form Component
  const AddEmployeeForm = ({ onAdd, onCancel }) => {
    const [formData, setFormData] = useState({
      name: '',
      department: '',
      rate: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.department || !formData.rate) {
        toast.error('Please fill in all fields');
        return;
      }
      
      onAdd({
        name: formData.name,
        department: formData.department,
        rate: parseFloat(formData.rate)
      });
      
      setFormData({ name: '', department: '', rate: '' });
    };

    return (
      <DialogContent className={settings.darkMode ? 'bg-slate-800' : ''}>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Enter the employee details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Smith"
              className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={formData.department} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
            >
              <SelectTrigger className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rate">Hourly Rate ($)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              value={formData.rate}
              onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
              placeholder="85.00"
              className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Add Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    );
  };

  // Filtered employees based on search and department
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      if (filters.department !== 'all' && employee.department !== filters.department) return false;
      if (filters.search && !employee.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [employees, filters.department, filters.search]);

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading Timesheets System...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const monthlyTotals = calculateMonthlyTotals();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className={`min-h-screen p-6 transition-colors ${
      settings.darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/20'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshData}
                      disabled={!isOnline}
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
                {isOnline ? <Cloud className="w-3 h-3" /> : <CloudOff className="w-3 h-3" />}
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Timesheets Pro
                </h1>
                <p className="text-slate-600 mt-2">FastAPI Backend • Real-time Sync</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={quickEntryMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuickEntryMode(!quickEntryMode)}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Quick Entry
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {quickEntryMode ? 'Exit quick entry mode' : 'Enter quick entry mode'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newSettings = { ...settings, darkMode: !settings.darkMode };
                        setSettings(newSettings);
                      }}
                    >
                      {settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {settings.darkMode ? 'Light mode' : 'Dark mode'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-5xl mx-auto mb-6">
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{monthlyTotals.totalHours.toFixed(1)}h</div>
                <div className="text-xs text-slate-500">Total Hours</div>
              </CardContent>
            </Card>
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-orange-600">{monthlyTotals.totalOvertime.toFixed(1)}h</div>
                <div className="text-xs text-slate-500">Overtime</div>
              </CardContent>
            </Card>
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-purple-600">{monthlyTotals.totalHolidayOvertime.toFixed(1)}h</div>
                <div className="text-xs text-slate-500">Holiday OT</div>
              </CardContent>
            </Card>
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-green-600">${monthlyTotals.totalPay.toFixed(0)}</div>
                <div className="text-xs text-slate-500">Payroll</div>
              </CardContent>
            </Card>
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-pink-600">{monthlyTotals.totalDaysWorked}</div>
                <div className="text-xs text-slate-500">Days Worked</div>
              </CardContent>
            </Card>
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-indigo-600">{employees.length}</div>
                <div className="text-xs text-slate-500">Employees</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Entry Panel */}
        {quickEntryMode && (
          <div className="mb-6">
            <QuickEntryPanel />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full grid-cols-4 p-1 rounded-lg ${
            settings.darkMode ? 'bg-slate-800' : 'bg-slate-100'
          }`}>
            <TabsTrigger value="monthly-view" className="rounded-md">
              <Calendar className="w-4 h-4 mr-2" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="summary" className="rounded-md">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="quick-shifts" className="rounded-md">
              <Zap className="w-4 h-4 mr-2" />
              Quick Shifts
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-md">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Monthly Grid View Tab */}
          <TabsContent value="monthly-view">
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={previousMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <CardTitle>{monthName}</CardTitle>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search employees..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className={`w-48 ${settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}`}
                      />
                    </div>
                    <Select 
                      value={filters.department} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger className={`w-32 ${settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}`}>
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {DEPARTMENTS.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Employee
                        </Button>
                      </DialogTrigger>
                      <AddEmployeeForm 
                        onAdd={addEmployee}
                        onCancel={() => {}} 
                      />
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className={`border-b-2 ${settings.darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <th className={`text-left p-3 font-semibold sticky left-0 z-10 ${
                          settings.darkMode ? 'bg-slate-800' : 'bg-slate-50'
                        }`}>
                          Employee
                        </th>
                        {daysInMonth.map(day => {
                          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                          if (!settings.showWeekends && isWeekend) return null;
                          const isHolidayDay = isHoliday(day);
                          const isToday = day.toDateString() === new Date().toDateString();
                          
                          return (
                            <th key={day.toISOString()} className={`text-center p-2 font-semibold min-w-32 ${
                              isWeekend ? (settings.darkMode ? 'bg-slate-700' : 'bg-slate-50') : ''
                            } ${
                              isHolidayDay ? (settings.darkMode ? 'bg-purple-900/30' : 'bg-purple-100') : ''
                            } ${
                              isToday ? (settings.darkMode ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-500') : ''
                            }`}>
                              <div className="text-sm">{day.getDate()}</div>
                              <div className={`text-xs font-normal ${
                                settings.darkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                {day.toLocaleDateString('default', { weekday: 'short' })}
                              </div>
                              {isHolidayDay && (
                                <div className="text-xs text-purple-500 mt-1">
                                  Holiday
                                </div>
                              )}
                              {isToday && (
                                <div className="text-xs text-blue-500 mt-1 font-semibold">
                                  Today
                                </div>
                              )}
                            </th>
                          );
                        }).filter(Boolean)}
                        <th className={`text-center p-3 font-semibold min-w-24 ${
                          settings.darkMode ? 'bg-slate-800' : 'bg-slate-50'
                        }`}>
                          Total
                        </th>
                        <th className={`text-center p-3 font-semibold min-w-24 ${
                          settings.darkMode ? 'bg-slate-800' : 'bg-slate-50'
                        }`}>
                          Overtime
                        </th>
                        <th className={`text-center p-3 font-semibold min-w-24 ${
                          settings.darkMode ? 'bg-slate-800' : 'bg-slate-50'
                        }`}>
                          Holiday OT
                        </th>
                        <th className={`text-center p-3 font-semibold min-w-24 ${
                          settings.darkMode ? 'bg-slate-800' : 'bg-slate-50'
                        }`}>
                          Amount
                        </th>
                        <th className={`text-center p-3 font-semibold min-w-16 ${
                          settings.darkMode ? 'bg-slate-800' : 'bg-slate-50'
                        }`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map(employee => {
                        const totals = calculateEmployeeTotals(employee.id);
                        
                        return (
                          <tr key={employee.id} className={`border-b ${
                            settings.darkMode ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'
                          }`}>
                            {/* Employee Name */}
                            <td className={`p-3 font-medium sticky left-0 z-10 ${
                              settings.darkMode ? 'bg-slate-800' : 'bg-white'
                            }`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 ${employee.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div>{employee.name}</div>
                                  <div className={`text-xs ${
                                    settings.darkMode ? 'text-slate-400' : 'text-slate-500'
                                  }`}>
                                    {employee.department} • ${employee.rate}/h
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            {/* Daily Cells */}
                            {daysInMonth.map(day => {
                              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                              if (!settings.showWeekends && isWeekend) return null;
                              
                              const hours = getHours(employee.id, day);
                              return (
                                <DayCell
                                  key={day.toISOString()}
                                  employeeId={employee.id}
                                  day={day}
                                  hours={hours}
                                />
                              );
                            }).filter(Boolean)}
                            
                            {/* Monthly Totals */}
                            <td className="text-center p-3 font-semibold bg-blue-500/10 text-blue-600">
                              {totals.totalHours.toFixed(1)}h
                            </td>
                            <td className="text-center p-3 font-semibold bg-orange-500/10 text-orange-600">
                              {totals.totalOvertime.toFixed(1)}h
                            </td>
                            <td className="text-center p-3 font-semibold bg-purple-500/10 text-purple-600">
                              {totals.totalHolidayOvertime.toFixed(1)}h
                            </td>
                            <td className="text-center p-3 font-semibold bg-green-500/10 text-green-600">
                              ${totals.totalPay.toFixed(0)}
                            </td>
                            
                            {/* Actions */}
                            <td className="text-center p-3">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete ${employee.name}? This will also remove all their timesheet data.`)) {
                                          deleteEmployee(employee.id);
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete Employee</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="summary">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Stats */}
              <div className="lg:col-span-2 space-y-6">
                <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                  <CardHeader>
                    <CardTitle>Monthly Overview</CardTitle>
                    <CardDescription>Performance and utilization metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Progress Bars */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Regular Hours</span>
                            <span>{monthlyTotals.totalRegular.toFixed(1)}h</span>
                          </div>
                          <Progress value={(monthlyTotals.totalRegular / (monthlyTotals.totalHours || 1)) * 100} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-orange-600">Overtime Hours</span>
                            <span className="text-orange-600">{monthlyTotals.totalOvertime.toFixed(1)}h</span>
                          </div>
                          <Progress value={(monthlyTotals.totalOvertime / (monthlyTotals.totalHours || 1)) * 100} className="bg-orange-100" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-purple-600">Holiday Overtime Hours</span>
                            <span className="text-purple-600">{monthlyTotals.totalHolidayOvertime.toFixed(1)}h</span>
                          </div>
                          <Progress value={(monthlyTotals.totalHolidayOvertime / (monthlyTotals.totalHours || 1)) * 100} className="bg-purple-100" />
                        </div>
                      </div>

                      {/* Employee Performance */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Employee Performance</h4>
                        {employees.map(employee => {
                          const totals = calculateEmployeeTotals(employee.id);
                          return (
                            <div key={employee.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                              settings.darkMode ? 'border-slate-700' : ''
                            }`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 ${employee.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="font-medium">{employee.name}</div>
                                  <div className="text-sm text-slate-500">{employee.department}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{totals.totalHours.toFixed(1)}h</div>
                                <div className="text-sm text-slate-500">${totals.totalPay.toFixed(0)}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Insights */}
              <div className="space-y-6">
                <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                  <CardHeader>
                    <CardTitle>Quick Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-200">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-600">Productivity High</div>
                        <div className="text-sm text-slate-600">Team is 15% above average</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-200">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-semibold text-orange-600">Overtime Alert</div>
                        <div className="text-sm text-slate-600">2 employees exceeding limits</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-200">
                      <PartyPopper className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-semibold text-purple-600">Holiday Work</div>
                        <div className="text-sm text-slate-600">{monthlyTotals.totalHolidayOvertime.toFixed(1)}h at 2.0x rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Backend Connection</span>
                        <Badge variant={isOnline ? "default" : "destructive"}>
                          {isOnline ? 'Connected' : 'Offline'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Employees</span>
                        <span className="font-semibold">{employees.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">This Month Hours</span>
                        <span className="font-semibold">{monthlyTotals.totalHours.toFixed(1)}h</span>
                      </div>
                      <Button onClick={refreshData} className="w-full" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                  <CardHeader>
                    <CardTitle>Manage Employees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add New Employee
                        </Button>
                      </DialogTrigger>
                      <AddEmployeeForm 
                        onAdd={addEmployee}
                        onCancel={() => {}} 
                      />
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Quick Shifts Tab */}
          <TabsContent value="quick-shifts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuickEntryPanel />
              
              <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                <CardHeader>
                  <CardTitle>Quick Individual Shifts</CardTitle>
                  <CardDescription>Add common shifts quickly for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {employees.map(employee => (
                      <div key={employee.id} className={`p-4 rounded-lg border ${
                        settings.darkMode ? 'border-slate-700' : 'border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${employee.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-slate-500">{employee.department}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {SHIFT_PRESETS.slice(0, 3).map(preset => (
                              <TooltipProvider key={preset.name}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const today = new Date();
                                        updateTimeEntry(employee.id, today, 'startTime', preset.start);
                                        updateTimeEntry(employee.id, today, 'endTime', preset.end);
                                        updateTimeEntry(employee.id, today, 'breakMinutes', preset.break);
                                        toast.success(`Applied ${preset.name} to ${employee.name}`);
                                      }}
                                    >
                                      {preset.name}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{preset.start} - {preset.end}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure timesheet preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-overtime" className="font-semibold">Auto Overtime Calculation</Label>
                        <div className="text-sm text-slate-500">Automatically calculate overtime after threshold</div>
                      </div>
                      <Switch
                        id="auto-overtime"
                        checked={settings.autoOvertime}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({ ...prev, autoOvertime: checked }));
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overtime-threshold">Overtime Threshold (hours)</Label>
                      <Input
                        id="overtime-threshold"
                        type="number"
                        value={settings.overtimeThreshold}
                        onChange={(e) => {
                          setSettings(prev => ({ ...prev, overtimeThreshold: parseInt(e.target.value) || 8 }));
                        }}
                        className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
                        disabled={!settings.autoOvertime}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="holiday-overtime-rate">Holiday Overtime Rate</Label>
                      <Input
                        id="holiday-overtime-rate"
                        type="number"
                        step="0.1"
                        value={settings.holidayOvertimeRate}
                        onChange={(e) => {
                          setSettings(prev => ({ ...prev, holidayOvertimeRate: parseFloat(e.target.value) || 2.0 }));
                        }}
                        className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-timer" className="font-semibold">Enable Timer Feature</Label>
                        <div className="text-sm text-slate-500">Show start/stop timer buttons</div>
                      </div>
                      <Switch
                        id="enable-timer"
                        checked={settings.enableTimer}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({ ...prev, enableTimer: checked }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-copy-previous" className="font-semibold">Auto Copy Previous Day</Label>
                        <div className="text-sm text-slate-500">Suggest copying previous day's times</div>
                      </div>
                      <Switch
                        id="auto-copy-previous"
                        checked={settings.autoCopyPrevious}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({ ...prev, autoCopyPrevious: checked }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-weekends" className="font-semibold">Show Weekends</Label>
                        <div className="text-sm text-slate-500">Display Saturday and Sunday columns</div>
                      </div>
                      <Switch
                        id="show-weekends"
                        checked={settings.showWeekends}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({ ...prev, showWeekends: checked }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode" className="font-semibold">Dark Mode</Label>
                        <div className="text-sm text-slate-500">Switch to dark color scheme</div>
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({ ...prev, darkMode: checked }));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Backend connection and data status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span>Backend Status</span>
                      <Badge variant={isOnline ? "default" : "destructive"}>
                        {isOnline ? 'Connected' : 'Offline'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span>Total Employees</span>
                      <span className="font-semibold">{employees.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span>Timesheet Entries</span>
                      <span className="font-semibold">{timesheets.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span>Holidays</span>
                      <span className="font-semibold">{holidays.length}</span>
                    </div>
                    
                    <Button onClick={refreshData} className="w-full" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh All Data
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        if (confirm('This will reload all data from the server. Continue?')) {
                          loadAllData();
                        }
                      }}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Reload from Server
                    </Button>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    <p>Connected to: {API_BASE_URL}</p>
                    <p>All data is synchronized with the FastAPI backend.</p>
                    <p>Changes are saved automatically to the server.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TimesheetsSystem;