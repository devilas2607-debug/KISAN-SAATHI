import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, ExternalLink, Copy, Check, QrCode, X } from 'lucide-react';

export const PRODUCTION_APP_URL = 'https://smart-slot-reem-8674.ai.studio';

interface AppQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

/**
 * Clean, responsive modal popup displaying the medium-sized QR code.
 * Hidden by default; opens only when the user clicks "Scan to Open App".
 * Encoded URL is strictly: https://smart-slot-reem-8674.ai.studio
 */
export const AppQRCodeModal: React.FC<AppQRCodeModalProps> = ({
  isOpen,
  onClose,
  url = PRODUCTION_APP_URL,
}) => {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="modal-scan-to-open-app-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-qr-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-scan-to-open-app-content"
        className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-sm w-full overflow-hidden text-center transform transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Popup Header with Title and Clear Close (X) Button */}
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2 text-stone-900">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 id="modal-qr-title" className="text-sm font-extrabold text-stone-900">
              Scan to Open App
            </h3>
          </div>

          <button
            id="btn-close-qr-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 transition cursor-pointer"
            aria-label="Close popup"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Medium-sized QR Code Container */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-stone-200 shadow-inner inline-flex flex-col items-center">
            <QRCodeSVG
              id="deployed-app-qrcode-svg"
              value={url}
              size={176}
              level="H"
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#0f172a"
              aria-label="Scan this QR code to open the Smart Slot App"
            />
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Live Deployed App</span>
            </div>
          </div>

          {/* Required Prompt Text below QR Code */}
          <p className="mt-4 text-sm font-bold text-stone-900">
            Scan this QR code to open the Smart Slot App
          </p>

          <p className="mt-1 text-xs text-stone-500 max-w-xs leading-relaxed">
            Point your mobile phone camera or any scanner at the code to open the web app directly in your phone browser.
          </p>

          {/* Encoded URL box with quick copy & open actions */}
          <div className="mt-4 w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-left">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              App Web URL
            </span>
            <div className="flex items-center gap-1.5">
              <code className="flex-1 text-[11px] font-mono font-bold text-stone-800 bg-white px-2 py-1.5 rounded border border-stone-200 truncate select-all">
                {url}
              </code>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] transition cursor-pointer"
                title="Copy link"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center p-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Close button at bottom for easy thumb access on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface AppQRCodeButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Small, clean button labeled "Scan to Open App" placed in the header / navigation.
 */
export const AppQRCodeButton: React.FC<AppQRCodeButtonProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <button
      id="btn-scan-to-open-app"
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 shadow-2xs transition cursor-pointer whitespace-nowrap ${className}`}
      title="Scan to Open App on your mobile device"
      aria-haspopup="dialog"
    >
      <QrCode className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
      <span>Scan to Open App</span>
    </button>
  );
};

/**
 * Unified component that renders both the "Scan to Open App" button and its modal popup.
 * Keeps the QR code hidden by default until clicked.
 */
export const AppQRCode: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AppQRCodeButton onClick={() => setIsOpen(true)} className={className} />
      <AppQRCodeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
