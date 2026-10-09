import { motion } from "framer-motion";
import { useState } from "react";
import authService from "../services/authService";
import api from "../services/api";
import { User, Package, Search, Clock, LogOut, ChevronRight } from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const customer = authService.getCustomer();
  const location = useLocation();
  const [trackingNum, setTrackingNum] = useState("");
  const [orderState, setOrderState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const trackNum = location.state?.trackingNumber || localStorage.getItem("recentOrderTrackingNum");
    if (trackNum && customer) {
      setTrackingNum(trackNum);
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/orders/${customer.email}/${trackNum}`);
          if (res.data && res.data.data) {
            setOrderState(res.data.data);
          }
        } catch (err) {
          console.error("Failed to auto-fetch order:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [customer?.email, location.state]);

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-primary">Authentication Required</h2>
          <p className="text-muted-foreground">Please login to view your dashboard.</p>
          <button 
            onClick={() => navigate("/login")}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingNum.trim()) return;
    
    setLoading(true);
    setError("");
    setOrderState(null);
    try {
      const res = await api.get(`/orders/${customer.email}/${trackingNum}`);
      if (res.data && res.data.data) {
        setOrderState(res.data.data);
      } else {
        setError("Order not found or invalid tracking number.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch order. Please check the tracking number.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout && authService.logout();
    authService.clearToken && authService.clearToken();
    navigate("/login");
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">My Account</h1>
            <p className="text-muted-foreground mt-2">Welcome back, {customer.name.split(' ')[0]}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 px-4 py-2 rounded-lg transition-colors w-fit"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                <User className="h-10 w-10" />
              </div>
              
              <h2 className="text-xl font-heading font-bold text-center text-primary mb-6">Profile Details</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex flex-col pb-4 border-b border-border">
                  <span className="text-muted-foreground mb-1">Full Name</span>
                  <span className="font-medium text-primary">{customer.name}</span>
                </div>
                <div className="flex flex-col pb-4 border-b border-border">
                  <span className="text-muted-foreground mb-1">Email Address</span>
                  <span className="font-medium text-primary break-all">{customer.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground mb-1">Phone Number</span>
                  <span className="font-medium text-primary">{customer.phno || "Not provided"}</span>
                </div>
              </div>
              
              <button className="w-full mt-8 bg-secondary/50 hover:bg-secondary text-primary font-medium py-3 rounded-xl transition-colors text-sm">
                Edit Profile
              </button>
            </div>
          </motion.div>

          {/* Main Dashboard Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            
            {/* Track Order Section */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <Package className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-heading font-bold text-primary">Track an Order</h2>
              </div>
              
              <p className="text-muted-foreground text-sm mb-6">
                Enter your order tracking number below to see the current status of your shipment.
              </p>
              
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-accent transition-all text-primary bg-background" 
                    placeholder="e.g. TRK-123456789" 
                    value={trackingNum} 
                    onChange={e => setTrackingNum(e.target.value)} 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-accent text-on-accent h-12 px-8 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center shrink-0 shadow-sm"
                >
                  {loading ? (
                    <span className="animate-pulse">Searching...</span>
                  ) : (
                    "Track Order"
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              
              {/* Order Status Display */}
              {orderState && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-8 border border-border rounded-xl overflow-hidden"
                >
                  <div className="bg-secondary/30 px-6 py-4 border-b border-border flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Tracking Number</p>
                      <p className="font-heading font-semibold text-primary">{orderState.orderTrackingNum}</p>
                    </div>
                    <div className="px-3 py-1 bg-accent/10 text-accent font-semibold text-sm rounded-full flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {orderState.status || "Processing"}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading font-semibold text-primary">Order Summary</h3>
                      <button className="text-sm font-medium text-accent hover:underline flex items-center">
                        View Details <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Items</p>
                        <p className="font-medium text-primary">{orderState.totalQuentity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Price</p>
                        <p className="font-medium text-primary">${orderState.totalPrice}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Estimated Delivery</p>
                        <p className="font-medium text-primary">3-5 Business Days</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 relative pt-8">
                      <div className="absolute top-0 left-0 w-full h-1 bg-border rounded-full" />
                      <div className="absolute top-0 left-0 w-1/3 h-1 bg-accent rounded-full" />
                      
                      <div className="flex justify-between text-xs font-medium mt-2">
                        <span className="text-accent">Confirmed</span>
                        <span className="text-muted-foreground">Shipped</span>
                        <span className="text-muted-foreground">Delivered</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Recent Orders Placeholder */}
            {!orderState && (
              <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8 text-center py-16">
                <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold text-primary mb-2">No Recent Orders</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  You haven't placed any orders recently. When you do, you'll be able to track their status here.
                </p>
              </div>
            )}
            
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
