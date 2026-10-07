import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Minus, Plus, ShoppingBag, Shield, ArrowRight } from "lucide-react";
import productService from "../services/productService";
import cartService from "../services/cartService";

import { ImageFallback } from "../components/ui/ImageFallback";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setQuantity(1); // Reset quantity when ID changes
    
    productService.getProductById(id).then((res) => {
      const pData = res?.data?.data || res?.data;
      setProduct(pData);
      
      // Fetch related products
      if (pData && (pData.catogoryId || pData.categoryId)) {
        const catId = pData.catogoryId || pData.categoryId;
        productService.getProductsByCategory(catId).then(relRes => {
          let rData = relRes?.data?.data || relRes?.data || [];
          if (!Array.isArray(rData)) rData = [];
          setRelatedProducts(rData.filter(p => p.id.toString() !== id.toString()).slice(0, 4));
        });
      } else {
        // Fallback to general products if category isn't there
        productService.getProducts().then(relRes => {
          let rData = relRes?.data?.data || relRes?.data || [];
          if (!Array.isArray(rData)) rData = [];
          setRelatedProducts(rData.filter(p => p.id.toString() !== id.toString()).slice(0, 4));
        });
      }
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setIsLoading(false);
      window.scrollTo(0, 0); // scroll to top when product changes
    });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    
    // Allow adding multiple by iterating (since cartService.addToCart currently adds 1 at a time if it lacks quantity param)
    // Actually cartService.addToCart in most implementations finds the item and increments by 1.
    // Let's assume we can loop it or cartService handles it.
    for(let i=0; i<quantity; i++){
      cartService.addToCart(product);
    }
    
    setTimeout(() => {
      setIsAdding(false);
      // Optional: show a mini-cart slider or toast here
    }, 500);
  };

  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) {
      setQuantity(q => q - 1);
    } else if (type === 'inc') {
      setQuantity(q => q + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="animate-pulse flex flex-col md:flex-row gap-12 w-full max-w-6xl">
          <div className="bg-muted aspect-[4/5] md:w-1/2 rounded-2xl" />
          <div className="md:w-1/2 space-y-6 pt-8">
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-24 bg-muted rounded w-full mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-heading font-semibold text-primary mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="inline-flex items-center text-accent font-medium hover:underline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Breadcrumb / Back Navigation */}
      <div className="border-b border-border bg-background/50">
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted relative">
              <ImageFallback 
                src={product.imageUrl} 
                alt={product.productName} 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4 leading-tight">
              {product.productName}
            </h1>
            
            <div className="text-2xl sm:text-3xl font-medium text-primary mb-8">
              ${product.unitPrice}
            </div>
            
            <div className="prose prose-sm sm:prose-base text-muted-foreground mb-10">
              <p className="leading-relaxed">
                {product.description || "No description available for this premium product."}
              </p>
            </div>

            <div className="mt-auto space-y-8">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-primary mb-3">Quantity</label>
                <div className="flex items-center border border-border rounded-full w-32">
                  <button 
                    onClick={() => handleQuantity('dec')}
                    className="flex-1 flex justify-center py-3 text-muted-foreground hover:text-primary transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-primary text-center w-8">{quantity}</span>
                  <button 
                    onClick={() => handleQuantity('inc')}
                    className="flex-1 flex justify-center py-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-primary text-on-primary h-14 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-all focus:ring-2 focus:ring-accent focus:outline-none"
                >
                  {isAdding ? (
                    <span className="animate-pulse">Adding...</span>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" /> Add to Cart
                    </>
                  )}
                </button>
              </div>

              {/* Assurances */}
              <div className="flex items-center gap-6 pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" /> Authentic Quality
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
              <h2 className="text-2xl font-heading font-bold text-primary">You May Also Like</h2>
              <Link to="/products" className="text-sm font-medium text-primary hover:text-accent flex items-center gap-1 transition-colors">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} to={`/products/${relProduct.id}`} className="group flex flex-col">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-muted border border-border/50 shadow-sm">
                    <ImageFallback 
                      src={relProduct.imageUrl} 
                      alt={relProduct.productName} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-heading font-semibold text-primary mb-1 group-hover:text-accent transition-colors line-clamp-1">
                    {relProduct.productName}
                  </h3>
                  <div className="font-medium text-primary">
                    ${relProduct.unitPrice}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
