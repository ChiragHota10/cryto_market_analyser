
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationSidebar from "@/components/NavigationSidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface PortfolioItem {
  id: string;
  coinId: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  price: number;
  value: number;
  priceChangePercentage24h: number;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalValue, setTotalValue] = useState(0);
  const [topCoins, setTopCoins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isSidebarOpen } = useSidebarStore();
  const isMobile = useIsMobile();

  // Load portfolio from localStorage
  useEffect(() => {
    const storedPortfolio = localStorage.getItem("cryptoPortfolio");
    if (storedPortfolio) {
      try {
        setPortfolio(JSON.parse(storedPortfolio));
      } catch (error) {
        console.error("Error parsing portfolio data", error);
      }
    }
  }, []);

  // Save portfolio to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
    
    // Calculate total value
    const total = portfolio.reduce((sum, coin) => sum + coin.value, 0);
    setTotalValue(total);
  }, [portfolio]);

  // Fetch top coins for the dropdown
  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false",
          {
            headers: {
              "x-cg-demo-api-key": "CG-S9fx5An4bYCunts12yBC5t3t"
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        setTopCoins(data);
      } catch (error) {
        console.error("Error fetching top coins", error);
        toast({
          variant: "destructive",
          title: "Failed to load coins",
          description: "Could not fetch cryptocurrencies. Please try again later."
        });
      }
    };

    fetchTopCoins();
  }, [toast]);

  const handleAddCoin = async () => {
    if (!selectedCoin || !quantity || parseFloat(quantity) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please select a coin and enter a valid quantity",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Find coin details from our already fetched top coins
      const selectedCoinData = topCoins.find(coin => coin.id === selectedCoin);
      
      if (!selectedCoinData) {
        throw new Error("Coin not found");
      }

      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        coinId: selectedCoinData.id,
        name: selectedCoinData.name,
        symbol: selectedCoinData.symbol.toUpperCase(),
        image: selectedCoinData.image,
        quantity: parseFloat(quantity),
        price: selectedCoinData.current_price,
        value: selectedCoinData.current_price * parseFloat(quantity),
        priceChangePercentage24h: selectedCoinData.price_change_percentage_24h,
      };

      setPortfolio(prev => [...prev, newItem]);
      setSelectedCoin("");
      setQuantity("");
      setIsAddModalOpen(false);
      
      toast({
        title: "Coin added",
        description: `${newItem.name} has been added to your portfolio`,
      });
    } catch (error) {
      console.error("Error adding coin", error);
      toast({
        variant: "destructive",
        title: "Failed to add coin",
        description: "An error occurred while adding the coin to your portfolio",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoin = (id: string) => {
    setPortfolio(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Coin removed",
      description: "The coin has been removed from your portfolio",
    });
  };

  // Format currency with 2 decimal places
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Portfolio | CryptoBrutal</title>
        <meta name="description" content="Track your cryptocurrency portfolio" />
      </Helmet>
      
      <Header />
      
      <div className="flex flex-1">
        <NavigationSidebar />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-52" : ""
        )}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-black mb-2">Portfolio Tracker</h1>
                <p className="text-gray-600">
                  Track your crypto assets in one place
                </p>
              </div>
              
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="neo-brutalist-button flex items-center gap-2 mt-4 md:mt-0">
                    <Plus size={16} />
                    <span>Add Coin</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-4 border-black">
                  <DialogHeader>
                    <DialogTitle>Add Coin to Portfolio</DialogTitle>
                    <DialogDescription>
                      Select a cryptocurrency and enter the quantity you own
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="coin" className="text-sm font-medium">
                        Select Coin
                      </label>
                      <Select 
                        value={selectedCoin} 
                        onValueChange={setSelectedCoin}
                      >
                        <SelectTrigger id="coin" className="border-2 border-black">
                          <SelectValue placeholder="Select a coin" />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-black max-h-80">
                          {topCoins.map(coin => (
                            <SelectItem 
                              key={coin.id} 
                              value={coin.id}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <img 
                                  src={coin.image} 
                                  alt={coin.name} 
                                  className="w-5 h-5"
                                />
                                <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="quantity" className="text-sm font-medium">
                        Quantity
                      </label>
                      <Input
                        id="quantity"
                        type="number"
                        step="any"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0.00"
                        className="border-2 border-black"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="neo-brutalist-button"
                      onClick={handleAddCoin}
                      disabled={isLoading}
                    >
                      {isLoading ? "Adding..." : "Add to Portfolio"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="neo-brutalist-card mb-8 p-6">
              <h2 className="text-2xl font-bold mb-2">Portfolio Value</h2>
              <p className="text-4xl font-black">{formatCurrency(totalValue)}</p>
            </div>
            
            {portfolio.length === 0 ? (
              <div className="neo-brutalist-card p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Your portfolio is empty</h3>
                <p className="text-gray-600 mb-6">
                  Add your first cryptocurrency to start tracking your portfolio
                </p>
                <Button 
                  className="neo-brutalist-button"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Add Your First Coin
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {portfolio.map((item) => (
                    <div key={item.id} className="neo-brutalist-card p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-10 h-10"
                          />
                          <div>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.symbol}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveCoin(item.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-bold">{item.quantity} {item.symbol}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Value</p>
                          <p className="font-bold">{formatCurrency(item.value)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-bold">{formatCurrency(item.price)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">24h Change</p>
                          <p className={`font-bold ${
                            item.priceChangePercentage24h >= 0 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {item.priceChangePercentage24h >= 0 ? "+" : ""}
                            {item.priceChangePercentage24h?.toFixed(2) || "0.00"}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
