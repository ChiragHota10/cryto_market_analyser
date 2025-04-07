
import { Link } from "react-router-dom";
import { Bitcoin, ArrowUp } from "lucide-react";
import { Separator } from "./ui/separator";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@/lib/utils";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isSidebarOpen } = useSidebarStore();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={cn(
      "border-t-4 border-black dark:border-white bg-neobrutalism-yellow dark:bg-black py-8 transition-all duration-300 ease-in-out",
      isSidebarOpen ? "ml-14 md:ml-52" : "ml-0"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex flex-col items-center md:items-start gap-1 mb-4 md:mb-0 transition-transform duration-300 hover:translate-y-[-3px]">
            <div className="flex items-center gap-2">
              <Bitcoin size={32} className="text-black dark:text-neobrutalism-yellow transition-transform duration-300 hover:rotate-12" />
              <h2 className="font-black text-2xl tracking-tight">
                CRYPTO<span className="text-neobrutalism-pink">BRUTAL</span>
              </h2>
            </div>
            <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-2 py-1 font-bold rounded-sm mt-1">
              POWERED BY COINGECKO API
            </div>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="neo-brutalist-button px-4 py-2 flex items-center gap-2 transition-transform duration-300 hover:translate-y-[-3px] active:translate-y-[1px]"
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp size={16} className="transition-transform duration-300 group-hover:translate-y-[-2px]" />
          </button>
        </div>
        
        <Separator className="bg-black/20 dark:bg-white/20 my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="transition-all duration-300 hover:translate-y-[-3px]">
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Home</Link></li>
              <li><a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">API Docs</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Pricing</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">FAQ</a></li>
            </ul>
          </div>
          
          <div className="transition-all duration-300 hover:translate-y-[-3px]">
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">About Us</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Careers</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Blog</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Press</a></li>
            </ul>
          </div>
          
          <div className="transition-all duration-300 hover:translate-y-[-3px]">
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Terms of Service</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Cookie Policy</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Disclaimer</a></li>
            </ul>
          </div>
          
          <div className="transition-all duration-300 hover:translate-y-[-3px]">
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Twitter</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Discord</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">Telegram</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-300 hover:text-neobrutalism-pink">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-black/20 dark:bg-white/20 my-6" />
        
        <div className="text-center transition-opacity duration-300 hover:opacity-80">
          <p className="font-bold">CRYPTO<span className="text-neobrutalism-pink">BRUTAL</span> © {currentYear}</p>
          <p className="text-xs mt-1">
            Data provided by <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="underline font-medium transition-colors duration-300 hover:text-neobrutalism-pink">CoinGecko API</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
