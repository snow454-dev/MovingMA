import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  FileText, 
  Printer, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  Calendar, 
  X, 
  Send,
  Sparkles,
  Info
} from 'lucide-react';
import { MoveOutCase, RepairItem, Property, GuidelineCategory, Contractor } from '../../types';
import { formatCurrency, calculateResidualRatio, recalculateItemSplit, determineApprovalLevel } from '../../utils/guidelineCalculator';

interface InspectionManagerProps {
  cases: MoveOutCase[];
  properties: Property[];
  contractors: Contractor[];
  selectedCaseId?: string;
  onUpdateCase: (updatedCase: MoveOutCase) => void;
  onCreateCase: (newCase: MoveOutCase) => void;
  onRequestInsuranceClaim?: (caseItem: MoveOutCase, item: RepairItem) => void;
  onDispatchContractor?: (caseItem: MoveOutCase, contractorId: string) => void;
}

export const InspectionManager: React.FC<InspectionManagerProps> = ({
  cases,
  properties,
  contractors,
  selectedCaseId,
  onUpdateCase,
  onCreateCase,
  onRequestInsuranceClaim,
  onDispatchContractor,
}) => {
  const [activeCaseId, setActiveCaseId] = useState<string>(selectedCaseId || cases[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'tokai' | 'osaka'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  // Active case
  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  // Filtering
  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === 'all' || c.region === regionFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  // Calculate residual ratio for active case
  const wallpaperRatio = activeCase 
    ? calculateResidualRatio(72, activeCase.tenancyMonths) 
    : 1.0;

  // Handle item change
  const handleUpdateItem = (itemId: string, updates: Partial<RepairItem>) => {
    if (!activeCase) return;
    const updatedItems = activeCase.items.map(item => {
      if (item.id === itemId) {
        const merged = { ...item, ...updates };
        return recalculateItemSplit(merged, activeCase.tenancyMonths, activeCase.specialContractAgreement);
      }
      return item;
    });

    const totalRepairCost = updatedItems.reduce((acc, i) => acc + i.totalPrice, 0);
    const tenantTotal = updatedItems.reduce((acc, i) => acc + i.tenantShare, 0);
    const ownerTotal = updatedItems.reduce((acc, i) => acc + i.ownerShare, 0);
    const insuranceTotal = updatedItems.reduce((acc, i) => acc + i.insuranceShare, 0);
    const depositRefund = activeCase.depositAmount - tenantTotal;
    const approvalLevel = determineApprovalLevel(totalRepairCost, false, insuranceTotal > 0);

    onUpdateCase({
      ...activeCase,
      items: updatedItems,
      totalRepairCost,
      tenantTotal,
      ownerTotal,
      insuranceTotal,
      depositRefund,
      approvalLevel,
    });
  };

  // Add standard repair item preset
  const handleAddPresetItem = (presetType: 'cross' | 'cf' | 'cleaning' | 'aircon' | 'glass_thermal' | 'door_patch') => {
    if (!activeCase) return;
    let newItem: RepairItem;

    if (presetType === 'cross') {
      newItem = {
        id: `item-${Date.now()}`,
        category: 'wallpaper_cloth',
        name: '壁紙クロス張替え (居室壁面一部)',
        quantity: 12,
        unit: '㎡',
        unitPrice: 1100,
        totalPrice: 13200,
        depreciationApplicable: true,
        usefulLifeMonths: 72,
        tenantFaultRatio: 100,
        guidelineRule: '国交省ガイドライン6年耐用年数。入居経過月数による残存価値を乗算。',
        insuranceApplicable: false,
        tenantShare: 0,
        ownerShare: 0,
        insuranceShare: 0,
      };
    } else if (presetType === 'cf') {
      newItem = {
        id: `item-${Date.now()}`,
        category: 'flooring_cf',
        name: 'クッションフロア張替え (キッチン床)',
        quantity: 8,
        unit: '㎡',
        unitPrice: 2800,
        totalPrice: 22400,
        depreciationApplicable: true,
        usefulLifeMonths: 72,
        tenantFaultRatio: 100,
        guidelineRule: '耐用年数6年減価償却対象。故意過失部分に残存価値率適用。',
        insuranceApplicable: false,
        tenantShare: 0,
        ownerShare: 0,
        insuranceShare: 0,
      };
    } else if (presetType === 'cleaning') {
      newItem = {
        id: `item-${Date.now()}`,
        category: 'cleaning',
        name: 'ルームクリーニング一式 (退去特約)',
        quantity: 1,
        unit: '式',
        unitPrice: 27500,
        totalPrice: 27500,
        depreciationApplicable: false,
        usefulLifeMonths: 0,
        tenantFaultRatio: 100,
        guidelineRule: '賃貸借契約特約合意条項。',
        insuranceApplicable: false,
        tenantShare: 27500,
        ownerShare: 0,
        insuranceShare: 0,
      };
    } else if (presetType === 'aircon') {
      newItem = {
        id: `item-${Date.now()}`,
        category: 'air_con_clean',
        name: 'エアコン内部高圧分解洗浄',
        quantity: 1,
        unit: '台',
        unitPrice: 11000,
        totalPrice: 11000,
        depreciationApplicable: false,
        usefulLifeMonths: 0,
        tenantFaultRatio: 100,
        guidelineRule: '喫煙または油汚れによる内部ファン・アルミフィン汚損。',
        insuranceApplicable: false,
        tenantShare: 11000,
        ownerShare: 0,
        insuranceShare: 0,
      };
    } else if (presetType === 'glass_thermal') {
      newItem = {
        id: `item-${Date.now()}`,
        category: 'disaster_accident',
        name: '窓ガラス網入り熱割れ交換',
        quantity: 1,
        unit: '枚',
        unitPrice: 38500,
        totalPrice: 38500,
        depreciationApplicable: false,
        usefulLifeMonths: 0,
        tenantFaultRatio: 0,
        guidelineRule: '熱割れは自然現象のため入居者過失なし。オーナー火災保険対象。',
        insuranceApplicable: true,
        insuranceType: 'owner_fire_disaster',
        tenantShare: 0,
        ownerShare: 0,
        insuranceShare: 38500,
      };
    } else {
      newItem = {
        id: `item-${Date.now()}`,
        category: 'fixtures_doors',
        name: '建具・扉 補修シート施工',
        quantity: 1,
        unit: '箇所',
        unitPrice: 15000,
        totalPrice: 15000,
        depreciationApplicable: false,
        usefulLifeMonths: 0,
        tenantFaultRatio: 100,
        guidelineRule: '衝撃による凹み穴・破損。実費補修。',
        insuranceApplicable: false,
        tenantShare: 15000,
        ownerShare: 0,
        insuranceShare: 0,
      };
    }

    const calculated = recalculateItemSplit(newItem, activeCase.tenancyMonths, activeCase.specialContractAgreement);
    const updatedItems = [...activeCase.items, calculated];

    const totalRepairCost = updatedItems.reduce((acc, i) => acc + i.totalPrice, 0);
    const tenantTotal = updatedItems.reduce((acc, i) => acc + i.tenantShare, 0);
    const ownerTotal = updatedItems.reduce((acc, i) => acc + i.ownerShare, 0);
    const insuranceTotal = updatedItems.reduce((acc, i) => acc + i.insuranceShare, 0);
    const depositRefund = activeCase.depositAmount - tenantTotal;
    const approvalLevel = determineApprovalLevel(totalRepairCost, false, insuranceTotal > 0);

    onUpdateCase({
      ...activeCase,
      items: updatedItems,
      totalRepairCost,
      tenantTotal,
      ownerTotal,
      insuranceTotal,
      depositRefund,
      approvalLevel,
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!activeCase) return;
    const updatedItems = activeCase.items.filter(i => i.id !== itemId);
    const totalRepairCost = updatedItems.reduce((acc, i) => acc + i.totalPrice, 0);
    const tenantTotal = updatedItems.reduce((acc, i) => acc + i.tenantShare, 0);
    const ownerTotal = updatedItems.reduce((acc, i) => acc + i.ownerShare, 0);
    const insuranceTotal = updatedItems.reduce((acc, i) => acc + i.insuranceShare, 0);
    const depositRefund = activeCase.depositAmount - tenantTotal;
    const approvalLevel = determineApprovalLevel(totalRepairCost, false, insuranceTotal > 0);

    onUpdateCase({
      ...activeCase,
      items: updatedItems,
      totalRepairCost,
      tenantTotal,
      ownerTotal,
      insuranceTotal,
      depositRefund,
      approvalLevel,
    });
  };

  // State translation
  const getStatusBadge = (status: MoveOutCase['status']) => {
    switch (status) {
      case 'scheduled': return <span className="text-slate-500 font-medium">立会い予定</span>;
      case 'inspected': return <span className="text-blue-700 font-medium">立会済・査定中</span>;
      case 'pending_approval': return <span className="text-amber-700 font-medium">承認待ち</span>;
      case 'tenant_agreed': return <span className="text-emerald-700 font-medium">入居者合意済</span>;
      case 'work_ordered': return <span className="text-purple-700 font-medium">工事発注中</span>;
      case 'completed': return <span className="text-slate-700 font-medium">精算完了</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="物件名・部屋番・入居者名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
            />
          </div>

          {/* Region Tabs (Buttons per frontend design rule) */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
            <button
              onClick={() => setRegionFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                regionFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全地域
            </button>
            <button
              onClick={() => setRegionFilter('tokai')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                regionFilter === 'tokai' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              東海 (27棟)
            </button>
            <button
              onClick={() => setRegionFilter('osaka')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                regionFilter === 'osaka' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              大阪 (7棟)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>精算書・合意書 印刷/PDF</span>
          </button>
          
          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新規案件登録</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Case Selector List + Full Editor / Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs text-slate-500 font-medium px-1 flex justify-between items-center">
            <span>退去案件キュー ({filteredCases.length}件)</span>
            <span>選択中: {activeCase?.roomNumber}</span>
          </div>

          <div className="space-y-2">
            {filteredCases.map(c => {
              const isSelected = c.id === activeCase?.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveCaseId(c.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {c.propertyName} {c.roomNumber}
                    </span>
                    <span className="text-xs">{getStatusBadge(c.status)}</span>
                  </div>

                  <div className="mt-1 text-xs text-slate-600">
                    入居者: {c.tenantName}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>入居: {c.tenancyMonths}ヶ月 ({c.moveInDate} 〜)</span>
                    <span className="font-semibold text-slate-900 font-mono tabular-nums">
                      {formatCurrency(c.totalRepairCost)}
                    </span>
                  </div>

                  {c.insuranceTotal > 0 && (
                    <div className="mt-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                      保険求償: {formatCurrency(c.insuranceTotal)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Case Calculator & Inspector (8 cols) */}
        {activeCase ? (
          <div className="lg:col-span-8 space-y-5">
            
            {/* Header Card: Case Profile & MLIT Depreciation Banner */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{activeCase.region === 'tokai' ? '東海エリア' : '大阪エリア'}</span>
                    <span>·</span>
                    <span>立会検査員: {activeCase.inspectorName}</span>
                    <span>·</span>
                    <span>立会日: {activeCase.inspectionDate}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {activeCase.propertyName} {activeCase.roomNumber} - 退去精算査定
                  </h2>
                  <div className="text-xs text-slate-600 mt-0.5">
                    賃借人: <strong className="text-slate-900">{activeCase.tenantName}</strong> (TEL: {activeCase.tenantPhone})
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">現在のステータス</div>
                  <div className="mt-0.5">{getStatusBadge(activeCase.status)}</div>
                </div>
              </div>

              {/* Tenancy & Depreciation Factor */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">入居期間</span>
                  <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                    {activeCase.tenancyMonths}ヶ月
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ({Math.floor(activeCase.tenancyMonths / 12)}年{activeCase.tenancyMonths % 12}ヶ月)
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">クロス・CF残存価値率</span>
                  <span className="text-sm font-bold text-blue-700 font-mono tabular-nums">
                    {(wallpaperRatio * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    (国交省6年減価償却基準)
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">預託敷金</span>
                  <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                    {formatCurrency(activeCase.depositAmount)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    (家賃 {formatCurrency(activeCase.monthlyRent)})
                  </span>
                </div>

                <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                  <span className="text-emerald-900 block font-medium">敷金返還予定額</span>
                  <span className="text-sm font-bold text-emerald-700 font-mono tabular-nums">
                    {formatCurrency(activeCase.depositRefund)}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">
                    (預託金 - 入居者負担)
                  </span>
                </div>
              </div>

              {/* 3-Way Cost Distribution Visual Bar */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-700 font-medium mb-1.5">
                  <span>三方費用分担サマリー</span>
                  <span className="font-mono tabular-nums text-slate-900 font-bold">
                    総工費 {formatCurrency(activeCase.totalRepairCost)}
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  {activeCase.totalRepairCost > 0 ? (
                    <>
                      <div 
                        style={{ width: `${(activeCase.tenantTotal / activeCase.totalRepairCost) * 100}%` }}
                        className="bg-blue-600 h-full"
                        title={`入居者負担: ${formatCurrency(activeCase.tenantTotal)}`}
                      />
                      <div 
                        style={{ width: `${(activeCase.insuranceTotal / activeCase.totalRepairCost) * 100}%` }}
                        className="bg-amber-500 h-full"
                        title={`保険適用: ${formatCurrency(activeCase.insuranceTotal)}`}
                      />
                      <div 
                        style={{ width: `${(activeCase.ownerTotal / activeCase.totalRepairCost) * 100}%` }}
                        className="bg-slate-400 h-full"
                        title={`オーナー負担: ${formatCurrency(activeCase.ownerTotal)}`}
                      />
                    </>
                  ) : null}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs shrink-0" />
                    <span className="text-slate-600">入居者:</span>
                    <strong className="font-mono tabular-nums text-slate-900">{formatCurrency(activeCase.tenantTotal)}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs shrink-0" />
                    <span className="text-slate-600">保険求償:</span>
                    <strong className="font-mono tabular-nums text-amber-700">{formatCurrency(activeCase.insuranceTotal)}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-slate-400 rounded-xs shrink-0" />
                    <span className="text-slate-600">オーナー:</span>
                    <strong className="font-mono tabular-nums text-slate-700">{formatCurrency(activeCase.ownerTotal)}</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Repair Items Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    原状回復・補修明細リスト ({activeCase.items.length}項目)
                  </h3>
                  <p className="text-xs text-slate-500">
                    項目ごとの故意過失割合および保険適用の設定
                  </p>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">標準追加:</span>
                  <button
                    onClick={() => handleAddPresetItem('cross')}
                    className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                  >
                    + クロス
                  </button>
                  <button
                    onClick={() => handleAddPresetItem('cf')}
                    className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                  >
                    + CF床
                  </button>
                  <button
                    onClick={() => handleAddPresetItem('cleaning')}
                    className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                  >
                    + 美装特約
                  </button>
                  <button
                    onClick={() => handleAddPresetItem('aircon')}
                    className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                  >
                    + エアコン洗浄
                  </button>
                  <button
                    onClick={() => handleAddPresetItem('glass_thermal')}
                    className="px-2 py-0.5 text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-800 rounded transition-colors cursor-pointer"
                  >
                    + 窓熱割れ(保険)
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">修繕項目名・判定根拠</th>
                      <th className="py-2.5 px-2 text-right">単価・数量</th>
                      <th className="py-2.5 px-2 text-right">小計</th>
                      <th className="py-2.5 px-2 text-center">過失割合</th>
                      <th className="py-2.5 px-2 text-center">保険対象</th>
                      <th className="py-2.5 px-2 text-right">入居者負担</th>
                      <th className="py-2.5 px-2 text-right">オーナー負担</th>
                      <th className="py-2.5 px-2 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCase.items.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 max-w-xs">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                            className="font-medium text-slate-900 w-full bg-transparent border-b border-transparent focus:border-slate-300 focus:outline-none"
                          />
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {item.guidelineRule}
                          </p>
                        </td>

                        <td className="py-2.5 px-2 text-right whitespace-nowrap">
                          <span className="font-mono tabular-nums">{formatCurrency(item.unitPrice)}</span>
                          <span className="text-slate-400"> × </span>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, { quantity: Number(e.target.value) })}
                            className="w-12 text-right font-mono tabular-nums border border-slate-200 rounded px-1 py-0.5"
                          />
                          <span className="text-slate-500 text-[11px] ml-1">{item.unit}</span>
                        </td>

                        <td className="py-2.5 px-2 text-right font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">
                          {formatCurrency(item.totalPrice)}
                        </td>

                        <td className="py-2.5 px-2 text-center whitespace-nowrap">
                          <select
                            value={item.tenantFaultRatio}
                            disabled={item.insuranceApplicable}
                            onChange={(e) => handleUpdateItem(item.id, { tenantFaultRatio: Number(e.target.value) })}
                            className="text-xs border border-slate-200 rounded px-1.5 py-0.5 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                          >
                            <option value="100">借主 100%</option>
                            <option value="50">借主 50%</option>
                            <option value="0">借主 0% (通常損耗)</option>
                          </select>
                        </td>

                        <td className="py-2.5 px-2 text-center whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={item.insuranceApplicable}
                            onChange={(e) => handleUpdateItem(item.id, { insuranceApplicable: e.target.checked })}
                            className="w-4 h-4 text-amber-600 rounded border-slate-300 cursor-pointer"
                            title="火災・災害・突発事故の保険求償対象にする"
                          />
                        </td>

                        <td className="py-2.5 px-2 text-right font-bold text-blue-700 font-mono tabular-nums whitespace-nowrap">
                          {formatCurrency(item.tenantShare)}
                        </td>

                        <td className="py-2.5 px-2 text-right font-medium text-slate-600 font-mono tabular-nums whitespace-nowrap">
                          {formatCurrency(item.ownerShare)}
                        </td>

                        <td className="py-2.5 px-2 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="削除"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Non-Dispute Tenant Explanation Assistant */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  入居者説明用 納得感ガイダンス（言った言わない・クレーム防止文面）
                </h4>
              </div>

              <textarea
                rows={3}
                value={activeCase.tenantExplanationNotes}
                onChange={(e) => onUpdateCase({ ...activeCase, tenantExplanationNotes: e.target.value })}
                className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-3 leading-relaxed focus:outline-none focus:border-slate-400"
                placeholder="国交省ガイドライン根拠に基づき、なぜこの負担割合になったかを明記してください..."
              />

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  ※ この文章は精算確認書およびオーナー報告書にそのまま印字されます。
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updatedStatus = activeCase.status === 'inspected' ? 'tenant_agreed' : activeCase.status;
                      onUpdateCase({ ...activeCase, status: updatedStatus });
                      alert('入居者合意ステータスを更新しました。');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors cursor-pointer"
                  >
                    入居者立会い合意を記録
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : null}

      </div>

      {/* Printable / PDF Preview Modal */}
      {isPrintModalOpen && activeCase && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-mono text-slate-400">書類番号: {activeCase.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>印刷 / PDF出力</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-6 text-slate-900">
              <div className="text-center space-y-1">
                <h1 className="text-xl font-bold tracking-tight">賃貸住宅退去精算 兼 原状回復合意書</h1>
                <p className="text-xs text-slate-500">国土交通省「原状回復をめぐるトラブルとガイドライン」準拠</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <div>物件名: <strong>{activeCase.propertyName} {activeCase.roomNumber}</strong></div>
                  <div className="mt-1">入居者名: <strong>{activeCase.tenantName}</strong> 様</div>
                  <div className="mt-1">入居期間: {activeCase.moveInDate} 〜 {activeCase.moveOutDate} ({activeCase.tenancyMonths}ヶ月)</div>
                </div>
                <div>
                  <div>敷金預託金: <strong>{formatCurrency(activeCase.depositAmount)}</strong></div>
                  <div className="mt-1">立会日: {activeCase.inspectionDate}</div>
                  <div className="mt-1">立会検査員: {activeCase.inspectorName}</div>
                </div>
              </div>

              {/* Settlement Result Box */}
              <div className="p-4 border-2 border-slate-900 rounded-lg flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-slate-600 block">敷金精算結果（返還額）</span>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    {formatCurrency(activeCase.depositRefund)}
                  </span>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <div>原状回復総工費: {formatCurrency(activeCase.totalRepairCost)}</div>
                  <div>入居者ご負担額: <strong className="text-slate-900">{formatCurrency(activeCase.tenantTotal)}</strong></div>
                  {activeCase.insuranceTotal > 0 && (
                    <div className="text-amber-700">保険求償適用: {formatCurrency(activeCase.insuranceTotal)}</div>
                  )}
                </div>
              </div>

              {/* Items Breakdown */}
              <table className="w-full text-xs border border-slate-200 divide-y divide-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 text-left">修繕項目</th>
                    <th className="p-2 text-right">費用小計</th>
                    <th className="p-2 text-left">判定理由 (過失割合 / 残存価値)</th>
                    <th className="p-2 text-right">借主負担</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeCase.items.map(item => (
                    <tr key={item.id}>
                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="p-2 text-right font-mono tabular-nums">{formatCurrency(item.totalPrice)}</td>
                      <td className="p-2 text-slate-600 text-[11px]">{item.guidelineRule}</td>
                      <td className="p-2 text-right font-bold text-slate-900 font-mono tabular-nums">{formatCurrency(item.tenantShare)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Explanation notes */}
              {activeCase.tenantExplanationNotes && (
                <div className="text-xs bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="font-semibold block mb-1">【ご説明事項】</span>
                  <p className="leading-relaxed text-slate-700 whitespace-pre-wrap">{activeCase.tenantExplanationNotes}</p>
                </div>
              )}

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs">
                <div className="space-y-6">
                  <div>上記明細およびガイドライン判定基準を確認し、精算内容に合意いたします。</div>
                  <div className="border-b border-slate-400 pb-1 flex justify-between">
                    <span>賃借人 ご署名:</span>
                    <span className="text-slate-400">印</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>管理会社: 株式会社レノバオペレーションズ（東海・大阪統括）</div>
                  <div className="border-b border-slate-400 pb-1 flex justify-between">
                    <span>担当検査員: {activeCase.inspectorName}</span>
                    <span className="text-slate-400">印</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* New Case Modal */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">新規退去立会い案件の起案</h3>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const propId = (form.elements.namedItem('propertyId') as HTMLSelectElement).value;
                const prop = properties.find(p => p.id === propId) || properties[0];
                const room = (form.elements.namedItem('roomNumber') as HTMLInputElement).value;
                const tenant = (form.elements.namedItem('tenantName') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('tenantPhone') as HTMLInputElement).value;
                const months = Number((form.elements.namedItem('tenancyMonths') as HTMLInputElement).value) || 24;
                const deposit = Number((form.elements.namedItem('depositAmount') as HTMLInputElement).value) || 60000;

                const newCase: MoveOutCase = {
                  id: `case-${Date.now()}`,
                  propertyId: prop.id,
                  propertyName: prop.name,
                  region: prop.region,
                  roomNumber: room,
                  tenantName: tenant,
                  tenantPhone: phone,
                  moveInDate: '2024-04-01',
                  moveOutDate: '2026-09-30',
                  tenancyMonths: months,
                  monthlyRent: deposit,
                  depositAmount: deposit,
                  status: 'scheduled',
                  inspectionDate: '2026-10-02',
                  inspectorName: '現場担当・佐々木',
                  approvalLevel: 1,
                  approvalStatus: 'draft',
                  specialContractAgreement: true,
                  notes: '新規登録',
                  tenantExplanationNotes: '退去立会い実施時にガイドラインに沿って確認予定。',
                  items: [
                    {
                      id: `item-${Date.now()}-1`,
                      category: 'cleaning',
                      name: 'ハウスクリーニング一式 (退去特約合意)',
                      quantity: 1,
                      unit: '式',
                      unitPrice: 27500,
                      totalPrice: 27500,
                      depreciationApplicable: false,
                      usefulLifeMonths: 0,
                      tenantFaultRatio: 100,
                      guidelineRule: '契約書特約に基づく定額精算。',
                      insuranceApplicable: false,
                      tenantShare: 27500,
                      ownerShare: 0,
                      insuranceShare: 0,
                    }
                  ],
                  totalRepairCost: 27500,
                  tenantTotal: 27500,
                  ownerTotal: 0,
                  insuranceTotal: 0,
                  depositRefund: deposit - 27500,
                };

                onCreateCase(newCase);
                setActiveCaseId(newCase.id);
                setIsNewCaseModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-medium mb-1">対象物件</label>
                <select name="propertyId" className="w-full border border-slate-300 rounded p-2 bg-white">
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.region === 'tokai' ? '東海' : '大阪'}] {p.name} ({p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">部屋番号</label>
                  <input name="roomNumber" defaultValue="301号室" required className="w-full border border-slate-300 rounded p-2" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">入居月数 (経過月数)</label>
                  <input name="tenancyMonths" type="number" defaultValue="42" required className="w-full border border-slate-300 rounded p-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">賃借人氏名</label>
                  <input name="tenantName" defaultValue="鈴木 一郎 様" required className="w-full border border-slate-300 rounded p-2" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">電話番号</label>
                  <input name="tenantPhone" defaultValue="090-1234-5678" required className="w-full border border-slate-300 rounded p-2" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">預託敷金額 (円)</label>
                <input name="depositAmount" type="number" defaultValue="70000" required className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded font-medium"
                >
                  起案して査定を開始
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
