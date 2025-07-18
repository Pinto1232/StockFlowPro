export class ValidationHelper {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  static isValidBidAmount(amount: number, currentBid: number, minimumIncrement: number = 1): boolean {
    return amount > currentBid && amount >= currentBid + minimumIncrement;
  }

  static isValidAuctionTitle(title: string): boolean {
    return title.trim().length >= 3 && title.trim().length <= 100;
  }

  static isValidAuctionDescription(description: string): boolean {
    return description.trim().length >= 10 && description.trim().length <= 1000;
  }

  static isValidPrice(price: number): boolean {
    return price > 0 && Number.isFinite(price);
  }

  static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime()) && date > new Date();
  }

  static getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    if (password.length < 6) return 'weak';
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  }

  static validateForm(data: Record<string, any>, rules: Record<string, (value: any) => boolean>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};
    
    for (const [field, rule] of Object.entries(rules)) {
      if (!rule(data[field])) {
        errors[field] = `Invalid ${field}`;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}