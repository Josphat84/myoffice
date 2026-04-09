//Header
//frontend/components/Header.tsx

// components/Header.tsx
'use client';

import { useState } from 'react';
import Link from "next/link";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronDown,
  Database,
  Users,
  ToolCase,
  Package,
  Folder,
  Settings,
  ClipboardCheck,
  AlertTriangle,
  PackageOpen,
  Fan,
  Clock,
  CalendarDays,
  ClipboardPlus,
  Clock4,
  Calculator,
  HardHat,
  ClipboardList,
  FileWarning,
  AlertOctagon,
  ShieldAlert,
  EyeIcon,
  Target,
  LineChart,
  Eye,
  BarChart3,
  Megaphone,
  Home,
  ShoppingCart,
  Utensils,
  Sprout,
  Church,
  Layers,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import AuthForm from the same file or create a separate component
const AuthForm = () => {
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
    }, 500);
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
};

interface HeaderProps {
  isLoggedIn: boolean;
  user: any;
  onLogout: () => void;
}

const coreModules = [
  { icon: Users, title: "Personnel", link: "/employees" },
  { icon: ToolCase, title: "Assets", link: "/equipment" },
  { icon: Package, title: "Inventory", link: "/inventory" },
  { icon: Folder, title: "Documents", link: "/documents" },
];

const operationsModules = [
  { icon: ClipboardCheck, title: "Maintenance", link: "/maintenance" },
  { icon: AlertTriangle, title: "Breakdowns", link: "/breakdowns" },
  { icon: PackageOpen, title: "Spares", link: "/spares" },
  { icon: Fan, title: "Compressors", link: "/compressors" },
  { icon: Clock, title: "Standby", link: "/standby" },
  { icon: CalendarDays, title: "Schedules", link: "/schedules" },
  { icon: ClipboardPlus, title: "Requisitions", link: "/requisitions" },
];

const timeAttendanceModules = [
  { icon: Clock4, title: "Timesheets", link: "/timesheets" },
  { icon: Calculator, title: "Overtime", link: "/overtime" },
  { icon: CalendarDays, title: "Leaves", link: "/leaves" },
];

const safetyModules = [
  { icon: HardHat, title: "PPE", link: "/ppe" },
  { icon: ClipboardList, title: "SHEQ Inspections", link: "/sheq_inspection" },
  { icon: FileWarning, title: "Near Miss", link: "/near_miss" },
  { icon: AlertOctagon, title: "Work Stoppage", link: "/work_stoppage" },
  { icon: ShieldAlert, title: "SHEQ", link: "/sheq" },
  { icon: EyeIcon, title: "VFL", link: "/vfl" },
  { icon: Target, title: "PTO", link: "/pto" },
];

const otherProducts = [
  { icon: Home, title: "Room Rental", link: "/roomRental" },
  { icon: ShoppingCart, title: "E-commerce", link: "/ecommerce" },
  { icon: Utensils, title: "Restaurant", link: "/restaurant" },
  { icon: Sprout, title: "Farm", link: "/farm" },
  { icon: Church, title: "Church", link: "/church" },
  { icon: Database, title: "Stores", link: "/stores" },
];

export function Header({ isLoggedIn, user, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/30 bg-black/40 backdrop-blur-xl backdrop-saturate-150">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600/90 to-purple-600/90 shadow-lg animate-bounce-light">
              <Database className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg drop-shadow-lg">MyOffice</span>
          </Link>

          {/* MOBILE MENU BUTTON */}
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
              Home
            </Link>
            
            {/* Core Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                Core
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                {coreModules.map((module) => {
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

            {/* Operations Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                Operations
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                {operationsModules.map((module) => {
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

            {/* Time & Attendance Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                Time & Attendance
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                {timeAttendanceModules.map((module) => {
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

            {/* Safety Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                Safety
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                {safetyModules.map((module) => {
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

            {/* Other Products Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm drop-shadow-sm font-medium">
                Other Products
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-48 bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-2 z-50">
                {otherProducts.map((product) => {
                  const Icon = product.icon;
                  return (
                    <Link key={product.link} href={product.link} className="flex items-center gap-3 p-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                      <Icon className="h-4 w-4 text-white/70" />
                      {product.title}
                    </Link>
                  );
                })}
              </div>
            </div>
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
                <Button onClick={onLogout} variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
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

        {/* MOBILE MENU */}
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
                  {coreModules.map((module) => {
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
                  {operationsModules.map((module) => {
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
                <div className="text-sm text-white/90 font-medium mb-2">Time & Attendance</div>
                <div className="flex flex-col space-y-2 pl-4">
                  {timeAttendanceModules.map((module) => {
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
                <div className="text-sm text-white/90 font-medium mb-2">Safety & Compliance</div>
                <div className="flex flex-col space-y-2 pl-4">
                  {safetyModules.map((module) => {
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
                <div className="text-sm text-white/90 font-medium mb-2">Other Products</div>
                <div className="flex flex-col space-y-2 pl-4">
                  {otherProducts.map((product) => {
                    const Icon = product.icon;
                    return (
                      <Link 
                        key={product.link} 
                        href={product.link} 
                        className="text-sm text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 inline mr-2" />
                        {product.title}
                      </Link>
                    );
                  })}
                </div>
              </div>

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
                        onLogout();
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
  );
}