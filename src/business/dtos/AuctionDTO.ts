import { AuctionStatus } from '../enums/AppEnums';

export interface CreateAuctionDTO {
  title: string;
  description: string;
  category: string;
  startingBid: number;
  reservePrice?: number;
  buyNowPrice?: number;
  startDate: string;
  endDate: string;
  images: string[];
  condition: string;
  location: string;
  shippingOptions: ShippingOptionDTO[];
  tags: string[];
}

export interface UpdateAuctionDTO {
  title?: string;
  description?: string;
  category?: string;
  reservePrice?: number;
  buyNowPrice?: number;
  endDate?: string;
  images?: string[];
  condition?: string;
  shippingOptions?: ShippingOptionDTO[];
  tags?: string[];
}

export interface AuctionDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    totalSales: number;
  };
  startingBid: number;
  currentBid: number;
  reservePrice?: number;
  buyNowPrice?: number;
  bidCount: number;
  startDate: string;
  endDate: string;
  status: AuctionStatus;
  images: string[];
  condition: string;
  location: string;
  shippingOptions: ShippingOptionDTO[];
  tags: string[];
  watchers: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  isWatched: boolean;
  canBid: boolean;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface ShippingOptionDTO {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  description?: string;
}

export interface AuctionFilterDTO {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  endingSoon?: boolean;
  hasReserve?: boolean;
  hasBuyNow?: boolean;
  sortBy?: 'endDate' | 'currentBid' | 'startingBid' | 'createdAt' | 'views';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
}

export interface AuctionListResponseDTO {
  auctions: AuctionDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}