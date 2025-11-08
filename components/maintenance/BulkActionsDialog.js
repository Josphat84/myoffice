// frontend/components/maintenance/BulkActionsDialog.js

'use client';
import { useState } from 'react';

export default function BulkActionsDialog({
  isOpen,
  onClose,
  selectedWorkOrders,
  onBulkUpdate
}) {
  const [action, setAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!action || selectedWorkOrders.length === 0) return;

    setIsLoading(true);
    try {
      // Perform bulk action here
      await onBulkUpdate?.(selectedWorkOrders, action);
      onClose();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Bulk Actions</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action for {selectedWorkOrders.length} selected work orders:
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select an action</option>
              <option value="update-status">Update Status</option>
              <option value="assign-technician">Assign Technician</option>
              <option value="change-priority">Change Priority</option>
              <option value="add-tags">Add Tags</option>
              <option value="delete">Delete</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !action}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Apply Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}