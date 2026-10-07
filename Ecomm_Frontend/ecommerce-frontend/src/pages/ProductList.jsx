import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, ShoppingBag } from "lucide-react";
import productService from "../services/productService";
import cartService from "../services/cartService";

import { ImageFallback } from "../components/ui/ImageFallback";
import { DataFallback } from "../components/ui/DataFallback";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { Button } from "../components/ui/Button";

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("All Collection");
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filtering & Sorting State
  const [sortBy, setSortBy] = useState("featured"); // featured, price-asc, price-desc
  
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    setIsLoading(true);
    
    const handleResponse = (res) => {
      let data = res?.data?.data || res?.data || [];
      if (!Array.isArray(data)) data = [];
      setAllProducts(data);
      applyFiltersAndSort(data, searchQuery, sortBy);
    };
    
    const handleError = (err) => {
      console.error(err);
      setAllProducts([]);
      setDisplayedProducts([]);
    };

    if (id) {
      productService.getProductsByCategory(id).then(handleResponse).catch(handleError).finally(() => setIsLoading(false));
      // Try to fetch category name
      productService.getCategories().then(res => {
        let cData = res?.data?.data || res?.data || [];
        if (Array.isArray(cData)) {
          const cat = cData.find(c => c.id.toString() === id.toString());
          if (cat) setCategoryName(cat.categoryName);
        }
      });
    } else {
      productService.getProducts().then(handleResponse).catch(handleError).finally(() => setIsLoading(false));
      setCategoryName(searchQuery ? `Search Results for "${searchQuery}"` : "All Collection");
    }
  }, [id, searchQuery]);

  // Handle local sorting and filtering
  useEffect(() => {
    applyFiltersAndSort(allProducts, searchQuery, sortBy);
  }, [allProducts, searchQuery, sortBy]);

  const applyFiltersAndSort = (products, search, sort) => {
    let filtered = [...products];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(p => 
        (p.productName && p.productName.toLowerCase().includes(search)) || 
        (p.description && p.description.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    if (sort === "price-asc") {
      filtered.sort((a, b) => (a.unitPrice || 0) - (b.unitPrice || 0));
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => (b.unitPrice || 0) - (a.unitPrice || 0));
    }
    
    setDisplayedProducts(filtered);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    cartService.addToCart(product);
    // Could add a toast notification here
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 mb-8 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
              {categoryName}
            </h1>
            <p className="text-muted-foreground text-sm">
              {displayedProducts.length} {displayedProducts.length === 1 ? 'Product' : 'Products'} Available
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                className="appearance-none bg-transparent border border-border rounded-full px-6 py-2 pr-10 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 border border-border rounded-full px-6 py-2 text-sm font-medium text-primary hover:bg-secondary/50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
        
        {/* Filter Drawer Overlay */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-40"
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[300px] sm:w-[400px] bg-card z-50 shadow-xl border-l border-border flex flex-col"
              >
                <div className="p-6 flex items-center justify-between border-b border-border">
                  <h2 className="font-heading text-2xl font-bold text-primary">Filters</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="text-muted-foreground hover:text-primary p-2">
                    <span className="sr-only">Close filters</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div>
                    <h3 className="font-medium text-primary mb-4">Sort By</h3>
                    <select 
                      className="w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-4">Search Context</h3>
                    {searchQuery ? (
                      <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                        <span className="text-sm">"{searchQuery}"</span>
                        <Link to="/products" className="text-sm text-accent hover:underline">Clear</Link>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No active search.</p>
                    )}
                  </div>
                </div>
                <div className="p-6 border-t border-border mt-auto">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setSortBy("featured");
                      if (searchQuery) window.location.href = '/products';
                    }}
                    variant="secondary"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <LoadingSkeleton type="product-card" count={8} />
          </div>
        ) : displayedProducts.length === 0 ? (
          <DataFallback 
            type="empty"
            title="No products found"
            message="We couldn't find any products matching your current criteria. Try adjusting your search or filters."
            actionText="Clear all filters"
            onAction={() => window.location.href = '/products'}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {displayedProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col"
                >
                  <Link to={`/products/${product.id}`} className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-muted border border-border/50 shadow-sm group-hover:shadow-md transition-all">
                    <ImageFallback 
                      src={product.imageUrl} 
                      alt={product.productName} 
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover overlay with Add to Cart button */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full bg-primary text-on-primary font-medium py-3 rounded-full flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-primary/90"
                      >
                        <ShoppingBag className="h-4 w-4" /> Add to Cart
                      </button>
                    </div>
                  </Link>
                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-heading font-semibold text-primary mb-1">
                      <Link to={`/products/${product.id}`} className="hover:text-accent transition-colors line-clamp-1">
                        {product.productName}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {product.description || "Premium product"}
                    </p>
                    <div className="mt-auto font-medium text-lg text-primary">
                      ${product.unitPrice}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
