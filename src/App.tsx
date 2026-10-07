/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceOrderForm } from './components/ServiceOrderForm';
import { PaymentModal } from './components/PaymentModal';
import { OrderTracker } from './components/OrderTracker';
import { TrustFeatures } from './components/TrustFeatures';
import { FaqSection } from './components/FaqSection';
import { AdminPanel } from './components/AdminPanel';
import { SupportModal } from './components/SupportModal';
import { Footer } from './components/Footer';
import { Order, PaymentConfig, ServiceItem } from './types';
import { SERVICES, INITIAL_SAMPLE_ORDERS, DEFAULT_PAYMENT_CONFIG } from './data/services';
import { MessageSquare, ArrowUp } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeView, setActiveView] = useState<'home' | 'track' | 'admin'>('home');

  // Stored state with local persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('boostbangla_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return INITIAL_SAMPLE_ORDERS;
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    try {
      const saved = localStorage.getItem('boostbangla_payment_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return DEFAULT_PAYMENT_CONFIG;
  });

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<{
    service: ServiceItem;
    quantity: number;
    totalPrice: number;
    targetUrl: string;
    customerNote?: string;
  } | null>(null);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('boostbangla_orders', JSON.stringify(orders));
    } catch (e) {
      // Ignore
    }
  }, [orders]);

  // Sync payment config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('boostbangla_payment_config', JSON.stringify(paymentConfig));
    } catch (e) {
      // Ignore
    }
  }, [paymentConfig]);

  // Real-world simulated delivery progression: every 18 seconds, active processing orders gain a safe increment
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.status === 'processing') {
            const increment = Math.max(5, Math.floor(order.quantity * 0.04));
            const newProgress = Math.min(order.quantity, (order.progressCount || 0) + increment);
            const isFinished = newProgress >= order.quantity;
            return {
              ...order,
              progressCount: newProgress,
              status: isFinished ? 'completed' : 'processing',
            };
          }
          return order;
        })
      );
    }, 18000);

    return () => clearInterval(timer);
  }, []);

  const handleProceedToPayment = (
    service: ServiceItem,
    quantity: number,
    url: string,
    customerNote?: string
  ) => {
    // Calculate total price with discounts
    let subtotal = (quantity / 1000) * service.ratePer1k;
    let discountPercent = 0;
    if (quantity >= 5000) discountPercent = 10;
    else if (quantity >= 2000) discountPercent = 5;
    const finalTotal = Math.round(subtotal - (subtotal * discountPercent) / 100);

    setPendingOrderDetails({
      service,
      quantity,
      totalPrice: finalTotal,
      targetUrl: url,
      customerNote,
    });
    setIsPaymentModalOpen(true);
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: Order['status'],
    newProgress?: number
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            progressCount: newProgress !== undefined ? newProgress : o.progressCount,
          };
        }
        return o;
      })
    );
  };

  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
  };

  const scrollToCalculator = () => {
    setActiveView('home');
    setTimeout(() => {
      const el = document.getElementById('pricing-calculator');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenOrder={scrollToCalculator}
      />

      {/* Main View Switching */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <Hero
              language={language}
              onGetStarted={scrollToCalculator}
              onTrackOrder={() => setActiveView('track')}
            />

            <ServiceOrderForm
              language={language}
              onProceedToPayment={handleProceedToPayment}
            />

            <TrustFeatures language={language} />

            <FaqSection
              language={language}
              onContactSupport={() => setIsSupportModalOpen(true)}
            />
          </>
        )}

        {activeView === 'track' && (
          <OrderTracker
            language={language}
            orders={orders}
          />
        )}

        {activeView === 'admin' && (
          <AdminPanel
            language={language}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateOrder={handleUpdateOrder}
            paymentConfig={paymentConfig}
            onUpdatePaymentConfig={setPaymentConfig}
            onBackToHome={() => setActiveView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={(id) => {
          setActiveView('home');
          setTimeout(() => {
            const el = document.getElementById(id);
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onOpenTrack={() => setActiveView('track')}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        onOpenAdmin={() => setActiveView('admin')}
      />

      {/* Payment Gateway Modal */}
      {pendingOrderDetails && (
        <PaymentModal
          language={language}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          service={pendingOrderDetails.service}
          quantity={pendingOrderDetails.quantity}
          totalPrice={pendingOrderDetails.totalPrice}
          targetUrl={pendingOrderDetails.targetUrl}
          customerNote={pendingOrderDetails.customerNote}
          paymentConfig={paymentConfig}
          onUpdatePaymentConfig={setPaymentConfig}
          onOrderCreated={handleOrderCreated}
        />
      )}

      {/* WhatsApp / Live Support Modal */}
      <SupportModal
        language={language}
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        config={paymentConfig}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <button
        onClick={() => setIsSupportModalOpen(true)}
        aria-label="WhatsApp Support"
        className="fixed bottom-5 right-5 z-40 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    </div>
  );
}
