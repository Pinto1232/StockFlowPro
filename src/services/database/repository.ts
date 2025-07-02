import { getDatabaseService, DatabaseService } from './service';

export abstract class BaseRepository {
  protected db: DatabaseService;

  constructor() {
    this.db = getDatabaseService();
  }

  protected async ensureConnection(): Promise<void> {
    if (!this.db.isConnected()) {
      const connected = await this.db.connect();
      if (!connected) {
        throw new Error('Failed to establish database connection');
      }
    }
  }

  protected async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    await this.ensureConnection();
    return this.db.query<T>(sql, params);
  }

  protected async execute(sql: string, params?: any[]): Promise<number> {
    await this.ensureConnection();
    return this.db.execute(sql, params);
  }

  protected async queryFirst<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  protected async exists(sql: string, params?: any[]): Promise<boolean> {
    const result = await this.queryFirst<{ count: number }>(sql, params);
    return (result?.count || 0) > 0;
  }
}

// Example repository for your StockFlowPro database
export class StockFlowRepository extends BaseRepository {
  // Example: Get all products
  async getAllProducts(): Promise<any[]> {
    const sql = `
      SELECT 
        ProductId,
        ProductName,
        Description,
        Price,
        StockQuantity,
        CategoryId,
        CreatedDate,
        ModifiedDate
      FROM Products
      WHERE IsActive = 1
      ORDER BY ProductName
    `;
    return this.query(sql);
  }

  // Example: Get product by ID
  async getProductById(productId: number): Promise<any | null> {
    const sql = `
      SELECT 
        ProductId,
        ProductName,
        Description,
        Price,
        StockQuantity,
        CategoryId,
        CreatedDate,
        ModifiedDate
      FROM Products
      WHERE ProductId = ? AND IsActive = 1
    `;
    return this.queryFirst(sql, [productId]);
  }

  // Example: Create new product
  async createProduct(product: {
    productName: string;
    description?: string;
    price: number;
    stockQuantity: number;
    categoryId?: number;
  }): Promise<number> {
    const sql = `
      INSERT INTO Products (ProductName, Description, Price, StockQuantity, CategoryId, CreatedDate, IsActive)
      VALUES (?, ?, ?, ?, ?, GETDATE(), 1)
    `;
    return this.execute(sql, [
      product.productName,
      product.description || null,
      product.price,
      product.stockQuantity,
      product.categoryId || null,
    ]);
  }

  // Example: Update product
  async updateProduct(productId: number, product: {
    productName?: string;
    description?: string;
    price?: number;
    stockQuantity?: number;
    categoryId?: number;
  }): Promise<number> {
    const updates: string[] = [];
    const params: any[] = [];

    if (product.productName !== undefined) {
      updates.push('ProductName = ?');
      params.push(product.productName);
    }
    if (product.description !== undefined) {
      updates.push('Description = ?');
      params.push(product.description);
    }
    if (product.price !== undefined) {
      updates.push('Price = ?');
      params.push(product.price);
    }
    if (product.stockQuantity !== undefined) {
      updates.push('StockQuantity = ?');
      params.push(product.stockQuantity);
    }
    if (product.categoryId !== undefined) {
      updates.push('CategoryId = ?');
      params.push(product.categoryId);
    }

    if (updates.length === 0) {
      return 0;
    }

    updates.push('ModifiedDate = GETDATE()');
    params.push(productId);

    const sql = `
      UPDATE Products 
      SET ${updates.join(', ')}
      WHERE ProductId = ? AND IsActive = 1
    `;
    return this.execute(sql, params);
  }

  // Example: Delete product (soft delete)
  async deleteProduct(productId: number): Promise<number> {
    const sql = `
      UPDATE Products 
      SET IsActive = 0, ModifiedDate = GETDATE()
      WHERE ProductId = ? AND IsActive = 1
    `;
    return this.execute(sql, [productId]);
  }

  // Example: Get low stock products
  async getLowStockProducts(threshold: number = 10): Promise<any[]> {
    const sql = `
      SELECT 
        ProductId,
        ProductName,
        StockQuantity,
        Price
      FROM Products
      WHERE StockQuantity <= ? AND IsActive = 1
      ORDER BY StockQuantity ASC
    `;
    return this.query(sql, [threshold]);
  }

  // Example: Search products
  async searchProducts(searchTerm: string): Promise<any[]> {
    const sql = `
      SELECT 
        ProductId,
        ProductName,
        Description,
        Price,
        StockQuantity
      FROM Products
      WHERE (ProductName LIKE ? OR Description LIKE ?) AND IsActive = 1
      ORDER BY ProductName
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.query(sql, [searchPattern, searchPattern]);
  }
}

// Export singleton instance
export const stockFlowRepository = new StockFlowRepository();