"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  AlertCircle, CheckCircle, Clock, Download, Edit, Filter, 
  HardHat, Loader2, Plus, RefreshCw, Search, Trash2, 
  TrendingUp, Wrench, X, BarChart3, Calendar, Factory,
  AlertTriangle, CheckSquare, Clock4, DollarSign, MapPin,
  Package, Shield, ToolCase, User, Zap, ChevronDown, ChevronUp,
  ArrowUpRight, Eye, FileText, MoreVertical, Printer, Share2,
  TrendingDown, Users, CalendarDays, FileSpreadsheet, Activity,
  Grid, List, FileDown, PieChart, LineChart, TrendingUpIcon,
  DownloadCloud, ExternalLink, Calendar as CalendarIcon, 
  Target, Award, Briefcase, Database, Smartphone,
  Layers, Clock1, Clock2, Clock3, Clock5, Clock6,
  Clock7, Clock8, Clock9, Clock10, Clock11, Clock12,
  Timer, TimerOff, TimerReset, Watch, BarChart2,
  FileBarChart, FileBox, FileCheck, FileCode, FileDigit,
  FileEdit, FileInput, FileOutput, FilePieChart, FileSearch,
  FileSpreadsheet as FileSpreadsheetIcon, FileStack, FileText as FileTextIcon,
  FileType, FileVideo, FileX, FileX2, FolderOpen, FolderPlus,
  Grid3x3, LayoutGrid, LayoutList, ListChecks, ListFilter,
  ListOrdered, ListPlus, ListTodo, ListTree, ListVideo,
  Maximize2, Minimize2, MoreHorizontal, Package2, PackageCheck,
  PackageMinus, PackageOpen, PackagePlus, PackageSearch, PackageX,
  PieChart as PieChartIcon, QrCode, Radar, Settings,
  Star, StarHalf, ThumbsUp, ThumbsDown, TrendingDown as TrendingDownIcon,
  Upload, UploadCloud, UserCheck, UserCog, UserMinus,
  UserPlus, UserX, Users2, Video, VideoOff, Wallet,
  Wifi, WifiOff, Wind, Workflow, ZapOff, ZoomIn,
  ZoomOut, Battery, BatteryCharging, BatteryFull, BatteryLow,
  BatteryMedium, BatteryWarning, Bell, BellDot, BellOff,
  BellRing, BookOpen, Bookmark, Bot, Box, Boxes,
  Brain, BriefcaseBusiness, Building, Building2, Calculator,
  Camera, CameraOff, Car, CarTaxiFront, ChartBar,
  ChartBarBig, ChartCandlestick, ChartColumn, ChartColumnIncreasing,
  ChartLine, ChartNetwork, ChartNoAxesColumn, ChartPie, ChartScatter,
  Check, CheckCheck, Circle, CircleAlert, CircleCheck,
  CircleDashed, CircleDollarSign, CircleEllipsis, CircleEqual,
  CircleFadingPlus, CircleHelp, CircleMinus, CircleOff,
  CircleParking, CircleParkingOff, CirclePercent, CirclePlay,
  CirclePower, CircleSlash, CircleSlash2, CircleStop, CircleUser,
  CircleX, Cloud, CloudDownload, CloudOff, CloudUpload,
  Code, Code2, Cog, Command, Compass, Computer,
  Copy, CreditCard, Crop, Crosshair, Crown, DatabaseBackup,
  DatabaseZap, Delete, Diamond, Dice1, Dice2,
  Dice3, Dice4, Dice5, Dice6, Disc, Disc2,
  Disc3, Divide, Dog, DollarSign as DollarSignIcon,
  Download as DownloadIcon, Droplet, Droplets, Dumbbell,
  Ear, EarOff, Earth, Egg, EggFried, Ellipsis,
  Equal, EqualNot, Eraser, Euro, Expand, EyeOff,
  Facebook, FastForward, Feather, FerrisWheel, Figma,
  File, FileArchive, FileAudio, FileAxis3d, FileBadge,
  FileBadge2, FileBarChart2, FileBox as FileBoxIcon,
  FileChartColumnIncreasing, FileChartLine, FileChartPie,
  FileChartColumn, FileCheck2, FileCode2, FileCog,
  FileDiff, FileDigit2, FileDown as FileDownIcon,
  FileHeart, FileImage, FileKey, FileKey2, FileLock,
  FileMinus, FileMinus2, FileMusic, FileQuestion,
  FileScan, FileSliders, FileSymlink, FileTerminal,
  FileUp, FileUser, FileWarning, FileX as FileXIcon,
  Files, Film, Filter as FilterIcon, FilterX,
  Fingerprint, Flag, FlagTriangleLeft, FlagTriangleRight,
  Flame, Flashlight, FlashlightOff, FlaskConical,
  FlaskRound, Folder, FolderArchive, FolderCheck,
  FolderClock, FolderClosed, FolderCog, FolderDot,
  FolderDown, FolderEdit, FolderGit, FolderGit2,
  FolderHeart, FolderInput, FolderKanban, FolderKey,
  FolderLock, FolderMinus, FolderOpen as FolderOpenIcon,
  FolderOutput, FolderPlus as FolderPlusIcon, FolderRoot,
  FolderSearch, FolderSymlink, FolderTree, FolderUp,
  FolderX, Footprints, Forklift, Forward, Framer,
  Frown, Fuel, FunctionSquare, Gamepad, Gamepad2,
  Gauge, Gavel, Gem, Ghost, Gift, GitBranch,
  GitCommit, GitCompare, GitFork, GitMerge, GitPullRequest,
  Github, Gitlab, GlassWater, Globe, Globe2,
  Grab, GraduationCap, Grape, Grid2x2, Grid2x2Check,
  Grip, GripHorizontal, GripVertical, Hammer, Hand,
  HandMetal, Hash, Haze, Headphones, Heart,
  HeartCrack, HeartHandshake, HeartOff, HeartPulse,
  HelpCircle, Hexagon, Highlighter, Home, Hop,
  HopOff, Hotel, Hourglass, IceCream, IceCream2,
  Image, ImageOff, Inbox, Indent, Infinity,
  Info, InspectionPanel, Instagram, Italic, IterationCcw,
  IterationCw, JapaneseYen, Joystick, Key, KeyRound,
  Keyboard, KeyboardOff, Lamp, LampCeiling, LampDesk,
  LampFloor, LampWallDown, LampWallUp, Landmark, Languages,
  Laptop, Laptop2, Lasso, LassoSelect, Laugh,
  Layers2, Layers3, Layout, LayoutDashboard, LayoutPanelLeft,
  LayoutPanelTop, LayoutTemplate, Leaf, LeafyGreen, Library,
  LifeBuoy, Lightbulb, LightbulbOff, Link, Link2,
  Link2Off, Linkedin, List as ListIcon, ListCollapse,
  ListEnd, ListMusic, ListRestart, ListStart, ListX,
  Loader, Locate, LocateFixed, LocateOff, Lock,
  LockKeyhole, LockOpen, LogIn, LogOut, Luggage,
  Magnet, Mail, MailCheck, MailMinus, MailOpen,
  MailPlus, MailQuestion, MailSearch, MailWarning, MailX,
  Map, MapPin as MapPinIcon, MapPinOff, Martini,
  Maximize, Megaphone, MegaphoneOff, Meh, MemoryStick,
  Menu, MenuSquare, MessageCircle, MessageSquare, Mic,
  Mic2, MicOff, Microscope, Microwave, Milestone,
  Milk, MilkOff, Minimize, Minus, MinusCircle,
  Monitor, MonitorCheck, MonitorDot, MonitorDown, MonitorOff,
  MonitorPause, MonitorPlay, MonitorSmartphone, MonitorSpeaker,
  MonitorStop, MonitorUp, MonitorX, Moon, MoonStar,
  MoreHorizontal as MoreHorizontalIcon, Mountain, MountainSnow,
  Mouse, MousePointer, MousePointer2, MousePointerClick,
  Move, Move3d, MoveDiagonal, MoveDiagonal2, MoveDown,
  MoveDownLeft, MoveDownRight, MoveHorizontal, MoveLeft,
  MoveRight, MoveUp, MoveUpLeft, MoveUpRight, MoveVertical,
  Music, Music2, Music3, Music4, Navigation,
  Navigation2, Network, Newspaper, Octagon, OctagonAlert,
  OctagonPause, OctagonX, Option, Orbit, PackageOpen as PackageOpenIcon,
  Paintbrush, Paintbrush2, Palette, PanelBottom, PanelBottomClose,
  PanelBottomInactive, PanelBottomOpen, PanelLeft, PanelLeftClose,
  PanelLeftInactive, PanelLeftOpen, PanelRight, PanelRightClose,
  PanelRightInactive, PanelRightOpen, PanelTop, PanelTopClose,
  PanelTopInactive, PanelTopOpen, Paperclip, Parentheses,
  ParkingCircle, ParkingCircleOff, ParkingSquare, ParkingSquareOff,
  PartyPopper, Pause, PauseCircle, PauseOctagon, Pen,
  PenLine, PenSquare, Pencil, PencilLine, PencilRuler,
  Pentagon, Percent, PersonStanding, Phone, PhoneCall,
  PhoneForwarded, PhoneIncoming, PhoneMissed, PhoneOff,
  PhoneOutgoing, Pi, PictureInPicture, PictureInPicture2,
  PieChart as PieChartIcon2, PiggyBank, Pilcrow, PilcrowSquare,
  Pill, Pin, PinOff, Pipette, Pizza,
  Plane, PlaneLanding, PlaneTakeoff, Play, PlayCircle,
  PlaySquare, Plug, Plug2, PlugZap, PlusCircle,
  PlusSquare, Pocket, PocketKnife, Podcast, Pointer,
  Popcorn, PoundSterling, Power, PowerOff, Presentation,
  Printer as PrinterIcon, Projector, Puzzle, QrCode as QrCodeIcon,
  Quote, Radiation, Radio, RadioReceiver, RadioTower,
  RectangleHorizontal, RectangleVertical, Recycle, Redo,
  Redo2, RedoDot, RefreshCcw as RefreshCcwIcon, RefreshCw as RefreshCwIcon,
  Refrigerator, Regex, RemoveFormatting, Repeat, Repeat1,
  Repeat2, Replace, ReplaceAll, Reply, ReplyAll,
  Rewind, Rocket, RockingChair, RollerCoaster, Rotate3d,
  RotateCcw, RotateCw, Router, Rows, Rss,
  Ruler, RussianRuble, Sailboat, Salad, Sandwich,
  Satellite, SatelliteDish, Save, Scale, Scale3d,
  Scaling, Scan, ScanBarcode, ScanEye, ScanFace,
  ScanLine, ScanQrCode, ScanSearch, ScanText, Scissors,
  ScreenShare, ScreenShareOff, Scroll, ScrollText, Search as SearchIcon,
  SearchCheck, SearchCode, SearchSlash, SearchX, Send,
  SendHorizontal, SendToBack, SeparatorHorizontal, SeparatorVertical,
  Server, ServerCog, ServerCrash, ServerOff, Settings as SettingsIcon,
  Shapes, Share, Share2 as Share2Icon, Sheet, Shield as ShieldIcon,
  ShieldAlert, ShieldBan, ShieldCheck, ShieldClose, ShieldEllipsis,
  ShieldHalf, ShieldMinus, ShieldOff, ShieldPlus, ShieldQuestion,
  ShieldX, Ship, ShipWheel, Shirt, ShoppingBag,
  ShoppingCart, Shovel, ShowerHead, Shrink, Shuffle,
  Sidebar, SidebarClose, SidebarOpen, Sigma, Signal,
  SignalHigh, SignalLow, SignalMedium, SignalZero, Siren,
  SkipBack, SkipForward, Skull, Slack, Slash,
  Slice, Sliders, SlidersHorizontal, Smartphone as SmartphoneIcon,
  SmartphoneCharging, SmartphoneNfc, Smile, SmilePlus, Snowflake,
  Sofa, Soup, Space, Speaker, SpeakerOff,
  SpellCheck, Spline, Split, SprayCan, Square,
  SquareActivity, SquareArrowDown, SquareArrowDownLeft, SquareArrowDownRight,
  SquareArrowLeft, SquareArrowOutDownLeft, SquareArrowOutDownRight, SquareArrowOutUpLeft,
  SquareArrowOutUpRight, SquareArrowRight, SquareArrowUp, SquareArrowUpLeft,
  SquareArrowUpRight, SquareAsterisk, SquareBottomDashedScissors, SquareChartGantt,
  SquareCheck, SquareCheckBig, SquareChevronDown, SquareChevronLeft,
  SquareChevronRight, SquareChevronUp, SquareCode, SquareDashed,
  SquareDashedBottom, SquareDashedBottomCode, SquareDivide, SquareDot,
  SquareEqual, SquareFunction, SquareGanttChart, SquareKanban,
  SquareLibrary, SquareM, SquareMenu, SquareMinus,
  SquareMousePointer, SquareParking, SquareParkingOff, SquarePen,
  SquarePercent, SquarePi, SquarePilcrow, SquarePlay,
  SquarePlus, SquarePower, SquareRadical, SquareScissors,
  SquareSigma, SquareSlash, SquareSplitHorizontal, SquareSplitVertical,
  SquareSquare, SquareStack, SquareTerminal, SquareUser,
  SquareUserRound, SquareX, Squircle, Stamp, Star as StarIcon,
  StarHalf as StarHalfIcon, StarOff, Stars, Stethoscope,
  Sticker, StickyNote, StopCircle, Store, StretchHorizontal,
  StretchVertical, Strikethrough, Subscript, Subtitles,
  Sun, SunDim, SunMedium, SunMoon, Sunrise,
  Sunset, Superscript, SwatchBook, SwissFranc, SwitchCamera,
  Sword, Swords, Syringe, Table, Table2,
  TableProperties, Tablet, TabletSmartphone, Tag as TagIcon,
  Tags, Tally1, Tally2, Tally3, Tally4,
  Tally5, Tangent, Target as TargetIcon, Telescope,
  Tent, Terminal, TestTube, TestTube2, Text,
  TextCursor, TextCursorInput, TextQuote, TextSearch,
  TextSelect, Thermometer, ThermometerSnowflake, ThermometerSun,
  ThumbsDown as ThumbsDownIcon, ThumbsUp as ThumbsUpIcon, Ticket, TicketCheck,
  TicketMinus, TicketPercent, TicketPlus, TicketSlash, TicketX,
  Timer as TimerIcon, TimerOff as TimerOffIcon, TimerReset as TimerResetIcon,
  ToggleLeft, ToggleRight, Tornado, Torus, Touchpad,
  TouchpadOff, TowerControl, ToyBrick, Tractor, TrafficCone,
  Train, TrainFront, TrainFrontTunnel, TramFront, Trash,
  TreeDeciduous, TreePine, Trees, Trello, TrendingUp as TrendingUpIcon2,
  Triangle, TriangleAlert, Trophy, Truck, Tv,
  Tv2, Twitch, Twitter, Type, Umbrella,
  Underline, Undo, Undo2, UndoDot, UnfoldHorizontal,
  UnfoldVertical, Ungroup, Unlink, Unlink2, Unlock,
  UnlockKeyhole, Upload as UploadIcon, UploadCloud as UploadCloudIcon,
  Usb, User as UserIcon, UserCheck as UserCheckIcon, UserCog as UserCogIcon,
  UserMinus as UserMinusIcon, UserPlus as UserPlusIcon, UserRound, UserRoundCheck,
  UserRoundCog, UserRoundMinus, UserRoundPlus, UserRoundSearch, UserRoundX,
  UserSearch, UserX as UserXIcon, Users as UsersIcon, Users2 as Users2Icon,
  Utensils, UtensilsCrossed, Variable, Vault, Vegan,
  VenetianMask, Verified, Vibrate, VibrateOff, Video as VideoIcon,
  VideoOff as VideoOffIcon, Videotape, View, Voicemail, Volume,
  Volume1, Volume2, VolumeX, Vote, Wallet as WalletIcon,
  WalletCards, Wallpaper, Wand, Wand2, Warehouse,
  Watch as WatchIcon, Waves, Waypoints, Webcam, Webhook,
  Weight, Wheat, WheatOff, WholeWord, Wifi as WifiIcon,
  WifiOff as WifiOffIcon, Wind as WindIcon, Wine, WineOff,
  Workflow as WorkflowIcon, Worm, WrapText, Wrench as WrenchIcon,
  X as XIcon, XCircle, XOctagon, XSquare, Youtube,
  Zap as ZapIcon, ZapOff as ZapOffIcon, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon
} from 'lucide-react';

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const BREAKDOWN_API = `${API_BASE}/api/breakdowns`;

// Configuration
const STATUS_TYPES = {
  logged: { name: 'Logged', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock, bgColor: 'bg-blue-50' },
  in_progress: { name: 'In Progress', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle, bgColor: 'bg-amber-50' },
  resolved: { name: 'Resolved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckSquare, bgColor: 'bg-emerald-50' },
  closed: { name: 'Closed', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: CheckCircle, bgColor: 'bg-slate-50' },
  cancelled: { name: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: X, bgColor: 'bg-rose-50' }
};

const PRIORITY_TYPES = {
  critical: { name: 'Critical', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: AlertCircle, bgColor: 'bg-rose-50' },
  high: { name: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle, bgColor: 'bg-orange-50' },
  medium: { name: 'Medium', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock, bgColor: 'bg-amber-50' },
  low: { name: 'Low', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock4, bgColor: 'bg-blue-50' }
};

const BREAKDOWN_TYPES = {
  mechanical: { name: 'Mechanical', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Wrench, bgColor: 'bg-slate-50' },
  electrical: { name: 'Electrical', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Zap, bgColor: 'bg-yellow-50' },
  hydraulic: { name: 'Hydraulic', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Activity, bgColor: 'bg-blue-50' },
  pneumatic: { name: 'Pneumatic', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Activity, bgColor: 'bg-indigo-50' },
  electronic: { name: 'Electronic', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Shield, bgColor: 'bg-purple-50' },
  other: { name: 'Other', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: ToolCase, bgColor: 'bg-gray-50' }
};

const DEPARTMENTS = ['Maintenance', 'Production', 'Engineering', 'Quality', 'Safety', 'Operations'];
const LOCATIONS = [
  'Production Line A', 'Production Line B', 'Warehouse', 'Workshop', 
  'Boiler Room', 'Compressor Room', 'Electrical Room', 'Yard'
];

// Time calculation utilities
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  } catch {
    return 0;
  }
};

const minutesToDisplay = (minutes) => {
  if (!minutes && minutes !== 0) return { minutes: 0, hours: 0, display: '0m', decimal: 0.0 };
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const decimal = parseFloat((minutes / 60).toFixed(2));
  
  let display = '';
  if (hours > 0) {
    display = `${hours}h ${mins}m`;
  } else {
    display = `${mins}m`;
  }
  
  return {
    minutes,
    hours,
    display,
    decimal
  };
};

const calculateTimeDurations = (times) => {
  const {
    breakdown_start,
    breakdown_end,
    work_start,
    work_end,
    delay_start,
    delay_end
  } = times;
  
  const bStart = timeToMinutes(breakdown_start);
  const bEnd = timeToMinutes(breakdown_end);
  const wStart = timeToMinutes(work_start);
  const wEnd = timeToMinutes(work_end);
  const dStart = timeToMinutes(delay_start);
  const dEnd = timeToMinutes(delay_end);
  
  // Calculate durations
  const responseTime = wStart > 0 && bStart > 0 ? Math.max(0, wStart - bStart) : 0;
  const repairTime = wStart > 0 && wEnd > 0 ? Math.max(0, wEnd - wStart) : 0;
  const delayTime = dStart > 0 && dEnd > 0 ? Math.max(0, dEnd - dStart) : 0;
  const downtime = bStart > 0 && bEnd > 0 ? Math.max(0, bEnd - bStart) : 0;
  const netDowntime = Math.max(0, downtime - delayTime);
  
  return {
    responseTime,
    repairTime,
    delayTime,
    downtime,
    netDowntime,
    responseTimeDisplay: minutesToDisplay(responseTime),
    repairTimeDisplay: minutesToDisplay(repairTime),
    delayTimeDisplay: minutesToDisplay(delayTime),
    downtimeDisplay: minutesToDisplay(downtime),
    netDowntimeDisplay: minutesToDisplay(netDowntime)
  };
};

// API Functions
const fetchBreakdowns = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.append(key, value);
    });

    const url = `${BREAKDOWN_API}?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching breakdowns:', error);
    throw error;
  }
};

const fetchDashboardMetrics = async () => {
  try {
    const response = await fetch(`${BREAKDOWN_API}/dashboard/overview`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return null;
  }
};

const fetchAdvancedStats = async (startDate, endDate, department) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (department && department !== 'all') params.append('department', department);
    
    const url = `${BREAKDOWN_API}/stats/advanced?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching advanced stats:', error);
    return null;
  }
};

const fetchTimeAnalysis = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const url = `${BREAKDOWN_API}/analytics/time-analysis?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching time analysis:', error);
    return null;
  }
};

const createBreakdown = async (breakdownData) => {
  try {
    console.log('Creating breakdown with data:', breakdownData);
    
    // Calculate time durations before sending
    const timeCalculations = calculateTimeDurations({
      breakdown_start: breakdownData.breakdown_start,
      breakdown_end: breakdownData.breakdown_end,
      work_start: breakdownData.work_start,
      work_end: breakdownData.work_end,
      delay_start: breakdownData.delay_start,
      delay_end: breakdownData.delay_end
    });
    
    // Add calculated fields to breakdown data
    const enhancedData = {
      ...breakdownData,
      response_time_minutes: timeCalculations.responseTime,
      repair_time_minutes: timeCalculations.repairTime,
      delay_time_minutes: timeCalculations.delayTime,
      downtime_minutes: timeCalculations.downtime,
      response_time_hours: timeCalculations.responseTimeDisplay.decimal,
      repair_time_hours: timeCalculations.repairTimeDisplay.decimal,
      delay_time_hours: timeCalculations.delayTimeDisplay.decimal,
      downtime_hours: timeCalculations.downtimeDisplay.decimal,
      net_downtime_minutes: timeCalculations.netDowntime,
      net_downtime_hours: timeCalculations.netDowntimeDisplay.decimal
    };
    
    const response = await fetch(BREAKDOWN_API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enhancedData)
    });
    
    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail += ` - ${errorData.detail || JSON.stringify(errorData)}`;
      } catch (e) {
        const errorText = await response.text();
        errorDetail += ` - ${errorText}`;
      }
      throw new Error(errorDetail);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating breakdown:', error);
    throw new Error(`Failed to create breakdown: ${error.message}`);
  }
};

const updateBreakdown = async (id, breakdownData) => {
  try {
    // Calculate time durations if time fields are provided
    if (breakdownData.breakdown_start || breakdownData.breakdown_end || 
        breakdownData.work_start || breakdownData.work_end ||
        breakdownData.delay_start || breakdownData.delay_end) {
      
      const timeCalculations = calculateTimeDurations({
        breakdown_start: breakdownData.breakdown_start,
        breakdown_end: breakdownData.breakdown_end,
        work_start: breakdownData.work_start,
        work_end: breakdownData.work_end,
        delay_start: breakdownData.delay_start,
        delay_end: breakdownData.delay_end
      });
      
      // Add calculated fields
      breakdownData = {
        ...breakdownData,
        response_time_minutes: timeCalculations.responseTime,
        repair_time_minutes: timeCalculations.repairTime,
        delay_time_minutes: timeCalculations.delayTime,
        downtime_minutes: timeCalculations.downtime,
        response_time_hours: timeCalculations.responseTimeDisplay.decimal,
        repair_time_hours: timeCalculations.repairTimeDisplay.decimal,
        delay_time_hours: timeCalculations.delayTimeDisplay.decimal,
        downtime_hours: timeCalculations.downtimeDisplay.decimal,
        net_downtime_minutes: timeCalculations.netDowntime,
        net_downtime_hours: timeCalculations.netDowntimeDisplay.decimal
      };
    }
    
    const response = await fetch(`${BREAKDOWN_API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(breakdownData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update breakdown');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating breakdown:', error);
    throw error;
  }
};

const deleteBreakdown = async (id) => {
  try {
    const response = await fetch(`${BREAKDOWN_API}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete breakdown');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting breakdown:', error);
    throw error;
  }
};

const exportBreakdownsCSV = async (startDate, endDate, status, breakdownType, department) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (status && status !== 'all') params.append('status', status);
    if (breakdownType && breakdownType !== 'all') params.append('breakdown_type', breakdownType);
    if (department && department !== 'all') params.append('department', department);
    
    const url = `${BREAKDOWN_API}/export/csv?${params.toString()}`;
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
};

// Components
const StatusBadge = ({ status }) => {
  const config = STATUS_TYPES[status] || STATUS_TYPES.logged;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.color} ${config.bgColor}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.name}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_TYPES[priority] || PRIORITY_TYPES.medium;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.color} ${config.bgColor}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.name}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const config = BREAKDOWN_TYPES[type] || BREAKDOWN_TYPES.other;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.color} ${config.bgColor}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.name}
    </span>
  );
};

const TimeDisplay = ({ minutes, label, showDecimal = true }) => {
  const display = minutesToDisplay(minutes || 0);
  
  return (
    <div className="flex flex-col">
      <span className="text-lg font-semibold text-slate-900">{display.display}</span>
      {showDecimal && (
        <span className="text-sm text-slate-600">{display.decimal.toFixed(2)} hours</span>
      )}
      <span className="text-xs text-slate-500 mt-1">{label}</span>
    </div>
  );
};

const MetricCard = ({ title, value, icon, change, color = "blue", subtitle }) => {
  const Icon = icon;
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    rose: 'from-rose-500 to-rose-600',
    amber: 'from-amber-500 to-amber-600',
    violet: 'from-violet-500 to-violet-600',
    orange: 'from-orange-500 to-orange-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5" />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium ${change > 0 ? 'text-emerald-600' : change < 0 ? 'text-rose-600' : 'text-slate-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-600 mt-1 font-medium">{title}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

const BreakdownGridCard = ({ breakdown, onEdit, onDelete, onView }) => {
  const timeCalculations = calculateTimeDurations({
    breakdown_start: breakdown.breakdown_start,
    breakdown_end: breakdown.breakdown_end,
    work_start: breakdown.work_start,
    work_end: breakdown.work_end,
    delay_start: breakdown.delay_start,
    delay_end: breakdown.delay_end
  });
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-all duration-200 hover:shadow-md group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
            {breakdown.machine_name}
          </h3>
          <p className="text-sm text-slate-600">{breakdown.machine_id}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={breakdown.status} />
          <PriorityBadge priority={breakdown.priority} />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm text-slate-700">{breakdown.artisan_name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm text-slate-700">
            {new Date(breakdown.date).toLocaleDateString()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <TimeDisplay 
            minutes={timeCalculations.downtime} 
            label="Downtime"
            showDecimal={false}
          />
          <TimeDisplay 
            minutes={timeCalculations.repairTime} 
            label="Repair Time"
            showDecimal={false}
          />
        </div>
        
        <div className="pt-2 border-t border-slate-100">
          <p className="text-sm text-slate-600 line-clamp-2">{breakdown.breakdown_description}</p>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => onView(breakdown)}
          className="flex-1 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center gap-1"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
        <button
          onClick={() => onEdit(breakdown)}
          className="flex-1 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-center gap-1"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
    </div>
  );
};

const BreakdownListItem = ({ breakdown, onEdit, onDelete, onView }) => {
  const [expanded, setExpanded] = useState(false);
  const timeCalculations = calculateTimeDurations({
    breakdown_start: breakdown.breakdown_start,
    breakdown_end: breakdown.breakdown_end,
    work_start: breakdown.work_start,
    work_end: breakdown.work_end,
    delay_start: breakdown.delay_start,
    delay_end: breakdown.delay_end
  });
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-slate-900 text-lg">{breakdown.machine_name}</h3>
            <div className="flex items-center gap-2">
              <StatusBadge status={breakdown.status} />
              <PriorityBadge priority={breakdown.priority} />
              <TypeBadge type={breakdown.breakdown_type} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-600 font-medium">Machine ID</p>
              <p className="font-semibold">{breakdown.machine_id}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Artisan</p>
              <p className="font-semibold">{breakdown.artisan_name}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Date</p>
              <p className="font-semibold">{new Date(breakdown.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Location</p>
              <p className="font-semibold">{breakdown.location}</p>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-slate-700 line-clamp-1">{breakdown.breakdown_description}</p>
          </div>
          
          <div className="grid grid-cols-4 gap-3 mt-3">
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">Response Time</p>
              <p className="font-bold text-slate-900">{timeCalculations.responseTimeDisplay.display}</p>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">Repair Time</p>
              <p className="font-bold text-slate-900">{timeCalculations.repairTimeDisplay.display}</p>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">Downtime</p>
              <p className="font-bold text-slate-900">{timeCalculations.downtimeDisplay.display}</p>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">Delay Time</p>
              <p className="font-bold text-slate-900">{timeCalculations.delayTimeDisplay.display}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-700 border border-slate-200"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onView(breakdown)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-500 hover:text-blue-700 border border-blue-200"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(breakdown)}
              className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-amber-500 hover:text-amber-700 border border-amber-200"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(breakdown.id)}
              className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-rose-500 hover:text-rose-700 border border-rose-200"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Work Details</h4>
              <p className="text-sm text-slate-600">{breakdown.work_done}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Recommendations</h4>
              <p className="text-sm text-slate-600">{breakdown.artisan_recommendations}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Spare Parts</h4>
              {breakdown.spares_used && breakdown.spares_used.length > 0 ? (
                <div className="space-y-2">
                  {breakdown.spares_used.map((spare, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{spare.name}</span>
                      <span className="font-semibold">× {spare.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No spare parts used</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BreakdownForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    artisan_name: initialData?.artisan_name || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    machine_id: initialData?.machine_id || '',
    machine_name: initialData?.machine_name || '',
    machine_description: initialData?.machine_description || '',
    location: initialData?.location || LOCATIONS[0],
    department: initialData?.department || DEPARTMENTS[0],
    breakdown_type: initialData?.breakdown_type || 'mechanical',
    breakdown_description: initialData?.breakdown_description || '',
    root_cause: initialData?.root_cause || '',
    immediate_cause: initialData?.immediate_cause || '',
    work_done: initialData?.work_done || '',
    
    // Time fields
    breakdown_start: initialData?.breakdown_start || '',
    breakdown_end: initialData?.breakdown_end || '',
    work_start: initialData?.work_start || '',
    work_end: initialData?.work_end || '',
    delay_start: initialData?.delay_start || '',
    delay_end: initialData?.delay_end || '',
    
    delay_reason: initialData?.delay_reason || '',
    spares_used: initialData?.spares_used || [],
    artisan_recommendations: initialData?.artisan_recommendations || '',
    foreman_comments: initialData?.foreman_comments || '',
    supervisor_comments: initialData?.supervisor_comments || '',
    status: initialData?.status || 'logged',
    priority: initialData?.priority || 'medium'
  });
  
  const [sparePart, setSparePart] = useState({
    name: '',
    quantity: 1,
    part_number: '',
    unit_price: 0,
    total_cost: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [timeCalculations, setTimeCalculations] = useState({
    responseTime: 0,
    repairTime: 0,
    delayTime: 0,
    downtime: 0,
    netDowntime: 0
  });
  
  // Recalculate time durations when time fields change
  useEffect(() => {
    const calculations = calculateTimeDurations({
      breakdown_start: formData.breakdown_start,
      breakdown_end: formData.breakdown_end,
      work_start: formData.work_start,
      work_end: formData.work_end,
      delay_start: formData.delay_start,
      delay_end: formData.delay_end
    });
    
    setTimeCalculations({
      responseTime: calculations.responseTime,
      repairTime: calculations.repairTime,
      delayTime: calculations.delayTime,
      downtime: calculations.downtime,
      netDowntime: calculations.netDowntime,
      responseTimeDisplay: calculations.responseTimeDisplay,
      repairTimeDisplay: calculations.repairTimeDisplay,
      delayTimeDisplay: calculations.delayTimeDisplay,
      downtimeDisplay: calculations.downtimeDisplay,
      netDowntimeDisplay: calculations.netDowntimeDisplay
    });
  }, [
    formData.breakdown_start,
    formData.breakdown_end,
    formData.work_start,
    formData.work_end,
    formData.delay_start,
    formData.delay_end
  ]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSparePartChange = (e) => {
    const { name, value } = e.target;
    const newSpare = { ...sparePart, [name]: value };
    
    // Calculate total cost if quantity or unit price changes
    if (name === 'quantity' || name === 'unit_price') {
      const quantity = name === 'quantity' ? parseInt(value) || 0 : sparePart.quantity;
      const unitPrice = name === 'unit_price' ? parseFloat(value) || 0 : sparePart.unit_price;
      newSpare.total_cost = quantity * unitPrice;
    }
    
    setSparePart(newSpare);
  };
  
  const addSparePart = () => {
    if (!sparePart.name.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      spares_used: [...prev.spares_used, { ...sparePart }]
    }));
    
    setSparePart({
      name: '',
      quantity: 1,
      part_number: '',
      unit_price: 0,
      total_cost: 0
    });
  };
  
  const removeSparePart = (index) => {
    setFormData(prev => ({
      ...prev,
      spares_used: prev.spares_used.filter((_, i) => i !== index)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.machine_id.trim()) newErrors.machine_id = 'Machine ID is required';
    if (!formData.machine_name.trim()) newErrors.machine_name = 'Machine name is required';
    if (!formData.artisan_name.trim()) newErrors.artisan_name = 'Artisan name is required';
    if (!formData.breakdown_description.trim()) newErrors.breakdown_description = 'Description is required';
    if (!formData.work_done.trim()) newErrors.work_done = 'Work done is required';
    
    // Validate time formats
    const timeFields = ['breakdown_start', 'breakdown_end', 'work_start', 'work_end', 'delay_start', 'delay_end'];
    timeFields.forEach(field => {
      const value = formData[field];
      if (value && value.trim()) {
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
          newErrors[field] = 'Time must be in HH:MM format (24-hour)';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl border border-blue-200">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {initialData ? 'Edit Breakdown' : 'Log New Breakdown'}
                </h2>
                <p className="text-sm text-slate-600">
                  {initialData ? 'Update breakdown details' : 'Report a new machine breakdown'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Time Calculations Preview */}
          {(formData.breakdown_start || formData.breakdown_end || formData.work_start || formData.work_end) && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-3">Time Calculations</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Response Time</p>
                  <p className="text-lg font-bold text-slate-900">{timeCalculations.responseTimeDisplay?.display || '0m'}</p>
                  <p className="text-xs text-slate-500">{timeCalculations.responseTimeDisplay?.decimal.toFixed(2)} hours</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Repair Time</p>
                  <p className="text-lg font-bold text-slate-900">{timeCalculations.repairTimeDisplay?.display || '0m'}</p>
                  <p className="text-xs text-slate-500">{timeCalculations.repairTimeDisplay?.decimal.toFixed(2)} hours</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Delay Time</p>
                  <p className="text-lg font-bold text-slate-900">{timeCalculations.delayTimeDisplay?.display || '0m'}</p>
                  <p className="text-xs text-slate-500">{timeCalculations.delayTimeDisplay?.decimal.toFixed(2)} hours</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Downtime</p>
                  <p className="text-lg font-bold text-slate-900">{timeCalculations.downtimeDisplay?.display || '0m'}</p>
                  <p className="text-xs text-slate-500">{timeCalculations.downtimeDisplay?.decimal.toFixed(2)} hours</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Net Downtime</p>
                  <p className="text-lg font-bold text-slate-900">{timeCalculations.netDowntimeDisplay?.display || '0m'}</p>
                  <p className="text-xs text-slate-500">{timeCalculations.netDowntimeDisplay?.decimal.toFixed(2)} hours</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Machine Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Machine ID *
                {errors.machine_id && <span className="text-rose-600 text-sm ml-2">{errors.machine_id}</span>}
              </label>
              <input
                type="text"
                name="machine_id"
                value={formData.machine_id}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.machine_id ? 'border-rose-300' : 'border-slate-300'}`}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Machine Name *
                {errors.machine_name && <span className="text-rose-600 text-sm ml-2">{errors.machine_name}</span>}
              </label>
              <input
                type="text"
                name="machine_name"
                value={formData.machine_name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.machine_name ? 'border-rose-300' : 'border-slate-300'}`}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Machine Description *</label>
              <textarea
                name="machine_description"
                value={formData.machine_description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                required
              />
            </div>
          </div>
          
          {/* Breakdown Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Artisan Name *
                {errors.artisan_name && <span className="text-rose-600 text-sm ml-2">{errors.artisan_name}</span>}
              </label>
              <input
                type="text"
                name="artisan_name"
                value={formData.artisan_name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.artisan_name ? 'border-rose-300' : 'border-slate-300'}`}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Breakdown Type</label>
              <select
                name="breakdown_type"
                value={formData.breakdown_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {Object.entries(BREAKDOWN_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {Object.entries(PRIORITY_TYPES).map(([key, priority]) => (
                  <option key={key} value={key}>{priority.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {LOCATIONS.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Breakdown Description *
                {errors.breakdown_description && <span className="text-rose-600 text-sm ml-2">{errors.breakdown_description}</span>}
              </label>
              <textarea
                name="breakdown_description"
                value={formData.breakdown_description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${errors.breakdown_description ? 'border-rose-300' : 'border-slate-300'}`}
                required
              />
            </div>
          </div>
          
          {/* Time Tracking */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Breakdown Start
                {errors.breakdown_start && <span className="text-rose-600 text-sm ml-1">{errors.breakdown_start}</span>}
              </label>
              <input
                type="time"
                name="breakdown_start"
                value={formData.breakdown_start}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.breakdown_start ? 'border-rose-300' : 'border-slate-300'}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Breakdown End
                {errors.breakdown_end && <span className="text-rose-600 text-sm ml-1">{errors.breakdown_end}</span>}
              </label>
              <input
                type="time"
                name="breakdown_end"
                value={formData.breakdown_end}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.breakdown_end ? 'border-rose-300' : 'border-slate-300'}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Work Start
                {errors.work_start && <span className="text-rose-600 text-sm ml-1">{errors.work_start}</span>}
              </label>
              <input
                type="time"
                name="work_start"
                value={formData.work_start}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.work_start ? 'border-rose-300' : 'border-slate-300'}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Work End
                {errors.work_end && <span className="text-rose-600 text-sm ml-1">{errors.work_end}</span>}
              </label>
              <input
                type="time"
                name="work_end"
                value={formData.work_end}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.work_end ? 'border-rose-300' : 'border-slate-300'}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Delay Start
                {errors.delay_start && <span className="text-rose-600 text-sm ml-1">{errors.delay_start}</span>}
              </label>
              <input
                type="time"
                name="delay_start"
                value={formData.delay_start}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.delay_start ? 'border-rose-300' : 'border-slate-300'}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Delay End
                {errors.delay_end && <span className="text-rose-600 text-sm ml-1">{errors.delay_end}</span>}
              </label>
              <input
                type="time"
                name="delay_end"
                value={formData.delay_end}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.delay_end ? 'border-rose-300' : 'border-slate-300'}`}
              />
            </div>
          </div>
          
          {/* Work Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Root Cause</label>
              <input
                type="text"
                name="root_cause"
                value={formData.root_cause}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Immediate Cause</label>
              <input
                type="text"
                name="immediate_cause"
                value={formData.immediate_cause}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Work Done *
                {errors.work_done && <span className="text-rose-600 text-sm ml-2">{errors.work_done}</span>}
              </label>
              <textarea
                name="work_done"
                value={formData.work_done}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${errors.work_done ? 'border-rose-300' : 'border-slate-300'}`}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Artisan Recommendations *</label>
              <textarea
                name="artisan_recommendations"
                value={formData.artisan_recommendations}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                required
              />
            </div>
          </div>
          
          {/* Spare Parts */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-700 mb-4">Spare Parts Used</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
              <input
                type="text"
                placeholder="Part Name"
                name="name"
                value={sparePart.name}
                onChange={handleSparePartChange}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Part Number"
                name="part_number"
                value={sparePart.part_number}
                onChange={handleSparePartChange}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Quantity"
                name="quantity"
                value={sparePart.quantity}
                onChange={handleSparePartChange}
                min="1"
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Unit Price"
                name="unit_price"
                value={sparePart.unit_price}
                onChange={handleSparePartChange}
                step="0.01"
                min="0"
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addSparePart}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Part
              </button>
            </div>
            
            {formData.spares_used.length > 0 && (
              <div className="space-y-2">
                {formData.spares_used.map((spare, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{spare.name}</span>
                      {spare.part_number && <span className="text-sm text-slate-600">#{spare.part_number}</span>}
                      <span className="text-sm text-slate-600">Qty: {spare.quantity}</span>
                      {spare.unit_price > 0 && (
                        <span className="text-sm text-slate-600">Price: ${spare.unit_price.toFixed(2)}</span>
                      )}
                      {spare.total_cost > 0 && (
                        <span className="text-sm font-medium text-emerald-600">Total: ${spare.total_cost.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSparePart(index)}
                      className="p-1 hover:bg-rose-100 rounded transition-colors text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Comments & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Delay Reason</label>
              <input
                type="text"
                name="delay_reason"
                value={formData.delay_reason}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {Object.entries(STATUS_TYPES).map(([key, status]) => (
                  <option key={key} value={key}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Foreman Comments</label>
              <textarea
                name="foreman_comments"
                value={formData.foreman_comments}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Supervisor Comments</label>
              <textarea
                name="supervisor_comments"
                value={formData.supervisor_comments}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              {initialData ? 'Update Breakdown' : 'Log Breakdown'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Report Export Modal
const ReportExportModal = ({ isOpen, onClose, onExport }) => {
  const [reportParams, setReportParams] = useState({
    start_date: '',
    end_date: '',
    status: 'all',
    breakdown_type: 'all',
    department: 'all'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportParams(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onExport(reportParams);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Export Breakdown Report</h2>
                <p className="text-sm text-slate-600">Export breakdown data as CSV</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={reportParams.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                name="end_date"
                value={reportParams.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                name="status"
                value={reportParams.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_TYPES).map(([key, status]) => (
                  <option key={key} value={key}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Breakdown Type</label>
              <select
                name="breakdown_type"
                value={reportParams.breakdown_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="all">All Types</option>
                {Object.entries(BREAKDOWN_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
              <select
                name="department"
                value={reportParams.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 font-semibold"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
export default function BreakdownManagement() {
  const [breakdowns, setBreakdowns] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [advancedStats, setAdvancedStats] = useState(null);
  const [timeAnalysis, setTimeAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingBreakdown, setEditingBreakdown] = useState(null);
  const [viewingBreakdown, setViewingBreakdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [filters, setFilters] = useState({
    status: 'all',
    breakdown_type: 'all',
    priority: 'all',
    location: 'all',
    department: 'all',
    view_mode: 'list'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statsFilters, setStatsFilters] = useState({
    start_date: '',
    end_date: '',
    department: 'all'
  });
  
  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [breakdownsData, metricsData, statsData, timeAnalysisData] = await Promise.all([
        fetchBreakdowns(filters),
        fetchDashboardMetrics(),
        fetchAdvancedStats(statsFilters.start_date, statsFilters.end_date, statsFilters.department),
        fetchTimeAnalysis(statsFilters.start_date, statsFilters.end_date)
      ]);
      
      setBreakdowns(breakdownsData);
      setDashboardMetrics(metricsData);
      setAdvancedStats(statsData);
      setTimeAnalysis(timeAnalysisData);
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmitForm = async (formData) => {
    try {
      if (editingBreakdown) {
        await updateBreakdown(editingBreakdown.id, formData);
        setSuccess('Breakdown updated successfully!');
      } else {
        await createBreakdown(formData);
        setSuccess('Breakdown logged successfully!');
      }
      
      fetchAllData();
      setShowForm(false);
      setEditingBreakdown(null);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to save breakdown: ${err.message}`);
      console.error('Form submission error:', err);
    }
  };
  
  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this breakdown record?')) return;
    
    try {
      await deleteBreakdown(id);
      setSuccess('Breakdown deleted successfully!');
      fetchAllData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to delete breakdown: ${err.message}`);
    }
  };
  
  // Handle export
  const handleExport = async (params) => {
    try {
      await exportBreakdownsCSV(
        params.start_date,
        params.end_date,
        params.status,
        params.breakdown_type,
        params.department
      );
      setSuccess('Report exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to export report: ${err.message}`);
    }
  };
  
  // Filter breakdowns by search term
  const filteredBreakdowns = useMemo(() => {
    if (!searchTerm) return breakdowns;
    
    const term = searchTerm.toLowerCase();
    return breakdowns.filter(breakdown => 
      breakdown.machine_name.toLowerCase().includes(term) ||
      breakdown.machine_id.toLowerCase().includes(term) ||
      breakdown.artisan_name.toLowerCase().includes(term) ||
      breakdown.breakdown_description.toLowerCase().includes(term) ||
      breakdown.location.toLowerCase().includes(term)
    );
  }, [breakdowns, searchTerm]);
  
  // Calculate efficiency metrics
  const efficiencyMetrics = useMemo(() => {
    if (!timeAnalysis) return null;
    
    const totalDowntime = timeAnalysis.downtime_analysis.total_hours || 0;
    const totalDelayTime = timeAnalysis.delay_analysis.total_hours || 0;
    const totalRepairTime = timeAnalysis.repair_time_analysis.total_hours || 0;
    
    const productiveTime = totalDowntime - totalDelayTime;
    const efficiencyPercentage = totalDowntime > 0 ? (productiveTime / totalDowntime) * 100 : 0;
    const averageResponseTime = timeAnalysis.response_time_analysis.average_minutes || 0;
    const averageRepairTime = timeAnalysis.repair_time_analysis.average_minutes || 0;
    
    return {
      efficiencyPercentage: Math.round(efficiencyPercentage),
      averageResponseTime,
      averageRepairTime,
      totalDowntime,
      totalDelayTime,
      totalRepairTime
    };
  }, [timeAnalysis]);
  
  // Initialize
  useEffect(() => {
    fetchAllData();
  }, [filters]);
  
  // Refresh stats when stats filters change
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, timeAnalysisData] = await Promise.all([
          fetchAdvancedStats(statsFilters.start_date, statsFilters.end_date, statsFilters.department),
          fetchTimeAnalysis(statsFilters.start_date, statsFilters.end_date)
        ]);
        setAdvancedStats(statsData);
        setTimeAnalysis(timeAnalysisData);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    
    fetchStats();
  }, [statsFilters]);
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Breakdown Management System</h1>
                <p className="text-sm text-slate-600">Track, analyze, and optimize equipment breakdowns</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>
              <button
                onClick={() => {
                  setEditingBreakdown(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-4 w-4" />
                Log Breakdown
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Alerts */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600" />
            <div className="flex-1">
              <p className="text-rose-800 font-semibold">Error</p>
              <p className="text-rose-700 text-sm">{error}</p>
            </div>
            <button onClick={() => setError('')} className="p-1 hover:bg-rose-100 rounded transition-colors">
              <X className="h-4 w-4 text-rose-600" />
            </button>
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <div className="flex-1">
              <p className="text-emerald-800 font-semibold">Success</p>
              <p className="text-emerald-700 text-sm">{success}</p>
            </div>
            <button onClick={() => setSuccess('')} className="p-1 hover:bg-emerald-100 rounded transition-colors">
              <X className="h-4 w-4 text-emerald-600" />
            </button>
          </div>
        )}
        
        {/* Dashboard Metrics */}
        {dashboardMetrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Breakdowns"
              value={dashboardMetrics.metrics?.total_breakdowns || 0}
              icon={AlertTriangle}
              color="blue"
            />
            <MetricCard
              title="This Week"
              value={dashboardMetrics.metrics?.week_breakdowns || 0}
              icon={CalendarDays}
              color="emerald"
            />
            <MetricCard
              title="Open Breakdowns"
              value={dashboardMetrics.metrics?.open_breakdowns || 0}
              icon={Clock}
              color="amber"
            />
            <MetricCard
              title="Critical Priority"
              value={dashboardMetrics.metrics?.critical_priority || 0}
              icon={AlertCircle}
              color="rose"
            />
          </div>
        )}
        
        {/* Stats Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <h3 className="text-lg font-bold text-slate-900">Statistics & Analytics</h3>
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={statsFilters.start_date}
                onChange={(e) => setStatsFilters(prev => ({ ...prev, start_date: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={statsFilters.end_date}
                onChange={(e) => setStatsFilters(prev => ({ ...prev, end_date: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="End Date"
              />
              <select
                value={statsFilters.department}
                onChange={(e) => setStatsFilters(prev => ({ ...prev, department: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Time Analysis */}
          {timeAnalysis && efficiencyMetrics && (
            <div className="mt-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Timer className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Avg Response Time</p>
                      <p className="text-xl font-bold text-slate-900">
                        {minutesToDisplay(efficiencyMetrics.averageResponseTime).display}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Wrench className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Avg Repair Time</p>
                      <p className="text-xl font-bold text-slate-900">
                        {minutesToDisplay(efficiencyMetrics.averageRepairTime).display}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Downtime</p>
                      <p className="text-xl font-bold text-slate-900">
                        {efficiencyMetrics.totalDowntime.toFixed(1)}h
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Efficiency</p>
                      <p className="text-xl font-bold text-slate-900">
                        {efficiencyMetrics.efficiencyPercentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Content Area */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Breakdown Records</h2>
                <p className="text-sm text-slate-600">
                  {filteredBreakdowns.length} breakdown{filteredBreakdowns.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => {
                      setViewMode('list');
                      setFilters(prev => ({ ...prev, view_mode: 'list' }));
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('grid');
                      setFilters(prev => ({ ...prev, view_mode: 'grid' }));
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search breakdowns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-64"
                  />
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    {Object.entries(STATUS_TYPES).map(([key, status]) => (
                      <option key={key} value={key}>{status.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filters.breakdown_type}
                    onChange={(e) => setFilters({ ...filters, breakdown_type: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="all">All Types</option>
                    {Object.entries(BREAKDOWN_TYPES).map(([key, type]) => (
                      <option key={key} value={key}>{type.name}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={fetchAllData}
                    disabled={loading}
                    className="px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 text-sm font-semibold"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <Loader2 className="h-12 w-12 animate-spin text-slate-400 mx-auto" />
                  <p className="text-slate-600 font-medium">Loading breakdown records...</p>
                </div>
              </div>
            ) : filteredBreakdowns.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-700 font-semibold">No breakdowns found</p>
                <p className="text-slate-600 text-sm mt-1">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by logging your first breakdown'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBreakdowns.map((breakdown) => (
                  <BreakdownGridCard
                    key={breakdown.id}
                    breakdown={breakdown}
                    onEdit={(bd) => {
                      setEditingBreakdown(bd);
                      setShowForm(true);
                    }}
                    onDelete={handleDelete}
                    onView={setViewingBreakdown}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBreakdowns.map((breakdown) => (
                  <BreakdownListItem
                    key={breakdown.id}
                    breakdown={breakdown}
                    onEdit={(bd) => {
                      setEditingBreakdown(bd);
                      setShowForm(true);
                    }}
                    onDelete={handleDelete}
                    onView={setViewingBreakdown}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Breakdown Form Modal */}
      <BreakdownForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingBreakdown(null);
        }}
        onSubmit={handleSubmitForm}
        initialData={editingBreakdown}
      />
      
      {/* Report Export Modal */}
      <ReportExportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onExport={handleExport}
      />
      
      {/* View Breakdown Modal */}
      {viewingBreakdown && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Breakdown Details</h2>
                    <p className="text-sm text-slate-600">
                      {viewingBreakdown.machine_name} • {new Date(viewingBreakdown.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingBreakdown(null)}
                  className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600">Status</p>
                  <StatusBadge status={viewingBreakdown.status} />
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600">Priority</p>
                  <PriorityBadge priority={viewingBreakdown.priority} />
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600">Type</p>
                  <TypeBadge type={viewingBreakdown.breakdown_type} />
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600">Department</p>
                  <p className="font-semibold text-slate-900">{viewingBreakdown.department}</p>
                </div>
              </div>
              
              {/* Time Analysis */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-slate-700 mb-3">Time Analysis</h3>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <TimeDisplay 
                    minutes={viewingBreakdown.response_time_minutes} 
                    label="Response Time"
                  />
                  <TimeDisplay 
                    minutes={viewingBreakdown.repair_time_minutes} 
                    label="Repair Time"
                  />
                  <TimeDisplay 
                    minutes={viewingBreakdown.delay_time_minutes} 
                    label="Delay Time"
                  />
                  <TimeDisplay 
                    minutes={viewingBreakdown.downtime_minutes} 
                    label="Downtime"
                  />
                  <TimeDisplay 
                    minutes={viewingBreakdown.net_downtime_minutes} 
                    label="Net Downtime"
                  />
                </div>
              </div>
              
              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Machine Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Machine ID:</span>
                      <span className="font-semibold">{viewingBreakdown.machine_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Machine Name:</span>
                      <span className="font-semibold">{viewingBreakdown.machine_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-semibold">{viewingBreakdown.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Artisan:</span>
                      <span className="font-semibold">{viewingBreakdown.artisan_name}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Time Logs</h3>
                  <div className="space-y-2">
                    {viewingBreakdown.breakdown_start && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Breakdown Start:</span>
                        <span className="font-semibold">{viewingBreakdown.breakdown_start}</span>
                      </div>
                    )}
                    {viewingBreakdown.breakdown_end && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Breakdown End:</span>
                        <span className="font-semibold">{viewingBreakdown.breakdown_end}</span>
                      </div>
                    )}
                    {viewingBreakdown.work_start && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Work Start:</span>
                        <span className="font-semibold">{viewingBreakdown.work_start}</span>
                      </div>
                    )}
                    {viewingBreakdown.work_end && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Work End:</span>
                        <span className="font-semibold">{viewingBreakdown.work_end}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Breakdown Description</h3>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{viewingBreakdown.breakdown_description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Work Done</h3>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{viewingBreakdown.work_done}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Artisan Recommendations</h3>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{viewingBreakdown.artisan_recommendations}</p>
                </div>
              </div>
              
              {/* Comments */}
              {(viewingBreakdown.foreman_comments || viewingBreakdown.supervisor_comments) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewingBreakdown.foreman_comments && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">Foreman Comments</h3>
                      <p className="text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">{viewingBreakdown.foreman_comments}</p>
                    </div>
                  )}
                  
                  {viewingBreakdown.supervisor_comments && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">Supervisor Comments</h3>
                      <p className="text-slate-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">{viewingBreakdown.supervisor_comments}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}