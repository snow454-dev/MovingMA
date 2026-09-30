import { RepairItem } from '../types';

/**
 * 国土交通省「原状回復をめぐるトラブルとガイドライン」に基づく計算ユーティリティ
 */

// 経過月数からクロス・CFの残存価値割合（0.01〜1.0）を計算
export function calculateResidualRatio(usefulLifeMonths: number, tenancyMonths: number): number {
  if (usefulLifeMonths <= 0) return 1.0;
  if (tenancyMonths >= usefulLifeMonths) {
    return 0.01; // ガイドライン上は6年(72ヶ月)経過で残存価値1円（計算上は1%）
  }
  const ratio = (usefulLifeMonths - tenancyMonths) / usefulLifeMonths;
  return Math.max(0.01, Math.min(1.0, Math.round(ratio * 1000) / 1000));
}

// 修繕項目ごとの3方分担（入居者・オーナー・保険）を算定
export function recalculateItemSplit(
  item: RepairItem, 
  tenancyMonths: number, 
  specialCleaningContract: boolean = true
): RepairItem {
  const totalPrice = item.quantity * item.unitPrice;
  let tenantShare = 0;
  let insuranceShare = 0;
  let ownerShare = 0;

  // 1. 保険適用対象か判定
  if (item.insuranceApplicable) {
    // 突発事故・大雨漏水・窓熱割れ等は保険求償
    insuranceShare = totalPrice;
    tenantShare = 0;
    ownerShare = 0;
  } else if (item.category === 'wallpaper_cloth' || item.category === 'flooring_cf') {
    // 減価償却適用（6年＝72ヶ月耐用年数）
    const residualRatio = calculateResidualRatio(item.usefulLifeMonths || 72, tenancyMonths);
    if (item.tenantFaultRatio > 0) {
      // 故意・過失部分に残存価値率を乗算
      tenantShare = Math.round(totalPrice * (item.tenantFaultRatio / 100) * residualRatio);
      ownerShare = totalPrice - tenantShare;
    } else {
      // 経年劣化・通常損耗はオーナー100%
      tenantShare = 0;
      ownerShare = totalPrice;
    }
  } else if (item.category === 'cleaning') {
    // ハウスクリーニング特約の有無
    if (specialCleaningContract) {
      tenantShare = totalPrice;
      ownerShare = 0;
    } else {
      tenantShare = Math.round(totalPrice * (item.tenantFaultRatio / 100));
      ownerShare = totalPrice - tenantShare;
    }
  } else if (item.category === 'equipment') {
    // 設備（耐用年数8〜15年）
    if (item.tenantFaultRatio > 0) {
      const residualRatio = calculateResidualRatio(item.usefulLifeMonths || 120, tenancyMonths);
      tenantShare = Math.round(totalPrice * (item.tenantFaultRatio / 100) * residualRatio);
      ownerShare = totalPrice - tenantShare;
    } else {
      tenantShare = 0;
      ownerShare = totalPrice;
    }
  } else {
    // 消耗品・建具補修等
    tenantShare = Math.round(totalPrice * (item.tenantFaultRatio / 100));
    ownerShare = totalPrice - tenantShare;
  }

  return {
    ...item,
    totalPrice,
    tenantShare,
    insuranceShare,
    ownerShare,
  };
}

// 承認レベル判定
export function determineApprovalLevel(totalCost: number, hasDispute: boolean, hasInsurance: boolean): 1 | 2 | 3 {
  if (totalCost > 200000 || hasDispute) {
    return 3; // 社長決済（20万円超 または トラブル・例外減免）
  }
  if (totalCost >= 50000 || hasInsurance) {
    return 2; // 事務局・管理リーダー決済（5〜20万円、保険案件）
  }
  return 1; // 現場担当者決済（5万円以下、標準ガイドライン内）
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(amount);
}
