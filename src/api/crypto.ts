import { CoinDetailsResponse, CoinMarketResponse, CoinMarketChartResponse, TimeRange, TrendingResponse, GlobalDataResponse } from "@/types";

const API_KEY = "CG-S9fx5An4bYCunts12yBC5t3t";
const BASE_URL = "https://api.coingecko.com/api/v3";
const FALLBACK_URL = "https://api.coingecko.com/api/v3";  // Consider using an alternative provider as a real fallback

export const timeRanges = [
  { label: '1H', value: 'hour', interval: 'm1', days: '1' },
  { label: '1D', value: 'day', interval: 'm15', days: '1' },
  { label: '1W', value: 'week', interval: 'h1', days: '7' },
  { label: '1M', value: 'month', interval: 'h6', days: '30' },
  { label: '3M', value: '3months', interval: 'h12', days: '90' },
  { label: '6M', value: '6months', interval: 'd1', days: '180' },
  { label: '1Y', value: 'year', interval: 'd1', days: '365' },
];

// Static fallback data for coin details when API fails
const FALLBACK_COIN_DATA = {
  "sui": {
    id: "sui",
    symbol: "sui",
    name: "Sui",
    image: {
      thumb: "https://assets.coingecko.com/coins/images/26375/thumb/sui_asset.jpeg?1696525432",
      small: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg?1696525432",
      large: "https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg?1696525432"
    },
    market_data: {
      current_price: { usd: 0.67, btc: 0.0000081 },
      market_cap: { usd: 860000000 },
      total_volume: { usd: 107000000 },
      price_change_percentage_24h: 2.5,
      price_change_percentage_7d: 5.2,
      price_change_percentage_30d: -3.1,
      circulating_supply: 1280000000,
      total_supply: 10000000000,
      max_supply: 10000000000,
      ath: { usd: 1.85 },
      ath_change_percentage: { usd: -63.5 },
      ath_date: { usd: "2024-01-15T00:00:00.000Z" },
      atl: { usd: 0.34 },
      atl_change_percentage: { usd: 97.6 },
      atl_date: { usd: "2023-06-10T00:00:00.000Z" },
      fully_diluted_valuation: { usd: 6700000000 }
    },
    description: {
      en: "Sui is a layer-1 blockchain designed for high throughput and low latency. It uses a novel object-centric model with parallel transaction execution for high scalability. The SUI token is used for gas fees, staking, and governance."
    },
    links: {
      homepage: ["https://sui.io/"],
      blockchain_site: ["https://explorer.sui.io/"],
      official_forum_url: ["https://forums.sui.io/"],
      chat_url: ["https://discord.com/invite/sui"],
      announcement_url: ["https://blog.sui.io/"],
      twitter_screen_name: "SuiNetwork",
      telegram_channel_identifier: "SuiNetwork",
      subreddit_url: "",
      repos_url: {
        github: ["https://github.com/MystenLabs/sui"],
        bitbucket: []
      }
    },
    market_cap_rank: 55,
    categories: ["Layer 1", "Smart Contract Platform"]
  }
};

// Helper to retry failed requests
const fetchWithRetry = async (url: string, options: RequestInit, retries = 2, delay = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    console.log(`Retrying fetch for ${url}. Retries left: ${retries}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay);
  }
};

// Helper to handle fetch errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    console.error(`API error (${response.status}):`, error);
    throw new Error(`API request failed with status ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

// Fetch top cryptocurrencies
export const fetchAssets = async (limit = 25): Promise<CoinMarketResponse> => {
  try {
    console.log("Fetching CoinGecko market data...");
    
    const url = new URL(`${BASE_URL}/coins/markets`);
    url.searchParams.append('vs_currency', 'usd');
    url.searchParams.append('order', 'market_cap_desc');
    url.searchParams.append('per_page', limit.toString());
    url.searchParams.append('page', '1');
    url.searchParams.append('sparkline', 'false');
    url.searchParams.append('locale', 'en');
    
    const response = await fetchWithRetry(url.toString(), {
      headers: {
        'x-cg-demo-api-key': API_KEY
      }
    });
    
    const data = await handleResponse(response);
    return {
      data,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Fetch top gainers
export const fetchTopGainers = async (limit = 10): Promise<CoinMarketResponse> => {
  try {
    console.log("Fetching top gainers...");
    
    const response = await fetchAssets(250);
    const sortedCoins = [...response.data].sort((a, b) => 
      b.price_change_percentage_24h - a.price_change_percentage_24h
    ).slice(0, limit);
    
    return {
      data: sortedCoins,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    throw error;
  }
};

// Fetch top losers
export const fetchTopLosers = async (limit = 10): Promise<CoinMarketResponse> => {
  try {
    console.log("Fetching top losers...");
    
    const response = await fetchAssets(250);
    const sortedCoins = [...response.data].sort((a, b) => 
      a.price_change_percentage_24h - b.price_change_percentage_24h
    ).slice(0, limit);
    
    return {
      data: sortedCoins,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching top losers:', error);
    throw error;
  }
};

// Fetch trending coins
export const fetchTrendingCoins = async (): Promise<TrendingResponse> => {
  try {
    console.log("Fetching trending coins...");
    
    const url = new URL(`${BASE_URL}/search/trending`);
    const response = await fetchWithRetry(url.toString(), {
      headers: {
        'x-cg-demo-api-key': API_KEY
      }
    });
    
    const data = await handleResponse(response);
    return {
      data,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw error;
  }
};

// Fetch global market data
export const fetchGlobalData = async (): Promise<GlobalDataResponse> => {
  try {
    console.log("Fetching global market data...");
    
    const url = new URL(`${BASE_URL}/global`);
    const response = await fetchWithRetry(url.toString(), {
      headers: {
        'x-cg-demo-api-key': API_KEY
      }
    });
    
    const data = await handleResponse(response);
    return {
      data,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
};

// Fetch single cryptocurrency details with fallback data
export const fetchAsset = async (id: string): Promise<CoinDetailsResponse> => {
  try {
    console.log(`Fetching CoinGecko data for asset ${id}...`);
    
    const url = new URL(`${BASE_URL}/coins/${id}`);
    url.searchParams.append('localization', 'false');
    url.searchParams.append('tickers', 'false');
    url.searchParams.append('market_data', 'true');
    url.searchParams.append('community_data', 'false');
    url.searchParams.append('developer_data', 'false');
    
    const response = await fetchWithRetry(url.toString(), {
      headers: {
        'x-cg-demo-api-key': API_KEY
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    const data = await handleResponse(response);
    return {
      data,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error);
    
    // Check if we have fallback data for this coin
    if (id in FALLBACK_COIN_DATA) {
      console.log(`Using fallback data for ${id}`);
      return {
        data: FALLBACK_COIN_DATA[id as keyof typeof FALLBACK_COIN_DATA],
        timestamp: Date.now(),
        isUsingFallbackData: true
      };
    }
    
    throw error;
  }
};

// Generate mock chart data when API fails
const generateMockChartData = (days: string, basePrice = 100) => {
  const numPoints = parseInt(days) * 24; // 24 points per day
  const priceData = [];
  const marketCapData = [];
  const volumeData = [];
  const now = Date.now();
  const timeStep = (parseInt(days) * 24 * 60 * 60 * 1000) / numPoints;
  
  let price = basePrice;
  let marketCap = basePrice * 10000000;
  let volume = basePrice * 1000000;
  
  for (let i = 0; i < numPoints; i++) {
    // Random price movement between -2% and +2%
    const change = price * (Math.random() * 0.04 - 0.02);
    price += change;
    const timestamp = now - (numPoints - i) * timeStep;
    priceData.push([timestamp, price]);
    
    // Also generate mock market cap and volume data
    marketCap += marketCap * (Math.random() * 0.02 - 0.01);
    marketCapData.push([timestamp, marketCap]);
    
    volume += volume * (Math.random() * 0.05 - 0.025);
    volumeData.push([timestamp, volume]);
  }
  
  return { 
    prices: priceData,
    market_caps: marketCapData,
    total_volumes: volumeData
  };
};

// Fetch cryptocurrency price history with fallback to mock data
export const fetchAssetHistory = async (
  id: string,
  timeRange: TimeRange['value'] = 'day',
): Promise<CoinMarketChartResponse> => {
  try {
    console.log(`Fetching CoinGecko history data for asset ${id} with time range ${timeRange}...`);
    
    const range = timeRanges.find(r => r.value === timeRange);
    if (!range) {
      throw new Error(`Invalid time range: ${timeRange}`);
    }
    
    const url = new URL(`${BASE_URL}/coins/${id}/market_chart`);
    url.searchParams.append('vs_currency', 'usd');
    url.searchParams.append('days', range.days);
    
    const response = await fetchWithRetry(url.toString(), {
      headers: {
        'x-cg-demo-api-key': API_KEY
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    const data = await handleResponse(response);
    return {
      data,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`Error fetching history for asset ${id}:`, error);
    
    // Return mock chart data as fallback
    const range = timeRanges.find(r => r.value === timeRange) || timeRanges[1]; // default to day
    console.log(`Generating mock chart data for ${id} with timeRange ${timeRange}`);
    
    // Get base price from fallback data if available
    const basePrice = id in FALLBACK_COIN_DATA 
      ? FALLBACK_COIN_DATA[id as keyof typeof FALLBACK_COIN_DATA].market_data.current_price.usd * 100
      : 100;
    
    const mockData = generateMockChartData(range.days, basePrice);
    return {
      data: mockData,
      timestamp: Date.now(),
      isUsingFallbackData: true
    };
  }
};
