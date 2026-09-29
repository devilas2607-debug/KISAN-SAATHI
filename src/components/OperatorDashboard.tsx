import React, { useState } from 'react';
import {
  QueueState,
  SlotBooking,
  ProcurementCentre,
  DigitalReceipt,
  WeighingRecord,
  QualityCheckRecord,
} from '../types';
import { useLanguage } from '../translations/LanguageContext';
import {
  Users,
  Megaphone,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Settings,
  DollarSign,
  PackageCheck,
  ShieldCheck,
  Building2,
  Scale,
  FileCheck,
  Receipt,
  CheckCircle2,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface Props {
  queue: QueueState;
  booking: SlotBooking | null;
  centres: ProcurementCentre[];
  onCallNextFarmer: (counter: string, token: string) => Promise<void>;
  onAdvanceQueue: (ahead: number) => Promise<void>;
  onProcurementComplete: () => Promise<void>;
  onPaymentComplete: () => Promise<void>;
  onResetJudgeDemo: () => Promise<void>;
  onUpdateSettings: (settings: Partial<QueueState>) => Promise<void>;
  onViewReceipt: (token: string) => void;
  isLoading: boolean;
}

export const OperatorDashboard: React.FC<Props> = ({
  queue,
  booking,
  centres,
  onCallNextFarmer,
  onAdvanceQueue,
  onProcurementComplete,
  onPaymentComplete,
  onResetJudgeDemo,
  onUpdateSettings,
  onViewReceipt,
  isLoading,
}) => {
  const { t } = useLanguage();
  const [selectedCentreId, setSelectedCentreId] = useState('PC-101');
  const [selectedCounter, setSelectedCounter] = useState(queue.active_counter || 'Counter 2');
  const [activeCounters, setActiveCounters] = useState(queue.active_counters_count || 1);
  const [avgTime, setAvgTime] = useState(queue.avg_processing_time_mins || 8);
  const [threshold, setThreshold] = useState(queue.turn_approaching_threshold || 3);
  const [showSettings, setShowSettings] = useState(false);

  // Operator Action Modals/Forms state
  const [procurementStage, setProcurementStage] = useState<string>('idle'); // 'idle' | 'arrived' | 'verified' | 'weighed' | 'quality_certified' | 'completed' | 'paid'
  const [declaredQty, setDeclaredQty] = useState(booking?.quantity_quintals || 45);
  const [actualWeight, setActualWeight] = useState(44.8);
  const [moisture, setMoisture] = useState(11.2);
  const [foreignMatter, setForeignMatter] = useState(0.5);
  const [showWeighModal, setShowWeighModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);

  const fallbackCentre: ProcurementCentre = {
    id: 'PC-101',
    name: 'Karnal Central APMC Mandi Yard',
    village_town: 'Karnal City',
    district: 'Karnal',
    state: 'Haryana',
    latitude: 29.6857,
    longitude: 76.9905,
    daily_capacity_quintals: 6500,
    daily_farmer_capacity: 140,
    current_queue: 18,
    active_counters: 4,
    total_counters: 6,
    avg_processing_time_mins: 8,
    todays_bookings: 112,
    completed_procurements: 74,
    pending_procurements: 38,
    utilization_percentage: 78,
    crowd_level: 'Medium',
    predicted_crowd: {
      now: 'Medium',
      plus1h: 'High',
      plus2h: 'High',
      plus4h: 'Medium',
    },
    avg_waiting_time_mins: 36,
    operational_status: 'Operational',
    contact_number: '+91 184 225 9011',
    address: 'Sector 4, GT Road Bypass, Karnal APMC Yard',
  };

  const activeCentre: ProcurementCentre = (centres && centres.length > 0)
    ? (centres.find((c) => c.id === selectedCentreId) || centres[0])
    : fallbackCentre;

  const handleCallNext = async () => {
    const targetToken = booking?.token || 'P-127';
    await onCallNextFarmer(selectedCounter, targetToken);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      active_counter: selectedCounter,
      active_counters_count: activeCounters,
      avg_processing_time_mins: avgTime,
      turn_approaching_threshold: threshold,
    });
    setShowSettings(false);
  };

  const handleMarkArrived = async () => {
    try {
      await fetch('/api/operator/mark-arrived', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: booking?.token || 'P-127' }),
      });
      setProcurementStage('arrived');
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartVerification = async () => {
    try {
      await fetch('/api/operator/start-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: booking?.token || 'P-127' }),
      });
      setProcurementStage('verified');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveWeighing = async () => {
    try {
      await fetch('/api/operator/save-weighing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: booking?.token || 'P-127',
          declared_quantity: declaredQty,
          actual_weight: actualWeight,
          tare_weight: 1820,
          gross_weight: Math.round(1820 + actualWeight * 100),
          slip_no: 'WB-' + Math.floor(10000 + Math.random() * 90000),
        }),
      });
      setProcurementStage('weighed');
      setShowWeighModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveQuality = async () => {
    try {
      await fetch('/api/operator/save-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: booking?.token || 'P-127',
          crop_type: booking?.crop_type || 'Wheat',
          moisture,
          foreign_matter: foreignMatter,
          status: 'Verified',
        }),
      });
      setProcurementStage('quality_certified');
      setShowQualityModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteFullProcurement = async () => {
    await onProcurementComplete();
    setProcurementStage('completed');
  };

  const handleDisbursePayment = async () => {
    await onPaymentComplete();
    setProcurementStage('paid');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-stone-900">{t('operator.title')}</h2>
              <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Station Active
              </span>
            </div>
            <p className="text-xs text-stone-500">{t('operator.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Centre Switcher */}
          <select
            value={selectedCentreId}
            onChange={(e) => setSelectedCentreId(e.target.value)}
            className="text-xs font-semibold bg-white border border-stone-300 rounded-lg p-1.5 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            {centres && centres.length > 0 ? (
              centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))
            ) : (
              <option value="PC-101">Karnal Central APMC Mandi Yard (PC-101)</option>
            )}
          </select>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-stone-500" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              setProcurementStage('idle');
              onResetJudgeDemo();
            }}
            title="Reset to Judge Demo Baseline"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t('operator.reset_demo')}</span>
          </button>
        </div>
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <form onSubmit={handleSaveSettings} className="p-4 bg-stone-100/70 border-b border-stone-200 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Active Operator Counter</label>
              <select
                value={selectedCounter}
                onChange={(e) => setSelectedCounter(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white"
              >
                <option value="Counter 1">Counter 1 (Weighbridge A)</option>
                <option value="Counter 2">Counter 2 (Primary Grain Intake)</option>
                <option value="Counter 3">Counter 3 (Express Intake)</option>
                <option value="Counter 4">Counter 4 (Buffer Counter)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Active Counters (Scale)</label>
              <input
                type="number"
                min={1}
                max={6}
                value={activeCounters}
                onChange={(e) => setActiveCounters(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Avg Processing Speed (min)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={avgTime}
                onChange={(e) => setAvgTime(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Approaching Threshold</label>
              <input
                type="number"
                min={1}
                max={10}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-stone-900 rounded-lg cursor-pointer"
            >
              Update Queue Formula
            </button>
          </div>
        </form>
      )}

      <div className="p-5 space-y-6">
        {/* Centre Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Assigned Centre</span>
            <strong className="text-stone-900 text-xs truncate block">{activeCentre.name}</strong>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Current Queue</span>
            <span className="text-sm font-mono font-bold text-stone-900">{activeCentre.current_queue} Farmers</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Capacity Used</span>
            <span className="text-sm font-mono font-bold text-stone-900">{activeCentre.utilization_percentage}%</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Today's Completed</span>
            <span className="text-sm font-mono font-bold text-emerald-700">{activeCentre.completed_procurements}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Active Stations</span>
            <span className="text-sm font-mono font-bold text-stone-900">{queue.active_counters_count} / {activeCentre.total_counters}</span>
          </div>
        </div>

        {/* Big Operator Call Station */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-emerald-100">
                Operator Call Station • {selectedCounter}
              </span>
              <h3 className="text-2xl font-black mt-2">
                {t('operator.serving_token', { token: queue.current_token })}
              </h3>
              <p className="text-xs text-emerald-100 mt-1 max-w-md">
                Farmer: <strong className="text-white font-mono text-sm">{booking?.token || 'P-127'}</strong> ({booking?.farmer_name || 'Ramesh Kumar'}) • {booking?.crop_type || 'Wheat'} • {booking?.time || 'Live Slot'}
              </p>
            </div>

            <button
              id="btn-call-next-farmer"
              onClick={handleCallNext}
              disabled={isLoading}
              className="px-6 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Megaphone className="w-5 h-5 text-stone-900 animate-pulse" />
              <span>{t('operator.call_next')}</span>
            </button>
          </div>
        </div>

        {/* Complete End-to-End Procurement Workflow Stages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              {t('operator.pipeline_title')}
            </h4>
            <span className="text-xs text-stone-500">Token: {booking?.token || 'P-127'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            {/* Stage 1: Queue Progression & Gate Entry */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{t('operator.stage1')}</span>
                <p className="text-xs text-stone-700 font-semibold mt-1">Advance Queue Step:</p>
                <div className="grid grid-cols-4 gap-1 my-2">
                  {[8, 5, 3, 1].map((ahead) => (
                    <button
                      key={ahead}
                      onClick={() => onAdvanceQueue(ahead)}
                      className="py-1 rounded bg-white hover:bg-stone-100 text-stone-800 font-bold border border-stone-300 text-center cursor-pointer"
                    >
                      {ahead}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleMarkArrived}
                className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                {t('operator.mark_arrived')}
              </button>
            </div>

            {/* Stage 2: KCC Verification & Weighbridge */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{t('operator.stage2')}</span>
                <p className="text-xs text-stone-700 font-semibold mt-1">
                  Declared: <strong>{declaredQty} Q</strong>
                </p>
                <p className="text-[11px] text-stone-500">Actual Net: {actualWeight} Q</p>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={handleStartVerification}
                  className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold rounded-lg text-[11px] transition cursor-pointer"
                >
                  {t('operator.verify_kcc')}
                </button>
                <button
                  onClick={() => setShowWeighModal(true)}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{t('operator.record_weight')}</span>
                </button>
              </div>
            </div>

            {/* Stage 3: Quality Check Inspection */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{t('operator.stage3')}</span>
                <p className="text-xs text-stone-700 font-semibold mt-1">
                  Moisture: <strong className="text-emerald-700">{moisture}%</strong> (≤12%)
                </p>
                <p className="text-[11px] text-stone-500">Foreign matter: {foreignMatter}% • Grade A</p>
              </div>

              <button
                onClick={() => setShowQualityModal(true)}
                className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{t('operator.certify_quality')}</span>
              </button>
            </div>

            {/* Stage 4: Procurement Completion & DBT Payment */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">{t('operator.stage4')}</span>
                <p className="text-xs text-stone-700 font-semibold mt-1">
                  Payable: <strong className="text-stone-900">₹1,01,920</strong>
                </p>
                <p className="text-[11px] text-stone-500">MSP: ₹2,275/Quintal</p>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={handleCompleteFullProcurement}
                  className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Receipt className="w-3 h-3" />
                  <span>{t('operator.generate_receipt')}</span>
                </button>
                <button
                  onClick={handleDisbursePayment}
                  className="w-full py-1.5 bg-stone-900 hover:bg-black text-white font-bold rounded-lg text-[11px] transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <DollarSign className="w-3 h-3 text-amber-400" />
                  <span>{t('operator.clear_payment')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick View Receipt Button */}
        <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span className="text-stone-700 font-semibold">
              Official Digital Receipt Available for Token {booking?.token || 'P-127'}
            </span>
          </div>

          <button
            onClick={() => onViewReceipt(booking?.token || 'P-127')}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-800 font-bold hover:bg-stone-100 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            <span>Inspect Receipt (PDF / Slip)</span>
          </button>
        </div>
      </div>

      {/* Weighbridge Slip Modal */}
      {showWeighModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-700" />
              <span>Electronic Weighbridge Entry Form</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Declared Quantity (Quintals)</label>
                <input
                  type="number"
                  value={declaredQty}
                  onChange={(e) => setDeclaredQty(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Actual Net Weighment (Quintals)</label>
                <input
                  type="number"
                  step="0.1"
                  value={actualWeight}
                  onChange={(e) => setActualWeight(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono font-bold text-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-stone-600">
                <div className="p-2 bg-stone-50 rounded border border-stone-200">
                  <span className="block text-[10px] text-stone-500">Gross Weight:</span>
                  <span className="font-mono font-bold">{Math.round(1820 + actualWeight * 100)} kg</span>
                </div>
                <div className="p-2 bg-stone-50 rounded border border-stone-200">
                  <span className="block text-[10px] text-stone-500">Tare (Tractor/Trolley):</span>
                  <span className="font-mono font-bold">1,820 kg</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWeighModal(false)}
                className="px-3 py-1.5 text-stone-600 hover:text-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveWeighing}
                className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Record Weighment Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quality Certification Modal */}
      {showQualityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-teal-700" />
              <span>Quality & Moisture Laboratory Assessment</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Moisture Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono font-bold"
                />
                <span className="text-[10px] text-stone-500">Government Standard: Max 12.0%</span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Foreign Matter Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={foreignMatter}
                  onChange={(e) => setForeignMatter(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono font-bold"
                />
                <span className="text-[10px] text-stone-500">Government Standard: Max 0.75%</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                <span className="font-bold block text-[11px]">Fair Average Quality (FAQ) Status:</span>
                <span>Conforms to Central Pool Grade-A specifications for human consumption.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowQualityModal(false)}
                className="px-3 py-1.5 text-stone-600 hover:text-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuality}
                className="px-4 py-2 bg-teal-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Certify & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
