import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary border-t border-secondary/20">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold tracking-tight mb-6">LUXE</h2>
            <p className="text-on-primary/70 text-sm leading-relaxed max-w-sm">
              Curating the world's most exceptional products. Redefining modern luxury for the discerning individual who appreciates unparalleled quality and timeless design.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-on-primary/70 hover:text-accent transition-colors">
                <span className="text-sm font-medium">Follow Us</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-on-primary/70 hover:text-accent transition-colors text-sm">All Products</Link>
              </li>
              <li>
                <Link to="/category/1" className="text-on-primary/70 hover:text-accent transition-colors text-sm">Electronics</Link>
              </li>
              <li>
                <Link to="/category/2" className="text-on-primary/70 hover:text-accent transition-colors text-sm">Fashion</Link>
              </li>
              <li>
                <Link to="/category/3" className="text-on-primary/70 hover:text-accent transition-colors text-sm">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Customer Care</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-on-primary/70 hover:text-accent transition-colors text-sm">My Account</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-on-primary/70 hover:text-accent transition-colors text-sm">Track Order</Link>
              </li>
              <li>
                <a href="#" className="text-on-primary/70 hover:text-accent transition-colors text-sm">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#" className="text-on-primary/70 hover:text-accent transition-colors text-sm">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-on-primary/70">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <span>123 Luxury Avenue, Design District, NY 10012</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-on-primary/70">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-on-primary/70">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a href="mailto:concierge@luxe.com" className="hover:text-accent transition-colors">concierge@luxe.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-secondary/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-primary/50">
            &copy; {new Date().getFullYear()} LUXE Ecommerce. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-on-primary/50">
            <a href="#" className="hover:text-on-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-on-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-on-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
