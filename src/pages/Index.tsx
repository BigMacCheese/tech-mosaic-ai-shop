
import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilters from "@/components/CategoryFilters";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import AIAssistantButton from "@/components/AIAssistantButton";
import EmbeddingInitializer from "@/components/EmbeddingInitializer";
import { useProducts, Product } from "@/hooks/useProducts";
import { getUniqueCategories, getUniqueCompanies, filterProducts } from "@/utils/productHelpers";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: products = [], isLoading, error } = useProducts();

  // Get unique categories and companies from products
  const categories = useMemo(() => getUniqueCategories(products), [products]);
  const companies = useMemo(() => getUniqueCompanies(products), [products]);

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    return filterProducts(products, searchTerm, selectedCategory, priceRange, selectedCompany, inStockOnly);
  }, [products, searchTerm, selectedCategory, priceRange, selectedCompany, inStockOnly]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error al cargar productos</h2>
          <p className="text-muted-foreground">No se pudieron cargar los productos. Intenta recargar la página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Embedding Initializer */}
      <EmbeddingInitializer />
      
      {/* Header */}
      <header className="py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 tech-gradient bg-clip-text text-transparent">
            TechStock
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Descubre el Futuro de la Tecnología
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
              {isLoading ? (
                <p className="text-muted-foreground">Cargando productos...</p>
              ) : (
                <p className="text-muted-foreground">
                  Mostrando {filteredProducts.length} productos
                </p>
              )}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="glass-effect border-primary/20 rounded-lg p-6 animate-pulse">
                    <div className="bg-muted rounded-lg h-48 mb-4"></div>
                    <div className="bg-muted rounded h-4 mb-2"></div>
                    <div className="bg-muted rounded h-4 w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="glass-effect border-primary/20 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold mb-4">No se encontraron productos</h3>
                  <p className="text-muted-foreground">
                    Intenta ajustar tus criterios de búsqueda o filtros para encontrar lo que buscas.
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
        onProductClick={handleProductClick}
      />

      {/* Floating AI Assistant Button */}
      <AIAssistantButton selectedProduct={selectedProduct} />
    </div>
  );
};

export default Index;
