
import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilters from "@/components/CategoryFilters";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import AIAssistantButton from "@/components/AIAssistantButton";
import { mockProducts, categories, companies, Product } from "@/data/mockProducts";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesCompany = !selectedCompany || product.company === selectedCompany;
      const matchesStock = !inStockOnly || product.stock > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesCompany && matchesStock;
    });
  }, [searchTerm, selectedCategory, priceRange, selectedCompany, inStockOnly]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 tech-gradient bg-clip-text text-transparent">
            TechMosaic
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover the Future of Technology
          </p>
          
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block">
            <FilterSidebar
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedCompany={selectedCompany}
              onCompanySelect={setSelectedCompany}
              companies={companies}
              inStockOnly={inStockOnly}
              onStockFilterChange={setInStockOnly}
            />
          </aside>

          {/* Product Grid */}
          <section className="flex-1">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} products
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="glass-effect border-primary/20 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold mb-4">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters to find what you're looking for.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Floating AI Assistant Button */}
      <AIAssistantButton />
    </div>
  );
};

export default Index;
