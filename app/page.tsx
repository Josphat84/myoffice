// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  Users, 
  ToolCase, 
  Shield, 
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
  Database,
  Layers,
  Server,
  ChevronUp,
  Folder,
  HardHat,
  Wrench,
  LineChart,
  Clock4,
  Megaphone,
  Building,
  Cpu,
  Settings
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

// =============== ANIMATION STYLES ===============
const animationStyles = `
  @keyframes fly-in-from-right {
    from {
      opacity: 0;
      transform: translateX(120px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fade-in-up-slow {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes fade-in-slow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  .animate-fly-in-from-right {
    animation: fly-in-from-right 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .animate-fade-in-up-slow {
    animation: fade-in-up-slow 1.8s ease-out forwards;
  }

  .animate-float-slow {
    animation: float-slow 4s ease-in-out infinite;
  }

  .animate-fade-in-slow {
    animation: fade-in-slow 1.5s ease-out forwards;
    opacity: 0;
  }

  .animate-pulse-slow {
    animation: pulse-slow 2.5s ease-in-out infinite;
  }
`;

// =============== TYPES ===============
type ColorType = 'indigo' | 'cyan' | 'green' | 'amber' | 'blue' | 'purple' | 'orange' | 'pink' | 'red';

interface ModuleItem {
  icon: any;
  title: string;
  description: string;
  color: ColorType;
  link: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: ColorType;
  modules: ModuleItem[];
}

// =============== COMPONENTS ===============
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
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-white/30">
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
              className="w-full px-3 py-2 border border-gray-300/50 rounded text-sm bg-white/80 backdrop-blur-sm text-gray-900"
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
            className="w-full px-3 py-2 border border-gray-300/50 rounded text-sm bg-white/80 backdrop-blur-sm text-gray-900"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300/50 rounded text-sm bg-white/80 backdrop-blur-sm text-gray-900"
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
              className="w-full px-3 py-2 border border-gray-300/50 rounded text-sm bg-white/80 backdrop-blur-sm text-gray-900"
              required
            />
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-50/80 backdrop-blur-sm text-red-700 rounded text-xs border border-red-200/50">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-sm shadow-lg hover:shadow-xl transition-all duration-300"
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
            className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-300"
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

// Helper function for colors
function getColorClasses(color: ColorType) {
  const colorMap = {
    indigo: { 
      bg: 'bg-indigo-600', 
      hover: 'hover:bg-indigo-700', 
      light: 'bg-indigo-100/60', 
      text: 'text-indigo-800', 
      border: 'border-indigo-200/60',
      icon: 'text-indigo-700',
      card: 'bg-slate-50/80'
    },
    cyan: { 
      bg: 'bg-cyan-600', 
      hover: 'hover:bg-cyan-700', 
      light: 'bg-cyan-100/60', 
      text: 'text-cyan-800', 
      border: 'border-cyan-200/60',
      icon: 'text-cyan-700',
      card: 'bg-slate-50/80'
    },
    green: { 
      bg: 'bg-green-600', 
      hover: 'hover:bg-green-700', 
      light: 'bg-green-100/60', 
      text: 'text-green-800', 
      border: 'border-green-200/60',
      icon: 'text-green-700',
      card: 'bg-slate-50/80'
    },
    amber: { 
      bg: 'bg-amber-600', 
      hover: 'hover:bg-amber-700', 
      light: 'bg-amber-100/60', 
      text: 'text-amber-800', 
      border: 'border-amber-200/60',
      icon: 'text-amber-700',
      card: 'bg-slate-50/80'
    },
    blue: { 
      bg: 'bg-blue-600', 
      hover: 'hover:bg-blue-700', 
      light: 'bg-blue-100/60', 
      text: 'text-blue-800', 
      border: 'border-blue-200/60',
      icon: 'text-blue-700',
      card: 'bg-slate-50/80'
    },
    purple: { 
      bg: 'bg-purple-600', 
      hover: 'hover:bg-purple-700', 
      light: 'bg-purple-100/60', 
      text: 'text-purple-800', 
      border: 'border-purple-200/60',
      icon: 'text-purple-700',
      card: 'bg-slate-50/80'
    },
    orange: { 
      bg: 'bg-orange-600', 
      hover: 'hover:bg-orange-700', 
      light: 'bg-orange-100/60', 
      text: 'text-orange-800', 
      border: 'border-orange-200/60',
      icon: 'text-orange-700',
      card: 'bg-slate-50/80'
    },
    pink: { 
      bg: 'bg-pink-600', 
      hover: 'hover:bg-pink-700', 
      light: 'bg-pink-100/60', 
      text: 'text-pink-800', 
      border: 'border-pink-200/60',
      icon: 'text-pink-700',
      card: 'bg-slate-50/80'
    },
    red: { 
      bg: 'bg-red-600', 
      hover: 'hover:bg-red-700', 
      light: 'bg-red-100/60', 
      text: 'text-red-800', 
      border: 'border-red-200/60',
      icon: 'text-red-700',
      card: 'bg-slate-50/80'
    },
  };
  return colorMap[color] || colorMap.indigo;
}

// Module Card Component with slow fly-in from far right
function ModuleCard({ module, index, isVisible }: { module: ModuleItem; index: number; isVisible: boolean }) {
  const colors = getColorClasses(module.color);
  const IconComponent = module.icon;
  
  return (
    <Link href={module.link} className="block group">
      <div className={`h-full transition-all duration-1500 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-60'}`}
        style={{ 
          transitionDelay: `${index * 250}ms`,
          transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}>
        <Card className={`border ${colors.border} h-full hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 ${colors.card} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-lg ${colors.light} flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg backdrop-blur-sm`}>
                <IconComponent className={`h-5 w-5 ${colors.icon} transition-all duration-500 group-hover:scale-110`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate group-hover:text-gray-900 transition-colors duration-300">
                  {module.title}
                </h3>
                <p className="text-gray-700/90 text-xs line-clamp-2">
                  {module.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}

// Category Accordion Component
function CategoryAccordion({ 
  category, 
  isExpanded, 
  onToggle,
  index 
}: { 
  category: Category; 
  isExpanded: boolean; 
  onToggle: () => void;
  index: number;
}) {
  const colors = getColorClasses(category.color);
  const [modulesVisible, setModulesVisible] = useState(false);
  const CategoryIcon = category.icon;
  
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setModulesVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setModulesVisible(false);
    }
  }, [isExpanded]);
  
  return (
    <div className="rounded-xl border border-slate-300/40 bg-slate-100/70 backdrop-blur-sm shadow-xl hover:shadow-2xl mb-6 transition-all duration-500">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-200/50 rounded-t-xl transition-all duration-500"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${colors.light} transition-all duration-500 ${isExpanded ? 'scale-110 shadow-lg' : 'shadow-md'} backdrop-blur-sm`}>
            <CategoryIcon className={`h-6 w-6 ${colors.icon}`} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-800 text-base">{category.title}</h3>
            <p className="text-gray-700/90 text-sm">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`text-xs ${colors.text} ${colors.border} bg-white/60 backdrop-blur-sm transition-all duration-500 ${isExpanded ? 'scale-110' : ''}`}>
            {category.modules.length} modules
          </Badge>
          <div className={`p-2 rounded-full ${colors.light} transition-all duration-500 shadow-md backdrop-blur-sm`}>
            <ChevronDown className={`h-5 w-5 ${colors.icon} transition-transform duration-700 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-1000 ease-in-out ${isExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}>
        <div className="p-5 pt-0 border-t border-slate-300/40">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-5">
            {category.modules.map((module, moduleIndex) => (
              <ModuleCard 
                key={module.link} 
                module={module} 
                index={moduleIndex}
                isVisible={modulesVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============== MAIN PAGE ===============
export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'core': true,
    'operations': true,
    'time-attendance': true,
    'safety-compliance': true,
    'analytics': true,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FASTER LOADING - Remove setTimeout for initial auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
    // Set loading to false immediately - no artificial delay
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  // Define categories
  const categories: Category[] = [
    {
      id: 'core',
      title: 'Core Management',
      description: 'Essential business management modules',
      icon: Building,
      color: 'indigo',
      modules: [
        { icon: Users, title: "Personnel", description: "Employee profiles and team management", color: "indigo", link: "/employees" },
        { icon: ToolCase, title: "Assets", description: "Equipment tracking and maintenance", color: "cyan", link: "/equipment" },
        { icon: Package, title: "Inventory", description: "Stock management and reordering", color: "green", link: "/inventory" },
        { icon: Folder, title: "Documents", description: "Centralized document storage", color: "blue", link: "/documents" },
      ]
    },
    {
      id: 'operations',
      title: 'Operations & Maintenance',
      description: 'Daily operations and equipment management',
      icon: Settings,
      color: 'orange',
      modules: [
        { icon: ClipboardCheck, title: "Maintenance", description: "Work orders and preventive maintenance", color: "orange", link: "/maintenance" },
        { icon: AlertTriangle, title: "Breakdowns", description: "Track equipment breakdowns", color: "red", link: "/breakdowns" },
        { icon: Package, title: "Spares", description: "Spare parts inventory management", color: "green", link: "/spares" },
        { icon: Fan, title: "Compressors", description: "Monitor compressor performance", color: "cyan", link: "/compressors" },
        { icon: Clock, title: "Standby", description: "On-call schedules and coverage", color: "purple", link: "/standby" },
      ]
    },
    {
      id: 'time-attendance',
      title: 'Time & Attendance',
      description: 'Employee time tracking and leave management',
      icon: Clock4,
      color: 'purple',
      modules: [
        { icon: ClockIcon, title: "Timesheets", description: "Time tracking and payroll integration", color: "purple", link: "/timesheets" },
        { icon: Calculator, title: "Overtime", description: "Track and approve overtime requests", color: "amber", link: "/overtime" },
        { icon: CalendarDays, title: "Leaves", description: "Employee time off management", color: "pink", link: "/leaves" },
      ]
    },
    {
      id: 'safety-compliance',
      title: 'Safety & Compliance',
      description: 'Safety, health, and regulatory compliance',
      icon: Shield,
      color: 'blue',
      modules: [
        { icon: Shield, title: "PPE", description: "Protective equipment tracking", color: "blue", link: "/ppe" },
        { icon: FileCheck, title: "SHEQ", description: "Safety, Health, Environment & Quality", color: "green", link: "/sheq" },
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Insights',
      description: 'Reporting and data visualization',
      icon: LineChart,
      color: 'green',
      modules: [
        { icon: Eye, title: "Visualization", description: "Interactive dashboards and reports", color: "indigo", link: "/visualization" },
        { icon: BarChart3, title: "Reports", description: "Generate operational reports", color: "green", link: "/reports" },
        { icon: Megaphone, title: "Notice Board", description: "Company announcements", color: "pink", link: "/noticeboard" },
      ]
    },
  ];

  const coreModules = categories.find(cat => cat.id === 'core')?.modules || [];
  const operationsModules = categories.find(cat => cat.id === 'operations')?.modules || [];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    categories.forEach(cat => {
      allExpanded[cat.id] = true;
    });
    setExpandedCategories(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    categories.forEach(cat => {
      allCollapsed[cat.id] = false;
    });
    setExpandedCategories(allCollapsed);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-indigo-600" />
          <p className="text-white text-sm font-medium drop-shadow-lg">Loading MyOffice...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <div className="min-h-screen">
        {/* Stunning Icelandic Waterfall Background - OPTIMIZED LOADING */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-teal-900/20"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=60&w=800')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.9,
              filter: 'brightness(1.05) contrast(1.05) saturate(1.05)'
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Header - IMPROVED VISIBILITY ON MOBILE */}
          <header className="sticky top-0 z-50 w-full border-b border-white/30 bg-black/40 backdrop-blur-xl backdrop-saturate-150">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600/90 to-purple-600/90 shadow-lg">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-white text-lg drop-shadow-lg">MyOffice</span>
                </Link>

                {/* MOBILE MENU BUTTON - ALWAYS VISIBLE */}
                <div className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white hover:bg-white/10"
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Desktop Navigation - HIDDEN ON MOBILE */}
                <nav className="hidden lg:flex items-center gap-1">
                  <Link href="/" className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                    Home
                  </Link>
                  
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                      Core
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                      {coreModules.slice(0, 5).map((module) => {
                        const Icon = module.icon;
                        return (
                          <Link key={module.link} href={module.link} className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                            <Icon className="h-4 w-4 text-white/70" />
                            {module.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative group">
                    <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                      Operations
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                      {operationsModules.slice(0, 5).map((module) => {
                        const Icon = module.icon;
                        return (
                          <Link key={module.link} href={module.link} className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                            <Icon className="h-4 w-4 text-white/70" />
                            {module.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <Link href="/timesheets" className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                    Timesheets
                  </Link>
                  <Link href="/sheq" className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                    SHEQ
                  </Link>
                </nav>

                {/* Right Side Actions - Desktop */}
                <div className="hidden lg:flex items-center gap-3">
                  {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border-2 border-white/30">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500/80 to-purple-500/80 text-white text-sm">
                            {user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-white font-medium drop-shadow-sm">{user?.name || 'User'}</span>
                      </div>
                      <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-sm bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white hover:text-white transition-all duration-300 font-medium">
                            <LogIn className="h-4 w-4 mr-2" /> Sign In
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                          <AuthForm />
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 hover:from-indigo-700 hover:to-purple-700 text-sm transition-all duration-300 shadow-lg hover:shadow-xl text-white font-medium">
                            <UserPlus className="h-4 w-4 mr-2" /> Sign Up
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                          <AuthForm />
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>

              {/* MOBILE MENU - VISIBLE WHEN TOGGLED */}
              {mobileMenuOpen && (
                <div className="lg:hidden border-t border-white/20 mt-2 pb-4">
                  <div className="flex flex-col space-y-2 pt-4">
                    <Link 
                      href="/" 
                      className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    
                    <div className="px-4 py-2">
                      <div className="text-sm text-white/90 font-medium mb-2">Core Modules</div>
                      <div className="flex flex-col space-y-2 pl-4">
                        {coreModules.slice(0, 3).map((module) => {
                          const Icon = module.icon;
                          return (
                            <Link 
                              key={module.link} 
                              href={module.link} 
                              className="text-sm text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Icon className="h-4 w-4 inline mr-2" />
                              {module.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    <div className="px-4 py-2">
                      <div className="text-sm text-white/90 font-medium mb-2">Operations</div>
                      <div className="flex flex-col space-y-2 pl-4">
                        {operationsModules.slice(0, 3).map((module) => {
                          const Icon = module.icon;
                          return (
                            <Link 
                              key={module.link} 
                              href={module.link} 
                              className="text-sm text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Icon className="h-4 w-4 inline mr-2" />
                              {module.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    <Link 
                      href="/timesheets" 
                      className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Timesheets
                    </Link>
                    <Link 
                      href="/sheq" 
                      className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      SHEQ
                    </Link>

                    {/* Mobile Auth Buttons */}
                    <div className="pt-4 border-t border-white/20">
                      {isLoggedIn ? (
                        <div className="flex flex-col space-y-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border-2 border-white/30">
                              <AvatarFallback className="bg-gradient-to-br from-indigo-500/80 to-purple-500/80 text-white text-sm">
                                {user?.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-white font-medium">{user?.name || 'User'}</span>
                          </div>
                          <Button 
                            onClick={() => {
                              handleLogout();
                              setMobileMenuOpen(false);
                            }} 
                            variant="ghost" 
                            size="sm" 
                            className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm w-full"
                          >
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-3 px-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-sm bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white hover:text-white transition-all duration-300 font-medium w-full"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <LogIn className="h-4 w-4 mr-2" /> Sign In
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                              <AuthForm />
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 hover:from-indigo-700 hover:to-purple-700 text-sm transition-all duration-300 shadow-lg hover:shadow-xl text-white font-medium w-full"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <UserPlus className="h-4 w-4 mr-2" /> Sign Up
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                              <AuthForm />
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>

          <main className="flex-1">
            {/* Hero Section */}
            <section className="py-12 md:py-20 px-4">
              <div className="container mx-auto">
                <div className="text-center mb-12">
                  <div className="flex justify-center items-center gap-3 mb-6 animate-float-slow">
                    <Database className="h-8 w-8 text-white drop-shadow-lg" />
                    <Layers className="h-8 w-8 text-white drop-shadow-lg" />
                    <Server className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-slow drop-shadow-lg">
                    Organize Your Information
                  </h1>
                  <p className="text-white/95 text-base md:text-lg max-w-2xl mx-auto animate-fade-in-slow drop-shadow-lg" style={{ animationDelay: '200ms' }}>
                    Structured database architecture powers our platform to organize your personnel, 
                    assets, operations, and analytics in one unified system.
                  </p>
                </div>

                <div className="flex justify-center gap-4 mb-12">
                  {isLoggedIn ? (
                    <>
                      <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 animate-fade-in-slow shadow-xl hover:shadow-2xl text-white" style={{ animationDelay: '400ms' }}>
                        <Link href="/employees">
                          Start Managing
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 text-white animate-fade-in-slow" style={{ animationDelay: '500ms' }}>
                        <Link href="/leaves">
                          Manage Leaves
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 animate-fade-in-slow shadow-xl hover:shadow-2xl text-white" style={{ animationDelay: '400ms' }}>
                            Get Started
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                          <AuthForm />
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="lg" className="bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 text-white animate-fade-in-slow" style={{ animationDelay: '500ms' }}>
                            Sign In
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                          <AuthForm />
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* All Modules Tabs */}
            <section className="pb-12 md:pb-20 px-4">
              <div className="container mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-3 animate-fade-in-slow drop-shadow-lg">
                    Database-Powered Modules
                  </h2>
                  <p className="text-white/90 text-sm animate-fade-in-slow drop-shadow-lg" style={{ animationDelay: '100ms' }}>
                    Each module connects to our structured database architecture
                  </p>
                </div>

                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 bg-slate-100/80 backdrop-blur-sm border-slate-300/40 shadow-lg">
                      <TabsTrigger value="all" className="text-sm text-gray-800 data-[state=active]:bg-indigo-600/80 data-[state=active]:text-white">All</TabsTrigger>
                      <TabsTrigger value="core" className="text-sm text-gray-800 data-[state=active]:bg-indigo-600/80 data-[state=active]:text-white">Core</TabsTrigger>
                      <TabsTrigger value="operations" className="text-sm text-gray-800 data-[state=active]:bg-indigo-600/80 data-[state=active]:text-white">Operations</TabsTrigger>
                    </TabsList>
                    
                    {activeTab === 'all' && (
                      <div className="flex gap-3 animate-fade-in-slow" style={{ animationDelay: '200ms' }}>
                        <Button variant="outline" size="sm" onClick={expandAll} className="bg-slate-100/80 backdrop-blur-sm border-slate-300/40 hover:bg-slate-200/80 text-gray-800 text-sm hover:scale-105 transition-all duration-300 shadow-md">
                          Expand All
                        </Button>
                        <Button variant="outline" size="sm" onClick={collapseAll} className="bg-slate-100/80 backdrop-blur-sm border-slate-300/40 hover:bg-slate-200/80 text-gray-800 text-sm hover:scale-105 transition-all duration-300 shadow-md">
                          Collapse All
                        </Button>
                      </div>
                    )}
                  </div>

                  <TabsContent value="all" className="mt-0">
                    {categories.map((category, index) => (
                      <CategoryAccordion
                        key={category.id}
                        category={category}
                        isExpanded={expandedCategories[category.id]}
                        onToggle={() => toggleCategory(category.id)}
                        index={index}
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="core" className="mt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {coreModules.map((module, index) => {
                        const Icon = module.icon;
                        const colors = getColorClasses(module.color);
                        return (
                          <div key={module.link} className="animate-fly-in-from-right" style={{ 
                            animationDelay: `${index * 250}ms`,
                            animationFillMode: 'both'
                          }}>
                            <Link href={module.link} className="block group">
                              <Card className="border border-slate-300/40 hover:shadow-2xl transition-all duration-500 h-full hover:scale-[1.04] hover:-translate-y-2 bg-slate-50/80 backdrop-blur-sm shadow-lg">
                                <CardContent className="p-5">
                                  <div className="flex items-start gap-3">
                                    <div className={`p-3 rounded-xl ${colors.light} flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg backdrop-blur-sm`}>
                                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate group-hover:text-gray-900">
                                        {module.title}
                                      </h3>
                                      <p className="text-gray-700/90 text-xs line-clamp-2">
                                        {module.description}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="operations" className="mt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {operationsModules.map((module, index) => {
                        const Icon = module.icon;
                        const colors = getColorClasses(module.color);
                        return (
                          <div key={module.link} className="animate-fly-in-from-right" style={{ 
                            animationDelay: `${index * 250}ms`,
                            animationFillMode: 'both'
                          }}>
                            <Link href={module.link} className="block group">
                              <Card className="border border-slate-300/40 hover:shadow-2xl transition-all duration-500 h-full hover:scale-[1.04] hover:-translate-y-2 bg-slate-50/80 backdrop-blur-sm shadow-lg">
                                <CardContent className="p-5">
                                  <div className="flex items-start gap-3">
                                    <div className={`p-3 rounded-xl ${colors.light} flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg backdrop-blur-sm`}>
                                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate group-hover:text-gray-900">
                                        {module.title}
                                      </h3>
                                      <p className="text-gray-700/90 text-xs line-clamp-2">
                                        {module.description}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 px-4">
              <div className="container mx-auto">
                <Card className="border border-slate-300/40 bg-slate-100/70 backdrop-blur-sm shadow-2xl animate-fade-in-up-slow">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600/80 to-purple-600/80 shadow-lg backdrop-blur-sm">
                        <Database className="h-6 w-6 text-white animate-pulse-slow" />
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 text-xl mb-4">
                      Database-Driven Organization
                    </h3>
                    
                    <p className="text-gray-700/90 text-sm mb-6 max-w-2xl mx-auto">
                      Our structured database architecture ensures your information is organized, 
                      connected, and easily accessible across all modules.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {isLoggedIn ? (
                        <>
                          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl text-white">
                            <Link href="/employees">
                              Manage Personnel
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="lg" className="bg-slate-100/80 backdrop-blur-sm border-slate-300/40 hover:bg-slate-200/80 text-gray-800">
                            <Link href="/sheq">
                              SHEQ Module
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl text-white">
                                Get Started
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
                              <AuthForm />
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="lg" className="bg-slate-100/80 backdrop-blur-sm border-slate-300/40 hover:bg-slate-200/80 text-gray-800">
                                Sign In
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm border-white/30 bg-transparent backdrop-blur-none">
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
          <footer className="bg-gradient-to-t from-slate-900/90 to-slate-800/80 text-white border-t border-white/10 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600/80 to-purple-600/80">
                      <Database className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-white text-lg">MyOffice</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Database-driven office management platform
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-3 text-sm">Modules</h4>
                  <ul className="space-y-2">
                    <li><Link href="/employees" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Personnel</Link></li>
                    <li><Link href="/leaves" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Leaves</Link></li>
                    <li><Link href="/sheq" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">SHEQ</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-3 text-sm">Resources</h4>
                  <ul className="space-y-2">
                    <li><Link href="/support" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Support</Link></li>
                    <li><Link href="/contact" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Contact</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-3 text-sm">Legal</h4>
                  <ul className="space-y-2">
                    <li><Link href="/privacy" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Privacy</Link></li>
                    <li><Link href="/terms" className="text-xs text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 hover:font-medium">Terms</Link></li>
                  </ul>
                </div>
              </div>
              
              <Separator className="my-6 bg-slate-700" />
              
              <div className="text-center">
                <p className="text-xs text-slate-400">
                  © {new Date().getFullYear()} MyOffice Management System is a product of Ozech Investments Inc
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}