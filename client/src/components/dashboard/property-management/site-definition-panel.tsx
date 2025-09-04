import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Building, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Site, Space, SpaceType, insertSiteSchema, type InsertSite } from "@shared/schema";


export default function SiteDefinitionPanel() {
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [showSpaces, setShowSpaces] = useState<boolean>(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const { toast } = useToast();

  // Fetch sites data
  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

  // Fetch spaces data (only when showing spaces)
  const { data: spaces = [] } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
    enabled: showSpaces,
  });

  // Fetch space types data (only when showing spaces)
  const { data: spaceTypes = [] } = useQuery<SpaceType[]>({
    queryKey: ["/api/space-types"],
    enabled: showSpaces,
  });

  // Filter spaces for the currently editing site
  const siteSpaces = useMemo(() => {
    if (!editingSite || !showSpaces) return [];
    return spaces.filter(space => space.siteId === editingSite.id);
  }, [spaces, editingSite, showSpaces]);

  // Get space type name for a space
  const getSpaceTypeName = (spaceTypeId: string) => {
    const spaceType = spaceTypes.find(st => st.id === spaceTypeId);
    return spaceType?.name || "Unknown Type";
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
    setShowSpaces(false); // Reset spaces view when switching sites
    setSelectedSpace(null);
    form.reset({
      name: site.name,
      address: site.address,
    });
  };

  const handleCancelEdit = () => {
    setEditingSite(null);
    setShowSpaces(false);
    setSelectedSpace(null);
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
      </div>

      <Tabs defaultValue="site-management" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="site-management">Site Management</TabsTrigger>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No sites found. Create your first site below.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sites.map((site) => (
                        <TableRow key={site.id}>
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
              <CardTitle>{editingSite ? "Edit Site" : "Add New Site"}</CardTitle>
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
                  <div className="flex space-x-3">
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
                    {editingSite && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSpaces(!showSpaces)}
                          data-testid="button-show-spaces"
                        >
                          <Home className="w-4 h-4 mr-2" />
                          {showSpaces ? "Hide Spaces" : "Show Spaces"}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleCancelEdit}
                          data-testid="button-cancel-edit"
                        >
                          Cancel Edit
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Spaces Table - Only shown when editing a site and "Show Spaces" is clicked */}
          {editingSite && showSpaces && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Spaces for {editingSite.name} ({siteSpaces.length} {siteSpaces.length === 1 ? 'space' : 'spaces'})</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSpaces(false)}
                    data-testid="button-hide-spaces"
                  >
                    Hide Spaces
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {siteSpaces.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          No spaces found for this site. Create spaces in the Admin Analytics panel.
                        </TableCell>
                      </TableRow>
                    ) : (
                      siteSpaces.map((space) => (
                        <TableRow
                          key={space.id}
                          className={`cursor-pointer transition-colors ${
                            selectedSpace?.id === space.id ? "bg-muted" : ""
                          }`}
                          onClick={() => setSelectedSpace(space)}
                          data-testid={`row-space-${space.id}`}
                        >
                          <TableCell className="font-medium">{space.identifier}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{getSpaceTypeName(space.spaceTypeId)}</Badge>
                          </TableCell>
                          <TableCell>{new Date(space.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              {selectedSpace && (
                <CardFooter>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Space ID</label>
                      <p className="font-mono text-sm">{selectedSpace.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p>{selectedSpace.identifier}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Type</label>
                      <p>
                        <Badge variant="secondary">{getSpaceTypeName(selectedSpace.spaceTypeId)}</Badge>
                      </p>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}