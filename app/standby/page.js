// app/standby/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock,
  Users,
  Calendar,
  Phone,
  AlertTriangle,
  CheckCircle,
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
  UserCheck,
  RotateCcw,
  Shield,
  MapPin,
  Mail,
  MessageSquare,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STANDBY_STORAGE_KEY = 'standby-rosters';

export default function StandbyPage() {
  const [rosters, setRosters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Sample departments and types
  const departments = ['Maintenance', 'Operations', 'Safety', 'IT', 'Engineering', 'Medical'];
  const rosterTypes = ['Emergency Response', 'Technical Support', 'Safety Watch', 'Medical Standby', 'Operations Coverage'];

  // Sample employees - would come from your personnel module
  const employees = [
    { id: 'emp-1', name: 'Mike Johnson', department: 'Maintenance', phone: '+1-555-0101', email: 'mike.j@company.com' },
    { id: 'emp-2', name: 'Sarah Chen', department: 'Operations', phone: '+1-555-0102', email: 'sarah.c@company.com' },
    { id: 'emp-3', name: 'David Rodriguez', department: 'Safety', phone: '+1-555-0103', email: 'david.r@company.com' },
    { id: 'emp-4', name: 'Emily Watson', department: 'IT', phone: '+1-555-0104', email: 'emily.w@company.com' },
    { id: 'emp-5', name: 'James Wilson', department: 'Engineering', phone: '+1-555-0105', email: 'james.w@company.com' },
    { id: 'emp-6', name: 'Lisa Brown', department: 'Medical', phone: '+1-555-0106', email: 'lisa.b@company.com' }
  ];

  useEffect(() => {
    loadRosters();
  }, []);

  const loadRosters = () => {
    try {
      const storedRosters = localStorage.getItem(STANDBY_STORAGE_KEY);
      if (storedRosters) {
        setRosters(JSON.parse(storedRosters));
      } else {
        const sampleData = generateSampleRosters();
        setRosters(sampleData);
        saveRosters(sampleData);
      }
    } catch (error) {
      console.error('Error loading rosters:', error);
    }
  };

  const generateSampleRosters = () => {
    const now = new Date();
    return [
      {
        id: 'sb-001',
        title: 'Weekend Emergency Maintenance',
        type: 'Emergency Response',
        department: 'Maintenance',
        primaryContact: 'emp-1',
        secondaryContact: 'emp-2',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3).toISOString(),
        status: 'active',
        location: 'Main Plant',
        notes: 'Coverage for critical equipment failures and emergency repairs',
        responseTime: '30 minutes',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      },
      {
        id: 'sb-002',
        title: 'Night Shift Safety Watch',
        type: 'Safety Watch',
        department: 'Safety',
        primaryContact: 'emp-3',
        secondaryContact: 'emp-1',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString(),
        status: 'active',
        location: 'All Sites',
        notes: '24/7 safety monitoring and incident response',
        responseTime: 'Immediate',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      },
      {
        id: 'sb-003',
        title: 'IT Infrastructure Support',
        type: 'Technical Support',
        department: 'IT',
        primaryContact: 'emp-4',
        secondaryContact: 'emp-5',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9).toISOString(),
        status: 'scheduled',
        location: 'Data Center',
        notes: 'Server and network infrastructure emergency support',
        responseTime: '15 minutes',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      },
      {
        id: 'sb-004',
        title: 'Medical Emergency Coverage',
        type: 'Medical Standby',
        department: 'Medical',
        primaryContact: 'emp-6',
        secondaryContact: 'emp-3',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6).toISOString(),
        status: 'active',
        location: 'Medical Center',
        notes: 'Emergency medical response and first aid',
        responseTime: '5 minutes',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      },
      {
        id: 'sb-005',
        title: 'Operations Control Room',
        type: 'Operations Coverage',
        department: 'Operations',
        primaryContact: 'emp-2',
        secondaryContact: 'emp-1',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).toISOString(),
        status: 'completed',
        location: 'Control Room A',
        notes: '24/7 operations monitoring and coordination',
        responseTime: 'Immediate',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      }
    ];
  };

  const saveRosters = (rostersData) => {
    try {
      localStorage.setItem(STANDBY_STORAGE_KEY, JSON.stringify(rostersData));
    } catch (error) {
      console.error('Error saving rosters:', error);
    }
  };

  const createRoster = (newRoster) => {
    const updatedRosters = [...rosters, { 
      ...newRoster, 
      id: `sb-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
    setRosters(updatedRosters);
    saveRosters(updatedRosters);
  };

  const updateRoster = (rosterId, updates) => {
    const updatedRosters = rosters.map(roster => 
      roster.id === rosterId ? { ...roster, ...updates, updatedAt: new Date().toISOString() } : roster
    );
    setRosters(updatedRosters);
    saveRosters(updatedRosters);
  };

  const deleteRoster = (rosterId) => {
    const updatedRosters = rosters.filter(roster => roster.id !== rosterId);
    setRosters(updatedRosters);
    saveRosters(updatedRosters);
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
      'active': 'bg-green-100 text-green-800 border-green-200',
      'completed': 'bg-slate-100 text-slate-800 border-slate-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.scheduled;
  };

  const getTypeColor = (type) => {
    const colors = {
      'Emergency Response': 'bg-red-100 text-red-800 border-red-200',
      'Technical Support': 'bg-purple-100 text-purple-800 border-purple-200',
      'Safety Watch': 'bg-amber-100 text-amber-800 border-amber-200',
      'Medical Standby': 'bg-green-100 text-green-800 border-green-200',
      'Operations Coverage': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[type] || colors['Technical Support'];
  };

  // Filter rosters
  const filteredRosters = rosters.filter(roster => {
    const matchesSearch = roster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roster.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roster.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(roster.status);
    
    const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(roster.department);
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(roster.type);
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesType;
  });

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedDepartments([]);
    setSelectedTypes([]);
    setSearchTerm("");
  };

  const stats = {
    total: rosters.length,
    active: rosters.filter(r => r.status === 'active').length,
    scheduled: rosters.filter(r => r.status === 'scheduled').length,
    completed: rosters.filter(r => r.status === 'completed').length
  };

  const statusCounts = {
    scheduled: rosters.filter(r => r.status === 'scheduled').length,
    active: rosters.filter(r => r.status === 'active').length,
    completed: rosters.filter(r => r.status === 'completed').length
  };

  const getEmployeeById = (id) => {
    return employees.find(emp => emp.id === id) || { name: 'Unknown', department: 'Unknown', phone: 'N/A', email: 'N/A' };
  };

  const isActive = (roster) => {
    const now = new Date();
    const start = new Date(roster.startDate);
    const end = new Date(roster.endDate);
    return start <= now && end >= now && roster.status === 'active';
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
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-foreground">Standby & Duty Roster</span>
                  <span className="text-xs text-orange-600 font-semibold uppercase tracking-wider hidden sm:inline-block">
                    Shift Management & On-Call
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
              <Link href="/equipment" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Assets
              </Link>
              <Link href="/overtime" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Overtime
              </Link>
              <Link href="/standby" className="text-sm font-semibold text-primary transition-colors">
                Standby
              </Link>
            </nav>

            <Button size="sm" asChild className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800">
              <Link href="/standby/create">
                <Plus className="h-4 w-4 mr-2" />
                New Roster
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
                Standby & Duty Management
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Manage on-call schedules, emergency response teams, and shift coverage
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
              <Button variant="outline" size="sm" onClick={loadRosters}>
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
                    <div className="text-sm text-muted-foreground">Total Rosters</div>
                  </div>
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.active}</div>
                    <div className="text-sm text-muted-foreground">Active Now</div>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                    <UserCheck className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.scheduled}</div>
                    <div className="text-sm text-muted-foreground">Scheduled</div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-slate-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400">
                    <CheckCircle className="h-6 w-6" />
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
                      placeholder="Search rosters by title, department, notes..."
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
                    {(selectedStatus.length > 0 || selectedDepartments.length > 0 || selectedTypes.length > 0) && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                        {selectedStatus.length + selectedDepartments.length + selectedTypes.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Filter Rosters</h3>
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
                        {['scheduled', 'active', 'completed', 'cancelled'].map(status => (
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
                              {status} ({statusCounts[status] || 0})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Department Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Department</label>
                      <div className="space-y-2">
                        {departments.map(dept => (
                          <div key={dept} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`dept-${dept}`}
                              checked={selectedDepartments.includes(dept)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDepartments([...selectedDepartments, dept]);
                                } else {
                                  setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                            />
                            <label htmlFor={`dept-${dept}`} className="ml-2 text-sm text-foreground">
                              {dept}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Roster Type</label>
                      <div className="space-y-2">
                        {rosterTypes.map(type => (
                          <div key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`type-${type}`}
                              checked={selectedTypes.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTypes([...selectedTypes, type]);
                                } else {
                                  setSelectedTypes(selectedTypes.filter(t => t !== type));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                            />
                            <label htmlFor={`type-${type}`} className="ml-2 text-sm text-foreground">
                              {type}
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

          {/* Rosters Display */}
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="all" className="relative">
                  All Rosters
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {filteredRosters.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="active" className="relative">
                  Active
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts.active}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="relative">
                  Scheduled
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts.scheduled}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="relative">
                  Completed
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts.completed}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              {filteredRosters.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Showing {filteredRosters.length} of {rosters.length} rosters
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredRosters.length === 0 && (
              <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 flex items-center justify-center mb-6">
                      <Clock className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                      {rosters.length === 0 ? 'No Standby Rosters Yet' : 'No Rosters Found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {rosters.length === 0 
                        ? 'Get started by creating your first standby roster to manage on-call schedules and emergency coverage.'
                        : 'No rosters match your search criteria. Try adjusting your filters.'
                      }
                    </p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 shadow-md">
                      <Link href="/standby/create">
                        <Plus className="h-5 w-5 mr-2" />
                        Create First Roster
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rosters Grid/List View */}
            {filteredRosters.length > 0 && (
              <TabsContent value="all" className="space-y-4">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRosters.map((roster) => (
                      <StandbyCard 
                        key={roster.id} 
                        roster={roster}
                        employees={employees}
                        onUpdate={updateRoster}
                        onDelete={deleteRoster}
                        getStatusColor={getStatusColor}
                        getTypeColor={getTypeColor}
                        getEmployeeById={getEmployeeById}
                        isActive={isActive}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRosters.map((roster) => (
                      <StandbyListItem 
                        key={roster.id} 
                        roster={roster}
                        employees={employees}
                        onUpdate={updateRoster}
                        onDelete={deleteRoster}
                        getStatusColor={getStatusColor}
                        getTypeColor={getTypeColor}
                        getEmployeeById={getEmployeeById}
                        isActive={isActive}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* Filtered Status Tabs */}
            {['active', 'scheduled', 'completed'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {filteredRosters.filter(roster => roster.status === status).length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredRosters
                        .filter(roster => roster.status === status)
                        .map((roster) => (
                          <StandbyCard 
                            key={roster.id} 
                            roster={roster}
                            employees={employees}
                            onUpdate={updateRoster}
                            onDelete={deleteRoster}
                            getStatusColor={getStatusColor}
                            getTypeColor={getTypeColor}
                            getEmployeeById={getEmployeeById}
                            isActive={isActive}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredRosters
                        .filter(roster => roster.status === status)
                        .map((roster) => (
                          <StandbyListItem 
                            key={roster.id} 
                            roster={roster}
                            employees={employees}
                            onUpdate={updateRoster}
                            onDelete={deleteRoster}
                            getStatusColor={getStatusColor}
                            getTypeColor={getTypeColor}
                            getEmployeeById={getEmployeeById}
                            isActive={isActive}
                          />
                        ))}
                    </div>
                  )
                ) : (
                  <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-12 text-center">
                      <div className="mx-auto max-w-md">
                        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Clock className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          No {status} Rosters
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {status === 'active' 
                            ? 'No rosters are currently active. Check scheduled rosters.'
                            : `No rosters are currently ${status}.`
                          }
                        </p>
                        <Button asChild>
                          <Link href="/standby/create">
                            Create New Roster
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

// Standby Card Component (Grid View)
function StandbyCard({ roster, employees, onUpdate, onDelete, getStatusColor, getTypeColor, getEmployeeById, isActive }) {
  const [showActions, setShowActions] = useState(false);
  
  const primaryContact = getEmployeeById(roster.primaryContact);
  const secondaryContact = getEmployeeById(roster.secondaryContact);
  const currentlyActive = isActive(roster);

  const startDate = new Date(roster.startDate);
  const endDate = new Date(roster.endDate);
  
  const formattedStart = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedEnd = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 ${
      currentlyActive ? 'border-l-green-500' : 'border-l-orange-500'
    } shadow-sm border border-slate-200 dark:border-slate-700`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              currentlyActive ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
            }`}>
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-orange-600 transition-colors">
                {roster.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {roster.department} • {roster.type}
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
              <div className="absolute right-0 top-10 bg-background border border-border rounded-lg shadow-xl z-10 w-40 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3"
                  asChild
                >
                  <Link href={`/standby/edit/${roster.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this roster?')) {
                      onDelete(roster.id);
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
          {roster.notes}
        </p>
        
        {/* Roster Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedStart} - {formattedEnd}</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={`${getStatusColor(roster.status)} border`}>
                {roster.status}
              </Badge>
              <Badge variant="outline" className={`${getTypeColor(roster.type)} border`}>
                {roster.type}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{roster.location}</span>
            </div>
            <div className="text-sm font-medium">
              {roster.responseTime} response
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Primary Contact</span>
              <span>{primaryContact.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Secondary Contact</span>
              <span>{secondaryContact.name}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-2" asChild>
            <Link href={`/standby/view/${roster.id}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
          {currentlyActive && (
            <Button 
              size="sm" 
              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-md"
              asChild
            >
              <Link href={`/standby/contact/${roster.id}`}>
                <Phone className="h-4 w-4" />
                Contact
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Standby List Item Component (List View)
function StandbyListItem({ roster, employees, onUpdate, onDelete, getStatusColor, getTypeColor, getEmployeeById, isActive }) {
  const [showActions, setShowActions] = useState(false);
  
  const primaryContact = getEmployeeById(roster.primaryContact);
  const secondaryContact = getEmployeeById(roster.secondaryContact);
  const currentlyActive = isActive(roster);

  const startDate = new Date(roster.startDate);
  const endDate = new Date(roster.endDate);
  
  const formattedStart = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const formattedEnd = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className={`hover:shadow-md transition-all duration-300 border-l-4 ${
      currentlyActive ? 'border-l-green-500' : 'border-l-orange-500'
    } shadow-sm border border-slate-200 dark:border-slate-700`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className={`p-3 rounded-lg ${
              currentlyActive ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
            }`}>
              <Clock className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {roster.title}
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className={`${getStatusColor(roster.status)} border`}>
                    {roster.status}
                  </Badge>
                  <Badge variant="outline" className={`${getTypeColor(roster.type)} border`}>
                    {roster.type}
                  </Badge>
                  {currentlyActive && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Active Now
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{roster.department}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{roster.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedStart} - {formattedEnd}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{roster.responseTime} response</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-1">
                {roster.notes}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                {primaryContact.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Primary Contact
              </div>
            </div>
            
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href={`/standby/view/${roster.id}`}>
                <Eye className="h-4 w-4" />
                View
              </Link>
            </Button>
            
            {currentlyActive && (
              <Button 
                size="sm" 
                className="gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-md"
                asChild
              >
                <Link href={`/standby/contact/${roster.id}`}>
                  <Phone className="h-4 w-4" />
                  Contact
                </Link>
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
                <div className="absolute right-0 top-10 bg-background border border-border rounded-lg shadow-xl z-10 w-40 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3"
                    asChild
                  >
                    <Link href={`/standby/edit/${roster.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this roster?')) {
                        onDelete(roster.id);
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