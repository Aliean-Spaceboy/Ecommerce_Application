import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronDown, ShoppingBag, X } from "lucide-react";
import productService from "../services/productService";
import cartService from "../services/cartService";
import { toast } from "sonner";

// Brutalist Fallback image handling
const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div className={`bg-muted flex items-center justify-center text-muted-foreground ${className}`}>
        <span className="text-sm font-bold uppercase tracking-widest">Image Unavailable</span>
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  );
};

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("All Collection");
  
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  
  // Filtering & Sorting State
  const [sortBy, setSortBy] = useState("featured");

  const applyFiltersAndSort = (products, search, sort) => {
    let filtered = [...products];
    
    if (search) {
      filtered = filtered.filter(p => 
        (p.productName && p.productName.toLowerCase().includes(search)) || 
        (p.description && p.description.toLowerCase().includes(search))
      );
    }
    
    if (sort === "price-asc") {
      filtered.sort((a, b) => (a.unitPrice || 0) - (b.unitPrice || 0));
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => (b.unitPrice || 0) - (a.unitPrice || 0));
    }
    
    setDisplayedProducts(filtered);
  };

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
      // Fetch category name
      productService.getCategories().then(res => {
        let cData = res?.data?.data || res?.data || [];
        if (Array.isArray(cData)) {
          const cat = cData.find(c => c.id.toString() === id.toString());
          if (cat) setCategoryName(cat.categoryName);
        }
      });
    } else {
      productService.getProducts().then(handleResponse).catch(handleError).finally(() => setIsLoading(false));
      setCategoryName(searchQuery ? `Results for "${searchQuery}"` : "All Collection");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, searchQuery]);

  useEffect(() => {

    applyFiltersAndSort(allProducts, searchQuery, sortBy);
  }, [allProducts, searchQuery, sortBy]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    try {
      cartService.addToCart(product);
      toast.success(`${product.productName || 'Product'} added to cart`);
    } catch {
      toast.error("Unable to add product to cart. Please try again.");
    }
  };

  const clearSearch = () => {
    navigate('/products');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Header Section */}
      <section className="w-full bg-secondary border-b-[3px] border-border py-12 px-4 md:px-8">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center text-sm font-bold uppercase tracking-widest text-foreground">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span>Products</span>
            {id && (
              <>
                <span className="mx-2">/</span>
                <span className="text-accent">{categoryName}</span>
              </>
            )}
          </div>
          
          <h1 
            className="text-4xl md:text-6xl font-heading font-black text-foreground uppercase tracking-tight drop-shadow-sm mb-4"
            style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
          >
            {categoryName}
          </h1>
          
          <div className="inline-block px-4 py-2 bg-primary text-on-primary font-bold uppercase tracking-widest border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {displayedProducts.length} {displayedProducts.length === 1 ? 'Item' : 'Items'}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8">
          
          {/* Toolbar (Controls) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-6 bg-white border-[3px] border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            
            {/* Active Filters */}
            <div className="flex flex-wrap gap-3 items-center flex-1">
              <span className="font-bold uppercase text-sm">Active Filters:</span>
              {searchQuery && (
                <div className="flex items-center gap-2 px-3 py-1 bg-accent text-on-accent font-bold text-sm uppercase border-[2px] border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span>Search: {searchQuery}</span>
                  <button onClick={clearSearch} className="hover:opacity-75 focus:outline-none" aria-label="Clear Search">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {!searchQuery && (
                <span className="text-sm font-medium text-muted-foreground uppercase">None</span>
              )}
            </div>

            {/* Sort & Tools */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 sm:w-64">
                <select 
                  className="w-full appearance-none bg-white border-[3px] border-border rounded-none px-4 py-3 pr-10 text-sm font-bold uppercase text-primary focus:outline-none focus:ring-2 focus:ring-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Sort: Price (Low - High)</option>
                  <option value="price-desc">Sort: Price (High - Low)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none font-bold" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse flex flex-col p-4 bg-white border-[3px] border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-96">
                  <div className="bg-muted w-full h-48 mb-4 border-[3px] border-border" />
                  <div className="bg-muted w-3/4 h-6 mb-2" />
                  <div className="bg-muted w-1/2 h-4 mb-4" />
                  <div className="mt-auto bg-muted w-full h-12 border-[3px] border-border" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-20 px-4 bg-secondary border-[3px] border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-heading font-black text-foreground mb-4 uppercase">No Products Found</h2>
              <p className="text-lg text-foreground mb-8 max-w-lg mx-auto font-bold">We couldn't find any items matching your current filters or search query.</p>
              <button 
                onClick={() => { setSortBy("featured"); clearSearch(); }}
                className="btn btn-primary text-lg px-8 py-4 uppercase font-bold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="group flex flex-col card card-interactive p-0 overflow-hidden bg-white"
                >
                  <Link to={`/products/${product.id}`} className="relative aspect-[3/4] border-b-[3px] border-border bg-muted overflow-hidden">
                    <ImageWithFallback 
                      src={product.imageUrl} 
                      alt={product.productName} 
                      className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-col flex-1 p-5 bg-white">
                    <h3 className="text-xl font-heading font-black text-foreground mb-1 uppercase leading-tight line-clamp-1">
                      <Link to={`/products/${product.id}`} className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        {product.productName}
                      </Link>
                    </h3>
                    <p className="text-sm text-foreground/80 mb-4 line-clamp-2 font-medium">
                      {product.description || "Premium product"}
                    </p>
                    <div className="font-black text-2xl text-foreground mb-6">
                      ${product.unitPrice}
                    </div>
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="btn btn-primary w-full py-3 mt-auto uppercase font-black text-sm tracking-widest flex justify-center items-center gap-2"
                      aria-label={`Add ${product.productName} to cart`}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
