import React, { useState, useMemo } from 'react';
import { cn } from '../../utils';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import {
  Laptop,
  Smartphone,
  Headphones,
  Monitor,
  Search,
  Filter,
  Plus,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Headset,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Download,
  Eye,
  CheckCircle2,
  X,
  Package,
  Boxes,
  HelpCircle,
} from 'lucide-react';

export interface AssignedAssetItem {
  id: number;
  name: string;
  subType: string;
  category: 'Laptop' | 'Mobile' | 'Accessory';
  brandModel: string;
  serialNumber: string;
  assignedDate: string;
  status: 'In Use' | 'Maintenance' | 'Returned';
  iconType: 'laptop' | 'mobile' | 'headphone' | 'monitor';
}

export interface AssetRequestItem {
  id: string;
  assetType: string;
  preferredModel: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'In Transit';
  priority: 'High' | 'Normal' | 'Low';
}

export const AssetsPage: React.FC = () => {
  // Assigned assets data matching the reference image
  const [assignedAssets, setAssignedAssets] = useState<AssignedAssetItem[]>([
    {
      id: 1,
      name: 'Dell Laptop',
      subType: 'Laptop',
      category: 'Laptop',
      brandModel: 'Dell Inspiron 15',
      serialNumber: 'DL123456789',
      assignedDate: 'Apr 10, 2025',
      status: 'In Use',
      iconType: 'laptop',
    },
    {
      id: 2,
      name: 'HP Laptop',
      subType: 'Laptop',
      category: 'Laptop',
      brandModel: 'HP ProBook 440',
      serialNumber: 'HP987654321',
      assignedDate: 'May 05, 2025',
      status: 'In Use',
      iconType: 'laptop',
    },
    {
      id: 3,
      name: 'Samsung Galaxy S23',
      subType: 'Mobile Phone',
      category: 'Mobile',
      brandModel: 'Samsung S23',
      serialNumber: 'SM-S911B/DS',
      assignedDate: 'Apr 08, 2025',
      status: 'In Use',
      iconType: 'mobile',
    },
    {
      id: 4,
      name: 'Logitech Headset',
      subType: 'Accessory',
      category: 'Accessory',
      brandModel: 'Logitech H111',
      serialNumber: 'LN23874651',
      assignedDate: 'Jun 12, 2025',
      status: 'In Use',
      iconType: 'headphone',
    },
    {
      id: 5,
      name: 'Acer Monitor',
      subType: 'Accessory',
      category: 'Accessory',
      brandModel: 'Acer 24"',
      serialNumber: 'ACM240112',
      assignedDate: 'Mar 15, 2025',
      status: 'In Use',
      iconType: 'monitor',
    },
  ]);

  // Asset Requests state
  const [assetRequests, setAssetRequests] = useState<AssetRequestItem[]>([
    {
      id: 'REQ-1082',
      assetType: 'Wireless Keyboard & Mouse',
      preferredModel: 'Logitech MK295 Silent',
      requestDate: 'Apr 14, 2025',
      status: 'Approved',
      priority: 'Normal',
    },
    {
      id: 'REQ-1095',
      assetType: 'Noise Cancelling Headset',
      preferredModel: 'Jabra Evolve2 65',
      requestDate: 'May 02, 2025',
      status: 'Pending',
      priority: 'High',
    },
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Laptop' | 'Mobile' | 'Accessory'>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Active table row action menu
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isRequestsListModalOpen, setIsRequestsListModalOpen] = useState(false);
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedAssetForDetails, setSelectedAssetForDetails] = useState<AssignedAssetItem | null>(null);

  // Request Asset Form
  const [requestType, setRequestType] = useState('Laptop');
  const [requestBrand, setRequestBrand] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [requestPriority, setRequestPriority] = useState<'High' | 'Normal' | 'Low'>('Normal');

  // Report Issue Form
  const [reportAssetId, setReportAssetId] = useState<number>(1);
  const [reportIssueType, setReportIssueType] = useState('Hardware Malfunction');
  const [reportDescription, setReportDescription] = useState('');

  // Contact HR / Asset Desk Form
  const [contactMessage, setContactMessage] = useState('');

  // Counts
  const totalAssetsCount = assignedAssets.length;
  const mobileCount = assignedAssets.filter((a) => a.category === 'Mobile').length;
  const laptopCount = assignedAssets.filter((a) => a.category === 'Laptop').length;
  const accessoryCount = assignedAssets.filter((a) => a.category === 'Accessory').length;

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assignedAssets.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.subType.toLowerCase().includes(q) ||
          item.brandModel.toLowerCase().includes(q) ||
          item.serialNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [assignedAssets, categoryFilter, searchQuery]);

  // Submit Request Asset
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: AssetRequestItem = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      assetType: requestType,
      preferredModel: requestBrand || `${requestType} Standard Edition`,
      requestDate: 'Just now',
      status: 'Pending',
      priority: requestPriority,
    };
    setAssetRequests([newReq, ...assetRequests]);
    setIsRequestModalOpen(false);
    setRequestBrand('');
    setRequestReason('');
    alert('Asset request submitted successfully! Your manager and IT team have been notified.');
  };

  // Submit Report Issue
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assignedAssets.find((a) => a.id === reportAssetId);
    alert(`Issue reported for ${asset?.name || 'Asset'}! Ticket #TKT-${Math.floor(1000 + Math.random() * 9000)} created.`);
    setIsReportIssueModalOpen(false);
    setReportDescription('');
  };

  // Submit Contact HR
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent to the IT Asset Helpdesk! They will respond via work email within 2-4 business hours.');
    setIsContactModalOpen(false);
    setContactMessage('');
  };

  return (
    <div className="space-y-4 animate-page-enter">
      {/* =========================================================================
          TOP BREADCRUMB & HEADER AREA
         ========================================================================= */}
      <div>
        {/* Breadcrumbs matching image: Employee Module > Assets */}
        <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1.5">
          <span>Employee Module</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-600 dark:text-slate-300">Assets</span>
        </div>

        {/* Title Header */}
        <div className="flex items-center gap-3">
          {/* Blue 3D Cube Icon Box matching image */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs flex-shrink-0">
            <Boxes className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Assets
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              View and manage your assigned assets, including laptops, mobile phones, accessories and other company resources.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOP ROW: 4 KPI CARDS (LEFT) + ASSET SUMMARY DONUT CHART (RIGHT)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left Sub-Grid: 4 KPI Cards (8 Cols) */}
        <div className="lg:col-span-8 xl:col-span-8.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Total Assets */}
          <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs flex-shrink-0">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Total Assets
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {totalAssetsCount}
                </span>
              </div>
            </div>
            <button
              onClick={() => setCategoryFilter('All')}
              className="pt-2 border-t border-slate-100 dark:border-dark-border/60 mt-2 text-[11px] font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Assigned to you</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* 2. Mobile Phones */}
          <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-xs flex-shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Mobile Phones
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {mobileCount}
                </span>
              </div>
            </div>
            <button
              onClick={() => setCategoryFilter('Mobile')}
              className="pt-2 border-t border-slate-100 dark:border-dark-border/60 mt-2 text-[11px] font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Assigned to you</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* 3. Laptops */}
          <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 shadow-xs flex-shrink-0">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Laptops
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {laptopCount}
                </span>
              </div>
            </div>
            <button
              onClick={() => setCategoryFilter('Laptop')}
              className="pt-2 border-t border-slate-100 dark:border-dark-border/60 mt-2 text-[11px] font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Assigned to you</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* 4. Accessories */}
          <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 shadow-xs flex-shrink-0">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Accessories
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {accessoryCount}
                </span>
              </div>
            </div>
            <button
              onClick={() => setCategoryFilter('Accessory')}
              className="pt-2 border-t border-slate-100 dark:border-dark-border/60 mt-2 text-[11px] font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Assigned to you</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right Card: Asset Summary Donut Chart (4 Cols) matching reference image */}
        <div className="lg:col-span-4 xl:col-span-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            Asset Summary
          </h3>

          <div className="flex items-center justify-between gap-4 py-1">
            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background ring */}
                <circle cx="50" cy="50" r="38" stroke="#F1F5F9" strokeWidth="10" fill="transparent" className="dark:stroke-slate-800" />
                
                {/* Segment 1: Laptops (40% -> 2/5 -> Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#3B82F6"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="238.76"
                  strokeDashoffset="95.5"
                  strokeLinecap="round"
                />

                {/* Segment 2: Accessories (40% -> 2/5 -> Amber/Orange) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#F59E0B"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="238.76"
                  strokeDashoffset="143.25"
                  strokeLinecap="round"
                  transform="rotate(144 50 50)"
                />

                {/* Segment 3: Mobile (20% -> 1/5 -> Purple) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#8B5CF6"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="238.76"
                  strokeDashoffset="191"
                  strokeLinecap="round"
                  transform="rotate(288 50 50)"
                />
              </svg>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                  {totalAssetsCount}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 leading-tight mt-0.5">
                  Total Assets
                </span>
              </div>
            </div>

            {/* Legend matching reference image */}
            <div className="flex-1 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium text-xs">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Laptop
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{laptopCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium text-xs">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> Mobile
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{mobileCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium text-xs">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Accessory
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{accessoryCount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MAIN 2-COLUMN SECTION:
          LEFT: MY ASSIGNED ASSETS DATA TABLE (WIDE, 8-8.5 COLS)
          RIGHT: QUICK ACTIONS + NEED HELP CARD (3.5 - 4 COLS)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* =======================================================================
            LEFT COLUMN: MY ASSIGNED ASSETS TABLE (8.5 COLS)
           ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-8.5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-dark-border dark:bg-dark-card space-y-3.5">
          
          {/* Header Row: Title + Search Input + Filter Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex-shrink-0">
              My Assigned Assets
            </h2>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Search input with proper pl-9 to prevent icon overlap */}
              <div className="relative flex-1 sm:w-60">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:border-dark-border dark:bg-slate-800/60 dark:text-white transition-all"
                />
              </div>

              {/* Filter Dropdown Button matching reference image */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl border text-xs font-semibold transition-all duration-150 cursor-pointer',
                    categoryFilter !== 'All'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-dark-border dark:bg-slate-800 dark:text-slate-200'
                  )}
                >
                  <Filter className="h-3.5 w-3.5 text-slate-500" />
                  <span>{categoryFilter === 'All' ? 'Filter' : categoryFilter}</span>
                </button>

                {isFilterDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-toast-slide dark:border-dark-border dark:bg-dark-card z-30">
                    {(['All', 'Laptop', 'Mobile', 'Accessory'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategoryFilter(cat);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                          categoryFilter === cat
                            ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/60 dark:text-blue-300'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                        )}
                      >
                        {cat === 'All' ? 'All Categories' : cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-dark-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 dark:border-dark-border dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 w-8 font-semibold">#</th>
                  <th className="py-2.5 px-3 font-semibold">Asset Name</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Brand / Model</th>
                  <th className="py-2.5 px-3 font-semibold">Serial / IMEI</th>
                  <th className="py-2.5 px-3 font-semibold">Assigned Date</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Package className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No assets found</p>
                      <p className="text-[11px] text-slate-400">Try changing your search or filter settings.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="hover:bg-slate-50/75 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Row # */}
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {asset.id}
                      </td>

                      {/* Asset Name + Thumbnail Graphic */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {/* Device Thumbnail Graphic matching image */}
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                            {asset.iconType === 'laptop' ? (
                              <Laptop className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                            ) : asset.iconType === 'mobile' ? (
                              <Smartphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            ) : asset.iconType === 'headphone' ? (
                              <Headphones className="h-5 w-5 text-slate-800 dark:text-slate-200" />
                            ) : (
                              <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>

                          <div>
                            <p
                              onClick={() => setSelectedAssetForDetails(asset)}
                              className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              {asset.name}
                            </p>
                            <p className="text-[10.5px] text-slate-400">{asset.subType}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category Pill Badge matching image */}
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold',
                            asset.category === 'Laptop' && 'bg-blue-50 text-blue-600 border border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50',
                            asset.category === 'Mobile' && 'bg-purple-50 text-purple-600 border border-purple-200/60 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900/50',
                            asset.category === 'Accessory' && 'bg-amber-50 text-amber-600 border border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50'
                          )}
                        >
                          {asset.category}
                        </span>
                      </td>

                      {/* Brand / Model */}
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {asset.brandModel}
                      </td>

                      {/* Serial / IMEI */}
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        {asset.serialNumber}
                      </td>

                      {/* Assigned Date */}
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {asset.assignedDate}
                      </td>

                      {/* Status: In Use (Green Pill) */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 text-[10.5px] font-bold">
                          {asset.status}
                        </span>
                      </td>

                      {/* Actions Menu (•••) */}
                      <td className="py-3 px-3 text-right relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === asset.id ? null : asset.id)}
                          className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {activeMenuId === asset.id && (
                          <div className="absolute right-3 top-8 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-toast-slide dark:border-dark-border dark:bg-dark-card z-30 text-left">
                            <button
                              onClick={() => {
                                setSelectedAssetForDetails(asset);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-blue-500" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => {
                                setReportAssetId(asset.id);
                                setIsReportIssueModalOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                              <span>Report Issue</span>
                            </button>
                            <button
                              onClick={() => {
                                alert(`Handover slip for ${asset.name} downloaded.`);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Download Slip</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-[11.5px]">
              Showing 1 to {filteredAssets.length} of {filteredAssets.length} assets
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-40 dark:border-dark-border dark:bg-slate-800"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                1
              </button>

              <button
                disabled
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-40 dark:border-dark-border dark:bg-slate-800"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* =======================================================================
            RIGHT COLUMN: QUICK ACTIONS + NEED HELP? CARD (3.5 COLS)
           ======================================================================= */}
        <div className="lg:col-span-4 xl:col-span-3.5 space-y-4">
          
          {/* Card 1: Quick Actions matching reference image */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h3>

            <div className="space-y-2 pt-1">
              {/* Action 1: Request New Asset */}
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Request New Asset</p>
                    <p className="text-[11px] text-slate-400">Apply for a new asset</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* Action 2: View My Requests */}
              <button
                onClick={() => setIsRequestsListModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">View My Requests</p>
                    <p className="text-[11px] text-slate-400">Track your asset requests</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* Action 3: Report Issue */}
              <button
                onClick={() => setIsReportIssueModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Report Issue</p>
                    <p className="text-[11px] text-slate-400">Raise an issue with asset</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* Action 4: Asset Policy */}
              <button
                onClick={() => setIsPolicyModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500 text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Asset Policy</p>
                    <p className="text-[11px] text-slate-400">View company policy</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>
            </div>
          </div>

          {/* Card 2: Need Help? Card matching reference image */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-3">
            <div className="flex items-start justify-between gap-3">
              {/* Graphic Illustration of laptop on desk with plant */}
              <div className="flex-shrink-0">
                <svg width="76" height="52" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Decorative Potted Plant */}
                  <path d="M12 40C10 32 16 26 22 28C22 34 18 42 12 40Z" fill="#38BDF8" fillOpacity="0.7" />
                  <path d="M10 36C6 30 10 24 16 26C16 32 14 38 10 36Z" fill="#60A5FA" fillOpacity="0.8" />
                  <path d="M16 40C16 46 14 48 12 48H18C16 48 16 46 16 40Z" fill="#1D4ED8" />

                  {/* Laptop Base & Screen */}
                  <rect x="26" y="14" width="46" height="30" rx="4" fill="#2563EB" />
                  <rect x="28" y="16" width="42" height="24" rx="2" fill="#FFFFFF" />
                  {/* Screen Content Graphic */}
                  <path d="M34 26L42 22L48 26L54 20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="22" y="44" width="54" height="4" rx="2" fill="#93C5FD" />
                  <rect x="42" y="44" width="14" height="2" rx="1" fill="#1E40AF" />

                  {/* Right Leaves */}
                  <path d="M78 35C84 28 80 20 74 24C72 30 74 38 78 35Z" fill="#93C5FD" fillOpacity="0.7" />
                </svg>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Need Help?
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Contact your HR team for any asset related queries.
                </p>
              </div>
            </div>

            {/* Contact HR Button */}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 h-8.5 rounded-xl border border-blue-500 bg-white text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:bg-dark-card dark:text-blue-300 dark:hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Headset className="h-3.5 w-3.5" />
              <span>Contact HR</span>
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE MODALS: REQUEST ASSET, REPORT ISSUE, DETAILS, POLICY, CONTACT
         ========================================================================= */}
      {/* 1. Request New Asset Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request New Asset"
        description="Submit an official request to the IT Operations team for new hardware or accessories."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleRequestSubmit}>
              Submit Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Asset Category *
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="Laptop">Laptop (Developer / Designer)</option>
                <option value="Mobile Phone">Mobile Phone (Test Device / Sim)</option>
                <option value="External Monitor">External Monitor (24" - 27")</option>
                <option value="Headphones">Headphones / Headset</option>
                <option value="Keyboard & Mouse">Keyboard & Mouse Combo</option>
                <option value="Other Accessory">Other Accessory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Urgency Priority
              </label>
              <select
                value={requestPriority}
                onChange={(e) => setRequestPriority(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="Normal">Normal (Standard 3-5 days)</option>
                <option value="High">High (Urgent project need)</option>
                <option value="Low">Low (Future upgrade)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Model / Specifications (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. MacBook Pro M3 / Dell XPS 16GB / 4K Monitor"
              value={requestBrand}
              onChange={(e) => setRequestBrand(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Business Justification *
            </label>
            <textarea
              rows={3}
              required
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Explain why this asset is required for your role or deliverables..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* 2. Report Issue Modal */}
      <Modal
        isOpen={isReportIssueModalOpen}
        onClose={() => setIsReportIssueModalOpen(false)}
        title="Report Asset Issue"
        description="Notify the hardware support desk regarding damages, defects, or replacement needs."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsReportIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleReportSubmit}>
              Submit Ticket
            </Button>
          </>
        }
      >
        <form onSubmit={handleReportSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Asset *
              </label>
              <select
                value={reportAssetId}
                onChange={(e) => setReportAssetId(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
              >
                {assignedAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.serialNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Category
              </label>
              <select
                value={reportIssueType}
                onChange={(e) => setReportIssueType(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="Hardware Malfunction">Hardware Malfunction</option>
                <option value="Screen / Display Damage">Screen / Display Damage</option>
                <option value="Battery / Charger Fault">Battery / Charger Fault</option>
                <option value="Operating System / Software Crash">Operating System / Software Crash</option>
                <option value="Lost or Stolen Device">Lost or Stolen Device</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Issue Details & Observations *
            </label>
            <textarea
              rows={3}
              required
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Describe symptoms, when it started, and steps to reproduce..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* 3. Asset Details Modal */}
      {selectedAssetForDetails && (
        <Modal
          isOpen={!!selectedAssetForDetails}
          onClose={() => setSelectedAssetForDetails(null)}
          title={selectedAssetForDetails.name}
          description={`Assigned on ${selectedAssetForDetails.assignedDate} • Serial ${selectedAssetForDetails.serialNumber}`}
          size="sm"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedAssetForDetails(null)}>
                Close
              </Button>
              <Button
                size="sm"
                leftIcon={<Download className="h-3.5 w-3.5" />}
                onClick={() => {
                  alert(`Downloading asset assignment slip for ${selectedAssetForDetails.name}...`);
                  setSelectedAssetForDetails(null);
                }}
              >
                Assignment Slip
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">Category</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedAssetForDetails.category}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">Brand / Model</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedAssetForDetails.brandModel}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">Serial Number</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{selectedAssetForDetails.serialNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">Assigned Date</span>
              <span className="text-slate-800 dark:text-slate-200">{selectedAssetForDetails.assignedDate}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">Operational Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-700">
                {selectedAssetForDetails.status}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">Warranty Protection</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active (Under OEM Care)</span>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. View My Requests Modal */}
      <Modal
        isOpen={isRequestsListModalOpen}
        onClose={() => setIsRequestsListModalOpen(false)}
        title="My Asset Requests"
        description="Track the real-time status of your hardware procurement and replacement requests."
        size="md"
      >
        <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-dark-border">
          {assetRequests.map((req) => (
            <div key={req.id} className="pt-2.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{req.assetType}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
                    {req.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{req.preferredModel} • Requested {req.requestDate}</p>
              </div>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10.5px] font-bold',
                  req.status === 'Approved' && 'bg-emerald-100 text-emerald-700',
                  req.status === 'Pending' && 'bg-amber-100 text-amber-700',
                  req.status === 'In Transit' && 'bg-blue-100 text-blue-700'
                )}
              >
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </Modal>

      {/* 5. Company Asset Policy Modal */}
      <Modal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        title="Company Hardware & Asset Policy"
        description="Rules and compliance regarding company equipment possession and care."
        size="md"
      >
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50">
            <h5 className="font-bold text-blue-900 dark:text-blue-300 mb-1">Equipment Ownership:</h5>
            <p className="text-[11.5px]">All assigned hardware items remain the sole property of the company and are provided strictly for business deliverables and sanctioned tasks.</p>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 dark:text-white mb-1">Key Responsibilities:</h5>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li>Never install unauthorized, pirated, or unvetted external software.</li>
              <li>Keep antivirus and endpoint monitoring services active at all times.</li>
              <li>Report lost or damaged equipment to IT Operations within 24 hours.</li>
              <li>Hand over all assets, chargers, and peripherals upon employment conclusion.</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* 6. Contact HR / IT Asset Desk Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Contact Asset Support Desk"
        description="Send a priority inquiry to the workplace hardware team."
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsContactModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleContactSubmit}>
              Send Inquiry
            </Button>
          </>
        }
      >
        <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Message *
            </label>
            <textarea
              rows={4}
              required
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Describe your inquiry (e.g. charger replacement, upgrade eligibility, accessory handover)..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
