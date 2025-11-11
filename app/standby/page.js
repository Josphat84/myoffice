'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Calendar,
  Clock,
  Users,
  User,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  Building,
  Star,
  Crown,
  Zap,
  Moon,
  Sun,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Target,
  Rocket,
  Shield,
  Battery,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const EmployeeStandbyRoster = () => {
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Sample employee data
  const employees = useMemo(() => [
    {
      id: 1,
      name: 'Sarah Chen',
      position: 'Senior Engineer',
      department: 'Engineering',
      status: 'on-standby',
      skills: ['React', 'Node.js', 'AWS'],
      contact: '+1 (555) 123-4567',
      email: 'sarah.chen@company.com',
      location: 'San Francisco',
      avatar: 'SC',
      efficiency: 95,
      lastActive: '2 hours ago',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      position: 'DevOps Specialist',
      department: 'Operations',
      status: 'active',
      skills: ['Docker', 'Kubernetes', 'CI/CD'],
      contact: '+1 (555) 234-5678',
      email: 'marcus.j@company.com',
      location: 'New York',
      avatar: 'MJ',
      efficiency: 88,
      lastActive: 'Currently active',
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      position: 'Product Manager',
      department: 'Product',
      status: 'on-standby',
      skills: ['Agile', 'UX Research', 'Roadmapping'],
      contact: '+1 (555) 345-6789',
      email: 'elena.rodriguez@company.com',
      location: 'Austin',
      avatar: 'ER',
      efficiency: 92,
      lastActive: '30 minutes ago',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Security Engineer',
      department: 'Security',
      status: 'unavailable',
      skills: ['Cybersecurity', 'Pen Testing', 'Compliance'],
      contact: '+1 (555) 456-7890',
      email: 'david.kim@company.com',
      location: 'Remote',
      avatar: 'DK',
      efficiency: 85,
      lastActive: '8 hours ago',
      color: 'bg-red-500'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      position: 'Data Scientist',
      department: 'Data',
      status: 'on-standby',
      skills: ['Python', 'ML', 'TensorFlow'],
      contact: '+1 (555) 567-8901',
      email: 'lisa.wang@company.com',
      location: 'Boston',
      avatar: 'LW',
      efficiency: 96,
      lastActive: '1 hour ago',
      color: 'bg-pink-500'
    },
    {
      id: 6,
      name: 'James Wilson',
      position: 'Frontend Lead',
      department: 'Engineering',
      status: 'active',
      skills: ['React', 'TypeScript', 'GraphQL'],
      contact: '+1 (555) 678-9012',
      email: 'james.wilson@company.com',
      location: 'Chicago',
      avatar: 'JW',
      efficiency: 90,
      lastActive: 'Currently active',
      color: 'bg-orange-500'
    },
    {
      id: 7,
      name: 'Maria Garcia',
      position: 'UX Designer',
      department: 'Design',
      status: 'on-standby',
      skills: ['Figma', 'Prototyping', 'User Research'],
      contact: '+1 (555) 789-0123',
      email: 'maria.garcia@company.com',
      location: 'Miami',
      avatar: 'MG',
      efficiency: 89,
      lastActive: '45 minutes ago',
      color: 'bg-teal-500'
    },
    {
      id: 8,
      name: 'Alex Thompson',
      position: 'Backend Engineer',
      department: 'Engineering',
      status: 'unavailable',
      skills: ['Java', 'Spring Boot', 'Microservices'],
      contact: '+1 (555) 890-1234',
      email: 'alex.thompson@company.com',
      location: 'Seattle',
      avatar: 'AT',
      efficiency: 87,
      lastActive: '6 hours ago',
      color: 'bg-indigo-500'
    }
  ], []);

  // Departments
  const departments = ['All', 'Engineering', 'Operations', 'Product', 'Security', 'Data', 'Design'];

  // Update current time
  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time display
  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  }, [currentTime]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [currentTime]);

  // Filter employees based on search and department
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = searchQuery === '' || 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchQuery, selectedDepartment]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const onStandby = employees.filter(e => e.status === 'on-standby').length;
    const active = employees.filter(e => e.status === 'active').length;
    const unavailable = employees.filter(e => e.status === 'unavailable').length;
    
    return {
      total,
      onStandby,
      active,
      unavailable,
      standbyRate: Math.round((onStandby / total) * 100)
    };
  }, [employees]);

  // Status configuration
  const statusConfig = {
    'on-standby': { 
      label: 'On Standby', 
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      icon: UserCheck,
      description: 'Available for immediate assignment'
    },
    'active': { 
      label: 'Active', 
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
      icon: Zap,
      description: 'Currently working on tasks'
    },
    'unavailable': { 
      label: 'Unavailable', 
      color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
      icon: UserX,
      description: 'Not available for work'
    }
  };

  // Quick actions
  const quickActions = [
    { 
      icon: Plus, 
      label: 'Add Employee', 
      description: 'Add new team member',
      color: 'from-green-500 to-emerald-600',
      action: () => toast.success('Add employee dialog would open...')
    },
    { 
      icon: Users, 
      label: 'Create Shift', 
      description: 'Schedule new shift',
      color: 'from-blue-500 to-cyan-600',
      action: () => toast.info('Create shift dialog would open...')
    },
    { 
      icon: Calendar, 
      label: 'View Schedule', 
      description: 'Weekly roster view',
      color: 'from-purple-500 to-pink-600',
      action: () => setActiveView('schedule')
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      description: 'Team performance',
      color: 'from-orange-500 to-amber-600',
      action: () => setActiveView('analytics')
    }
  ];

  // Status Indicator Component
  const StatusIndicator = ({ status, size = 'md' }) => {
    const config = {
      'on-standby': { color: 'bg-blue-400', pulse: 'animate-pulse' },
      'active': { color: 'bg-green-400', pulse: '' },
      'unavailable': { color: 'bg-red-400', pulse: '' }
    }[status] || { color: 'bg-gray-400', pulse: '' };

    const sizes = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    };

    return (
      <div className={`rounded-full ${config.color} ${sizes[size]} ${config.pulse}`} />
    );
  };

  // Employee Card Component
  const EmployeeCard = ({ employee }) => {
    const StatusIcon = statusConfig[employee.status].icon;
    
    return (
      <Card className={`group hover:shadow-xl transition-all duration-300 border-l-4 ${
        employee.status === 'on-standby' ? 'border-l-blue-500 hover:border-l-blue-600' :
        employee.status === 'active' ? 'border-l-green-500 hover:border-l-green-600' :
        'border-l-red-500 hover:border-l-red-600'
      } backdrop-blur-sm ${
        darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${employee.color} rounded-full flex items-center justify-center text-white font-semibold text-lg`}>
                {employee.avatar}
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {employee.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {employee.position}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className={statusConfig[employee.status].color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig[employee.status].label}
            </Badge>
          </div>

          <div className="space-y-3">
            {/* Department & Location */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Building className="w-4 h-4" />
                  {employee.department}
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {employee.location}
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                <Star className="w-4 h-4 text-yellow-500" />
                {employee.efficiency}%
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1">
              {employee.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700">
                  {skill}
                </Badge>
              ))}
              {employee.skills.length > 3 && (
                <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700">
                  +{employee.skills.length - 3} more
                </Badge>
              )}
            </div>

            {/* Contact & Status */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Call {employee.contact}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Email {employee.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">Last active</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {employee.lastActive}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {employee.status === 'on-standby' && (
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Assign Task
                </Button>
              )}
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Metric Card Component
  const MetricCard = ({ title, value, subtitle, trend, change, icon: Icon, color = 'blue' }) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-600',
      green: 'from-green-500 to-emerald-600',
      purple: 'from-purple-500 to-pink-600',
      orange: 'from-orange-500 to-amber-600'
    };

    const trendIcons = {
      up: <TrendingUp className="w-4 h-4 text-green-500" />,
      down: <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />,
      stable: <Activity className="w-4 h-4 text-blue-500" />
    };

    return (
      <Card className={`bg-gradient-to-br ${colors[color]} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white/90">{title}</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <CardDescription className="text-white/70 text-sm">{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-bold">{value}</div>
              {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-green-300' : change < 0 ? 'text-red-300' : 'text-blue-300'}`}>
                  {trendIcons[trend]}
                  <span>{change > 0 ? '+' : ''}{change}%</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Roster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 text-slate-900'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Standby Roster
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Real-time team availability and management
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Display */}
              <div className="text-right">
                <div className="text-2xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formattedTime}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{formattedDate}</div>
              </div>

              {/* Theme Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDarkMode(!darkMode)}
                      className={`rounded-full ${
                        darkMode ? 'border-slate-600 hover:border-slate-500' : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {darkMode ? 'Light mode' : 'Dark mode'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Team"
              value={stats.total}
              subtitle="Team members"
              trend="up"
              change={2}
              icon={Users}
              color="blue"
            />
            <MetricCard
              title="On Standby"
              value={stats.onStandby}
              subtitle="Available now"
              trend="stable"
              change={0}
              icon={UserCheck}
              color="green"
            />
            <MetricCard
              title="Active"
              value={stats.active}
              subtitle="Currently working"
              trend="up"
              change={1}
              icon={Zap}
              color="purple"
            />
            <MetricCard
              title="Standby Rate"
              value={`${stats.standbyRate}%`}
              subtitle="Availability score"
              trend="up"
              change={5}
              icon={Target}
              color="orange"
            />
          </div>

          {/* Main Dashboard Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Quick Actions & Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <Card className={`backdrop-blur-sm ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`w-full justify-start p-4 h-auto bg-gradient-to-r ${action.color} text-white border-0 hover:shadow-lg transition-all duration-300 group hover:scale-105`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                          <action.icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{action.label}</div>
                          <div className="text-xs opacity-90">{action.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className={`backdrop-blur-sm ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Filter className="w-5 h-5 text-blue-500" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search Team
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10 ${darkMode ? 'bg-slate-700 border-slate-600' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Department Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Department
                    </label>
                    <div className="space-y-2">
                      {departments.map(dept => (
                        <Button
                          key={dept}
                          variant={selectedDepartment === dept.toLowerCase() ? "default" : "outline"}
                          onClick={() => setSelectedDepartment(dept.toLowerCase())}
                          className="w-full justify-start"
                        >
                          <Building className="w-4 h-4 mr-2" />
                          {dept}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Status Summary */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <StatusIndicator status="on-standby" />
                          <span>On Standby</span>
                        </div>
                        <Badge variant="secondary">{stats.onStandby}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <StatusIndicator status="active" />
                          <span>Active</span>
                        </div>
                        <Badge variant="secondary">{stats.active}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <StatusIndicator status="unavailable" />
                          <span>Unavailable</span>
                        </div>
                        <Badge variant="secondary">{stats.unavailable}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Employee Roster */}
            <div className="lg:col-span-3">
              {/* Roster Header */}
              <Card className={`backdrop-blur-sm mb-6 ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Team Roster
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {filteredEmployees.length} team members found
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">
                        Updated: {formattedTime}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employee Grid */}
              {filteredEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredEmployees.map(employee => (
                    <EmployeeCard key={employee.id} employee={employee} />
                  ))}
                </div>
              ) : (
                <Card className={`backdrop-blur-sm ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/70 border-slate-200'}`}>
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No team members found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Try adjusting your search criteria or filters.
                    </p>
                    <Button onClick={() => { setSearchQuery(''); setSelectedDepartment('all'); }}>
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StatusIndicator status="on-standby" size="sm" />
                <span>{stats.onStandby} team members on standby</span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <span>Last updated: {formattedTime}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>v2.1.4</span>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <span>© 2024 Team Roster</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EmployeeStandbyRoster;