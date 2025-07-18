

export interface SecureStorageService {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  API_KEY: 'api_key',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LAST_LOGIN: 'last_login',
} as const;

class MockSecureStorage implements SecureStorageService {
  private storage: Map<string, string> = new Map();

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`[SecureStorage] Stored item with key: ${key}`);
    }
  }

  async getItem(key: string): Promise<string | null> {
    const value = this.storage.get(key) || null;
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`[SecureStorage] Retrieved item with key: ${key}, exists: ${value !== null}`);
    }
    return value;
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`[SecureStorage] Removed item with key: ${key}`);
    }
  }

  async clear(): Promise<void> {
    this.storage.clear();
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[SecureStorage] Cleared all items');
    }
  }
}

// TODO: Replace with actual secure storage implementation

export const secureStorage: SecureStorageService = new MockSecureStorage();

export const storeAuthTokens = async (
  accessToken: string,
  refreshToken?: string
): Promise<void> => {
  await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

export const getAuthTokens = async (): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> => {
  const [accessToken, refreshToken] = await Promise.all([
    secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  ]);

  return { accessToken, refreshToken };
};

export const clearAuthTokens = async (): Promise<void> => {
  await Promise.all([
    secureStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
    secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
  ]);
};

export const storeUserId = async (userId: string): Promise<void> => {
  await secureStorage.setItem(STORAGE_KEYS.USER_ID, userId);
};

export const getUserId = async (): Promise<string | null> => {
  return secureStorage.getItem(STORAGE_KEYS.USER_ID);
};

export const clearUserData = async (): Promise<void> => {
  await Promise.all([
    clearAuthTokens(),
    secureStorage.removeItem(STORAGE_KEYS.USER_ID),
    secureStorage.removeItem(STORAGE_KEYS.LAST_LOGIN),
  ]);
};