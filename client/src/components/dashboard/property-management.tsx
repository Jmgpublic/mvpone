import { useState } from "react";
import { Building2, FileText, MessageSquare, Users, Calendar, Bell, FileCheck, User, DollarSign, Edit, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SiteDefinitionPanel from "./property-management/site-definition-panel";
import DocumentationPanel from "./property-management/documentation-panel";
import MessagingPanel from "./property-management/messaging-panel";
import TenantLifecyclePanel from "./property-management/tenant-lifecycle-panel";

type ActivePanel = 'overview' | 'site-definition' | 'documentation' | 'messaging' | 'tenant-lifecycle';

export default function PropertyManagement() {
  const [activePanel, setActivePanel] = useState<ActivePanel>('overview');

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'site-definition':
        return <SiteDefinitionPanel />;
      case 'documentation':
        return <DocumentationPanel />;
      case 'messaging':
        return <MessagingPanel />;
      case 'tenant-lifecycle':
        return <TenantLifecyclePanel />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Panel Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Definition Panel */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Site Definition</span>
              </CardTitle>
              <Badge variant="secondary">3 Components</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Edit className="w-4 h-4 mr-2" />
                <span>Maintain Site Records</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClipboardList className="w-4 h-4 mr-2" />
                <span>Manage Site Spaces</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                <span>Update Site Documentation</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => window.location.href = '/edit-site-record'}
              data-testid="button-define-site"
            >
              Define Site
            </Button>
          </CardContent>
        </Card>

        {/* Documentation and Formage Panel */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Documentation & Formage</span>
              </CardTitle>
              <Badge variant="secondary">3 Components</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Manage administrative forms, onboarding checklists, and legal disclosures</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <FileCheck className="w-4 h-4 mr-2" />
                <span>Admin Formage</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClipboardList className="w-4 h-4 mr-2" />
                <span>Onboarding Checklist</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                <span>Onboarding Disclosures</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => setActivePanel('documentation')}
              data-testid="button-documentation"
            >
              Manage Documents
            </Button>
          </CardContent>
        </Card>

        {/* Messaging Panel */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Messaging</span>
              </CardTitle>
              <Badge variant="secondary">5 Components</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Handle announcements, calendaring, resident communications, and news</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Bell className="w-4 h-4 mr-2" />
                <span>Announcements</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Calendaring</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Notes to Residents</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                <span>News & Highlights</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => setActivePanel('messaging')}
              data-testid="button-messaging"
            >
              Manage Communications
            </Button>
          </CardContent>
        </Card>

        {/* Tenant Lifecycle Sub-Dashboard */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Tenant Lifecycle</span>
              </CardTitle>
              <Badge variant="default">Sub-Dashboard</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Complete tenant management from waitlist to lease signing</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <ClipboardList className="w-4 h-4 mr-2" />
                <span>Waitlist Management</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>Onboarding Process</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileCheck className="w-4 h-4 mr-2" />
                <span>Lease Management</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => setActivePanel('tenant-lifecycle')}
              data-testid="button-tenant-lifecycle"
            >
              Manage Tenant Lifecycle
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Property Management Dashboard</h2>
            <p className="text-gray-600 mt-2">Comprehensive property and tenant management system</p>
          </div>
          {activePanel !== 'overview' && (
            <Button 
              variant="outline" 
              onClick={() => setActivePanel('overview')}
              data-testid="button-back-overview"
            >
              Back to Overview
            </Button>
          )}
        </div>
      </div>

      {renderPanelContent()}
    </div>
  );
}