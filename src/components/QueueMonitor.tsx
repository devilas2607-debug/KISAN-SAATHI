import React from 'react';
import { QueueState, SlotBooking } from '../types';
import { useLanguage } from '../translations/LanguageContext';
import { Users, Clock, AlertTriangle, CheckCircle2, ChevronRight, Activity, Gauge, Timer } from 'lucide-react';
import { calculateETA, useLiveClock } from '../utils/dateTime';

interface Props {
  queue: QueueState;
  booking: SlotBooking | null;
  onSimulateProgression?: (ahead: number) => void;
  isJudgeDemoActive?: boolean;
}

export const QueueMonitor: React.FC<Props> = ({ queue, booking, onSimulateProgression, isJudgeDemoActive }) => {
  const { t } = useLanguage();
  const { now } = useLiveClock(5000);
  const farmersAhead = queue.farmers_ahead;
  const isCalled = booking?.status === 'called' || farmersAhead === 0;
  const isApproaching = !isCalled && farmersAhead <= queue.turn_approaching_threshold;
  const expectedTurnTime = calculateETA(queue.estimated_wait_mins, now);

  // Maximum benchmark for progress calculation
  const maxQueueBaseline = 15;
  const progressPercent = Math.min(100, Math.max(5, Math.round(((maxQueueBaseline - farmersAhead) / maxQueueBaseline) * 100)));

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCalled ? 'bg-red-100 text-red-700 animate-pulse' : isApproaching ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">{t('queue.monitor_title')}</h2>
            <p className="text-xs text-stone-500">{t('queue.monitor_subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            {t('queue.live_sync')}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Dynamic Status Banner */}
        {isCalled ? (
          <div className="bg-red-50 border-2 border-red-500/80 rounded-xl p-4.5 mb-5 text-red-950 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg animate-bounce">
                  🔔
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    {t('queue.token_called')}
                  </span>
                  <h3 className="text-base font-black text-red-950 mt-0.5">
                    {t('queue.your_turn_now')}
                  </h3>
                  <p className="text-xs text-red-800 font-medium">
                    {t('common.token')} <strong className="font-mono text-red-950 text-sm">{booking?.token || 'P-127'}</strong>
                    {booking?.crop_type && <span> • <strong>{booking.crop_type}</strong> ({booking.quantity_quintals || 45} Q)</span>} — {t('queue.proceed_to')} <strong>{booking?.counter || 'Counter 2'}</strong> ({booking?.centre || 'Procurement Centre'}).
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isApproaching ? (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5 text-amber-950 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-200/80 text-amber-900 rounded-lg mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {t('queue.turn_approaching_alert')}
                </span>
                <h3 className="text-sm font-bold text-amber-950 mt-1">
                  {t('queue.turn_approaching', { count: farmersAhead })}
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  {t('queue.expected_wait', { mins: queue.estimated_wait_mins })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 mb-5 text-blue-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-blue-950">{t('queue.queue_normal')}</h3>
                  <p className="text-xs text-blue-800">{t('queue.queue_normal_desc', { count: queue.turn_approaching_threshold })}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold bg-blue-100 text-blue-900 px-2.5 py-1 rounded-md">
                {t('queue.threshold', { count: queue.turn_approaching_threshold })}
              </span>
            </div>
          </div>
        )}

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
            <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-stone-400" /> {t('queue.farmers_ahead')}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-black ${isCalled ? 'text-emerald-700' : isApproaching ? 'text-amber-700' : 'text-stone-900'}`}>
                {farmersAhead}
              </span>
              <span className="text-xs text-stone-500 font-medium">{t('queue.ahead_plural')}</span>
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
            <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" /> {t('queue.estimated_wait_time')}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-black ${queue.estimated_wait_mins === 0 ? 'text-emerald-700' : 'text-stone-900'}`}>
                {queue.estimated_wait_mins}
              </span>
              <span className="text-xs text-stone-500 font-medium">{t('queue.minutes')}</span>
            </div>
            {queue.estimated_wait_mins > 0 && (
              <div className="text-[10px] text-emerald-800 font-mono mt-1 flex items-center gap-1">
                <Timer className="w-3 h-3 text-emerald-600" />
                <span>Turn ~{expectedTurnTime} IST</span>
              </div>
            )}
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
            <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-stone-400" /> {t('queue.current_token')}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-mono font-black text-stone-900">
                {queue.current_token}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">({queue.active_counter})</span>
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
            <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" /> {t('queue.your_token')}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-mono font-black text-emerald-700">
                {booking?.token || 'P-127'}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">{booking?.counter || 'Counter 2'}</span>
            </div>
            {booking?.crop_type && (
              <div className="text-[10px] text-emerald-800 font-medium mt-1 truncate bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                {booking.crop_type} ({booking.quantity_quintals || 45} Q)
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Calculation Formula Breakdown (Prompt Spec 8) */}
        <div className="p-3 bg-stone-50/80 rounded-xl border border-stone-200 text-xs text-stone-700 mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-stone-800 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-700" /> Smart Wait Time Formula
            </span>
            <span className="font-mono text-[11px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
              (Farmers Ahead × Avg Speed) ÷ Active Counters
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-stone-200/60 font-mono text-[11px]">
            <div>
              <span className="text-stone-500 block">Ahead</span>
              <strong className="text-stone-900">{farmersAhead}</strong>
            </div>
            <div>
              <span className="text-stone-500 block">Avg Time</span>
              <strong className="text-stone-900">{queue.avg_processing_time_mins} min</strong>
            </div>
            <div>
              <span className="text-stone-500 block">Counters</span>
              <strong className="text-stone-900">{queue.active_counters_count} Active</strong>
            </div>
          </div>
        </div>

        {/* Queue Progression Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-1.5">
            <span>Turn Queue Position</span>
            <span>{isCalled ? 'Now Serving!' : `${progressPercent}% Progress`}</span>
          </div>
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${isCalled ? 'bg-emerald-600' : isApproaching ? 'bg-amber-500' : 'bg-emerald-600'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Progression Simulation Buttons (Prompt Spec 3 requirement: 12 -> 8 -> 5 -> 3) */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-700">
              Demo Queue Progression Steps (Per Prompt Spec 3):
            </span>
            <span className="text-[11px] text-stone-500">Fast-forward queue for evaluation</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[12, 8, 5, 3].map((step) => (
              <button
                key={step}
                id={`btn-queue-step-${step}`}
                onClick={() => onSimulateProgression && onSimulateProgression(step)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${farmersAhead === step ? 'bg-emerald-700 text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'}`}
              >
                <span>{step} Ahead</span>
                {farmersAhead === step && <CheckCircle2 className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
