
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Busca tecnología de vanguardia..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 pr-4 py-4 text-lg glass-effect border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 neon-glow"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl opacity-30 rounded-lg"></div>
    </div>
  );
};

export default SearchBar;
