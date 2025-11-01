// app/maintenance/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building,
  Truck,
  Computer,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Home,
  ArrowLeft,
  FileText,
  BarChart3,
  Play,
  Pause,
  Archive,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid,
  List,
  HardHat,
  Cog,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MAINTENANCE_STORAGE_KEY = 'maintenance-requests';

export default function MaintenancePage() {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Maintenance categories and statuses
  const maintenanceCategories = ['equipment', 'facility', 'vehicle', 'safety', 'it', 'preventive'];
  const requestStatuses = ['open', 'in-progress', 'on-hold', 'completed', 'cancelled'];
  const priorityLevels = ['low', 'medium', 'high', 'critical'];

  useEffect(() => {
    loadMaintenanceData();
  }, []);

  const loadMaintenanceData = async () => {
    try {
      // Load employees from API
      const employeesResponse = await fetch('/api/employees');
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
      }

      // Load maintenance requests from localStorage
      const storedRequests = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
      if (storedRequests) {
        setRequests(JSON.parse(storedRequests));
      } else {
        const sampleData = await generateSampleMaintenanceRequests();
        setRequests(sampleData);
        saveMaintenanceRequests(sampleData);
      }

      // Load equipment data
      const equipmentData = generateSampleEquipment();
      setEquipment(equipmentData);
    } catch (error) {
      console.error('Error loading maintenance data:', error);
    }
  };

  const generateSampleEquipment = () => {
    return [
      { id: 'eq-001', name: 'CNC Machine #1', category: 'equipment', location: 'Production Floor A' },
      { id: 'eq-002', name: 'Forklift #3', category: 'vehicle', location: 'Warehouse' },
      { id: 'eq-003', name: 'Server Rack A', category: 'it', location: 'Server Room' },
      { id: 'eq-004', name: 'HVAC Unit North', category: 'facility', location: 'Roof' },
      { id: 'eq-005', name: 'Safety Shower', category: 'safety', location: 'Lab Area' }
    ];
  };

  const generateSampleMaintenanceRequests = async () => {
    const now = new Date();
    return [
      {
        id: 'maint-001',
        title: 'CNC Machine Calibration',
        description: 'Routine calibration and maintenance for CNC machine #1',
        category: 'equipment',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'emp-2',
        assignedToName: 'Sarah Chen',
        equipmentId: 'eq-001',
        equipmentName: 'CNC Machine #1',
        location: 'Production Floor A',
        reportedBy: 'emp-1',
        reportedByName: 'Mike Johnson',
        reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5).toISOString(),
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
        completedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
        estimatedHours: 4,
        actualHours: 3.5,
        cost: 0,
        notes: 'Calibration completed successfully. Machine operating within specifications.',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      },
      {
        id: 'maint-002',
        title: 'Forklift Hydraulic Leak',
        description: 'Hydraulic fluid leak detected in forklift #3. Needs immediate attention.',
        category: 'vehicle',
        priority: 'high',
        status: 'in-progress',
        assignedTo: 'emp-3',
        assignedToName: 'David Rodriguez',
        equipmentId: 'eq-002',
        equipmentName: 'Forklift #3',
        location: 'Warehouse',
        reportedBy: 'emp-4',
        reportedByName: 'Emily Watson',
        reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
        completedDate: null,
        estimatedHours: 6,
        actualHours: null,
        cost: null,
        notes: 'Seal replacement required. Parts ordered, ETA 2 days.',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      },
      {
        id: 'maint-003',
        title: 'Server Room Cooling Issue',
        description: 'Temperature rising in server room. AC unit not maintaining set temperature.',
        category: 'it',
        priority: 'critical',
        status: 'open',
        assignedTo: null,
        assignedToName: null,
        equipmentId: 'eq-003',
        equipmentName: 'Server Rack A',
        location: 'Server Room',
        reportedBy: 'emp-5',
        reportedByName: 'Alex Kim',
        reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
        scheduledDate: null,
        completedDate: null,
        estimatedHours: 3,
        actualHours: null,
        cost: null,
        notes: 'Urgent - server temperatures approaching critical levels.',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      },
      {
        id: 'maint-004',
        title: 'Preventive Maintenance - HVAC',
        description: 'Quarterly preventive maintenance for HVAC system',
        category: 'preventive',
        priority: 'low',
        status: 'scheduled',
        assignedTo: 'emp-2',
        assignedToName: 'Sarah Chen',
        equipmentId: 'eq-004',
        equipmentName: 'HVAC Unit North',
        location: 'Roof',
        reportedBy: 'system',
        reportedByName: 'Automated System',
        reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10).toISOString(),
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5).toISOString(),
        completedDate: null,
        estimatedHours: 8,
        actualHours: null,
        cost: null,
        notes: 'Quarterly filter replacement and system check',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10).toISOString()
      },
      {
        id: 'maint-005',
        title: 'Safety Shower Inspection',
        description: 'Monthly safety shower and eye wash station inspection',
        category: 'safety',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'emp-3',
        assignedToName: 'David Rodriguez',
        equipmentId: 'eq-005',
        equipmentName: 'Safety Shower',
        location: 'Lab Area',
        reportedBy: 'system',
        reportedByName: 'Automated System',
        reportedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
        scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
        completedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
        estimatedHours: 1,
        actualHours: 0.75,
        cost: 0,
        notes: 'All safety showers operational. No issues found.',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      }
    ];
  };

  const saveMaintenanceRequests = (requests) => {
    try {
      localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(requests));
    } catch (error) {
      console.error('Error saving maintenance requests:', error);
    }
  };

  const createMaintenanceRequest = (newRequest) => {
    const updatedRequests = [...requests, { 
      ...newRequest, 
      id: `maint-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
    setRequests(updatedRequests);
    saveMaintenanceRequests(updatedRequests);
  };

  const updateMaintenanceRequest = (requestId, updates) => {
    const updatedRequests = requests.map(request => 
      request.id === requestId ? { ...request, ...updates, updatedAt: new Date().toISOString() } : request
    );
    setRequests(updatedRequests);
    saveMaintenanceRequests(updatedRequests);
  };

  const deleteMaintenanceRequest = (requestId) => {
    const updatedRequests = requests.filter(request => request.id !== requestId);
    setRequests(updatedRequests);
    saveMaintenanceRequests(updatedRequests);
  };

  const assignRequest = (requestId, employeeId, employeeName) => {
    updateMaintenanceRequest(requestId, { 
      assignedTo: employeeId,
      assignedToName: employeeName,
      status: 'in-progress'
    });
  };

  const completeRequest = (requestId, actualHours, cost, notes) => {
    updateMaintenanceRequest(requestId, { 
      status: 'completed',
      completedDate: new Date().toISOString(),
      actualHours,
      cost,
      notes: notes || 'Completed successfully'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-red-100 text-red-800 border-red-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'on-hold': 'bg-amber-100 text-amber-800 border-amber-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-slate-100 text-slate-800 border-slate-200',
      'scheduled': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-green-100 text-green-800 border-green-200',
      'medium': 'bg-amber-100 text-amber-800 border-amber-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'critical': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'equipment': 'bg-blue-100 text-blue-800 border-blue-200',
      'facility': 'bg-purple-100 text-purple-800 border-purple-200',
      'vehicle': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'safety': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'it': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'preventive': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[category] || colors.equipment;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'equipment': Wrench,
      'facility': Building,
      'vehicle': Truck,
      'safety': Shield,
      'it': Computer,
      'preventive': Cog
    };
    return icons[category] || Wrench;
  };

  // Filter maintenance requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(request.status);
    
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(request.priority);
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(request.category);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedPriorities([]);
    setSelectedCategories([]);
    setSearchTerm("");
  };

  const stats = {
    total: requests.length,
    open: requests.filter(r => r.status === 'open').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    critical: requests.filter(r => r.priority === 'critical').length
  };

  const statusCounts = {
    open: requests.filter(r => r.status === 'open').length,
    'in-progress': requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    scheduled: requests.filter(r => r.status === 'scheduled').length
  };

  const isOverdue = (request) => {
    if (request.status === 'completed' || !request.scheduledDate) return false;
    const scheduledDate = new Date(request.scheduledDate);
    const now = new Date();
    return scheduledDate < now;
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-600 to-amber-700 shadow-lg">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-foreground">Maintenance</span>
                  <span className="text-xs text-orange-600 font-semibold uppercase tracking-wider hidden sm:inline-block">
                    Work Order Management
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
              <Link href="/maintenance" className="text-sm font-semibold text-primary transition-colors">
                Maintenance
              </Link>
            </nav>

            <Button size="sm" asChild className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800">
              <Link href="/maintenance/create">
                <Plus className="h-4 w-4 mr-2" />
                New Request
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
                Maintenance Management
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Track work orders, assign technicians, and monitor maintenance activities
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
              <Button variant="outline" size="sm" onClick={loadMaintenanceData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-orange-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Requests</div>
                  </div>
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-red-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.open}</div>
                    <div className="text-sm text-muted-foreground">Open</div>
                  </div>
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.inProgress}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-purple-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.critical}</div>
                    <div className="text-sm text-muted-foreground">Critical</div>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
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
                      placeholder="Search by title, description, or equipment..."
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
                    {(selectedStatus.length > 0 || selectedPriorities.length > 0 || selectedCategories.length > 0) && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                        {selectedStatus.length + selectedPriorities.length + selectedCategories.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Filter Maintenance Requests</h3>
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
                        {requestStatuses.map(status => (
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
                              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                            />
                            <label htmlFor={`status-${status}`} className="ml-2 text-sm text-foreground capitalize">
                              {status.replace('-', ' ')} ({statusCounts[status] || 0})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Priority Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <div className="space-y-2">
                        {priorityLevels.map(priority => (
                          <div key={priority} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`priority-${priority}`}
                              checked={selectedPriorities.includes(priority)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPriorities([...selectedPriorities, priority]);
                                } else {
                                  setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                            />
                            <label htmlFor={`priority-${priority}`} className="ml-2 text-sm text-foreground capitalize">
                              {priority}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <div className="space-y-2">
                        {maintenanceCategories.map(category => (
                          <div key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategories([...selectedCategories, category]);
                                } else {
                                  setSelectedCategories(selectedCategories.filter(c => c !== category));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                            />
                            <label htmlFor={`category-${category}`} className="ml-2 text-sm text-foreground capitalize">
                              {category}
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

          {/* Maintenance Requests Display */}
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="all" className="relative">
                  All Requests
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {filteredRequests.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="open" className="relative">
                  Open
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts.open}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="relative">
                  In Progress
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts['in-progress']}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="critical" className="relative">
                  Critical
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {stats.critical}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              {filteredRequests.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Showing {filteredRequests.length} of {requests.length} requests
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 && (
              <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 flex items-center justify-center mb-6">
                      <Wrench className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                      {requests.length === 0 ? 'No Maintenance Requests Yet' : 'No Requests Found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {requests.length === 0 
                        ? 'Get started by creating your first maintenance request to track work orders and assignments.'
                        : 'No requests match your search criteria. Try adjusting your filters.'
                      }
                    </p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 shadow-md">
                      <Link href="/maintenance/create">
                        <Plus className="h-5 w-5 mr-2" />
                        Create First Request
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Maintenance Requests Grid/List View */}
            {filteredRequests.length > 0 && (
              <TabsContent value="all" className="space-y-4">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRequests.map((request) => (
                      <MaintenanceCard 
                        key={request.id} 
                        request={request}
                        onUpdate={updateMaintenanceRequest}
                        onDelete={deleteMaintenanceRequest}
                        onAssign={assignRequest}
                        onComplete={completeRequest}
                        employees={employees}
                        getStatusColor={getStatusColor}
                        getPriorityColor={getPriorityColor}
                        getCategoryColor={getCategoryColor}
                        getCategoryIcon={getCategoryIcon}
                        isOverdue={isOverdue}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <MaintenanceListItem 
                        key={request.id} 
                        request={request}
                        onUpdate={updateMaintenanceRequest}
                        onDelete={deleteMaintenanceRequest}
                        onAssign={assignRequest}
                        onComplete={completeRequest}
                        employees={employees}
                        getStatusColor={getStatusColor}
                        getPriorityColor={getPriorityColor}
                        getCategoryColor={getCategoryColor}
                        getCategoryIcon={getCategoryIcon}
                        isOverdue={isOverdue}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* Filtered Status Tabs */}
            {['open', 'in-progress', 'critical'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {filteredRequests.filter(request => 
                  status === 'critical' ? request.priority === 'critical' : request.status === status
                ).length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredRequests
                        .filter(request => 
                          status === 'critical' ? request.priority === 'critical' : request.status === status
                        )
                        .map((request) => (
                          <MaintenanceCard 
                            key={request.id} 
                            request={request}
                            onUpdate={updateMaintenanceRequest}
                            onDelete={deleteMaintenanceRequest}
                            onAssign={assignRequest}
                            onComplete={completeRequest}
                            employees={employees}
                            getStatusColor={getStatusColor}
                            getPriorityColor={getPriorityColor}
                            getCategoryColor={getCategoryColor}
                            getCategoryIcon={getCategoryIcon}
                            isOverdue={isOverdue}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredRequests
                        .filter(request => 
                          status === 'critical' ? request.priority === 'critical' : request.status === status
                        )
                        .map((request) => (
                          <MaintenanceListItem 
                            key={request.id} 
                            request={request}
                            onUpdate={updateMaintenanceRequest}
                            onDelete={deleteMaintenanceRequest}
                            onAssign={assignRequest}
                            onComplete={completeRequest}
                            employees={employees}
                            getStatusColor={getStatusColor}
                            getPriorityColor={getPriorityColor}
                            getCategoryColor={getCategoryColor}
                            getCategoryIcon={getCategoryIcon}
                            isOverdue={isOverdue}
                          />
                        ))}
                    </div>
                  )
                ) : (
                  <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-12 text-center">
                      <div className="mx-auto max-w-md">
                        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Wrench className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          No {status} Maintenance Requests
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {status === 'open' 
                            ? 'No open maintenance requests. All caught up!'
                            : status === 'in-progress'
                            ? 'No requests are currently in progress.'
                            : 'No critical maintenance requests found.'
                          }
                        </p>
                        <Button asChild>
                          <Link href="/maintenance/create">
                            Create New Request
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

// Maintenance Card Component (Grid View)
function MaintenanceCard({ request, onUpdate, onDelete, onAssign, onComplete, employees, getStatusColor, getPriorityColor, getCategoryColor, getCategoryIcon, isOverdue }) {
  const [showActions, setShowActions] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  
  const CategoryIcon = getCategoryIcon(request.category);
  const reportedDate = new Date(request.reportedDate);
  const scheduledDate = request.scheduledDate ? new Date(request.scheduledDate) : null;
  
  const formattedReported = reportedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isOpen = request.status === 'open';
  const isInProgress = request.status === 'in-progress';
  const isCompleted = request.status === 'completed';
  const isCritical = request.priority === 'critical';

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 ${
      isCritical ? 'border-l-red-500' : 
      isOverdue(request) ? 'border-l-amber-500' : 'border-l-orange-500'
    } shadow-sm border border-slate-200 dark:border-slate-700`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isCritical ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' :
              isOverdue(request) ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
              'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
            }`}>
              <CategoryIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-orange-600 transition-colors">
                {request.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {request.equipmentName} • {request.location}
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
                  <Link href={`/maintenance/edit/${request.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                {isOpen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => setShowAssignDialog(true)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Assign
                  </Button>
                )}
                {isInProgress && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => setShowCompleteDialog(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this maintenance request?')) {
                      onDelete(request.id);
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
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {request.description}
        </p>
        
        {/* Request Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Reported: {formattedReported}</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={`${getStatusColor(request.status)} border`}>
                {request.status.replace('-', ' ')}
              </Badge>
              <Badge variant="outline" className={`${getPriorityColor(request.priority)} border capitalize`}>
                {request.priority}
              </Badge>
            </div>
          </div>
          
          {request.assignedToName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Assigned to: {request.assignedToName}</span>
            </div>
          )}
          
          {scheduledDate && (
            <div className={`flex items-center gap-2 text-sm ${
              isOverdue(request) ? 'text-amber-600' : 'text-muted-foreground'
            }`}>
              <Clock className="h-4 w-4" />
              <span>
                Scheduled: {scheduledDate.toLocaleDateString()}
                {isOverdue(request) && ' (Overdue)'}
              </span>
            </div>
          )}

          {request.estimatedHours && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Est. Hours: {request.estimatedHours}</span>
            </div>
          )}
        </div>

        {/* Alerts */}
        {isCritical && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span>Critical priority - requires immediate attention</span>
          </div>
        )}
        
        {isOverdue(request) && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg mb-4">
            <Clock className="h-4 w-4" />
            <span>This request is overdue</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-2" asChild>
            <Link href={`/maintenance/view/${request.id}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
          {isOpen && (
            <Button 
              size="sm" 
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowAssignDialog(true)}
            >
              <User className="h-4 w-4" />
              Assign
            </Button>
          )}
          {isInProgress && (
            <Button 
              size="sm" 
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowCompleteDialog(true)}
            >
              <CheckCircle className="h-4 w-4" />
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Maintenance List Item Component (List View)
function MaintenanceListItem({ request, onUpdate, onDelete, onAssign, onComplete, employees, getStatusColor, getPriorityColor, getCategoryColor, getCategoryIcon, isOverdue }) {
  const [showActions, setShowActions] = useState(false);
  
  const CategoryIcon = getCategoryIcon(request.category);
  const reportedDate = new Date(request.reportedDate);
  const scheduledDate = request.scheduledDate ? new Date(request.scheduledDate) : null;
  
  const formattedReported = reportedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const isOpen = request.status === 'open';
  const isInProgress = request.status === 'in-progress';
  const isCritical = request.priority === 'critical';

  return (
    <Card className={`hover:shadow-md transition-all duration-300 border-l-4 ${
      isCritical ? 'border-l-red-500' : 
      isOverdue(request) ? 'border-l-amber-500' : 'border-l-orange-500'
    } shadow-sm border border-slate-200 dark:border-slate-700`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className={`p-3 rounded-lg ${
              isCritical ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' :
              isOverdue(request) ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
              'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
            }`}>
              <CategoryIcon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {request.title}
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className={`${getStatusColor(request.status)} border`}>
                    {request.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className={`${getPriorityColor(request.priority)} border capitalize`}>
                    {request.priority}
                  </Badge>
                  <Badge variant="outline" className={`${getCategoryColor(request.category)} border capitalize`}>
                    {request.category}
                  </Badge>
                  {isCritical && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      Critical
                    </Badge>
                  )}
                  {isOverdue(request) && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{request.equipmentName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{request.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Reported: {formattedReported}</span>
                </div>
              </div>
              
              {request.assignedToName && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  <span>Assigned to: {request.assignedToName}</span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground line-clamp-1">
                {request.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href={`/maintenance/view/${request.id}`}>
                <Eye className="h-4 w-4" />
                View
              </Link>
            </Button>
            
            {isOpen && (
              <Button 
                size="sm" 
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // In a real app, you'd open an assign dialog
                  const availableTech = employees.find(emp => emp.department === 'maintenance');
                  if (availableTech) {
                    onAssign(request.id, availableTech.id, availableTech.name);
                  }
                }}
              >
                <User className="h-4 w-4" />
                Assign
              </Button>
            )}
            
            {isInProgress && (
              <Button 
                size="sm" 
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  // In a real app, you'd open a complete dialog
                  onComplete(request.id, request.estimatedHours, 0, 'Completed as scheduled');
                }}
              >
                <CheckCircle className="h-4 w-4" />
                Complete
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
                    <Link href={`/maintenance/edit/${request.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this maintenance request?')) {
                        onDelete(request.id);
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