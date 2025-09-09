import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, MapPin, Palette, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ArtisanSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [locationVal, setLocationVal] = useState("");
  const [craftType, setCraftType] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = () => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user || user.role !== "user") {
      toast({ title: "Login required", description: "Please login as a user before submitting." });
      navigate("/login");
      return;
    }
    const app = {
      id: Date.now(),
      name: `${firstName} ${lastName}`.trim(),
      email,
      location: locationVal,
      specialty: craftType,
      avatar: "/logo.png",
      bio,
      rating: 0,
      totalSales: 0,
      joinedDate: new Date().toISOString().slice(0,10),
      featuredImage: "/placeholder.svg",
      followers: 0,
      verified: false,
    };
    const raw = localStorage.getItem("artisanApplications");
    const list = raw ? JSON.parse(raw) : [];
    localStorage.setItem("artisanApplications", JSON.stringify([app, ...list]));
    toast({ title: "Application submitted", description: "Admin will review your profile." });
    navigate("/dashboard");
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Join Our Artisan Community
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create your profile and start showcasing your beautiful crafts to the world with AI-powered tools
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Profile completion</span>
              <span>30%</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Tell Us About Yourself</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="Your first name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Your last name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location *
                    </Label>
                    <Input id="location" placeholder="City, Country" value={locationVal} onChange={(e)=>setLocationVal(e.target.value)} />
                  </div>

                  {/* Craft Details */}
                  <div>
                    <Label htmlFor="craftType" className="flex items-center">
                      <Palette className="w-4 h-4 mr-1" />
                      Primary Craft Type *
                    </Label>
                    <Input id="craftType" placeholder="e.g., Pottery, Textiles, Woodworking" value={craftType} onChange={(e)=>setCraftType(e.target.value)} />
                  </div>

                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input id="experience" type="number" placeholder="How many years?" value={experience} onChange={(e)=>setExperience(e.target.value)} />
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio" className="flex items-center">
                      Your Story
                      <Wand2 className="w-4 h-4 ml-2 text-primary" />
                      <span className="text-xs text-primary ml-1">AI will help enhance this</span>
                    </Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about your craft journey, heritage, and what inspires your work..."
                      value={bio}
                      onChange={(e)=>setBio(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  {/* Profile Image Upload */}
                  <div>
                    <Label>Profile Photo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        AI will enhance and optimize your photo
                      </p>
                    </div>
                  </div>

                  {/* Workshop Images */}
                  <div>
                    <Label>Workshop/Process Images (Optional)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                          <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">Add image {i}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button variant="hero" size="lg" className="w-full" onClick={handleSubmit}>
                      Create My Artisan Profile
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Features Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">AI Will Help You</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wand2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Enhance Your Story</h4>
                      <p className="text-xs text-muted-foreground">
                        Generate compelling descriptions of your craft heritage
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Upload className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Optimize Photos</h4>
                      <p className="text-xs text-muted-foreground">
                        Professional photo enhancement and background removal
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Pottery", "Textiles", "Jewelry", "Woodworking", "Metalwork", "Glass", "Leather", "Fiber Arts"].map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArtisanSignup;