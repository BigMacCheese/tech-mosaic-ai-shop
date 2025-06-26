
import { Badge } from "@/components/ui/badge";

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilters = ({ categories, selectedCategory, onCategorySelect }: CategoryFiltersProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <Badge
        variant={selectedCategory === null ? "default" : "outline"}
        className={`cursor-pointer px-6 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
          selectedCategory === null 
            ? "tech-gradient text-white shadow-lg" 
            : "glass-effect border-primary/30 hover:border-primary hover:bg-primary/10"
        }`}
        onClick={() => onCategorySelect(null)}
      >
        All Categories
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className={`cursor-pointer px-6 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
            selectedCategory === category 
              ? "tech-gradient text-white shadow-lg" 
              : "glass-effect border-primary/30 hover:border-primary hover:bg-primary/10"
          }`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilters;
