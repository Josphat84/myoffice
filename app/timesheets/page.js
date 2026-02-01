'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Plus,
  Clock,
  Users,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building,
  CalendarDays,
  Shield,
  RefreshCw,
  Zap,
  Moon,
  Mail as MailIcon,
  Trash2
} from 'lucide-react';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '??';
  const names = name.trim().split(' ');
  const first = names[0]?.[0] || '';
  const last = names.length > 1 ? names[names.length - 1]?.[0] || '' : '';
  return (first + last).toUpperCase();
};

// Helper function to extract employee data
const extractEmployeeData = (data) => {
  const name = 
    data.name || 
    data.employee_name || 
    data.full_name || 
    data.Name || 
    data.EmployeeName ||
    (data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : null) ||
    'Employee';

  return {
    id: String(data.id || data.employee_id || Math.random().toString(36).substr(2, 9)),
    name: name.trim(),
    position: data.position || data.job_title || data.Position || data.JobTitle || 'Maintenance',
    department: 'Maintenance',
    contact: data.contact || data.phone || data.mobile || data.contact_number || data.Contact || 'No Contact',
    email: data.email || data.Email || data.email_address || 'No Email',
    is_active: data.is_active !== undefined ? data.is_active : true
  };
};

// Calculate total hours from time strings
const calculateTotalHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  try {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let startTotal = startHour + (startMinute / 60);
    let endTotal = endHour + (endMinute / 60);
    
    // Handle overnight shifts (end time before start time)
    if (endTotal < startTotal) {
      endTotal += 24;
    }
    
    return Math.max(0, endTotal - startTotal);
  } catch (error) {
    console.error('Error calculating hours:', error);
    return 0;
  }
};

// Calculate nightshift hours (18:00 to 02:00) from any time period
const calculateNightshiftHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  try {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let startTotal = startHour + (startMinute / 60);
    let endTotal = endHour + (endMinute / 60);
    
    // Handle overnight shifts
    if (endTotal < startTotal) {
      endTotal += 24;
    }
    
    let nightHours = 0;
    
    // Calculate hours in nightshift period (18:00 to 26:00 - which is 02:00 next day)
    const nightStart = 18;
    const nightEnd = 26;
    
    // Calculate overlap with nightshift period
    const overlapStart = Math.max(startTotal, nightStart);
    const overlapEnd = Math.min(endTotal, nightEnd);
    
    if (overlapEnd > overlapStart) {
      nightHours = overlapEnd - overlapStart;
    }
    
    return Math.max(0, nightHours);
  } catch (error) {
    console.error('Error calculating nightshift hours:', error);
    return 0;
  }
};

// Calculate overtime hours from time strings
const calculateOvertimeHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  try {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let startTotal = startHour + (startMinute / 60);
    let endTotal = endHour + (endMinute / 60);
    
    if (endTotal < startTotal) {
      endTotal += 24;
    }
    
    return Math.max(0, endTotal - startTotal);
  } catch (error) {
    console.error('Error calculating overtime:', error);
    return 0;
  }
};

// Apply 208-hour rule to monthly totals
const apply208HourRule = (regularHours, overtime1_5x) => {
  if (regularHours <= 208) {
    return { regular: regularHours, overtime1_5x };
  }
  
  // If regular hours exceed 208, move excess to overtime
  const excess = regularHours - 208;
  return {
    regular: 208,
    overtime1_5x: overtime1_5x + excess
  };
};

// API Service
const apiService = {
  async getEmployees() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch employees`);
      }
      
      const employeesData = await response.json();
      
      const transformedEmployees = (employeesData || []).map(extractEmployeeData);
      return transformedEmployees;
      
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  async getTimesheets(employeeId = null, startDate = null, endDate = null) {
    try {
      let url = `${API_BASE_URL}/api/timesheets`;
      const params = new URLSearchParams();
      
      if (employeeId) params.append('employee_id', employeeId);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        console.warn('Timesheets endpoint returned error:', response.status);
        return [];
      }
      
      const timesheetsData = await response.json();
      return timesheetsData || [];
    } catch (error) {
      console.warn('Timesheets fetch failed:', error.message);
      return [];
    }
  },

  async createTimesheetEntry(entryData) {
    try {
      console.log('Creating timesheet entry:', entryData);
      
      const response = await fetch(`${API_BASE_URL}/api/timesheets`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(entryData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create timesheet entry: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error creating timesheet entry:', error);
      throw error;
    }
  },

  async updateTimesheetEntry(entryId, entryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/timesheets/${entryId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(entryData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update timesheet entry: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error updating timesheet entry:', error);
      throw error;
    }
  },

  async deleteTimesheetEntry(entryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/timesheets/${entryId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete timesheet entry: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting timesheet entry:', error);
      throw error;
    }
  },

  async getTimesheetStats(startDate = null, endDate = null) {
    try {
      let url = `${API_BASE_URL}/api/timesheets/stats/summary`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        console.warn('Stats endpoint returned error:', response.status);
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Stats fetch failed:', error.message);
      return null;
    }
  }
};

// Status Configurations
const STATUS_CONFIG = {
  work: { label: 'Work', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  leave: { label: 'Leave', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CalendarDays },
  off: { label: 'Off', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle },
  absent: { label: 'Absent', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
  holiday: { label: 'Holiday', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: CalendarDays },
  sick: { label: 'Sick Leave', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle },
  training: { label: 'Training', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: Shield },
  vacation: { label: 'Vacation', color: 'bg-pink-100 text-pink-800 border-pink-200', icon: CalendarDays }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.work;
  const Icon = config.icon;
  
  return (
    <Badge variant="outline" className={`${config.color} text-xs px-2 py-0 h-5`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

// Overtime Period Component
const OvertimePeriod = ({ period, index, onUpdate, onRemove }) => {
  const [startTime, setStartTime] = useState(period.start_time || '');
  const [endTime, setEndTime] = useState(period.end_time || '');
  const [overtimeType, setOvertimeType] = useState(period.overtime_type || '1.5x');

  // Calculate overtime hours
  useEffect(() => {
    if (startTime && endTime) {
      const otHours = calculateOvertimeHours(startTime, endTime);
      const nightHours = calculateNightshiftHours(startTime, endTime);
      
      onUpdate(index, {
        start_time: startTime,
        end_time: endTime,
        overtime_type: overtimeType,
        overtime_hours: otHours,
        nightshift_hours: nightHours
      });
    }
  }, [startTime, endTime, overtimeType, index, onUpdate]);

  return (
    <div className="p-3 border rounded-lg bg-gray-50 space-y-3">
      <div className="flex justify-between items-center">
        <Label className="font-medium">Overtime Period {index + 1}</Label>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input 
            type="time" 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Input 
            type="time" 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Overtime Type</Label>
        <Select value={overtimeType} onValueChange={setOvertimeType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1.5x">1.5x Regular Overtime</SelectItem>
            <SelectItem value="2.0x">2.0x Holiday/Weekend</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Overtime: </span>
          {calculateOvertimeHours(startTime, endTime).toFixed(2)} hrs
        </div>
        <div className="text-sm text-gray-600">
          <Moon className="w-3 h-3 inline mr-1 text-indigo-600" />
          <span className="font-semibold">Nightshift: </span>
          {calculateNightshiftHours(startTime, endTime).toFixed(2)} hrs
        </div>
      </div>
    </div>
  );
};

// Timesheet Entry Dialog
const TimesheetEntryDialog = ({ 
  employee, 
  date, 
  entry, 
  onSave, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    start_time: entry?.start_time || '07:00',
    end_time: entry?.end_time || '17:00',
    regular_hours: entry?.regular_hours || 0,
    nightshift_hours: entry?.nightshift_hours || 0,
    status: entry?.status || 'work',
    standby_allowance: entry?.standby_allowance || false,
    notes: entry?.notes || ''
  });
  
  const [overtimePeriods, setOvertimePeriods] = useState(
    Array.isArray(entry?.overtime_periods) ? entry.overtime_periods : []
  );
  
  const [saving, setSaving] = useState(false);

  // Calculate hours when times change
  useEffect(() => {
    if (formData.start_time && formData.end_time) {
      const totalHours = calculateTotalHours(
        formData.start_time, 
        formData.end_time
      );
      
      const nightHours = calculateNightshiftHours(
        formData.start_time,
        formData.end_time
      );
      
      setFormData(prev => ({
        ...prev,
        regular_hours: totalHours,
        nightshift_hours: nightHours
      }));
    }
  }, [formData.start_time, formData.end_time]);

  // Calculate overtime totals - FIXED: Added proper array check
  const overtimeTotals = useMemo(() => {
    let total1_5x = 0;
    let total2_0x = 0;
    let overtimeNightshift = 0;
    
    // Ensure overtimePeriods is an array
    const periodsArray = Array.isArray(overtimePeriods) ? overtimePeriods : [];
    
    periodsArray.forEach(period => {
      const hours = calculateOvertimeHours(period.start_time, period.end_time);
      const nightHours = calculateNightshiftHours(period.start_time, period.end_time);
      
      overtimeNightshift += nightHours;
      
      if (period.overtime_type === '2.0x') {
        total2_0x += hours;
      } else {
        total1_5x += hours;
      }
    });
    
    return { total1_5x, total2_0x, overtimeNightshift };
  }, [overtimePeriods]);

  const handleAddOvertimePeriod = () => {
    setOvertimePeriods(prev => [
      ...(Array.isArray(prev) ? prev : []),
      { start_time: '18:00', end_time: '20:00', overtime_type: '1.5x', overtime_hours: 0, nightshift_hours: 0 }
    ]);
  };

  const handleUpdateOvertimePeriod = (index, updatedPeriod) => {
    setOvertimePeriods(prev => {
      const newPeriods = Array.isArray(prev) ? [...prev] : [];
      if (index >= 0 && index < newPeriods.length) {
        newPeriods[index] = { ...newPeriods[index], ...updatedPeriod };
      }
      return newPeriods;
    });
  };

  const handleRemoveOvertimePeriod = (index) => {
    setOvertimePeriods(prev => 
      Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []
    );
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      // Calculate total nightshift hours (from regular shift + overtime periods)
      const totalNightshiftHours = formData.nightshift_hours + overtimeTotals.overtimeNightshift;
      
      // Calculate total overtime hours
      const totalOvertime = overtimeTotals.total1_5x;
      const totalHolidayOvertime = formData.status === 'holiday' 
        ? overtimeTotals.total1_5x + overtimeTotals.total2_0x
        : overtimeTotals.total2_0x;
      
      // Calculate total hours
      const totalHours = formData.regular_hours + totalOvertime + totalHolidayOvertime + totalNightshiftHours;
      
      // Prepare data for backend
      const backendData = {
        employee_id: parseInt(employee.id),
        date: date.toISOString().split('T')[0],
        start_time: formData.start_time,
        end_time: formData.end_time,
        regular_hours: formData.regular_hours,
        overtime_hours: formData.status === 'holiday' ? 0 : totalOvertime,
        holiday_overtime_hours: totalHolidayOvertime,
        nightshift_hours: totalNightshiftHours,
        standby_allowance: formData.standby_allowance,
        total_hours: totalHours,
        status: formData.status,
        notes: formData.notes,
        overtime_periods: Array.isArray(overtimePeriods) ? overtimePeriods : [],
        callout_overtime_hours: 0,
        callout_count: 0
      };
      
      console.log('Saving data to backend:', backendData);
      await onSave(backendData);
      toast.success('Timesheet entry saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save entry: ' + error.message);
    } finally {
      setSaving(false);
    }
  };
  
  const calculateTotal = () => {
    return formData.regular_hours + 
           overtimeTotals.total1_5x + 
           overtimeTotals.total2_0x +
           formData.nightshift_hours +
           overtimeTotals.overtimeNightshift;
  };

  const isHoliday = formData.status === 'holiday';

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Timesheet Entry</DialogTitle>
          <DialogDescription>
            {employee?.name || 'Employee'} - {date?.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            }) || ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Status Selection */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({...formData, status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2" />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {isHoliday && (
              <p className="text-sm text-purple-600 mt-1">
                ⓘ All overtime hours will be added to holiday overtime (2.0x rate)
              </p>
            )}
          </div>
          
          {/* Regular Time Inputs */}
          <div className="space-y-3 p-3 border rounded-lg">
            <h3 className="font-medium">Regular Shift</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input 
                  type="time" 
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input 
                  type="time" 
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <span>Total Hours</span>
                  <Badge variant="outline" className="text-xs">Auto-calculated</Badge>
                </Label>
                <Input 
                  type="number" 
                  step="0.25"
                  min="0"
                  value={formData.regular_hours.toFixed(2)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Moon className="w-3 h-3" />
                  <span>Nightshift Hours</span>
                  <Badge variant="outline" className="text-xs bg-indigo-50">18:00-02:00</Badge>
                </Label>
                <Input 
                  type="number" 
                  step="0.25"
                  min="0"
                  value={formData.nightshift_hours.toFixed(2)}
                  readOnly
                  className="bg-indigo-50"
                />
                <p className="text-xs text-gray-500">
                  Any hours between 18:00-02:00 automatically added
                </p>
              </div>
            </div>
          </div>
          
          {/* Overtime Periods */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Overtime Periods</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOvertimePeriod}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Overtime
              </Button>
            </div>
            
            {(!overtimePeriods || overtimePeriods.length === 0) ? (
              <div className="text-center p-4 border border-dashed rounded-lg">
                <p className="text-gray-500">No overtime periods added</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Overtime" to add overtime periods</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.isArray(overtimePeriods) && overtimePeriods.map((period, index) => (
                  <OvertimePeriod
                    key={index}
                    period={period}
                    index={index}
                    onUpdate={handleUpdateOvertimePeriod}
                    onRemove={handleRemoveOvertimePeriod}
                  />
                ))}
              </div>
            )}
            
            {/* Overtime Summary */}
            {Array.isArray(overtimePeriods) && overtimePeriods.length > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <h4 className="font-medium mb-2">Overtime Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">1.5x Overtime</Label>
                    <p className="text-lg font-semibold text-orange-600">
                      {overtimeTotals.total1_5x.toFixed(2)} hours
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm">2.0x Overtime</Label>
                    <p className="text-lg font-semibold text-purple-600">
                      {overtimeTotals.total2_0x.toFixed(2)} hours
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <Moon className="w-3 h-3 inline mr-1 text-indigo-600" />
                  Overtime Nightshift: <span className="font-semibold">
                    {overtimeTotals.overtimeNightshift.toFixed(2)} hours
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Total Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="font-semibold">Total Hours</Label>
              <span className="text-lg font-bold text-blue-600">{calculateTotal().toFixed(2)}</span>
            </div>
            <Progress value={(calculateTotal() / 24) * 100} className="h-2" />
          </div>
          
          {/* 208-Hour Rule Notice */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="space-y-1">
                <Label className="font-medium text-green-700">208-Hour Rule Applied</Label>
                <p className="text-sm text-green-600">
                  • Regular hours capped at 208 per month
                  • Any hours beyond 208 automatically move to 1.5x overtime
                  • Nightshift hours (18:00-02:00) tracked separately
                </p>
              </div>
            </div>
          </div>
          
          {/* Standby Allowance */}
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="space-y-0.5">
              <Label className="font-medium">Standby Allowance</Label>
              <p className="text-sm text-gray-600">Adds 8 hours to overtime for each consecutive standby day (max 7)</p>
            </div>
            <Switch 
              checked={formData.standby_allowance}
              onCheckedChange={(checked) => setFormData({...formData, standby_allowance: checked})}
            />
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Input 
              placeholder="Additional notes, comments, or remarks..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
const TimesheetsSystem = () => {
  const [payPeriodStartDay, setPayPeriodStartDay] = useState(13);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('timesheets');

  // Calculate pay period dates based on start day
  const getPayPeriodDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const currentDay = currentMonth.getDate();
    let startDate, endDate;
    
    if (currentDay < payPeriodStartDay) {
      startDate = new Date(year, month - 1, payPeriodStartDay);
      endDate = new Date(year, month, payPeriodStartDay - 1);
    } else {
      startDate = new Date(year, month, payPeriodStartDay);
      endDate = new Date(year, month + 1, payPeriodStartDay - 1);
    }
    
    return { startDate, endDate };
  };

  // Get all days in the pay period
  const getDaysInPayPeriod = () => {
    const { startDate, endDate } = getPayPeriodDates();
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const employeesData = await apiService.getEmployees();
      setEmployees(employeesData);
      
      const { startDate, endDate } = getPayPeriodDates();
      
      const timesheetsData = await apiService.getTimesheets(
        null,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setTimesheets(timesheetsData || []);
      
      toast.success('Data loaded successfully');
      
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentMonth, payPeriodStartDay]);

  const daysInPayPeriod = getDaysInPayPeriod();

  // Get employee timesheet entry for a specific date
  const getEmployeeEntry = (employeeId, date) => {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    return timesheets.find(ts => 
      ts.employee_id === parseInt(employeeId) && ts.date === dateStr
    );
  };

  // Calculate employee pay period totals WITH 208-HOUR RULE
  const calculateEmployeePayPeriodTotals = (employeeId) => {
    const employeeEntries = timesheets.filter(ts => ts.employee_id === parseInt(employeeId));
    
    let totalRegular = 0;
    let totalOvertime1_5x = 0;
    let totalOvertime2_0x = 0;
    let totalNightshift = 0;
    let consecutiveStandbyDays = 0;
    let standbyOvertimeBonus = 0;
    
    const sortedEntries = [...employeeEntries].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    sortedEntries.forEach(entry => {
      const regularHours = entry.regular_hours || 0;
      const overtimeHours = entry.overtime_hours || 0;
      const holidayOTHours = entry.holiday_overtime_hours || 0;
      const nightshiftHours = entry.nightshift_hours || 0;
      const isStandby = entry.standby_allowance || false;
      const isHoliday = entry.status === 'holiday';
      
      // Add regular hours (will apply 208 rule later)
      totalRegular += regularHours;
      totalNightshift += nightshiftHours;
      
      if (isHoliday) {
        totalOvertime2_0x += overtimeHours + holidayOTHours;
      } else {
        totalOvertime1_5x += overtimeHours;
        totalOvertime2_0x += holidayOTHours;
      }
      
      if (isStandby) {
        consecutiveStandbyDays++;
        if (consecutiveStandbyDays <= 7) {
          standbyOvertimeBonus += 8;
        }
      } else {
        consecutiveStandbyDays = 0;
      }
    });
    
    // Apply 208-hour rule - if regular hours exceed 208, move excess to overtime 1.5x
    const adjustedTotals = apply208HourRule(totalRegular, totalOvertime1_5x);
    totalRegular = adjustedTotals.regular;
    totalOvertime1_5x = adjustedTotals.overtime1_5x;
    
    // Add standby bonus to overtime
    totalOvertime1_5x += standbyOvertimeBonus;
    
    const totalHours = totalRegular + totalOvertime1_5x + totalOvertime2_0x + totalNightshift;
    
    return {
      regular: totalRegular,
      overtime1_5x: totalOvertime1_5x,
      overtime2_0x: totalOvertime2_0x,
      nightshift: totalNightshift,
      standbyBonus: standbyOvertimeBonus,
      total: totalHours,
      excessRegular: Math.max(0, totalRegular - 208)
    };
  };

  // Handle timesheet entry save
  const handleSaveEntry = async (employeeId, date, data) => {
    if (!employeeId || !date) return;
    
    const dateStr = date.toISOString().split('T')[0];
    const existingEntry = getEmployeeEntry(employeeId, date);
    
    try {
      if (existingEntry?.id) {
        const updated = await apiService.updateTimesheetEntry(existingEntry.id, data);
        setTimesheets(prev => prev.map(ts => 
          ts.id === existingEntry.id ? { ...ts, ...updated } : ts
        ));
      } else {
        const newEntry = await apiService.createTimesheetEntry(data);
        setTimesheets(prev => [...prev, newEntry.data || newEntry]);
      }
      
      const employee = employees.find(e => e.id === employeeId);
      toast.success(`${employee?.name || 'Employee'}'s entry saved!`);
      
    } catch (error) {
      throw error;
    }
  };

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      if (!employee) return false;
      
      if (searchTerm && employee.name && !employee.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [employees, searchTerm]);

  // Navigate pay periods
  const previousPayPeriod = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextPayPeriod = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToCurrentPayPeriod = () => {
    setCurrentMonth(new Date());
  };

  // Export data
  const exportData = () => {
    const { startDate, endDate } = getPayPeriodDates();
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    const filename = 'timesheets-' + startStr + '-to-' + endStr + '.json';
    
    const data = {
      payPeriod: {
        start: startStr,
        end: endStr,
        startDay: payPeriodStartDay
      },
      employees: employees.length,
      timesheets: timesheets.length,
      data: timesheets,
      calculations: employees.map(emp => ({
        employee: emp.name,
        ...calculateEmployeePayPeriodTotals(emp.id)
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  // Format date range
  const formatDateRange = (start, end) => {
    return `${start.getDate()} ${start.toLocaleString('default', { month: 'short' })} - ${end.getDate()} ${end.toLocaleString('default', { month: 'short' })}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading timesheets data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance Timesheets</h1>
            <p className="text-gray-500 mt-2">
              {employees.length} employees • {timesheets.length} entries • Pay Period
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm whitespace-nowrap">Pay Period Start Day:</Label>
              <Select 
                value={payPeriodStartDay.toString()} 
                onValueChange={(value) => setPayPeriodStartDay(parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}th of month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Employees</p>
                  <h3 className="text-2xl font-bold mt-2">{employees.length}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Regular Hours</p>
                  <h3 className="text-2xl font-bold mt-2">
                    {employees.reduce((sum, emp) => sum + calculateEmployeePayPeriodTotals(emp.id).regular, 0).toFixed(1)}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overtime 1.5x</p>
                  <h3 className="text-2xl font-bold mt-2">
                    {employees.reduce((sum, emp) => sum + calculateEmployeePayPeriodTotals(emp.id).overtime1_5x, 0).toFixed(1)}
                  </h3>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overtime 2.0x</p>
                  <h3 className="text-2xl font-bold mt-2">
                    {employees.reduce((sum, emp) => sum + calculateEmployeePayPeriodTotals(emp.id).overtime2_0x, 0).toFixed(1)}
                  </h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Period</p>
                  <h3 className="text-2xl font-bold mt-2">
                    {payPeriodStartDay}
                  </h3>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="timesheets">
            <CalendarDays className="w-4 h-4 mr-2" />
            Timesheet Grid
          </TabsTrigger>
          <TabsTrigger value="employees">
            <Users className="w-4 h-4 mr-2" />
            Employees
          </TabsTrigger>
        </TabsList>

        {/* Timesheets Tab */}
        <TabsContent value="timesheets" className="space-y-6">
          {/* Pay Period Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={previousPayPeriod}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">
                      Pay Period: {formatDateRange(getPayPeriodDates().startDate, getPayPeriodDates().endDate)}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {daysInPayPeriod.length} days • Starts on {payPeriodStartDay}th of month
                    </p>
                  </div>
                  <Button variant="outline" size="icon" onClick={nextPayPeriod}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search employees..."
                      className="pl-9 w-full md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={goToCurrentPayPeriod}>
                    Current Period
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timesheet Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Pay Period Timesheet</CardTitle>
              <CardDescription>
                Click on any cell to edit timesheet entry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-48 sticky left-0 bg-white">Employee</TableHead>
                      {daysInPayPeriod.map(day => (
                        <TableHead key={day.toISOString()} className="text-center min-w-24">
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-normal">
                              {day.toLocaleDateString('default', { weekday: 'short' })}
                            </span>
                            <span className={`font-medium ${
                              day.toDateString() === new Date().toDateString() ? 'text-blue-600' : ''
                            }`}>
                              {day.getDate()}
                            </span>
                            <span className="text-xs text-gray-400">
                              {day.toLocaleDateString('default', { month: 'short' })}
                            </span>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center min-w-24 bg-green-50">Reg</TableHead>
                      <TableHead className="text-center min-w-24 bg-orange-50">1.5x OT</TableHead>
                      <TableHead className="text-center min-w-24 bg-purple-50">2.0x OT</TableHead>
                      <TableHead className="text-center min-w-24 bg-indigo-50">Night</TableHead>
                      <TableHead className="text-center min-w-24 bg-blue-50">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map(employee => {
                      if (!employee) return null;
                      const totals = calculateEmployeePayPeriodTotals(employee.id);
                      
                      return (
                        <TableRow key={employee.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium sticky left-0 bg-white">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p>{employee.name || 'Unknown Employee'}</p>
                                <p className="text-xs text-gray-500">Maintenance</p>
                              </div>
                            </div>
                          </TableCell>
                          {daysInPayPeriod.map(day => {
                            const entry = getEmployeeEntry(employee.id, day);
                            const isToday = day.toDateString() === new Date().toDateString();
                            const isDifferentMonth = day.getMonth() !== currentMonth.getMonth();
                            
                            return (
                              <TableCell key={day.toISOString()} className="text-center p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-10 w-full p-0 ${
                                    entry ? 'bg-green-50 hover:bg-green-100' : 
                                    isToday ? 'bg-blue-50 hover:bg-blue-100' :
                                    isDifferentMonth ? 'bg-gray-50 hover:bg-gray-100' : 'hover:bg-gray-100'
                                  }`}
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setSelectedDate(day);
                                    setSelectedEntry(entry);
                                  }}
                                >
                                  {entry ? (
                                    <div className="flex flex-col items-center w-full">
                                      <StatusBadge status={entry.status} />
                                      <div className="text-xs mt-1 space-y-0.5">
                                        <div className="flex items-center justify-center gap-1">
                                          <span className="text-green-600 font-medium">
                                            {entry.regular_hours?.toFixed(1) || 0}
                                          </span>
                                          {entry.overtime_hours > 0 && (
                                            <span className="text-orange-600">
                                              +{entry.overtime_hours?.toFixed(1)}
                                            </span>
                                          )}
                                          {entry.nightshift_hours > 0 && (
                                            <Moon className="w-3 h-3 text-indigo-600" />
                                          )}
                                        </div>
                                        {entry.start_time && (
                                          <div className="text-[10px] text-gray-500">
                                            {entry.start_time}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center">
                                      <span className={`text-sm ${
                                        isToday ? 'text-blue-600 font-medium' : 
                                        isDifferentMonth ? 'text-gray-400' : 'text-gray-600'
                                      }`}>
                                        {day.getDate()}
                                      </span>
                                      {isDifferentMonth && (
                                        <span className="text-[10px] text-gray-400">
                                          {day.toLocaleDateString('default', { month: 'short' })}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </Button>
                              </TableCell>
                            );
                          })}
                          
                          {/* Pay Period Totals Columns */}
                          <TableCell className="text-center font-bold bg-green-50">
                            {totals.regular.toFixed(1)}
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.min(208, totals.regular).toFixed(0)}/208
                            </div>
                            {totals.excessRegular > 0 && (
                              <div className="text-xs text-orange-600 mt-1">
                                +{totals.excessRegular.toFixed(1)} to OT
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center font-bold bg-orange-50">
                            {totals.overtime1_5x.toFixed(1)}
                            {totals.standbyBonus > 0 && (
                              <div className="text-xs text-yellow-600 mt-1">
                                +{totals.standbyBonus.toFixed(0)} standby
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center font-bold bg-purple-50">
                            {totals.overtime2_0x.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-center font-bold bg-indigo-50">
                            {totals.nightshift.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-center font-bold bg-blue-50">
                            <span className="text-lg">{totals.total.toFixed(1)}</span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Maintenance Department Team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map(employee => {
                  if (!employee) return null;
                  const totals = calculateEmployeePayPeriodTotals(employee.id);
                  
                  return (
                    <Card key={employee.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-semibold">{employee.name || 'Unknown Employee'}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Building className="w-3 h-3" />
                              <span>Maintenance</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <MailIcon className="w-3 h-3" />
                              <span className="truncate">{employee.email}</span>
                            </div>
                          </div>
                          <Badge variant={employee.is_active ? "default" : "outline"} className="bg-blue-50 text-blue-700">
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Regular</p>
                            <p className="font-semibold">{totals.regular.toFixed(1)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">1.5x OT</p>
                            <p className="font-semibold text-orange-600">{totals.overtime1_5x.toFixed(1)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">2.0x OT</p>
                            <p className="font-semibold text-purple-600">{totals.overtime2_0x.toFixed(1)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Nightshift</p>
                            <p className="font-semibold text-indigo-600">{totals.nightshift.toFixed(1)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Standby</p>
                            <p className="font-semibold text-yellow-600">{totals.standbyBonus.toFixed(1)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="font-bold">{totals.total.toFixed(1)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <Progress 
                            value={(totals.regular / 208) * 100} 
                            className="h-2"
                            max={208}
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{Math.min(208, totals.regular).toFixed(0)} of 208 regular hours</span>
                            {totals.excessRegular > 0 && (
                              <span className="text-orange-600 font-semibold">
                                +{totals.excessRegular.toFixed(1)} to OT
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Timesheet Entry Dialog */}
      {selectedEmployee && selectedDate && (
        <TimesheetEntryDialog
          employee={selectedEmployee}
          date={selectedDate}
          entry={selectedEntry}
          onSave={(data) => handleSaveEntry(selectedEmployee.id, selectedDate, data)}
          onClose={() => {
            setSelectedEmployee(null);
            setSelectedDate(null);
            setSelectedEntry(null);
          }}
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={loadData}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TimesheetsSystem;