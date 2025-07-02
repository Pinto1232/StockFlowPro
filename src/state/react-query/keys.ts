// Query Keys Factory
export const queryKeys = {
  // User queries
  users: ['users'] as const,
  user: (id: string) => [...queryKeys.users, id] as const,
  userProfile: (id: string) => [...queryKeys.user(id), 'profile'] as const,

  // Auction queries
  auctions: ['auctions'] as const,
  auction: (id: string) => [...queryKeys.auctions, id] as const,
  auctionBids: (id: string) => [...queryKeys.auction(id), 'bids'] as const,
  auctionsByCategory: (category: string) => [...queryKeys.auctions, 'category', category] as const,
  auctionsByUser: (userId: string) => [...queryKeys.auctions, 'user', userId] as const,

  // Bidding queries
  bids: ['bids'] as const,
  bid: (id: string) => [...queryKeys.bids, id] as const,
  userBids: (userId: string) => [...queryKeys.bids, 'user', userId] as const,

  // Notifications queries
  notifications: ['notifications'] as const,
  userNotifications: (userId: string) => [...queryKeys.notifications, 'user', userId] as const,

  // Wishlist queries
  wishlist: ['wishlist'] as const,
  userWishlist: (userId: string) => [...queryKeys.wishlist, 'user', userId] as const,

  // Categories queries
  categories: ['categories'] as const,

  // Search queries
  search: (query: string, filters?: Record<string, any>) => 
    ['search', query, filters] as const,
} as const;