import React from 'react';
import { AlertCircle, Home, Users, Building2, Landmark, Sparkles } from 'lucide-react';

interface Props {
  onNavigate: (tab: 'farmer' | 'operator' | 'admin' | 'judge_demo' | 'db_inspector') => void;
}

export const NotFoundView: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/80 shadow-sm p-8 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
            HTTP 404 • Page Not Found
          </span>
          <h2 className="text-xl font-black text-stone-900 mt-3">
            Procurement Destination Not Found
          </h2>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            The link or URL path you requested does not match an active page on the Smart Procurement Network. Please return to one of the verified portals below:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold pt-2">
          <button
            onClick={() => onNavigate('judge_demo')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Judge Demo</span>
          </button>

          <button
            onClick={() => onNavigate('farmer')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Farmer Portal</span>
          </button>

          <button
            onClick={() => onNavigate('operator')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white transition cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Operator Console</span>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition cursor-pointer"
          >
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span>Admin Command</span>
          </button>
        </div>

        <div className="pt-2 border-t border-stone-100">
          <button
            onClick={() => onNavigate('judge_demo')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Main Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
