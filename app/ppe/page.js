"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Shield, Plus, Search, RefreshCw, Filter, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, User, FileText, Eye, Loader2,
  Clock, AlertCircle, Send, Phone, Trash2, MoreVertical,
  Download, Edit, X, HardHat, Zap, ArrowUpRight, TrendingUp,
  BarChart3, Users, Briefcase, FileDown, List, LayoutGrid,
  Mail, Copy, Share2, Bookmark, PieChart, Package, ShoppingCart,
  AlertTriangle, ThumbsUp, ThumbsDown, Calendar, MapPin, Tag,
  Mountain, Gem, Landmark, Drill, Pickaxe, Factory, UserCheck,
  Building, Settings, Award, Crown, FilterX, Layers,
  Database, Eye as EyeIcon, EyeOff
} from "lucide-react";
import Link from "next/link";

// Shadcn/ui imports
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const PPE_API = `${API_BASE}/api/ppe`;

// PPE Types
const PPE_TYPES = {
  helmet: {
    name: 'Safety Helmet',
    shortName: 'Helmet',
    color: '#0f172a',
    icon: HardHat,
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    gradient: 'from-slate-600 to-slate-700',
    description: 'Head protection for underground and surface operations'
  },
  gloves: {
    name: 'Safety Gloves',
    shortName: 'Gloves',
    color: '#dc2626',
    icon: Shield,
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    gradient: 'from-rose-500 to-rose-600',
    description: 'Hand protection for handling materials and chemicals'
  },
  glasses: {
    name: 'Safety Glasses',
    shortName: 'Glasses',
    color: '#0369a1',
    icon: Eye,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Eye protection from dust and debris'
  },
  vest: {
    name: 'High-Vis Vest',
    shortName: 'Vest',
    color: '#f59e0b',
    icon: User,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    gradient: 'from-amber-500 to-amber-600',
    description: 'High visibility clothing for surface operations'
  },
  gumboots: {
    name: 'Safety Gum Boots',
    shortName: 'GumBoots',
    color: '#7c3aed',
    icon: Zap,
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200',
    gradient: 'from-violet-500 to-violet-600',
    description: 'Steel-toe foot protection'
  },
  safety_shoes: {
    name: 'Safety Shoes',
    shortName: 'Shoes',
    color: '#2563eb',
    icon: Pickaxe,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Protective footwear for various work environments'
  },
  harness: {
    name: 'Safety Harness',
    shortName: 'Harness',
    color: '#059669',
    icon: Users,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    gradient: 'from-emerald-500 to-emerald-600',
    description: 'Fall protection for heights and shafts'
  },
  respirator: {
    name: 'Respirator',
    shortName: 'Respirator',
    color: '#0d9488',
    icon: Shield,
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    gradient: 'from-teal-500 to-teal-600',
    description: 'Respiratory protection from dust and chemicals'
  },
  Cap_lamp_belt: {
    name: 'Cap Lamp Belt',
    shortName: 'Lamp belt',
    color: '#db2777',
    icon: Zap,
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-200',
    gradient: 'from-pink-500 to-pink-600',
    description: 'Lighting for underground operations'
  },
  worksuit: {
    name: 'Protective Work Suit',
    shortName: 'Work Suit',
    color: '#f97316',
    icon: Briefcase,
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    gradient: 'from-orange-500 to-orange-600',
    description: 'Full body protection for various work environments'
  },
  rainsuit: {
    name: 'Rain Suit',
    shortName: 'Rain Suit',
    color: '#14b8a6',
    icon: Briefcase,
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    gradient: 'from-teal-500 to-teal-600',
    description: 'Waterproof protection for wet conditions'
  },
  overall:  {
    name: 'Protective Overall',
    shortName: 'Overall',
    color: '#8b5cf6',
    icon: Briefcase,
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200',
    gradient: 'from-violet-500 to-violet-600',
    description: 'Full body protective clothing'
  }
};

// Mine Locations
const MINE_LOCATIONS = {
  'Deep Shaft A': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Drill },
  'Deep Shaft B': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Drill },
  'Open Pit': { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Mountain },
  'Processing Plant': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Factory },
  'Workshop': { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Settings },
  'Surface': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Landmark },
  'All Areas': { color: 'bg-rose-100 text-rose-800 border-rose-200', icon: Gem }
};

// Condition types
const CONDITION_TYPES = {
  excellent: { name: 'Excellent', variant: 'success', icon: Award },
  good: { name: 'Good', variant: 'default', icon: ThumbsUp },
  fair: { name: 'Fair', variant: 'secondary', icon: AlertTriangle },
  poor: { name: 'Poor', variant: 'destructive', icon: AlertTriangle },
  damaged: { name: 'Damaged', variant: 'destructive', icon: ThumbsDown }
};

// Status types – using Badge variants
const STATUS_TYPES = {
  active: { name: 'Active', variant: 'success', icon: CheckCircle2 },
  expired: { name: 'Due', variant: 'destructive', icon: XCircle },
  returned: { name: 'Returned', variant: 'secondary', icon: CheckCircle2 },
  lost: { name: 'Lost', variant: 'outline', icon: XCircle },
  damaged: { name: 'Damaged', variant: 'destructive', icon: AlertTriangle }
};

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

const isExpiringSoon = (expiryDate, days = 30) => {
  if (!expiryDate) return false;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays > 0;
};

const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

// API Functions
const fetchPPERecords = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.append(key, value);
    });

    const url = params.toString() ? `${PPE_API}?${params.toString()}` : PPE_API;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching PPE records:', error);
    throw error;
  }
};

const fetchPPEStats = async () => {
  try {
    const response = await fetch(`${PPE_API}/stats/summary`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching PPE stats:', error);
    return null;
  }
};

const createPPERecord = async (recordData) => {
  try {
    if (!recordData.employee_id?.trim()) throw new Error('Employee ID is required');
    if (!recordData.employee_name?.trim()) throw new Error('Employee name is required');

    const formattedData = {
      ...recordData,
      department: 'MAINTENANCE',
      expiry_date: recordData.expiry_date || null,
    };

    const response = await fetch(PPE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating PPE record:', error);
    throw error;
  }
};

const updatePPERecord = async (recordId, recordData) => {
  try {
    const formattedData = {
      ...recordData,
      department: 'MAINTENANCE',
      expiry_date: recordData.expiry_date || null,
    };

    const response = await fetch(`${PPE_API}/${recordId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) throw new Error(`Failed to update: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error updating PPE record:', error);
    throw error;
  }
};

const deletePPERecord = async (recordId) => {
  try {
    const response = await fetch(`${PPE_API}/${recordId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error deleting PPE record:', error);
    throw error;
  }
};

// ============= Component Sub‑components =============

// Status Badge
const StatusBadge = ({ status }) => {
  const config = STATUS_TYPES[status] || STATUS_TYPES.active;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="gap-1 px-2 py-1 whitespace-nowrap">
      <Icon className="h-3 w-3" />
      {config.name}
    </Badge>
  );
};

// Condition Badge
const ConditionBadge = ({ condition }) => {
  const config = CONDITION_TYPES[condition] || CONDITION_TYPES.good;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="gap-1 px-2 py-1 whitespace-nowrap">
      <Icon className="h-3 w-3" />
      {config.name}
    </Badge>
  );
};

// Location Badge
const LocationBadge = ({ location }) => {
  const config = MINE_LOCATIONS[location] || { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: MapPin };
  const Icon = config.icon || MapPin;
  return (
    <Badge variant="outline" className={`gap-1 px-2 py-1 ${config.color}`}>
      <Icon className="h-3 w-3" />
      {location}
    </Badge>
  );
};

// Stat Card
const StatCard = ({ title, value, icon: Icon, onClick, subtitle, color = "slate" }) => {
  const colorClasses = {
    slate: 'from-slate-600 to-slate-700',
    blue: 'from-blue-600 to-blue-700',
    emerald: 'from-emerald-600 to-emerald-700',
    rose: 'from-rose-600 to-rose-700',
    amber: 'from-amber-600 to-amber-700',
    violet: 'from-violet-600 to-violet-700'
  };

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${onClick ? 'hover:scale-[1.02]' : ''}`} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Individual PPE Item Card
const PPEItemCard = ({ record, onEdit, onDelete, onViewDetails }) => {
  const ppeType = PPE_TYPES[record.ppe_type] || PPE_TYPES.helmet;
  const Icon = ppeType.icon;
  const isExpiring = isExpiringSoon(record.expiry_date);
  const isItemExpired = isExpired(record.expiry_date);

  return (
    <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => onViewDetails(record)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${ppeType.bgColor} border ${ppeType.borderColor} group-hover:scale-110 transition-transform`}>
              <Icon className={`h-4 w-4 ${ppeType.textColor}`} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{record.item_name}</CardTitle>
              <CardDescription className="text-xs">{ppeType.name}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewDetails(record); }}>
                <Eye className="h-4 w-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(record); }}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(record.id); }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Issued</span>
            <span className="font-medium">{formatDate(record.issue_date)}</span>
          </div>
          {record.expiry_date && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expires</span>
              <span className={`font-medium ${isItemExpired ? 'text-destructive' : isExpiring ? 'text-amber-600' : ''}`}>
                {formatDate(record.expiry_date)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Size</span>
            <span className="font-medium">{record.size || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Condition</span>
            <ConditionBadge condition={record.condition} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={record.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Employee PPE Card
const EmployeePPECard = ({ employee, records, onIssueNew, onEditItem, onDeleteItem, onViewDetails }) => {
  const [expanded, setExpanded] = useState(false);
  const activeRecords = records.filter(r => r.status === 'active');
  const expiredRecords = records.filter(r => r.status === 'expired');

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700">
              <AvatarFallback>{employee.employee_name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">{employee.employee_name}</CardTitle>
              <CardDescription>
                {employee.position} • {employee.employee_id}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {activeRecords.length} Active
                </Badge>
                {expiredRecords.length > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" /> {expiredRecords.length} Due
                  </Badge>
                )}
                {records.filter(r => isExpiringSoon(r.expiry_date)).length > 0 && (
                  <Badge variant="warning" className="gap-1">
                    <AlertTriangle className="h-3 w-3" /> {records.filter(r => isExpiringSoon(r.expiry_date)).length} Soon to Due
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => onIssueNew(employee)}>
              <Plus className="h-4 w-4 mr-2" /> Issue PPE
            </Button>
            <Button variant="outline" size="icon" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          {records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((record) => (
                <PPEItemCard
                  key={record.id}
                  record={record}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/50 rounded-lg border">
              <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="font-semibold">No PPE items issued yet</p>
              <p className="text-sm text-muted-foreground mt-1">Click "Issue PPE" to add equipment</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// PPE Item Detail Modal
const PPEItemDetailModal = ({ item, isOpen, onClose, onEdit }) => {
  if (!item) return null;

  const ppeType = PPE_TYPES[item.ppe_type] || PPE_TYPES.helmet;
  const Icon = ppeType.icon;

  const fields = [
    { label: 'Employee', value: `${item.employee_name} (${item.employee_id})`, icon: User },
    { label: 'Position', value: item.position, icon: Briefcase },
    { label: 'Department', value: item.department, icon: Building },
    { label: 'PPE Type', value: ppeType.name, icon: Shield },
    { label: 'Item Name', value: item.item_name, icon: Package },
    { label: 'Size', value: item.size || '—', icon: Tag },
    { label: 'Issue Date', value: formatDate(item.issue_date), icon: Calendar },
    { label: 'Expiry Date', value: formatDate(item.expiry_date) || '—', icon: Clock },
    { label: 'Condition', value: CONDITION_TYPES[item.condition]?.name || item.condition, icon: Award },
    { label: 'Status', value: STATUS_TYPES[item.status]?.name || item.status, icon: Activity },
    { label: 'Location', value: item.location, icon: MapPin },
    { label: 'Mine Section', value: item.mine_section || '—', icon: Mountain },
    { label: 'Issued By', value: item.issued_by || '—', icon: UserCheck },
    { label: 'Notes', value: item.notes || '—', icon: FileText },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${ppeType.bgColor} border ${ppeType.borderColor}`}>
              <Icon className={`h-5 w-5 ${ppeType.textColor}`} />
            </div>
            PPE Item Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {fields.map((field, idx) => (
            <div key={idx} className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30">
              <field.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">{field.label}</p>
                <p className="text-sm font-semibold break-words">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => { onEdit(item); onClose(); }}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// PPE Issue Form
const PPEIssueForm = ({ isOpen, onClose, onSubmit, initialData, employee, existingEmployees }) => {
  const [formData, setFormData] = useState({
    employee_name: employee?.employee_name || initialData?.employee_name || '',
    employee_id: employee?.employee_id || initialData?.employee_id || '',
    department: 'MAINTENANCE',
    position: employee?.position || initialData?.position || '',
    ppe_type: initialData?.ppe_type || 'helmet',
    item_name: initialData?.item_name || '',
    size: initialData?.size || '',
    issue_date: initialData?.issue_date || new Date().toISOString().split('T')[0],
    expiry_date: initialData?.expiry_date || '',
    condition: initialData?.condition || 'good',
    status: initialData?.status || 'active',
    notes: initialData?.notes || '',
    issued_by: initialData?.issued_by || '',
    location: initialData?.location || 'Workshop',
    mine_section: initialData?.mine_section || ''
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.employee_id?.trim()) errors.employee_id = 'Employee ID is required';
    if (!formData.employee_name?.trim()) errors.employee_name = 'Employee name is required';
    if (!formData.position?.trim()) errors.position = 'Position is required';
    if (!formData.ppe_type?.trim()) errors.ppe_type = 'PPE type is required';
    if (!formData.item_name?.trim()) errors.item_name = 'Item name is required';
    if (!formData.issue_date) errors.issue_date = 'Issue date is required';
    if (!formData.location?.trim()) errors.location = 'Location is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        employee_id: formData.employee_id.trim(),
        employee_name: formData.employee_name.trim(),
        position: formData.position.trim(),
        item_name: formData.item_name.trim(),
        expiry_date: formData.expiry_date || null,
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEmployeeSelect = (emp) => {
    setFormData(prev => ({
      ...prev,
      employee_id: emp.employee_id,
      employee_name: emp.employee_name,
      position: emp.position,
    }));
    setFormErrors(prev => ({ ...prev, employee_id: '', employee_name: '', position: '' }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit PPE Record' : 'Issue New PPE'}</DialogTitle>
          <DialogDescription>
            {employee ? `For ${employee.employee_name} (${employee.employee_id})` : 'Add new personal protective equipment'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(formErrors).length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm font-medium text-destructive">Please fix the errors below.</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Information */}
            <div className="md:col-span-2 space-y-2">
              <Label>Employee ID *</Label>
              <AutocompleteInput
                value={formData.employee_id}
                onChange={handleChange}
                options={existingEmployees}
                placeholder="Start typing employee ID or name..."
                onSelect={handleEmployeeSelect}
                field="employee_id"
                required
              />
              {formErrors.employee_id && <p className="text-sm text-destructive">{formErrors.employee_id}</p>}
            </div>
            <div className="space-y-2">
              <Label>Employee Name *</Label>
              <Input name="employee_name" value={formData.employee_name} onChange={handleChange} required />
              {formErrors.employee_name && <p className="text-sm text-destructive">{formErrors.employee_name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Position *</Label>
              <Input name="position" value={formData.position} onChange={handleChange} required />
              {formErrors.position && <p className="text-sm text-destructive">{formErrors.position}</p>}
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <div className="px-3 py-2 border rounded-md bg-muted">MAINTENANCE</div>
            </div>
            <div className="space-y-2">
              <Label>PPE Type *</Label>
              <Select value={formData.ppe_type} onValueChange={(val) => handleSelectChange('ppe_type', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PPE_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Item Name *</Label>
              <Input name="item_name" value={formData.item_name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <Input name="size" value={formData.size} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Condition *</Label>
              <Select value={formData.condition} onValueChange={(val) => handleSelectChange('condition', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONDITION_TYPES).map(([key, cond]) => (
                    <SelectItem key={key} value={key}>{cond.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Issue Date *</Label>
              <Input type="date" name="issue_date" value={formData.issue_date} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Location *</Label>
              <Select value={formData.location} onValueChange={(val) => handleSelectChange('location', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(MINE_LOCATIONS).map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mine Section</Label>
              <Input name="mine_section" value={formData.mine_section} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Issued By</Label>
              <Input name="issued_by" value={formData.issued_by} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_TYPES).map(([key, status]) => (
                    <SelectItem key={key} value={key}>{status.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Notes</Label>
              <Textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Update' : 'Issue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Autocomplete Input
const AutocompleteInput = ({ value, onChange, options, placeholder, onSelect, field = 'employee_id', required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  const filteredOptions = options.filter(option =>
    option[field]?.toLowerCase().includes(inputValue.toLowerCase()) ||
    option.employee_name?.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (option) => {
    setInputValue(option[field]);
    onSelect(option);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange({ target: { name: field, value: newValue } });
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        required={required}
        className="w-full"
      />
      {isOpen && inputValue && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-2 text-left hover:bg-muted border-b last:border-b-0"
            >
              <div className="font-medium">{option[field]}</div>
              <div className="text-sm text-muted-foreground">{option.employee_name} • {option.position}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Quick Actions
const QuickActions = ({ onNewRecord, onRefresh, loading }) => (
  <div className="flex items-center gap-3">
    <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
    </Button>
    <Button onClick={onNewRecord}>
      <Plus className="h-4 w-4 mr-2" /> New PPE Record
    </Button>
  </div>
);

// Due Items List with enhanced filters
const DueItemsList = ({ employees, filterType, onEditItem, onDeleteItem, onViewDetails }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true); // toggle advanced filters

  // Collect all sizes from items
  const allSizes = useMemo(() => {
    const sizes = new Set();
    employees.forEach(emp => emp.records.forEach(rec => {
      if (rec.size) sizes.add(rec.size);
    }));
    return Array.from(sizes).sort();
  }, [employees]);

  // Collect and filter items
  const dueItems = useMemo(() => {
    const items = [];
    employees.forEach(employee => {
      employee.records.forEach(record => {
        // Skip if not matching the due/soon criteria
        if (filterType === 'soon-to-due' && !(isExpiringSoon(record.expiry_date) && record.status === 'active')) return;
        if (filterType === 'due' && !(isExpired(record.expiry_date) && record.status === 'active')) return;
        
        // Apply type filter
        if (typeFilter !== 'all' && record.ppe_type !== typeFilter) return;
        // Apply size filter
        if (sizeFilter !== 'all' && record.size !== sizeFilter) return;
        // Apply search filter (employee name or item name)
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const empName = employee.employee_name?.toLowerCase() || '';
          const itemName = record.item_name?.toLowerCase() || '';
          if (!empName.includes(term) && !itemName.includes(term)) return;
        }
        
        items.push({ ...record, employee_name: employee.employee_name, employee_id: employee.employee_id });
      });
    });
    return items.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));
  }, [employees, filterType, typeFilter, sizeFilter, searchTerm]);

  // Summary counts by type/size
  const summary = useMemo(() => {
    const counts = {};
    dueItems.forEach(item => {
      const key = `${item.ppe_type}-${item.size || 'none'}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [dueItems]);

  const activeFilterCount = [
    typeFilter !== 'all' && 1,
    sizeFilter !== 'all' && 1,
    searchTerm && 1
  ].filter(Boolean).length;

  const clearFilters = () => {
    setTypeFilter('all');
    setSizeFilter('all');
    setSearchTerm('');
  };

  if (dueItems.length === 0 && !searchTerm && typeFilter === 'all' && sizeFilter === 'all') {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg border">
        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="font-semibold">No {filterType === 'due' ? 'due' : 'soon to due'} items</p>
        <p className="text-sm text-muted-foreground mt-1">All PPE is up to date</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      {Object.entries(summary).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(summary).map(([key, count]) => {
            const [type, size] = key.split('-');
            const ppeType = PPE_TYPES[type] || PPE_TYPES.helmet;
            return (
              <Card key={key} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${ppeType.bgColor} border ${ppeType.borderColor}`}>
                    {React.createElement(ppeType.icon, { className: `h-5 w-5 ${ppeType.textColor}` })}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{count} item{count > 1 ? 's' : ''}</p>
                    <p className="text-xs text-muted-foreground">
                      {ppeType.name} {size && size !== 'none' && `(Size ${size})`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
              <FilterX className="h-4 w-4" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employee or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Advanced filters (conditionally visible) */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-2">
            <Label className="text-sm">PPE Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(PPE_TYPES).map(([key, type]) => (
                  <SelectItem key={key} value={key}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Size</Label>
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {allSizes.map(sz => (
                  <SelectItem key={sz} value={sz}>{sz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Items Table */}
      {dueItems.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dueItems.map((item) => {
                const ppeType = PPE_TYPES[item.ppe_type] || PPE_TYPES.helmet;
                const Icon = ppeType.icon;
                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onViewDetails(item)}
                  >
                    <TableCell>
                      <div className="font-medium">{item.employee_name}</div>
                      <div className="text-xs text-muted-foreground">{item.employee_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-lg ${ppeType.bgColor}`}>
                          <Icon className={`h-3.5 w-3.5 ${ppeType.textColor}`} />
                        </div>
                        <span className="font-medium">{item.item_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{ppeType.name}</TableCell>
                    <TableCell>{item.size || '—'}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${filterType === 'due' ? 'text-destructive' : 'text-amber-600'}`}>
                        {formatDate(item.expiry_date)}
                      </span>
                    </TableCell>
                    <TableCell><ConditionBadge condition={item.condition} /></TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => onEditItem(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/30 rounded-lg border">
          <p className="text-muted-foreground">No items match the current filters.</p>
        </div>
      )}
    </div>
  );
};

// ============= Main Component =============
export default function PPEManagement() {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'active', 'soon-to-due', 'due'
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [recordsData, statsData] = await Promise.all([
        fetchPPERecords(),
        fetchPPEStats()
      ]);
      setRecords(recordsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique employees for autocomplete (excluding Hoist Drivers)
  const existingEmployees = useMemo(() => {
    const employeeMap = new Map();
    records.forEach(record => {
      if (record.position && record.position.toLowerCase().includes('hoist driver')) {
        return;
      }
      if (!employeeMap.has(record.employee_id)) {
        employeeMap.set(record.employee_id, {
          employee_id: record.employee_id,
          employee_name: record.employee_name,
          department: record.department,
          position: record.position
        });
      }
    });
    return Array.from(employeeMap.values());
  }, [records]);

  // Group records by employee, excluding Hoist Drivers
  const employeesWithPPE = useMemo(() => {
    const employeeMap = new Map();
    records.forEach(record => {
      if (record.position && record.position.toLowerCase().includes('hoist driver')) {
        return; // skip
      }
      if (!employeeMap.has(record.employee_id)) {
        employeeMap.set(record.employee_id, {
          employee_id: record.employee_id,
          employee_name: record.employee_name,
          department: record.department,
          position: record.position,
          records: []
        });
      }
      employeeMap.get(record.employee_id).records.push(record);
    });
    return Array.from(employeeMap.values());
  }, [records]);

  // Apply search filter (for employee view)
  const filteredEmployees = useMemo(() => {
    let filtered = employeesWithPPE;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(employee =>
        employee.employee_name?.toLowerCase().includes(searchLower) ||
        employee.employee_id?.toLowerCase().includes(searchLower) ||
        employee.position?.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  }, [employeesWithPPE, searchTerm]);

  // Enhanced stats
  const enhancedStats = useMemo(() => {
    if (!stats) return null;
    const activeRecords = records.filter(r => r.status === 'active').length;
    const expiringSoon = records.filter(r => isExpiringSoon(r.expiry_date) && r.status === 'active').length;
    const expired = records.filter(r => isExpired(r.expiry_date) && r.status === 'active').length;
    const employeesWithExpiring = employeesWithPPE.filter(e =>
      e.records.some(r => isExpiringSoon(r.expiry_date) && r.status === 'active')
    ).length;
    const employeesWithExpired = employeesWithPPE.filter(e =>
      e.records.some(r => isExpired(r.expiry_date) && r.status === 'active')
    ).length;
    return {
      ...stats,
      activeRecords,
      expiringSoon,
      expired,
      employeesWithExpiring,
      employeesWithExpired
    };
  }, [stats, records, employeesWithPPE]);

  // Handlers
  const handleFormSuccess = (message) => {
    setSuccess(message);
    fetchAllData();
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (editData) {
        await updatePPERecord(editData.id, formData);
        handleFormSuccess('PPE record updated successfully');
      } else {
        await createPPERecord(formData);
        handleFormSuccess('PPE record created successfully');
      }
      setShowForm(false);
      setEditData(null);
      setSelectedEmployee(null);
    } catch (error) {
      setError(`Failed to ${editData ? 'update' : 'create'} PPE record: ${error.message}`);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!confirm('Are you sure you want to delete this PPE record? This action cannot be undone.')) return;
    try {
      await deletePPERecord(recordId);
      setRecords(prev => prev.filter(r => r.id !== recordId));
      setSuccess('PPE record deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to delete PPE record: ${error.message}`);
    }
  };

  const handleViewDetails = (item) => {
    setDetailItem(item);
    setShowDetail(true);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter button component
  const FilterButton = ({ value, label, count }) => (
    <Button
      variant={filterType === value ? 'default' : 'outline'}
      size="sm"
      onClick={() => setFilterType(value)}
      className="gap-2"
    >
      {label}
      {count !== undefined && (
        <Badge variant={filterType === value ? 'secondary' : 'outline'} className="ml-1">
          {count}
        </Badge>
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded bg-primary p-1.5">
                <Database className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Mine PPE</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <nav className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Home</Link>
              </Button>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-medium">PPE Management</span>
            </nav>
          </div>
          <QuickActions
            onNewRecord={() => { setSelectedEmployee(null); setEditData(null); setShowForm(true); }}
            onRefresh={fetchAllData}
            loading={loading}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Alerts */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchAllData}>Retry</Button>
            <Button variant="ghost" size="icon" onClick={() => setError(null)}><X className="h-4 w-4" /></Button>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div className="flex-1">
              <p className="font-semibold">Success</p>
              <p className="text-sm">{success}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSuccess(null)}><X className="h-4 w-4" /></Button>
          </div>
        )}

        {/* Stats */}
        {enhancedStats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Employees" value={enhancedStats.unique_employees} icon={Users} color="slate" onClick={() => setFilterType('all')} />
              <StatCard title="Active PPE" value={enhancedStats.activeRecords} icon={CheckCircle2} color="emerald" onClick={() => setFilterType('active')} />
              <StatCard title="Soon to Due" value={enhancedStats.expiringSoon} icon={AlertTriangle} color="amber" onClick={() => setFilterType('soon-to-due')} subtitle={`${enhancedStats.employeesWithExpiring} employees`} />
              <StatCard title="Due" value={enhancedStats.expired} icon={XCircle} color="rose" onClick={() => setFilterType('due')} subtitle={`${enhancedStats.employeesWithExpired} employees`} />
            </div>

            {/* Due Summary Card */}
            {(enhancedStats.expiringSoon > 0 || enhancedStats.expired > 0) && (
              <Card>
                <CardContent className="p-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">Quick Summary:</span>
                  </div>
                  {enhancedStats.expiringSoon > 0 && (
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setFilterType('soon-to-due')}>
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      {enhancedStats.expiringSoon} items soon to due
                    </Button>
                  )}
                  {enhancedStats.expired > 0 && (
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setFilterType('due')}>
                      <XCircle className="h-4 w-4 text-destructive" />
                      {enhancedStats.expired} due items
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div>
                <CardTitle className="text-xl">PPE Records</CardTitle>
                <CardDescription>
                  {filteredEmployees.length} employees {filterType !== 'all' && `with ${filterType.replace('-', ' ')}`}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2">
                  <FilterButton value="all" label="All" count={employeesWithPPE.length} />
                  <FilterButton value="active" label="Active" count={employeesWithPPE.filter(e => e.records.some(r => r.status === 'active')).length} />
                  <FilterButton value="soon-to-due" label="Soon to Due" count={enhancedStats?.employeesWithExpiring || 0} />
                  <FilterButton value="due" label="Due" count={enhancedStats?.employeesWithExpired || 0} />
                </div>
                {/* Search (for employee view) */}
                {filterType === 'all' || filterType === 'active' ? (
                  <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredEmployees.length === 0 && (filterType === 'all' || filterType === 'active') ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No employees found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {records.length === 0 ? 'Get started by issuing PPE.' : 'Try adjusting your search.'}
                </p>
                {records.length === 0 && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Issue First PPE
                  </Button>
                )}
              </div>
            ) : filterType === 'soon-to-due' || filterType === 'due' ? (
              <DueItemsList
                employees={employeesWithPPE}
                filterType={filterType}
                onEditItem={(record) => { setEditData(record); setShowForm(true); }}
                onDeleteItem={handleDeleteRecord}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <EmployeePPECard
                    key={employee.employee_id}
                    employee={employee}
                    records={employee.records}
                    onIssueNew={(emp) => { setSelectedEmployee(emp); setShowForm(true); }}
                    onEditItem={(record) => { setEditData(record); setShowForm(true); }}
                    onDeleteItem={handleDeleteRecord}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      {showForm && (
        <PPEIssueForm
          isOpen={showForm}
          onClose={() => { setShowForm(false); setEditData(null); setSelectedEmployee(null); }}
          onSubmit={handleSubmitForm}
          initialData={editData}
          employee={selectedEmployee}
          existingEmployees={existingEmployees}
        />
      )}

      {showDetail && detailItem && (
        <PPEItemDetailModal
          item={detailItem}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          onEdit={(item) => { setEditData(item); setShowForm(true); }}
        />
      )}
    </div>
  );
}