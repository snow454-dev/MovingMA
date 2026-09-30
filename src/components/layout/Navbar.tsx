import React from 'react';
import { 
  Building2, 
  ClipboardCheck, 
  ShieldAlert, 
  Users, 
  CloudRain, 
  CheckSquare, 
  FolderKanban,
  Plus
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'inspection'
  | 'insurance'
  | 'contractors'
  | 'emergency'
  | 'approvals'
  | 'properties';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingApprovalsCount: number;
  activeEmergenciesCount: number;
  onOpenNewCase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  pendingApprovalsCount,
  activeEmergenciesCount,
  onOpenNewCase,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('dashboard')}
              className="text-left group cursor-pointer"
            >
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                RenovaOps
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2 font-normal">
                東海・大阪 賃貸オペレーション統括
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              総合ダッシュボード
            </button>

            <button
              onClick={() => onTabChange('inspection')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'inspection'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              退去立会い・精算
            </button>

            <button
              onClick={() => onTabChange('insurance')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'insurance'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              保険適用・求償
            </button>

            <button
              onClick={() => onTabChange('contractors')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'contractors'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              職人ネットワーク
            </button>

            <button
              onClick={() => onTabChange('emergency')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'emergency'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>突発・大雨対策</span>
              {activeEmergenciesCount > 0 && (
                <span className="text-[10px] bg-amber-500 text-white rounded-full px-1.5 py-0.2 font-mono">
                  {activeEmergenciesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('approvals')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'approvals'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>承認・例外決裁</span>
              {pendingApprovalsCount > 0 && (
                <span className="text-[10px] bg-rose-600 text-white rounded-full px-1.5 py-0.2 font-mono">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('properties')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'properties'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              管理34棟台帳
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 border-r border-slate-200 pr-3 mr-1">
              <span>東海27棟 (約500室)</span>
              <span>·</span>
              <span>大阪7棟 (約120室)</span>
            </div>
            
            <button
              onClick={onOpenNewCase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>退去案件を起案</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile nav scrollable bar */}
      <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 py-2 overflow-x-auto flex space-x-2">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentTab === 'dashboard' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'
          }`}
        >
          ダッシュボード
        </button>
        <button
          onClick={() => onTabChange('inspection')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentTab === 'inspection' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'
          }`}
        >
          退去精算
        </button>
        <button
          onClick={() => onTabChange('insurance')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentTab === 'insurance' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'
          }`}
        >
          保険適用
        </button>
        <button
          onClick={() => onTabChange('contractors')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentTab === 'contractors' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'
          }`}
        >
          職人一覧
        </button>
        <button
          onClick={() => onTabChange('emergency')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentTab === 'emergency' ? 'bg-amber-100 font-semibold text-amber-900' : 'text-slate-600'
          }`}
        >
          突発大雨
        </button>
        <button
          onClick={() => onTabChange('approvals')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentTab === 'approvals' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'
          }`}
        >
          承認 ({pendingApprovalsCount})
        </button>
        <button
          onClick={() => onTabChange('properties')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentTab === 'properties' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'
          }`}
        >
          34棟台帳
        </button>
      </div>
    </header>
  );
};
