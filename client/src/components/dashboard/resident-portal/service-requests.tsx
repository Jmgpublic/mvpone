import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wrench, Plus, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Service Request form schema
const serviceRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  residentId: z.string().min(1, "Resident ID is required"),
  spaceId: z.string().min(1, "Space ID is required"),
});

type ServiceRequestForm = z.infer<typeof serviceRequestSchema>;

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'acknowledged' | 'triaged' | 'in_progress' | 'resolved' | 'closed';
  residentId: string;
  spaceId: string;
  createdAt: string;
  acknowledgedAt?: string;
  triagedAt?: string;
  resolvedAt?: string;
  notes?: string;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800", 
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

const statusColors = {
  submitted: "bg-blue-100 text-blue-800",
  acknowledged: "bg-yellow-100 text-yellow-800",
  triaged: "bg-purple-100 text-purple-800",
  in_progress: "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800"
};

const statusIcons = {
  submitted: Clock,
  acknowledged: AlertCircle,
  triaged: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: XCircle
};

export default function ServiceRequests() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For demo purposes, using placeholder IDs - in real app, get from user session
  const currentResidentId = "demo-resident-id";
  const currentSpaceId = "demo-space-id";

  // Fetch service requests for current resident
  const { data: serviceRequests = [], isLoading } = useQuery<ServiceRequest[]>({
    queryKey: ['/api/service-requests', { residentId: currentResidentId }],
  });

  // Create service request mutation
  const createServiceRequestMutation = useMutation({
    mutationFn: (data: ServiceRequestForm) => apiRequest('/api/service-requests', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/service-requests'] });
      setShowCreateForm(false);
      toast({
        title: "Service Request Submitted",
        description: "Your service request has been submitted successfully.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to submit service request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<ServiceRequestForm>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      residentId: currentResidentId,
      spaceId: currentSpaceId,
    },
  });

  const onSubmit = (data: ServiceRequestForm) => {
    createServiceRequestMutation.mutate(data);
  };

  const formatStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (showCreateForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="w-5 h-5" />
            <span>Submit Service Request</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the issue" {...field} data-testid="input-request-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide detailed information about the issue..."
                        className="min-h-[100px]"
                        {...field} 
                        data-testid="textarea-request-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-request-priority">
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  disabled={createServiceRequestMutation.isPending}
                  data-testid="button-submit-request"
                >
                  {createServiceRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  data-testid="button-cancel-request"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5" />
            <span>Service Requests</span>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            size="sm"
            data-testid="button-create-service-request"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading service requests...</div>
        ) : serviceRequests.length === 0 ? (
          <div className="text-center py-8">
            <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No service requests yet</p>
            <Button onClick={() => setShowCreateForm(true)} data-testid="button-first-service-request">
              Submit Your First Request
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {serviceRequests.map((request: any) => {
              const StatusIcon = statusIcons[request.status as keyof typeof statusIcons] || Clock;
              return (
                <div 
                  key={request.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  data-testid={`service-request-${request.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{request.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <Badge className={priorityColors[request.priority as keyof typeof priorityColors]}>
                          {request.priority}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <StatusIcon className="w-4 h-4" />
                          <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                            {formatStatusText(request.status)}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          Submitted {formatDate(request.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}