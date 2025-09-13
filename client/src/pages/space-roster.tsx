import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Site, Space, SpaceType } from "@shared/schema";


export default function SpaceRoster() {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedSpaceType, setSelectedSpaceType] = useState<string>("all");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  // Fetch sites, spaces, and space types data
  const { data: sites = [] } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

  const { data: spaces = [] } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const { data: spaceTypes = [] } = useQuery<SpaceType[]>({
    queryKey: ["/api/space-types"],
  });

  // Filter spaces based on selected criteria
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const siteMatch = selectedSite === "all" || space.siteId === selectedSite;
      const typeMatch = selectedSpaceType === "all" || space.spaceTypeId === selectedSpaceType;
      return siteMatch && typeMatch;
    });
  }, [spaces, selectedSite, selectedSpaceType]);

  // Get site name for a space
  const getSiteName = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    return site?.name || "Unknown Site";
  };

  // Get space type name for a space
  const getSpaceTypeName = (spaceTypeId: string) => {
    const spaceType = spaceTypes.find(st => st.id === spaceTypeId);
    return spaceType?.name || "Unknown Type";
  };

  // Create space type options for dropdown
  const spaceTypeOptions = useMemo(() => {
    return [
      { value: "all", label: "All Types" },
      ...spaceTypes.map(st => ({ value: st.id, label: st.name }))
    ];
  }, [spaceTypes]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Spaces</h1>
      
      {/* Header - Filters */}
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

      {/* Body - Table of Spaces */}
      <Card>
        <CardHeader>
          <CardTitle>
            Spaces ({filteredSpaces.length} {filteredSpaces.length === 1 ? 'space' : 'spaces'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpaces.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
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
                    <TableCell>{getSiteName(space.siteId)}</TableCell>
                    <TableCell>{space.identifier}</TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="secondary">{getSpaceTypeName(space.spaceTypeId)}</Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer - Space Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Space Details</CardTitle>
          <Button
            onClick={() => window.location.href = '/dashboard?panel=admin-analytics'}
            className="ml-auto"
            data-testid="button-create-space"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Space
          </Button>
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
                  <div className="mt-1">
                    <Badge variant="secondary">{getSpaceTypeName(selectedSpace.spaceTypeId)}</Badge>
                  </div>
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
    </div>
  );
}