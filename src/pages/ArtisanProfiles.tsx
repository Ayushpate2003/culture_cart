import { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar,
  Award,
  Users,
  Heart,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const artisans = [
  {
    id: 1,
    name: "Maya Patel",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
    location: "Rajasthan, India",
    craft: "Textile Weaving",
    specialty: "Silk Scarves & Shawls",
    rating: 4.9,
    totalProducts: 127,
    totalSales: 2400,
    yearsActive: 8,
    joinedDate: "2016",
    verified: true,
    bio: "Third-generation silk weaver preserving traditional Rajasthani techniques. Specializes in intricate patterns inspired by desert landscapes.",
    tags: ["Traditional", "Silk", "Handloom", "Desert Patterns"],
    featuredImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop",
    followers: 1250,
  },
  {
    id: 2,
    name: "Kenji Tanaka",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    location: "Kyoto, Japan",
    craft: "Ceramics",
    specialty: "Tea Sets & Pottery",
    rating: 4.8,
    totalProducts: 89,
    totalSales: 1800,
    yearsActive: 12,
    joinedDate: "2012",
    verified: true,
    bio: "Master potter combining ancient Japanese techniques with contemporary aesthetics. Each piece reflects the harmony of traditional craftsmanship.",
    tags: ["Ceramics", "Tea Culture", "Minimalist", "Japanese"],
    featuredImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    followers: 890,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    location: "Oaxaca, Mexico",
    craft: "Woodworking",
    specialty: "Carved Bowls & Utensils",
    rating: 4.9,
    totalProducts: 203,
    totalSales: 3200,
    yearsActive: 15,
    joinedDate: "2009",
    verified: true,
    bio: "Award-winning woodcarver creating functional art from sustainable local woods. Passionate about preserving Zapotec carving traditions.",
    tags: ["Woodcarving", "Sustainable", "Zapotec", "Functional Art"],
    featuredImage: "https://images.unsplash.com/photo-1610736944350-d3dc11b371b7?w=300&h=200&fit=crop",
    followers: 2100,
  },
  {
    id: 4,
    name: "João Silva",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    location: "Porto, Portugal",
    craft: "Jewelry Making",
    specialty: "Silver Filigree",
    rating: 5.0,
    totalProducts: 67,
    totalSales: 1500,
    yearsActive: 10,
    joinedDate: "2014",
    verified: true,
    bio: "Master of Portuguese filigree, a delicate art form passed down through generations. Creates intricate jewelry using traditional silver wire techniques.",
    tags: ["Filigree", "Silver", "Portuguese", "Delicate"],
    featuredImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop",
    followers: 756,
  },
  {
    id: 5,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    location: "Portland, USA",
    craft: "Ceramics",
    specialty: "Modern Pottery",
    rating: 4.7,
    totalProducts: 156,
    totalSales: 2100,
    yearsActive: 6,
    joinedDate: "2018",
    verified: false,
    bio: "Contemporary ceramic artist blending traditional techniques with modern design. Focuses on functional pieces that bring joy to everyday life.",
    tags: ["Contemporary", "Functional", "Minimalist", "Eco-friendly"],
    featuredImage: "https://images.unsplash.com/photo-1493663284031-b7e3aaa4c4b0?w=300&h=200&fit=crop",
    followers: 1450,
  },
  {
    id: 6,
    name: "Carlos Mendoza",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    location: "Cusco, Peru",
    craft: "Textile Weaving",
    specialty: "Alpaca Wool Products",
    rating: 4.8,
    totalProducts: 94,
    totalSales: 1900,
    yearsActive: 20,
    joinedDate: "2004",
    verified: true,
    bio: "Indigenous weaver preserving ancient Incan textile traditions. Uses locally sourced alpaca wool to create warm, durable textiles with symbolic patterns.",
    tags: ["Alpaca", "Incan", "Traditional", "Symbolic"],
    featuredImage: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop",
    followers: 980,
  },
];

const ArtisanProfiles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCraft, setSelectedCraft] = useState("All Crafts");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [sortBy, setSortBy] = useState("popular");
  const [approvedArtisans, setApprovedArtisans] = useState<any[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  useEffect(() => {
    const approved = JSON.parse(localStorage.getItem("approvedArtisans") || "[]");
    setApprovedArtisans(approved);
    const removed = JSON.parse(localStorage.getItem("removedArtisanIds") || "[]");
    setRemovedIds(removed);
  }, []);

  const crafts = ["All Crafts", "Textile Weaving", "Ceramics", "Woodworking", "Jewelry Making"];
  const locations = ["All Locations", "Asia", "Europe", "Americas", "Africa"];

  const allArtisans = [...approvedArtisans.map((a:any)=>({
    id: a.id,
    name: a.name,
    avatar: a.avatar,
    location: a.location,
    craft: a.specialty,
    specialty: a.specialty,
    rating: 0,
    totalProducts: 0,
    totalSales: a.totalSales || 0,
    yearsActive: 0,
    joinedDate: a.joinedDate,
    verified: false,
    bio: a.bio,
    tags: [a.specialty],
    featuredImage: a.featuredImage,
    followers: a.followers || 0,
    manageId: `approved-${a.id}`,
  })), ...artisans.map((a:any)=>({ ...a, manageId: `base-${a.id}` }))];

  const visibleArtisans = allArtisans.filter((a:any)=> !removedIds.includes(a.manageId));

  const filteredArtisans = visibleArtisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCraft = selectedCraft === "All Crafts" || artisan.craft === selectedCraft;
    // Simplified location matching for demo
    const matchesLocation = selectedLocation === "All Locations" || true;
    return matchesSearch && matchesCraft && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Meet Our Artisans
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the talented craftspeople behind each unique piece, their stories, and their heritage
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 animate-slide-up animate-delay-200">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search artisans, crafts, or specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Craft Filter */}
              <Select value={selectedCraft} onValueChange={setSelectedCraft}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Craft Type" />
                </SelectTrigger>
                <SelectContent>
                  {crafts.map((craft) => (
                    <SelectItem key={craft} value={craft}>
                      {craft}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
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
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {filteredArtisans.length} of {allArtisans.length} artisans
            </p>
          </div>

          {/* Artisans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map((artisan, index) => (
              <Card 
                key={artisan.id} 
                className={`group hover-lift cursor-pointer overflow-hidden animate-scale-in ${
                  index < 6 ? `animate-delay-${index * 100 + 300}` : ''
                }`}
              >
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={artisan.featuredImage}
                    alt={`${artisan.name}'s work`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Verification Badge */}
                  {artisan.verified && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground">
                        <Award className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  )}
                  
                  {/* Heart Button */}
                  <button className="absolute top-3 left-3 p-2 bg-background/90 rounded-full hover:bg-background transition-colors shadow-craft-soft hover-glow">
                    <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </div>
                
                <CardContent className="p-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                      <AvatarImage src={artisan.avatar} />
                      <AvatarFallback>{artisan.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {artisan.name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{artisan.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{artisan.rating}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{artisan.followers}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Craft Info */}
                  <div className="mb-4">
                    <p className="font-medium text-foreground mb-1">{artisan.craft}</p>
                    <p className="text-sm text-muted-foreground mb-2">{artisan.specialty}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {artisan.bio}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {artisan.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{artisan.totalProducts}</p>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{artisan.totalSales}</p>
                      <p className="text-xs text-muted-foreground">Sales</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{artisan.yearsActive}y</p>
                      <p className="text-xs text-muted-foreground">Experience</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="hero" size="sm" className="flex-1" asChild>
                      <Link to={`/artisan/${artisan.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="hover-scale">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12 animate-fade-in animate-delay-500">
            <Button variant="outline" size="lg">
              Load More Artisans
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArtisanProfiles;