
// Add or update this file with the new types
export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

export interface CoinMarketResponse {
  data: CoinMarket[];
  timestamp: number;
  isUsingFallbackData?: boolean;
}

export interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    market_cap_percentage: { [key: string]: number };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

export interface GlobalDataResponse {
  data: GlobalData;
  timestamp: number;
  isUsingFallbackData?: boolean;
}

export interface TrendingItem {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
  };
}

export interface TrendingData {
  coins: TrendingItem[];
}

export interface TrendingResponse {
  data: TrendingData;
  timestamp: number;
  isUsingFallbackData?: boolean;
}

// Response interfaces for specific coin data
export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: { [key: string]: number };
    market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: { [key: string]: number };
    ath_change_percentage: { [key: string]: number };
    ath_date: { [key: string]: string };
    atl: { [key: string]: number };
    atl_change_percentage: { [key: string]: number };
    atl_date: { [key: string]: string };
    fully_diluted_valuation?: { [key: string]: number };
  };
  description: { [key: string]: string };
  links?: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name?: string;
    telegram_channel_identifier?: string;
    subreddit_url?: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  market_cap_rank?: number;
  categories?: string[];
}

export interface CoinDetailsResponse {
  data: CoinDetails;
  timestamp: number;
  isUsingFallbackData?: boolean;
}

export interface CoinMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface CoinMarketChartResponse {
  data: CoinMarketChart;
  timestamp: number;
  isUsingFallbackData?: boolean;
}

export interface TimeRange {
  label: string;
  value: 'hour' | 'day' | 'week' | 'month' | '3months' | '6months' | 'year';
  interval: string;
  days: string;
}
