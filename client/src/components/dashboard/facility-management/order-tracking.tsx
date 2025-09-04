import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Wrench, Eye, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
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
const serviceOrderUpdateSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']),
  assignedStaffId: z.string().optional(),
  actualCost: z.string().optional(),
  completionNotes: z.string().optional(),
});

const workOrderUpdateSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']),
  contractorName: z.string().optional(),
  contractorContact: z.string().optional(),
  actualCost: z.string().optional(),
  completionNotes: z.string().optional(),
});

type ServiceOrderUpdate = z.infer<typeof serviceOrderUpdateSchema>;
type WorkOrderUpdate = z.infer<typeof workOrderUpdateSchema>;

interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedStaffId?: string;
  estimatedCost?: string;
  actualCost?: string;
  completionNotes?: string;
  createdAt: string;
  completedAt?: string;
}

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  contractorName?: string;
  contractorContact?: string;
  estimatedCost?: string;
  actualCost?: string;
  completionNotes?: string;
  createdAt: string;
  completedAt?: string;
}

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  assigned: "bg-blue-100 text-blue-800",
  in_progress: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusIcons = {
  pending: Clock,
  assigned: Users,
  in_progress: Clock,
  completed: CheckCircle,
  cancelled: XCircle
};

export default function OrderTracking() {
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch service orders
  const { data: serviceOrders = [], isLoading: isLoadingServiceOrders } = useQuery<ServiceOrder[]>({
    queryKey: ['/api/service-orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/service-orders');
      return await response.json();
    },
  });

  // Fetch work orders
  const { data: workOrders = [], isLoading: isLoadingWorkOrders } = useQuery<WorkOrder[]>({
    queryKey: ['/api/work-orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/work-orders');
      return await response.json();
    },
  });

  // Update service order mutation
  const updateServiceOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServiceOrderUpdate }) => {
      const response = await apiRequest('PUT', `/api/service-orders/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/service-orders'] });
      toast({
        title: "Service Order Updated",
        description: "Service order has been updated successfully.",
      });
      setSelectedServiceOrder(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service order.",
        variant: "destructive",
      });
    },
  });

  // Update work order mutation
  const updateWorkOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: WorkOrderUpdate }) => {
      const response = await apiRequest('PUT', `/api/work-orders/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/work-orders'] });
      toast({
        title: "Work Order Updated",
        description: "Work order has been updated successfully.",
      });
      setSelectedWorkOrder(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update work order.",
        variant: "destructive",
      });
    },
  });

  const serviceOrderForm = useForm<ServiceOrderUpdate>({
    resolver: zodResolver(serviceOrderUpdateSchema),
    defaultValues: {
      status: selectedServiceOrder?.status || 'pending',
      assignedStaffId: selectedServiceOrder?.assignedStaffId || '',
      actualCost: selectedServiceOrder?.actualCost || '',
      completionNotes: selectedServiceOrder?.completionNotes || '',
    },
  });

  const workOrderForm = useForm<WorkOrderUpdate>({
    resolver: zodResolver(workOrderUpdateSchema),
    defaultValues: {
      status: selectedWorkOrder?.status || 'pending',
      contractorName: selectedWorkOrder?.contractorName || '',
      contractorContact: selectedWorkOrder?.contractorContact || '',
      actualCost: selectedWorkOrder?.actualCost || '',
      completionNotes: selectedWorkOrder?.completionNotes || '',
    },
  });

  // Filter orders
  const filteredServiceOrders = serviceOrders.filter(order => 
    filterStatus === "all" || order.status === filterStatus
  );

  const filteredWorkOrders = workOrders.filter(order => 
    filterStatus === "all" || order.status === filterStatus
  );

  const handleServiceOrderUpdate = (data: ServiceOrderUpdate) => {
    if (selectedServiceOrder) {
      updateServiceOrderMutation.mutate({ 
        id: selectedServiceOrder.id, 
        data: {
          ...data,
          completedAt: data.status === 'completed' ? new Date().toISOString() : undefined,
        } as any
      });
    }
  };

  const handleWorkOrderUpdate = (data: WorkOrderUpdate) => {
    if (selectedWorkOrder) {
      updateWorkOrderMutation.mutate({ 
        id: selectedWorkOrder.id, 
        data: {
          ...data,
          completedAt: data.status === 'completed' ? new Date().toISOString() : undefined,
        } as any
      });
    }
  };

  const formatStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: string) => {
    if (!amount) return 'N/A';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getOrderStatusCounts = (orders: (ServiceOrder | WorkOrder)[]) => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      assigned: orders.filter(o => o.status === 'assigned').length,
      in_progress: orders.filter(o => o.status === 'in_progress').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  };

  const serviceOrderCounts = getOrderStatusCounts(serviceOrders);
  const workOrderCounts = getOrderStatusCounts(workOrders);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wrench className="w-5 h-5" />
          <span>Work Order Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="service-orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="service-orders">Service Orders (Staff)</TabsTrigger>
            <TabsTrigger value="work-orders">Work Orders (Contractors)</TabsTrigger>
          </TabsList>

          <TabsContent value="service-orders" className="space-y-4">
            {/* Service Order Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{serviceOrderCounts.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{serviceOrderCounts.assigned}</div>
                  <div className="text-sm text-gray-600">Assigned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{serviceOrderCounts.in_progress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{serviceOrderCounts.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{serviceOrderCounts.cancelled}</div>
                  <div className="text-sm text-gray-600">Cancelled</div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <Select onValueChange={setFilterStatus} defaultValue="all">
              <SelectTrigger className="w-48" data-testid="filter-service-order-status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Service Orders Table */}
            {isLoadingServiceOrders ? (
              <div className="text-center py-8">Loading service orders...</div>
            ) : filteredServiceOrders.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No service orders found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Actual Cost</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServiceOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status] || Clock;
                    return (
                      <TableRow key={order.id} data-testid={`service-order-row-${order.id}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.title}</div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {order.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className="w-4 h-4" />
                            <Badge className={statusColors[order.status]}>
                              {formatStatusText(order.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{order.assignedStaffId || 'Unassigned'}</TableCell>
                        <TableCell>{formatCurrency(order.estimatedCost)}</TableCell>
                        <TableCell>{formatCurrency(order.actualCost)}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedServiceOrder(order)}
                                data-testid={`manage-service-order-${order.id}`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Manage Service Order</DialogTitle>
                              </DialogHeader>
                              {selectedServiceOrder && (
                                <div className="space-y-6">
                                  {/* Order Details */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium">Order Details</h4>
                                      <p className="text-sm text-gray-600 mt-1">{selectedServiceOrder.title}</p>
                                      <p className="text-sm text-gray-600 mt-2">{selectedServiceOrder.description}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Current Status</h4>
                                      <Badge className={statusColors[selectedServiceOrder.status]} style={{marginTop: '4px'}}>
                                        {formatStatusText(selectedServiceOrder.status)}
                                      </Badge>
                                    </div>
                                  </div>

                                  {/* Update Form */}
                                  <Form {...serviceOrderForm}>
                                    <form onSubmit={serviceOrderForm.handleSubmit(handleServiceOrderUpdate)} className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                          control={serviceOrderForm.control}
                                          name="status"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Status</FormLabel>
                                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                  <SelectTrigger data-testid="service-order-status-select">
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="pending">Pending</SelectItem>
                                                  <SelectItem value="assigned">Assigned</SelectItem>
                                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                                  <SelectItem value="completed">Completed</SelectItem>
                                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={serviceOrderForm.control}
                                          name="assignedStaffId"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Assigned Staff</FormLabel>
                                              <FormControl>
                                                <Input placeholder="Staff member ID" {...field} data-testid="service-order-staff" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={serviceOrderForm.control}
                                          name="actualCost"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Actual Cost</FormLabel>
                                              <FormControl>
                                                <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="service-order-actual-cost" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={serviceOrderForm.control}
                                          name="completionNotes"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Completion Notes</FormLabel>
                                              <FormControl>
                                                <Textarea placeholder="Work completion notes..." {...field} data-testid="service-order-notes" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <Button 
                                        type="submit" 
                                        disabled={updateServiceOrderMutation.isPending}
                                        data-testid="update-service-order-btn"
                                      >
                                        {updateServiceOrderMutation.isPending ? "Updating..." : "Update Service Order"}
                                      </Button>
                                    </form>
                                  </Form>
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

          <TabsContent value="work-orders" className="space-y-4">
            {/* Work Order Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{workOrderCounts.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{workOrderCounts.assigned}</div>
                  <div className="text-sm text-gray-600">Assigned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{workOrderCounts.in_progress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{workOrderCounts.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{workOrderCounts.cancelled}</div>
                  <div className="text-sm text-gray-600">Cancelled</div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <Select onValueChange={setFilterStatus} defaultValue="all">
              <SelectTrigger className="w-48" data-testid="filter-work-order-status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Work Orders Table */}
            {isLoadingWorkOrders ? (
              <div className="text-center py-8">Loading work orders...</div>
            ) : filteredWorkOrders.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No work orders found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contractor</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Actual Cost</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status] || Clock;
                    return (
                      <TableRow key={order.id} data-testid={`work-order-row-${order.id}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.title}</div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {order.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className="w-4 h-4" />
                            <Badge className={statusColors[order.status]}>
                              {formatStatusText(order.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{order.contractorName || 'Unassigned'}</TableCell>
                        <TableCell>{formatCurrency(order.estimatedCost)}</TableCell>
                        <TableCell>{formatCurrency(order.actualCost)}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedWorkOrder(order)}
                                data-testid={`manage-work-order-${order.id}`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Manage Work Order</DialogTitle>
                              </DialogHeader>
                              {selectedWorkOrder && (
                                <div className="space-y-6">
                                  {/* Order Details */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium">Order Details</h4>
                                      <p className="text-sm text-gray-600 mt-1">{selectedWorkOrder.title}</p>
                                      <p className="text-sm text-gray-600 mt-2">{selectedWorkOrder.description}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Current Status</h4>
                                      <Badge className={statusColors[selectedWorkOrder.status]} style={{marginTop: '4px'}}>
                                        {formatStatusText(selectedWorkOrder.status)}
                                      </Badge>
                                    </div>
                                  </div>

                                  {/* Update Form */}
                                  <Form {...workOrderForm}>
                                    <form onSubmit={workOrderForm.handleSubmit(handleWorkOrderUpdate)} className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                          control={workOrderForm.control}
                                          name="status"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Status</FormLabel>
                                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                  <SelectTrigger data-testid="work-order-status-select">
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="pending">Pending</SelectItem>
                                                  <SelectItem value="assigned">Assigned</SelectItem>
                                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                                  <SelectItem value="completed">Completed</SelectItem>
                                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                              </Select>
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
                                                <Input placeholder="Contractor name" {...field} data-testid="work-order-contractor-name" />
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
                                                <Input placeholder="Phone or email" {...field} data-testid="work-order-contractor-contact" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={workOrderForm.control}
                                          name="actualCost"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Actual Cost</FormLabel>
                                              <FormControl>
                                                <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="work-order-actual-cost" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={workOrderForm.control}
                                          name="completionNotes"
                                          render={({ field }) => (
                                            <FormItem className="col-span-2">
                                              <FormLabel>Completion Notes</FormLabel>
                                              <FormControl>
                                                <Textarea placeholder="Work completion notes..." {...field} data-testid="work-order-notes" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <Button 
                                        type="submit" 
                                        disabled={updateWorkOrderMutation.isPending}
                                        data-testid="update-work-order-btn"
                                      >
                                        {updateWorkOrderMutation.isPending ? "Updating..." : "Update Work Order"}
                                      </Button>
                                    </form>
                                  </Form>
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
        </Tabs>
      </CardContent>
    </Card>
  );
}