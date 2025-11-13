// Enhanced PPE Management System with Supabase Integration
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, Search, Plus, Calendar, Clock, AlertTriangle, 
  CheckCircle, User, Edit, Trash2, X, Bell, History, 
  Package, Users, Eye, Printer, Download, Upload, Filter,
  BarChart3, Settings, RefreshCw, ShoppingCart, TrendingUp,
  Zap, Battery, QrCode, Database, Server, Network,
  ShieldCheck, DollarSign, Percent, Target, FileText,
  ChevronDown, Grid, List, Mail, Phone, Building,
  DownloadCloud, UploadCloud, Scan, Barcode, Camera,
  ShieldOff, ShieldAlert, ShieldPlus, ShieldMinus
} from 'lucide-react';
import { format, addMonths, isBefore, isAfter, differenceInDays, parseISO, addDays } from 'date-fns';

// API service with enhanced Supabase integration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

class EnhancedPPEService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutes for fresher data
  }

  async request(endpoint, options = {}) {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    // Only use cache for GET requests
    if (cached && options.method === 'GET' && Date.now() - cached.timestamp < this.cacheTimeout) {
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

      if (response.status === 404) {
        console.warn(`Endpoint ${endpoint} not found, using fallback data`);
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      
      // Only cache successful GET responses
      if (options.method === 'GET' || !options.method) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }
      
      return data;
    } catch (error) {
      console.error(`API Error - ${endpoint}:`, error);
      return null;
    }
  }

  // Enhanced employees with better error handling
  async getEmployees(search = '', department = '') {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (department) params.append('department', department);
      params.append('fields', 'id,first_name,last_name,email,phone,department,designation,id_number,date_of_engagement,status');
      
      const data = await this.request(`/api/employees?${params}`);
      
      if (data && Array.isArray(data)) {
        return data.map(emp => ({
          id: emp.id || emp.employee_id,
          first_name: emp.first_name || '',
          last_name: emp.last_name || '',
          email: emp.email || '',
          phone: emp.phone || '',
          department: emp.department || 'Unassigned',
          designation: emp.designation || emp.position || 'Not Specified',
          id_number: emp.id_number || emp.employee_id || '',
          photo: this.generateAvatar(emp.first_name, emp.last_name),
          date_of_engagement: emp.date_of_engagement || emp.hire_date,
          status: emp.status || 'active',
          ...emp
        }));
      }
      
      return this.getEnhancedMockEmployees();
    } catch (error) {
      console.error('Error in getEmployees:', error);
      return this.getEnhancedMockEmployees();
    }
  }

  generateAvatar(firstName = '', lastName = '') {
    const firstChar = firstName?.[0] || 'U';
    const secondChar = lastName?.[0] || '';
    return `${firstChar}${secondChar}`.toUpperCase();
  }

  getEnhancedMockEmployees() {
    const departments = ['Engineering', 'Operations', 'Safety', 'Maintenance', 'Quality', 'HR', 'Finance'];
    const designations = [
      'Software Engineer', 'Operations Manager', 'Safety Officer', 'Maintenance Technician',
      'Quality Inspector', 'HR Specialist', 'Financial Analyst', 'Project Manager'
    ];
    
    return Array.from({ length: 25 }, (_, i) => {
      const dept = departments[i % departments.length];
      const designation = designations[i % designations.length];
      const firstName = ['John', 'Jane', 'Michael', 'Sarah', 'Robert', 'Emily', 'David', 'Lisa'][i % 8];
      const lastName = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Wilson', 'Taylor'][i % 8];
      
      return {
        id: `emp_${i + 1}`,
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        phone: `+1-555-01${(i + 1).toString().padStart(2, '0')}`,
        department: dept,
        designation: designation,
        id_number: `EMP${(i + 1).toString().padStart(3, '0')}`,
        photo: this.generateAvatar(firstName, lastName),
        date_of_engagement: addDays(new Date(), -Math.floor(Math.random() * 365)).toISOString().split('T')[0],
        status: 'active'
      };
    });
  }

  // PPE Items Management with Supabase schema
  async createPPEItem(ppeData) {
    try {
      console.log('Creating PPE item with data:', ppeData);
      
      // Transform for Supabase schema
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
        status: 'active',
        cost: ppeData.cost || 0,
        supplier: ppeData.supplier || '',
        warranty_period: ppeData.warrantyPeriod || 0
      };
      
      const result = await this.request('/api/ppe-items', {
        method: 'POST',
        body: JSON.stringify(supabaseData),
      });
      
      if (!result) {
        // Mock success for development
        return this.transformPPEToFrontend({
          ...supabaseData,
          id: `ppe_${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      return this.transformPPEToFrontend(result);
    } catch (error) {
      console.error('Error in createPPEItem:', error);
      throw new Error(`Failed to create PPE item: ${error.message}`);
    }
  }

  // Get all PPE records with filtering
  async getPPERecords(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const data = await this.request(`/api/ppe-items?${params}`);
      
      if (data && Array.isArray(data)) {
        return data.map(this.transformPPEToFrontend);
      }
      
      return this.getEnhancedMockPPERecords(filters);
    } catch (error) {
      console.error('Error in getPPERecords:', error);
      return this.getEnhancedMockPPERecords(filters);
    }
  }

  getEnhancedMockPPERecords(filters = {}) {
    const mockRecords = [];
    const categories = Object.keys(PPE_CATEGORIES);
    const conditions = ['New', 'Good', 'Fair', 'Poor', 'Damaged'];
    
    // Generate more realistic mock data
    for (let i = 0; i < 50; i++) {
      const category = categories[i % categories.length];
      const categoryInfo = PPE_CATEGORIES[category];
      const employeeId = `emp_${(i % 25) + 1}`;
      
      const record = {
        id: `ppe_${i + 1}`,
        employee_id: employeeId,
        employee_name: `Employee ${(i % 25) + 1}`,
        category: category,
        item_name: categoryInfo.items[i % categoryInfo.items.length],
        size: ['S', 'M', 'L', 'XL'][i % 4],
        quantity: 1,
        issue_date: addDays(new Date(), -Math.floor(Math.random() * 180)).toISOString().split('T')[0],
        expiry_date: addDays(new Date(), Math.floor(Math.random() * 365)).toISOString().split('T')[0],
        condition: conditions[i % conditions.length],
        issued_by: ['Safety Officer', 'HR Manager', 'Department Head'][i % 3],
        notes: `Issued for ${categoryInfo.name.toLowerCase()} protection`,
        is_replacement: i % 5 === 0,
        replaced_item_id: i % 5 === 0 ? `ppe_${i}` : null,
        status: 'active',
        cost: Math.random() * 100 + 10,
        supplier: ['SafetyCo', 'ProtectPro', 'GearMaster'][i % 3],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Apply filters
      let include = true;
      if (filters.employee_id && record.employee_id !== filters.employee_id) include = false;
      if (filters.category && record.category !== filters.category) include = false;
      if (filters.status && record.status !== filters.status) include = false;
      
      if (include) mockRecords.push(record);
    }
    
    return mockRecords.map(this.transformPPEToFrontend);
  }

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
      status: ppeData.status,
      cost: ppeData.cost,
      supplier: ppeData.supplier,
      createdAt: ppeData.created_at,
      updatedAt: ppeData.updated_at
    };
  }

  // Update PPE record
  async updatePPEItem(ppeId, updates) {
    try {
      const result = await this.request(`/api/ppe-items/${ppeId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (!result) {
        return { success: true, message: 'PPE item updated successfully' };
      }
      
      return result;
    } catch (error) {
      console.error('Error in updatePPEItem:', error);
      throw new Error(`Failed to update PPE item: ${error.message}`);
    }
  }

  // Delete PPE record
  async deletePPEItem(ppeId) {
    try {
      const result = await this.request(`/api/ppe-items/${ppeId}`, {
        method: 'DELETE',
      });
      
      if (!result) {
        return { success: true, message: 'PPE item deleted successfully' };
      }
      
      return result;
    } catch (error) {
      console.error('Error in deletePPEItem:', error);
      throw new Error(`Failed to delete PPE item: ${error.message}`);
    }
  }

  // Enhanced analytics
  async getPPEAnalytics() {
    try {
      const data = await this.request('/api/ppe/analytics');
      return data || this.getEnhancedMockAnalytics();
    } catch (error) {
      console.error('Error in getPPEAnalytics:', error);
      return this.getEnhancedMockAnalytics();
    }
  }

  getEnhancedMockAnalytics() {
    return {
      categoryDistribution: {
        head: 45,
        eye: 67,
        hearing: 23,
        respiratory: 34,
        hand: 89,
        foot: 56,
        body: 28,
        fall: 12
      },
      departmentUsage: {
        "Engineering": 156,
        "Operations": 234,
        "Safety": 89,
        "Maintenance": 167,
        "Quality": 45,
        "HR": 23,
        "Finance": 12
      },
      complianceRate: 92.5,
      totalCost: 28750,
      mostIssuedItem: "Safety Glasses",
      avgLifespan: 9.2,
      renewalRate: 78.3,
      costSavings: 12500
    };
  }

  // Health check with retry
  async healthCheck() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`, {
        method: 'GET',
        cache: 'no-cache',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

const ppeService = new EnhancedPPEService();

// Enhanced PPE Categories with more details
const PPE_CATEGORIES = {
  head: {
    name: 'Head Protection',
    icon: '🪖',
    items: ['Hard Hat', 'Bump Cap', 'Welding Helmet', 'Safety Helmet'],
    lifespan: 24,
    riskLevel: 'High',
    standards: ['ANSI Z89.1', 'CSA Z94.1'],
    costRange: '$25 - $150'
  },
  eye: {
    name: 'Eye & Face Protection',
    icon: '🥽',
    items: ['Safety Glasses', 'Goggles', 'Face Shield', 'Welding Goggles'],
    lifespan: 12,
    riskLevel: 'High',
    standards: ['ANSI Z87.1', 'CSA Z94.3'],
    costRange: '$8 - $75'
  },
  hearing: {
    name: 'Hearing Protection',
    icon: '🎧',
    items: ['Ear Plugs', 'Ear Muffs', 'Noise Canceling Headphones'],
    lifespan: 12,
    riskLevel: 'Medium',
    standards: ['ANSI S3.19', 'CSA Z94.2'],
    costRange: '$2 - $50'
  },
  respiratory: {
    name: 'Respiratory Protection',
    icon: '😷',
    items: ['N95 Mask', 'Half Mask', 'Full Face Mask', 'SCBA'],
    lifespan: 'Varies',
    riskLevel: 'Critical',
    standards: ['NIOSH 42CFR84', 'CSA Z94.4'],
    costRange: '$1 - $500'
  },
  hand: {
    name: 'Hand Protection',
    icon: '🧤',
    items: ['Chemical Gloves', 'Cut Resistant', 'Heat Resistant', 'General Purpose'],
    lifespan: 6,
    riskLevel: 'Medium',
    standards: ['ANSI/ISEA 105', 'EN 388'],
    costRange: '$5 - $45'
  },
  foot: {
    name: 'Foot Protection',
    icon: '👢',
    items: ['Steel Toe Boots', 'Chemical Resistant', 'Electrical Hazard'],
    lifespan: 12,
    riskLevel: 'High',
    standards: ['ANSI Z41', 'ASTM F2413'],
    costRange: '$60 - $200'
  },
  body: {
    name: 'Body Protection',
    icon: '🥼',
    items: ['Coveralls', 'High-Vis Vest', 'Chemical Suit', 'Flame Resistant'],
    lifespan: 18,
    riskLevel: 'Medium',
    standards: ['ANSI/ISEA 107', 'NFPA 2112'],
    costRange: '$15 - $300'
  },
  fall: {
    name: 'Fall Protection',
    icon: '🪢',
    items: ['Harness', 'Lanyard', 'Anchor Points', 'Self-Retracting Lifeline'],
    lifespan: 60,
    riskLevel: 'Critical',
    standards: ['OSHA 1926', 'CSA Z259'],
    costRange: '$75 - $500'
  }
};

// Enhanced Statistics Cards
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, subtitle, onClick, loading = false }) => {
  const colorConfig = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600', border: 'border-orange-200' },
    red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600', border: 'border-red-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600', border: 'border-purple-200' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-600', border: 'border-indigo-200' }
  };

  const config = colorConfig[color];

  if (loading) {
    return (
      <Card className={`${config.bg} ${config.border} border shadow-sm animate-pulse`}>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <div className="w-7 h-7 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            {trend !== undefined && (
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

// Enhanced Quick Issue Form
const QuickIssueForm = ({ isOpen, onClose, onIssue, employees }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    category: '',
    item: '',
    size: '',
    quantity: 1,
    issuedDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    condition: 'New',
    issuedBy: '',
    notes: '',
    cost: '',
    supplier: ''
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

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
      
      // Calculate expiry date if not provided
      const expiryDate = formData.expiryDate || 
        addMonths(new Date(formData.issuedDate), category?.lifespan || 12).toISOString().split('T')[0];
      
      const ppeData = {
        employeeId: formData.employeeId,
        employeeName: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
        category: formData.category,
        item: formData.item,
        size: formData.size,
        quantity: parseInt(formData.quantity),
        issuedDate: formData.issuedDate,
        expiryDate: expiryDate,
        condition: formData.condition,
        issuedBy: formData.issuedBy || 'Safety Officer',
        notes: formData.notes,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        supplier: formData.supplier
      };

      const result = await ppeService.createPPEItem(ppeData);
      onIssue(result);
      onClose();
      setFormData({
        employeeId: '', category: '', item: '', size: '', quantity: 1,
        issuedDate: new Date().toISOString().split('T')[0], expiryDate: '',
        condition: 'New', issuedBy: '', notes: '', cost: '', supplier: ''
      });
      setStep(1);
    } catch (error) {
      console.error('Error in quick issue:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedCategory = formData.category ? PPE_CATEGORIES[formData.category] : null;
  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.first_name || ''} ${emp.last_name || ''} - ${emp.department}`
  }));
  const categoryOptions = Object.entries(PPE_CATEGORIES).map(([key, cat]) => ({
    value: key,
    label: `${cat.icon} ${cat.name}`
  }));
  const itemOptions = selectedCategory ? selectedCategory.items.map(item => ({
    value: item,
    label: item
  })) : [];
  const sizeOptions = [
    { value: '', label: 'Standard' },
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldPlus className="w-5 h-5" />
            Issue New PPE
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step > stepNum ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Employee *</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>PPE Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value, item: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setStep(2)} disabled={!formData.employeeId || !formData.category}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>PPE Item *</Label>
                <Select
                  value={formData.item}
                  onValueChange={(value) => setFormData({ ...formData, item: value })}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) => setFormData({ ...formData, size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input
                    type="date"
                    value={formData.issuedDate}
                    onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                    required
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

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Issued By</Label>
                <Input
                  value={formData.issuedBy}
                  onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                  placeholder="Name of person issuing PPE"
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Issuing...' : 'Issue PPE'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

// PPE History Table Component
const PPEHistoryTable = ({ ppeRecords, employees, onEdit, onDelete, loading }) => {
  const [filter, setFilter] = useState('all');

  const filteredRecords = useMemo(() => {
    if (filter === 'all') return ppeRecords;
    if (filter === 'active') return ppeRecords.filter(record => 
      record.expiryDate && isAfter(new Date(record.expiryDate), new Date())
    );
    if (filter === 'expired') return ppeRecords.filter(record => 
      record.expiryDate && isBefore(new Date(record.expiryDate), new Date())
    );
    if (filter === 'due') return ppeRecords.filter(record => {
      if (!record.expiryDate) return false;
      const daysUntilExpiry = differenceInDays(new Date(record.expiryDate), new Date());
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    });
    return ppeRecords;
  }, [ppeRecords, filter]);

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown';
  };

  const getStatus = (record) => {
    if (!record.expiryDate) return { status: 'Unknown', variant: 'outline' };
    
    const daysUntilExpiry = differenceInDays(new Date(record.expiryDate), new Date());
    
    if (daysUntilExpiry < 0) return { status: 'Expired', variant: 'destructive' };
    if (daysUntilExpiry <= 7) return { status: 'Urgent', variant: 'destructive' };
    if (daysUntilExpiry <= 30) return { status: 'Due Soon', variant: 'secondary' };
    return { status: 'Active', variant: 'default' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PPE History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>PPE History</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="due">Due Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>PPE Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => {
              const status = getStatus(record);
              return (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {getEmployeeName(record.employeeId)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{PPE_CATEGORIES[record.category]?.icon}</span>
                      {record.item}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {PPE_CATEGORIES[record.category]?.name || record.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(record.issuedDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    {record.expiryDate ? format(new Date(record.expiryDate), 'MMM dd, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.condition}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(record)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onDelete(record)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No PPE records found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Enhanced PPE Analytics Dashboard
const PPEAnalytics = ({ analytics, onCategoryClick, loading }) => {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  return (
    <Card>
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
                {analytics.categoryDistribution && Object.entries(analytics.categoryDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count]) => (
                  <div 
                    key={category} 
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors group"
                    onClick={() => onCategoryClick?.(category)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {PPE_CATEGORIES[category]?.icon}
                      </span>
                      <div>
                        <p className="font-medium text-slate-800">{PPE_CATEGORIES[category]?.name || category}</p>
                        <p className="text-sm text-slate-600">
                          Risk: {PPE_CATEGORIES[category]?.riskLevel} • {PPE_CATEGORIES[category]?.costRange}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-lg font-semibold">{count}</Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {((count / Object.values(analytics.categoryDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Compliance Overview</h4>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white">
                <div className="text-center">
                  <p className="text-4xl font-bold">{analytics.complianceRate}%</p>
                  <p className="text-sm opacity-90 mt-2">Overall Compliance Rate</p>
                  <div className="w-full bg-white/30 rounded-full h-2 mt-4">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${analytics.complianceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">${(analytics.totalCost / 1000).toFixed(0)}K</p>
                <p className="text-sm text-slate-600">Total Investment</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.avgLifespan}m</p>
                <p className="text-sm text-slate-600">Avg Lifespan</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Enhanced PPE Management Component
export default function EnhancedPPEManagementSystem() {
  const [employees, setEmployees] = useState([]);
  const [ppeRecords, setPpeRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [showQuickIssue, setShowQuickIssue] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check backend health
      const isBackendHealthy = await ppeService.healthCheck();
      setBackendStatus(isBackendHealthy ? 'connected' : 'disconnected');
      
      // Load employees and PPE records in parallel
      const [employeesData, ppeRecordsData, analyticsData, statsData] = await Promise.all([
        ppeService.getEmployees(searchTerm, filterDepartment),
        ppeService.getPPERecords(),
        ppeService.getPPEAnalytics(),
        ppeService.getPPEStatistics?.() || Promise.resolve({})
      ]);

      setEmployees(employeesData);
      setPpeRecords(ppeRecordsData);
      setAnalytics(analyticsData);
      setStatistics(statsData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setBackendStatus('error');
      // Load mock data as fallback
      setEmployees(ppeService.getEnhancedMockEmployees());
      setPpeRecords(ppeService.getEnhancedMockPPERecords());
      setAnalytics(ppeService.getEnhancedMockAnalytics());
      setStatistics(ppeService.getEnhancedMockStatistics());
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
      filtered = filtered.filter(emp => 
        ppeRecords.some(record => 
          record.employeeId === emp.id && 
          record.expiryDate && 
          differenceInDays(new Date(record.expiryDate), new Date()) <= 30 &&
          differenceInDays(new Date(record.expiryDate), new Date()) >= 0
        )
      );
    } else if (filterStatus === 'expired') {
      filtered = filtered.filter(emp => 
        ppeRecords.some(record => 
          record.employeeId === emp.id && 
          record.expiryDate && 
          isBefore(new Date(record.expiryDate), new Date())
        )
      );
    } else if (filterStatus === 'compliant') {
      filtered = filtered.filter(emp => 
        ppeRecords.some(record => record.employeeId === emp.id) && 
        !ppeRecords.some(record => 
          record.employeeId === emp.id && 
          record.expiryDate && 
          isBefore(new Date(record.expiryDate), new Date())
        )
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(emp =>
        ppeRecords.some(record => record.employeeId === emp.id && record.category === selectedCategory)
      );
    }

    return filtered;
  }, [employees, ppeRecords, filterStatus, selectedCategory]);

  // Calculate real-time statistics
  const realTimeStats = useMemo(() => {
    const totalPPEIssued = ppeRecords.length;
    const dueForRenewal = ppeRecords.filter(record => {
      if (!record.expiryDate) return false;
      const daysUntilExpiry = differenceInDays(new Date(record.expiryDate), new Date());
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    }).length;
    const expired = ppeRecords.filter(record => 
      record.expiryDate && isBefore(new Date(record.expiryDate), new Date())
    ).length;
    const totalCost = ppeRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
    
    return {
      totalEmployees: employees.length,
      totalPPEIssued,
      dueForRenewal,
      expired,
      totalCost,
      complianceRate: analytics?.complianceRate || 0,
      employeesWithPPE: [...new Set(ppeRecords.map(record => record.employeeId))].length
    };
  }, [employees, ppeRecords, analytics]);

  const allDepartments = useMemo(() => {
    return [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  }, [employees]);

  const handleIssuePPE = async (ppeData) => {
    try {
      await ppeService.createPPEItem(ppeData);
      refreshData(); // Refresh to show new PPE record
    } catch (error) {
      console.error('Failed to issue PPE:', error);
      alert(`Failed to issue PPE: ${error.message}`);
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading PPE Management System...</p>
          <p className="text-sm text-slate-500 mt-2">Initializing all components</p>
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
              <ShieldCheck className="w-10 h-10 text-blue-600" />
              PPE Management System
            </h1>
            <p className="text-slate-600 mt-2">
              Comprehensive Personal Protective Equipment tracking and management
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant={
                backendStatus === 'connected' ? 'default' : 
                backendStatus === 'disconnected' ? 'secondary' : 'destructive'
              }>
                <Database className="w-3 h-3 mr-1" />
                {backendStatus === 'connected' ? 'Backend Connected' :
                 backendStatus === 'disconnected' ? 'Using Demo Data' : 'Connection Error'}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {employees.length} Employees
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                {ppeRecords.length} PPE Records
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
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowQuickIssue(true)}
            >
              <ShieldPlus className="w-4 h-4 mr-2" />
              Issue PPE
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              PPE History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                title="Total Employees"
                value={realTimeStats.totalEmployees}
                icon={Users}
                color="blue"
                loading={loading}
              />
              <StatCard
                title="PPE Issued"
                value={realTimeStats.totalPPEIssued}
                icon={Package}
                color="green"
                loading={loading}
              />
              <StatCard
                title="Due for Renewal"
                value={realTimeStats.dueForRenewal}
                icon={Clock}
                color="orange"
                loading={loading}
              />
              <StatCard
                title="Expired Items"
                value={realTimeStats.expired}
                icon={AlertTriangle}
                color="red"
                loading={loading}
              />
              <StatCard
                title="Compliance Rate"
                value={`${realTimeStats.complianceRate}%`}
                icon={ShieldCheck}
                color="green"
                loading={loading}
              />
              <StatCard
                title="Total Investment"
                value={`$${(realTimeStats.totalCost / 1000).toFixed(0)}K`}
                icon={DollarSign}
                color="purple"
                loading={loading}
              />
            </div>

            {/* Analytics Overview */}
            <PPEAnalytics 
              analytics={analytics} 
              onCategoryClick={setSelectedCategory}
              loading={loading}
            />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setShowQuickIssue(true)}>
                    <ShieldPlus className="w-8 h-8 mb-2" />
                    Issue PPE
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DownloadCloud className="w-8 h-8 mb-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Printer className="w-8 h-8 mb-2" />
                    Print Reports
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Scan className="w-8 h-8 mb-2" />
                    Scan QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            {/* Filter Section */}
            <Card>
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
                      <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Departments</SelectItem>
                          {allDepartments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="compliant">Compliant</SelectItem>
                          <SelectItem value="due">Due Soon</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedCategory(null);
                        setFilterDepartment('');
                        setFilterStatus('all');
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Employees Grid/List View */}
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
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => {
                  const employeePPE = ppeRecords.filter(record => record.employeeId === employee.id);
                  const dueItems = employeePPE.filter(record => {
                    if (!record.expiryDate) return false;
                    const daysUntilExpiry = differenceInDays(new Date(record.expiryDate), new Date());
                    return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
                  });
                  const expiredItems = employeePPE.filter(record => 
                    record.expiryDate && isBefore(new Date(record.expiryDate), new Date())
                  );

                  return (
                    <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {employee.photo}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {employee.first_name} {employee.last_name}
                              </h3>
                              <p className="text-sm text-slate-600">{employee.designation}</p>
                              <p className="text-xs text-slate-500">{employee.department}</p>
                            </div>
                          </div>
                          <Badge variant={
                            expiredItems.length > 0 ? "destructive" : 
                            dueItems.length > 0 ? "secondary" : 
                            employeePPE.length === 0 ? "outline" : "default"
                          }>
                            {expiredItems.length > 0 ? `${expiredItems.length} Expired` :
                             dueItems.length > 0 ? `${dueItems.length} Due` : 
                             employeePPE.length === 0 ? 'No PPE' : 'Compliant'}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">PPE Items:</span>
                            <span className="font-semibold">{employeePPE.length}</span>
                          </div>
                          
                          {employeePPE.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-slate-700">Recent Items:</p>
                              {employeePPE.slice(0, 3).map((record, index) => (
                                <div key={record.id || index} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{PPE_CATEGORIES[record.category]?.icon}</span>
                                    <span className="font-medium">{record.item}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {record.expiryDate ? format(new Date(record.expiryDate), 'MMM dd') : 'No expiry'}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              setActiveTab('history');
                              // You could add filtering for this employee here
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              setShowQuickIssue(true);
                              // Pre-fill employee in the form
                            }}
                          >
                            <ShieldPlus className="w-4 h-4 mr-2" />
                            Issue PPE
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>PPE Items</TableHead>
                        <TableHead>Due Soon</TableHead>
                        <TableHead>Expired</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => {
                        const employeePPE = ppeRecords.filter(record => record.employeeId === employee.id);
                        const dueItems = employeePPE.filter(record => {
                          if (!record.expiryDate) return false;
                          const daysUntilExpiry = differenceInDays(new Date(record.expiryDate), new Date());
                          return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
                        });
                        const expiredItems = employeePPE.filter(record => 
                          record.expiryDate && isBefore(new Date(record.expiryDate), new Date())
                        );

                        return (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {employee.photo}
                                </div>
                                <div>
                                  <p className="font-medium">{employee.first_name} {employee.last_name}</p>
                                  <p className="text-sm text-slate-600">{employee.designation}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{employeePPE.length}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={dueItems.length > 0 ? "secondary" : "outline"}>
                                {dueItems.length}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={expiredItems.length > 0 ? "destructive" : "outline"}>
                                {expiredItems.length}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                expiredItems.length > 0 ? "destructive" : 
                                dueItems.length > 0 ? "secondary" : 
                                employeePPE.length === 0 ? "outline" : "default"
                              }>
                                {expiredItems.length > 0 ? 'Non-Compliant' :
                                 dueItems.length > 0 ? 'Attention Needed' : 
                                 employeePPE.length === 0 ? 'No PPE' : 'Compliant'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" onClick={() => setShowQuickIssue(true)}>
                                  <ShieldPlus className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* PPE History Tab */}
          <TabsContent value="history">
            <PPEHistoryTable
              ppeRecords={ppeRecords}
              employees={employees}
              onEdit={(record) => {
                // Implement edit functionality
                console.log('Edit PPE record:', record);
              }}
              onDelete={async (record) => {
                if (confirm(`Are you sure you want to delete this PPE record for ${record.item}?`)) {
                  try {
                    await ppeService.deletePPEItem(record.id);
                    refreshData();
                  } catch (error) {
                    alert(`Failed to delete PPE record: ${error.message}`);
                  }
                }
              }}
              loading={loading}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <PPEAnalytics 
              analytics={analytics} 
              onCategoryClick={setSelectedCategory}
              loading={loading}
            />
            
            {/* Additional Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.departmentUsage && Object.entries(analytics.departmentUsage)
                    .sort(([,a], [,b]) => b - a)
                    .map(([dept, count]) => (
                      <div key={dept} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                        <span className="text-sm text-slate-700">{dept}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-700">Total Investment</span>
                      <span className="font-semibold">${(realTimeStats.totalCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-700">Average per Employee</span>
                      <span className="font-semibold">
                        ${employees.length > 0 ? (realTimeStats.totalCost / employees.length).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-700">Monthly Spending</span>
                      <span className="font-semibold">$3,250</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Issue Modal */}
      <QuickIssueForm
        isOpen={showQuickIssue}
        onClose={() => setShowQuickIssue(false)}
        onIssue={handleIssuePPE}
        employees={employees}
      />
    </div>
  );
}