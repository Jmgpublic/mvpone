import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Space, Resident, Funder, insertLeaseSchema } from "@shared/schema";

// Extended schema for the form with market value
const leaseFormSchema = insertLeaseSchema.extend({
  marketValue: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Market value must be a valid positive number",
  }),
});

type LeaseFormData = z.infer<typeof leaseFormSchema>;

interface FunderEntry {
  id: string;
  funderId: string;
  amount: string;
}

export default function LeaseEntry() {
  const [funders, setFunders] = useState<FunderEntry[]>([]);
  const { toast } = useToast();

  // Fetch required data
  const { data: spaces = [] } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const { data: residents = [] } = useQuery<Resident[]>({
    queryKey: ["/api/residents"],
  });

  const { data: availableFunders = [] } = useQuery<Funder[]>({
    queryKey: ["/api/funders"],
  });

  // Form setup
  const form = useForm<LeaseFormData>({
    resolver: zodResolver(leaseFormSchema),
    defaultValues: {
      residentId: "",
      spaceId: "",
      rentalAmount: "",
      marketValue: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // Calculate funding totals
  const fundingTotal = useMemo(() => {
    return funders.reduce((total, funder) => {
      const amount = parseFloat(funder.amount) || 0;
      return total + amount;
    }, 0);
  }, [funders]);

  const marketValue = parseFloat(form.watch("marketValue")) || 0;
  const fundingDifference = marketValue - fundingTotal;

  // Add funder row
  const addFunder = () => {
    setFunders(prev => [...prev, {
      id: Date.now().toString(),
      funderId: "",
      amount: "",
    }]);
  };

  // Remove funder row
  const removeFunder = (id: string) => {
    setFunders(prev => prev.filter(f => f.id !== id));
  };

  // Update funder data
  const updateFunder = (id: string, field: keyof FunderEntry, value: string) => {
    setFunders(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  // Create lease mutation
  const createLeaseMutation = useMutation({
    mutationFn: async (data: { lease: LeaseFormData; funders: FunderEntry[] }) => {
      const leaseData = {
        ...data.lease,
        rentalAmount: data.lease.rentalAmount,
        marketValue: data.lease.marketValue,
      };

      const fundersData = data.funders
        .filter(f => f.funderId && f.amount)
        .map(f => ({
          funderId: f.funderId,
          amount: f.amount,
        }));

      const res = await apiRequest("POST", "/api/leases-with-funding", {
        lease: leaseData,
        funders: fundersData,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/revenue-events"] });
      form.reset();
      setFunders([]);
      toast({ title: "Lease created successfully with revenue events generated" });
    },
    onError: () => {
      toast({ title: "Failed to create lease", variant: "destructive" });
    },
  });

  const onSubmit = (data: LeaseFormData) => {
    if (funders.length === 0) {
      toast({ title: "Please add at least one funder", variant: "destructive" });
      return;
    }

    const validFunders = funders.filter(f => f.funderId && f.amount);
    if (validFunders.length === 0) {
      toast({ title: "Please complete all funder entries", variant: "destructive" });
      return;
    }

    createLeaseMutation.mutate({ lease: data, funders: validFunders });
  };

  // Initialize with one funder row
  useEffect(() => {
    if (funders.length === 0) {
      addFunder();
    }
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Lease Entry</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Header - Lease Information */}
          <Card>
            <CardHeader>
              <CardTitle>Lease Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Lease ID - Display only (auto-generated) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Lease ID</label>
                  <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                    Auto-generated
                  </div>
                </div>

                {/* Space ID */}
                <FormField
                  control={form.control}
                  name="spaceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Space</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-space">
                            <SelectValue placeholder="Select a space" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {spaces.map((space) => (
                            <SelectItem key={space.id} value={space.id}>
                              {space.identifier} - {space.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Resident */}
                <FormField
                  control={form.control}
                  name="residentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resident</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-resident">
                            <SelectValue placeholder="Select a resident" />
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

                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          data-testid="input-start-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          data-testid="input-end-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Market Value */}
                <FormField
                  control={form.control}
                  name="marketValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          data-testid="input-market-value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Rental Amount */}
                <FormField
                  control={form.control}
                  name="rentalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rental Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          data-testid="input-rental-amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Body - Funders Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Funding Sources</CardTitle>
                <Button type="button" onClick={addFunder} size="sm" data-testid="button-add-funder">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funder
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funder</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funders.map((funder) => (
                    <TableRow key={funder.id}>
                      <TableCell>
                        <Select
                          value={funder.funderId}
                          onValueChange={(value) => updateFunder(funder.id, "funderId", value)}
                        >
                          <SelectTrigger data-testid={`select-funder-${funder.id}`}>
                            <SelectValue placeholder="Select funder" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFunders.map((f) => (
                              <SelectItem key={f.id} value={f.id}>
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={funder.amount}
                          onChange={(e) => updateFunder(funder.id, "amount", e.target.value)}
                          data-testid={`input-amount-${funder.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFunder(funder.id)}
                          data-testid={`button-remove-${funder.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Funding Summary */}
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Market Value:</span>
                  <span className="font-medium">${marketValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Funding:</span>
                  <span className="font-medium">${fundingTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t pt-2">
                  <span>Difference:</span>
                  <span className={fundingDifference === 0 ? "text-green-600" : fundingDifference > 0 ? "text-orange-600" : "text-red-600"}>
                    ${fundingDifference.toFixed(2)}
                    {fundingDifference === 0 && (
                      <Badge variant="secondary" className="ml-2">Fully Funded</Badge>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer - Submit */}
          <Card>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => {
                form.reset();
                setFunders([]);
                addFunder();
              }}>
                Reset Form
              </Button>
              <Button 
                type="submit" 
                disabled={createLeaseMutation.isPending}
                data-testid="button-save-lease"
              >
                <Save className="w-4 h-4 mr-2" />
                {createLeaseMutation.isPending ? "Saving..." : "Save Lease"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}