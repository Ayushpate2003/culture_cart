import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Free to start - no setup fees",
  "AI-powered tools included",
  "Connect to multiple marketplaces",
  "24/7 support and tutorials",
  "No technical skills required",
  "Global customer reach"
];

export const CTASection = () => {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Share Your Craft with the World?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of artisans who have transformed their passion into thriving businesses
            with our AI-powered platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                <span className="text-white/90 font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Right Column - CTA */}
          <div className="text-center lg:text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-craft-deep">
              <h3 className="font-heading text-2xl font-semibold text-white mb-4">
                Start Your Journey Today
              </h3>
              <p className="text-white/80 mb-6">
                Create your artisan profile in under 5 minutes and start showcasing your work to a global audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 group flex-1"
                  asChild
                >
                  <Link to="/signup">
                    Join as Artisan
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-1"
                    >
                      Watch Demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90vw] max-w-3xl p-2 sm:p-4">
                    <DialogTitle className="sr-only">Platform Demo</DialogTitle>
                    <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
                      <video
                        src="/HANDWOVEN SCARF - AUTUMN.mp4"
                        className="h-full w-full"
                        controls
                        autoPlay
                        muted
                        preload="metadata"
                        playsInline
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};