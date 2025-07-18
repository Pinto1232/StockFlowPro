
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
  
  autoStart?: boolean;
  
  checkInterval?: number;
  
  maxCacheAge?: number;
  
  enableLogging?: boolean;
  
  onHealthChange?: (isHealthy: boolean, result: HealthCheckResult) => void;
}

export const useApiHealth = (options: UseApiHealthOptions = {}) => {
  const {
    autoStart = true,
    checkInterval = 60000, 
    maxCacheAge = 30000, 
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

  useEffect(() => {
    onHealthChangeRef.current = onHealthChange;
  }, [onHealthChange]);

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

  const startMonitoring = useCallback(() => {
    if (isMonitoringRef.current) {
      return; 
    }

    if (enableLogging) {
      // eslint-disable-next-line no-console
      console.log('[useApiHealth] Starting health monitoring');
    }

    isMonitoringRef.current = true;

    healthCheckService.addHealthCheckListener(handleHealthCheckResult);

    healthCheckService.startPeriodicHealthCheck(checkInterval);

    checkHealth(false);
  }, [checkInterval, enableLogging, handleHealthCheckResult, checkHealth]);

  const stopMonitoring = useCallback(() => {
    if (!isMonitoringRef.current) {
      return; 
    }

    if (enableLogging) {
      // eslint-disable-next-line no-console
      console.log('[useApiHealth] Stopping health monitoring');
    }

    isMonitoringRef.current = false;

    healthCheckService.removeHealthCheckListener(handleHealthCheckResult);

    healthCheckService.stopPeriodicHealthCheck();
  }, [enableLogging, handleHealthCheckResult]);

  const getHealthSummary = useCallback(() => {
    return healthCheckService.getHealthSummary();
  }, []);

  const isApiHealthy = useCallback(() => {
    return healthCheckService.isApiHealthy();
  }, []);

  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [autoStart, startMonitoring, stopMonitoring]);

  useEffect(() => {
    const lastResult = healthCheckService.getLastHealthCheck();
    if (lastResult) {
      handleHealthCheckResult(lastResult);
    }
  }, [handleHealthCheckResult]);

  return {
    
    ...healthState,

    checkHealth,
    startMonitoring,
    stopMonitoring,

    getHealthSummary,
    isApiHealthy,

    isMonitoring: isMonitoringRef.current,
    isOnline: healthState.isHealthy,
    hasError: !!healthState.error,

    lastCheckFormatted: healthState.lastCheck 
      ? new Date(healthState.lastCheck).toLocaleString()
      : null,
    responseTimeFormatted: healthState.responseTime 
      ? `${healthState.responseTime}ms`
      : null,
  };
};

export default useApiHealth;