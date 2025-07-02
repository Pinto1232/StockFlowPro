export class CurrencyHelper {
  static formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
  ): string {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback formatting
      return `$${amount.toFixed(2)}`;
    }
  }

  static formatCompactCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
  ): string {
    try {
      if (amount >= 1000000) {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          notation: 'compact',
          compactDisplay: 'short',
        }).format(amount);
      }
      return this.formatCurrency(amount, currency, locale);
    } catch (error) {
      // Fallback formatting
      if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(1)}K`;
      }
      return `$${amount.toFixed(2)}`;
    }
  }

  static parseCurrency(currencyString: string): number {
    // Remove currency symbols and parse
    const cleanString = currencyString.replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(cleanString);
    return isNaN(parsed) ? 0 : parsed;
  }

  static calculateBidIncrement(currentBid: number): number {
    if (currentBid < 100) {
      return 5;
    } else if (currentBid < 500) {
      return 10;
    } else if (currentBid < 1000) {
      return 25;
    } else if (currentBid < 5000) {
      return 50;
    } else if (currentBid < 10000) {
      return 100;
    } else {
      return 250;
    }
  }

  static getSuggestedBids(currentBid: number, count: number = 3): number[] {
    const increment = this.calculateBidIncrement(currentBid);
    const suggestions: number[] = [];
    
    for (let i = 1; i <= count; i++) {
      suggestions.push(currentBid + (increment * i));
    }
    
    return suggestions;
  }

  static calculateTotalWithFees(
    bidAmount: number,
    buyersPremium: number = 0.1,
    tax: number = 0.08
  ): {
    bidAmount: number;
    buyersPremium: number;
    tax: number;
    total: number;
  } {
    const premiumAmount = bidAmount * buyersPremium;
    const subtotal = bidAmount + premiumAmount;
    const taxAmount = subtotal * tax;
    const total = subtotal + taxAmount;

    return {
      bidAmount,
      buyersPremium: premiumAmount,
      tax: taxAmount,
      total,
    };
  }

  static isValidBidAmount(
    bidAmount: number,
    currentBid: number,
    minimumIncrement?: number
  ): boolean {
    const increment = minimumIncrement || this.calculateBidIncrement(currentBid);
    return bidAmount >= currentBid + increment;
  }

  static formatBidHistory(bids: Array<{ amount: number; timestamp: string }>): string {
    if (bids.length === 0) return 'No bids yet';
    
    const highestBid = Math.max(...bids.map(bid => bid.amount));
    const bidCount = bids.length;
    
    return `${this.formatCurrency(highestBid)} (${bidCount} bid${bidCount > 1 ? 's' : ''})`;
  }
}