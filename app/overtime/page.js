'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Loader2, 
    Plus, 
    Search, 
    ChevronUp, 
    ChevronDown, 
    Trash2, 
    Edit, 
    Clock,
    Calendar,
    User,
    Building,
    TrendingUp,
    BarChart3,
    PieChart as PieChartIcon,
    Filter,
    ArrowLeft,
    CheckCircle,
    XCircle,
    AlertTriangle,
    FileText,
    Download,
    Upload,
    Users,
    Eye,
    History,
    Shield,
    MessageSquare,
    CalendarClock,
    Calculator,
    FileCheck,
    ThumbsUp,
    ThumbsDown,
    Clock4,
    Zap,
    Target,
    Award,
    TrendingDown,
    DownloadCloud,
    List,
    Grid3X3,
    Filter as FilterIcon,
    MoreHorizontal,
    EyeIcon,
    FileBarChart,
    CalendarDays,
    UserCheck,
    Clock8,
    AlertCircle,
    Wrench,
    CalendarX,
    SortAsc,
    SortDesc,
    ArrowRight,
    CheckCircle2,
    FilePieChart,
    Briefcase
} from "lucide-react";
import Link from "next/link";

// ✅ Same API base as your employees page
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://myofficebackend.onrender.com'

// Overtime Types Configuration with better colors
const OVERTIME_TYPES = {
    PLANNED: {
        value: 'planned',
        label: 'Planned Overtime',
        description: 'Scheduled in advance for projects or special assignments',
        color: 'indigo',
        icon: CalendarDays,
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
    },
    UNPLANNED: {
        value: 'unplanned',
        label: 'Unplanned Overtime',
        description: 'Unexpected work due to urgent requirements',
        color: 'amber',
        icon: AlertCircle,
        badge: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
    },
    BREAKDOWN: {
        value: 'breakdown',
        label: 'Breakdown Response',
        description: 'Emergency response to equipment or system failures',
        color: 'red',
        icon: Wrench,
        badge: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    },
    SHIFT_COVER: {
        value: 'shift_cover',
        label: 'Shift Cover',
        description: 'Covering for absent colleagues or staffing gaps',
        color: 'cyan',
        icon: UserCheck,
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
    }
};

// Status Configuration with better colors
const STATUS_CONFIG = {
    pending: { 
        color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100', 
        icon: Clock, 
        label: 'Pending Review' 
    },
    approved: { 
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', 
        icon: CheckCircle, 
        label: 'Approved' 
    },
    rejected: { 
        color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100', 
        icon: XCircle, 
        label: 'Rejected' 
    },
    on_hold: { 
        color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100', 
        icon: AlertTriangle, 
        label: 'On Hold' 
    }
};

// Custom Hook for Employee Management
const useEmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
    const [employeeError, setEmployeeError] = useState(null);

    const fetchEmployees = useCallback(async (signal) => {
        setIsLoadingEmployees(true);
        setEmployeeError(null);
        try {
            const res = await fetch(`${API_BASE}/api/employees`, { signal });
            
            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                const message = errorBody.detail || `HTTP error! Status: ${res.status}`;
                throw new Error(message);
            }
            
            const data = await res.json();
            // Ensure all employees have required fields
            const validatedEmployees = data.map(emp => ({
                id: emp.id || '',
                employee_id: emp.employee_id || '',
                first_name: emp.first_name || '',
                last_name: emp.last_name || '',
                department: emp.department || '',
                designation: emp.designation || '',
                ...emp
            }));
            setEmployees(validatedEmployees);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Fetch Employees Error:", err);
                setEmployeeError('Failed to fetch employees. Please check your connection.');
                setEmployees([]);
            }
        } finally {
            setIsLoadingEmployees(false);
        }
    }, []);

    useEffect(() => { 
        const abortController = new AbortController();
        fetchEmployees(abortController.signal); 
        return () => abortController.abort();
    }, [fetchEmployees]);

    return { 
        employees, 
        isLoadingEmployees, 
        employeeError
    };
};

// Custom Hook for Overtime Management
const useOvertimeManagement = () => {
    const [overtimeRequests, setOvertimeRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOvertimeRequests = useCallback(async (signal) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/overtime`, { signal });
            
            if (res.status === 404) {
                setOvertimeRequests([]);
                return;
            }
            
            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                const message = errorBody.detail || `HTTP error! Status: ${res.status}`;
                throw new Error(message);
            }
            
            const data = await res.json();
            setOvertimeRequests(data);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Fetch Error:", err);
                setError('Failed to fetch overtime requests. Please check your connection.');
                setOvertimeRequests([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { 
        const abortController = new AbortController();
        fetchOvertimeRequests(abortController.signal); 
        return () => abortController.abort();
    }, [fetchOvertimeRequests]);

    const mutateOvertime = async (url, method, payload = null) => {
        setError(null);
        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: payload ? JSON.stringify(payload) : undefined,
            });
            
            if (res.status === 404) {
                // For demo purposes, simulate success and add to local state
                const newOvertime = {
                    ...payload,
                    id: Date.now(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                setOvertimeRequests(prev => method === 'POST' ? [...prev, newOvertime] : prev);
                return { success: true, message: "Operation completed successfully" };
            }
            
            if (!res.ok) {
                let message = `API Error: Status ${res.status}.`;
                try {
                    const errorJson = await res.json();
                    message = errorJson.detail || errorJson.error || message;
                } catch {
                    message = await res.text();
                }
                throw new Error(message);
            }
            
            const result = await res.json();
            fetchOvertimeRequests();
            return { success: true, message: "Operation successful.", data: result };
        } catch (err) {
            console.error("Mutation Error:", err);
            setError(err.message);
            return { success: false, message: err.message };
        }
    };

    const handleAddOvertime = (overtime) => {
        return mutateOvertime(`${API_BASE}/api/overtime`, "POST", overtime);
    };

    const handleUpdateOvertime = (overtime) => {
        return mutateOvertime(`${API_BASE}/api/overtime/${overtime.id}`, "PUT", overtime);
    };

    const handleStatusUpdate = (overtimeId, status, comments = '') => {
        return mutateOvertime(`${API_BASE}/api/overtime/${overtimeId}/status`, "PATCH", { status, comments });
    };
    
    const handleDeleteOvertime = async (overtimeId, employeeName) => {
        if (window.confirm(`Confirm deletion: Are you sure you want to remove overtime record for ${employeeName}?`)) {
            return mutateOvertime(`${API_BASE}/api/overtime/${overtimeId}`, "DELETE");
        }
        return { success: false, message: "Deletion cancelled." };
    };

    return { 
        overtimeRequests, 
        isLoading, 
        error, 
        handleAddOvertime, 
        handleUpdateOvertime, 
        handleStatusUpdate,
        handleDeleteOvertime, 
        clearError: () => setError(null) 
    };
};

// Enhanced Employee Search Dropdown with proper null checks
const EmployeeSearchDropdown = ({ employees, onSelect, selectedEmployee, error }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredEmployees = useMemo(() => {
        if (!searchQuery) return employees.slice(0, 50);
        
        const query = searchQuery.toLowerCase();
        return employees.filter(emp => {
            const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
            const employeeId = (emp.employee_id || '').toLowerCase();
            const department = (emp.department || '').toLowerCase();
            const designation = (emp.designation || '').toLowerCase();

            return fullName.includes(query) ||
                   employeeId.includes(query) ||
                   department.includes(query) ||
                   designation.includes(query);
        }).slice(0, 100);
    }, [employees, searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (employee) => {
        onSelect(employee);
        setIsOpen(false);
        setSearchQuery('');
    };

    const getInitials = (firstName, lastName) => {
        const first = (firstName || '').charAt(0) || '?';
        const last = (lastName || '').charAt(0) || '?';
        return `${first}${last}`.toUpperCase();
    };

    return (
        <div className="space-y-3" ref={dropdownRef}>
            <Label className="text-sm font-semibold text-gray-700">Select Employee *</Label>
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by name, ID, or department..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="pl-10 pr-4 h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                
                {isOpen && filteredEmployees.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                        {filteredEmployees.map((employee) => (
                            <div
                                key={employee.id}
                                className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                onClick={() => handleSelect(employee)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {getInitials(employee.first_name, employee.last_name)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {employee.first_name} {employee.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {employee.employee_id || 'No ID'} • {employee.department || 'No Department'} • {employee.designation || 'No Designation'}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedEmployee?.id === employee.id && (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isOpen && searchQuery && filteredEmployees.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
                        No employees found matching "{searchQuery}"
                    </div>
                )}
            </div>

            {selectedEmployee && (
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium">
                                {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">
                                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    ID: {selectedEmployee.employee_id || 'No ID'} • {selectedEmployee.designation || 'No Designation'} • {selectedEmployee.department || 'No Department'}
                                </div>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300">
                            Selected
                        </Badge>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-sm text-rose-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </p>
            )}
        </div>
    );
};

// Time Input Component
const TimeInput = ({ label, value, onChange, required = false }) => {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{label} {required && '*'}</Label>
            <Input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                required={required}
            />
        </div>
    );
};

// Duration Calculator
const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;
    
    if (endTotalMinutes < startTotalMinutes) {
        endTotalMinutes += 24 * 60;
    }
    
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    return (durationMinutes / 60).toFixed(2);
};

// Overtime Type Badge Component
const OvertimeTypeBadge = ({ type }) => {
    const config = OVERTIME_TYPES[type?.toUpperCase()] || OVERTIME_TYPES.PLANNED;
    const IconComponent = config.icon;
    
    return (
        <Badge variant="outline" className={`${config.badge} flex items-center gap-1.5 text-xs font-medium px-2.5 py-1`}>
            <IconComponent className="h-3 w-3" />
            {config.label}
        </Badge>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const IconComponent = config.icon;
    
    return (
        <Badge variant="outline" className={`${config.color} flex items-center gap-1.5 text-xs font-medium px-2.5 py-1`}>
            <IconComponent className="h-3 w-3" />
            {config.label}
        </Badge>
    );
};

// Enhanced Overtime Form Component with better error handling
const OvertimeForm = ({ initialData, onSubmit, onCancel, employees }) => {
    const [formData, setFormData] = useState({
        employee_id: '',
        employee_name: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '',
        end_time: '',
        hours: 0,
        reason: '',
        overtime_type: 'planned',
        status: 'pending',
        department: '',
        ...initialData
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (formData.start_time && formData.end_time) {
            const calculatedHours = calculateDuration(formData.start_time, formData.end_time);
            setFormData(prev => ({ ...prev, hours: parseFloat(calculatedHours) }));
        }
    }, [formData.start_time, formData.end_time]);

    useEffect(() => {
        if (initialData && initialData.employee_id) {
            const employee = employees.find(emp => 
                emp.employee_id === initialData.employee_id
            );
            if (employee) {
                setSelectedEmployee(employee);
                setFormData(prev => ({
                    ...prev,
                    department: employee.department || ''
                }));
            }
        }
    }, [initialData, employees]);

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
        setFormData(prev => ({
            ...prev,
            employee_id: employee.employee_id || '',
            employee_name: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
            department: employee.department || ''
        }));
        setErrors(prev => ({ ...prev, employee: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!selectedEmployee) {
            newErrors.employee = 'Please select an employee';
        }
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        if (!formData.start_time) {
            newErrors.start_time = 'Start time is required';
        }
        if (!formData.end_time) {
            newErrors.end_time = 'End time is required';
        }
        if (formData.hours <= 0) {
            newErrors.hours = 'End time must be after start time';
        }
        if (!formData.reason.trim()) {
            newErrors.reason = 'Reason is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const success = await onSubmit(formData);
            if (success) {
                setFormData({
                    employee_id: '',
                    employee_name: '',
                    date: new Date().toISOString().split('T')[0],
                    start_time: '',
                    end_time: '',
                    hours: 0,
                    reason: '',
                    overtime_type: 'planned',
                    status: 'pending',
                    department: ''
                });
                setSelectedEmployee(null);
                setErrors({});
            }
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <EmployeeSearchDropdown
                employees={employees}
                onSelect={handleEmployeeSelect}
                selectedEmployee={selectedEmployee}
                error={errors.employee}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-semibold text-gray-700">Date *</Label>
                    <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                    {errors.date && (
                        <p className="text-sm text-rose-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.date}
                        </p>
                    )}
                </div>
                
                <TimeInput
                    label="Start Time *"
                    value={formData.start_time}
                    onChange={(value) => handleChange('start_time', value)}
                    required
                />
                {errors.start_time && (
                    <p className="text-sm text-rose-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.start_time}
                    </p>
                )}
                
                <TimeInput
                    label="End Time *"
                    value={formData.end_time}
                    onChange={(value) => handleChange('end_time', value)}
                    required
                />
                {errors.end_time && (
                    <p className="text-sm text-rose-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.end_time}
                    </p>
                )}
            </div>

            {formData.hours > 0 && (
                <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                                    <Calculator className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-indigo-700">Calculated Duration</div>
                                    <div className="text-2xl font-bold text-indigo-900">{formData.hours} hours</div>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-300">
                                <Clock4 className="h-4 w-4 mr-1" />
                                Auto-calculated
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}
            {errors.hours && (
                <p className="text-sm text-rose-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.hours}
                </p>
            )}

            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">Overtime Type *</Label>
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(OVERTIME_TYPES).map((type) => {
                        const IconComponent = type.icon;
                        return (
                            <div
                                key={type.value}
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    formData.overtime_type === type.value
                                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 shadow-sm'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                }`}
                                onClick={() => handleChange('overtime_type', type.value)}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg bg-${type.color}-100`}>
                                        <IconComponent className={`h-4 w-4 text-${type.color}-600`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm text-gray-900">{type.label}</div>
                                        <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                                    </div>
                                </div>
                                {formData.overtime_type === type.value && (
                                    <div className="absolute top-3 right-3">
                                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-semibold text-gray-700">Reason for Overtime *</Label>
                <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    placeholder="Provide detailed reason for overtime work, including project name, task details, and urgency..."
                    rows={4}
                    className="resize-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
                {errors.reason && (
                    <p className="text-sm text-rose-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.reason}
                    </p>
                )}
            </div>

            {initialData && (
                <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">⏳ Pending Review</SelectItem>
                            <SelectItem value="approved">✅ Approved</SelectItem>
                            <SelectItem value="rejected">❌ Rejected</SelectItem>
                            <SelectItem value="on_hold">⚠️ On Hold</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <DialogFooter className="gap-3 pt-6 border-t border-gray-200">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel} 
                    disabled={isSubmitting}
                    className="h-12 px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-lg transition-all duration-200"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update Request' : 'Submit for Approval'}
                </Button>
            </DialogFooter>
        </form>
    );
};

// Enhanced Overtime Card Component with better data handling
const OvertimeCard = ({ overtime, onEdit, onDelete, view = 'employee', onStatusUpdate }) => {
    const [showActions, setShowActions] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'No Date';
        try {
            return new Date(dateString).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'No Date';
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return 'Invalid Date';
        }
    };

    return (
        <Card className="group relative overflow-hidden border-l-4 transition-all duration-300 hover:shadow-xl border-l-indigo-500 bg-white">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 truncate flex items-center gap-2">
                            {overtime.employee_name || 'Unknown Employee'}
                            {overtime.department && (
                                <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                                    <Building className="h-3 w-3 mr-1" />
                                    {overtime.department}
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 flex items-center gap-4 mt-1 flex-wrap">
                            <span className="font-mono">ID: {overtime.employee_id || 'No ID'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <CalendarClock className="h-3 w-3" />
                                {formatDate(overtime.date)}
                            </span>
                            <span>•</span>
                            <OvertimeTypeBadge type={overtime.overtime_type} />
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={overtime.status} />
                        {view !== 'manager' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowActions(!showActions)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <div className="font-medium text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Time
                        </div>
                        <div className="text-gray-900 font-semibold">
                            {overtime.start_time || 'N/A'} - {overtime.end_time || 'N/A'}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="font-medium text-gray-500">Duration</div>
                        <div className="text-gray-900 font-bold text-lg">{overtime.hours || 0} hrs</div>
                    </div>
                </div>

                <div>
                    <div className="font-medium text-gray-500 text-sm mb-1 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Reason
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {overtime.reason || 'No reason provided'}
                    </p>
                </div>

                {overtime.manager_comments && (
                    <div>
                        <div className="font-medium text-gray-500 text-sm mb-1 flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Manager Comments
                        </div>
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                            {overtime.manager_comments}
                        </p>
                    </div>
                )}

                <div className="text-xs text-gray-400 flex items-center gap-4">
                    <span>Submitted: {formatDateTime(overtime.created_at)}</span>
                    {overtime.updated_at && overtime.updated_at !== overtime.created_at && (
                        <span>Updated: {formatDateTime(overtime.updated_at)}</span>
                    )}
                </div>

                {showActions && view !== 'manager' && (
                    <div className="absolute top-12 right-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2 space-y-1 min-w-[120px]">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                onEdit(overtime);
                                setShowActions(false);
                            }}
                            className="w-full justify-start text-gray-700 hover:bg-gray-50"
                        >
                            <Edit className="h-3 w-3 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                onDelete(overtime);
                                setShowActions(false);
                            }}
                            className="w-full justify-start text-rose-600 hover:bg-rose-50"
                        >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Enhanced List View Component with better data handling
const OvertimeListView = ({ overtime, onEdit, onDelete, onStatusUpdate, view }) => {
    const [showActions, setShowActions] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'No Date';
        try {
            return new Date(dateString).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'No Date';
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return 'Invalid Date';
        }
    };

    return (
        <div className="flex items-center gap-4 p-6 border-b border-gray-100 hover:bg-indigo-50 transition-colors group bg-white">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="font-semibold text-gray-900">{overtime.employee_name || 'Unknown Employee'}</div>
                    <Badge variant="outline" className="text-xs font-mono bg-gray-50">
                        {overtime.employee_id || 'No ID'}
                    </Badge>
                    <OvertimeTypeBadge type={overtime.overtime_type} />
                    {overtime.department && (
                        <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                            {overtime.department}
                        </Badge>
                    )}
                    <StatusBadge status={overtime.status} />
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        {formatDate(overtime.date)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {overtime.start_time || 'N/A'} - {overtime.end_time || 'N/A'}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-gray-900">{overtime.hours || 0} hours</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{overtime.reason || 'No reason provided'}</p>
                <div className="text-xs text-gray-400 mt-2">
                    Submitted: {formatDateTime(overtime.created_at)}
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                {view === 'manager' && overtime.status === 'pending' ? (
                    <div className="flex gap-2">
                        <Button 
                            size="sm" 
                            onClick={() => onStatusUpdate(overtime.id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                        >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Approve
                        </Button>
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onStatusUpdate(overtime.id, 'rejected')}
                            className="border-rose-500 text-rose-600 hover:bg-rose-50"
                        >
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Reject
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(overtime)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                        >
                            <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(overtime)}
                            className="h-8 w-8 p-0 text-rose-400 hover:text-rose-600"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Enhanced Filters Component
const EnhancedFilters = ({ 
    searchTerm, 
    setSearchTerm, 
    filterStatus, 
    setFilterStatus, 
    filterDepartment, 
    setFilterDepartment,
    filterType,
    setFilterType,
    departments,
    showFilters,
    setShowFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
}) => {
    const sortOptions = [
        { value: 'date', label: 'Date' },
        { value: 'employee_name', label: 'Employee Name' },
        { value: 'hours', label: 'Duration' },
        { value: 'status', label: 'Status' },
        { value: 'overtime_type', label: 'Overtime Type' }
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by employee name, ID, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] h-12 border-gray-300">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="h-12 w-12 border-gray-300"
                    >
                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Filter Toggle */}
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                    <FilterIcon className="h-4 w-4" />
                    Filters
                    {(filterStatus !== 'all' || filterDepartment !== 'all' || filterType !== 'all') && (
                        <Badge variant="secondary" className="ml-1 bg-indigo-100 text-indigo-700">
                            {[filterStatus, filterDepartment, filterType].filter(f => f !== 'all').length}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Status</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">⏳ Pending</SelectItem>
                                <SelectItem value="approved">✅ Approved</SelectItem>
                                <SelectItem value="rejected">❌ Rejected</SelectItem>
                                <SelectItem value="on_hold">⚠️ On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Department</Label>
                        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                            <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map(dept => (
                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Overtime Type</Label>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {Object.values(OVERTIME_TYPES).map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    );
};

// View Toggle Component
const ViewToggle = ({ viewMode, onViewModeChange }) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="h-8 px-3 bg-white text-gray-700 shadow-sm"
            >
                <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="h-8 px-3 bg-white text-gray-700 shadow-sm"
            >
                <List className="h-4 w-4" />
            </Button>
        </div>
    );
};

// Stats Cards Component with better data handling
const StatsCards = ({ overtimeRequests }) => {
    const stats = useMemo(() => {
        const totalHours = overtimeRequests.reduce((sum, req) => sum + parseFloat(req.hours || 0), 0);
        const pendingCount = overtimeRequests.filter(req => req.status === 'pending').length;
        const approvedCount = overtimeRequests.filter(req => req.status === 'approved').length;
        const rejectedCount = overtimeRequests.filter(req => req.status === 'rejected').length;
        
        return {
            totalRequests: overtimeRequests.length,
            totalHours: totalHours.toFixed(1),
            pendingCount,
            approvedCount,
            rejectedCount,
            approvalRate: overtimeRequests.length > 0 ? ((approvedCount / overtimeRequests.length) * 100).toFixed(1) : 0,
        };
    }, [overtimeRequests]);

    const cards = [
        {
            title: "Total Requests",
            value: stats.totalRequests,
            subtitle: `${stats.totalHours} total hours`,
            icon: FileText,
            color: "indigo",
            gradient: "from-indigo-500 to-blue-500"
        },
        {
            title: "Pending Review",
            value: stats.pendingCount,
            subtitle: "Awaiting approval",
            icon: Clock,
            color: "amber",
            gradient: "from-amber-500 to-orange-500"
        },
        {
            title: "Approved",
            value: stats.approvedCount,
            subtitle: `${stats.totalHours} hours approved`,
            icon: CheckCircle,
            color: "emerald",
            gradient: "from-emerald-500 to-green-500"
        },
        {
            title: "Approval Rate",
            value: `${stats.approvalRate}%`,
            subtitle: "Of all requests",
            icon: TrendingUp,
            color: "purple",
            gradient: "from-purple-500 to-pink-500"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <Card key={index} className="relative overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg bg-${card.color}-100`}>
                            <card.icon className={`h-4 w-4 text-${card.color}-600`} />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-2xl font-bold text-foreground">{card.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Main Component with Enhanced Design
export default function OvertimePage() {
    const { overtimeRequests, isLoading, error, handleAddOvertime, handleUpdateOvertime, handleStatusUpdate, handleDeleteOvertime, clearError } = useOvertimeManagement();
    const { employees, isLoadingEmployees, employeeError } = useEmployeeManagement();

    // Enhanced State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDepartment, setFilterDepartment] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedOvertime, setSelectedOvertime] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [activeViewTab, setActiveViewTab] = useState("employee");
    const [viewMode, setViewMode] = useState("grid");
    const [showFilters, setShowFilters] = useState(false);

    const perPage = viewMode === 'grid' ? 8 : 15;

    // Get unique departments with null safety
    const departments = useMemo(() => {
        const depts = [...new Set(overtimeRequests.map(req => req.department).filter(Boolean))];
        return depts.sort();
    }, [overtimeRequests]);

    // Enhanced Filtering and Sorting with null safety
    const processedRequests = useMemo(() => {
        let filtered = overtimeRequests
            .filter(req => {
                const name = (req.employee_name || '').toLowerCase();
                const id = (req.employee_id || '').toLowerCase();
                const dept = (req.department || '').toLowerCase();
                const passesSearch = name.includes(searchTerm.toLowerCase()) || 
                                   id.includes(searchTerm.toLowerCase()) ||
                                   dept.includes(searchTerm.toLowerCase());
                const passesStatusFilter = filterStatus === "all" || req.status === filterStatus;
                const passesDeptFilter = filterDepartment === "all" || req.department === filterDepartment;
                const passesTypeFilter = filterType === "all" || req.overtime_type === filterType;
                return passesSearch && passesStatusFilter && passesDeptFilter && passesTypeFilter;
            })
            .sort((a, b) => {
                let aVal = a[sortBy] ?? "";
                let bVal = b[sortBy] ?? "";
                
                if (sortBy === 'hours') {
                    const aHours = parseFloat(a.hours || 0);
                    const bHours = parseFloat(b.hours || 0);
                    const diff = aHours - bHours;
                    return sortOrder === "asc" ? diff : -diff;
                }
                
                if (sortBy === 'date') {
                    const aDate = a.date ? new Date(a.date) : new Date(0);
                    const bDate = b.date ? new Date(b.date) : new Date(0);
                    return sortOrder === "asc" 
                        ? aDate - bDate
                        : bDate - aDate;
                }
                
                if (sortBy === 'employee_name') {
                    aVal = (a.employee_name || '').toLowerCase();
                    bVal = (b.employee_name || '').toLowerCase();
                }
                
                const comparison = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
                return sortOrder === "asc" ? comparison : -comparison;
            });
            
        return filtered;
    }, [overtimeRequests, searchTerm, filterStatus, filterDepartment, filterType, sortBy, sortOrder]);

    // Filter requests based on active tab
    const getFilteredRequests = () => {
        switch (activeViewTab) {
            case 'employee':
                return processedRequests;
            case 'supervisor':
                return processedRequests.filter(req => req.status === 'pending');
            case 'admin':
                return processedRequests;
            default:
                return processedRequests;
        }
    };

    const displayRequests = getFilteredRequests();
    const totalPages = Math.ceil(displayRequests.length / perPage);
    const paginatedRequests = displayRequests.slice((page - 1) * perPage, page * perPage);

    useEffect(() => { setPage(1); }, [searchTerm, filterStatus, filterDepartment, filterType, sortBy, sortOrder, viewMode, activeViewTab]);

    // Handlers
    const handleAdd = () => { 
        setSelectedOvertime(null); 
        setIsDialogOpen(true); 
        clearError();
    };
    const handleEdit = (req) => { 
        setSelectedOvertime(req); 
        setIsDialogOpen(true); 
        clearError();
    };
    const handleDialogClose = () => { 
        setSelectedOvertime(null); 
        setIsDialogOpen(false); 
    };

    const handleSubmitForm = async (data) => {
        const result = selectedOvertime 
            ? await handleUpdateOvertime({ ...data, id: selectedOvertime.id }) 
            : await handleAddOvertime(data);
            
        if (result.success) {
            handleDialogClose();
        }
        return result.success;
    };
    
    const handleOvertimeDeletion = async (req) => {
        await handleDeleteOvertime(req.id, req.employee_name || 'Unknown Employee');
    };

    const handleQuickStatusUpdate = async (id, status) => {
        await handleStatusUpdate(id, status, `Status changed to ${status}`);
    };

    // Render content based on view mode
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <span className="ml-3 text-lg text-gray-600">Loading overtime requests...</span>
                </div>
            );
        }

        if (paginatedRequests.length === 0) {
            return (
                <Card className="text-center p-12 border-0 shadow-lg bg-white">
                    <CardContent className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600">No overtime requests found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {searchTerm || filterStatus !== "all" || filterDepartment !== "all" || filterType !== "all" 
                                ? "Try adjusting your search criteria or filters." 
                                : activeViewTab === 'supervisor' 
                                    ? "No pending requests requiring approval."
                                    : "Get started by creating your first overtime request."}
                        </p>
                        {activeViewTab !== 'supervisor' && (
                            <Button onClick={handleAdd} className="mt-4 gap-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800">
                                <Plus className="h-4 w-4" />
                                Create New Request
                            </Button>
                        )}
                    </CardContent>
                </Card>
            );
        }

        return (
            <>
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedRequests.map(req => (
                            <OvertimeCard 
                                key={req.id}
                                overtime={req}
                                onEdit={handleEdit}
                                onDelete={handleOvertimeDeletion}
                                onStatusUpdate={handleQuickStatusUpdate}
                                view={activeViewTab === 'supervisor' ? 'manager' : 'employee'}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="shadow-sm border-0">
                        <CardContent className="p-0">
                            {paginatedRequests.map(req => (
                                <OvertimeListView
                                    key={req.id}
                                    overtime={req}
                                    onEdit={handleEdit}
                                    onDelete={handleOvertimeDeletion}
                                    onStatusUpdate={handleQuickStatusUpdate}
                                    view={activeViewTab === 'supervisor' ? 'manager' : 'employee'}
                                />
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {displayRequests.length > 0 && (
                    <div className="flex flex-wrap justify-between items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-600">
                            Showing {Math.min(displayRequests.length, (page - 1) * perPage + 1)} to {Math.min(displayRequests.length, page * perPage)} of {displayRequests.length} requests.
                        </p>
                        <div className="flex gap-2 items-center">
                            <Button 
                                variant="outline" 
                                onClick={() => setPage(p => Math.max(1, p - 1))} 
                                disabled={page === 1}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                &larr; Previous
                            </Button>
                            <span className="px-4 py-2 text-sm border border-gray-300 rounded-full font-medium bg-white text-gray-700">
                                Page {page} of {totalPages}
                            </span>
                            <Button 
                                variant="outline" 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                                disabled={page === totalPages}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Next &rarr;
                            </Button>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="p-6 max-w-8xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-wrap justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 text-gray-900">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg">
                                    <Calculator className="h-8 w-8 text-white" />
                                </div>
                                Overtime Management
                            </h1>
                            <p className="text-lg text-gray-600 mt-2">
                                Track, approve, and manage employee overtime requests with automated calculations and compliance tracking.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                        <Button 
                            size="lg" 
                            onClick={handleAdd} 
                            disabled={isLoadingEmployees}
                            className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-lg transition-all duration-200"
                        >
                            <Plus className="h-5 w-5" /> 
                            New Request
                        </Button>
                    </div>
                </header>

                {/* Stats and Alerts */}
                <div className="space-y-4">
                    <StatsCards overtimeRequests={overtimeRequests} />
                    
                    {/* Alerts */}
                    {employeeError && (
                        <Alert variant="destructive" className="border-rose-200 bg-rose-50 text-rose-800">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Employee Data Error</AlertTitle>
                            <AlertDescription>
                                {employeeError}
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="flex justify-between items-start border-rose-200 bg-rose-50 text-rose-800">
                            <div>
                                <AlertTitle>Operation Failed</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </div>
                            <Button variant="ghost" onClick={clearError} className="text-sm p-1 h-auto ml-4 shrink-0 text-rose-700 hover:bg-rose-100">Dismiss</Button>
                        </Alert>
                    )}
                </div>

                {/* Enhanced Tabs Layout */}
                <Tabs value={activeViewTab} onValueChange={setActiveViewTab} className="space-y-6">
                    <TabsList className="flex space-x-2 bg-white p-1.5 rounded-xl shadow-lg border">
                        <TabsTrigger 
                            value="employee" 
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg flex items-center gap-2"
                        >
                            <User className="h-4 w-4" />
                            Employee Portal
                        </TabsTrigger>
                        <TabsTrigger 
                            value="supervisor" 
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg flex items-center gap-2"
                        >
                            <Shield className="h-4 w-4" />
                            Supervisor Review
                            {overtimeRequests.filter(req => req.status === 'pending').length > 0 && (
                                <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700">
                                    {overtimeRequests.filter(req => req.status === 'pending').length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger 
                            value="admin" 
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg flex items-center gap-2"
                        >
                            <FilePieChart className="h-4 w-4" />
                            Admin Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Employee Portal Tab */}
                    <TabsContent value="employee" className="space-y-6">
                        <EnhancedFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                            filterDepartment={filterDepartment}
                            setFilterDepartment={setFilterDepartment}
                            filterType={filterType}
                            setFilterType={setFilterType}
                            departments={departments}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                        />
                        {renderContent()}
                    </TabsContent>

                    {/* Supervisor Review Tab */}
                    <TabsContent value="supervisor" className="space-y-6">
                        <EnhancedFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterStatus="pending"
                            setFilterStatus={setFilterStatus}
                            filterDepartment={filterDepartment}
                            setFilterDepartment={setFilterDepartment}
                            filterType={filterType}
                            setFilterType={setFilterType}
                            departments={departments}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                        />
                        {renderContent()}
                    </TabsContent>

                    {/* Admin Analytics Tab */}
                    <TabsContent value="admin" className="space-y-6">
                        <EnhancedFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                            filterDepartment={filterDepartment}
                            setFilterDepartment={setFilterDepartment}
                            filterType={filterType}
                            setFilterType={setFilterType}
                            departments={departments}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                        />
                        {renderContent()}
                    </TabsContent>
                </Tabs>

                {/* Overtime Form Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl text-gray-900">
                                <FileText className="h-6 w-6 text-indigo-600" />
                                {selectedOvertime ? "Edit Overtime Request" : "New Overtime Request"}
                            </DialogTitle>
                        </DialogHeader>
                        {isLoadingEmployees ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                <span className="ml-3 text-lg text-gray-600">Loading employees...</span>
                            </div>
                        ) : employees.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600">No Employees Available</h3>
                                <p className="text-gray-500 mt-2">Please add employees first to create overtime requests.</p>
                                <Button asChild className="mt-4 gap-2 bg-gradient-to-r from-indigo-600 to-blue-700">
                                    <Link href="/employees">
                                        <ArrowRight className="h-4 w-4" />
                                        Manage Employees
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <OvertimeForm
                                initialData={selectedOvertime}
                                onSubmit={handleSubmitForm}
                                onCancel={handleDialogClose}
                                employees={employees}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}