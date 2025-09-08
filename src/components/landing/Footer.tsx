import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  platform: [
    { name: "How it Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Features", href: "/features" },
    { name: "Success Stories", href: "/stories" },
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "API Documentation", href: "/api" },
    { name: "Community", href: "/community" },
  ],
  marketplace: [
    { name: "Explore Products", href: "/catalog" },
    { name: "Find Artisans", href: "/artisans" },
    { name: "Categories", href: "/categories" },
    { name: "New Arrivals", href: "/new" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Contact", href: "/contact" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-background/95 backdrop-blur-md border-t border-border text-foreground shadow-craft-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4 hover-lift">
              <img src="/logo.png" alt="CultureCart" className="w-10 h-10 rounded-lg shadow-craft-soft object-contain" />
              <span className="font-heading text-xl font-semibold text-foreground">
                CultureCart
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm font-medium">
              Empowering artisans worldwide with AI-powered tools to showcase their crafts and connect with global markets.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center hover-lift p-2 rounded-md hover:bg-accent/50 transition-craft">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <span className="text-foreground font-medium">hello@culturecart.com</span>
              </div>
              <div className="flex items-center hover-lift p-2 rounded-md hover:bg-accent/50 transition-craft">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span className="text-foreground font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center hover-lift p-2 rounded-md hover:bg-accent/50 transition-craft">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <span className="text-foreground font-medium">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-craft text-sm font-medium hover-lift p-1 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-craft text-sm font-medium hover-lift p-1 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Marketplace</h3>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-craft text-sm font-medium hover-lift p-1 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-craft text-sm font-medium hover-lift p-1 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm font-medium">
            © 2024 CultureCart. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-craft font-medium hover-lift p-1 rounded">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-craft font-medium hover-lift p-1 rounded">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-muted-foreground hover:text-primary text-sm transition-craft font-medium hover-lift p-1 rounded">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};