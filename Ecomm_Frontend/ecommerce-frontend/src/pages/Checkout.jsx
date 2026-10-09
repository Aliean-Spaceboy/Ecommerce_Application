import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import checkoutService from "../services/checkoutService";
import cartService from "../services/cartService";
import authService from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Lock, CreditCard, ShieldCheck } from "lucide-react";

import { FormField } from "../components/ui/FormField";
import { Button } from "../components/ui/Button";

export default function Checkout() {
  const [form, setForm] = useState({
    houseNum: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cartItems = cartService.getCartItems();
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [cartItems.length, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const customer = authService.getCustomer();
    if (!customer) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    
    setIsSubmitting(true);
    
    const orderData = {
      customerDto: {
        customerId: customer.customerId,
        custName: customer.name,
        custEmail: customer.email,
        phno: customer.phno || 0
      },
      addressDto: {
        city: form.city,
        state: form.state,
        zipcode: form.zipcode,
        street: form.street || "Default",
        houseNum: form.houseNum || "Default"
      },
      orderDto: {
        totalPrice: total,
        totalQuentity: totalQuantity
      },
      orderItemDto: cartItems.map(item => ({
        ...item,
        productId: item.id,
        quentity: item.quantity,
        totalPrice: item.unitPrice * item.quantity
      }))
    };

    checkoutService.placeOrder(orderData)
      .then(res => {
        const orderId = res.data.data.razorPayOrderId;
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Tkel8OXAFdAEsT", // Fallback to safe test key if missing
          amount: total * 100, // Razorpay expects amount in paise
          currency: "INR",
          name: "Luxe Store",
          description: "Test Transaction",
          order_id: orderId,
          handler: function (response) {
            checkoutService.updateOrder({
              razorPayOrderId: response.razorpay_order_id,
              razorPayPaymentId: response.razorpay_payment_id,
              razorPaySignature: response.razorpay_signature
            }).then(updateRes => {
              cartService.clearCart();
              localStorage.setItem("recentOrderTrackingNum", updateRes.data.data.orderTrackingNum);
              navigate("/order-confirmation", { state: { trackingNumber: updateRes.data.data.orderTrackingNum } });
            }).catch(err => {
              console.error(err);
              alert("Payment verification failed");
              setIsSubmitting(false);
            });
          },
          prefill: {
            name: customer.name,
            email: customer.email,
            contact: customer.phno
          },
          theme: {
            color: "#3399cc"
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
            console.error("Payment Failed:", response.error);
            alert("Payment Failed! " + response.error.description);
            setIsSubmitting(false);
        });
        rzp1.open();
      })
      .catch(err => {
        console.error(err);
        alert("Failed to place order.");
        setIsSubmitting(false);
      });
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/cart")} className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-heading font-bold text-primary flex items-center gap-3">
            Secure Checkout <Lock className="h-5 w-5 text-accent" />
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-3/5"
          >
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl font-heading font-bold text-primary mb-6">Shipping Address</h2>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField 
                    label="House / Apt Number"
                    name="houseNum" 
                    onChange={handleChange} 
                    placeholder="e.g. Apt 4B" 
                    required 
                  />
                  <FormField 
                    label="Street Address"
                    name="street" 
                    onChange={handleChange} 
                    placeholder="Enter street name" 
                    required 
                  />
                </div>

                <FormField 
                  label="City"
                  name="city" 
                  onChange={handleChange} 
                  placeholder="Enter city" 
                  required 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField 
                    label="State / Province"
                    name="state" 
                    onChange={handleChange} 
                    placeholder="Enter state" 
                    required 
                  />
                  <FormField 
                    label="Postal / Zip Code"
                    name="zipcode" 
                    onChange={handleChange} 
                    placeholder="Enter zip code" 
                    required 
                  />
                </div>
              </form>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-heading font-bold text-primary mb-6">Payment Method</h2>
              <div className="p-4 border border-accent/30 bg-accent/5 rounded-xl flex items-start gap-4">
                <CreditCard className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h3 className="font-medium text-primary mb-1">Standard Payment</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is a demonstration environment. Your order will be placed using our secure test gateway. No actual charge will be made.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-2/5"
          >
            <div className="bg-primary text-on-primary rounded-2xl p-6 md:p-8 sticky top-24 shadow-xl">
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative shrink-0">
                      <div className="h-16 w-16 bg-white/10 rounded-lg overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-white/20" />
                        )}
                      </div>
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-on-accent text-[10px] font-bold flex items-center justify-center border-2 border-primary">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-medium line-clamp-2 mb-1">{item.productName}</h4>
                      <span className="text-on-primary/70 text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-on-primary/20 pt-6 space-y-4 text-sm font-medium mb-6">
                <div className="flex justify-between">
                  <span className="text-on-primary/70">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-primary/70">Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <div className="border-t border-on-primary/20 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-heading font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-accent text-on-accent h-14 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>Place Order <ShieldCheck className="h-5 w-5" /></>
                )}
              </button>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
