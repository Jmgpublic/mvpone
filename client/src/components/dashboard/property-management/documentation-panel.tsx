import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, FileCheck, ClipboardList, Plus, Download, Upload, Edit, Trash2, Eye, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'form' | 'checklist' | 'disclosure';
  status: 'active' | 'draft' | 'archived';
  lastModified: string;
  content?: string;
}

export default function DocumentationPanel() {
  const [activeDocType, setActiveDocType] = useState<string>("admin-formage");
  const [editingDoc, setEditingDoc] = useState<DocumentTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocDescription, setNewDocDescription] = useState("");
  const { toast } = useToast();

  // Mock data for demonstration
  const [documents, setDocuments] = useState<DocumentTemplate[]>([
    {
      id: "1",
      name: "Property Application",
      description: "Standard rental application form",
      type: "form",
      status: "active",
      lastModified: "2025-03-15"
    },
    {
      id: "2",
      name: "Background Check Form",
      description: "Tenant screening documentation",
      type: "form",
      status: "active",
      lastModified: "2025-03-10"
    },
    {
      id: "3",
      name: "New Tenant Onboarding",
      description: "Standard checklist for new residents",
      type: "checklist",
      status: "active",
      lastModified: "2025-03-12"
    },
    {
      id: "4",
      name: "Lead Paint Disclosure",
      description: "Federal requirement for properties built before 1978",
      type: "disclosure",
      status: "active",
      lastModified: "2025-03-01"
    }
  ]);

  const handleCreateDocument = () => {
    if (!newDocName.trim()) {
      toast({ title: "Please enter a document name", variant: "destructive" });
      return;
    }

    const newDoc: DocumentTemplate = {
      id: Date.now().toString(),
      name: newDocName,
      description: newDocDescription,
      type: activeDocType === "admin-formage" ? "form" : activeDocType === "onboarding-checklist" ? "checklist" : "disclosure",
      status: "draft",
      lastModified: new Date().toISOString().split('T')[0]
    };

    setDocuments([...documents, newDoc]);
    setNewDocName("");
    setNewDocDescription("");
    setIsCreateModalOpen(false);
    toast({ title: "Document created successfully" });
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments(documents.filter(doc => doc.id !== id));
      toast({ title: "Document deleted successfully" });
    }
  };

  const getDocumentsByType = (type: 'form' | 'checklist' | 'disclosure') => {
    return documents.filter(doc => doc.type === type);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Documentation & Formage</h3>
        <Button data-testid="button-upload-document">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Tabs defaultValue="admin-formage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="admin-formage">Admin Formage</TabsTrigger>
          <TabsTrigger value="onboarding-checklist">Onboarding Checklist</TabsTrigger>
          <TabsTrigger value="onboarding-disclosures">Onboarding Disclosures</TabsTrigger>
        </TabsList>

        {/* Admin Formage */}
        <TabsContent value="admin-formage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Administrative Forms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Card className="border-dashed border-2 hover:border-solid cursor-pointer transition-all">
                      <CardContent className="p-6 text-center">
                        <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Create New Form</p>
                        <p className="text-xs text-gray-500">Add administrative form</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Administrative Form</DialogTitle>
                      <DialogDescription>
                        Create a new form template for administrative purposes.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Form Name</label>
                        <Input
                          placeholder="Enter form name"
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          data-testid="input-new-form-name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          placeholder="Describe the purpose of this form"
                          value={newDocDescription}
                          onChange={(e) => setNewDocDescription(e.target.value)}
                          data-testid="textarea-new-form-description"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleCreateDocument} data-testid="button-create-form">
                          <Save className="w-4 h-4 mr-2" />
                          Create Form
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {getDocumentsByType('form').map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <Badge variant={doc.status === 'active' ? 'default' : 'secondary'}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Modified: {doc.lastModified}</p>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" data-testid={`button-view-${doc.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-edit-${doc.id}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-download-${doc.id}`}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteDocument(doc.id)}
                          data-testid={`button-delete-${doc.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {getDocumentsByType('form').length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-2" />
                      <p>No forms created yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onboarding Checklist */}
        <TabsContent value="onboarding-checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="w-5 h-5" />
                <span>Onboarding Checklists</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getDocumentsByType('checklist').map((checklist) => (
                  <Card key={checklist.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{checklist.name}</h4>
                          <p className="text-sm text-gray-600">{checklist.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Modified: {checklist.lastModified}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">12 Items</Badge>
                          <Button size="sm" data-testid={`button-view-checklist-${checklist.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" data-testid={`button-edit-checklist-${checklist.id}`}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteDocument(checklist.id)}
                            data-testid={`button-delete-checklist-${checklist.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {checklist.id === "3" && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span>Application submitted</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span>Background check completed</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2 flex items-center justify-center">
                              <span className="text-white text-xs">•</span>
                            </div>
                            <span>References verified</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                            <span className="text-gray-500">Income verification</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                <Dialog open={activeDocType === 'onboarding-checklist' && isCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Card className="border-dashed border-2 hover:border-solid cursor-pointer transition-all">
                      <CardContent className="p-4 text-center">
                        <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Create New Checklist</p>
                        <p className="text-xs text-gray-500">Add onboarding checklist</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onboarding Disclosures */}
        <TabsContent value="onboarding-disclosures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5" />
                <span>Legal Disclosures</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getDocumentsByType('disclosure').map((disclosure) => (
                  <Card key={disclosure.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FileCheck className="w-5 h-5 text-green-600" />
                          <span className="font-medium">{disclosure.name}</span>
                        </div>
                        <Badge variant="secondary">Required</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{disclosure.description}</p>
                      <p className="text-xs text-gray-500 mb-3">Modified: {disclosure.lastModified}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" data-testid={`button-view-disclosure-${disclosure.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-edit-disclosure-${disclosure.id}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-download-disclosure-${disclosure.id}`}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteDocument(disclosure.id)}
                          data-testid={`button-delete-disclosure-${disclosure.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Dialog open={activeDocType === 'onboarding-disclosures' && isCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Card className="border-dashed border-2 hover:border-solid cursor-pointer transition-all">
                      <CardContent className="p-4 text-center">
                        <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Add Disclosure</p>
                        <p className="text-xs text-gray-500">Create custom disclosure</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}