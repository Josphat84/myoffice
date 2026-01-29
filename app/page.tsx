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
  BarChart3,
  FileText,
  MessageSquare,
  FileCheck,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ColorType = 'indigo' | 'cyan' | 'green' | 'amber' | 'blue' | 'purple' | 'orange' | 'pink' | 'red';

interface ModuleItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: ColorType;
  link: string;
}

// Auth Form Component (Dialog version)
function AuthForm() {
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
    <div className="bg-white p-6 rounded-lg">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
              required
            />
          </div>
        )}

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
        </div>

        {mode === 'signup' && (
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
              required
            />
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-50 text-red-700 rounded text-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-2" />
              {mode === 'login' ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : (
            mode === 'login' ? 'Sign In' : 'Sign Up'
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs text-indigo-600 hover:underline"
          >
            {mode === 'login' 
              ? "Need an account? Sign up" 
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
    { href: "/sheq", label: "SHEQ", icon: FileCheck },
  ];

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded text-gray-600 hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-lg overflow-y-auto">
            <div className="flex flex-col h-full">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-600 text-white text-sm">
                      {isLoggedIn ? (user?.name?.charAt(0) || 'U') : 'MO'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {isLoggedIn ? (user?.name || 'User') : 'MyOffice'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 p-2 text-sm hover:bg-gray-50 rounded"
                    >
                      <link.icon className="h-4 w-4 text-gray-500" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto p-4 border-t">
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm">
                        <LogIn className="h-3 w-3 mr-2" />
                        Sign In / Sign Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="text-sm">MyOffice Access</DialogTitle>
                      </DialogHeader>
                      <AuthForm />
                    </DialogContent>
                  </Dialog>
                  
                  {isLoggedIn && (
                    <Button 
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      variant="outline"
                      className="w-full text-sm"
                    >
                      Sign Out
                    </Button>
                  )}
                </div>
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

// Small Module Card Component
function ModuleCard({ module }: { module: ModuleItem }) {
  const colors = getColorClasses(module.color);

  return (
    <Link href={module.link} className="block">
      <Card className="hover:shadow transition-all duration-200 border h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${colors.light} flex-shrink-0`}>
              <module.icon className={`h-4 w-4 ${colors.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                {module.title}
              </h3>
              <p className="text-gray-600 text-xs line-clamp-2">
                {module.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Main Page Component
export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
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
      description: "Employee profiles and team management", 
      color: "indigo", 
      link: "/employees"
    },
    { 
      icon: ToolCase, 
      title: "Assets", 
      description: "Equipment tracking and maintenance", 
      color: "cyan", 
      link: "/equipment"
    },
    { 
      icon: Package, 
      title: "Inventory", 
      description: "Stock management and reordering", 
      color: "green", 
      link: "/inventory"
    },
    { 
      icon: Clock, 
      title: "Standby", 
      description: "On-call schedules and coverage", 
      color: "orange", 
      link: "/standby"
    },
    { 
      icon: Calculator, 
      title: "Overtime", 
      description: "Track and approve overtime requests", 
      color: "purple", 
      link: "/overtime"
    },
    
    // Maintenance
    { 
      icon: ClipboardCheck, 
      title: "Maintenance", 
      description: "Work orders and preventive maintenance", 
      color: "orange", 
      link: "/maintenance"
    },
    { 
      icon: AlertTriangle, 
      title: "Breakdowns", 
      description: "Track equipment breakdowns", 
      color: "red", 
      link: "/breakdowns"
    },
    { 
      icon: Package, 
      title: "Spares", 
      description: "Spare parts inventory management", 
      color: "green", 
      link: "/spares"
    },
    { 
      icon: Fan, 
      title: "Compressors", 
      description: "Monitor compressor performance", 
      color: "cyan", 
      link: "/compressors"
    },
    
    // Time & Leave
    { 
      icon: CalendarDays, 
      title: "Leave", 
      description: "Employee time off management", 
      color: "pink", 
      link: "/leave"
    },
    { 
      icon: ClockIcon, 
      title: "Timesheets", 
      description: "Time tracking and payroll", 
      color: "purple", 
      link: "/timesheets"
    },
    
    // Safety & Compliance
    { 
      icon: Shield, 
      title: "PPE", 
      description: "Protective equipment tracking", 
      color: "blue", 
      link: "/ppe"
    },
    { 
      icon: FileCheck, 
      title: "SHEQ", 
      description: "Safety, Health, Environment & Quality", 
      color: "green", 
      link: "/sheq"
    },
    
    // Analytics
    { 
      icon: Eye, 
      title: "Visualization", 
      description: "Interactive dashboards and reports", 
      color: "indigo", 
      link: "/visualization"
    },
    { 
      icon: BarChart3, 
      title: "Reports", 
      description: "Generate operational reports", 
      color: "green", 
      link: "/reports"
    },
    { 
      icon: FileText, 
      title: "Documents", 
      description: "Centralized document storage", 
      color: "blue", 
      link: "/documents"
    },
    { 
      icon: MessageSquare, 
      title: "Notice Board", 
      description: "Company announcements", 
      color: "green", 
      link: "/noticeboard"
    },
  ];

  const coreModules = allModules.filter(module => ['Personnel', 'Assets', 'Inventory', 'Overtime', 'Leave', 'PPE'].some(keyword => 
    module.title.includes(keyword)
  ));
  const operationsModules = allModules.filter(module => ['Maintenance', 'Breakdown', 'Spares', 'Compressor', 'Standby'].some(keyword => 
    module.title.includes(keyword)
  ));
  const analyticsModules = allModules.filter(module => ['Visualization', 'Reports', 'Document', 'Notice'].some(keyword => 
    module.title.includes(keyword)
  ));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-3 border-gray-300 border-t-indigo-600" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Image - Clear, not blurred */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80')",
            opacity: 0.15
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">MyOffice</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-2">
                <Link 
                  href="/" 
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-50"
                >
                  Home
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-50">
                    Core
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-40 bg-white rounded shadow-lg border p-1 z-50">
                    {coreModules.slice(0, 4).map((module) => (
                      <Link
                        key={module.link}
                        href={module.link}
                        className="flex items-center gap-2 p-2 text-sm hover:bg-gray-50 rounded"
                      >
                        <module.icon className="h-3 w-3 text-gray-500" />
                        {module.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-50">
                    Operations
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-40 bg-white rounded shadow-lg border p-1 z-50">
                    {operationsModules.slice(0, 4).map((module) => (
                      <Link
                        key={module.link}
                        href={module.link}
                        className="flex items-center gap-2 p-2 text-sm hover:bg-gray-50 rounded"
                      >
                        <module.icon className="h-3 w-3 text-gray-500" />
                        {module.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link 
                  href="/timesheets" 
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-50"
                >
                  Timesheets
                </Link>

                <Link 
                  href="/sheq" 
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-50"
                >
                  SHEQ
                </Link>
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                {isLoggedIn ? (
                  <div className="hidden lg:flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{user?.name || 'User'}</span>
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
                  <div className="hidden lg:flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-sm">
                          <LogIn className="h-3 w-3 mr-1" />
                          Sign In
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-sm">Sign In</DialogTitle>
                        </DialogHeader>
                        <AuthForm />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-sm">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Sign Up
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-sm">Create Account</DialogTitle>
                        </DialogHeader>
                        <AuthForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                
                <MobileNav isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  MyOffice Management System
                </h1>
                <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                  Complete platform for office operations, assets, personnel, and analytics
                </p>
              </div>

              <div className="flex justify-center gap-3 mb-8">
                {isLoggedIn ? (
                  <>
                    <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      <Link href="/dashboard">
                        Dashboard
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/employees">
                        Personnel
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          Get Started
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-sm">Get Started</DialogTitle>
                        </DialogHeader>
                        <AuthForm />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Sign In
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-sm">Sign In</DialogTitle>
                        </DialogHeader>
                        <AuthForm />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* All Modules Tabs */}
          <section className="pb-8 md:pb-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  All Modules
                </h2>
                <p className="text-gray-600 text-sm">
                  Click any module to access its features
                </p>
              </div>

              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-6">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="core" className="text-xs">Core</TabsTrigger>
                  <TabsTrigger value="operations" className="text-xs">Operations</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {allModules.map((module, index) => (
                      <ModuleCard key={index} module={module} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="core" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {coreModules.map((module, index) => (
                      <ModuleCard key={index} module={module} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="operations" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {operationsModules.map((module, index) => (
                      <ModuleCard key={index} module={module} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <Card className="border bg-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Ready to Get Started?
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    Access all modules and streamline your office operations
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    {isLoggedIn ? (
                      <>
                        <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          <Link href="/dashboard">
                            Go to Dashboard
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/sheq">
                            SHEQ Module
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                              Get Started
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-sm">
                            <DialogHeader>
                              <DialogTitle className="text-sm">Get Started</DialogTitle>
                            </DialogHeader>
                            <AuthForm />
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Sign In
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-sm">
                            <DialogHeader>
                              <DialogTitle className="text-sm">Sign In</DialogTitle>
                            </DialogHeader>
                            <AuthForm />
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 border-t">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-indigo-400" />
                  <span className="font-bold text-white">MyOffice</span>
                </div>
                <p className="text-gray-400 text-xs">
                  Office management platform
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2 text-sm">Modules</h4>
                <ul className="space-y-1">
                  <li><Link href="/employees" className="text-xs text-gray-400 hover:text-white">Personnel</Link></li>
                  <li><Link href="/sheq" className="text-xs text-gray-400 hover:text-white">SHEQ</Link></li>
                  <li><Link href="/timesheets" className="text-xs text-gray-400 hover:text-white">Timesheets</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2 text-sm">Resources</h4>
                <ul className="space-y-1">
                  <li><Link href="/support" className="text-xs text-gray-400 hover:text-white">Support</Link></li>
                  <li><Link href="/contact" className="text-xs text-gray-400 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2 text-sm">Legal</h4>
                <ul className="space-y-1">
                  <li><Link href="/privacy" className="text-xs text-gray-400 hover:text-white">Privacy</Link></li>
                  <li><Link href="/terms" className="text-xs text-gray-400 hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-4 bg-gray-800" />
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} MyOffice Management System
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}