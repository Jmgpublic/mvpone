import { useState } from "react";
import { Building2, Settings, Users, Shield, Clipboard, BarChart3, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Branch = 'property-management' | 'facility-management' | 'resident-portal' | 'site-security' | 'case-management' | 'admin-analytics';

interface SidebarProps {
  activeBranch: Branch;
  onBranchChange: (branch: Branch) => void;
}

interface BranchConfig {
  id: Branch;
  title: string;
  icon: React.ElementType;
  panels: { id: string; title: string }[];
}

const branches: BranchConfig[] = [
  {
    id: 'property-management',
    title: 'Property Management',
    icon: Building2,
    panels: [
      { id: 'site-definition', title: 'Site Definition' },
      { id: 'tenant-lifecycle', title: 'Tenant Lifecycle' },
      { id: 'financial-functions', title: 'Financial Functions' },
      { id: 'message-management', title: 'Message Management' },
    ]
  },
  {
    id: 'facility-management',
    title: 'Facility Management',
    icon: Settings,
    panels: [
      { id: 'asset-management', title: 'Asset Management' },
      { id: 'service-requests', title: 'Service Requests' },
      { id: 'maintenance-execution', title: 'Maintenance Execution' },
    ]
  },
  {
    id: 'resident-portal',
    title: 'Resident Portal',
    icon: Users,
    panels: [
      { id: 'messaging', title: 'Messaging' },
      { id: 'resident-profile', title: 'Resident Profile' },
      { id: 'account-info', title: 'Account Information' },
    ]
  },
  {
    id: 'site-security',
    title: 'Site Security',
    icon: Shield,
    panels: [
      { id: 'guard-scheduling', title: 'Guard Scheduling' },
      { id: 'incident-reporting', title: 'Incident Reporting' },
      { id: 'access-control', title: 'Access Control' },
    ]
  },
  {
    id: 'case-management',
    title: 'Case Management',
    icon: Clipboard,
    panels: [
      { id: 'case-definition', title: 'Case Definition' },
      { id: 'scheduling', title: 'Scheduling' },
      { id: 'case-lifecycle', title: 'Case Lifecycle' },
    ]
  },
  {
    id: 'admin-analytics',
    title: 'Admin & Analytics',
    icon: BarChart3,
    panels: [
      { id: 'user-management', title: 'User Management' },
      { id: 'reporting', title: 'Reporting' },
      { id: 'analytics', title: 'Analytics' },
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
                    {branch.panels.map((panel) => (
                      <a
                        key={panel.id}
                        href="#"
                        className="block p-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary rounded transition-colors"
                        data-testid={`link-panel-${panel.id}`}
                        onClick={(e) => e.preventDefault()}
                      >
                        {panel.title}
                      </a>
                    ))}
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
