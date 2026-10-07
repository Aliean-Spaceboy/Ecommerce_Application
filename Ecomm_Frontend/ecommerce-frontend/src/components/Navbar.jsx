import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, Search, Menu, X, LogOut } from "lucide-react";
import { getToken, clearToken } from "../utils/authStorage";
import cartService from "../services/cartService";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Update cart count (simple interval polling for now to avoid refactoring global state management yet)
  useEffect(() => {
    const updateCartCount = () => {
      const items = cartService.getCartItems();
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    };
    updateCartCount();
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-on-primary font-heading text-2xl md:text-3xl font-bold tracking-tight shrink-0 transition-opacity hover:opacity-80">
          LUXE
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary/50 border border-secondary text-sm text-on-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </form>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-on-primary">
          <Link to="/products" className="text-sm font-medium hover:text-accent transition-colors">
            Shop
          </Link>
          
          <div className="h-4 w-px bg-secondary" />

          <Link to="/cart" className="relative group flex items-center gap-2 hover:text-accent transition-colors">
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-on-accent">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm font-medium sr-only lg:not-sr-only">Cart</span>
          </Link>

          {token ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 hover:text-accent transition-colors">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium sr-only lg:not-sr-only">Account</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-muted hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only lg:not-sr-only">Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-accent transition-colors">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle & Cart */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/cart" className="relative text-on-primary">
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-on-accent">
                {cartCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-on-primary p-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-primary/95 backdrop-blur absolute w-full h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 space-y-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-lg bg-secondary/50 border border-secondary text-base text-on-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </form>

            <div className="flex flex-col space-y-4">
              <Link to="/products" className="text-lg font-medium text-on-primary hover:text-accent py-2 border-b border-secondary/30">
                Shop All
              </Link>
              
              {token ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-3 text-lg font-medium text-on-primary hover:text-accent py-2 border-b border-secondary/30">
                    <User className="h-5 w-5" /> Account
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 text-lg font-medium text-destructive hover:opacity-80 py-2 w-full text-left">
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-3 text-lg font-medium text-on-primary hover:text-accent py-2 border-b border-secondary/30">
                  <User className="h-5 w-5" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
