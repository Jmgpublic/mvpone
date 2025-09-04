import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertSiteSchema, type InsertSite, type Site } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function EditSiteRecord() {
  const { toast } = useToast();
  const search = useSearch();
  const urlParams = new URLSearchParams(search);
  const siteId = urlParams.get('id');

  // Fetch existing site if editing
  const { data: existingSite } = useQuery<Site>({
    queryKey: ["/api/sites", siteId],
    queryFn: async () => {
      const res = await fetch(`/api/sites/${siteId}`);
      if (!res.ok) throw new Error('Failed to fetch site');
      return res.json();
    },
    enabled: !!siteId,
  });

  // Form setup
  const form = useForm<InsertSite>({
    resolver: zodResolver(insertSiteSchema),
    defaultValues: {
      name: existingSite?.name || "",
      address: existingSite?.address || "",
      propertyNickname: existingSite?.propertyNickname || "",
      propertyDescription: existingSite?.propertyDescription || "",
      propertyDateAcquired: existingSite?.propertyDateAcquired 
        ? new Date(existingSite.propertyDateAcquired).toISOString().split('T')[0] 
        : "",
      propertyValueAssessed: existingSite?.propertyValueAssessed || "",
      propertyValueMortgageTotal: existingSite?.propertyValueMortgageTotal || "",
      mortgagePaymentPrincipal: existingSite?.mortgagePaymentPrincipal || "",
      mortgagePaymentInterest: existingSite?.mortgagePaymentInterest || "",
    },
  });

  // Update form values when existing site data loads
  if (existingSite && !form.formState.isDirty) {
    form.reset({
      name: existingSite.name,
      address: existingSite.address,
      propertyNickname: existingSite.propertyNickname || "",
      propertyDescription: existingSite.propertyDescription || "",
      propertyDateAcquired: existingSite.propertyDateAcquired 
        ? new Date(existingSite.propertyDateAcquired).toISOString().split('T')[0] 
        : "",
      propertyValueAssessed: existingSite.propertyValueAssessed || "",
      propertyValueMortgageTotal: existingSite.propertyValueMortgageTotal || "",
      mortgagePaymentPrincipal: existingSite.mortgagePaymentPrincipal || "",
      mortgagePaymentInterest: existingSite.mortgagePaymentInterest || "",
    });
  }

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
    mutationFn: async (data: InsertSite) => {
      const res = await apiRequest("PUT", `/api/sites/${siteId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sites", siteId] });
      toast({ title: "Site updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update site", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertSite) => {
    if (siteId) {
      updateSiteMutation.mutate(data);
    } else {
      createSiteMutation.mutate(data);
    }
  };

  const isPending = createSiteMutation.isPending || updateSiteMutation.isPending;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Site Record</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Site Record</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Required Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name *</FormLabel>
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
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter site address" 
                          data-testid="input-site-address"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Optional Property Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="propertyNickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Nickname</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter property nickname" 
                          data-testid="input-property-nickname"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyDateAcquired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Acquired</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          data-testid="input-property-date-acquired"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="propertyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter property description" 
                        rows={3}
                        data-testid="textarea-property-description"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Financial Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="propertyValueAssessed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessed Value</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter assessed value" 
                          data-testid="input-property-value-assessed"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyValueMortgageTotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Mortgage Value</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter total mortgage value" 
                          data-testid="input-property-value-mortgage-total"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mortgagePaymentPrincipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mortgage Payment Principal</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter principal payment amount" 
                          data-testid="input-mortgage-payment-principal"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mortgagePaymentInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mortgage Payment Interest</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter interest payment amount" 
                          data-testid="input-mortgage-payment-interest"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => form.reset()}
                  data-testid="button-reset-site"
                  disabled={isPending}
                >
                  Reset
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  data-testid="button-save-site"
                >
                  {isPending ? "Saving..." : (siteId ? "Save Site" : "Add Site")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}