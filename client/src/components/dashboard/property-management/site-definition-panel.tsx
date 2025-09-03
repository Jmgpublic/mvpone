import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Building, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Site, insertSiteSchema, type InsertSite } from "@shared/schema";
import { Link } from "wouter";

export default function SiteDefinitionPanel() {
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const { toast } = useToast();

  // Fetch sites data
  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

  // Form setup
  const form = useForm<InsertSite>({
    resolver: zodResolver(insertSiteSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  // Create site mutation
  const createSiteMutation = useMutation({
    mutationFn: async (data: InsertSite) => {
      const res = await apiRequest("POST", "/api/sites", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      form.reset();
      toast({ title: "Site created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create site", variant: "destructive" });
    },
  });

  // Update site mutation
  const updateSiteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertSite> }) => {
      const res = await apiRequest("PUT", `/api/sites/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      setEditingSite(null);
      form.reset();
      toast({ title: "Site updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update site", variant: "destructive" });
    },
  });

  // Delete site mutation
  const deleteSiteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/sites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      toast({ title: "Site deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete site", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertSite) => {
    if (editingSite) {
      updateSiteMutation.mutate({ id: editingSite.id, data });
    } else {
      createSiteMutation.mutate(data);
    }
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    form.reset({
      name: site.name,
      address: site.address,
    });
  };

  const handleCancelEdit = () => {
    setEditingSite(null);
    form.reset();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this site? This action cannot be undone.")) {
      deleteSiteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Site Definition</h3>
        <div className="flex space-x-2">
          <Link href="/space-roster">
            <Button variant="outline" data-testid="button-view-space-roster">
              <Home className="w-4 h-4 mr-2" />
              View Space Roster
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="site-management" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="site-management">Site Management</TabsTrigger>
          <TabsTrigger value="space-roster">Space Roster</TabsTrigger>
        </TabsList>

        {/* Site Management - Combined CRUD and Form */}
        <TabsContent value="site-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Site Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading sites...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No sites found. Create your first site below.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sites.map((site) => (
                        <TableRow key={site.id}>
                          <TableCell className="font-mono text-sm">{site.id}</TableCell>
                          <TableCell className="font-medium">{site.name}</TableCell>
                          <TableCell>{site.address}</TableCell>
                          <TableCell>{new Date(site.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(site)}
                                data-testid={`button-edit-${site.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(site.id)}
                                disabled={deleteSiteMutation.isPending}
                                data-testid={`button-delete-${site.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {/* Add/Edit Site Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingSite ? "Edit Site" : "Add New Site"}</CardTitle>
                {editingSite && (
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter site name" {...field} data-testid="input-site-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter site address" {...field} data-testid="input-site-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={createSiteMutation.isPending || updateSiteMutation.isPending}
                    data-testid="button-save-site"
                  >
                    {editingSite ? (
                      <Edit className="w-4 h-4 mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {createSiteMutation.isPending || updateSiteMutation.isPending 
                      ? (editingSite ? "Updating..." : "Creating...") 
                      : (editingSite ? "Update Site" : "Create Site")
                    }
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Space Roster */}
        <TabsContent value="space-roster" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Space Roster Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Space Roster Form</h3>
                <p className="text-gray-600 mb-4">
                  Manage and view all spaces across your properties with advanced filtering options.
                </p>
                <Link href="/space-roster">
                  <Button data-testid="button-open-space-roster">
                    Open Space Roster Form
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}