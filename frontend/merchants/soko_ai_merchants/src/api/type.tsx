


// src/api/types.ts

export type VerificationStatus = 'verified' | 'pending_review' | 'suspended';
export type PayoutMethod = 'M-Pesa' | 'Bank Transfer' | 'Card Settlement';
export type FulfillmentStatus = 
  | 'AWAITING_ALLOCATION' 
  | 'PREPARING' 
  | 'READY_FOR_PICKUP' 
  | 'DISPATCHED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'DISPUTED' 
  | 'REFUNDED';

export type ActivityLogCategory = 
  | 'auth' 
  | 'profile' 
  | 'branch' 
  | 'catalog' 
  | 'order' 
  | 'payout' 
  | 'system';

export type LogSeverity = 'info' | 'warning' | 'critical';

export interface MerchantProfile {
  unique_id: string;
  shopName: string;
  shopDescription?: string;
  accountEmail: string;
  shop_logo_url?: string;
  shop_banner_url?: string;
  is_accepting_orders: boolean;
  tax_pin?: string;
  business_registration_number?: string;
  support_phone?: string;
  commissionCutPercent: number;
  totalActiveListings: number;
  verificationStatus: VerificationStatus;
  payoutMethod: PayoutMethod;
  created_at: string;
  updated_at: string;
}

export interface StoreBranch {
  id?: number;
  unique_id: string;
  branch_name: string;
  phone?: string;
  email?: string;
  county: string;
  city_town: string;
  physical_address: string;
  is_primary: boolean;
  latitude?: number;
  longitude?: number;
  operating_hours?: string;
  is_active: boolean;
}

export interface ProductCatalogItem {
  unique_id: string;
  title: string;
  sku?: string;
  description?: string;
  category: string;
  brand?: string;
  slug?: string;
  search_tags?: string;
  original_price: number;
  deal_price: number;
  discount_percentage: number;
  weight_kg?: number;
  is_physical: boolean;
  is_tax_exempt: boolean;
  primary_image_url: string;
  secondary_images: string[];
  is_available: boolean;
  click_count: number;
}

export interface InventoryStock {
  id: number;
  product: ProductCatalogItem;
  branch: StoreBranch;
  quantity_in_stock: number;
  reserved_quantity: number;
  available_to_sell: number;
  last_updated: string;
}

export interface MerchantActivityLog {
  unique_id: string;
  category: ActivityLogCategory;
  severity: LogSeverity;
  action_event: string;
  description: string;
  ip_address?: string;
  location_snapshot?: string;
  linked_order_uuid?: string;
  linked_product_uuid?: string;
  created_at: string;
}