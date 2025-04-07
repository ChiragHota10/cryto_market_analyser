import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { CoinMarket } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { fetchAssets } from '@/api/crypto';
const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<CoinMarket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchAssets(100);
      const filteredResults = response.data.filter(coin => coin.name.toLowerCase().includes(value.toLowerCase()) || coin.symbol.toLowerCase().includes(value.toLowerCase())).slice(0, 10);
      setResults(filteredResults);
    } catch (error) {
      console.error('Error searching cryptocurrencies:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectCrypto = (id: string) => {
    setOpen(false);
    navigate(`/crypto/${id}`);
  };
  return <>
      <Button variant="outline" onClick={() => setOpen(true)} className="relative h-9 w-9 p-0 md:h-10 md:w-60 md:justify-start md:px-3 md:py-2 border-2 border-black bg-white hover:bg-gray-100 mx-[12px]">
        <Search className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline-flex">Search crypto...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search cryptocurrencies..." value={searchQuery} onValueChange={handleSearch} />
        <CommandList>
          <CommandEmpty>
            {isLoading ? "Searching..." : searchQuery.length > 0 ? "No results found." : "Start typing to search..."}
          </CommandEmpty>
          {results.length > 0 && <CommandGroup heading="Cryptocurrencies">
              {results.map(coin => <CommandItem key={coin.id} value={coin.name} onSelect={() => handleSelectCrypto(coin.id)} className="flex items-center gap-2 cursor-pointer">
                  <img src={coin.image} alt={coin.name} className="h-6 w-6 rounded-full" />
                  <span>{coin.name}</span>
                  <span className="text-muted-foreground ml-1">
                    ({coin.symbol.toUpperCase()})
                  </span>
                  <span className="ml-auto text-muted-foreground">
                    ${coin.current_price.toLocaleString()}
                  </span>
                </CommandItem>)}
            </CommandGroup>}
        </CommandList>
      </CommandDialog>
    </>;
};
export default SearchBar;