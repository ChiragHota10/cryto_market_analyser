
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CoinMarket } from "@/types";
import { fetchTopGainers, fetchTopLosers } from "@/api/crypto";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatPercentage, getPercentageClass } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const GainersLosers = () => {
  const [gainers, setGainers] = useState<CoinMarket[]>([]);
  const [losers, setLosers] = useState<CoinMarket[]>([]);
  const [activeTab, setActiveTab] = useState<string>("gainers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [gainersRes, losersRes] = await Promise.all([
          fetchTopGainers(5),
          fetchTopLosers(5)
        ]);
        setGainers(gainersRes.data);
        setLosers(losersRes.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch gainers/losers data:", err);
        setError("Failed to load gainers/losers data. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load market movers data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Set up polling every 60 seconds
    const intervalId = setInterval(loadData, 60000);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  if (loading && gainers.length === 0 && losers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[150px]">
        <Loader2 className="h-8 w-8 animate-spin text-neobrutalism-pink" />
      </div>
    );
  }
  
  if (error && gainers.length === 0 && losers.length === 0) {
    return (
      <div className="neo-brutalist-card p-4 text-center">
        <p className="text-sm font-bold text-destructive">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="neo-brutalist-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-lg">MARKET MOVERS</h3>
        {loading && (
          <div className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs font-medium">Updating...</span>
          </div>
        )}
      </div>
      
      <ToggleGroup 
        type="single" 
        value={activeTab} 
        onValueChange={(value) => {
          if (value) setActiveTab(value);
        }}
        className="w-full mb-4 grid grid-cols-2 neo-brutalist-card border-2 border-black dark:border-white p-0"
      >
        <ToggleGroupItem 
          value="gainers" 
          className={`flex items-center justify-center gap-1 py-2 border-r border-black dark:border-white font-bold transition-colors rounded-none
            ${activeTab === "gainers" 
              ? "bg-neobrutalism-cyan dark:bg-neobrutalism-cyan/80 text-black dark:text-white" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span>Top Gainers</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="losers" 
          className={`flex items-center justify-center gap-1 py-2 font-bold transition-colors rounded-none
            ${activeTab === "losers" 
              ? "bg-neobrutalism-red dark:bg-neobrutalism-red/80 text-black dark:text-white" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          <TrendingDown className="h-4 w-4 text-red-600" />
          <span>Top Losers</span>
        </ToggleGroupItem>
      </ToggleGroup>
      
      <div className="space-y-2">
        {activeTab === "gainers" && gainers.map((coin) => (
          <Link 
            key={coin.id} 
            to={`/crypto/${coin.id}`}
            className="flex items-center justify-between p-2 neo-brutalist-card hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-black dark:border-white"
          >
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="h-6 w-6" />
              <div>
                <div className="font-bold text-sm">{coin.name}</div>
                <div className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">{formatCurrency(coin.current_price)}</div>
              <div className={`text-xs ${getPercentageClass(coin.price_change_percentage_24h)}`}>
                {formatPercentage(coin.price_change_percentage_24h)}
              </div>
            </div>
          </Link>
        ))}
        
        {activeTab === "losers" && losers.map((coin) => (
          <Link 
            key={coin.id} 
            to={`/crypto/${coin.id}`}
            className="flex items-center justify-between p-2 neo-brutalist-card hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-black dark:border-white"
          >
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="h-6 w-6" />
              <div>
                <div className="font-bold text-sm">{coin.name}</div>
                <div className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">{formatCurrency(coin.current_price)}</div>
              <div className={`text-xs ${getPercentageClass(coin.price_change_percentage_24h)}`}>
                {formatPercentage(coin.price_change_percentage_24h)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GainersLosers;
