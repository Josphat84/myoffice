// frontend/components/maintenance/ExportDialog.js


'use client';
import { useState } from 'react';

export default function ExportDialog({
  isOpen,
  onClose,
  workOrders,
  onExport
}) {
  const [format, setFormat] = useState('csv');
  const [includeFields, setIncludeFields] = useState(['title', 'status', 'priority']);

  const handleExport = () => {
    onExport?.(workOrders, format, includeFields);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Export Work Orders</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format:
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}