import { Card, CardContent } from "@/components/ui/card";
import { 
  Wand2, 
  Globe, 
  BarChart3, 
  Camera, 
  MessageSquare, 
  Zap,
  Palette,
  Target
} from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Storytelling",
    description: "Generate compelling product descriptions and craft stories that showcase your heritage and artisanship.",
  },
  {
    icon: Camera,
    title: "Smart Image Enhancement",
    description: "Automatically improve product photos with background removal, lighting adjustments, and quality enhancement.",
  },
  {
    icon: Globe,
    title: "Global Marketplace Integration",
    description: "Connect seamlessly to Etsy, Shopify, Amazon Handmade, and regional marketplaces worldwide.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track sales, views, and engagement with AI-powered insights to optimize your product listings.",
  },
  {
    icon: MessageSquare,
    title: "Multilingual Support",
    description: "Automatically translate your products and stories into multiple languages to reach global customers.",
  },
  {
    icon: Target,
    title: "Smart Recommendations",
    description: "Get AI suggestions on pricing, trending products, and optimal listing times for maximum visibility.",
  },
  {
    icon: Palette,
    title: "Brand Building Tools",
    description: "Create cohesive visual branding with AI-generated logos, color schemes, and marketing materials.",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Launch your online presence in minutes with our guided setup process - no technical skills required.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform provides all the tools and features you need to showcase your crafts,
            tell your story, and reach customers worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-craft-warm transition-craft h-full"
              >
                <CardContent className="p-6 text-center h-full flex flex-col">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};