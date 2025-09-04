import { Building2, Settings, Users, Shield, Clipboard, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type Branch = 'property-management' | 'facility-management' | 'resident-portal' | 'site-security' | 'case-management' | 'admin-analytics';

interface SidebarProps {
  activeBranch: Branch;
  onBranchChange: (branch: Branch) => void;
}

interface DashboardConfig {
  id: Branch;
  title: string;
  icon: React.ElementType;
}



const dashboards: DashboardConfig[] = [
  {
    id: 'property-management',
    title: 'Property Management',
    icon: Building2,
  },
  {
    id: 'facility-management',
    title: 'Facility Management',
    icon: Settings,
  },
  {
    id: 'resident-portal',
    title: 'Resident Portal',
    icon: Users,
  },
  {
    id: 'site-security',
    title: 'Site Security',
    icon: Shield,
  },
  {
    id: 'case-management',
    title: 'Case Management',
    icon: Clipboard,
  },
  {
    id: 'admin-analytics',
    title: 'Admin & Analytics',
    icon: BarChart3,
  },
];

export default function Sidebar({ activeBranch, onBranchChange }: SidebarProps) {
  return (
    <nav className="w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="space-y-4">
          {/* Dashboards */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">Dashboards</h3>
            {dashboards.map((dashboard) => {
              const Icon = dashboard.icon;
              const isActive = activeBranch === dashboard.id;

              return (
                <button
                  key={dashboard.id}
                  className={cn(
                    "w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 text-secondary hover:bg-gray-200"
                  )}
                  onClick={() => onBranchChange(dashboard.id)}
                  data-testid={`button-dashboard-${dashboard.id}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{dashboard.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
