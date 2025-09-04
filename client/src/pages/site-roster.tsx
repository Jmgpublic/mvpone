import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Edit, MapPin, FileText, Trash2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Site } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function SiteRoster() {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const { toast } = useToast();

  // Fetch sites data
  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

  // Delete site mutation
  const deleteSiteMutation = useMutation({
    mutationFn: async (siteId: string) => {
      const res = await apiRequest("DELETE", `/api/sites/${siteId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      toast({ title: "Site deleted successfully" });
      setDeleteConfirmOpen(false);
      setSiteToDelete(null);
    },
    onError: () => {
      toast({ title: "Failed to delete site", variant: "destructive" });
    },
  });

  const handleEditSite = (site: Site) => {
    window.location.href = `/edit-site-record?id=${site.id}`;
  };

  const handleEditSpaces = (site: Site) => {
    window.location.href = `/space-roster?siteId=${site.id}`;
  };

  const handleEditDocumentation = (site: Site) => {
    // TODO: Navigate to documentation edit form when implemented
    toast({ title: "Documentation editing coming soon", variant: "default" });
  };

  const handleDeleteSite = (site: Site) => {
    setSiteToDelete(site);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (siteToDelete) {
      deleteSiteMutation.mutate(siteToDelete.id);
    }
  };

  const abbreviateAddress = (address: string) => {
    return address.length > 10 ? address.substring(0, 10) + "..." : address;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Site Roster</h1>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading sites...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Site Roster</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Site Roster</CardTitle>
        </CardHeader>
        <CardContent>
          {sites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sites found. Create your first site to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Site Address</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id} data-testid={`row-site-${site.id}`}>
                    {/* Hidden SiteGuid column - accessible via data attribute */}
                    <TableCell data-site-guid={site.id}>
                      <span className="font-medium" data-testid={`text-site-name-${site.id}`}>
                        {site.name}
                      </span>
                    </TableCell>
                    <TableCell data-testid={`text-site-address-${site.id}`}>
                      <span title={site.address}>
                        {abbreviateAddress(site.address)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSite(site)}
                          title="Edit Site"
                          data-testid={`button-edit-site-${site.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSpaces(site)}
                          title="Edit Spaces"
                          data-testid={`button-edit-spaces-${site.id}`}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDocumentation(site)}
                          title="Edit Documentation"
                          data-testid={`button-edit-documentation-${site.id}`}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <AlertDialog open={deleteConfirmOpen && siteToDelete?.id === site.id}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSite(site)}
                              title="Delete Site"
                              data-testid={`button-delete-site-${site.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent data-testid="dialog-delete-confirmation">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Site</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{siteToDelete?.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel 
                                onClick={() => {
                                  setDeleteConfirmOpen(false);
                                  setSiteToDelete(null);
                                }}
                                data-testid="button-cancel-delete"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={confirmDelete}
                                disabled={deleteSiteMutation.isPending}
                                data-testid="button-confirm-delete"
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {deleteSiteMutation.isPending ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}