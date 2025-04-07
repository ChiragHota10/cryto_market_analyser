
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const ThemeToggle = () => {
  // Check if user has a theme preference saved in localStorage
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    // Check localStorage first
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      // If theme is saved in localStorage, use that
      if (savedTheme) {
        return savedTheme === "dark";
      }
      // Otherwise check system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Apply theme class to document when component mounts and when theme changes
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className="flex items-center space-x-2 ml-2 mr-2">
      <Sun className="size-4 text-black dark:text-neobrutalism-yellow stroke-[2.5px]" />
      <Switch 
        className="data-[state=checked]:bg-neobrutalism-pink data-[state=unchecked]:bg-neobrutalism-yellow border-2 border-black dark:border-white"
        checked={isDarkTheme} 
        onCheckedChange={toggleTheme} 
        aria-label="Toggle dark mode"
      />
      <Moon className="size-4 stroke-[2.5px] text-black dark:text-white" />
    </div>
  );
};

export default ThemeToggle;
