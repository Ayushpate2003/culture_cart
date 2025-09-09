import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SubmitStoryFormValues {
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  content: string;
}

const defaultValues: SubmitStoryFormValues = {
  title: "",
  author: "",
  category: "",
  imageUrl: "",
  content: "",
};

const SubmitStory = () => {
  const form = useForm<SubmitStoryFormValues>({ defaultValues });
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = (values: SubmitStoryFormValues) => {
    const words = values.content.trim().split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.round(words / 200));
    const newStory = {
      id: Date.now(),
      title: values.title,
      description: values.content.slice(0, 180),
      author: values.author || "Anonymous",
      authorImage: "/logo.png",
      category: values.category || "Community",
      readTime: `${readMinutes} min read`,
      publishDate: new Date().toISOString().slice(0, 10),
      image: values.imageUrl || "/placeholder.svg",
      tags: [values.category || "Community"],
    };

    const existingRaw = localStorage.getItem("userStories");
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [newStory, ...existing];
    localStorage.setItem("userStories", JSON.stringify(updated));
    toast({
      title: "Story submitted",
      description: "Thank you! We'll review your story and publish it soon.",
    });
    form.reset(defaultValues);
    navigate("/stories");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-craft-soft">
            <CardHeader>
              <CardTitle className="text-2xl">Submit Your Story</CardTitle>
              <CardDescription>
                Share your craft journey. Include a catchy title, a category, and an image URL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="A memorable title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author"
                      rules={{ required: "Author name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Process, Sustainability" {...field} />
                          </FormControl>
                          <FormDescription>Choose an existing category to help readers find it.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://... or /path-in-public.jpg" {...field} />
                        </FormControl>
                        <FormDescription>Optional. Used as the story banner.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    rules={{ required: "Content is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story</FormLabel>
                        <FormControl>
                          <Textarea rows={8} placeholder="Tell your story..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                      Reset
                    </Button>
                    <Button type="submit" variant="hero" className="hover-glow">
                      Submit Story
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitStory;
