import { useState, useEffect, useCallback } from 'react';
import { getDatabaseService, initializeDatabase, stockFlowRepository } from '../../services/database';

export interface UseDatabaseReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  repository: typeof stockFlowRepository;
}

export const useDatabase = (): UseDatabaseReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const connected = await initializeDatabase();
      setIsConnected(connected);
      
      if (!connected) {
        setError('Failed to connect to database');
      }
      
      return connected;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown database error';
      setError(errorMessage);
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const service = getDatabaseService();
      await service.disconnect();
      setIsConnected(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown database error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
  }, [connect]);

  return {
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    repository: stockFlowRepository,
  };
};

// Hook for specific database operations
export const useProducts = () => {
  const { repository, isConnected } = useDatabase();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!isConnected) return;

    setLoading(true);
    setError(null);

    try {
      const data = await repository.getAllProducts();
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [repository, isConnected]);

  const searchProducts = useCallback(async (searchTerm: string) => {
    if (!isConnected) return;

    setLoading(true);
    setError(null);

    try {
      const data = await repository.searchProducts(searchTerm);
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [repository, isConnected]);

  const createProduct = useCallback(async (product: {
    productName: string;
    description?: string;
    price: number;
    stockQuantity: number;
    categoryId?: number;
  }) => {
    if (!isConnected) throw new Error('Database not connected');

    try {
      const result = await repository.createProduct(product);
      await loadProducts(); // Refresh the list
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw err;
    }
  }, [repository, isConnected, loadProducts]);

  const updateProduct = useCallback(async (productId: number, product: {
    productName?: string;
    description?: string;
    price?: number;
    stockQuantity?: number;
    categoryId?: number;
  }) => {
    if (!isConnected) throw new Error('Database not connected');

    try {
      const result = await repository.updateProduct(productId, product);
      await loadProducts(); // Refresh the list
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw err;
    }
  }, [repository, isConnected, loadProducts]);

  const deleteProduct = useCallback(async (productId: number) => {
    if (!isConnected) throw new Error('Database not connected');

    try {
      const result = await repository.deleteProduct(productId);
      await loadProducts(); // Refresh the list
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw err;
    }
  }, [repository, isConnected, loadProducts]);

  useEffect(() => {
    if (isConnected) {
      loadProducts();
    }
  }, [isConnected, loadProducts]);

  return {
    products,
    loading,
    error,
    loadProducts,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};