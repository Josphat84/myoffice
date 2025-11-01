// app/inventory/page.js
"use client";

import { useState, useEffect } from "react";
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
  MapPin // Added missing import
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INVENTORY_STORAGE_KEY = 'inventory-items';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  // Sample data
  const categories = ['Electronics', 'Mechanical', 'Consumables', 'Safety', 'Tools', 'Office Supplies'];
  const suppliers = ['TechSupply Inc', 'Industrial Parts Co', 'SafetyFirst Ltd', 'Global Tools', 'Office Depot'];

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
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

  const createItem = (newItem) => {
    const items = [...inventory, { ...newItem, id: `inv-${Date.now()}`, createdAt: new Date().toISOString() }];
    setInventory(items);
    saveInventory(items);
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
    
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(item.status);
    
    const matchesSupplier = selectedSuppliers.length === 0 || selectedSuppliers.includes(item.supplier);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatus([]);
    setSelectedSuppliers([]);
    setSearchTerm("");
  };

  const stats = {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => getStockStatus(item) === 'low-stock').length,
    outOfStock: inventory.filter(item => getStockStatus(item) === 'out-of-stock').length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)
  };

  const statusCounts = {
    'in-stock': inventory.filter(item => getStockStatus(item) === 'in-stock').length,
    'low-stock': inventory.filter(item => getStockStatus(item) === 'low-stock').length,
    'out-of-stock': inventory.filter(item => getStockStatus(item) === 'out-of-stock').length
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 shadow-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-foreground">Inventory Management</span>
                  <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider hidden sm:inline-block">
                    Stock Control & Supplies
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
              <Link href="/equipment" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Assets
              </Link>
              <Link href="/overtime" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Overtime
              </Link>
              <Link href="/inventory" className="text-sm font-semibold text-primary transition-colors">
                Inventory
              </Link>
            </nav>

            <Button size="sm" asChild className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800">
              <Link href="/inventory/create">
                <Plus className="h-4 w-4 mr-2" />
                New Item
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
                Inventory Management
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Track stock levels, manage supplies, and monitor inventory value
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
              <Button variant="outline" size="sm" onClick={loadInventory}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-emerald-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.totalItems}</div>
                    <div className="text-sm text-muted-foreground">Total Items</div>
                  </div>
                  <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                    <PackageOpen className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-amber-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.lowStock}</div>
                    <div className="text-sm text-muted-foreground">Low Stock</div>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-red-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.outOfStock}</div>
                    <div className="text-sm text-muted-foreground">Out of Stock</div>
                  </div>
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
                    <Package className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">${stats.totalValue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <BarChart3 className="h-6 w-6" />
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
                      placeholder="Search inventory by name, SKU, description..."
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
                    {(selectedCategories.length > 0 || selectedStatus.length > 0 || selectedSuppliers.length > 0) && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                        {selectedCategories.length + selectedStatus.length + selectedSuppliers.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Filter Inventory</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <div className="space-y-2">
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
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor={`category-${category}`} className="ml-2 text-sm text-foreground">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Stock Status</label>
                      <div className="space-y-2">
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
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor={`status-${status}`} className="ml-2 text-sm text-foreground capitalize">
                              {status.replace('-', ' ')} ({statusCounts[status]})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Supplier Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Supplier</label>
                      <div className="space-y-2">
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
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor={`supplier-${supplier}`} className="ml-2 text-sm text-foreground">
                              {supplier}
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

          {/* Inventory Display */}
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="all" className="relative">
                  All Items
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {filteredInventory.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="in-stock" className="relative">
                  In Stock
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts['in-stock']}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="low-stock" className="relative">
                  Low Stock
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts['low-stock']}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="out-of-stock" className="relative">
                  Out of Stock
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {statusCounts['out-of-stock']}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              {filteredInventory.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Showing {filteredInventory.length} of {inventory.length} items
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredInventory.length === 0 && (
              <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 flex items-center justify-center mb-6">
                      <Package className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                      {inventory.length === 0 ? 'No Inventory Items Yet' : 'No Items Found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {inventory.length === 0 
                        ? 'Get started by adding your first inventory item to track stock levels and supplies.'
                        : 'No items match your search criteria. Try adjusting your filters.'
                      }
                    </p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 shadow-md">
                      <Link href="/inventory/create">
                        <Plus className="h-5 w-5 mr-2" />
                        Add First Item
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inventory Grid/List View */}
            {filteredInventory.length > 0 && (
              <TabsContent value="all" className="space-y-4">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredInventory.map((item) => (
                      <InventoryCard 
                        key={item.id} 
                        item={item}
                        onUpdate={updateItem}
                        onDelete={deleteItem}
                        getStatusColor={getStatusColor}
                        getStockStatus={getStockStatus}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredInventory.map((item) => (
                      <InventoryListItem 
                        key={item.id} 
                        item={item}
                        onUpdate={updateItem}
                        onDelete={deleteItem}
                        getStatusColor={getStatusColor}
                        getStockStatus={getStockStatus}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* Filtered Status Tabs */}
            {['in-stock', 'low-stock', 'out-of-stock'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {filteredInventory.filter(item => getStockStatus(item) === status).length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredInventory
                        .filter(item => getStockStatus(item) === status)
                        .map((item) => (
                          <InventoryCard 
                            key={item.id} 
                            item={item}
                            onUpdate={updateItem}
                            onDelete={deleteItem}
                            getStatusColor={getStatusColor}
                            getStockStatus={getStockStatus}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredInventory
                        .filter(item => getStockStatus(item) === status)
                        .map((item) => (
                          <InventoryListItem 
                            key={item.id} 
                            item={item}
                            onUpdate={updateItem}
                            onDelete={deleteItem}
                            getStatusColor={getStatusColor}
                            getStockStatus={getStockStatus}
                          />
                        ))}
                    </div>
                  )
                ) : (
                  <Card className="shadow-sm border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-12 text-center">
                      <div className="mx-auto max-w-md">
                        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          No {status.replace('-', ' ')} Items
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {status === 'in-stock' 
                            ? 'All items need attention. Check low stock and out of stock items.'
                            : `No items are currently ${status.replace('-', ' ')}.`
                          }
                        </p>
                        <Button asChild>
                          <Link href="/inventory/create">
                            Add New Item
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

// Inventory Card Component (Grid View)
function InventoryCard({ item, onUpdate, onDelete, getStatusColor, getStockStatus }) {
  const [showActions, setShowActions] = useState(false);
  
  const stockStatus = getStockStatus(item);
  const stockPercentage = (item.currentStock / item.maxStock) * 100;
  const needsReorder = item.currentStock <= item.minStock;

  const formattedDate = new Date(item.lastRestocked).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-l-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-emerald-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                SKU: {item.sku}
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
                  <Link href={`/inventory/edit/${item.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3"
                  asChild
                >
                  <Link href={`/inventory/restock/${item.id}`}>
                    <Truck className="h-4 w-4 mr-2" />
                    Restock
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this inventory item?')) {
                      onDelete(item.id);
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
          {item.description}
        </p>
        
        {/* Stock Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Warehouse className="h-4 w-4" />
              <span>{item.location}</span>
            </div>
            <Badge variant="outline" className={`${getStatusColor(stockStatus)} border`}>
              {stockStatus.replace('-', ' ')}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{item.supplier}</span>
            </div>
            <div className="text-sm font-medium">
              ${item.cost} / {item.unit}
            </div>
          </div>

          {/* Stock Level */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Stock Level</span>
              <span>{item.currentStock} / {item.maxStock} {item.unit}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  stockStatus === 'out-of-stock' ? 'bg-red-500' :
                  stockStatus === 'low-stock' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: {item.minStock}</span>
              <span>Last restocked: {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-2" asChild>
            <Link href={`/inventory/view/${item.id}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
          {needsReorder && (
            <Button 
              size="sm" 
              className="gap-2 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 shadow-md"
              asChild
            >
              <Link href={`/inventory/restock/${item.id}`}>
                <ShoppingCart className="h-4 w-4" />
                Reorder
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Inventory List Item Component (List View)
function InventoryListItem({ item, onUpdate, onDelete, getStatusColor, getStockStatus }) {
  const [showActions, setShowActions] = useState(false);
  
  const stockStatus = getStockStatus(item);
  const needsReorder = item.currentStock <= item.minStock;

  const formattedDate = new Date(item.lastRestocked).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <Package className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {item.name}
                </h3>
                <Badge variant="outline" className={`${getStatusColor(stockStatus)} border`}>
                  {stockStatus.replace('-', ' ')}
                </Badge>
                {needsReorder && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                    Needs Reorder
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <span>SKU: {item.sku}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{item.supplier}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>${item.cost} / {item.unit}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {item.currentStock}
              </div>
              <div className="text-sm text-muted-foreground">
                of {item.maxStock} {item.unit}
              </div>
            </div>
            
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href={`/inventory/view/${item.id}`}>
                <Eye className="h-4 w-4" />
                View
              </Link>
            </Button>
            
            {needsReorder && (
              <Button 
                size="sm" 
                className="gap-2 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 shadow-md"
                asChild
              >
                <Link href={`/inventory/restock/${item.id}`}>
                  <ShoppingCart className="h-4 w-4" />
                  Reorder
                </Link>
              </Button>
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
                    <Link href={`/inventory/edit/${item.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3"
                    asChild
                  >
                    <Link href={`/inventory/restock/${item.id}`}>
                      <Truck className="h-4 w-4 mr-2" />
                      Restock
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this inventory item?')) {
                        onDelete(item.id);
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