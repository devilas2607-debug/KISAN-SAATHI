import React, { useState } from 'react';
import {
  Users,
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  KeyRound,
  Lock,
} from 'lucide-react';

export interface UserSession {
  role: 'FARMER' | 'OPERATOR' | 'ADMIN';
  name: string;
  identifier: string;
  centreId?: string;
  centreName?: string;
}

interface Props {
  onLoginSuccess: (session: UserSession) => void;
  onContinueToDemo: () => void;
}

export const LoginView: React.FC<Props> = ({ onLoginSuccess, onContinueToDemo }) => {
  const [selectedRole, setSelectedRole] = useState<'FARMER' | 'OPERATOR' | 'ADMIN'>('FARMER');
  const [mobileOrId, setMobileOrId] = useState('+91 98765 43210');
  const [passwordOrOtp, setPasswordOrOtp] = useState('26032');
  const [centreSelection, setCentreSelection] = useState('PC-101');
  const [counterSelection, setCounterSelection] = useState('Counter 2');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (selectedRole === 'FARMER') {
        onLoginSuccess({
          role: 'FARMER',
          name: 'Ramesh Kumar',
          identifier: mobileOrId || 'KCC-HR-2024-9182',
          centreId: 'PC-101',
          centreName: 'Karnal Central APMC Mandi Yard',
        });
      } else if (selectedRole === 'OPERATOR') {
        onLoginSuccess({
          role: 'OPERATOR',
          name: 'Harish Verma (Mandi Operator)',
          identifier: mobileOrId || 'OP-KNL-02',
          centreId: centreSelection,
          centreName: 'Karnal Central APMC Mandi Yard',
        });
      } else {
        onLoginSuccess({
          role: 'ADMIN',
          name: 'Dr. Anand Swaroop (State Director)',
          identifier: mobileOrId || 'ADM-HR-01',
        });
      }
    }, 400);
  };

  const handleQuickLogin = (role: 'FARMER' | 'OPERATOR' | 'ADMIN') => {
    setSelectedRole(role);
    if (role === 'FARMER') {
      onLoginSuccess({
        role: 'FARMER',
        name: 'Ramesh Kumar',
        identifier: 'KCC-HR-2024-9182',
        centreId: 'PC-101',
        centreName: 'Karnal Central APMC Mandi Yard',
      });
    } else if (role === 'OPERATOR') {
      onLoginSuccess({
        role: 'OPERATOR',
        name: 'Harish Verma (Mandi Operator)',
        identifier: 'OP-KNL-02',
        centreId: 'PC-101',
        centreName: 'Karnal Central APMC Mandi Yard',
      });
    } else {
      onLoginSuccess({
        role: 'ADMIN',
        name: 'Dr. Anand Swaroop (State Director)',
        identifier: 'ADM-HR-01',
      });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>National Agricultural Procurement Network • SIH-26032</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Official Portal Sign In
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Select your authorization role to manage MSP bookings, weighment turns, or command monitoring.
            </p>
          </div>
        </div>

        {/* 3 Role Selection Tabs */}
        <div className="grid grid-cols-3 border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('FARMER');
              setMobileOrId('+91 98765 43210');
            }}
            className={`py-3.5 px-2 text-center text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'FARMER'
                ? 'bg-white text-emerald-800 border-b-2 border-emerald-600 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Farmer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('OPERATOR');
              setMobileOrId('OP-KNL-02');
            }}
            className={`py-3.5 px-2 text-center text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'OPERATOR'
                ? 'bg-white text-emerald-800 border-b-2 border-emerald-600 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Operator</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('ADMIN');
              setMobileOrId('ADM-HR-01');
            }}
            className={`py-3.5 px-2 text-center text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'ADMIN'
                ? 'bg-white text-emerald-800 border-b-2 border-emerald-600 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {selectedRole === 'FARMER' && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Registered Mobile Number or Kisan ID
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={mobileOrId}
                    onChange={(e) => setMobileOrId(e.target.value)}
                    required
                    placeholder="+91 98765 43210 or KCC-HR-2024-9182"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Demo farmer account: Ramesh Kumar (+91 98765 43210)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  OTP / Security PIN (Demo: 26032)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passwordOrOtp}
                    onChange={(e) => setPasswordOrOtp(e.target.value)}
                    required
                    placeholder="Enter 5-digit OTP"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          {selectedRole === 'OPERATOR' && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Operator Employee Badge ID
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={mobileOrId}
                    onChange={(e) => setMobileOrId(e.target.value)}
                    required
                    placeholder="OP-KNL-02"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Assigned Mandi Yard
                  </label>
                  <select
                    value={centreSelection}
                    onChange={(e) => setCentreSelection(e.target.value)}
                    className="w-full py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="PC-101">Karnal APMC (PC-101)</option>
                    <option value="PC-102">Taraori Terminal (PC-102)</option>
                    <option value="PC-103">Nilokheri Silo (PC-103)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Counter Station
                  </label>
                  <select
                    value={counterSelection}
                    onChange={(e) => setCounterSelection(e.target.value)}
                    className="w-full py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Counter 1">Counter 1</option>
                    <option value="Counter 2">Counter 2</option>
                    <option value="Counter 3">Counter 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Operator Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passwordOrOtp}
                    onChange={(e) => setPasswordOrOtp(e.target.value)}
                    required
                    placeholder="Enter security token"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          {selectedRole === 'ADMIN' && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Government SSO Officer ID
                </label>
                <div className="relative">
                  <Landmark className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={mobileOrId}
                    onChange={(e) => setMobileOrId(e.target.value)}
                    required
                    placeholder="ADM-HR-01"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Gov Portal Security Key
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passwordOrOtp}
                    onChange={(e) => setPasswordOrOtp(e.target.value)}
                    required
                    placeholder="Enter admin credential"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : `Enter as ${selectedRole}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Quick Demo Presets */}
        <div className="px-6 sm:px-8 pb-6 bg-stone-50/80 border-t border-stone-100 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Judges / 1-Click Instant Access
            </span>
            <button
              onClick={onContinueToDemo}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Judge Demo Mode</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('FARMER')}
              className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-left transition shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                <Users className="w-3 h-3" />
                <span>Farmer</span>
              </div>
              <p className="text-[10px] text-stone-500 truncate mt-0.5">Ramesh Kumar</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('OPERATOR')}
              className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-left transition shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-stone-800">
                <Building2 className="w-3 h-3" />
                <span>Operator</span>
              </div>
              <p className="text-[10px] text-stone-500 truncate mt-0.5">Counter 2 Station</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-left transition shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-stone-800">
                <Landmark className="w-3 h-3" />
                <span>Admin</span>
              </div>
              <p className="text-[10px] text-stone-500 truncate mt-0.5">State Command</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
