import React, { useState } from 'react';
import { SlotBooking, NotificationRecord, ProcurementCentre } from '../types';
import { useLanguage } from '../translations/LanguageContext';
import { Calendar, Clock, MapPin, Ticket, CheckCircle2, Bell, ShieldCheck, ArrowRight, Receipt, Wheat, Scale, Sprout } from 'lucide-react';
import { getCurrentISTDate, getRecommendedSlotTime, STANDARD_MANDI_SLOTS } from '../utils/dateTime';
import { CropSelector } from './CropSelector';
import { getCropByName } from '../data/cropsData';

interface Props {
  booking: SlotBooking | null;
  centres?: ProcurementCentre[];
  onBookSlot: (bookingData: Partial<SlotBooking>) => Promise<void>;
  onViewReceipt?: (token: string) => void;
  isLoading: boolean;
}

export const SlotBookingCard: React.FC<Props> = ({ booking, centres = [], onBookSlot, onViewReceipt, isLoading }) => {
  const { t } = useLanguage();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [centre, setCentre] = useState('Karnal Central APMC Mandi Yard');
  const [date, setDate] = useState(() => getCurrentISTDate());
  const [time, setTime] = useState(() => getRecommendedSlotTime());
  const [cropType, setCropType] = useState('Wheat');
  const [quantity, setQuantity] = useState(45);
  const [farmerPhone, setFarmerPhone] = useState('+91 98765 43210');
  const [farmerName, setFarmerName] = useState('Ramesh Kumar');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onBookSlot({
      centre,
      date,
      time,
      crop_type: cropType,
      quantity_quintals: quantity,
      farmer_name: farmerName,
      farmer_phone: farmerPhone,
    });
    setShowBookingForm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">{t('slot.card_title')}</h2>
            <p className="text-xs text-stone-500">{t('slot.card_subtitle')}</p>
          </div>
        </div>

        <button
          id="btn-toggle-slot-form"
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition cursor-pointer"
        >
          {showBookingForm ? t('slot.view_current_slot') : t('slot.book_new_slot')}
        </button>
      </div>

      {showBookingForm ? (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('slot.procurement_centre')}</label>
              <select
                value={centre}
                onChange={(e) => setCentre(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {centres.length > 0 ? (
                  centres.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.id} - {c.district})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Karnal Central APMC Mandi Yard">Karnal Central APMC Mandi Yard (PC-101)</option>
                    <option value="Taraori Grain Terminal & Silo">Taraori Grain Terminal & Silo (PC-102)</option>
                    <option value="Nilokheri Sub-Mandi Yard">Nilokheri Sub-Mandi Yard (PC-103)</option>
                    <option value="Gharaunda Kisan Seva Kendra & Mandi">Gharaunda Kisan Seva Kendra & Mandi (PC-104)</option>
                    <option value="Kurukshetra Pipli Regional Hub">Kurukshetra Pipli Regional Hub (PC-105)</option>
                    <option value="Assandh Grain Mandi Samiti">Assandh Grain Mandi Samiti (PC-106)</option>
                    <option value="Indri Farmers Welfare Depot">Indri Farmers Welfare Depot (PC-107)</option>
                    <option value="Panipat Model Agricultural Terminal">Panipat Model Agricultural Terminal (PC-108)</option>
                    <option value="Shahabad Markanda Food Silo">Shahabad Markanda Food Silo (PC-109)</option>
                    <option value="Pehowa Grain Mandi & Weigh Centre">Pehowa Grain Mandi & Weigh Centre (PC-110)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">{t('slot.appointment_date')}</label>
                <button
                  type="button"
                  onClick={() => setDate(getCurrentISTDate())}
                  className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  Set Today (IST)
                </button>
              </div>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder={getCurrentISTDate()}
                className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('slot.appointment_time')}</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="09:00 AM">09:00 AM - 09:30 AM</option>
                <option value="09:30 AM">09:30 AM - 10:00 AM</option>
                <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                <option value="10:30 AM">10:30 AM - 11:00 AM</option>
                <option value="11:00 AM">11:00 AM - 11:30 AM</option>
                <option value="11:30 AM">11:30 AM - 12:00 PM</option>
                <option value="12:00 PM">12:00 PM - 12:30 PM</option>
                <option value="02:00 PM">02:00 PM - 02:30 PM</option>
                <option value="02:30 PM">02:30 PM - 03:00 PM</option>
                <option value="03:00 PM">03:00 PM - 03:30 PM</option>
                <option value="03:30 PM">03:30 PM - 04:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('farmer.farmer_phone')}</label>
              <input
                type="text"
                value={farmerPhone}
                onChange={(e) => setFarmerPhone(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <CropSelector
                selectedCrop={cropType}
                onSelectCrop={(name) => setCropType(name)}
                label={t('slot.crop_type')}
                id="booking-form-crop-selector"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('slot.quantity_quintals')}</label>
              <input
                type="number"
                min={1}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setShowBookingForm(false)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 cursor-pointer"
            >
              {t('common.cancel')}
            </button>
            <button
              id="btn-submit-booking"
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition disabled:opacity-50 cursor-pointer"
            >
              {t('slot.confirm_booking')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      ) : booking ? (
        <div className="p-5">
          {/* Confirmed Slot Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-4.5 mb-5 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded">
                      {t('slot.booking_confirmed')}
                    </span>
                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {t('farmer.verified_kisan')}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-emerald-950 mt-1">
                    {t('common.token')} #{booking.token}
                  </h3>
                  <p className="text-xs text-emerald-900 mt-0.5">
                    {t('farmer.farmer_name')}: <span className="font-semibold">{booking.farmer_name}</span> ({booking.farmer_phone})
                  </p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase">Booking ID</span>
                <p className="text-xs font-mono font-bold text-emerald-950">{booking.id}</p>
              </div>
            </div>

            {/* Structured details per Prompt Specification */}
            <div className="mt-4 pt-4 border-t border-emerald-200/70 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {t('common.centre')}
                </span>
                <p className="font-bold text-stone-900 mt-0.5 truncate">{booking.centre}</p>
              </div>
              <div>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {t('common.date')}
                </span>
                <p className="font-bold text-stone-900 mt-0.5">{booking.date}</p>
              </div>
              <div>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t('common.time')}
                </span>
                <p className="font-bold text-stone-900 mt-0.5">{booking.time}</p>
              </div>
              <div>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Ticket className="w-3 h-3" /> {t('common.token')}
                </span>
                <p className="font-extrabold text-emerald-700 text-sm mt-0.5">{booking.token}</p>
              </div>
              <div>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Wheat className="w-3 h-3" /> {t('slot.crop_type')}
                </span>
                <p className="font-bold text-stone-900 mt-0.5 flex items-center gap-1 truncate">
                  <span>{booking.crop_type || 'Wheat'}</span>
                </p>
              </div>
              <div>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Scale className="w-3 h-3" /> {t('slot.quantity_quintals')}
                </span>
                <p className="font-bold text-emerald-900 mt-0.5">
                  {booking.quantity_quintals || 45} Quintals
                </p>
              </div>
            </div>
          </div>

          {/* Scheduled Farmer Reminders Checklist (Prompt Spec 1 & 2) */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-emerald-600" />
                Scheduled Multi-Stage Notifications
              </h4>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Auto-Scheduled ✓
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-stone-800">24 Hours Before Appointment</span>
                </div>
                <span className="text-[11px] font-mono text-stone-500">SMS Reminder + MSP Checklist</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-stone-800">2 Hours Before Appointment</span>
                </div>
                <span className="text-[11px] font-mono text-stone-500">SMS Alert (Vehicle & Harvest prep)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-stone-800">When Turn Approaching (≤ 3 Ahead)</span>
                </div>
                <span className="text-[11px] font-mono text-amber-700 font-semibold">Smart Queue Push + SMS</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-medium text-stone-800">Token Called by Operator</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold">Audible Alarm + Screen Pop + SMS</span>
              </div>
            </div>
          </div>

          {/* Digital Receipt Trigger if available */}
          {onViewReceipt && (
            <div className="pt-2 flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-semibold text-stone-800">
                  {t('receipt.title')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onViewReceipt(booking.token)}
                className="px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-xs font-bold text-stone-800 transition cursor-pointer"
              >
                {t('slot.view_receipt')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <Ticket className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-xs text-stone-500">No active procurement appointment loaded.</p>
          <button
            onClick={() => setShowBookingForm(true)}
            className="mt-3 px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 rounded-lg cursor-pointer hover:bg-emerald-800 transition"
          >
            {t('slot.book_new_slot')}
          </button>
        </div>
      )}
    </div>
  );
};
