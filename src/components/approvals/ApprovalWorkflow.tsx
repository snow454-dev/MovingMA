import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  Send, 
  BookOpen, 
  Building2, 
  Plus, 
  UserCheck 
} from 'lucide-react';
import { ApprovalItem } from '../../types';
import { formatCurrency } from '../../utils/guidelineCalculator';

interface ApprovalWorkflowProps {
  approvals: ApprovalItem[];
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
  onAddApproval: (item: ApprovalItem) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  approvals,
  onApprove,
  onReject,
  onAddApproval,
}) => {
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [presidentComment, setPresidentComment] = useState('');
  const [isNewApprovalOpen, setIsNewApprovalOpen] = useState(false);

  // Exception knowledge logs created from past decisions
  const [knowledgeLogs, setKnowledgeLogs] = useState([
    {
      id: 'k-1',
      title: 'ペット無断飼育に伴うオゾン脱臭費用の借主負担請求',
      decisionRule: '原則として壁下地ボード交換・オゾン脱臭費用は全額借主過失として請求。ただし築15年超物件でオーナーが次回フルリノベーションを計画している場合は、会社負担ではなくオーナー折半（借主70%:オーナー30%）で協議成立させる。',
      author: '社長 判断ナレッジ (2026年改定)',
      category: '退去精算例外',
    },
    {
      id: 'k-2',
      title: '東海大雨による1階ベランダサッシ吹き込みの火災保険申請',
      decisionRule: 'サッシの水切りゴムパッキン劣化があっても、降雨量50mm/h超の場合は風水災事故として保険会社に申請可能。入居者との過失争いにせず全額保険求償で進めること。',
      author: '社長 判断ナレッジ',
      category: '保険求償判断',
    },
    {
      id: 'k-3',
      title: '法人契約（社宅）の原状回復ガイドライン適用除外特約',
      decisionRule: '法人契約で「クロス全面借主負担特約」がある場合でも、6年耐用年数経過を理由に減額交渉が入った場合は、法人総務と揉めず美装代金のみ借主負担、クロスはオーナー資産償却として合意して良い（上限10万円まで事務局決済可能）。',
      author: '社長 判断ナレッジ',
      category: '退去精算例外',
    }
  ]);

  const filteredApprovals = approvals.filter(a => {
    if (activeFilter === 'pending') return a.status === 'pending';
    if (activeFilter === 'approved') return a.status === 'approved';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>社長集中解消 · 段階的自律決裁システム</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mt-1">
              承認・例外判断ワークフロー & ナレッジハブ
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              社長がすべての退去精算や修繕見積を個別チェックする体制を脱却。
              Level 1（現場5万以下）、Level 2（事務局5〜20万）、Level 3（社長20万超・重大例外）に権限を階層化し、
              過去の判断基準をルールとして自動蓄積します。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewApprovalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>例外案件を上申する</span>
            </button>
          </div>
        </div>

        {/* Real-time Triage Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">社長決裁 待ち件数</span>
            <span className="text-base font-bold text-rose-400 font-mono tabular-nums">
              {approvals.filter(a => a.level === 3 && a.status === 'pending').length}件 <span className="text-xs text-slate-400 font-normal">(最優先)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">事務局・リーダー 承認待ち</span>
            <span className="text-base font-bold text-amber-400 font-mono tabular-nums">
              {approvals.filter(a => a.level === 2 && a.status === 'pending').length}件
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">現場即決（承認不要化）率</span>
            <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
              78.4% <span className="text-xs text-slate-400 font-normal">(日常修繕・通常退去)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">判断ナレッジ登録数</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {knowledgeLogs.length}件 <span className="text-xs text-slate-400 font-normal">(マニュアル化推進)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Approvals Queue + Knowledge Base */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Approval Queue */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                承認待ちトレイ ({filteredApprovals.length}件)
              </h3>
              <p className="text-xs text-slate-500">
                社長および管理リーダーのワンクリック決裁
              </p>
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  activeFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                承認待ち
              </button>
              <button
                onClick={() => setActiveFilter('approved')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  activeFilter === 'approved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                承認済
              </button>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                全件
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredApprovals.map((item) => (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border text-xs space-y-3 transition-colors ${
                  item.level === 3 ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        item.level === 3 ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        Level {item.level}: {item.level === 3 ? '社長最終決裁' : '事務局・リーダー承認'}
                      </span>
                      <span className="font-mono text-slate-500">{item.id}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-medium">{item.propertyName} {item.roomNumber}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {item.title}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-slate-500 block text-[11px]">決済申請額</span>
                    <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                  <div className="text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900 block mb-0.5">【上申理由・判断の背景】</span>
                    {item.justification}
                  </div>

                  {item.threeWaySplitSummary && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span>入居者請求: <strong className="font-mono text-slate-900">{formatCurrency(item.threeWaySplitSummary.tenant)}</strong></span>
                      <span>保険充当: <strong className="font-mono text-amber-700">{formatCurrency(item.threeWaySplitSummary.insurance)}</strong></span>
                      <span>オーナー負担: <strong className="font-mono text-slate-700">{formatCurrency(item.threeWaySplitSummary.owner)}</strong></span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-slate-500">
                  <div className="text-[11px]">
                    申請者: {item.requestedBy} ({item.requestedAt})
                  </div>

                  {item.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const reason = prompt('差戻し・再調査の指示理由を入力してください:');
                          if (reason) {
                            onReject(item.id, reason);
                            alert('案件を差戻しました。');
                          }
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors cursor-pointer"
                      >
                        差戻し
                      </button>

                      <button
                        onClick={() => {
                          const note = prompt('承認コメント（任意・ナレッジに蓄積されます）:');
                          onApprove(item.id, note || undefined);
                          alert('社長決裁を完了しました。現場へ通知されます。');
                        }}
                        className="px-3 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium rounded transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>承認・決裁を執行</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>決裁完了</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Exception Knowledge Base */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>例外判断ナレッジベース</span>
              </h3>
              <span className="text-[11px] text-slate-400">マニュアル自動更新</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              社長が過去に決裁した例外対応をルール化。「次回から現場・事務員が自己判断できる状態」をつくり、同じ質問を社長へ投げるのを防ぎます。
            </p>

            <div className="space-y-3 pt-1">
              {knowledgeLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{log.title}</span>
                    <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {log.decisionRule}
                  </p>
                  <div className="text-[10px] text-slate-400 text-right">
                    {log.author}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => {
                  const title = prompt('ルール化する事例のタイトル:');
                  const rule = prompt('次回から適用する判断ルール:');
                  if (title && rule) {
                    setKnowledgeLogs(prev => [
                      {
                        id: `k-${Date.now()}`,
                        title,
                        decisionRule: rule,
                        author: '社長 判断ナレッジ',
                        category: '業務基準追加',
                      },
                      ...prev,
                    ]);
                    alert('ナレッジベースにルールを新規追加しました。');
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                + 新しい例外ルールを登録
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* New Approval Modal */}
      {isNewApprovalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">例外案件・重要修繕の上申</h3>
              <button
                onClick={() => setIsNewApprovalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const prop = (form.elements.namedItem('prop') as HTMLInputElement).value;
                const room = (form.elements.namedItem('room') as HTMLInputElement).value;
                const amount = Number((form.elements.namedItem('amount') as HTMLInputElement).value) || 150000;
                const level = amount > 200000 ? 3 : 2;
                const justification = (form.elements.namedItem('justification') as HTMLTextAreaElement).value;

                const newItem: ApprovalItem = {
                  id: `apv-${Date.now()}`,
                  title,
                  category: '退去精算例外',
                  amount,
                  requestedBy: '事務員・木村',
                  requestedAt: new Date().toLocaleDateString('ja-JP'),
                  level,
                  status: 'pending',
                  propertyName: prop,
                  roomNumber: room,
                  justification,
                  threeWaySplitSummary: {
                    tenant: Math.round(amount * 0.7),
                    owner: Math.round(amount * 0.3),
                    insurance: 0,
                  }
                };

                onAddApproval(newItem);
                setIsNewApprovalOpen(false);
                alert(`Level ${level} の承認トレイへ上申しました。`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-700 font-medium mb-1">件名</label>
                <input name="title" defaultValue="【例外対応】契約条項とガイドライン乖離に伴うオーナー負担協議" required className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">物件名</label>
                  <input name="prop" defaultValue="ベルハイツ東桜" required className="w-full border border-slate-300 rounded p-2" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">部屋番号</label>
                  <input name="room" defaultValue="503号室" required className="w-full border border-slate-300 rounded p-2" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">申請金額 (円)</label>
                <input name="amount" type="number" defaultValue="220000" required className="w-full border border-slate-300 rounded p-2" />
                <span className="text-[10px] text-slate-500">※20万円超は自動的に「社長最終決裁」に設定されます</span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">上申理由・例外の経緯</label>
                <textarea name="justification" rows={3} defaultValue="入居者からの減額要望に対し、ガイドライン耐用年数超過とオーナー側リフォーム計画を勘案し、会社負担を発生させずオーナー了解を得て決着させたい。" className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewApprovalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded font-medium"
                >
                  承認トレイへ上申
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
