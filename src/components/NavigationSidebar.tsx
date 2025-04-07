
import { Link, useLocation } from "react-router-dom";
import { 
  Briefcase, 
  Globe, 
  Home 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

const NavigationSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isSidebarOpen, isAnimating, setAnimating } = useSidebarStore();
  const isMobile = useIsMobile();
  
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Portfolio', icon: Briefcase, path: '/portfolio' },
    { name: 'Exchanges', icon: Globe, path: '/exchanges' },
  ];

  // Handle animation end
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 300); // 300ms matches our transition duration
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating, setAnimating]);

  // If sidebar is closed and not animating, don't render to save resources
  // But during animation we need to keep it in the DOM
  if (!isSidebarOpen && !isAnimating) {
    return null;
  }

  return (
    <div 
      className={cn(
        "bg-white dark:bg-black border-r-4 border-black dark:border-white fixed left-0 h-screen z-10 shadow-brutal transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-14 md:w-52" : "w-0 opacity-0",
        isAnimating && "transition-all duration-300 ease-in-out"
      )}
    >
      <nav className={cn(
        "p-3 pt-20 transition-opacity duration-300",
        !isSidebarOpen && "opacity-0"
      )}>
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 w-full rounded-none border-2 border-black dark:border-white font-medium transition-all",
                  "flex flex-col md:flex-row items-center md:justify-start justify-center",
                  currentPath === item.path 
                    ? "bg-neobrutalism-yellow dark:bg-neobrutalism-yellow text-black shadow-brutal" 
                    : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-brutal"
                )}
              >
                <item.icon size={18} className="stroke-[2.5px]" />
                <span className="text-xs md:text-sm hidden md:inline font-bold">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavigationSidebar;
