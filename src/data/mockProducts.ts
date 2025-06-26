
export interface Product {
  id: number;
  name: string;
  company: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  description: string;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Quantum MacBook Pro",
    company: "Apple",
    price: 2499,
    image: "photo-1486312338219-ce68d2c6f44d",
    category: "Laptops",
    stock: 15,
    description: "Revolutionary quantum-powered MacBook Pro with neural processing unit and holographic display. Features advanced AI acceleration and unlimited cloud integration."
  },
  {
    id: 2,
    name: "Neural iPhone 15 Pro",
    company: "Apple",
    price: 1299,
    image: "photo-1531297484001-80022131f5a1",
    category: "Smartphones",
    stock: 32,
    description: "Next-generation iPhone with integrated neural chip, real-time AI translation, and quantum encryption for ultimate security."
  },
  {
    id: 3,
    name: "HoloLens X1",
    company: "Microsoft",
    price: 3499,
    image: "photo-1581090464777-f3220bbe1b8b",
    category: "AR/VR",
    stock: 8,
    description: "Cutting-edge mixed reality headset with 8K per eye resolution, spatial computing capabilities, and seamless integration with digital environments."
  },
  {
    id: 4,
    name: "Galaxy Quantum S24",
    company: "Samsung",
    price: 1199,
    image: "photo-1488590528505-98d2b5aba04b",
    category: "Smartphones",
    stock: 25,
    description: "Samsung's flagship smartphone featuring quantum dot display, AI-powered camera system, and revolutionary battery technology."
  },
  {
    id: 5,
    name: "Cyber Gaming Rig",
    company: "NVIDIA",
    price: 4999,
    image: "photo-1518770660439-4636190af475",
    category: "PCs",
    stock: 5,
    description: "Ultimate gaming machine with RTX 5090 GPU, liquid cooling system, and RGB lighting that responds to in-game events."
  },
  {
    id: 6,
    name: "AirPods Quantum",
    company: "Apple",
    price: 399,
    image: "photo-1486312338219-ce68d2c6f44d",
    category: "Headphones",
    stock: 50,
    description: "Wireless earphones with spatial audio, noise cancellation, and real-time language translation powered by AI."
  },
  {
    id: 7,
    name: "Surface Neo Pro",
    company: "Microsoft",
    price: 1899,
    image: "photo-1531297484001-80022131f5a1",
    category: "Tablets",
    stock: 12,
    description: "Dual-screen tablet with adaptive interface, stylus support, and seamless transition between laptop and tablet modes."
  },
  {
    id: 8,
    name: "Canon EOS Quantum",
    company: "Canon",
    price: 2799,
    image: "photo-1488590528505-98d2b5aba04b",
    category: "Cameras",
    stock: 18,
    description: "Professional mirrorless camera with AI-enhanced autofocus, 8K video recording, and quantum image sensor technology."
  },
  {
    id: 9,
    name: "Tesla Cybertruck Phone",
    company: "Tesla",
    price: 899,
    image: "photo-1518770660439-4636190af475",
    category: "Smartphones",
    stock: 0,
    description: "Rugged smartphone with solar charging, satellite connectivity, and integration with Tesla vehicles."
  },
  {
    id: 10,
    name: "Sony WH-2000XM6",
    company: "Sony",
    price: 449,
    image: "photo-1581090464777-f3220bbe1b8b",
    category: "Headphones",
    stock: 35,
    description: "Premium noise-canceling headphones with adaptive sound control, 40-hour battery life, and high-resolution audio."
  }
];

export const categories = ["Smartphones", "Laptops", "PCs", "Headphones", "Cameras", "Tablets", "AR/VR"];
export const companies = Array.from(new Set(mockProducts.map(p => p.company)));
