import React, { useState } from 'react';
import { ChevronDown, MessageSquare, PhoneCall } from 'lucide-react';

interface FaqSectionProps {
  language: 'bn' | 'en';
  onContactSupport: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language, onContactSupport }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qBn: 'ফেসবুক একাউন্ট বা পেইজের কোনো পাসওয়ার্ড কি দিতে হবে?',
      qEn: 'Do I need to share my Facebook password or login?',
      aBn: 'না, কখনোই কোনো পাসওয়ার্ড লাগবে না! আমাদের প্ল্যাটফর্মে নিরাপদভাবে শুধু আপনার ফেসবুক পেইজ, প্রোফাইল অথবা পোস্টের পাবলিক লিংক (URL) প্রদান করলেই চলবে।',
      aEn: 'Never! We strictly enforce a Zero-Password policy. We only need your public Facebook Page or Post URL.',
    },
    {
      qBn: 'বিকাশ ও নগদে কিভাবে পেমেন্ট করবো?',
      qEn: 'How do I pay with bKash or Nagad?',
      aBn: 'অর্ডারের সময় আমাদের অফিসিয়াল বিকাশ/নগদ নম্বরটি প্রদর্শিত হবে। আপনার বিকাশ বা নগদ অ্যাপ থেকে "সেন্ড মানি" (Send Money) করে প্রাপ্ত Transaction ID (TrxID) টি ইনপুট দিলেই স্বয়ংক্রিয়ভাবে অর্ডার ভেরিফাই হবে।',
      aEn: 'Select bKash or Nagad, copy our official number, Send Money from your app, and paste the Transaction ID (TrxID) for instant verification.',
    },
    {
      qBn: 'ফলোয়ার বা লাইক কি পরে ড্রপ (কমে) যাবে?',
      qEn: 'Will the followers or likes drop over time?',
      aBn: 'আমাদের প্রতিটি প্যাকেজে ৩০ থেকে ৬০ দিনের নন-ড্রপ রিফিল গ্যারান্টি রয়েছে। কোনো কারণে সাময়িক ড্রপ দেখা দিলে রিফিল বাটনে ক্লিক করলেই সিস্টেম স্বয়ংক্রিয়ভাবে পূরণ করে দেয়।',
      aEn: 'Our packages come with a 30 to 60-day Non-Drop Refill Guarantee. If any drop occurs, it is automatically refilled free of charge.',
    },
    {
      qBn: 'আমার ফেসবুক আইডি বা পেইজ কি ব্লক/ব্যান হতে পারে?',
      qEn: 'Can my Facebook account or page get restricted or banned?',
      aBn: 'একদমই না। ফেসবুক শুধুমাত্র পাসওয়ার্ড শেয়ারিং বা স্প্যাম বট ব্যবহারে নিষেধাজ্ঞা দেয়। আমাদের সিস্টেম বাইরের অর্গানিক সোশ্যাল ট্রাফিকের মতো স্বাভাবিক গতিতে (Organic Pacing) ডেলিভারি দেয়, যা মেটা পলিসির সাথে ১০০% সামঞ্জস্যপূর্ণ।',
      aEn: 'No risk at all. We employ natural delivery speeds adhering strictly to Meta Community Standards without requiring any access credentials.',
    },
    {
      qBn: 'অর্ডার করার পর কতক্ষণ সময়ের মধ্যে শুরু হবে?',
      qEn: 'How long does delivery take after payment?',
      aBn: 'পেমেন্ট TrxID সাবমিট করার ৫ থেকে ১৫ মিনিটের মধ্যেই ডেলিভারি সিস্টেম কাজ শুরু করে। আপনি অর্ডার ট্র্যাকিং পেইজে রিয়েল-টাইম লাইভ অগ্রগতি দেখতে পারবেন।',
      aEn: 'Processing initiates within 5-15 minutes of payment verification. You can track real-time progress right on our live tracking page.',
    },
  ];

  return (
    <section id="faq-section" className="py-16 lg:py-24 bg-slate-900/60 border-b border-slate-800/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            {language === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন' : 'Frequently Asked Questions'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'bn' ? 'আপনার মনে কি কোনো প্রশ্ন আছে?' : 'Common Questions & Answers'}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {language === 'bn'
              ? 'নিরাপত্তা, বিকাশ/নগদ পেমেন্ট এবং ফেসবুক গ্রোথ সম্পর্কে বিস্তারিত জানুন।'
              : 'Everything you need to know about safety, bKash/Nagad checkout, and delivery.'}
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {language === 'bn' ? faq.qBn : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 pt-3 leading-relaxed">
                    {language === 'bn' ? faq.aBn : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Support Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">
              {language === 'bn' ? 'আরও কোনো প্রশ্ন বা কাস্টম অর্ডার প্রয়োজন?' : 'Need More Help or Custom Inquiry?'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'bn'
                ? 'আমাদের হোয়াটসঅ্যাপ সাপোর্ট টিম ২৪ ঘণ্টা লাইভ থাকে।'
                : 'Our WhatsApp support team is on standby 24/7.'}
            </p>
          </div>
          <button
            onClick={onContactSupport}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
