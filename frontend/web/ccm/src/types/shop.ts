// ==========================================
// Product & Cart Domain
// ==========================================

export interface ProductType {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  brand?: string;
  imageUrl?: string;
  gallery?: string[];
  merchantId?: string;
  kioskName: string;
  distanceMeters?: number;
  discountedPrice?: number;
}

export interface CartItemType {
  productId: string;
  productName: string;
  kioskName: string;
  merchantId: string;
  imageUrl?: string;
  quantity: number;
  addedAt: string; // ISO 8601 UTC timestamp
  unitPriceAtAdding: number;
  discountAtAdding?: number;
  userNote?: string;
}

export interface CartGroupType {
  groupOwnerId?: string;
  groupId: string;
  groupCode: string;
  merchantId: string;
  kioskName: string;
  items: CartItemType[];
  groupSubtotal: number;
  serviceFee?: number;
  deliveryFee?: number;
  groupFinalTotal: number;
}

export interface CartType {
  groups: CartGroupType[];
  totalQuantity: number;
  subtotal: number;
  tax?: number;
  serviceFee?: number;
  deliveryFee?: number;
  finalTotal: number;
}

// ==========================================
// Checkout & Delivery Domain
// ==========================================

export type TransactionStatus = 
  | 'idle' 
  | 'sending' 
  | 'pin_prompted' 
  | 'success' 
  | 'failed';

export interface CustomerDeliveryLocationType {
  country?: string;
  county?: string;
  subCounty: string;
  estateName: string;
  area?: string;
  market?: string;
  appartment?: string;
  locationDescription?: string;
  deliveryInstructions: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  phone2?: string;
}
