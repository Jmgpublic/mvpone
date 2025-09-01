import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Calendar, MessageSquare, FileText, Star, Plus, Send, Edit, Trash2, Clock, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'announcement' | 'event' | 'note' | 'news' | 'highlight';
  title: string;
  content: string;
  status: 'active' | 'scheduled' | 'draft';
  recipients?: string;
  scheduledDate?: string;
  createdAt: string;
  priority?: 'low' | 'medium' | 'high';
}

export default function MessagingPanel() {
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentMessageType, setCurrentMessageType] = useState<'announcement' | 'event' | 'note' | 'news' | 'highlight'>('announcement');
  const { toast } = useToast();
  
  // Mock data for messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "announcement",
      title: "Pool Maintenance Schedule",
      content: "Pool will be closed for maintenance on Friday from 9 AM to 3 PM. We apologize for any inconvenience.",
      status: "active",
      recipients: "all",
      createdAt: "2025-03-15T10:00:00Z",
      priority: "medium"
    },
    {
      id: "2",
      type: "announcement",
      title: "New Fitness Center Hours",
      content: "Extended hours starting next week: Monday-Friday 5 AM - 11 PM, Saturday-Sunday 6 AM - 10 PM.",
      status: "scheduled",
      recipients: "all",
      scheduledDate: "2025-03-20T08:00:00Z",
      createdAt: "2025-03-14T15:30:00Z",
      priority: "low"
    },
    {
      id: "3",
      type: "event",
      title: "Community BBQ",
      content: "Join us for our monthly community BBQ in the courtyard. Food and drinks provided!",
      status: "active",
      recipients: "all",
      createdAt: "2025-03-12T09:00:00Z",
      priority: "high"
    }
  ]);

  const handleCreateMessage = () => {
    if (!announcementTitle.trim() || !newAnnouncement.trim()) {
      toast({ title: "Please fill in both title and content", variant: "destructive" });
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: currentMessageType,
      title: announcementTitle,
      content: newAnnouncement,
      status: "active",
      recipients: "all",
      createdAt: new Date().toISOString(),
      priority: "medium"
    };

    setMessages([newMessage, ...messages]);
    setAnnouncementTitle("");
    setNewAnnouncement("");
    setIsCreateDialogOpen(false);
    toast({ title: `${currentMessageType.charAt(0).toUpperCase() + currentMessageType.slice(1)} created successfully` });
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      setMessages(messages.filter(msg => msg.id !== id));
      toast({ title: "Message deleted successfully" });
    }
  };

  const getMessagesByType = (type: string) => {
    return messages.filter(msg => msg.type === type);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500">Active</Badge>;
      case 'scheduled': return <Badge variant="outline">Scheduled</Badge>;
      case 'draft': return <Badge variant="secondary">Draft</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Messaging & Communications</h3>
        <Button data-testid="button-create-message">
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="calendar">Calendaring</TabsTrigger>
          <TabsTrigger value="notes">Notes to Residents</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
        </TabsList>

        {/* Announcements */}
        <TabsContent value="announcements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Create and Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Announcements Overview</span>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setCurrentMessageType('announcement')} data-testid="button-create-announcement">
                        <Plus className="w-4 h-4 mr-2" />
                        New Announcement
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Announcement</DialogTitle>
                        <DialogDescription>
                          Send an important message to residents about property updates or notices.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Title</label>
                          <Input
                            placeholder="Enter announcement title"
                            value={announcementTitle}
                            onChange={(e) => setAnnouncementTitle(e.target.value)}
                            data-testid="input-announcement-title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Message</label>
                          <Textarea 
                            placeholder="Write your announcement here..."
                            rows={4}
                            value={newAnnouncement}
                            onChange={(e) => setNewAnnouncement(e.target.value)}
                            data-testid="textarea-announcement-content"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Recipients</label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Residents</SelectItem>
                              <SelectItem value="building-a">Building A Only</SelectItem>
                              <SelectItem value="building-b">Building B Only</SelectItem>
                              <SelectItem value="specific">Specific Units</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleCreateMessage} data-testid="button-send-announcement">
                            <Send className="w-4 h-4 mr-2" />
                            Send Now
                          </Button>
                          <Button variant="outline" data-testid="button-schedule-announcement">
                            <Clock className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{getMessagesByType('announcement').filter(m => m.status === 'active').length}</div>
                    <div className="text-sm text-gray-600">Active</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{getMessagesByType('announcement').filter(m => m.status === 'scheduled').length}</div>
                    <div className="text-sm text-gray-600">Scheduled</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">{getMessagesByType('announcement').filter(m => m.status === 'draft').length}</div>
                    <div className="text-sm text-gray-600">Drafts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getMessagesByType('announcement').map((announcement) => (
                    <div key={announcement.id} className={`border-l-4 ${getPriorityColor(announcement.priority || 'medium')} pl-4`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{announcement.title}</h4>
                        <div className="flex items-center space-x-2">
                          {announcement.priority === 'high' && <Badge variant="destructive">High Priority</Badge>}
                          {getStatusBadge(announcement.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{announcement.content.substring(0, 100)}...</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{announcement.recipients || 'All residents'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" data-testid={`button-edit-announcement-${announcement.id}`}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteMessage(announcement.id)}
                            data-testid={`button-delete-announcement-${announcement.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {getMessagesByType('announcement').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2" />
                      <p>No announcements yet</p>
                      <p className="text-sm">Create your first announcement to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calendaring */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Event Calendar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Upcoming Events</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">Community BBQ</h5>
                        <p className="text-sm text-gray-600">Saturday, 2:00 PM - 5:00 PM</p>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-edit-event-1">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">Yoga Class</h5>
                        <p className="text-sm text-gray-600">Every Tuesday, 6:00 PM</p>
                      </div>
                      <Button size="sm" variant="outline" data-testid="button-edit-event-2">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Add New Event</h4>
                  <div className="space-y-4">
                    <Input placeholder="Event title" data-testid="input-event-title" />
                    <Input type="datetime-local" data-testid="input-event-datetime" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="community">Community Event</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="meeting">Resident Meeting</SelectItem>
                        <SelectItem value="social">Social Activity</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Event description" rows={3} data-testid="textarea-event-description" />
                    <Button className="w-full" onClick={() => toast({ title: "Event created successfully" })} data-testid="button-create-event">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes to Residents */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Resident Communications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Recipients</label>
                    <Select>
                      <SelectTrigger data-testid="select-recipients">
                        <SelectValue placeholder="Choose recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Residents</SelectItem>
                        <SelectItem value="building-a">Building A Residents</SelectItem>
                        <SelectItem value="building-b">Building B Residents</SelectItem>
                        <SelectItem value="specific">Specific Units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message Type</label>
                    <Select>
                      <SelectTrigger data-testid="select-message-type">
                        <SelectValue placeholder="Choose message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Notice</SelectItem>
                        <SelectItem value="maintenance">Maintenance Alert</SelectItem>
                        <SelectItem value="policy">Policy Update</SelectItem>
                        <SelectItem value="emergency">Emergency Notice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Input placeholder="Subject line" data-testid="input-note-subject" />
                <Textarea 
                  placeholder="Write your message to residents..."
                  rows={6}
                  data-testid="textarea-note-content"
                />
                <div className="flex space-x-2">
                  <Button onClick={() => toast({ title: "Note sent to residents" })} data-testid="button-send-note">
                    <Send className="w-4 h-4 mr-2" />
                    Send Note
                  </Button>
                  <Button variant="outline" data-testid="button-schedule-note">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News */}
        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Community News</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <Badge className="mb-2">Latest</Badge>
                      <h4 className="font-medium mb-2">Spring Landscaping Update</h4>
                      <p className="text-sm text-gray-600">New flowers and trees being planted around the complex...</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">March 15, 2025</span>
                        <Button size="sm" variant="outline" data-testid="button-edit-news-1">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">Published</Badge>
                      <h4 className="font-medium mb-2">New Security Measures</h4>
                      <p className="text-sm text-gray-600">Enhanced security protocols now in effect...</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">March 10, 2025</span>
                        <Button size="sm" variant="outline" data-testid="button-edit-news-2">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-2">
                    <CardContent className="p-4 text-center">
                      <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Create News Article</p>
                      <Button size="sm" className="mt-2" onClick={() => toast({ title: "News article created successfully" })} data-testid="button-create-news">
                        Add News
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Highlights */}
        <TabsContent value="highlights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Community Highlights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Featured Highlights</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-l-yellow-500 pl-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <h5 className="font-medium">Resident of the Month</h5>
                      </div>
                      <p className="text-sm text-gray-600">Sarah Johnson from Unit 3B for her community garden contributions</p>
                    </div>

                    <div className="border-l-4 border-l-green-500 pl-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="w-4 h-4 text-green-500" />
                        <h5 className="font-medium">Energy Efficiency Award</h5>
                      </div>
                      <p className="text-sm text-gray-600">Building A achieved 20% reduction in energy consumption</p>
                    </div>

                    <div className="border-l-4 border-l-blue-500 pl-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="w-4 h-4 text-blue-500" />
                        <h5 className="font-medium">Community Achievement</h5>
                      </div>
                      <p className="text-sm text-gray-600">Successful food drive collected 500+ items for local shelter</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Add New Highlight</h4>
                  <div className="space-y-4">
                    <Select>
                      <SelectTrigger data-testid="select-highlight-type">
                        <SelectValue placeholder="Select highlight type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resident">Resident Recognition</SelectItem>
                        <SelectItem value="building">Building Achievement</SelectItem>
                        <SelectItem value="event">Community Event Success</SelectItem>
                        <SelectItem value="environmental">Environmental Initiative</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Highlight title" data-testid="input-highlight-title" />
                    <Textarea placeholder="Describe the highlight..." rows={4} data-testid="textarea-highlight-description" />
                    <Button className="w-full" onClick={() => toast({ title: "Highlight created successfully" })} data-testid="button-create-highlight">
                      <Star className="w-4 h-4 mr-2" />
                      Create Highlight
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}