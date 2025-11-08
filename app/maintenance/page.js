// frontend/app/maintenance/page.js

'use client';
import MaintenanceContent from "@/components/maintenance/MaintenanceContent";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { usePreferences } from "@/hooks/usePreferences";
import { useFilters } from "@/hooks/useFilters";
import { toast } from "sonner";
import { useEffect, useState } from "react";

// Function to calculate work order statistics
function calculateWorkOrderStats(workOrders) {
  if (!workOrders || !Array.isArray(workOrders)) {
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      onHold: 0,
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0
    };
  }

  return {
    total: workOrders.length,
    pending: workOrders.filter(wo => wo.status === 'pending').length,
    inProgress: workOrders.filter(wo => wo.status === 'in-progress').length,
    completed: workOrders.filter(wo => wo.status === 'completed').length,
    onHold: workOrders.filter(wo => wo.status === 'on-hold').length,
    urgent: workOrders.filter(wo => wo.priority === 'urgent').length,
    high: workOrders.filter(wo => wo.priority === 'high').length,
    medium: workOrders.filter(wo => wo.priority === 'medium').length,
    low: workOrders.filter(wo => wo.priority === 'low').length
  };
}

// Function to generate AI recommendations
function generateAIRecommendations(workOrders, stats) {
  if (!workOrders || workOrders.length === 0) {
    return ["No work orders available for analysis."];
  }

  const recommendations = [];

  // Check for overdue work orders
  const today = new Date();
  const overdue = workOrders.filter(wo => 
    wo.dueDate && new Date(wo.dueDate) < today && wo.status !== 'completed'
  );
  
  if (overdue.length > 0) {
    recommendations.push(`You have ${overdue.length} overdue work orders that need immediate attention.`);
  }

  // Check for high priority pending items
  const highPriorityPending = workOrders.filter(wo => 
    (wo.priority === 'high' || wo.priority === 'urgent') && wo.status === 'pending'
  );
  
  if (highPriorityPending.length > 0) {
    recommendations.push(`Prioritize ${highPriorityPending.length} high-priority pending work orders.`);
  }

  // Check work distribution
  if (stats.pending > stats.inProgress + stats.completed) {
    recommendations.push("Consider assigning more resources to pending work orders to improve workflow.");
  }

  // Check completion rate
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  if (completionRate < 50) {
    recommendations.push("Work order completion rate is low. Review processes and resource allocation.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Your maintenance operations are running smoothly. Keep up the good work!");
  }

  return recommendations;
}

export default function MaintenancePage() {
  const { workOrders, loading, error, createWorkOrder, updateWorkOrder, deleteWorkOrder } = useWorkOrders();
  const { preferences, updatePreference } = usePreferences();
  const { filteredData, filters, updateFilter, clearFilters, sortConfig, handleSort } = useFilters(workOrders || []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate statistics safely
  const workOrderStats = calculateWorkOrderStats(workOrders);
  
  // Calculate efficiency safely
  const calculateEfficiency = () => {
    if (!workOrders || workOrders.length === 0) return 0;
    
    const totalCompletionRate = workOrders.reduce((sum, wo) => {
      // Calculate completion rate based on status
      let rate = 0;
      switch (wo.status) {
        case 'completed': rate = 100; break;
        case 'in-progress': rate = 50; break;
        case 'on-hold': rate = 25; break;
        case 'pending': rate = 0; break;
        default: rate = 0;
      }
      return sum + rate;
    }, 0);
    
    return Math.round(totalCompletionRate / workOrders.length);
  };

  // Determine trending safely
  const getTrendingStatus = () => {
    if (workOrderStats.inProgress > workOrderStats.pending) {
      return 'improving';
    } else if (workOrderStats.inProgress < workOrderStats.pending) {
      return 'declining';
    } else {
      return 'stable';
    }
  };

  // Prepare dashboard data
  const dashboardData = {
    totalWorkOrders: workOrderStats.total,
    completed: workOrderStats.completed,
    inProgress: workOrderStats.inProgress,
    pending: workOrderStats.pending,
    onHold: workOrderStats.onHold,
    urgent: workOrderStats.urgent,
    high: workOrderStats.high,
    medium: workOrderStats.medium,
    low: workOrderStats.low,
    efficiency: calculateEfficiency(),
    trending: getTrendingStatus(),
    recommendations: generateAIRecommendations(workOrders, workOrderStats)
  };

  // Handle work order creation
  const handleCreateWorkOrder = async (workOrderData) => {
    try {
      await createWorkOrder(workOrderData);
      toast.success('Work order created successfully');
    } catch (err) {
      console.error('Failed to create work order:', err);
      toast.error('Failed to create work order');
    }
  };

  // Handle work order update
  const handleUpdateWorkOrder = async (id, updates) => {
    try {
      await updateWorkOrder(id, updates);
      toast.success('Work order updated successfully');
    } catch (err) {
      console.error('Failed to update work order:', err);
      toast.error('Failed to update work order');
    }
  };

  // Handle work order deletion
  const handleDeleteWorkOrder = async (id) => {
    try {
      await deleteWorkOrder(id);
      toast.success('Work order deleted successfully');
    } catch (err) {
      console.error('Failed to delete work order:', err);
      toast.error('Failed to delete work order');
    }
  };

  // Handle preference updates
  const handleUpdatePreference = async (key, value) => {
    try {
      await updatePreference(key, value);
      toast.success('Preference updated successfully');
    } catch (err) {
      console.error('Failed to update preference:', err);
      toast.error('Failed to update preference');
    }
  };

  // Handle filter updates
  const handleUpdateFilter = (filterType, value) => {
    try {
      updateFilter(filterType, value);
    } catch (err) {
      console.error('Failed to update filter:', err);
      toast.error('Failed to update filter');
    }
  };

  // Handle sort
  const handleSortRequest = (key) => {
    try {
      handleSort(key);
    } catch (err) {
      console.error('Failed to sort:', err);
      toast.error('Failed to sort work orders');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Loading work orders...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error Loading Work Orders</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Wait for client-side mounting to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MaintenanceContent
        workOrders={filteredData || []}
        dashboardData={dashboardData}
        preferences={preferences || {}}
        filters={filters || {}}
        sortConfig={sortConfig}
        onCreateWorkOrder={handleCreateWorkOrder}
        onUpdateWorkOrder={handleUpdateWorkOrder}
        onDeleteWorkOrder={handleDeleteWorkOrder}
        onUpdatePreference={handleUpdatePreference}
        onUpdateFilter={handleUpdateFilter}
        onClearFilters={clearFilters}
        onSort={handleSortRequest}
        loading={loading}
      />
    </div>
  );
}