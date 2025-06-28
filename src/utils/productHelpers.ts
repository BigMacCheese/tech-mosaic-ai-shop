
import { Product } from "@/hooks/useProducts";

export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = products.map(product => product.type);
  return [...new Set(categories)];
};

export const getUniqueCompanies = (products: Product[]): string[] => {
  const companies = products.map(product => product.company);
  return [...new Set(companies)];
};

export const filterProducts = (
  products: Product[],
  searchTerm: string,
  selectedCategory: string | null,
  priceRange: number[],
  selectedCompany: string | null,
  inStockOnly: boolean
): Product[] => {
  return products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.type === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCompany = !selectedCompany || product.company === selectedCompany;
    const matchesStock = !inStockOnly || product.stock > 0;

    return matchesSearch && matchesCategory && matchesPrice && matchesCompany && matchesStock;
  });
};
