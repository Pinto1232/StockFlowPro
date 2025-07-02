export const API_PATHS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
    PREFERENCES: '/users/preferences',
    STATS: '/users/stats',
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Auctions
  AUCTIONS: {
    LIST: '/auctions',
    CREATE: '/auctions',
    BY_ID: (id: string) => `/auctions/${id}`,
    UPDATE: (id: string) => `/auctions/${id}`,
    DELETE: (id: string) => `/auctions/${id}`,
    SEARCH: '/auctions/search',
    CATEGORIES: '/auctions/categories',
    FEATURED: '/auctions/featured',
    ENDING_SOON: '/auctions/ending-soon',
    BY_USER: (userId: string) => `/auctions/user/${userId}`,
    WATCH: (id: string) => `/auctions/${id}/watch`,
    UNWATCH: (id: string) => `/auctions/${id}/unwatch`,
    IMAGES: (id: string) => `/auctions/${id}/images`,
  },

  // Bidding
  BIDS: {
    LIST: '/bids',
    CREATE: '/bids',
    BY_ID: (id: string) => `/bids/${id}`,
    BY_AUCTION: (auctionId: string) => `/bids/auction/${auctionId}`,
    BY_USER: (userId: string) => `/bids/user/${userId}`,
    HISTORY: (auctionId: string) => `/bids/auction/${auctionId}/history`,
    AUTO_BID: '/bids/auto-bid',
    CANCEL: (id: string) => `/bids/${id}/cancel`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
    CLEAR_ALL: '/notifications/clear',
    SETTINGS: '/notifications/settings',
  },

  // Wishlist
  WISHLIST: {
    LIST: '/wishlist',
    ADD: '/wishlist',
    REMOVE: (auctionId: string) => `/wishlist/${auctionId}`,
    CLEAR: '/wishlist/clear',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
    AUCTIONS: (id: string) => `/categories/${id}/auctions`,
  },

  // Search
  SEARCH: {
    AUCTIONS: '/search/auctions',
    USERS: '/search/users',
    SUGGESTIONS: '/search/suggestions',
    RECENT: '/search/recent',
  },

  // Payments
  PAYMENTS: {
    METHODS: '/payments/methods',
    ADD_METHOD: '/payments/methods',
    DELETE_METHOD: (id: string) => `/payments/methods/${id}`,
    PROCESS: '/payments/process',
    HISTORY: '/payments/history',
  },

  // Reports
  REPORTS: {
    AUCTION: (id: string) => `/reports/auction/${id}`,
    USER: (id: string) => `/reports/user/${id}`,
    ISSUE: '/reports/issue',
  },

  // Admin (if applicable)
  ADMIN: {
    USERS: '/admin/users',
    AUCTIONS: '/admin/auctions',
    REPORTS: '/admin/reports',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },
} as const;