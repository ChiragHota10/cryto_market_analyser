
import { Link } from "react-router-dom";
import { Heart, TrendingUp, TrendingDown } from "lucide-react";
import { CoinMarket } from "@/types";
import { formatCurrency, formatLargeNumber, formatPercentage, getPercentageClass } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface CryptoCardProps {
  asset: CoinMarket;
}

const CryptoCard = ({ asset }: CryptoCardProps) => {
  const priceChangeIsPositive = asset.price_change_percentage_24h >= 0;
  const [isFavorite, setIsFavorite] = useState(false);
  const isMobile = useIsMobile();
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setIsFavorite(!isFavorite);
  };
  
  return (
    <Link to={`/crypto/${asset.id}`}>
      <div className="neo-brutalist-card p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Coin basic info */}
        <div className="flex items-center justify-between md:justify-start md:gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-neobrutalism-gray h-10 w-10 flex items-center justify-center font-mono font-bold border-2 border-black dark:border-white">
              {asset.market_cap_rank}
            </div>
            
            <div className="flex items-center gap-2">
              <img src={asset.image} alt={asset.name} className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="font-bold text-lg">{asset.name}</span>
                <span className="text-muted-foreground font-mono text-sm">{asset.symbol.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          {/* Mobile: Price & Change */}
          {isMobile && (
            <div className="flex flex-col items-end">
              <span className="font-bold">{formatCurrency(asset.current_price)}</span>
              <div className={`flex items-center ${getPercentageClass(asset.price_change_percentage_24h)}`}>
                {priceChangeIsPositive ? (
                  <TrendingUp size={14} className="mr-1" />
                ) : (
                  <TrendingDown size={14} className="mr-1" />
                )}
                <span className="font-mono text-sm">
                  {formatPercentage(asset.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile: Favorite & Actions */}
        {isMobile && (
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="h-10 w-10 p-0 rounded-none border-2 border-black dark:border-white hover:bg-neobrutalism-gray"
              onClick={handleFavorite}
            >
              <Heart 
                size={20} 
                className={`${isFavorite ? "fill-neobrutalism-pink" : ""} stroke-[2.5px]`} 
              />
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={(e) => e.preventDefault()} 
                className="h-10 px-4 py-1 bg-neobrutalism-cyan border-2 border-black dark:border-white font-bold text-sm shadow-brutal hover:shadow-none hover:translate-y-1 transition-all"
              >
                Buy
              </Button>
              <Button 
                onClick={(e) => e.preventDefault()} 
                className="h-10 px-4 py-1 bg-neobrutalism-red border-2 border-black dark:border-white font-bold text-sm shadow-brutal hover:shadow-none hover:translate-y-1 transition-all"
              >
                Sell
              </Button>
            </div>
          </div>
        )}
        
        {/* Desktop: Price, Market Cap, Volume */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            {/* Buy/Sell buttons */}
            <div className="flex gap-1 order-1 md:order-none">
              <Button 
                onClick={(e) => e.preventDefault()} 
                className="h-8 px-2 py-1 bg-neobrutalism-cyan border-2 border-black dark:border-white font-bold text-xs shadow-brutal hover:shadow-none hover:translate-y-1 transition-all"
              >
                Buy
              </Button>
              <Button 
                onClick={(e) => e.preventDefault()} 
                className="h-8 px-2 py-1 bg-neobrutalism-red border-2 border-black dark:border-white font-bold text-xs shadow-brutal hover:shadow-none hover:translate-y-1 transition-all"
              >
                Sell
              </Button>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="font-bold">{formatCurrency(asset.current_price)}</span>
              <div className={`flex items-center ${getPercentageClass(asset.price_change_percentage_24h)}`}>
                {priceChangeIsPositive ? (
                  <TrendingUp size={14} className="mr-1" />
                ) : (
                  <TrendingDown size={14} className="mr-1" />
                )}
                <span className="font-mono text-sm">
                  {formatPercentage(asset.price_change_percentage_24h)}
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">Market Cap</span>
              <span className="font-mono">{formatLargeNumber(asset.market_cap)}</span>
            </div>
            
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-medium">Volume (24h)</span>
              <span className="font-mono">{formatLargeNumber(asset.total_volume)}</span>
            </div>
            
            {/* Favorite heart button */}
            <div className="ml-2">
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 rounded-none border-2 border-black dark:border-white hover:bg-neobrutalism-gray"
                onClick={handleFavorite}
              >
                <Heart 
                  size={16} 
                  className={`${isFavorite ? "fill-neobrutalism-pink" : ""} stroke-[2.5px]`} 
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CryptoCard;
