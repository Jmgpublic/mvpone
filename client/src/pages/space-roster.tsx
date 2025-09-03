import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Site, Space } from "@shared/schema";

const spaceTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "studio", label: "Studio" },
  { value: "1_bedroom", label: "1 Bedroom" },
  { value: "2_bedroom", label: "2 Bedroom" },
  { value: "3_bedroom", label: "3 Bedroom" },
  { value: "common_area", label: "Common Area" },
];

export default function SpaceRoster() {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedSpaceType, setSelectedSpaceType] = useState<string>("all");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  // Fetch sites and spaces data
  const { data: sites = [] } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

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

      {/* Footer - Space Details */}
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
    </div>
  );
}