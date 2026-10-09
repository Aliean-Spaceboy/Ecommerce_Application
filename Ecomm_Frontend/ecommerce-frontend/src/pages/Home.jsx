import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck, Clock } from "lucide-react";
import productService from "../services/productService";

// Fallback image handling
const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div className={`bg-muted flex items-center justify-center text-muted-foreground ${className}`}>
        <span className="text-sm font-medium">Image Not Available</span>
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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getProducts(),
          productService.getCategories()
        ]);
        
        let pData = productsRes?.data?.data || productsRes?.data || [];
        if (!Array.isArray(pData)) pData = [];
        
        let cData = categoriesRes?.data?.data || categoriesRes?.data || [];
        if (!Array.isArray(cData)) cData = [];
        
        // Take just first 4 products for featured section
        setFeaturedProducts(pData.slice(0, 4));
        setCategories(cData);
      } catch (err) {
        console.error("Failed to fetch home data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);



  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex flex-col md:flex-row items-stretch justify-center bg-background border-b-[3px] border-border overflow-hidden">
        <div className="flex-1 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24 bg-secondary">
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-foreground mb-6 uppercase leading-none tracking-tight drop-shadow-md"
            style={{ textShadow: "4px 4px 0px rgba(0,0,0,1)" }}
          >
            <span className="text-on-secondary">Elevate</span> <br />
            <span className="text-on-secondary">Your</span> <br />
            <span className="text-accent">Lifestyle</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground max-w-xl mb-10 font-bold border-l-[4px] border-accent pl-4">
            Discover our curated collection of premium products. Redefining modern luxury for the discerning individual.
          </p>
          <div>
            <Link 
              to="/products" 
              className="btn btn-primary text-lg px-8 py-4 uppercase font-bold"
            >
              Explore Collection
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="flex-1 border-t-[3px] md:border-t-0 md:border-l-[3px] border-border relative min-h-[40vh]">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Fashion" 
            className="absolute inset-0 w-full h-full object-[center_20%] lg:object-[center_15%] filter contrast-125"
          />
        </div>
      </section>



      {/* Featured Categories */}
      <section className="py-24 bg-background border-b-[3px] border-border">
        <div className="container mx-auto px-4">
          <div className="mb-16 border-l-[8px] border-accent pl-6">
            <span className="inline-block px-3 py-1 bg-primary text-on-primary font-bold text-sm uppercase mb-3 tracking-widest border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">01 / Categories</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground uppercase tracking-tight">Curated Categories</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-muted aspect-[4/3] border-[3px] border-border" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 bg-secondary border-[3px] border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-bold text-foreground mb-2 uppercase">Categories Unavailable</h3>
              <p className="text-lg text-foreground max-w-md mx-auto font-medium">Please check back shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category) => (
                <div key={category.id} className="group card card-interactive flex flex-col p-0 overflow-hidden bg-white">
                  <div className="relative aspect-[4/3] border-b-[3px] border-border">
                    <img 
                      src={
                        category.categoryName.toLowerCase() === 'watches' 
                          ? 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop'
                          : category.categoryName.toLowerCase() === 'bags'
                          ? 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'
                          : category.categoryName.toLowerCase() === 'shoes'
                          ? 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'
                          : 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'
                      }
                      alt={category.categoryName} 
                      className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col items-start bg-white">
                    <h3 className="text-2xl font-heading font-black text-foreground mb-4 tracking-wide uppercase">{category.categoryName}</h3>
                    <Link 
                      to={`/category/${category.id}`}
                      className="btn btn-secondary uppercase"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-muted border-b-[3px] border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-l-[8px] border-accent pl-6">
            <div>
              <span className="inline-block px-3 py-1 bg-primary text-on-primary font-bold text-sm uppercase mb-3 tracking-widest border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">02 / Popular</span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground uppercase tracking-tight mb-4">Trending Now</h2>
              <p className="text-foreground max-w-xl font-bold">Our most sought-after pieces, hand-selected for the modern connoisseur.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-4">
                  <div className="bg-background aspect-[3/4] border-[3px] border-border shadow-sm" />
                  <div className="h-6 bg-border w-3/4" />
                  <div className="h-6 bg-border w-1/4" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 bg-background border-[3px] border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-bold text-foreground mb-2 uppercase">Collection Updating</h3>
              <p className="text-lg text-foreground max-w-md mx-auto font-medium">Our trending products are currently being refreshed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col card card-interactive p-0 overflow-hidden bg-white">
                  <Link to={`/products/${product.id}`} className="relative aspect-[3/4] border-b-[3px] border-border bg-muted">
                    <ImageWithFallback 
                      src={product.imageUrl} 
                      alt={product.productName} 
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-col flex-1 p-4 bg-white">
                    <h3 className="text-lg font-heading font-bold text-foreground mb-1 uppercase">
                      <Link to={`/products/${product.id}`} className="hover:text-accent transition-colors line-clamp-1">
                        {product.productName}
                      </Link>
                    </h3>
                    <p className="text-sm text-foreground/80 mb-4 line-clamp-2 font-medium">{product.description || "Premium product"}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-black text-xl text-foreground">
                        ${product.unitPrice}
                      </span>
                      <Link to={`/products/${product.id}`} className="btn btn-primary text-xs py-2 px-4">
                        View
                      </Link>
                    </div>
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
