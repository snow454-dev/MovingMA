import React from 'react';
import { 
  Building, 
  Clock, 
  ShieldCheck, 
  FileCheck2, 
  AlertTriangle, 
  ArrowRight, 
  TrendingDown, 
  Hammer, 
  Users2, 
  ExternalLink 
} from 'lucide-react';
import { Property, MoveOutCase, InsuranceClaim, EmergencyIncident, ApprovalItem } from '../../types';
import { formatCurrency } from '../../utils/guidelineCalculator';
import inspectionImg from '../../assets/images/room_inspection_damage_1790732024773.jpg';
import stormImg from '../../assets/images/storm_water_defense_1790732049014.jpg';
import craftsmanImg from '../../assets/images/restoration_craftsman_work_1790732036559.jpg';

interface OverviewDashboardProps {
  properties: Property[];
  moveOutCases: MoveOutCase[];
  insuranceClaims: InsuranceClaim[];
  emergencyIncidents: EmergencyIncident[];
  approvals: ApprovalItem[];
  onNavigateTab: (tab: 'inspection' | 'insurance' | 'contractors' | 'emergency' | 'approvals' | 'properties') => void;
  onSelectCase: (caseItem: MoveOutCase) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  properties,
  moveOutCases,
  insuranceClaims,
  emergencyIncidents,
  approvals,
  onNavigateTab,
  onSelectCase,
}) => {
  const tokaiProperties = properties.filter(p => p.region === 'tokai');
  const osakaProperties = properties.filter(p => p.region === 'osaka');
  const totalUnits = properties.reduce((acc, p) => acc + p.units, 0);
  const occupiedUnits = properties.reduce((acc, p) => acc + p.occupiedUnits, 0);
  const occupancyRate = ((occupiedUnits / totalUnits) * 100).toFixed(1);

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const activeEmergencies = emergencyIncidents.filter(e => e.status !== 'closed');
  
  // Total insurance recovery
  const totalInsuranceRecovered = insuranceClaims.reduce((acc, c) => acc + (c.approvedPayout || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Strategic Header & Tokai Storm Advisory Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium tracking-wide">
              <span>東海27棟（502室）</span>
              <span>·</span>
              <span>大阪7棟（118室）</span>
              <span>·</span>
              <span>社長集中解消オペレーション</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-1 text-white">
              管理物件拡大に伴う「増えても回る」自律運行プラットフォーム
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              退去立会い・国交省ガイドライン準拠の精算、保険適用範囲の整理、直属職人ネットワークの開拓、
              および東海地方の突発豪雨・水漏れ初動マニュアルを統合。現場委任決済ルールにより社長の判断負担を78%軽減。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('emergency')}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-slate-950" />
              <span>大雨・突発対応本部 ({activeEmergencies.length}件稼働)</span>
            </button>
            <button
              onClick={() => onNavigateTab('approvals')}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <span>承認トレイ ({pendingApprovals.length})</span>
            </button>
          </div>
        </div>

        {/* Real-time Triage Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">管理総室数 / 入居率</span>
            <span className="text-base font-semibold text-white font-mono tabular-nums">
              {totalUnits}室 <span className="text-emerald-400 text-sm">({occupancyRate}%)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">退去〜原状回復リードタイム</span>
            <span className="text-base font-semibold text-white font-mono tabular-nums">
              10.8日 <span className="text-slate-400 text-xs">(旧体制比 -51%)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">保険求償による削減累計</span>
            <span className="text-base font-semibold text-emerald-400 font-mono tabular-nums">
              {formatCurrency(totalInsuranceRecovered)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">現場委任決裁率 (社長脱依存)</span>
            <span className="text-base font-semibold text-blue-400 font-mono tabular-nums">
              78.4% <span className="text-slate-400 text-xs">(5万以下現場即決)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3 Pillars Action Grid (Visual Hero Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: Move-Out Settlement */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs group">
          <div className="relative h-44 overflow-hidden bg-slate-100">
            <img 
              src={inspectionImg} 
              alt="賃貸退去立会い現場写真" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex items-end p-4">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                01. 退去立会い & 適正精算
              </span>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                国交省ガイドライン準拠 3方分担精算
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                入居期間（月割）に応じたクロス・CFの残存価値（6年で1円）を自動算出。入居者・オーナー・保険の三方分担を可視化し、言った言わないの紛争を根絶します。
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                進行中案件: {moveOutCases.length}件
              </span>
              <button
                onClick={() => onNavigateTab('inspection')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>精算シートを開く</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Pillar 2: Emergency & Torrential Rain */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs group">
          <div className="relative h-44 overflow-hidden bg-slate-100">
            <img 
              src={stormImg} 
              alt="東海大雨・建物漏水対策" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex items-end p-4">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                02. 東海大雨・突発トラブル即決
              </span>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                現場即決マトリクス & 緊急駆けつけ
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                東海豪雨や夜間漏水など突発災害時、5万円以下の一次養生・緊急止水は現場スタッフ判断で即発注。社長の電話承認を待たずに30分で被害拡大を食い止めます。
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-amber-700 font-medium">
                要警戒物件: {properties.filter(p => p.emergencyRiskLevel === 'high').length}棟 (河川・浸水エリア)
              </span>
              <button
                onClick={() => onNavigateTab('emergency')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>初動マニュアル</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Pillar 3: Craftsman Network & Direct Orders */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs group">
          <div className="relative h-44 overflow-hidden bg-slate-100">
            <img 
              src={craftsmanImg} 
              alt="原状回復職人ネットワーク" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex items-end p-4">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                03. 職人直発注 & コスト最適化
              </span>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                中間マージン排除と協力会社ネットワーク
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                大手リフォーム会社を挟まず、東海（名東・尾張・西三河・岐阜）と大阪の専門職人に直接発注。クロス㎡850円〜、美装1K 24,000円〜で修繕費を平均18.4%削減。
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                提携職人: 7社 (即日駆けつけ対応可)
              </span>
              <button
                onClick={() => onNavigateTab('contractors')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>職人カルテを見る</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Two Columns: Recent Move-Outs & Urgent Incidents / Delegation Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Recent Move-Out Cases & Settlement Status */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                直近の退去立会い・原状回復案件
              </h3>
              <p className="text-xs text-slate-500">
                東海27棟・大阪7棟の退去精算進捗および三方分担状況
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('inspection')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              全件一覧
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {moveOutCases.map((c) => (
              <div 
                key={c.id} 
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-lg transition-colors cursor-pointer"
                onClick={() => onSelectCase(c)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {c.propertyName} {c.roomNumber}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ({c.region === 'tokai' ? '東海' : '大阪'})
                    </span>
                    <span className="text-[11px] text-slate-500">·</span>
                    <span className="text-[11px] text-slate-600">
                      {c.tenantName}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2">
                    <span>入居: {c.tenancyMonths}ヶ月</span>
                    <span>·</span>
                    <span>立会日: {c.inspectionDate}</span>
                    <span>·</span>
                    <span>検査員: {c.inspectorName}</span>
                  </div>

                  {c.insuranceTotal > 0 && (
                    <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm inline-block">
                      保険請求対象: {formatCurrency(c.insuranceTotal)} (オーナー実質負担 0円)
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">
                    修繕総額: <span className="font-semibold text-slate-900 font-mono tabular-nums">{formatCurrency(c.totalRepairCost)}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    入居者請求: <span className="font-semibold text-blue-700 font-mono tabular-nums">{formatCurrency(c.tenantTotal)}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-0.5">
                    敷金返還: <span className="font-mono tabular-nums">{formatCurrency(c.depositRefund)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Delegation Framework & Quick Decision Matrix */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Approval Delegation Matrix (脱・社長ボトルネックの核心) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  権限委任ルール (社長決裁基準)
                </h3>
                <p className="text-xs text-slate-500">
                  金額と事案に応じた3段階の自律判断フロー
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Level 1: 現場即決 (社長承認不要)</span>
                  <span className="text-[11px] text-emerald-700 font-semibold font-mono tabular-nums">〜5万円未満</span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  大雨時の止水・土のう・応急養生、ガイドライン通りの通常退去精算。現場担当者がその場で発注可能。
                </p>
              </div>

              <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">Level 2: 事務局・リーダー決済</span>
                  <span className="text-[11px] text-blue-700 font-semibold font-mono tabular-nums">5万〜20万円未満</span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  保険求償の先行発注、クリーニング特約適用、標準原状回復工事。事務局長・管理リーダーが当日決済。
                </p>
              </div>

              <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">Level 3: 社長 最終決裁</span>
                  <span className="text-[11px] text-rose-700 font-semibold font-mono tabular-nums">20万円超 / 紛争案件</span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  ペット規約違反・入居者との過失割合対立、例外的な会社費用負担など重要判断のみ社長に上申。
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                社長決済待ち: <strong className="text-rose-600 font-mono">1件</strong> (サンライズ一宮)
              </span>
              <button
                onClick={() => onNavigateTab('approvals')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                承認トレイへ
              </button>
            </div>
          </div>

          {/* Regional Property Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              エリア別 管理稼働サマリー
            </h3>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500">東海エリア</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  27棟 <span className="text-xs font-normal text-slate-600">/ 502室</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  名古屋14棟、一宮、春日井、刈谷、豊田、岐阜4棟、四日市等
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500">大阪エリア</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  7棟 <span className="text-xs font-normal text-slate-600">/ 118室</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  北区天満、淀川区西中島、西区新町、中央区、堺東等
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 text-right">
              <button
                onClick={() => onNavigateTab('properties')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                34棟 物件カルテを開く →
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
