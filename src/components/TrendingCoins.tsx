
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { TrendingData, TrendingItem } from "@/types";
import { fetchTrendingCoins, fetchAssets } from "@/api/crypto";
import { Loader2, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const TrendingCoins = () => {
  const [trendingCoins, setTrendingCoins] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadTrendingCoins = async () => {
      try {
        setLoading(true);
        
        // Fetch BTC price first
        const assetsResponse = await fetchAssets(1);
        const btcData = assetsResponse.data.find(coin => coin.symbol === 'btc');
        if (btcData) {
          setBtcPrice(btcData.current_price);
        }
        
        // Fetch trending coins
        const response = await fetchTrendingCoins();
        setTrendingCoins(response.data.coins.slice(0, 7));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch trending coins:", err);
        setError("Failed to load trending coins data. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load trending coins data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTrendingCoins();
    
    // Set up polling every 60 seconds
    const intervalId = setInterval(loadTrendingCoins, 60000);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  if (loading && trendingCoins.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[150px]">
        <Loader2 className="h-8 w-8 animate-spin text-neobrutalism-pink" />
      </div>
    );
  }
  
  if (error && trendingCoins.length === 0) {
    return (
      <div className="neo-brutalist-card p-4 text-center">
        <p className="text-sm font-bold text-destructive">{error}</p>
      </div>
    );
  }
  
  // Convert BTC price to USD
  const convertToUsd = (btcValue: number): number => {
    return btcValue * btcPrice;
  };
  
  return (
    <div className="neo-brutalist-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-neobrutalism-pink" />
          <h3 className="font-black text-lg">TRENDING COINS</h3>
        </div>
        {loading && (
          <div className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs font-medium">Updating...</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {trendingCoins.map(({ item }) => (
          <Link 
            key={item.id} 
            to={`/crypto/${item.id}`}
            className="neo-brutalist-card p-3 hover:bg-gray-50 flex flex-col items-center"
          >
            <img 
              src={item.small} 
              alt={item.name} 
              className="h-8 w-8 mb-2"
            />
            <span className="font-bold text-sm truncate w-full text-center">{item.name}</span>
            <span className="text-xs text-muted-foreground">{item.symbol.toUpperCase()}</span>
            <div className="mt-2 text-xs font-mono">
              {formatCurrency(convertToUsd(item.price_btc), {
                maximumFractionDigits: 6,
                minimumFractionDigits: 2
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingCoins;
