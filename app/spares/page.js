"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Package, Search, Plus, Edit, Trash2, Copy,
  ChevronDown, RefreshCw, AlertTriangle,
  MapPin, Truck, Shield, CheckCircle2,
  AlertCircle, Loader2, DollarSign,
  AlertOctagon, Grid, List, X, Star, MoreVertical,
  Eye as EyeIcon, Calendar, BarChart3,
  Filter, Download, Clock, Battery, BatteryFull, BatteryLow, BatteryMedium,
  BatteryWarning, Layers, ShoppingCart,
  Database, Cpu, FileText, BookOpen,
  Sparkles, ChevronsUpDown, Grid3x3,
  CalendarDays, FilterX, Check, ChevronsUp, ChevronsDown,
  SortAsc, SortDesc, Tag, Info,
} from "lucide-react";

// Import shadcn components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// API Configuration
const API_URL = 'http://localhost:8000';

// API Functions
const api = {
  fetchSpares: async () => {
    try {
      const response = await fetch(`${API_URL}/api/spares`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const data = await response.json();
      
      if (Array.isArray(data)) return data;
      if (data?.items) return data.items;
      if (data?.data) return data.data;
      if (data?.spares) return data.spares;
      
      return [];
    } catch (error) {
      toast.error(`Failed to fetch spares: ${error.message}`);
      throw error;
    }
  },

  createSpare: async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/spares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to create');
      return await response.json();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },

  updateSpare: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/api/spares/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to update');
      return await response.json();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },

  deleteSpare: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/spares/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      return await response.json();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },

  testConnection: async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
};

// Form Schema
const spareFormSchema = z.object({
  stock_code: z.string().min(1, "Stock code is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional(),
  machine_type: z.string().optional(),
  current_quantity: z.coerce.number().min(0),
  min_quantity: z.coerce.number().min(0),
  max_quantity: z.coerce.number().min(1),
  unit_price: z.coerce.number().min(0),
  priority: z.enum(["low", "medium", "high", "critical"]),
  storage_location: z.string().optional(),
  supplier: z.string().optional(),
  safety_stock: z.boolean().default(false),
  notes: z.string().optional(),
  last_ordered_date: z.string().optional(),
  lead_time_days: z.coerce.number().min(0).optional(),
});

// Utility Functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

const formatCurrencyDetailed = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
};

const getStockStatus = (current, min) => {
  if (current <= 0) return { 
    label: 'Out of Stock', 
    variant: 'destructive',
    icon: AlertOctagon,
    batteryIcon: BatteryWarning,
    priority: 1
  };
  if (current <= min) return { 
    label: 'Low Stock', 
    variant: 'warning',
    icon: AlertTriangle,
    batteryIcon: BatteryLow,
    priority: 2
  };
  if (current <= min * 1.5) return { 
    label: 'Adequate', 
    variant: 'secondary',
    icon: CheckCircle2,
    batteryIcon: BatteryMedium,
    priority: 3
  };
  return { 
    label: 'In Stock', 
    variant: 'success',
    icon: CheckCircle2,
    batteryIcon: BatteryFull,
    priority: 4
  };
};

const getPriorityConfig = (priority) => {
  const configs = {
    critical: { label: 'Critical', variant: 'destructive', icon: AlertCircle },
    high: { label: 'High', variant: 'warning', icon: AlertTriangle },
    medium: { label: 'Medium', variant: 'secondary', icon: Shield },
    low: { label: 'Low', variant: 'outline', icon: Shield }
  };
  return configs[priority?.toLowerCase()] || configs.medium;
};

// Custom Category Select with Create Option
const CategorySelect = ({ value, onChange, categories, onCreate }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (cat) => {
    onChange(cat);
    setIsOpen(false);
    setInputValue('');
  };

  const handleCreate = () => {
    if (inputValue.trim()) {
      const newCat = inputValue.trim();
      onCreate(newCat);
      onChange(newCat);
      setIsOpen(false);
      setInputValue('');
      toast.success(`Added "${newCat}" to categories`);
    }
  };

  const filteredCats = categories.filter(cat => 
    cat.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          {value || "Select category..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2" align="start">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search or type new..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-8 border-0 shadow-none focus-visible:ring-0"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          
          <ScrollArea className="max-h-[200px]">
            <div className="space-y-1">
              {filteredCats.map((cat) => (
                <Button
                  key={cat}
                  variant="ghost"
                  className="w-full justify-start h-8 px-2"
                  onClick={() => handleSelect(cat)}
                >
                  <Check className={cn(
                    "mr-2 h-4 w-4",
                    value === cat ? "opacity-100" : "opacity-0"
                  )} />
                  {cat}
                </Button>
              ))}
              
              {inputValue && !categories.includes(inputValue.trim()) && (
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 px-2 text-primary"
                  onClick={handleCreate}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{inputValue}"
                </Button>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Compact Spare Card (Smaller height)
const CompactSpareCard = ({ spare, onEdit, onDelete, onFavorite, isFavorite, onViewDetails }) => {
  if (!spare) return null;

  const status = getStockStatus(spare.current_quantity || 0, spare.min_quantity || 1);
  const StatusIcon = status.icon;
  const BatteryIcon = status.batteryIcon;
  const maxQuantity = spare.max_quantity || 1;
  const currentQuantity = spare.current_quantity || 0;
  const percentage = maxQuantity > 0 ? Math.min(100, (currentQuantity / maxQuantity) * 100) : 0;
  const inventoryValue = (spare.current_quantity || 0) * (spare.unit_price || 0);
  const priority = getPriorityConfig(spare.priority);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 h-[280px] flex flex-col">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback className="bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-base font-semibold truncate font-mono">
                {spare.stock_code || 'N/A'}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {spare.category || 'Uncategorized'}
              </Badge>
              {spare.safety_stock && (
                <Badge variant="success" className="text-xs">
                  Safety
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onFavorite && onFavorite(spare.id)}
            >
              <Star className={cn(
                "h-3 w-3",
                isFavorite && "fill-amber-500 text-amber-500"
              )} />
            </Button>
            <Badge variant={status.variant} className="text-xs gap-1">
              <StatusIcon className="h-2.5 w-2.5" />
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {spare.description || 'No description'}
        </p>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <BatteryIcon className="h-3 w-3" />
                <span>Stock: {currentQuantity}/{maxQuantity}</span>
              </div>
              <span className="font-medium">{Math.round(percentage)}%</span>
            </div>
            <Progress value={percentage} className="h-1.5" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 truncate">
              <Cpu className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{spare.machine_type || '—'}</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{spare.storage_location || '—'}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t pt-3">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-1">
            <div className="text-sm font-semibold">
              {formatCurrency(inventoryValue)}
            </div>
            <Badge variant={priority.variant} className="text-xs gap-1">
              <priority.icon className="h-2.5 w-2.5" />
              {priority.label}
            </Badge>
          </div>
          
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onViewDetails(spare)}
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(spare)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(spare.stock_code)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(spare.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// Enhanced List View (Fully Functional)
const EnhancedListView = ({ spares, onEdit, onDelete, onFavorite, onViewDetails, favorites, sortConfig, onSort }) => {
  const [localSpares, setLocalSpares] = useState(spares);

  useEffect(() => {
    setLocalSpares(spares);
  }, [spares]);

  const handleSort = (field) => {
    const newDirection = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const SortHeader = ({ field, children }) => {
    const isActive = sortConfig.field === field;
    const Icon = isActive 
      ? (sortConfig.direction === 'asc' ? ChevronsUp : ChevronsDown)
      : SortAsc;

    return (
      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort(field)}>
        <div className="flex items-center gap-1">
          {children}
          <Icon className={cn(
            "h-3 w-3 transition-transform",
            isActive && "text-primary"
          )} />
        </div>
      </TableHead>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <SortHeader field="stock_code">
                  Stock Code
                </SortHeader>
                <TableHead className="w-[250px]">Description</TableHead>
                <SortHeader field="category">
                  Category
                </SortHeader>
                <TableHead>Machine</TableHead>
                <SortHeader field="current_quantity">
                  Stock
                </SortHeader>
                <SortHeader field="unit_price">
                  Price
                </SortHeader>
                <TableHead>Supplier</TableHead>
                <SortHeader field="priority">
                  Priority
                </SortHeader>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localSpares.map((spare) => {
                const status = getStockStatus(spare.current_quantity || 0, spare.min_quantity || 1);
                const StatusIcon = status.icon;
                const priority = getPriorityConfig(spare.priority);
                const inventoryValue = (spare.current_quantity || 0) * (spare.unit_price || 0);
                
                return (
                  <TableRow key={spare.id} className="group">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onFavorite(spare.id)}
                      >
                        <Star className={cn(
                          "h-3.5 w-3.5",
                          favorites.has(spare.id) && "fill-amber-500 text-amber-500"
                        )} />
                      </Button>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-mono font-semibold">
                        {spare.stock_code}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {spare.storage_location || 'No location'}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="max-w-[250px]">
                        <div className="font-medium line-clamp-2 text-sm">
                          {spare.description}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {spare.category || '—'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{spare.machine_type || '—'}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={status.variant} className="gap-1 text-xs">
                            <StatusIcon className="h-2.5 w-2.5" />
                            {status.label}
                          </Badge>
                          <span className="text-sm font-medium">
                            {spare.current_quantity}/{spare.max_quantity}
                          </span>
                        </div>
                        <Progress 
                          value={(spare.current_quantity / spare.max_quantity) * 100} 
                          className="h-1.5 w-24" 
                        />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm">
                          {formatCurrencyDetailed(spare.unit_price || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total: {formatCurrency(inventoryValue)}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[120px]">
                          {spare.supplier || '—'}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={priority.variant} className="gap-1 text-xs">
                        <priority.icon className="h-2.5 w-2.5" />
                        {priority.label}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onViewDetails(spare)}
                              >
                                <EyeIcon className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Details</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onEdit(spare)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onViewDetails(spare)}>
                              <EyeIcon className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(spare)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(spare.stock_code)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onDelete(spare.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Stats
const QuickStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-primary/60" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-destructive">{stats.out_of_stock}</p>
            </div>
            <AlertOctagon className="h-8 w-8 text-destructive/60" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-warning">{stats.low_stock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-warning/60" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.total_value)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600/60" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Filters
const EnhancedFilters = ({ 
  search, onSearchChange,
  categoryFilter, onCategoryFilterChange,
  priorityFilter, onPriorityFilterChange,
  stockFilter, onStockFilterChange,
  categories,
  onClearFilters
}) => {
  const hasActiveFilters = search || categoryFilter !== 'all' || priorityFilter !== 'all' || stockFilter !== 'all';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stock code, description, category..."
              className="pl-9"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => onSearchChange('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stock Status</Label>
              <Select value={stockFilter} onValueChange={onStockFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="adequate">Adequate</SelectItem>
                  <SelectItem value="good">In Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                Active filters: {[
                  search && 'Search',
                  categoryFilter !== 'all' && 'Category',
                  priorityFilter !== 'all' && 'Priority',
                  stockFilter !== 'all' && 'Status'
                ].filter(Boolean).length}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="gap-1"
              >
                <FilterX className="h-3.5 w-3.5" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
export default function SparesPage() {
  const [spares, setSpares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSpare, setSelectedSpare] = useState(null);
  const [editingSpare, setEditingSpare] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [spareToDelete, setSpareToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ field: 'stock_code', direction: 'asc' });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      
      const sparesData = await api.fetchSpares();
      const validatedSpares = sparesData.map(spare => ({
        id: spare.id || spare._id || `temp-${Date.now()}`,
        stock_code: spare.stock_code || spare.stockCode || 'N/A',
        description: spare.description || '',
        category: spare.category || '',
        machine_type: spare.machine_type || spare.machineType || '',
        current_quantity: Number(spare.current_quantity || spare.currentQuantity || 0),
        min_quantity: Number(spare.min_quantity || spare.minQuantity || 1),
        max_quantity: Number(spare.max_quantity || spare.maxQuantity || 5),
        unit_price: Number(spare.unit_price || spare.unitPrice || 0),
        priority: spare.priority || 'medium',
        storage_location: spare.storage_location || spare.storageLocation || '',
        supplier: spare.supplier || '',
        safety_stock: Boolean(spare.safety_stock || spare.safetyStock),
        notes: spare.notes || '',
        last_ordered_date: spare.last_ordered_date || '',
        lead_time_days: Number(spare.lead_time_days || spare.leadTimeDays || 0),
        updated_at: spare.updated_at || new Date().toISOString()
      }));
      
      setSpares(validatedSpares);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(validatedSpares.map(s => s.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      if (validatedSpares.length === 0) {
        toast.info('No spare parts found. Add some to get started!');
      } else {
        toast.success(`Loaded ${validatedSpares.length} spare parts`);
      }
      
    } catch (error) {
      toast.error(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (editingSpare) {
        await api.updateSpare(editingSpare.id, data);
        toast.success("Spare part updated successfully");
      } else {
        await api.createSpare(data);
        toast.success("Spare part created successfully");
      }
      
      setFormOpen(false);
      setEditingSpare(null);
      await loadData();
      
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteSpare(id);
      toast.success("Spare part deleted successfully");
      await loadData();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSpareToDelete(null);
    }
  };

  const handleEdit = (spare) => {
    setEditingSpare(spare);
    setFormOpen(true);
  };

  const handleViewDetails = (spare) => {
    setSelectedSpare(spare);
    setDetailsOpen(true);
  };

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.info("Removed from favorites");
    } else {
      newFavorites.add(id);
      toast.success("Added to favorites");
    }
    setFavorites(newFavorites);
  };

  const addCategory = (newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const handleSort = (field, direction) => {
    setSortConfig({ field, direction });
  };

  // Filter and sort spares
  const filteredSpares = useMemo(() => {
    let filtered = spares.filter(spare => {
      const matchesSearch = !search || 
        spare.stock_code.toLowerCase().includes(search.toLowerCase()) ||
        spare.description.toLowerCase().includes(search.toLowerCase()) ||
        spare.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || spare.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || spare.priority === priorityFilter;
      
      const status = getStockStatus(spare.current_quantity || 0, spare.min_quantity || 1);
      const matchesStock = stockFilter === 'all' || 
        (stockFilter === 'out' && status.label === 'Out of Stock') ||
        (stockFilter === 'low' && status.label === 'Low Stock') ||
        (stockFilter === 'adequate' && status.label === 'Adequate') ||
        (stockFilter === 'good' && status.label === 'In Stock');

      return matchesSearch && matchesCategory && matchesPriority && matchesStock;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      // Handle special fields
      if (sortConfig.field === 'current_quantity') {
        aValue = a.current_quantity;
        bValue = b.current_quantity;
      } else if (sortConfig.field === 'unit_price') {
        aValue = a.unit_price;
        bValue = b.unit_price;
      } else if (sortConfig.field === 'priority') {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        aValue = priorityOrder[a.priority] || 2;
        bValue = priorityOrder[b.priority] || 2;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply favorites sorting
    filtered.sort((a, b) => {
      const aFavorite = favorites.has(a.id);
      const bFavorite = favorites.has(b.id);
      if (aFavorite && !bFavorite) return -1;
      if (!aFavorite && bFavorite) return 1;
      return 0;
    });
    
    return filtered;
  }, [spares, search, categoryFilter, priorityFilter, stockFilter, favorites, sortConfig]);

  // Calculate statistics
  const displayStats = useMemo(() => {
    const outOfStock = spares.filter(s => s.current_quantity <= 0).length;
    const lowStock = spares.filter(s => {
      const current = s.current_quantity || 0;
      const min = s.min_quantity || 0;
      return current > 0 && current <= min;
    }).length;
    
    const totalValue = spares.reduce((sum, s) => {
      return sum + (s.current_quantity * s.unit_price);
    }, 0);
    
    return {
      total: spares.length,
      out_of_stock: outOfStock,
      low_stock: lowStock,
      total_value: totalValue
    };
  }, [spares]);

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setStockFilter('all');
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Spare Parts Inventory</h1>
              <div className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${spares.length} items`}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Spare
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:px-6 space-y-6">
        {/* Quick Stats */}
        <QuickStats stats={displayStats} loading={loading} />

        {/* View Mode Toggle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label>View Mode:</Label>
                  <div className="flex border rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="h-4 w-4" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                      List
                    </Button>
                  </div>
                </div>
                
                {favorites.size > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {favorites.size} favorites
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredSpares.length} of {spares.length} items
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <EnhancedFilters
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          categories={categories}
          onClearFilters={clearFilters}
        />

        {/* Results */}
        {loading ? (
          viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="h-[280px]">
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full mb-4" />
                    <Skeleton className="h-2 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <TableHead key={i}><Skeleton className="h-4 w-20" /></TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 10 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        ) : filteredSpares.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-bold mb-2">No spare parts found</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {search || categoryFilter !== 'all' || priorityFilter !== 'all' || stockFilter !== 'all'
                  ? "Try adjusting your filters"
                  : "Add your first spare part to get started"}
              </p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Spare Part
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSpares.map((spare) => (
              <CompactSpareCard
                key={spare.id}
                spare={spare}
                onEdit={handleEdit}
                onDelete={(id) => {
                  setSpareToDelete(id);
                  setDeleteDialogOpen(true);
                }}
                onFavorite={toggleFavorite}
                onViewDetails={handleViewDetails}
                isFavorite={favorites.has(spare.id)}
              />
            ))}
          </div>
        ) : (
          <EnhancedListView
            spares={filteredSpares}
            onEdit={handleEdit}
            onDelete={(id) => {
              setSpareToDelete(id);
              setDeleteDialogOpen(true);
            }}
            onFavorite={toggleFavorite}
            onViewDetails={handleViewDetails}
            favorites={favorites}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      </main>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Spare Part</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this spare part? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => spareToDelete && handleDelete(spareToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SpareFormModal */}
      <SpareFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={editingSpare}
        loading={loading}
        categories={categories}
        onCategoryCreate={addCategory}
      />

      {/* Details Sheet */}
      {selectedSpare && (
        <SpareDetailsSheet
          spare={selectedSpare}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
    </div>
  );
}

// SpareFormModal Component
function SpareFormModal({ open, onOpenChange, onSubmit, initialData, loading, categories, onCategoryCreate }) {
  const [date, setDate] = useState(initialData?.last_ordered_date ? new Date(initialData.last_ordered_date) : undefined);

  const form = useForm({
    resolver: zodResolver(spareFormSchema),
    defaultValues: initialData || {
      stock_code: '',
      description: '',
      category: '',
      machine_type: '',
      current_quantity: 0,
      min_quantity: 1,
      max_quantity: 5,
      unit_price: 0,
      priority: 'medium',
      storage_location: '',
      supplier: '',
      safety_stock: false,
      notes: '',
      last_ordered_date: '',
      lead_time_days: 0,
    }
  });

  const handleSubmit = async (data) => {
    try {
      const apiData = {
        ...data,
        last_ordered_date: date ? format(date, 'yyyy-MM-dd') : '',
      };
      
      await onSubmit(apiData);
      form.reset();
      setDate(undefined);
    } catch (error) {
      // Error handled by API
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {initialData ? 'Edit Spare Part' : 'Add New Spare Part'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="stock_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Part description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <CategorySelect
                            value={field.value}
                            onChange={field.onChange}
                            categories={categories}
                            onCreate={onCategoryCreate}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="current_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="min_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="unit_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storage_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Shelf A-1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="machine_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Machine Type</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lead_time_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Time (days)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Last Ordered</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                </div>

                <FormField
                  control={form.control}
                  name="safety_stock"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Safety Stock</FormLabel>
                        <FormDescription>
                          Critical item that must always be available
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// SpareDetailsSheet Component
function SpareDetailsSheet({ spare, open, onOpenChange }) {
  if (!spare) return null;

  const status = getStockStatus(spare.current_quantity || 0, spare.min_quantity || 1);
  const priority = getPriorityConfig(spare.priority);
  const inventoryValue = (spare.current_quantity || 0) * (spare.unit_price || 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                <Package className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              {spare.stock_code}
              <div className="text-sm font-normal text-muted-foreground">
                Spare Part Details
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full py-6 pr-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Description</Label>
                    <p className="text-sm">{spare.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Category</Label>
                      <Badge variant="outline" className="mt-1">{spare.category || '—'}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Priority</Label>
                      <Badge variant={priority.variant} className="mt-1">
                        {priority.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm text-muted-foreground">Stock Level</Label>
                      <p className="text-2xl font-bold">
                        {spare.current_quantity} / {spare.max_quantity}
                      </p>
                    </div>
                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={(spare.current_quantity / spare.max_quantity) * 100} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Min: {spare.min_quantity}</span>
                      <span>{(spare.current_quantity / spare.max_quantity * 100).toFixed(0)}% stocked</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Unit Price</Label>
                    <p className="text-lg font-semibold">
                      {formatCurrencyDetailed(spare.unit_price)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Value</Label>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(inventoryValue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Machine Type</Label>
                    <p className="text-sm">{spare.machine_type || '—'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Storage Location</Label>
                    <p className="text-sm">{spare.storage_location || '—'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Supplier</Label>
                    <p className="text-sm">{spare.supplier || '—'}</p>
                  </div>
                  
                  {spare.lead_time_days > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Lead Time</Label>
                      <p className="text-sm">{spare.lead_time_days} days</p>
                    </div>
                  )}
                  
                  {spare.last_ordered_date && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Last Ordered</Label>
                      <p className="text-sm">{formatDate(spare.last_ordered_date)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {spare.safety_stock && (
              <Alert>
                
                <AlertTitle>Safety Stock Item</AlertTitle>
                <AlertDescription>
                  This is a critical item that must always be available.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Order More
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}