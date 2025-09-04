import { MessageSquare, User, CreditCard } from "lucide-react";
import ServiceRequests from "./resident-portal/service-requests";

export default function ResidentPortal() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-secondary">Resident Portal Dashboard</h2>
        <p className="text-gray-600 mt-2">Resident-facing services and account management</p>
      </div>
      
      {/* Service Requests - Full Width Priority */}
      <div className="mb-6">
        <ServiceRequests />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Messaging</h3>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">TBD: Communication tools and notifications</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-view-messages"
          >
            View Messages
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Resident Profile</h3>
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">TBD: Profile management and settings</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-manage-profile"
          >
            Manage Profile
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Account Information</h3>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">View transactions and payment portal</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-view-account"
          >
            View Account
          </button>
        </div>
      </div>
    </div>
  );
}
