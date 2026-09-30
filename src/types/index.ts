export type Region = 'tokai' | 'osaka';

export interface Property {
  id: string;
  name: string;
  region: Region;
  prefecture: string;
  city: string;
  address: string;
  units: number;
  occupiedUnits: number;
  yearBuilt: number;
  structure: 'RC' | 'SRC' | 'S' | '木造';
  primaryContractorId?: string;
  emergencyRiskLevel: 'high' | 'normal' | 'low';
}

export type GuidelineCategory = 
  | 'wallpaper_cloth' // クロス (耐用年数6年、6年で1円残存)
  | 'flooring_cf'     // クッションフロア (耐用年数6年)
  | 'wood_flooring'   // フローリング (部分補修または経年劣化考慮)
  | 'cleaning'        // ハウスクリーニング (特約判定または通常損耗)
  | 'air_con_clean'   // エアコン内部洗浄 (喫煙・油汚れ特約)
  | 'fixtures_doors'  // 建具・襖・障子
  | 'equipment'       // 設備 (水栓・給湯器・換気扇 8〜15年)
  | 'disaster_accident'; // 自然災害・突発事故 (保険対象)

export interface RepairItem {
  id: string;
  category: GuidelineCategory;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  // 国交省ガイドライン計算要素
  depreciationApplicable: boolean;
  usefulLifeMonths: number; // e.g. 72 months (6 years)
  tenantFaultRatio: number; // 0 to 100%
  guidelineRule: string; // 根拠解説
  insuranceApplicable: boolean;
  insuranceType?: 'tenant_liability' | 'owner_fire_disaster' | 'building_liability';
  photoUrl?: string;
  // 分担計算結果
  tenantShare: number;
  ownerShare: number;
  insuranceShare: number;
}

export type CaseStatus = 
  | 'scheduled'   // 立会い予定
  | 'inspected'   // 立会い完了・査定中
  | 'pending_approval' // 承認申請中
  | 'tenant_agreed'    // 入居者合意済
  | 'work_ordered'     // 工事発注中
  | 'completed';       // 精算・引き渡し完了

export interface MoveOutCase {
  id: string;
  propertyId: string;
  propertyName: string;
  region: Region;
  roomNumber: string;
  tenantName: string;
  tenantPhone: string;
  moveInDate: string;  // YYYY-MM-DD
  moveOutDate: string; // YYYY-MM-DD
  tenancyMonths: number;
  monthlyRent: number;
  depositAmount: number;
  status: CaseStatus;
  inspectionDate: string;
  inspectorName: string;
  items: RepairItem[];
  // 集計
  totalRepairCost: number;
  tenantTotal: number;
  ownerTotal: number;
  insuranceTotal: number;
  depositRefund: number; // 敷金 - 入居者負担 (負なら追徴)
  approvalLevel: 1 | 2 | 3;
  approvalStatus: 'approved' | 'pending' | 'draft';
  approvedBy?: string;
  specialContractAgreement: boolean; // 特約合意 (クリーニング定額等)
  notes: string;
  tenantExplanationNotes: string;
}

export interface InsuranceClaim {
  id: string;
  caseId?: string;
  propertyId: string;
  propertyName: string;
  roomNumber?: string;
  accidentType: 'torrential_rain' | 'water_pipe_leak' | 'glass_thermal_crack' | 'tenant_accidental' | 'typhoon_roof';
  title: string;
  insuranceCompany: string;
  policyType: 'オーナー火災保険' | '借家人賠償責任保険' | '施設賠償責任特約' | '家主費用・水害特約';
  dateOccurred: string;
  status: 'preliminary_check' | 'claim_filed' | 'under_assessment' | 'settled_paid' | 'rejected';
  estimatedCost: number;
  claimedAmount: number;
  approvedPayout: number;
  deductible: number; // 免責金額
  incidentReportNumber: string;
  description: string;
  claimPhotoUrl?: string;
}

export type TradeType = 
  | 'interior_cross'
  | 'cleaning'
  | 'plumbing'
  | 'electrical'
  | 'carpentry'
  | 'multitask';

export interface Contractor {
  id: string;
  name: string;
  companyName: string;
  region: 'tokai' | 'osaka' | 'both';
  baseArea: string; // e.g. "名古屋市千種区・名東区・日進"
  trades: TradeType[];
  phone: string;
  emergencyAvailable: boolean; // 東海大雨時等の即日急行可能か
  unitRates: {
    clothPerSqm?: number;     // クロス m2
    cfPerSqm?: number;        // クッションフロア m2
    oneRoomCleaning?: number; // 1K美装
    familyCleaning?: number;  // 2LDK美装
    airconWash?: number;      // エアコン内部洗浄
    hourlyRate?: number;
  };
  reliabilityScore: number; // 1 to 5.0
  speedRating: '即日駆けつけ可' | '2-3日以内' | '通常予約';
  status: 'active' | 'busy' | 'vacation';
}

export interface WorkOrder {
  id: string;
  caseId: string;
  propertyName: string;
  roomNumber: string;
  contractorId: string;
  contractorName: string;
  trade: TradeType;
  title: string;
  targetCompletionDate: string;
  estimatedCost: number;
  status: 'ordered' | 'in_progress' | 'inspection_passed' | 'billed';
  orderDate: string;
}

export interface EmergencyIncident {
  id: string;
  propertyId: string;
  propertyName: string;
  roomNumber?: string;
  region: Region;
  title: string;
  category: 'heavy_rain_flood' | 'upper_floor_leak' | 'water_heater_burst' | 'roof_drain_clog' | 'exterior_damage';
  reportedAt: string;
  urgency: 'immediate_dispatch' | 'same_day' | 'next_day';
  status: 'reported' | 'dispatched' | 'repaired' | 'closed';
  costEstimate: number;
  delegationEligible: boolean; // 5万円以下即決権限
  decidedBy: '現場即決（委任規程第4条）' | '事務局承認' | '社長決裁';
  assignedContractorName?: string;
  actionTaken: string;
  insuranceClaimTarget: boolean;
}

export interface ApprovalItem {
  id: string;
  title: string;
  category: '退去精算例外' | '原状回復発注' | '突発緊急修繕' | '保険求償判断';
  amount: number;
  requestedBy: string;
  requestedAt: string;
  level: 1 | 2 | 3;
  status: 'pending' | 'approved' | 'returned';
  propertyName: string;
  roomNumber?: string;
  justification: string;
  threeWaySplitSummary?: {
    tenant: number;
    owner: number;
    insurance: number;
  };
}
