export type NotificationType =
  | 'slot_booked'
  | 'appointment_reminder'
  | 'queue_update'
  | 'turn_approaching'
  | 'token_called'
  | 'procurement_completed'
  | 'payment_completed';

export type DeliveryStatus = 'Scheduled' | 'Sent' | 'Delivered' | 'Failed';
export type ReadStatus = 'read' | 'unread';

export interface NotificationRecord {
  notification_id: string;
  farmer_id: string;
  booking_id: string;
  token_id: string;
  notification_type: NotificationType;
  message: string;
  scheduled_time: string;
  sent_time: string | null;
  delivery_status: DeliveryStatus;
  read_status: ReadStatus;
  created_timestamp: string;
  channel?: 'sms' | 'in_app' | 'push' | 'alarm' | 'all';
}

export type SlotStatus = 'booked' | 'in_queue' | 'approaching' | 'called' | 'in_progress' | 'completed' | 'cancelled';

export interface SlotBooking {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  centre: string;
  date: string;
  time: string;
  token: string;
  crop_type: string;
  quantity_quintals: number;
  farmer_village?: string;
  status: SlotStatus;
  counter: string;
  created_at: string;
}

export interface QueueState {
  current_token: string;
  active_counter: string;
  active_counters_count: number;
  avg_processing_time_mins: number;
  farmers_ahead: number;
  estimated_wait_mins: number;
  turn_approaching_threshold: number;
  is_operator_active: boolean;
  total_waiting: number;
}

export interface SMSRecord {
  id: string;
  recipient_phone: string;
  message: string;
  sender_id: string;
  timestamp: string;
  status: DeliveryStatus;
  provider: string;
  is_demo: boolean;
}

export interface QueueItem {
  id: string;
  token: string;
  farmer_name: string;
  farmer_phone: string;
  scheduled_time: string;
  crop_type: string;
  quantity: number;
  status: SlotStatus;
  counter?: string;
  farmers_ahead: number;
}

export type CrowdLevel = 'Low' | 'Medium' | 'High';
export type OperationalStatus = 'Operational' | 'Heavy Rush' | 'Delayed';

export interface ProcurementCentre {
  id: string;
  name: string;
  village_town: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  daily_capacity_quintals: number;
  daily_farmer_capacity: number;
  current_queue: number;
  active_counters: number;
  total_counters: number;
  avg_processing_time_mins: number;
  todays_bookings: number;
  completed_procurements: number;
  pending_procurements: number;
  utilization_percentage: number;
  crowd_level: CrowdLevel;
  predicted_crowd: {
    now: CrowdLevel;
    plus1h: CrowdLevel;
    plus2h: CrowdLevel;
    plus4h: CrowdLevel;
  };
  avg_waiting_time_mins: number;
  operational_status: OperationalStatus;
  contact_number: string;
  address: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone_masked: string;
  phone_raw: string;
  village: string;
  district: string;
  state: string;
  kisan_card_no: string;
  bank_account_masked: string;
  crop_type: string;
  quantity_quintals: number;
  active_booking_id?: string;
  active_token?: string;
  active_centre_id?: string;
  active_slot?: string;
  queue_position?: number;
  total_procured_quintals: number;
  total_payments_received_inr: number;
}

export interface SlotAvailability {
  slot_time: string;
  max_capacity: number;
  booked_count: number;
  available_count: number;
  status: 'Available' | 'Filling Fast' | 'Full';
}

export interface CentreRecommendation {
  centre: ProcurementCentre;
  distance_km: number;
  score: number;
  reasons: string[];
  estimated_wait_mins: number;
  suggested_slot: string;
  is_best_choice: boolean;
}

export interface WeighingRecord {
  weighment_id: string;
  token_id: string;
  farmer_id: string;
  declared_quantity_quintals: number;
  actual_weight_quintals: number;
  tare_weight_kg: number;
  gross_weight_kg: number;
  unit: string;
  weighbridge_slip_no: string;
  operator_id: string;
  timestamp: string;
}

export interface QualityCheckRecord {
  quality_id: string;
  token_id: string;
  crop_type: string;
  moisture_percentage: number;
  foreign_matter_percentage: number;
  damaged_grains_percentage: number;
  status: 'Verified' | 'Needs Review' | 'Pending';
  remarks: string;
  operator_id: string;
  timestamp: string;
}

export interface DigitalReceipt {
  receipt_id: string;
  transaction_id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  centre_name: string;
  centre_id: string;
  token: string;
  crop_type: string;
  declared_quantity_quintals: number;
  actual_weight_quintals: number;
  quality_status: 'Verified' | 'Needs Review';
  moisture_percentage: number;
  msp_rate_per_quintal: number;
  total_amount_inr: number;
  date: string;
  time: string;
  operator_id: string;
  payment_status: 'Pending' | 'Processing' | 'Completed';
  bank_utr: string;
}

export interface PaymentRecord {
  payment_id: string;
  token_id: string;
  farmer_id: string;
  farmer_name: string;
  amount_inr: number;
  status: 'Pending' | 'Processing' | 'Completed';
  transaction_utr: string;
  bank_name: string;
  account_masked: string;
  date: string;
  timestamp: string;
  is_demo: boolean;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: 'FARMER' | 'OPERATOR' | 'ADMIN' | 'SYSTEM';
  action: string;
  details: string;
  timestamp: string;
  related_record_id: string;
}

export interface AdminKPIs {
  total_registered_farmers: number;
  total_procurement_centres: number;
  todays_total_bookings: number;
  active_queues_count: number;
  total_procurement_quintals: number;
  pending_procurement_quintals: number;
  total_payout_cleared_inr: number;
  pending_payout_inr: number;
  network_avg_wait_mins: number;
}

export type CropCategory =
  | 'Cereals'
  | 'Pulses'
  | 'Oilseeds'
  | 'Commercial / Cash Crops'
  | 'Vegetables'
  | 'Fruits'
  | 'Spices'
  | 'Other Crops';

export interface CropItem {
  id: string;
  name: string;
  category: CropCategory;
  hindiName?: string;
  aliases?: string[];
  mspRatePerQuintal: number;
  unit: string;
  popular?: boolean;
}

