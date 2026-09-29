import React, { useState, useEffect, useCallback } from 'react';
import {
  SlotBooking,
  QueueState,
  NotificationRecord,
  SMSRecord,
  ProcurementCentre,
  SlotAvailability,
  DigitalReceipt,
} from './types';
import { DEMO_CENTRES } from './data/mockProcurementData';
import {
  playTurnChime,
  startContinuousTurnAlarm,
  stopContinuousTurnAlarm,
} from './utils/audioAlert';
import {
  requestNotificationPermission,
  sendPushNotification,
  hasNotificationPermission,
} from './utils/pushNotification';
import { getSMSProvider } from './utils/smsService';
import { PWAInstallButton } from './components/PWAInstallButton';
import { SlotBookingCard } from './components/SlotBookingCard';
import { CentreRecommendationCard } from './components/CentreRecommendationCard';
import { QueueMonitor } from './components/QueueMonitor';
import { TurnAlarmModal } from './components/TurnAlarmModal';
import { NotificationCentre } from './components/NotificationCentre';
import { PhoneSMSSimulator } from './components/PhoneSMSSimulator';
import { OperatorDashboard } from './components/OperatorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { JudgeDemoView } from './components/JudgeDemoView';
import { DatabaseInspector } from './components/DatabaseInspector';
import { DigitalReceiptModal } from './components/DigitalReceiptModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginView, UserSession } from './components/LoginView';
import { NotFoundView } from './components/NotFoundView';
import { LanguageSelector } from './components/LanguageSelector';
import { useLanguage } from './translations/LanguageContext';
import { AppQRCodeModal, AppQRCodeButton } from './components/AppQRCode';
import { LiveClockBadge } from './components/LiveClockBadge';
import { getCurrentISTDate, getCurrentISTTime } from './utils/dateTime';
import {
  Volume2,
  VolumeX,
  Bell,
  BellRing,
  Building2,
  Users,
  Terminal,
  Play,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  Compass,
  AlertTriangle,
  LogIn,
  LogOut,
  RefreshCw,
  QrCode,
  X,
  Download,
} from 'lucide-react';

export type TabType = 'farmer' | 'operator' | 'admin' | 'judge_demo' | 'db_inspector' | 'login' | 'not_found';

export default function App() {
  const { t, language } = useLanguage();

  // Resolve initial route from browser URL safely
  const getTabFromPath = (pathname?: string): TabType => {
    try {
      const raw = pathname || (typeof window !== 'undefined' ? window.location?.pathname : '/') || '/';
      const cleanPath = raw.toLowerCase().replace(/\/$/, '') || '/';
      if (cleanPath === '/' || cleanPath === '/demo' || cleanPath === '/index.html' || cleanPath === '') return 'judge_demo';
      if (cleanPath === '/login' || cleanPath === '/signin' || cleanPath === '/auth') return 'login';
      if (cleanPath.startsWith('/farmer') || cleanPath === '/booking' || cleanPath === '/queue') return 'farmer';
      if (cleanPath.startsWith('/operator') || cleanPath === '/centre') return 'operator';
      if (cleanPath.startsWith('/admin') || cleanPath === '/command') return 'admin';
      if (cleanPath === '/database' || cleanPath === '/db' || cleanPath === '/db_inspector') return 'db_inspector';
      // Default to judge_demo so preview links or custom paths never land on a blank or broken screen
      return 'judge_demo';
    } catch {
      return 'judge_demo';
    }
  };

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      return getTabFromPath(typeof window !== 'undefined' ? window.location?.pathname : '/');
    } catch {
      return 'judge_demo';
    }
  });
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('sp_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [backendOffline, setBackendOffline] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [booking, setBooking] = useState<SlotBooking | null>(null);
  const [centres, setCentres] = useState<ProcurementCentre[]>(DEMO_CENTRES);
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [receiptModalData, setReceiptModalData] = useState<DigitalReceipt | null>(null);
  const [queue, setQueue] = useState<QueueState>({
    current_token: 'P-114',
    active_counter: 'Counter 2',
    active_counters_count: 1,
    avg_processing_time_mins: 8,
    farmers_ahead: 12,
    estimated_wait_mins: 96,
    turn_approaching_threshold: 3,
    is_operator_active: true,
    total_waiting: 15,
  });
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [smsLogs, setSmsLogs] = useState<SMSRecord[]>([]);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const smsService = getSMSProvider();

  // Navigation handler synchronized with browser history
  const handleNavigate = (tab: TabType) => {
    setActiveTab(tab);
    let path = '/';
    if (tab === 'farmer') path = '/farmer/dashboard';
    else if (tab === 'operator') path = '/operator/dashboard';
    else if (tab === 'admin') path = '/admin/dashboard';
    else if (tab === 'db_inspector') path = '/database';
    else if (tab === 'login') path = '/login';
    else if (tab === 'judge_demo') path = '/';

    try {
      if (typeof window !== 'undefined' && window.history && window.location.pathname !== path && tab !== 'not_found') {
        window.history.pushState({}, '', path);
      }
    } catch {
      // In sandboxed iframes or cross-origin previews, pushState may be restricted
    }
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem('sp_user_session', JSON.stringify(session));
    } catch {
      // Ignore storage errors
    }
    if (session.role === 'FARMER') {
      handleNavigate('farmer');
    } else if (session.role === 'OPERATOR') {
      handleNavigate('operator');
    } else {
      handleNavigate('admin');
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    try {
      localStorage.removeItem('sp_user_session');
    } catch {
      // Ignore storage errors
    }
    handleNavigate('login');
  };

  // Load initial data from Express backend with safe fallbacks
  const fetchInitialData = useCallback(async () => {
    try {
      const [bkgRes, qRes, nRes, cRes, sRes] = await Promise.all([
        fetch('/api/appointments').catch(() => null),
        fetch('/api/queue').catch(() => null),
        fetch('/api/notifications').catch(() => null),
        fetch('/api/centres').catch(() => null),
        fetch('/api/slots').catch(() => null),
      ]);

      let backendConnected = false;

      if (bkgRes && bkgRes.ok) {
        const bkgData = await bkgRes.json().catch(() => ({}));
        if (bkgData?.appointments && bkgData.appointments.length > 0) {
          setBooking(bkgData.appointments[0]);
          backendConnected = true;
        }
      }

      if (qRes && qRes.ok) {
        const qData = await qRes.json().catch(() => ({}));
        if (qData?.queue) {
          setQueue(qData.queue);
          backendConnected = true;
        }
      }

      if (cRes && cRes.ok) {
        const cData = await cRes.json().catch(() => ({}));
        if (cData?.centres && cData.centres.length > 0) {
          setCentres(cData.centres);
          backendConnected = true;
        }
      }

      if (sRes && sRes.ok) {
        const sData = await sRes.json().catch(() => ({}));
        if (sData?.slots && sData.slots.length > 0) {
          setSlots(sData.slots);
          backendConnected = true;
        }
      }

      if (nRes && nRes.ok) {
        const nData = await nRes.json().catch(() => ({}));
        if (nData?.notifications) {
          setNotifications(nData.notifications);
          const initialSms: SMSRecord[] = nData.notifications
            .filter((n: NotificationRecord) => n?.channel === 'sms' || n?.notification_type === 'appointment_reminder' || n?.notification_type === 'slot_booked')
            .map((n: NotificationRecord) => ({
              id: 'SMS-' + (n.notification_id || Date.now()),
              recipient_phone: '+91 98765 43210',
              message: n.message || '',
              sender_id: 'KMPROC',
              timestamp: n.created_timestamp ? new Date(n.created_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString(),
              status: 'Delivered' as const,
              provider: 'Demo SMS Notification Gateway',
              is_demo: true,
            }));
          setSmsLogs(initialSms);
          backendConnected = true;
        }
      }

      setBackendOffline(!backendConnected);
    } catch (err) {
      console.warn('Backend unavailable, running in resilient fallback mode:', err);
      setBackendOffline(true);
      if (centres.length === 0) setCentres(DEMO_CENTRES);
    }
  }, [centres.length]);

  // Connect to Real-time SSE Stream
  useEffect(() => {
    fetchInitialData();
    setPushEnabled(hasNotificationPermission());

    const eventSource = new EventSource('/api/events');
    eventSource.onerror = () => {
      // EventSource auto-retries in browser; suppress unhandled error logging
    };

    eventSource.addEventListener('farmer_called', (event: any) => {
      const payload = JSON.parse(event.data);
      setQueue(payload.queue);
      if (payload.appointment) setBooking(payload.appointment);
      if (payload.notification) {
        setNotifications((prev) => [payload.notification, ...prev]);

        // Record SMS
        setSmsLogs((prev) => [
          ...prev,
          {
            id: 'SMS-' + Date.now(),
            recipient_phone: payload.appointment?.farmer_phone || '+91 98765 43210',
            message: `SMART PROCUREMENT: Your turn is now! Please proceed to ${payload.counter} at ${payload.appointment?.centre || 'Procurement Centre A'}. Token: ${payload.token}.`,
            sender_id: 'KMPROC',
            timestamp: getCurrentISTTime(),
            status: 'Delivered',
            provider: 'Demo SMS Notification Gateway',
            is_demo: true,
          },
        ]);
      }

      // Audible Alarm
      if (!soundMuted) {
        startContinuousTurnAlarm();
      }
      setIsAlarmModalOpen(true);

      // Web Push Notification
      sendPushNotification('🔔 YOUR TURN HAS ARRIVED', {
        body: `Token ${payload.token}: Please proceed to ${payload.counter} at ${payload.appointment?.centre || 'Procurement Centre A'}.`,
        tag: 'turn-alarm',
        requireInteraction: true,
      });
    });

    eventSource.addEventListener('queue_advanced', (event: any) => {
      const payload = JSON.parse(event.data);
      setQueue(payload.queue);
      if (payload.appointment) setBooking(payload.appointment);
      if (payload.notification) {
        setNotifications((prev) => [payload.notification, ...prev]);

        // Push notification if threshold reached
        if (payload.notification.notification_type === 'turn_approaching') {
          if (!soundMuted) playTurnChime();
          sendPushNotification('⚠️ Turn Approaching', {
            body: payload.notification.message,
            tag: 'turn-approaching',
          });
          setSmsLogs((prev) => [
            ...prev,
            {
              id: 'SMS-' + Date.now(),
              recipient_phone: '+91 98765 43210',
              message: `SMART PROCUREMENT: ${payload.notification.message}`,
              sender_id: 'KMPROC',
              timestamp: getCurrentISTTime(),
              status: 'Delivered',
              provider: 'Demo SMS Notification Gateway',
              is_demo: true,
            },
          ]);
        }
      }
    });

    eventSource.addEventListener('procurement_completed', (event: any) => {
      const payload = JSON.parse(event.data);
      if (payload.appointment) setBooking(payload.appointment);
      if (payload.notification) {
        setNotifications((prev) => [payload.notification, ...prev]);
        setSmsLogs((prev) => [
          ...prev,
          {
            id: 'SMS-' + Date.now(),
            recipient_phone: payload.appointment?.farmer_phone || '+91 98765 43210',
            message: `SMART PROCUREMENT: ${payload.notification.message}`,
            sender_id: 'KMPROC',
            timestamp: getCurrentISTTime(),
            status: 'Delivered',
            provider: 'Demo SMS Notification Gateway',
            is_demo: true,
          },
        ]);
      }
    });

    eventSource.addEventListener('payment_completed', (event: any) => {
      const payload = JSON.parse(event.data);
      if (payload.appointment) setBooking(payload.appointment);
      if (payload.notification) {
        setNotifications((prev) => [payload.notification, ...prev]);
        setSmsLogs((prev) => [
          ...prev,
          {
            id: 'SMS-' + Date.now(),
            recipient_phone: payload.appointment?.farmer_phone || '+91 98765 43210',
            message: `SMART PROCUREMENT: ${payload.notification.message}`,
            sender_id: 'KMPROC',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Delivered',
            provider: 'Demo SMS Notification Gateway',
            is_demo: true,
          },
        ]);
      }
    });

    eventSource.addEventListener('slot_booked', (event: any) => {
      const payload = JSON.parse(event.data);
      if (payload.appointment) setBooking(payload.appointment);
      if (payload.notification) {
        setNotifications((prev) => [payload.notification, ...prev]);
      }
    });

    eventSource.addEventListener('demo_reset', (event: any) => {
      const payload = JSON.parse(event.data);
      if (payload.appointment) setBooking(payload.appointment);
      if (payload.queue) setQueue(payload.queue);
      if (payload.notifications) setNotifications(payload.notifications);
      stopContinuousTurnAlarm();
      setIsAlarmModalOpen(false);
    });

    return () => {
      eventSource.close();
      stopContinuousTurnAlarm();
    };
  }, [fetchInitialData, soundMuted]);

  // Request browser push permission
  const handleTogglePush = async () => {
    const perm = await requestNotificationPermission();
    setPushEnabled(perm === 'granted');
    if (perm === 'granted') {
      sendPushNotification('Smart Procurement System', {
        body: 'Web Push alerts enabled successfully!',
      });
    }
  };

  // Inspect receipt modal
  const handleViewReceipt = async (token: string) => {
    try {
      const res = await fetch(`/api/receipts/${token}`);
      const data = await res.json();
      if (data.success && data.receipt) {
        setReceiptModalData(data.receipt);
      } else {
        const allRes = await fetch('/api/receipts');
        const allData = await allRes.json();
        if (allData.receipts && allData.receipts.length > 0) {
          setReceiptModalData(allData.receipts[0]);
        }
      }
    } catch (err) {
      console.error('Failed to view receipt:', err);
    }
  };

  // Book a new slot from standard form
  const handleBookSlot = async (bookingData: Partial<SlotBooking>) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data.success) {
        setBooking(data.appointment);
        if (data.notification) {
          setNotifications((prev) => [data.notification, ...prev]);
        }
        setSmsLogs((prev) => [
          ...prev,
          {
            id: 'SMS-' + Date.now(),
            recipient_phone: data.appointment.farmer_phone,
            message: `SMART PROCUREMENT: Your procurement appointment for ${data.appointment.crop_type || 'Wheat'} (${data.appointment.quantity_quintals || 45} Quintals) is confirmed for ${data.appointment.time} on ${data.appointment.date} at ${data.appointment.centre}. Token: ${data.appointment.token}.`,
            sender_id: 'KMPROC',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Delivered',
            provider: 'Demo SMS Notification Gateway',
            is_demo: true,
          },
        ]);
        // Refresh slot counts
        const sRes = await fetch('/api/slots');
        const sData = await sRes.json();
        if (sData.slots) setSlots(sData.slots);
      }
    } catch (err) {
      console.error('Failed to book slot:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Book slot from Recommendation Engine
  const handleSelectAndBookFromRec = async (
    centre: ProcurementCentre,
    slotTime: string,
    crop: string,
    quantity: number,
    village: string
  ) => {
    await handleBookSlot({
      centre: centre.name,
      time: slotTime,
      crop_type: crop,
      quantity_quintals: quantity,
      farmer_village: village,
      date: getCurrentISTDate(),
      farmer_name: 'Ramesh Kumar',
      farmer_phone: '+91 98765 43210',
    });
  };

  // Operator CALL NEXT FARMER
  const handleCallNextFarmer = async (counter: string, token: string) => {
    setIsLoading(true);
    try {
      await fetch('/api/operator/call-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counter, token }),
      });
    } catch (err) {
      console.error('Failed to call farmer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Operator advance queue
  const handleAdvanceQueue = async (ahead: number) => {
    setIsLoading(true);
    try {
      await fetch('/api/operator/advance-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ahead }),
      });
    } catch (err) {
      console.error('Failed to advance queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Operator complete procurement
  const handleProcurementComplete = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/operator/procurement-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: booking?.token || 'P-127' }),
      });
    } catch (err) {
      console.error('Failed to complete procurement:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Operator complete payment
  const handlePaymentComplete = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/operator/payment-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: booking?.token || 'P-127' }),
      });
    } catch (err) {
      console.error('Failed to complete payment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to Judge Demo Baseline
  const handleResetJudgeDemo = async () => {
    setIsLoading(true);
    try {
      stopContinuousTurnAlarm();
      setIsAlarmModalOpen(false);
      await fetch('/api/operator/reset-demo', { method: 'POST' });
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update queue settings
  const handleUpdateSettings = async (settings: Partial<QueueState>) => {
    try {
      await fetch('/api/queue/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  // Mark notification read
  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, read_status: 'read' } : n))
      );
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read_status: 'read' })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  // Test SMS manually
  const handleTriggerTestSMS = (msg: string) => {
    const record = smsService.sendSMS(booking?.farmer_phone || '+91 98765 43210', msg);
    setSmsLogs((prev) => [...prev, record]);
  };

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 flex flex-col selection:bg-emerald-200">
      {/* Turn Alarm Modal (Audible Chime + Screen Pop) */}
      <TurnAlarmModal
        isOpen={isAlarmModalOpen}
        token={booking?.token || 'P-127'}
        counter={booking?.counter || queue.active_counter || 'Counter 2'}
        centre={booking?.centre || 'Karnal Central APMC Mandi Yard'}
        onAcknowledge={() => setIsAlarmModalOpen(false)}
      />

      {/* Official Digital Procurement Receipt Modal */}
      <DigitalReceiptModal
        receipt={receiptModalData}
        onClose={() => setReceiptModalData(null)}
      />

      {/* Scan to Open App QR Code Modal (Hidden by default, shown on click) */}
      <AppQRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Title & Brand */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => handleNavigate('judge_demo')}
                className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-emerald-700 transition shrink-0"
              >
                <span className="font-black text-lg tracking-tight">SP</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    onClick={() => handleNavigate('judge_demo')}
                    className="text-base font-black tracking-tight text-stone-900 cursor-pointer hover:text-emerald-800 transition"
                  >
                    {t('nav.app_title')}
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    {t('nav.sih_badge')}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium">
                  {t('nav.subtitle')}
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Real-time Indian Standard Time (IST) Clock */}
              <LiveClockBadge />

              {/* Language Switcher - Prominent and farmer accessible */}
              <LanguageSelector />

              {/* Push Notification Toggle */}
              <button
                id="btn-toggle-push-notif"
                onClick={handleTogglePush}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  pushEnabled
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
                title="Enable Browser Web Push"
              >
                {pushEnabled ? <BellRing className="w-3.5 h-3.5 text-emerald-600" /> : <Bell className="w-3.5 h-3.5 text-stone-500" />}
                <span>{pushEnabled ? t('nav.alerts_enabled') : t('nav.enable_alerts')}</span>
              </button>

              {/* Sound Audio Test / Mute */}
              <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                <button
                  id="btn-toggle-sound"
                  onClick={() => {
                    const nextMute = !soundMuted;
                    setSoundMuted(nextMute);
                    if (!nextMute) playTurnChime();
                  }}
                  className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                    soundMuted ? 'text-stone-400' : 'text-emerald-800 font-bold'
                  }`}
                  title={soundMuted ? 'Unmute Chime' : 'Mute Chime'}
                >
                  {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  id="btn-test-chime"
                  onClick={() => playTurnChime()}
                  className="text-[11px] font-bold px-2 py-1 text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  {t('nav.test_chime')}
                </button>
              </div>

              {/* User Session / Role Authentication Status */}
              {userSession ? (
                <div className="flex items-center gap-2 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-stone-800 truncate max-w-[120px] sm:max-w-[150px]">
                    {userSession.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {userSession.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    title={t('nav.sign_out')}
                    className="text-stone-400 hover:text-rose-600 p-0.5 rounded transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="btn-header-login"
                  onClick={() => handleNavigate('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white transition cursor-pointer shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('nav.sign_in')}</span>
                </button>
              )}

              {/* PWA Install Button */}
              <PWAInstallButton />

              {/* Scan to Open App Button in Header */}
              <AppQRCodeButton onClick={() => setShowQRModal(true)} />

              {/* Download Source Code ZIP */}
              <a
                href="/api/download-zip"
                download="smart-slot-procurement-system.zip"
                id="btn-download-source-zip"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition cursor-pointer shadow-2xs"
                title="Download complete project source code as ZIP"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Download ZIP</span>
              </a>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-stone-100 overflow-x-auto text-xs font-bold">
            <button
              id="tab-judge-demo"
              onClick={() => handleNavigate('judge_demo')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'judge_demo'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('nav.tab_judge_demo')}</span>
            </button>

            <button
              id="tab-farmer-dashboard"
              onClick={() => handleNavigate('farmer')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'farmer'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t('nav.tab_farmer')}</span>
            </button>

            <button
              id="tab-operator-dashboard"
              onClick={() => handleNavigate('operator')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'operator'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t('nav.tab_operator')}</span>
            </button>

            <button
              id="tab-admin-dashboard"
              onClick={() => handleNavigate('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>{t('nav.tab_admin')}</span>
            </button>

            <button
              id="tab-db-inspector"
              onClick={() => handleNavigate('db_inspector')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === 'db_inspector'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>{t('nav.tab_db')}</span>
            </button>

            {activeTab === 'login' && (
              <button
                id="tab-login-active"
                onClick={() => handleNavigate('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white shadow-xs transition cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>{t('nav.sign_in')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Backend Connection Alert Banner */}
      {backendOffline && (
        <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-stone-950 shrink-0" />
            <span>Backend connection unavailable. Running in resilient local mode with verified records.</span>
          </div>
          <button
            onClick={() => fetchInitialData()}
            className="px-3 py-1 bg-stone-900 text-white rounded-lg text-[11px] font-bold hover:bg-stone-800 transition cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Main Content View Area with Error Boundaries */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Judge Demo View */}
        {activeTab === 'judge_demo' && (
          <ErrorBoundary fallbackTitle="Something went wrong while loading the Judge Demo view.">
            <JudgeDemoView
              booking={booking}
              queue={queue}
              notifications={notifications}
              smsLogs={smsLogs}
              centres={centres}
              onBookSlot={handleBookSlot}
              onCallNextFarmer={handleCallNextFarmer}
              onAdvanceQueue={handleAdvanceQueue}
              onProcurementComplete={handleProcurementComplete}
              onPaymentComplete={handlePaymentComplete}
              onResetJudgeDemo={handleResetJudgeDemo}
              onUpdateSettings={handleUpdateSettings}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
              onTriggerTestSMS={handleTriggerTestSMS}
              onViewReceipt={handleViewReceipt}
              isLoading={isLoading}
            />
          </ErrorBoundary>
        )}

        {/* Farmer Dashboard & Recommender */}
        {activeTab === 'farmer' && (
          <ErrorBoundary fallbackTitle="Something went wrong while loading the Farmer Portal.">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-stone-900">{t('farmer.title')}</h2>
                  <p className="text-xs text-stone-500">
                    {t('recommendation.subtitle')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                    Kisan ID: KCC-HR-2024-9182 ({booking?.farmer_name || 'Ramesh Kumar'})
                  </span>
                  <span className="text-xs font-mono text-stone-600 bg-stone-200/80 px-2.5 py-1 rounded-full">
                    {booking?.farmer_phone || '+91 98765 43210'}
                  </span>
                </div>
              </div>

              {/* Smart Centre Recommendation & Slot Allocator */}
              <CentreRecommendationCard
                centres={centres}
                slots={slots}
                onSelectAndBook={handleSelectAndBookFromRec}
                isLoading={isLoading}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <SlotBookingCard
                    booking={booking}
                    centres={centres}
                    onBookSlot={handleBookSlot}
                    onViewReceipt={handleViewReceipt}
                    isLoading={isLoading}
                  />

                  <QueueMonitor
                    queue={queue}
                    booking={booking}
                    onSimulateProgression={handleAdvanceQueue}
                    isJudgeDemoActive={false}
                  />

                  <NotificationCentre
                    notifications={notifications}
                    onMarkRead={handleMarkRead}
                    onMarkAllRead={handleMarkAllRead}
                  />
                </div>

                <div className="space-y-6">
                  <PhoneSMSSimulator
                    farmerPhone={booking?.farmer_phone || '+91 98765 43210'}
                    farmerName={booking?.farmer_name || 'Ramesh Kumar'}
                    smsLogs={smsLogs}
                    notifications={notifications}
                    onTriggerTestSMS={handleTriggerTestSMS}
                  />
                </div>
              </div>
            </div>
          </ErrorBoundary>
        )}

        {/* Operator Console */}
        {activeTab === 'operator' && (
          <ErrorBoundary fallbackTitle="Something went wrong while loading the Operator Console.">
            <div className="space-y-6">
              <OperatorDashboard
                queue={queue}
                booking={booking}
                centres={centres}
                onCallNextFarmer={handleCallNextFarmer}
                onAdvanceQueue={handleAdvanceQueue}
                onProcurementComplete={handleProcurementComplete}
                onPaymentComplete={handlePaymentComplete}
                onResetJudgeDemo={handleResetJudgeDemo}
                onUpdateSettings={handleUpdateSettings}
                onViewReceipt={handleViewReceipt}
                isLoading={isLoading}
              />
            </div>
          </ErrorBoundary>
        )}

        {/* Government Admin Command */}
        {activeTab === 'admin' && (
          <ErrorBoundary fallbackTitle="Something went wrong while loading the Government Admin Command.">
            <div className="space-y-6">
              <AdminDashboard
                centres={centres}
                onRefreshCentres={fetchInitialData}
                isLoading={isLoading}
              />
            </div>
          </ErrorBoundary>
        )}

        {/* PostgreSQL Database Relational Inspector */}
        {activeTab === 'db_inspector' && (
          <ErrorBoundary fallbackTitle="Something went wrong while loading the PostgreSQL Relational Console.">
            <div className="space-y-6">
              <DatabaseInspector notifications={notifications} />
            </div>
          </ErrorBoundary>
        )}

        {/* Portal Authentication / Login Screen */}
        {activeTab === 'login' && (
          <ErrorBoundary fallbackTitle="Something went wrong while loading the Portal Sign In screen.">
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onContinueToDemo={() => handleNavigate('judge_demo')}
            />
          </ErrorBoundary>
        )}

        {/* 404 Fallback View */}
        {activeTab === 'not_found' && (
          <ErrorBoundary fallbackTitle="Something went wrong while loading the Page Not Found screen.">
            <NotFoundView onNavigate={handleNavigate} />
          </ErrorBoundary>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-auto py-4 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">Smart Procurement System</span>
            <span>•</span>
            <span>Statewide APMC Network, Autonomous SMS & Audible Turn Alert Architecture</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span>PostgreSQL Relational DB</span>
            <span>•</span>
            <span>PWA Offline Capable</span>
            <span>•</span>
            <span>Web Audio API Chime</span>
            <span>•</span>
            <span>SSE Real-time Synchronization</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
