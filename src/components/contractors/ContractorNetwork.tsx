import React, { useState } from 'react';
import { 
  Hammer, 
  Phone, 
  MapPin, 
  Zap, 
  Star, 
  Search, 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  Shield, 
  TrendingDown, 
  UserCheck 
} from 'lucide-react';
import { Contractor, WorkOrder, TradeType } from '../../types';
import { formatCurrency } from '../../utils/guidelineCalculator';

interface ContractorNetworkProps {
  contractors: Contractor[];
  workOrders: WorkOrder[];
  onAddContractor: (contractor: Contractor) => void;
  onCreateWorkOrder: (order: WorkOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: WorkOrder['status']) => void;
}

export const ContractorNetwork: React.FC<ContractorNetworkProps> = ({
  contractors,
  workOrders,
  onAddContractor,
  onCreateWorkOrder,
  onUpdateOrderStatus,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'tokai' | 'osaka'>('all');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewContractorOpen, setIsNewContractorOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  const filteredContractors = contractors.filter(c => {
    const matchesRegion = selectedRegion === 'all' || c.region === selectedRegion || c.region === 'both';
    const matchesTrade = selectedTrade === 'all' || c.trades.includes(selectedTrade as TradeType);
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.baseArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesTrade && matchesSearch;
  });

  const getTradeLabel = (trade: TradeType) => {
    switch (trade) {
      case 'interior_cross': return '内装クロス・CF';
      case 'cleaning': return '美装・クリーニング';
      case 'plumbing': return '給排水管・設備';
      case 'electrical': return '電気・エアコン';
      case 'carpentry': return '大工・木工サッシ';
      case 'multitask': return '多能工 (総合補修)';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Cost Optimization Metric */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Hammer className="w-4 h-4 text-blue-400" />
              <span>直属職人ネットワーク · 中間マージン完全排除</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mt-1">
              原状回復 専属職人・協力会社マネジメント
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              大手元請けのリフォームマージン（30〜40%）をカットし、東海27棟・大阪7棟のエリア専属職人とダイレクト連携。
              大雨時・夜間の緊急駆けつけ体制を構築し、退去から募集開始までのリードタイムを10日台へ短縮します。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewContractorOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新規職人・協力会社を登録</span>
            </button>
          </div>
        </div>

        {/* Contractor Network Performance Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">提携専門職人数</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {contractors.length}社 <span className="text-xs text-slate-400 font-normal">(東海 5社 / 大阪 2社)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">緊急駆けつけ対応可能</span>
            <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
              {contractors.filter(c => c.emergencyAvailable).length}社 <span className="text-xs text-slate-400 font-normal">(大雨・水漏れ即時出動)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">クロス平均施工単価</span>
            <span className="text-base font-bold text-slate-200 font-mono tabular-nums">
              ¥875/㎡ <span className="text-xs text-emerald-400 font-normal">(相場1,200円比 -27%)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">年間中間マージン削減</span>
            <span className="text-base font-bold text-blue-400 font-mono tabular-nums">
              約 ¥4,820,000 <span className="text-xs text-slate-400 font-normal">/年</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search */}
          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="職人名・会社名・担当エリアで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
            />
          </div>

          {/* Region filter */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedRegion === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全地域
            </button>
            <button
              onClick={() => setSelectedRegion('tokai')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedRegion === 'tokai' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              東海 (名古屋・岐阜・三重)
            </button>
            <button
              onClick={() => setSelectedRegion('osaka')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedRegion === 'osaka' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              大阪 (市内・堺・北摂)
            </button>
          </div>

          {/* Trade Filter */}
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700"
          >
            <option value="all">全職種・工種</option>
            <option value="interior_cross">内装クロス・CF</option>
            <option value="cleaning">美装・ハウスクリーニング</option>
            <option value="plumbing">水道・給排水管設備</option>
            <option value="electrical">電気・エアコン</option>
            <option value="carpentry">大工・木工補修</option>
            <option value="multitask">多能工</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          該当: <strong className="text-slate-900">{filteredContractors.length}社</strong>
        </div>
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContractors.map((c) => (
          <div 
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <span>{c.region === 'tokai' ? '東海エリア' : c.region === 'osaka' ? '大阪エリア' : '両対応'}</span>
                    <span>·</span>
                    <span className="flex items-center text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline mr-0.5" />
                      {c.reliabilityScore.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {c.companyName}
                  </h3>
                  <div className="text-xs text-slate-600">
                    代表・親方: <strong className="text-slate-800">{c.name}</strong>
                  </div>
                </div>

                {c.emergencyAvailable && (
                  <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1 shrink-0">
                    <Zap className="w-3 h-3 text-amber-600" />
                    <span>即日出動可</span>
                  </span>
                )}
              </div>

              {/* Trades */}
              <div className="flex flex-wrap gap-1">
                {c.trades.map((t) => (
                  <span key={t} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {getTradeLabel(t)}
                  </span>
                ))}
              </div>

              {/* Base Area & Phone */}
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{c.baseArea}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono">{c.phone}</span>
                </div>
              </div>

              {/* Rate Card Preview */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                <div className="font-semibold text-slate-700 text-[11px] mb-1">【協定参考単価】</div>
                {c.unitRates.clothPerSqm && (
                  <div className="flex justify-between text-slate-600">
                    <span>量産クロス:</span>
                    <strong className="font-mono text-slate-900">{formatCurrency(c.unitRates.clothPerSqm)}/㎡</strong>
                  </div>
                )}
                {c.unitRates.cfPerSqm && (
                  <div className="flex justify-between text-slate-600">
                    <span>クッションフロア:</span>
                    <strong className="font-mono text-slate-900">{formatCurrency(c.unitRates.cfPerSqm)}/㎡</strong>
                  </div>
                )}
                {c.unitRates.oneRoomCleaning && (
                  <div className="flex justify-between text-slate-600">
                    <span>1K空室丸ごと美装:</span>
                    <strong className="font-mono text-slate-900">{formatCurrency(c.unitRates.oneRoomCleaning)}</strong>
                  </div>
                )}
                {c.unitRates.hourlyRate && (
                  <div className="flex justify-between text-slate-600">
                    <span>緊急設備出張工賃:</span>
                    <strong className="font-mono text-slate-900">{formatCurrency(c.unitRates.hourlyRate)}/h</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                初動スピード: <span className="text-slate-700 font-medium">{c.speedRating}</span>
              </span>

              <button
                onClick={() => {
                  setSelectedContractor(c);
                  setIsOrderModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors cursor-pointer"
              >
                工事を発注
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Work Orders */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              進行中 原状回復工事・発注台帳 ({workOrders.length}件)
            </h3>
            <p className="text-xs text-slate-500">
              工程管理、完了検査、検収および請求状況
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">発注番号・物件名</th>
                <th className="py-2.5 px-3">施工業者名</th>
                <th className="py-2.5 px-3">工種・工事件名</th>
                <th className="py-2.5 px-2 text-right">発注金額</th>
                <th className="py-2.5 px-3">完了予定日</th>
                <th className="py-2.5 px-3 text-center">進捗状況</th>
                <th className="py-2.5 px-3 text-center">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-mono font-semibold text-slate-900">{wo.id}</div>
                    <div className="text-slate-600 mt-0.5">{wo.propertyName} {wo.roomNumber}</div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{wo.contractorName}</div>
                    <div className="text-[11px] text-slate-500">{getTradeLabel(wo.trade)}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-900">{wo.title}</div>
                    <div className="text-[11px] text-slate-400">発注日: {wo.orderDate}</div>
                  </td>

                  <td className="py-3 px-2 text-right font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(wo.estimatedCost)}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap font-mono">
                    {wo.targetCompletionDate}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {wo.status === 'in_progress' && (
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium text-[11px]">
                        施工中
                      </span>
                    )}
                    {wo.status === 'ordered' && (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium text-[11px]">
                        職人受託済
                      </span>
                    )}
                    {wo.status === 'inspection_passed' && (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium text-[11px]">
                        完了検査合格
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {wo.status === 'in_progress' ? (
                      <button
                        onClick={() => {
                          onUpdateOrderStatus(wo.id, 'inspection_passed');
                          alert('原状回復工事の完了検収を完了し、客付け可能状態に更新しました。');
                        }}
                        className="px-2.5 py-1 text-[11px] bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        完了検査・検収
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">検収完了</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Work Order Modal */}
      {isOrderModalOpen && selectedContractor && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">工事発注書の作成</h3>
                <span className="text-slate-500">発注先: {selectedContractor.companyName}</span>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const prop = (form.elements.namedItem('prop') as HTMLInputElement).value;
                const room = (form.elements.namedItem('room') as HTMLInputElement).value;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const cost = Number((form.elements.namedItem('cost') as HTMLInputElement).value) || 30000;
                const targetDate = (form.elements.namedItem('targetDate') as HTMLInputElement).value;

                const newOrder: WorkOrder = {
                  id: `wo-${Date.now()}`,
                  caseId: 'direct-order',
                  propertyName: prop,
                  roomNumber: room,
                  contractorId: selectedContractor.id,
                  contractorName: selectedContractor.companyName,
                  trade: selectedContractor.trades[0],
                  title,
                  targetCompletionDate: targetDate,
                  estimatedCost: cost,
                  status: 'ordered',
                  orderDate: '2026-09-29',
                };

                onCreateWorkOrder(newOrder);
                setIsOrderModalOpen(false);
                alert(`${selectedContractor.companyName} 様へ工事発注書を電送しました。`);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">施工物件名</label>
                  <input name="prop" defaultValue="プレジール千種" required className="w-full border border-slate-300 rounded p-2" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">部屋番号</label>
                  <input name="room" defaultValue="402号室" required className="w-full border border-slate-300 rounded p-2" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">工事名称・施工内容</label>
                <input name="title" defaultValue="洋室壁クロス貼替及び退去後ルームクリーニング" required className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">発注金額 (税込)</label>
                  <input name="cost" type="number" defaultValue="38500" required className="w-full border border-slate-300 rounded p-2" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">完了希望日</label>
                  <input name="targetDate" type="date" defaultValue="2026-10-06" required className="w-full border border-slate-300 rounded p-2" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded font-medium"
                >
                  職人へ発注書を電送
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Contractor Modal */}
      {isNewContractorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">新規 専属職人・協力会社の登録</h3>
              <button
                onClick={() => setIsNewContractorOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const company = (form.elements.namedItem('company') as HTMLInputElement).value;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const region = (form.elements.namedItem('region') as HTMLSelectElement).value as 'tokai' | 'osaka';
                const area = (form.elements.namedItem('area') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                const trade = (form.elements.namedItem('trade') as HTMLSelectElement).value as TradeType;
                const emergency = (form.elements.namedItem('emergency') as HTMLInputElement).checked;

                const newC: Contractor = {
                  id: `ct-${Date.now()}`,
                  companyName: company,
                  name,
                  region,
                  baseArea: area,
                  trades: [trade],
                  phone,
                  emergencyAvailable: emergency,
                  reliabilityScore: 5.0,
                  speedRating: emergency ? '即日駆けつけ可' : '2-3日以内',
                  status: 'active',
                  unitRates: {
                    clothPerSqm: 880,
                    cfPerSqm: 2200,
                  }
                };

                onAddContractor(newC);
                setIsNewContractorOpen(false);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">会社名・屋号</label>
                  <input name="company" defaultValue="尾張インテリアワークス" required className="w-full border border-slate-300 rounded p-2" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">代表者名</label>
                  <input name="name" defaultValue="加納 伸一" required className="w-full border border-slate-300 rounded p-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">担当地域</label>
                  <select name="region" className="w-full border border-slate-300 rounded p-2 bg-white">
                    <option value="tokai">東海エリア (愛知・岐阜・三重)</option>
                    <option value="osaka">大阪エリア (大阪府内)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">主要工種</label>
                  <select name="trade" className="w-full border border-slate-300 rounded p-2 bg-white">
                    <option value="interior_cross">内装クロス・床CF</option>
                    <option value="cleaning">ハウスクリーニング・美装</option>
                    <option value="plumbing">給排水管・水まわり設備</option>
                    <option value="electrical">電気・エアコン</option>
                    <option value="multitask">多能工 (総合補修)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">対応エリア詳細</label>
                <input name="area" defaultValue="一宮市・稲沢市・北名古屋市・岐阜南部" required className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">電話番号</label>
                  <input name="phone" defaultValue="090-3321-99xx" required className="w-full border border-slate-300 rounded p-2" />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="emergency" type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="font-medium text-slate-800">大雨・漏水等の即日急行可</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewContractorOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded font-medium"
                >
                  職人ネットワークに追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
