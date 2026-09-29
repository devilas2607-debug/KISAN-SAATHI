import React, { useState, useEffect } from 'react';
import { ProcurementCentre, SlotAvailability, CentreRecommendation } from '../types';
import { useLanguage } from '../translations/LanguageContext';
import {
  Sparkles,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { getCurrentISTDate, formatISTDateShort, getRecommendedSlotTime } from '../utils/dateTime';
import { CropSelector } from './CropSelector';

interface Props {
  centres: ProcurementCentre[];
  slots: SlotAvailability[];
  onSelectAndBook: (centre: ProcurementCentre, slotTime: string, crop: string, quantity: number, village: string) => Promise<void>;
  isLoading: boolean;
}

export const CentreRecommendationCard: React.FC<Props> = ({
  centres,
  slots,
  onSelectAndBook,
  isLoading,
}) => {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState(45);
  const [farmerVillage, setFarmerVillage] = useState('Taraori');
  const [recommendations, setRecommendations] = useState<CentreRecommendation[]>([]);
  const [selectedCentre, setSelectedCentre] = useState<ProcurementCentre | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>(() => getRecommendedSlotTime());
  const [isCalculating, setIsCalculating] = useState(false);

  // Fetch or calculate recommendations when inputs change
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsCalculating(true);
      try {
        const res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop: selectedCrop,
            quantity,
            village: farmerVillage,
          }),
        });
        const data = await res.json();
        if (data.success && data.recommendations) {
          setRecommendations(data.recommendations);
          if (!selectedCentre && data.recommendations.length > 0) {
            setSelectedCentre(data.recommendations[0].centre);
          }
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setIsCalculating(false);
      }
    };

    fetchRecommendations();
  }, [selectedCrop, quantity, farmerVillage]);

  const bestChoice = recommendations.length > 0 ? recommendations[0] : null;
  const currentActiveCentre = selectedCentre || (bestChoice ? bestChoice.centre : centres[0]);

  const handleBookSlot = async () => {
    if (!currentActiveCentre) return;
    await onSelectAndBook(currentActiveCentre, selectedSlot, selectedCrop, quantity, farmerVillage);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 bg-emerald-950 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{t('recommendation.title')}</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                AI Crowd-Optimized
              </span>
            </div>
            <p className="text-xs text-stone-300">
              {t('recommendation.subtitle')}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-300 bg-emerald-900/50 px-3 py-1 rounded-lg border border-emerald-700/50">
          Statewide Network: {centres.length} Mandis Monitored
        </div>
      </div>

      {/* Input Parameters Bar */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <CropSelector
            selectedCrop={selectedCrop}
            onSelectCrop={(name) => setSelectedCrop(name)}
            label={t('slot.crop_type')}
            id="rec-crop-selector"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1.5">{t('slot.quantity_quintals')}</label>
          <input
            type="number"
            min={1}
            max={500}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full text-xs rounded-xl border border-stone-300 p-2.5 bg-white text-stone-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">{t('recommendation.farmer_village')}</label>
          <select
            value={farmerVillage}
            onChange={(e) => setFarmerVillage(e.target.value)}
            className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="Taraori">Taraori (Karnal)</option>
            <option value="Karnal City">Karnal City</option>
            <option value="Nilokheri">Nilokheri (Karnal)</option>
            <option value="Gharaunda">Gharaunda (Karnal)</option>
            <option value="Indri">Indri (Karnal)</option>
            <option value="Assandh">Assandh (Karnal)</option>
            <option value="Pipli">Pipli (Kurukshetra)</option>
            <option value="Shahabad">Shahabad Markanda</option>
            <option value="Pehowa">Pehowa (Kurukshetra)</option>
            <option value="Panipat Rural">Panipat Rural</option>
          </select>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Recommended Best Choice Hero */}
        {bestChoice && (
          <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 rounded-2xl border-2 border-emerald-500/40 p-5 shadow-xs relative overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>★ {t('recommendation.best_recommended')}</span>
                </div>
                <h4 className="text-base font-black text-stone-900">
                  {bestChoice.centre.name}
                </h4>
                <p className="text-xs text-stone-600 flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {bestChoice.distance_km} km from {farmerVillage}
                  </span>
                  <span>•</span>
                  <span>{bestChoice.centre.village_town}, {bestChoice.centre.district}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">{t('recommendation.suitability_score')}</span>
                <span className="text-2xl font-black text-emerald-800 font-mono">
                  {bestChoice.score}<span className="text-sm font-semibold text-stone-500">/100</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Highly Recommended</span>
              </div>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 font-semibold uppercase block">{t('recommendation.current_queue')}</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{bestChoice.centre.current_queue} {t('queue.ahead_plural')}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 font-semibold uppercase block">{t('recommendation.est_wait')}</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">~{bestChoice.estimated_wait_mins} {t('queue.minutes')}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 font-semibold uppercase block">{t('operator.active_counters')}</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{bestChoice.centre.active_counters} / {bestChoice.centre.total_counters}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 font-semibold uppercase block">{t('recommendation.capacity')}</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{bestChoice.centre.utilization_percentage}%</span>
              </div>
            </div>

            {/* Why This Centre Explanation */}
            <div className="mt-4 p-3.5 bg-emerald-100/40 rounded-xl border border-emerald-200/80">
              <span className="text-[11px] font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Why This Centre? (Transparent AI Decision Factors)</span>
              </span>
              <ul className="space-y-1 text-xs text-stone-800">
                {bestChoice.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Alternative Centres Ranked List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              {t('recommendation.ranked_centres')}
            </h4>
            <span className="text-[11px] text-stone-500">Click to select different centre</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {recommendations.map((rec) => {
              const isSelected = currentActiveCentre?.id === rec.centre.id;
              return (
                <div
                  key={rec.centre.id}
                  onClick={() => setSelectedCentre(rec.centre)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-400'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {rec.score}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-stone-900 font-bold">{rec.centre.name}</strong>
                        {rec.is_best_choice && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            BEST
                          </span>
                        )}
                        <span className="text-[10px] text-stone-400 font-mono">({rec.centre.id})</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        {rec.distance_km} km away • {t('recommendation.current_queue')}: {rec.centre.current_queue} • {t('recommendation.est_wait')} ~{rec.estimated_wait_mins}m
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          rec.centre.crowd_level === 'Low'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.centre.crowd_level === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.centre.crowd_level} Crowd
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-stone-300'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real Slot Availability System */}
        <div className="pt-2 border-t border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-600" />
                <span>{t('recommendation.select_time_slot', { name: currentActiveCentre?.name || '' })}</span>
              </h4>
              <p className="text-[11px] text-stone-500">
                Date: {getCurrentISTDate()} (IST) • Slots with 0 availability are disabled
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Selected: {selectedSlot}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {slots.map((slot) => {
              const isFull = slot.available_count <= 0;
              const isSelected = selectedSlot === slot.slot_time;
              return (
                <button
                  key={slot.slot_time}
                  type="button"
                  disabled={isFull}
                  onClick={() => setSelectedSlot(slot.slot_time)}
                  className={`p-2.5 rounded-xl border text-left transition relative cursor-pointer ${
                    isFull
                      ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-emerald-400 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono">{slot.slot_time}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        isFull
                          ? 'bg-rose-200 text-rose-900'
                          : isSelected
                          ? 'bg-emerald-800 text-emerald-100'
                          : slot.status === 'Filling Fast'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isFull ? 'Full' : slot.status}
                    </span>
                  </div>
                  <div className="text-[10px] mt-1.5 flex items-center justify-between">
                    <span className={isSelected ? 'text-emerald-100' : 'text-stone-500'}>
                      {isFull ? '0 left' : `${slot.available_count} left`}
                    </span>
                    <span className={isSelected ? 'text-emerald-200' : 'text-stone-400 font-mono'}>
                      {slot.booked_count}/{slot.max_capacity}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-600">
            <span className="font-semibold text-stone-900 block">
              Booking for {quantity} Quintals of {selectedCrop}
            </span>
            <span>
              At {currentActiveCentre?.name} on {formatISTDateShort()} at {selectedSlot}
            </span>
          </div>

          <button
            onClick={handleBookSlot}
            disabled={isLoading || isCalculating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('recommendation.confirm_book_slot')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
