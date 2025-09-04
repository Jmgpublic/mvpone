import { Package } from "lucide-react";
import ServiceRequestManagement from "./facility-management/service-request-management";
import OrderTracking from "./facility-management/order-tracking";

export default function FacilityManagement() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-secondary">Facility Management Dashboard</h2>
        <p className="text-gray-600 mt-2">Manage assets, service requests, and maintenance operations</p>
      </div>

      {/* Service Request Management - Full Width Priority */}
      <div className="mb-6">
        <ServiceRequestManagement />
      </div>

      {/* Order Tracking - Full Width */}
      <div className="mb-6">
        <OrderTracking />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Asset Management</h3>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">TBD: Inventory management for appliances, sensors, and mechanical systems</p>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-resident-appliances"
            >
              <div className="font-medium text-secondary">Resident Appliances</div>
              <div className="text-sm text-gray-500">TBD: Track and manage tenant appliances</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-sensors"
            >
              <div className="font-medium text-secondary">Sensors Management</div>
              <div className="text-sm text-gray-500">TBD: Monitor installed sensors</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
