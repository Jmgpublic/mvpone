import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, ClipboardList, UserCheck, FileCheck, DollarSign, Edit3, Plus, Search, CheckCircle } from "lucide-react";

export default function TenantLifecyclePanel() {
  const [activeSubPanel, setActiveSubPanel] = useState("waitlist");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Tenant Lifecycle Management</h3>
        <Badge variant="outline" className="px-3 py-1">Sub-Dashboard</Badge>
      </div>

      <Tabs defaultValue="waitlist" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="waitlist">Waitlist Management</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding Process</TabsTrigger>
          <TabsTrigger value="lease-mgmt">Lease Management</TabsTrigger>
        </TabsList>

        {/* Waitlist Management Panel */}
        <TabsContent value="waitlist" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Waitlist Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Waitlist Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-gray-600">Total Applications</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pending Review</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Under Review</span>
                      <Badge variant="outline">6</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Approved</span>
                      <Badge className="bg-green-500">10</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Registration */}
            <Card>
              <CardHeader>
                <CardTitle>Register New Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Plus className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">New Application</div>
                      <div className="text-sm text-gray-600">Start application process</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Search className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Client / Vacancy Match</div>
                      <div className="text-sm text-gray-600">Match clients to available units</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Client Selects Unit</div>
                      <div className="text-sm text-gray-600">Unit selection process</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <ClipboardList className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Create Onboarding</div>
                      <div className="text-sm text-gray-600">Generate onboarding checklist</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">New application submitted</div>
                      <div className="text-xs text-gray-500">John Doe - Unit 2A</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Application approved</div>
                      <div className="text-xs text-gray-500">Sarah Smith - Unit 1B</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Unit selected</div>
                      <div className="text-xs text-gray-500">Mike Johnson - Unit 3C</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onboarding Process Panel */}
        <TabsContent value="onboarding" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Onboarding Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClipboardList className="w-5 h-5" />
                  <span>Active Onboarding Cases</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-l-blue-500 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Sarah Smith - Unit 1B</h4>
                        <p className="text-sm text-gray-600">Started: March 10, 2025</p>
                      </div>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <Progress value={75} className="mb-2" />
                    <div className="text-sm text-gray-600">6 of 8 items completed</div>
                    
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Onboarding Checklist</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Credentials Verification</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Disclosures Signed</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Releases Pending</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                        <span>Financial Review</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                        <span>Lease Signing</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-l-green-500 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Mike Johnson - Unit 3C</h4>
                        <p className="text-sm text-gray-600">Started: March 8, 2025</p>
                      </div>
                      <Badge className="bg-green-500">Almost Complete</Badge>
                    </div>
                    <Progress value={90} className="mb-2" />
                    <div className="text-sm text-gray-600">5 of 6 items completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Components */}
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <ClipboardList className="w-6 h-6 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium">Onboarding Checklist</div>
                        <div className="text-sm text-gray-600">Standard new tenant checklist</div>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-manage-checklist">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <UserCheck className="w-6 h-6 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium">Credentials</div>
                        <div className="text-sm text-gray-600">ID verification and background checks</div>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-manage-credentials">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <FileCheck className="w-6 h-6 text-purple-600" />
                      <div className="flex-1">
                        <div className="font-medium">Disclosures</div>
                        <div className="text-sm text-gray-600">Legal disclosures and agreements</div>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-manage-disclosures">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <FileCheck className="w-6 h-6 text-orange-600" />
                      <div className="flex-1">
                        <div className="font-medium">Releases</div>
                        <div className="text-sm text-gray-600">Liability and authorization forms</div>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-manage-releases">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                      <div className="flex-1">
                        <div className="font-medium">Financial Review</div>
                        <div className="text-sm text-gray-600">Income verification and deposits</div>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-manage-financial">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Edit3 className="w-6 h-6 text-red-600" />
                      <div className="flex-1">
                        <div className="font-medium">Lease Signed</div>
                        <div className="text-sm text-gray-600">Final lease execution</div>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-manage-lease-signing">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lease Management Panel */}
        <TabsContent value="lease-mgmt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5" />
                <span>Lease Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileCheck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Lease Management System</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive lease creation and management with automated revenue event generation.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button data-testid="button-view-leases">
                    View All Leases
                  </Button>
                  <Button variant="outline" data-testid="button-create-lease">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Lease
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}