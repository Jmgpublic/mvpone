import { FileText, Calendar, TrendingUp } from "lucide-react";

export default function CaseManagement() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-secondary">Case Management Dashboard</h2>
        <p className="text-gray-600 mt-2">Individual resident case management and scheduling</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Case Definition</h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">TBD: Define and assign cases to residents</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-manage-cases"
          >
            Manage Cases
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Scheduling</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">TBD: Schedule appointments and manage staff availability</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-view-schedule"
          >
            View Schedule
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Case Lifecycle</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">TBD: Track case progress and resolution</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-track-cases"
          >
            Track Cases
          </button>
        </div>
      </div>
    </div>
  );
}
