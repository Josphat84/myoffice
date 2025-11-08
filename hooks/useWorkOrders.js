// frontend/hooks/useWorkOrders.js

'use client';
import { useState, useEffect } from 'react';

export function useWorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data - replace with actual API calls
  const mockWorkOrders = [
    {
      id: '1',
      title: 'Fix HVAC System',
      description: 'The HVAC system in the main office is not cooling properly',
      status: 'pending',
      priority: 'high',
      assignedTo: 'John Doe',
      dueDate: '2024-01-15',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Replace Light Bulbs',
      description: 'Replace burned out light bulbs in hallway',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: 'Jane Smith',
      dueDate: '2024-01-20',
      createdAt: '2024-01-08'
    },
    {
      id: '3',
      title: 'Paint Conference Room',
      description: 'Repaint the conference room walls',
      status: 'completed',
      priority: 'low',
      assignedTo: 'Mike Johnson',
      dueDate: '2024-01-05',
      createdAt: '2024-01-01'
    }
  ];

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWorkOrders(mockWorkOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  const createWorkOrder = async (workOrderData) => {
    try {
      const newWorkOrder = {
        id: Date.now().toString(),
        ...workOrderData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setWorkOrders(prev => [...prev, newWorkOrder]);
      return newWorkOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateWorkOrder = async (id, updates) => {
    try {
      setWorkOrders(prev => 
        prev.map(order => 
          order.id === id ? { ...order, ...updates } : order
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteWorkOrder = async (id) => {
    try {
      setWorkOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    workOrders,
    loading,
    error,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder
  };
}

export default useWorkOrders;