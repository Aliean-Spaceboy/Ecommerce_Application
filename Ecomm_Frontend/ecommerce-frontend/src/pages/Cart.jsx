import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ChevronLeft } from "lucide-react";
import cartService from "../services/cartService";

import { ImageFallback } from "../components/ui/ImageFallback";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cartService.getCartItems());
  }, []);

  const refreshCart = () => {
    setCartItems(cartService.getCartItems());
  };

  const removeItem = (id) => {
    cartService.removeFromCart(id);
    refreshCart();
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    cartService.updateQuantity(id, newQuantity);
    refreshCart();
  };

  const clearCart = () => {
    cartService.clearCart();
    refreshCart();
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.unitPrice * item.quantity),
    0
  );
  
  const shipping = subtotal > 0 ? 0 : 0; // Free shipping for luxury items
  const total = subtotal + shipping;

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary">Shopping Cart</h1>
          <span className="text-muted-foreground font-medium ml-2">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center shadow-sm"
          >
            <div className="h-24 w-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-heading font-semibold text-primary mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Looks like you haven't added any luxury items to your cart yet. Discover our exclusive collections.
            </p>
            <Link 
              to="/products" 
              className="bg-primary text-on-primary h-12 px-8 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md"
            >
              Explore Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-border text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>
                
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id} 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0, padding: 0, margin: 0, overflow: "hidden" }}
                        className="p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 gap-4 md:items-center group"
                      >
                        {/* Product Info */}
                        <div className="col-span-6 flex items-center gap-4">
                          <Link to={`/products/${item.id}`} className="shrink-0 h-24 w-20 md:h-28 md:w-24 bg-muted rounded-lg overflow-hidden border border-border group-hover:shadow-sm transition-all">
                            <ImageFallback 
                              src={item.imageUrl} 
                              alt={item.productName} 
                              className="group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>
                          <div className="flex flex-col">
                            <Link to={`/products/${item.id}`} className="font-heading font-semibold text-primary text-lg hover:text-accent transition-colors line-clamp-2 mb-1">
                              {item.productName}
                            </Link>
                            <span className="text-muted-foreground font-medium">${item.unitPrice}</span>
                          </div>
                        </div>
                        
                        {/* Quantity (Mobile layout adjusts to flex, Desktop is grid) */}
                        <div className="col-span-3 flex justify-between md:justify-center items-center mt-4 md:mt-0">
                          <span className="md:hidden text-muted-foreground text-sm font-medium">Quantity</span>
                          <div className="flex items-center border border-border rounded-full bg-background h-10 w-28">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex-1 flex justify-center text-muted-foreground hover:text-primary transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-medium text-primary text-sm w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex-1 flex justify-center text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Item Total */}
                        <div className="col-span-2 flex justify-between md:justify-end items-center mt-2 md:mt-0">
                          <span className="md:hidden text-muted-foreground text-sm font-medium">Total</span>
                          <span className="font-semibold text-primary text-lg">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        {/* Remove Action */}
                        <div className="col-span-1 flex justify-end mt-4 md:mt-0">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="h-10 w-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="bg-secondary/30 p-4 border-t border-border flex justify-between items-center">
                  <Link to="/products" className="text-sm font-medium text-primary hover:text-accent transition-colors flex items-center gap-1">
                    <ChevronLeft className="h-4 w-4" /> Continue Shopping
                  </Link>
                  <button 
                    onClick={clearCart}
                    className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-heading font-bold text-primary mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm font-medium mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-primary">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Estimate</span>
                    <span className="text-accent uppercase font-bold tracking-wider text-xs">Complimentary</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span className="text-muted-foreground text-xs font-normal">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-primary">Total</span>
                    <span className="text-3xl font-heading font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-primary text-on-primary h-14 rounded-full font-semibold flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-6 text-center text-xs text-muted-foreground">
                  <p>Secure checkout powered by industry standards.</p>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
