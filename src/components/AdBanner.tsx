
import { useState, useEffect } from "react";
import { BadgeDollarSign, BadgePercent, Megaphone } from "lucide-react";

interface Ad {
  id: number;
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  bgColor: string;
  darkBgColor: string;
}

const ads: Ad[] = [
  {
    id: 1,
    title: "Get 10% Off Trading Fees",
    description: "Sign up today and enjoy reduced fees on all trades",
    cta: "Claim Offer",
    icon: <BadgePercent className="h-8 w-8" />,
    bgColor: "bg-neobrutalism-pink",
    darkBgColor: "dark:bg-neobrutalism-pink",
  },
  {
    id: 2,
    title: "Earn 12% APY on Staking",
    description: "Stake your crypto assets and earn passive income",
    cta: "Start Earning",
    icon: <BadgeDollarSign className="h-8 w-8" />,
    bgColor: "bg-neobrutalism-cyan",
    darkBgColor: "dark:bg-neobrutalism-cyan",
  },
  {
    id: 3,
    title: "Refer & Earn $50 in BTC",
    description: "Invite friends to CryptoBrutal and get rewards",
    cta: "Refer Now",
    icon: <Megaphone className="h-8 w-8" />,
    bgColor: "bg-neobrutalism-yellow",
    darkBgColor: "dark:bg-neobrutalism-yellow",
  },
];

const AdBanner = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentAd = ads[currentAdIndex];

  return (
    <div className="mb-8 mt-4">
      <div
        className={`neo-brutalist-card p-4 transition-all duration-300 ${
          currentAd.bgColor
        } ${currentAd.darkBgColor} ${isAnimating ? "opacity-0 transform -translate-y-2" : "opacity-100"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-black rounded-md border-2 border-black dark:border-white">
              {currentAd.icon}
            </div>
            <div>
              <h3 className="font-black text-lg text-black dark:text-black">{currentAd.title}</h3>
              <p className="text-sm font-medium text-black/80 dark:text-black/80">
                {currentAd.description}
              </p>
            </div>
          </div>
          <button className="neo-brutalist-button px-4 py-2 text-sm md:text-base bg-white dark:bg-white">
            {currentAd.cta}
          </button>
        </div>
        <div className="flex justify-center mt-3 gap-1">
          {ads.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentAdIndex
                  ? "w-6 bg-black dark:bg-black"
                  : "w-1.5 bg-black/30 dark:bg-black/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
