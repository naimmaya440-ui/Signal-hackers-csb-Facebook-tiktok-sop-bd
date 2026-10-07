import React, { useState, useId } from 'react';
import { ServiceItem } from '../types';
import { SERVICES } from '../data/services';
import { 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Link2, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { BkashIcon, NagadIcon } from './BrandIcons';

interface ServiceOrderFormProps {
  language: 'bn' | 'en';
  onProceedToPayment: (selectedService: ServiceItem, quantity: number, url: string, note?: string) => void;
}

export const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({
  language,
  onProceedToPayment,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [quantity, setQuantity] = useState<number>(1000);
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [reactionType, setReactionType] = useState<string>('Love (❤️)');
  const [customerNote, setCustomerNote] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [urlFormatValid, setUrlFormatValid] = useState<boolean | null>(null);

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  // Quick quantities based on service
  const quickQuantities = [500, 1000, 2000, 5000, 10000];

  // Pricing calculation
  const calculatePrice = (qty: number, ratePer1k: number) => {
    let subtotal = (qty / 1000) * ratePer1k;
    // Volume discount
    let discountPercent = 0;
    if (qty >= 5000) {
      discountPercent = 10;
    } else if (qty >= 2000) {
      discountPercent = 5;
    }
    const discountAmount = (subtotal * discountPercent) / 100;
    const finalTotal = Math.round(subtotal - discountAmount);
    return {
      subtotal: Math.round(subtotal),
      discountPercent,
      discountAmount: Math.round(discountAmount),
      finalTotal,
    };
  };

  const priceDetails = calculatePrice(quantity, selectedService.ratePer1k);

  // Validate Social URL
  const handleUrlChange = (val: string) => {
    setTargetUrl(val);
    setErrorMsg('');
    if (!val.trim()) {
      setUrlFormatValid(null);
      return;
    }
    const isSocial = val.includes('facebook.com') || val.includes('fb.com') || val.includes('fb.watch') || val.includes('tiktok.com');
    setUrlFormatValid(isSocial);
  };

  const handleSelectService = (item: ServiceItem) => {
    setSelectedServiceId(item.id);
    if (quantity < item.minQuantity) {
      setQuantity(item.minQuantity);
    } else if (quantity > item.maxQuantity) {
      setQuantity(item.maxQuantity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      setErrorMsg(
        language === 'bn' 
          ? 'অনুগ্রহ করে আপনার ফেসবুক পেইজ বা পোস্টের লিঙ্কটি দিন' 
          : 'Please enter your Facebook link'
      );
      return;
    }
    if (quantity < selectedService.minQuantity) {
      setErrorMsg(
        language === 'bn'
          ? `সর্বনিম্ন অর্ডার পরিমাণ ${selectedService.minQuantity}`
          : `Minimum quantity is ${selectedService.minQuantity}`
      );
      return;
    }

    const notePayload = selectedService.category === 'post_reactions' 
      ? `Reactions: ${reactionType}. ${customerNote}`
      : customerNote;

    onProceedToPayment(selectedService, quantity, targetUrl.trim(), notePayload);
  };

  return (
    <section id="pricing-calculator" className="py-16 lg:py-20 bg-slate-900/40 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            {language === 'bn' ? 'ইনস্ট্যান্ট ক্যালকুলেটর ও অর্ডার' : 'Instant Pricing & Order'}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            {language === 'bn'
              ? 'আপনার কাঙ্ক্ষিত প্যাকেজ ও পরিমাণ নির্বাচন করুন'
              : 'Choose Your Package & Calculate Cost'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            {language === 'bn'
              ? 'বিকাশ ও নগদে পেমেন্ট করে তাৎক্ষণিক অর্ডার সাবমিট করুন। অর্ডার নিশ্চিত করার সাথে সাথেই প্রসেসিং শুরু হবে।'
              : 'Transparent BDT rates, volume discounts, and instantaneous verification.'}
          </p>
        </div>

        {/* Interactive Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Service Selection Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                {language === 'bn' ? '১. সার্ভিস বাছাই করুন' : '1. Select Service'}
              </span>
              <span className="text-xs text-slate-400">
                {language === 'bn' ? `${SERVICES.length}টি লাইভ প্যাকেজ` : `${SERVICES.length} Live Packages`}
              </span>
            </div>

            <div className="space-y-3">
              {SERVICES.map((item) => {
                const isSelected = item.id === selectedServiceId;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectService(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/40 shadow-lg shadow-blue-950/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {language === 'bn' ? item.nameBn : item.nameEn}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {language === 'bn' ? item.descriptionBn : item.descriptionEn}
                        </p>
                        
                        {/* Unboxed metadata row */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                          <span className="text-emerald-400 font-medium">
                            {language === 'bn' ? item.qualityBn : item.qualityEn}
                          </span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span>{language === 'bn' ? item.deliverySpeedBn : item.deliverySpeedEn}</span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-sky-400">
                            {language === 'bn' ? `${item.refillDays} দিন রিফিল` : `${item.refillDays}d Refill`}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Tag */}
                      <div className="text-right shrink-0">
                        <p className="text-lg sm:text-xl font-black text-white tabular-nums">
                          ৳{item.ratePer1k}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {language === 'bn' ? 'প্রতি ১,০০০' : 'per 1,000'}
                        </p>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-blue-400">
                            <Check className="w-3 h-3" />
                            {language === 'bn' ? 'সিলেক্টেড' : 'Selected'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Quantity, URL input & Checkout Summary */}
          <div className="lg:col-span-5 sticky top-20">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-xl space-y-5">
              
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  {language === 'bn' ? '২. লিংক ও পরিমাণ নির্ধারণ' : '2. Quantity & Link'}
                </span>
                <span className="text-xs text-blue-400 font-medium">
                  {language === 'bn' ? selectedService.nameBn.slice(0, 24) + '...' : selectedService.nameEn.slice(0, 24) + '...'}
                </span>
              </div>

              {/* Target Link input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  {language === 'bn'
                    ? selectedService.requiresType === 'page'
                      ? 'ফেসবুক পেইজ লিংক (Page URL)'
                      : selectedService.requiresType === 'profile'
                      ? 'ফেসবুক প্রোফাইল লিংক (Profile URL)'
                      : selectedService.requiresType === 'group'
                      ? 'ফেসবুক গ্রুপ লিংক (Group URL)'
                      : selectedService.requiresType === 'tiktok_profile'
                      ? 'টিকটক প্রোফাইল লিংক (TikTok Profile URL)'
                      : selectedService.requiresType === 'tiktok_video'
                      ? 'টিকটক ভিডিও লিংক (TikTok Video URL)'
                      : 'পোস্ট বা ভিডিও লিংক (Target URL)'
                    : 'Target Social Link (Facebook / TikTok)'}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder={
                      selectedService.requiresType === 'page'
                        ? 'https://facebook.com/yourpagename'
                        : selectedService.requiresType === 'profile'
                        ? 'https://facebook.com/profile.php?id=...'
                        : selectedService.requiresType === 'tiktok_profile'
                        ? 'https://www.tiktok.com/@yourusername'
                        : selectedService.requiresType === 'tiktok_video'
                        ? 'https://www.tiktok.com/@user/video/123456789'
                        : 'https://facebook.com/yourpage/posts/123456789'
                    }
                    className={`w-full rounded-xl bg-slate-950 pl-9 pr-8 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 border transition-colors focus:outline-none ${
                      urlFormatValid === false
                        ? 'border-rose-500 focus:border-rose-400'
                        : urlFormatValid === true
                        ? 'border-emerald-500 focus:border-emerald-400'
                        : 'border-slate-800 focus:border-blue-500'
                    }`}
                  />
                  {urlFormatValid === true && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-400">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'bn'
                    ? '⚠️ কখনোই কোনো পাসওয়ার্ড দেবেন না। শুধু পাবলিক ফেসবুক বা টিকটক লিংক দিন।'
                    : 'Never give your password. Only public Facebook or TikTok links are needed.'}
                </p>
              </div>

              {/* Reactions dropdown if post_reactions */}
              {selectedService.category === 'post_reactions' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    {language === 'bn' ? 'রিঅ্যাকশন নির্বাচন করুন' : 'Select Reaction'}
                  </label>
                  <select
                    value={reactionType}
                    onChange={(e) => setReactionType(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 text-xs sm:text-sm text-white border border-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Love (❤️)">Love (❤️ লাভ রিঅ্যাকশন)</option>
                    <option value="Care (🥰)">Care (🥰 কেয়ার রিঅ্যাকশন)</option>
                    <option value="Haha (😆)">Haha (😆 হাহা রিঅ্যাকশন)</option>
                    <option value="Wow (😮)">Wow (😮 ওয়াও রিঅ্যাকশন)</option>
                    <option value="Mixed (❤️ 🥰)">Mixed (লাভ + কেয়ার মিক্সড)</option>
                  </select>
                </div>
              )}

              {/* Quantity input & Quick Buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    {language === 'bn' ? 'অর্ডার পরিমাণ (Quantity)' : 'Order Quantity'}
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-400 tabular-nums">
                    {quantity.toLocaleString()} {language === 'bn' ? 'টি' : 'units'}
                  </span>
                </div>

                <input
                  type="number"
                  min={selectedService.minQuantity}
                  max={selectedService.maxQuantity}
                  step={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white border border-slate-800 focus:border-blue-500 focus:outline-none tabular-nums"
                />

                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quickQuantities.map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => setQuantity(q)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer tabular-nums ${
                        quantity === q
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      +{q.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{language === 'bn' ? `মিনিমাম: ${selectedService.minQuantity}` : `Min: ${selectedService.minQuantity}`}</span>
                  <span>{language === 'bn' ? `ম্যাক্সিমাম: ${selectedService.maxQuantity.toLocaleString()}` : `Max: ${selectedService.maxQuantity.toLocaleString()}`}</span>
                </div>
              </div>

              {/* Optional customer instructions */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-300">
                  {language === 'bn' ? 'বিশেষ নোট (ঐচ্ছিক)' : 'Customer Note (Optional)'}
                </label>
                <input
                  type="text"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: আস্তে আস্তে ডেলিভারি করবেন' : 'e.g. Please deliver gradually'}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 border border-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="tabular-nums font-mono text-slate-200">৳{priceDetails.subtotal} BDT</span>
                </div>

                {priceDetails.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-400">
                    <span>{language === 'bn' ? `ডিসকাউন্ট (${priceDetails.discountPercent}%)` : `Discount (${priceDetails.discountPercent}%)`}</span>
                    <span className="tabular-nums font-mono">-৳{priceDetails.discountAmount} BDT</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm sm:text-base font-bold text-white">
                  <span>{language === 'bn' ? 'সর্বমোট প্রদেয় বিল:' : 'Total Payable:'}</span>
                  <span className="text-xl font-extrabold text-blue-400 tabular-nums">
                    ৳{priceDetails.finalTotal} <span className="text-xs font-normal text-slate-400">টাকা</span>
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <BkashIcon className="w-5 h-5 rounded" />
                  <NagadIcon className="w-5 h-5 rounded" />
                </div>
                <span>
                  {language === 'bn'
                    ? `বিকাশ / নগদে ৳${priceDetails.finalTotal} পরিশোধ করুন`
                    : `Pay ৳${priceDetails.finalTotal} via bKash / Nagad`}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {language === 'bn'
                    ? '১০০% নিরাপদ ট্রানজেকশন · তাৎক্ষণিক TrxID ভেরিফিকেশন'
                    : '100% Encrypted & Safe · Instant TrxID verification'}
                </span>
              </div>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
