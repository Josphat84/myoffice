// app/documents/page.tsx
'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Folder,
  FileText,
  Upload,
  Search,
  Shield,
  Clock,
  Trash2,
  Edit,
  X,
  HardDrive,
  Archive,
  Download,
  Eye,
  File,
  Filter,
  FolderPlus,
  Grid2X2,
  ListTree,
  MoreVertical,
  Share2,
  Star,
  ChevronRight,
  ChevronDown,
  Loader2,
  RefreshCw,
  FileSpreadsheet,
  Home,
  Menu,
  Sun,
  Moon,
  Image as ImageIcon,
  Video,
  Music,
  Archive as ArchiveIcon,
  Building,
  Users,
  Target,
  HelpCircle,
  Settings,
  Zap,
  ClipboardCheck,
  AlertTriangle,
  TrendingUp,
  LayoutGrid,
  FolderOpen,
  Calendar,
  User,
  Briefcase,
  BarChart3,
  SortAsc,
  SortDesc,
  Tag,
  Copy,
  Move,
  Info,
  FilterX,
  Layers,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Maximize2,
  Minimize2,
  ExternalLink,
  Bookmark,
  Database,
  Cloud,
  Lock,
  Unlock,
  EyeOff,
  Printer,
  Mail,
  Link2,
  History,
  Sparkles,
  Wand2,
  Trash as TrashIcon,
  Edit3,
  ArrowLeft,
  ArrowRight,
  FolderTree,
  GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Toaster, toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from "@/lib/utils";

// ============= STUNNING NATURE WALLPAPER COLLECTION =============
const natureWallpapers = [
  { url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=90&w=2070", location: "Iceland - Crystal Ice Cave" },
  { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=90&w=2070", location: "Pacific Northwest" },
  { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=90&w=2070", location: "Great Smoky Mountains" },
  { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=90&w=2070", location: "Olympic National Park" },
  { url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=90&w=2070", location: "Canadian Rockies" }
];

// ============= ANIMATION STYLES =============
const animationStyles = `
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes slide-right { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  .animate-fade-in { animation: fade-in 0.5s ease-out forwards; opacity: 0; }
  .animate-slide-up { animation: slide-up 0.5s ease-out forwards; opacity: 0; }
  .animate-scale-in { animation: scale-in 0.3s ease-out forwards; opacity: 0; }
  .animate-slide-right { animation: slide-right 0.3s ease-out forwards; opacity: 0; }
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
`;

// Base category structure
const BASE_CATEGORIES = [
  { id: '1', name: 'Organizational Context', icon: Building, color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700', description: 'Internal/external issues, stakeholder requirements, AMS scope' },
  { id: '2', name: 'Leadership', icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700', description: 'Organizational structure, asset policy, RACI matrix' },
  { id: '3', name: 'Planning', icon: Target, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-700', description: 'Risk management, objectives, AMPs, budgeting' },
  { id: '4', name: 'Support', icon: HelpCircle, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50', textColor: 'text-cyan-700', description: 'Resources, training, communication, documentation' },
  { id: '5', name: 'Operation', icon: Settings, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-700', description: 'Operational planning, change management, procurement' },
  { id: '6', name: 'Performance Evaluation', icon: TrendingUp, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700', description: 'Monitoring, audits, management review' },
  { id: '7', name: 'Improvement', icon: Zap, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', description: 'Corrective actions, continual improvement' },
];

// ============= ORIGINAL SUBFOLDERS STRUCTURE (PRESERVED) =============
const DEFAULT_SUBFOLDERS = {
  'Organizational Context': [
    'Internal & External Issues',
    'Stakeholder Requirements',
    'AMS Scope & Boundaries',
    'Asset Hierarchy & Data Governance'
  ],
  'Leadership': [
    'Organizational Structure & Roles',
    'Asset Management Policy',
    'Responsibilities & Authorities (RACI)'
  ],
  'Planning': [
    'Risk Management',
    'AM Objectives & KPIs',
    'Asset Management Plans (AMP)',
    'Budget, Forecast & Demand Planning',
    'Change Management'
  ],
  'Support': [
    'Resource Management',
    'Competence & Training',
    'Awareness & Communication',
    'Documented Information'
  ],
  'Operation': [
    'Operational Planning & Control',
    'Management of Change',
    'Outsourcing & Procurement'
  ],
  'Performance Evaluation': [
    'Monitoring & Measurement',
    'Internal Audit',
    'Management Review'
  ],
  'Improvement': [
    'Nonconformity & Corrective Action',
    'Continual Improvement'
  ]
};

// File type categories for filtering
const FILE_TYPE_CATEGORIES = {
  all: { label: 'All Files', icon: FileText, color: 'text-gray-600' },
  document: { label: 'Documents', icon: FileText, color: 'text-blue-600' },
  spreadsheet: { label: 'Spreadsheets', icon: FileSpreadsheet, color: 'text-green-600' },
  pdf: { label: 'PDFs', icon: FileText, color: 'text-red-600' },
  image: { label: 'Images', icon: ImageIcon, color: 'text-purple-600' },
  video: { label: 'Videos', icon: Video, color: 'text-orange-600' },
  audio: { label: 'Audio', icon: Music, color: 'text-pink-600' },
  archive: { label: 'Archives', icon: ArchiveIcon, color: 'text-gray-600' },
};

// Helper functions
const getFileExtension = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm'];
  const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
  const docExts = ['doc', 'docx', 'txt', 'md', 'rtf'];
  const excelExts = ['xls', 'xlsx', 'csv'];
  const pdfExts = ['pdf'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (docExts.includes(ext)) return 'document';
  if (excelExts.includes(ext)) return 'spreadsheet';
  if (pdfExts.includes(ext)) return 'pdf';
  if (archiveExts.includes(ext)) return 'archive';
  return 'file';
};

const getFileIcon = (type) => {
  switch (type) {
    case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
    case 'document': return <FileText className="h-5 w-5 text-blue-600" />;
    case 'spreadsheet': return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    case 'image': return <ImageIcon className="h-5 w-5 text-purple-500" />;
    case 'video': return <Video className="h-5 w-5 text-orange-500" />;
    case 'audio': return <Music className="h-5 w-5 text-pink-500" />;
    case 'archive': return <ArchiveIcon className="h-5 w-5 text-gray-500" />;
    default: return <File className="h-5 w-5 text-gray-400" />;
  }
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function DocumentsPage() {
  // View state
  const [viewMode, setViewMode] = useState('grid');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [customSubfolders, setCustomSubfolders] = useState({});
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [path, setPath] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  
  // Filter state
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToRename, setItemToRename] = useState(null);
  const [newName, setNewName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Upload states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Rotating wallpaper
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWallpaperIndex((prev) => (prev + 1) % natureWallpapers.length);
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  // Load saved data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    
    loadSavedData();
    
    // Set initial category after data is loaded
    if (BASE_CATEGORIES.length > 0 && !currentCategory) {
      setCurrentCategory(BASE_CATEGORIES[0]);
      setPath([{ name: BASE_CATEGORIES[0].name, id: BASE_CATEGORIES[0].id, type: 'category' }]);
    }
  }, []);

  // Load files when category or folder changes
  useEffect(() => {
    if (currentCategory) {
      loadFolderContents();
    }
  }, [currentCategory, currentFolder]);

  const loadSavedData = () => {
    // Load custom subfolders from localStorage (user-created ones)
    const savedSubfolders = localStorage.getItem('ams_custom_subfolders');
    if (savedSubfolders) {
      setCustomSubfolders(JSON.parse(savedSubfolders));
    } else {
      setCustomSubfolders({});
      localStorage.setItem('ams_custom_subfolders', JSON.stringify({}));
    }
    
    // Load files
    const savedFiles = localStorage.getItem('ams_files_v2');
    if (savedFiles) {
      const files = JSON.parse(savedFiles);
      const filesByLocation = {};
      files.forEach(file => {
        const key = `${file.categoryId}_${file.folderId || 'root'}`;
        if (!filesByLocation[key]) filesByLocation[key] = [];
        filesByLocation[key].push(file);
      });
      window.filesByLocation = filesByLocation;
    } else {
      window.filesByLocation = {};
    }
  };

  const saveCustomSubfoldersToStorage = (newSubfolders) => {
    localStorage.setItem('ams_custom_subfolders', JSON.stringify(newSubfolders));
    setCustomSubfolders(newSubfolders);
  };

  const saveFileToLocalStorage = (file) => {
    const savedFiles = localStorage.getItem('ams_files_v2');
    let files = savedFiles ? JSON.parse(savedFiles) : [];
    files.push(file);
    localStorage.setItem('ams_files_v2', JSON.stringify(files));
    
    const key = `${file.categoryId}_${file.folderId || 'root'}`;
    if (!window.filesByLocation[key]) window.filesByLocation[key] = [];
    window.filesByLocation[key].push(file);
  };

  const deleteFileFromLocalStorage = (fileId, categoryId, folderId) => {
    const savedFiles = localStorage.getItem('ams_files_v2');
    if (savedFiles) {
      let files = JSON.parse(savedFiles);
      files = files.filter(f => f.id !== fileId);
      localStorage.setItem('ams_files_v2', JSON.stringify(files));
      
      const key = `${categoryId}_${folderId || 'root'}`;
      if (window.filesByLocation[key]) {
        window.filesByLocation[key] = window.filesByLocation[key].filter(f => f.id !== fileId);
      }
    }
  };

  const updateFileInLocalStorage = (fileId, updates) => {
    const savedFiles = localStorage.getItem('ams_files_v2');
    if (savedFiles) {
      let files = JSON.parse(savedFiles);
      const fileIndex = files.findIndex(f => f.id === fileId);
      if (fileIndex !== -1) {
        files[fileIndex] = { ...files[fileIndex], ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem('ams_files_v2', JSON.stringify(files));
        
        const file = files[fileIndex];
        const key = `${file.categoryId}_${file.folderId || 'root'}`;
        if (window.filesByLocation[key]) {
          window.filesByLocation[key] = window.filesByLocation[key].map(f => 
            f.id === fileId ? { ...f, ...updates, updated_at: new Date().toISOString() } : f
          );
        }
        setDocuments(prev => prev.map(f => f.id === fileId ? { ...f, ...updates, updated_at: new Date().toISOString() } : f));
      }
    }
  };

  const loadFolderContents = () => {
    if (!currentCategory) return;
    
    setIsLoading(true);
    const folderId = currentFolder || 'root';
    const key = `${currentCategory.id}_${folderId}`;
    const files = window.filesByLocation?.[key] || [];
    setDocuments(files);
    setIsLoading(false);
  };

  const getAllSubfoldersForCategory = () => {
    const defaultSubs = DEFAULT_SUBFOLDERS[currentCategory?.name] || [];
    const customSubs = customSubfolders[currentCategory?.name] || [];
    // Use a Set to remove duplicates (in case a custom folder has the same name as a default one)
    const uniqueSubfolders = new Set([...defaultSubs, ...customSubs]);
    return Array.from(uniqueSubfolders);
  };

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    setCurrentFolder(null);
    setPath([{ name: category.name, id: category.id, type: 'category' }]);
    loadFolderContents();
    setFileTypeFilter('all');
    setDateFilter('all');
    setSizeFilter('all');
    setSearchQuery('');
    setActiveTab('all');
  };

  const handleSubfolderClick = (subfolderName) => {
    setCurrentFolder(subfolderName);
    setPath(prev => [...prev, { name: subfolderName, id: subfolderName, type: 'subfolder' }]);
    loadFolderContents();
  };

  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      setCurrentFolder(null);
      setPath(path.slice(0, 1));
      loadFolderContents();
    } else {
      const clickedPath = path[index];
      setCurrentFolder(clickedPath.id === 'root' ? null : clickedPath.id);
      setPath(path.slice(0, index + 1));
      loadFolderContents();
    }
  };

  const handleCreateSubfolder = () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    
    const existingSubfolders = getAllSubfoldersForCategory();
    if (existingSubfolders.includes(newFolderName)) {
      toast.error('A folder with this name already exists');
      return;
    }
    
    const currentCustom = customSubfolders[currentCategory.name] || [];
    const updatedCustom = {
      ...customSubfolders,
      [currentCategory.name]: [...currentCustom, newFolderName]
    };
    saveCustomSubfoldersToStorage(updatedCustom);
    
    // Initialize empty files array for new folder
    const key = `${currentCategory.id}_${newFolderName}`;
    if (!window.filesByLocation[key]) {
      window.filesByLocation[key] = [];
    }
    
    toast.success(`Folder "${newFolderName}" created successfully`);
    setNewFolderName('');
    setIsCreateFolderOpen(false);
  };

  const handleDeleteSubfolder = () => {
    if (!itemToDelete) return;
    
    // Check if it's a default folder
    const isDefault = DEFAULT_SUBFOLDERS[currentCategory?.name]?.includes(itemToDelete.name);
    
    if (isDefault) {
      toast.error(`"${itemToDelete.name}" is a default folder and cannot be deleted`);
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
      return;
    }
    
    // Remove from custom subfolders
    const currentCustom = customSubfolders[currentCategory.name] || [];
    const updatedCustom = {
      ...customSubfolders,
      [currentCategory.name]: currentCustom.filter(s => s !== itemToDelete.name)
    };
    saveCustomSubfoldersToStorage(updatedCustom);
    
    // Delete all files in this folder
    const key = `${currentCategory.id}_${itemToDelete.name}`;
    if (window.filesByLocation[key]) {
      window.filesByLocation[key].forEach(file => {
        deleteFileFromLocalStorage(file.id, file.categoryId, file.folderId);
      });
      delete window.filesByLocation[key];
    }
    
    // If we're currently in the deleted folder, go back to category
    if (currentFolder === itemToDelete.name) {
      setCurrentFolder(null);
      setPath(path.slice(0, 1));
      loadFolderContents();
    }
    
    toast.success(`Folder "${itemToDelete.name}" deleted`);
    setItemToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleRenameSubfolder = () => {
    if (!itemToRename || !newName.trim()) return;
    
    // Check if it's a default folder
    const isDefault = DEFAULT_SUBFOLDERS[currentCategory?.name]?.includes(itemToRename.name);
    
    if (isDefault) {
      toast.error(`"${itemToRename.name}" is a default folder and cannot be renamed`);
      setIsRenameDialogOpen(false);
      setItemToRename(null);
      setNewName('');
      return;
    }
    
    // Rename in custom subfolders
    const currentCustom = customSubfolders[currentCategory.name] || [];
    const updatedCustom = {
      ...customSubfolders,
      [currentCategory.name]: currentCustom.map(s => s === itemToRename.name ? newName : s)
    };
    saveCustomSubfoldersToStorage(updatedCustom);
    
    // Move files to new key
    const oldKey = `${currentCategory.id}_${itemToRename.name}`;
    const newKey = `${currentCategory.id}_${newName}`;
    if (window.filesByLocation[oldKey]) {
      window.filesByLocation[newKey] = window.filesByLocation[oldKey];
      delete window.filesByLocation[oldKey];
      
      // Update file references
      window.filesByLocation[newKey].forEach(file => {
        file.folderId = newName;
        file.folderPath = file.folderPath?.replace(itemToRename.name, newName);
      });
    }
    
    // Update current folder if it's the one being renamed
    if (currentFolder === itemToRename.name) {
      setCurrentFolder(newName);
      setPath(prev => prev.map(p => p.id === itemToRename.name ? { ...p, name: newName, id: newName } : p));
    }
    
    toast.success(`Renamed to "${newName}"`);
    setIsRenameDialogOpen(false);
    setItemToRename(null);
    setNewName('');
  };

  const handleFileUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    if (!currentCategory) {
      toast.error('No category selected');
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
        const fileUrl = URL.createObjectURL(file);
        
        const newFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: fileType,
          categoryId: currentCategory.id,
          categoryName: currentCategory.name,
          folderId: currentFolder || null,
          folderPath: path.slice(1).map(p => p.name).join('/'),
          file_size: file.size,
          starred: false,
          tags: [],
          description: '',
          version: '1.0',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: user?.name || 'Current User',
          blobUrl: fileUrl,
          file: file
        };

        newDocuments.push(newFile);
        saveFileToLocalStorage(newFile);
        uploadedCount++;
        setUploadProgress((uploadedCount / totalFiles) * 100);
      }

      setDocuments(prev => [...newDocuments, ...prev]);
      toast.success(`Uploaded ${uploadedFiles.length} file(s) successfully`);
      setUploadedFiles([]);
      setIsUploadOpen(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (doc) => {
    if (doc.blobUrl && doc.file) {
      const link = document.createElement('a');
      link.href = doc.blobUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${doc.name}`);
    } else {
      toast.success(`Downloading ${doc.name}`);
    }
  };

  const handlePreview = (doc) => {
    setSelectedFile(doc);
    setPreviewUrl(doc.blobUrl);
    setIsFilePreviewOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    deleteFileFromLocalStorage(itemToDelete.id, itemToDelete.categoryId, itemToDelete.folderId);
    setDocuments(prev => prev.filter(doc => doc.id !== itemToDelete.id));
    toast.success(`"${itemToDelete.name}" deleted`);
    setItemToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleRenameClick = (item) => {
    setItemToRename(item);
    setNewName(item.name);
    setIsRenameDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (!itemToRename || !newName.trim()) return;
    updateFileInLocalStorage(itemToRename.id, { name: newName });
    toast.success(`Renamed to "${newName}"`);
    setIsRenameDialogOpen(false);
    setItemToRename(null);
    setNewName('');
  };

  const handleToggleStar = (item) => {
    const newStarred = !item.starred;
    updateFileInLocalStorage(item.id, { starred: newStarred });
    toast.success(newStarred ? 'Added to starred' : 'Removed from starred');
  };

  const handleBulkDelete = () => {
    const itemsToDelete = documents.filter(doc => selectedItems.has(doc.id));
    itemsToDelete.forEach(item => {
      deleteFileFromLocalStorage(item.id, item.categoryId, item.folderId);
    });
    setDocuments(prev => prev.filter(doc => !selectedItems.has(doc.id)));
    toast.success(`Deleted ${selectedItems.size} item(s)`);
    setSelectedItems(new Set());
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredDocuments.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredDocuments.map(doc => doc.id)));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFileTypeFilter('all');
    setDateFilter('all');
    setSizeFilter('all');
    setActiveTab('all');
    toast.success('All filters cleared');
  };

  const hasActiveFilters = searchQuery !== '' || fileTypeFilter !== 'all' || dateFilter !== 'all' || sizeFilter !== 'all' || activeTab !== 'all';

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(query) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    if (fileTypeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === fileTypeFilter);
    }
    
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(doc => new Date(doc.created_at).toDateString() === now.toDateString());
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(doc => new Date(doc.created_at) > weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(doc => new Date(doc.created_at) > monthAgo);
    }
    
    if (sizeFilter === 'small') {
      filtered = filtered.filter(doc => (doc.file_size || 0) < 1024 * 1024);
    } else if (sizeFilter === 'medium') {
      filtered = filtered.filter(doc => (doc.file_size || 0) >= 1024 * 1024 && (doc.file_size || 0) < 10 * 1024 * 1024);
    } else if (sizeFilter === 'large') {
      filtered = filtered.filter(doc => (doc.file_size || 0) >= 10 * 1024 * 1024);
    }
    
    if (activeTab === 'starred') {
      filtered = filtered.filter(doc => doc.starred);
    } else if (activeTab === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(doc => new Date(doc.updated_at) > sevenDaysAgo);
    }
    
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'date':
          aVal = new Date(a.updated_at);
          bVal = new Date(b.updated_at);
          break;
        case 'size':
          aVal = a.file_size || 0;
          bVal = b.file_size || 0;
          break;
        case 'type':
          aVal = a.type;
          bVal = b.type;
          break;
        default:
          aVal = new Date(a.updated_at);
          bVal = new Date(b.updated_at);
      }
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    
    return filtered;
  }, [documents, searchQuery, fileTypeFilter, dateFilter, sizeFilter, activeTab, sortBy, sortOrder]);

  const stats = {
    totalFiles: documents.length,
    totalSize: documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0),
    starredItems: documents.filter(doc => doc.starred).length,
  };

  // Category Card Component
  const CategoryCard = ({ category, onClick }) => {
    const Icon = category.icon;
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Card 
            className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border shadow-md"
            onClick={onClick}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-xl bg-gradient-to-br", category.color, "shadow-lg")}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className={cn("font-semibold text-lg mb-1", category.textColor)}>{category.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
            </CardContent>
          </Card>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">{category.name}</h4>
            <p className="text-sm text-muted-foreground">{category.description}</p>
            <Separator />
            <div className="text-sm text-muted-foreground">ISO 55001 compliant section</div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const FolderCard = ({ folder, onClick, onDelete, onRename }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border shadow-sm group"
    >
      <CardContent className="p-4 flex items-center justify-between gap-3" onClick={onClick}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <Folder className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-gray-700">{folder.name}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-gray-500 hover:text-blue-600"
            onClick={(e) => { e.stopPropagation(); onRename(); }}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-gray-500 hover:text-red-600"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </Button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredDocuments.map((doc) => (
        <Card 
          key={doc.id} 
          className={cn(
            "group cursor-pointer hover:shadow-xl transition-all duration-300 bg-white border",
            selectedItems.has(doc.id) && "ring-2 ring-blue-500"
          )}
          onClick={() => handlePreview(doc)}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedItems.has(doc.id)}
                  onCheckedChange={() => toggleSelectItem(doc.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
                {doc.type === 'image' && doc.blobUrl ? (
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                    <img src={doc.blobUrl} alt={doc.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  getFileIcon(doc.type)
                )}
                <div>
                  <CardTitle className="text-sm font-semibold line-clamp-1 text-gray-800">{doc.name}</CardTitle>
                  <CardDescription className="text-xs">{formatFileSize(doc.file_size)}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleToggleStar(doc); }}>
                        <Star className={cn("h-3.5 w-3.5", doc.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400")} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{doc.starred ? 'Remove from starred' : 'Add to starred'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <div className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer">
                      <MoreVertical className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handlePreview(doc)}><Eye className="h-4 w-4 mr-2" />Preview</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(doc)}><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRenameClick(doc)}><Edit className="h-4 w-4 mr-2" />Rename</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Share2 className="h-4 w-4 mr-2" />Share</DropdownMenuItem>
                    <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Copy Link</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(doc)}><TrashIcon className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">{formatDate(doc.created_at)}</div>
              <Badge variant="outline" className="text-xs">{doc.type.toUpperCase()}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12"><Checkbox checked={selectedItems.size === filteredDocuments.length && filteredDocuments.length > 0} onCheckedChange={handleSelectAll} /></TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead className="cursor-pointer" onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
              Name {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="inline h-3 w-3 ml-1" /> : <SortDesc className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => { setSortBy('type'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Type</TableHead>
            <TableHead className="cursor-pointer" onClick={() => { setSortBy('size'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Size</TableHead>
            <TableHead className="cursor-pointer" onClick={() => { setSortBy('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Modified</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.map((doc) => (
            <TableRow key={doc.id} className="group cursor-pointer hover:bg-gray-50" onClick={() => handlePreview(doc)}>
              <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={selectedItems.has(doc.id)} onCheckedChange={() => toggleSelectItem(doc.id)} /></TableCell>
              <TableCell>{doc.type === 'image' && doc.blobUrl ? <div className="h-8 w-8 rounded overflow-hidden"><img src={doc.blobUrl} className="h-full w-full object-cover" /></div> : getFileIcon(doc.type)}</TableCell>
              <TableCell className="font-medium text-gray-800"><div className="flex items-center gap-2">{doc.name}{doc.starred && <Star className="h-3 w-3 fill-yellow-400" />}</div></TableCell>
              <TableCell><Badge variant="outline" className="text-xs">{doc.type.toUpperCase()}</Badge></TableCell>
              <TableCell className="text-gray-600">{formatFileSize(doc.file_size)}</TableCell>
              <TableCell className="text-gray-500 text-sm">{formatDate(doc.updated_at || doc.created_at)}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleToggleStar(doc)}>
                    <Star className={cn("h-3.5 w-3.5", doc.starred ? "fill-yellow-400" : "text-gray-400")} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-3.5 w-3.5 text-gray-500" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreview(doc)}><Eye className="h-4 w-4 mr-2" />Preview</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(doc)}><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRenameClick(doc)}><Edit className="h-4 w-4 mr-2" />Rename</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(doc)}><TrashIcon className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderHomeView = () => (
    <div className="space-y-6">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Asset Management System</h2>
        <p className="text-white/80">ISO 55001 Compliant Document Management</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-slide-up delay-100">
        {BASE_CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} onClick={() => handleCategoryClick(category)} />
        ))}
      </div>
    </div>
  );

  const renderCategoryView = () => {
    const allSubfolders = getAllSubfoldersForCategory();
    const defaultSubfoldersList = DEFAULT_SUBFOLDERS[currentCategory?.name] || [];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">{currentCategory?.name}</h2>
            <p className="text-white/70">{currentCategory?.description}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateFolderOpen(true)} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <FolderPlus className="h-4 w-4 mr-2" /> New Folder
            </Button>
            <Button onClick={() => setIsUploadOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
        </div>
        
        {allSubfolders.length === 0 ? (
          <Card className="border-white/20 bg-white/20 backdrop-blur-md">
            <CardContent className="py-12 text-center">
              <FolderOpen className="h-12 w-12 mx-auto text-white/60 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No folders yet</h3>
              <p className="text-white/70 mb-6">Create your first folder to start organizing documents</p>
              <Button onClick={() => setIsCreateFolderOpen(true)} variant="outline" className="bg-white/20 border-white/30 text-white">
                <FolderPlus className="h-4 w-4 mr-2" /> Create Folder
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allSubfolders.map((folderName) => {
              const isDefault = defaultSubfoldersList.includes(folderName);
              return (
                <FolderCard 
                  key={folderName}
                  folder={{ name: folderName }}
                  onClick={() => handleSubfolderClick(folderName)}
                  onDelete={() => {
                    if (!isDefault) {
                      setItemToDelete({ name: folderName });
                      setIsDeleteDialogOpen(true);
                    } else {
                      toast.error(`"${folderName}" is a default folder and cannot be deleted`);
                    }
                  }}
                  onRename={() => {
                    if (!isDefault) {
                      setItemToRename({ name: folderName });
                      setNewName(folderName);
                      setIsRenameDialogOpen(true);
                    } else {
                      toast.error(`"${folderName}" is a default folder and cannot be renamed`);
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderSubfolderView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">{path[path.length - 1]?.name}</h2>
          <p className="text-white/70">in {currentCategory?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <TrashIcon className="h-4 w-4 mr-2" /> Delete ({selectedItems.size})
            </Button>
          )}
          <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
            <TooltipProvider><Tooltip><TooltipTrigger asChild>
              <Button variant={viewMode === 'grid' ? "default" : "ghost"} size="sm" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? "bg-white/30 text-white" : "text-white"}>
                <Grid2X2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger><TooltipContent>Grid view</TooltipContent></Tooltip></TooltipProvider>
            <TooltipProvider><Tooltip><TooltipTrigger asChild>
              <Button variant={viewMode === 'table' ? "default" : "ghost"} size="sm" onClick={() => setViewMode('table')} className={viewMode === 'table' ? "bg-white/30 text-white" : "text-white"}>
                <ListTree className="h-4 w-4" />
              </Button>
            </TooltipTrigger><TooltipContent>Table view</TooltipContent></Tooltip></TooltipProvider>
          </div>
          <Button onClick={() => setIsUploadOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
        </div>
      </div>

      {/* Search and filters bar */}
      <Card className="border-white/20 bg-white/20 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input 
                  placeholder="Search files by name..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/50" 
                />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="shrink-0">
                <TabsList className="bg-white/20">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white/30 text-white">All</TabsTrigger>
                  <TabsTrigger value="starred" className="data-[state=active]:bg-white/30 text-white">Starred</TabsTrigger>
                  <TabsTrigger value="recent" className="data-[state=active]:bg-white/30 text-white">Recent</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="bg-white/20 border-white/30 text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && <Badge className="ml-2 bg-blue-500">!</Badge>}
              </Button>
              
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-white/70 hover:text-white">
                  <FilterX className="h-4 w-4 mr-2" /> Clear
                </Button>
              )}
            </div>
            
            {showFilters && (
              <div className="pt-4 border-t border-white/20 animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-white text-sm">File Type</Label>
                    <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(FILE_TYPE_CATEGORIES).map(([key, { label, icon: Icon }]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2"><Icon className="h-4 w-4" />{label}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm">Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 days</SelectItem>
                        <SelectItem value="month">Last 30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm">File Size</Label>
                    <Select value={sizeFilter} onValueChange={setSizeFilter}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any size</SelectItem>
                        <SelectItem value="small">Small (&lt;1MB)</SelectItem>
                        <SelectItem value="medium">Medium (1-10MB)</SelectItem>
                        <SelectItem value="large">Large (&gt;10MB)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white text-sm">Sort By</Label>
                    <div className="flex gap-2 mt-1">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="flex-1 bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="size">Size</SelectItem>
                          <SelectItem value="type">Type</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="bg-white/20 border-white/30 text-white">
                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-white/20 backdrop-blur-md border-white/20">
          <CardContent className="p-3 flex items-center justify-between">
            <div><p className="text-xs text-white/70">Total Files</p><p className="text-xl font-bold text-white">{stats.totalFiles}</p></div>
            <FileText className="h-8 w-8 text-blue-300" />
          </CardContent>
        </Card>
        <Card className="bg-white/20 backdrop-blur-md border-white/20">
          <CardContent className="p-3 flex items-center justify-between">
            <div><p className="text-xs text-white/70">Storage</p><p className="text-xl font-bold text-white">{formatFileSize(stats.totalSize)}</p></div>
            <HardDrive className="h-8 w-8 text-orange-300" />
          </CardContent>
        </Card>
        <Card className="bg-white/20 backdrop-blur-md border-white/20">
          <CardContent className="p-3 flex items-center justify-between">
            <div><p className="text-xs text-white/70">Starred</p><p className="text-xl font-bold text-white">{stats.starredItems}</p></div>
            <Star className="h-8 w-8 text-yellow-300" />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-white/70">Found <span className="font-semibold text-white">{filteredDocuments.length}</span> files</p>
      </div>

      {isLoading ? (
        <div className="space-y-4"><Skeleton className="h-32 w-full bg-white/20" /><Skeleton className="h-32 w-full bg-white/20" /></div>
      ) : filteredDocuments.length === 0 ? (
        <Card className="border-white/20 bg-white/20 backdrop-blur-md">
          <CardContent className="py-12 text-center">
            <Archive className="h-12 w-12 mx-auto text-white/60 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No files found</h3>
            <p className="text-white/70 mb-6">
              {hasActiveFilters ? 'Try adjusting your search or filters' : 'This folder is empty. Upload your first document!'}
            </p>
            {!hasActiveFilters && (
              <Button onClick={() => setIsUploadOpen(true)}><Upload className="h-4 w-4 mr-2" />Upload Files</Button>
            )}
            {hasActiveFilters && <Button onClick={clearAllFilters}>Clear Filters</Button>}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? renderGridView() : renderTableView()}
    </div>
  );

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <div className="min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          {natureWallpapers.map((wallpaper, index) => (
            <div key={index} className="absolute inset-0 transition-opacity duration-2000" style={{
              backgroundImage: `url('${wallpaper.url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentWallpaperIndex ? 1 : 0,
              transition: 'opacity 2000ms ease-in-out',
            }} />
          ))}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10">
          <Header isLoggedIn={isLoggedIn} user={user} onLogout={() => {}} />

          <div className="container mx-auto px-4 py-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden bg-white/20 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg"><Folder className="h-5 w-5 text-white" /></div>
                  <div><h1 className="text-xl font-bold text-white drop-shadow-lg">AMS Document Hub</h1><p className="text-xs text-white/70">ISO 55001 Compliant</p></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full bg-white/20 text-white">{isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Avatar className="h-7 w-7 bg-gradient-to-br from-blue-500 to-indigo-600">
                    <AvatarFallback className="bg-transparent text-white text-sm">{user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block"><p className="text-sm font-medium text-white">{user?.name || 'Guest'}</p><p className="text-xs text-white/70">{user?.email || 'guest@example.com'}</p></div>
                </div>
              </div>
            </div>

            {/* Mobile menu drawer */}
            {mobileMenuOpen && (
              <>
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
                <div className="fixed left-0 top-0 h-full w-64 bg-white z-50 shadow-xl animate-slide-right">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold">Menu</h2>
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}><X className="h-4 w-4" /></Button>
                  </div>
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-2">
                      {BASE_CATEGORIES.map(category => (
                        <Button key={category.id} variant="ghost" className="w-full justify-start" onClick={() => { handleCategoryClick(category); setMobileMenuOpen(false); }}>
                          <category.icon className="h-4 w-4 mr-2" /> {category.name}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}

            {/* Breadcrumb */}
            {path.length > 0 && currentCategory && (
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      onClick={() => { 
                        setCurrentFolder(null); 
                        setPath(path.slice(0, 1)); 
                        loadFolderContents(); 
                      }} 
                      className="text-white/80 hover:text-white cursor-pointer"
                    >
                      {currentCategory?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {path.slice(1).map((item, index) => (
                    <React.Fragment key={item.id}>
                      <BreadcrumbSeparator className="text-white/50" />
                      <BreadcrumbItem>
                        {index === path.slice(1).length - 1 ? (
                          <BreadcrumbPage className="text-white font-semibold">{item.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink onClick={() => handleBreadcrumbClick(index + 1)} className="text-white/80 hover:text-white cursor-pointer">
                            {item.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}

            {/* Main Content */}
            {!currentCategory ? renderHomeView() : !currentFolder ? renderCategoryView() : renderSubfolderView()}
          </div>

          <Footer />
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a folder in {currentCategory?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Folder Name</Label>
              <Input 
                value={newFolderName} 
                onChange={(e) => setNewFolderName(e.target.value)} 
                placeholder="Enter folder name" 
                autoFocus 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSubfolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Upload to {currentFolder || currentCategory?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 mb-4">Click to browse</p>
              <Button variant="outline">Browse Files</Button>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => setUploadedFiles(prev => [...prev, ...Array.from(e.target.files || [])])} />
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected ({uploadedFiles.length})</Label>
                <ScrollArea className="h-32">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 border rounded mb-1">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}><X className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
            
            {isUploading && <div><Progress value={uploadProgress} /><p className="text-sm text-center mt-1">{Math.round(uploadProgress)}%</p></div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsUploadOpen(false); setUploadedFiles([]); }}>Cancel</Button>
            <Button onClick={handleFileUpload} disabled={uploadedFiles.length === 0 || isUploading}>
              {isUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading</> : <>Upload {uploadedFiles.length} file(s)</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Rename {itemToRename?.type === 'folder' ? 'Folder' : 'File'}</DialogTitle>
          </DialogHeader>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={itemToRename?.type === 'folder' ? handleRenameSubfolder : handleRenameConfirm}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isFilePreviewOpen} onOpenChange={setIsFilePreviewOpen}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader><DialogTitle>{selectedFile?.name}</DialogTitle></DialogHeader>
          <div className="min-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg p-4">
            {selectedFile?.type === 'image' && previewUrl ? <img src={previewUrl} className="max-w-full max-h-[500px] object-contain rounded" /> : 
             <div className="text-center">{getFileIcon(selectedFile?.type)}<p className="mt-2 text-gray-500">Preview not available</p><Button onClick={() => handleDownload(selectedFile)} className="mt-4"><Download className="h-4 w-4 mr-2" />Download</Button></div>}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><Label>Size</Label><p>{formatFileSize(selectedFile?.file_size)}</p></div>
            <div><Label>Type</Label><p>{selectedFile?.type?.toUpperCase()}</p></div>
            <div><Label>Uploaded</Label><p>{formatDate(selectedFile?.created_at)}</p></div>
            <div><Label>Location</Label><p>{selectedFile?.folderPath || currentCategory?.name}</p></div>
          </div>
          <DialogFooter>
            <Button onClick={() => handleDownload(selectedFile)}><Download className="h-4 w-4 mr-2" />Download</Button>
            <Button variant="destructive" onClick={() => { handleDeleteClick(selectedFile); setIsFilePreviewOpen(false); }}><TrashIcon className="h-4 w-4 mr-2" />Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog (for both files and folders) */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {itemToDelete?.type === 'folder' ? 'Folder' : 'File'}?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === 'folder' 
                ? `This will permanently delete the folder "${itemToDelete?.name}" and ALL files inside it. This action cannot be undone.`
                : `This will permanently delete "${itemToDelete?.name}". This cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={itemToDelete?.type === 'folder' ? handleDeleteSubfolder : handleDeleteConfirm} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position="bottom-right" richColors />
    </>
  );
}