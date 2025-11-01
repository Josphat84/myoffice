// app/leave/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar,
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
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LEAVE_STORAGE_KEY = 'leave-requests';

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Leave types
  const leaveTypes = ['vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'unpaid'];

  useEffect(() => {
    loadLeaveData();
  }, []);

  const loadLeaveData = async () => {
    try {
      // Load employees from API
      const employeesResponse = await fetch('/api/employees');
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
      }

      // Load leave requests from localStorage (fallback)
      const storedRequests = localStorage.getItem(LEAVE_STORAGE_KEY);
      if (storedRequests) {
        setLeaveRequests(JSON.parse(storedRequests));
      } else {
        const sampleData = await generateSampleLeaveRequests();
        setLeaveRequests(sampleData);
        saveLeaveRequests(sampleData);
      }
    } catch (error) {
      console.error('Error loading leave data:', error);
    }
  };

  const generateSampleLeaveRequests = async () => {
    const now = new Date();
    return [
      {
        id: 'leave-001',
        employeeId: 'emp-1',
        employeeName: 'Mike Johnson',
        leaveType: 'vacation',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14).toISOString(),
        totalDays: 5,
        reason: 'Family vacation to Hawaii',
        status: 'approved',
        approvedBy: 'manager-1',
        approvedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString()
      },
      {
        id: 'leave-002',
        employeeId: 'emp-2',
        employeeName: 'Sarah Chen',
        leaveType: 'sick',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).toISOString(),
        totalDays: 3,
        reason: 'Flu recovery - doctor recommended rest',
        status: 'approved',
        approvedBy: 'manager-1',
        approvedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      },
      {
        id: 'leave-003',
        employeeId: 'emp-3',
        employeeName: 'David Rodriguez',
        leaveType: 'personal',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21).toISOString(),
        totalDays: 2,
        reason: 'Medical procedure and recovery',
        status: 'pending',
        approvedBy: null,
        approvedAt: null,
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3).toISOString()
      },
      {
        id: 'leave-004',
        employeeId: 'emp-1',
        employeeName: 'Mike Johnson',
        leaveType: 'vacation',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 37).toISOString(),
        totalDays: 6,
        reason: 'Summer break with family',
        status: 'pending',
        approvedBy: null,
        approvedAt: null,
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      },
      {
        id: 'leave-005',
        employeeId: 'emp-4',
        employeeName: 'Emily Watson',
        leaveType: 'maternity',
        startDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth() + 4, 1).toISOString(),
        totalDays: 90,
        reason: 'Maternity leave - expecting baby',
        status: 'approved',
        approvedBy: 'manager-2',
        approvedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10).toISOString(),
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15).toISOString(),
        updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10).toISOString()
      }
    ];
  };

  const saveLeaveRequests = (requests) => {
    try {
      localStorage.setItem(LEAVE_STORAGE_KEY, JSON.stringify(requests));
    } catch (error) {
      console.error('Error saving leave requests:', error);
    }
  };

  const createLeaveRequest = (newRequest) => {
    const updatedRequests = [...leaveRequests, { 
      ...newRequest, 
      id: `leave-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
    setLeaveRequests(updatedRequests);
    saveLeaveRequests(updatedRequests);
  };

  const updateLeaveRequest = (requestId, updates) => {
    const updatedRequests = leaveRequests.map(request => 
      request.id === requestId ? { ...request, ...updates, updatedAt: new Date().toISOString() } : request
    );
    setLeaveRequests(updatedRequests);
    saveLeaveRequests(updatedRequests);
  };

  const deleteLeaveRequest = (requestId) => {
    const updatedRequests = leaveRequests.filter(request => request.id !== requestId);
    setLeaveRequests(updatedRequests);
    saveLeaveRequests(updatedRequests);
  };

  const approveLeaveRequest = (requestId) => {
    updateLeaveRequest(requestId, { 
      status: 'approved',
      approvedBy: 'current-user', // In real app, this would be the actual user
      approvedAt: new Date().toISOString()
    });
  };

  const rejectLeaveRequest = (requestId) => {
    updateLeaveRequest(requestId, { 
      status: 'rejected',
      approvedBy: null,
      approvedAt: null
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'cancelled': 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[status] || colors.pending;
  };

  const getTypeColor = (type) => {
    const colors = {
      'vacation': 'bg-blue-100 text-blue-800 border-blue-200',
      'sick': 'bg-orange-100 text-orange-800 border-orange-200',
      'personal': 'bg-purple-100 text-purple-800 border-purple-200',
      'maternity': 'bg-pink-100 text-pink-800 border-pink-200',
      'paternity': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'bereavement': 'bg-gray-100 text-gray-800 border-gray-200',
      'unpaid': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[type] || colors.vacation;
  };

  // Filter leave requests
  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(request.status);
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(request.leaveType);
    
    const matchesEmployee = selectedEmployees.length === 0 || selectedEmployees.includes(request.employeeId);
    
    return matchesSearch && matchesStatus && matchesType && matchesEmployee;
  });

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedTypes([]);
    setSelectedEmployees([]);
    setSearchTerm("");
  };

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    upcoming: leaveRequests.filter(r => {
      const startDate = new Date(r.startDate);
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.setDate(now.getDate() + 30));
      return startDate > now && startDate <= thirtyDaysFromNow && r.status === 'approved';
    }).length
  };

  const statusCounts = {
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length
  };

  const getEmployeeById = (id) => {
    return employees.find(emp => emp.id === id) || { name: 'Unknown Employee' };
  };

  const isUpcoming = (request) => {
    const startDate = new Date(request.startDate);
    const now = new Date();
    return startDate > now && request.status === 'approved';
  };

  const isCurrent = (request) => {
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    const now = new Date();
    return startDate <= now && endDate >= now && request.status === 'approved';
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-600 to-rose-700 shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-foreground">Leave Tracker</span>
                  <span className="text-xs text-pink-600 font-semibold uppercase tracking-wider hidden sm:inline-block">
                    Vacation & Time Off Management
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
              <Link href="/leave" className="text-sm font-semibold text-primary transition-colors">
                Leave
              </Link>
            </nav>

            <Button size="sm" asChild className="bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800">
              <Link href="/leave/create">
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
                Leave Management
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Track employee time off, approve requests, and manage leave balances
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
              <Button variant="outline" size="sm" onClick={loadLeaveData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-pink-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Requests</div>
                  </div>
                  <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-amber-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
                    <div className="text-sm text-muted-foreground">Pending Approval</div>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.approved}</div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.upcoming}</div>
                    <div className="text-sm text-muted-foreground">Upcoming</div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <TrendingUp className="h-6 w-6" />
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
                      placeholder="Search by employee name or reason..."
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
                    <h3 className="font-semibold text-foreground">Filter Leave Requests</h3>
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
                        {['pending', 'approved', 'rejected'].map(status => (
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
                              className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                            />
                            <label htmlFor={`status-${status}`} className="ml-2 text-sm text-foreground capitalize">
                              {status} ({statusCounts[status] || 0})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Leave Type</label>
                      <div className="space-y-2">
                        {leaveTypes.map(type => (
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
                              className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                            />
                            <label htmlFor={`type-${type}`} className="ml-2 text-sm text-foreground capitalize">
                              {type}
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
                              className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
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

          {/* Leave Requests Display */}
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="all" className="relative">
                  All Requests
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {filteredRequests.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  Pending
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts.pending}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="approved" className="relative">
                  Approved
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts.approved}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="relative">
                  Upcoming
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {stats.upcoming}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              {filteredRequests.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Showing {filteredRequests.length} of {leaveRequests.length} requests
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 && (
              <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 flex items-center justify-center mb-6">
                      <Calendar className="h-12 w-12 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                      {leaveRequests.length === 0 ? 'No Leave Requests Yet' : 'No Requests Found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {leaveRequests.length === 0 
                        ? 'Get started by creating your first leave request to track employee time off and approvals.'
                        : 'No requests match your search criteria. Try adjusting your filters.'
                      }
                    </p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 shadow-md">
                      <Link href="/leave/create">
                        <Plus className="h-5 w-5 mr-2" />
                        Create First Request
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leave Requests Grid/List View */}
            {filteredRequests.length > 0 && (
              <TabsContent value="all" className="space-y-4">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRequests.map((request) => (
                      <LeaveCard 
                        key={request.id} 
                        request={request}
                        onUpdate={updateLeaveRequest}
                        onDelete={deleteLeaveRequest}
                        onApprove={approveLeaveRequest}
                        onReject={rejectLeaveRequest}
                        getStatusColor={getStatusColor}
                        getTypeColor={getTypeColor}
                        isUpcoming={isUpcoming}
                        isCurrent={isCurrent}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <LeaveListItem 
                        key={request.id} 
                        request={request}
                        onUpdate={updateLeaveRequest}
                        onDelete={deleteLeaveRequest}
                        onApprove={approveLeaveRequest}
                        onReject={rejectLeaveRequest}
                        getStatusColor={getStatusColor}
                        getTypeColor={getTypeColor}
                        isUpcoming={isUpcoming}
                        isCurrent={isCurrent}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* Filtered Status Tabs */}
            {['pending', 'approved'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {filteredRequests.filter(request => 
                  status === 'upcoming' ? isUpcoming(request) : request.status === status
                ).length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredRequests
                        .filter(request => 
                          status === 'upcoming' ? isUpcoming(request) : request.status === status
                        )
                        .map((request) => (
                          <LeaveCard 
                            key={request.id} 
                            request={request}
                            onUpdate={updateLeaveRequest}
                            onDelete={deleteLeaveRequest}
                            onApprove={approveLeaveRequest}
                            onReject={rejectLeaveRequest}
                            getStatusColor={getStatusColor}
                            getTypeColor={getTypeColor}
                            isUpcoming={isUpcoming}
                            isCurrent={isCurrent}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredRequests
                        .filter(request => 
                          status === 'upcoming' ? isUpcoming(request) : request.status === status
                        )
                        .map((request) => (
                          <LeaveListItem 
                            key={request.id} 
                            request={request}
                            onUpdate={updateLeaveRequest}
                            onDelete={deleteLeaveRequest}
                            onApprove={approveLeaveRequest}
                            onReject={rejectLeaveRequest}
                            getStatusColor={getStatusColor}
                            getTypeColor={getTypeColor}
                            isUpcoming={isUpcoming}
                            isCurrent={isCurrent}
                          />
                        ))}
                    </div>
                  )
                ) : (
                  <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-12 text-center">
                      <div className="mx-auto max-w-md">
                        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          No {status} Leave Requests
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {status === 'pending' 
                            ? 'No leave requests are pending approval. All caught up!'
                            : `No leave requests are currently ${status}.`
                          }
                        </p>
                        <Button asChild>
                          <Link href="/leave/create">
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

// Leave Card Component (Grid View)
function LeaveCard({ request, onUpdate, onDelete, onApprove, onReject, getStatusColor, getTypeColor, isUpcoming, isCurrent }) {
  const [showActions, setShowActions] = useState(false);
  
  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);
  
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

  const isPending = request.status === 'pending';
  const isApproved = request.status === 'approved';

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 ${
      isCurrent(request) ? 'border-l-green-500' : 
      isUpcoming(request) ? 'border-l-blue-500' : 'border-l-pink-500'
    } shadow-sm border border-slate-200 dark:border-slate-700`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isCurrent(request) ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' :
              isUpcoming(request) ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' :
              'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400'
            }`}>
              <Calendar className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-pink-600 transition-colors">
                {request.employeeName}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                {request.leaveType} • {request.totalDays} days
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
                  <Link href={`/leave/edit/${request.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                {isPending && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => onApprove(request.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onReject(request.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this leave request?')) {
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
          {request.reason}
        </p>
        
        {/* Leave Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedStart} - {formattedEnd}</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={`${getStatusColor(request.status)} border`}>
                {request.status}
              </Badge>
              <Badge variant="outline" className={`${getTypeColor(request.leaveType)} border capitalize`}>
                {request.leaveType}
              </Badge>
            </div>
          </div>
          
          {isCurrent(request) && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span>Currently on leave</span>
            </div>
          )}
          
          {isUpcoming(request) && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4" />
              <span>Upcoming leave</span>
            </div>
          )}

          {request.approvedBy && (
            <div className="text-xs text-muted-foreground">
              Approved by: {request.approvedBy}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-2" asChild>
            <Link href={`/leave/view/${request.id}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
          {isPending && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onApprove(request.id)}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onReject(request.id)}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Leave List Item Component (List View)
function LeaveListItem({ request, onUpdate, onDelete, onApprove, onReject, getStatusColor, getTypeColor, isUpcoming, isCurrent }) {
  const [showActions, setShowActions] = useState(false);
  
  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);
  
  const formattedStart = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const formattedEnd = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isPending = request.status === 'pending';

  return (
    <Card className={`hover:shadow-md transition-all duration-300 border-l-4 ${
      isCurrent(request) ? 'border-l-green-500' : 
      isUpcoming(request) ? 'border-l-blue-500' : 'border-l-pink-500'
    } shadow-sm border border-slate-200 dark:border-slate-700`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className={`p-3 rounded-lg ${
              isCurrent(request) ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' :
              isUpcoming(request) ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' :
              'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400'
            }`}>
              <Calendar className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {request.employeeName}
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className={`${getStatusColor(request.status)} border`}>
                    {request.status}
                  </Badge>
                  <Badge variant="outline" className={`${getTypeColor(request.leaveType)} border capitalize`}>
                    {request.leaveType}
                  </Badge>
                  {isCurrent(request) && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Current
                    </Badge>
                  )}
                  {isUpcoming(request) && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Upcoming
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedStart} - {formattedEnd}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{request.totalDays} days</span>
                </div>
                {request.approvedBy && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Approved by {request.approvedBy}</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-1">
                {request.reason}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href={`/leave/view/${request.id}`}>
                <Eye className="h-4 w-4" />
                View
              </Link>
            </Button>
            
            {isPending && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => onApprove(request.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => onReject(request.id)}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
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
                    <Link href={`/leave/edit/${request.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this leave request?')) {
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