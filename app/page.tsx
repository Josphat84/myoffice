// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  Users, 
  ToolCase, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  LogIn,
  UserPlus,
  Clock,
  Calculator,
  Package,
  ClipboardCheck,
  CalendarDays,
  AlertTriangle,
  Clock as ClockIcon,
  Fan,
  Eye,
  ChevronDown,
  Mail,
  Phone,
  BarChart3,
  FileText,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AuthForm from "@/components/AuthForm";

type ColorType = 'indigo' | 'cyan' | 'green' | 'amber' | 'blue' | 'purple' | 'orange' | 'pink' | 'red';

interface ModuleItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: ColorType;
  checks: string[];
  link: string;
  buttonText: string;
  featured?: boolean;
}

// Mobile Navigation Component
function MobileNav({ isLoggedIn, onLogout, user }: { isLoggedIn: boolean; onLogout: () => void; user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const navCategories = [
    {
      name: "Core Management",
      links: [
        { href: "/employees", label: "Personnel", icon: Users },
        { href: "/equipment", label: "Assets", icon: ToolCase },
        { href: "/inventory", label: "Inventory", icon: Package },
        { href: "/overtime", label: "Overtime", icon: Calculator },
        { href: "/leave", label: "Leave", icon: CalendarDays },
        { href: "/ppe", label: "PPE", icon: Shield },
      ]
    },
    {
      name: "Operations",
      links: [
        { href: "/maintenance", label: "Maintenance", icon: ClipboardCheck },
        { href: "/standby", label: "Standby", icon: Clock },
        { href: "/breakdowns", label: "Breakdowns", icon: AlertTriangle },
        { href: "/spares", label: "Spares", icon: Package },
        { href: "/compressors", label: "Compressors", icon: Fan },
      ]
    },
    {
      name: "Analytics & Reports",
      links: [
        { href: "/timesheets", label: "Timesheets", icon: ClockIcon },
        { href: "/reports", label: "Reports", icon: BarChart3 },
        { href: "/visualization", label: "Visualization", icon: Eye },
        { href: "/documents", label: "Documents", icon: FileText },
        { href: "/noticeboard", label: "Notice Board", icon: MessageSquare },
      ]
    }
  ];

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {navCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider text-gray-500">
                      {category.name}
                    </h3>
                    <div className="space-y-1">
                      {category.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <link.icon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t bg-gray-50">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Avatar>
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Navigation Link Component
function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
    >
      <Icon className="h-4 w-4 text-gray-500" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{label}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </Link>
  );
}

// Helper function for colors
function getColorClasses(color: ColorType) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-600',
      hover: 'hover:bg-indigo-700',
      light: 'bg-indigo-50',
      text: 'text-indigo-600',
    },
    cyan: {
      bg: 'bg-cyan-600',
      hover: 'hover:bg-cyan-700',
      light: 'bg-cyan-50',
      text: 'text-cyan-600',
    },
    green: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      light: 'bg-green-50',
      text: 'text-green-600',
    },
    amber: {
      bg: 'bg-amber-600',
      hover: 'hover:bg-amber-700',
      light: 'bg-amber-50',
      text: 'text-amber-600',
    },
    blue: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      light: 'bg-blue-50',
      text: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      light: 'bg-purple-50',
      text: 'text-purple-600',
    },
    orange: {
      bg: 'bg-orange-600',
      hover: 'hover:bg-orange-700',
      light: 'bg-orange-50',
      text: 'text-orange-600',
    },
    pink: {
      bg: 'bg-pink-600',
      hover: 'hover:bg-pink-700',
      light: 'bg-pink-50',
      text: 'text-pink-600',
    },
    red: {
      bg: 'bg-red-600',
      hover: 'hover:bg-red-700',
      light: 'bg-red-50',
      text: 'text-red-600',
    },
  };
  return colorMap[color] || colorMap.indigo;
}

// Main Page Component
export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  // All modules organized by category
  const allModules: ModuleItem[] = [
    // Core Management
    { 
      icon: Users, 
      title: "Personnel Management", 
      description: "Manage employee profiles, department structure, and team coordination.", 
      color: "indigo", 
      checks: ["Employee Profiles", "Department Hierarchy", "Contact Management"],
      link: "/employees",
      buttonText: "Manage Team",
      featured: true
    },
    { 
      icon: ToolCase, 
      title: "Asset Management", 
      description: "Track equipment lifecycle, maintenance schedules, and utilization.", 
      color: "cyan", 
      checks: ["Equipment Tracking", "Maintenance History", "Utilization Analytics"],
      link: "/equipment",
      buttonText: "View Assets",
      featured: true
    },
    
    // Operations
    { 
      icon: Package, 
      title: "Inventory & Spares", 
      description: "Manage inventory with automated reordering and stock optimization.", 
      color: "green", 
      checks: ["Stock Levels", "Reorder Points", "Supplier Management"],
      link: "/inventory",
      buttonText: "Manage Inventory"
    },
    { 
      icon: Clock, 
      title: "Standby Roster", 
      description: "Manage on-call schedules, emergency response teams, and shift coverage.", 
      color: "orange", 
      checks: ["Shift Scheduling", "Contact Lists", "Emergency Response"],
      link: "/standby",
      buttonText: "Schedule Standby"
    },
    { 
      icon: Calculator, 
      title: "Overtime Management", 
      description: "Track, approve, and manage overtime requests.", 
      color: "purple", 
      checks: ["Request Approval", "Payroll Integration", "Compliance Tracking"],
      link: "/overtime",
      buttonText: "Manage Overtime"
    },
    
    // Maintenance
    { 
      icon: ClipboardCheck, 
      title: "Maintenance System", 
      description: "Comprehensive maintenance management with work order tracking.", 
      color: "orange", 
      checks: ["Work Orders", "Preventive Maintenance", "Technician Assignment"],
      link: "/maintenance",
      buttonText: "Track Maintenance"
    },
    { 
      icon: AlertTriangle, 
      title: "Breakdown Management", 
      description: "Track equipment breakdowns, response times, and root cause analysis.", 
      color: "red", 
      checks: ["Incident Reports", "Response Time", "Root Cause Analysis"],
      link: "/breakdowns",
      buttonText: "Monitor Breakdowns"
    },
    { 
      icon: Package, 
      title: "Spares Management", 
      description: "Manage spare parts inventory and optimize stocking levels.", 
      color: "green", 
      checks: ["Parts Catalog", "Usage Analytics", "Vendor Management"],
      link: "/spares",
      buttonText: "Manage Spares"
    },
    { 
      icon: Fan, 
      title: "Compressor Monitoring", 
      description: "Monitor compressor performance and maintenance needs.", 
      color: "cyan", 
      checks: ["Performance Data", "Energy Usage", "Maintenance Logs"],
      link: "/compressors",
      buttonText: "Monitor Compressors"
    },
    
    // Time & Leave
    { 
      icon: CalendarDays, 
      title: "Leave Management", 
      description: "Track employee time off with automated approval workflows.", 
      color: "pink", 
      checks: ["Leave Requests", "Balance Tracking", "Calendar View"],
      link: "/leaves",
      buttonText: "Manage Leave"
    },
    { 
      icon: ClockIcon, 
      title: "Timesheet System", 
      description: "Comprehensive time tracking with project allocation.", 
      color: "purple", 
      checks: ["Time Tracking", "Project Allocation", "Payroll Export"],
      link: "/timesheets",
      buttonText: "Track Time"
    },
    
    // Safety & Compliance
    { 
      icon: Shield, 
      title: "PPE Management", 
      description: "Track protective equipment allocations and ensure safety compliance.", 
      color: "blue", 
      checks: ["Equipment Assignment", "Expiry Tracking", "Safety Compliance"],
      link: "/ppe",
      buttonText: "Manage PPE"
    },
    
    // Analytics & Visualization
    { 
      icon: Eye, 
      title: "Visualization Dashboards", 
      description: "Interactive dashboards with operational insights and analytics.", 
      color: "indigo", 
      checks: ["Real-time Dashboards", "Custom Reports", "KPI Tracking"],
      link: "/visualization",
      buttonText: "Explore Dashboards",
      featured: true
    },
    { 
      icon: BarChart3, 
      title: "Reports & Analytics", 
      description: "Generate reports and export operational data for analysis.", 
      color: "green", 
      checks: ["Custom Reports", "Data Export", "Advanced Analytics"],
      link: "/reports",
      buttonText: "Generate Reports"
    },
    { 
      icon: FileText, 
      title: "Document Management", 
      description: "Centralized document management with version control.", 
      color: "blue", 
      checks: ["Secure Storage", "Version Control", "Access Management"],
      link: "/documents",
      buttonText: "Access Documents"
    },
    { 
      icon: MessageSquare, 
      title: "Notice Board", 
      description: "Share important announcements and company updates.", 
      color: "green", 
      checks: ["Announcements", "Priority Alerts", "Archive Management"],
      link: "/noticeboard",
      buttonText: "View Notices"
    },
  ];

  const featuredModules = allModules.filter(module => module.featured);
  const coreModules = allModules.filter(module => ['Personnel', 'Asset', 'Inventory', 'Overtime'].some(keyword => 
    module.title.includes(keyword)
  ));
  const operationsModules = allModules.filter(module => ['Maintenance', 'Breakdown', 'Spares', 'Compressor'].some(keyword => 
    module.title.includes(keyword)
  ));
  const analyticsModules = allModules.filter(module => ['Visualization', 'Reports', 'Document', 'Notice'].some(keyword => 
    module.title.includes(keyword)
  ));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MyOffice</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4">
              <Link 
                href="/" 
                className="text-sm font-semibold text-indigo-600"
              >
                Home
              </Link>
              
              {/* Core Management Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2">
                  Core Management
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 hidden group-hover:block">
                  <div className="w-64 bg-white rounded-lg shadow-lg border p-4">
                    <div className="space-y-2">
                      {coreModules.slice(0, 4).map((module) => (
                        <NavLink key={module.title} href={module.link} icon={module.icon} label={module.title} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2">
                  Operations
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 hidden group-hover:block">
                  <div className="w-64 bg-white rounded-lg shadow-lg border p-4">
                    <div className="space-y-2">
                      {operationsModules.slice(0, 4).map((module) => (
                        <NavLink key={module.title} href={module.link} icon={module.icon} label={module.title} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2">
                  Analytics
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 hidden group-hover:block">
                  <div className="w-64 bg-white rounded-lg shadow-lg border p-4">
                    <div className="space-y-2">
                      {analyticsModules.slice(0, 4).map((module) => (
                        <NavLink key={module.title} href={module.link} icon={module.icon} label={module.title} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timesheets Link */}
              <Link 
                href="/timesheets" 
                className="text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2"
              >
                Timesheets
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <div className="hidden lg:flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/signup">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
              
              {/* Mobile Navigation */}
              <MobileNav isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  <span className="block">Complete Office</span>
                  <span className="block text-indigo-600">Management System</span>
                </h1>
                
                <p className="text-lg text-gray-600 max-w-xl">
                  Manage personnel, assets, operations, and analytics in one integrated platform designed for modern offices.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {isLoggedIn ? (
                    <>
                      <Button asChild size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/dashboard">
                          Go to Dashboard
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/employees">
                          Manage Personnel
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/signup">
                          Get Started
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/login">
                          Sign In
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Content - Auth Form or Welcome */}
              <div className="relative">
                {!isLoggedIn ? (
                  <AuthForm onSuccess={handleAuthSuccess} />
                ) : (
                  <Card className="bg-white border shadow-lg">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                          <Shield className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Welcome to MyOffice</h3>
                        <p className="text-gray-600 mt-2">Access all modules from your dashboard</p>
                      </div>
                      
                      <Button asChild className="w-full" size="lg">
                        <Link href="/dashboard">
                          Go to Dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Modules */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Complete Management Platform
              </h2>
              <p className="text-gray-600">
                All the tools you need to manage your office operations efficiently
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredModules.map((module, index) => {
                const colors = getColorClasses(module.color);
                return (
                  <Card key={index} className="border hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${colors.light}`}>
                          <module.icon className={`h-6 w-6 ${colors.text}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{module.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                          
                          <div className="space-y-2 mb-6">
                            {module.checks.slice(0, 2).map((check, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-gray-700">{check}</span>
                              </div>
                            ))}
                          </div>
                          
                          <Button asChild variant="outline" className="w-full">
                            <Link href={module.link}>
                              {module.buttonText}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Modules Tabs */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                All Modules
              </h2>
              <p className="text-gray-600">
                Explore all available modules for comprehensive office management
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-4 mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="core">Core</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</Tabs></TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allModules.map((module, index) => {
                    const colors = getColorClasses(module.color);
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-lg ${colors.light}`}>
                              <module.icon className={`h-6 w-6 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-2">{module.title}</h3>
                              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                              <Button asChild variant="ghost" size="sm">
                                <Link href={module.link}>
                                  Access
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="core" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coreModules.map((module, index) => {
                    const colors = getColorClasses(module.color);
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-lg ${colors.light}`}>
                              <module.icon className={`h-6 w-6 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-2">{module.title}</h3>
                              <Button asChild className={`${colors.bg} ${colors.hover} mt-4`}>
                                <Link href={module.link}>
                                  {module.buttonText}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="operations" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {operationsModules.map((module, index) => {
                    const colors = getColorClasses(module.color);
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-lg ${colors.light}`}>
                              <module.icon className={`h-6 w-6 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-2">{module.title}</h3>
                              <Button asChild className={`${colors.bg} ${colors.hover} mt-4`}>
                                <Link href={module.link}>
                                  {module.buttonText}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analyticsModules.map((module, index) => {
                    const colors = getColorClasses(module.color);
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-lg ${colors.light}`}>
                              <module.icon className={`h-6 w-6 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-2">{module.title}</h3>
                              <Button asChild className={`${colors.bg} ${colors.hover} mt-4`}>
                                <Link href={module.link}>
                                  {module.buttonText}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border bg-indigo-50">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Ready to Manage Your Office?
                </h2>
                
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  Start using MyOffice today to streamline all your office management needs
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isLoggedIn ? (
                    <>
                      <Button asChild size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/dashboard">
                          Go to Dashboard
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/employees">
                          Manage Personnel
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/signup">
                          Get Started
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/login">
                          Sign In
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold text-white">MyOffice</span>
              </div>
              <p className="text-gray-400 text-sm">
                Complete office management platform for modern businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-sm text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/modules" className="text-sm text-gray-400 hover:text-white">Modules</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/documentation" className="text-sm text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/support" className="text-sm text-gray-400 hover:text-white">Support</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} MyOffice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}