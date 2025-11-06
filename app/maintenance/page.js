// app/maintenance/page.jsx
import { MaintenanceDashboard } from '@/components/maintenance/MaintenanceDashboard';

export const metadata = {
  title: 'Maintenance Management - MyOffice',
  description: 'Track and manage maintenance work orders, job cards, and equipment maintenance history',
};

export default function MaintenancePage() {
  return (
    <div className="container mx-auto py-6">
      <MaintenanceDashboard />
    </div>
  );
}