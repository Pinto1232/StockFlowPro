// Validation utilities following Single Responsibility Principle

export class ValidationUtils {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Name validation
  static isValidName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 50;
  }

  // Simple ID validation for AsyncStorage (alphanumeric with some special chars)
  static isValidId(id: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(id) && id.length > 0;
  }

  // Generic string validation
  static isNonEmptyString(value: string): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  // Password validation (if needed in the future)
  static isValidPassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Sanitize string input
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  // Validate user creation input
  static validateCreateUserInput(input: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.name || !this.isValidName(input.name)) {
      errors.push('Name must be between 2 and 50 characters');
    }

    if (!input.email || !this.isValidEmail(input.email)) {
      errors.push('Valid email is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate user update input
  static validateUpdateUserInput(input: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (input.name !== undefined && !this.isValidName(input.name)) {
      errors.push('Name must be between 2 and 50 characters');
    }

    if (input.email !== undefined && !this.isValidEmail(input.email)) {
      errors.push('Valid email is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}