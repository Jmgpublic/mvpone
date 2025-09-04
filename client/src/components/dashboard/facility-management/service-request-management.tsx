import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings, Eye, CheckCircle, Clock, AlertTriangle, Plus, Users, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Form schemas
const statusUpdateSchema = z.object({
  status: z.enum(['submitted', 'acknowledged', 'triaged', 'in_progress', 'resolved', 'closed']),
  notes: z.string().optional(),
});

const serviceOrderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  assignedStaffId: z.string().optional(),
  estimatedCost: z.string().optional(),
});

const workOrderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contractorName: z.string().optional(),
  contractorContact: z.string().optional(),
  estimatedCost: z.string().optional(),
});

type StatusUpdate = z.infer<typeof statusUpdateSchema>;
type ServiceOrderForm = z.infer<typeof serviceOrderSchema>;
type WorkOrderForm = z.infer<typeof workOrderSchema>;

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
  acknowledged: AlertTriangle,
  triaged: AlertTriangle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: CheckCircle
};

export default function ServiceRequestManagement() {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderType, setOrderType] = useState<'service' | 'work'>('service');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all service requests
  const { data: serviceRequests = [], isLoading } = useQuery<ServiceRequest[]>({
    queryKey: ['/api/service-requests'],
    queryFn: () => fetch('/api/service-requests').then(res => res.json()),
  });

  // Update service request status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StatusUpdate }) => 
      apiRequest(`/api/service-requests/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/service-requests'] });
      toast({
        title: "Status Updated",
        description: "Service request status has been updated successfully.",
      });
      setSelectedRequest(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service request status.",
        variant: "destructive",
      });
    },
  });

  // Create service order mutation
  const createServiceOrderMutation = useMutation({
    mutationFn: (data: ServiceOrderForm) => apiRequest('/api/service-orders', 'POST', data),
    onSuccess: (serviceOrder: any) => {
      if (selectedRequest && serviceOrder?.id) {
        // Link the service request to the service order
        apiRequest(`/api/service-requests/${selectedRequest.id}/service-orders/${serviceOrder.id}`, 'POST', {});
      }
      queryClient.invalidateQueries({ queryKey: ['/api/service-requests'] });
      toast({
        title: "Service Order Created",
        description: "Service order has been created and linked to the request.",
      });
      setShowCreateOrder(false);
      setSelectedRequest(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create service order.",
        variant: "destructive",
      });
    },
  });

  // Create work order mutation
  const createWorkOrderMutation = useMutation({
    mutationFn: (data: WorkOrderForm) => apiRequest('/api/work-orders', 'POST', data),
    onSuccess: (workOrder: any) => {
      if (selectedRequest && workOrder?.id) {
        // Link the service request to the work order
        apiRequest(`/api/service-requests/${selectedRequest.id}/work-orders/${workOrder.id}`, 'POST', {});
      }
      queryClient.invalidateQueries({ queryKey: ['/api/service-requests'] });
      toast({
        title: "Work Order Created",
        description: "Work order has been created and linked to the request.",
      });
      setShowCreateOrder(false);
      setSelectedRequest(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create work order.",
        variant: "destructive",
      });
    },
  });

  const statusForm = useForm<StatusUpdate>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      status: selectedRequest?.status || 'submitted',
      notes: '',
    },
  });

  const serviceOrderForm = useForm<ServiceOrderForm>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedStaffId: '',
      estimatedCost: '',
    },
  });

  const workOrderForm = useForm<WorkOrderForm>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      title: '',
      description: '',
      contractorName: '',
      contractorContact: '',
      estimatedCost: '',
    },
  });

  // Filter service requests
  const filteredRequests = serviceRequests.filter(request => {
    const statusMatch = filterStatus === "all" || request.status === filterStatus;
    const priorityMatch = filterPriority === "all" || request.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleStatusUpdate = (data: StatusUpdate) => {
    if (selectedRequest) {
      updateStatusMutation.mutate({ 
        id: selectedRequest.id, 
        data: {
          ...data,
          acknowledgedAt: data.status === 'acknowledged' ? new Date().toISOString() : undefined,
          triagedAt: data.status === 'triaged' ? new Date().toISOString() : undefined,
          resolvedAt: data.status === 'resolved' ? new Date().toISOString() : undefined,
        } as any
      });
    }
  };

  const handleCreateServiceOrder = (data: ServiceOrderForm) => {
    createServiceOrderMutation.mutate(data);
  };

  const handleCreateWorkOrder = (data: WorkOrderForm) => {
    createWorkOrderMutation.mutate(data);
  };

  const formatStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRequestStatusCounts = () => {
    return {
      submitted: serviceRequests.filter(r => r.status === 'submitted').length,
      acknowledged: serviceRequests.filter(r => r.status === 'acknowledged').length,
      triaged: serviceRequests.filter(r => r.status === 'triaged').length,
      in_progress: serviceRequests.filter(r => r.status === 'in_progress').length,
      resolved: serviceRequests.filter(r => r.status === 'resolved').length,
    };
  };

  const statusCounts = getRequestStatusCounts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Service Request Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">All Requests</TabsTrigger>
            <TabsTrigger value="workflow">Workflow Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            {/* Filters */}
            <div className="flex space-x-4">
              <Select onValueChange={setFilterStatus} defaultValue="all">
                <SelectTrigger className="w-48" data-testid="filter-status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="triaged">Triaged</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={setFilterPriority} defaultValue="all">
                <SelectTrigger className="w-48" data-testid="filter-priority">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Service Requests Table */}
            {isLoading ? (
              <div className="text-center py-8">Loading service requests...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No service requests found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Space</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    const StatusIcon = statusIcons[request.status] || Clock;
                    return (
                      <TableRow key={request.id} data-testid={`request-row-${request.id}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.title}</div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {request.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[request.priority]}>
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className="w-4 h-4" />
                            <Badge className={statusColors[request.status]}>
                              {formatStatusText(request.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{request.spaceId}</TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedRequest(request)}
                                data-testid={`manage-request-${request.id}`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Manage Service Request</DialogTitle>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-6">
                                  {/* Request Details */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium">Request Details</h4>
                                      <p className="text-sm text-gray-600 mt-1">{selectedRequest.title}</p>
                                      <p className="text-sm text-gray-600 mt-2">{selectedRequest.description}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Current Status</h4>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Badge className={priorityColors[selectedRequest.priority]}>
                                          {selectedRequest.priority}
                                        </Badge>
                                        <Badge className={statusColors[selectedRequest.status]}>
                                          {formatStatusText(selectedRequest.status)}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Status Update Form */}
                                  <div>
                                    <h4 className="font-medium mb-3">Update Status</h4>
                                    <Form {...statusForm}>
                                      <form onSubmit={statusForm.handleSubmit(handleStatusUpdate)} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <FormField
                                            control={statusForm.control}
                                            name="status"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>New Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                  <FormControl>
                                                    <SelectTrigger data-testid="status-update-select">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                  </FormControl>
                                                  <SelectContent>
                                                    <SelectItem value="submitted">Submitted</SelectItem>
                                                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                                                    <SelectItem value="triaged">Triaged</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="resolved">Resolved</SelectItem>
                                                    <SelectItem value="closed">Closed</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={statusForm.control}
                                            name="notes"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Notes (Optional)</FormLabel>
                                                <FormControl>
                                                  <Textarea placeholder="Add notes..." {...field} data-testid="status-notes" />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                        <Button 
                                          type="submit" 
                                          disabled={updateStatusMutation.isPending}
                                          data-testid="update-status-btn"
                                        >
                                          {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                                        </Button>
                                      </form>
                                    </Form>
                                  </div>

                                  {/* Create Order Actions */}
                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3">Create Work Order</h4>
                                    <div className="flex space-x-2">
                                      <Button 
                                        onClick={() => { setOrderType('service'); setShowCreateOrder(true); }}
                                        variant="outline"
                                        data-testid="create-service-order-btn"
                                      >
                                        <Users className="w-4 h-4 mr-1" />
                                        Create Service Order (Staff)
                                      </Button>
                                      <Button 
                                        onClick={() => { setOrderType('work'); setShowCreateOrder(true); }}
                                        variant="outline"
                                        data-testid="create-work-order-btn"
                                      >
                                        <Wrench className="w-4 h-4 mr-1" />
                                        Create Work Order (Contractor)
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="workflow" className="space-y-4">
            {/* Workflow Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{statusCounts.submitted}</div>
                  <div className="text-sm text-gray-600">New Requests</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{statusCounts.acknowledged}</div>
                  <div className="text-sm text-gray-600">Acknowledged</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{statusCounts.triaged}</div>
                  <div className="text-sm text-gray-600">Triaged</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{statusCounts.in_progress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{statusCounts.resolved}</div>
                  <div className="text-sm text-gray-600">Resolved</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Order Dialog */}
        {showCreateOrder && selectedRequest && (
          <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Create {orderType === 'service' ? 'Service' : 'Work'} Order
                </DialogTitle>
              </DialogHeader>
              {orderType === 'service' ? (
                <Form {...serviceOrderForm}>
                  <form onSubmit={serviceOrderForm.handleSubmit(handleCreateServiceOrder)} className="space-y-4">
                    <FormField
                      control={serviceOrderForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Service order title" {...field} data-testid="service-order-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={serviceOrderForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Detailed work description" {...field} data-testid="service-order-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={serviceOrderForm.control}
                      name="estimatedCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Cost</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="service-order-cost" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={createServiceOrderMutation.isPending}
                      data-testid="submit-service-order"
                    >
                      {createServiceOrderMutation.isPending ? "Creating..." : "Create Service Order"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...workOrderForm}>
                  <form onSubmit={workOrderForm.handleSubmit(handleCreateWorkOrder)} className="space-y-4">
                    <FormField
                      control={workOrderForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Work order title" {...field} data-testid="work-order-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={workOrderForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Detailed work description" {...field} data-testid="work-order-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={workOrderForm.control}
                      name="contractorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contractor Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Contractor or company name" {...field} data-testid="work-order-contractor" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={workOrderForm.control}
                      name="contractorContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contractor Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone or email" {...field} data-testid="work-order-contact" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={workOrderForm.control}
                      name="estimatedCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Cost</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="work-order-cost" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={createWorkOrderMutation.isPending}
                      data-testid="submit-work-order"
                    >
                      {createWorkOrderMutation.isPending ? "Creating..." : "Create Work Order"}
                    </Button>
                  </form>
                </Form>
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}