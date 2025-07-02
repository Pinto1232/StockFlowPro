// Legacy User interface for AsyncStorage documents (deprecated - use core/entities/User instead)
export interface LegacyUser {
  _id?: string; // Optional string ID for AsyncStorage compatibility
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  profile?: UserProfile;
}

// User profile interface
export interface UserProfile {
  avatar?: string;
  bio?: string;
  preferences?: Record<string, any>;
}

// User creation interface (without database-specific fields)
export interface CreateUserInput {
  name: string;
  email: string;
  profile?: UserProfile;
}

// User update interface
export interface UpdateUserInput {
  name?: string;
  email?: string;
  isActive?: boolean;
  profile?: UserProfile;
}

// User query filters
export interface UserFilters {
  name?: string;
  email?: string;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

// User service response types
export interface UserServiceResponse<T = LegacyUser> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UsersListResponse {
  success: boolean;
  data?: LegacyUser[];
  error?: string;
  total?: number;
}