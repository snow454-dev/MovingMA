import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  Plus, 
  Home, 
  CheckCircle2 
} from 'lucide-react';
import { Property, Region } from '../../types';

interface PropertyListProps {
  properties: Property[];
  onStartMoveOutForProperty: (property: Property) => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  onStartMoveOutForProperty,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'tokai' | 'osaka'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high'>('all');

  const filtered = properties.filter(p => {
    const matchesRegion = selectedRegion === 'all' || p.region === selectedRegion;
    const matchesRisk = riskFilter === 'all' || p.emergencyRiskLevel === 'high';
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesRisk && matchesSearch;
  });

  const tokaiCount = properties.filter(p => p.region === 'tokai').length;
  const osakaCount = properties.filter(p => p.region === 'osaka').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>管理棟数 34棟 台帳（総戸数 620室）</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mt-1">
              東海27棟・大阪7棟 物件・設備カルテ
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              物件ごとの構造、築年数、入居状況、専属職人、および大雨時のハザード警戒情報を一元管理。
              退去立会い発生時に即時で部屋カルテ・設備年数を参照できます。
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">東海エリア</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {tokaiCount}棟 <span className="text-xs text-slate-400 font-normal">(502室)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">大阪エリア</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {osakaCount}棟 <span className="text-xs text-slate-400 font-normal">(118室)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">全体平均入居率</span>
            <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
              97.1%
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">浸水・豪雨重点警戒棟</span>
            <span className="text-base font-bold text-amber-400 font-mono tabular-nums">
              {properties.filter(p => p.emergencyRiskLevel === 'high').length}棟
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="物件名・市区町村・住所で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedRegion === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              全34棟
            </button>
            <button
              onClick={() => setSelectedRegion('tokai')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedRegion === 'tokai' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              東海 (27棟)
            </button>
            <button
              onClick={() => setSelectedRegion('osaka')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedRegion === 'osaka' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              大阪 (7棟)
            </button>
          </div>

          <button
            onClick={() => setRiskFilter(riskFilter === 'all' ? 'high' : 'all')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              riskFilter === 'high' ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>大雨要警戒物件のみ</span>
          </button>
        </div>

        <div className="text-xs text-slate-500">
          表示中: <strong className="text-slate-900 font-mono">{filtered.length}棟</strong>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const occupancy = ((p.occupiedUnits / p.units) * 100).toFixed(0);
          return (
            <div 
              key={p.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {p.prefecture} · {p.city}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {p.name}
                    </h3>
                  </div>

                  {p.emergencyRiskLevel === 'high' ? (
                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>水害注意</span>
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {p.structure}造
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{p.address}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">総戸数 / 入居</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums">
                      {p.occupiedUnits} / {p.units}室
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">稼働率</span>
                    <span className="font-bold text-emerald-600 font-mono tabular-nums">
                      {occupancy}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">築年数</span>
                    <span className="font-bold text-slate-700 font-mono tabular-nums">
                      {p.yearBuilt}年 ({2026 - p.yearBuilt}年)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{p.id}</span>
                <button
                  onClick={() => onStartMoveOutForProperty(p)}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>退去精算を開始</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
