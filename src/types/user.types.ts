
export interface LegacyUser {
  _id?: string; 
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  preferences?: Record<string, any>;
}

export interface CreateUserInput {
  name: string;
  email: string;
  profile?: UserProfile;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  isActive?: boolean;
  profile?: UserProfile;
}

export interface UserFilters {
  name?: string;
  email?: string;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

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