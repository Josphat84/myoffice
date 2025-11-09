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
  Trash2
} from 'lucide-react';

// Initial employees data
const INITIAL_EMPLOYEES = [
  { id: 1, name: 'John Smith', department: 'Engineering', rate: 85, color: 'bg-blue-500' },
  { id: 2, name: 'Sarah Johnson', department: 'Design', rate: 75, color: 'bg-purple-500' },
  { id: 3, name: 'Mike Chen', department: 'Management', rate: 100, color: 'bg-green-500' },
  { id: 4, name: 'Emily Davis', department: 'Marketing', rate: 65, color: 'bg-pink-500' },
  { id: 5, name: 'David Wilson', department: 'Engineering', rate: 80, color: 'bg-orange-500' }
];

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

const TimesheetsSystem = () => {
  const [isClient, setIsClient] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [timesheets, setTimesheets] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [leaveDays, setLeaveDays] = useState({});
  const [activeTab, setActiveTab] = useState('monthly-view');
  const [settings, setSettings] = useState({
    autoOvertime: true,
    overtimeThreshold: 8,
    darkMode: false,
    showWeekends: true,
    holidayOvertimeRate: 2.0
  });
  const [filters, setFilters] = useState({
    department: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize component with localStorage data
  useEffect(() => {
    setIsClient(true);
    loadAllData();
  }, []);

  // Load all data from localStorage
  const loadAllData = () => {
    try {
      setIsLoading(true);
      
      // Load employees
      const savedEmployees = localStorage.getItem('timesheets-employees');
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      } else {
        setEmployees(INITIAL_EMPLOYEES);
        localStorage.setItem('timesheets-employees', JSON.stringify(INITIAL_EMPLOYEES));
      }

      // Load timesheets
      const savedTimesheets = localStorage.getItem('timesheets-data');
      setTimesheets(savedTimesheets ? JSON.parse(savedTimesheets) : {});

      // Load holidays
      const savedHolidays = localStorage.getItem('timesheets-holidays');
      setHolidays(savedHolidays ? JSON.parse(savedHolidays) : []);

      // Load leave days
      const savedLeaveDays = localStorage.getItem('timesheets-leaveDays');
      setLeaveDays(savedLeaveDays ? JSON.parse(savedLeaveDays) : {});

      // Load settings
      const savedSettings = localStorage.getItem('timesheets-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Initialize with default data
      setEmployees(INITIAL_EMPLOYEES);
      setTimesheets({});
      setHolidays([]);
      setLeaveDays({});
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to localStorage
  const saveData = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
      toast.error('Failed to save changes');
    }
  }, []);

  // Save employees
  const saveEmployees = useCallback((newEmployees) => {
    setEmployees(newEmployees);
    saveData('timesheets-employees', newEmployees);
  }, [saveData]);

  // Save timesheets
  const saveTimesheets = useCallback((newTimesheets) => {
    setTimesheets(newTimesheets);
    saveData('timesheets-data', newTimesheets);
  }, [saveData]);

  // Save holidays
  const saveHolidays = useCallback((newHolidays) => {
    setHolidays(newHolidays);
    saveData('timesheets-holidays', newHolidays);
  }, [saveData]);

  // Save leave days
  const saveLeaveDays = useCallback((newLeaveDays) => {
    setLeaveDays(newLeaveDays);
    saveData('timesheets-leaveDays', newLeaveDays);
  }, [saveData]);

  // Save settings
  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    saveData('timesheets-settings', newSettings);
  }, [saveData]);

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
    const employeeLeaveDays = leaveDays[employeeId] || {};
    return employeeLeaveDays[dateStr] || STATUS_TYPES.WORK;
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
    // Remove non-numeric characters
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
  const calculateHoursFromTimes = useCallback((employeeId, dateStr, entry) => {
    if (!entry.startTime || !entry.endTime || !isValidTime(entry.startTime) || !isValidTime(entry.endTime)) {
      entry.regularHours = 0;
      entry.overtimeHours = 0;
      entry.holidayOvertimeHours = 0;
      entry.totalHours = 0;
      return;
    }

    const [startHours, startMinutes] = entry.startTime.split(':').map(Number);
    const [endHours, endMinutes] = entry.endTime.split(':').map(Number);
    
    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    totalMinutes -= entry.breakMinutes || 0;
    
    const totalHours = Math.max(0, totalMinutes / 60);
    const date = new Date(dateStr);
    const isHolidayDay = isHoliday(date);
    
    if (isHolidayDay) {
      // Holiday work gets special overtime rate
      entry.regularHours = 0;
      entry.overtimeHours = 0;
      entry.holidayOvertimeHours = totalHours;
    } else if (settings.autoOvertime && totalHours > settings.overtimeThreshold) {
      entry.regularHours = settings.overtimeThreshold;
      entry.overtimeHours = totalHours - settings.overtimeThreshold;
      entry.holidayOvertimeHours = 0;
    } else {
      entry.regularHours = totalHours;
      entry.overtimeHours = 0;
      entry.holidayOvertimeHours = 0;
    }
    
    entry.totalHours = totalHours;
  }, [isHoliday, settings.autoOvertime, settings.overtimeThreshold]);

  // Update time entry
  const updateTimeEntry = useCallback((employeeId, date, field, value) => {
    const dateStr = date.toISOString().split('T')[0];
    setTimesheets(prev => {
      const newData = {
        ...prev,
        [employeeId]: {
          ...prev[employeeId],
          [dateStr]: {
            ...prev[employeeId]?.[dateStr],
            [field]: value,
            status: STATUS_TYPES.WORK // Reset to work when updating times
          }
        }
      };
      
      // Recalculate hours if times are updated
      const entry = newData[employeeId]?.[dateStr];
      if (entry && (field === 'startTime' || field === 'endTime' || field === 'breakMinutes')) {
        calculateHoursFromTimes(employeeId, dateStr, entry);
      }
      
      // Save to localStorage
      saveTimesheets(newData);
      
      return newData;
    });
  }, [calculateHoursFromTimes, saveTimesheets]);

  // Update day status (leave, off, absent, etc.)
  const updateDayStatus = useCallback((employeeId, date, status) => {
    const dateStr = date.toISOString().split('T')[0];
    
    if (status === STATUS_TYPES.WORK) {
      // Remove from leave days and clear timesheet entry
      setLeaveDays(prev => {
        const newLeaveDays = { ...prev };
        if (newLeaveDays[employeeId]) {
          delete newLeaveDays[employeeId][dateStr];
        }
        saveLeaveDays(newLeaveDays);
        return newLeaveDays;
      });
      
      setTimesheets(prev => {
        const newData = { ...prev };
        if (newData[employeeId]?.[dateStr]) {
          delete newData[employeeId][dateStr];
        }
        saveTimesheets(newData);
        return newData;
      });
    } else {
      // Add to leave days and set automatic hours
      setLeaveDays(prev => {
        const newLeaveDays = {
          ...prev,
          [employeeId]: {
            ...prev[employeeId],
            [dateStr]: status
          }
        };
        saveLeaveDays(newLeaveDays);
        return newLeaveDays;
      });
      
      // Set automatic hours for leave/off days
      const statusConfig = STATUS_CONFIG[status];
      if (statusConfig.hours > 0) {
        setTimesheets(prev => {
          const newData = {
            ...prev,
            [employeeId]: {
              ...prev[employeeId],
              [dateStr]: {
                startTime: '09:00',
                endTime: '17:00',
                breakMinutes: 60,
                regularHours: statusConfig.hours,
                overtimeHours: 0,
                holidayOvertimeHours: 0,
                totalHours: statusConfig.hours,
                status: status
              }
            }
          };
          saveTimesheets(newData);
          return newData;
        });
      }
    }
  }, [saveLeaveDays, saveTimesheets]);

  // Add/remove holiday
  const toggleHoliday = useCallback((date) => {
    const dateStr = date.toISOString().split('T')[0];
    setHolidays(prev => {
      const isCurrentlyHoliday = prev.some(holiday => holiday.date === dateStr);
      let newHolidays;
      
      if (isCurrentlyHoliday) {
        newHolidays = prev.filter(holiday => holiday.date !== dateStr);
      } else {
        newHolidays = [...prev, { date: dateStr, name: 'Holiday' }];
      }
      
      saveHolidays(newHolidays);
      return newHolidays;
    });
  }, [saveHolidays]);

  // Get hours for an employee on a specific date
  const getHours = useCallback((employeeId, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const entry = timesheets[employeeId]?.[dateStr];
    const status = getDayStatus(employeeId, date);
    const isHolidayDay = isHoliday(date);
    
    if (isHolidayDay && status === STATUS_TYPES.WORK) {
      // Default holiday entry
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
      // Leave/off/absent day
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
      ...entry,
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
  const addEmployee = useCallback((employeeData) => {
    const newEmployee = {
      id: Date.now(), // Simple ID generation
      ...employeeData,
      color: COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)]
    };
    
    const newEmployees = [...employees, newEmployee];
    saveEmployees(newEmployees);
    toast.success(`Employee ${employeeData.name} added successfully`);
  }, [employees, saveEmployees]);

  // Delete employee
  const deleteEmployee = useCallback((employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const newEmployees = employees.filter(emp => emp.id !== employeeId);
    saveEmployees(newEmployees);
    
    // Also remove their timesheets and leave days
    setTimesheets(prev => {
      const newTimesheets = { ...prev };
      delete newTimesheets[employeeId];
      saveTimesheets(newTimesheets);
      return newTimesheets;
    });
    
    setLeaveDays(prev => {
      const newLeaveDays = { ...prev };
      delete newLeaveDays[employeeId];
      saveLeaveDays(newLeaveDays);
      return newLeaveDays;
    });
    
    toast.success(`Employee ${employee.name} deleted successfully`);
  }, [employees, saveEmployees, saveTimesheets, saveLeaveDays]);

  // Generate CSV content
  const generateCSV = (data, headers) => {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    );
    return [csvHeaders, ...csvRows].join('\n');
  };

  // Download CSV file
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate CSV report for individual employee
  const generateEmployeeCSV = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    const totals = calculateEmployeeTotals(employeeId);
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const headers = ['Date', 'Day', 'Start Time', 'End Time', 'Break (min)', 'Regular Hours', 'Overtime Hours', 'Holiday OT Hours', 'Total Hours', 'Status'];
    
    const data = daysInMonth.map(day => {
      const hours = getHours(employeeId, day);
      return [
        day.toISOString().split('T')[0],
        day.toLocaleDateString('en-US', { weekday: 'short' }),
        hours.startTime,
        hours.endTime,
        hours.breakMinutes,
        hours.regularHours.toFixed(1),
        hours.overtimeHours.toFixed(1),
        hours.holidayOvertimeHours.toFixed(1),
        hours.totalHours.toFixed(1),
        STATUS_CONFIG[hours.status]?.label || 'Work'
      ];
    });

    // Add summary row
    data.push([]);
    data.push(['SUMMARY', '', '', '', '', '', '', '', '', '']);
    data.push(['Total Regular Hours', '', '', '', '', totals.totalRegular.toFixed(1), '', '', '', '']);
    data.push(['Total Overtime Hours', '', '', '', '', '', totals.totalOvertime.toFixed(1), '', '', '']);
    data.push(['Total Holiday OT Hours', '', '', '', '', '', '', totals.totalHolidayOvertime.toFixed(1), '', '']);
    data.push(['Total Hours', '', '', '', '', '', '', '', totals.totalHours.toFixed(1), '']);
    data.push(['Total Amount', '', '', '', '', '', '', '', `$${totals.totalPay.toFixed(2)}`, '']);

    const csvContent = generateCSV(data, headers);
    downloadCSV(csvContent, `timesheet-${employee.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${monthName.toLowerCase().replace(' ', '-')}.csv`);
    toast.success(`CSV report generated for ${employee.name}`);
  };

  // Generate comprehensive CSV report
  const generateComprehensiveCSV = () => {
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Summary sheet
    const summaryHeaders = ['Employee', 'Department', 'Regular Hours', 'Overtime Hours', 'Holiday OT Hours', 'Total Hours', 'Total Amount'];
    const summaryData = employees.map(employee => {
      const totals = calculateEmployeeTotals(employee.id);
      return [
        employee.name,
        employee.department,
        totals.totalRegular.toFixed(1),
        totals.totalOvertime.toFixed(1),
        totals.totalHolidayOvertime.toFixed(1),
        totals.totalHours.toFixed(1),
        `$${totals.totalPay.toFixed(2)}`
      ];
    });

    // Add monthly totals
    const monthlyTotals = calculateMonthlyTotals();
    summaryData.push([]);
    summaryData.push(['MONTHLY TOTALS', '', 
      monthlyTotals.totalRegular.toFixed(1),
      monthlyTotals.totalOvertime.toFixed(1),
      monthlyTotals.totalHolidayOvertime.toFixed(1),
      monthlyTotals.totalHours.toFixed(1),
      `$${monthlyTotals.totalPay.toFixed(2)}`
    ]);

    const csvContent = generateCSV(summaryData, summaryHeaders);
    downloadCSV(csvContent, `timesheets-summary-${monthName.toLowerCase().replace(' ', '-')}.csv`);
    toast.success('Comprehensive CSV report generated!');
  };

  // Generate PDF report for individual employee
  const generateEmployeePDF = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    const totals = calculateEmployeeTotals(employeeId);
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Dynamically import jsPDF only when needed
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('EMPLOYEE TIMESHEET REPORT', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`${employee.name} - ${monthName}`, 105, 22, { align: 'center' });
      
      // Employee Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      let yPos = 40;
      
      doc.text(`Employee: ${employee.name}`, 20, yPos);
      doc.text(`Department: ${employee.department}`, 20, yPos + 7);
      doc.text(`Rate: $${employee.rate}/hour`, 20, yPos + 14);
      doc.text(`Month: ${monthName}`, 20, yPos + 21);
      
      yPos += 35;
      
      // Summary
      doc.setFontSize(12);
      doc.text('SUMMARY', 20, yPos);
      doc.setFontSize(10);
      doc.text(`Regular Hours: ${totals.totalRegular.toFixed(1)}`, 20, yPos + 10);
      doc.text(`Overtime Hours: ${totals.totalOvertime.toFixed(1)}`, 20, yPos + 17);
      doc.text(`Holiday Overtime Hours: ${totals.totalHolidayOvertime.toFixed(1)}`, 20, yPos + 24);
      doc.text(`Total Hours: ${totals.totalHours.toFixed(1)}`, 20, yPos + 31);
      doc.text(`Total Amount: $${totals.totalPay.toFixed(2)}`, 20, yPos + 38);
      
      yPos += 55;
      
      // Daily breakdown
      doc.setFontSize(12);
      doc.text('DAILY BREAKDOWN', 20, yPos);
      yPos += 10;
      
      daysInMonth.forEach(day => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        const hours = getHours(employeeId, day);
        const dayStr = day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        let hoursText = '-';
        if (hours.totalHours > 0) {
          hoursText = `${hours.totalHours.toFixed(1)}h`;
          if (hours.overtimeHours > 0) hoursText += ` (+${hours.overtimeHours.toFixed(1)} OT)`;
          if (hours.holidayOvertimeHours > 0) hoursText += ` (+${hours.holidayOvertimeHours.toFixed(1)} HOT)`;
        }
        
        doc.text(`${dayStr}: ${hoursText}`, 20, yPos);
        yPos += 7;
      });

      doc.save(`timesheet-${employee.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${monthName.toLowerCase().replace(' ', '-')}.pdf`);
      toast.success(`PDF report generated for ${employee.name}`);
    }).catch(error => {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF report');
    });
  };

  // Fast Time Input Component
  const TimeInput = React.memo(({ 
    value, 
    onChange, 
    placeholder, 
    disabled,
    className = ''
  }) => {
    const handleChange = (e) => {
      const formattedValue = formatTimeInput(e.target.value);
      onChange(formattedValue);
    };

    const handleBlur = (e) => {
      // Validate and format the time on blur
      const time = e.target.value;
      if (time && isValidTime(time)) {
        // Ensure proper formatting (HH:MM)
        const [hours, minutes] = time.split(':');
        const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        onChange(formattedTime);
      }
    };

    return (
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-7 text-xs ${className} ${
          value && !isValidTime(value) ? 'border-red-500' : ''
        } ${settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}`}
      />
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

  // Day Cell Component
  const DayCell = React.memo(({ employeeId, day, hours }) => {
    const isHolidayDay = isHoliday(day);
    const status = hours.status;
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    
    return (
      <td className={`text-center p-1 ${
        isWeekend ? (settings.darkMode ? 'bg-slate-700/50' : 'bg-slate-50') : ''
      } ${
        isHolidayDay ? (settings.darkMode ? 'bg-purple-900/20' : 'bg-purple-50') : ''
      }`}>
        <div className="space-y-1">
          {/* Status and Holiday Indicators */}
          <div className="flex justify-center items-center gap-1">
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

          {/* Time Inputs */}
          <div className="space-y-1">
            <TimeInput
              value={hours.startTime}
              onChange={(value) => updateTimeEntry(employeeId, day, 'startTime', value)}
              placeholder="09:00"
              disabled={status !== STATUS_TYPES.WORK}
            />
            <TimeInput
              value={hours.endTime}
              onChange={(value) => updateTimeEntry(employeeId, day, 'endTime', value)}
              placeholder="17:00"
              disabled={status !== STATUS_TYPES.WORK}
            />
          </div>

          {/* Hours Display */}
          <div className={`text-xs ${
            hours.holidayOvertimeHours > 0 ? 'text-purple-600 font-semibold' :
            hours.overtimeHours > 0 ? 'text-orange-600 font-semibold' : 
            hours.totalHours > 0 ? 'text-green-600' :
            settings.darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {hours.totalHours > 0 ? `${hours.totalHours.toFixed(1)}h` : '-'}
            {hours.overtimeHours > 0 && ` (+${hours.overtimeHours.toFixed(1)})`}
            {hours.holidayOvertimeHours > 0 && ` (+${hours.holidayOvertimeHours.toFixed(1)} HOT)`}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className={settings.darkMode ? 'bg-slate-800' : ''}>
                <DialogHeader>
                  <DialogTitle>Day Settings</DialogTitle>
                  <DialogDescription>
                    Set status for {day.toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
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
              </DialogContent>
            </Dialog>
            
            {isHolidayDay ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-purple-500"
                onClick={() => toggleHoliday(day)}
              >
                <PartyPopper className="w-3 h-3" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleHoliday(day)}
              >
                <CalendarDays className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </td>
    );
  });

  DayCell.displayName = 'DayCell';

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
            <div></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Timesheets Pro
                </h1>
                <p className="text-slate-600 mt-2">Self-contained time tracking system</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newSettings = { ...settings, darkMode: !settings.darkMode };
                        setSettings(newSettings);
                        saveSettings(newSettings);
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
            <TabsTrigger value="quick-entry" className="rounded-md">
              <Zap className="w-4 h-4 mr-2" />
              Quick Entry
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

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={settings.darkMode ? 'bg-slate-800' : ''}>
                        <DialogHeader>
                          <DialogTitle>Export Options</DialogTitle>
                          <DialogDescription>
                            Choose your preferred export format
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <Button onClick={generateComprehensiveCSV} className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            Export to CSV (Summary)
                          </Button>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Individual PDF Reports</div>
                            {employees.map(employee => (
                              <Button
                                key={employee.id}
                                variant="outline"
                                onClick={() => generateEmployeePDF(employee.id)}
                                className="w-full justify-start"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {employee.name} (PDF)
                              </Button>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Individual CSV Reports</div>
                            {employees.map(employee => (
                              <Button
                                key={employee.id}
                                variant="outline"
                                onClick={() => generateEmployeeCSV(employee.id)}
                                className="w-full justify-start"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                {employee.name} (CSV)
                              </Button>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
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
                          
                          return (
                            <th key={day.toISOString()} className={`text-center p-2 font-semibold min-w-32 ${
                              isWeekend ? (settings.darkMode ? 'bg-slate-700' : 'bg-slate-50') : ''
                            } ${
                              isHolidayDay ? (settings.darkMode ? 'bg-purple-900/30' : 'bg-purple-100') : ''
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
                    <CardTitle>Export Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button onClick={generateComprehensiveCSV} className="w-full justify-start" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        CSV Export (Summary)
                      </Button>
                      <div className="text-sm font-medium mb-2">Individual Reports</div>
                      {employees.slice(0, 3).map(employee => (
                        <Button
                          key={employee.id}
                          onClick={() => generateEmployeePDF(employee.id)}
                          className="w-full justify-start"
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {employee.name} (PDF)
                        </Button>
                      ))}
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

          {/* Quick Entry Tab */}
          <TabsContent value="quick-entry">
            <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
              <CardHeader>
                <CardTitle>Quick Shift Entry</CardTitle>
                <CardDescription>Add common shifts quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map(employee => (
                    <Card key={employee.id} className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}>
                      <CardHeader>
                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                        <CardDescription>{employee.department}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => quickAddShift(employee.id, new Date(), 'standard')}
                            >
                              9-5 Shift
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => quickAddShift(employee.id, new Date(), 'early')}
                            >
                              Early Shift
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => quickAddShift(employee.id, new Date(), 'late')}
                            >
                              Late Shift
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => quickAddShift(employee.id, new Date(), 'double')}
                            >
                              Double Shift
                            </Button>
                          </div>
                          <div className="text-xs text-slate-500">
                            Last entry: {calculateEmployeeTotals(employee.id).totalDaysWorked} days this month
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                          const newSettings = { ...settings, autoOvertime: checked };
                          setSettings(newSettings);
                          saveSettings(newSettings);
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
                          const newSettings = { ...settings, overtimeThreshold: parseInt(e.target.value) || 8 };
                          setSettings(newSettings);
                          saveSettings(newSettings);
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
                          const newSettings = { ...settings, holidayOvertimeRate: parseFloat(e.target.value) || 2.0 };
                          setSettings(newSettings);
                          saveSettings(newSettings);
                        }}
                        className={settings.darkMode ? 'bg-slate-700 border-slate-600' : ''}
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
                          const newSettings = { ...settings, showWeekends: checked };
                          setSettings(newSettings);
                          saveSettings(newSettings);
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
                          const newSettings = { ...settings, darkMode: checked };
                          setSettings(newSettings);
                          saveSettings(newSettings);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={settings.darkMode ? 'bg-slate-800 border-slate-700' : ''}>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Backup and restore your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button 
                      onClick={() => {
                        const allData = {
                          employees,
                          timesheets,
                          holidays,
                          leaveDays,
                          settings,
                          exportDate: new Date().toISOString()
                        };
                        const dataStr = JSON.stringify(allData, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `timesheets-backup-${new Date().toISOString().split('T')[0]}.json`;
                        link.click();
                        toast.success('Backup downloaded successfully');
                      }}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Backup
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        // Clear all data
                        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                          localStorage.clear();
                          setEmployees(INITIAL_EMPLOYEES);
                          setTimesheets({});
                          setHolidays([]);
                          setLeaveDays({});
                          setSettings({
                            autoOvertime: true,
                            overtimeThreshold: 8,
                            darkMode: false,
                            showWeekends: true,
                            holidayOvertimeRate: 2.0
                          });
                          toast.success('All data cleared successfully');
                        }
                      }}
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    <p>Your data is stored locally in your browser.</p>
                    <p>Export backups regularly to prevent data loss.</p>
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