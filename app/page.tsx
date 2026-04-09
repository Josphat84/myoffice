// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  Users, 
  ToolCase, 
  Shield, 
  ArrowRight,
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
  Settings,
  Home,
  ShoppingCart,
  Utensils,
  Sprout,
  Church,
  AlertOctagon,
  ShieldAlert,
  ClipboardList,
  FileWarning,
  PackageOpen,
  ClipboardPlus,
  ListChecks,
  Gauge,
  Truck,
  Car,
  Fuel,
  Route,
  MapPin,
  Timer,
  Briefcase,
  CalendarCheck,
  Umbrella,
  HeartHandshake,
  Wheat,
  Tractor,
  Trees,
  Mountain,
  Waves,
  Sunset,
  Sunrise,
  CloudSun,
  CloudMoon,
  Stars,
  Sparkles,
  EyeIcon,
  Target,
  Activity,
  Flag,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// =============== STUNNING NATURE WALLPAPER COLLECTION ===============
const natureWallpapers = [
  {
    url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Iceland Ice Cave",
    location: "Iceland - Crystal Ice Cave"
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Enchanted Forest",
    location: "Pacific Northwest"
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Misty Morning",
    location: "Great Smoky Mountains"
  },
  {
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Sunbeams Through Forest",
    location: "Olympic National Park"
  },
  {
    url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Alpine Lake",
    location: "Canadian Rockies"
  },
  {
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Waterfall Valley",
    location: "Yosemite National Park"
  },
  {
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Desert Dunes",
    location: "Namibia"
  },
  {
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Mountain Lake Reflection",
    location: "Lake Moraine, Canada"
  },
  {
    url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Majestic Waterfall",
    location: "Iguazu Falls"
  },
  {
    url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Desert Rock Formation",
    location: "Monument Valley"
  },
  {
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Rolling Hills",
    location: "Tuscany, Italy"
  },
  {
    url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=90&w=2070",
    credit: "Unsplash - Mountain Wildflowers",
    location: "Colorado Rockies"
  }
];

// =============== SIMPLE ANIMATION STYLES ===============
const animationStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce-light {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-up {
    animation: slide-up 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-bounce-light {
    animation: bounce-light 2s ease-in-out infinite;
  }

  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }
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

// Module Card Component
function ModuleCard({ module, index }: { module: ModuleItem; index: number }) {
  const colors = getColorClasses(module.color);
  const IconComponent = module.icon;
  const delayClass = index <= 5 ? `delay-${index * 100}` : '';
  
  return (
    <Link href={module.link} className="block group">
      <div className={`h-full animate-slide-up ${delayClass}`}>
        <Card className={`border ${colors.border} h-full hover:shadow-2xl transition-all duration-300 hover:scale-105 ${colors.card} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-lg ${colors.light} flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md backdrop-blur-sm`}>
                <IconComponent className={`h-5 w-5 ${colors.icon} transition-all duration-300`} />
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
  onToggle 
}: { 
  category: Category; 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  const colors = getColorClasses(category.color);
  const CategoryIcon = category.icon;
  
  return (
    <div className="rounded-xl border border-slate-300/40 bg-slate-100/70 backdrop-blur-sm shadow-xl mb-6 transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-200/50 rounded-t-xl transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${colors.light} transition-all duration-300 shadow-md backdrop-blur-sm`}>
            <CategoryIcon className={`h-6 w-6 ${colors.icon}`} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-800 text-base">{category.title}</h3>
            <p className="text-gray-700/90 text-sm">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`text-xs ${colors.text} ${colors.border} bg-white/60 backdrop-blur-sm`}>
            {category.modules.length} modules
          </Badge>
          <div className={`p-2 rounded-full ${colors.light} transition-transform duration-500 shadow-md backdrop-blur-sm`}>
            <ChevronDown className={`h-5 w-5 ${colors.icon} transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}>
        <div className="p-5 pt-0 border-t border-slate-300/40">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-5">
            {category.modules.map((module, moduleIndex) => (
              <ModuleCard 
                key={module.link} 
                module={module} 
                index={moduleIndex}
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
    'other-products': true,
  });
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);

  // Rotating nature wallpaper every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWallpaperIndex((prev) => (prev + 1) % natureWallpapers.length);
    }, 120000);
    return () => clearInterval(interval);
  }, []);

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
        { icon: PackageOpen, title: "Spares", description: "Spare parts inventory management", color: "green", link: "/spares" },
        { icon: Fan, title: "Compressors", description: "Monitor compressor performance", color: "cyan", link: "/compressors" },
        { icon: Clock, title: "Standby", description: "On-call schedules and coverage", color: "purple", link: "/standby" },
        { icon: CalendarDays, title: "Schedules", description: "Maintenance and task schedules", color: "amber", link: "/schedules" },
        { icon: ClipboardPlus, title: "Requisitions", description: "Purchase and supply requisitions", color: "blue", link: "/requisitions" },
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
        { icon: HardHat, title: "PPE", description: "Protective equipment tracking", color: "blue", link: "/ppe" },
        { icon: ClipboardList, title: "SHEQ Inspections", description: "Safety, Health, Environment & Quality inspections", color: "green", link: "/sheq_inspection" },
        { icon: FileWarning, title: "Near Miss", description: "Track and report near miss incidents", color: "amber", link: "/near_miss" },
        { icon: AlertOctagon, title: "Work Stoppage", description: "SHEQ hold points and work stoppage tracking", color: "red", link: "/work_stoppage" },
        { icon: ShieldAlert, title: "SHEQ", description: "Safety, Health, Environment & Quality", color: "purple", link: "/sheq" },
        { icon: EyeIcon, title: "VFL", description: "Visible Felt Leadership - Safety observations and engagement", color: "cyan", link: "/vfl" },
        { icon: Target, title: "PTO", description: "Planned Task Observation - Safety task observations", color: "green", link: "/pto" },
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
    {
      id: 'other-products',
      title: 'Other Products',
      description: 'Specialized platforms for different industries',
      icon: Package,
      color: 'pink',
      modules: [
        { icon: Home, title: "Room Rental", description: "Property rental and management platform", color: "pink", link: "/roomRental" },
        { icon: ShoppingCart, title: "E-commerce", description: "Online store and shopping platform", color: "purple", link: "/ecommerce" },
        { icon: Utensils, title: "Restaurant", description: "Restaurant management and ordering system", color: "orange", link: "/restaurant" },
        { icon: Sprout, title: "Farm", description: "Farm management and agricultural tracking", color: "green", link: "/farm" },
        { icon: Church, title: "Church", description: "Church management and community platform", color: "blue", link: "/church" },
        { icon: Database, title: "Stores", description: "Store inventory and management system", color: "cyan", link: "/stores" },
      ]
    }
  ];

  const coreModules = categories.find(cat => cat.id === 'core')?.modules || [];
  const operationsModules = categories.find(cat => cat.id === 'operations')?.modules || [];
  const safetyModules = categories.find(cat => cat.id === 'safety-compliance')?.modules || [];
  const timeAttendanceModules = categories.find(cat => cat.id === 'time-attendance')?.modules || [];

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
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
        {/* Rotating Nature Wallpaper Background */}
        <div className="fixed inset-0 z-0">
          {natureWallpapers.map((wallpaper, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-2000 ease-in-out"
              style={{
                backgroundImage: `url('${wallpaper.url}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === currentWallpaperIndex ? 1 : 0,
                filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
                transition: 'opacity 2000ms ease-in-out',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-4 right-4 text-white/30 text-xs font-light">
            {natureWallpapers[currentWallpaperIndex].location}
          </div>
        </div>

        <div className="relative z-10">
          {/* Header Component */}
          <Header 
            isLoggedIn={isLoggedIn} 
            user={user} 
            onLogout={handleLogout} 
          />

          <main className="flex-1">
            {/* Hero Section */}
            <section className="py-12 md:py-20 px-4">
              <div className="container mx-auto">
                <div className="text-center mb-12">
                  <div className="flex justify-center items-center gap-3 mb-6 animate-bounce-light">
                    <Database className="h-8 w-8 text-white drop-shadow-lg" />
                    <Layers className="h-8 w-8 text-white drop-shadow-lg" />
                    <Server className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in drop-shadow-lg">
                    Organize Your Information
                  </h1>
                  <p className="text-white/95 text-base md:text-lg max-w-2xl mx-auto animate-fade-in delay-200 drop-shadow-lg">
                    Structured database architecture powers our platform to organize your personnel, 
                    assets, operations, and analytics in one unified system.
                  </p>
                </div>
              </div>
            </section>

            {/* All Modules Tabs */}
            <section className="pb-12 md:pb-20 px-4">
              <div className="container mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-3 animate-fade-in drop-shadow-lg">
                    Database-Powered Modules
                  </h2>
                  <p className="text-white/90 text-sm animate-fade-in delay-100 drop-shadow-lg">
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
                      <div className="flex gap-3 animate-fade-in delay-200">
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
                    {categories.map((category) => (
                      <CategoryAccordion
                        key={category.id}
                        category={category}
                        isExpanded={expandedCategories[category.id]}
                        onToggle={() => toggleCategory(category.id)}
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="core" className="mt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {coreModules.map((module, index) => (
                        <ModuleCard key={module.link} module={module} index={index} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="operations" className="mt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {operationsModules.map((module, index) => (
                        <ModuleCard key={module.link} module={module} index={index} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 px-4">
              <div className="container mx-auto">
                <Card className="border border-slate-300/40 bg-slate-100/70 backdrop-blur-sm shadow-2xl animate-slide-up">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600/80 to-purple-600/80 shadow-lg backdrop-blur-sm animate-bounce-light">
                        <Database className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 text-xl mb-4">
                      Database-Driven Organization
                    </h3>
                    
                    <p className="text-gray-700/90 text-sm mb-6 max-w-2xl mx-auto">
                      Our structured database architecture ensures your information is organized, 
                      connected, and easily accessible across all modules.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </main>

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </>
  );
}