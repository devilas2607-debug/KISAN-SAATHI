import React, { useState } from 'react';
import { NotificationRecord, NotificationType, DeliveryStatus } from '../types';
import { useLanguage } from '../translations/LanguageContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Smartphone,
  Check,
  CheckCheck,
  Filter,
  DollarSign,
  PackageCheck,
} from 'lucide-react';

interface Props {
  notifications: NotificationRecord[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationCentre: React.FC<Props> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');

  const unreadCount = notifications.filter((n) => n.read_status === 'unread').length;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType !== 'all' && n.notification_type !== filterType) return false;
    if (filterChannel !== 'all' && n.channel !== filterChannel && n.channel !== 'all') return false;
    return true;
  });

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'slot_booked':
        return { label: t('notifications.slot_booked'), color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'appointment_reminder':
        return { label: t('notifications.slot_reminder'), color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'queue_update':
        return { label: t('notifications.queue_update'), color: 'bg-stone-100 text-stone-800 border-stone-200' };
      case 'turn_approaching':
        return { label: t('notifications.turn_approaching'), color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'token_called':
        return { label: t('notifications.your_turn_called'), color: 'bg-red-100 text-red-900 border-red-300' };
      case 'procurement_completed':
        return { label: t('notifications.procurement_done'), color: 'bg-teal-100 text-teal-900 border-teal-200' };
      case 'payment_completed':
        return { label: t('notifications.payment_completed'), color: 'bg-purple-100 text-purple-900 border-purple-200' };
      default:
        return { label: 'Notice', color: 'bg-stone-100 text-stone-800 border-stone-200' };
    }
  };

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCheck className="w-3 h-3 text-emerald-600" />
            <span>Delivered ✓</span>
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <Check className="w-3 h-3 text-blue-600" />
            <span>Sent ✓</span>
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Scheduled</span>
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>Failed</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2 bg-stone-50/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900">{t('notifications.title')}</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-700 text-white">
                  {unreadCount} {t('notifications.new')}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">{t('notifications.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              id="btn-mark-all-read"
              onClick={onMarkAllRead}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline px-2 py-1 cursor-pointer"
            >
              {t('notifications.mark_all_read')}
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="px-5 py-2.5 bg-stone-50/40 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-stone-400 font-medium mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {[
          { id: 'all', label: 'All' },
          { id: 'token_called', label: t('notifications.your_turn_called') },
          { id: 'turn_approaching', label: t('notifications.turn_approaching') },
          { id: 'slot_booked', label: t('notifications.slot_booked') },
          { id: 'appointment_reminder', label: t('notifications.slot_reminder') },
          { id: 'procurement_completed', label: t('notifications.procurement_done') },
          { id: 'payment_completed', label: t('notifications.payment_completed') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition whitespace-nowrap cursor-pointer ${filterType === tab.id ? 'bg-stone-900 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="divide-y divide-stone-100 max-h-[440px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs text-stone-500">{t('notifications.no_notifications')}</p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const badge = getTypeBadge(item.notification_type);
            const isUnread = item.read_status === 'unread';

            return (
              <div
                key={item.notification_id}
                id={`notif-${item.notification_id}`}
                className={`p-4 transition hover:bg-stone-50/80 ${isUnread ? 'bg-emerald-50/25' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.notification_type === 'token_called' ? 'bg-red-100 text-red-700 animate-pulse' : item.notification_type === 'turn_approaching' ? 'bg-amber-100 text-amber-800' : item.notification_type === 'payment_completed' ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-700'}`}>
                      {item.notification_type === 'payment_completed' ? (
                        <DollarSign className="w-4 h-4" />
                      ) : item.notification_type === 'procurement_completed' ? (
                        <PackageCheck className="w-4 h-4" />
                      ) : item.notification_type === 'token_called' ? (
                        <span className="text-sm">🔔</span>
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        {item.channel === 'sms' && (
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Smartphone className="w-2.5 h-2.5" /> SMS
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-stone-400">
                          {item.token_id && `${t('common.token')} ${item.token_id}`}
                        </span>
                      </div>

                      <p className="text-xs text-stone-900 font-medium leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.created_timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>ID: {item.notification_id}</span>
                        {getStatusBadge(item.delivery_status)}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isUnread && (
                      <button
                        onClick={() => onMarkRead(item.notification_id)}
                        title="Mark as read"
                        className="p-1 rounded-md text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
