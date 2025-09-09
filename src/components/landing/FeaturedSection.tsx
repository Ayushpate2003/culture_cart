import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, MapPin } from "lucide-react";

const featuredProducts = [
  {
    id: 1,
    name: "Handwoven Silk Scarf",
    artisan: "Maya Patel",
    location: "Rajasthan, India",
    price: "$89",
    rating: 4.9,
    image: "/Handwoven Silk Scarf.jpg",
    tags: ["Textiles", "Traditional", "Silk"],
  },
  {
    id: 2,
    name: "Ceramic Tea Set",
    artisan: "Kenji Tanaka",
    location: "Kyoto, Japan",
    price: "$156",
    rating: 4.8,
    image: "/Ceramic Tea Set.jpg",
    tags: ["Pottery", "Ceramic", "Tea"],
  },
  {
    id: 3,
    name: "Carved Wooden Bowl",
    artisan: "Elena Rodriguez",
    location: "Oaxaca, Mexico",
    price: "$45",
    rating: 4.9,
    image: "/Carved Wooden Bowl.jpg",
    tags: ["Woodwork", "Traditional", "Kitchen"],
  },
  {
    id: 4,
    name: "Silver Filigree Jewelry",
    artisan: "João Silva",
    location: "Porto, Portugal",
    price: "$234",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    tags: ["Jewelry", "Silver", "Filigree"],
  },
];

export const FeaturedSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
            Featured Crafts
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover unique handmade pieces from talented artisans around the world
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-craft-warm transition-craft cursor-pointer overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={`${product.name} by ${product.artisan}`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-craft-soft">
                  <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500 transition-colors" />
                </button>
              </div>
              
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                  {product.name}
                </h3>
                
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{product.artisan} • {product.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="font-heading text-lg font-semibold text-primary">
                    {product.price}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};