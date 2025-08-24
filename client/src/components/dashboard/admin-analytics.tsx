import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  insertSiteSchema, 
  insertSpaceSchema, 
  insertResidentSchema, 
  insertLeaseSchema,
  type Site,
  type Space,
  type Resident,
  type Lease
} from "@shared/schema";

export default function AdminAnalytics() {
  const { toast } = useToast();
  
  // Fetch data
  const { data: sites = [] } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

  const { data: spaces = [] } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const { data: residents = [] } = useQuery<Resident[]>({
    queryKey: ["/api/residents"],
  });

  const { data: leases = [] } = useQuery<Lease[]>({
    queryKey: ["/api/leases"],
  });

  // Site form
  const siteForm = useForm({
    resolver: zodResolver(insertSiteSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  // Space form
  const spaceForm = useForm({
    resolver: zodResolver(insertSpaceSchema),
    defaultValues: {
      identifier: "",
      type: "studio" as const,
      siteId: "",
    },
  });

  // Resident form
  const residentForm = useForm({
    resolver: zodResolver(insertResidentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "primary_tenant" as const,
      role: "leaseholder" as const,
      userId: undefined,
    },
  });

  // Lease form
  const leaseForm = useForm({
    resolver: zodResolver(insertLeaseSchema),
    defaultValues: {
      residentId: "",
      spaceId: "",
      rentalAmount: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // Mutations
  const createSiteMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/sites", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      siteForm.reset();
      toast({ title: "Site created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create site", variant: "destructive" });
    },
  });

  const createSpaceMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/spaces", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spaces"] });
      spaceForm.reset();
      toast({ title: "Space created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create space", variant: "destructive" });
    },
  });

  const createResidentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/residents", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/residents"] });
      residentForm.reset();
      toast({ title: "Resident created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create resident", variant: "destructive" });
    },
  });

  const createLeaseMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/leases", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leases"] });
      leaseForm.reset();
      toast({ title: "Lease created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create lease", variant: "destructive" });
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-secondary">Admin & Analytics Dashboard</h2>
        <p className="text-gray-600 mt-2">System administration and reporting</p>
      </div>
      
      {/* User Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">User Management</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">Manage system users and role-based access control</p>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-user-management"
            >
              <div className="font-medium text-secondary">User & Role Management</div>
              <div className="text-sm text-gray-500">Create, edit, and manage system users</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-rbac"
            >
              <div className="font-medium text-secondary">Role-Based Access Control</div>
              <div className="text-sm text-gray-500">Configure permissions and access levels</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary">Analytics Functions</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">Financial and occupancy reporting tools</p>
          <div className="space-y-3">
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-financial-reporting"
            >
              <div className="font-medium text-secondary">Financial Reporting</div>
              <div className="text-sm text-gray-500">TBD: Cash flow and P&L reports</div>
            </button>
            <button 
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-occupancy-forecasting"
            >
              <div className="font-medium text-secondary">Occupancy Forecasting</div>
              <div className="text-sm text-gray-500">TBD: 6-month occupancy predictions</div>
            </button>
          </div>
        </div>
      </div>

      {/* Data Management Forms */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-secondary mb-6">Core Data Management</h3>
        
        {/* Sites Management */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-secondary mb-4">Sites Management</h4>
          <Form {...siteForm}>
            <form onSubmit={siteForm.handleSubmit((data) => createSiteMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={siteForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter site name" 
                          data-testid="input-site-name"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={siteForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter address" 
                          data-testid="input-site-address"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={createSiteMutation.isPending}
                  data-testid="button-add-site"
                >
                  {createSiteMutation.isPending ? "Adding..." : "Add Site"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => siteForm.reset()}
                  data-testid="button-reset-site"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Spaces Management */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-secondary mb-4">Spaces Management</h4>
          <Form {...spaceForm}>
            <form onSubmit={spaceForm.handleSubmit((data) => createSpaceMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={spaceForm.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Space Identifier</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 2B, A-101" 
                          data-testid="input-space-identifier"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={spaceForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Space Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-space-type">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="1_bedroom">1 Bedroom</SelectItem>
                          <SelectItem value="2_bedroom">2 Bedroom</SelectItem>
                          <SelectItem value="3_bedroom">3 Bedroom</SelectItem>
                          <SelectItem value="common_area">Common Area</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={spaceForm.control}
                  name="siteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-site">
                            <SelectValue placeholder="Select site..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sites.map((site) => (
                            <SelectItem key={site.id} value={site.id}>
                              {site.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={createSpaceMutation.isPending}
                  data-testid="button-add-space"
                >
                  {createSpaceMutation.isPending ? "Adding..." : "Add Space"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => spaceForm.reset()}
                  data-testid="button-reset-space"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Residents Management */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-secondary mb-4">Residents Management</h4>
          <Form {...residentForm}>
            <form onSubmit={residentForm.handleSubmit((data) => createResidentMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={residentForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter full name" 
                          data-testid="input-resident-name"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={residentForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Enter email address" 
                          data-testid="input-resident-email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={residentForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-resident-type">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="primary_tenant">Primary Tenant</SelectItem>
                          <SelectItem value="co_tenant">Co-tenant</SelectItem>
                          <SelectItem value="authorized_occupant">Authorized Occupant</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={residentForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-resident-role">
                            <SelectValue placeholder="Select role..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="leaseholder">Leaseholder</SelectItem>
                          <SelectItem value="emergency_contact">Emergency Contact</SelectItem>
                          <SelectItem value="guarantor">Guarantor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={createResidentMutation.isPending}
                  data-testid="button-add-resident"
                >
                  {createResidentMutation.isPending ? "Adding..." : "Add Resident"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => residentForm.reset()}
                  data-testid="button-reset-resident"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Leases Management */}
        <div>
          <h4 className="text-lg font-medium text-secondary mb-4">Leases Management</h4>
          <Form {...leaseForm}>
            <form onSubmit={leaseForm.handleSubmit((data) => createLeaseMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={leaseForm.control}
                  name="residentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resident</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-lease-resident">
                            <SelectValue placeholder="Select resident..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {residents.map((resident) => (
                            <SelectItem key={resident.id} value={resident.id}>
                              {resident.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={leaseForm.control}
                  name="spaceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Space</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-lease-space">
                            <SelectValue placeholder="Select space..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {spaces.map((space) => (
                            <SelectItem key={space.id} value={space.id}>
                              {space.identifier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={leaseForm.control}
                  name="rentalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rental Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="Enter amount" 
                          data-testid="input-rental-amount"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={leaseForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          data-testid="input-lease-start"
                          {...field}
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={leaseForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          data-testid="input-lease-end"
                          {...field}
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={createLeaseMutation.isPending}
                  data-testid="button-create-lease"
                >
                  {createLeaseMutation.isPending ? "Creating..." : "Create Lease"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => leaseForm.reset()}
                  data-testid="button-reset-lease"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
