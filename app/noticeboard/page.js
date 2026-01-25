// app/noticeboard/page.js
"use client";

import React, { useState, useEffect } from 'react';
import {
  Bell, Plus, Search, Trash2, Edit, 
  FileText, AlertTriangle, Loader, Filter,
  Calendar, Tag, RefreshCw, MoreVertical,
  Paperclip, Download, AlertCircle, CheckCircle,
  Eye, ChevronDown, X, User, Building,
  Archive, ChevronRight, ChevronLeft, Settings,
  Save, Upload, Link, Clock, Share2, Copy,
  ArrowUpRight, Info, File, Users, Zap, Megaphone,
  Printer, EyeOff, Pin, PinOff, Clock4, BarChart,
  ExternalLink, Mail, Smartphone, Globe
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const API_BASE_URL = 'http://localhost:8000/api/notices';

// API Service - Updated to match SQL schema
const noticeboardApi = {
  async getAllNotices(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.priority && filters.priority !== 'all') {
        params.append('priority', filters.priority);
      }
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.department && filters.department !== 'all') {
        params.append('department', filters.department);
      }
      if (filters.is_pinned !== undefined && filters.is_pinned !== null) {
        params.append('is_pinned', filters.is_pinned);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const url = `${API_BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching notices from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  },

  async createNotice(data) {
    try {
      // Format data to match SQL schema EXACTLY
      const sqlFormattedData = {
        title: data.title,
        content: data.content,
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category,
        priority: data.priority,
        status: data.status,
        is_pinned: data.is_pinned || false,
        requires_acknowledgment: data.requires_acknowledgment || false,
        author: data.author || null,
        department: data.department || null,
        expires_at: data.expires_at || null,
        target_audience: data.target_audience || null,
        notification_type: data.notification_type || null,
        attachment_name: data.attachment_name || null,
        attachment_url: data.attachment_url || null,
        attachment_size: data.attachment_size || null
      };

      console.log('Sending to backend:', sqlFormattedData);

      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sqlFormattedData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  },

  async updateNotice(id, data) {
    try {
      const sqlFormattedData = {
        title: data.title,
        content: data.content,
        date: data.date,
        category: data.category,
        priority: data.priority,
        status: data.status,
        is_pinned: data.is_pinned || false,
        requires_acknowledgment: data.requires_acknowledgment || false,
        author: data.author || null,
        department: data.department || null,
        expires_at: data.expires_at || null,
        target_audience: data.target_audience || null,
        notification_type: data.notification_type || null,
        attachment_name: data.attachment_name || null,
        attachment_url: data.attachment_url || null,
        attachment_size: data.attachment_size || null
      };

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sqlFormattedData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  },

  async deleteNotice(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return { success: true, message: 'Notice deleted successfully' };
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Stats error:', error.message);
      return null;
    }
  },
};

// Constants matching SQL database
const CATEGORIES = ["HR", "Safety", "IT", "General", "Operations", "Finance"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const STATUSES = ["Draft", "Active", "Archived"];
const DEPARTMENTS = ["HR", "IT", "Operations", "Finance", "Marketing", "Sales", "General"];
const TARGET_AUDIENCE = ["All Employees", "Management Only", "Department Specific", "Remote Workers", "New Hires"];
const NOTIFICATION_TYPES = ["General Announcement", "System Alert", "Training", "Policy Update", "Event", "Reminder"];

// Helper functions
const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'Critical': return { 
      badge: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300',
      icon: <AlertTriangle className="h-3 w-3" />,
      color: 'text-red-600'
    };
    case 'High': return { 
      badge: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300',
      icon: <AlertTriangle className="h-3 w-3" />,
      color: 'text-orange-600'
    };
    case 'Medium': return { 
      badge: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300',
      icon: <AlertCircle className="h-3 w-3" />,
      color: 'text-blue-600'
    };
    case 'Low': return { 
      badge: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300',
      icon: <AlertCircle className="h-3 w-3" />,
      color: 'text-gray-600'
    };
    default: return { 
      badge: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <AlertCircle className="h-3 w-3" />,
      color: 'text-gray-600'
    };
  }
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300';
    case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
    case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString) => {
  if (!dateString || dateString === '') return 'Not specified';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const formatDateTime = (dateString) => {
  if (!dateString || dateString === '') return 'Not specified';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const formatShortDate = (dateString) => {
  if (!dateString || dateString === '') return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
};

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const calculateClientSideStats = (notices) => {
  if (!notices || notices.length === 0) {
    return {
      total_notices: 0,
      status_breakdown: { Active: 0, Draft: 0, Archived: 0 },
      priority_breakdown: { Critical: 0, High: 0, Medium: 0, Low: 0 },
      category_breakdown: {},
      pinned_count: 0,
      expired_count: 0,
      expiring_soon_count: 0
    };
  }

  const statusBreakdown = {};
  const priorityBreakdown = {};
  const categoryBreakdown = {};
  
  let pinnedCount = 0;
  let expiredCount = 0;
  let expiringSoonCount = 0;
  const today = new Date();

  notices.forEach(notice => {
    const status = notice.status || 'Draft';
    statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
    
    const priority = notice.priority || 'Medium';
    priorityBreakdown[priority] = (priorityBreakdown[priority] || 0) + 1;
    
    const category = notice.category || 'General';
    categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    
    if (notice.is_pinned) pinnedCount++;
    
    if (notice.expires_at) {
      try {
        const expiryDate = new Date(notice.expires_at);
        if (!isNaN(expiryDate.getTime())) {
          if (expiryDate < today) {
            expiredCount++;
          } else {
            const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
              expiringSoonCount++;
            }
          }
        }
      } catch (error) {
        console.warn('Invalid expiry date:', notice.expires_at);
      }
    }
  });

  return {
    total_notices: notices.length,
    status_breakdown: statusBreakdown,
    priority_breakdown: priorityBreakdown,
    category_breakdown: categoryBreakdown,
    pinned_count: pinnedCount,
    expired_count: expiredCount,
    expiring_soon_count: expiringSoonCount
  };
};

// Enhanced Notice Details Modal Component - WIDENED and IMPROVED
const NoticeDetailsModal = ({ isOpen, onClose, notice, onDelete, onEdit }) => {
  if (!notice) return null;

  const priorityStyle = getPriorityStyle(notice.priority);
  const isExpired = notice.expires_at && new Date(notice.expires_at) < new Date();
  const expiresSoon = notice.expires_at && 
    new Date(notice.expires_at) > new Date() && 
    new Date(notice.expires_at) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // FIXED: Proper download function for attachments
  const handleDownloadAttachment = async () => {
    if (notice.attachment_url) {
      // If it's a URL, open it in a new tab or download it
      if (notice.attachment_url.startsWith('http')) {
        try {
          // Try to fetch the file directly
          const response = await fetch(notice.attachment_url);
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = notice.attachment_name || 'attachment';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            // Fallback: open in new tab if direct download fails
            window.open(notice.attachment_url, '_blank');
          }
        } catch (error) {
          console.error('Download error:', error);
          // Fallback: open in new tab
          window.open(notice.attachment_url, '_blank');
        }
      } else {
        // If it's a data URL or local path
        const link = document.createElement('a');
        link.href = notice.attachment_url;
        link.download = notice.attachment_name || 'attachment';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (notice.attachment_name) {
      // If there's only a file name but no URL, create a text file with the notice content
      const content = `NOTICE: ${notice.title}\n\nDate: ${notice.date}\nCategory: ${notice.category}\nPriority: ${notice.priority}\nStatus: ${notice.status}\nAuthor: ${notice.author}\nDepartment: ${notice.department}\n\nCONTENT:\n${notice.content}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = notice.attachment_name.endsWith('.txt') ? notice.attachment_name : `${notice.attachment_name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      alert('No attachment available for download');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: notice.title,
        text: truncateText(notice.content, 200),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${notice.title}\n\n${notice.content}`);
      alert('Notice copied to clipboard!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[1200px] max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="sticky top-0 z-10 bg-background border-b px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <DialogTitle className="text-2xl font-bold break-words">
                  {notice.title}
                </DialogTitle>
                {notice.is_pinned && (
                  <Badge variant="outline" className="bg-amber-50 border-amber-200 shrink-0">
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{notice.author || 'Not specified'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(notice.date)}</span>
                </div>
                
                {notice.department && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{notice.department}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 ml-auto">
                  <Badge className={`${priorityStyle.badge} shrink-0`}>
                    {priorityStyle.icon}
                    {notice.priority}
                  </Badge>
                  <Badge className={`${getStatusStyle(notice.status)} shrink-0`}>
                    {notice.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 lg:relative lg:right-0 lg:top-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="content" className="w-full h-full">
          <div className="sticky top-[4.5rem] z-10 bg-background border-b px-8">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="content" className="gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2">
                <Info className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="attachment" className="gap-2">
                <Paperclip className="h-4 w-4" />
                Attachment
              </TabsTrigger>
              <TabsTrigger value="actions" className="gap-2">
                <Settings className="h-4 w-4" />
                Actions
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="h-[calc(95vh-14rem)] px-8">
            <div className="py-6">
              <TabsContent value="content" className="space-y-6 m-0">
                {/* Content Section - WIDENED Layout */}
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Notice Content</h3>
                        <div className="border rounded-lg bg-muted/5 p-6">
                          <div className="whitespace-pre-wrap leading-relaxed text-base max-w-none">
                            {notice.content}
                          </div>
                        </div>
                      </div>
                      
                      {/* Improved Stats Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-card">
                          <CardContent className="p-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Category</p>
                              <Badge variant="outline" className="font-normal text-sm w-full justify-center">
                                <Tag className="h-3 w-3 mr-1" />
                                {notice.category}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-card">
                          <CardContent className="p-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Target Audience</p>
                              <p className="text-sm font-medium flex items-center gap-2 truncate">
                                <Users className="h-3 w-3 shrink-0" />
                                {notice.target_audience || 'All Employees'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-card">
                          <CardContent className="p-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Notification Type</p>
                              <p className="text-sm font-medium flex items-center gap-2 truncate">
                                <Bell className="h-3 w-3 shrink-0" />
                                {notice.notification_type || 'General Announcement'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-card">
                          <CardContent className="p-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Acknowledgment</p>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={notice.requires_acknowledgment ? "default" : "outline"} 
                                  className={`${notice.requires_acknowledgment 
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" 
                                    : "opacity-70"
                                  } w-full justify-center`}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {notice.requires_acknowledgment ? 'Required' : 'Not Required'}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6 m-0">
                {/* Details Section - WIDENED Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Notice Information - WIDENED */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Notice Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Category</p>
                          <Badge variant="outline" className="w-full justify-center">
                            {notice.category}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge className={`${getStatusStyle(notice.status)} w-full justify-center`}>
                            {notice.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Priority</p>
                          <Badge className={`${priorityStyle.badge} w-full justify-center`}>
                            {priorityStyle.icon}
                            {notice.priority}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Pinned</p>
                          <div className="flex items-center justify-center">
                            {notice.is_pinned ? (
                              <Pin className="h-5 w-5 text-amber-500" />
                            ) : (
                              <PinOff className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Target Audience</p>
                          <p className="text-sm font-medium truncate">{notice.target_audience || 'All Employees'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Notification Type</p>
                          <p className="text-sm font-medium truncate">{notice.notification_type || 'General Announcement'}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Author</p>
                            <p className="text-base font-medium">{notice.author || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Department</p>
                            <p className="text-base font-medium">{notice.department || 'General'}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Requires Acknowledgment</p>
                            <div className="flex items-center gap-2">
                              {notice.requires_acknowledgment ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400" />
                              )}
                              <span className="font-medium">
                                {notice.requires_acknowledgment ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Timeline Information */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Published Date</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            <p className="text-base font-medium">{formatDate(notice.date)}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Expiry Date</p>
                          <div className="flex items-center gap-2">
                            {isExpired ? (
                              <Clock4 className="h-5 w-5 text-red-500" />
                            ) : expiresSoon ? (
                              <Clock className="h-5 w-5 text-amber-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-400" />
                            )}
                            <p className={`text-base font-medium ${isExpired ? 'text-red-600' : expiresSoon ? 'text-amber-600' : ''}`}>
                              {notice.expires_at ? formatDate(notice.expires_at) : 'Never'}
                              {isExpired && <span className="ml-2 text-sm">(Expired)</span>}
                              {expiresSoon && !isExpired && <span className="ml-2 text-sm">(Expires Soon)</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        {notice.created_at && (
                          <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <p className="text-sm font-medium">{formatDateTime(notice.created_at)}</p>
                            </div>
                          </div>
                        )}
                        {notice.updated_at && (
                          <div>
                            <p className="text-sm text-muted-foreground">Last Updated</p>
                            <div className="flex items-center gap-2">
                              <RefreshCw className="h-4 w-4 text-gray-400" />
                              <p className="text-sm font-medium">{formatDateTime(notice.updated_at)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="attachment" className="space-y-6 m-0">
                {/* Attachment Section - IMPROVED Display */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Paperclip className="h-5 w-5" />
                      Attachment Details
                    </CardTitle>
                    <CardDescription className="text-base">
                      {notice.attachment_name 
                        ? 'View and download the attached file' 
                        : 'No attachment available for this notice'
                      }
                    </CardDescription>
                  </CardHeader>
                  
                  {notice.attachment_name || notice.attachment_url ? (
                    <CardContent>
                      <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                              <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-xl mb-2 break-words">
                                {notice.attachment_name || 'Download File'}
                              </p>
                              {notice.attachment_size && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  Size: {notice.attachment_size}
                                </p>
                              )}
                              {notice.attachment_url && (
                                <div className="flex items-start gap-2 mt-3">
                                  <Link className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
                                  <a 
                                    href={notice.attachment_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline"
                                  >
                                    {notice.attachment_url}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button 
                              onClick={handleDownloadAttachment}
                              className="gap-2 px-6"
                              size="lg"
                            >
                              <Download className="h-5 w-5" />
                              Download File
                            </Button>
                            {notice.attachment_url && notice.attachment_url.startsWith('http') && (
                              <Button 
                                variant="outline" 
                                onClick={() => window.open(notice.attachment_url, '_blank')}
                                className="gap-2 px-6"
                                size="lg"
                              >
                                <ExternalLink className="h-5 w-5" />
                                Open in Browser
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="font-semibold mb-3">File Information</h4>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">File Name</p>
                              <p className="font-medium truncate">{notice.attachment_name || 'Unnamed File'}</p>
                            </div>
                            {notice.attachment_size && (
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Size</p>
                                <p className="font-medium">{notice.attachment_size}</p>
                              </div>
                            )}
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">File Type</p>
                              <p className="font-medium uppercase">
                                {notice.attachment_name ? notice.attachment_name.split('.').pop() : 'Unknown'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Status</p>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Available
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
                        <Paperclip className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground mb-2">No attachment available</p>
                        <p className="text-sm text-muted-foreground">
                          You can add an attachment when editing this notice
                        </p>
                        <Button
                          variant="outline"
                          className="mt-6 gap-2"
                          onClick={() => {
                            onEdit(notice);
                            onClose();
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          Edit Notice to Add Attachment
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-6 m-0">
                {/* Actions Section - WIDENED */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Notice Actions</CardTitle>
                    <CardDescription className="text-base">
                      Available operations for this notice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button 
                        variant="outline" 
                        onClick={handleShare}
                        className="gap-3 h-auto py-4 justify-start"
                      >
                        <Share2 className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold">Share Notice</div>
                          <div className="text-sm text-muted-foreground">Share with others</div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigator.clipboard.writeText(`${notice.title}\n\n${notice.content}`);
                          alert('Notice content copied to clipboard!');
                        }}
                        className="gap-3 h-auto py-4 justify-start"
                      >
                        <Copy className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold">Copy Content</div>
                          <div className="text-sm text-muted-foreground">Copy to clipboard</div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          onEdit(notice);
                          onClose();
                        }}
                        className="gap-3 h-auto py-4 justify-start"
                      >
                        <Edit className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold">Edit Notice</div>
                          <div className="text-sm text-muted-foreground">Modify this notice</div>
                        </div>
                      </Button>
                      
                      {(notice.attachment_name || notice.attachment_url) && (
                        <Button 
                          variant="outline" 
                          onClick={handleDownloadAttachment}
                          className="gap-3 h-auto py-4 justify-start"
                        >
                          <Download className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-semibold">Download</div>
                            <div className="text-sm text-muted-foreground">Get attachment</div>
                          </div>
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigator.clipboard.writeText(notice.id);
                          alert('Notice ID copied to clipboard!');
                        }}
                        className="gap-3 h-auto py-4 justify-start"
                      >
                        <Copy className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold">Copy ID</div>
                          <div className="text-sm text-muted-foreground">Copy notice ID</div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
                            onDelete(notice.id);
                            onClose();
                          }
                        }}
                        className="gap-3 h-auto py-4 justify-start"
                      >
                        <Trash2 className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold">Delete Notice</div>
                          <div className="text-sm">Permanently remove</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Technical Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Technical Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Notice ID</p>
                        <div className="flex items-center gap-3">
                          <code className="text-sm bg-muted px-3 py-2 rounded-lg font-mono break-all flex-1">
                            {notice.id}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 p-0"
                            onClick={() => {
                              navigator.clipboard.writeText(notice.id);
                              alert('ID copied to clipboard!');
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="font-medium">{notice.created_at ? formatDateTime(notice.created_at) : 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{notice.updated_at ? formatDateTime(notice.updated_at) : 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
          
          <DialogFooter className="sticky bottom-0 bg-background border-t px-8 py-4">
            <div className="flex w-full justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Last updated: {notice.updated_at ? formatDateTime(notice.updated_at) : 'Unknown'}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => {
                  onEdit(notice);
                  onClose();
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Notice
                </Button>
              </div>
            </div>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Notice Card Component - FIXED hydration error
const NoticeCard = ({ notice, onView, onEdit, onDelete, viewMode = 'grid' }) => {
  const priorityStyle = getPriorityStyle(notice.priority);
  const statusStyle = getStatusStyle(notice.status);
  const isExpired = notice.expires_at && new Date(notice.expires_at) < new Date();
  const expiresSoon = notice.expires_at && 
    new Date(notice.expires_at) > new Date() && 
    new Date(notice.expires_at) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // FIXED: Table view mode - removed whitespace issue
  if (viewMode === 'table') {
    return (
      <TableRow className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
        <TableCell>
          <div className="flex items-center gap-3">
            {notice.is_pinned && <Pin className="h-4 w-4 text-amber-500" />}
            <div>
              <div className="font-medium">{notice.title}</div>
              <div className="text-sm text-muted-foreground">
                {truncateText(notice.content, 60)}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline">{notice.category}</Badge>
        </TableCell>
        <TableCell>
          <Badge className={priorityStyle.badge}>
            {priorityStyle.icon}
            {notice.priority}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge className={statusStyle}>{notice.status}</Badge>
        </TableCell>
        <TableCell>{notice.author || '-'}</TableCell>
        <TableCell>{formatShortDate(notice.date)}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(notice)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(notice)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm('Delete this notice?')) onDelete(notice.id);
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${notice.is_pinned ? 'border-amber-200 border-2' : ''}`}>
      {notice.is_pinned && (
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-amber-50 border-amber-200">
            <Pin className="h-3 w-3 mr-1" />
            Pinned
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1 pr-8">
            <CardTitle className="text-lg line-clamp-1">{notice.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {notice.author || 'Not specified'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatShortDate(notice.date)}
              </span>
              {notice.department && (
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {notice.department}
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {notice.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Tag className="h-3 w-3 mr-1" />
              {notice.category}
            </Badge>
            {isExpired && (
              <Badge variant="destructive" className="text-xs">
                <Clock4 className="h-3 w-3 mr-1" />
                Expired
              </Badge>
            )}
            {expiresSoon && !isExpired && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                <Clock className="h-3 w-3 mr-1" />
                Expires Soon
              </Badge>
            )}
            {notice.attachment_name && (
              <Paperclip className="h-4 w-4 text-blue-500" />
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {notice.notification_type || 'General Announcement'}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={priorityStyle.badge}>
              {priorityStyle.icon}
              {notice.priority}
            </Badge>
            <Badge className={statusStyle}>
              {notice.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(notice)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(notice)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(notice)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Notice
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => {
                    if (window.confirm('Delete this notice?')) onDelete(notice.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Notice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// Statistics Card Component
const StatisticsCard = ({ title, value, icon: Icon, trend, description, className = '' }) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value || 0}</div>
      {trend && (
        <p className="text-xs text-muted-foreground">
          {trend} {description && <span className="font-medium">{description}</span>}
        </p>
      )}
    </CardContent>
  </Card>
);

// Edit Notice Modal Component (keep your existing version, just ensuring it's included)
const EditNoticeModal = ({ isOpen, onClose, notice, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    category: "General",
    priority: "Medium",
    status: "Draft",
    is_pinned: false,
    requires_acknowledgment: false,
    author: "",
    department: "General",
    expires_at: "",
    target_audience: "All Employees",
    notification_type: "General Announcement",
    attachment_name: "",
    attachment_url: "",
    attachment_size: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title || '',
        content: notice.content || '',
        date: notice.date ? notice.date.split('T')[0] : new Date().toISOString().split('T')[0],
        category: notice.category || "General",
        priority: notice.priority || "Medium",
        status: notice.status || "Draft",
        is_pinned: notice.is_pinned || false,
        author: notice.author || "",
        department: notice.department || "General",
        expires_at: notice.expires_at ? notice.expires_at.split('T')[0] : "",
        target_audience: notice.target_audience || "All Employees",
        notification_type: notice.notification_type || "General Announcement",
        requires_acknowledgment: notice.requires_acknowledgment || false,
        attachment_name: notice.attachment_name || "",
        attachment_url: notice.attachment_url || "",
        attachment_size: notice.attachment_size || ""
      });
    } else {
      setFormData({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        category: "General",
        priority: "Medium",
        status: "Draft",
        is_pinned: false,
        author: "",
        department: "General",
        expires_at: "",
        target_audience: "All Employees",
        notification_type: "General Announcement",
        requires_acknowledgment: false,
        attachment_name: "",
        attachment_url: "",
        attachment_size: ""
      });
    }
    setErrors({});
  }, [notice]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.category) newErrors.category = 'Category is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSave(formData);
  };

  const handleAttachmentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        attachment_name: file.name,
        attachment_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {notice ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {notice ? 'Edit Notice' : 'Create New Notice'}
          </DialogTitle>
          <DialogDescription>
            {notice ? 'Update the notice details below.' : 'Fill in the details to create a new notice.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Required Information</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="flex items-center gap-1">
                    Title <span className="text-red-500">*</span>
                    {errors.title && <span className="text-red-500 text-xs">({errors.title})</span>}
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder="Enter notice title"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="content" className="flex items-center gap-1">
                    Content <span className="text-red-500">*</span>
                    {errors.content && <span className="text-red-500 text-xs">({errors.content})</span>}
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    placeholder="Enter notice content"
                    className={`min-h-[150px] ${errors.content ? 'border-red-500' : ''}`}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date" className="flex items-center gap-1">
                      Publish Date <span className="text-red-500">*</span>
                      {errors.date && <span className="text-red-500 text-xs">({errors.date})</span>}
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                      className={errors.date ? 'border-red-500' : ''}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="flex items-center gap-1">
                      Category <span className="text-red-500">*</span>
                      {errors.category && <span className="text-red-500 text-xs">({errors.category})</span>}
                    </Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Priority & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, priority: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map(p => (
                        <SelectItem key={p} value={p}>
                          <div className="flex items-center gap-2">
                            {getPriorityStyle(p).icon}
                            {p}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => (
                        <SelectItem key={s} value={s}>
                          <Badge className={getStatusStyle(s)}>
                            {s}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Enter author name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, department: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Select 
                    value={formData.target_audience} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, target_audience: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_AUDIENCE.map(audience => (
                        <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notification_type">Notification Type</Label>
                  <Select 
                    value={formData.notification_type} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, notification_type: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFICATION_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="expires_at">Expiry Date</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                    min={formData.date}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Attachment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="attachment_name">File Name</Label>
                  <Input
                    id="attachment_name"
                    value={formData.attachment_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, attachment_name: e.target.value }))}
                    placeholder="e.g., policy.pdf"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="attachment_url">File URL</Label>
                  <Input
                    id="attachment_url"
                    value={formData.attachment_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, attachment_url: e.target.value }))}
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="attachment_size">File Size</Label>
                  <Input
                    id="attachment_size"
                    value={formData.attachment_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, attachment_size: e.target.value }))}
                    placeholder="e.g., 2.5 MB"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Label htmlFor="attachment-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                    <Upload className="h-4 w-4" />
                    Upload File
                  </div>
                  <input
                    id="attachment-upload"
                    type="file"
                    className="hidden"
                    onChange={handleAttachmentUpload}
                  />
                </Label>
                {formData.attachment_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4" />
                    <span>{formData.attachment_name}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Settings</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_pinned"
                    checked={formData.is_pinned}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_pinned: checked }))}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="is_pinned" className="cursor-pointer flex items-center gap-2">
                      <Pin className="h-4 w-4" />
                      Pin to top
                    </Label>
                    <p className="text-xs text-muted-foreground">Keep this notice at the top of the list</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requires_acknowledgment"
                    checked={formData.requires_acknowledgment}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_acknowledgment: checked }))}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="requires_acknowledgment" className="cursor-pointer flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Require acknowledgment
                    </Label>
                    <p className="text-xs text-muted-foreground">Users must acknowledge reading this notice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {notice ? 'Save Changes' : 'Create Notice'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export default function NoticeboardManagement() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'all',
    department: 'all',
    is_pinned: null
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotices();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, search]);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const apiFilters = {
        ...filters,
        search: search || undefined,
        is_pinned: filters.is_pinned !== null ? filters.is_pinned : undefined
      };
      
      const notices = await noticeboardApi.getAllNotices(apiFilters);
      setData(Array.isArray(notices) ? notices : []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await noticeboardApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    }
  };

  const handleSaveNotice = async (noticeData) => {
    setIsLoading(true);
    try {
      console.log('Saving notice with data:', noticeData);
      
      let result;
      if (editingNotice) {
        result = await noticeboardApi.updateNotice(editingNotice.id, noticeData);
      } else {
        result = await noticeboardApi.createNotice(noticeData);
      }
      
      console.log('Save result:', result);
      
      await fetchNotices();
      setIsModalOpen(false);
      setEditingNotice(null);
      
      alert(`Notice ${editingNotice ? 'updated' : 'created'} successfully!`);
      
    } catch (error) {
      console.error('Save error:', error);
      
      if (error.message.includes('405')) {
        alert('Error: Method Not Allowed. Please check the API endpoint and method.');
      } else if (error.message.includes('400')) {
        alert('Error: Bad Request. Please check the data format and required fields.');
      } else if (error.message.includes('500')) {
        alert('Error: Internal Server Error. Please check backend logs.');
      } else if (error.message.includes('Network Error')) {
        alert('Error: Cannot connect to backend. Make sure the server is running on http://localhost:8000');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await noticeboardApi.deleteNotice(id);
      setData(prev => prev.filter(n => n.id !== id));
      if (selectedNotice?.id === id) {
        setIsDetailsModalOpen(false);
        setSelectedNotice(null);
      }
      alert('Notice deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Error deleting notice: ${error.message}`);
    }
  };

  const handleViewDetails = (notice) => {
    setSelectedNotice(notice);
    setIsDetailsModalOpen(true);
  };

  const handleEditNotice = (notice) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const calculatedStats = calculateClientSideStats(data);
  
  const pinnedNotices = data.filter(notice => notice.is_pinned);
  const regularNotices = data.filter(notice => !notice.is_pinned);
  const expiredNotices = data.filter(notice => 
    notice.expires_at && new Date(notice.expires_at) < new Date()
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-primary" />
            Noticeboard Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and monitor all company notices and announcements
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => {
            setEditingNotice(null);
            setIsModalOpen(true);
          }} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Notice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard
          title="Total Notices"
          value={data.length}
          icon={FileText}
          trend={`${calculatedStats.total_notices} total`}
        />
        <StatisticsCard
          title="Active"
          value={data.filter(n => n.status === 'Active').length}
          icon={CheckCircle}
          trend={`${calculatedStats.status_breakdown.Active || 0} active`}
          className="border-green-200 dark:border-green-800"
        />
        <StatisticsCard
          title="Pinned"
          value={pinnedNotices.length}
          icon={Pin}
          trend={`${calculatedStats.pinned_count} pinned`}
          className="border-amber-200 dark:border-amber-800"
        />
        <StatisticsCard
          title="Expired"
          value={expiredNotices.length}
          icon={Clock4}
          trend={`${calculatedStats.expired_count} expired`}
          className="border-red-200 dark:border-red-800"
        />
      </div>

      {calculatedStats.priority_breakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Priority Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {PRIORITIES.map(priority => {
                const count = calculatedStats.priority_breakdown[priority] || 0;
                const percentage = data.length > 0 ? (count / data.length * 100) : 0;
                
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPriorityStyle(priority).icon}
                      <span className="text-sm">{priority}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <Progress 
                          value={percentage} 
                          className={`h-2 ${
                            priority === 'Critical' ? 'bg-red-100' :
                            priority === 'High' ? 'bg-orange-100' :
                            priority === 'Medium' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
              <CardDescription>Filter notices by various criteria</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
                <TabsList>
                  <TabsTrigger value="grid" className="gap-2">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="h-2 w-2 bg-current rounded-sm"></div>
                      <div className="h-2 w-2 bg-current rounded-sm"></div>
                      <div className="h-2 w-2 bg-current rounded-sm"></div>
                      <div className="h-2 w-2 bg-current rounded-sm"></div>
                    </div>
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="table" className="gap-2">
                    <Table className="h-4 w-4" />
                    Table
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notices by title or content..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-6 w-6 p-0"
                  onClick={() => setSearch('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-category" className="text-xs">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="filter-category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter-priority" className="text-xs">Priority</Label>
                <Select
                  value={filters.priority}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger id="filter-priority">
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {PRIORITIES.map(p => (
                      <SelectItem key={p} value={p}>
                        <div className="flex items-center gap-2">
                          {getPriorityStyle(p).icon}
                          {p}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter-status" className="text-xs">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="filter-status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {STATUSES.map(s => (
                      <SelectItem key={s} value={s}>
                        <Badge className={getStatusStyle(s)}>
                          {s}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter-department" className="text-xs">Department</Label>
                <Select
                  value={filters.department}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger id="filter-department">
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter-pinned" className="text-xs">Pinned Status</Label>
                <Select
                  value={filters.is_pinned === null ? 'all' : filters.is_pinned.toString()}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      setFilters(prev => ({ ...prev, is_pinned: null }));
                    } else {
                      setFilters(prev => ({ ...prev, is_pinned: value === 'true' }));
                    }
                  }}
                >
                  <SelectTrigger id="filter-pinned">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notices</SelectItem>
                    <SelectItem value="true">Pinned Only</SelectItem>
                    <SelectItem value="false">Not Pinned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({
                    category: 'all',
                    priority: 'all',
                    status: 'all',
                    department: 'all',
                    is_pinned: null
                  });
                  setSearch('');
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={fetchNotices}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle>Notices ({data.length})</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `Showing ${data.length} notice${data.length !== 1 ? 's' : ''}`}
              </CardDescription>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {pinnedNotices.length > 0 && `${pinnedNotices.length} pinned, `}
              {regularNotices.length} regular
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading notices...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notices found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {search || Object.values(filters).some(f => f !== 'all' && f !== null) 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first notice'}
              </p>
              {(!search && Object.values(filters).every(f => f === 'all' || f === null)) && (
                <Button onClick={() => {
                  setEditingNotice(null);
                  setIsModalOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Notice
                </Button>
              )}
            </div>
          ) : viewMode === 'table' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pinnedNotices.map(notice => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      onView={handleViewDetails}
                      onEdit={handleEditNotice}
                      onDelete={handleDeleteNotice}
                      viewMode="table"
                    />
                  ))}
                  {regularNotices.map(notice => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      onView={handleViewDetails}
                      onEdit={handleEditNotice}
                      onDelete={handleDeleteNotice}
                      viewMode="table"
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="space-y-6">
              {pinnedNotices.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold">Pinned Notices</h3>
                    <Badge variant="outline" className="ml-2">
                      {pinnedNotices.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pinnedNotices.map(notice => (
                      <NoticeCard
                        key={notice.id}
                        notice={notice}
                        onView={handleViewDetails}
                        onEdit={handleEditNotice}
                        onDelete={handleDeleteNotice}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                  <Separator className="my-6" />
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  All Notices ({regularNotices.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularNotices.map(notice => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      onView={handleViewDetails}
                      onEdit={handleEditNotice}
                      onDelete={handleDeleteNotice}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        {data.length > 0 && !isLoading && (
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
              {expiredNotices.length > 0 && (
                <span className="text-red-600 mr-3">
                  {expiredNotices.length} expired notice{expiredNotices.length !== 1 ? 's' : ''}
                </span>
              )}
              Showing {data.length} notice{data.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Print List
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common actions for notice management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <Archive className="h-4 w-4" />
              Archive All Expired
            </Button>
            <Button variant="outline" className="gap-2">
              <EyeOff className="h-4 w-4" />
              Hide Expired Notices
            </Button>
            <Button variant="outline" className="gap-2">
              <PinOff className="h-4 w-4" />
              Unpin All
            </Button>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              View Acknowledgment Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditNoticeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNotice(null);
        }}
        notice={editingNotice}
        onSave={handleSaveNotice}
        isLoading={isLoading}
      />
      
      <NoticeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedNotice(null);
        }}
        notice={selectedNotice}
        onDelete={handleDeleteNotice}
        onEdit={(notice) => {
          setIsDetailsModalOpen(false);
          handleEditNotice(notice);
        }}
      />
    </div>
  );
}