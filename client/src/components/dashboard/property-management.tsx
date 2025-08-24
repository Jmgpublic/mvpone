import { Building2, Users, DollarSign, AlertTriangle } from "lucide-react";

export default function PropertyManagement() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-secondary">Property Management Dashboard</h2>
        <p className="text-gray-600 mt-2">Manage properties, tenants, and financial operations</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-secondary" data-testid="stat-total-properties">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tenants</p>
              <p className="text-2xl font-bold text-secondary" data-testid="stat-active-tenants">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-secondary" data-testid="stat-monthly-revenue">$0</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Issues</p>
              <p className="text-2xl font-bold text-secondary" data-testid="stat-pending-issues">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Definition Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Site Definition</h3>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">Manage site records, space rosters, and documentation</p>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-site-records"
            >
              <div className="font-medium text-secondary">Site Record Maintenance</div>
              <div className="text-sm text-gray-500">Add, edit, and manage property records</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-space-roster"
            >
              <div className="font-medium text-secondary">Space Roster Management</div>
              <div className="text-sm text-gray-500">Organize and categorize property spaces</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-documentation"
            >
              <div className="font-medium text-secondary">Documentation Management</div>
              <div className="text-sm text-gray-500">Store and organize property documents</div>
            </button>
          </div>
        </div>

        {/* Tenant Lifecycle Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Tenant Lifecycle Management</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">Handle tenant onboarding, management, and offboarding processes</p>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-onboarding"
            >
              <div className="font-medium text-secondary">Onboarding Process</div>
              <div className="text-sm text-gray-500">TBD: Tenant onboarding workflow</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-tenant-crud"
            >
              <div className="font-medium text-secondary">Tenant CRUD Operations</div>
              <div className="text-sm text-gray-500">Create, update, and manage tenant records</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-lease-management"
            >
              <div className="font-medium text-secondary">Lease Management</div>
              <div className="text-sm text-gray-500">Handle lease agreements and renewals</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-waitlist"
            >
              <div className="font-medium text-secondary">Waitlist Management</div>
              <div className="text-sm text-gray-500">TBD: Manage tenant waiting lists</div>
            </button>
          </div>
        </div>

        {/* Financial Functions Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Financial Functions</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">Manage payments, expenses, and financial cycles</p>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-payment-processing"
            >
              <div className="font-medium text-secondary">Payment Processing</div>
              <div className="text-sm text-gray-500">TBD: Handle rent and deposit payments</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-monthly-cycle"
            >
              <div className="font-medium text-secondary">Monthly Cycle</div>
              <div className="text-sm text-gray-500">TBD: Rent accrual and notifications</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-reconciliation"
            >
              <div className="font-medium text-secondary">Account Reconciliation</div>
              <div className="text-sm text-gray-500">TBD: Period closings and reconciliation</div>
            </button>
          </div>
        </div>

        {/* Message Management Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Message Management</h3>
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">Handle notifications, news, and resident communications</p>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-notifications"
            >
              <div className="font-medium text-secondary">Notifications</div>
              <div className="text-sm text-gray-500">TBD: Send and manage notifications</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-news-events"
            >
              <div className="font-medium text-secondary">News and Events</div>
              <div className="text-sm text-gray-500">TBD: Post community news and events</div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-secondary mb-4">Recent Activities</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No recent activities to display</p>
        </div>
      </div>
    </div>
  );
}
