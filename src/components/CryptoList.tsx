
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CoinMarket } from "@/types";
import { fetchAssets } from "@/api/crypto";
import CryptoCard from "./CryptoCard";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const CryptoList = () => {
  const [assets, setAssets] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoading(true);
        const response = await fetchAssets(50);
        setAssets(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch crypto assets:", err);
        setError("Failed to load cryptocurrency data. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load cryptocurrency data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAssets();
    
    // Set up polling every 60 seconds
    const intervalId = setInterval(loadAssets, 60000);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  if (loading && assets.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-neobrutalism-pink" />
      </div>
    );
  }
  
  if (error && assets.length === 0) {
    return (
      <div className="neo-brutalist-card p-8 text-center">
        <p className="text-lg font-bold text-destructive mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="neo-brutalist-button px-4 py-2"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-black ${isMobile ? "w-full text-center bg-neobrutalism-pink dark:bg-neobrutalism-pink py-2 text-white border-2 border-black dark:border-white" : "border-b-4 border-neobrutalism-pink inline-block"}`}>
          TOP CRYPTOCURRENCIES
        </h2>
        {loading && (
          <div className={`flex items-center gap-2 ${isMobile ? "hidden" : ""}`}>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Updating...</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {assets.map((asset) => (
          <CryptoCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default CryptoList;
