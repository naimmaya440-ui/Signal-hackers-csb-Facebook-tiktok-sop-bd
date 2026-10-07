export type ServiceCategory = 
  | 'page_followers'
  | 'profile_followers'
  | 'post_likes'
  | 'post_reactions'
  | 'video_views'
  | 'group_members'
  | 'tiktok_followers'
  | 'tiktok_likes'
  | 'tiktok_views';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  nameBn: string;
  nameEn: string;
  badgeBn: string;
  badgeEn: string;
  descriptionBn: string;
  descriptionEn: string;
  ratePer1k: number; // in BDT
  minQuantity: number;
  maxQuantity: number;
  deliverySpeedBn: string;
  deliverySpeedEn: string;
  refillDays: number;
  qualityBn: string;
  qualityEn: string;
  requiresType: 'page' | 'profile' | 'post' | 'video' | 'group' | 'tiktok_profile' | 'tiktok_video';
}

export interface Order {
  id: string;
  serviceId: string;
  serviceNameBn: string;
  serviceNameEn: string;
  category: ServiceCategory;
  targetUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'wallet';
  senderPhone: string;
  trxId: string;
  status: 'pending_payment' | 'verifying' | 'processing' | 'completed' | 'cancelled';
  progressCount: number;
  startCount: number;
  speed: string;
  createdAt: string;
  estimatedCompletion: string;
  notes?: string;
  providerOrderId?: string;
  providerStatus?: string;
  providerError?: string;
}

export interface SmmApiConfig {
  apiUrl: string;
  apiKey: string;
  enabled: boolean;
  autoForwardOnApprove: boolean;
  providerName: string;
  balanceUsd?: number;
  currency?: string;
  serviceMappings: Record<string, string>;
}

export interface PaymentConfig {
  bkashNumber: string;
  bkashType: string;
  nagadNumber: string;
  nagadType: string;
  rocketNumber: string;
  rocketType: string;
  supportWhatsApp: string;
  supportPhone: string;
}

export interface OrderFilter {
  status?: string;
  search?: string;
}
