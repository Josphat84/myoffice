// app/employees/page.js - FIXED VERSION
'use client';

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Users, Plus, Search, RefreshCw, ChevronDown, ChevronUp,
  User, FileText, Eye, Loader2,
  Clock, AlertCircle, Trash2, MoreVertical,
  Download, List, LayoutGrid, X, Edit, ArrowUpRight,
  Mail, MapPin, Briefcase, Building, Calendar,
  GraduationCap, Shield, Award, UserCheck,
  FilterX, Info, TrendingUp, Star, Sparkles,
  UserRound, BriefcaseBusiness, Medal,
  UsersRound, ShieldCheck, Phone, Home,
  ChevronLeft, ChevronRight, Grid, Table as TableIcon,
  MessageSquare, Target, Flag, Heart, CheckCircle2,
  XCircle, ArrowUpDown, Filter, ChevronRight as ChevronRightIcon
} from "lucide-react";
import { toast } from "sonner";

// Import Header and Footer
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// ============= STUNNING NATURE WALLPAPER COLLECTION =============
const natureWallpapers = [
  {
    url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Iceland Ice Cave",
    location: "Iceland - Crystal Ice Cave"
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Enchanted Forest",
    location: "Pacific Northwest"
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Misty Morning",
    location: "Great Smoky Mountains"
  },
  {
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Sunbeams Through Forest",
    location: "Olympic National Park"
  },
  {
    url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Alpine Lake",
    location: "Canadian Rockies"
  },
  {
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Waterfall Valley",
    location: "Yosemite National Park"
  }
];

// ============= ANIMATION STYLES =============
const animationStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce-light {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-up {
    animation: slide-up 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-bounce-light {
    animation: bounce-light 2s ease-in-out infinite;
  }

  .delay-100 { animation-delay: 100ms; opacity: 0; animation-fill-mode: forwards; }
  .delay-200 { animation-delay: 200ms; opacity: 0; animation-fill-mode: forwards; }
  .delay-300 { animation-delay: 300ms; opacity: 0; animation-fill-mode: forwards; }
  .delay-400 { animation-delay: 400ms; opacity: 0; animation-fill-mode: forwards; }
`;

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const EMPLOYEES_API = `${API_BASE}/api/employees`;

// Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return '—';
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

const calculateTenure = (engagementDate) => {
  if (!engagementDate) return "—";
  try {
    const start = new Date(engagementDate);
    const now = new Date();
    if (isNaN(start.getTime())) return "—";

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years === 0 && months === 0) return "<1 month";
    
    const parts = [];
    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    return parts.join(' ');
  } catch {
    return "—";
  }
};

const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const getClassBadgeColor = (employeeClass) => {
  if (!employeeClass) return "bg-gray-100 text-gray-800 border-gray-200";
  const colors = {
    Permanent: "bg-green-100 text-green-800 border-green-200",
    Contract: "bg-amber-100 text-amber-800 border-amber-200",
    Internship: "bg-blue-100 text-blue-800 border-blue-200",
    "Part-Time": "bg-purple-100 text-purple-800 border-purple-200"
  };
  return colors[employeeClass] || "bg-gray-100 text-gray-800 border-gray-200";
};

// API Functions - FIXED for proper update
const fetchEmployees = async () => {
  const res = await fetch(EMPLOYEES_API);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to fetch employees: ${res.status}`);
  }
  return res.json();
};

const createEmployee = async (employee) => {
  const res = await fetch(EMPLOYEES_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to create employee: ${res.status}`);
  }
  return res.json();
};

// FIXED: Update employee using the integer ID from the database
const updateEmployee = async (employeeId, employee) => {
  // Remove any fields that shouldn't be sent
  const { id, employee_id, ...updateData } = employee;
  
  // Ensure arrays are properly formatted
  updateData.qualifications = updateData.qualifications || [];
  updateData.offences = updateData.offences || [];
  updateData.awards_recognition = updateData.awards_recognition || [];
  updateData.other_positions = updateData.other_positions || [];
  
  // Remove empty strings
  if (updateData.employee_class === '') delete updateData.employee_class;
  if (updateData.supervisor === '') delete updateData.supervisor;
  if (updateData.section === '') delete updateData.section;
  if (updateData.department === '') delete updateData.department;
  if (updateData.grade === '') delete updateData.grade;
  if (updateData.previous_employer === '') delete updateData.previous_employer;
  if (updateData.drivers_license_class === '') delete updateData.drivers_license_class;
  
  const res = await fetch(`${EMPLOYEES_API}/${employeeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  
  if (!res.ok) {
    let errorMessage;
    try {
      const error = await res.json();
      errorMessage = error.detail || error.message || `Failed to update employee: ${res.status}`;
    } catch {
      errorMessage = `Failed to update employee: ${res.status}`;
    }
    throw new Error(errorMessage);
  }
  
  return res.json();
};

const deleteEmployee = async (employeeId) => {
  const res = await fetch(`${EMPLOYEES_API}/${employeeId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to delete employee: ${res.status}`);
  }
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, onClick, tooltip, gradient = 'from-primary/10 to-primary/5' }) => {
  const CardWrapper = onClick ? (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden relative group bg-white/90 backdrop-blur-sm`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              {title}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>{tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="rounded-full bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="overflow-hidden relative group bg-white/90 backdrop-blur-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              {title}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>{tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return CardWrapper;
};

// Employee Form Component
const EmployeeForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    employee_id: initialData?.employee_id || '',
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    id_number: initialData?.id_number || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    date_of_engagement: initialData?.date_of_engagement || '',
    designation: initialData?.designation || '',
    employee_class: initialData?.employee_class || '',
    supervisor: initialData?.supervisor || '',
    section: initialData?.section || '',
    department: initialData?.department || '',
    grade: initialData?.grade || '',
    qualifications: initialData?.qualifications || [],
    drivers_license_class: initialData?.drivers_license_class || '',
    ppe_issue_date: initialData?.ppe_issue_date || '',
    offences: initialData?.offences || [],
    awards_recognition: initialData?.awards_recognition || [],
    other_positions: initialData?.other_positions || [],
    previous_employer: initialData?.previous_employer || '',
  });
  
  const [tempQualification, setTempQualification] = useState('');
  const [tempOffence, setTempOffence] = useState('');
  const [tempAward, setTempAward] = useState('');
  const [tempPosition, setTempPosition] = useState('');
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('basic');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addToList = (field, value, setTemp) => {
    if (value.trim()) {
      handleChange(field, [...formData[field], value.trim()]);
      setTemp('');
    }
  };

  const removeFromList = (field, index) => {
    handleChange(field, formData[field].filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employee_id?.trim()) newErrors.employee_id = 'Employee ID is required';
    if (!formData.first_name?.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name?.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.id_number?.trim()) newErrors.id_number = 'ID number is required';
    if (!formData.date_of_engagement) newErrors.date_of_engagement = 'Engagement date is required';
    if (!formData.designation?.trim()) newErrors.designation = 'Designation is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      qualifications: formData.qualifications || [],
      offences: formData.offences || [],
      awards_recognition: formData.awards_recognition || [],
      other_positions: formData.other_positions || [],
    };
    
    if (submitData.employee_class === '') {
      delete submitData.employee_class;
    }
    
    await onSubmit(submitData);
  };

  const sections = [
    { id: 'basic', label: 'Personal', icon: UserRound },
    { id: 'employment', label: 'Employment', icon: BriefcaseBusiness },
    { id: 'qualifications', label: 'Qualifications', icon: GraduationCap },
    { id: 'additional', label: 'Additional', icon: Sparkles }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-2 border-b pb-3 flex-wrap">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              type="button"
              variant={activeSection === section.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </Button>
          );
        })}
      </div>

      <ScrollArea className="max-h-[65vh] pr-4">
        {activeSection === 'basic' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Employee ID *</Label>
                <Input
                  value={formData.employee_id}
                  onChange={(e) => handleChange('employee_id', e.target.value.toUpperCase())}
                  placeholder="e.g., EMP1001 or C1165"
                  disabled={!!initialData}
                  className={errors.employee_id ? "border-destructive" : ""}
                />
                {errors.employee_id && <p className="text-xs text-destructive">{errors.employee_id}</p>}
                {initialData && (
                  <p className="text-xs text-muted-foreground">Employee ID cannot be changed after creation</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className={errors.first_name ? "border-destructive" : ""}
                />
                {errors.first_name && <p className="text-xs text-destructive">{errors.first_name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className={errors.last_name ? "border-destructive" : ""}
                />
                {errors.last_name && <p className="text-xs text-destructive">{errors.last_name}</p>}
              </div>
              <div className="space-y-2">
                <Label>ID Number *</Label>
                <Input
                  value={formData.id_number}
                  onChange={(e) => handleChange('id_number', e.target.value)}
                  className={errors.id_number ? "border-destructive" : ""}
                />
                {errors.id_number && <p className="text-xs text-destructive">{errors.id_number}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={2}
                  placeholder="Optional"
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'employment' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Engagement Date *</Label>
                <Input
                  type="date"
                  value={formData.date_of_engagement}
                  onChange={(e) => handleChange('date_of_engagement', e.target.value)}
                  className={errors.date_of_engagement ? "border-destructive" : ""}
                />
                {errors.date_of_engagement && <p className="text-xs text-destructive">{errors.date_of_engagement}</p>}
              </div>
              <div className="space-y-2">
                <Label>Designation *</Label>
                <Input
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  className={errors.designation ? "border-destructive" : ""}
                />
                {errors.designation && <p className="text-xs text-destructive">{errors.designation}</p>}
              </div>
              <div className="space-y-2">
                <Label>Employee Class</Label>
                <Select value={formData.employee_class || "none"} onValueChange={(v) => handleChange('employee_class', v === "none" ? "" : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Input
                  value={formData.section}
                  onChange={(e) => handleChange('section', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Input
                  value={formData.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label>Supervisor</Label>
                <Input
                  value={formData.supervisor}
                  onChange={(e) => handleChange('supervisor', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label>Previous Employer</Label>
                <Input
                  value={formData.previous_employer}
                  onChange={(e) => handleChange('previous_employer', e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'qualifications' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <Label>Qualifications</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add qualification"
                  value={tempQualification}
                  onChange={(e) => setTempQualification(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToList('qualifications', tempQualification, setTempQualification)}
                />
                <Button type="button" variant="outline" onClick={() => addToList('qualifications', tempQualification, setTempQualification)}>
                  Add
                </Button>
              </div>
              {formData.qualifications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.qualifications.map((q, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      {q}
                      <button
                        type="button"
                        onClick={() => removeFromList('qualifications', idx)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'additional' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Driver's License</Label>
                <Input
                  value={formData.drivers_license_class}
                  onChange={(e) => handleChange('drivers_license_class', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label>PPE Issue Date</Label>
                <Input
                  type="date"
                  value={formData.ppe_issue_date}
                  onChange={(e) => handleChange('ppe_issue_date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Other Positions</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add other position"
                  value={tempPosition}
                  onChange={(e) => setTempPosition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToList('other_positions', tempPosition, setTempPosition)}
                />
                <Button type="button" variant="outline" onClick={() => addToList('other_positions', tempPosition, setTempPosition)}>
                  Add
                </Button>
              </div>
              {formData.other_positions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.other_positions.map((p, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1">
                      {p}
                      <button
                        type="button"
                        onClick={() => removeFromList('other_positions', idx)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Awards & Recognition</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add award"
                  value={tempAward}
                  onChange={(e) => setTempAward(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToList('awards_recognition', tempAward, setTempAward)}
                />
                <Button type="button" variant="outline" onClick={() => addToList('awards_recognition', tempAward, setTempAward)}>
                  Add
                </Button>
              </div>
              {formData.awards_recognition.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.awards_recognition.map((a, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1">
                      <Award className="h-3 w-3" />
                      {a}
                      <button
                        type="button"
                        onClick={() => removeFromList('awards_recognition', idx)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Offences</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add offence record"
                  value={tempOffence}
                  onChange={(e) => setTempOffence(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToList('offences', tempOffence, setTempOffence)}
                />
                <Button type="button" variant="outline" onClick={() => addToList('offences', tempOffence, setTempOffence)}>
                  Add
                </Button>
              </div>
              {formData.offences.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.offences.map((o, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {o}
                      <button
                        type="button"
                        onClick={() => removeFromList('offences', idx)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </ScrollArea>

      <DialogFooter className="gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Employee' : 'Create Employee'}
        </Button>
      </DialogFooter>
    </form>
  );
};

// Employee Card Component
const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const fullName = `${employee.first_name} ${employee.last_name}`;
  const tenure = calculateTenure(employee.date_of_engagement);
  const qualCount = employee.qualifications?.length ?? 0;
  const awardCount = employee.awards_recognition?.length ?? 0;

  return (
    <Card className="group relative hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(employee.first_name, employee.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-semibold truncate">
                  {fullName}
                </CardTitle>
                <Badge variant="outline" className="text-xs font-mono">
                  {employee.employee_id}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={getClassBadgeColor(employee.employee_class || "")}>
                  {employee.employee_class || "Unclassified"}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {employee.designation}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(employee)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(employee)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Engagement
            </p>
            <p className="font-medium">{formatDate(employee.date_of_engagement)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Tenure
            </p>
            <p className="font-medium">{tenure}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {employee.department && (
            <Badge variant="outline" className="text-xs">
              <Building className="h-3 w-3 mr-1" />
              {employee.department}
            </Badge>
          )}
          {qualCount > 0 && (
            <Badge variant="outline" className="text-xs">
              <GraduationCap className="h-3 w-3 mr-1" />
              {qualCount} qual{qualCount !== 1 ? 's' : ''}
            </Badge>
          )}
          {awardCount > 0 && (
            <Badge variant="outline" className="text-xs">
              <Award className="h-3 w-3 mr-1" />
              {awardCount} award{awardCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3 w-full">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Address</p>
              <p className="text-sm bg-muted/30 p-3 rounded-lg break-words">
                {employee.address || 'No address provided'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">ID Number</p>
                <p className="font-medium">{employee.id_number}</p>
              </div>
              {employee.section && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Section</p>
                  <p className="font-medium">{employee.section}</p>
                </div>
              )}
              {employee.grade && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Grade</p>
                  <p className="font-medium">{employee.grade}</p>
                </div>
              )}
              {employee.supervisor && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Supervisor</p>
                  <p className="font-medium">{employee.supervisor}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 border-t bg-muted/10">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full gap-2" 
          onClick={() => onEdit(employee)}
        >
          <Edit className="h-4 w-4" /> 
          <span>Edit employee details</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Employee List Item Component
const EmployeeListItem = ({ employee, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const fullName = `${employee.first_name} ${employee.last_name}`;
  const tenure = calculateTenure(employee.date_of_engagement);
  const qualCount = employee.qualifications?.length ?? 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg border hover:shadow-md transition-all duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(employee.first_name, employee.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-medium text-gray-900">{fullName}</h3>
                <Badge variant="outline" className="text-xs font-mono">
                  {employee.employee_id}
                </Badge>
                <Badge className={getClassBadgeColor(employee.employee_class || "")}>
                  {employee.employee_class || "Unclassified"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {employee.designation}
                </span>
                {employee.department && (
                  <span className="flex items-center gap-1">
                    <Building className="h-3.5 w-3.5" />
                    {employee.department}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {tenure}
                </span>
                {qualCount > 0 && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {qualCount} qual
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            {employee.email && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`mailto:${employee.email}`, '_blank')}>
                <Mail className="h-4 w-4" />
              </Button>
            )}
            {employee.phone && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`tel:${employee.phone}`, '_self')}>
                <Phone className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(employee)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(employee)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Personal Information</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-muted-foreground">ID Number:</span> {employee.id_number}</div>
                  <div><span className="text-muted-foreground">Address:</span> {employee.address || 'Not provided'}</div>
                  {employee.email && <div><span className="text-muted-foreground">Email:</span> {employee.email}</div>}
                  {employee.phone && <div><span className="text-muted-foreground">Phone:</span> {employee.phone}</div>}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Employment Details</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-muted-foreground">Engagement:</span> {formatDate(employee.date_of_engagement)}</div>
                  <div><span className="text-muted-foreground">Tenure:</span> {tenure}</div>
                  {employee.section && <div><span className="text-muted-foreground">Section:</span> {employee.section}</div>}
                  {employee.grade && <div><span className="text-muted-foreground">Grade:</span> {employee.grade}</div>}
                  {employee.supervisor && <div><span className="text-muted-foreground">Supervisor:</span> {employee.supervisor}</div>}
                </div>
              </div>
            </div>

            {employee.qualifications?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Qualifications</h4>
                <div className="flex flex-wrap gap-1.5">
                  {employee.qualifications.map((q, idx) => (
                    <Badge key={idx} variant="outline" className="bg-primary/5">
                      {q}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Cards Component
const StatsCards = ({ employees }) => {
  const total = employees.length;
  const uniqueDesignations = new Set(employees.map(e => e.designation).filter(Boolean)).size;
  const totalQuals = employees.reduce((sum, e) => sum + (e.qualifications?.length || 0), 0);
  const activeEmployees = employees.filter(e => e.employee_class === "Permanent").length;

  const stats = [
    { label: "Total Employees", value: total, icon: Users, tooltip: "Total number of employees in the system" },
    { label: "Unique Roles", value: uniqueDesignations, icon: Briefcase, tooltip: "Number of distinct job positions" },
    { label: "Qualifications", value: totalQuals, icon: GraduationCap, tooltip: "Total qualifications held by employees" },
    { label: "Active Staff", value: activeEmployees, icon: UserCheck, tooltip: "Permanent employees currently active" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          title={stat.label}
          value={stat.value}
          icon={stat.icon}
          tooltip={stat.tooltip}
        />
      ))}
    </div>
  );
};

// Advanced Filters Component
const AdvancedFilters = ({
  searchTerm,
  onSearchChange,
  filterDesignation,
  onFilterDesignationChange,
  filterClass,
  onFilterClassChange,
  filterDepartment,
  onFilterDepartmentChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
  activeFilterCount,
  uniqueDesignations,
  uniqueClasses,
  uniqueDepartments
}) => {
  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, or ID number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 bg-white/80 backdrop-blur-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Role / Designation</Label>
          <Select value={filterDesignation} onValueChange={onFilterDesignationChange}>
            <SelectTrigger className="bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueDesignations.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Employment Class</Label>
          <Select value={filterClass} onValueChange={onFilterClassChange}>
            <SelectTrigger className="bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {uniqueClasses.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Department</Label>
          <Select value={filterDepartment} onValueChange={onFilterDepartmentChange}>
            <SelectTrigger className="bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-muted-foreground">Sort By</Label>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first_name">Name</SelectItem>
              <SelectItem value="employee_id">Employee ID</SelectItem>
              <SelectItem value="designation">Role</SelectItem>
              <SelectItem value="department">Department</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="icon" onClick={onSortOrderChange}>
          {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
          </span>
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 gap-1">
            <FilterX className="h-3 w-3" /> Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </Button>
      <span className="text-sm text-muted-foreground px-3 py-1">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="gap-1"
      >
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Main Component
export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [sortBy, setSortBy] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("cards");
  const [activeTab, setActiveTab] = useState("profiles");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  const itemsPerPage = 12;

  // Rotating nature wallpaper
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWallpaperIndex((prev) => (prev + 1) % natureWallpapers.length);
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const uniqueDesignations = useMemo(() => {
    const designations = new Set(employees.map(e => e.designation).filter(Boolean));
    return Array.from(designations).sort();
  }, [employees]);

  const uniqueClasses = useMemo(() => {
    const classes = new Set(employees.map(e => e.employee_class || "Unclassified"));
    return Array.from(classes).sort();
  }, [employees]);

  const uniqueDepartments = useMemo(() => {
    const departments = new Set(employees.map(e => e.department).filter(Boolean));
    return Array.from(departments).sort();
  }, [employees]);

  const processedEmployees = useMemo(() => {
    let filtered = [...employees];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(term) ||
        emp.employee_id?.toLowerCase().includes(term) ||
        (emp.designation?.toLowerCase() || '').includes(term) ||
        (emp.department?.toLowerCase() || '').includes(term) ||
        (emp.id_number?.toLowerCase() || '').includes(term)
      );
    }

    if (filterDesignation !== "all") {
      filtered = filtered.filter(emp => emp.designation === filterDesignation);
    }

    if (filterClass !== "all") {
      filtered = filtered.filter(emp => (emp.employee_class || "Unclassified") === filterClass);
    }

    if (filterDepartment !== "all") {
      filtered = filtered.filter(emp => emp.department === filterDepartment);
    }

    filtered.sort((a, b) => {
      let aVal, bVal;
      
      if (sortBy === 'first_name') {
        aVal = `${a.first_name} ${a.last_name}`;
        bVal = `${b.first_name} ${b.last_name}`;
      } else {
        aVal = a[sortBy] || '';
        bVal = b[sortBy] || '';
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [employees, searchTerm, filterDesignation, filterClass, filterDepartment, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedEmployees.length / itemsPerPage);
  const paginatedEmployees = processedEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDesignation, filterClass, filterDepartment, sortBy, sortOrder]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterDesignation !== "all") count++;
    if (filterClass !== "all") count++;
    if (filterDepartment !== "all") count++;
    return count;
  }, [searchTerm, filterDesignation, filterClass, filterDepartment]);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setIsDialogOpen(true);
  };

  const handleDelete = async (emp) => {
    if (!confirm(`Delete ${emp.first_name} ${emp.last_name}? This action cannot be undone.`)) return;
    try {
      await deleteEmployee(emp.id);
      await loadEmployees();
      toast.success(`${emp.first_name} ${emp.last_name} deleted`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (selectedEmployee) {
        // For update, use the numeric ID from the selected employee
        await updateEmployee(selectedEmployee.id, formData);
        toast.success('Employee updated successfully');
      } else {
        await createEmployee(formData);
        toast.success('Employee created successfully');
      }
      await loadEmployees();
      setIsDialogOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDesignation("all");
    setFilterClass("all");
    setFilterDepartment("all");
    setSortBy("first_name");
    setSortOrder("asc");
    setCurrentPage(1);
    toast.success('All filters cleared');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const stats = useMemo(() => {
    const total = processedEmployees.length;
    const uniqueDesignationsCount = new Set(processedEmployees.map(e => e.designation).filter(Boolean)).size;
    const totalQuals = processedEmployees.reduce((sum, e) => sum + (e.qualifications?.length || 0), 0);
    const activeEmployees = processedEmployees.filter(e => e.employee_class === "Permanent").length;
    return { total, uniqueDesignationsCount, totalQuals, activeEmployees };
  }, [processedEmployees]);

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <div className="min-h-screen">
        {/* Rotating Nature Wallpaper Background */}
        <div className="fixed inset-0 z-0">
          {natureWallpapers.map((wallpaper, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-2000 ease-in-out"
              style={{
                backgroundImage: `url('${wallpaper.url}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === currentWallpaperIndex ? 1 : 0,
                filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
                transition: 'opacity 2000ms ease-in-out',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-4 right-4 text-white/30 text-xs font-light">
            {natureWallpapers[currentWallpaperIndex].location}
          </div>
        </div>

        <div className="relative z-10">
          <Header 
            isLoggedIn={isLoggedIn} 
            user={user} 
            onLogout={handleLogout} 
          />

          <main className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2 animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent drop-shadow-lg">
                Personnel Registry
              </h1>
              <p className="text-white/90 max-w-2xl mx-auto drop-shadow-md">
                Comprehensive employee management system with detailed profiles and performance tracking
              </p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up delay-100">
              <StatCard title="Total Employees" value={stats.total} icon={Users} />
              <StatCard title="Unique Roles" value={stats.uniqueDesignationsCount} icon={Briefcase} />
              <StatCard title="Qualifications" value={stats.totalQuals} icon={GraduationCap} />
              <StatCard title="Active Staff" value={stats.activeEmployees} icon={UserCheck} />
            </div>

            {/* Add Employee Button */}
            <div className="flex justify-end animate-slide-up delay-200">
              <Button 
                onClick={handleAdd} 
                className="gap-2 bg-primary hover:bg-primary/90 shadow-lg"
                size="lg"
              >
                <Plus className="h-5 w-5" /> Add New Employee
              </Button>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="animate-slide-up delay-250">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button variant="ghost" size="sm" className="ml-auto h-6 px-2" onClick={() => setError(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </Alert>
            )}

            {/* Filter Section */}
            <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm animate-slide-up delay-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-transparent">
                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Filters</h2>
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFilterCount} active
                        </Badge>
                      )}
                      <Badge variant="outline" className="ml-2 bg-background">
                        {processedEmployees.length} of {employees.length} records
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                        <FilterX className="h-4 w-4" /> Clear
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="mt-4">
                      <AdvancedFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterDesignation={filterDesignation}
                        onFilterDesignationChange={setFilterDesignation}
                        filterClass={filterClass}
                        onFilterClassChange={setFilterClass}
                        filterDepartment={filterDepartment}
                        onFilterDepartmentChange={setFilterDepartment}
                        sortBy={sortBy}
                        onSortByChange={setSortBy}
                        sortOrder={sortOrder}
                        onSortOrderChange={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                        onClearFilters={clearFilters}
                        activeFilterCount={activeFilterCount}
                        uniqueDesignations={uniqueDesignations}
                        uniqueClasses={uniqueClasses}
                        uniqueDepartments={uniqueDepartments}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardHeader>
            </Card>

            {/* View Toggle */}
            <div className="flex justify-end animate-slide-up delay-400">
              <div className="flex rounded-lg border bg-background p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-md px-3"
                  onClick={() => setViewMode('cards')}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" /> Cards
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-md px-3"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-1" /> List
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : paginatedEmployees.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No employees found</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {employees.length === 0
                        ? 'Get started by adding your first employee.'
                        : 'No records match your current filters. Try adjusting them.'}
                    </p>
                    {employees.length === 0 && (
                      <Button onClick={handleAdd} className="gap-2">
                        <Plus className="h-4 w-4" /> Add Employee
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : viewMode === 'cards' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedEmployees.map((emp) => (
                    <EmployeeCard
                      key={emp.id}
                      employee={emp}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedEmployees.map((emp) => (
                    <EmployeeListItem
                      key={emp.id}
                      employee={emp}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </main>

          <Footer />
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl bg-white/95 backdrop-blur-sm">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
            <DialogTitle className="text-xl font-semibold">
              {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
            <DialogDescription>
              Fill in the employee details. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-6">
            <EmployeeForm
              initialData={selectedEmployee}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}