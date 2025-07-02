import { BidStatus } from '../enums/AppEnums';

export interface CreateBidDTO {
  auctionId: string;
  amount: number;
  maxBid?: number; // For automatic bidding
  isAutoBid?: boolean;
}

export interface BidDTO {
  id: string;
  auctionId: string;
  bidderId: string;
  bidder: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  amount: number;
  maxBid?: number;
  isAutoBid: boolean;
  isWinning: boolean;
  timestamp: string;
  status: BidStatus;
  auction: {
    id: string;
    title: string;
    image: string;
    endDate: string;
    status: string;
  };
}

export interface BidHistoryDTO {
  auctionId: string;
  bids: BidDTO[];
  totalBids: number;
  highestBid: number;
  userBids: BidDTO[];
  userHighestBid?: number;
  userIsWinning: boolean;
}

export interface AutoBidSettingsDTO {
  isEnabled: boolean;
  maxAmount: number;
  incrementStrategy: 'minimum' | 'aggressive' | 'conservative';
  stopIfOutbid: boolean;
  notifications: boolean;
}

export interface BidValidationDTO {
  isValid: boolean;
  errors: string[];
  suggestedAmount?: number;
  minimumBid: number;
  maximumBid?: number;
}

export interface BidSummaryDTO {
  totalBids: number;
  activeBids: number;
  wonAuctions: number;
  totalSpent: number;
  averageBid: number;
  successRate: number;
  recentBids: BidDTO[];
}