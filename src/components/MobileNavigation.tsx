
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Bitcoin, Briefcase, Globe, Home, LogIn, UserPlus } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/'
    }, 
    {
      name: 'Portfolio',
      icon: Briefcase,
      path: '/portfolio'
    }, 
    {
      name: 'Exchanges',
      icon: Globe,
      path: '/exchanges'
    }
  ];
  
  const handleLogin = () => {
    // For demonstration purposes
    setOpen(false);
  };

  return (
    <div className="sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-1.5 border-2 border-black dark:border-white shadow-brutal bg-white dark:bg-black hover:shadow-none hover:translate-y-1 transition-all">
            <Menu size={16} className="stroke-[2.5px] my-px mx-0 px-px py-px dark:text-white" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="border-r-4 border-black dark:border-white bg-white dark:bg-black p-0 shadow-brutal-lg max-w-[85vw]">
          <div className="flex items-center justify-between p-4 border-b-4 border-black dark:border-white">
            <div className="flex items-center gap-2">
              <Bitcoin size={24} className="text-black dark:text-neobrutalism-yellow" />
              <h2 className="font-black text-lg tracking-tight">
                CRYPTO<span className="text-neobrutalism-pink">BRUTAL</span>
              </h2>
            </div>
          </div>
          
          <nav className="p-3">
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 w-full rounded-none border-2 border-black dark:border-white font-medium transition-all",
                    currentPath === item.path 
                      ? "bg-neobrutalism-yellow text-black shadow-brutal" 
                      : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-brutal"
                  )}
                >
                  <item.icon size={18} className="stroke-[2.5px]" />
                  <span className="font-bold">{item.name}</span>
                </Link>
              ))}
            </div>
            
            {/* Theme Toggle */}
            <div className="mt-4 border-2 border-black dark:border-white p-2 flex justify-center">
              <ThemeToggle />
            </div>
            
            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold px-1 mb-2">ACCOUNT</p>
              <Button onClick={handleLogin} variant="outline" className="border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 w-full justify-start">
                <LogIn className="mr-2" size={16} />
                Login
              </Button>
              <Button onClick={handleLogin} className="border-2 border-black dark:border-white bg-neobrutalism-pink text-black hover:bg-neobrutalism-pink/90 w-full justify-start">
                <UserPlus className="mr-2" size={16} />
                Sign Up
              </Button>
            </div>
            
            <div className="mt-6">
              <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-2 py-1 font-bold rounded-sm inline-block">
                POWERED BY COINGECKO API
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
