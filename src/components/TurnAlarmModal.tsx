import React from 'react';
import { Volume2, VolumeX, ShieldAlert, CheckCircle, Navigation } from 'lucide-react';
import { stopContinuousTurnAlarm } from '../utils/audioAlert';
import { useLanguage } from '../translations/LanguageContext';

interface Props {
  isOpen: boolean;
  token: string;
  counter: string;
  centre: string;
  onAcknowledge: () => void;
}

export const TurnAlarmModal: React.FC<Props> = ({
  isOpen,
  token,
  counter,
  centre,
  onAcknowledge,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const handleAcknowledge = () => {
    stopContinuousTurnAlarm();
    onAcknowledge();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 overflow-hidden text-center transform transition-all animate-in zoom-in-95">
        {/* Pulsing Alarm Header */}
        <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 text-white px-6 py-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-16 h-16 rounded-full bg-white text-emerald-800 mx-auto flex items-center justify-center shadow-lg mb-3 animate-bounce">
            <span className="text-3xl">🔔</span>
          </div>

          <span className="inline-block bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-1 backdrop-blur-xs">
            {t('turn_modal.badge')}
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1">
            {t('turn_modal.title')}
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            {t('turn_modal.desc')}
          </p>
        </div>

        {/* Token & Counter Card */}
        <div className="p-6">
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 mb-5 shadow-inner">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {t('turn_modal.called_token')}
            </span>
            <div className="text-4xl font-black font-mono text-emerald-700 tracking-tight my-1">
              {token || 'P-127'}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-sm mt-1">
              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('turn_modal.proceed_prompt', { counter: counter || 'Counter 2' })}</span>
            </div>
            <p className="text-xs text-stone-600 mt-2 font-medium">
              {t('turn_modal.centre_label')}: <strong>{centre || 'Procurement Centre A'}</strong>
            </p>
          </div>

          {/* Prompt Required: Visible ACKNOWLEDGE ALERT BUTTON */}
          <button
            id="btn-acknowledge-alert"
            onClick={handleAcknowledge}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-lg shadow-emerald-700/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{t('turn_modal.acknowledge_btn')}</span>
          </button>

          {/* Academic / College Demo Disclosure per Prompt Spec 5 */}
          <div className="mt-5 text-left p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Platform Device Alert Notice (Evaluation Mode):</span>
            </div>
            <p>
              Audible turn chime rings actively while this web app or PWA is open. Browsers cannot guarantee continuous audio alarms when completely closed; the system architecture is ready for native Android AlarmManager and FCM background pushes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
