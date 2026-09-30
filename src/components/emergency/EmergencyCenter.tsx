import React, { useState } from 'react';
import { 
  CloudRain, 
  AlertTriangle, 
  Zap, 
  CheckCircle, 
  Clock, 
  Plus, 
  FileText, 
  PhoneCall, 
  ShieldCheck, 
  Compass, 
  MapPin, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { EmergencyIncident, Property, Contractor } from '../../types';
import { formatCurrency } from '../../utils/guidelineCalculator';

interface EmergencyCenterProps {
  incidents: EmergencyIncident[];
  properties: Property[];
  contractors: Contractor[];
  onAddIncident: (incident: EmergencyIncident) => void;
  onUpdateIncidentStatus: (id: string, status: EmergencyIncident['status'], actionTaken?: string) => void;
}

export const EmergencyCenter: React.FC<EmergencyCenterProps> = ({
  incidents,
  properties,
  contractors,
  onAddIncident,
  onUpdateIncidentStatus,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);

  const activeIncidents = incidents.filter(i => i.status !== 'closed');
  const highRiskProperties = properties.filter(p => p.emergencyRiskLevel === 'high');

  return (
    <div className="space-y-6">
      
      {/* Heavy Rain & Disaster Command Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <CloudRain className="w-4 h-4" />
              <span>東海豪雨・台風・突発漏水 緊急対策オペレーション</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mt-1">
              突発災害トリアージ & 現場即決司令室
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              大雨時の冠水・バルコニー排水逆流・上階漏水などの緊急事態において、社長への電話確認を待たずに
              「委任規程（5万円以下即決権限）」に基づき即時業者出動。被害拡大を防ぎ、平時業務を止めない体制を実現します。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewIncidentOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>緊急トラブルを通報・起案</span>
            </button>
          </div>
        </div>

        {/* Real-time Triage Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">現在稼働中インシデント</span>
            <span className="text-base font-bold text-amber-400 font-mono tabular-nums">
              {activeIncidents.length}件 <span className="text-xs text-slate-400 font-normal">(出動中・対応中)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">現場即決対応率</span>
            <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
              100.0% <span className="text-xs text-slate-400 font-normal">(社長承認待ちゼロ)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">東海浸水要警戒物件</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {highRiskProperties.length}棟 <span className="text-xs text-slate-400 font-normal">(庄内川・長良川水系)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">平均初動駆けつけ時間</span>
            <span className="text-base font-bold text-blue-400 font-mono tabular-nums">
              34分 <span className="text-xs text-slate-400 font-normal">(指定職人直行)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Delegation Matrix (社長決裁ボトルネック解消の具体的ルール) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>突発トラブル対応 業務委任規程（脱・社長決裁マトリクス）</span>
            </h2>
            <p className="text-xs text-slate-500">
              「現場スタッフ・事務員がその場で判断・発注できる基準」を明文化
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded font-medium">
            社内規程 施行中
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950">① 現場即決（5万円未満）</span>
              <span className="text-[11px] text-emerald-700 font-semibold font-mono">社長承認 不要</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              <strong>【対象事象】</strong><br />
              ・大雨時の土のう設置・ブルーシート養生<br />
              ・緊急止水バルブ閉止・簡易パッキン交換<br />
              ・屋上・ベランダ目皿のゴミ除去高圧洗浄<br />
              ・入居者への簡易給水・タオル支給
            </p>
            <div className="text-[11px] text-emerald-800 font-medium pt-1 border-t border-emerald-100">
              現場担当者がその場で職人手配・即時決済可能。後から報告書1通で完了。
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950">② 事務局・リーダー決裁（5万〜20万円）</span>
              <span className="text-[11px] text-blue-700 font-semibold font-mono">当日スピード決済</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              <strong>【対象事象】</strong><br />
              ・給水管エルボ交換・床下開口調査<br />
              ・下階天井ボード張替え（火災保険充当見込み）<br />
              ・給湯器一時レンタル・仮設給湯器設置<br />
              ・高所作業車による外壁笠木緊急固定
            </p>
            <div className="text-[11px] text-blue-800 font-medium pt-1 border-t border-blue-100">
              事務局または業務主任がSlack/システム上で即時承認。保険求償とセット手配。
            </div>
          </div>

          <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-950">③ 社長決裁（20万円超）</span>
              <span className="text-[11px] text-rose-700 font-semibold font-mono">重大案件のみ集中</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              <strong>【対象事象】</strong><br />
              ・受水槽・加圧ポンプ全損交換<br />
              ・建物構造躯体からの大規模雨漏り<br />
              ・入居者との過失割合対立・法約特約係争<br />
              ・オーナーへの大規模修繕特別提案
            </p>
            <div className="text-[11px] text-rose-800 font-medium pt-1 border-t border-rose-100">
              社長は重要経営判断と大型出費にのみ注力。日常の突発対応から完全解放。
            </div>
          </div>
        </div>
      </div>

      {/* Incident Tickets & High Risk Buildings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 cols): Incident Ticket List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                突発対応インシデント台帳 ({incidents.length}件)
              </h3>
              <p className="text-xs text-slate-500">
                通報日時、現場判断根拠、出動職人および処置状況
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {incidents.map((incident) => (
              <div 
                key={incident.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{incident.id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-slate-900">
                      {incident.propertyName} {incident.roomNumber}
                    </span>
                    <span className="text-slate-500">({incident.region === 'tokai' ? '東海' : '大阪'})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono">{incident.reportedAt}</span>
                    {incident.status === 'dispatched' && (
                      <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold text-[11px]">
                        職人急行中
                      </span>
                    )}
                    {incident.status === 'repaired' && (
                      <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold text-[11px]">
                        処置完了
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-900">
                  {incident.title}
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900 block mb-0.5">【初動対応ログ】</span>
                  {incident.actionTaken}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>
                      決裁区分: <strong className="text-emerald-700">{incident.decidedBy}</strong>
                    </span>
                    <span>
                      概算費用: <strong className="font-mono text-slate-900">{formatCurrency(incident.costEstimate)}</strong>
                    </span>
                    {incident.assignedContractorName && (
                      <span>
                        出動先: <strong className="text-slate-800">{incident.assignedContractorName}</strong>
                      </span>
                    )}
                  </div>

                  {incident.status === 'dispatched' && (
                    <button
                      onClick={() => {
                        onUpdateIncidentStatus(incident.id, 'repaired', '現場作業員による給湯器一次止水および応急弁交換完了。入居者へ復旧説明済。');
                        alert('インシデントの処置完了を登録しました。');
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium cursor-pointer"
                    >
                      応急処置完了を登録
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (4 cols): Tokai Flood Warning Watchlist */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>東海大雨重点警戒物件 ({highRiskProperties.length}棟)</span>
            </h3>
            <p className="text-slate-500 text-[11px]">
              過去の浸水履歴・河川近接・低地アンダーパス周辺物件
            </p>

            <div className="space-y-2">
              {highRiskProperties.map(p => (
                <div key={p.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{p.name}</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-semibold px-1.5 py-0.2 rounded">
                      水害警戒
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {p.city} {p.address} ({p.units}室)
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    対策: 止水板・土のう配備済 / 排水ポンプ定期点検
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Dial Craftsman Directory */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>緊急駆けつけ専用ホットライン</span>
            </h3>
            
            <div className="space-y-2">
              {contractors.filter(c => c.emergencyAvailable).map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                  <div>
                    <div className="font-bold text-slate-900">{c.companyName}</div>
                    <div className="text-[11px] text-slate-500">{c.baseArea}</div>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="px-2.5 py-1 bg-slate-900 text-white rounded font-mono text-[11px] hover:bg-slate-800"
                  >
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* New Incident Modal */}
      {isNewIncidentOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">突発緊急トラブルの通報・起案</h3>
              <button
                onClick={() => setIsNewIncidentOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const propId = (form.elements.namedItem('propertyId') as HTMLSelectElement).value;
                const prop = properties.find(p => p.id === propId) || properties[0];
                const room = (form.elements.namedItem('roomNumber') as HTMLInputElement).value;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const cost = Number((form.elements.namedItem('cost') as HTMLInputElement).value) || 20000;
                const contractor = (form.elements.namedItem('contractor') as HTMLSelectElement).value;
                const action = (form.elements.namedItem('action') as HTMLTextAreaElement).value;

                const newIncident: EmergencyIncident = {
                  id: `emg-${Date.now()}`,
                  propertyId: prop.id,
                  propertyName: prop.name,
                  roomNumber: room,
                  region: prop.region,
                  title,
                  category: 'upper_floor_leak',
                  reportedAt: new Date().toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' }),
                  urgency: 'immediate_dispatch',
                  status: 'dispatched',
                  costEstimate: cost,
                  delegationEligible: cost <= 50000,
                  decidedBy: cost <= 50000 ? '現場即決（委任規程第4条）' : '事務局承認',
                  assignedContractorName: contractor,
                  actionTaken: action,
                  insuranceClaimTarget: false,
                };

                onAddIncident(newIncident);
                setIsNewIncidentOpen(false);
                alert('緊急インシデントを起案し、職人へ駆けつけ要請を行いました。');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-700 font-medium mb-1">対象物件</label>
                <select name="propertyId" className="w-full border border-slate-300 rounded p-2 bg-white">
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>[{p.region === 'tokai' ? '東海' : '大阪'}] {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">部屋番号または共用部</label>
                <input name="roomNumber" defaultValue="共用部・エントランス" required className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">事象タイトル</label>
                <input name="title" defaultValue="豪雨による外部排水溝越水および止水板緊急設置" required className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">概算費用 (円)</label>
                  <input name="cost" type="number" defaultValue="25000" required className="w-full border border-slate-300 rounded p-2" />
                  <span className="text-[10px] text-emerald-600 block mt-0.5">※5万円以下なら現場判断で即決可能</span>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">出動要請先</label>
                  <select name="contractor" className="w-full border border-slate-300 rounded p-2 bg-white">
                    {contractors.filter(c => c.emergencyAvailable).map(c => (
                      <option key={c.id} value={c.companyName}>{c.companyName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">初動対応内容・指示事項</label>
                <textarea name="action" rows={3} defaultValue="入居者電話受付後、土のう設置と排水桝の異物除去を職人へ依頼。社長承認を待たず即時出動指示完了。" className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewIncidentOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded"
                >
                  現場即決で緊急出動
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
