//PPE Management Page

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User,
  Edit,
  Trash2,
  X,
  Download,
  Bell,
  History,
  Package,
  Users,
  TrendingUp,
  Eye,
  ShoppingCart,
  FileText,
  Printer,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  ChevronDown,
  Filter,
  ChevronRight
} from 'lucide-react';
import { format, addMonths, addDays, isBefore, isAfter, differenceInDays } from 'date-fns';

// Custom Select Component (self-contained)
const CustomSelect = ({ value, onChange, options, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

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
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
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

// PPE Item Categories and Types
const PPE_CATEGORIES = {
  head: {
    name: 'Head Protection',
    icon: '🪖',
    items: ['Hard Hat', 'Bump Cap', 'Welding Helmet'],
    lifespan: 24
  },
  eye: {
    name: 'Eye & Face Protection',
    icon: '🥽',
    items: ['Safety Glasses', 'Goggles', 'Face Shield', 'Welding Goggles'],
    lifespan: 12
  },
  hearing: {
    name: 'Hearing Protection',
    icon: '🎧',
    items: ['Ear Plugs', 'Ear Muffs', 'Canal Caps'],
    lifespan: 6
  },
  respiratory: {
    name: 'Respiratory Protection',
    icon: '😷',
    items: ['Dust Mask', 'Respirator', 'Gas Mask', 'N95 Mask'],
    lifespan: 6
  },
  hand: {
    name: 'Hand Protection',
    icon: '🧤',
    items: ['Leather Gloves', 'Cut-Resistant Gloves', 'Chemical Gloves', 'Welding Gloves'],
    lifespan: 3
  },
  foot: {
    name: 'Foot Protection',
    icon: '🥾',
    items: ['Safety Boots', 'Steel Toe Boots', 'Chemical Boots', 'Electrical Hazard Boots'],
    lifespan: 12
  },
  body: {
    name: 'Body Protection',
    icon: '🦺',
    items: ['Hi-Vis Vest', 'Coveralls', 'Apron', 'Lab Coat', 'Welding Jacket'],
    lifespan: 12
  },
  fall: {
    name: 'Fall Protection',
    icon: '🪢',
    items: ['Safety Harness', 'Lanyard', 'Anchor Point', 'Lifeline'],
    lifespan: 12
  }
};

// Sample Employee Data
const SAMPLE_EMPLOYEES = [
  {
    id: 'EMP001',
    name: 'John Smith',
    department: 'Maintenance',
    position: 'Maintenance Technician',
    email: 'john.smith@company.com',
    phone: '+1-555-0101',
    hireDate: '2022-01-15',
    photo: '👷',
    ppeHistory: [
      {
        id: 'PPE001',
        category: 'head',
        item: 'Hard Hat',
        size: 'L',
        issuedDate: '2024-01-15',
        expiryDate: '2026-01-15',
        quantity: 1,
        condition: 'Good',
        issuedBy: 'Sarah Manager',
        notes: 'Standard yellow hard hat'
      },
      {
        id: 'PPE002',
        category: 'foot',
        item: 'Safety Boots',
        size: '10',
        issuedDate: '2024-03-20',
        expiryDate: '2025-03-20',
        quantity: 1,
        condition: 'Good',
        issuedBy: 'Sarah Manager',
        notes: 'Steel toe boots'
      },
      {
        id: 'PPE003',
        category: 'hand',
        item: 'Leather Gloves',
        size: 'L',
        issuedDate: '2024-09-01',
        expiryDate: '2024-12-01',
        quantity: 2,
        condition: 'Good',
        issuedBy: 'Sarah Manager',
        notes: 'Heavy duty leather gloves'
      }
    ]
  },
  {
    id: 'EMP002',
    name: 'Maria Garcia',
    department: 'Electrical',
    position: 'Electrician',
    email: 'maria.garcia@company.com',
    phone: '+1-555-0102',
    hireDate: '2021-06-10',
    photo: '👩‍🔧',
    ppeHistory: [
      {
        id: 'PPE004',
        category: 'head',
        item: 'Hard Hat',
        size: 'M',
        issuedDate: '2024-02-10',
        expiryDate: '2026-02-10',
        quantity: 1,
        condition: 'Good',
        issuedBy: 'Sarah Manager',
        notes: 'Electrical hazard rated'
      },
      {
        id: 'PPE005',
        category: 'hand',
        item: 'Chemical Gloves',
        size: 'M',
        issuedDate: '2024-10-15',
        expiryDate: '2025-01-15',
        quantity: 3,
        condition: 'New',
        issuedBy: 'Sarah Manager',
        notes: 'Insulated gloves'
      }
    ]
  },
  {
    id: 'EMP003',
    name: 'David Chen',
    department: 'Welding',
    position: 'Welder',
    email: 'david.chen@company.com',
    phone: '+1-555-0103',
    hireDate: '2023-03-22',
    photo: '👨‍🏭',
    ppeHistory: [
      {
        id: 'PPE006',
        category: 'head',
        item: 'Welding Helmet',
        size: 'Universal',
        issuedDate: '2024-04-01',
        expiryDate: '2026-04-01',
        quantity: 1,
        condition: 'Good',
        issuedBy: 'Sarah Manager',
        notes: 'Auto-darkening helmet'
      },
      {
        id: 'PPE007',
        category: 'body',
        item: 'Welding Jacket',
        size: 'XL',
        issuedDate: '2024-05-15',
        expiryDate: '2025-05-15',
        quantity: 1,
        condition: 'Good',
        issuedBy: 'Sarah Manager',
        notes: 'Flame resistant jacket'
      },
      {
        id: 'PPE008',
        category: 'hand',
        item: 'Welding Gloves',
        size: 'L',
        issuedDate: '2024-10-01',
        expiryDate: '2025-01-01',
        quantity: 2,
        condition: 'Good',
        issuedBy: 'Sarah Manager',
        notes: 'Heat resistant gloves'
      }
    ]
  }
];

// Toast notification
const toast = {
  success: (title, options = {}) => {
    alert(`✓ ${title}${options.description ? '\n' + options.description : ''}`);
  },
  warning: (title, options = {}) => {
    alert(`⚠ ${title}${options.description ? '\n' + options.description : ''}`);
  },
  error: (title, options = {}) => {
    alert(`✗ ${title}${options.description ? '\n' + options.description : ''}`);
  }
};

// PPE Issue Form Component
const PPEIssueForm = ({ isOpen, onClose, onSubmit, employee, editingItem }) => {
  const [formData, setFormData] = useState({
    category: '',
    item: '',
    size: '',
    quantity: 1,
    issuedDate: format(new Date(), 'yyyy-MM-dd'),
    condition: 'New',
    issuedBy: 'Current User',
    notes: ''
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        category: editingItem.category,
        item: editingItem.item,
        size: editingItem.size,
        quantity: editingItem.quantity,
        issuedDate: format(new Date(editingItem.issuedDate), 'yyyy-MM-dd'),
        condition: editingItem.condition,
        issuedBy: editingItem.issuedBy,
        notes: editingItem.notes || ''
      });
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const category = PPE_CATEGORIES[formData.category];
    const expiryDate = addMonths(new Date(formData.issuedDate), category.lifespan);
    
    const ppeData = {
      ...formData,
      id: editingItem ? editingItem.id : `PPE${Date.now()}`,
      expiryDate: expiryDate.toISOString(),
      employeeId: employee.id,
      employeeName: employee.name
    };
    
    onSubmit(ppeData);
    onClose();
    setFormData({
      category: '',
      item: '',
      size: '',
      quantity: 1,
      issuedDate: format(new Date(), 'yyyy-MM-dd'),
      condition: 'New',
      issuedBy: 'Current User',
      notes: ''
    });
  };

  if (!isOpen) return null;

  const selectedCategory = formData.category ? PPE_CATEGORIES[formData.category] : null;

  const categoryOptions = Object.entries(PPE_CATEGORIES).map(([key, cat]) => ({
    value: key,
    label: `${cat.icon} ${cat.name}`
  }));

  const itemOptions = selectedCategory ? selectedCategory.items.map(item => ({
    value: item,
    label: item
  })) : [];

  const conditionOptions = [
    { value: 'New', label: 'New' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Replacement', label: 'Replacement' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <Shield className="w-6 h-6" />
                {editingItem ? 'Update PPE Issue' : 'Issue PPE'}
              </h2>
              <p className="text-blue-100 mt-1">
                {employee.name} - {employee.department}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-800">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">PPE Category *</Label>
                <CustomSelect
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value, item: '' })}
                  options={categoryOptions}
                  placeholder="Select category"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item">PPE Item *</Label>
                <CustomSelect
                  value={formData.item}
                  onChange={(value) => setFormData({ ...formData, item: value })}
                  options={itemOptions}
                  placeholder="Select item"
                  disabled={!formData.category}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size *</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., L, XL, 10, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  type="number"
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuedDate">Issue Date *</Label>
                <Input
                  type="date"
                  id="issuedDate"
                  value={formData.issuedDate}
                  onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <CustomSelect
                  value={formData.condition}
                  onChange={(value) => setFormData({ ...formData, condition: value })}
                  options={conditionOptions}
                  placeholder="Select condition"
                />
              </div>
            </div>

            {selectedCategory && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Expected Lifespan:</strong> {selectedCategory.lifespan} months
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Expiry Date:</strong> {format(addMonths(new Date(formData.issuedDate), selectedCategory.lifespan), 'MMM dd, yyyy')}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes or comments..."
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              {editingItem ? 'Update PPE' : 'Issue PPE'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Employee PPE Card Component
const EmployeePPECard = ({ employee, onIssue, onView, getDueItems }) => {
  const dueItems = getDueItems(employee);
  const totalItems = employee.ppeHistory.length;
  const activeItems = employee.ppeHistory.filter(ppe => 
    isAfter(new Date(ppe.expiryDate), new Date())
  ).length;

  return (
    <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 group">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{employee.photo}</div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800">{employee.name}</h3>
                <p className="text-sm text-slate-600">{employee.position}</p>
                <p className="text-xs text-slate-500">{employee.department}</p>
              </div>
            </div>
            {dueItems.length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                <Bell className="w-3 h-3 mr-1" />
                {dueItems.length} Due
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 py-3 border-y">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
              <p className="text-xs text-slate-600">Total PPE</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{activeItems}</p>
              <p className="text-xs text-slate-600">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{dueItems.length}</p>
              <p className="text-xs text-slate-600">Due Soon</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(employee)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              size="sm"
              onClick={() => onIssue(employee)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Issue PPE
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Employee Details View
const EmployeeDetailsView = ({ employee, onClose, onIssue, onEdit, onDelete }) => {
  if (!employee) return null;

  const getStatusBadge = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = differenceInDays(expiry, today);

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge className="bg-orange-500">Due Soon ({daysUntilExpiry}d)</Badge>;
    } else {
      return <Badge className="bg-green-500">Active</Badge>;
    }
  };

  const generatePPECard = () => {
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>PPE Card - ${employee.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; padding: 2rem; background: #f8fafc; }
          .card { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 2rem; text-align: center; }
          .header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
          .header p { opacity: 0.9; }
          .content { padding: 2rem; }
          .employee-info { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 2px solid #e2e8f0; }
          .info-field { margin-bottom: 0.5rem; }
          .info-label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; }
          .info-value { font-size: 1rem; color: #1e293b; }
          .ppe-table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
          .ppe-table th { background: #f1f5f9; padding: 0.75rem; text-align: left; font-size: 0.875rem; color: #475569; border: 1px solid #e2e8f0; }
          .ppe-table td { padding: 0.75rem; border: 1px solid #e2e8f0; font-size: 0.875rem; }
          .status-active { color: #16a34a; font-weight: 600; }
          .status-due { color: #ea580c; font-weight: 600; }
          .status-expired { color: #dc2626; font-weight: 600; }
          .footer { text-align: center; padding: 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 0.875rem; }
          @media print { body { padding: 0; background: white; } .card { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>🛡️ Personal Protective Equipment Card</h1>
            <p>Safety Equipment Issue Record</p>
          </div>
          <div class="content">
            <div class="employee-info">
              <div>
                <div class="info-field">
                  <div class="info-label">Employee Name</div>
                  <div class="info-value">${employee.name}</div>
                </div>
                <div class="info-field">
                  <div class="info-label">Employee ID</div>
                  <div class="info-value">${employee.id}</div>
                </div>
                <div class="info-field">
                  <div class="info-label">Email</div>
                  <div class="info-value">${employee.email}</div>
                </div>
              </div>
              <div>
                <div class="info-field">
                  <div class="info-label">Position</div>
                  <div class="info-value">${employee.position}</div>
                </div>
                <div class="info-field">
                  <div class="info-label">Department</div>
                  <div class="info-value">${employee.department}</div>
                </div>
                <div class="info-field">
                  <div class="info-label">Hire Date</div>
                  <div class="info-value">${format(new Date(employee.hireDate), 'MMM dd, yyyy')}</div>
                </div>
              </div>
            </div>
            <h3 style="font-size: 1.25rem; color: #1e293b; margin-bottom: 1rem;">PPE Issue History</h3>
            <table class="ppe-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Size</th>
                  <th>Issued Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Issued By</th>
                </tr>
              </thead>
              <tbody>
                ${employee.ppeHistory.map(ppe => {
                  const daysUntilExpiry = differenceInDays(new Date(ppe.expiryDate), new Date());
                  let statusClass = 'status-active';
                  let statusText = 'Active';
                  if (daysUntilExpiry < 0) {
                    statusClass = 'status-expired';
                    statusText = 'Expired';
                  } else if (daysUntilExpiry <= 30) {
                    statusClass = 'status-due';
                    statusText = `Due (${daysUntilExpiry}d)`;
                  }
                  return `
                    <tr>
                      <td>${ppe.item}</td>
                      <td>${ppe.size}</td>
                      <td>${format(new Date(ppe.issuedDate), 'MMM dd, yyyy')}</td>
                      <td>${format(new Date(ppe.expiryDate), 'MMM dd, yyyy')}</td>
                      <td class="${statusClass}">${statusText}</td>
                      <td>${ppe.issuedBy}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div class="footer">
            <p>Generated on ${format(new Date(), 'MMM dd, yyyy HH:mm')}</p>
            <p>PPE Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{employee.photo}</div>
              <div>
                <h2 className="text-2xl font-semibold">{employee.name}</h2>
                <p className="text-slate-300">{employee.position} • {employee.department}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {employee.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {employee.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={generatePPECard} className="text-white hover:bg-slate-700">
                <Printer className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-slate-700">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5" />
              PPE Issue History
            </h3>
            <Button onClick={() => onIssue(employee)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Issue New PPE
            </Button>
          </div>

          {employee.ppeHistory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">No PPE issued yet</p>
              <Button onClick={() => onIssue(employee)} className="mt-4">
                Issue First PPE
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {employee.ppeHistory.map((ppe) => (
                <Card key={ppe.id} className="border border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{PPE_CATEGORIES[ppe.category].icon}</span>
                              <div>
                                <h4 className="font-semibold text-lg text-slate-800">{ppe.item}</h4>
                                <p className="text-sm text-slate-600">{PPE_CATEGORIES[ppe.category].name}</p>
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(ppe.expiryDate)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-600">Size</p>
                            <p className="font-semibold text-slate-800">{ppe.size}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Quantity</p>
                            <p className="font-semibold text-slate-800">{ppe.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Condition</p>
                            <p className="font-semibold text-slate-800">{ppe.condition}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Issued By</p>
                            <p className="font-semibold text-slate-800">{ppe.issuedBy}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-600" />
                            <div>
                              <p className="text-xs text-slate-600">Issued Date</p>
                              <p className="font-semibold text-slate-800">{format(new Date(ppe.issuedDate), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-600" />
                            <div>
                              <p className="text-xs text-slate-600">Expiry Date</p>
                              <p className="font-semibold text-slate-800">{format(new Date(ppe.expiryDate), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                        </div>

                        {ppe.notes && (
                          <div className="bg-slate-50 rounded-lg p-3 mb-4">
                            <p className="text-xs text-slate-600 mb-1">Notes</p>
                            <p className="text-sm text-slate-700">{ppe.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEdit(employee, ppe)}>
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onDelete(employee, ppe)}>
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }) => {
  const colorConfig = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600', border: 'border-orange-200' },
    red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600', border: 'border-red-200' }
  };

  const config = colorConfig[color];

  return (
    <Card className={`${config.bg} ${config.border} border shadow-sm hover:shadow-md transition-all duration-300`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium mb-1 text-slate-600">{title}</p>
            <p className={`text-3xl font-bold ${config.text}`}>{value}</p>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <Icon className={`w-7 h-7 ${config.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main PPE Management Component
export default function PPEManagementSystem() {
  const [employees, setEmployees] = useState(SAMPLE_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueEmployee, setIssueEmployee] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const getDueItems = (employee) => {
    return employee.ppeHistory.filter(ppe => {
      const daysUntilExpiry = differenceInDays(new Date(ppe.expiryDate), new Date());
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    });
  };

  const getExpiredItems = (employee) => {
    return employee.ppeHistory.filter(ppe => {
      return isBefore(new Date(ppe.expiryDate), new Date());
    });
  };

  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartment) {
      filtered = filtered.filter(emp => emp.department === filterDepartment);
    }

    if (activeTab === 'due') {
      filtered = filtered.filter(emp => getDueItems(emp).length > 0);
    } else if (activeTab === 'expired') {
      filtered = filtered.filter(emp => getExpiredItems(emp).length > 0);
    }

    return filtered;
  }, [employees, searchTerm, filterDepartment, activeTab]);

  const allDepartments = useMemo(() => {
    return [...new Set(employees.map(emp => emp.department))];
  }, [employees]);

  const statistics = useMemo(() => {
    const totalEmployees = employees.length;
    const totalPPEIssued = employees.reduce((sum, emp) => sum + emp.ppeHistory.length, 0);
    const dueForRenewal = employees.reduce((sum, emp) => sum + getDueItems(emp).length, 0);
    const expired = employees.reduce((sum, emp) => sum + getExpiredItems(emp).length, 0);

    return { totalEmployees, totalPPEIssued, dueForRenewal, expired };
  }, [employees]);

  const handleIssuePPE = (ppeData) => {
    setEmployees(employees.map(emp => {
      if (emp.id === ppeData.employeeId) {
        if (editingItem) {
          return {
            ...emp,
            ppeHistory: emp.ppeHistory.map(ppe => 
              ppe.id === editingItem.id ? { ...ppe, ...ppeData } : ppe
            )
          };
        } else {
          return {
            ...emp,
            ppeHistory: [...emp.ppeHistory, ppeData]
          };
        }
      }
      return emp;
    }));

    toast.success(
      editingItem ? 'PPE Updated' : 'PPE Issued Successfully',
      { description: `${ppeData.item} has been ${editingItem ? 'updated' : 'issued'} to ${ppeData.employeeName}` }
    );

    setEditingItem(null);
  };

  const handleDeletePPE = (employee, ppe) => {
    if (window.confirm(`Are you sure you want to remove ${ppe.item} from ${employee.name}?`)) {
      setEmployees(employees.map(emp => {
        if (emp.id === employee.id) {
          return {
            ...emp,
            ppeHistory: emp.ppeHistory.filter(p => p.id !== ppe.id)
          };
        }
        return emp;
      }));

      toast.success('PPE Removed', { description: `${ppe.item} has been removed from records` });
    }
  };

  const handleEditPPE = (employee, ppe) => {
    setIssueEmployee(employee);
    setEditingItem(ppe);
    setShowIssueForm(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsView(true);
  };

  const handleIssueClick = (employee) => {
    setIssueEmployee(employee);
    setEditingItem(null);
    setShowIssueForm(true);
  };

  const notifications = useMemo(() => {
    const alerts = [];
    employees.forEach(emp => {
      const dueItems = getDueItems(emp);
      const expiredItems = getExpiredItems(emp);
      
      dueItems.forEach(ppe => {
        alerts.push({
          type: 'warning',
          employee: emp,
          ppe: ppe,
          message: `${emp.name}'s ${ppe.item} expires in ${differenceInDays(new Date(ppe.expiryDate), new Date())} days`
        });
      });

      expiredItems.forEach(ppe => {
        alerts.push({
          type: 'danger',
          employee: emp,
          ppe: ppe,
          message: `${emp.name}'s ${ppe.item} has expired`
        });
      });
    });
    return alerts;
  }, [employees]);

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...allDepartments.map(dept => ({ value: dept, label: dept }))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {showIssueForm && (
        <PPEIssueForm
          isOpen={showIssueForm}
          onClose={() => {
            setShowIssueForm(false);
            setIssueEmployee(null);
            setEditingItem(null);
          }}
          onSubmit={handleIssuePPE}
          employee={issueEmployee}
          editingItem={editingItem}
        />
      )}

      {showDetailsView && (
        <EmployeeDetailsView
          employee={selectedEmployee}
          onClose={() => {
            setShowDetailsView(false);
            setSelectedEmployee(null);
          }}
          onIssue={handleIssueClick}
          onEdit={handleEditPPE}
          onDelete={handleDeletePPE}
        />
      )}

      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-600" />
              PPE Management System
            </h1>
            <p className="text-slate-600 mt-2">
              Track and manage Personal Protective Equipment for all employees
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                if (notifications.length > 0) {
                  const message = notifications.slice(0, 5).map(n => n.message).join('\n');
                  toast.warning('PPE Notifications', { description: message });
                } else {
                  toast.success('All Clear', { description: 'No pending PPE renewals' });
                }
              }}
            >
              <Bell className="w-4 h-4" />
              Notifications
              {notifications.length > 0 && (
                <Badge variant="destructive" className="ml-1">{notifications.length}</Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Employees"
            value={statistics.totalEmployees}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Total PPE Issued"
            value={statistics.totalPPEIssued}
            icon={Package}
            color="green"
          />
          <StatCard
            title="Due for Renewal"
            value={statistics.dueForRenewal}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Expired Items"
            value={statistics.expired}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {notifications.length > 0 && (
          <Card className="border-l-4 border-l-orange-500 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    PPE Renewal Alerts ({notifications.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {notifications.slice(0, 5).map((alert, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 text-sm">
                        <span className="text-slate-700">{alert.message}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewEmployee(alert.employee)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                  {notifications.length > 5 && (
                    <p className="text-sm text-orange-700 mt-2">
                      +{notifications.length - 5} more notifications
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border border-slate-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search employees by name, ID, department..."
                  className="pl-10 border-slate-300 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-[200px]">
                <CustomSelect
                  value={filterDepartment}
                  onChange={setFilterDepartment}
                  options={departmentOptions}
                  placeholder="All Departments"
                />
              </div>

              {(searchTerm || filterDepartment) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDepartment('');
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
            <TabsTrigger value="all">
              All Employees ({employees.length})
            </TabsTrigger>
            <TabsTrigger value="due" className="text-orange-700">
              Due Soon ({employees.filter(emp => getDueItems(emp).length > 0).length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="text-red-700">
              Expired ({employees.filter(emp => getExpiredItems(emp).length > 0).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredEmployees.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600">No employees found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                  <EmployeePPECard
                    key={employee.id}
                    employee={employee}
                    onIssue={handleIssueClick}
                    onView={handleViewEmployee}
                    getDueItems={getDueItems}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              PPE Categories & Expected Lifespan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(PPE_CATEGORIES).map(([key, category]) => (
                <div key={key} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h4 className="font-semibold text-slate-800">{category.name}</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    <strong>Lifespan:</strong> {category.lifespan} months
                  </p>
                  <div className="text-xs text-slate-500">
                    {category.items.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}