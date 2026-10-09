import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";


export default function OrderConfirmation() {
  const location = useLocation();
  const { trackingNumber } = location.state || {};

  if (!trackingNumber) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-heading font-semibold text-primary mb-3">No Recent Orders Found</h2>
          <p className="text-muted-foreground mb-8">
            We couldn't find details for your recent order. It may have already been processed.
          </p>
          <Link 
            to="/products" 
            className="inline-flex h-12 items-center justify-center px-8 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl w-full bg-card border border-border rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="bg-primary px-8 py-12 text-center text-on-primary">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent/20 mb-6"
          >
            <CheckCircle2 className="h-12 w-12 text-accent" />
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-on-primary/80 text-lg max-w-md mx-auto">
            Thank you for your purchase. Your premium items are being prepared for shipment.
          </p>
        </div>
        
        <div className="px-8 py-10 md:px-12 text-center">
          <p className="text-muted-foreground mb-8">
            We've sent a confirmation email with your order details. You can track the status of your shipment using the tracking number below.
          </p>
          
          <div className="bg-secondary/30 border border-border rounded-2xl p-6 mb-10 max-w-sm mx-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Tracking Number
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-bold text-primary break-all">
              {trackingNumber}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto h-14 inline-flex items-center justify-center px-8 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-all shadow-md"
            >
              Track Order
            </Link>
            <Link 
              to="/products" 
              className="w-full sm:w-auto h-14 inline-flex items-center justify-center px-8 rounded-full bg-background text-primary border border-border font-medium hover:bg-secondary/50 transition-all"
            >
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
