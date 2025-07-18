
export const queryKeys = {
  
  users: ['users'] as const,
  user: (id: string) => [...queryKeys.users, id] as const,
  userProfile: (id: string) => [...queryKeys.user(id), 'profile'] as const,

  auctions: ['auctions'] as const,
  auction: (id: string) => [...queryKeys.auctions, id] as const,
  auctionBids: (id: string) => [...queryKeys.auction(id), 'bids'] as const,
  auctionsByCategory: (category: string) => [...queryKeys.auctions, 'category', category] as const,
  auctionsByUser: (userId: string) => [...queryKeys.auctions, 'user', userId] as const,

  bids: ['bids'] as const,
  bid: (id: string) => [...queryKeys.bids, id] as const,
  userBids: (userId: string) => [...queryKeys.bids, 'user', userId] as const,

  notifications: ['notifications'] as const,
  userNotifications: (userId: string) => [...queryKeys.notifications, 'user', userId] as const,

  wishlist: ['wishlist'] as const,
  userWishlist: (userId: string) => [...queryKeys.wishlist, 'user', userId] as const,

  categories: ['categories'] as const,

  search: (query: string, filters?: Record<string, any>) => 
    ['search', query, filters] as const,
} as const;