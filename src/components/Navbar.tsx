import React from 'react';
import { ShieldCheck, UserCheck, Layers } from 'lucide-react';

interface NavbarProps {
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  activeView: 'home' | 'track' | 'admin';
  setActiveView: (view: 'home' | 'track' | 'admin') => void;
  onOpenOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  activeView,
  setActiveView,
  onOpenOrder,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveView('home')}
          className="text-left font-black tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <span className="text-lg sm:text-xl text-blue-400 font-extrabold">Signal Hackers </span>
          <span className="text-lg sm:text-xl text-rose-500 font-black">CSB</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setActiveView('home');
              const el = document.getElementById('services-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {language === 'bn' ? 'সার্ভিসসমূহ' : 'Services'}
          </button>
          
          <button
            onClick={() => {
              setActiveView('home');
              const el = document.getElementById('pricing-calculator');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {language === 'bn' ? 'ক্যালকুলেটর' : 'Calculator'}
          </button>

          <button
            onClick={() => setActiveView('track')}
            className={`transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'track' ? 'text-blue-400 font-semibold' : 'hover:text-white'
            }`}
          >
            {language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}
          </button>

          <button
            onClick={() => {
              setActiveView('home');
              const el = document.getElementById('how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {language === 'bn' ? 'কাজের নিয়ম' : 'How It Works'}
          </button>

          <button
            onClick={() => {
              setActiveView('home');
              const el = document.getElementById('faq-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {language === 'bn' ? 'প্রশ্নোত্তর' : 'FAQs'}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Language switch */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-medium">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                language === 'bn'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                language === 'en'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Admin toggle for testing/managing payments */}
          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'home' : 'admin')}
            title="Admin Management"
            className={`p-2 rounded-lg border transition-colors ${
              activeView === 'admin'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenOrder}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition-colors whitespace-nowrap"
          >
            {language === 'bn' ? 'অর্ডার শুরু করুন' : 'Start Order'}
          </button>
        </div>
      </div>
    </header>
  );
};
