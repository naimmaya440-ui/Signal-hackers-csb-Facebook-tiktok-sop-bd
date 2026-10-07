import React, { useState } from 'react';
import { Order, PaymentConfig, ServiceItem, SmmApiConfig } from '../types';
import { SERVICES, DEFAULT_SMM_CONFIG } from '../data/services';
import { fetchSmmBalance, submitSmmOrder, fetchSmmOrderStatus } from '../services/smmApi';
import { 
  Check, 
  X, 
  Settings, 
  RefreshCw, 
  Save, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  MessageSquare, 
  Cpu, 
  Zap, 
  Globe, 
  Send, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { BkashIcon, NagadIcon, RocketIcon } from './BrandIcons';

interface AdminPanelProps {
  language: 'bn' | 'en';
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status'], newProgress?: number) => void;
  onUpdateOrder?: (orderId: string, updates: Partial<Order>) => void;
  paymentConfig: PaymentConfig;
  onUpdatePaymentConfig: (config: PaymentConfig) => void;
  onBackToHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  language,
  orders,
  onUpdateOrderStatus,
  onUpdateOrder,
  paymentConfig,
  onUpdatePaymentConfig,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'gateways' | 'rates' | 'automation'>('orders');
  const [tempConfig, setTempConfig] = useState<PaymentConfig>(paymentConfig);
  const [smmConfig, setSmmConfig] = useState<SmmApiConfig>(() => {
    try {
      const saved = localStorage.getItem('boostbangla_smm_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && parsed.apiKey.length > 10) return parsed;
      }
    } catch (e) {
      // Ignore
    }
    return DEFAULT_SMM_CONFIG;
  });

  const [serviceRates, setServiceRates] = useState<Record<string, number>>(
    SERVICES.reduce((acc, s) => ({ ...acc, [s.id]: s.ratePer1k }), {})
  );

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [apiTesting, setApiTesting] = useState<boolean>(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [orderActionLoading, setOrderActionLoading] = useState<string | null>(null);
  const [orderAlertMsg, setOrderAlertMsg] = useState<{ id: string; msg: string; type: 'success' | 'error' } | null>(null);

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePaymentConfig(tempConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveSmmConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('boostbangla_smm_config', JSON.stringify(smmConfig));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestApi = async () => {
    if (!smmConfig.apiUrl || !smmConfig.apiKey) {
      setApiTestResult({
        success: false,
        msg: language === 'bn'
          ? 'অনুগ্রহ করে API URL এবং API Key উভয়ই লিখুন।'
          : 'Please enter both API URL and API Key.',
      });
      return;
    }

    setApiTesting(true);
    setApiTestResult(null);

    try {
      const res = await fetchSmmBalance(smmConfig.apiUrl, smmConfig.apiKey);
      if (res.balance !== undefined) {
        const updated = {
          ...smmConfig,
          balanceUsd: Number(res.balance) || 0,
          currency: res.currency || 'USD',
        };
        setSmmConfig(updated);
        localStorage.setItem('boostbangla_smm_config', JSON.stringify(updated));
        setApiTestResult({
          success: true,
          msg: language === 'bn'
            ? `✓ সংযোগ সফল! আপনার SMM অ্যাকাউন্টে ব্যালেন্স: ${res.balance} ${res.currency || 'USD'}`
            : `✓ Connected! Account balance: ${res.balance} ${res.currency || 'USD'}`,
        });
      } else {
        setApiTestResult({
          success: false,
          msg: res.error || (language === 'bn' ? 'API Key সঠিক নয় বা প্রোভাইডার রিফিউজ করেছে।' : 'Invalid API Key or connection error.'),
        });
      }
    } catch (err: any) {
      setApiTestResult({
        success: false,
        msg: err.message || 'Connection failed',
      });
    } finally {
      setApiTesting(false);
    }
  };

  // Function to forward an order to SMM Provider
  const handleSendToSmmProvider = async (order: Order) => {
    if (!smmConfig.apiUrl || !smmConfig.apiKey) {
      setOrderAlertMsg({
        id: order.id,
        type: 'error',
        msg: language === 'bn'
          ? 'প্রথমে "আসলভাবে কাজ করানোর গাইড ও API" ট্যাবে গিয়ে আপনার SMM API Key বসান।'
          : 'Please enter your SMM API credentials in the Automation tab first.',
      });
      return;
    }

    const providerServiceId = smmConfig.serviceMappings[order.serviceId] || '1042';
    setOrderActionLoading(order.id);
    setOrderAlertMsg(null);

    try {
      const res = await submitSmmOrder(
        smmConfig.apiUrl,
        smmConfig.apiKey,
        providerServiceId,
        order.targetUrl,
        order.quantity
      );

      if (res.order) {
        const orderIdStr = String(res.order);
        if (onUpdateOrder) {
          onUpdateOrder(order.id, {
            providerOrderId: orderIdStr,
            providerStatus: 'Pending',
            status: 'processing',
            notes: `SMM Provider Order ID: #${orderIdStr}`,
          });
        } else {
          onUpdateOrderStatus(order.id, 'processing');
        }

        setOrderAlertMsg({
          id: order.id,
          type: 'success',
          msg: language === 'bn'
            ? `✓ সফল! প্রোভাইডারে স্বয়ংক্রিয় অর্ডার চলে গেছে (SMM ID: #${orderIdStr})`
            : `✓ Success! Sent to provider (SMM ID: #${orderIdStr})`,
        });
      } else {
        const errDetail = res.error || (language === 'bn' ? 'প্রোভাইডার এরর দিয়েছে (ব্যালেন্স বা কানেকশন চেক করুন)' : 'Provider rejected order');
        if (onUpdateOrder) {
          onUpdateOrder(order.id, {
            status: 'processing',
            notes: `পেমেন্ট অনুমোদিত। দ্রষ্টব্য: ${errDetail}`,
          });
        } else {
          onUpdateOrderStatus(order.id, 'processing');
        }
        setOrderAlertMsg({
          id: order.id,
          type: 'error',
          msg: `⚠️ পেমেন্ট অনুমোদিত হয়েছে। SMM দ্রষ্টব্য: ${errDetail}`,
        });
      }
    } catch (err: any) {
      setOrderAlertMsg({
        id: order.id,
        type: 'error',
        msg: err.message || 'Network error',
      });
    } finally {
      setOrderActionLoading(null);
    }
  };

  // Function to sync live status from provider
  const handleSyncSmmStatus = async (order: Order) => {
    if (!order.providerOrderId) return;
    setOrderActionLoading(order.id);

    try {
      const res = await fetchSmmOrderStatus(smmConfig.apiUrl, smmConfig.apiKey, order.providerOrderId);
      if (res.status) {
        const provStatus = res.status.toLowerCase();
        let appStatus: Order['status'] = order.status;
        let progress = order.progressCount;

        if (provStatus.includes('completed')) {
          appStatus = 'completed';
          progress = order.quantity;
        } else if (provStatus.includes('in progress') || provStatus.includes('processing')) {
          appStatus = 'processing';
          if (res.remains !== undefined) {
            progress = Math.max(0, order.quantity - Number(res.remains));
          }
        }

        if (onUpdateOrder) {
          onUpdateOrder(order.id, {
            providerStatus: res.status,
            status: appStatus,
            progressCount: progress,
          });
        }

        setOrderAlertMsg({
          id: order.id,
          type: 'success',
          msg: `SMM Status: ${res.status} | Remains: ${res.remains ?? 'N/A'}`,
        });
      } else {
        setOrderAlertMsg({
          id: order.id,
          type: 'error',
          msg: res.error || 'Failed to fetch status',
        });
      }
    } catch (err: any) {
      setOrderAlertMsg({
        id: order.id,
        type: 'error',
        msg: err.message || 'Status check failed',
      });
    } finally {
      setOrderActionLoading(null);
    }
  };

  // Approving TrxID
  const handleApproveTrx = async (order: Order) => {
    // 1. Always immediately approve the order and mark as processing
    onUpdateOrderStatus(order.id, 'processing', Math.max(10, Math.round(order.quantity * 0.15)));

    setOrderAlertMsg({
      id: order.id,
      type: 'success',
      msg: language === 'bn'
        ? '✓ পেমেন্ট অনুমোদিত হয়েছে! ডেলিভারি Processing শুরু হয়েছে।'
        : '✓ Payment Approved! Status set to Processing.',
    });

    // 2. If SMM provider is configured, attempt sending to provider
    if (smmConfig.enabled && smmConfig.autoForwardOnApprove && smmConfig.apiKey) {
      await handleSendToSmmProvider(order);
    }
  };

  const handleSaveRate = (serviceId: string, newRate: number) => {
    setServiceRates((prev) => ({ ...prev, [serviceId]: newRate }));
    const s = SERVICES.find((item) => item.id === serviceId);
    if (s) s.ratePer1k = newRate;
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <section className="py-10 bg-slate-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="text-xl font-bold text-white">
                {language === 'bn' ? 'এডমিন কন্ট্রোল প্যানেল' : 'Admin Operations Console'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'bn'
                ? 'বিকাশ ও নগদ পেমেন্ট TrxID অনুমোদন করুন, স্বয়ংক্রিয়ভাবে SMM প্রোভাইডারে ফলোয়ার পাঠান।'
                : 'Approve bKash/Nagad transactions and automate real Facebook follower delivery via SMM API.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              {language === 'bn' ? '← ওয়েবসাইটে ফিরুন' : '← Exit Admin'}
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {language === 'bn' ? `অর্ডার লিস্ট (${orders.length})` : `Orders (${orders.length})`}
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'gateways'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {language === 'bn' ? 'বিকাশ ও নগদ নম্বর' : 'bKash/Nagad Numbers'}
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'rates'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {language === 'bn' ? 'মূল্য তালিকা (Rates)' : 'Pricing Rates'}
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'automation'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অটোমেশন ও SMM API সেটিংস' : 'Auto-Delivery & SMM API'}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{language === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষণ হয়েছে!' : 'Settings updated successfully!'}</span>
          </div>
        )}

        {/* TAB 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Order ID</th>
                      <th className="py-3.5 px-4 font-semibold">Customer / Method</th>
                      <th className="py-3.5 px-4 font-semibold">Service & Link</th>
                      <th className="py-3.5 px-4 font-semibold">Qty & Paid</th>
                      <th className="py-3.5 px-4 font-semibold">SMM Provider ID</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map((o) => {
                      const cleanPhone = o.senderPhone.replace(/[^0-9]/g, '');
                      const whatsappCustomerMsg = encodeURIComponent(
                        language === 'bn'
                          ? `আসসালামু আলাইকুম! BoostBangla থেকে আপনার অর্ডার #${o.id} (TrxID: ${o.trxId}) সংক্রান্ত মেসেজ। ডেলিভারি প্রসেসিং চলছে।`
                          : `Hello! Update from BoostBangla regarding order #${o.id} (TrxID: ${o.trxId}).`
                      );
                      const whatsappLink = `https://wa.me/880${cleanPhone.slice(-10)}?text=${whatsappCustomerMsg}`;
                      const alertItem = orderAlertMsg && orderAlertMsg.id === o.id ? orderAlertMsg : null;
                      const isLoadingThis = orderActionLoading === o.id;

                      return (
                        <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                          
                          {/* Order ID */}
                          <td className="py-4 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                            {o.id}
                            <p className="text-[10px] text-slate-500 font-normal">{o.createdAt}</p>
                          </td>

                          {/* Customer & Payment */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 font-medium text-slate-200">
                              {o.paymentMethod === 'bkash' && <BkashIcon className="w-4 h-4 rounded" />}
                              {o.paymentMethod === 'nagad' && <NagadIcon className="w-4 h-4 rounded" />}
                              {o.paymentMethod === 'rocket' && <RocketIcon className="w-4 h-4 rounded" />}
                              <span className="capitalize">{o.paymentMethod}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-400">{o.senderPhone}</span>
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Customer"
                                className="text-emerald-400 hover:text-emerald-300"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            </div>
                            <p className="text-[11px] font-mono text-emerald-400 uppercase">Trx: {o.trxId}</p>
                          </td>

                          {/* Service & Link */}
                          <td className="py-4 px-4 max-w-xs">
                            <p className="font-semibold text-white truncate">
                              {language === 'bn' ? o.serviceNameBn : o.serviceNameEn}
                            </p>
                            <a
                              href={o.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline truncate block text-[11px] mt-0.5"
                            >
                              {o.targetUrl}
                            </a>
                            {alertItem && (
                              <p className={`text-[10px] mt-1 font-semibold ${alertItem.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {alertItem.msg}
                              </p>
                            )}
                          </td>

                          {/* Qty & Paid */}
                          <td className="py-4 px-4 tabular-nums whitespace-nowrap">
                            <p className="font-bold text-white">{o.quantity.toLocaleString()} pcs</p>
                            <p className="text-emerald-400 font-semibold">৳{o.totalPrice} BDT</p>
                          </td>

                          {/* SMM Provider ID */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {o.providerOrderId ? (
                              <div className="space-y-0.5">
                                <span className="font-mono text-emerald-400 font-bold block">
                                  #{o.providerOrderId}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {o.providerStatus || 'Active'}
                                </span>
                                <button
                                  onClick={() => handleSyncSmmStatus(o)}
                                  disabled={isLoadingThis}
                                  className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <RefreshCw className={`w-2.5 h-2.5 ${isLoadingThis ? 'animate-spin' : ''}`} />
                                  <span>Sync Status</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleSendToSmmProvider(o)}
                                disabled={isLoadingThis}
                                className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                              >
                                {isLoadingThis ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                <span>Send to SMM</span>
                              </button>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                                o.status === 'completed'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : o.status === 'processing'
                                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                                  : o.status === 'verifying'
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {o.status === 'verifying' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApproveTrx(o)}
                                  disabled={isLoadingThis}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                                  title="Approve TrxID and start delivery"
                                >
                                  {isLoadingThis && <RefreshCw className="w-3 h-3 animate-spin" />}
                                  <span>Approve TrxID</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateOrderStatus(o.id, 'completed', o.quantity);
                                    setOrderAlertMsg({
                                      id: o.id,
                                      type: 'success',
                                      msg: '✓ সরাসরি সম্পন্ন (Completed) মার্ক করা হয়েছে!',
                                    });
                                  }}
                                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                  title="Direct Mark as Completed"
                                >
                                  Complete ✓
                                </button>
                              </div>
                            )}

                            {o.status === 'processing' && (
                              <>
                                <button
                                  onClick={() => {
                                    const nextCount = Math.min(o.quantity, (o.progressCount || 0) + Math.round(o.quantity * 0.35));
                                    onUpdateOrderStatus(o.id, nextCount >= o.quantity ? 'completed' : 'processing', nextCount);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  +Step
                                </button>
                                <button
                                  onClick={() => onUpdateOrderStatus(o.id, 'completed', o.quantity)}
                                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Complete
                                </button>
                              </>
                            )}

                            {o.status === 'completed' && (
                              <span className="text-emerald-400 text-[11px] font-semibold">Done ✓</span>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Payment Gateways Config */}
        {activeTab === 'gateways' && (
          <form onSubmit={handleSaveGateways} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6 max-w-2xl">
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'বিকাশ ও নগদ পেমেন্ট নম্বর সেটিংস' : 'bKash & Nagad Account Numbers'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'এখানে আপনার নিজের বিকাশ ও নগদ নম্বরটি বসিয়ে সেভ করুন। কাস্টমার সরাসরি এই নম্বরে সেন্ড মানি করে TrxID পাঠাবে।'
                : 'Enter your own personal or merchant bKash/Nagad number to receive real customer payments.'}
            </p>

            {/* bKash */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <BkashIcon className="w-5 h-5 rounded" />
                <span>bKash Account Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400">bKash Number</label>
                  <input
                    type="text"
                    value={tempConfig.bkashNumber}
                    onChange={(e) => setTempConfig({ ...tempConfig, bkashNumber: e.target.value })}
                    className="w-full mt-1 rounded-xl bg-slate-900 px-3 py-2 text-xs text-white border border-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Type / Method</label>
                  <input
                    type="text"
                    value={tempConfig.bkashType}
                    onChange={(e) => setTempConfig({ ...tempConfig, bkashType: e.target.value })}
                    className="w-full mt-1 rounded-xl bg-slate-900 px-3 py-2 text-xs text-white border border-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Nagad */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <NagadIcon className="w-5 h-5 rounded" />
                <span>Nagad Account Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400">Nagad Number</label>
                  <input
                    type="text"
                    value={tempConfig.nagadNumber}
                    onChange={(e) => setTempConfig({ ...tempConfig, nagadNumber: e.target.value })}
                    className="w-full mt-1 rounded-xl bg-slate-900 px-3 py-2 text-xs text-white border border-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Type / Method</label>
                  <input
                    type="text"
                    value={tempConfig.nagadType}
                    onChange={(e) => setTempConfig({ ...tempConfig, nagadType: e.target.value })}
                    className="w-full mt-1 rounded-xl bg-slate-900 px-3 py-2 text-xs text-white border border-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <label className="text-sm font-bold text-white block">Official Support WhatsApp</label>
              <input
                type="text"
                value={tempConfig.supportWhatsApp}
                onChange={(e) => setTempConfig({ ...tempConfig, supportWhatsApp: e.target.value })}
                className="w-full rounded-xl bg-slate-900 px-3 py-2 text-xs text-white border border-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Save Payment Configuration
            </button>
          </form>
        )}

        {/* TAB 3: Service Pricing Rates */}
        {activeTab === 'rates' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 max-w-3xl">
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'প্রতি ১,০০০ ইউনিটের মূল্য নির্ধারণ (BDT)' : 'Service Rate Configuration (BDT / 1,000)'}
            </h3>
            
            <div className="space-y-3">
              {SERVICES.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {language === 'bn' ? s.nameBn : s.nameEn}
                    </h4>
                    <p className="text-[11px] text-slate-400">Min: {s.minQuantity} | Max: {s.maxQuantity}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">৳</span>
                    <input
                      type="number"
                      value={serviceRates[s.id] ?? s.ratePer1k}
                      onChange={(e) => handleSaveRate(s.id, Number(e.target.value) || 0)}
                      className="w-24 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white border border-slate-800 font-bold tabular-nums"
                    />
                    <span className="text-[11px] text-slate-400">/ 1k</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Automation & Real Life Delivery Guide */}
        {activeTab === 'automation' && (
          <div className="space-y-6 max-w-4xl">
            
            {/* Guide Explainer Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 to-slate-900 border border-blue-900/60 space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Globe className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  {language === 'bn' ? 'বাস্তবে কিভাবে অটোমেটিক ফলোয়ার যাবে?' : 'How Does Auto-Delivery Work?'}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white block">১. বিকাশ/নগদে টাকা গ্রহণ</span>
                  <p className="text-slate-400 leading-relaxed">
                    কাস্টমার বিকাশ বা নগদে টাকা পাঠালে আপনার ফোনে মেসেজ আসবে এবং টাকা আপনার একাউন্টে ঢুকবে।
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white block">২. TrxID চেক ও অনুমোদন</span>
                  <p className="text-slate-400 leading-relaxed">
                    এডমিন প্যানেলে এসে "Approve TrxID" চাপবেন। আপনি চাইলে কাস্টমারকে WhatsApp-এ কথা বলতে পারবেন।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white block">৩. স্বয়ংক্রিয় SMM ডেলিভারি</span>
                  <p className="text-slate-400 leading-relaxed">
                    অনুমোদন হওয়ার সাথে সাথে নিচের SMM API দিয়ে প্রোভাইডারের সার্ভারে অর্ডার চলে যাবে এবং ফেসবুক আইডিতে ফলোয়ার যোগ হবে!
                  </p>
                </div>
              </div>
            </div>

            {/* SMM API Integration Setup Form */}
            <form onSubmit={handleSaveSmmConfig} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'bn' ? 'হোলসেল SMM Provider API সংযোগ' : 'Wholesale SMM Provider API Configuration'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'bn'
                      ? 'যেকোনো স্ট্যান্ডার্ড v2 SMM প্যানেলের (যেমন JAP, Peakerr, Secsers) সাথে সংযুক্ত করুন।'
                      : 'Connect any standard v2 SMM panel API for 100% automated fulfillment.'}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <span className="text-slate-300">
                      {smmConfig.autoForwardOnApprove
                        ? (language === 'bn' ? 'অটো-সেন্ড সক্রিয়' : 'Auto-Forward On')
                        : (language === 'bn' ? 'অটো-সেন্ড বন্ধ' : 'Auto-Forward Off')}
                    </span>
                    <input
                      type="checkbox"
                      checked={smmConfig.autoForwardOnApprove}
                      onChange={(e) => setSmmConfig({ ...smmConfig, autoForwardOnApprove: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  {language === 'bn' ? 'প্রোভাইডার সিলেক্ট করুন:' : 'Choose Provider:'}
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSmmConfig({
                      ...smmConfig,
                      apiUrl: 'https://my.smmsun.com/api/v2',
                      apiKey: '075b6a4221a28fb68e3c5803b649b074',
                      providerName: 'SMMSUN'
                    })}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/30 border border-emerald-500/60 text-emerald-300 font-bold hover:bg-emerald-600/50 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>★ SMMSUN (আপনার প্যানেল - যুক্ত করা হয়েছে)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmmConfig({ ...smmConfig, apiUrl: 'https://justanotherpanel.com/api/v2', providerName: 'JustAnotherPanel' })}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
                  >
                    JustAnotherPanel (JAP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmmConfig({ ...smmConfig, apiUrl: 'https://peakerr.com/api/v2', providerName: 'Peakerr' })}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
                  >
                    Peakerr
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">API Endpoint URL</label>
                  <input
                    type="url"
                    value={smmConfig.apiUrl}
                    onChange={(e) => setSmmConfig({ ...smmConfig, apiUrl: e.target.value })}
                    placeholder="https://justanotherpanel.com/api/v2"
                    className="w-full mt-1 rounded-xl bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">Provider API Key</label>
                  <input
                    type="text"
                    value={smmConfig.apiKey}
                    onChange={(e) => setSmmConfig({ ...smmConfig, apiKey: e.target.value })}
                    placeholder="এখানে আপনার প্যানেলের API Key পেস্ট করুন"
                    className="w-full mt-1 rounded-xl bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {apiTestResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  apiTestResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  {apiTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{apiTestResult.msg}</span>
                </div>
              )}

              {/* Service ID Mapping */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-white">
                    {language === 'bn' ? 'সার্ভিস আইডি ম্যাপিং (Provider Service IDs)' : 'Provider Service ID Mapping'}
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    {language === 'bn'
                      ? 'আপনার SMM প্যানেলে প্রতিটি সার্ভিসের একটি নম্বর/আইডি থাকে (যেমন: Facebook Page Followers = 1042)। সেটি এখানে লিখুন।'
                      : 'Match your website services to your SMM provider service IDs.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {SERVICES.map((s) => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-slate-300 truncate max-w-[180px]">
                        {language === 'bn' ? s.nameBn : s.nameEn}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-slate-500 font-mono text-[11px]">ID:</span>
                        <input
                          type="text"
                          value={smmConfig.serviceMappings[s.id] || ''}
                          onChange={(e) => {
                            setSmmConfig({
                              ...smmConfig,
                              serviceMappings: {
                                ...smmConfig.serviceMappings,
                                [s.id]: e.target.value,
                              },
                            });
                          }}
                          placeholder="e.g. 1042"
                          className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white font-mono text-center text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Save API Settings
                </button>

                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={apiTesting}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {apiTesting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Test API Connection & Balance</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </section>
  );
};
