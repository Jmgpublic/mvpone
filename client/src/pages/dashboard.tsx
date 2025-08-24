import { useState } from "react";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import PropertyManagement from "@/components/dashboard/property-management";
import FacilityManagement from "@/components/dashboard/facility-management";
import ResidentPortal from "@/components/dashboard/resident-portal";
import SiteSecurity from "@/components/dashboard/site-security";
import CaseManagement from "@/components/dashboard/case-management";
import AdminAnalytics from "@/components/dashboard/admin-analytics";

type Branch = 'property-management' | 'facility-management' | 'resident-portal' | 'site-security' | 'case-management' | 'admin-analytics';

export default function Dashboard() {
  const [activeBranch, setActiveBranch] = useState<Branch>('property-management');

  const renderDashboard = () => {
    switch (activeBranch) {
      case 'property-management':
        return <PropertyManagement />;
      case 'facility-management':
        return <FacilityManagement />;
      case 'resident-portal':
        return <ResidentPortal />;
      case 'site-security':
        return <SiteSecurity />;
      case 'case-management':
        return <CaseManagement />;
      case 'admin-analytics':
        return <AdminAnalytics />;
      default:
        return <PropertyManagement />;
    }
  };

  return (
    <div className="bg-surface font-sans">
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeBranch={activeBranch} onBranchChange={setActiveBranch} />
        <main className="flex-1 overflow-y-auto bg-surface">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
}
