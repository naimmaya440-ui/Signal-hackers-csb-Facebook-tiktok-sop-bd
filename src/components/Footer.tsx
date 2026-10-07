import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { BkashIcon, NagadIcon, RocketIcon } from './BrandIcons';

interface FooterProps {
  language: 'bn' | 'en';
  onNavigate: (sectionId: string) => void;
  onOpenTrack: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
  onOpenTrack,
  onOpenSupport,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Wordmark & Statement */}
          <div className="md:col-span-5 space-y-3">
            <div className="font-black text-xl tracking-tight text-white">
              <span className="text-blue-400">Signal Hackers </span>
              <span className="text-rose-500">CSB</span>
              <span className="block text-xs font-semibold text-slate-400 mt-0.5">Facebook & TikTok BD Shop</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {language === 'bn'
                ? 'Signal Hackers CSB — বাংলাদেশের বিশ্বস্ত ফেসবুক ও টিকটক গ্রোথ প্ল্যাটফর্ম। বিকাশ ও নগদ পেমেন্টের মাধ্যমে রিয়েল ফলোয়ার, লাইক ও ভিউ সরবরাহ করা হয়।'
                : 'Signal Hackers CSB — Bangladesh’s trusted Facebook & TikTok growth shop powered by bKash & Nagad payments.'}
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <BkashIcon className="w-3.5 h-3.5 rounded" />
                <span>bKash</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <NagadIcon className="w-3.5 h-3.5 rounded" />
                <span>Nagad</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <RocketIcon className="w-3.5 h-3.5 rounded" />
                <span>Rocket</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services Navigation */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'bn' ? 'সার্ভিস ক্যাটাগরি' : 'Service Packages'}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigate('pricing-calculator')} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'bn' ? 'ফেসবুক পেইজ ফলোয়ার (১০০% নন-ড্রপ)' : 'Facebook Page Followers (Non-Drop)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing-calculator')} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'bn' ? 'ফেসবুক প্রোফাইল ফলোয়ার (রিয়েল বিডি)' : 'Facebook Profile Followers (BD)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing-calculator')} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'bn' ? 'পোস্ট লাইক ও লাভ রিঅ্যাকশন' : 'Post Likes & Love Reactions'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing-calculator')} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'bn' ? 'ভিডিও ভিউ ও রিলস ওয়াচ টাইম' : 'Video Views & Reels Engagement'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Utilities */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'bn' ? 'সহযোগিতা ও তথ্য' : 'Assistance & Tracking'}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={onOpenTrack} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'bn' ? 'অর্ডার ট্র্যাকিং ও স্ট্যাটাস' : 'Track Order Status'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'bn' ? 'কাজের নিয়ম ও নিরাপত্তা' : 'Safety & How It Works'}
                </button>
              </li>
              <li>
                <button onClick={onOpenSupport} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'bn' ? '২৪/৭ হোয়াটসঅ্যাপ হেল্পডেস্ক' : 'WhatsApp Support Desk'}
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                  {language === 'bn' ? 'এডমিন পোর্টাল' : 'Merchant Portal'}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} BoostBangla. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </p>
          <p className="max-w-lg text-center sm:text-right">
            {language === 'bn'
              ? 'ঘোষণা: ফেসবুক ও মেটা তাদের স্ব স্ব প্রতিষ্ঠানের রেজিস্টার্ড ট্রেডমার্ক। এই সেবাটি স্বাধীন মার্কেটিং প্রক্রিয়ায় পরিচালিত।'
              : 'Disclaimer: Facebook and Meta are registered trademarks of Meta Platforms, Inc. BoostBangla operates independently.'}
          </p>
        </div>

      </div>
    </footer>
  );
};
