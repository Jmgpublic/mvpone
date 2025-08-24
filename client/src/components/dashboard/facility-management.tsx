import { Settings, Package, Wrench } from "lucide-react";

export default function FacilityManagement() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-secondary">Facility Management Dashboard</h2>
        <p className="text-gray-600 mt-2">Manage assets, service requests, and maintenance operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Service Requests</h3>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">Process and manage maintenance requests</p>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-service-processing"
            >
              <div className="font-medium text-secondary">Service Request Processing</div>
              <div className="text-sm text-gray-500">TBD: Acknowledge and process requests</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Maintenance Execution</h3>
            <Wrench className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">TBD: Work order management and scheduling</p>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-work-orders"
            >
              <div className="font-medium text-secondary">Work Orders</div>
              <div className="text-sm text-gray-500">TBD: Assign and schedule work orders</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
