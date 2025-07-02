export class DateHelper {
  static formatDate(date: Date | string, format: 'short' | 'long' | 'time' | 'datetime' = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const options: Intl.DateTimeFormatOptions = {};
    
    switch (format) {
      case 'short':
        options.year = 'numeric';
        options.month = 'short';
        options.day = 'numeric';
        break;
      case 'long':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.weekday = 'long';
        break;
      case 'time':
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      case 'datetime':
        options.year = 'numeric';
        options.month = 'short';
        options.day = 'numeric';
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
    }

    return dateObj.toLocaleDateString('en-US', options);
  }

  static getTimeRemaining(endDate: Date | string): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  } {
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const now = new Date();
    const total = end.getTime() - now.getTime();

    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total };
  }

  static formatTimeRemaining(endDate: Date | string): string {
    const { days, hours, minutes, total } = this.getTimeRemaining(endDate);
    
    if (total <= 0) {
      return 'Ended';
    }

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'Less than 1m';
    }
  }

  static isAuctionActive(startDate: Date | string, endDate: Date | string): boolean {
    const now = new Date();
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    return now >= start && now <= end;
  }

  static isAuctionUpcoming(startDate: Date | string): boolean {
    const now = new Date();
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    
    return now < start;
  }

  static isAuctionEnded(endDate: Date | string): boolean {
    const now = new Date();
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    return now > end;
  }

  static getRelativeTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return this.formatDate(dateObj, 'short');
    }
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }
}