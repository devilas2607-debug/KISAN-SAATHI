import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Check,
  ChevronDown,
  Wheat,
  CircleDot,
  Droplets,
  BadgePercent,
  Carrot,
  Apple,
  Flame,
  Leaf,
  Sparkles,
  X,
  Tag,
} from 'lucide-react';
import { CropItem, CropCategory } from '../types';
import { ALL_CROPS, CROP_CATEGORIES, getCropByName, getPopularCrops } from '../data/cropsData';

interface CropSelectorProps {
  selectedCrop: string;
  onSelectCrop: (cropName: string, item?: CropItem) => void;
  label?: string;
  placeholder?: string;
  showMspBadge?: boolean;
  compact?: boolean;
  className?: string;
  id?: string;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  selectedCrop,
  onSelectCrop,
  label = 'Select Crop / फसल का चयन करें',
  placeholder = 'Search & select crop (e.g. Wheat, Rice, Mustard, Chana)...',
  showMspBadge = true,
  compact = false,
  className = '',
  id = 'crop-selector',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentCropItem = useMemo(() => {
    return getCropByName(selectedCrop);
  }, [selectedCrop]);

  const popularCrops = useMemo(() => getPopularCrops(), []);

  // Filtered crops based on search and category
  const filteredCrops = useMemo(() => {
    let list = ALL_CROPS;

    if (activeCategory !== 'All') {
      list = list.filter((c) => c.category === activeCategory);
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter((crop) => {
      if (crop.name.toLowerCase().includes(q)) return true;
      if (crop.category.toLowerCase().includes(q)) return true;
      if (crop.hindiName && crop.hindiName.toLowerCase().includes(q)) return true;
      if (crop.aliases && crop.aliases.some((a) => a.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [searchQuery, activeCategory]);

  // Group filtered crops by category for neat presentation
  const groupedCrops = useMemo(() => {
    const groups: { [key in CropCategory]?: CropItem[] } = {};
    filteredCrops.forEach((c) => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category]!.push(c);
    });
    return groups;
  }, [filteredCrops]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cereals':
        return <Wheat className="w-3.5 h-3.5 text-amber-600" />;
      case 'Pulses':
        return <CircleDot className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Oilseeds':
        return <Droplets className="w-3.5 h-3.5 text-yellow-600" />;
      case 'Commercial / Cash Crops':
        return <BadgePercent className="w-3.5 h-3.5 text-blue-600" />;
      case 'Vegetables':
        return <Carrot className="w-3.5 h-3.5 text-green-600" />;
      case 'Fruits':
        return <Apple className="w-3.5 h-3.5 text-rose-600" />;
      case 'Spices':
        return <Flame className="w-3.5 h-3.5 text-orange-600" />;
      default:
        return <Leaf className="w-3.5 h-3.5 text-teal-600" />;
    }
  };

  const handleSelect = (crop: CropItem) => {
    onSelectCrop(crop.name, crop);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <Wheat className="w-3.5 h-3.5 text-emerald-600" />
            <span>{label}</span>
          </label>
          {currentCropItem && showMspBadge && (
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              MSP: ₹{currentCropItem.mspRatePerQuintal.toLocaleString('en-IN')}/Q
            </span>
          )}
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={`${id}-trigger`}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
          compact ? 'p-2 text-xs' : 'p-2.5 text-xs sm:text-sm'
        } ${
          isOpen
            ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-white shadow-sm'
            : 'border-stone-300 bg-white hover:border-emerald-500 hover:bg-stone-50/50 text-stone-800'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {currentCropItem ? (
            <>
              <div className="p-1 rounded-md bg-emerald-50 text-emerald-700 shrink-0">
                {getCategoryIcon(currentCropItem.category)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-stone-900 truncate">{currentCropItem.name}</span>
                  {currentCropItem.hindiName && (
                    <span className="text-[11px] text-stone-500 truncate font-normal">
                      ({currentCropItem.hindiName})
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                    {currentCropItem.category}
                  </span>
                </div>
              </div>
            </>
          ) : selectedCrop ? (
            <div className="flex items-center gap-2 truncate">
              <Wheat className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-stone-900 truncate">{selectedCrop}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-stone-400">
              <Search className="w-4 h-4 shrink-0" />
              <span className="truncate">{placeholder}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
            {isOpen ? 'Close' : 'Browse'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-emerald-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown / Selection Drawer */}
      {isOpen && (
        <div
          id={`${id}-dropdown`}
          className="absolute left-0 right-0 z-50 mt-1.5 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[460px] animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Search Header */}
          <div className="p-3 border-b border-stone-100 bg-stone-50/80 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                id={`${id}-search-input`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by crop, Hindi name, variety (e.g. Wheat, Chana, धान)..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white rounded-xl border border-stone-300 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick 1-Tap Popular Chips */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <span className="text-stone-400 flex items-center gap-1 shrink-0 font-medium mr-0.5">
                <Sparkles className="w-3 h-3 text-amber-500" /> Popular:
              </span>
              {popularCrops.slice(0, 7).map((pop) => (
                <button
                  key={pop.id}
                  type="button"
                  onClick={() => handleSelect(pop)}
                  className={`px-2 py-0.5 rounded-full border shrink-0 transition-colors cursor-pointer font-medium ${
                    selectedCrop === pop.name
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/60'
                  }`}
                >
                  {pop.name}
                </button>
              ))}
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-2 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer text-[11px] ${
                  activeCategory === 'All'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                All ({ALL_CROPS.length})
              </button>
              {CROP_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer text-[11px] flex items-center gap-1 ${
                    activeCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Crops List / Results */}
          <div className="overflow-y-auto p-2 divide-y divide-stone-100 flex-1">
            {filteredCrops.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <Tag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-700">No matching crops found</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Try searching with an alternate name or choose from categories above.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Clear search & filters
                </button>
              </div>
            ) : activeCategory === 'All' && !searchQuery ? (
              // Grouped by Category View
              CROP_CATEGORIES.map((cat) => {
                const cropsInGroup = groupedCrops[cat.id];
                if (!cropsInGroup || cropsInGroup.length === 0) return null;
                return (
                  <div key={cat.id} className="py-2 first:pt-0">
                    <div className="px-2.5 py-1 flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider bg-stone-50/90 rounded-md mb-1">
                      <span className="flex items-center gap-1.5">
                        {getCategoryIcon(cat.id)}
                        <span>{cat.name}</span>
                        <span className="text-stone-400 font-normal">({cat.nameHi})</span>
                      </span>
                      <span className="font-mono text-stone-400">{cropsInGroup.length}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                      {cropsInGroup.map((crop) => {
                        const isSelected = selectedCrop === crop.name;
                        return (
                          <button
                            key={crop.id}
                            type="button"
                            onClick={() => handleSelect(crop)}
                            className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-semibold shadow-xs'
                                : 'hover:bg-stone-50 text-stone-800 border border-transparent'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-stone-900">{crop.name}</span>
                                {crop.popular && (
                                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1 rounded">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-500 truncate mt-0.5 flex items-center gap-1">
                                {crop.hindiName && <span>{crop.hindiName}</span>}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block">
                                ₹{crop.mspRatePerQuintal.toLocaleString('en-IN')}/Q
                              </span>
                            </div>

                            {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              // Filtered Flat Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-1">
                {filteredCrops.map((crop) => {
                  const isSelected = selectedCrop === crop.name;
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => handleSelect(crop)}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-semibold shadow-xs'
                          : 'hover:bg-stone-50 text-stone-800 border border-stone-100'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(crop.category)}
                          <span className="text-xs font-bold text-stone-900">{crop.name}</span>
                          {crop.popular && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1 rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5 flex items-center gap-1 pl-4">
                          {crop.hindiName && <span>{crop.hindiName}</span>}
                          <span>•</span>
                          <span className="text-[10px] text-stone-400">{crop.category}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block">
                          ₹{crop.mspRatePerQuintal.toLocaleString('en-IN')}/Q
                        </span>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-2 border-t border-stone-100 bg-stone-50 text-[11px] text-stone-500 flex items-center justify-between shrink-0">
            <span>
              Showing <strong>{filteredCrops.length}</strong> Indian Agricultural Crops
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
