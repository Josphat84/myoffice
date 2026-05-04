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
  Database, Eye as EyeIcon, EyeOff, ChevronRight,
  Shirt, Wind, Flashlight, CloudRain, Link2, ChevronsUp, ChevronsDown,
  Minimize2, Maximize2
} from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

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
import { ScrollArea } from "@/components/ui/scroll-area";
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
    icon: Shirt,
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
    icon: Shield,
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
    icon: Package,
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
    icon: Link2,
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
    icon: Wind,
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
    icon: Flashlight,
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
    icon: Shirt,
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
    icon: CloudRain,
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
    icon: Layers,
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
    <div
      className="group rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 cursor-pointer transition-all duration-200 overflow-hidden"
      onClick={() => onViewDetails(record)}
    >
      <div className="flex items-start justify-between px-3.5 pt-3.5 pb-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${ppeType.bgColor} border ${ppeType.borderColor} group-hover:scale-105 transition-transform shrink-0`}>
            <Icon className={`h-3.5 w-3.5 ${ppeType.textColor}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">{record.item_name}</p>
            <p className="text-xs text-white/45">{ppeType.name}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.15] text-white/50 border border-white/10 transition-all">
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
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
      <div className="px-3.5 pb-3.5 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-white/40">Issued</span>
          <span className="text-white/75 font-medium">{formatDate(record.issue_date)}</span>
        </div>
        {record.expiry_date && (
          <div className="flex justify-between">
            <span className="text-white/40">Expires</span>
            <span className={`font-medium ${isItemExpired ? 'text-rose-300' : isExpiring ? 'text-amber-300' : 'text-white/75'}`}>
              {formatDate(record.expiry_date)}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-white/40">Size</span>
          <span className="text-white/75 font-medium">{record.size || '—'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/40">Status</span>
          <StatusBadge status={record.status} />
        </div>
      </div>
    </div>
  );
};

// Employee PPE Card
const EmployeePPECard = ({ employee, records, onIssueNew, onEditItem, onDeleteItem, onViewDetails, forceExpanded, onToggle }) => {
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = forceExpanded !== undefined ? forceExpanded : localExpanded;
  const handleToggle = () => {
    if (onToggle) onToggle(employee.employee_id);
    else setLocalExpanded(v => !v);
  };
  const activeRecords = records.filter(r => r.status === 'active');
  const expiredRecords = records.filter(r => r.status === 'expired');
  const expiringSoonCount = records.filter(r => isExpiringSoon(r.expiry_date)).length;

  return (
    <div className="oz-glass-dark rounded-2xl overflow-hidden transition-all duration-200">
      <div className="flex items-start justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#2A4D69] to-[#86BBD8] flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
            {employee.employee_name?.[0] || 'U'}
          </div>
          <div>
            <p className="text-base font-semibold text-white leading-tight">{employee.employee_name}</p>
            <p className="text-xs text-white/50 mt-0.5">{employee.position} · {employee.employee_id}</p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/25">
                <CheckCircle2 className="h-3 w-3" /> {activeRecords.length} Active
              </span>
              {expiredRecords.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/25">
                  <XCircle className="h-3 w-3" /> {expiredRecords.length} Due
                </span>
              )}
              {expiringSoonCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/25">
                  <AlertTriangle className="h-3 w-3" /> {expiringSoonCount} Soon
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onIssueNew(employee)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#86BBD8]/20 hover:bg-[#86BBD8]/35 text-white border border-[#86BBD8]/30 transition-all duration-150"
          >
            <Plus className="h-3 w-3" /> Issue PPE
          </button>
          <button
            onClick={handleToggle}
            className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-white/70 border border-white/15 transition-all duration-150"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-white/10">
          {records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
            <div className="text-center py-8 rounded-xl bg-white/[0.04] border border-white/10">
              <Shield className="h-10 w-10 mx-auto mb-3 text-white/30" />
              <p className="text-sm font-medium text-white/60">No PPE items issued yet</p>
              <p className="text-xs text-white/35 mt-1">Click "Issue PPE" to add equipment</p>
            </div>
          )}
        </div>
      )}
    </div>
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
      <div className="text-center py-12 bg-white/[0.04] rounded-xl border border-white/[0.07]">
        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-400/60" />
        <p className="font-semibold text-white/75">No {filterType === 'due' ? 'overdue' : 'soon-to-expire'} items</p>
        <p className="text-sm text-white/40 mt-1">All PPE is up to date</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary pills */}
      {Object.entries(summary).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(summary).map(([key, count]) => {
            const [type, size] = key.split('-');
            const ppeType = PPE_TYPES[type] || PPE_TYPES.helmet;
            const Icon = ppeType.icon;
            return (
              <div key={key} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.10] transition-all">
                <div className={`p-1.5 rounded-lg ${ppeType.bgColor} border ${ppeType.borderColor}`}>
                  <Icon className={`h-3.5 w-3.5 ${ppeType.textColor}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{count} item{count > 1 ? 's' : ''}</p>
                  <p className="text-[10px] text-white/45 leading-tight">
                    {ppeType.shortName}{size && size !== 'none' && ` · Sz ${size}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.14] text-white/65 border border-white/12 transition-all"
          >
            <Filter className="h-3.5 w-3.5" />
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/55 border border-white/10 transition-all">
              <FilterX className="h-3.5 w-3.5" />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <input
            placeholder="Search employee or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 w-full text-sm rounded-lg bg-white/[0.07] border border-white/12 text-white placeholder:text-white/30 focus:outline-none focus:border-white/28 focus:bg-white/[0.11] transition-all"
          />
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center p-4 bg-white/[0.05] rounded-xl border border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-white/65 font-medium">PPE Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] h-8 text-xs bg-white/[0.07] border-white/12 text-white">
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
            <Label className="text-xs text-white/65 font-medium">Size</Label>
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-[150px] h-8 text-xs bg-white/[0.07] border-white/12 text-white">
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
        <div className="rounded-xl overflow-hidden border border-white/[0.07]">
          <Table>
            <TableHeader className="bg-white/[0.05]">
              <TableRow className="border-white/10">
                <TableHead className="text-white/55">Employee</TableHead>
                <TableHead className="text-white/55">Item</TableHead>
                <TableHead className="text-white/55">Type</TableHead>
                <TableHead className="text-white/55">Size</TableHead>
                <TableHead className="text-white/55">Expiry Date</TableHead>
                <TableHead className="text-white/55">Condition</TableHead>
                <TableHead className="text-white/55">Status</TableHead>
                <TableHead className="text-right text-white/55">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dueItems.map((item) => {
                const ppeType = PPE_TYPES[item.ppe_type] || PPE_TYPES.helmet;
                const Icon = ppeType.icon;
                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-white/[0.06] border-white/[0.06] transition-colors"
                    onClick={() => onViewDetails(item)}
                  >
                    <TableCell>
                      <div className="font-medium text-white">{item.employee_name}</div>
                      <div className="text-xs text-white/45">{item.employee_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-lg ${ppeType.bgColor}`}>
                          <Icon className={`h-3.5 w-3.5 ${ppeType.textColor}`} />
                        </div>
                        <span className="font-medium text-white">{item.item_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/75">{ppeType.name}</TableCell>
                    <TableCell className="text-white/75">{item.size || '—'}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${filterType === 'due' ? 'text-rose-300' : 'text-amber-300'}`}>
                        {formatDate(item.expiry_date)}
                      </span>
                    </TableCell>
                    <TableCell><ConditionBadge condition={item.condition} /></TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEditItem(item)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.15] text-white/55 hover:text-white border border-white/10 transition-all mr-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-white/[0.06] hover:bg-rose-500/20 text-white/55 hover:text-rose-300 border border-white/10 hover:border-rose-500/25 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white/[0.04] rounded-xl border border-white/[0.07]">
          <p className="text-white/50">No items match the current filters.</p>
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
  const [expandedEmployees, setExpandedEmployees] = useState({});
  const [showHeroStats, setShowHeroStats] = useState(true);
  const [panelMinimized, setPanelMinimized] = useState(false);
  const [showTypeSummary, setShowTypeSummary] = useState(true);
  const [showEmployeeStats, setShowEmployeeStats] = useState(true);
  const [filterPanelMinimized, setFilterPanelMinimized] = useState(false);

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

  // Compliance rate: active non-expired / total active
  const complianceRate = useMemo(() => {
    if (!records.length) return null;
    const active = records.filter(r => r.status === 'active');
    if (!active.length) return null;
    const compliant = active.filter(r => !isExpired(r.expiry_date));
    return Math.round((compliant.length / active.length) * 100);
  }, [records]);

  // PPE type counts for the type strip
  const typeCounts = useMemo(() => {
    const counts = {};
    records.filter(r => r.status === 'active').forEach(r => {
      counts[r.ppe_type] = (counts[r.ppe_type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [records]);

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

  // Employee expand/collapse
  const toggleEmployee = (id) => setExpandedEmployees(prev => ({ ...prev, [id]: !prev[id] }));
  const expandAllEmployees = () => {
    const all = filteredEmployees.reduce((acc, e) => ({ ...acc, [e.employee_id]: true }), {});
    setExpandedEmployees(all);
  };
  const collapseAllEmployees = () => setExpandedEmployees({});
  const anyEmployeeExpanded = Object.values(expandedEmployees).some(Boolean);

  // Filter button component (not used in render — tabs are inline in toolbar)
  const FilterButton = ({ value, label, count }) => (
    <button
      onClick={() => setFilterType(value)}
      className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border transition-all duration-150 ${
        filterType === value
          ? 'bg-[#86BBD8]/30 border-[#86BBD8]/45 text-white font-semibold shadow-sm'
          : 'bg-white/[0.05] border-white/12 text-white/55 hover:bg-white/[0.10] hover:text-white/85'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`px-1 py-0.5 rounded text-[9px] font-bold ml-1 ${filterType === value ? 'bg-white/20 text-white' : 'bg-white/8 text-white/45'}`}>{count}</span>
      )}
    </button>
  );

  return (
    <PageShell>
      <Toaster position="top-right" richColors />

      {/* ── Hero ── */}
      <section className="relative text-white">
        <div className="container mx-auto px-4 pt-6 pb-3">
          <div className="oz-glass-dark rounded-2xl overflow-hidden">

            {/* Top bar: title + actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2A4D69] to-[#86BBD8] flex items-center justify-center shrink-0 shadow-lg">
                  <HardHat className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="min-w-0">
                  <nav className="flex items-center gap-1 text-[10px] text-white/40 mb-0.5">
                    <span>Home</span>
                    <ChevronRight className="h-2.5 w-2.5" />
                    <span className="text-white/65">PPE</span>
                  </nav>
                  <h1 className="text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight leading-tight">PPE Management</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setShowHeroStats(v => !v)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-white/55 border border-white/12 transition-all"
                      >
                        {showHeroStats ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{showHeroStats ? 'Hide stats' : 'Show stats'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={fetchAllData}
                        disabled={loading}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-white/80 border border-white/15 transition-all disabled:opacity-40"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Reload data</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => { setSelectedEmployee(null); setEditData(null); setShowForm(true); }}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#86BBD8]/25 hover:bg-[#86BBD8]/40 text-white font-semibold border border-[#86BBD8]/35 transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" /> New Record
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Issue new PPE item</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Expandable stats + type strip */}
            {showHeroStats && enhancedStats && (
              <div className="border-t border-white/10">
                {/* Stat row */}
                <div className="flex flex-wrap items-center gap-x-1 gap-y-2 px-6 py-3">
                  {[
                    { icon: Users, color: 'text-[#86BBD8]', val: enhancedStats.unique_employees, label: 'Employees', onClick: () => setFilterType('all') },
                    { icon: CheckCircle2, color: 'text-emerald-400', val: enhancedStats.activeRecords, label: 'Active records', valColor: 'text-emerald-300', onClick: () => setFilterType('active') },
                    enhancedStats.expiringSoon > 0 && { icon: AlertTriangle, color: 'text-amber-400', val: enhancedStats.expiringSoon, label: `Soon to due (${enhancedStats.employeesWithExpiring} emp)`, valColor: 'text-amber-300', onClick: () => setFilterType('soon-to-due') },
                    enhancedStats.expired > 0 && { icon: XCircle, color: 'text-rose-400', val: enhancedStats.expired, label: `Overdue (${enhancedStats.employeesWithExpired} emp)`, valColor: 'text-rose-300', onClick: () => setFilterType('due') },
                    complianceRate !== null && { icon: Award, color: 'text-violet-400', val: `${complianceRate}%`, label: 'Compliance', valColor: complianceRate >= 80 ? 'text-emerald-300' : complianceRate >= 60 ? 'text-amber-300' : 'text-rose-300', onClick: null },
                  ].filter(Boolean).map((item, i, arr) => (
                    <React.Fragment key={i}>
                      <button
                        onClick={item.onClick}
                        disabled={!item.onClick}
                        className="flex items-center gap-1.5 group px-3 py-1.5 rounded-lg hover:bg-white/[0.07] transition-all disabled:cursor-default"
                      >
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                        <span className={`text-base font-bold ${item.valColor || 'text-white'}`}>{item.val}</span>
                        <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">{item.label}</span>
                      </button>
                      {i < arr.length - 1 && <span className="text-white/15 hidden sm:block select-none">|</span>}
                    </React.Fragment>
                  ))}
                </div>

                {/* PPE type overview strip */}
                {typeCounts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-6 pb-4">
                    {typeCounts.map(([type, count]) => {
                      const info = PPE_TYPES[type] || PPE_TYPES.helmet;
                      const Icon = info.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => setFilterType('active')}
                          title={info.name}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all hover:scale-105 ${info.bgColor} ${info.textColor} ${info.borderColor}`}
                        >
                          <Icon className="h-3 w-3" />
                          <span>{info.shortName}</span>
                          <span className="font-bold">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="container mx-auto px-4 pb-8 space-y-3 mt-3">

        {/* Alerts */}
        {error && (
          <div className="oz-glass-dark rounded-xl p-4 flex items-center gap-3 border-rose-500/25 border">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">Error</p>
              <p className="text-xs text-white/65 truncate">{error}</p>
            </div>
            <button onClick={fetchAllData} className="text-xs px-2.5 py-1.5 rounded-lg bg-white/[0.10] hover:bg-white/[0.18] text-white border border-white/15 transition-all shrink-0">Retry</button>
            <button onClick={() => setError(null)} className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-white/60 border border-white/10 transition-all shrink-0"><X className="h-3.5 w-3.5" /></button>
          </div>
        )}
        {success && (
          <div className="oz-glass-dark rounded-xl p-4 flex items-center gap-3 border-emerald-500/25 border">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">Success</p>
              <p className="text-xs text-white/65 truncate">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-white/60 border border-white/10 transition-all shrink-0"><X className="h-3.5 w-3.5" /></button>
          </div>
        )}

        {/* ── PPE Type Breakdown ── */}
        {records.length > 0 && (
          <div className="oz-glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <HardHat className="h-3.5 w-3.5 text-[#86BBD8]" />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">PPE Type Breakdown</span>
                <span className="text-[11px] text-white/35">click a type to filter active</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setShowTypeSummary(v => !v)} className="h-6 w-6 flex items-center justify-center rounded-md bg-white/[0.07] hover:bg-white/[0.15] text-white/50 border border-white/12 transition-all">
                      {showTypeSummary ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{showTypeSummary ? 'Minimise type breakdown' : 'Show type breakdown'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {showTypeSummary && (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {Object.entries(PPE_TYPES).map(([key, type]) => {
                  const Icon = type.icon;
                  const activeCount = records.filter(r => r.ppe_type === key && r.status === 'active').length;
                  if (activeCount === 0) return null;
                  const expiredCount = records.filter(r => r.ppe_type === key && r.status === 'active' && isExpired(r.expiry_date)).length;
                  const soonCount = records.filter(r => r.ppe_type === key && r.status === 'active' && isExpiringSoon(r.expiry_date)).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setFilterType('active')}
                      className="group relative rounded-xl text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border border-white/10 hover:border-white/20 bg-white/[0.06] hover:bg-white/[0.10] p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-1.5 rounded-lg ${type.bgColor} border ${type.borderColor}`}>
                          <Icon className={`h-3.5 w-3.5 ${type.textColor}`} />
                        </div>
                        <span className="text-sm font-semibold text-white">{type.shortName}</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/50">Active</span>
                          <span className="font-bold text-emerald-300">{activeCount}</span>
                        </div>
                        {soonCount > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-white/50">Soon</span>
                            <span className="font-bold text-amber-300">{soonCount}</span>
                          </div>
                        )}
                        {expiredCount > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-white/50">Expired</span>
                            <span className="font-bold text-rose-300">{expiredCount}</span>
                          </div>
                        )}
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden mt-1">
                          <div className="h-full bg-emerald-400/50 rounded-full" style={{ width: `${activeCount > 0 ? Math.max(10, Math.round(((activeCount - expiredCount) / activeCount) * 100)) : 0}%` }} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Employee Overview ── */}
        {employeesWithPPE.length > 0 && (
          <div className="oz-glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-[#86BBD8]" />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Employee Overview</span>
                <span className="text-[11px] text-white/35">{employeesWithPPE.length} employees · click row to jump</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setShowEmployeeStats(v => !v)} className="h-6 w-6 flex items-center justify-center rounded-md bg-white/[0.07] hover:bg-white/[0.15] text-white/50 border border-white/12 transition-all">
                      {showEmployeeStats ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{showEmployeeStats ? 'Minimise employee overview' : 'Show employee overview'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {showEmployeeStats && (
              <ScrollArea className="h-[260px]">
                <div className="space-y-0.5 p-3">
                  {[...employeesWithPPE]
                    .sort((a, b) => b.records.filter(r => r.status === 'active').length - a.records.filter(r => r.status === 'active').length)
                    .map(emp => {
                      const activeItems = emp.records.filter(r => r.status === 'active');
                      const expiredItems = activeItems.filter(r => isExpired(r.expiry_date));
                      const soonItems = activeItems.filter(r => isExpiringSoon(r.expiry_date));
                      const compliance = activeItems.length > 0
                        ? Math.round(((activeItems.length - expiredItems.length) / activeItems.length) * 100)
                        : 100;
                      return (
                        <div
                          key={emp.employee_id}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/[0.07] cursor-pointer transition-all group"
                          onClick={() => {
                            setFilterType('all');
                            setSearchTerm(emp.employee_name);
                            setExpandedEmployees(prev => ({ ...prev, [emp.employee_id]: true }));
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#2A4D69] to-[#86BBD8] flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {emp.employee_name?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{emp.employee_name}</p>
                              <p className="text-[10px] text-white/45 truncate">{emp.position}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-emerald-300 font-semibold">{activeItems.length}</span>
                              {expiredItems.length > 0 && <span className="text-rose-300">·{expiredItems.length} exp</span>}
                              {soonItems.length > 0 && <span className="text-amber-300">·{soonItems.length} soon</span>}
                            </div>
                            <div className="w-16 hidden sm:block">
                              <div className="flex justify-end mb-0.5">
                                <span className={`text-[10px] font-bold ${compliance >= 80 ? 'text-emerald-400' : compliance >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{compliance}%</span>
                              </div>
                              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${compliance >= 80 ? 'bg-emerald-400/60' : compliance >= 60 ? 'bg-amber-400/60' : 'bg-rose-400/60'}`} style={{ width: `${compliance}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* ── Filter Panel ── */}
        <div className="oz-glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-3.5 w-3.5 text-[#86BBD8] shrink-0" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Filters</span>
              {filterType !== 'all' && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#86BBD8]/25 text-[#86BBD8] border border-[#86BBD8]/30">{filterType}</span>
              )}
              <span className="text-[11px] text-white/35">
                {filterType === 'all' || filterType === 'active' ? `${filteredEmployees.length} of ${employeesWithPPE.length} employees` : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {(searchTerm || filterType !== 'all') && (
                <button onClick={() => { setSearchTerm(''); setFilterType('all'); }} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.13] text-white/55 border border-white/10 transition-all">
                  <FilterX className="h-3 w-3" /> Clear
                </button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setFilterPanelMinimized(v => !v)} className="h-6 w-6 flex items-center justify-center rounded-md bg-white/[0.07] hover:bg-white/[0.15] text-white/50 border border-white/12 transition-all">
                      {filterPanelMinimized ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{filterPanelMinimized ? 'Show filters' : 'Minimise filters'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          {!filterPanelMinimized && (
            <div className="px-5 pb-4 border-t border-white/[0.07] pt-3 space-y-3">
              {/* View tabs */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { value: 'all', label: 'All Employees', count: employeesWithPPE.length },
                  { value: 'active', label: 'Active PPE', count: employeesWithPPE.filter(e => e.records.some(r => r.status === 'active')).length },
                  { value: 'soon-to-due', label: 'Soon Due', count: enhancedStats?.employeesWithExpiring || 0 },
                  { value: 'due', label: 'Overdue', count: enhancedStats?.employeesWithExpired || 0 },
                ].map(({ value, label, count }) => (
                  <button
                    key={value}
                    onClick={() => setFilterType(value)}
                    className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                      filterType === value
                        ? 'bg-[#86BBD8]/30 border-[#86BBD8]/45 text-white font-semibold shadow-sm'
                        : 'bg-white/[0.05] border-white/12 text-white/55 hover:bg-white/[0.10] hover:text-white/85'
                    }`}
                  >
                    {label}
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${filterType === value ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-white/45'}`}>{count}</span>
                  </button>
                ))}
              </div>
              {/* Search — only relevant for employee card views */}
              {(filterType === 'all' || filterType === 'active') && (
                <div className="relative max-w-sm">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
                  <input
                    placeholder="Search by name, ID, or position…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-2 w-full text-sm rounded-lg bg-white/[0.07] border border-white/12 text-white placeholder:text-white/30 focus:outline-none focus:border-white/28 focus:bg-white/[0.11] transition-all"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Records Panel ── */}
        <div className="oz-glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider shrink-0">Records</span>
              {(filterType === 'all' || filterType === 'active') && (
                <span className="text-[11px] text-white/35">
                  {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} · {records.length} items
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {(filterType === 'all' || filterType === 'active') && filteredEmployees.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={anyEmployeeExpanded ? collapseAllEmployees : expandAllEmployees}
                        className="flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.14] text-white/60 border border-white/12 transition-all"
                      >
                        {anyEmployeeExpanded ? <ChevronsUp className="h-3 w-3" /> : <ChevronsDown className="h-3 w-3" />}
                        <span className="hidden md:inline">{anyEmployeeExpanded ? 'Collapse all' : 'Expand all'}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{anyEmployeeExpanded ? 'Collapse all employee cards' : 'Expand all employee cards'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <div className="w-px h-4 bg-white/12 hidden sm:block" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setPanelMinimized(v => !v)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/[0.07] hover:bg-white/[0.15] text-white/50 border border-white/12 transition-all"
                    >
                      {panelMinimized ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{panelMinimized ? 'Expand records' : 'Minimise records'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {!panelMinimized && (
            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-14 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#86BBD8]/60" />
                  <span className="text-xs text-white/40">Loading PPE records…</span>
                </div>
              ) : filteredEmployees.length === 0 && (filterType === 'all' || filterType === 'active') ? (
                <div className="text-center py-14 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                  <div className="h-14 w-14 mx-auto rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-4">
                    <HardHat className="h-7 w-7 text-white/30" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/75 mb-1">No employees found</h3>
                  <p className="text-xs text-white/40 mb-5">
                    {records.length === 0 ? 'Get started by issuing PPE to your first employee.' : 'Try adjusting your search or filter.'}
                  </p>
                  {records.length === 0 && (
                    <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-[#86BBD8]/25 hover:bg-[#86BBD8]/40 text-white border border-[#86BBD8]/30 transition-all font-medium">
                      <Plus className="h-3.5 w-3.5" /> Issue First PPE
                    </button>
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
                <div className="space-y-2.5">
                  {filteredEmployees.map((employee) => (
                    <EmployeePPECard
                      key={employee.employee_id}
                      employee={employee}
                      records={employee.records}
                      onIssueNew={(emp) => { setSelectedEmployee(emp); setShowForm(true); }}
                      onEditItem={(record) => { setEditData(record); setShowForm(true); }}
                      onDeleteItem={handleDeleteRecord}
                      onViewDetails={handleViewDetails}
                      forceExpanded={expandedEmployees[employee.employee_id]}
                      onToggle={toggleEmployee}
                    />
                  ))}
                  {filteredEmployees.length > 0 && (
                    <p className="text-center text-[10px] text-white/30 pt-1">
                      {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} · {records.length} total PPE records
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
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
    </PageShell>
  );
}