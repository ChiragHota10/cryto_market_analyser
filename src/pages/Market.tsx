
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationSidebar from "@/components/NavigationSidebar";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Market = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebarStore();
  const isMobile = useIsMobile();

  // Redirect to the homepage immediately
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Market | CryptoBrutal</title>
        <meta name="description" content="Cryptocurrency market data and statistics" />
      </Helmet>
      
      <Header />
      
      <div className="flex flex-1">
        <NavigationSidebar />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-52" : "ml-0"
        )}>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-black mb-2">Market Overview</h1>
              <p className="text-gray-600">Redirecting to homepage...</p>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Market;
