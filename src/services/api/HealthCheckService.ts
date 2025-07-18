
import { apiClient } from './ApiClient';
import { API_ENDPOINTS, getCurrentEnvironment } from '../config';

export interface HealthCheckResult {
  isHealthy: boolean;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  responseTime: number;
  endpoint: string;
  strategy: string;
  details?: {
    statusCode?: number;
    message?: string;
    error?: string;
  };
}

export interface HealthCheckOptions {
  timeout?: number;
  retryAttempts?: number;
  skipAuth?: boolean;
  includeDetails?: boolean;
}

export class HealthCheckService {
  private static instance: HealthCheckService;
  private lastHealthCheck: HealthCheckResult | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private healthCheckListeners: Array<(result: HealthCheckResult) => void> = [];

  private constructor() {}

  static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  private getHealthCheckStrategies() {
    return [
      {
        name: 'dedicated_health',
        endpoint: API_ENDPOINTS.health.basic,
        description: 'Dedicated health endpoint',
        priority: 1
      },
      {
        name: 'version_endpoint',
        endpoint: API_ENDPOINTS.health.version,
        description: 'Version endpoint',
        priority: 2
      },
      {
        name: 'products_list',
        endpoint: API_ENDPOINTS.products.list,
        description: 'Products list endpoint',
        priority: 3
      },
      {
        name: 'auth_session',
        endpoint: API_ENDPOINTS.auth.session,
        description: 'Auth session endpoint',
        priority: 4
      }
    ];
  }

  private async performHealthCheck(
    strategy: { name: string; endpoint: string; description: string },
    options: HealthCheckOptions = {}
  ): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    const {
      timeout = 5000,
      retryAttempts = 0,
      skipAuth = getCurrentEnvironment() === 'development',
      includeDetails = true
    } = options;

    try {
      // eslint-disable-next-line no-console
      console.log(`[HealthCheck] Attempting strategy: ${strategy.name} (${strategy.endpoint})`);

      const response = await apiClient.get(strategy.endpoint, {
        timeout,
        retryAttempts,
        skipAuth,
        enableLogging: false 
      });

      const responseTime = Date.now() - startTime;

      const result: HealthCheckResult = {
        isHealthy: true,
        status: 'healthy',
        timestamp,
        responseTime,
        endpoint: strategy.endpoint,
        strategy: strategy.name,
        details: includeDetails ? {
          statusCode: response.status,
          message: response.message || `${strategy.description} responded successfully`
        } : undefined
      };

      // eslint-disable-next-line no-console
      console.log(`[HealthCheck] Success with strategy: ${strategy.name} (${responseTime}ms)`);

      return result;

    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      const result: HealthCheckResult = {
        isHealthy: false,
        status: 'unhealthy',
        timestamp,
        responseTime,
        endpoint: strategy.endpoint,
        strategy: strategy.name,
        details: includeDetails ? {
          statusCode: error.status,
          message: error.message,
          error: error.name || 'Unknown error'
        } : undefined
      };

      // eslint-disable-next-line no-console
      console.warn(`[HealthCheck] Failed with strategy: ${strategy.name}`, {
        status: error.status,
        message: error.message,
        responseTime
      });

      return result;
    }
  }

  async checkHealth(options: HealthCheckOptions = {}): Promise<HealthCheckResult> {
    const strategies = this.getHealthCheckStrategies();
    let lastResult: HealthCheckResult | null = null;

    // eslint-disable-next-line no-console
    console.log('[HealthCheck] Starting comprehensive health check...');

    for (const strategy of strategies) {
      const result = await this.performHealthCheck(strategy, options);
      
      if (result.isHealthy) {
        this.lastHealthCheck = result;
        this.notifyListeners(result);
        return result;
      }

      lastResult = result;

      if (result.details?.error === 'AbortError' || 
          result.details?.message?.includes('timeout')) {
        // eslint-disable-next-line no-console
        console.warn('[HealthCheck] Network/timeout error detected, stopping attempts');
        break;
      }
    }

    const finalResult = lastResult || {
      isHealthy: false,
      status: 'unhealthy' as const,
      timestamp: new Date().toISOString(),
      responseTime: 0,
      endpoint: 'unknown',
      strategy: 'none',
      details: {
        message: 'All health check strategies failed'
      }
    };

    this.lastHealthCheck = finalResult;
    this.notifyListeners(finalResult);

    // eslint-disable-next-line no-console
    console.error('[HealthCheck] All strategies failed');

    return finalResult;
  }

  async quickHealthCheck(maxAge: number = 30000): Promise<HealthCheckResult> {
    if (this.lastHealthCheck) {
      const age = Date.now() - new Date(this.lastHealthCheck.timestamp).getTime();
      if (age < maxAge) {
        // eslint-disable-next-line no-console
        console.log('[HealthCheck] Using cached health check result');
        return this.lastHealthCheck;
      }
    }

    return this.checkHealth({ timeout: 3000, retryAttempts: 0 });
  }

  getLastHealthCheck(): HealthCheckResult | null {
    return this.lastHealthCheck;
  }

  startPeriodicHealthCheck(intervalMs: number = 60000): void {
    if (this.healthCheckInterval) {
      this.stopPeriodicHealthCheck();
    }

    // eslint-disable-next-line no-console
    console.log(`[HealthCheck] Starting periodic health checks every ${intervalMs}ms`);

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.quickHealthCheck();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[HealthCheck] Periodic health check failed:', error);
      }
    }, intervalMs);

    this.quickHealthCheck().catch(error => {
      // eslint-disable-next-line no-console
      console.error('[HealthCheck] Initial health check failed:', error);
    });
  }

  stopPeriodicHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      // eslint-disable-next-line no-console
      console.log('[HealthCheck] Stopped periodic health checks');
    }
  }

  addHealthCheckListener(listener: (result: HealthCheckResult) => void): void {
    this.healthCheckListeners.push(listener);
  }

  removeHealthCheckListener(listener: (result: HealthCheckResult) => void): void {
    const index = this.healthCheckListeners.indexOf(listener);
    if (index > -1) {
      this.healthCheckListeners.splice(index, 1);
    }
  }

  private notifyListeners(result: HealthCheckResult): void {
    this.healthCheckListeners.forEach(listener => {
      try {
        listener(result);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[HealthCheck] Error in health check listener:', error);
      }
    });
  }

  isApiHealthy(): boolean {
    return this.lastHealthCheck?.isHealthy ?? false;
  }

  getHealthSummary(): {
    isHealthy: boolean;
    status: string;
    lastCheck: string | null;
    responseTime: number | null;
    endpoint: string | null;
  } {
    const lastCheck = this.lastHealthCheck;
    
    return {
      isHealthy: lastCheck?.isHealthy ?? false,
      status: lastCheck?.status ?? 'unknown',
      lastCheck: lastCheck?.timestamp ?? null,
      responseTime: lastCheck?.responseTime ?? null,
      endpoint: lastCheck?.endpoint ?? null
    };
  }

  cleanup(): void {
    this.stopPeriodicHealthCheck();
    this.healthCheckListeners = [];
    this.lastHealthCheck = null;
  }
}

export const healthCheckService = HealthCheckService.getInstance();

export default healthCheckService;