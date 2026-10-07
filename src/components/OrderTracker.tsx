import React, { useState } from 'react';
import { Order } from '../types';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { BkashIcon, NagadIcon, RocketIcon } from './BrandIcons';

interface OrderTrackerProps {
  language: 'bn' | 'en';
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  language,
  orders,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      o.trxId.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      o.targetUrl.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      o.senderPhone.includes(searchQuery.trim());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && o.status === filterStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return {
          label: language === 'bn' ? 'ডেলিভারি চলমান' : 'In Progress',
          classes: 'text-sky-400 bg-sky-950/60 border-sky-800/80',
          indicator: 'bg-sky-400 animate-pulse',
        };
      case 'completed':
        return {
          label: language === 'bn' ? 'সম্পন্ন হয়েছে' : 'Completed',
          classes: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80',
          indicator: 'bg-emerald-400',
        };
      case 'verifying':
        return {
          label: language === 'bn' ? 'পেমেন্ট যাচাই হচ্ছে' : 'Verifying TrxID',
          classes: 'text-amber-400 bg-amber-950/60 border-amber-800/80',
          indicator: 'bg-amber-400 animate-ping',
        };
      default:
        return {
          label: language === 'bn' ? 'পেন্ডিং' : 'Pending',
          classes: 'text-slate-400 bg-slate-900 border-slate-800',
          indicator: 'bg-slate-400',
        };
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-950 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            {language === 'bn' ? 'লাইভ অর্ডার স্ট্যাটাস ট্র্যাকার' : 'Live Order Progress Tracking'}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            {language === 'bn' ? 'আপনার অর্ডারের অগ্রগতি যাচাই করুন' : 'Track Your Order Real-Time'}
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            {language === 'bn'
              ? 'আপনার অর্ডার আইডি (Order ID) অথবা বিকাশ/নগদ TrxID লিখে সার্চ করুন।'
              : 'Search by Order ID or bKash/Nagad Transaction ID to view live progress.'}
          </p>
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'অর্ডার আইডি (যেমন: BB-78241) বা TrxID লিখুন...'
                  : 'Enter Order ID (e.g. BB-78241) or TrxID...'
              }
              className="w-full rounded-2xl bg-slate-900 pl-11 pr-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 border border-slate-800 focus:border-blue-500 focus:outline-none shadow-lg"
            />
          </div>

          {/* Filter segment */}
          <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 w-fit mx-auto text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'সকল অর্ডার' : 'All'}
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'processing'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'চলমান (Processing)' : 'In Progress'}
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'completed'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'সম্পন্ন (Completed)' : 'Completed'}
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-semibold text-slate-200">
                {language === 'bn' ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি' : 'No Orders Found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আপনার সঠিক অর্ডার আইডি বা TrxID পুনরায় চেক করুন অথবা নতুন অর্ডার প্লেস করুন।'
                  : 'Double-check your Order ID or submit a new order to begin tracking.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              const percent = Math.min(
                100,
                Math.round(((order.progressCount || 0) / order.quantity) * 100)
              );

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-md hover:border-slate-700 transition-all space-y-4"
                >
                  {/* Top Bar: Order ID, Gateway & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-blue-400">
                        {order.id}
                      </span>
                      {/* Typographic separator */}
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        {order.paymentMethod === 'bkash' && <BkashIcon className="w-4 h-4 rounded" />}
                        {order.paymentMethod === 'nagad' && <NagadIcon className="w-4 h-4 rounded" />}
                        {order.paymentMethod === 'rocket' && <RocketIcon className="w-4 h-4 rounded" />}
                        <span className="font-mono uppercase">TrxID: {order.trxId}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-semibold ${badge.classes}`}>
                        <span className={`w-2 h-2 rounded-full ${badge.indicator}`} />
                        <span>{badge.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service & Link */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-7 space-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {language === 'bn' ? order.serviceNameBn : order.serviceNameEn}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
                        <span className="text-slate-400">{language === 'bn' ? 'টার্গেট লিঙ্ক:' : 'Target URL:'}</span>
                        <a
                          href={order.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline truncate max-w-xs flex items-center gap-1"
                        >
                          <span>{order.targetUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>

                    {/* Quantity & Delivered Summary */}
                    <div className="md:col-span-5 flex items-center justify-between md:justify-end gap-6 text-right">
                      <div>
                        <p className="text-[11px] text-slate-400">{language === 'bn' ? 'অর্ডার সাইজ' : 'Total Qty'}</p>
                        <p className="text-sm sm:text-base font-bold text-white tabular-nums">
                          {order.quantity.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">{language === 'bn' ? 'ডেলিভারি হয়েছে' : 'Delivered'}</p>
                        <p className="text-sm sm:text-base font-bold text-emerald-400 tabular-nums">
                          {order.progressCount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">{language === 'bn' ? 'পরিশোধিত' : 'Amount'}</p>
                        <p className="text-sm sm:text-base font-bold text-white tabular-nums">
                          ৳{order.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {language === 'bn' ? 'সম্পন্নতার হার:' : 'Progress:'} <strong className="text-white font-mono">{percent}%</strong>
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {order.status === 'completed'
                          ? language === 'bn' ? '✓ ১০০% ডেলিভারি নিশ্চিত' : '✓ 100% Fulfilled'
                          : language === 'bn' ? `গতি: ${order.speed}` : `Speed: ${order.speed}`}
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-700 ${
                          order.status === 'completed'
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-blue-500 to-sky-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer notes */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <div>
                      <span>{language === 'bn' ? 'অর্ডারের সময়:' : 'Created:'} </span>
                      <span className="text-slate-300">{order.createdAt}</span>
                    </div>
                    {order.notes && (
                      <div className="italic text-slate-300">
                        "{order.notes}"
                      </div>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};
