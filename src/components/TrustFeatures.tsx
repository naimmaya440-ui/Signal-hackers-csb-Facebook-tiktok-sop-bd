import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  RotateCcw, 
  UserCheck, 
  Headphones, 
  CheckCircle,
  Clock
} from 'lucide-react';
import securityImg from '../assets/images/growth_security_card_1791353808885.jpg';

interface TrustFeaturesProps {
  language: 'bn' | 'en';
}

export const TrustFeatures: React.FC<TrustFeaturesProps> = ({ language }) => {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-slate-950 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            {language === 'bn' ? 'স্বচ্ছ ও নিরাপদ প্রক্রিয়া' : 'Transparent & Safe Process'}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            {language === 'bn'
              ? 'মাত্র ৪টি সহজ ধাপে ফেসবুক ফলোয়ার ও লাইক পান'
              : 'Grow Your Audience in 4 Simple Steps'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            {language === 'bn'
              ? 'আমাদের সিস্টেমে কোনো অ্যাকাউন্ট লগইন বা পাসওয়ার্ড লাগে না। সম্পূর্ণ মেটা কমিউনিটি গাইডলাইন মেনে ডেলিভারি করা হয়।'
              : 'Zero password required. 100% compliant with Meta standards and verified Bangladeshi audience.'}
          </p>
        </div>

        {/* 4 Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="font-mono text-2xl font-black text-blue-500">01</span>
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'সার্ভিস বাছাই করুন' : 'Select Package'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'পেইজ ফলোয়ার, প্রোফাইল ফলোয়ার, লাইক অথবা ভিডিও ভিউ প্রয়োজন অনুযায়ী নির্বাচন করুন।'
                : 'Choose your desired service and calculate the real-time BDT rate instantly.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="font-mono text-2xl font-black text-blue-500">02</span>
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'পাবলিক লিঙ্ক প্রদান' : 'Provide Public URL'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'আপনার ফেসবুক পেইজ বা পোস্টের লিঙ্কটি ইনপুট দিন। কখনোই পাসওয়ার্ড দিতে হবে না।'
                : 'Paste your Facebook link. Your account password is never needed or requested.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="font-mono text-2xl font-black text-blue-500">03</span>
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'বিকাশ/নগদে সেন্ড মানি' : 'bKash / Nagad Payment'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'প্রদত্ত নম্বরে সেন্ড মানি করে প্রাপ্ত TrxID ও আপনার মোবাইল নম্বর সাবমিট করুন।'
                : 'Send exact money and submit your transaction ID for instant validation.'}
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="font-mono text-2xl font-black text-blue-500">04</span>
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'স্বয়ংক্রিয় ডেলিভারি' : 'Gradual Safe Delivery'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? '১০-১৫ মিনিটের মধ্যেই ফলোয়ার বা লাইক ডেলিভারি শুরু হয় এবং লাইভ ট্র্যাক করা যায়।'
                : 'Delivery begins within 10-15 minutes at a natural, non-drop safe pace.'}
            </p>
          </div>

        </div>

        {/* Security Feature Bento Card with Generated Image */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-5 relative h-full min-h-[280px]">
            <img
              src={securityImg}
              alt="Security & Anti-Drop Verification"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {language === 'bn' ? 'আইডি ও পেইজ সুরক্ষা নীতি' : 'Account Protection Guarantee'}
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
                {language === 'bn'
                  ? 'কেন BoostBangla দেশের সবচেয়ে বিশ্বস্ত প্ল্যাটফর্ম?'
                  : 'Why BoostBangla is Bangladesh’s Trusted Platform'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{language === 'bn' ? 'কোনো পাসওয়ার্ড লাগবে না' : 'Zero Password Policy'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'bn'
                    ? 'আইডি বা পেইজের কোনো পাসওয়ার্ড প্রয়োজন নেই। শুধু লিংক দিয়ে সার্ভিস নেওয়া সম্ভব।'
                    : '100% risk free. We only deliver via public links.'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? '৩০-৬০ দিনের রিফিল সুবিধা' : '30-60 Days Refill Guarantee'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'bn'
                    ? 'কোনো কারণে ফলোয়ার ড্রপ করলে ফ্রি রিফিল বা রিপ্লেসমেন্ট সুবিধা রয়েছে।'
                    : 'Automatic free replenishment if any drop occurs.'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{language === 'bn' ? 'রিয়েল বাংলাদেশি এক্টিভ ইউজার' : 'Active Bangladeshi Audience'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'bn'
                    ? 'স্থানীয় ব্যবসায়িক পেজের জন্য দেশীয় অডিয়েন্স থেকে এনগেজমেন্ট সরবরাহ করা হয়।'
                    : 'Targeted engagement from genuine local Facebook users.'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{language === 'bn' ? 'ন্যাচারাল পেসিং স্পিড' : 'Natural Organic Pacing'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'bn'
                    ? 'অর্গানিক গতিতে ডেলিভারি হয়, যাতে ফেসবুকের অ্যালগরিদম কোনো স্প্যাম শনাক্ত না করে।'
                    : 'Gradual distribution prevents algorithmic flags or restrictions.'}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
