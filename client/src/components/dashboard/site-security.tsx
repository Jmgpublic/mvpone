import { Calendar, AlertCircle, Key } from "lucide-react";

export default function SiteSecurity() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-secondary">Site Security Dashboard</h2>
        <p className="text-gray-600 mt-2">Security operations and incident management</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Guard Scheduling</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">TBD: Manage security guard shifts and schedules</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-manage-schedule"
          >
            Manage Schedule
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Incident Reporting</h3>
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">Report and track security incidents</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-report-incident"
          >
            Report Incident
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Access Control</h3>
            <Key className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">Visitor sign-in and package handling</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-manage-access"
          >
            Manage Access
          </button>
        </div>
      </div>
    </div>
  );
}
