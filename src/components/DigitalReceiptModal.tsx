import React from 'react';
import { DigitalReceipt } from '../types';
import { useLanguage } from '../translations/LanguageContext';
import { ShieldCheck, Printer, CheckCircle2, Download, X, QrCode, Building2, Landmark } from 'lucide-react';

interface Props {
  receipt: DigitalReceipt | null;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<Props> = ({ receipt, onClose }) => {
  const { t } = useLanguage();
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t('receipt.title')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 text-xs bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded text-stone-200 font-medium transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('receipt.print')}</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="procurement-receipt-paper" className="p-6 text-stone-900 font-sans space-y-5">
          {/* Official Emblem & Header */}
          <div className="text-center border-b-2 border-stone-800 pb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 text-stone-800 mb-1">
              <Landmark className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-wider text-stone-900">
              {t('receipt.dept_title')}
            </h2>
            <p className="text-xs text-stone-600 font-semibold">
              {t('receipt.board_subtitle')}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {t('receipt.rule_subtitle')}
            </p>
          </div>

          {/* Receipt Meta Row */}
          <div className="grid grid-cols-2 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
            <div>
              <span className="text-stone-500 block">{t('receipt.receipt_no')}:</span>
              <span className="font-mono font-bold text-stone-900">{receipt.receipt_id}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block">{t('common.date')}:</span>
              <span className="font-semibold text-stone-800">{receipt.date} • {receipt.time}</span>
            </div>
          </div>

          {/* Core Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 border-r border-stone-200 pr-3">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block border-b border-stone-200 pb-1">
                {t('receipt.farmer_details')}
              </span>
              <div>
                <span className="text-stone-500 block">{t('farmer.farmer_name')}:</span>
                <strong className="text-stone-900 text-sm">{receipt.farmer_name}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">{t('farmer.farmer_phone')}:</span>
                <span className="font-mono text-stone-700">{receipt.farmer_id} ({receipt.farmer_phone})</span>
              </div>
              <div>
                <span className="text-stone-500 block">{t('slot.crop_type')}:</span>
                <strong className="text-stone-900">{receipt.crop_type}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">{t('common.token')}:</span>
                <span className="font-mono font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                  {receipt.token}
                </span>
              </div>
            </div>

            <div className="space-y-2 pl-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block border-b border-stone-200 pb-1">
                {t('receipt.weighment_details')}
              </span>
              <div>
                <span className="text-stone-500 block">{t('common.centre')}:</span>
                <strong className="text-stone-900">{receipt.centre_name}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">{t('common.quantity')}:</span>
                <span className="font-medium text-stone-700">{receipt.declared_quantity_quintals} {t('common.quintal')}</span>
              </div>
              <div>
                <span className="text-stone-500 block">{t('receipt.net_weight')}:</span>
                <strong className="text-sm text-stone-900 font-mono">{receipt.actual_weight_quintals} {t('common.quintal')}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">{t('receipt.moisture_content')}:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {receipt.moisture_percentage}% • {t('receipt.quality_grade')} FAQ
                </span>
              </div>
            </div>
          </div>

          {/* Financial Calculation Table */}
          <div className="border border-stone-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-stone-100 border-b border-stone-300 text-stone-700 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2">{t('common.crop')}</th>
                  <th className="p-2 text-right">{t('receipt.net_weight')}</th>
                  <th className="p-2 text-right">{t('receipt.msp_rate_quintal')}</th>
                  <th className="p-2 text-right">{t('receipt.total_payable')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-medium">
                <tr>
                  <td className="p-2 font-semibold text-stone-800">
                    {receipt.crop_type}
                  </td>
                  <td className="p-2 text-right font-mono">{receipt.actual_weight_quintals} Q</td>
                  <td className="p-2 text-right font-mono">₹{receipt.msp_rate_per_quintal.toLocaleString('en-IN')}</td>
                  <td className="p-2 text-right font-mono font-bold text-stone-900">
                    ₹{receipt.total_amount_inr.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-600">
                <tr>
                  <td colSpan={3} className="p-2.5 text-right uppercase text-[11px]">
                    {t('receipt.direct_transfer')} (DBT):
                  </td>
                  <td className="p-2.5 text-right text-sm font-black font-mono">
                    ₹{receipt.total_amount_inr.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* DBT Payment Status Banner */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">{t('receipt.dbt_status')} (UTR)</span>
              <span className="font-mono font-bold text-stone-900">{receipt.bank_utr}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">{t('common.payment')}</span>
              <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                {t('receipt.payment_processed')}
              </span>
            </div>
          </div>

          {/* Footer Signatures & QR Code */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <div className="p-1 border border-stone-300 rounded bg-white">
                <QrCode className="w-8 h-8 text-stone-800" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-stone-400">VERIFY-ID: {receipt.transaction_id}</p>
                <p className="text-[10px]">Digitally authenticated by Mandi Weighbridge Operator</p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-semibold text-stone-800">{receipt.operator_id}</div>
              <div className="text-[10px] text-stone-500">Authorised Signatory</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-100 transition cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
