import React, { useState } from 'react';
import { useLiveClock } from '../utils/dateTime';
import { Clock, Calendar, Globe, CheckCircle2 } from 'lucide-react';

interface Props {
  className?: string;
  variant?: 'compact' | 'full' | 'pill';
}

export const LiveClockBadge: React.FC<Props> = ({ className = '', variant = 'compact' }) => {
  const {
    istDateShort,
    istDayAndDate,
    istTimeWithSec,
    localTimeWithSec,
    localTimeZone,
    isDifferentFromLocal,
  } = useLiveClock(1000);

  const [showTimezoneTooltip, setShowTimezoneTooltip] = useState(false);

  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-bold text-emerald-900 ${className}`}
        title="Live Indian Standard Time (IST)"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>{istTimeWithSec}</span>
        <span className="text-[10px] text-emerald-700 font-sans uppercase">IST</span>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`bg-stone-900 text-stone-100 rounded-xl p-3 border border-stone-800 shadow-sm ${className}`}>
        <div className="flex items-center justify-between gap-3 text-xs mb-1">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-stone-200">{istDayAndDate}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE IST (Asia/Kolkata)
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div className="text-xl font-mono font-black tracking-tight text-white flex items-baseline gap-2">
            <span>{istTimeWithSec}</span>
            <span className="text-xs font-bold text-amber-400">IST</span>
          </div>
          {isDifferentFromLocal && (
            <div className="text-[11px] text-stone-400 font-mono">
              Local: {localTimeWithSec} ({localTimeZone.split('/').pop()?.replace(/_/g, ' ')})
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default compact layout for header bar
  return (
    <div
      className={`relative inline-flex items-center gap-2 bg-stone-100/90 hover:bg-stone-200/80 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-800 transition cursor-help select-none ${className}`}
      onMouseEnter={() => setShowTimezoneTooltip(true)}
      onMouseLeave={() => setShowTimezoneTooltip(false)}
      onClick={() => setShowTimezoneTooltip((prev) => !prev)}
      id="live-clock-header-badge"
    >
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span className="hidden sm:inline font-semibold text-stone-700 whitespace-nowrap">
          {istDateShort}
        </span>
        <span className="hidden sm:inline text-stone-300">•</span>
        <div className="flex items-center gap-1 font-mono font-bold text-stone-900 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>{istTimeWithSec}</span>
          <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/80 px-1 py-0.2 rounded">
            IST
          </span>
        </div>
      </div>

      {/* Floating Tooltip displaying timezone breakdown */}
      {showTimezoneTooltip && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-stone-900 text-stone-100 text-xs rounded-xl p-3 shadow-xl border border-stone-700 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> System Time Synchronization
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Real-time
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-stone-400">Indian Standard (IST):</span>
              <span className="font-bold text-white">{istTimeWithSec}</span>
            </div>
            <div className="flex justify-between text-stone-400 text-[10px]">
              <span>Date (IST):</span>
              <span className="text-stone-300">{istDayAndDate}</span>
            </div>
            {isDifferentFromLocal && (
              <div className="pt-1.5 border-t border-stone-800 flex justify-between">
                <span className="text-stone-400">Local Browser:</span>
                <span className="text-amber-200">{localTimeWithSec}</span>
              </div>
            )}
            <div className="text-[10px] text-stone-400 pt-1">
              Timezone: <span className="text-stone-300">Asia/Kolkata (UTC+5:30)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
