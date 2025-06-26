
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, DollarSign, Building, Package } from "lucide-react";

interface FilterSidebarProps {
  priceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
  selectedCompany: string | null;
  onCompanySelect: (company: string | null) => void;
  companies: string[];
  inStockOnly: boolean;
  onStockFilterChange: (inStock: boolean) => void;
}

const FilterSidebar = ({
  priceRange,
  onPriceRangeChange,
  selectedCompany,
  onCompanySelect,
  companies,
  inStockOnly,
  onStockFilterChange,
}: FilterSidebarProps) => {
  return (
    <div className="w-80">
      <Card className="glass-effect border-primary/20 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Price Range</span>
            </div>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={onPriceRangeChange}
                max={5000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Company Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Company</span>
            </div>
            <Select value={selectedCompany || ""} onValueChange={(value) => onCompanySelect(value || null)}>
              <SelectTrigger className="glass-effect border-primary/30">
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-primary/30">
                <SelectItem value="">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Availability</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                checked={inStockOnly}
                onChange={(e) => onStockFilterChange(e.target.checked)}
                className="rounded border-primary/30 bg-transparent"
              />
              <label htmlFor="inStock" className="text-sm">In Stock Only</label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;
