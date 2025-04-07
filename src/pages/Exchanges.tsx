
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationSidebar from "@/components/NavigationSidebar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Exchange {
  id: string;
  name: string;
  year_established: number;
  country: string;
  description: string;
  url: string;
  image: string;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
}

const Exchanges = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { isSidebarOpen } = useSidebarStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/exchanges?per_page=20",
          {
            headers: {
              "x-cg-demo-api-key": "CG-S9fx5An4bYCunts12yBC5t3t"
            }
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch exchanges");
        }
        
        const data = await response.json();
        setExchanges(data);
      } catch (error) {
        console.error("Error fetching exchanges", error);
        setError("Failed to load exchanges. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load exchanges. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchanges();
  }, [toast]);

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Exchanges | CryptoBrutal</title>
        <meta name="description" content="Cryptocurrency exchanges information and statistics" />
      </Helmet>
      
      <Header />
      
      <div className="flex flex-1">
        <NavigationSidebar />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen && !isMobile ? "md:ml-56" : "",
          isSidebarOpen && isMobile ? "md:ml-16" : ""
        )}>
          <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-black mb-2">Cryptocurrency Exchanges</h1>
              <p className="text-gray-600">
                Top exchanges ranked by volume and trust score
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="neo-brutalist-card p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="neo-brutalist-card p-8 text-center">
                <p className="text-red-500 font-bold">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exchanges.map((exchange) => (
                  <div key={exchange.id} className="neo-brutalist-card p-6">
                    <div className="flex items-start gap-4">
                      <img 
                        src={exchange.image} 
                        alt={exchange.name} 
                        className="w-12 h-12 rounded-md"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold">{exchange.name}</h3>
                          <span className="bg-neobrutalism-cyan text-black text-xs font-bold px-2 py-1 border border-black">
                            Rank #{exchange.trust_score_rank}
                          </span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-600">Trust Score</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${(exchange.trust_score / 10) * 100}%` }}
                              />
                            </div>
                            <p className="font-bold mt-1">{exchange.trust_score}/10</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">24h Volume (BTC)</p>
                            <p className="font-bold">{formatNumber(exchange.trade_volume_24h_btc)} BTC</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-600">Country</p>
                            <p className="font-medium">{exchange.country || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Year Established</p>
                            <p className="font-medium">{exchange.year_established || "N/A"}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <a 
                            href={exchange.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="neo-brutalist-button inline-flex items-center gap-2 text-sm px-3 py-1"
                          >
                            <span>Visit Website</span>
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Exchanges;
