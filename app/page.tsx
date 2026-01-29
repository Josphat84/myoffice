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
  ChevronRight,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

// Simple Auth Form Component (since your AuthForm doesn't accept onSuccess prop)
function SimpleAuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: 1,
        email,
        name: mode === 'signup' ? name : email.split('@')[0],
        role: 'user'
      };

      localStorage.setItem('token', 'demo_token');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setLoading(false);
      window.location.reload();
    }, 1000);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-indigo-600 mb-4">
          <Shield className="h-6 w-6 md:h-8 md:w-8 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          {mode === 'login' 
            ? 'Sign in to continue' 
            : 'Start using MyOffice today'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm md:text-base"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm md:text-base"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm md:text-base"
            required
          />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm md:text-base"
              required
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 md:py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
              {mode === 'login' ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : (
            mode === 'login' ? 'Sign In' : 'Create Account'
          )}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </form>
    </div>
  );
}

// Mobile Navigation Component
function MobileNav({ isLoggedIn, onLogout, user }: { isLoggedIn: boolean; onLogout: () => void; user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/employees", label: "Personnel", icon: Users },
    { href: "/equipment", label: "Assets", icon: ToolCase },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/overtime", label: "Overtime", icon: Calculator },
    { href: "/leave", label: "Leave", icon: CalendarDays },
    { href: "/ppe", label: "PPE", icon: Shield },
    { href: "/maintenance", label: "Maintenance", icon: ClipboardCheck },
    { href: "/standby", label: "Standby", icon: Clock },
    { href: "/breakdowns", label: "Breakdowns", icon: AlertTriangle },
    { href: "/spares", label: "Spares", icon: Package },
    { href: "/compressors", label: "Compressors", icon: Fan },
    { href: "/timesheets", label: "Timesheets", icon: ClockIcon },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/visualization", label: "Visualization", icon: Eye },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/noticeboard", label: "Notice Board", icon: MessageSquare },
  ];

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex flex-col h-full">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {isLoggedIn ? (user?.name?.charAt(0) || 'U') : 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {isLoggedIn ? (user?.name || 'User') : 'MyOffice'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {isLoggedIn ? (user?.email || '') : 'Management System'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <link.icon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto p-4 border-t">
                {isLoggedIn ? (
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
      title: "Personnel", 
      description: "Manage employee profiles and team coordination.", 
      color: "indigo", 
      checks: ["Employee Profiles", "Department Structure", "Contact Management"],
      link: "/employees",
      buttonText: "Manage",
      featured: true
    },
    { 
      icon: ToolCase, 
      title: "Assets", 
      description: "Track equipment lifecycle and maintenance schedules.", 
      color: "cyan", 
      checks: ["Equipment Tracking", "Maintenance History", "Utilization"],
      link: "/equipment",
      buttonText: "View",
      featured: true
    },
    
    // Operations
    { 
      icon: Package, 
      title: "Inventory", 
      description: "Manage inventory with automated reordering.", 
      color: "green", 
      checks: ["Stock Levels", "Reorder Points", "Supplier Management"],
      link: "/inventory",
      buttonText: "Manage"
    },
    { 
      icon: Clock, 
      title: "Standby", 
      description: "Manage on-call schedules and shift coverage.", 
      color: "orange", 
      checks: ["Shift Scheduling", "Contact Lists", "Emergency Response"],
      link: "/standby",
      buttonText: "Schedule"
    },
    { 
      icon: Calculator, 
      title: "Overtime", 
      description: "Track and manage overtime requests.", 
      color: "purple", 
      checks: ["Request Approval", "Payroll Integration"],
      link: "/overtime",
      buttonText: "Manage"
    },
    
    // Maintenance
    { 
      icon: ClipboardCheck, 
      title: "Maintenance", 
      description: "Comprehensive maintenance management system.", 
      color: "orange", 
      checks: ["Work Orders", "Preventive Maintenance", "Technician Assignment"],
      link: "/maintenance",
      buttonText: "Track"
    },
    { 
      icon: AlertTriangle, 
      title: "Breakdowns", 
      description: "Track equipment breakdowns and response times.", 
      color: "red", 
      checks: ["Incident Reports", "Response Time", "Root Cause"],
      link: "/breakdowns",
      buttonText: "Monitor"
    },
    { 
      icon: Package, 
      title: "Spares", 
      description: "Manage spare parts inventory and stock levels.", 
      color: "green", 
      checks: ["Parts Catalog", "Usage Analytics", "Vendor Management"],
      link: "/spares",
      buttonText: "Manage"
    },
    { 
      icon: Fan, 
      title: "Compressors", 
      description: "Monitor compressor performance and maintenance.", 
      color: "cyan", 
      checks: ["Performance Data", "Energy Usage", "Maintenance Logs"],
      link: "/compressors",
      buttonText: "Monitor"
    },
    
    // Time & Leave
    { 
      icon: CalendarDays, 
      title: "Leave", 
      description: "Track employee time off and approval workflows.", 
      color: "pink", 
      checks: ["Leave Requests", "Balance Tracking", "Calendar View"],
      link: "/leave",
      buttonText: "Manage"
    },
    { 
      icon: ClockIcon, 
      title: "Timesheets", 
      description: "Comprehensive time tracking with project allocation.", 
      color: "purple", 
      checks: ["Time Tracking", "Project Allocation", "Payroll Export"],
      link: "/timesheets",
      buttonText: "Track"
    },
    
    // Safety & Compliance
    { 
      icon: Shield, 
      title: "PPE", 
      description: "Track protective equipment and safety compliance.", 
      color: "blue", 
      checks: ["Equipment Assignment", "Expiry Tracking", "Safety Compliance"],
      link: "/ppe",
      buttonText: "Manage"
    },
    
    // Analytics & Visualization
    { 
      icon: Eye, 
      title: "Visualization", 
      description: "Interactive dashboards with operational insights.", 
      color: "indigo", 
      checks: ["Real-time Dashboards", "Custom Reports", "KPI Tracking"],
      link: "/visualization",
      buttonText: "Explore",
      featured: true
    },
    { 
      icon: BarChart3, 
      title: "Reports", 
      description: "Generate reports and export operational data.", 
      color: "green", 
      checks: ["Custom Reports", "Data Export", "Analytics"],
      link: "/reports",
      buttonText: "Generate"
    },
    { 
      icon: FileText, 
      title: "Documents", 
      description: "Centralized document management system.", 
      color: "blue", 
      checks: ["Secure Storage", "Version Control", "Access Management"],
      link: "/documents",
      buttonText: "Access"
    },
    { 
      icon: MessageSquare, 
      title: "Notice Board", 
      description: "Share important announcements and updates.", 
      color: "green", 
      checks: ["Announcements", "Priority Alerts", "Archive"],
      link: "/noticeboard",
      buttonText: "View"
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
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 hidden sm:inline">MyOffice</span>
              <span className="text-lg font-bold text-gray-900 sm:hidden">MO</span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-4">
              <Link 
                href="/" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2"
              >
                Home
              </Link>
              
              {/* Core Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2">
                  Core
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-white rounded-lg shadow-lg border p-2">
                  {coreModules.slice(0, 4).map((module) => (
                    <Link
                      key={module.link}
                      href={module.link}
                      className="flex items-center gap-2 p-2 text-sm hover:bg-gray-50 rounded"
                    >
                      <module.icon className="h-4 w-4 text-gray-500" />
                      {module.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Operations Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2">
                  Operations
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-white rounded-lg shadow-lg border p-2">
                  {operationsModules.slice(0, 4).map((module) => (
                    <Link
                      key={module.link}
                      href={module.link}
                      className="flex items-center gap-2 p-2 text-sm hover:bg-gray-50 rounded"
                    >
                      <module.icon className="h-4 w-4 text-gray-500" />
                      {module.title}
                    </Link>
                  ))}
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
                    <div className="hidden xl:block">
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
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
        {/* Hero Section - Mobile Optimized */}
        <section className="py-8 md:py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  <span className="block">Complete Office</span>
                  <span className="block text-indigo-600">Management System</span>
                </h1>
                
                <p className="text-base sm:text-lg text-gray-600">
                  Manage personnel, assets, operations, and analytics in one integrated platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {isLoggedIn ? (
                    <>
                      <Button asChild size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/dashboard">
                          Dashboard
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
              <div className="relative mt-8 lg:mt-0">
                {!isLoggedIn ? (
                  <SimpleAuthForm />
                ) : (
                  <Card className="bg-white border shadow-lg">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                          <Shield className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Welcome to MyOffice</h3>
                        <p className="text-gray-600 mt-2 text-sm">Access all modules from your dashboard</p>
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

        {/* Featured Modules - Mobile Responsive */}
        <section className="py-8 md:py-12 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Core Modules
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Essential tools for managing your office operations
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredModules.map((module, index) => {
                const colors = getColorClasses(module.color);
                return (
                  <Card key={index} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`p-2 sm:p-3 rounded-lg ${colors.light} flex-shrink-0`}>
                          <module.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 truncate">
                            {module.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                            {module.description}
                          </p>
                          
                          <Button asChild variant="outline" size="sm" className="w-full text-xs sm:text-sm">
                            <Link href={module.link}>
                              {module.buttonText}
                              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
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

        {/* All Modules Tabs - Mobile Responsive */}
        <section className="py-8 md:py-12 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                All Modules
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Explore all available modules for comprehensive office management
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 mb-6">
                <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                <TabsTrigger value="core" className="text-xs sm:text-sm">Core</TabsTrigger>
                <TabsTrigger value="operations" className="text-xs sm:text-sm">Operations</TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allModules.map((module, index) => {
                    const colors = getColorClasses(module.color);
                    return (
                      <Card key={index} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${colors.light} flex-shrink-0`}>
                              <module.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${colors.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm truncate">
                                {module.title}
                              </h3>
                              <p className="text-gray-600 text-xs line-clamp-1 mt-1">
                                {module.description}
                              </p>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="flex-shrink-0">
                              <Link href={module.link}>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="core" className="mt-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coreModules.map((module, index) => {
                    const colors = getColorClasses(module.color);
                    return (
                      <Card key={index} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${colors.light}`}>
                              <module.icon className={`h-4 w-4 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-sm">
                                {module.title}
                              </h3>
                            </div>
                            <Button asChild size="sm" className={`${colors.bg} ${colors.hover}`}>
                              <Link href={module.link}>
                                Open
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="operations" className="mt-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {operationsModules.map((module, index) => {
                    const colors = getColorClasses(module.color);
                    return (
                      <Card key={index} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${colors.light}`}>
                              <module.icon className={`h-4 w-4 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-sm">
                                {module.title}
                              </h3>
                            </div>
                            <Button asChild size="sm" className={`${colors.bg} ${colors.hover}`}>
                              <Link href={module.link}>
                                Open
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyticsModules.map((module, index) => {
                    const colors = getColorClasses(module.color);
                    return (
                      <Card key={index} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${colors.light}`}>
                              <module.icon className={`h-4 w-4 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-sm">
                                {module.title}
                              </h3>
                            </div>
                            <Button asChild size="sm" className={`${colors.bg} ${colors.hover}`}>
                              <Link href={module.link}>
                                Open
                              </Link>
                            </Button>
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

        {/* CTA Section - Mobile Responsive */}
        <section className="py-8 md:py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <Card className="border bg-indigo-50">
              <CardContent className="p-6 md:p-8 lg:p-12 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Ready to Manage Your Office?
                </h2>
                
                <p className="text-gray-600 text-sm sm:text-base mb-6 md:mb-8">
                  Start using MyOffice today to streamline all your office management needs
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {isLoggedIn ? (
                    <>
                      <Button asChild size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/dashboard">
                          Dashboard
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/employees">
                          Personnel
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

      {/* Footer - Mobile Responsive */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-indigo-400" />
                <span className="text-lg md:text-xl font-bold text-white">MyOffice</span>
              </div>
              <p className="text-gray-400 text-xs md:text-sm">
                Complete office management platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm md:text-base">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-xs md:text-sm text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/modules" className="text-xs md:text-sm text-gray-400 hover:text-white">Modules</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm md:text-base">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/support" className="text-xs md:text-sm text-gray-400 hover:text-white">Support</Link></li>
                <li><Link href="/contact" className="text-xs md:text-sm text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm md:text-base">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-xs md:text-sm text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-xs md:text-sm text-gray-400 hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6 md:my-8 bg-gray-800" />
          
          <div className="text-center">
            <p className="text-xs md:text-sm text-gray-500">
              © {new Date().getFullYear()} MyOffice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}