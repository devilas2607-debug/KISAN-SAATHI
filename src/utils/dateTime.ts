/**
 * Centralized Date and Time utilities for Smart Slot Procurement System.
 * Ensures consistent Indian Standard Time (IST / Asia/Kolkata) formatting
 * across all client dashboards, queue monitors, SMS simulators, and booking engines.
 */
import { useState, useEffect } from 'react';

export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns the user's local browser timezone (e.g. "Asia/Kolkata", "America/Los_Angeles").
 */
export function getLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || IST_TIMEZONE;
  } catch {
    return IST_TIMEZONE;
  }
}

/**
 * Safely parse any input into a Date object.
 */
export function toSafeDate(input?: Date | string | number | null): Date {
  if (!input) return new Date();
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? new Date() : input;
  }
  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Formats date into "DD MMMM YYYY" (e.g. "18 September 2026") in IST or target timezone.
 */
export function getCurrentISTDate(input?: Date | string | number, timeZone: string = IST_TIMEZONE): string {
  const date = toSafeDate(input);
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone,
    }).format(date);
  } catch {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}

/**
 * Formats date into short form "DD MMM YYYY" (e.g. "18 Sep 2026").
 */
export function formatISTDateShort(input?: Date | string | number, timeZone: string = IST_TIMEZONE): string {
  const date = toSafeDate(input);
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone,
    }).format(date);
  } catch {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

/**
 * Formats full weekday & date: "Friday, 18 September 2026".
 */
export function formatISTDayAndDate(input?: Date | string | number, timeZone: string = IST_TIMEZONE): string {
  const date = toSafeDate(input);
  try {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    }).format(date);
  } catch {
    return date.toLocaleDateString('en-IN');
  }
}

/**
 * Formats time in 12-hour format with AM/PM (e.g. "11:30 AM" or "11:30:45 AM") in IST.
 */
export function getCurrentISTTime(
  input?: Date | string | number,
  options?: { includeSeconds?: boolean },
  timeZone: string = IST_TIMEZONE
): string {
  const date = toSafeDate(input);
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: options?.includeSeconds ? '2-digit' : undefined,
      hour12: true,
      timeZone,
    }).format(date);
  } catch {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: options?.includeSeconds ? '2-digit' : undefined,
      hour12: true,
    });
  }
}

/**
 * Combined Date + Time with explicit IST label (e.g. "18 Sep 2026, 11:30 AM IST").
 */
export function formatISTDateTime(input?: Date | string | number, timeZone: string = IST_TIMEZONE): string {
  const dateStr = formatISTDateShort(input, timeZone);
  const timeStr = getCurrentISTTime(input, { includeSeconds: false }, timeZone);
  return `${dateStr}, ${timeStr} IST`;
}

/**
 * Computes an estimated completion or turn time (ETA) based on waiting minutes added to current time in IST.
 */
export function calculateETA(waitMinutes: number, baseDate?: Date | string | number, timeZone: string = IST_TIMEZONE): string {
  const date = toSafeDate(baseDate);
  const target = new Date(date.getTime() + waitMinutes * 60000);
  return getCurrentISTTime(target, { includeSeconds: false }, timeZone);
}

/**
 * Standard Mandi Operating Slots (09:00 AM to 04:00 PM).
 */
export const STANDARD_MANDI_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
];

/**
 * Determine a smart recommended slot based on the current IST hour.
 * If currently within working hours, recommends the slot ~1 hour ahead.
 * If morning or evening, recommends the morning prime slot (09:30 AM / 10:00 AM).
 */
export function getRecommendedSlotTime(baseDate?: Date | string | number): string {
  const date = toSafeDate(baseDate);
  // Get current hour in IST
  try {
    const istParts = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
      timeZone: IST_TIMEZONE,
    }).formatToParts(date);

    const hourPart = istParts.find((p) => p.type === 'hour')?.value;
    const currentHour = hourPart ? parseInt(hourPart, 10) : date.getHours();

    if (currentHour < 9) return '09:30 AM';
    if (currentHour === 9) return '10:30 AM';
    if (currentHour === 10) return '11:30 AM';
    if (currentHour === 11) return '12:00 PM';
    if (currentHour === 12) return '02:00 PM';
    if (currentHour === 13) return '02:30 PM';
    if (currentHour === 14) return '03:00 PM';
    if (currentHour === 15) return '03:30 PM';
    return '09:30 AM'; // Next morning opening
  } catch {
    return '10:00 AM';
  }
}

/**
 * Custom React Hook that returns a real-time updating clock object.
 * Ticks every 1000ms and updates state automatically without page refresh.
 */
export function useLiveClock(intervalMs: number = 1000) {
  const [now, setNow] = useState<Date>(() => new Date());
  const localTz = getLocalTimeZone();

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  const istDateStr = getCurrentISTDate(now, IST_TIMEZONE);
  const istDateShort = formatISTDateShort(now, IST_TIMEZONE);
  const istDayAndDate = formatISTDayAndDate(now, IST_TIMEZONE);
  const istTimeStr = getCurrentISTTime(now, { includeSeconds: false }, IST_TIMEZONE);
  const istTimeWithSec = getCurrentISTTime(now, { includeSeconds: true }, IST_TIMEZONE);

  const localTimeWithSec = getCurrentISTTime(now, { includeSeconds: true }, localTz);
  const isDifferentFromLocal = localTz !== IST_TIMEZONE && localTz !== 'Asia/Calcutta';

  return {
    now,
    localTimeZone: localTz,
    istTimeZone: IST_TIMEZONE,
    istDateStr,
    istDateShort,
    istDayAndDate,
    istTimeStr,
    istTimeWithSec,
    localTimeWithSec,
    isDifferentFromLocal,
  };
}
