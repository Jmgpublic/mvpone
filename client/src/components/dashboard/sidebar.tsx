import { useState } from "react";
import { Building2, Settings, Users, Shield, Clipboard, BarChart3, ChevronDown, FileText, MessageSquare, UserCheck, Wrench, Calendar, AlertTriangle, UserPlus, CreditCard, BarChart, Home, FileInput } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

type Branch = 'property-management' | 'facility-management' | 'resident-portal' | 'site-security' | 'case-management' | 'admin-analytics';

interface SidebarProps {
  activeBranch: Branch;
  onBranchChange: (branch: Branch) => void;
}

interface Panel {
  id: string;
  title: string;
  icon?: React.ElementType;
  isSubDashboard?: boolean;
  route?: string;
  isImplemented?: boolean;
}

interface BranchConfig {
  id: Branch;
  title: string;
  icon: React.ElementType;
  panels: Panel[];
}



const branches: BranchConfig[] = [
  {
    id: 'property-management',
    title: 'Property Management',
    icon: Building2,
    panels: [
      { id: 'overview', title: 'Dashboard Overview', icon: Home, isImplemented: true },
      { id: 'site-definition', title: 'Site Definition', icon: Building2, isImplemented: true },
      { id: 'messaging', title: 'Messaging', icon: MessageSquare, isImplemented: true },
      { id: 'documentation', title: 'Documentation & Formage', icon: FileText, isImplemented: false },
      { id: 'tenant-lifecycle', title: 'Tenant Lifecycle', icon: UserCheck, isSubDashboard: true, isImplemented: false },
    ]
  },
  {
    id: 'facility-management',
    title: 'Facility Management',
    icon: Settings,
    panels: [
      { id: 'asset-management', title: 'Asset Management', icon: Settings, isImplemented: false },
      { id: 'service-requests', title: 'Service Requests', icon: Wrench, isImplemented: false },
      { id: 'maintenance-execution', title: 'Maintenance Execution', icon: Settings, isImplemented: false },
    ]
  },
  {
    id: 'resident-portal',
    title: 'Resident Portal',
    icon: Users,
    panels: [
      { id: 'messaging', title: 'Messaging', icon: MessageSquare, isImplemented: false },
      { id: 'resident-profile', title: 'Resident Profile', icon: UserCheck, isImplemented: false },
      { id: 'account-info', title: 'Account Information', icon: CreditCard, isImplemented: false },
    ]
  },
  {
    id: 'site-security',
    title: 'Site Security',
    icon: Shield,
    panels: [
      { id: 'guard-scheduling', title: 'Guard Scheduling', icon: Calendar, isImplemented: false },
      { id: 'incident-reporting', title: 'Incident Reporting', icon: AlertTriangle, isImplemented: false },
      { id: 'access-control', title: 'Access Control', icon: Shield, isImplemented: false },
    ]
  },
  {
    id: 'case-management',
    title: 'Case Management',
    icon: Clipboard,
    panels: [
      { id: 'case-definition', title: 'Case Definition', icon: Clipboard, isImplemented: false },
      { id: 'scheduling', title: 'Scheduling', icon: Calendar, isImplemented: false },
      { id: 'case-lifecycle', title: 'Case Lifecycle', icon: UserPlus, isImplemented: false },
    ]
  },
  {
    id: 'admin-analytics',
    title: 'Admin & Analytics',
    icon: BarChart3,
    panels: [
      { id: 'user-management', title: 'User Management', icon: Users, isImplemented: false },
      { id: 'reporting', title: 'Reporting', icon: FileText, isImplemented: false },
      { id: 'analytics', title: 'Analytics', icon: BarChart, isImplemented: false },
    ]
  },
];

export default function Sidebar({ activeBranch, onBranchChange }: SidebarProps) {
  const [expandedBranches, setExpandedBranches] = useState<Set<Branch>>(new Set([activeBranch]));

  const toggleBranch = (branchId: Branch) => {
    const newExpanded = new Set(expandedBranches);
    
    if (expandedBranches.has(branchId)) {
      newExpanded.delete(branchId);
    } else {
      newExpanded.add(branchId);
    }
    
    setExpandedBranches(newExpanded);
    onBranchChange(branchId);
  };

  const handlePanelClick = (panelId: string, isImplemented: boolean = true) => {
    if (!isImplemented) return;
    // Panel functionality is handled by the parent component
  };

  return (
    <nav className="w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="space-y-4">
          {/* Dashboard Branches */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">Dashboards</h3>
          {branches.map((branch) => {
            const Icon = branch.icon;
            const isActive = activeBranch === branch.id;
            const isExpanded = expandedBranches.has(branch.id);

            return (
              <div key={branch.id} className="branch-section">
                <button
                  className={cn(
                    "w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 text-secondary hover:bg-gray-200"
                  )}
                  onClick={() => toggleBranch(branch.id)}
                  data-testid={`button-branch-${branch.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{branch.title}</span>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 transform transition-transform",
                      isExpanded ? "rotate-0" : "rotate-90"
                    )}
                  />
                </button>
                
                {isExpanded && (
                  <div className="mt-2 ml-4 space-y-1">
                    {branch.panels.map((panel) => {
                      const PanelIcon = panel.icon;
                      const isImplemented = panel.isImplemented ?? true;
                      return (
                        <button
                          key={panel.id}
                          className={cn(
                            "w-full flex items-center space-x-2 p-2 text-sm rounded transition-colors text-left",
                            isImplemented 
                              ? "text-secondary hover:bg-gray-50 hover:text-primary cursor-pointer"
                              : "text-gray-400 cursor-not-allowed"
                          )}
                          data-testid={`link-panel-${panel.id}`}
                          onClick={() => handlePanelClick(panel.id, isImplemented)}
                          disabled={!isImplemented}
                        >
                          {PanelIcon && <PanelIcon className="w-4 h-4" />}
                          <span className="flex-1">{panel.title}</span>
                          <div className="flex items-center space-x-1">
                            {!isImplemented && (
                              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                Soon
                              </span>
                            )}
                            {panel.isSubDashboard && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                                Sub
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </nav>
  );
}
