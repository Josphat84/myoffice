// app/ppe/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Home,
  ArrowLeft,
  SlidersHorizontal,
  X,
  Grid,
  List,
  User,
  FileText,
  TrendingUp,
  AlertTriangle,
  Package,
  Truck,
  Archive,
  RotateCcw,
  Scissors,
  Calendar // Added missing import
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PPE_STORAGE_KEY = 'ppe-allocations';
const PPE_ITEMS_KEY = 'ppe-items';

export default function PPEPage() {
  const [allocations, setAllocations] = useState([]);
  const [ppeItems, setPpeItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // PPE categories and statuses
  const ppeCategories = ['safety-helmet', 'safety-glasses', 'high-visibility', 'protective-footwear', 'gloves', 'ear-protection', 'respiratory', 'full-body'];
  const allocationStatuses = ['active', 'expired', 'pending-return', 'damaged', 'lost'];

  useEffect(() => {
    loadPPEData();
  }, []);

  const loadPPEData = async () => {
    try {
      // Load employees from API
      const employeesResponse = await fetch('/api/employees');
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
      }

      // Load PPE items and allocations from localStorage
      const storedItems = localStorage.getItem(PPE_ITEMS_KEY);
      const storedAllocations = localStorage.getItem(PPE_STORAGE_KEY);

      if (storedItems) {
        setPpeItems(JSON.parse(storedItems));
      } else {
        const sampleItems = generateSamplePPEItems();
        setPpeItems(sampleItems);
        savePPEItems(sampleItems);
      }

      if (storedAllocations) {
        setAllocations(JSON.parse(storedAllocations));
      } else {
        const sampleAllocations = await generateSampleAllocations();
        setAllocations(sampleAllocations);
        saveAllocations(sampleAllocations);
      }
    } catch (error) {
      console.error('Error loading PPE data:', error);
    }
  };

  const generateSamplePPEItems = () => {
    return [
      {
        id: 'ppe-001',
        itemCode: 'SH-001',
        itemName: 'Hard Hat - Standard',
        category: 'safety-helmet',
        size: 'Universal',
        color: 'Yellow',
        material: 'HDPE',
        safetyStandard: 'ANSI Z89.1',
        unitCost: 25.99,
        reorderLevel: 10,
        currentStock: 45,
        isActive: true
      },
      {
        id: 'ppe-002',
        itemCode: 'SG-001',
        itemName: 'Safety Glasses - Clear',
        category: 'safety-glasses',
        size: 'Universal',
        color: 'Clear',
        material: 'Polycarbonate',
        safetyStandard: 'ANSI Z87.1',
        unitCost: 8.50,
        reorderLevel: 25,
        currentStock: 32,
        isActive: true
      },
      {
        id: 'ppe-003',
        itemCode: 'HV-001',
        itemName: 'High-Vis Vest - Class 2',
        category: 'high-visibility',
        size: 'XL',
        color: 'Orange',
        material: 'Polyester Mesh',
        safetyStandard: 'ANSI/ISEA 107',
        unitCost: 12.75,
        reorderLevel: 15,
        currentStock: 8,
        isActive: true
      },
      {
        id: 'ppe-004',
        itemCode: 'PF-001',
        itemName: 'Steel-Toe Boots',
        category: 'protective-footwear',
        size: '10',
        color: 'Brown',
        material: 'Leather',
        safetyStandard: 'ASTM F2413',
        unitCost: 89.99,
        reorderLevel: 5,
        currentStock: 12,
        isActive: true
      },
      {
        id: 'ppe-005',
        itemCode: 'GL-001',
        itemName: 'Cut-Resistant Gloves',
        category: 'gloves',
        size: 'L',
        color: 'Gray',
        material: 'HPPE/Steel',
        safetyStandard: 'ANSI Cut A4',
        unitCost: 15.25,
        reorderLevel: 20,
        currentStock: 28,
        isActive: true
      }
    ];
  };

  const generateSampleAllocations = async () => {
    const now = new Date();
    return [
      {
        id: 'alloc-001',
        employeeId: 'emp-1',
        employeeName: 'Mike Johnson',
        ppeItemId: 'ppe-001',
        ppeItemName: 'Hard Hat - Standard',
        ppeCategory: 'safety-helmet',
        serialNumber: 'SH2024001',
        size: 'Universal',
        issueDate: new Date(now.getFullYear(), now.getMonth() - 2, 15).toISOString(),
        expiryDate: new Date(now.getFullYear() + 1, now.getMonth() - 2, 15).toISOString(),
        condition: 'good',
        status: 'active',
        issuedBy: 'safety-manager-1',
        notes: 'Standard issue for construction site',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 15).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth() - 2, 15).toISOString()
      },
      {
        id: 'alloc-002',
        employeeId: 'emp-2',
        employeeName: 'Sarah Chen',
        ppeItemId: 'ppe-002',
        ppeItemName: 'Safety Glasses - Clear',
        ppeCategory: 'safety-glasses',
        serialNumber: 'SG2024001',
        size: 'Universal',
        issueDate: new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString(),
        expiryDate: new Date(now.getFullYear() + 1, now.getMonth() - 1, 10).toISOString(),
        condition: 'good',
        status: 'active',
        issuedBy: 'safety-manager-1',
        notes: 'Lab safety requirement',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString()
      },
      {
        id: 'alloc-003',
        employeeId: 'emp-3',
        employeeName: 'David Rodriguez',
        ppeItemId: 'ppe-003',
        ppeItemName: 'High-Vis Vest - Class 2',
        ppeCategory: 'high-visibility',
        serialNumber: 'HV2024001',
        size: 'XL',
        issueDate: new Date(now.getFullYear(), now.getMonth() - 3, 5).toISOString(),
        expiryDate: new Date(now.getFullYear(), now.getMonth() + 3, 5).toISOString(),
        condition: 'worn',
        status: 'expired',
        issuedBy: 'safety-manager-2',
        notes: 'Vest showing signs of wear',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 3, 5).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      },
      {
        id: 'alloc-004',
        employeeId: 'emp-4',
        employeeName: 'Emily Watson',
        ppeItemId: 'ppe-004',
        ppeItemName: 'Steel-Toe Boots',
        ppeCategory: 'protective-footwear',
        serialNumber: 'PF2024001',
        size: '8',
        issueDate: new Date(now.getFullYear(), now.getMonth() - 6, 20).toISOString(),
        expiryDate: new Date(now.getFullYear() + 1, now.getMonth() - 6, 20).toISOString(),
        condition: 'damaged',
        status: 'damaged',
        issuedBy: 'safety-manager-1',
        notes: 'Right boot sole separation',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 6, 20).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString()
      },
      {
        id: 'alloc-005',
        employeeId: 'emp-1',
        employeeName: 'Mike Johnson',
        ppeItemId: 'ppe-005',
        ppeItemName: 'Cut-Resistant Gloves',
        ppeCategory: 'gloves',
        serialNumber: 'GL2024001',
        size: 'L',
        issueDate: new Date(now.getFullYear(), now.getMonth() - 1, 25).toISOString(),
        expiryDate: new Date(now.getFullYear(), now.getMonth() + 5, 25).toISOString(),
        condition: 'good',
        status: 'active',
        issuedBy: 'safety-manager-2',
        notes: 'Metal fabrication work',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 25).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 25).toISOString()
      }
    ];
  };

  const saveAllocations = (allocations) => {
    try {
      localStorage.setItem(PPE_STORAGE_KEY, JSON.stringify(allocations));
    } catch (error) {
      console.error('Error saving PPE allocations:', error);
    }
  };

  const savePPEItems = (items) => {
    try {
      localStorage.setItem(PPE_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving PPE items:', error);
    }
  };

  const createAllocation = (newAllocation) => {
    const updatedAllocations = [...allocations, { 
      ...newAllocation, 
      id: `alloc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
    setAllocations(updatedAllocations);
    saveAllocations(updatedAllocations);
  };

  const updateAllocation = (allocationId, updates) => {
    const updatedAllocations = allocations.map(allocation => 
      allocation.id === allocationId ? { ...allocation, ...updates, updatedAt: new Date().toISOString() } : allocation
    );
    setAllocations(updatedAllocations);
    saveAllocations(updatedAllocations);
  };

  const deleteAllocation = (allocationId) => {
    const updatedAllocations = allocations.filter(allocation => allocation.id !== allocationId);
    setAllocations(updatedAllocations);
    saveAllocations(updatedAllocations);
  };

  const markForReturn = (allocationId) => {
    updateAllocation(allocationId, { 
      status: 'pending-return',
      condition: 'pending-inspection'
    });
  };

  const renewAllocation = (allocationId) => {
    const allocation = allocations.find(a => a.id === allocationId);
    const newExpiry = new Date();
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);
    
    updateAllocation(allocationId, { 
      status: 'active',
      expiryDate: newExpiry.toISOString(),
      condition: 'good',
      notes: allocation.notes ? `${allocation.notes} - Renewed on ${new Date().toLocaleDateString()}` : `Renewed on ${new Date().toLocaleDateString()}`
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'expired': 'bg-red-100 text-red-800 border-red-200',
      'pending-return': 'bg-amber-100 text-amber-800 border-amber-200',
      'damaged': 'bg-orange-100 text-orange-800 border-orange-200',
      'lost': 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[status] || colors.active;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'safety-helmet': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'safety-glasses': 'bg-blue-100 text-blue-800 border-blue-200',
      'high-visibility': 'bg-orange-100 text-orange-800 border-orange-200',
      'protective-footwear': 'bg-brown-100 text-brown-800 border-brown-200',
      'gloves': 'bg-gray-100 text-gray-800 border-gray-200',
      'ear-protection': 'bg-purple-100 text-purple-800 border-purple-200',
      'respiratory': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'full-body': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category] || colors['safety-helmet'];
  };

  const getConditionColor = (condition) => {
    const colors = {
      'excellent': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'good': 'bg-green-100 text-green-800 border-green-200',
      'fair': 'bg-amber-100 text-amber-800 border-amber-200',
      'worn': 'bg-orange-100 text-orange-800 border-orange-200',
      'damaged': 'bg-red-100 text-red-800 border-red-200',
      'pending-inspection': 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[condition] || colors.good;
  };

  // Filter allocations
  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = allocation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.ppeItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(allocation.status);
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(allocation.ppeCategory);
    
    const matchesEmployee = selectedEmployees.length === 0 || selectedEmployees.includes(allocation.employeeId);
    
    return matchesSearch && matchesStatus && matchesType && matchesEmployee;
  });

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedTypes([]);
    setSelectedEmployees([]);
    setSearchTerm("");
  };

  const stats = {
    total: allocations.length,
    active: allocations.filter(a => a.status === 'active').length,
    expired: allocations.filter(a => a.status === 'expired').length,
    expiringSoon: allocations.filter(a => {
      const expiryDate = new Date(a.expiryDate);
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.setDate(now.getDate() + 30));
      return expiryDate <= thirtyDaysFromNow && expiryDate > now && a.status === 'active';
    }).length
  };

  const statusCounts = {
    active: allocations.filter(a => a.status === 'active').length,
    expired: allocations.filter(a => a.status === 'expired').length,
    'pending-return': allocations.filter(a => a.status === 'pending-return').length,
    damaged: allocations.filter(a => a.status === 'damaged').length
  };

  const isExpiringSoon = (allocation) => {
    const expiryDate = new Date(allocation.expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.setDate(now.getDate() + 30));
    return expiryDate <= thirtyDaysFromNow && expiryDate > now && allocation.status === 'active';
  };

  const isExpired = (allocation) => {
    const expiryDate = new Date(allocation.expiryDate);
    const now = new Date();
    return expiryDate < now && allocation.status === 'active';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="flex items-center gap-3 ml-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-foreground">PPE Management</span>
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider hidden sm:inline-block">
                    Protective Equipment Allocation
                  </span>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
              </Link>
              <Link href="/employees" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Personnel
              </Link>
              <Link href="/ppe" className="text-sm font-semibold text-primary transition-colors">
                PPE
              </Link>
            </nav>

            <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
              <Link href="/ppe/allocate">
                <Plus className="h-4 w-4 mr-2" />
                New Allocation
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                PPE Allocation Management
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Track protective equipment assignments, monitor expiry dates, and manage returns
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-none border-0"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-none border-0"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={loadPPEData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Allocations</div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <Package className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.active}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-amber-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.expiringSoon}</div>
                    <div className="text-sm text-muted-foreground">Expiring Soon</div>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-red-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.expired}</div>
                    <div className="text-sm text-muted-foreground">Expired</div>
                  </div>
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by employee, item, or serial number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border-slate-300 dark:border-slate-600"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant={showFilters ? "default" : "outline"} 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {(selectedStatus.length > 0 || selectedTypes.length > 0 || selectedEmployees.length > 0) && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                        {selectedStatus.length + selectedTypes.length + selectedEmployees.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Filter PPE Allocations</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <div className="space-y-2">
                        {allocationStatuses.map(status => (
                          <div key={status} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`status-${status}`}
                              checked={selectedStatus.includes(status)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStatus([...selectedStatus, status]);
                                } else {
                                  setSelectedStatus(selectedStatus.filter(s => s !== status));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`status-${status}`} className="ml-2 text-sm text-foreground capitalize">
                              {status.replace('-', ' ')} ({statusCounts[status] || 0})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">PPE Category</label>
                      <div className="space-y-2">
                        {ppeCategories.map(category => (
                          <div key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category}`}
                              checked={selectedTypes.includes(category)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTypes([...selectedTypes, category]);
                                } else {
                                  setSelectedTypes(selectedTypes.filter(t => t !== category));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`category-${category}`} className="ml-2 text-sm text-foreground capitalize">
                              {category.replace('-', ' ')}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Employee Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Employee</label>
                      <div className="space-y-2">
                        {employees.slice(0, 5).map(employee => (
                          <div key={employee.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`employee-${employee.id}`}
                              checked={selectedEmployees.includes(employee.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEmployees([...selectedEmployees, employee.id]);
                                } else {
                                  setSelectedEmployees(selectedEmployees.filter(e => e !== employee.id));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`employee-${employee.id}`} className="ml-2 text-sm text-foreground">
                              {employee.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allocations Display */}
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="all" className="relative">
                  All Allocations
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {filteredAllocations.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="active" className="relative">
                  Active
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts.active}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="expiring" className="relative">
                  Expiring Soon
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {stats.expiringSoon}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="expired" className="relative">
                  Expired
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts.expired}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              {filteredAllocations.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Showing {filteredAllocations.length} of {allocations.length} allocations
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredAllocations.length === 0 && (
              <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center mb-6">
                      <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                      {allocations.length === 0 ? 'No PPE Allocations Yet' : 'No Allocations Found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {allocations.length === 0 
                        ? 'Get started by creating your first PPE allocation to track protective equipment assignments.'
                        : 'No allocations match your search criteria. Try adjusting your filters.'
                      }
                    </p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md">
                      <Link href="/ppe/allocate">
                        <Plus className="h-5 w-5 mr-2" />
                        Create First Allocation
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Allocations Grid/List View */}
            {filteredAllocations.length > 0 && (
              <TabsContent value="all" className="space-y-4">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAllocations.map((allocation) => (
                      <PPECard 
                        key={allocation.id} 
                        allocation={allocation}
                        onUpdate={updateAllocation}
                        onDelete={deleteAllocation}
                        onMarkReturn={markForReturn}
                        onRenew={renewAllocation}
                        getStatusColor={getStatusColor}
                        getCategoryColor={getCategoryColor}
                        getConditionColor={getConditionColor}
                        isExpiringSoon={isExpiringSoon}
                        isExpired={isExpired}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAllocations.map((allocation) => (
                      <PPEListItem 
                        key={allocation.id} 
                        allocation={allocation}
                        onUpdate={updateAllocation}
                        onDelete={deleteAllocation}
                        onMarkReturn={markForReturn}
                        onRenew={renewAllocation}
                        getStatusColor={getStatusColor}
                        getCategoryColor={getCategoryColor}
                        getConditionColor={getConditionColor}
                        isExpiringSoon={isExpiringSoon}
                        isExpired={isExpired}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* Filtered Status Tabs */}
            {['active', 'expiring', 'expired'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {filteredAllocations.filter(allocation => 
                  status === 'expiring' ? isExpiringSoon(allocation) : 
                  status === 'expired' ? isExpired(allocation) : allocation.status === status
                ).length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAllocations
                        .filter(allocation => 
                          status === 'expiring' ? isExpiringSoon(allocation) : 
                          status === 'expired' ? isExpired(allocation) : allocation.status === status
                        )
                        .map((allocation) => (
                          <PPECard 
                            key={allocation.id} 
                            allocation={allocation}
                            onUpdate={updateAllocation}
                            onDelete={deleteAllocation}
                            onMarkReturn={markForReturn}
                            onRenew={renewAllocation}
                            getStatusColor={getStatusColor}
                            getCategoryColor={getCategoryColor}
                            getConditionColor={getConditionColor}
                            isExpiringSoon={isExpiringSoon}
                            isExpired={isExpired}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredAllocations
                        .filter(allocation => 
                          status === 'expiring' ? isExpiringSoon(allocation) : 
                          status === 'expired' ? isExpired(allocation) : allocation.status === status
                        )
                        .map((allocation) => (
                          <PPEListItem 
                            key={allocation.id} 
                            allocation={allocation}
                            onUpdate={updateAllocation}
                            onDelete={deleteAllocation}
                            onMarkReturn={markForReturn}
                            onRenew={renewAllocation}
                            getStatusColor={getStatusColor}
                            getCategoryColor={getCategoryColor}
                            getConditionColor={getConditionColor}
                            isExpiringSoon={isExpiringSoon}
                            isExpired={isExpired}
                          />
                        ))}
                    </div>
                  )
                ) : (
                  <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-12 text-center">
                      <div className="mx-auto max-w-md">
                        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Shield className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          No {status} PPE Allocations
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {status === 'active' 
                            ? 'No active PPE allocations found.'
                            : status === 'expiring'
                            ? 'No PPE items are expiring soon.'
                            : 'No expired PPE allocations found.'
                          }
                        </p>
                        <Button asChild>
                          <Link href="/ppe/allocate">
                            Create New Allocation
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// PPE Card Component (Grid View)
function PPECard({ allocation, onUpdate, onDelete, onMarkReturn, onRenew, getStatusColor, getCategoryColor, getConditionColor, isExpiringSoon, isExpired }) {
  const [showActions, setShowActions] = useState(false);
  
  const issueDate = new Date(allocation.issueDate);
  const expiryDate = new Date(allocation.expiryDate);
  
  const formattedIssue = issueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isActive = allocation.status === 'active';
  const needsRenewal = isExpiringSoon(allocation) || isExpired(allocation);

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 ${
      isExpired(allocation) ? 'border-l-red-500' : 
      isExpiringSoon(allocation) ? 'border-l-amber-500' : 'border-l-green-500'
    } shadow-sm border border-slate-200 dark:border-slate-700`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isExpired(allocation) ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' :
              isExpiringSoon(allocation) ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
              'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
            }`}>
              <Shield className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-blue-600 transition-colors">
                {allocation.employeeName}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                {allocation.ppeItemName}
              </p>
            </div>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {showActions && (
              <div className="absolute right-0 top-10 bg-background border border-border rounded-lg shadow-xl z-10 w-48 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3"
                  asChild
                >
                  <Link href={`/ppe/edit/${allocation.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                {isActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={() => onMarkReturn(allocation.id)}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Mark for Return
                  </Button>
                )}
                {needsRenewal && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => onRenew(allocation.id)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Renew
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this PPE allocation?')) {
                      onDelete(allocation.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Item Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Serial No:</span>
            <span className="font-mono text-foreground">{allocation.serialNumber}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Size:</span>
            <span className="text-foreground">{allocation.size}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Issued:</span>
            <span className="text-foreground">{formattedIssue}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Expires:</span>
            <span className={`font-medium ${
              isExpired(allocation) ? 'text-red-600' : 
              isExpiringSoon(allocation) ? 'text-amber-600' : 'text-foreground'
            }`}>
              {formattedExpiry}
            </span>
          </div>
        </div>
        
        {/* Status and Condition */}
        <div className="flex gap-2 mb-4">
          <Badge variant="outline" className={`${getStatusColor(allocation.status)} border`}>
            {allocation.status.replace('-', ' ')}
          </Badge>
          <Badge variant="outline" className={`${getCategoryColor(allocation.ppeCategory)} border capitalize`}>
            {allocation.ppeCategory.replace('-', ' ')}
          </Badge>
          <Badge variant="outline" className={`${getConditionColor(allocation.condition)} border capitalize`}>
            {allocation.condition}
          </Badge>
        </div>
        
        {/* Alerts */}
        {isExpired(allocation) && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span>This PPE has expired and needs replacement</span>
          </div>
        )}
        
        {isExpiringSoon(allocation) && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg mb-4">
            <Clock className="h-4 w-4" />
            <span>Expiring in {Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24))} days</span>
          </div>
        )}

        {allocation.notes && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {allocation.notes}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-2" asChild>
            <Link href={`/ppe/view/${allocation.id}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
          {needsRenewal && (
            <Button 
              size="sm" 
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onRenew(allocation.id)}
            >
              <RotateCcw className="h-4 w-4" />
              Renew
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// PPE List Item Component (List View)
function PPEListItem({ allocation, onUpdate, onDelete, onMarkReturn, onRenew, getStatusColor, getCategoryColor, getConditionColor, isExpiringSoon, isExpired }) {
  const [showActions, setShowActions] = useState(false);
  
  const issueDate = new Date(allocation.issueDate);
  const expiryDate = new Date(allocation.expiryDate);
  
  const formattedIssue = issueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isActive = allocation.status === 'active';
  const needsRenewal = isExpiringSoon(allocation) || isExpired(allocation);

  return (
    <Card className={`hover:shadow-md transition-all duration-300 border-l-4 ${
      isExpired(allocation) ? 'border-l-red-500' : 
      isExpiringSoon(allocation) ? 'border-l-amber-500' : 'border-l-green-500'
    } shadow-sm border border-slate-200 dark:border-slate-700`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className={`p-3 rounded-lg ${
              isExpired(allocation) ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' :
              isExpiringSoon(allocation) ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
              'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
            }`}>
              <Shield className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {allocation.employeeName}
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className={`${getStatusColor(allocation.status)} border`}>
                    {allocation.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className={`${getCategoryColor(allocation.ppeCategory)} border capitalize`}>
                    {allocation.ppeCategory.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className={`${getConditionColor(allocation.condition)} border capitalize`}>
                    {allocation.condition}
                  </Badge>
                  {isExpired(allocation) && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      Expired
                    </Badge>
                  )}
                  {isExpiringSoon(allocation) && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Expiring Soon
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{allocation.ppeItemName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>SN: {allocation.serialNumber}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Scissors className="h-4 w-4" />
                  <span>Size: {allocation.size}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Issued: {formattedIssue}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Expires: {formattedExpiry}</span>
                </div>
              </div>
              
              {allocation.notes && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                  {allocation.notes}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href={`/ppe/view/${allocation.id}`}>
                <Eye className="h-4 w-4" />
                View
              </Link>
            </Button>
            
            {needsRenewal && (
              <Button 
                size="sm" 
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onRenew(allocation.id)}
              >
                <RotateCcw className="h-4 w-4" />
                Renew
              </Button>
            )}
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {showActions && (
                <div className="absolute right-0 top-10 bg-background border border-border rounded-lg shadow-xl z-10 w-48 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3"
                    asChild
                  >
                    <Link href={`/ppe/edit/${allocation.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  {isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      onClick={() => onMarkReturn(allocation.id)}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Mark for Return
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this PPE allocation?')) {
                        onDelete(allocation.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}