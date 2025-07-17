import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  isNetworkError: boolean;
  isCorsError: boolean;
  isAuthError: boolean;
}

export const parseError = (error: unknown): AppError => {
  // Default error structure
  const appError: AppError = {
    message: 'An unexpected error occurred',
    isNetworkError: false,
    isCorsError: false,
    isAuthError: false,
  };

  if (error instanceof Error) {
    appError.message = error.message;
  }

  // Handle Axios errors
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // Server responded with error status
      appError.status = axiosError.response.status;
      appError.message = (axiosError.response.data as any)?.message || 
                        axiosError.response.statusText || 
                        `Server error (${axiosError.response.status})`;
      
      // Check for authentication errors
      if (axiosError.response.status === 401) {
        appError.isAuthError = true;
        appError.message = 'Authentication required. Please log in.';
      } else if (axiosError.response.status === 403) {
        appError.isAuthError = true;
        appError.message = 'Access denied. Insufficient permissions.';
      }
    } else if (axiosError.request) {
      // Request was made but no response received
      appError.isNetworkError = true;
      
      // Check for CORS errors
      if (axiosError.message.includes('CORS') || 
          axiosError.message.includes('Access-Control-Allow-Origin')) {
        appError.isCorsError = true;
        appError.message = 'CORS error: Server configuration issue. Please check your backend CORS settings.';
      } else {
        appError.message = 'Network error: Unable to connect to server. Please check your internet connection.';
      }
    } else {
      // Something else happened
      appError.message = `Request error: ${axiosError.message}`;
    }
  }

  return appError;
};

export const getErrorMessage = (error: unknown): string => {
  const parsedError = parseError(error);
  return parsedError.message;
};

export const isNetworkError = (error: unknown): boolean => {
  const parsedError = parseError(error);
  return parsedError.isNetworkError;
};

export const isCorsError = (error: unknown): boolean => {
  const parsedError = parseError(error);
  return parsedError.isCorsError;
};

export const isAuthError = (error: unknown): boolean => {
  const parsedError = parseError(error);
  return parsedError.isAuthError;
};

// Development helper to suggest solutions
export const getErrorSuggestion = (error: unknown): string => {
  const parsedError = parseError(error);
  
  if (parsedError.isCorsError) {
    return 'Solution: Configure CORS on your backend server to allow requests from your frontend domain.';
  }
  
  if (parsedError.isAuthError) {
    return 'Solution: Check your authentication credentials or refresh your login session.';
  }
  
  if (parsedError.isNetworkError) {
    return 'Solution: Verify your backend server is running and accessible at the configured URL.';
  }
  
  if (parsedError.status === 404) {
    return 'Solution: Check if the API endpoint exists and the URL is correct.';
  }
  
  if (parsedError.status === 500) {
    return 'Solution: Check your backend server logs for internal errors.';
  }
  
  return 'Solution: Check the error details and your network connection.';
};