// app/ppe/allocate/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Shield,
  User,
  Package,
  Calendar,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function CreateAllocationPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [ppeItems, setPpeItems] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    ppeItemId: '',
    serialNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    condition: 'good',
    notes: ''
  });

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    // Load employees and PPE items
    const employeesResponse = await fetch('/api/employees');
    if (employeesResponse.ok) {
      setEmployees(await employeesResponse.json());
    }

    const storedItems = localStorage.getItem('ppe-items');
    if (storedItems) {
      setPpeItems(JSON.parse(storedItems));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get selected employee and PPE item details
    const employee = employees.find(emp => emp.id === formData.employeeId);
    const ppeItem = ppeItems.find(item => item.id === formData.ppeItemId);
    
    const newAllocation = {
      ...formData,
      employeeName: employee?.name || 'Unknown',
      ppeItemName: ppeItem?.itemName || 'Unknown',
      ppeCategory: ppeItem?.category || 'unknown',
      size: ppeItem?.size || 'Universal',
      status: 'active',
      issuedBy: 'current-user' // In real app, get from auth
    };

    // Save allocation (you'd integrate with your state management)
    const existingAllocations = JSON.parse(localStorage.getItem('ppe-allocations') || '[]');
    const updatedAllocations = [...existingAllocations, {
      ...newAllocation,
      id: `alloc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
    
    localStorage.setItem('ppe-allocations', JSON.stringify(updatedAllocations));
    router.push('/ppe');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950/20">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/ppe" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to PPE</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Allocate Protective Equipment</CardTitle>
                  <CardDescription className="text-blue-100">
                    Assign PPE items to employees and track allocation details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Employee</label>
                    <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* PPE Item Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">PPE Item</label>
                    <Select value={formData.ppeItemId} onValueChange={(value) => setFormData({...formData, ppeItemId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select PPE item" />
                      </SelectTrigger>
                      <SelectContent>
                        {ppeItems.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.itemName} ({item.size})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Serial Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Serial Number</label>
                    <Input
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                      placeholder="Enter serial number"
                      required
                    />
                  </div>

                  {/* Condition */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Condition</label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="worn">Worn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Issue Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Issue Date</label>
                    <Input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                      required
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes about this allocation..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/ppe">
                      Cancel
                    </Link>
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                    <Save className="h-4 w-4 mr-2" />
                    Create Allocation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}