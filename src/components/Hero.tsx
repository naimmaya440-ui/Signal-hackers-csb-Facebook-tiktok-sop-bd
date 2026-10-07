import React from 'react';
import { ShieldCheck, Zap, Lock, Award, ArrowRight } from 'lucide-react';
import { BkashIcon, NagadIcon, RocketIcon } from './BrandIcons';
import heroImg from '../assets/images/hero_social_growth_1791353795220.jpg';

interface HeroProps {
  language: 'bn' | 'en';
  onGetStarted: () => void;
  onTrackOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onGetStarted, onTrackOrder }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/60">
      {/* Background subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Kicker - Unboxed text with typographic separator (Anti-slop compliant) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-emerald-400 font-semibold">
                {language === 'bn' ? 'Signal Hackers CSB · Facebook & TikTok BD Shop' : 'Signal Hackers CSB · Facebook & TikTok BD Shop'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{language === 'bn' ? 'বিকাশ ও নগদ পেমেন্ট' : 'bKash & Nagad'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{language === 'bn' ? 'কোনো পাসওয়ার্ড লাগবে না' : 'Zero Password'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight lg:leading-tight">
              {language === 'bn' ? (
                <>
                  ফেসবুক ও টিকটকে{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-rose-400 bg-clip-text text-transparent">
                    রিয়েল ফলোয়ার ও লাইক
                  </span>{' '}
                  নিন সরাসরি বিকাশ ও নগদে
                </>
              ) : (
                <>
                  Grow Real Facebook & TikTok{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-rose-400 bg-clip-text text-transparent">
                    Followers, Likes & Views
                  </span>{' '}
                  with bKash & Nagad
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {language === 'bn'
                ? 'Signal Hackers CSB - বাংলাদেশের এক নম্বর ফেসবুক ও টিকটক গ্রোথ শপ। শতভাগ রিয়েল ও নন-ড্রপ ফলোয়ার, ভিডিও লাইক ও ভিউ নিন বিকাশ ও নগদের মাধ্যমে স্বয়ংক্রিয়ভাবে।'
                : 'Signal Hackers CSB - Bangladesh’s premier Facebook & TikTok growth shop. 100% active retention, instant automated bKash/Nagad checkout.'}
            </p>

            {/* Supported Payment Callout */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                {language === 'bn' ? 'সমর্থিত পেমেন্ট মেথড:' : 'Accepted Payment Gateways:'}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200">
                  <BkashIcon className="w-5 h-5 rounded" />
                  <span>bKash (বিকাশ)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200">
                  <NagadIcon className="w-5 h-5 rounded" />
                  <span>Nagad (নগদ)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200">
                  <RocketIcon className="w-5 h-5 rounded" />
                  <span>Rocket (রকেট)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{language === 'bn' ? 'সার্ভিস বাছাই করুন' : 'Choose Package'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onTrackOrder}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Existing Order'}</span>
              </button>
            </div>

            {/* Proof Points Strip (Unboxed metadata style) */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white tabular-nums">৪৮,৫০০+</p>
                <p className="text-xs text-slate-400">{language === 'bn' ? 'সফল অর্ডার সম্পন্ন' : 'Orders Fulfilled'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white tabular-nums">৯৯.৮%</p>
                <p className="text-xs text-slate-400">{language === 'bn' ? 'নন-ড্রপ সন্তুষ্টি' : 'Retention Rate'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white tabular-nums">১০-১৫ মি.</p>
                <p className="text-xs text-slate-400">{language === 'bn' ? 'ডেলিভারি শুরুর সময়' : 'Start Pacing'}</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <img
                src={heroImg}
                alt="Facebook Growth & Analytics Visual"
                referrerPolicy="no-referrer"
                className="w-full aspect-[16/9] lg:aspect-[4/3] object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Floating Live Verification Indicator Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-slate-200">
                      {language === 'bn' ? 'স্বয়ংক্রিয় TrxID যাচাইকরণ' : 'Instant TrxID Verification'}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[11px]">ACTIVE 24/7</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                    <p className="text-[11px] text-slate-400">{language === 'bn' ? 'পাসওয়ার্ড নীতিমালা' : 'Password Rule'}</p>
                    <p className="font-semibold text-white mt-0.5">{language === 'bn' ? 'জিরো পাসওয়ার্ড নীতি' : 'Never Required'}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                    <p className="text-[11px] text-slate-400">{language === 'bn' ? 'রিফিল গ্যারান্টি' : 'Refill Safety'}</p>
                    <p className="font-semibold text-white mt-0.5">{language === 'bn' ? '৩০-৬০ দিন ফ্রি রিফিল' : 'Up to 60 Days'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
