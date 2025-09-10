import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Users,
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  HelpCircle,
  BookOpen,
  Video,
  FileText,
  X, // Icon for closing the chat
  Send, // Icon for the send button
} from "lucide-react";

// +-------------------------------------------------+
// |           AI-Powered Chat Widget Component      |
// +-------------------------------------------------+
// This self-contained component can be moved to its own file if desired.
const ChatWidget = ({ isOpen, onClose }) => {
  // State for managing the conversation messages
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! How can I help you with CultureCart today?",
    },
  ]);
  // State for the user's current input
  const [inputMessage, setInputMessage] = useState("");
  // State to show a loading indicator while the bot is "typing"
  const [isLoading, setIsLoading] = useState(false);
  // Ref to automatically scroll to the newest message
  const chatMessagesEndRef = useRef(null);

  // --- API Configuration ---
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=";
  const API_KEY = "AIzaSyCMxyzo3PJlFH5dyxh-Td_V3ZTzboix0L0"; // The API key is handled by the environment, so we leave this empty.

  // Effect to scroll down when a new message is added
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect to reset the chat history when the widget is closed
  useEffect(() => {
    if (!isOpen) {
      // Add a small delay to allow the closing animation to finish
      setTimeout(() => {
        setMessages([
          {
            sender: "bot",
            text: "Hello! How can I help you with CultureCart today?",
          },
        ]);
        setIsLoading(false);
      }, 300);
    }
  }, [isOpen]);

  // --- Core Functions ---

  /**
   * Handles sending the user's message and fetching the bot's response.
   */
  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage === "" || isLoading) return;

    // 1. Add user's message to the UI instantly
    const newMessages = [...messages, { sender: "user", text: trimmedMessage }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // 2. Prepare the request for the Gemini API
      const systemPrompt =
        "You are a friendly, helpful, and concise customer support agent for 'CultureCart', an e-commerce platform that sells unique handmade goods from artisans around the world. Your goal is to assist users with their questions about the platform, orders, and products. Keep your answers relevant to CultureCart.";

      const conversationHistory = newMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const payload = {
        contents: conversationHistory,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      };

      // 3. Call the API
      const response = await fetch(`${API_URL}${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      // 4. Process the response and add the bot's message to the UI
      const result = await response.json();
      const botResponse =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm not sure how to respond. Could you please rephrase?";

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Failed to fetch bot response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Method ---
  return (
    <div
      className={`fixed bottom-5 right-5 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">CultureCart Support</h3>
          <p className="text-sm opacity-90">AI-Powered Assistant</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-background/20 rounded-full p-1 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-muted/20 flex flex-col space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs break-words ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center space-x-1.5">
                <div
                  className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "-0.3s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "-0.15s" }}
                ></div>
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// +-------------------------------------------------+
// |           Your Existing Help Page Component     |
// +-------------------------------------------------+
const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat widget visibility

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Users,
      faqs: [
        {
          question: "How do I create an account?",
          answer:
            "Click the 'Sign In' button in the top navigation, then select 'Create Account'. You can sign up as either a buyer or artisan. Fill out the required information and verify your email address to get started.",
        },
        {
          question: "What's the difference between buyer and artisan accounts?",
          answer:
            "Buyer accounts can browse, purchase, and review products. Artisan accounts can create profiles, list products for sale, manage orders, and build their craft business on our platform.",
        },
        {
          question: "Is CraftConnect free to use?",
          answer:
            "Creating an account and browsing is completely free. For artisans, we charge a small commission (5%) only when you make a sale. There are no monthly fees or listing charges.",
        },
      ],
    },
    {
      id: "buying",
      title: "Buying & Orders",
      icon: ShoppingBag,
      faqs: [
        {
          question: "How do I place an order?",
          answer:
            "Browse our catalog, click on any product you like, and click 'Add to Cart'. When ready, go to your cart and click 'Checkout'. You'll be guided through payment and shipping options.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely through Stripe.",
        },
        {
          question: "Can I cancel or modify my order?",
          answer:
            "You can cancel or modify orders within 1 hour of placing them. After that, please contact the artisan directly through your order page to discuss changes.",
        },
        {
          question: "What if I'm not satisfied with my purchase?",
          answer:
            "Each artisan sets their own return policy, which you'll see on the product page. Most offer 30-day returns for unused items. Contact the artisan first, and if unresolved, our support team can help mediate.",
        },
      ],
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      icon: Truck,
      faqs: [
        {
          question: "How long does shipping take?",
          answer:
            "Shipping times vary by artisan and product. Handmade items typically take 3-7 business days to create, plus 2-5 days for shipping. You'll see estimated delivery dates during checkout.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Many of our artisans offer international shipping, but availability varies by seller. Check the product page or contact the artisan directly for international shipping options and costs.",
        },
        {
          question: "How can I track my order?",
          answer:
            "Once your order ships, you'll receive a tracking number via email. You can also check your order status anytime in your account dashboard under 'My Orders'.",
        },
      ],
    },
    {
      id: "selling",
      title: "Selling on CraftConnect",
      icon: CreditCard,
      faqs: [
        {
          question: "How do I become an artisan seller?",
          answer:
            "Click 'Join as Artisan' and complete the application form. Include photos of your work, your craft story, and business information. Our team reviews applications within 3-5 business days.",
        },
        {
          question: "What fees do you charge sellers?",
          answer:
            "We charge a 5% commission on completed sales, plus payment processing fees (typically 2.9% + $0.30). There are no listing fees, monthly charges, or hidden costs.",
        },
        {
          question: "How do I get paid?",
          answer:
            "Payments are automatically transferred to your connected bank account or PayPal weekly. You can view earnings and payment history in your seller dashboard.",
        },
        {
          question: "Can I sell my existing products from other platforms?",
          answer:
            "Yes, you can cross-list products, but we encourage creating unique listings with original photos and descriptions that tell your craft story authentically.",
        },
      ],
    },
  ];

  const supportOptions = [
    {
      id: "live-chat", // Added an ID for easy targeting
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      availability: "Mon-Fri, 9AM-6PM EST",
      action: "Start Chat",
      featured: true,
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      availability: "Response within 24 hours",
      action: "Send Email",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: Phone,
      availability: "Mon-Fri, 10AM-5PM EST",
      action: "Call Now",
    },
  ];

  const guides = [
    {
      title: "Artisan Getting Started Guide",
      description: "Complete walkthrough for new sellers",
      type: "PDF",
      icon: FileText,
      downloadUrl: "#",
    },
    {
      title: "Photography Tips for Crafts",
      description: "Make your products shine with better photos",
      type: "Video",
      icon: Video,
      downloadUrl: "#",
    },
    {
      title: "Buyer's Guide to Handmade",
      description: "What to expect when buying handcrafted items",
      type: "Article",
      icon: BookOpen,
      downloadUrl: "#",
    },
  ];

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          searchQuery === "" ||
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How Can We Help?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find answers to common questions, get support, and learn how to
              make the most of CraftConnect.
            </p>

            {/* Search */}
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs
                defaultValue="faq"
                className="animate-slide-up animate-delay-200"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="faq">
                    Frequently Asked Questions
                  </TabsTrigger>
                  <TabsTrigger value="guides">Guides & Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="faq" className="space-y-6">
                  {filteredFAQs.map((category) => (
                    <Card key={category.id} className="shadow-craft-soft">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <category.icon className="w-5 h-5 text-primary" />
                          </div>
                          {category.title}
                          <Badge variant="secondary">
                            {category.faqs.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion
                          type="single"
                          collapsible
                          className="space-y-2"
                        >
                          {category.faqs.map((faq, faqIndex) => (
                            <AccordionItem
                              key={faqIndex}
                              value={`${category.id}-${faqIndex}`}
                            >
                              <AccordionTrigger className="text-left hover:text-primary">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="guides" className="space-y-6">
                  <div className="grid gap-6">
                    {guides.map((guide, index) => (
                      <Card
                        key={index}
                        className="hover-lift shadow-craft-soft"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <guide.icon className="w-6 h-6 text-accent" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-foreground">
                                  {guide.title}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {guide.type}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-4">
                                {guide.description}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover-scale"
                              >
                                {guide.type === "Video" ? "Watch" : "Download"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Support Options */}
              <Card className="shadow-craft-soft animate-scale-in animate-delay-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Get Support
                  </CardTitle>
                  <CardDescription>
                    Still need help? Our support team is here for you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        option.featured
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      } hover-lift`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            option.featured
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <option.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">
                            {option.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {option.description}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                            <Clock className="w-3 h-3" />
                            {option.availability}
                          </div>
                          <Button
                            variant={option.featured ? "default" : "outline"}
                            size="sm"
                            className="w-full hover-scale"
                            // This onClick handler opens the chat widget
                            onClick={() => {
                              if (option.id === "live-chat") {
                                setIsChatOpen(true);
                              }
                              // You can add else-if conditions for other buttons here
                            }}
                          >
                            {option.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="shadow-craft-soft animate-scale-in animate-delay-500">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a message and
                    we'll get back to you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input placeholder="Your Name" />
                  </div>
                  <div>
                    <Input placeholder="Your Email" type="email" />
                  </div>
                  <div>
                    <Input placeholder="Subject" />
                  </div>
                  <div>
                    <Textarea placeholder="How can we help you?" rows={4} />
                  </div>
                  <Button variant="hero" className="w-full hover-glow">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-craft-soft animate-scale-in animate-delay-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Support Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Avg. Response Time
                    </span>
                    <span className="font-semibold">2.3 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Resolution Rate
                    </span>
                    <span className="font-semibold">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Customer Satisfaction
                    </span>
                    <span className="font-semibold">4.9/5</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* The Chat Widget is rendered here, its visibility is controlled by state */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Help;
