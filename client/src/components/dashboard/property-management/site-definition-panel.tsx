import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Site, Space, insertSiteSchema, type InsertSite } from "@shared/schema";
import { Link } from "wouter";

const spaceTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "studio", label: "Studio" },
  { value: "1_bedroom", label: "1 Bedroom" },
  { value: "2_bedroom", label: "2 Bedroom" },
  { value: "3_bedroom", label: "3 Bedroom" },
  { value: "common_area", label: "Common Area" },
];

export default function SiteDefinitionPanel() {
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  // Space roster state
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedSpaceType, setSelectedSpaceType] = useState<string>("all");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const { toast } = useToast();

  // Fetch sites data
  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

  // Fetch spaces data for space roster
  const { data: spaces = [] } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  // Filter spaces based on selected criteria
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const siteMatch = selectedSite === "all" || space.siteId === selectedSite;
      const typeMatch = selectedSpaceType === "all" || space.type === selectedSpaceType;
      return siteMatch && typeMatch;
    });
  }, [spaces, selectedSite, selectedSpaceType]);

  // Get site name for a space
  const getSiteName = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    return site?.name || "Unknown Site";
  };

  // Format space type for display
  const formatSpaceType = (type: string) => {
    return spaceTypeOptions.find(opt => opt.value === type)?.label || type;
  };

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
          <TabsTrigger value="space-roster">Spaces</TabsTrigger>
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
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Site Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Site</label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger data-testid="select-site">
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Space Type Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Space Type</label>
                  <Select value={selectedSpaceType} onValueChange={setSelectedSpaceType}>
                    <SelectTrigger data-testid="select-space-type">
                      <SelectValue placeholder="Select space type" />
                    </SelectTrigger>
                    <SelectContent>
                      {spaceTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spaces Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Spaces ({filteredSpaces.length} {filteredSpaces.length === 1 ? 'space' : 'spaces'})
                </CardTitle>
                <Button 
                  className="flex items-center gap-2"
                  data-testid="button-add-space"
                  onClick={() => {
                    // TODO: Implement add space functionality
                    console.log("Add space clicked");
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Space
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Space GUID</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSpaces.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No spaces found matching the selected criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSpaces.map((space) => (
                      <TableRow
                        key={space.id}
                        className={`cursor-pointer transition-colors ${
                          selectedSpace?.id === space.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedSpace(space)}
                        data-testid={`row-space-${space.id}`}
                      >
                        <TableCell className="font-mono text-sm">{space.id}</TableCell>
                        <TableCell>{getSiteName(space.siteId)}</TableCell>
                        <TableCell>{space.identifier}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{formatSpaceType(space.type)}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Space Details */}
          <Card>
            <CardHeader>
              <CardTitle>Space Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSpace ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Space ID</label>
                      <p className="font-mono text-sm">{selectedSpace.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Identifier</label>
                      <p>{selectedSpace.identifier}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Type</label>
                      <p>
                        <Badge variant="secondary">{formatSpaceType(selectedSpace.type)}</Badge>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Site</label>
                      <p>{getSiteName(selectedSpace.siteId)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Created At</label>
                      <p>{new Date(selectedSpace.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a space from the table above to view its details.
                </p>
              )}
            </CardContent>
            {selectedSpace && (
              <CardFooter>
                <button
                  onClick={() => setSelectedSpace(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-clear-selection"
                >
                  Clear selection
                </button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}