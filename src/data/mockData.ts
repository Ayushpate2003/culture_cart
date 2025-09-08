export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  artisan: string;
  image: string;
  description: string;
  inStock: number;
  rating: number;
  reviews: number;
}

export interface Artisan {
  id: string;
  name: string;
  specialty: string;
  location: string;
  avatar: string;
  bio: string;
  rating: number;
  totalSales: number;
  joinedDate: string;
}

export interface Order {
  id: string;
  customerEmail: string;
  products: { productId: string; quantity: number; productName: string; price: number }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  orderDate: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Handwoven Ceramic Bowl",
    price: 45.99,
    category: "Pottery",
    artisan: "Maria Rodriguez",
    image: "/placeholder.svg",
    description: "Beautiful handcrafted ceramic bowl with intricate patterns, perfect for serving or decoration.",
    inStock: 12,
    rating: 4.8,
    reviews: 24
  },
  {
    id: "2",
    name: "Leather Messenger Bag",
    price: 89.99,
    category: "Leather Goods",
    artisan: "David Chen",
    image: "/placeholder.svg",
    description: "Premium quality leather messenger bag, handstitched with attention to detail.",
    inStock: 8,
    rating: 4.9,
    reviews: 18
  },
  {
    id: "3",
    name: "Silver Pendant Necklace",
    price: 65.00,
    category: "Jewelry",
    artisan: "Sarah Johnson",
    image: "/placeholder.svg",
    description: "Elegant silver pendant necklace with unique geometric design.",
    inStock: 15,
    rating: 4.7,
    reviews: 31
  },
  {
    id: "4",
    name: "Wooden Coffee Table",
    price: 299.99,
    category: "Furniture",
    artisan: "Michael Thompson",
    image: "/placeholder.svg",
    description: "Solid oak coffee table with rustic finish, perfect for any living space.",
    inStock: 3,
    rating: 4.9,
    reviews: 12
  },
  {
    id: "5",
    name: "Knitted Wool Scarf",
    price: 35.00,
    category: "Textiles",
    artisan: "Emma Wilson",
    image: "/placeholder.svg",
    description: "Soft merino wool scarf with traditional patterns, handknitted with love.",
    inStock: 20,
    rating: 4.6,
    reviews: 45
  },
  {
    id: "6",
    name: "Glass Vase Set",
    price: 75.00,
    category: "Glass Art",
    artisan: "Robert Martinez",
    image: "/placeholder.svg",
    description: "Set of three handblown glass vases in complementary colors.",
    inStock: 6,
    rating: 4.8,
    reviews: 22
  }
];

export const mockArtisans: Artisan[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    specialty: "Pottery & Ceramics",
    location: "Santa Fe, NM",
    avatar: "/placeholder.svg",
    bio: "Master potter with 15 years of experience creating beautiful functional and decorative ceramics.",
    rating: 4.8,
    totalSales: 156,
    joinedDate: "2019-03-15"
  },
  {
    id: "2",
    name: "David Chen",
    specialty: "Leather Crafts",
    location: "Portland, OR",
    avatar: "/placeholder.svg",
    bio: "Specialized in premium leather goods, combining traditional techniques with modern design.",
    rating: 4.9,
    totalSales: 89,
    joinedDate: "2020-07-22"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    specialty: "Jewelry Making",
    location: "Asheville, NC",
    avatar: "/placeholder.svg",
    bio: "Creating unique silver and gold jewelry pieces inspired by nature and geometric forms.",
    rating: 4.7,
    totalSales: 203,
    joinedDate: "2018-11-08"
  },
  {
    id: "4",
    name: "Michael Thompson",
    specialty: "Woodworking",
    location: "Vermont",
    avatar: "/placeholder.svg",
    bio: "Sustainable furniture maker using reclaimed and locally sourced wood materials.",
    rating: 4.9,
    totalSales: 67,
    joinedDate: "2021-01-12"
  },
  {
    id: "5",
    name: "Emma Wilson",
    specialty: "Textile Arts",
    location: "Denver, CO",
    avatar: "/placeholder.svg",
    bio: "Fiber artist specializing in hand-knitted and woven textiles using natural materials.",
    rating: 4.6,
    totalSales: 134,
    joinedDate: "2019-09-03"
  },
  {
    id: "6",
    name: "Robert Martinez",
    specialty: "Glass Art",
    location: "Tucson, AZ",
    avatar: "/placeholder.svg",
    bio: "Glass artist creating both functional and sculptural pieces using traditional glassblowing techniques.",
    rating: 4.8,
    totalSales: 98,
    joinedDate: "2020-04-18"
  }
];

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerEmail: "john.doe@example.com",
    products: [
      { productId: "1", quantity: 2, productName: "Handwoven Ceramic Bowl", price: 45.99 },
      { productId: "3", quantity: 1, productName: "Silver Pendant Necklace", price: 65.00 }
    ],
    total: 156.98,
    status: "delivered",
    orderDate: "2024-01-15"
  },
  {
    id: "ORD-002",
    customerEmail: "jane.smith@example.com",
    products: [
      { productId: "2", quantity: 1, productName: "Leather Messenger Bag", price: 89.99 }
    ],
    total: 89.99,
    status: "shipped",
    orderDate: "2024-01-18"
  },
  {
    id: "ORD-003",
    customerEmail: "bob.johnson@example.com",
    products: [
      { productId: "4", quantity: 1, productName: "Wooden Coffee Table", price: 299.99 },
      { productId: "5", quantity: 3, productName: "Knitted Wool Scarf", price: 35.00 }
    ],
    total: 404.99,
    status: "processing",
    orderDate: "2024-01-20"
  },
  {
    id: "ORD-004",
    customerEmail: "alice.brown@example.com",
    products: [
      { productId: "6", quantity: 1, productName: "Glass Vase Set", price: 75.00 }
    ],
    total: 75.00,
    status: "pending",
    orderDate: "2024-01-22"
  }
];

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};

export const logout = () => {
  localStorage.removeItem("user");
};