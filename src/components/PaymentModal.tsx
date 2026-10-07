import React, { useState } from 'react';
import { ServiceItem, PaymentConfig, Order } from '../types';
import { BkashIcon, NagadIcon, RocketIcon } from './BrandIcons';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone, 
  Clock, 
  Receipt,
  Download
} from 'lucide-react';

interface PaymentModalProps {
  language: 'bn' | 'en';
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem;
  quantity: number;
  totalPrice: number;
  targetUrl: string;
  customerNote?: string;
  paymentConfig: PaymentConfig;
  onUpdatePaymentConfig?: (config: PaymentConfig) => void;
  onOrderCreated: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  language,
  isOpen,
  onClose,
  service,
  quantity,
  totalPrice,
  targetUrl,
  customerNote,
  paymentConfig,
  onUpdatePaymentConfig,
  onOrderCreated,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isEditingNumber, setIsEditingNumber] = useState<boolean>(false);
  const [editNumberVal, setEditNumberVal] = useState<string>('');

  if (!isOpen) return null;

  const getMethodDetails = () => {
    switch (selectedMethod) {
      case 'bkash':
        return {
          name: 'bKash (বিকাশ)',
          number: paymentConfig.bkashNumber,
          type: paymentConfig.bkashType,
          color: '#E2136E',
          ussd: '*247#',
          icon: <BkashIcon className="w-6 h-6 rounded" />,
        };
      case 'nagad':
        return {
          name: 'Nagad (নগদ)',
          number: paymentConfig.nagadNumber,
          type: paymentConfig.nagadType,
          color: '#F7941D',
          ussd: '*167#',
          icon: <NagadIcon className="w-6 h-6 rounded" />,
        };
      case 'rocket':
        return {
          name: 'Rocket (রকেট)',
          number: paymentConfig.rocketNumber,
          type: paymentConfig.rocketType,
          color: '#8C338C',
          ussd: '*322#',
          icon: <RocketIcon className="w-6 h-6 rounded" />,
        };
    }
  };

  const details = getMethodDetails();

  const handleCopyNumber = () => {
    const rawNumber = details.number.replace(/[^0-9]/g, '');
    navigator.clipboard.writeText(rawNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Phone validation
    const cleanedPhone = senderPhone.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 11) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)'
          : 'Please enter a valid 11-digit phone number'
      );
      return;
    }

    // TrxID validation
    const cleanedTrx = trxId.trim().toUpperCase();
    if (cleanedTrx.length < 6) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (TrxID) দিন'
          : 'Please enter a valid Transaction ID (TrxID)'
      );
      return;
    }

    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);

      const newOrder: Order = {
        id: `BB-${Math.floor(10000 + Math.random() * 90000)}`,
        serviceId: service.id,
        serviceNameBn: service.nameBn,
        serviceNameEn: service.nameEn,
        category: service.category,
        targetUrl,
        quantity,
        unitPrice: service.ratePer1k,
        totalPrice,
        paymentMethod: selectedMethod,
        senderPhone: cleanedPhone,
        trxId: cleanedTrx,
        status: 'verifying',
        progressCount: 0,
        startCount: 0,
        speed: service.deliverySpeedBn,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedCompletion: '১০-১৫ মিনিটের মধ্যে শুরু হবে',
        notes: customerNote,
      };

      setConfirmedOrder(newOrder);
      onOrderCreated(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-7 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedOrder ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                {language === 'bn' ? 'নিরাপদ পেমেন্ট গেটওয়ে' : 'Secure Payment Checkout'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {language === 'bn' ? 'বিকাশ অথবা নগদ পেমেন্ট সম্পন্ন করুন' : 'Pay with bKash or Nagad'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {language === 'bn'
                  ? 'নিচের নম্বরে সেন্ড মানি করে প্রাপ্ত TrxID নিচে সাবমিট করুন।'
                  : 'Send Money to the official number below and submit your TrxID.'}
              </p>
            </div>

            {/* Order Brief Summary Bar */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-slate-400">
                  {language === 'bn' ? service.nameBn : service.nameEn}
                </p>
                <p className="text-xs font-medium text-slate-200 mt-0.5">
                  {quantity.toLocaleString()} {language === 'bn' ? 'টি' : 'units'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{language === 'bn' ? 'মোট প্রদেয় বিল' : 'Total Due'}</p>
                <p className="text-lg font-black text-emerald-400 tabular-nums">৳{totalPrice} BDT</p>
              </div>
            </div>

            {/* Gateway Selection Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <button
                type="button"
                onClick={() => setSelectedMethod('bkash')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'bkash'
                    ? 'bg-[#E2136E]/15 border-[#E2136E] text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <BkashIcon className="w-5 h-5 rounded" />
                <span>bKash</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('nagad')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'nagad'
                    ? 'bg-[#F7941D]/15 border-[#F7941D] text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <NagadIcon className="w-5 h-5 rounded" />
                <span>Nagad</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('rocket')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'rocket'
                    ? 'bg-[#8C338C]/15 border-[#8C338C] text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <RocketIcon className="w-5 h-5 rounded" />
                <span>Rocket</span>
              </button>
            </div>

            {/* Account Box with 1-Click Copy */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400">
                      {details.name} {details.type}
                    </span>
                    {onUpdatePaymentConfig && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingNumber(!isEditingNumber);
                          setEditNumberVal(details.number);
                        }}
                        className="text-[10px] text-blue-400 hover:underline cursor-pointer"
                      >
                        {isEditingNumber ? (language === 'bn' ? 'বাতিল' : 'Cancel') : (language === 'bn' ? '✏️ নম্বর পরিবর্তন' : '✏️ Edit Number')}
                      </button>
                    )}
                  </div>
                  
                  {isEditingNumber ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={editNumberVal}
                        onChange={(e) => setEditNumberVal(e.target.value)}
                        placeholder="আপনার বিকাশ/নগদ নম্বর লিখুন"
                        className="px-2.5 py-1 text-xs sm:text-sm font-mono rounded-lg bg-slate-900 border border-blue-500 text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (onUpdatePaymentConfig && editNumberVal.trim()) {
                            if (selectedMethod === 'bkash') {
                              onUpdatePaymentConfig({ ...paymentConfig, bkashNumber: editNumberVal.trim() });
                            } else if (selectedMethod === 'nagad') {
                              onUpdatePaymentConfig({ ...paymentConfig, nagadNumber: editNumberVal.trim() });
                            } else {
                              onUpdatePaymentConfig({ ...paymentConfig, rocketNumber: editNumberVal.trim() });
                            }
                            setIsEditingNumber(false);
                          }
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        {language === 'bn' ? 'সেভ করুন' : 'Save'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wider tabular-nums mt-0.5">
                      {details.number}
                    </p>
                  )}
                </div>

                {!isEditingNumber && (
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'নম্বর কপি' : 'Copy')}</span>
                  </button>
                )}
              </div>

              {/* Step-by-step guidance */}
              <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                <p className="font-semibold text-slate-200">
                  {language === 'bn' ? 'পেমেন্ট করার নিয়ম:' : 'Payment Instructions:'}
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[12px] leading-relaxed">
                  <li>
                    {language === 'bn'
                      ? `${details.name} অ্যাপে যান অথবা ডায়াল করুন ${details.ussd}`
                      : `Open ${details.name} App or dial ${details.ussd}`}
                  </li>
                  <li>
                    {language === 'bn'
                      ? `সেন্ড মানি (Send Money) অপশনে গিয়ে উপরের নম্বরে ৳${totalPrice} পাঠান`
                      : `Select "Send Money" and send exactly ৳${totalPrice} to the number above`}
                  </li>
                  <li>
                    {language === 'bn'
                      ? 'টাকা পাঠানোর পর প্রাপ্ত Transaction ID (TrxID) টি কপি করে নিচের বক্সে দিন'
                      : 'Copy the Transaction ID (TrxID) from SMS and enter below'}
                  </li>
                </ol>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmitVerification} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    {language === 'bn' ? 'আপনার বিকাশ/নগদ নম্বর' : 'Your Sender Mobile No'}
                  </label>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full rounded-xl bg-slate-950 px-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 border border-slate-800 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    {language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}
                  </label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    placeholder="যেমন: BK9X7Z102A"
                    className="w-full rounded-xl bg-slate-950 px-3 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-500 border border-slate-800 focus:border-blue-500 focus:outline-none uppercase"
                    required
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'bn' ? 'পেমেন্ট যাচাই হচ্ছে...' : 'Verifying Transaction...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'bn' ? 'অর্ডার সাবমিট করুন' : 'Confirm & Submit Order'}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                {language === 'bn'
                  ? 'কোনো সমস্যা হলে ২৪/৭ সাপোর্ট টিম আপনার সহায়তায় নিয়োজিত।'
                  : '24/7 WhatsApp customer support available for instant assistance.'}
              </p>
            </form>
          </div>
        ) : (
          /* Confirmation Receipt View */
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {language === 'bn' ? 'অর্ডার সফলভাবে গৃহীত হয়েছে!' : 'Order Placed Successfully!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {language === 'bn'
                  ? 'আপনার পেমেন্ট রেকর্ড করা হয়েছে এবং ডেলিভারি সারিতে যুক্ত হয়েছে।'
                  : 'Your transaction has been submitted and queued for fulfillment.'}
              </p>
            </div>

            {/* Receipt Card */}
            <div className="text-left p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">{language === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}</span>
                <span className="font-mono font-bold text-blue-400">{confirmedOrder.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'bn' ? 'সার্ভিস:' : 'Service:'}</span>
                <span className="font-medium text-slate-200">
                  {language === 'bn' ? confirmedOrder.serviceNameBn : confirmedOrder.serviceNameEn}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'bn' ? 'পরিমাণ:' : 'Quantity:'}</span>
                <span className="font-mono text-slate-200">{confirmedOrder.quantity.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'bn' ? 'পরিশোধিত মূল্য:' : 'Paid Amount:'}</span>
                <span className="font-bold text-emerald-400">৳{confirmedOrder.totalPrice} BDT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'}</span>
                <span className="capitalize text-slate-200">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">TrxID:</span>
                <span className="font-mono text-slate-200">{confirmedOrder.trxId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track This Order'}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`Order ID: ${confirmedOrder.id} | TrxID: ${confirmedOrder.trxId}`);
                  alert(language === 'bn' ? 'অর্ডার আইডি ক্লিপবোর্ডে কপি হয়েছে!' : 'Order details copied to clipboard!');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'রশিদ কপি করুন' : 'Copy Details'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
