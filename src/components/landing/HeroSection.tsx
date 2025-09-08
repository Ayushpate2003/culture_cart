import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-crafts.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="./video.mp4" type="video/mp4" />
          {/* Fallback image */}
          <img
            src={heroImage}
            alt="Beautiful artisan crafts showcasing traditional pottery, textiles, and handmade goods"
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-craft-warm border border-white/20">
              <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-accent/20 rounded-full text-accent-foreground mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-xs sm:text-sm font-medium">AI-Powered Craft Platform</span>
              </div>
              
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                <span className="block sm:inline">Showcase Your</span>
                <span className="bg-hero bg-clip-text text-transparent"> Crafts </span>
                <span className="block sm:inline">to the World</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Join thousands of artisans who use AI-powered tools to create stunning product listings, 
                generate compelling stories, and connect with customers globally—no technical skills required.
              </p>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-6 sm:mb-8">
                <div className="flex items-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2" />
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">5,000+ Artisans</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2" />
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">120+ Countries</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2" />
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">AI-Enhanced</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="hero" size="lg" className="group w-full sm:w-auto" asChild>
                  <Link to="/signup">
                    <span className="text-sm sm:text-base">Join as Artisan</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <span className="text-sm sm:text-base">Explore Products</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Stats/Cards */}
          <div className="hidden lg:block">
            <div className="grid gap-4">
              <div className="card-gradient p-6 rounded-2xl shadow-craft-warm">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  AI-Generated Stories
                </h3>
                <p className="text-muted-foreground text-sm">
                  Let AI craft compelling narratives about your work and heritage
                </p>
              </div>
              <div className="card-gradient p-6 rounded-2xl shadow-craft-warm">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Global Marketplace
                </h3>
                <p className="text-muted-foreground text-sm">
                  Connect to Etsy, Shopify, and local marketplaces automatically
                </p>
              </div>
              <div className="card-gradient p-6 rounded-2xl shadow-craft-warm">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Smart Analytics
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get insights on trending products and optimize your sales
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};