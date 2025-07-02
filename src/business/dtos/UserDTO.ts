export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  preferences?: UserPreferencesDTO;
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferencesDTO;
  stats: UserStatsDTO;
}

export interface UserPreferencesDTO {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    bidUpdates: boolean;
    auctionReminders: boolean;
    marketingEmails: boolean;
  };
  privacy: {
    showProfile: boolean;
    showBidHistory: boolean;
    showWishlist: boolean;
  };
  display: {
    currency: string;
    language: string;
    timezone: string;
  };
}

export interface UserStatsDTO {
  totalBids: number;
  wonAuctions: number;
  totalSpent: number;
  averageBid: number;
  favoriteCategories: string[];
  memberSince: string;
  lastActive: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponseDTO {
  user: UserDTO;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterDTO extends CreateUserDTO {
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
  confirmPassword: string;
}