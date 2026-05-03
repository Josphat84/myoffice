// app/inventory/page.js
"use client";

import { PageShell } from '@/components/PageShell';
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Package,
  ShoppingCart,
  Truck,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Home,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  SlidersHorizontal,
  X,
  Grid,
  List,
  BarChart3,
  Warehouse,
  PackageOpen,
  ArrowUpDown,
  MapPin,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Info,
  FilterX,
  Star,
  Clock,
  DollarSign,
  Layers,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Animation styles defined in globals.css



const INVENTORY_STORAGE_KEY = 'inventory-items';

// Compact Metrics Card Component
const CompactMetricsCard = ({ title, value, icon: Icon, color, subtitle, onClick, tooltip }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    indigo: "from-indigo-500 to-indigo-600",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600"
  };

  const gradient = colorClasses[color] || colorClasses.blue;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-white ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{title}</p>
                    <p className="text-lg font-bold">{value}</p>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip || `Click to view ${title.toLowerCase()}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Metrics Row Component
const MetricsRow = ({ stats, onStatusClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 animate-slide-up delay-100">
      <CompactMetricsCard 
        title="Total Items" 
        value={stats.totalItems} 
        icon={PackageOpen} 
        color="blue"
        tooltip="Total number of inventory items"
      />
      <CompactMetricsCard 
        title="In Stock" 
        value={stats.inStock} 
        icon={CheckCircle} 
        color="green"
        onClick={() => onStatusClick('in-stock')}
        tooltip="Click to filter in-stock items"
      />
      <CompactMetricsCard 
        title="Low Stock" 
        value={stats.lowStock} 
        icon={AlertTriangle} 
        color="yellow"
        onClick={() => onStatusClick('low-stock')}
        tooltip="Click to filter low stock items"
      />
      <CompactMetricsCard 
        title="Out of Stock" 
        value={stats.outOfStock} 
        icon={Package} 
        color="red"
        onClick={() => onStatusClick('out-of-stock')}
        tooltip="Click to filter out of stock items"
      />
      <CompactMetricsCard 
        title="Total Value" 
        value={`$${stats.totalValue.toLocaleString()}`} 
        icon={DollarSign} 
        color="emerald"
        tooltip="Total inventory value"
      />
      <CompactMetricsCard 
        title="Categories" 
        value={stats.categories} 
        icon={Layers} 
        color="purple"
        tooltip="Number of unique categories"
      />
    </div>
  );
};

// Expanded Details Component
const ExpandedInventoryDetails = ({ item }) => {
  const stockPercentage = (item.currentStock / item.maxStock) * 100;
  const needsReorder = item.currentStock <= item.minStock;

  return (
    <div className="animate-expand">
      <Separator className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/50 rounded-lg">
        {/* Stock Information */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
            <Warehouse className="h-3.5 w-3.5 text-blue-500" />
            Stock Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Stock:</span>
              <span className="font-medium">{item.currentStock} {item.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum Stock:</span>
              <span className="font-medium">{item.minStock} {item.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maximum Stock:</span>
              <span className="font-medium">{item.maxStock} {item.unit}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Stock Level</span>
                <span>{Math.round(stockPercentage)}%</span>
              </div>
              <Progress value={Math.min(stockPercentage, 100)} className="h-1.5" />
            </div>
            {needsReorder && (
              <Badge variant="warning" className="mt-2">
                <ShoppingCart className="h-3 w-3 mr-1" />
                Needs Reorder
              </Badge>
            )}
          </div>
        </div>

        {/* Location & Supplier */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-green-500" />
            Location & Supplier
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Storage Location:</span>
              <span className="font-medium">{item.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Supplier:</span>
              <span className="font-medium">{item.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{item.category}</span>
            </div>
          </div>
        </div>

        {/* Cost Information */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            Cost Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unit Cost:</span>
              <span className="font-medium">${item.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Value:</span>
              <span className="font-medium">${(item.currentStock * item.cost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unit:</span>
              <span className="font-medium">{item.unit}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-purple-500" />
            Dates
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Restocked:</span>
              <span className="font-medium">{new Date(item.lastRestocked).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div className="md:col-span-2">
            <h4 className="font-semibold text-sm text-gray-700 mb-1">Description</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Inventory Card Component (Grid View with Expand)
function InventoryCard({ item, onUpdate, onDelete, getStatusColor, getStockStatus, isExpanded, onToggleExpand }) {
  const [showActions, setShowActions] = useState(false);
  
  const stockStatus = getStockStatus(item);
  const stockPercentage = (item.currentStock / item.maxStock) * 100;
  const needsReorder = item.currentStock <= item.minStock;

  const formattedDate = new Date(item.lastRestocked).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const StatusIcon = stockStatus === 'in-stock' ? CheckCircle : stockStatus === 'low-stock' ? AlertTriangle : Package;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 shrink-0">
              <Package className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-foreground truncate group-hover:text-emerald-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleExpand}
                    className="h-7 w-7 p-0"
                  >
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isExpanded ? "Collapse details" : "Expand details"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
              {showActions && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-xl z-10 w-36 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-xs h-8"
                    asChild
                  >
                    <Link href={`/inventory/edit/${item.id}`}>
                      <Edit className="h-3.5 w-3.5 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this inventory item?')) {
                        onDelete(item.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stock Status Badge */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className={`${getStatusColor(stockStatus)} border text-xs py-0 px-2`}>
            <StatusIcon className="h-2.5 w-2.5 mr-1" />
            {stockStatus.replace('-', ' ')}
          </Badge>
          <span className="text-xs text-muted-foreground">{item.location}</span>
        </div>
        
        {/* Stock Level Bar */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Stock: {item.currentStock}/{item.maxStock} {item.unit}</span>
            <span className="font-medium">{Math.round(stockPercentage)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stockStatus === 'out-of-stock' ? 'bg-red-500' :
                stockStatus === 'low-stock' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Price and Supplier */}
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>${item.cost.toFixed(2)} / {item.unit}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Truck className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{item.supplier}</span>
          </div>
        </div>

        {isExpanded && <ExpandedInventoryDetails item={item} />}

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-2 border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" asChild>
                  <Link href={`/inventory/view/${item.id}`}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {needsReorder && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" className="flex-1 h-7 text-xs gap-1 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800">
                    <ShoppingCart className="h-3 w-3" />
                    Reorder
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reorder this item</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Inventory List Item Component (List View with Expand)
function InventoryListItem({ item, onUpdate, onDelete, getStatusColor, getStockStatus, isExpanded, onToggleExpand }) {
  const [showActions, setShowActions] = useState(false);
  
  const stockStatus = getStockStatus(item);
  const needsReorder = item.currentStock <= item.minStock;
  const stockPercentage = (item.currentStock / item.maxStock) * 100;
  const StatusIcon = stockStatus === 'in-stock' ? CheckCircle : stockStatus === 'low-stock' ? AlertTriangle : Package;

  return (
    <>
      <Card className="hover:shadow-md transition-all duration-300 bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleExpand}
                      className="h-7 w-7 p-0 shrink-0"
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isExpanded ? "Collapse details" : "Expand details"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 shrink-0">
                <Package className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-foreground truncate">
                    {item.name}
                  </h3>
                  <Badge variant="outline" className={`${getStatusColor(stockStatus)} border text-xs py-0 px-1.5`}>
                    <StatusIcon className="h-2 w-2 mr-0.5" />
                    {stockStatus.replace('-', ' ')}
                  </Badge>
                  {needsReorder && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-xs py-0 px-1.5">
                      Needs Reorder
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                  <span>SKU: {item.sku}</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Truck className="h-3 w-3" />
                    {item.supplier}
                  </span>
                  <span>${item.cost.toFixed(2)} / {item.unit}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-base font-bold text-foreground">
                  {item.currentStock}
                </div>
                <div className="text-xs text-muted-foreground">
                  of {item.maxStock} {item.unit}
                </div>
              </div>
              
              <div className="w-20">
                <Progress value={Math.min(stockPercentage, 100)} className="h-1.5" />
              </div>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setShowActions(!showActions)}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
                {showActions && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-xl z-10 w-36 py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 text-xs h-8"
                      asChild
                    >
                      <Link href={`/inventory/edit/${item.id}`}>
                        <Edit className="h-3.5 w-3.5 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this inventory item?')) {
                          onDelete(item.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {isExpanded && (
        <div className="ml-8">
          <ExpandedInventoryDetails item={item} />
        </div>
      )}
    </>
  );
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sample data
  const categories = ['Electronics', 'Mechanical', 'Consumables', 'Safety', 'Tools', 'Office Supplies'];
  const suppliers = ['TechSupply Inc', 'Industrial Parts Co', 'SafetyFirst Ltd', 'Global Tools', 'Office Depot'];


  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    setIsRefreshing(true);
    try {
      const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      } else {
        const sampleData = generateSampleInventory();
        setInventory(sampleData);
        saveInventory(sampleData);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const generateSampleInventory = () => {
    return [
      {
        id: 'inv-001',
        name: 'Industrial Circuit Boards',
        sku: 'CB-IND-005',
        category: 'Electronics',
        description: 'High-temperature circuit boards for manufacturing equipment',
        currentStock: 45,
        minStock: 20,
        maxStock: 100,
        unit: 'pcs',
        cost: 125.50,
        supplier: 'TechSupply Inc',
        location: 'Shelf A-12',
        status: 'in-stock',
        lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv-002',
        name: 'Safety Gloves - Large',
        sku: 'SG-L-100',
        category: 'Safety',
        description: 'Cut-resistant safety gloves, large size',
        currentStock: 8,
        minStock: 25,
        maxStock: 200,
        unit: 'pairs',
        cost: 12.75,
        supplier: 'SafetyFirst Ltd',
        location: 'Bin C-08',
        status: 'low-stock',
        lastRestocked: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv-003',
        name: 'Hydraulic Fluid',
        sku: 'HYD-40W',
        category: 'Consumables',
        description: 'Industrial grade hydraulic fluid, 40W',
        currentStock: 120,
        minStock: 50,
        maxStock: 300,
        unit: 'liters',
        cost: 8.20,
        supplier: 'Industrial Parts Co',
        location: 'Drum Storage',
        status: 'in-stock',
        lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv-004',
        name: 'CNC Cutting Tools',
        sku: 'CNC-CT-3MM',
        category: 'Tools',
        description: '3mm carbide cutting tools for CNC machines',
        currentStock: 0,
        minStock: 15,
        maxStock: 80,
        unit: 'pcs',
        cost: 45.00,
        supplier: 'Global Tools',
        location: 'Tool Crib B',
        status: 'out-of-stock',
        lastRestocked: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv-005',
        name: 'Laser Printer Toner',
        sku: 'TONER-XL500',
        category: 'Office Supplies',
        description: 'High-yield toner for XL500 series printers',
        currentStock: 3,
        minStock: 5,
        maxStock: 20,
        unit: 'cartridges',
        cost: 89.99,
        supplier: 'Office Depot',
        location: 'Supply Closet',
        status: 'low-stock',
        lastRestocked: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const saveInventory = (items) => {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const updateItem = (itemId, updates) => {
    const items = inventory.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    setInventory(items);
    saveInventory(items);
  };

  const deleteItem = (itemId) => {
    const items = inventory.filter(item => item.id !== itemId);
    setInventory(items);
    saveInventory(items);
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'in-stock': 'bg-green-100 text-green-800 border-green-200',
      'low-stock': 'bg-amber-100 text-amber-800 border-amber-200',
      'out-of-stock': 'bg-red-100 text-red-800 border-red-200',
      'discontinued': 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[status] || colors['in-stock'];
  };

  const getStockStatus = (item) => {
    if (item.currentStock === 0) return 'out-of-stock';
    if (item.currentStock <= item.minStock) return 'low-stock';
    return 'in-stock';
  };

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(getStockStatus(item));
    
    const matchesSupplier = selectedSuppliers.length === 0 || selectedSuppliers.includes(item.supplier);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatus([]);
    setSelectedSuppliers([]);
    setSearchTerm("");
  };

  const handleStatusClick = (status) => {
    setSelectedStatus([status]);
    setShowFilters(true);
  };

  const stats = {
    totalItems: inventory.length,
    inStock: inventory.filter(item => getStockStatus(item) === 'in-stock').length,
    lowStock: inventory.filter(item => getStockStatus(item) === 'low-stock').length,
    outOfStock: inventory.filter(item => getStockStatus(item) === 'out-of-stock').length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0),
    categories: new Set(inventory.map(item => item.category)).size
  };

  const statusCounts = {
    'in-stock': inventory.filter(item => getStockStatus(item) === 'in-stock').length,
    'low-stock': inventory.filter(item => getStockStatus(item) === 'low-stock').length,
    'out-of-stock': inventory.filter(item => getStockStatus(item) === 'out-of-stock').length
  };

  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || selectedStatus.length > 0 || selectedSuppliers.length > 0;

  return (
    <PageShell>
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Ozech Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-[#6B7B8E] mb-2">
              <span>Home</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#2A4D69] font-medium">Inventory</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#2A4D69] font-heading tracking-tight">Inventory Management</h1>
            <p className="text-[#6B7B8E] mt-1">
              Manage stock levels, track reorder points, and keep your inventory organised and up to date.
            </p>
          </div>
          <Button onClick={() => setIsAddingItem(true)} className="gap-2 bg-[#2A4D69] hover:bg-[#1e3a52] text-white shadow-md self-start">
            <Plus className="h-5 w-5" /> Add Item
          </Button>
        </div>


            {/* Metrics Row with Toggle */}
            <div className="space-y-2">
              <div className="flex justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMetrics(!showMetrics)}
                        className="text-white hover:text-white hover:bg-white/20"
                      >
                        {showMetrics ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                        {showMetrics ? "Hide Metrics" : "Show Metrics"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showMetrics ? "Collapse metrics panel" : "Expand metrics panel"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {showMetrics && (
                <MetricsRow stats={stats} onStatusClick={handleStatusClick} />
              )}
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col gap-4 animate-slide-up delay-150">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, SKU, description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white"
                    />
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFilters(!showFilters)}
                          className="bg-white"
                        >
                          <Filter className="h-4 w-4 mr-1" />
                          Filters
                          {hasActiveFilters && <Badge className="ml-1 bg-blue-500 text-white">!</Badge>}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle advanced filters</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {hasActiveFilters && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="bg-white"
                          >
                            <FilterX className="h-4 w-4 mr-1" />
                            Clear
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Clear all filters</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="flex rounded-md border bg-white">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-r-none"
                            onClick={() => setViewMode('grid')}
                          >
                            <Grid className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Grid view - Cards with expandable details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-l-none"
                            onClick={() => setViewMode('list')}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>List view - Table format with expandable rows</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={loadInventory} className="bg-white">
                          <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh inventory data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                          <Link href="/inventory/create">
                            <Plus className="h-4 w-4" />
                            New Item
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add new inventory item</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white rounded-lg border animate-slide-down">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {categories.map(category => (
                        <div key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, category]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category));
                              }
                            }}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <label htmlFor={`category-${category}`} className="ml-2 text-xs text-foreground">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Stock Status</label>
                    <div className="space-y-1">
                      {['in-stock', 'low-stock', 'out-of-stock'].map(status => (
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
                            className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <label htmlFor={`status-${status}`} className="ml-2 text-xs text-foreground capitalize">
                            {status.replace('-', ' ')} ({statusCounts[status]})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Supplier</label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {suppliers.map(supplier => (
                        <div key={supplier} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`supplier-${supplier}`}
                            checked={selectedSuppliers.includes(supplier)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSuppliers([...selectedSuppliers, supplier]);
                              } else {
                                setSelectedSuppliers(selectedSuppliers.filter(s => s !== supplier));
                              }
                            }}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <label htmlFor={`supplier-${supplier}`} className="ml-2 text-xs text-foreground">
                            {supplier}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end">
                    <div className="text-xs text-muted-foreground">
                      {hasActiveFilters && `${filteredInventory.length} items match`}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-white/80">
                Found <span className="font-semibold">{filteredInventory.length}</span> inventory items
                {hasActiveFilters && <span className="ml-1">(filtered)</span>}
              </p>
            </div>

            {/* Empty State */}
            {filteredInventory.length === 0 && (
              <Card className="text-center py-12 bg-white">
                <CardContent>
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {inventory.length === 0 ? 'No Inventory Items Yet' : 'No Items Found'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {inventory.length === 0 
                      ? 'Get started by adding your first inventory item to track stock levels and supplies.'
                      : 'No items match your search criteria. Try adjusting your filters.'
                    }
                  </p>
                  {inventory.length === 0 && (
                    <Button asChild className="bg-gradient-to-r from-emerald-600 to-green-600">
                      <Link href="/inventory/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Item
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Inventory Display */}
            {filteredInventory.length > 0 && (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredInventory.map((item) => (
                    <InventoryCard 
                      key={item.id} 
                      item={item}
                      onUpdate={updateItem}
                      onDelete={deleteItem}
                      getStatusColor={getStatusColor}
                      getStockStatus={getStockStatus}
                      isExpanded={expandedItems.has(item.id)}
                      onToggleExpand={() => toggleExpand(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredInventory.map((item) => (
                    <InventoryListItem 
                      key={item.id} 
                      item={item}
                      onUpdate={updateItem}
                      onDelete={deleteItem}
                      getStatusColor={getStatusColor}
                      getStockStatus={getStockStatus}
                      isExpanded={expandedItems.has(item.id)}
                      onToggleExpand={() => toggleExpand(item.id)}
                    />
                  ))}
                </div>
              )
            )}
          </main>
      </PageShell>
  );
}