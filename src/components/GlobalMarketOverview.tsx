
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { GlobalData } from "@/types";
import { fetchGlobalData } from "@/api/crypto";
import { Loader2, Globe } from "lucide-react";
import { formatLargeNumber, formatPercentage, getPercentageClass } from "@/lib/utils";

const GlobalMarketOverview = () => {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadGlobalData = async () => {
      try {
        setLoading(true);
        const response = await fetchGlobalData();
        setGlobalData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch global market data:", err);
        setError("Failed to load global market data. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load global market data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadGlobalData();
    
    // Set up polling every 60 seconds
    const intervalId = setInterval(loadGlobalData, 60000);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  if (loading && !globalData) {
    return (
      <div className="flex justify-center items-center min-h-[150px]">
        <Loader2 className="h-8 w-8 animate-spin text-neobrutalism-pink" />
      </div>
    );
  }
  
  if (error && !globalData) {
    return (
      <div className="neo-brutalist-card p-4 text-center">
        <p className="text-sm font-bold text-destructive">{error}</p>
      </div>
    );
  }
  
  if (!globalData) return null;
  
  const data = globalData.data;
  const topCoins = Object.entries(data.market_cap_percentage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  return (
    <div className="neo-brutalist-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-neobrutalism-cyan" />
          <h3 className="font-black text-lg">GLOBAL MARKET</h3>
        </div>
        {loading && (
          <div className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs font-medium">Updating...</span>
          </div>
        )}
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Total Market Cap</span>
          <span className="stat-value">${formatLargeNumber(data.total_market_cap.usd)}</span>
          <span className={`percent-change ${getPercentageClass(data.market_cap_change_percentage_24h_usd)}`}>
            {formatPercentage(data.market_cap_change_percentage_24h_usd)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-title">24h Volume</span>
          <span className="stat-value">${formatLargeNumber(data.total_volume.usd)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Active Coins</span>
          <span className="stat-value">{data.active_cryptocurrencies.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Exchanges</span>
          <span className="stat-value">{data.markets.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-bold text-sm mb-2">Market Dominance</h4>
        <div className="flex flex-col gap-2">
          {topCoins.map(([symbol, percentage]) => (
            <div key={symbol} className="flex items-center">
              <span className="font-medium uppercase">{symbol}</span>
              <div className="mx-2 flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neobrutalism-yellow" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-mono">{percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalMarketOverview;
