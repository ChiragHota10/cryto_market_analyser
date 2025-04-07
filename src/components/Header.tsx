
import { Link } from "react-router-dom";
import { Bitcoin, LogIn, UserPlus, User } from "lucide-react";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNavigation from "./MobileNavigation";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  // Simple authentication state for demonstration
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("User");
  const {
    isSidebarOpen,
    toggleSidebar
  } = useSidebarStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();
  
  const handleButtonClick = () => {
    toggleSidebar();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // Match the duration of the animation
  };
  
  const handleLogin = () => {
    // For demonstration purposes only
    setIsLoggedIn(true);
    setUsername("CryptoUser");
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return <header className="border-b-4 border-black dark:border-white bg-neobrutalism-yellow dark:bg-black px-2 sm:px-4 py-2 sm:py-3 sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile Navigation (hamburger menu) at leftmost position */}
          <MobileNavigation />
          
          {/* Logo right next to hamburger on mobile */}
          <Link to="/" className="flex items-center">
            <Bitcoin size={isMobile ? 20 : 24} className="text-black dark:text-neobrutalism-yellow" />
            <h1 className="font-black text-lg sm:text-xl md:text-2xl tracking-tight mx-1">
              CRYPTO<span className="text-neobrutalism-pink">BRUTAL</span>
            </h1>
          </Link>
          
          {/* Sidebar Toggle for Desktop */}
          <button onClick={handleButtonClick} className={`hidden sm:flex p-1.5 sm:p-2 hover:bg-neobrutalism-pink/20 dark:hover:bg-neobrutalism-pink/40 rounded-md transition-colors items-center justify-center absolute left-4 ${isAnimating ? 'animate-button-press' : ''}`} aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
            <span className="sr-only">Toggle Sidebar</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isSidebarOpen ? 'rotate-90' : 'rotate-0'}`}>
              {isSidebarOpen ? <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </> : <>
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>}
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden md:block bg-black text-white dark:bg-white dark:text-black text-xs px-2 py-1 font-bold rounded-sm mr-2">
            POWERED BY COINGECKO API
          </div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* SearchBar with responsive width */}
          <div className="w-24 xs:w-32 sm:w-auto">
            <SearchBar />
          </div>
          
          {/* Auth buttons */}
          <div className="ml-1 sm:ml-2 hidden sm:flex items-center gap-2">
            {isLoggedIn ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-2 border-black dark:border-white bg-neobrutalism-pink text-black hover:bg-neobrutalism-pink/90">
                    <User className="mr-1" size={16} />
                    {username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-2 border-black dark:border-white" align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/portfolio" className="w-full">Portfolio</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <>
                <Button onClick={handleLogin} variant="outline" className="border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700">
                  <LogIn className="mr-1" size={16} />
                  Login
                </Button>
                <Button onClick={handleLogin} className="border-2 border-black dark:border-white bg-neobrutalism-pink text-black hover:bg-neobrutalism-pink/90">
                  <UserPlus className="mr-1" size={16} />
                  Sign Up
                </Button>
              </>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;
