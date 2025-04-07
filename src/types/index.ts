// CoinGecko API Types
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
  last_updated: string;
}

export interface TrendingCoin {
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
}

export interface TrendingItem {
  item: TrendingCoin;
}

export interface TrendingData {
  coins: TrendingItem[];
  exchanges: any[];
}

export interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  block_time_in_minutes: number;
  hashing_algorithm: string;
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    subreddit_url: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_1h_in_currency: {
      usd: number;
    };
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    ath: {
      usd: number;
    };
    ath_change_percentage: {
      usd: number;
    };
    ath_date: {
      usd: string;
    };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
  market_cap_rank: number;
  last_updated: string;
}

export interface CoinMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface TimeRange {
  label: string;
  value: 'hour' | 'day' | 'week' | 'month' | '3months' | '6months' | 'year';
  interval: string;
  days: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  timestamp: number;
}

export interface CoinMarketResponse extends ApiResponse<CoinMarket[]> {}
export interface CoinDetailsResponse extends ApiResponse<CoinDetails> {}
export interface CoinMarketChartResponse extends ApiResponse<CoinMarketChart> {}
export interface TrendingResponse extends ApiResponse<TrendingData> {}
export interface GlobalDataResponse extends ApiResponse<GlobalData> {}

// For backward compatibility - will be used while transitioning
export interface CryptoAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export interface AssetHistory {
  priceUsd: string;
  time: number;
  date: string;
}

export interface AssetsResponse extends ApiResponse<CryptoAsset[]> {}
export interface AssetResponse extends ApiResponse<CryptoAsset> {}
export interface AssetHistoryResponse extends ApiResponse<AssetHistory[]> {}
