export enum AuctionStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
  SOLD = 'sold',
}

export enum BidStatus {
  ACTIVE = 'active',
  OUTBID = 'outbid',
  WINNING = 'winning',
  WON = 'won',
  LOST = 'lost',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum AuctionCategory {
  ELECTRONICS = 'electronics',
  FASHION = 'fashion',
  HOME_GARDEN = 'home_garden',
  SPORTS = 'sports',
  COLLECTIBLES = 'collectibles',
  AUTOMOTIVE = 'automotive',
  ART = 'art',
  JEWELRY = 'jewelry',
  BOOKS = 'books',
  MUSIC = 'music',
  TOYS = 'toys',
  OTHER = 'other',
}

export enum ItemCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  FOR_PARTS = 'for_parts',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum ShippingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortBy {
  PRICE = 'price',
  DATE = 'date',
  POPULARITY = 'popularity',
  ENDING_SOON = 'ending_soon',
  NEWLY_LISTED = 'newly_listed',
  MOST_BIDS = 'most_bids',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
}

export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  IT = 'it',
  PT = 'pt',
  JA = 'ja',
  ZH = 'zh',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}