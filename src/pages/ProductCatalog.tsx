import { useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  Star, 
  MapPin,
  SlidersHorizontal 
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  "All Categories", "Pottery", "Textiles", "Jewelry", "Woodworking", 
  "Metalwork", "Glass Art", "Leather", "Fiber Arts", "Ceramics"
];

const products = [
  {
    id: 1,
    name: "Handwoven Silk Scarf",
    artisan: "Maya Patel",
    location: "Rajasthan, India",
    price: 89,
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop",
    tags: ["Textiles", "Traditional", "Silk"],
    category: "Textiles",
  },
  {
    id: 2,
    name: "Ceramic Tea Set",
    artisan: "Kenji Tanaka",
    location: "Kyoto, Japan",
    price: 156,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    tags: ["Pottery", "Ceramic", "Tea"],
    category: "Pottery",
  },
  {
    id: 3,
    name: "Carved Wooden Bowl",
    artisan: "Elena Rodriguez",
    location: "Oaxaca, Mexico",
    price: 45,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1610736944350-d3dc11b371b7?w=400&h=300&fit=crop",
    tags: ["Woodwork", "Traditional", "Kitchen"],
    category: "Woodworking",
  },
  {
    id: 4,
    name: "Silver Filigree Jewelry",
    artisan: "João Silva",
    location: "Porto, Portugal",
    price: 234,
    rating: 5.0,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    tags: ["Jewelry", "Silver", "Filigree"],
    category: "Jewelry",
  },
  {
    id: 5,
    name: "Hand-thrown Pottery Vase",
    artisan: "Sarah Chen",
    location: "Portland, USA",
    price: 78,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aaa4c4b0?w=400&h=300&fit=crop",
    tags: ["Pottery", "Modern", "Vase"],
    category: "Pottery",
  },
  {
    id: 6,
    name: "Alpaca Wool Blanket",
    artisan: "Carlos Mendoza",
    location: "Cusco, Peru",
    price: 189,
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop",
    tags: ["Textiles", "Alpaca", "Blanket"],
    category: "Textiles",
  },
];

const ProductCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Discover Unique Crafts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse thousands of handmade treasures from talented artisans worldwide
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 animate-slide-up animate-delay-200">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search crafts, artisans, or materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* Advanced Filters */}
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={viewMode === "grid" 
            ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "flex flex-col gap-4"
          }>
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className={`group hover-lift cursor-pointer overflow-hidden animate-scale-in ${
                  index < 4 ? `animate-delay-${index * 100 + 300}` : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={`${product.name} by ${product.artisan}`}
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === "grid" ? "w-full h-48" : "w-48 h-48"
                    }`}
                  />
                  <button className="absolute top-3 right-3 p-2 bg-background/90 rounded-full hover:bg-background transition-colors shadow-craft-soft hover-glow">
                    <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                  <div className="absolute bottom-3 left-3 flex gap-1">
                    {product.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-background/90">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <CardContent className={viewMode === "grid" ? "p-4" : "p-4 flex-1"}>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{product.artisan} • {product.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    <span className="font-heading text-lg font-semibold text-primary">
                      ${product.price}
                    </span>
                  </div>
                  
                  {viewMode === "list" && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex gap-2">
                        <Button variant="hero" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12 animate-fade-in animate-delay-500">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductCatalog;