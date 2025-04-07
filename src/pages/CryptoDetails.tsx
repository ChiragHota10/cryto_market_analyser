import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PriceChart from "@/components/PriceChart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationSidebar from "@/components/NavigationSidebar";
import AdBanner from "@/components/AdBanner";
import { formatCurrency, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchAsset } from "@/api/crypto";
import { 
  ArrowLeft, 
  ExternalLink, 
  Globe, 
  FileCode,
  Github,
  MessageCircle,
  Bookmark,
  Share2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Wallet,
  ListFilter,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  PieChart,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { timeRanges } from "@/api/crypto";
import { TimeRange } from "@/types";

const CryptoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeRange["value"]>("day");
  const [showAllDescription, setShowAllDescription] = useState(false);
  const { isSidebarOpen } = useSidebarStore();
  const isMobile = useIsMobile();
  
  const fetchCoinData = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);
      
      if (!id) {
        throw new Error("No coin ID provided");
      }
      
      console.log(`Fetching details for coin: ${id}`);
      const coinResponse = await fetchAsset(id);
      console.log("Coin data fetched:", coinResponse);
      
      setCoinData(coinResponse.data);
      
      // Check if we're using fallback data
      if (coinResponse.isUsingFallbackData) {
        setUsingFallbackData(true);
        toast({
          title: "Using Cached Data",
          description: "Live data is unavailable. Showing cached information.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Error fetching coin data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load coin data. Please try again later.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load coin data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchCoinData();
    }
  }, [id]);
  
  const handleTimeframeChange = (value: string) => {
    // Validate the timeframe value is one of the allowed values
    if (["hour", "day", "week", "month", "3months", "6months", "year"].includes(value)) {
      setTimeframe(value as TimeRange["value"]);
    } else {
      console.error(`Invalid timeframe value: ${value}`);
    }
  };
  
  const toggleDescription = () => {
    setShowAllDescription(!showAllDescription);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{coinData?.name ? `${coinData.name} Price and Chart | CryptoBrutal` : 'Loading Coin Details | CryptoBrutal'}</title>
        <meta name="description" content={coinData?.description?.en ? coinData.description.en.substring(0, 160) : 'View detailed cryptocurrency price charts and market data.'} />
      </Helmet>
      
      <Header />
      
      <div className="flex flex-1">
        <NavigationSidebar />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen && !isMobile ? "md:ml-56" : "",
          isSidebarOpen && isMobile ? "md:ml-16" : ""
        )}>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
                <ArrowLeft size={16} />
                Back to Markets
              </Link>
            </div>
            
            {usingFallbackData && (
              <Alert className="mb-4 bg-amber-50 border-amber-300">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-700">
                  Using cached data. Some information may not be up-to-date.
                </AlertDescription>
              </Alert>
            )}
            
            {loading && !coinData ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-neobrutalism-pink" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
                <p className="mb-6">{error}</p>
                <Button onClick={fetchCoinData}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      {coinData?.image?.large && (
                        <img 
                          src={coinData.image.large} 
                          alt={`${coinData.name} logo`} 
                          className="w-12 h-12 neo-brutalist-card p-1"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-3xl font-bold">{coinData?.name}</h1>
                          <Badge variant="outline" className="font-mono uppercase">{coinData?.symbol}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {coinData?.market_cap_rank && (
                            <Badge variant="secondary" className="bg-neobrutalism-yellow">Rank #{coinData.market_cap_rank}</Badge>
                          )}
                          {coinData?.categories && coinData.categories[0] && (
                            <Badge variant="outline">{coinData.categories[0]}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {coinData?.links?.homepage[0] && (
                        <a 
                          href={coinData.links.homepage[0]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="neo-brutalist-button px-3 py-2"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Website
                        </a>
                      )}
                      {coinData?.links?.blockchain_site && coinData.links.blockchain_site[0] && (
                        <a 
                          href={coinData.links.blockchain_site[0]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="neo-brutalist-button px-3 py-2"
                        >
                          <FileCode className="h-4 w-4 mr-1" />
                          Explorer
                        </a>
                      )}
                      {coinData?.links?.repos_url?.github && coinData.links.repos_url.github[0] && (
                        <a 
                          href={coinData.links.repos_url.github[0]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="neo-brutalist-button px-3 py-2"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      )}
                      {coinData?.links?.chat_url && coinData.links.chat_url[0] && (
                        <a 
                          href={coinData.links.chat_url[0]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="neo-brutalist-button px-3 py-2"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </a>
                      )}
                      <Button className="neo-brutalist-button px-3 py-2">
                        <Bookmark className="h-4 w-4 mr-1" />
                        Watch
                      </Button>
                      <Button className="neo-brutalist-button px-3 py-2">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Price (USD)</p>
                      <h2 className="text-4xl font-bold font-mono">
                        {coinData?.market_data?.current_price?.usd ? formatCurrency(coinData.market_data.current_price.usd) : 'N/A'}
                      </h2>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {coinData?.market_data?.price_change_percentage_24h && (
                        <div className={`flex items-center font-mono text-lg font-bold ${coinData.market_data.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coinData.market_data.price_change_percentage_24h >= 0 ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                          {Math.abs(coinData.market_data.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      )}
                      <span className="text-sm text-gray-500">(24h)</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="lg:col-span-2">
                    <Card className="neo-brutalist-card mb-8">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Price Chart</CardTitle>
                          <CardDescription>
                            {coinData?.name} price over time
                          </CardDescription>
                        </div>
                        
                        <Select 
                          value={timeframe} 
                          onValueChange={handleTimeframeChange}
                        >
                          <SelectTrigger className="w-36 border-2 border-black">
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                          <SelectContent className="border-2 border-black">
                            {timeRanges.map((range) => (
                              <SelectItem key={range.value} value={range.value}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardHeader>
                      <CardContent className="relative min-h-[300px]">
                        {id ? (
                          <PriceChart assetId={id} timeframe={timeframe} />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p>No asset ID available</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {coinData?.description?.en && (
                      <Card className="neo-brutalist-card mb-8">
                        <CardHeader>
                          <CardTitle>About {coinData.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div 
                            className={`prose max-w-none ${!showAllDescription && 'line-clamp-4'}`}
                            dangerouslySetInnerHTML={{ 
                              __html: coinData.description.en
                            }} 
                          />
                          <Button 
                            variant="link" 
                            className="mt-2 p-0 h-auto font-medium text-neobrutalism-pink"
                            onClick={toggleDescription}
                          >
                            {showAllDescription ? 'Show Less' : 'Read More'}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                    
                    <AdBanner />
                  </div>
                  
                  <div>
                    <Card className="neo-brutalist-card sticky top-20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="h-5 w-5" />
                          Market Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Market Cap</p>
                          <p className="font-mono font-bold">
                            {coinData?.market_data?.market_cap?.usd 
                              ? formatCurrency(coinData.market_data.market_cap.usd) 
                              : 'N/A'}
                          </p>
                        </div>
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">24h Trading Volume</p>
                          <p className="font-mono font-bold">
                            {coinData?.market_data?.total_volume?.usd 
                              ? formatCurrency(coinData.market_data.total_volume.usd) 
                              : 'N/A'}
                          </p>
                        </div>
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Fully Diluted Valuation</p>
                          <p className="font-mono font-bold">
                            {coinData?.market_data?.fully_diluted_valuation?.usd 
                              ? formatCurrency(coinData.market_data.fully_diluted_valuation.usd) 
                              : 'N/A'}
                          </p>
                        </div>
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Circulating Supply</p>
                          <p className="font-mono font-bold">
                            {coinData?.market_data?.circulating_supply 
                              ? coinData.market_data.circulating_supply.toLocaleString() 
                              : 'N/A'}
                          </p>
                        </div>
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Supply</p>
                          <p className="font-mono font-bold">
                            {coinData?.market_data?.total_supply 
                              ? coinData.market_data.total_supply.toLocaleString() 
                              : 'N/A'}
                          </p>
                        </div>
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Max Supply</p>
                          <p className="font-mono font-bold">
                            {coinData?.market_data?.max_supply 
                              ? coinData.market_data.max_supply.toLocaleString() 
                              : 'N/A'}
                          </p>
                        </div>
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">All-Time High</p>
                          <div className="flex items-baseline justify-between">
                            <p className="font-mono font-bold">
                              {coinData?.market_data?.ath?.usd 
                                ? formatCurrency(coinData.market_data.ath.usd) 
                                : 'N/A'}
                            </p>
                            <div className={`text-sm font-mono font-bold ${coinData?.market_data?.ath_change_percentage?.usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {coinData?.market_data?.ath_change_percentage?.usd 
                                ? `${coinData.market_data.ath_change_percentage.usd > 0 ? '+' : ''}${coinData.market_data.ath_change_percentage.usd.toFixed(1)}%` 
                                : ''}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {coinData?.market_data?.ath_date?.usd 
                              ? new Date(coinData.market_data.ath_date.usd).toLocaleDateString() 
                              : 'N/A'}
                          </p>
                        </div>
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">All-Time Low</p>
                          <div className="flex items-baseline justify-between">
                            <p className="font-mono font-bold">
                              {coinData?.market_data?.atl?.usd 
                                ? formatCurrency(coinData.market_data.atl.usd) 
                                : 'N/A'}
                            </p>
                            <div className={`text-sm font-mono font-bold ${coinData?.market_data?.atl_change_percentage?.usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {coinData?.market_data?.atl_change_percentage?.usd 
                                ? `${coinData.market_data.atl_change_percentage.usd > 0 ? '+' : ''}${coinData.market_data.atl_change_percentage.usd.toFixed(1)}%` 
                                : ''}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {coinData?.market_data?.atl_date?.usd 
                              ? new Date(coinData.market_data.atl_date.usd).toLocaleDateString() 
                              : 'N/A'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default CryptoDetails;
