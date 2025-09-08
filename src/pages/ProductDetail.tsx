import { useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Star, 
  MapPin,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  MessageCircle,
  Camera,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: 1,
    name: "Handwoven Silk Scarf",
    artisan: {
      name: "Maya Patel",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
      location: "Rajasthan, India",
      rating: 4.9,
      totalProducts: 127,
      yearsActive: 8,
    },
    price: 89,
    originalPrice: 120,
    rating: 4.9,
    reviews: 127,
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&h=600&fit=crop",
    ],
    tags: ["Textiles", "Traditional", "Silk", "Handwoven"],
    description: "This exquisite silk scarf represents centuries of traditional weaving techniques passed down through generations. Each thread is carefully selected and woven by hand using time-honored methods that create the unique texture and lustrous finish that makes this piece truly special.",
    specifications: {
      "Material": "100% Pure Mulberry Silk",
      "Dimensions": "70cm x 200cm",
      "Weight": "45g",
      "Care": "Dry clean only",
      "Origin": "Rajasthan, India",
      "Technique": "Traditional handloom weaving",
    },
    story: "Maya learned the art of silk weaving from her grandmother, who was renowned throughout Rajasthan for her intricate patterns. This scarf features the 'Desert Bloom' pattern, inspired by the rare flowers that bloom in the Thar Desert after monsoon rains.",
    craftProcess: [
      "Silk threads are hand-selected for quality and color",
      "Traditional dyes are prepared using natural ingredients",
      "Threads are carefully dyed in small batches",
      "The loom is prepared with precise tension",
      "Each scarf takes 3-4 days to complete by hand",
      "Final inspection and gentle finishing"
    ]
  };

  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely stunning! The quality is exceptional and the colors are even more beautiful in person.",
      verified: true,
    },
    {
      id: 2,
      user: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
      rating: 5,
      date: "1 month ago",
      comment: "This scarf is a work of art. Maya's craftsmanship is incredible, and the story behind it makes it even more special.",
      verified: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 animate-fade-in">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/catalog" className="hover:text-foreground transition-colors">Catalog</Link>
              <span>/</span>
              <span className="text-foreground">Textiles</span>
            </div>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Product Images */}
            <div className="animate-slide-up">
              <div className="mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-craft-warm"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden hover-scale ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="animate-slide-up animate-delay-200">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="hover-scale">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground ml-1">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Handmade in {product.artisan.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="font-heading text-3xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                  25% Off
                </Badge>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity and Actions */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <Button variant="hero" size="lg" className="flex-1 hover-glow">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button variant="outline" size="lg" className="hover-scale">
                  <Heart className="w-5 h-5" />
                </Button>
                
                <Button variant="outline" size="lg" className="hover-scale">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary" />
                  <span className="text-sm">30-Day Return</span>
                </div>
              </div>

              {/* Artisan Info */}
              <Card className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={product.artisan.avatar} />
                      <AvatarFallback>MP</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.artisan.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{product.artisan.totalProducts} products</span>
                        <span>{product.artisan.yearsActive} years active</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/artisan/${product.artisan.name}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="animate-fade-in animate-delay-500">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="story">Craft Story</TabsTrigger>
                <TabsTrigger value="process">Process</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold mb-4">Product Specifications</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key}>
                          <dt className="font-medium text-foreground">{key}</dt>
                          <dd className="text-muted-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="story" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold mb-4">The Story Behind This Craft</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{product.story}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Camera className="w-4 h-4" />
                      <span>Generated with AI-powered storytelling</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="process" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold mb-4">Craft Process</h3>
                    <ol className="space-y-3">
                      {product.craftProcess.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{review.user}</h4>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                              )}
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button variant="outline" size="lg" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Write a Review
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;