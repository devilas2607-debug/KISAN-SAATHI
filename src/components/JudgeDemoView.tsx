import React, { useState } from 'react';
import { QueueState, SlotBooking, NotificationRecord, SMSRecord, ProcurementCentre } from '../types';
import { SlotBookingCard } from './SlotBookingCard';
import { QueueMonitor } from './QueueMonitor';
import { NotificationCentre } from './NotificationCentre';
import { PhoneSMSSimulator } from './PhoneSMSSimulator';
import { OperatorDashboard } from './OperatorDashboard';
import { Play, RotateCcw, CheckCircle2, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../translations/LanguageContext';

interface Props {
  booking: SlotBooking | null;
  queue: QueueState;
  notifications: NotificationRecord[];
  smsLogs: SMSRecord[];
  centres: ProcurementCentre[];
  onBookSlot: (bookingData: Partial<SlotBooking>) => Promise<void>;
  onCallNextFarmer: (counter: string, token: string) => Promise<void>;
  onAdvanceQueue: (ahead: number) => Promise<void>;
  onProcurementComplete: () => Promise<void>;
  onPaymentComplete: () => Promise<void>;
  onResetJudgeDemo: () => Promise<void>;
  onUpdateSettings: (settings: Partial<QueueState>) => Promise<void>;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onTriggerTestSMS: (msg: string) => void;
  onViewReceipt: (token: string) => void;
  isLoading: boolean;
}

export const JudgeDemoView: React.FC<Props> = ({
  booking,
  queue,
  notifications,
  smsLogs,
  centres,
  onBookSlot,
  onCallNextFarmer,
  onAdvanceQueue,
  onProcurementComplete,
  onPaymentComplete,
  onResetJudgeDemo,
  onUpdateSettings,
  onMarkRead,
  onMarkAllRead,
  onTriggerTestSMS,
  onViewReceipt,
  isLoading,
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  // Step 1: Slot Booked
  const handleStep1 = async () => {
    setCurrentStep(1);
    await onResetJudgeDemo();
  };

  // Step 2: Queue Progression (12 -> 8 -> 5 -> 3)
  const handleStep2 = async () => {
    setCurrentStep(2);
    await onAdvanceQueue(3); // triggers Approaching Alert!
  };

  // Step 3: Operator CALL NEXT FARMER
  const handleStep3 = async () => {
    setCurrentStep(3);
    await onCallNextFarmer('Counter 2', booking?.token || 'P-127');
  };

  // Step 4: Procurement & Payment Complete
  const handleStep4 = async () => {
    setCurrentStep(4);
    await onProcurementComplete();
    await new Promise((r) => setTimeout(r, 600));
    await onPaymentComplete();
  };

  // Automated 1-Click Evaluation sequence
  const runAutoDemo = async () => {
    setIsAutoRunning(true);
    await handleStep1();
    await new Promise((r) => setTimeout(r, 1400));
    await handleStep2();
    await new Promise((r) => setTimeout(r, 1800));
    await handleStep3();
    await new Promise((r) => setTimeout(r, 2200));
    await handleStep4();
    setIsAutoRunning(false);
  };

  return (
    <div className="space-y-5">
      {/* Judge Quick Demonstration Stepper Bar */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-lg border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-stone-950 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('demo.banner_title')}
              </span>
              <span className="text-xs text-stone-400 font-mono">SIH 2026</span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">
              {t('demo.banner_title')}
            </h2>
            <p className="text-xs text-stone-400">
              {t('demo.banner_desc')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-auto-run-demo"
              onClick={runAutoDemo}
              disabled={isAutoRunning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-md shadow-amber-400/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isAutoRunning ? 'Simulating...' : t('demo.auto_play')}</span>
            </button>

            <button
              id="btn-reset-demo-flow"
              onClick={handleStep1}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
              title={t('demo.reset_demo')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Flow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4">
          <button
            onClick={handleStep1}
            className={`p-3 rounded-xl text-left border transition cursor-pointer ${currentStep === 1 ? 'bg-stone-800 border-amber-400 text-white shadow-xs' : 'bg-stone-800/40 border-stone-700/60 text-stone-400 hover:bg-stone-800'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">1</span>
              {currentStep > 1 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <h4 className="text-xs font-bold text-stone-200">{t('demo.step1_title')}</h4>
            <p className="text-[11px] text-stone-400 mt-0.5">Token {booking?.token || 'P-127'} • {booking?.time || 'Live Slot'}</p>
          </button>

          <button
            onClick={handleStep2}
            className={`p-3 rounded-xl text-left border transition cursor-pointer ${currentStep === 2 ? 'bg-stone-800 border-amber-400 text-white shadow-xs' : 'bg-stone-800/40 border-stone-700/60 text-stone-400 hover:bg-stone-800'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">2</span>
              {currentStep > 2 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <h4 className="text-xs font-bold text-stone-200">{t('demo.step2_title')}</h4>
            <p className="text-[11px] text-stone-400 mt-0.5">{t('demo.step3_title')}</p>
          </button>

          <button
            onClick={handleStep3}
            className={`p-3 rounded-xl text-left border transition cursor-pointer ${currentStep === 3 ? 'bg-stone-800 border-amber-400 text-white shadow-xs' : 'bg-stone-800/40 border-stone-700/60 text-stone-400 hover:bg-stone-800'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">3</span>
              {currentStep > 3 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <h4 className="text-xs font-bold text-stone-200">{t('demo.step4_title')}</h4>
            <p className="text-[11px] text-stone-400 mt-0.5">{t('queue.token_called')}</p>
          </button>

          <button
            onClick={handleStep4}
            className={`p-3 rounded-xl text-left border transition cursor-pointer ${currentStep === 4 ? 'bg-stone-800 border-amber-400 text-white shadow-xs' : 'bg-stone-800/40 border-stone-700/60 text-stone-400 hover:bg-stone-800'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">4</span>
              {currentStep === 4 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <h4 className="text-xs font-bold text-stone-200">{t('demo.step5_title')}</h4>
            <p className="text-[11px] text-stone-400 mt-0.5">{t('farmer.payment_direct_dbt')}</p>
          </button>
        </div>
      </div>

      {/* Dual Split Screen Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Farmer Screen */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Farmer Mobile Screen
            </span>
            <span className="text-xs text-stone-500 font-mono">Farmer: Ramesh Kumar</span>
          </div>

          <SlotBookingCard
            booking={booking}
            onBookSlot={onBookSlot}
            isLoading={isLoading}
          />

          <QueueMonitor
            queue={queue}
            booking={booking}
            onSimulateProgression={onAdvanceQueue}
            isJudgeDemoActive={true}
          />

          <NotificationCentre
            notifications={notifications}
            onMarkRead={onMarkRead}
            onMarkAllRead={onMarkAllRead}
          />

          <PhoneSMSSimulator
            farmerPhone={booking?.farmer_phone || '+91 98765 43210'}
            farmerName={booking?.farmer_name || 'Ramesh Kumar'}
            smsLogs={smsLogs}
            notifications={notifications}
            onTriggerTestSMS={onTriggerTestSMS}
          />
        </div>

        {/* Right Side: Operator Screen */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              Procurement Operator Station
            </span>
            <span className="text-xs text-stone-500 font-mono">Counter 2 • Mandi Yard A</span>
          </div>

          <OperatorDashboard
            queue={queue}
            booking={booking}
            centres={centres}
            onCallNextFarmer={onCallNextFarmer}
            onAdvanceQueue={onAdvanceQueue}
            onProcurementComplete={onProcurementComplete}
            onPaymentComplete={onPaymentComplete}
            onResetJudgeDemo={onResetJudgeDemo}
            onUpdateSettings={onUpdateSettings}
            onViewReceipt={onViewReceipt}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
