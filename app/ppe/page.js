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
  Building, Settings, Award, Crown
} from "lucide-react";

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const PPE_API = `${API_BASE}/api/ppe`;

// Professional Color Scheme
const COLORS = {
  primary: {
    50: 'bg-slate-50',
    100: 'bg-slate-100',
    200: 'bg-slate-200',
    300: 'bg-slate-300',
    400: 'bg-slate-400',
    500: 'bg-slate-500',
    600: 'bg-slate-600',
    700: 'bg-slate-700',
    800: 'bg-slate-800',
    900: 'bg-slate-900'
  },
  accent: {
    50: 'bg-blue-50',
    100: 'bg-blue-100',
    200: 'bg-blue-200',
    300: 'bg-blue-300',
    400: 'bg-blue-400',
    500: 'bg-blue-500',
    600: 'bg-blue-600',
    700: 'bg-blue-700',
    800: 'bg-blue-800',
    900: 'bg-blue-900'
  },
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500'
};

// Enhanced PPE Types with professional styling
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
    name: 'Protective Work Suit ',
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
}


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

const PPE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OSFA', 38, 40, 42, 44, 46, 48, 50, 52, 54, 5, 6, 7, 8, 9, 10, 11];

// Condition types
const CONDITION_TYPES = {
  excellent: { name: 'Excellent', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Award },
  good: { name: 'Good', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: ThumbsUp },
  fair: { name: 'Fair', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle },
  poor: { name: 'Poor', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle },
  damaged: { name: 'Damaged', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: ThumbsDown }
};

// Status types
const STATUS_TYPES = {
  active: { name: 'Active', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  expired: { name: 'Expired', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: XCircle },
  returned: { name: 'Returned', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
  lost: { name: 'Lost', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: XCircle },
  damaged: { name: 'Damaged', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle }
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

const fetchEmployeePPERecords = async (employeeId) => {
  try {
    const response = await fetch(`${PPE_API}/employee/${employeeId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching employee PPE records:', error);
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
    console.log('📝 Creating PPE record with data:', recordData);

    // Validate required fields before sending
    if (!recordData.employee_id?.trim()) {
      throw new Error('Employee ID is required');
    }
    if (!recordData.employee_name?.trim()) {
      throw new Error('Employee name is required');
    }

    const formattedData = {
      ...recordData,
      department: 'MAINTENANCE',
      expiry_date: recordData.expiry_date || null,
    };

    const response = await fetch(PPE_API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail += ` - ${errorData.detail || JSON.stringify(errorData)}`;
      } catch (e) {
        const errorText = await response.text();
        errorDetail += ` - ${errorText}`;
      }
      throw new Error(errorDetail);
    }

    const result = await response.json();
    console.log('✅ PPE record created successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error creating PPE record:', error);
    throw new Error(`Failed to create PPE record: ${error.message}`);
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
    const response = await fetch(`${PPE_API}/${recordId}`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error deleting PPE record:', error);
    throw error;
  }
};

// Enhanced Status Badge Component
const StatusBadge = ({ status }) => {
  const config = STATUS_TYPES[status] || STATUS_TYPES.active;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-medium tracking-wide">{config.name}</span>
    </span>
  );
};

// Condition Badge Component
const ConditionBadge = ({ condition }) => {
  const config = CONDITION_TYPES[condition] || CONDITION_TYPES.good;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-medium tracking-wide">{config.name}</span>
    </span>
  );
};

// Location Badge Component
const LocationBadge = ({ location }) => {
  const config = MINE_LOCATIONS[location] || { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: MapPin };
  const Icon = config.icon || MapPin;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-colors`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-sm font-medium tracking-wide">{location}</span>
    </span>
  );
};

// Premium Stat Card Component
const StatCard = ({ title, value, icon, onClick, subtitle, color = "slate" }) => {
  const Icon = icon;
  const colorClasses = {
    slate: 'from-slate-600 to-slate-700',
    blue: 'from-blue-600 to-blue-700',
    emerald: 'from-emerald-600 to-emerald-700',
    rose: 'from-rose-600 to-rose-700',
    violet: 'from-violet-600 to-violet-700'
  };
  
  return (
    <div 
      className="group bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-slate-600 tracking-wide">{title}</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual PPE Item Card Component
const PPEItemCard = ({ record, onEdit, onDelete }) => {
  const ppeType = PPE_TYPES[record.ppe_type] || PPE_TYPES.helmet;
  const Icon = ppeType.icon;
  
  const isExpiring = isExpiringSoon(record.expiry_date);
  const isItemExpired = isExpired(record.expiry_date);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 transition-all duration-200 hover:shadow-md hover:border-slate-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${ppeType.bgColor} border ${ppeType.borderColor} group-hover:scale-110 transition-transform`}>
            <Icon className={`h-3.5 w-3.5 ${ppeType.textColor}`} />
          </div>
          <span className="font-semibold text-slate-900 text-sm">{ppeType.shortName}</span>
        </div>
        <StatusBadge status={record.status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Item:</span>
          <span className="text-slate-900 font-semibold">{record.item_name}</span>
        </div>
        {record.size && (
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Size:</span>
            <span className="text-slate-900">{record.size}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Issued:</span>
          <span className="text-slate-900">{formatDate(record.issue_date)}</span>
        </div>
        {record.expiry_date && (
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">Expires:</span>
            <span className={`font-medium ${
              isItemExpired ? 'text-rose-600' : 
              isExpiring ? 'text-amber-600' : 'text-slate-900'
            }`}>
              {formatDate(record.expiry_date)}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Condition:</span>
          <ConditionBadge condition={record.condition} />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Location:</span>
          <span className="text-slate-900 text-xs font-medium">{record.location}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
        <button 
          onClick={() => onEdit(record)}
          className="flex-1 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors border border-slate-200"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(record.id)}
          className="flex-1 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors border border-rose-200"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

// Employee PPE Card Component
const EmployeePPECard = ({ employee, records, onIssueNew, onEditItem, onDeleteItem }) => {
  const [expanded, setExpanded] = useState(false);
  const activeRecords = records.filter(r => r.status === 'active');
  const expiredRecords = records.filter(r => r.status === 'expired');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
            <UserCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-wide">{employee.employee_name}</h3>
            <p className="text-sm text-slate-600 font-medium">
              {employee.position} • {employee.employee_id} • MAINTENANCE
            </p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                {activeRecords.length} Active PPE
              </span>
              {expiredRecords.length > 0 && (
                <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                  {expiredRecords.length} Expired
                </span>
              )}
              {records.filter(r => isExpiringSoon(r.expiry_date)).length > 0 && (
                <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  {records.filter(r => isExpiringSoon(r.expiry_date)).length} Expiring
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onIssueNew(employee)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold text-sm"
          >
            <Plus className="h-4 w-4" />
            Issue PPE
          </button>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-600 border border-slate-200"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4">
          {records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((record) => (
                <PPEItemCard 
                  key={record.id} 
                  record={record} 
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
              <Shield className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-700 font-semibold">No PPE items issued yet</p>
              <p className="text-slate-600 text-sm mt-1">Click "Issue PPE" to add equipment</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Autocomplete Input Component
const AutocompleteInput = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  onSelect,
  field = 'employee_id',
  required = false
}) => {
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
    
    // Update the form data immediately for validation
    onChange({
      target: {
        name: field,
        value: newValue
      }
    });
    
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
      />
      
      {isOpen && inputValue && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-slate-900">{option[field]}</div>
              <div className="text-sm text-slate-600">{option.employee_name} • {option.position}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// PPE Issue Form Component
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

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.employee_id?.trim()) {
      errors.employee_id = 'Employee ID is required';
    }
    if (!formData.employee_name?.trim()) {
      errors.employee_name = 'Employee name is required';
    }
    if (!formData.position?.trim()) {
      errors.position = 'Position is required';
    }
    if (!formData.ppe_type?.trim()) {
      errors.ppe_type = 'PPE type is required';
    }
    if (!formData.item_name?.trim()) {
      errors.item_name = 'Item name is required';
    }
    if (!formData.issue_date) {
      errors.issue_date = 'Issue date is required';
    }
    if (!formData.location?.trim()) {
      errors.location = 'Location is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEmployeeSelect = (employee) => {
    setFormData(prev => ({
      ...prev,
      employee_id: employee.employee_id,
      employee_name: employee.employee_name,
      position: employee.position,
      department: 'MAINTENANCE'
    }));

    // Clear errors for these fields
    setFormErrors(prev => ({
      ...prev,
      employee_id: '',
      employee_name: '',
      position: ''
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl border border-blue-200">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-wide">
                  {initialData ? 'Edit PPE Record' : 'Issue New PPE'}
                </h2>
                <p className="text-sm text-slate-600 font-medium">
                  {employee ? `For ${employee.employee_name} (${employee.employee_id})` : 'Add new personal protective equipment'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              type="button"
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Form Errors Summary */}
          {Object.keys(formErrors).length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <p className="text-rose-800 font-semibold">Please fix the following errors:</p>
              </div>
              <ul className="text-sm text-rose-700 list-disc list-inside space-y-1">
                {Object.entries(formErrors).map(([field, error]) => (
                  error && <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Employee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Employee ID *
                    {formErrors.employee_id && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.employee_id})</span>
                    )}
                  </label>
                  <AutocompleteInput
                    value={formData.employee_id}
                    onChange={handleChange}
                    options={existingEmployees}
                    placeholder="Start typing employee ID or name..."
                    onSelect={handleEmployeeSelect}
                    field="employee_id"
                    required={true}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Employee Name *
                    {formErrors.employee_name && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.employee_name})</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.employee_name ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Position *
                    {formErrors.position && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.position})</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.position ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                  <div className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-600">
                    MAINTENANCE
                  </div>
                </div>
              </div>
            </div>

            {/* PPE Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">PPE Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    PPE Type *
                    {formErrors.ppe_type && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.ppe_type})</span>
                    )}
                  </label>
                  <select
                    name="ppe_type"
                    value={formData.ppe_type}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.ppe_type ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  >
                    {Object.entries(PPE_TYPES).map(([key, ppe]) => (
                      <option key={key} value={key}>{ppe.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Item Name *
                    {formErrors.item_name && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.item_name})</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.item_name ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Size</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  >
                    <option value="">Select Size</option>
                    {PPE_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Condition *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  >
                    {Object.entries(CONDITION_TYPES).map(([key, condition]) => (
                      <option key={key} value={key}>{condition.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dates and Location */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Dates & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Issue Date *
                    {formErrors.issue_date && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.issue_date})</span>
                    )}
                  </label>
                  <input
                    type="date"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.issue_date ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location *
                    {formErrors.location && (
                      <span className="text-rose-600 text-sm font-normal ml-2">({formErrors.location})</span>
                    )}
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white ${
                      formErrors.location ? 'border-rose-300' : 'border-slate-300'
                    }`}
                  >
                    {Object.keys(MINE_LOCATIONS).map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mine Section</label>
                  <input
                    type="text"
                    name="mine_section"
                    value={formData.mine_section}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Issued By</label>
                  <input
                    type="text"
                    name="issued_by"
                    value={formData.issued_by}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                  >
                    {Object.entries(STATUS_TYPES).map(([key, status]) => (
                      <option key={key} value={key}>{status.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold tracking-wide"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {initialData ? 'Update Record' : 'Issue PPE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions = ({ onNewRecord, onRefresh, loading }) => {
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="p-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      </button>
      <button 
        onClick={onNewRecord}
        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
      >
        <Plus className="h-4 w-4" />
        New PPE Record
      </button>
    </div>
  );
};

// Main PPE Management Component
export default function PPEManagement() {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Enhanced data fetching
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
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Get unique employees for autocomplete
  const existingEmployees = useMemo(() => {
    const employeeMap = new Map();
    
    records.forEach(record => {
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

  // Group records by employee
  const employeesWithPPE = useMemo(() => {
    const employeeMap = new Map();
    
    records.forEach(record => {
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

  // Enhanced form success handler
  const handleFormSuccess = (message) => {
    setSuccess(message);
    fetchAllData();
    setTimeout(() => setSuccess(null), 5000);
  };

  // Handle form submission
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

  // Enhanced delete handler
  const handleDeleteRecord = async (recordId) => {
    if (!confirm('Are you sure you want to delete this PPE record? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePPERecord(recordId);
      setRecords(prev => prev.filter(record => record.id !== recordId));
      setSuccess('PPE record deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to delete PPE record: ${error.message}`);
    }
  };

  // Filter employees based on search
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employeesWithPPE;
    
    const searchLower = searchTerm.toLowerCase();
    return employeesWithPPE.filter(employee => 
      employee.employee_name?.toLowerCase().includes(searchLower) ||
      employee.employee_id?.toLowerCase().includes(searchLower) ||
      employee.position?.toLowerCase().includes(searchLower)
    );
  }, [employeesWithPPE, searchTerm]);

  // Calculate additional stats
  const enhancedStats = useMemo(() => {
    if (!stats) return null;
    
    const activeRecords = records.filter(record => record.status === 'active').length;
    const expiringSoon = records.filter(record => 
      isExpiringSoon(record.expiry_date) && record.status === 'active'
    ).length;
    
    return {
      ...stats,
      activeRecords,
      expiringSoon
    };
  }, [stats, records]);

  // Initial data fetch
  useEffect(() => { 
    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">PPE Management System</h1>
                <p className="text-sm text-slate-600 font-medium">Maintenance Department</p>
              </div>
            </div>
            
            <QuickActions 
              onNewRecord={() => {
                setSelectedEmployee(null);
                setEditData(null);
                setShowForm(true);
              }}
              onRefresh={fetchAllData}
              loading={loading}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Enhanced Alerts */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600" />
            <div className="flex-1">
              <p className="text-rose-800 font-semibold tracking-wide">Error</p>
              <p className="text-rose-700 text-sm font-medium">{error}</p>
            </div>
            <button onClick={fetchAllData} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors font-semibold">
              Retry
            </button>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div className="flex-1">
              <p className="text-emerald-800 font-semibold tracking-wide">Success</p>
              <p className="text-emerald-700 text-sm font-medium">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="p-1 hover:bg-emerald-200 rounded transition-colors">
              <X className="h-4 w-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Statistics Overview */}
        {enhancedStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Employees" 
              value={enhancedStats.unique_employees} 
              icon={Users} 
              color="slate"
            />
            <StatCard 
              title="Active PPE" 
              value={enhancedStats.activeRecords} 
              icon={CheckCircle2} 
              color="emerald"
            />
            <StatCard 
              title="Expiring Soon" 
              value={enhancedStats.expiringSoon} 
              icon={AlertTriangle} 
              color="rose"
            />
            <StatCard 
              title="Expired Items" 
              value={enhancedStats.expired} 
              icon={XCircle} 
              color="violet"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6">
            <div className="space-y-6">
              {/* Search Header */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 tracking-wide">
                    Employee PPE Records
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Search and manage PPE assignments for maintenance personnel
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 lg:flex-none min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search by employee name, ID, or position..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Employee PPE Cards */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center space-y-3">
                    <Loader2 className="h-12 w-12 animate-spin text-slate-600 mx-auto" />
                    <p className="text-slate-600 font-semibold">
                      Loading employee PPE records...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <EmployeePPECard 
                      key={employee.employee_id}
                      employee={employee}
                      records={employee.records}
                      onIssueNew={(emp) => {
                        setSelectedEmployee(emp);
                        setEditData(null);
                        setShowForm(true);
                      }}
                      onEditItem={(record) => {
                        setEditData(record);
                        setSelectedEmployee(null);
                        setShowForm(true);
                      }}
                      onDeleteItem={handleDeleteRecord}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredEmployees.length === 0 && (
                <div className="text-center py-16">
                  <UserCheck className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-bold text-slate-900 mb-2 tracking-wide">
                    {searchTerm ? 'No matching employees found' : 'No employee records found'}
                  </p>
                  <p className="text-sm text-slate-600 mb-6 font-medium">
                    {searchTerm ? 'Try adjusting your search terms' : 'Get started by issuing PPE to your first employee'}
                  </p>
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide"
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
                    Issue First PPE
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* PPE Issue Form Modal */}
      <PPEIssueForm 
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditData(null);
          setSelectedEmployee(null);
        }}
        onSubmit={handleSubmitForm}
        initialData={editData}
        employee={selectedEmployee}
        existingEmployees={existingEmployees}
      />
    </div>
  );
}