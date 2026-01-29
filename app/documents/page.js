// app/documents/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder,
  FileText,
  Upload,
  Search,
  Users,
  Shield,
  Clock,
  FileCheck2,
  Trash2,
  Edit,
  X,
  HardDrive,
  Archive,
  Download,
  Eye,
  History,
  Lock,
  File,
  List,
  Calendar,
  Filter,
  Plus,
  FolderPlus,
  UserCheck,
  FileArchive,
  Grid2X2,
  ListTree,
  MoreVertical,
  Star,
  Share2,
  Copy,
  Move,
  Tag,
  ChevronRight,
  ChevronDown,
  Check,
  Loader2,
  RefreshCw,
  AlertTriangle,
  FileSpreadsheet,
  ClipboardCheck,
  Settings,
  BarChart3,
  Users as UsersIcon,
  Target,
  Zap,
  Building,
  Wrench,
  Truck,
  Shield as ShieldIcon,
  BookOpen,
  Music,
  Video,
  Image,
  ChevronUp,
  FolderOpen,
  FolderClosed,
  FileImage,
  FileVideo,
  FileMusic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Toaster, toast } from 'sonner';

// Asset Management System Folder Structure from the email
const ASSET_MANAGEMENT_STRUCTURE = [
  {
    id: '1',
    name: '1. Organizational Context',
    type: 'folder',
    children: [
      { id: '1-1', name: '1.1 Internal & External Issues', type: 'folder', children: [] },
      { id: '1-2', name: '1.2 Stakeholder Requirements', type: 'folder', children: [] },
      { id: '1-3', name: '1.3 AMS Scope & Boundaries', type: 'folder', children: [] },
      { id: '1-4', name: '1.4 Asset Hierarchy & Data Governance', type: 'folder', children: [] },
    ],
    expanded: true
  },
  {
    id: '2',
    name: '2. Leadership',
    type: 'folder',
    children: [
      { id: '2-1', name: '2.1 Organizational Structure & Roles', type: 'folder', children: [] },
      { id: '2-2', name: '2.2 Asset Management Policy', type: 'folder', children: [] },
      { id: '2-3', name: '2.3 Responsibilities & Authorities (RACI)', type: 'folder', children: [] },
    ],
    expanded: true
  },
  {
    id: '3',
    name: '3. Planning',
    type: 'folder',
    children: [
      {
        id: '3-1',
        name: '3.1 Risk Management',
        type: 'folder',
        children: [
          { id: '3-1-1', name: 'Asset Risk Register', type: 'folder', children: [] },
          { id: '3-1-2', name: 'Criticality Analysis', type: 'folder', children: [] },
          { id: '3-1-3', name: 'Hazard & Reliability Risk Assessments', type: 'folder', children: [] },
        ],
        expanded: true
      },
      { id: '3-2', name: '3.2 AM Objectives & KPIs', type: 'folder', children: [], expanded: true },
      {
        id: '3-3',
        name: '3.3 Asset Management Plans (AMP)',
        type: 'folder',
        children: [
          { id: '3-3-1', name: 'Strategic AMP', type: 'folder', children: [] },
          { id: '3-3-2', name: 'Annual AMP', type: 'folder', children: [] },
        ],
        expanded: true
      },
      { id: '3-4', name: '3.4 Budget, Forecast & Demand Planning', type: 'folder', children: [], expanded: true },
      { id: '3-5', name: '3.5 Change Management (Engineering Change)', type: 'folder', children: [], expanded: true },
    ],
    expanded: true
  }
];

// Mock API calls with localStorage persistence
const mockApi = {
  getFolderTree: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Try to get from localStorage first
        const savedTree = localStorage.getItem('ams_folder_tree');
        if (savedTree) {
          resolve(JSON.parse(savedTree));
        } else {
          // Initialize with default structure
          localStorage.setItem('ams_folder_tree', JSON.stringify(ASSET_MANAGEMENT_STRUCTURE));
          resolve(ASSET_MANAGEMENT_STRUCTURE);
        }
      }, 300);
    });
  },

  saveFolderTree: async (tree) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('ams_folder_tree', JSON.stringify(tree));
        resolve(true);
      }, 200);
    });
  },

  getFolderContents: async (folderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedContents = localStorage.getItem(`folder_contents_${folderId}`);
        if (savedContents) {
          resolve(JSON.parse(savedContents));
        } else {
          // Generate initial documents for each folder
          const documents = [
            {
              id: `${folderId}-doc1`,
              name: 'Asset Management Policy.pdf',
              type: 'pdf',
              parent_id: folderId,
              file_size: 2048000,
              version: '1.0',
              status: 'active',
              access_level: 'admin',
              tags: ['policy', 'iso55001', 'asset-management'],
              metadata: {},
              created_at: '2024-01-15T10:30:00Z',
              updated_at: '2024-01-15T10:30:00Z'
            },
            {
              id: `${folderId}-doc2`,
              name: 'Implementation Plan.docx',
              type: 'docx',
              parent_id: folderId,
              file_size: 1536000,
              version: '1.2',
              status: 'active',
              access_level: 'restricted',
              tags: ['plan', 'implementation'],
              metadata: {},
              created_at: '2024-01-10T14:20:00Z',
              updated_at: '2024-01-12T09:15:00Z'
            },
            {
              id: `${folderId}-doc3`,
              name: 'Risk Assessment Matrix.xlsx',
              type: 'xlsx',
              parent_id: folderId,
              file_size: 512000,
              version: '2.1',
              status: 'active',
              access_level: 'restricted',
              tags: ['risk', 'assessment', 'matrix'],
              metadata: {},
              created_at: '2024-01-08T09:45:00Z',
              updated_at: '2024-01-14T16:20:00Z'
            }
          ];
          
          localStorage.setItem(`folder_contents_${folderId}`, JSON.stringify(documents));
          resolve(documents);
        }
      }, 200);
    });
  },

  saveFolderContents: async (folderId, contents) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(`folder_contents_${folderId}`, JSON.stringify(contents));
        resolve(true);
      }, 200);
    });
  },

  createFolder: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFolder = {
          id: `folder-${Date.now()}`,
          name: data.name,
          type: 'folder',
          parent_id: data.parent_id,
          version: '1.0',
          status: 'active',
          access_level: data.access_level,
          tags: [],
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          children_count: 0,
          expanded: true
        };
        resolve(newFolder);
      }, 400);
    });
  },

  deleteDocument: async (documentId, folderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedContents = localStorage.getItem(`folder_contents_${folderId}`);
        if (savedContents) {
          const contents = JSON.parse(savedContents);
          const filteredContents = contents.filter(doc => doc.id !== documentId);
          localStorage.setItem(`folder_contents_${folderId}`, JSON.stringify(filteredContents));
          resolve({ success: true, message: 'Document deleted successfully' });
        }
        resolve({ success: false, message: 'Document not found' });
      }, 300);
    });
  },

  deleteFolder: async (folderId, parentFolderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Remove folder contents from localStorage
        localStorage.removeItem(`folder_contents_${folderId}`);
        
        // Remove from folder tree
        const savedTree = localStorage.getItem('ams_folder_tree');
        if (savedTree) {
          const removeFolderFromTree = (nodes) => {
            return nodes.filter(node => node.id !== folderId)
              .map(node => ({
                ...node,
                children: node.children ? removeFolderFromTree(node.children) : []
              }));
          };
          
          const tree = JSON.parse(savedTree);
          const updatedTree = removeFolderFromTree(tree);
          localStorage.setItem('ams_folder_tree', JSON.stringify(updatedTree));
        }
        
        resolve({ success: true, message: 'Folder deleted successfully' });
      }, 400);
    });
  },

  uploadFile: async (fileData, file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFile = {
          id: `file-${Date.now()}`,
          name: fileData.name || file.name,
          type: fileData.type || getFileExtension(file.name),
          parent_id: fileData.parent_id,
          file_size: file.size || 0,
          version: '1.0',
          status: 'active',
          access_level: fileData.access_level || 'restricted',
          tags: fileData.tags || [],
          metadata: {
            original_filename: file.name,
            mime_type: file.type,
            uploaded_at: new Date().toISOString()
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        resolve(newFile);
      }, 600);
    });
  }
};

// Helper functions
const getFileExtension = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
  const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
  const docExts = ['doc', 'docx'];
  const excelExts = ['xls', 'xlsx', 'csv'];
  const pdfExts = ['pdf'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (docExts.includes(ext)) return 'docx';
  if (excelExts.includes(ext)) return 'xlsx';
  if (pdfExts.includes(ext)) return 'pdf';
  return ext;
};

// File Icon Component
const FileIcon = ({ type, className = "h-5 w-5" }) => {
  switch (type) {
    case 'folder':
      return <Folder className={`${className} text-blue-500`} />;
    case 'pdf':
      return <FileText className={`${className} text-red-500`} />;
    case 'doc':
    case 'docx':
      return <FileText className={`${className} text-blue-600`} />;
    case 'xls':
    case 'xlsx':
      return <FileSpreadsheet className={`${className} text-green-600`} />;
    case 'image':
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FileImage className={`${className} text-purple-500`} />;
    case 'video':
    case 'mp4':
    case 'avi':
    case 'mov':
      return <FileVideo className={`${className} text-orange-500`} />;
    case 'audio':
    case 'mp3':
    case 'wav':
    case 'ogg':
      return <FileMusic className={`${className} text-pink-500`} />;
    case 'zip':
      return <Archive className={`${className} text-gray-500`} />;
    default:
      return <File className={`${className} text-gray-400`} />;
  }
};

// Folder Icon based on folder name
const FolderIcon = ({ folderName, expanded = false }) => {
  const name = folderName.toLowerCase();
  if (expanded) {
    if (name.includes('risk') || name.includes('hazard')) return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    if (name.includes('policy') || name.includes('leadership')) return <ShieldIcon className="h-5 w-5 text-blue-500" />;
    if (name.includes('plan') || name.includes('strategy')) return <Target className="h-5 w-5 text-green-500" />;
    return <FolderOpen className="h-5 w-5 text-blue-500" />;
  } else {
    if (name.includes('risk') || name.includes('hazard')) return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    if (name.includes('policy') || name.includes('leadership')) return <ShieldIcon className="h-5 w-5 text-blue-500" />;
    if (name.includes('plan') || name.includes('strategy')) return <Target className="h-5 w-5 text-green-500" />;
    return <FolderClosed className="h-5 w-5 text-blue-500" />;
  }
};

// Access Level Badge Component
const AccessBadge = ({ level }) => {
  const config = {
    public: { label: 'Public', color: 'bg-green-100 text-green-800 hover:bg-green-100' },
    restricted: { label: 'Restricted', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    admin: { label: 'Admin', color: 'bg-red-100 text-red-800 hover:bg-red-100' }
  };

  const { label, color } = config[level] || config.restricted;

  return (
    <Badge variant="secondary" className={color}>
      <Shield className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Main Component
export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderTree, setFolderTree] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [path, setPath] = useState([]);

  // Modal states
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderAccess, setNewFolderAccess] = useState('restricted');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  
  // Upload states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Load initial data
  useEffect(() => {
    loadFolderTree();
  }, []);

  useEffect(() => {
    if (currentFolder) {
      loadFolderContents(currentFolder.id);
    }
  }, [currentFolder]);

  const loadFolderTree = async () => {
    setIsLoading(true);
    try {
      const tree = await mockApi.getFolderTree();
      setFolderTree(tree);
      if (tree.length > 0 && !currentFolder) {
        setCurrentFolder(tree[0]);
        setPath([tree[0]]);
      }
    } catch (error) {
      console.error('Error loading folder tree:', error);
      toast.error('Failed to load folder structure');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFolderContents = async (folderId) => {
    setIsLoading(true);
    try {
      const contents = await mockApi.getFolderContents(folderId);
      setDocuments(contents);
    } catch (error) {
      console.error('Error loading folder contents:', error);
      toast.error('Failed to load folder contents');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFolderExpansion = (folderId) => {
    const toggleRecursive = (nodes) => {
      return nodes.map(node => {
        if (node.id === folderId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: toggleRecursive(node.children) };
        }
        return node;
      });
    };

    setFolderTree(prev => {
      const newTree = toggleRecursive(prev);
      mockApi.saveFolderTree(newTree);
      return newTree;
    });
  };

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setPath(prev => {
      const existingIndex = prev.findIndex(f => f.id === folder.id);
      if (existingIndex !== -1) {
        return prev.slice(0, existingIndex + 1);
      }
      return [...prev, folder];
    });
    setSelectedDocuments(new Set());
  };

  const handleBreadcrumbClick = (index) => {
    const folder = path[index];
    setPath(path.slice(0, index + 1));
    setCurrentFolder(folder);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !currentFolder) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      const newFolder = await mockApi.createFolder({
        name: newFolderName,
        parent_id: currentFolder.id,
        access_level: newFolderAccess
      });

      // Add to current folder contents
      setDocuments(prev => [newFolder, ...prev]);
      
      // Add to folder tree
      const addToTree = (nodes) => {
        return nodes.map(node => {
          if (node.id === currentFolder.id) {
            return {
              ...node,
              children: [newFolder, ...(node.children || [])]
            };
          }
          if (node.children) {
            return { ...node, children: addToTree(node.children) };
          }
          return node;
        });
      };

      setFolderTree(prev => {
        const newTree = addToTree(prev);
        mockApi.saveFolderTree(newTree);
        return newTree;
      });

      // Save folder contents
      const currentContents = documents;
      await mockApi.saveFolderContents(currentFolder.id, [newFolder, ...currentContents]);

      toast.success(`Folder "${newFolderName}" created successfully`);
      setNewFolderName('');
      setNewFolderAccess('restricted');
      setIsCreateFolderOpen(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleFileClick = (document) => {
    setSelectedFile(document);
    setIsFilePreviewOpen(true);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = uploadedFiles.length;
      let uploadedCount = 0;
      const newDocuments = [];

      for (const file of uploadedFiles) {
        const fileType = getFileExtension(file.name);
        
        const newFile = await mockApi.uploadFile({
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          type: fileType,
          parent_id: currentFolder?.id,
          access_level: 'restricted',
          tags: ['uploaded']
        }, file);

        newDocuments.push(newFile);
        uploadedCount++;
        setUploadProgress((uploadedCount / totalFiles) * 100);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Add new files to documents list
      setDocuments(prev => [...newDocuments, ...prev]);
      
      // Save to localStorage
      const currentContents = documents;
      await mockApi.saveFolderContents(currentFolder.id, [...newDocuments, ...currentContents]);

      toast.success(`Uploaded ${uploadedFiles.length} file(s) successfully`);
      setUploadedFiles([]);
      setIsUploadOpen(false);
      setUploadProgress(0);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteClick = (item, isFolder = false) => {
    setItemToDelete({ ...item, isFolder });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.isFolder) {
        // Delete folder
        await mockApi.deleteFolder(itemToDelete.id, currentFolder?.id);
        
        // Remove from documents list
        setDocuments(prev => prev.filter(doc => doc.id !== itemToDelete.id));
        
        // Remove from folder tree
        const removeFromTree = (nodes) => {
          return nodes.filter(node => node.id !== itemToDelete.id)
            .map(node => ({
              ...node,
              children: node.children ? removeFromTree(node.children) : []
            }));
        };

        setFolderTree(prev => {
          const newTree = removeFromTree(prev);
          mockApi.saveFolderTree(newTree);
          return newTree;
        });

        toast.success(`Folder "${itemToDelete.name}" deleted successfully`);
      } else {
        // Delete file
        await mockApi.deleteDocument(itemToDelete.id, currentFolder?.id);
        setDocuments(prev => prev.filter(doc => doc.id !== itemToDelete.id));
        toast.success(`File "${itemToDelete.name}" deleted successfully`);
      }

      setSelectedDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemToDelete.id);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const renderTree = (nodes, level = 0) => (
    <div className="space-y-1">
      {nodes.map(node => (
        <div key={node.id}>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => toggleFolderExpansion(node.id)}
            >
              {node.expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              className={`flex-1 justify-start font-normal hover:bg-accent hover:text-accent-foreground ${
                currentFolder?.id === node.id ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={() => handleFolderClick(node)}
            >
              <div className="flex items-center gap-2 truncate">
                <div style={{ width: level * 16 }} />
                <FolderIcon folderName={node.name} expanded={node.expanded} />
                <span className="truncate text-sm">{node.name}</span>
                {node.children && node.children.length > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {node.children.length}
                  </Badge>
                )}
              </div>
            </Button>
          </div>
          
          {node.children && node.children.length > 0 && node.expanded && (
            <div className="ml-8">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderGridItem = (doc) => (
    <Card key={doc.id} className="hover:shadow-lg transition-shadow h-full group">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {doc.type === 'folder' ? (
              <FolderIcon folderName={doc.name} className="h-6 w-6 mt-1" />
            ) : (
              <FileIcon type={doc.type} className="h-6 w-6 mt-1" />
            )}
            <div>
              <CardTitle className="text-sm font-semibold line-clamp-2 cursor-pointer" 
                onClick={() => doc.type === 'folder' ? handleFolderClick(doc) : handleFileClick(doc)}>
                {doc.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {doc.type === 'folder' 
                  ? `${doc.children_count || 0} items`
                  : `${doc.type.toUpperCase()} • ${formatFileSize(doc.file_size)}`}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => doc.type === 'folder' ? handleFolderClick(doc) : handleFileClick(doc)}>
                <Eye className="h-4 w-4 mr-2" />
                {doc.type === 'folder' ? 'Open' : 'Preview'}
              </DropdownMenuItem>
              {doc.type !== 'folder' && (
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Move className="h-4 w-4 mr-2" />
                Move
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive" 
                onClick={() => handleDeleteClick(doc, doc.type === 'folder')}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <AccessBadge level={doc.access_level} />
          <div className="text-xs text-muted-foreground">
            {formatDate(doc.updated_at)}
          </div>
        </div>
        {doc.tags && doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {doc.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {doc.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{doc.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderListItem = (doc) => (
    <div
      key={doc.id}
      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
    >
      <div className="cursor-pointer" onClick={() => doc.type === 'folder' ? handleFolderClick(doc) : handleFileClick(doc)}>
        {doc.type === 'folder' ? (
          <FolderIcon folderName={doc.name} className="h-5 w-5 flex-shrink-0" />
        ) : (
          <FileIcon type={doc.type} className="h-5 w-5 flex-shrink-0" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => doc.type === 'folder' ? handleFolderClick(doc) : handleFileClick(doc)}>
        <div className="flex items-center gap-2">
          <div className="font-medium truncate">{doc.name}</div>
          <Badge variant="outline" className="text-xs">
            {doc.type === 'folder' ? 'Folder' : doc.type.toUpperCase()}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Updated {formatDate(doc.updated_at)}
          {doc.file_size && ` • ${formatFileSize(doc.file_size)}`}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <AccessBadge level={doc.access_level} />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => doc.type === 'folder' ? handleFolderClick(doc) : handleFileClick(doc)}>
              <Eye className="h-4 w-4 mr-2" />
              {doc.type === 'folder' ? 'Open' : 'Preview'}
            </DropdownMenuItem>
            {doc.type !== 'folder' && (
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Move className="h-4 w-4 mr-2" />
              Move
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive" 
              onClick={() => handleDeleteClick(doc, doc.type === 'folder')}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-72 border-r bg-card">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Asset Management System</h2>
                <p className="text-xs text-muted-foreground">ISO 55001 Compliant</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => loadFolderTree()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                renderTree(folderTree)
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <Button className="w-full" onClick={() => setIsCreateFolderOpen(true)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {currentFolder?.name || 'Asset Management System'}
                  </h1>
                  <p className="text-muted-foreground">
                    {currentFolder ? 'Manage documents in this folder' : 'ISO 55001 Document Management System'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant={viewMode === 'list' ? "default" : "outline"} 
                    size="icon" 
                    onClick={() => setViewMode('list')}
                  >
                    <ListTree className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'grid' ? "default" : "outline"} 
                    size="icon" 
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Breadcrumb */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={() => handleBreadcrumbClick(0)}>
                      AMS Root
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {path.slice(1).map((folder, index) => (
                    <React.Fragment key={folder.id}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {index === path.length - 2 ? (
                          <BreadcrumbPage className="max-w-xs truncate">{folder.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href="#" onClick={() => handleBreadcrumbClick(index + 1)} className="max-w-xs truncate">
                            {folder.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents by name or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="folder">Folders</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">Documents</SelectItem>
                    <SelectItem value="xlsx">Spreadsheets</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button onClick={() => setIsCreateFolderOpen(true)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredDocuments.map(renderGridItem)}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredDocuments.map(renderListItem)}
                </div>
              )}

              {filteredDocuments.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? 'Try a different search term' : 'This folder is empty'}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setIsUploadOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create Folder
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Add a new folder to organize your documents
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Folder Name *</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
            
            <div>
              <Label htmlFor="access-level">Access Level</Label>
              <Select value={newFolderAccess} onValueChange={setNewFolderAccess}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public (Everyone can view)</SelectItem>
                  <SelectItem value="restricted">Restricted (Specific users only)</SelectItem>
                  <SelectItem value="admin">Admin (Administrators only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm font-medium">Location</div>
              <div className="text-sm text-muted-foreground">
                Inside: {currentFolder?.name || 'Asset Management System'}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Upload documents to {currentFolder?.name || 'Asset Management System'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Upload Area */}
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <div className="text-sm font-medium mb-2">Drag and drop files here</div>
              <div className="text-sm text-muted-foreground mb-4">or click to browse</div>
              <Button variant="outline" onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}>
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav,.ogg,.zip"
              />
            </div>

            {/* Selected Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({uploadedFiles.length})</Label>
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileIcon type={getFileExtension(file.name)} className="h-4 w-4" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeUploadedFile(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading files...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Access Level */}
            <div>
              <Label>Default Access Level</Label>
              <Select defaultValue="restricted">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Types Info */}
            <div className="text-xs text-muted-foreground">
              Supported files: PDF, Word, Excel, Images (JPG, PNG, GIF), Videos (MP4, AVI, MOV), Audio (MP3, WAV), ZIP
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsUploadOpen(false);
              setUploadedFiles([]);
              setUploadProgress(0);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleFileUpload} 
              disabled={uploadedFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {uploadedFiles.length} File{uploadedFiles.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog open={isFilePreviewOpen} onOpenChange={setIsFilePreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              {selectedFile?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FileIcon type={selectedFile.type} className="h-12 w-12" />
                <div>
                  <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <AccessBadge level={selectedFile.access_level} />
                    <span className="text-sm text-muted-foreground">
                      Version {selectedFile.version}
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">File Size</Label>
                  <p className="text-sm">{formatFileSize(selectedFile.file_size)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Uploaded</Label>
                  <p className="text-sm">{formatDate(selectedFile.created_at)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Modified</Label>
                  <p className="text-sm">{formatDate(selectedFile.updated_at)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">File Type</Label>
                  <p className="text-sm">{selectedFile.type.toUpperCase()}</p>
                </div>
              </div>
              
              {selectedFile.tags && selectedFile.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedFile.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="flex gap-2">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Metadata
                </Button>
                <Button 
                  variant="destructive" 
                  className="ml-auto"
                  onClick={() => {
                    handleDeleteClick(selectedFile, false);
                    setIsFilePreviewOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.isFolder 
                ? `This will permanently delete the folder "${itemToDelete?.name}" and all its contents. This action cannot be undone.`
                : `This will permanently delete the file "${itemToDelete?.name}". This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setItemToDelete(null);
              setIsDeleteDialogOpen(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}