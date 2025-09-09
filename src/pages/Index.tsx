import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturedSection } from "@/components/landing/FeaturedSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const [approvedArtisans, setApprovedArtisans] = useState<any[]>([]);
  useEffect(() => {
    const approved = JSON.parse(localStorage.getItem("approvedArtisans") || "[]");
    setApprovedArtisans(approved);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSection />
        <FeaturesSection />
        {approvedArtisans.length > 0 && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-2xl font-bold mb-6">Newly Approved Artisans</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedArtisans.slice(0,3).map((a:any) => (
                  <Card key={a.id} className="hover-lift">
                    <div className="h-40 overflow-hidden">
                      <img src={a.featuredImage} alt={a.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{a.name}</h3>
                        <Badge variant="secondary">{a.specialty}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{a.location}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
