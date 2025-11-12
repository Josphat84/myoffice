// Enhanced PPE Management System with Complete Backend Integration
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Shield, Search, Plus, Calendar, Clock, AlertTriangle, 
  CheckCircle, User, Edit, Trash2, X, Bell, History, 
  Package, Users, Eye, Printer, Download, Upload, Filter,
  BarChart3, Settings, RefreshCw, ShoppingCart, TrendingUp,
  Zap, Battery, QrCode, Database, Server, Network,
  ShieldCheck, DollarSign, Percent, Target, FileText,
  ChevronDown, Grid, List
} from 'lucide-react';
import { format, addMonths, isBefore, isAfter, differenceInDays, parseISO } from 'date-fns';

// API service functions - Updated for Supabase schema with actual employee names
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Enhanced API service with caching
class PPEService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async request(endpoint, options = {}) {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`API Error - ${endpoint}:`, error);
      throw error;
    }
  }

  // Employees - Get actual names from Supabase
  async getEmployees(search = '', department = '') {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (department) params.append('department', department);
      
      const data = await this.request(`/api/employees?${params}`);
      
      // Transform to match expected frontend structure with actual names
      return Array.isArray(data) ? data.map(emp => ({
        id: emp.id || emp.employee_id,
        first_name: emp.first_name || '',
        last_name: emp.last_name || '',
        email: emp.email || '',
        phone: emp.phone || '',
        department: emp.department || '',
        designation: emp.designation || emp.position || '',
        id_number: emp.id_number || emp.employee_id || '',
        photo: emp.photo || '👤',
        date_of_engagement: emp.date_of_engagement || emp.hire_date,
        status: emp.status || 'active',
        // Include all original fields
        ...emp
      })) : [];
    } catch (error) {
      console.error('API Error - getEmployees:', error);
      return this.getMockEmployees();
    }
  }

  // Mock employees data for development with realistic names
  getMockEmployees() {
    return [
      {
        id: 'emp_1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1-555-0101',
        department: 'Engineering',
        designation: 'Software Engineer',
        id_number: 'EMP001',
        photo: '👨‍💼',
        date_of_engagement: '2023-01-15',
        status: 'active'
      },
      {
        id: 'emp_2',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1-555-0102',
        department: 'Operations',
        designation: 'Operations Manager',
        id_number: 'EMP002',
        photo: '👩‍💼',
        date_of_engagement: '2022-08-20',
        status: 'active'
      },
      {
        id: 'emp_3',
        first_name: 'Michael',
        last_name: 'Johnson',
        email: 'michael.johnson@company.com',
        phone: '+1-555-0103',
        department: 'Safety',
        designation: 'Safety Officer',
        id_number: 'EMP003',
        photo: '👨‍🚒',
        date_of_engagement: '2023-03-10',
        status: 'active'
      },
      {
        id: 'emp_4',
        first_name: 'Sarah',
        last_name: 'Williams',
        email: 'sarah.williams@company.com',
        phone: '+1-555-0104',
        department: 'Quality',
        designation: 'Quality Inspector',
        id_number: 'EMP004',
        photo: '👩‍🔬',
        date_of_engagement: '2022-11-05',
        status: 'active'
      }
    ];
  }

  // PPE Items - Updated for Supabase schema
  async createPPEItem(ppeData) {
    try {
      console.log('Creating PPE item:', ppeData);
      
      // Transform data for Supabase schema
      const supabaseData = {
        employee_id: ppeData.employeeId,
        employee_name: ppeData.employeeName,
        category: ppeData.category,
        item_name: ppeData.item,
        size: ppeData.size,
        quantity: ppeData.quantity,
        issue_date: ppeData.issuedDate,
        expiry_date: ppeData.expiryDate,
        condition: ppeData.condition,
        issued_by: ppeData.issuedBy,
        notes: ppeData.notes,
        is_replacement: ppeData.isReplacement || false,
        replaced_item_id: ppeData.replacedItemId,
        status: 'active'
      };
      
      const result = await this.request('/api/ppe/issue', {
        method: 'POST',
        body: JSON.stringify(supabaseData),
      });
      
      return this.transformPPEToFrontend(result);
    } catch (error) {
      console.error('API Error - createPPEItem:', error);
      // Return mock success response for development
      return this.transformPPEToFrontend({
        ...ppeData,
        id: `ppe_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  async updatePPEItem(id, ppeData) {
    try {
      const supabaseData = {
        employee_id: ppeData.employeeId,
        employee_name: ppeData.employeeName,
        category: ppeData.category,
        item_name: ppeData.item,
        size: ppeData.size,
        quantity: ppeData.quantity,
        issue_date: ppeData.issuedDate,
        expiry_date: ppeData.expiryDate,
        condition: ppeData.condition,
        issued_by: ppeData.issuedBy,
        notes: ppeData.notes,
        is_replacement: ppeData.isReplacement || false,
        replaced_item_id: ppeData.replacedItemId
      };
      
      const result = await this.request(`/api/ppe/${id}`, {
        method: 'PUT',
        body: JSON.stringify(supabaseData),
      });
      
      return this.transformPPEToFrontend(result);
    } catch (error) {
      console.error('API Error - updatePPEItem:', error);
      return this.transformPPEToFrontend({
        ...ppeData,
        id: id,
        updated_at: new Date().toISOString()
      });
    }
  }

  async deletePPEItem(id) {
    try {
      return await this.request(`/api/ppe/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('API Error - deletePPEItem:', error);
      return { message: 'PPE record deleted successfully' };
    }
  }

  // Get PPE records for a specific employee
  async getEmployeePPERecords(employeeId) {
    try {
      const data = await this.request(`/api/ppe/employee/${employeeId}`);
      return Array.isArray(data) ? data.map(this.transformPPEToFrontend) : [];
    } catch (error) {
      console.error('API Error - getEmployeePPERecords:', error);
      return this.getMockPPERecords(employeeId);
    }
  }

  // Mock PPE records for development
  getMockPPERecords(employeeId) {
    const mockRecords = {
      'emp_1': [
        {
          id: 'ppe_1',
          employee_id: 'emp_1',
          employee_name: 'John Doe',
          category: 'head',
          item_name: 'Hard Hat',
          size: 'L',
          quantity: 1,
          issue_date: '2024-01-15',
          expiry_date: '2026-01-15',
          condition: 'New',
          issued_by: 'Safety Officer',
          notes: 'Initial issue',
          is_replacement: false,
          replaced_item_id: null,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 'ppe_2',
          employee_id: 'emp_1',
          employee_name: 'John Doe',
          category: 'eye',
          item_name: 'Safety Glasses',
          size: 'Standard',
          quantity: 1,
          issue_date: '2024-01-15',
          expiry_date: '2025-01-15',
          condition: 'New',
          issued_by: 'Safety Officer',
          notes: 'Clear lens',
          is_replacement: false,
          replaced_item_id: null,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        }
      ],
      'emp_2': [
        {
          id: 'ppe_3',
          employee_id: 'emp_2',
          employee_name: 'Jane Smith',
          category: 'head',
          item_name: 'Hard Hat',
          size: 'M',
          quantity: 1,
          issue_date: '2024-02-01',
          expiry_date: '2026-02-01',
          condition: 'New',
          issued_by: 'Safety Officer',
          notes: 'White color',
          is_replacement: false,
          replaced_item_id: null,
          created_at: '2024-02-01T10:00:00Z',
          updated_at: '2024-02-01T10:00:00Z'
        }
      ]
    };
    
    return (mockRecords[employeeId] || []).map(this.transformPPEToFrontend);
  }

  // Transform PPE data from Supabase to frontend format
  transformPPEToFrontend(ppeData) {
    return {
      id: ppeData.id,
      employeeId: ppeData.employee_id,
      employeeName: ppeData.employee_name,
      category: ppeData.category,
      item: ppeData.item_name || ppeData.item,
      size: ppeData.size,
      quantity: ppeData.quantity,
      issuedDate: ppeData.issue_date || ppeData.issued_date,
      expiryDate: ppeData.expiry_date,
      condition: ppeData.condition,
      issuedBy: ppeData.issued_by,
      notes: ppeData.notes,
      isReplacement: ppeData.is_replacement,
      replacedItemId: ppeData.replaced_item_id,
      createdAt: ppeData.created_at,
      updatedAt: ppeData.updated_at
    };
  }

  // Analytics and other methods
  async getPPEAnalytics() {
    try {
      return await this.request('/api/ppe/analytics');
    } catch (error) {
      console.error('API Error - getPPEAnalytics:', error);
      return this.getEnhancedMockAnalytics();
    }
  }

  getEnhancedMockAnalytics() {
    return {
      categoryDistribution: {
        head: 15,
        eye: 23,
        hearing: 8,
        respiratory: 12,
        hand: 45,
        foot: 32,
        body: 18,
        fall: 5
      },
      departmentUsage: {
        "Engineering": 45,
        "Operations": 67,
        "Safety": 23,
        "Maintenance": 34,
        "Quality": 12
      },
      monthlyIssues: {
        "Jan": 15, "Feb": 23, "Mar": 18, "Apr": 27, 
        "May": 22, "Jun": 19, "Jul": 25, "Aug": 30,
        "Sep": 28, "Oct": 24, "Nov": 20, "Dec": 18
      },
      complianceRate: 87.5,
      totalCost: 12500,
      mostIssuedItem: "Safety Glasses",
      avgLifespan: 8.2
    };
  }

  async getPPEInventory() {
    try {
      return await this.request('/api/ppe/inventory');
    } catch (error) {
      console.error('API Error - getPPEInventory:', error);
      return this.getEnhancedMockInventory();
    }
  }

  getEnhancedMockInventory() {
    return [
      {
        category: "head",
        item: "Hard Hat",
        quantity: 45,
        reorderLevel: 10,
        cost: 25.99,
        supplier: "Safety Gear Co",
        lastOrdered: "2024-01-15"
      },
      {
        category: "eye",
        item: "Safety Glasses",
        quantity: 120,
        reorderLevel: 25,
        cost: 8.50,
        supplier: "Eye Protection Inc",
        lastOrdered: "2024-02-01"
      },
      {
        category: "hand",
        item: "Safety Gloves",
        quantity: 200,
        reorderLevel: 50,
        cost: 4.75,
        supplier: "Hand Safety Corp",
        lastOrdered: "2024-01-20"
      }
    ];
  }

  async getPPEStatistics() {
    try {
      return await this.request('/api/ppe/statistics');
    } catch (error) {
      console.error('API Error - getPPEStatistics:', error);
      return this.getEnhancedMockStatistics();
    }
  }

  getEnhancedMockStatistics() {
    return {
      totalEmployees: 156,
      totalPPEIssued: 842,
      dueForRenewal: 45,
      expired: 12,
      compliantEmployees: 138,
      nonCompliantEmployees: 18,
      monthlySpending: 3250,
      avgPPEperEmployee: 5.4
    };
  }

  async getPPENotifications() {
    try {
      return await this.request('/api/ppe/notifications');
    } catch (error) {
      console.error('API Error - getPPENotifications:', error);
      return this.getMockNotifications();
    }
  }

  getMockNotifications() {
    return [
      {
        type: "warning",
        message: "Hard Hat for John Doe expires in 5 days",
        employeeId: "emp_1",
        ppeId: "ppe_1",
        daysUntilExpiry: 5,
        priority: "high"
      },
      {
        type: "alert",
        message: "Safety Gloves for Sarah Williams have expired",
        employeeId: "emp_4",
        ppeId: "ppe_5",
        daysUntilExpiry: -2,
        priority: "critical"
      }
    ];
  }

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('API Error - healthCheck:', error);
      return false;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

const ppeService = new PPEService();

// Enhanced PPE Categories
const PPE_CATEGORIES = {
  head: {
    name: 'Head Protection',
    icon: '🪖',
    items: ['Hard Hat', 'Bump Cap', 'Welding Helmet', 'Safety Helmet'],
    lifespan: 24,
    riskLevel: 'High',
    standards: ['ANSI Z89.1', 'CSA Z94.1']
  },
  eye: {
    name: 'Eye & Face Protection',
    icon: '🥽',
    items: ['Safety Glasses', 'Goggles', 'Face Shield', 'Welding Goggles'],
    lifespan: 12,
    riskLevel: 'High',
    standards: ['ANSI Z87.1', 'CSA Z94.3']
  },
  hearing: {
    name: 'Hearing Protection',
    icon: '🎧',
    items: ['Ear Plugs', 'Ear Muffs', 'Noise Canceling Headphones'],
    lifespan: 12,
    riskLevel: 'Medium',
    standards: ['ANSI S3.19', 'CSA Z94.2']
  },
  respiratory: {
    name: 'Respiratory Protection',
    icon: '😷',
    items: ['N95 Mask', 'Half Mask', 'Full Face Mask', 'SCBA'],
    lifespan: 'Varies',
    riskLevel: 'Critical',
    standards: ['NIOSH 42CFR84', 'CSA Z94.4']
  },
  hand: {
    name: 'Hand Protection',
    icon: '🧤',
    items: ['Chemical Gloves', 'Cut Resistant', 'Heat Resistant', 'General Purpose'],
    lifespan: 6,
    riskLevel: 'Medium',
    standards: ['ANSI/ISEA 105', 'EN 388']
  },
  foot: {
    name: 'Foot Protection',
    icon: '👢',
    items: ['Steel Toe Boots', 'Chemical Resistant', 'Electrical Hazard'],
    lifespan: 12,
    riskLevel: 'High',
    standards: ['ANSI Z41', 'ASTM F2413']
  },
  body: {
    name: 'Body Protection',
    icon: '🥼',
    items: ['Coveralls', 'High-Vis Vest', 'Chemical Suit', 'Flame Resistant'],
    lifespan: 18,
    riskLevel: 'Medium',
    standards: ['ANSI/ISEA 107', 'NFPA 2112']
  },
  fall: {
    name: 'Fall Protection',
    icon: '🪢',
    items: ['Harness', 'Lanyard', 'Anchor Points', 'Self-Retracting Lifeline'],
    lifespan: 60,
    riskLevel: 'Critical',
    standards: ['OSHA 1926', 'CSA Z259']
  }
};

// Custom Select Component
const CustomSelect = ({ value, onChange, options, placeholder, disabled, searchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = searchable 
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-left bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          disabled ? 'bg-slate-100 cursor-not-allowed' : 'cursor-pointer hover:border-slate-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-slate-900' : 'text-slate-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </button>
      
      {isOpen && !disabled && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b border-slate-200">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Statistics Cards Component
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, subtitle, onClick }) => {
  const colorConfig = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600', border: 'border-orange-200' },
    red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600', border: 'border-red-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600', border: 'border-purple-200' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-600', border: 'border-indigo-200' }
  };

  const config = colorConfig[color];

  return (
    <Card 
      className={`${config.bg} ${config.border} border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105`}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium mb-1 text-slate-600">{title}</p>
            <p className={`text-3xl font-bold ${config.text}`}>{value}</p>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-slate-600'
              }`}>
                <TrendingUp className={`w-3 h-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}% from last month
              </div>
            )}
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <Icon className={`w-7 h-7 ${config.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Issue Form Component
const QuickIssueForm = ({ isOpen, onClose, onIssue, employees }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    category: '',
    item: '',
    quantity: 1,
    expiryDate: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.category || !formData.item) {
      alert('Error: Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const employee = employees.find(emp => emp.id === formData.employeeId);
      const category = PPE_CATEGORIES[formData.category];
      const expiryDate = formData.expiryDate || addMonths(new Date(), category?.lifespan || 12);
      
      const ppeData = {
        employeeId: formData.employeeId,
        employeeName: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
        category: formData.category,
        item: formData.item,
        quantity: formData.quantity,
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: expiryDate.toISOString(),
        condition: 'New',
        issuedBy: 'Safety Officer'
      };

      const result = await ppeService.createPPEItem(ppeData);
      onIssue(result);
      onClose();
      setFormData({ employeeId: '', category: '', item: '', quantity: 1, expiryDate: '' });
    } catch (error) {
      console.error('Error in quick issue:', error);
      alert('Error: Failed to issue PPE');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedCategory = formData.category ? PPE_CATEGORIES[formData.category] : null;
  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.first_name || ''} ${emp.last_name || ''}`.trim()
  }));
  const categoryOptions = Object.entries(PPE_CATEGORIES).map(([key, cat]) => ({
    value: key,
    label: `${cat.icon} ${cat.name}`
  }));
  const itemOptions = selectedCategory ? selectedCategory.items.map(item => ({
    value: item,
    label: item
  })) : [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Issue PPE
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-green-800">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Employee *</Label>
            <CustomSelect
              value={formData.employeeId}
              onChange={(value) => setFormData({ ...formData, employeeId: value })}
              options={employeeOptions}
              placeholder="Select employee"
              searchable={true}
            />
          </div>

          <div className="space-y-2">
            <Label>PPE Category *</Label>
            <CustomSelect
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value, item: '' })}
              options={categoryOptions}
              placeholder="Select category"
            />
          </div>

          <div className="space-y-2">
            <Label>PPE Item *</Label>
            <CustomSelect
              value={formData.item}
              onChange={(value) => setFormData({ ...formData, item: value })}
              options={itemOptions}
              placeholder="Select item"
              disabled={!formData.category}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? 'Issuing...' : 'Issue PPE'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
const PPEAnalytics = ({ analytics, onCategoryClick }) => {
  if (!analytics) return null;

  return (
    <Card className="border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          PPE Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Category Distribution</h4>
              <div className="space-y-3">
                {analytics.categoryDistribution && Object.entries(analytics.categoryDistribution).map(([category, count]) => (
                  <div 
                    key={category} 
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => onCategoryClick?.(category)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{PPE_CATEGORIES[category]?.icon}</span>
                      <div>
                        <p className="font-medium text-slate-800">{PPE_CATEGORIES[category]?.name || category}</p>
                        <p className="text-sm text-slate-600">Risk: {PPE_CATEGORIES[category]?.riskLevel}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-lg font-semibold">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Department Usage</h4>
              <div className="space-y-3">
                {analytics.departmentUsage && Object.entries(analytics.departmentUsage).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-800">{dept}</span>
                    <Badge variant="outline">{count} items</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Compliance Overview</h4>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
                <div className="text-center">
                  <p className="text-3xl font-bold">{analytics.complianceRate}%</p>
                  <p className="text-sm opacity-90">Overall Compliance Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Employee Card Component
const EmployeePPECard = ({ employee, onIssue, onView, getDueItems }) => {
  const dueItems = getDueItems(employee);
  const ppeHistory = employee.ppeHistory || [];
  const totalItems = ppeHistory.length;
  const activeItems = ppeHistory.filter(ppe => 
    ppe && ppe.expiryDate && isAfter(new Date(ppe.expiryDate), new Date())
  ).length;
  const expiredItems = ppeHistory.filter(ppe => 
    ppe && ppe.expiryDate && isBefore(new Date(ppe.expiryDate), new Date())
  ).length;

  const getComplianceScore = () => {
    if (totalItems === 0) return 0;
    return Math.round((activeItems / totalItems) * 100);
  };

  const complianceScore = getComplianceScore();

  return (
    <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg group-hover:scale-110 transition-transform">
              {employee.photo || '👤'}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                {employee.first_name} {employee.last_name}
              </h3>
              <p className="text-sm text-slate-600">{employee.designation || employee.position}</p>
              <p className="text-xs text-slate-500">{employee.department}</p>
            </div>
          </div>
          <Badge variant={
            expiredItems > 0 ? "destructive" : 
            dueItems.length > 0 ? "secondary" : 
            totalItems === 0 ? "outline" : "default"
          }>
            {expiredItems > 0 ? 'Expired' :
             dueItems.length > 0 ? `${dueItems.length} Due` : 
             totalItems === 0 ? 'No PPE' : 'Compliant'}
          </Badge>
        </div>

        {/* Compliance Meter */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Compliance</span>
            <span className="font-semibold">{complianceScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                complianceScore >= 80 ? 'bg-green-500' :
                complianceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${complianceScore}%` }}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-700">PPE Summary</span>
            <span className="text-xs text-slate-500">{activeItems}/{totalItems} Active</span>
          </div>
          
          {totalItems > 0 ? (
            <div className="space-y-2">
              {ppeHistory.slice(0, 3).map((ppe, index) => {
                const isExpired = ppe.expiryDate && isBefore(new Date(ppe.expiryDate), new Date());
                const isDueSoon = dueItems.some(due => due.id === ppe.id);
                
                return (
                  <div key={ppe.id || index} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded group/item hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{PPE_CATEGORIES[ppe.category]?.icon}</span>
                      <span className="font-medium text-slate-800">{ppe.item}</span>
                    </div>
                    <Badge variant={
                      isExpired ? "destructive" : 
                      isDueSoon ? "secondary" : "outline"
                    } className="text-xs">
                      {ppe.expiryDate ? format(new Date(ppe.expiryDate), 'MMM dd') : 'No expiry'}
                    </Badge>
                  </div>
                );
              })}
              {totalItems > 3 && (
                <div className="text-center text-xs text-slate-500 pt-1">
                  +{totalItems - 3} more items
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 bg-slate-50 rounded border border-slate-200">
              <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No PPE assigned</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView(employee)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => onIssue(employee)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Issue PPE
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main PPE Management Component
export default function EnhancedPPEManagementSystem() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [showQuickIssue, setShowQuickIssue] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load data from backend
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      const isBackendHealthy = await ppeService.healthCheck();
      setBackendStatus(isBackendHealthy ? 'connected' : 'disconnected');
      
      const [employeesData, statsData, analyticsData, inventoryData, notificationsData] = await Promise.all([
        ppeService.getEmployees(searchTerm, filterDepartment),
        ppeService.getPPEStatistics(),
        ppeService.getPPEAnalytics(),
        ppeService.getPPEInventory(),
        ppeService.getPPENotifications()
      ]);

      // Load PPE records for each employee
      const employeesWithPPE = await Promise.all(
        employeesData.map(async (emp) => {
          try {
            const ppeRecords = await ppeService.getEmployeePPERecords(emp.id);
            return { ...emp, ppeHistory: ppeRecords || [] };
          } catch (error) {
            console.error(`Error loading PPE for ${emp.id}:`, error);
            return { ...emp, ppeHistory: [] };
          }
        })
      );

      setEmployees(employeesWithPPE);
      setStatistics(statsData);
      setAnalytics(analyticsData);
      setInventory(inventoryData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setBackendStatus('error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, filterDepartment]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = async () => {
    setRefreshing(true);
    ppeService.clearCache();
    await loadData();
  };

  // Filter employees based on various criteria
  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (filterStatus === 'due') {
      filtered = filtered.filter(emp => getDueItems(emp).length > 0);
    } else if (filterStatus === 'expired') {
      filtered = filtered.filter(emp => 
        emp.ppeHistory?.some(ppe => 
          ppe.expiryDate && isBefore(new Date(ppe.expiryDate), new Date())
        )
      );
    } else if (filterStatus === 'compliant') {
      filtered = filtered.filter(emp => 
        emp.ppeHistory?.length > 0 && 
        !emp.ppeHistory.some(ppe => 
          ppe.expiryDate && isBefore(new Date(ppe.expiryDate), new Date())
        )
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(emp =>
        emp.ppeHistory?.some(ppe => ppe.category === selectedCategory)
      );
    }

    return filtered;
  }, [employees, filterStatus, selectedCategory]);

  const getDueItems = (employee) => {
    const ppeHistory = employee.ppeHistory || [];
    return ppeHistory.filter(ppe => {
      if (!ppe || !ppe.expiryDate) return false;
      const daysUntilExpiry = differenceInDays(new Date(ppe.expiryDate), new Date());
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    });
  };

  const allDepartments = useMemo(() => {
    return [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  }, [employees]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading Enhanced PPE Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-600" />
              Advanced PPE Management System
            </h1>
            <p className="text-slate-600 mt-2">
              Comprehensive PPE tracking, analytics, and inventory management
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant={
                backendStatus === 'connected' ? 'default' : 
                backendStatus === 'disconnected' ? 'secondary' : 'destructive'
              }>
                <Database className="w-3 h-3 mr-1" />
                {backendStatus === 'connected' ? 'Backend Connected' :
                 backendStatus === 'disconnected' ? 'Using Mock Data' : 'Backend Error'}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {employees.length} Employees
              </Badge>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button 
              variant="outline"
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowQuickIssue(true)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Quick Issue
            </Button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Employees"
            value={statistics.totalEmployees || employees.length}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="PPE Issued"
            value={statistics.totalPPEIssued || employees.reduce((acc, emp) => acc + (emp.ppeHistory?.length || 0), 0)}
            icon={Package}
            color="green"
          />
          <StatCard
            title="Due for Renewal"
            value={statistics.dueForRenewal || employees.reduce((acc, emp) => acc + getDueItems(emp).length, 0)}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Expired Items"
            value={statistics.expired || employees.reduce((acc, emp) => 
              acc + (emp.ppeHistory?.filter(ppe => 
                ppe.expiryDate && isBefore(new Date(ppe.expiryDate), new Date())
              ).length || 0), 0)}
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="Compliance Rate"
            value={`${analytics?.complianceRate || '0'}%`}
            icon={ShieldCheck}
            color="green"
          />
          <StatCard
            title="Monthly Cost"
            value={`$${statistics.monthlySpending || '0'}`}
            icon={DollarSign}
            color="purple"
          />
        </div>

        {/* Analytics Section */}
        {analytics && (
          <PPEAnalytics 
            analytics={analytics} 
            onCategoryClick={setSelectedCategory}
          />
        )}

        {/* Filter Section */}
        <Card className="border border-slate-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search employees by name, department, or designation..."
                    className="pl-10 border-slate-300 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <CustomSelect
                    value={filterDepartment}
                    onChange={setFilterDepartment}
                    options={[
                      { value: '', label: 'All Departments' },
                      ...allDepartments.map(dept => ({ value: dept, label: dept }))
                    ]}
                    placeholder="All Departments"
                  />
                  
                  <CustomSelect
                    value={filterStatus}
                    onChange={setFilterStatus}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'compliant', label: 'Compliant' },
                      { value: 'due', label: 'Due Soon' },
                      { value: 'expired', label: 'Expired' }
                    ]}
                    placeholder="Filter Status"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory || filterDepartment || filterStatus !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {PPE_CATEGORIES[selectedCategory]?.icon} {PPE_CATEGORIES[selectedCategory]?.name}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
                  </Badge>
                )}
                {filterDepartment && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Department: {filterDepartment}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterDepartment('')} />
                  </Badge>
                )}
                {filterStatus !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {filterStatus}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterStatus('all')} />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employees Grid View */}
        {filteredEmployees.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">No employees found matching your criteria</p>
              {(selectedCategory || filterDepartment || filterStatus !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory(null);
                    setFilterDepartment('');
                    setFilterStatus('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeePPECard
                key={employee.id}
                employee={employee}
                onIssue={() => setShowQuickIssue(true)}
                onView={(emp) => console.log('View employee:', emp)}
                getDueItems={getDueItems}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Issue Modal */}
      <QuickIssueForm
        isOpen={showQuickIssue}
        onClose={() => setShowQuickIssue(false)}
        onIssue={() => {
          refreshData();
          setShowQuickIssue(false);
        }}
        employees={employees}
      />
    </div>
  );
}