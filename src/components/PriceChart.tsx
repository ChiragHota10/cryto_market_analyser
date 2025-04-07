import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TimeRange } from "@/types";
import { fetchAssetHistory, timeRanges } from "@/api/crypto";
import { formatCurrency } from "@/lib/utils";
import { Loader2, RefreshCw, AlertCircle, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toggle } from "@/components/ui/toggle";

interface PriceChartProps {
  assetId: string;
  timeframe?: TimeRange['value'];
}

const CustomTooltip = ({
  active,
  payload,
  label
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const price = payload[0].value as number;
    const date = new Date(label as string).toLocaleString();
    return <div className="neo-brutalist-card p-2 !shadow-none">
        <p className="font-bold">{formatCurrency(price)}</p>
        <p className="text-xs font-mono">{date}</p>
      </div>;
  }
  return null;
};

const PriceChart = ({
  assetId,
  timeframe = "day"
}: PriceChartProps) => {
  const [chartData, setChartData] = useState<{
    price: number;
    date: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange['value']>(timeframe as TimeRange['value']);
  const {
    toast
  } = useToast();

  // Update timeRange when the prop changes
  useEffect(() => {
    if (timeframe && timeframe !== timeRange) {
      setTimeRange(timeframe);
    }
  }, [timeframe]);

  const loadAssetHistory = async () => {
    if (!assetId) {
      console.error("No assetId provided to PriceChart component");
      setError("Missing asset ID");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);
      console.log(`Loading asset history for ${assetId} with timeRange ${timeRange}`);
      const selectedRange = timeRanges.find(range => range.value === timeRange);
      if (!selectedRange) {
        throw new Error(`Invalid time range: ${timeRange}`);
      }
      const response = await fetchAssetHistory(assetId, timeRange);
      console.log("Chart data response:", response);
      if (!response.data?.prices || !Array.isArray(response.data.prices) || response.data.prices.length === 0) {
        console.error("No price data received or invalid format:", response.data);
        throw new Error("No price data available");
      }

      // Check if using fallback data
      if (response.isUsingFallbackData) {
        setUsingFallbackData(true);
      }

      // Transform CoinGecko price data format (timestamp, price pairs)
      const formattedData = response.data.prices.map(([timestamp, price]) => ({
        price,
        date: new Date(timestamp).toISOString()
      }));
      console.log(`Formatted ${formattedData.length} price data points`);
      setChartData(formattedData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch price history:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load price history. Please try again later.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load price history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssetHistory();
  }, [assetId, timeRange]);

  const minPrice = chartData.length > 0 ? Math.min(...chartData.map(item => item.price)) * 0.995 : 0;
  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map(item => item.price)) * 1.005 : 0;

  // Fix: Use type assertion to ensure the value is properly typed
  const handleTimeRangeChange = (value: string) => {
    // Validate the timeframe value is one of the allowed values
    const validTimeRange = timeRanges.find(range => range.value === value);
    if (validTimeRange) {
      // Use type assertion to tell TypeScript this is definitely a TimeRange['value']
      setTimeRange(validTimeRange.value as TimeRange['value']);
    } else {
      console.error(`Invalid timeRange value: ${value}`);
    }
  };

  const handleBuy = () => {
    toast({
      title: "Buy Order",
      description: "Buy order initiated successfully",
      variant: "default"
    });
  };

  const handleSell = () => {
    toast({
      title: "Sell Order",
      description: "Sell order initiated successfully",
      variant: "default"
    });
  };

  return <div className="neo-brutalist-card p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          {/* Left side: Title */}
        </div>
        
        {/* Buy/Sell buttons moved to top right */}
        <div className="flex gap-2">
          <Button onClick={handleBuy} size="sm" className="bg-neobrutalism-pink hover:bg-neobrutalism-pink/90 text-white font-bold rounded-full">
            <ArrowUpCircle className="mr-1 h-4 w-4" />
            Buy
          </Button>
          <Button onClick={handleSell} size="sm" className="bg-neobrutalism-cyan hover:bg-neobrutalism-cyan/90 text-black font-bold rounded-full">
            <ArrowDownCircle className="mr-1 h-4 w-4" />
            Sell
          </Button>
        </div>
      </div>
      
      {usingFallbackData && <Alert className="mb-4 bg-amber-50 border-amber-300">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700 text-xs">
            Using simulated price data. Chart may not reflect actual market movements.
          </AlertDescription>
        </Alert>}
      
      {loading ? <div className="flex justify-center items-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-neobrutalism-pink" />
        </div> : error ? <div className="flex flex-col justify-center items-center h-[300px] gap-4">
          <p className="text-destructive font-medium">{error}</p>
          <Button onClick={loadAssetHistory} variant="outline" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div> : chartData.length > 0 ? <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0
        }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF00B8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF00B8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tickFormatter={tick => {
            const date = new Date(tick);
            if (timeRange === 'hour') {
              return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });
            } else if (timeRange === 'day' || timeRange === 'week') {
              return date.toLocaleTimeString([], {
                hour: '2-digit'
              });
            } else {
              return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric'
              });
            }
          }} tick={{
            fontSize: 12
          }} axisLine={{
            stroke: '#000',
            strokeWidth: 2
          }} tickLine={{
            stroke: '#000',
            strokeWidth: 1
          }} />
              <YAxis domain={[minPrice, maxPrice]} tickFormatter={tick => formatCurrency(tick, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
            notation: 'compact'
          })} tick={{
            fontSize: 12
          }} axisLine={{
            stroke: '#000',
            strokeWidth: 2
          }} tickLine={{
            stroke: '#000',
            strokeWidth: 1
          }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="price" stroke="#FF00B8" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div> : <div className="flex justify-center items-center h-[300px]">
          <p className="text-muted-foreground">No price data available</p>
        </div>}
    </div>;
};

export default PriceChart;
