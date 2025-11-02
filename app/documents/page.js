// MineDCS.jsx - V9.6: FULL CODE, Grid View Implemented, Polished View Toggle, Fixed Errors, Indigo Theme, Role Simulation, File Upload, and Improved View Icons

"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { 
    Folder, FileText, Upload, Search, Users, Shield, Clock, FileCheck2,
    Trash2, Edit, X, LayoutList, ChevronRight, HardDrive, 
    Archive, Download, Eye, History, Lock, File, List, Calendar, 
    ChevronDown, ArrowUp, ArrowDown, Filter, ChevronLeft, 
    Zap, Gem, Drill, Factory, Scale, Truck, Plus, FolderPlus, UserCheck, FileArchive,
    LayoutGrid 
} from 'lucide-react';

// --- Global Constants & Utilities ---

// ACCESS LEVELS
const USER_ROLES = {
    Admin: ['Admin', 'Restricted', 'Public'],
    Manager: ['Restricted', 'Public'],
    Staff: ['Public'],
};

// Placeholder Components (Shadcn Aesthetic)
const Button = ({ children, variant = 'default', className = '', onClick, disabled = false, type = 'button', title }) => {
    let baseStyle = 'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2';
    switch (variant) {
        case 'primary': 
            baseStyle += ' bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/30';
            break;
        case 'secondary':
            baseStyle += ' bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200';
            break;
        case 'destructive':
            baseStyle += ' bg-red-600 text-white hover:bg-red-700';
            break;
        case 'ghost':
            baseStyle += ' bg-transparent text-slate-600 hover:bg-slate-100 shadow-none';
            break;
        case 'link':
            baseStyle += ' text-indigo-600 hover:underline px-0 py-0 h-auto';
            break;
        default:
            baseStyle += ' bg-slate-200 text-slate-800 hover:bg-slate-300';
    }
    return <button type={type} className={`${baseStyle} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={onClick} disabled={disabled} title={title}>{children}</button>;
};

const Input = ({ placeholder, value, onChange, className = '', type = 'text', id, required = false, autoFocus = false, accept }) => 
    <input 
        type={type} 
        id={id}
        required={required}
        autoFocus={autoFocus}
        accept={accept} 
        className={`w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${className}`} 
        placeholder={placeholder} 
        value={type !== 'file' ? value : undefined} 
        onChange={onChange} 
    />;

const Select = ({ children, onValueChange, value, placeholder, className = '' }) => (
    <div className={`relative ${className}`}>
        <select onChange={(e) => onValueChange(e.target.value)} value={value} className="w-full p-2.5 border border-slate-300 rounded-md appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-700">
            <option value="" disabled className="text-slate-400">{placeholder}</option>
            {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
    </div>
);
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

const Dialog = ({ children }) => <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[100] p-4">{children}</div>;
const DialogContent = ({ children, className = '' }) => <div className={`bg-white w-full max-w-lg rounded-lg shadow-2xl border border-slate-100 ${className}`}>{children}</div>;
const DialogHeader = ({ children }) => <div className="border-b border-slate-100 p-5 flex justify-between items-center">{children}</div>;
const DialogTitle = ({ children }) => <h2 className="text-xl font-semibold text-slate-800">{children}</h2>;
const DialogFooter = ({ children }) => <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">{children}</div>;


// --- File Icons & Core Utilities ---

const FILE_ICONS = {
    pdf: <FileText className="h-5 w-5 text-red-700" />,
    doc: <FileCheck2 className="h-5 w-5 text-blue-700" />,
    xls: <Scale className="h-5 w-5 text-green-700" />,
    jpg: <Eye className="h-5 w-5 text-purple-700" />,
    zip: <Archive className="h-5 w-5 text-slate-700" />,
    default: <File className="h-5 w-5 text-slate-500" />,
    folder: <Folder className="h-6 w-6 text-indigo-500 fill-indigo-100" />
};

let nextFileId = 200;
let nextFolderId = 100; 
const generateNewFileId = () => `f-${nextFileId++}`;
const generateNewFolderId = () => `d-${nextFolderId++}`; 
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const getFileExtension = (fileName) => fileName.split('.').pop().toLowerCase();
const getCurrentDateString = () => new Date().toISOString().split('T')[0];

// Function definition added to resolve ReferenceError
const findFolderById = (root, targetId) => {
    if (root.id === targetId) return root;
    if (root.children) {
        for (let child of root.children) {
            const found = findFolderById(child, targetId);
            if (found) return found;
        }
    }
    return null;
};

// Function to update the file system state recursively (used for file/folder creation)
const updateFileSystem = (fileSystem, folderPath, newItem) => {
    if (folderPath.length === 0) return fileSystem; 

    const targetFolderId = folderPath[folderPath.length - 1].id;

    const traverseAndUpdate = (node) => {
        if (node.id === targetFolderId) {
            const existingIndex = node.children.findIndex(f => f.id === newItem.id);
            
            if (existingIndex !== -1) {
                node.children[existingIndex] = newItem;
            } else {
                node.children.unshift(newItem);
            }
            return { ...node, children: [...node.children] };
        }

        if (node.children) {
            const updatedChildren = node.children.map(child => 
                child.type === 'folder' ? traverseAndUpdate(child) : child
            );
            return { ...node, children: updatedChildren };
        }
        return node;
    };

    return traverseAndUpdate(fileSystem);
};

// --- Initial Data (Static for Demo) ---
const initialFileSystem = {
    id: 'root',
    name: 'Gold Mine DCS Root',
    type: 'folder',
    children: [
        { id: '1', name: 'Geology & Exploration', type: 'folder', access: 'Restricted', children: [
            { id: '1-1', name: 'Drill Hole Logs', type: 'folder', access: 'Restricted', children: [
                { id: '1-1-1', name: 'Drill Hole Log Template v1.5.doc', type: 'doc', size: '123456', date: '2025-10-25', version: '1.5', url: '/files/drill-log.doc', access: 'Public', versions: [] },
            ]},
            { id: '1-2', name: 'Resource Estimation', type: 'folder', access: 'Admin', children: [
                 { id: '1-2-1', name: 'Resource Model 2025.zip', type: 'zip', size: '55000000', date: '2025-11-01', version: '1.0', url: '/files/resource-model.zip', access: 'Admin', versions: [] },
            ]},
        ], icon: <Gem className="h-5 w-5" /> },
        { id: '2', name: 'Mining Operations', type: 'folder', access: 'Public', children: [
            { id: '2-1', name: 'Standard Operating Procedures', type: 'folder', access: 'Public', children: [
                { id: '2-1-1', name: 'Blasting Procedure v8.1.pdf', type: 'pdf', size: '2048000', date: '2025-11-05', version: '8.1', url: '/files/blasting-proc.pdf', access: 'Public', versions: [] },
            ]},
            { id: '2-2', name: 'Infrastructure', type: 'folder', access: 'Restricted', children: [
                 { id: '2-2-1', name: 'Haul Road Standards.pdf', type: 'pdf', size: '921600', date: '2025-09-10', version: '1.0', url: '/files/haul-road.pdf', access: 'Restricted', versions: [] },
            ]},
        ], icon: <Drill className="h-5 w-5" /> },
        { id: '3', name: 'Processing Plant', type: 'folder', access: 'Restricted', children: [
            { id: '3-1', name: 'Chemical Protocols', type: 'folder', access: 'Admin', children: [
                { id: '3-1-1', name: 'Cyanide Handling Protocol v3.0.pdf', type: 'pdf', size: '1800000', date: '2025-10-01', version: '3.0', url: '/files/cyanide-proc.pdf', access: 'Admin', versions: [] },
            ]},
            { id: '3-2', name: 'Maintenance', type: 'folder', access: 'Restricted', children: [
                 { id: '3-2-1', name: 'Mill Maintenance Schedule.xls', type: 'xls', size: '150000', date: '2025-11-15', version: '1.0', url: '/files/maintenance-sched.xls', access: 'Restricted', versions: [] },
            ]},
        ], icon: <Factory className="h-5 w-5" /> },
        { id: '4', name: 'Safety, Health & Environment (SHE)', type: 'folder', access: 'Public', children: [
            { id: '4-1', name: 'Emergency Procedures', type: 'folder', access: 'Public', children: [
                 { id: '4-1-1', name: 'Emergency Evacuation Plan.pdf', type: 'pdf', size: '3200000', date: '2025-01-20', version: '2.0', url: '/files/evac-plan.pdf', access: 'Public', versions: [] },
            ]},
            { id: '4-2', name: 'Reporting', type: 'folder', access: 'Public', children: [
                 { id: '4-2-1', name: 'Incident Report Form.doc', type: 'doc', size: '50000', date: '2025-04-01', version: '1.0', url: '/files/incident-form.doc', access: 'Public', versions: [] },
            ]},
        ], icon: <Zap className="h-5 w-5" /> },
        { id: '5', name: 'Logistics & Supply', type: 'folder', access: 'Admin', children: [
            { id: '5-1', name: 'Fleet Management', type: 'folder', access: 'Admin', children: [
                 { id: '5-1-1', name: 'Heavy Vehicle Fleet List.xls', type: 'xls', size: '80000', date: '2025-11-01', version: '1.0', url: '/files/fleet-list.xls', access: 'Admin', versions: [] },
            ]},
        ], icon: <Truck className="h-5 w-5" /> },
        { id: '6', name: 'Finance & Administration', type: 'folder', access: 'Admin', children: [
            { id: '6-1', name: 'Budgets', type: 'folder', access: 'Admin', children: [
                 { id: '6-1-1', name: '2025 Budget Forecast.xls', type: 'xls', size: '1200000', date: '2025-12-01', version: '1.0', url: '/files/budget-forecast.xls', access: 'Admin', versions: [] },
            ]},
        ], icon: <Scale className="h-5 w-5" /> },
    ],
    access: 'Admin'
};


// --- Modal Components ---

// 1. New Folder Modal
const FolderModal = ({ isOpen, onClose, currentFolder, onFolderCreate }) => {
    const [folderName, setFolderName] = useState('');
    const [accessLevel, setAccessLevel] = useState('Restricted');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!folderName.trim()) return;

        const newFolder = {
            id: generateNewFolderId(),
            name: folderName.trim(),
            type: 'folder',
            access: accessLevel,
            children: [],
        };

        onFolderCreate(newFolder);
        setFolderName('');
        onClose();
    };

    return (
        <Dialog>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle><FolderPlus className='h-6 w-6 text-indigo-600 inline-block mr-2' /> Create New Folder</DialogTitle>
                    <Button onClick={onClose} variant="ghost" className="p-1.5"><X className="h-5 w-5" /></Button>
                </DialogHeader>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className='space-y-2'>
                            <label className="text-sm font-semibold text-slate-700 block">Folder Name <span className="text-red-500">*</span></label>
                            <Input 
                                value={folderName} 
                                onChange={(e) => setFolderName(e.target.value)} 
                                placeholder="e.g., Q3 Safety Audits" 
                                required 
                                autoFocus
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className="text-sm font-semibold text-slate-700 block">Default Access Level</label>
                            <Select 
                                value={accessLevel} 
                                onValueChange={setAccessLevel}
                                placeholder="Select Access Level"
                            >
                                <SelectItem value="Public">Public (Read-only for all)</SelectItem>
                                <SelectItem value="Restricted">Restricted (Department staff only)</SelectItem>
                                <SelectItem value="Admin">Admin (DCS Administrators only)</SelectItem>
                            </Select>
                        </div>
                        
                        <div className='p-3 bg-indigo-50 border border-indigo-200 rounded-md text-xs font-medium text-indigo-800 flex items-center gap-2'>
                            <Folder className='h-4 w-4' /> New folder will be created inside: **{currentFolder.name}**
                        </div>

                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={!folderName.trim()}>
                            <FolderPlus className="h-4 w-4" /> Create Folder
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// 2. New File Upload Modal
const UploadModal = ({ isOpen, onClose, currentFolder, onFileCreate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [accessLevel, setAccessLevel] = useState('Restricted');
    const [documentType, setDocumentType] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            setDocumentName(file.name);
            setDocumentType(getFileExtension(file.name));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile || !documentName.trim()) return;

        const newFile = {
            id: generateNewFileId(),
            name: documentName.trim(),
            type: getFileExtension(documentName) || documentType,
            size: selectedFile.size.toString(),
            date: getCurrentDateString(),
            version: '1.0',
            url: '#', // Placeholder URL
            access: accessLevel,
            versions: [{ version: '1.0', date: getCurrentDateString(), uploader: 'Current User' }],
        };

        onFileCreate(newFile);
        setSelectedFile(null);
        setDocumentName('');
        setAccessLevel('Restricted');
        setDocumentType('');
        onClose();
    };

    return (
        <Dialog>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle><Upload className='h-6 w-6 text-indigo-600 inline-block mr-2' /> Upload New Document</DialogTitle>
                    <Button onClick={onClose} variant="ghost" className="p-1.5"><X className="h-5 w-5" /></Button>
                </DialogHeader>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        
                        {/* 1. File Selection */}
                        <div className='space-y-2'>
                            <label className="text-sm font-semibold text-slate-700 block">Select File <span className="text-red-500">*</span></label>
                            <Input 
                                type="file" 
                                onChange={handleFileChange} 
                                required 
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.zip"
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>

                        {selectedFile && (
                            <>
                                {/* 2. Document Name */}
                                <div className='space-y-2'>
                                    <label className="text-sm font-semibold text-slate-700 block">Document Name</label>
                                    <Input 
                                        value={documentName} 
                                        onChange={(e) => setDocumentName(e.target.value)} 
                                        placeholder="Enter document title" 
                                        required
                                    />
                                </div>

                                {/* 3. Access Level */}
                                <div className='space-y-2'>
                                    <label className="text-sm font-semibold text-slate-700 block">Access Level</label>
                                    <Select value={accessLevel} onValueChange={setAccessLevel}>
                                        <SelectItem value="Public">Public</SelectItem>
                                        <SelectItem value="Restricted">Restricted</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </Select>
                                </div>
                            </>
                        )}
                        
                        <div className='p-3 bg-indigo-50 border border-indigo-200 rounded-md text-xs font-medium text-indigo-800 flex items-center gap-2'>
                            <Folder className='h-4 w-4' /> File will be uploaded to: **{currentFolder.name}**
                        </div>

                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={!selectedFile || !documentName.trim()}>
                            <Upload className="h-4 w-4" /> Complete Upload
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// --- File Details Panel Component ---
const FileDetailsPanel = ({ file, isDetailsOpen, closeDetails }) => {
    if (!isDetailsOpen || !file) return null;

    const Icon = FILE_ICONS[file.type] || FILE_ICONS.default;

    const DetailItem = ({ label, value, icon: IconComponent }) => (
        <div className="flex items-start py-3 border-b border-slate-100">
            {IconComponent && <IconComponent className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />}
            <div>
                <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
                <div className="text-base text-slate-800 font-medium">{value}</div>
            </div>
        </div>
    );

    return (
        <div className={`bg-white rounded-lg shadow-2xl border-l border-slate-200 fixed right-0 top-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${isDetailsOpen ? 'translate-x-0' : 'translate-x-full'} w-96`}>
            <div className="flex flex-col h-full">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FileArchive className='h-6 w-6 text-indigo-600' /> Document Details
                    </h3>
                    <Button onClick={closeDetails} variant='ghost' className="p-1.5"><X className="h-5 w-5" /></Button>
                </div>

                {/* Main Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-200">
                        <div className="p-3 bg-indigo-100 rounded-lg">{Icon}</div>
                        <h4 className="text-xl font-bold text-slate-900 leading-snug">{file.name}</h4>
                    </div>

                    <div className="space-y-1">
                        <DetailItem label="Document Type" value={file.type.toUpperCase() + ' File'} icon={FileText} />
                        <DetailItem label="Current Version" value={`v${file.version}`} icon={List} />
                        <DetailItem label="Size" value={formatFileSize(parseInt(file.size))} icon={HardDrive} />
                        <DetailItem label="Date Modified" value={file.date} icon={Calendar} />
                        <DetailItem label="Access Level" value={file.access} icon={Shield} />
                    </div>

                    <h5 className="text-md font-bold text-slate-700 mt-6 pt-6 border-t border-slate-100">Actions</h5>
                    <div className="mt-3 space-y-3">
                        <a href={file.url} download={file.name} className="w-full">
                            <Button variant="primary" className="w-full">
                                <Download className="h-4 w-4" /> Download Current Version
                            </Button>
                        </a>
                        <Button variant="secondary" className="w-full">
                            <Upload className="h-4 w-4" /> Upload New Version
                        </Button>
                        <Button variant="ghost" className="w-full text-indigo-600 hover:bg-indigo-50">
                            <History className="h-4 w-4" /> View Version History ({file.versions.length})
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- File Row Component (List View) ---
const FileRow = React.memo(({ file, onFolderClick, onFileClick, userRole }) => {
    const isFolder = file.type === 'folder';
    const hasAccess = USER_ROLES[userRole].includes(file.access) || isFolder;

    if (!hasAccess) return null; 

    const fileExtension = file.type;
    const icon = isFolder ? FILE_ICONS.folder : (FILE_ICONS[fileExtension] || FILE_ICONS.default);

    const AccessBadge = ({ access }) => {
        let classes = 'px-3 py-1 text-xs rounded-full font-medium flex items-center gap-1';
        let badgeIcon = <Shield className='h-3 w-3' />;
        switch (access) {
            case 'Admin': classes += ' bg-red-100 text-red-700'; badgeIcon = <Lock className='h-3 w-3' />; break;
            case 'Restricted': classes += ' bg-yellow-100 text-yellow-700'; badgeIcon = <Users className='h-3 w-3' />; break;
            case 'Public': classes += ' bg-green-100 text-green-700'; badgeIcon = <FileCheck2 className='h-3 w-3' />; break;
            default: classes += ' bg-slate-100 text-slate-600'; badgeIcon = <Lock className='h-3 w-3' />;
        }
        return <span className={classes}>{badgeIcon} {access}</span>;
    };

    return (
        <div className="grid grid-cols-12 gap-4 py-3 px-4 border-b border-slate-100 hover:bg-indigo-50/50 transition-colors group">
            
            <div 
                className="col-span-4 flex items-center gap-3 font-semibold text-slate-800 cursor-pointer" 
                onClick={() => isFolder ? onFolderClick(file) : onFileClick(file)}
            >
                {icon}
                <span className={`truncate ${isFolder ? 'text-indigo-700 font-bold' : 'text-slate-800'}`}>{file.name}</span>
            </div>
            
            <div className="col-span-2 text-sm text-slate-600 flex items-center">
                {isFolder ? <span className='text-slate-500'>Folder</span> : `v${file.version || '1.0'}`}
            </div>
            
            <div className="col-span-2 flex items-center">
                <AccessBadge access={file.access} />
            </div>
            
            <div className="col-span-2 text-sm text-slate-500 flex items-center">
                {isFolder ? `${file.children.length} items` : formatFileSize(parseInt(file.size))}
            </div>
            
            <div className="col-span-2 flex items-center justify-end gap-1">
                {!isFolder && (
                    <>
                        <a href={file.url} download={file.name} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors" title="Download File">
                            <Download className="h-4 w-4" />
                        </a>
                        <Button variant="ghost" className="p-2 text-slate-600 hover:bg-slate-200" title="View Details" onClick={() => onFileClick(file)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="p-2 text-red-500 hover:bg-red-100" title="Delete">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
});


// --- Grid Item Component (NEW) ---

const GridItem = React.memo(({ file, onFolderClick, onFileClick, userRole }) => {
    const isFolder = file.type === 'folder';
    const hasAccess = isFolder || USER_ROLES[userRole].includes(file.access);

    if (!hasAccess) return null; 

    const fileExtension = file.type;
    const icon = isFolder ? <Folder className="h-10 w-10 text-indigo-500 fill-indigo-100" /> : (FILE_ICONS[fileExtension] || FILE_ICONS.default);
    
    // Convert base icon size for display in the grid
    const DisplayIcon = React.cloneElement(icon, { 
        className: isFolder ? "h-10 w-10 text-indigo-500 fill-indigo-100" : "h-9 w-9",
    });

    const AccessBadge = ({ access }) => {
        let classes = 'px-2 py-0.5 text-xs rounded font-medium flex items-center gap-1';
        let badgeIcon = <Shield className='h-3 w-3' />;
        switch (access) {
            case 'Admin': classes += ' bg-red-100 text-red-700'; badgeIcon = <Lock className='h-3 w-3' />; break;
            case 'Restricted': classes += ' bg-yellow-100 text-yellow-700'; badgeIcon = <Users className='h-3 w-3' />; break;
            case 'Public': classes += ' bg-green-100 text-green-700'; badgeIcon = <FileCheck2 className='h-3 w-3' />; break;
            default: classes += ' bg-slate-100 text-slate-600'; badgeIcon = <Lock className='h-3 w-3' />;
        }
        return <span className={classes}>{badgeIcon} {access}</span>;
    };


    return (
        <div 
            className="flex flex-col items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-400 transition-all duration-200 cursor-pointer h-48"
            onClick={() => isFolder ? onFolderClick(file) : onFileClick(file)}
            title={file.name}
        >
            <div className="flex flex-col items-center justify-center flex-1 w-full">
                <div className="mb-2">
                    {DisplayIcon}
                </div>
                
                <h4 className="text-sm font-semibold text-slate-800 text-center w-full truncate px-2">{file.name}</h4>
                
                <div className="text-xs text-slate-500 mt-1 flex items-center">
                    {isFolder 
                        ? <><List className="h-3 w-3 mr-1" /> {file.children.length} items</>
                        : <><HardDrive className="h-3 w-3 mr-1" /> {formatFileSize(parseInt(file.size))}</>
                    }
                </div>
            </div>

            <div className='flex justify-between items-end w-full pt-2 border-t border-slate-100 mt-2'>
                <AccessBadge access={file.access} />
                {!isFolder && (
                    <div className='text-xs text-slate-600 font-medium'>v{file.version || '1.0'}</div>
                )}
            </div>

        </div>
    );
});


// --- Filter Panel Component ---
const FilterPanel = ({ filters, setFilters, fileTypes, isFiltersOpen, toggleFilters }) => {
    const AccessBadge = ({ access }) => {
        let classes = 'px-3 py-1 text-xs rounded-full font-medium flex items-center gap-1';
        switch (access) {
            case 'Admin': classes += ' bg-red-100 text-red-700'; break;
            case 'Restricted': classes += ' bg-yellow-100 text-yellow-700'; break;
            case 'Public': classes += ' bg-green-100 text-green-700'; break;
        }
        return <span className={classes}>{access}</span>;
    };

    return (
        <div className={`bg-white p-6 rounded-lg shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden ${isFiltersOpen ? 'w-72' : 'w-0 p-0'} `}>
            {isFiltersOpen && ( 
                <div className='h-full flex flex-col'>
                    <div className='flex justify-between items-center mb-6'>
                        <h3 className='text-lg font-bold text-slate-800 flex items-center gap-2'><Filter className='h-5 w-5 text-indigo-600' /> Document Filters</h3>
                        <Button onClick={toggleFilters} variant='ghost' className="p-1.5"><X className="h-5 w-5" /></Button>
                    </div>

                    <div className='space-y-6 flex-1 overflow-y-auto pr-2'>
                        {/* File Type Filter */}
                        <div className='space-y-2'>
                            <label className='text-sm font-semibold text-slate-700 block'>File Type</label>
                            <Select value={filters.fileType} onValueChange={(v) => setFilters(prev => ({ ...prev, fileType: v }))} placeholder="All File Types">
                                <SelectItem value="">All File Types</SelectItem>
                                {fileTypes.map(type => <SelectItem key={type} value={type}>{type.toUpperCase()} Files</SelectItem>)}
                            </Select>
                        </div>

                        {/* Access Level Filter */}
                        <div className='space-y-2'>
                            <label className='text-sm font-semibold text-slate-700 block'>Access Level</label>
                            <div className='space-y-2'>
                                {['Public', 'Restricted', 'Admin'].map(level => (
                                    <div key={`access-${level}`} className='flex items-center gap-3'>
                                        <input
                                            type="radio"
                                            id={`access-${level}`}
                                            name="access-level"
                                            value={level}
                                            checked={filters.accessLevel === level}
                                            onChange={(e) => setFilters(prev => ({ ...prev, accessLevel: e.target.value }))}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`access-${level}`} className='text-sm text-slate-700'>
                                            <AccessBadge access={level} />
                                        </label>
                                    </div>
                                ))}
                                <Button variant="link" onClick={() => setFilters(prev => ({ ...prev, accessLevel: '' }))} className="text-red-500 text-xs">Clear Access Filter</Button>
                            </div>
                        </div>

                        {/* Date Range Filter */}
                        <div className='space-y-2'>
                            <label className='text-sm font-semibold text-slate-700 block'>Date Modified Range</label>
                            <Input 
                                type="date" 
                                value={filters.dateStart} 
                                onChange={(e) => setFilters(prev => ({ ...prev, dateStart: e.target.value }))} 
                                className="text-sm"
                                placeholder="Start Date"
                            />
                            <Input 
                                type="date" 
                                value={filters.dateEnd} 
                                onChange={(e) => setFilters(prev => ({ ...prev, dateEnd: e.target.value }))} 
                                className="text-sm"
                                placeholder="End Date"
                            />
                        </div>
                    </div>

                    <div className='pt-6'>
                        <Button variant="secondary" className='w-full' onClick={() => setFilters({ fileType: '', accessLevel: '', dateStart: '', dateEnd: '' })}>
                            <X className='h-4 w-4' /> Clear All Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- MAIN COMPONENT ---
export default function MineDCS() {
    const [fileSystem, setFileSystem] = useState(initialFileSystem); 
    const [currentFolder, setCurrentFolder] = useState(initialFileSystem.children[0]);
    const [path, setPath] = useState([initialFileSystem, initialFileSystem.children[0]]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [sortBy, setSortBy] = useState('name-asc');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    
    // Role Simulation & File Details
    const [userRole, setUserRole] = useState('Admin'); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false); 

    // Modal States
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        fileType: '',
        accessLevel: '',
        dateStart: '',
        dateEnd: '',
    });

    // Recursive function to filter the folder structure based on user role
    const filterFolderByAccess = useCallback((node) => {
        if (!node) return null; 

        if (node.type !== 'folder') {
            return USER_ROLES[userRole].includes(node.access) ? node : null;
        }

        const filteredChildren = (node.children || [])
            .map(child => filterFolderByAccess(child))
            .filter(child => child !== null);
        
        if (filteredChildren.length > 0 || USER_ROLES[userRole].includes(node.access)) {
            return { ...node, children: filteredChildren };
        }
        return null;

    }, [userRole]);

    const navigableFileSystem = useMemo(() => filterFolderByAccess(fileSystem), [fileSystem, filterFolderByAccess]);

    const handleFolderClick = useCallback((folder) => {
        
        const fullFolder = findFolderById(fileSystem, folder.id); 
        const accessibleFolder = filterFolderByAccess(fullFolder);


        if (!accessibleFolder || accessibleFolder.type !== 'folder') return;
        
        const existingIndex = path.findIndex(p => p.id === folder.id);
        
        let newPath;
        if (existingIndex !== -1) {
            newPath = path.slice(0, existingIndex + 1);
        } else {
            const isMainDepartment = fileSystem.children.some(d => d.id === folder.id);
            if (isMainDepartment) {
                 newPath = [fileSystem, accessibleFolder];
            } else {
                newPath = [...path, accessibleFolder];
            }
        }

        const filteredPath = newPath.map(f => filterFolderByAccess(f)).filter(f => f !== null);

        setPath(filteredPath);
        setCurrentFolder(accessibleFolder);
        setSearchTerm('');
        setFilters({ fileType: '', accessLevel: '', dateStart: '', dateEnd: '' });
        setIsDetailsOpen(false); 
    }, [fileSystem, path, filterFolderByAccess]);

    const handleBreadcrumbClick = (index) => {
        const targetFolder = path[index];
        setPath(path.slice(0, index + 1));
        setCurrentFolder(targetFolder);
        setIsDetailsOpen(false);
    };

    // Helper to update both fileSystem and currentFolder states
    const updateCurrentFolderState = (newItem) => {
        // 1. Update the entire file system tree (persisting new item)
        setFileSystem(prevSystem => {
            return updateFileSystem(prevSystem, path, newItem);
        });

        // 2. Update the current displayed folder immediately (ensuring new item is shown)
        setCurrentFolder(prevFolder => {
            return {
                ...prevFolder,
                children: [newItem, ...prevFolder.children]
            };
        });
    };

    const handleFolderCreate = (newFolder) => {
        updateCurrentFolderState(newFolder);
    };

    const handleFileCreate = (newFile) => {
        updateCurrentFolderState(newFile);
    };

    const handleFileClick = (file) => {
        setSelectedFile(file);
        setIsDetailsOpen(true);
    };

    const allFileTypes = useMemo(() => {
        const types = new Set();
        const gatherTypes = (root) => {
            root.children?.forEach(item => {
                if (item.type !== 'folder') {
                    types.add(item.type);
                } else {
                    gatherTypes(item);
                }
            });
        };
        gatherTypes(fileSystem);
        return Array.from(types);
    }, [fileSystem]);

    // Apply Filters and Sorting
    const filteredAndSortedContent = useMemo(() => {
        
        const accessibleChildren = (currentFolder.children || [])
            .map(item => item.type === 'folder' ? filterFolderByAccess(item) : item) 
            .filter(item => item !== null && (item.type === 'folder' || USER_ROLES[userRole].includes(item.access)));

        let items = accessibleChildren
            // 1. Search Filter
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            
            // 2. Access Level Filter 
            .filter(item => !filters.accessLevel || item.type === 'folder' || item.access === filters.accessLevel)

            // 3. File Type Filter
            .filter(item => !filters.fileType || item.type === 'folder' || item.type === filters.fileType)

            // 4. Date Range Filter
            .filter(item => {
                if (item.type === 'folder') return true;
                const fileDate = new Date(item.date).getTime();
                const startDate = filters.dateStart ? new Date(filters.dateStart).getTime() : 0;
                const endDate = filters.dateEnd ? new Date(filters.dateEnd).getTime() : Infinity;

                return fileDate >= startDate && fileDate <= endDate;
            });

        // Separate folders and files for sorting
        const folders = items.filter(item => item.type === 'folder');
        const files = items.filter(item => item.type !== 'folder');

        // Apply file sorting 
        files.sort((a, b) => {
            const [key, direction] = sortBy.split('-');
            const asc = direction === 'asc';
            let aValue, bValue;

            switch (key) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    return asc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                case 'date':
                    aValue = new Date(a.date).getTime();
                    bValue = new Date(b.date).getTime();
                    return asc ? aValue - bValue : bValue - aValue;
                case 'size':
                    aValue = parseInt(a.size);
                    bValue = parseInt(b.size);
                    return asc ? aValue - bValue : bValue - aValue;
                default:
                    return 0;
            }
        });

        // Folders always come first, sorted by name
        folders.sort((a, b) => a.name.localeCompare(b.name));

        return [...folders, ...files];
    }, [currentFolder, searchTerm, sortBy, filters, userRole, filterFolderByAccess]);

    const getSortIcon = (key) => {
        const [sortKey, sortDirection] = sortBy.split('-');
        if (sortKey !== key) return <ChevronDown className="h-4 w-4 text-slate-400" />;
        return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };


    return (
        <div className="h-screen flex bg-slate-100 relative">
            
            {/* --- Left Sidebar: Navigation --- */}
            <div className="w-72 flex flex-col space-y-6 pt-8 pb-8 pl-8"> 
                <div className="bg-white p-6 rounded-lg shadow-xl border border-slate-200 h-full overflow-y-auto text-slate-800 flex flex-col">
                    
                    {/* Header */}
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Gem className="h-6 w-6 text-indigo-600" /> Mine DCS
                    </h2>
                    
                    {/* Role Selector */}
                    <div className="mb-4 pb-4 border-b border-slate-200">
                        <div className="text-xs font-semibold uppercase text-slate-500 mb-1 flex items-center gap-1">
                            <UserCheck className='h-3 w-3' /> Simulate User Role
                        </div>
                        <Select value={userRole} onValueChange={(role) => {
                            setUserRole(role);
                            // Reset to a safe starting department (Geology) on role change
                            handleFolderClick(initialFileSystem.children[0]);
                        }}>
                            {Object.keys(USER_ROLES).map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                        </Select>
                        <div className='text-xs text-slate-500 mt-1'>Access: **{USER_ROLES[userRole].join(', ')}**</div>
                    </div>

                    {/* Actions */}
                    <Button variant="primary" className="w-full mb-2 py-3" onClick={() => setIsUploadModalOpen(true)}>
                        <Upload className="h-5 w-5" /> Upload New Document
                    </Button>
                    
                    <Button 
                        variant="secondary" 
                        className="w-full mb-4 py-3 text-indigo-700 border-indigo-300 hover:bg-indigo-100" 
                        onClick={() => setIsFolderModalOpen(true)}
                    >
                        <FolderPlus className="h-5 w-5" /> Create New Folder
                    </Button>
                    
                    {/* Navigation Tree */}
                    <nav className="space-y-1 pt-4 border-t border-slate-200 flex-1 overflow-y-auto">
                        <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Departments</div>
                        {navigableFileSystem.children.map(folder => (
                            <div 
                                key={folder.id}
                                onClick={() => handleFolderClick(folder)}
                                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors 
                                    ${path.length > 1 && path[1].id === folder.id ? 'bg-indigo-50 text-indigo-800 font-semibold border-l-4 border-indigo-600' : 'text-slate-700 hover:bg-slate-100'}`}
                            >
                                {folder.icon || FILE_ICONS.folder}
                                <span className='flex-1 truncate'>{folder.name}</span>
                                <ChevronRight className={`h-4 w-4 ${path.length > 1 && path[1].id === folder.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* --- Main Content Area: Filter, Search, & Files --- */}
            <div className={`flex-1 flex gap-6 overflow-y-auto pt-8 pr-8 pb-8 transition-all duration-300 ${isFiltersOpen ? '' : 'flex-row-reverse'}`}>
                
                {/* 1. Main Content Panel */}
                <div className="flex-1 bg-white rounded-lg shadow-xl border border-slate-200 h-fit min-h-full">
                    
                    {/* Header & Actions */}
                    <div className="p-6 sticky top-0 bg-white z-10 shadow-sm rounded-t-lg">
                        <div className='flex justify-between items-center mb-4'>
                            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                                <Folder className='h-6 w-6 text-indigo-600' />
                                {currentFolder.name}
                                <span className="text-sm font-medium text-slate-500">({filteredAndSortedContent.length} items)</span>
                            </h1>
                            <Button 
                                variant="secondary" 
                                className='text-indigo-600 border-indigo-300 hover:bg-indigo-50' 
                                onClick={() => setIsFiltersOpen(prev => !prev)}
                            >
                                {isFiltersOpen ? <ChevronLeft className='h-4 w-4' /> : <Filter className='h-4 w-4' />} 
                                {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                        </div>
                        
                        {/* Breadcrumb Navigation */}
                        <nav className="flex items-center text-sm mb-4 border-b pb-4 border-slate-100">
                            {path.map((folder, index) => (
                                <React.Fragment key={folder.id}>
                                    <Button 
                                        variant="link"
                                        className={`cursor-pointer ${index === path.length - 1 ? 'font-bold text-indigo-700' : 'text-slate-500 hover:text-indigo-500'}`}
                                        onClick={() => handleBreadcrumbClick(index)}
                                    >
                                        {folder.name === 'Gold Mine DCS Root' ? 'DCS Root' : folder.name}
                                    </Button>
                                    <ChevronRight className="h-4 w-4 text-slate-400 mx-1" />
                                </React.Fragment>
                            ))}
                        </nav>

                        {/* Search, Sort & Toolbar */}
                        <div className="flex justify-between items-center gap-4">
                            <div className="relative flex-1 max-w-lg">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder={`Search documents in ${currentFolder.name}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4"
                                />
                            </div>
                            
                            <div className="flex gap-3 items-center">
                                {/* Sorting Control */}
                                <Select 
                                    value={sortBy} 
                                    onValueChange={setSortBy} 
                                    placeholder="Sort By..." 
                                    className="w-40"
                                >
                                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                                    <SelectItem value="size-desc">Size (Largest)</SelectItem>
                                </Select>

                                {/* View Toggle (Updated with Icons and Polished Aesthetic) */}
                                <div className="flex items-center space-x-0.5 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                                    <Button 
                                        onClick={() => setViewMode('list')} 
                                        variant={'ghost'} 
                                        className={`px-3 py-1.5 h-9 font-semibold ${viewMode === 'list' 
                                            ? 'text-indigo-700 bg-white shadow-md' // Active style
                                            : 'text-slate-500 hover:bg-slate-200'}`} // Inactive style
                                        title="List View"
                                    >
                                        <LayoutList className="h-4 w-4 mr-1" /> List View 
                                    </Button>
                                    <Button 
                                        onClick={() => setViewMode('grid')} 
                                        variant={'ghost'} 
                                        className={`px-3 py-1.5 h-9 font-semibold ${viewMode === 'grid' 
                                            ? 'text-indigo-700 bg-white shadow-md' // Active style
                                            : 'text-slate-500 hover:bg-slate-200'}`} // Inactive style
                                        title="Grid View"
                                    >
                                        <LayoutGrid className="h-4 w-4 mr-1" /> Grid View 
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* File List/Grid */}
                    <div className="px-6 pb-6">
                        {viewMode === 'list' && (
                            <>
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 py-3 px-4 text-xs font-bold uppercase text-slate-600 border-y border-slate-200 bg-slate-50/50">
                                    <div className="col-span-4 cursor-pointer flex items-center" onClick={() => setSortBy(sortBy === 'name-asc' ? 'name-desc' : 'name-asc')}>
                                        Document Name {getSortIcon('name')}
                                    </div>
                                    <div className="col-span-2">Version</div>
                                    <div className="col-span-2">Access</div>
                                    <div className="col-span-2 cursor-pointer flex items-center" onClick={() => setSortBy(sortBy.startsWith('size') ? (sortBy === 'size-asc' ? 'size-desc' : 'size-asc') : 'size-desc')}>
                                        Size / Modified {getSortIcon('size')}
                                    </div>
                                    <div className="col-span-2 text-right">Actions</div>
                                </div>

                                {/* File Rows */}
                                <div className="divide-y divide-slate-100">
                                    {filteredAndSortedContent.map(item => 
                                        <FileRow 
                                            key={item.id} 
                                            file={item} 
                                            onFolderClick={handleFolderClick}
                                            onFileClick={handleFileClick}
                                            userRole={userRole}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {/* Grid View Implemented */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4">
                                {filteredAndSortedContent.map(item => (
                                    <GridItem
                                        key={item.id}
                                        file={item}
                                        onFolderClick={handleFolderClick}
                                        onFileClick={handleFileClick}
                                        userRole={userRole}
                                    />
                                ))}
                            </div>
                        )}

                        {filteredAndSortedContent.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <Archive className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                                <p className='text-lg font-semibold'>No documents found matching the criteria.</p>
                                <p className='text-sm'>Try adjusting the search term or filters or ensure your current **{userRole}** role has access.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Filter Panel */}
                <FilterPanel 
                    filters={filters}
                    setFilters={setFilters}
                    fileTypes={allFileTypes}
                    isFiltersOpen={isFiltersOpen}
                    toggleFilters={() => setIsFiltersOpen(prev => !prev)}
                />
            </div>

            {/* --- Modals and Panels --- */}
            <FolderModal
                isOpen={isFolderModalOpen}
                onClose={() => setIsFolderModalOpen(false)}
                currentFolder={currentFolder}
                onFolderCreate={handleFolderCreate}
            />
            
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                currentFolder={currentFolder}
                onFileCreate={handleFileCreate}
            />

            <FileDetailsPanel
                file={selectedFile}
                isDetailsOpen={isDetailsOpen}
                closeDetails={() => setIsDetailsOpen(false)} 
            />
        </div>
    );
}