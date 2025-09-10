import { useState, useRef, FC, ChangeEvent } from "react";
// import { useNavigate } from "react-router-dom"; // Temporarily removed for preview environment
// import { Navbar } from "@/components/navigation/Navbar"; // Removed for self-containment
// import { Footer } from "@/components/landing/Footer"; // Removed for self-containment
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, MapPin, Palette, Wand2, Loader2, X } from "lucide-react";
// import { useToast } from "@/hooks/use-toast"; // Temporarily removed for preview environment

// --- TypeScript Interfaces ---
interface ImageState {
  file: File | null;
  preview: string | null;
}

interface ImageUploadProps {
  onImageChange: (file: File) => void;
  onImageEnhance: () => void;
  imagePreview: string | null;
  isEnhancing: boolean;
  clearImage: () => void;
  enhanceText?: string;
}

interface ToastOptions {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

// --- Placeholder Components ---
const Navbar: FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4 flex justify-between items-center font-sans">
    <div className="font-bold text-xl">CultureCart</div>
    <div className="space-x-4">
      <a href="#" className="text-gray-600 hover:text-primary">
        Home
      </a>
      <a href="#" className="text-gray-600 hover:text-primary">
        Explore
      </a>
      <a href="#" className="text-gray-600 hover:text-primary">
        Artisans
      </a>
    </div>
  </nav>
);

const Footer: FC = () => (
  <footer className="bg-gray-50 p-8 text-center mt-12 font-sans">
    <p className="text-gray-600">
      &copy; 2024 CultureCart. All rights reserved.
    </p>
  </footer>
);

// --- Reusable Image Upload Component ---
const ImageUpload: FC<ImageUploadProps> = ({
  onImageChange,
  onImageEnhance,
  imagePreview,
  isEnhancing,
  clearImage,
  enhanceText = "AI will enhance and optimize your photo",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      {imagePreview ? (
        <div className="w-full h-48 border rounded-lg relative overflow-hidden group">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button onClick={onImageEnhance} disabled={isEnhancing} size="sm">
              {isEnhancing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              {isEnhancing ? "Optimizing..." : "Enhance with AI"}
            </Button>
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/80"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleDivClick}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer flex flex-col justify-center items-center h-48"
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{enhanceText}</p>
        </div>
      )}
    </div>
  );
};

// Simple toast placeholder for preview
const useToast = () => {
  return {
    toast: (options: ToastOptions) => {
      console.log("Toast:", options);
    },
  };
};

const ArtisanSignup: FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [locationVal, setLocationVal] = useState<string>("");
  const [craftType, setCraftType] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [isEnhancingBio, setIsEnhancingBio] = useState<boolean>(false);

  const [profileImage, setProfileImage] = useState<ImageState>({
    file: null,
    preview: null,
  });
  const [isEnhancingProfileImage, setIsEnhancingProfileImage] =
    useState<boolean>(false);

  const [workshopImages, setWorkshopImages] = useState<ImageState[]>([
    { file: null, preview: null },
    { file: null, preview: null },
  ]);
  const [isEnhancingWorkshopImage, setIsEnhancingWorkshopImage] = useState<
    boolean[]
  >([false, false]);

  const { toast } = useToast();

  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=";
  const API_KEY = "AIzaSyCMxyzo3PJlFH5dyxh-Td_V3ZTzboix0L0";

  const handleEnhanceBio = async () => {
    if (!firstName.trim() || !craftType.trim()) {
      toast({
        title: "More information needed",
        description:
          "Please fill in your First Name and Primary Craft Type for a better story.",
        variant: "destructive",
      });
      return;
    }

    if (!bio.trim()) {
      toast({
        title: "Your story is empty",
        description: "Please write a little about yourself before enhancing.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancingBio(true);
    try {
      const prompt = `You are an expert storyteller for an artisan marketplace called CultureCart. Your task is to rewrite and enhance an artisan's story to make it more engaging, warm, and compelling for potential buyers.

      Use these details to enrich the narrative:
      - Artisan Name: ${firstName} ${lastName}
      - Primary Craft: ${craftType}
      - Location: ${locationVal}

      Here is the artisan's original story draft:
      "${bio}"

      Please rewrite the story to be authentic and concise (around 3-4 sentences). IMPORTANT: Only return the final, enhanced story as plain text. Do not include any titles, markdown (like "**"), or introductory phrases like "Here is the enhanced story:".`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const response = await fetch(`${API_URL}${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const result = await response.json();
      const enhancedBio = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (enhancedBio) {
        setBio(enhancedBio.trim());
        toast({
          title: "Story Enhanced!",
          description: "Your story has been improved with AI.",
        });
      } else {
        throw new Error("Received an empty response from the AI.");
      }
    } catch (error) {
      console.error("Failed to enhance bio:", error);
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance the story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancingBio(false);
    }
  };

  const handleProfileImageChange = (file: File) => {
    setProfileImage({ file: file, preview: URL.createObjectURL(file) });
  };

  const handleWorkshopImageChange = (file: File, index: number) => {
    const newImages = [...workshopImages];
    newImages[index] = { file, preview: URL.createObjectURL(file) };
    setWorkshopImages(newImages);
  };

  const clearWorkshopImage = (index: number) => {
    const newImages = [...workshopImages];
    newImages[index] = { file: null, preview: null };
    setWorkshopImages(newImages);
  };

  const enhanceImage = async (
    file: File | null,
    setPreview: (newPreview: string) => void,
    onFinally: () => void
  ) => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please select an image to enhance.",
      });
      onFinally();
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const result = reader.result as string;
      const base64ImageData = result.split(",")[1];
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Enhance this photo for an artisan marketplace. Make it look professional, vibrant, and appealing. Focus on lighting and color balance.",
              },
              { inlineData: { mimeType: file.type, data: base64ImageData } },
            ],
          },
        ],
      };
      try {
        const response = await fetch(API_URL + API_KEY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Image enhancement failed");
        const result = await response.json();
        const newBase64 =
          result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (newBase64) {
          const newPreview = `data:${file.type};base64,${newBase64}`;
          setPreview(newPreview);
          toast({
            title: "Image Enhanced",
            description: "Your photo has been optimized.",
          });
        } else {
          throw new Error("No enhanced image data returned.");
        }
      } catch (error) {
        console.error("Error enhancing image:", error);
        toast({
          title: "Enhancement Failed",
          description: "Could not enhance the image.",
          variant: "destructive",
        });
      } finally {
        onFinally();
      }
    };
    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
      toast({
        title: "Error",
        description: "Could not process image file.",
        variant: "destructive",
      });
      onFinally();
    };
  };

  const handleProfileImageEnhance = () => {
    setIsEnhancingProfileImage(true);
    enhanceImage(
      profileImage.file,
      (newPreview) =>
        setProfileImage({ file: profileImage.file, preview: newPreview }),
      () => setIsEnhancingProfileImage(false)
    );
  };

  const handleWorkshopImageEnhance = (index: number) => {
    const newEnhancingState = [...isEnhancingWorkshopImage];
    newEnhancingState[index] = true;
    setIsEnhancingWorkshopImage(newEnhancingState);

    enhanceImage(
      workshopImages[index].file,
      (newPreview) => {
        const newImages = [...workshopImages];
        newImages[index] = { ...newImages[index], preview: newPreview };
        setWorkshopImages(newImages);
      },
      () => {
        const finalEnhancingState = [...isEnhancingWorkshopImage];
        finalEnhancingState[index] = false;
        setIsEnhancingWorkshopImage(finalEnhancingState);
      }
    );
  };

  const handleSubmit = () => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user || user.role !== "user") {
      toast({
        title: "Login required",
        description: "Please login as a user before submitting.",
      });
      console.log("Redirect to login");
      return;
    }
    const app = {
      id: Date.now(),
      name: `${firstName} ${lastName}`.trim(),
      email,
      location: locationVal,
      specialty: craftType,
      avatar: profileImage.preview || "/logo.png",
      bio,
      rating: 0,
      totalSales: 0,
      joinedDate: new Date().toISOString().slice(0, 10),
      featuredImage: "/placeholder.svg",
      followers: 0,
      verified: false,
      workshopImages: workshopImages.map((img) => img.preview).filter(Boolean),
    };
    const raw = localStorage.getItem("artisanApplications");
    const list = raw ? JSON.parse(raw) : [];
    localStorage.setItem("artisanApplications", JSON.stringify([app, ...list]));
    toast({
      title: "Application submitted",
      description: "Admin will review your profile.",
    });
    console.log("Redirect to dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Join Our Artisan Community
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create your profile and start showcasing your beautiful crafts to
              the world with AI-powered tools
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Profile completion</span>
              <span>30%</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">
                    Tell Us About Yourself
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={locationVal}
                      onChange={(e) => setLocationVal(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="craftType" className="flex items-center">
                      <Palette className="w-4 h-4 mr-1" />
                      Primary Craft Type *
                    </Label>
                    <Input
                      id="craftType"
                      placeholder="e.g., Pottery, Textiles, Woodworking"
                      value={craftType}
                      onChange={(e) => setCraftType(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="How many years?"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="bio">Your Story</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEnhanceBio}
                        disabled={isEnhancingBio}
                        className="text-primary hover:text-primary"
                      >
                        {isEnhancingBio ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4 mr-2" />
                        )}
                        {isEnhancingBio
                          ? "Enhancing..."
                          : "AI will help enhance this"}
                      </Button>
                    </div>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about your craft journey, heritage, and what inspires your work..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label>Profile Photo</Label>
                    <ImageUpload
                      onImageChange={handleProfileImageChange}
                      onImageEnhance={handleProfileImageEnhance}
                      imagePreview={profileImage.preview}
                      isEnhancing={isEnhancingProfileImage}
                      clearImage={() =>
                        setProfileImage({ file: null, preview: null })
                      }
                      enhanceText="Click to upload profile photo"
                    />
                  </div>

                  <div>
                    <Label>Workshop/Process Images (Optional)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {workshopImages.map((image, index) => (
                        <ImageUpload
                          key={index}
                          onImageChange={(file) =>
                            handleWorkshopImageChange(file, index)
                          }
                          onImageEnhance={() =>
                            handleWorkshopImageEnhance(index)
                          }
                          imagePreview={image.preview}
                          isEnhancing={isEnhancingWorkshopImage[index]}
                          clearImage={() => clearWorkshopImage(index)}
                          enhanceText={`Add image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      onClick={handleSubmit}
                    >
                      Create My Artisan Profile
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      By creating an account, you agree to our Terms of Service
                      and Privacy Policy
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    AI Will Help You
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wand2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">
                        Enhance Your Story
                      </h4>
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

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Popular Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Pottery",
                      "Textiles",
                      "Jewelry",
                      "Woodworking",
                      "Metalwork",
                      "Glass",
                      "Leather",
                      "Fiber Arts",
                    ].map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs"
                      >
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
