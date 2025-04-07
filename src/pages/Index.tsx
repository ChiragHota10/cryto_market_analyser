
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CryptoList from "@/components/CryptoList";
import TrendingCoins from "@/components/TrendingCoins";
import GlobalMarketOverview from "@/components/GlobalMarketOverview";
import GainersLosers from "@/components/GainersLosers";
import NavigationSidebar from "@/components/NavigationSidebar";
import AdBanner from "@/components/AdBanner";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Index = () => {
  const { isSidebarOpen } = useSidebarStore();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>CryptoBrutal - Crypto Asset Tracker</title>
        <meta name="description" content="Track cryptocurrency prices and market caps with a neo-brutalist design" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <GlobalMarketOverview />
              </div>
              <div>
                <GainersLosers />
              </div>
            </div>
            
            <AdBanner />
            
            <div className="mb-8">
              <TrendingCoins />
            </div>
            
            <CryptoList />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
