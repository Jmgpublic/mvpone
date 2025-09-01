import { useState } from "react";
import { Building2, Settings, Users, Shield, Clipboard, BarChart3, ChevronDown, FileText, MessageSquare, UserCheck, Wrench, Calendar, AlertTriangle, UserPlus, CreditCard, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

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
      { id: 'overview', title: 'Dashboard Overview', icon: Building2 },
      { id: 'site-definition', title: 'Site Definition', icon: Building2 },
      { id: 'documentation', title: 'Documentation & Formage', icon: FileText },
      { id: 'messaging', title: 'Messaging', icon: MessageSquare },
      { id: 'tenant-lifecycle', title: 'Tenant Lifecycle', icon: UserCheck, isSubDashboard: true },
    ]
  },
  {
    id: 'facility-management',
    title: 'Facility Management',
    icon: Settings,
    panels: [
      { id: 'asset-management', title: 'Asset Management', icon: Settings },
      { id: 'service-requests', title: 'Service Requests', icon: Wrench },
      { id: 'maintenance-execution', title: 'Maintenance Execution', icon: Settings },
    ]
  },
  {
    id: 'resident-portal',
    title: 'Resident Portal',
    icon: Users,
    panels: [
      { id: 'messaging', title: 'Messaging', icon: MessageSquare },
      { id: 'resident-profile', title: 'Resident Profile', icon: UserCheck },
      { id: 'account-info', title: 'Account Information', icon: CreditCard },
    ]
  },
  {
    id: 'site-security',
    title: 'Site Security',
    icon: Shield,
    panels: [
      { id: 'guard-scheduling', title: 'Guard Scheduling', icon: Calendar },
      { id: 'incident-reporting', title: 'Incident Reporting', icon: AlertTriangle },
      { id: 'access-control', title: 'Access Control', icon: Shield },
    ]
  },
  {
    id: 'case-management',
    title: 'Case Management',
    icon: Clipboard,
    panels: [
      { id: 'case-definition', title: 'Case Definition', icon: Clipboard },
      { id: 'scheduling', title: 'Scheduling', icon: Calendar },
      { id: 'case-lifecycle', title: 'Case Lifecycle', icon: UserPlus },
    ]
  },
  {
    id: 'admin-analytics',
    title: 'Admin & Analytics',
    icon: BarChart3,
    panels: [
      { id: 'user-management', title: 'User Management', icon: Users },
      { id: 'reporting', title: 'Reporting', icon: FileText },
      { id: 'analytics', title: 'Analytics', icon: BarChart },
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

  return (
    <nav className="w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="space-y-2">
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
                      return (
                        <a
                          key={panel.id}
                          href="#"
                          className="flex items-center space-x-2 p-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary rounded transition-colors"
                          data-testid={`link-panel-${panel.id}`}
                          onClick={(e) => e.preventDefault()}
                        >
                          {PanelIcon && <PanelIcon className="w-4 h-4" />}
                          <span className="flex-1">{panel.title}</span>
                          {panel.isSubDashboard && (
                            <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                              Sub
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
