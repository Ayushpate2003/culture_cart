import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Clock, User, Play, BookOpen, Award, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Stories = () => {
  const initialFeaturedStories = [
    {
      id: 1,
      title: "From Grandmother's Attic to Global Recognition",
      description: "How Maria discovered her great-grandmother's pottery wheel and revived a lost family tradition.",
      author: "Maria Rodriguez",
      authorImage: "/placeholder.svg",
      category: "Family Legacy",
      readTime: "8 min read",
      publishDate: "2024-01-15",
      featured: true,
      image: "/Behind the Scenes: A Day in David's Leather Workshop.jpg",
      tags: ["Pottery", "Heritage", "Inspiration"]
    },
    {
      id: 2,
      title: "The Art of Slow Fashion: Weaving Stories into Fabric",
      description: "Emma's journey from fast fashion consumer to sustainable textile artist, one thread at a time.",
      author: "Emma Wilson",
      authorImage: "/placeholder.svg",
      category: "Sustainability",
      readTime: "6 min read",
      publishDate: "2024-01-18",
      featured: true,
      image: "/the-art-of-slow-fashion-weaving-stories-into-fabric.jpg",
      tags: ["Textiles", "Sustainability", "Fashion"]
    }
  ];

  const initialBaseRecentStories = [
    {
      id: 3,
      title: "Behind the Scenes: A Day in David's Leather Workshop",
      description: "From dawn to dusk, follow the meticulous process of crafting premium leather goods.",
      author: "David Chen",
      authorImage: "/placeholder.svg",
      category: "Process",
      readTime: "5 min read",
      publishDate: "2024-01-20",
     image: "/behind-the-scenes-a-day-in-davids-leather-workshop.jpg",
      tags: ["Leather", "Craftsmanship", "Process"]
    },
    {
      id: 4,
      title: "The Science Behind Perfect Glass: Temperature, Time, and Intuition",
      description: "Robert shares the technical mastery and artistic intuition required for glassblowing.",
      author: "Robert Martinez",
      authorImage: "/placeholder.svg",
      category: "Technique",
      readTime: "7 min read",
      publishDate: "2024-01-22",
      image: "/the-science-behind-perfect-glass-temperature-time-and-intuition.jpg",
      tags: ["Glass", "Science", "Art"]
    },
    {
      id: 5,
      title: "Woodworking with Purpose: Creating Furniture that Tells Stories",
      description: "Michael's approach to sustainable woodworking and creating heirloom pieces.",
      author: "Michael Thompson",
      authorImage: "/placeholder.svg",
      category: "Philosophy",
      readTime: "9 min read",
      publishDate: "2024-01-25",
      image: "/woodworking-with-purpose-creating-furniture-that-tells-stories.jpg",
      tags: ["Woodworking", "Sustainability", "Design"]
    },
    {
      id: 6,
      title: "Jewelry as Identity: Crafting Personal Narratives in Silver",
      description: "Sarah explores how custom jewelry becomes a medium for personal storytelling.",
      author: "Sarah Johnson",
      authorImage: "/placeholder.svg",
      category: "Personal",
      readTime: "4 min read",
      publishDate: "2024-01-28",
      image: "/jewelry-as-identity-crafting-personal-narratives-in-silver.jpg",
      tags: ["Jewelry", "Identity", "Custom"]
    }
  ];

  const [userStories, setUserStories] = useState<any[]>([]);
  const [featuredStories, setFeaturedStories] = useState<any[]>(initialFeaturedStories);
  const [baseRecentStories, setBaseRecentStories] = useState<any[]>(initialBaseRecentStories);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const raw = localStorage.getItem("userStories");
    setUserStories(raw ? JSON.parse(raw) : []);
    const userRaw = localStorage.getItem("user");
    try {
      const u = userRaw ? JSON.parse(userRaw) : null;
      setIsAdmin(!!u && u.role === "admin");
    } catch {}
  }, []);

  const handleDelete = (id: number | string, source: "user" | "featured" | "recent") => {
    if (source === "user") {
      const updated = userStories.filter((s) => s.id !== id);
      setUserStories(updated);
      localStorage.setItem("userStories", JSON.stringify(updated));
      return;
    }
    if (source === "featured") {
      setFeaturedStories((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    setBaseRecentStories((prev) => prev.filter((s) => s.id !== id));
  };

  const categories = [
    { name: "All Stories", count: 24, active: true },
    { name: "Family Legacy", count: 6 },
    { name: "Process", count: 8 },
    { name: "Sustainability", count: 5 },
    { name: "Technique", count: 7 },
    { name: "Philosophy", count: 4 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Craft Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the passionate stories behind handcrafted creations. From family traditions 
              to innovative techniques, explore the human narratives that give meaning to craft.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center animate-slide-up animate-delay-200">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={category.active ? "default" : "outline"}
                size="sm"
                className="hover-scale"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Featured Stories */}
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8 animate-slide-up animate-delay-300">
              Featured Stories
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredStories.map((story, index) => (
                <Card key={story.id} className={`hover-lift shadow-craft-soft animate-scale-in animate-delay-${400 + index * 100}`}>
                  <div className="relative h-64 rounded-t-lg overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                        <Play className="w-4 h-4 mr-2" />
                        Read Story
                      </Button>
                      {isAdmin && (
                        <Button size="icon" variant="destructive" onClick={() => handleDelete(story.id, "featured")}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{story.category}</Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {story.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                      {story.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {story.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={story.authorImage} alt={story.author} />
                          <AvatarFallback>{story.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{story.author}</p>
                          <p className="text-xs text-muted-foreground">{story.publishDate}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {story.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Stories */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8 animate-slide-up animate-delay-600">
              Recent Stories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...userStories, ...baseRecentStories].map((story, index) => (
                <Card key={story.id} className={`hover-lift shadow-craft-soft animate-scale-in animate-delay-${700 + index * 100}`}>
                  <div className="relative h-48 rounded-t-lg overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <Badge variant="outline" className="bg-background/20 backdrop-blur-sm border-white/20 text-white mb-2">
                        {story.category}
                      </Badge>
                      {isAdmin && (
                        <Button size="icon" variant="destructive" onClick={() => handleDelete(story.id, userStories.some(u=>u.id===story.id)?"user":"recent")}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer line-clamp-2">
                      {story.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {story.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={story.authorImage} alt={story.author} />
                          <AvatarFallback className="text-xs">{story.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">{story.author}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {story.readTime}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-16 text-center animate-fade-in animate-delay-1000">
            <Card className="max-w-2xl mx-auto shadow-craft-warm">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Share Your Craft Story</CardTitle>
                <CardDescription className="text-lg">
                  Every craftsperson has a unique journey. Share yours and inspire the next generation of makers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="hero" size="lg" className="hover-glow">
                  <Link to="/stories/submit">
                    <Award className="w-5 h-5 mr-2" />
                    Submit Your Story
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Stories;