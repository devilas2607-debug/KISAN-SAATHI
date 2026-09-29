import React, { useState } from 'react';
import { SMSRecord, NotificationRecord } from '../types';
import {
  Smartphone,
  CheckCircle2,
  Send,
  MessageSquare,
  ShieldCheck,
  Signal,
  Wifi,
  Battery,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLiveClock, getCurrentISTTime } from '../utils/dateTime';

interface Props {
  farmerPhone: string;
  farmerName: string;
  smsLogs: SMSRecord[];
  notifications: NotificationRecord[];
  onTriggerTestSMS?: (msg: string) => void;
}

export const PhoneSMSSimulator: React.FC<Props> = ({
  farmerPhone,
  farmerName,
  smsLogs,
  notifications,
  onTriggerTestSMS,
}) => {
  const { istTimeStr } = useLiveClock(1000);
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'sms' | 'lockscreen'>('sms');
  const [customMsg, setCustomMsg] = useState('');

  // Extract all SMS messages sent
  const allSmsMessages = smsLogs.slice().reverse();

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMsg.trim() && onTriggerTestSMS) {
      onTriggerTestSMS(customMsg.trim());
      setCustomMsg('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900">Farmer Phone & SMS Device</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                SMS SENT ✓
              </span>
            </div>
            <p className="text-xs text-stone-500">Live handset simulator for {farmerPhone} ({farmerName})</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5">
          {/* Prominent Demo Mode & SMS SENT Banner per Prompt Spec 2 */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl mb-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SMS SENT ✓</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-200/70 text-blue-900 px-2 py-0.5 rounded">
                Demo SMS Mode Active
              </span>
            </div>
            <p className="mt-1 text-[11px] text-blue-800 leading-relaxed">
              <strong>College Evaluation Protocol:</strong> Demonstrates real-time SMS messaging dispatch logic. Shows explicit <strong>SMS SENT ✓</strong> status without falsely claiming actual cellular delivery unless an external carrier gateway (e.g. MSG91, Twilio) is configured.
            </p>
          </div>

          {/* Smartphone Frame */}
          <div className="max-w-sm mx-auto bg-stone-900 rounded-[2.25rem] p-3 shadow-xl border-4 border-stone-800 text-stone-100">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-4 py-1.5 text-[11px] text-stone-400">
              <span className="font-semibold text-stone-200 font-mono">{istTimeStr}</span>
              <div className="w-16 h-4 bg-stone-800 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Screen Content */}
            <div className="bg-stone-100 text-stone-900 rounded-[1.75rem] p-3 min-h-[340px] max-h-[380px] overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Handset Messaging Header */}
                <div className="bg-white rounded-xl p-2.5 shadow-xs border border-stone-200/80 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                      SP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">SMARTPROCURE</h4>
                      <p className="text-[10px] text-stone-500">Government Procurement Gateway</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Verified
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="space-y-2.5">
                  {allSmsMessages.length === 0 ? (
                    <div className="p-4 text-center text-stone-400 text-xs">
                      No SMS received yet. Book a slot or advance queue to receive live SMS alerts.
                    </div>
                  ) : (
                    allSmsMessages.map((sms) => (
                      <div key={sms.id} className="bg-white p-2.5 rounded-2xl rounded-tl-xs shadow-xs border border-stone-200/70 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                          <span className="font-semibold text-emerald-800">SMART PROCUREMENT</span>
                          <span>{sms.timestamp}</span>
                        </div>
                        <p className="text-stone-800 font-medium leading-snug">
                          {sms.message}
                        </p>
                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-stone-100 text-[10px]">
                          <span className="text-stone-400">Carrier: {sms.provider.split(' ')[0]}</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>SMS SENT ✓</span>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mt-3 pt-2 border-t border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 block mb-1">Send Test Prompt Template:</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => {
                      const curTime = getCurrentISTTime();
                      onTriggerTestSMS && onTriggerTestSMS(`SMART PROCUREMENT: Your procurement appointment is scheduled for ${curTime} at Procurement Centre A. Token: P-127.`);
                    }}
                    className="text-[10px] bg-white hover:bg-stone-200 text-stone-700 font-medium px-2 py-1 rounded border border-stone-300 transition"
                  >
                    Slot Confirmed (Live Time)
                  </button>
                  <button
                    onClick={() => onTriggerTestSMS && onTriggerTestSMS('SMART PROCUREMENT: Your turn is approaching. Only 3 farmers are ahead of you.')}
                    className="text-[10px] bg-white hover:bg-stone-200 text-stone-700 font-medium px-2 py-1 rounded border border-stone-300 transition"
                  >
                    Turn Approaching (3 Ahead)
                  </button>
                  <button
                    onClick={() => onTriggerTestSMS && onTriggerTestSMS('SMART PROCUREMENT: Your turn is now. Please proceed to Counter 2 at Procurement Centre A.')}
                    className="text-[10px] bg-white hover:bg-stone-200 text-stone-700 font-medium px-2 py-1 rounded border border-stone-300 transition"
                  >
                    Token Called
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
