// React Hook for API Health Monitoring
import { useState, useEffect, useCallback, useRef } from 'react';
import { healthCheckService, type HealthCheckResult } from '../services/api/HealthCheckService';

export interface ApiHealthState {
  isHealthy: boolean;
  status: 'healthy' | 'unhealthy' | 'degraded' | 'checking' | 'unknown';
  lastCheck: string | null;
  responseTime: number | null;
  endpoint: string | null;
  strategy: string | null;
  error: string | null;
  isLoading: boolean;
}

export interface UseApiHealthOptions {
  // Auto-start health monitoring when hook mounts
  autoStart?: boolean;
  // Interval for periodic health checks (in milliseconds)
  checkInterval?: number;
  // Maximum age of cached health check result (in milliseconds)
  maxCacheAge?: number;
  // Enable detailed logging
  enableLogging?: boolean;
  // Callback when health status changes
  onHealthChange?: (isHealthy: boolean, result: HealthCheckResult) => void;
}

export const useApiHealth = (options: UseApiHealthOptions = {}) => {
  const {
    autoStart = true,
    checkInterval = 60000, // 1 minute
    maxCacheAge = 30000, // 30 seconds
    enableLogging = false,
    onHealthChange
  } = options;

  const [healthState, setHealthState] = useState<ApiHealthState>({
    isHealthy: false,
    status: 'unknown',
    lastCheck: null,
    responseTime: null,
    endpoint: null,
    strategy: null,
    error: null,
    isLoading: false
  });

  const onHealthChangeRef = useRef(onHealthChange);
  const isMonitoringRef = useRef(false);

  // Update ref when callback changes
  useEffect(() => {
    onHealthChangeRef.current = onHealthChange;
  }, [onHealthChange]);

  // Health check listener
  const handleHealthCheckResult = useCallback((result: HealthCheckResult) => {
    if (enableLogging) {
      // eslint-disable-next-line no-console
      console.log('[useApiHealth] Health check result:', result);
    }

    const newState: ApiHealthState = {
      isHealthy: result.isHealthy,
      status: result.status,
      lastCheck: result.timestamp,
      responseTime: result.responseTime,
      endpoint: result.endpoint,
      strategy: result.strategy,
      error: result.details?.error || null,
      isLoading: false
    };

    setHealthState(prevState => {
      // Only update if there's a meaningful change
      if (
        prevState.isHealthy !== newState.isHealthy ||
        prevState.status !== newState.status ||
        prevState.endpoint !== newState.endpoint
      ) {
        // Call the health change callback
        if (onHealthChangeRef.current) {
          try {
            onHealthChangeRef.current(result.isHealthy, result);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[useApiHealth] Error in onHealthChange callback:', error);
          }
        }
      }

      return newState;
    });
  }, [enableLogging]);

  // Manual health check
  const checkHealth = useCallback(async (force: boolean = false): Promise<HealthCheckResult> => {
    setHealthState(prev => ({ ...prev, isLoading: true, status: 'checking' }));

    try {
      const result = force 
        ? await healthCheckService.checkHealth()
        : await healthCheckService.quickHealthCheck(maxCacheAge);

      handleHealthCheckResult(result);
      return result;
    } catch (error: any) {
      if (enableLogging) {
        // eslint-disable-next-line no-console
        console.error('[useApiHealth] Health check failed:', error);
      }

      const errorResult: HealthCheckResult = {
        isHealthy: false,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime: 0,
        endpoint: 'unknown',
        strategy: 'error',
        details: {
          error: error.message || 'Health check failed'
        }
      };

      handleHealthCheckResult(errorResult);
      return errorResult;
    }
  }, [maxCacheAge, enableLogging, handleHealthCheckResult]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoringRef.current) {
      return; // Already monitoring
    }

    if (enableLogging) {
      // eslint-disable-next-line no-console
      console.log('[useApiHealth] Starting health monitoring');
    }

    isMonitoringRef.current = true;

    // Add listener for health check results
    healthCheckService.addHealthCheckListener(handleHealthCheckResult);

    // Start periodic health checks
    healthCheckService.startPeriodicHealthCheck(checkInterval);

    // Perform initial health check
    checkHealth(false);
  }, [checkInterval, enableLogging, handleHealthCheckResult, checkHealth]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (!isMonitoringRef.current) {
      return; // Not monitoring
    }

    if (enableLogging) {
      // eslint-disable-next-line no-console
      console.log('[useApiHealth] Stopping health monitoring');
    }

    isMonitoringRef.current = false;

    // Remove listener
    healthCheckService.removeHealthCheckListener(handleHealthCheckResult);

    // Stop periodic health checks
    healthCheckService.stopPeriodicHealthCheck();
  }, [enableLogging, handleHealthCheckResult]);

  // Get health summary
  const getHealthSummary = useCallback(() => {
    return healthCheckService.getHealthSummary();
  }, []);

  // Check if API is currently healthy
  const isApiHealthy = useCallback(() => {
    return healthCheckService.isApiHealthy();
  }, []);

  // Auto-start monitoring on mount
  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }

    // Cleanup on unmount
    return () => {
      stopMonitoring();
    };
  }, [autoStart, startMonitoring, stopMonitoring]);

  // Load initial state from service
  useEffect(() => {
    const lastResult = healthCheckService.getLastHealthCheck();
    if (lastResult) {
      handleHealthCheckResult(lastResult);
    }
  }, [handleHealthCheckResult]);

  return {
    // Health state
    ...healthState,
    
    // Actions
    checkHealth,
    startMonitoring,
    stopMonitoring,
    
    // Utilities
    getHealthSummary,
    isApiHealthy,
    
    // Status helpers
    isMonitoring: isMonitoringRef.current,
    isOnline: healthState.isHealthy,
    hasError: !!healthState.error,
    
    // Formatted data
    lastCheckFormatted: healthState.lastCheck 
      ? new Date(healthState.lastCheck).toLocaleString()
      : null,
    responseTimeFormatted: healthState.responseTime 
      ? `${healthState.responseTime}ms`
      : null,
  };
};

export default useApiHealth;