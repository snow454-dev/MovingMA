/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { InspectionManager } from './components/inspection/InspectionManager';
import { InsuranceManager } from './components/insurance/InsuranceManager';
import { ContractorNetwork } from './components/contractors/ContractorNetwork';
import { EmergencyCenter } from './components/emergency/EmergencyCenter';
import { ApprovalWorkflow } from './components/approvals/ApprovalWorkflow';
import { PropertyList } from './components/properties/PropertyList';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_MOVE_OUT_CASES, 
  INITIAL_CONTRACTORS, 
  INITIAL_INSURANCE_CLAIMS, 
  INITIAL_EMERGENCY_INCIDENTS, 
  INITIAL_APPROVALS, 
  INITIAL_WORK_ORDERS 
} from './data/mockData';
import { MoveOutCase, InsuranceClaim, Contractor, EmergencyIncident, ApprovalItem, WorkOrder, Property } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  
  // Operational State
  const [properties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [moveOutCases, setMoveOutCases] = useState<MoveOutCase[]>(INITIAL_MOVE_OUT_CASES);
  const [contractors, setContractors] = useState<Contractor[]>(INITIAL_CONTRACTORS);
  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>(INITIAL_INSURANCE_CLAIMS);
  const [emergencyIncidents, setEmergencyIncidents] = useState<EmergencyIncident[]>(INITIAL_EMERGENCY_INCIDENTS);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INITIAL_MOVE_OUT_CASES[0]?.id || '');

  // Case updates
  const handleUpdateCase = (updatedCase: MoveOutCase) => {
    setMoveOutCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleCreateCase = (newCase: MoveOutCase) => {
    setMoveOutCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    setCurrentTab('inspection');
  };

  // Insurance actions
  const handleAddClaim = (claim: InsuranceClaim) => {
    setInsuranceClaims(prev => [claim, ...prev]);
  };

  const handleUpdateClaimStatus = (id: string, status: InsuranceClaim['status'], payout?: number) => {
    setInsuranceClaims(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          approvedPayout: payout !== undefined ? payout : c.approvedPayout,
        };
      }
      return c;
    }));
  };

  // Contractor actions
  const handleAddContractor = (contractor: Contractor) => {
    setContractors(prev => [contractor, ...prev]);
  };

  const handleCreateWorkOrder = (order: WorkOrder) => {
    setWorkOrders(prev => [order, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: WorkOrder['status']) => {
    setWorkOrders(prev => prev.map(w => w.id === orderId ? { ...w, status } : w));
  };

  // Emergency actions
  const handleAddIncident = (incident: EmergencyIncident) => {
    setEmergencyIncidents(prev => [incident, ...prev]);
  };

  const handleUpdateIncidentStatus = (id: string, status: EmergencyIncident['status'], actionTaken?: string) => {
    setEmergencyIncidents(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status,
          actionTaken: actionTaken || i.actionTaken,
        };
      }
      return i;
    }));
  };

  // Approval actions
  const handleApprove = (id: string, notes?: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  };

  const handleReject = (id: string, reason: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'returned' } : a));
  };

  const handleAddApproval = (item: ApprovalItem) => {
    setApprovals(prev => [item, ...prev]);
  };

  // Navigation helpers
  const handleSelectCaseFromDashboard = (caseItem: MoveOutCase) => {
    setSelectedCaseId(caseItem.id);
    setCurrentTab('inspection');
  };

  const handleStartMoveOutForProperty = (prop: Property) => {
    const defaultCase: MoveOutCase = {
      id: `case-${Date.now()}`,
      propertyId: prop.id,
      propertyName: prop.name,
      region: prop.region,
      roomNumber: '302号室',
      tenantName: '立会準備中',
      tenantPhone: '090-0000-0000',
      moveInDate: '2023-04-01',
      moveOutDate: '2026-09-30',
      tenancyMonths: 42,
      monthlyRent: 68000,
      depositAmount: 68000,
      status: 'scheduled',
      inspectionDate: '2026-10-01',
      inspectorName: '現場担当・佐々木',
      approvalLevel: 1,
      approvalStatus: 'draft',
      specialContractAgreement: true,
      notes: `${prop.name}の退去受付`,
      tenantExplanationNotes: '国交省原状回復ガイドラインに準拠して精算予定。',
      items: [
        {
          id: `item-${Date.now()}-1`,
          category: 'cleaning',
          name: 'ルームクリーニング費用 (定額特約)',
          quantity: 1,
          unit: '式',
          unitPrice: 27500,
          totalPrice: 27500,
          depreciationApplicable: false,
          usefulLifeMonths: 0,
          tenantFaultRatio: 100,
          guidelineRule: '特約合意条項。',
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
      depositRefund: 68000 - 27500,
    };
    handleCreateCase(defaultCase);
  };

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;
  const activeEmergenciesCount = emergencyIncidents.filter(e => e.status !== 'closed').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Bar Contract Compliant Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        pendingApprovalsCount={pendingApprovalsCount}
        activeEmergenciesCount={activeEmergenciesCount}
        onOpenNewCase={() => {
          setSelectedCaseId(moveOutCases[0]?.id || '');
          setCurrentTab('inspection');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentTab === 'dashboard' && (
          <OverviewDashboard
            properties={properties}
            moveOutCases={moveOutCases}
            insuranceClaims={insuranceClaims}
            emergencyIncidents={emergencyIncidents}
            approvals={approvals}
            onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
            onSelectCase={handleSelectCaseFromDashboard}
          />
        )}

        {currentTab === 'inspection' && (
          <InspectionManager
            cases={moveOutCases}
            properties={properties}
            contractors={contractors}
            selectedCaseId={selectedCaseId}
            onUpdateCase={handleUpdateCase}
            onCreateCase={handleCreateCase}
          />
        )}

        {currentTab === 'insurance' && (
          <InsuranceManager
            claims={insuranceClaims}
            properties={properties}
            onAddClaim={handleAddClaim}
            onUpdateClaimStatus={handleUpdateClaimStatus}
          />
        )}

        {currentTab === 'contractors' && (
          <ContractorNetwork
            contractors={contractors}
            workOrders={workOrders}
            onAddContractor={handleAddContractor}
            onCreateWorkOrder={handleCreateWorkOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {currentTab === 'emergency' && (
          <EmergencyCenter
            incidents={emergencyIncidents}
            properties={properties}
            contractors={contractors}
            onAddIncident={handleAddIncident}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
          />
        )}

        {currentTab === 'approvals' && (
          <ApprovalWorkflow
            approvals={approvals}
            onApprove={handleApprove}
            onReject={handleReject}
            onAddApproval={handleAddApproval}
          />
        )}

        {currentTab === 'properties' && (
          <PropertyList
            properties={properties}
            onStartMoveOutForProperty={handleStartMoveOutForProperty}
          />
        )}

      </main>

      {/* Clean Footer (No fake engines / status tickers per anti-slop guidelines) */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">RenovaOps</span>
            <span>·</span>
            <span>東海27棟・大阪7棟 賃貸管理オペレーション</span>
          </div>
          <div className="flex items-center gap-3">
            <span>国交省原状回復ガイドライン準拠</span>
            <span>·</span>
            <span>社内決裁委任規程 適用中</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
