import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  FileCheck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Coins, 
  FileText,
  Search,
  ExternalLink
} from 'lucide-react';
import { InsuranceClaim, Property } from '../../types';
import { formatCurrency } from '../../utils/guidelineCalculator';

interface InsuranceManagerProps {
  claims: InsuranceClaim[];
  properties: Property[];
  onAddClaim: (claim: InsuranceClaim) => void;
  onUpdateClaimStatus: (id: string, status: InsuranceClaim['status'], payout?: number) => void;
}

export const InsuranceManager: React.FC<InsuranceManagerProps> = ({
  claims,
  properties,
  onAddClaim,
  onUpdateClaimStatus,
}) => {
  const [selectedIncidentType, setSelectedIncidentType] = useState<string>('torrential_rain');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);

  // Diagnostic Matrix
  const diagnosticGuides: Record<string, {
    title: string;
    applicableInsurance: string;
    payer: string;
    keyPoints: string;
    documentsRequired: string[];
    typicalDeductible: string;
  }> = {
    torrential_rain: {
      title: '東海集中豪雨・台風による浸水・サッシ吹き込み',
      applicableInsurance: 'オーナー建物火災保険（水災・風災特約）',
      payer: '保険会社（全額または免責除き）',
      keyPoints: '床上浸水またはサッシ水切り不具合等の外力による浸水はオーナー火災保険の水災または破損汚損で求償。入居者の退去費用負担をゼロにでき、オーナーの出費も防ぐ。',
      documentsRequired: ['被災状況全景写真（浸水ライン）', '気象庁大雨データ記録', '原状回復業者見積書'],
      typicalDeductible: '0円〜1万円',
    },
    water_pipe_leak: {
      title: '給水管・排水管破損による下階漏水',
      applicableInsurance: '施設賠償責任保険 または 上階入居者の借家人個人賠償',
      payer: '保険会社（階下天井・家財損害）',
      keyPoints: '建物の配管劣化が原因の場合はオーナーの施設賠償特約。入居者の洗濯ホース外れ等の過失なら入居者の家財保険（個人賠償）を適用。',
      documentsRequired: ['漏水原因箇所の開口写真', '下階被害写真（天井ボード・壁紙・床）', '止水復旧証明'],
      typicalDeductible: '0円',
    },
    glass_thermal_crack: {
      title: '網入り窓ガラスの熱割れ（温度差による自然亀裂）',
      applicableInsurance: 'オーナー火災保険（破損・汚損特約）',
      payer: '保険会社（ガラス交換工費）',
      keyPoints: '網入りガラスは日射と内部ワイヤーの熱膨張差で自然に割れるため、国交省ガイドライン上「入居者過失ゼロ」。火災保険の不測かつ突発的事故として申請可能。',
      documentsRequired: ['熱割れ特有の直角ひび割れ写真', 'サッシ全体写真', 'ガラス店見積書'],
      typicalDeductible: '0円',
    },
    tenant_accidental: {
      title: '入居者の模様替え・家具衝突によるドア穴・壁穴',
      applicableInsurance: '入居者借家人賠償責任保険（修理費用特約）',
      payer: '入居者加入の賃貸家財保険',
      keyPoints: '退去立会い時に「入居者の保険で直せますよ」と案内することで、入居者の手出し支払いを防ぎ、スムーズに合意形成できる。',
      documentsRequired: ['破損部位写真', '賃貸借契約書写し', '修理見積書'],
      typicalDeductible: '3,000円〜10,000円',
    },
  };

  const totalClaimed = claims.reduce((acc, c) => acc + c.claimedAmount, 0);
  const totalApproved = claims.reduce((acc, c) => acc + c.approvedPayout, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Purpose & Insurance Strategy */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>修繕コスト適正化 · オーナー手出しゼロ戦略</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mt-1">
              保険適用判定 & 3方求償マネジメント
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              「本来保険で直せるものをオーナーや入居者の負担にしてトラブルになる」事態を防止。
              大雨水災、突発漏水、熱割れ等を速やかに保険会社へ求償し、納得度の高い原状回復を実現します。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewClaimOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>保険事故を新規申請</span>
            </button>
          </div>
        </div>

        {/* Insurance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">保険請求累計件数</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {claims.length}件 <span className="text-xs text-slate-400 font-normal">(審査中 1件)</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">申請総額</span>
            <span className="text-base font-bold text-slate-200 font-mono tabular-nums">
              {formatCurrency(totalClaimed)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">保険認定・受取済総額</span>
            <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
              {formatCurrency(totalApproved)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">認定承認率</span>
            <span className="text-base font-bold text-blue-400 font-mono tabular-nums">
              100.0% <span className="text-xs text-slate-400 font-normal">(満額認定継続)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Insurance Diagnostic Quick Assistant */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>保険適用・損害類型 診断ガイド (現場・退去立会い時活用)</span>
            </h2>
            <p className="text-xs text-slate-500">
              目の前にある損害が「保険求償できるか」を即時に判定します
            </p>
          </div>

          <div className="flex flex-wrap gap-1">
            {Object.keys(diagnosticGuides).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedIncidentType(key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedIncidentType === key
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {key === 'torrential_rain' && '東海豪雨・台風浸水'}
                {key === 'water_pipe_leak' && '給水管漏水'}
                {key === 'glass_thermal_crack' && '窓ガラス熱割れ'}
                {key === 'tenant_accidental' && '借主家具衝突・壁穴'}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Diagnostic Detail Box */}
        {diagnosticGuides[selectedIncidentType] && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
            <div className="md:col-span-8 space-y-2">
              <div className="text-sm font-bold text-slate-900">
                {diagnosticGuides[selectedIncidentType].title}
              </div>
              <p className="text-slate-700 leading-relaxed">
                {diagnosticGuides[selectedIncidentType].keyPoints}
              </p>

              <div className="pt-2">
                <span className="font-semibold text-slate-900 block mb-1">【必要書類・立証写真】</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {diagnosticGuides[selectedIncidentType].documentsRequired.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-4 bg-white p-3.5 rounded-lg border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">適用保険種目</span>
                <span className="font-bold text-blue-900 block text-xs mt-0.5">
                  {diagnosticGuides[selectedIncidentType].applicableInsurance}
                </span>

                <span className="text-[11px] text-slate-400 block mt-2">費用負担元</span>
                <span className="font-bold text-emerald-700 block text-xs mt-0.5">
                  {diagnosticGuides[selectedIncidentType].payer}
                </span>

                <span className="text-[11px] text-slate-400 block mt-2">標準免責金額</span>
                <span className="font-mono text-slate-700 block text-xs mt-0.5">
                  {diagnosticGuides[selectedIncidentType].typicalDeductible}
                </span>
              </div>

              <button
                onClick={() => setIsNewClaimOpen(true)}
                className="w-full py-1.5 bg-slate-900 text-white rounded font-medium text-center hover:bg-slate-800 transition-colors cursor-pointer"
              >
                この類型で保険請求を作成
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Claims Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              保険求償・事故台帳 ({claims.length}件)
            </h3>
            <p className="text-xs text-slate-500">
              保険会社受付番号、審査進捗、認定金額および回収状況
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">事故番号・物件名</th>
                <th className="py-2.5 px-3">損害内容・事故種別</th>
                <th className="py-2.5 px-3">保険会社 / 証券種別</th>
                <th className="py-2.5 px-2 text-right">請求額</th>
                <th className="py-2.5 px-2 text-right">認定・支払額</th>
                <th className="py-2.5 px-3 text-center">ステータス</th>
                <th className="py-2.5 px-3 text-center">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-mono font-semibold text-slate-900">{claim.incidentReportNumber}</div>
                    <div className="text-slate-600 mt-0.5">{claim.propertyName} {claim.roomNumber}</div>
                    <div className="text-[11px] text-slate-400">事故日: {claim.dateOccurred}</div>
                  </td>

                  <td className="py-3 px-3 max-w-sm">
                    <div className="font-bold text-slate-900">{claim.title}</div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-snug">
                      {claim.description}
                    </p>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{claim.insuranceCompany}</div>
                    <div className="text-[11px] text-slate-500">{claim.policyType}</div>
                  </td>

                  <td className="py-3 px-2 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                    {formatCurrency(claim.claimedAmount)}
                  </td>

                  <td className="py-3 px-2 text-right font-mono tabular-nums font-bold text-emerald-600 whitespace-nowrap">
                    {claim.approvedPayout > 0 ? formatCurrency(claim.approvedPayout) : '査定中'}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {claim.status === 'under_assessment' && (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium">
                        保険会社査定中
                      </span>
                    )}
                    {claim.status === 'settled_paid' && (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>入金確認済</span>
                      </span>
                    )}
                    {claim.status === 'claim_filed' && (
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-medium">
                        書類提出済
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {claim.status === 'under_assessment' ? (
                      <button
                        onClick={() => {
                          onUpdateClaimStatus(claim.id, 'settled_paid', claim.claimedAmount);
                          alert('保険認定と入金受取を完了登録しました。');
                        }}
                        className="px-2.5 py-1 text-[11px] bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        満額認定で受取完了
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">対応完了</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Claim Modal */}
      {isNewClaimOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">保険求償事故の新規起案</h3>
              <button
                onClick={() => setIsNewClaimOpen(false)}
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
                const amount = Number((form.elements.namedItem('amount') as HTMLInputElement).value) || 50000;
                const company = (form.elements.namedItem('company') as HTMLSelectElement).value;
                const desc = (form.elements.namedItem('desc') as HTMLTextAreaElement).value;

                const newClaim: InsuranceClaim = {
                  id: `ins-${Date.now()}`,
                  propertyId: prop.id,
                  propertyName: prop.name,
                  roomNumber: room,
                  accidentType: selectedIncidentType as any,
                  title,
                  insuranceCompany: company,
                  policyType: 'オーナー火災保険',
                  dateOccurred: '2026-09-29',
                  status: 'claim_filed',
                  estimatedCost: amount,
                  claimedAmount: amount,
                  approvedPayout: 0,
                  deductible: 0,
                  incidentReportNumber: `INSR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
                  description: desc,
                };

                onAddClaim(newClaim);
                setIsNewClaimOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-700 font-medium mb-1">対象物件</label>
                <select name="propertyId" className="w-full border border-slate-300 rounded p-2 bg-white">
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">部屋番号（共用部の場合は共用部と記入）</label>
                <input name="roomNumber" defaultValue="201号室" required className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">事故件名・被害概要</label>
                <input name="title" defaultValue="集中豪雨に伴うサッシ水切りオーバーフロー浸水被害" required className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">請求予定金額 (円)</label>
                  <input name="amount" type="number" defaultValue="65000" required className="w-full border border-slate-300 rounded p-2" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">引受保険会社</label>
                  <select name="company" className="w-full border border-slate-300 rounded p-2 bg-white">
                    <option value="東京海上日動火災保険">東京海上日動火災保険</option>
                    <option value="三井住友海上火災保険">三井住友海上火災保険</option>
                    <option value="損害保険ジャパン">損害保険ジャパン</option>
                    <option value="あいおいニッセイ同和損保">あいおいニッセイ同和損保</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">事故原因および損害状況</label>
                <textarea name="desc" rows={3} defaultValue="東海大雨警報発令中、強風雨によりベランダサッシから雨水侵入。クッションフロア下地水浸し。緊急止水施工および床貼替見積作成済。" className="w-full border border-slate-300 rounded p-2" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewClaimOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded font-medium"
                >
                  事故申請書を起案
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
