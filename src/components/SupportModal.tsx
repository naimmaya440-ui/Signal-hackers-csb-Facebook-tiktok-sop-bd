import React, { useState } from 'react';
import { X, MessageSquare, Phone, Copy, Check, ExternalLink } from 'lucide-react';
import { PaymentConfig } from '../types';

interface SupportModalProps {
  language: 'bn' | 'en';
  isOpen: boolean;
  onClose: () => void;
  config: PaymentConfig;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  language,
  isOpen,
  onClose,
  config,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [inquiryType, setInquiryType] = useState<string>('order_help');

  if (!isOpen) return null;

  const messages: Record<string, { bn: string; en: string }> = {
    order_help: {
      bn: 'আসসালামু আলাইকুম, আমি ফেসবুক ফলোয়ার/লাইক অর্ডার করতে চাই। বিকাশ ও নগদের মাধ্যমে কিভাবে সহজে পেমেন্ট নিশ্চিত করব?',
      en: 'Hello, I want to order Facebook followers/likes with bKash/Nagad. Please assist me.',
    },
    trx_verify: {
      bn: 'আমার পেমেন্ট TrxID ভেরিফিকেশনে একটু সময় লাগছে, সাহায্য দরকার।',
      en: 'Need assistance verifying my payment transaction ID.',
    },
    custom_bulk: {
      bn: 'আমি বড় আকারের (বাল্ক) ফেসবুক পেইজ গ্রোথ প্যাকেজ নিতে চাই। কোনো বিশেষ ছাড় আছে কি?',
      en: 'Inquiring about bulk custom Facebook growth packages and rates.',
    },
  };

  const currentMsg = language === 'bn' ? messages[inquiryType].bn : messages[inquiryType].en;
  const whatsappUrl = `https://wa.me/${config.supportWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(currentMsg)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(config.supportPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {language === 'bn' ? '২৪/৭ লাইভ গ্রাহক সেবা' : '24/7 Live WhatsApp Support'}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'bn'
              ? 'যেকোনো জিজ্ঞাসা বা অর্ডারে সহযোগিতার জন্য সরাসরি চ্যাট করুন।'
              : 'Direct hotline for questions, orders, and payment inquiries.'}
          </p>
        </div>

        {/* Quick select topic */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            {language === 'bn' ? 'জিজ্ঞাসার বিষয় নির্বাচন করুন:' : 'Select Topic:'}
          </label>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setInquiryType('order_help')}
              className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                inquiryType === 'order_help'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-medium'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? '১. নতুন অর্ডার ও পেমেন্ট বিষয়ক সাহায্য' : '1. New Order & Payment Help'}
            </button>
            <button
              type="button"
              onClick={() => setInquiryType('trx_verify')}
              className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                inquiryType === 'trx_verify'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-medium'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? '২. TrxID ভেরিফিকেশন চেক' : '2. TrxID Status Verification'}
            </button>
            <button
              type="button"
              onClick={() => setInquiryType('custom_bulk')}
              className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                inquiryType === 'custom_bulk'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-medium'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? '৩. বাল্ক / বড় প্যাকেজে বিশেষ ডিসকাউন্ট' : '3. Bulk Order Discount Inquiry'}
            </button>
          </div>
        </div>

        {/* Action Button: WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি মেসেজ দিন' : 'Open in WhatsApp'}</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </a>

        {/* Copy Phone Number */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span className="font-mono text-slate-300">{config.supportPhone}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-blue-400 hover:underline cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
