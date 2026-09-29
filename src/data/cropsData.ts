import { CropCategory, CropItem } from '../types';

export interface CropCategoryMeta {
  id: CropCategory;
  name: string;
  nameHi: string;
  icon: string;
  badgeColor: string;
}

export const CROP_CATEGORIES: CropCategoryMeta[] = [
  {
    id: 'Cereals',
    name: 'Cereals',
    nameHi: 'अनाज / खाद्यान्न',
    icon: 'Wheat',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'Pulses',
    name: 'Pulses',
    nameHi: 'दालें',
    icon: 'CircleDot',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  {
    id: 'Oilseeds',
    name: 'Oilseeds',
    nameHi: 'तिलहन',
    icon: 'Droplets',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  },
  {
    id: 'Commercial / Cash Crops',
    name: 'Commercial / Cash Crops',
    nameHi: 'नकदी फसलें',
    icon: 'BadgePercent',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  {
    id: 'Vegetables',
    name: 'Vegetables',
    nameHi: 'सब्जियां',
    icon: 'Carrot',
    badgeColor: 'bg-green-100 text-green-900 border-green-300',
  },
  {
    id: 'Fruits',
    name: 'Fruits',
    nameHi: 'फल',
    icon: 'Apple',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
  },
  {
    id: 'Spices',
    name: 'Spices',
    nameHi: 'मसाले',
    icon: 'Flame',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  {
    id: 'Other Crops',
    name: 'Other Important Crops',
    nameHi: 'अन्य महत्वपूर्ण फसलें',
    icon: 'Leaf',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
  },
];

export const ALL_CROPS: CropItem[] = [
  // 1. CEREALS
  {
    id: 'cereal-wheat',
    name: 'Wheat',
    category: 'Cereals',
    hindiName: 'गेहूं (Gehu)',
    aliases: ['Wheat', 'Gehu', 'Kanak', 'Sharbati', 'HD-2967', 'PBW-550', 'DBW-187'],
    mspRatePerQuintal: 2275,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'cereal-rice-paddy',
    name: 'Rice / Paddy',
    category: 'Cereals',
    hindiName: 'धान / चावल (Dhan)',
    aliases: ['Rice', 'Paddy', 'Dhan', 'Basmati', 'Chawal', 'Sarna', 'PR-126'],
    mspRatePerQuintal: 2300,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'cereal-maize',
    name: 'Maize',
    category: 'Cereals',
    hindiName: 'मक्का (Makka)',
    aliases: ['Maize', 'Corn', 'Makka', 'Makai', 'Bhutte'],
    mspRatePerQuintal: 2090,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'cereal-barley',
    name: 'Barley',
    category: 'Cereals',
    hindiName: 'जौ (Jau)',
    aliases: ['Barley', 'Jau', 'Jav'],
    mspRatePerQuintal: 1850,
    unit: 'Quintal',
  },
  {
    id: 'cereal-sorghum-jowar',
    name: 'Sorghum / Jowar',
    category: 'Cereals',
    hindiName: 'ज्वार (Jowar)',
    aliases: ['Sorghum', 'Jowar', 'Jowari', 'Cholam', 'Great Millet'],
    mspRatePerQuintal: 3180,
    unit: 'Quintal',
  },
  {
    id: 'cereal-pearl-millet-bajra',
    name: 'Pearl Millet / Bajra',
    category: 'Cereals',
    hindiName: 'बाजरा (Bajra)',
    aliases: ['Pearl Millet', 'Bajra', 'Bajri', 'Kambu', 'Sajje'],
    mspRatePerQuintal: 2500,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'cereal-finger-millet-ragi',
    name: 'Finger Millet / Ragi',
    category: 'Cereals',
    hindiName: 'रागी / मडुआ (Ragi)',
    aliases: ['Finger Millet', 'Ragi', 'Madua', 'Nachni', 'Mandua', 'Kezhvaragu'],
    mspRatePerQuintal: 3846,
    unit: 'Quintal',
  },

  // 2. PULSES
  {
    id: 'pulse-chickpea-gram-chana',
    name: 'Chickpea / Gram / Chana',
    category: 'Pulses',
    hindiName: 'चना (Chana Desi / Kabuli)',
    aliases: ['Chickpea', 'Gram', 'Chana', 'Desi Chana', 'Kabuli Chana', 'Bengal Gram'],
    mspRatePerQuintal: 5440,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'pulse-pigeon-pea-arhar-tur',
    name: 'Pigeon Pea / Arhar / Tur',
    category: 'Pulses',
    hindiName: 'अरहर / तूर (Arhar / Tur)',
    aliases: ['Pigeon Pea', 'Arhar', 'Tur', 'Toor Dal', 'Red Gram'],
    mspRatePerQuintal: 7000,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'pulse-lentil-masoor',
    name: 'Lentil / Masoor',
    category: 'Pulses',
    hindiName: 'मसूर (Masoor Dal)',
    aliases: ['Lentil', 'Masoor', 'Masur', 'Red Lentil'],
    mspRatePerQuintal: 6425,
    unit: 'Quintal',
  },
  {
    id: 'pulse-green-gram-moong',
    name: 'Green Gram / Moong',
    category: 'Pulses',
    hindiName: 'मूंग (Moong Dal)',
    aliases: ['Green Gram', 'Moong', 'Mung', 'Mung Bean', 'Pesalu'],
    mspRatePerQuintal: 8558,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'pulse-black-gram-urad',
    name: 'Black Gram / Urad',
    category: 'Pulses',
    hindiName: 'उड़द (Urad Dal)',
    aliases: ['Black Gram', 'Urad', 'Udid', 'Mash', 'Minumulu'],
    mspRatePerQuintal: 6950,
    unit: 'Quintal',
  },
  {
    id: 'pulse-peas',
    name: 'Peas (Field Peas / Matar)',
    category: 'Pulses',
    hindiName: 'मटर (Matar / Dry Peas)',
    aliases: ['Peas', 'Dry Peas', 'Matar', 'Vatana', 'Batani'],
    mspRatePerQuintal: 4200,
    unit: 'Quintal',
  },

  // 3. OILSEEDS
  {
    id: 'oilseed-mustard',
    name: 'Mustard',
    category: 'Oilseeds',
    hindiName: 'सरसों / राई (Sarson)',
    aliases: ['Mustard', 'Sarson', 'Rai', 'Torai', 'Pusa Bold', 'Rapeseed'],
    mspRatePerQuintal: 5650,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'oilseed-groundnut',
    name: 'Groundnut',
    category: 'Oilseeds',
    hindiName: 'मूंगफली (Mungfali)',
    aliases: ['Groundnut', 'Peanut', 'Mungfali', 'Shengdana', 'Verkadalai'],
    mspRatePerQuintal: 6377,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'oilseed-soybean',
    name: 'Soybean',
    category: 'Oilseeds',
    hindiName: 'सोयाबीन (Soyabean)',
    aliases: ['Soybean', 'Soyabean', 'Bhat', 'Soya'],
    mspRatePerQuintal: 4892,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'oilseed-sunflower',
    name: 'Sunflower',
    category: 'Oilseeds',
    hindiName: 'सूरजमुखी (Surajmukhi)',
    aliases: ['Sunflower', 'Surajmukhi', 'Surya Phool'],
    mspRatePerQuintal: 6760,
    unit: 'Quintal',
  },
  {
    id: 'oilseed-sesame',
    name: 'Sesame',
    category: 'Oilseeds',
    hindiName: 'तिल (Til)',
    aliases: ['Sesame', 'Til', 'Gingelly', 'Ellu'],
    mspRatePerQuintal: 8635,
    unit: 'Quintal',
  },
  {
    id: 'oilseed-linseed',
    name: 'Linseed',
    category: 'Oilseeds',
    hindiName: 'अलसी (Alsi)',
    aliases: ['Linseed', 'Flaxseed', 'Alsi', 'Jawas'],
    mspRatePerQuintal: 5200,
    unit: 'Quintal',
  },

  // 4. COMMERCIAL / CASH CROPS
  {
    id: 'commercial-sugarcane',
    name: 'Sugarcane',
    category: 'Commercial / Cash Crops',
    hindiName: 'गन्ना (Ganna)',
    aliases: ['Sugarcane', 'Ganna', 'Ikkshu', 'Karumbu', 'Cheruku'],
    mspRatePerQuintal: 340,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'commercial-cotton',
    name: 'Cotton',
    category: 'Commercial / Cash Crops',
    hindiName: 'कपास (Kapas / Narma)',
    aliases: ['Cotton', 'Kapas', 'Narma', 'Rui', 'Patti'],
    mspRatePerQuintal: 7121,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'commercial-jute',
    name: 'Jute',
    category: 'Commercial / Cash Crops',
    hindiName: 'जूट / पटसन (Pat)',
    aliases: ['Jute', 'Pat', 'Patson', 'Golden Fibre', 'Mesta'],
    mspRatePerQuintal: 5050,
    unit: 'Quintal',
  },
  {
    id: 'commercial-tobacco',
    name: 'Tobacco',
    category: 'Commercial / Cash Crops',
    hindiName: 'तम्बाकू (Tambaku)',
    aliases: ['Tobacco', 'Tambaku', 'Pogaaku'],
    mspRatePerQuintal: 8200,
    unit: 'Quintal',
  },

  // 5. VEGETABLES
  {
    id: 'veg-potato',
    name: 'Potato',
    category: 'Vegetables',
    hindiName: 'आलू (Aloo)',
    aliases: ['Potato', 'Aloo', 'Alu', 'Batata', 'Urulaikizhangu'],
    mspRatePerQuintal: 1450,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'veg-tomato',
    name: 'Tomato',
    category: 'Vegetables',
    hindiName: 'टमाटर (Tamatar)',
    aliases: ['Tomato', 'Tamatar', 'Thakkali'],
    mspRatePerQuintal: 1800,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'veg-onion',
    name: 'Onion',
    category: 'Vegetables',
    hindiName: 'प्याज (Pyaz)',
    aliases: ['Onion', 'Pyaz', 'Kanda', 'Ullipaya', 'Vengayam'],
    mspRatePerQuintal: 1650,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'veg-garlic',
    name: 'Garlic',
    category: 'Vegetables',
    hindiName: 'लहसुन (Lahsun)',
    aliases: ['Garlic', 'Lahsun', 'Lasun', 'Poondu', 'Vellulli'],
    mspRatePerQuintal: 8500,
    unit: 'Quintal',
  },
  {
    id: 'veg-cabbage',
    name: 'Cabbage',
    category: 'Vegetables',
    hindiName: 'पत्तागोभी (Patta Gobhi)',
    aliases: ['Cabbage', 'Patta Gobhi', 'Bandha Kobi', 'Muttakose'],
    mspRatePerQuintal: 1100,
    unit: 'Quintal',
  },
  {
    id: 'veg-cauliflower',
    name: 'Cauliflower',
    category: 'Vegetables',
    hindiName: 'फूलगोभी (Phool Gobhi)',
    aliases: ['Cauliflower', 'Phool Gobhi', 'Gobi'],
    mspRatePerQuintal: 1300,
    unit: 'Quintal',
  },
  {
    id: 'veg-brinjal-eggplant',
    name: 'Brinjal / Eggplant',
    category: 'Vegetables',
    hindiName: 'बैंगन (Baingan)',
    aliases: ['Brinjal', 'Eggplant', 'Baingan', 'Vangi', 'Kathirikai', 'Vankaya'],
    mspRatePerQuintal: 1250,
    unit: 'Quintal',
  },
  {
    id: 'veg-okra-lady-finger',
    name: 'Okra / Lady Finger',
    category: 'Vegetables',
    hindiName: 'भिंडी (Bhindi)',
    aliases: ['Okra', 'Lady Finger', 'Bhindi', 'Bhendi', 'Vendakkai', 'Bendakaya'],
    mspRatePerQuintal: 2100,
    unit: 'Quintal',
  },
  {
    id: 'veg-peas-green',
    name: 'Peas (Green Vegetable)',
    category: 'Vegetables',
    hindiName: 'हरी मटर (Hari Matar)',
    aliases: ['Green Peas', 'Peas', 'Hari Matar', 'Fresh Matar'],
    mspRatePerQuintal: 3400,
    unit: 'Quintal',
  },
  {
    id: 'veg-carrot',
    name: 'Carrot',
    category: 'Vegetables',
    hindiName: 'गाजर (Gajar)',
    aliases: ['Carrot', 'Gajar', 'Gajjara'],
    mspRatePerQuintal: 1400,
    unit: 'Quintal',
  },
  {
    id: 'veg-radish',
    name: 'Radish',
    category: 'Vegetables',
    hindiName: 'मूली (Mooli)',
    aliases: ['Radish', 'Mooli', 'Mula', 'Mullangi'],
    mspRatePerQuintal: 950,
    unit: 'Quintal',
  },
  {
    id: 'veg-spinach',
    name: 'Spinach',
    category: 'Vegetables',
    hindiName: 'पालक (Palak)',
    aliases: ['Spinach', 'Palak', 'Keerai', 'Pala Kura'],
    mspRatePerQuintal: 1200,
    unit: 'Quintal',
  },
  {
    id: 'veg-chilli',
    name: 'Chilli (Fresh Green)',
    category: 'Vegetables',
    hindiName: 'हरी मिर्च (Hari Mirch)',
    aliases: ['Chilli', 'Green Chilli', 'Hari Mirch', 'Mirchi', 'Pachai Milagai'],
    mspRatePerQuintal: 4800,
    unit: 'Quintal',
  },

  // 6. FRUITS
  {
    id: 'fruit-mango',
    name: 'Mango',
    category: 'Fruits',
    hindiName: 'आम (Aam)',
    aliases: ['Mango', 'Aam', 'Manga', 'Alphonso', 'Kesar', 'Dasheri', 'Langra'],
    mspRatePerQuintal: 4500,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'fruit-banana',
    name: 'Banana',
    category: 'Fruits',
    hindiName: 'केला (Kela)',
    aliases: ['Banana', 'Kela', 'Vazhaipazham', 'Arati Pandu', 'Robusta', 'G9'],
    mspRatePerQuintal: 2100,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'fruit-apple',
    name: 'Apple',
    category: 'Fruits',
    hindiName: 'सेब (Seb)',
    aliases: ['Apple', 'Seb', 'Kullu Delicious', 'Royal Gala'],
    mspRatePerQuintal: 7500,
    unit: 'Quintal',
  },
  {
    id: 'fruit-orange',
    name: 'Orange',
    category: 'Fruits',
    hindiName: 'संतरा / मौसंबी (Santara)',
    aliases: ['Orange', 'Santara', 'Mosambi', 'Nagpur Orange', 'Kinnow'],
    mspRatePerQuintal: 3800,
    unit: 'Quintal',
  },
  {
    id: 'fruit-guava',
    name: 'Guava',
    category: 'Fruits',
    hindiName: 'अमरूद (Amrood)',
    aliases: ['Guava', 'Amrood', 'Peru', 'Koyyapazham'],
    mspRatePerQuintal: 2800,
    unit: 'Quintal',
  },
  {
    id: 'fruit-grapes',
    name: 'Grapes',
    category: 'Fruits',
    hindiName: 'अंगूर (Angoor)',
    aliases: ['Grapes', 'Angoor', 'Draksha', 'Nashik Grapes', 'Thomson'],
    mspRatePerQuintal: 6200,
    unit: 'Quintal',
  },
  {
    id: 'fruit-papaya',
    name: 'Papaya',
    category: 'Fruits',
    hindiName: 'पपीता (Papita)',
    aliases: ['Papaya', 'Papita', 'Pappali', 'Boppayi'],
    mspRatePerQuintal: 1900,
    unit: 'Quintal',
  },
  {
    id: 'fruit-pomegranate',
    name: 'Pomegranate',
    category: 'Fruits',
    hindiName: 'अनार (Anaar)',
    aliases: ['Pomegranate', 'Anaar', 'Anar', 'Dalimb', 'Bhagwa'],
    mspRatePerQuintal: 7800,
    unit: 'Quintal',
  },
  {
    id: 'fruit-watermelon',
    name: 'Watermelon',
    category: 'Fruits',
    hindiName: 'तरबूज (Tarbooj)',
    aliases: ['Watermelon', 'Tarbooj', 'Kalingad', 'Thannirmathan'],
    mspRatePerQuintal: 1100,
    unit: 'Quintal',
  },
  {
    id: 'fruit-muskmelon',
    name: 'Muskmelon',
    category: 'Fruits',
    hindiName: 'खरबूजा (Kharbooja)',
    aliases: ['Muskmelon', 'Cantaloupe', 'Kharbooja', 'Chibood'],
    mspRatePerQuintal: 1400,
    unit: 'Quintal',
  },

  // 7. SPICES
  {
    id: 'spice-turmeric',
    name: 'Turmeric',
    category: 'Spices',
    hindiName: 'हल्दी (Haldi)',
    aliases: ['Turmeric', 'Haldi', 'Pasupu', 'Manjal', 'Curcuma'],
    mspRatePerQuintal: 8200,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'spice-ginger',
    name: 'Ginger',
    category: 'Spices',
    hindiName: 'अदरक (Adrak / Sonth)',
    aliases: ['Ginger', 'Adrak', 'Sonth', 'Inji', 'Allam'],
    mspRatePerQuintal: 7400,
    unit: 'Quintal',
  },
  {
    id: 'spice-coriander',
    name: 'Coriander',
    category: 'Spices',
    hindiName: 'धनिया (Dhaniya Seeds)',
    aliases: ['Coriander', 'Dhaniya', 'Kothamalli', 'Dhania'],
    mspRatePerQuintal: 7600,
    unit: 'Quintal',
  },
  {
    id: 'spice-cumin',
    name: 'Cumin',
    category: 'Spices',
    hindiName: 'जीरा (Jeera)',
    aliases: ['Cumin', 'Jeera', 'Jira', 'Seeragam', 'Jeelakarra'],
    mspRatePerQuintal: 28500,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'spice-black-pepper',
    name: 'Black Pepper',
    category: 'Spices',
    hindiName: 'काली मिर्च (Kali Mirch)',
    aliases: ['Black Pepper', 'Kali Mirch', 'Milagu', 'Miriyalu', 'Golmorich'],
    mspRatePerQuintal: 42000,
    unit: 'Quintal',
  },
  {
    id: 'spice-cardamom',
    name: 'Cardamom',
    category: 'Spices',
    hindiName: 'इलायची (Elaichi)',
    aliases: ['Cardamom', 'Elaichi', 'Chhoti Elaichi', 'Yelakkai', 'Elakki'],
    mspRatePerQuintal: 120000,
    unit: 'Quintal',
  },
  {
    id: 'spice-chilli-dry',
    name: 'Chilli (Dry Red)',
    category: 'Spices',
    hindiName: 'लाल मिर्च (Lal Mirch)',
    aliases: ['Chilli', 'Dry Red Chilli', 'Lal Mirch', 'Guntur Mirchi', 'Byadgi'],
    mspRatePerQuintal: 18500,
    unit: 'Quintal',
    popular: true,
  },

  // 8. OTHER IMPORTANT CROPS
  {
    id: 'other-tea',
    name: 'Tea',
    category: 'Other Crops',
    hindiName: 'चाय (Chai)',
    aliases: ['Tea', 'Chai', 'Green Leaf', 'Assam Tea', 'Darjeeling Tea'],
    mspRatePerQuintal: 14000,
    unit: 'Quintal',
  },
  {
    id: 'other-coffee',
    name: 'Coffee',
    category: 'Other Crops',
    hindiName: 'कॉफ़ी (Coffee)',
    aliases: ['Coffee', 'Robusta', 'Arabica', 'Coffee Beans', 'Kaapi'],
    mspRatePerQuintal: 22000,
    unit: 'Quintal',
  },
  {
    id: 'other-coconut',
    name: 'Coconut',
    category: 'Other Crops',
    hindiName: 'नारियल / खोपरा (Nariyal / Copra)',
    aliases: ['Coconut', 'Copra', 'Nariyal', 'Thengai', 'Kobbari'],
    mspRatePerQuintal: 3200,
    unit: 'Quintal',
    popular: true,
  },
  {
    id: 'other-cashew',
    name: 'Cashew',
    category: 'Other Crops',
    hindiName: 'काजू (Kaju)',
    aliases: ['Cashew', 'Kaju', 'Mundiri', 'Jeedi Pappu'],
    mspRatePerQuintal: 16500,
    unit: 'Quintal',
  },
  {
    id: 'other-rubber',
    name: 'Rubber',
    category: 'Other Crops',
    hindiName: 'रबर (Natural Rubber / Sheet)',
    aliases: ['Rubber', 'Natural Rubber', 'Latex Sheet', 'RSS-4'],
    mspRatePerQuintal: 18200,
    unit: 'Quintal',
  },
];

/**
 * Find a crop item by exact or partial name match
 */
export function getCropByName(name: string): CropItem | undefined {
  if (!name) return undefined;
  const clean = name.trim().toLowerCase();
  return ALL_CROPS.find(
    (c) =>
      c.name.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      (c.hindiName && c.hindiName.toLowerCase().includes(clean)) ||
      c.aliases?.some((a) => a.toLowerCase() === clean || clean.includes(a.toLowerCase()))
  );
}

/**
 * Filter crops by search query and optional category filter
 */
export function searchCrops(query: string, categoryFilter?: string): CropItem[] {
  let list = ALL_CROPS;

  if (categoryFilter && categoryFilter !== 'All') {
    list = list.filter((c) => c.category === categoryFilter);
  }

  const q = query.trim().toLowerCase();
  if (!q) return list;

  return list.filter((crop) => {
    if (crop.name.toLowerCase().includes(q)) return true;
    if (crop.category.toLowerCase().includes(q)) return true;
    if (crop.hindiName && crop.hindiName.toLowerCase().includes(q)) return true;
    if (crop.aliases && crop.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    return false;
  });
}

/**
 * Get popular crops across India for quick 1-tap chip selection
 */
export function getPopularCrops(): CropItem[] {
  return ALL_CROPS.filter((c) => c.popular);
}

/**
 * Lookup MSP rate or return standard fallback
 */
export function getCropMsp(cropName: string): number {
  const match = getCropByName(cropName);
  return match ? match.mspRatePerQuintal : 2275;
}
