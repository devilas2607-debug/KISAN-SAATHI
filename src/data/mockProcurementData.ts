import {
  ProcurementCentre,
  FarmerProfile,
  SlotAvailability,
  CentreRecommendation,
  DigitalReceipt,
  PaymentRecord,
  AuditLogEntry,
  AdminKPIs,
} from '../types';
import { getCurrentISTDate, getCurrentISTTime, getRecommendedSlotTime } from '../utils/dateTime';

// 1. AT LEAST 10 REALISTIC FICTIONAL DEMO PROCUREMENT CENTRES
export const DEMO_CENTRES: ProcurementCentre[] = [
  {
    id: 'PC-101',
    name: 'Karnal Central APMC Mandi Yard',
    village_town: 'Karnal City',
    district: 'Karnal',
    state: 'Haryana',
    latitude: 29.6857,
    longitude: 76.9905,
    daily_capacity_quintals: 6500,
    daily_farmer_capacity: 140,
    current_queue: 18,
    active_counters: 4,
    total_counters: 6,
    avg_processing_time_mins: 8,
    todays_bookings: 112,
    completed_procurements: 74,
    pending_procurements: 38,
    utilization_percentage: 78,
    crowd_level: 'Medium',
    predicted_crowd: {
      now: 'Medium',
      plus1h: 'High',
      plus2h: 'High',
      plus4h: 'Medium',
    },
    avg_waiting_time_mins: 36,
    operational_status: 'Operational',
    contact_number: '+91 184 225 9011',
    address: 'Sector 4, GT Road Bypass, Karnal APMC Yard',
  },
  {
    id: 'PC-102',
    name: 'Taraori Grain Terminal & Silo',
    village_town: 'Taraori',
    district: 'Karnal',
    state: 'Haryana',
    latitude: 29.8052,
    longitude: 76.9298,
    daily_capacity_quintals: 4800,
    daily_farmer_capacity: 100,
    current_queue: 7,
    active_counters: 3,
    total_counters: 4,
    avg_processing_time_mins: 7,
    todays_bookings: 58,
    completed_procurements: 42,
    pending_procurements: 16,
    utilization_percentage: 52,
    crowd_level: 'Low',
    predicted_crowd: {
      now: 'Low',
      plus1h: 'Low',
      plus2h: 'Medium',
      plus4h: 'Low',
    },
    avg_waiting_time_mins: 16,
    operational_status: 'Operational',
    contact_number: '+91 184 245 3100',
    address: 'Station Road, Near Food Corporation Godown, Taraori',
  },
  {
    id: 'PC-103',
    name: 'Nilokheri Sub-Mandi Yard',
    village_town: 'Nilokheri',
    district: 'Karnal',
    state: 'Haryana',
    latitude: 29.8327,
    longitude: 76.9189,
    daily_capacity_quintals: 3500,
    daily_farmer_capacity: 80,
    current_queue: 11,
    active_counters: 2,
    total_counters: 3,
    avg_processing_time_mins: 9,
    todays_bookings: 54,
    completed_procurements: 32,
    pending_procurements: 22,
    utilization_percentage: 64,
    crowd_level: 'Medium',
    predicted_crowd: {
      now: 'Medium',
      plus1h: 'Medium',
      plus2h: 'Low',
      plus4h: 'Low',
    },
    avg_waiting_time_mins: 49,
    operational_status: 'Operational',
    contact_number: '+91 184 266 1220',
    address: 'Pujam Road, Agri Complex, Nilokheri',
  },
  {
    id: 'PC-104',
    name: 'Gharaunda Kisan Seva Kendra & Mandi',
    village_town: 'Gharaunda',
    district: 'Karnal',
    state: 'Haryana',
    latitude: 29.5414,
    longitude: 76.9712,
    daily_capacity_quintals: 5200,
    daily_farmer_capacity: 110,
    current_queue: 34,
    active_counters: 3,
    total_counters: 5,
    avg_processing_time_mins: 10,
    todays_bookings: 98,
    completed_procurements: 52,
    pending_procurements: 46,
    utilization_percentage: 89,
    crowd_level: 'High',
    predicted_crowd: {
      now: 'High',
      plus1h: 'High',
      plus2h: 'High',
      plus4h: 'Medium',
    },
    avg_waiting_time_mins: 68,
    operational_status: 'Heavy Rush',
    contact_number: '+91 184 251 7733',
    address: 'Old Anaj Mandi, GT Road, Gharaunda',
  },
  {
    id: 'PC-105',
    name: 'Kurukshetra Pipli Regional Procurement Hub',
    village_town: 'Pipli',
    district: 'Kurukshetra',
    state: 'Haryana',
    latitude: 29.9822,
    longitude: 76.8778,
    daily_capacity_quintals: 7200,
    daily_farmer_capacity: 160,
    current_queue: 14,
    active_counters: 5,
    total_counters: 6,
    avg_processing_time_mins: 7,
    todays_bookings: 120,
    completed_procurements: 88,
    pending_procurements: 32,
    utilization_percentage: 69,
    crowd_level: 'Medium',
    predicted_crowd: {
      now: 'Medium',
      plus1h: 'Medium',
      plus2h: 'Low',
      plus4h: 'Low',
    },
    avg_waiting_time_mins: 20,
    operational_status: 'Operational',
    contact_number: '+91 1744 238 901',
    address: 'National Highway 44, Pipli Mandi Gate 2',
  },
  {
    id: 'PC-106',
    name: 'Assandh Grain Mandi Samiti',
    village_town: 'Assandh',
    district: 'Karnal',
    state: 'Haryana',
    latitude: 29.5244,
    longitude: 76.6022,
    daily_capacity_quintals: 4200,
    daily_farmer_capacity: 90,
    current_queue: 22,
    active_counters: 2,
    total_counters: 4,
    avg_processing_time_mins: 11,
    todays_bookings: 76,
    completed_procurements: 39,
    pending_procurements: 37,
    utilization_percentage: 84,
    crowd_level: 'High',
    predicted_crowd: {
      now: 'High',
      plus1h: 'High',
      plus2h: 'Medium',
      plus4h: 'Low',
    },
    avg_waiting_time_mins: 72,
    operational_status: 'Delayed',
    contact_number: '+91 1749 278 140',
    address: 'Jind Road, Near Canal Bridge, Assandh',
  },
  {
    id: 'PC-107',
    name: 'Indri Farmers Welfare Procurement Depot',
    village_town: 'Indri',
    district: 'Karnal',
    state: 'Haryana',
    latitude: 29.8828,
    longitude: 77.0601,
    daily_capacity_quintals: 3800,
    daily_farmer_capacity: 85,
    current_queue: 8,
    active_counters: 3,
    total_counters: 3,
    avg_processing_time_mins: 8,
    todays_bookings: 52,
    completed_procurements: 38,
    pending_procurements: 14,
    utilization_percentage: 58,
    crowd_level: 'Low',
    predicted_crowd: {
      now: 'Low',
      plus1h: 'Medium',
      plus2h: 'Medium',
      plus4h: 'Low',
    },
    avg_waiting_time_mins: 21,
    operational_status: 'Operational',
    contact_number: '+91 184 238 2145',
    address: 'Yamuna Canal Link Road, Indri Sub-Tehsil',
  },
  {
    id: 'PC-108',
    name: 'Panipat Model Agricultural Terminal',
    village_town: 'Panipat',
    district: 'Panipat',
    state: 'Haryana',
    latitude: 29.3909,
    longitude: 76.9635,
    daily_capacity_quintals: 8000,
    daily_farmer_capacity: 180,
    current_queue: 41,
    active_counters: 4,
    total_counters: 7,
    avg_processing_time_mins: 9,
    todays_bookings: 165,
    completed_procurements: 95,
    pending_procurements: 70,
    utilization_percentage: 92,
    crowd_level: 'High',
    predicted_crowd: {
      now: 'High',
      plus1h: 'High',
      plus2h: 'High',
      plus4h: 'High',
    },
    avg_waiting_time_mins: 82,
    operational_status: 'Heavy Rush',
    contact_number: '+91 180 264 4590',
    address: 'Sanauli Road, New Grain Market, Panipat',
  },
  {
    id: 'PC-109',
    name: 'Shahabad Markanda Food Silo Depot',
    village_town: 'Shahabad',
    district: 'Kurukshetra',
    state: 'Haryana',
    latitude: 30.1685,
    longitude: 76.8702,
    daily_capacity_quintals: 4600,
    daily_farmer_capacity: 95,
    current_queue: 9,
    active_counters: 3,
    total_counters: 4,
    avg_processing_time_mins: 8,
    todays_bookings: 60,
    completed_procurements: 44,
    pending_procurements: 16,
    utilization_percentage: 61,
    crowd_level: 'Low',
    predicted_crowd: {
      now: 'Low',
      plus1h: 'Low',
      plus2h: 'Low',
      plus4h: 'Low',
    },
    avg_waiting_time_mins: 24,
    operational_status: 'Operational',
    contact_number: '+91 1744 242 018',
    address: 'Barara Road, Near Railway Siding, Shahabad',
  },
  {
    id: 'PC-110',
    name: 'Pehowa Grain Mandi & Weigh Centre',
    village_town: 'Pehowa',
    district: 'Kurukshetra',
    state: 'Haryana',
    latitude: 29.9806,
    longitude: 76.5828,
    daily_capacity_quintals: 3900,
    daily_farmer_capacity: 85,
    current_queue: 13,
    active_counters: 2,
    total_counters: 3,
    avg_processing_time_mins: 9,
    todays_bookings: 62,
    completed_procurements: 38,
    pending_procurements: 24,
    utilization_percentage: 71,
    crowd_level: 'Medium',
    predicted_crowd: {
      now: 'Medium',
      plus1h: 'High',
      plus2h: 'Medium',
      plus4h: 'Low',
    },
    avg_waiting_time_mins: 42,
    operational_status: 'Operational',
    contact_number: '+91 1741 220 315',
    address: 'Kaithal Road, Sub-Market Yard, Pehowa',
  },
];

// 2. 50+ REALISTIC FICTIONAL DEMO FARMERS
export const DEMO_FARMERS: FarmerProfile[] = [
  {
    id: 'FARMER-842',
    name: 'Ramesh Kumar',
    phone_masked: '+91 98765 •••10',
    phone_raw: '+91 98765 43210',
    village: 'Taraori',
    district: 'Karnal',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2024-9182',
    bank_account_masked: 'SBIN••••••8842',
    crop_type: 'Wheat (Sharbati Premium)',
    quantity_quintals: 45,
    active_booking_id: 'BKG-1092',
    active_token: 'P-127',
    active_centre_id: 'PC-101',
    active_slot: '11:30 AM',
    queue_position: 12,
    total_procured_quintals: 240,
    total_payments_received_inr: 546000,
  },
  {
    id: 'FARMER-843',
    name: 'Balwinder Singh Dhillon',
    phone_masked: '+91 98120 •••44',
    phone_raw: '+91 98120 77144',
    village: 'Nilokheri',
    district: 'Karnal',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2023-1102',
    bank_account_masked: 'PUNB••••••4102',
    crop_type: 'Wheat (HD-2967)',
    quantity_quintals: 60,
    active_booking_id: 'BKG-1093',
    active_token: 'P-128',
    active_centre_id: 'PC-101',
    active_slot: '11:45 AM',
    queue_position: 1,
    total_procured_quintals: 310,
    total_payments_received_inr: 705250,
  },
  {
    id: 'FARMER-844',
    name: 'Gurpreet Kaur',
    phone_masked: '+91 94162 •••89',
    phone_raw: '+91 94162 55289',
    village: 'Indri',
    district: 'Karnal',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2024-5541',
    bank_account_masked: 'HDFC••••••9023',
    crop_type: 'Wheat (PBW-550)',
    quantity_quintals: 35,
    active_booking_id: 'BKG-1094',
    active_token: 'P-129',
    active_centre_id: 'PC-101',
    active_slot: '12:00 PM',
    queue_position: 2,
    total_procured_quintals: 180,
    total_payments_received_inr: 409500,
  },
  {
    id: 'FARMER-845',
    name: 'Rameshwar Yadav',
    phone_masked: '+91 98960 •••12',
    phone_raw: '+91 98960 33412',
    village: 'Gharaunda',
    district: 'Karnal',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2022-7789',
    bank_account_masked: 'BARB••••••3311',
    crop_type: 'Mustard (Pusa Bold)',
    quantity_quintals: 28,
    active_booking_id: 'BKG-1081',
    active_token: 'P-114',
    active_centre_id: 'PC-104',
    active_slot: '10:00 AM',
    queue_position: 0,
    total_procured_quintals: 140,
    total_payments_received_inr: 791000,
  },
  {
    id: 'FARMER-846',
    name: 'Devendra Patel',
    phone_masked: '+91 97281 •••65',
    phone_raw: '+91 97281 99865',
    village: 'Assandh',
    district: 'Karnal',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2024-8821',
    bank_account_masked: 'CNRB••••••1204',
    crop_type: 'Wheat (Sharbati Premium)',
    quantity_quintals: 55,
    active_booking_id: 'BKG-1095',
    active_token: 'P-130',
    active_centre_id: 'PC-106',
    active_slot: '01:30 PM',
    queue_position: 8,
    total_procured_quintals: 290,
    total_payments_received_inr: 659750,
  },
  {
    id: 'FARMER-847',
    name: 'Rajesh Meena',
    phone_masked: '+91 94670 •••78',
    phone_raw: '+91 94670 11278',
    village: 'Pipli',
    district: 'Kurukshetra',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2023-3490',
    bank_account_masked: 'SBIN••••••7654',
    crop_type: 'Gram / Chana Desi',
    quantity_quintals: 30,
    total_procured_quintals: 120,
    total_payments_received_inr: 652800,
  },
  {
    id: 'FARMER-848',
    name: 'Sukhdev Gill',
    phone_masked: '+91 98133 •••23',
    phone_raw: '+91 98133 44523',
    village: 'Shahabad',
    district: 'Kurukshetra',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2024-0012',
    bank_account_masked: 'PUNB••••••9981',
    crop_type: 'Wheat (DBW-187)',
    quantity_quintals: 70,
    total_procured_quintals: 420,
    total_payments_received_inr: 955500,
  },
  {
    id: 'FARMER-849',
    name: 'Manpreet Singh Sandhu',
    phone_masked: '+91 98964 •••51',
    phone_raw: '+91 98964 88751',
    village: 'Pehowa',
    district: 'Kurukshetra',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2023-9081',
    bank_account_masked: 'UBIN••••••2234',
    crop_type: 'Basmati Paddy (1121)',
    quantity_quintals: 80,
    total_procured_quintals: 510,
    total_payments_received_inr: 1785000,
  },
  {
    id: 'FARMER-850',
    name: 'Harpreet Singh Virk',
    phone_masked: '+91 94169 •••90',
    phone_raw: '+91 94169 33290',
    village: 'Taraori',
    district: 'Karnal',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2024-6721',
    bank_account_masked: 'SBIN••••••0091',
    crop_type: 'Wheat (HD-3086)',
    quantity_quintals: 50,
    total_procured_quintals: 300,
    total_payments_received_inr: 682500,
  },
  {
    id: 'FARMER-851',
    name: 'Jaswant Lal Saini',
    phone_masked: '+91 98129 •••33',
    phone_raw: '+91 98129 66533',
    village: 'Panipat Rural',
    district: 'Panipat',
    state: 'Haryana',
    kisan_card_no: 'KCC-HR-2022-4412',
    bank_account_masked: 'HDFC••••••6512',
    crop_type: 'Mustard (Pusa Bold)',
    quantity_quintals: 32,
    total_procured_quintals: 190,
    total_payments_received_inr: 1073500,
  },
  // Additional farmers (11 to 52) to satisfy the 50+ realistic farmer mandate
  ...Array.from({ length: 42 }).map((_, idx) => {
    const names = [
      'Kuldeep Sharma', 'Narender Chauhan', 'Amrik Singh', 'Satish Dahiya',
      'Joginder Mann', 'Sunil Hooda', 'Jagdish Chandra', 'Surender Rathi',
      'Baljit Malik', 'Deepak Verma', 'Sanjay Rawat', 'Virender Kadian',
      'Rajpal Tanwar', 'Karamveer Ahlawat', 'Pawan Godara', 'Suraj Bhan',
      'Krishan Lather', 'Rohtash Nain', 'Bhim Sen', 'Mohan Lal Bishnoi',
      'Subhash Boora', 'Dharambir Sindhu', 'Jaipal Arya', 'Ranjit Sihag',
      'Mukesh Poonia', 'Fateh Singh Dhillon', 'Paramjit Grewal', 'Ajmer Kang',
      'Balkar Brar', 'Dilsher Pannu', 'Satnam Deol', 'Avtar Bajwa',
      'Navneet Chahal', 'Gurcharan Aulakh', 'Mahabir Deswal', 'Naresh Khatri',
      'Rajender Sangwan', 'Om Parkash Berwal', 'Zile Singh Mor', 'Ramphal Jakhar',
      'Anup Phogat', 'Hoshiar Jaglan',
    ];
    const villages = ['Taraori', 'Nilokheri', 'Gharaunda', 'Indri', 'Assandh', 'Pipli', 'Shahabad', 'Pehowa', 'Karnal City', 'Panipat Rural'];
    const crops = ['Wheat (HD-2967)', 'Wheat (Sharbati Premium)', 'Wheat (PBW-550)', 'Mustard (Pusa Bold)', 'Gram / Chana Desi'];
    const idNum = 852 + idx;
    const name = names[idx % names.length];
    const village = villages[idx % villages.length];
    const crop = crops[idx % crops.length];
    const qty = 25 + (idx * 3) % 65;
    return {
      id: `FARMER-${idNum}`,
      name,
      phone_masked: `+91 98${(100 + idx * 7) % 900} •••${(10 + idx * 3) % 90}`,
      phone_raw: `+91 98${(100 + idx * 7) % 900} 554${(10 + idx * 3) % 90}`,
      village,
      district: idx % 3 === 0 ? 'Kurukshetra' : idx % 5 === 0 ? 'Panipat' : 'Karnal',
      state: 'Haryana',
      kisan_card_no: `KCC-HR-2024-${1000 + idx}`,
      bank_account_masked: `SBIN••••••${2000 + idx}`,
      crop_type: crop,
      quantity_quintals: qty,
      total_procured_quintals: 150 + qty * 4,
      total_payments_received_inr: (150 + qty * 4) * 2275,
    };
  }),
];

// 3. REALISTIC SLOT SYSTEM WITH MAXIMUM CAPACITY & AVAILABILITY
export const INITIAL_SLOTS: SlotAvailability[] = [
  { slot_time: '09:00 AM', max_capacity: 15, booked_count: 15, available_count: 0, status: 'Full' },
  { slot_time: '09:30 AM', max_capacity: 15, booked_count: 12, available_count: 3, status: 'Available' },
  { slot_time: '10:00 AM', max_capacity: 15, booked_count: 15, available_count: 0, status: 'Full' },
  { slot_time: '10:30 AM', max_capacity: 15, booked_count: 10, available_count: 5, status: 'Available' },
  { slot_time: '11:00 AM', max_capacity: 15, booked_count: 14, available_count: 1, status: 'Filling Fast' },
  { slot_time: '11:30 AM', max_capacity: 15, booked_count: 8, available_count: 7, status: 'Available' }, // Primary Demo Slot
  { slot_time: '12:00 PM', max_capacity: 15, booked_count: 6, available_count: 9, status: 'Available' },
  { slot_time: '02:00 PM', max_capacity: 15, booked_count: 15, available_count: 0, status: 'Full' },
  { slot_time: '02:30 PM', max_capacity: 15, booked_count: 5, available_count: 10, status: 'Available' },
  { slot_time: '03:00 PM', max_capacity: 15, booked_count: 4, available_count: 11, status: 'Available' },
];

// 4. SMART RECOMMENDATION ENGINE (TRANSPARENT SCORING & EXPLANATION)
// Formula:
// Score = (Distance Score × 0.25) + (Queue Score × 0.35) + (Capacity Score × 0.25) + (Crowd Score × 0.15)
export function calculateCentreRecommendations(
  crop: string,
  quantity: number,
  selectedVillage: string,
  centres: ProcurementCentre[] = DEMO_CENTRES
): CentreRecommendation[] {
  // Approximate coordinates for farmer based on selected village
  const villageCoords: Record<string, { lat: number; lng: number }> = {
    'Taraori': { lat: 29.8052, lng: 76.9298 },
    'Karnal City': { lat: 29.6857, lng: 76.9905 },
    'Nilokheri': { lat: 29.8327, lng: 76.9189 },
    'Gharaunda': { lat: 29.5414, lng: 76.9712 },
    'Indri': { lat: 29.8828, lng: 77.0601 },
    'Assandh': { lat: 29.5244, lng: 76.6022 },
    'Pipli': { lat: 29.9822, lng: 76.8778 },
    'Shahabad': { lat: 30.1685, lng: 76.8702 },
    'Pehowa': { lat: 29.9806, lng: 76.5828 },
    'Panipat Rural': { lat: 29.3909, lng: 76.9635 },
  };

  const origin = villageCoords[selectedVillage] || { lat: 29.75, lng: 76.95 };

  const scoredCentres = centres.map((centre) => {
    // Haversine Distance in km
    const dLat = ((centre.latitude - origin.lat) * Math.PI) / 180;
    const dLng = ((centre.longitude - origin.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.lat * Math.PI) / 180) *
        Math.cos((centre.latitude * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.max(2.1, Math.round(6371 * c * 10) / 10);

    // Component Scores (Normalized 0 - 100)
    // Distance: 0 km = 100, 30 km = 0
    const distanceScore = Math.max(0, 100 - (distanceKm / 25) * 100);

    // Queue: 0 waiting = 100, 40+ waiting = 0
    const queueScore = Math.max(0, 100 - (centre.current_queue / 40) * 100);

    // Capacity: 0% utilized = 100, 100% utilized = 0
    const capacityScore = Math.max(0, 100 - centre.utilization_percentage);

    // Crowd: Low = 100, Medium = 65, High = 25
    const crowdScore =
      centre.crowd_level === 'Low' ? 100 : centre.crowd_level === 'Medium' ? 65 : 25;

    // Weighted Total Score
    const compositeScore = Math.round(
      distanceScore * 0.25 + queueScore * 0.35 + capacityScore * 0.25 + crowdScore * 0.15
    );

    // Estimated Wait Time = (Queue × Avg Processing Mins) / Active Counters
    const estWait = Math.ceil(
      (centre.current_queue * centre.avg_processing_time_mins) / Math.max(1, centre.active_counters)
    );

    // Determine Transparent Reasons for "WHY THIS CENTRE?"
    const reasons: string[] = [];
    if (centre.current_queue <= 12) {
      reasons.push(`Low active queue: only ${centre.current_queue} farmers waiting`);
    } else {
      reasons.push(`Manageable queue with ${centre.active_counters} parallel counters active`);
    }

    if (estWait <= 30) {
      reasons.push(`Fast turnaround: estimated wait of ~${estWait} minutes`);
    } else {
      reasons.push(`Predictable waiting window: ~${estWait} minutes`);
    }

    if (centre.utilization_percentage < 70) {
      reasons.push(`Sufficient capacity available (${100 - centre.utilization_percentage}% free)`);
    }

    if (distanceKm <= 12) {
      reasons.push(`Convenient distance: ${distanceKm} km from ${selectedVillage}`);
    } else {
      reasons.push(`Direct highway access on NH-44 corridor`);
    }

    const recSlot = getRecommendedSlotTime();
    reasons.push(`Optimal slot opening at ${recSlot} (7 slots remaining)`);

    return {
      centre,
      distance_km: distanceKm,
      score: compositeScore,
      reasons,
      estimated_wait_mins: estWait,
      suggested_slot: recSlot,
      is_best_choice: false,
    };
  });

  // Sort descending by composite score
  scoredCentres.sort((a, b) => b.score - a.score);

  if (scoredCentres.length > 0) {
    scoredCentres[0].is_best_choice = true;
  }

  return scoredCentres;
}

// 5. SEED DIGITAL RECEIPTS & AUDIT LOGS
export const SEED_RECEIPTS: DigitalReceipt[] = [
  {
    receipt_id: 'RCP-2026-9042',
    transaction_id: 'TXN-9821094',
    farmer_id: 'FARMER-842',
    farmer_name: 'Ramesh Kumar',
    farmer_phone: '+91 98765 43210',
    centre_name: 'Karnal Central APMC Mandi Yard',
    centre_id: 'PC-101',
    token: 'P-127',
    crop_type: 'Wheat (Sharbati Premium)',
    declared_quantity_quintals: 45,
    actual_weight_quintals: 44.8,
    quality_status: 'Verified',
    moisture_percentage: 11.2,
    msp_rate_per_quintal: 2275,
    total_amount_inr: 101920,
    date: getCurrentISTDate(),
    time: getCurrentISTTime(),
    operator_id: 'OP-KARNAL-02',
    payment_status: 'Completed',
    bank_utr: 'UTR-83921049281',
  },
  {
    receipt_id: 'RCP-2026-8910',
    transaction_id: 'TXN-9710442',
    farmer_id: 'FARMER-843',
    farmer_name: 'Balwinder Singh Dhillon',
    farmer_phone: '+91 98120 77144',
    centre_name: 'Taraori Grain Terminal & Silo',
    centre_id: 'PC-102',
    token: 'P-105',
    crop_type: 'Wheat (HD-2967)',
    declared_quantity_quintals: 60,
    actual_weight_quintals: 59.4,
    quality_status: 'Verified',
    moisture_percentage: 11.8,
    msp_rate_per_quintal: 2275,
    total_amount_inr: 135135,
    date: getCurrentISTDate(new Date(Date.now() - 86400000)),
    time: '02:30 PM',
    operator_id: 'OP-TARAORI-01',
    payment_status: 'Completed',
    bank_utr: 'UTR-77192044812',
  },
];

export const SEED_PAYMENTS: PaymentRecord[] = [
  {
    payment_id: 'PAY-77102',
    token_id: 'P-127',
    farmer_id: 'FARMER-842',
    farmer_name: 'Ramesh Kumar',
    amount_inr: 101920,
    status: 'Completed',
    transaction_utr: 'UTR-83921049281',
    bank_name: 'State Bank of India (Karnal Main Branch)',
    account_masked: 'SBIN••••••8842',
    date: getCurrentISTDate(),
    timestamp: getCurrentISTTime(),
    is_demo: true,
  },
  {
    payment_id: 'PAY-77098',
    token_id: 'P-105',
    farmer_id: 'FARMER-843',
    farmer_name: 'Balwinder Singh Dhillon',
    amount_inr: 135135,
    status: 'Completed',
    transaction_utr: 'UTR-77192044812',
    bank_name: 'Punjab National Bank (Nilokheri Branch)',
    account_masked: 'PUNB••••••4102',
    date: getCurrentISTDate(new Date(Date.now() - 86400000)),
    timestamp: '03:10 PM',
    is_demo: true,
  },
  {
    payment_id: 'PAY-77054',
    token_id: 'P-098',
    farmer_id: 'FARMER-845',
    farmer_name: 'Rameshwar Yadav',
    amount_inr: 158200,
    status: 'Completed',
    transaction_utr: 'UTR-65529011429',
    bank_name: 'Bank of Baroda (Gharaunda)',
    account_masked: 'BARB••••••3311',
    date: getCurrentISTDate(new Date(Date.now() - 2 * 86400000)),
    timestamp: '04:45 PM',
    is_demo: true,
  },
];

export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUDIT-101',
    actor: 'Ramesh Kumar',
    role: 'FARMER',
    action: 'Slot Booked',
    details: 'Booked ' + getRecommendedSlotTime() + ' slot at Karnal Central APMC (Token P-127)',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    related_record_id: 'BKG-1092',
  },
  {
    id: 'AUDIT-102',
    actor: 'Procurement Notification Gateway',
    role: 'SYSTEM',
    action: 'SMS Reminder Dispatched',
    details: 'Dispatched 24-hr appointment reminder and slot confirmation to +91 98765 43210',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    related_record_id: 'NOTIF-001',
  },
  {
    id: 'AUDIT-103',
    actor: 'OP-KARNAL-02',
    role: 'OPERATOR',
    action: 'Queue Advanced',
    details: 'Advanced queue from 12 to 8 farmers ahead; wait time updated to 64 min',
    timestamp: '2026-09-08T10:15:22Z',
    related_record_id: 'PC-101',
  },
  {
    id: 'AUDIT-104',
    actor: 'Smart Queue Intelligence Engine',
    role: 'SYSTEM',
    action: 'Turn Approaching Triggered',
    details: 'Threshold alert triggered: 3 farmers ahead for Token P-127',
    timestamp: '2026-09-08T11:05:40Z',
    related_record_id: 'P-127',
  },
  {
    id: 'AUDIT-105',
    actor: 'OP-KARNAL-02',
    role: 'OPERATOR',
    action: 'Token Called',
    details: 'Called Token P-127 to Counter 2; audible alarm & push dispatched',
    timestamp: '2026-09-08T11:30:00Z',
    related_record_id: 'P-127',
  },
  {
    id: 'AUDIT-106',
    actor: 'OP-KARNAL-02',
    role: 'OPERATOR',
    action: 'Weighment Completed',
    details: 'Weighed 44.80 Quintals (Tare: 1,820 kg, Gross: 6,300 kg) on Weighbridge 2',
    timestamp: '2026-09-08T11:38:12Z',
    related_record_id: 'WB-8492',
  },
  {
    id: 'AUDIT-107',
    actor: 'Quality Officer QO-04',
    role: 'OPERATOR',
    action: 'Quality Verified',
    details: 'Moisture 11.2%, Foreign Matter 0.5%, Certified Grade-A FAQ Wheat',
    timestamp: '2026-09-08T11:42:05Z',
    related_record_id: 'QC-9182',
  },
  {
    id: 'AUDIT-108',
    actor: 'DBT Payment Gateway',
    role: 'SYSTEM',
    action: 'DBT Payment Cleared',
    details: 'Cleared ₹1,01,920 via PFMS-DBT to SBIN••••••8842 (UTR-83921049281)',
    timestamp: '2026-09-08T11:48:30Z',
    related_record_id: 'PAY-77102',
  },
];

export const NETWORK_KPIS: AdminKPIs = {
  total_registered_farmers: 12450,
  total_procurement_centres: 10,
  todays_total_bookings: 897,
  active_queues_count: 177,
  total_procurement_quintals: 48920,
  pending_procurement_quintals: 16400,
  total_payout_cleared_inr: 111293000,
  pending_payout_inr: 37310000,
  network_avg_wait_mins: 38,
};
