import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/navigation/Navbar";
import { ArrowLeft, Users, Upload, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddArtisan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    location: "",
    bio: "",
    experience: "",
    website: "",
    socialMedia: "",
    avatar: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Artisan Added Successfully",
        description: `${formData.name} has been registered as a new artisan.`,
      });
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold">Add New Artisan</h1>
            <p className="text-muted-foreground mt-2">
              Register a new artisan to the marketplace
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-craft-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Artisan Information
                </CardTitle>
                <CardDescription>
                  Fill in the artisan's profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter artisan's full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            placeholder="City, State"
                            className="pl-10"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty</Label>
                        <Select onValueChange={(value) => handleInputChange("specialty", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pottery">Pottery & Ceramics</SelectItem>
                            <SelectItem value="leather-crafts">Leather Crafts</SelectItem>
                            <SelectItem value="jewelry">Jewelry Making</SelectItem>
                            <SelectItem value="woodworking">Woodworking</SelectItem>
                            <SelectItem value="textiles">Textile Arts</SelectItem>
                            <SelectItem value="glass-art">Glass Art</SelectItem>
                            <SelectItem value="metalwork">Metalwork</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="number"
                          placeholder="Enter years of experience"
                          value={formData.experience}
                          onChange={(e) => handleInputChange("experience", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about the artisan's background, style, and craftsmanship..."
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Online Presence */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Online Presence (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://artisan-website.com"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socialMedia">Social Media</Label>
                        <Input
                          id="socialMedia"
                          placeholder="@artisan_handle"
                          value={formData.socialMedia}
                          onChange={(e) => handleInputChange("socialMedia", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "Registering..." : "Register Artisan"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-craft-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Profile Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload profile photo (JPG, PNG)
                  </p>
                  <Button variant="outline" size="sm">
                    Choose Photo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-craft-soft">
              <CardHeader>
                <CardTitle>Registration Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Verify artisan credentials and portfolio</p>
                <p>• Ensure quality standards are met</p>
                <p>• Review samples of their work</p>
                <p>• Confirm contact information accuracy</p>
                <p>• Set up initial product listings</p>
              </CardContent>
            </Card>

            <Card className="shadow-craft-soft">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>After registration:</p>
                <p>• Send welcome email with platform guidelines</p>
                <p>• Schedule onboarding call</p>
                <p>• Help set up first product listings</p>
                <p>• Provide marketing resources</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddArtisan;