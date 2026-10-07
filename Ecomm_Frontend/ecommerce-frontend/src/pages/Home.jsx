import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.1 }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-on-primary mb-6 tracking-tight"
          >
            Elevate Your <br className="hidden md:block" /> Lifestyle
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-on-primary/80 max-w-2xl mx-auto mb-10 font-medium"
          >
            Discover our curated collection of premium products. Redefining modern luxury for the discerning individual.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              to="/products" 
              className="inline-flex items-center justify-center h-14 px-8 text-base font-semibold rounded-full bg-accent text-on-accent hover:opacity-90 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-border">
            <div className="flex flex-col items-center justify-center p-4">
              <Shield className="h-6 w-6 text-accent mb-3" />
              <h3 className="font-semibold text-sm">Secure Checkout</h3>
              <p className="text-xs text-muted-foreground mt-1">100% Protected</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <Truck className="h-6 w-6 text-accent mb-3" />
              <h3 className="font-semibold text-sm">Express Shipping</h3>
              <p className="text-xs text-muted-foreground mt-1">Global Delivery</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <Star className="h-6 w-6 text-accent mb-3" />
              <h3 className="font-semibold text-sm">Premium Quality</h3>
              <p className="text-xs text-muted-foreground mt-1">Curated Brands</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <Clock className="h-6 w-6 text-accent mb-3" />
              <h3 className="font-semibold text-sm">24/7 Support</h3>
              <p className="text-xs text-muted-foreground mt-1">Always Here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Curated Categories</h2>
            <div className="w-16 h-1 bg-accent mx-auto" />
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-muted aspect-[4/5] rounded-xl" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Categories Currently Unavailable</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">We are updating our catalog. Please check back shortly for our curated selections.</p>
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {categories.slice(0, 3).map((category, index) => (
                <motion.div key={category.id} variants={fadeIn} className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors duration-500 z-10" />
                  <img 
                    src={`https://images.unsplash.com/photo-${index === 0 ? '1618365908648-e71bc12cb815' : index === 1 ? '1605810230434-7631ac76ec81' : '1523275335684-37898b6baf30'}?q=80&w=800&auto=format&fit=crop`}
                    alt={category.categoryName} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-2xl font-heading font-bold text-on-primary mb-4 tracking-wide">{category.categoryName}</h3>
                    <Link 
                      to={`/category/${category.id}`}
                      className="inline-flex items-center text-sm font-medium text-on-primary border-b border-on-primary pb-1 hover:text-accent hover:border-accent transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <motion.div {...fadeIn}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Trending Now</h2>
              <p className="text-muted-foreground max-w-xl">Our most sought-after pieces, hand-selected for the modern connoisseur.</p>
            </motion.div>
            <motion.div {...fadeIn} className="mt-6 md:mt-0">
              <Link to="/products" className="inline-flex items-center text-primary font-medium hover:text-accent transition-colors">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-4">
                  <div className="bg-muted aspect-[3/4] rounded-xl" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-xl border border-dashed border-border shadow-sm">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Featured Collection Updating</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">Our trending products are currently being refreshed for the new season.</p>
              <Link to="/products" className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium rounded-full bg-primary text-on-primary hover:opacity-90 transition-opacity">
                Browse Full Catalog
              </Link>
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeIn} className="group flex flex-col">
                  <Link to={`/products/${product.id}`} className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-muted">
                    <ImageWithFallback 
                      src={product.imageUrl} 
                      alt={product.productName} 
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                  </Link>
                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-heading font-semibold text-primary mb-1">
                      <Link to={`/products/${product.id}`} className="hover:text-accent transition-colors line-clamp-1">
                        {product.productName}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description || "Premium product"}</p>
                    <div className="mt-auto font-medium text-lg text-primary">
                      ${product.unitPrice}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
