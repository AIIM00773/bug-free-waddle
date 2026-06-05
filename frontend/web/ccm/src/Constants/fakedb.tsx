

import type {Product} from "./productTypes";


const EXTENSIVE_MOCK_DATABASE: Product[] = [
  // === CATEGORY: FOOTWEAR & APPAREL ===
  {
    id: 1,
    title: "AeroMesh Onyx Running Shoes - Sport Edition",
    price: "KSh 9,500",
    originalPrice: "KSh 12,000",
    merchant: "Jumia",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
    location: "Nairobi CBD",
    description: "High-performance breathable running shoes featuring adaptive foam mid-soles and vulcanized rubber traction pads.",
    inStock: true
  },
  {
    id: 2,
    title: "Nimbus Breathable Trainer Cushion V2",
    price: "KSh 11,200",
    originalPrice: "KSh 13,500",
    merchant: "Kilimall",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=60",
    location: "Mombasa Road",
    description: "Engineered with multi-directional mesh materials and an advanced orthotic internal layout.",
    inStock: true
  },
  {
    id: 3,
    title: "Apex Horizon Light Trail Racers",
    price: "KSh 8,900",
    originalPrice: "KSh 10,500",
    merchant: "SkyGarden",
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=60",
    location: "Thika Road",
    description: "Ultra-lightweight offroad shoes tailored with enhanced mud guards and high-friction tread depth layouts.",
    inStock: false
  },
  {
    id: 4,
    title: "Classic Waterproof Leather Timber Boots",
    price: "KSh 14,500",
    merchant: "Jumia",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=60",
    location: "Westlands",
    description: "Premium full-grain waterproof leather boots built for durability and comfort in all weather conditions.",
    inStock: true
  },
  {
    id: 5,
    title: "Vintage Minimalist Denim Jacket - Unisex",
    price: "KSh 3,200",
    originalPrice: "KSh 4,500",
    merchant: "SkyGarden",
    rating: "4.0",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=60",
    location: "Ngong Road",
    description: "Relaxed fit classic blue denim jacket featuring reinforced metal buttons and four pocket build.",
    inStock: true
  },
  {
    id: 6,
    title: "Urban Knit Essentials Everyday Hoodie",
    price: "KSh 2,400",
    merchant: "Kilimall",
    rating: "4.3",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=60",
    location: "Eastleigh",
    description: "Ultra-soft cotton blend fleece hoodie with dynamic drawstring toggle adjustments.",
    inStock: true
  },

  // === CATEGORY: SMARTPHONES & ACCESSORIES ===
  {
    id: 7,
    title: "ProMax Ultra 5G Smartphone - 256GB Platinum",
    price: "KSh 134,999",
    originalPrice: "KSh 145,000",
    merchant: "Jumia",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60",
    location: "Lavington",
    description: "Flagship mobile platform featuring computational triple-lens array, 120Hz display refresh, and true day-to-night battery endurance.",
    inStock: true
  },
  {
    id: 8,
    title: "SyncBuds Pro ANC Wireless Earphones",
    price: "KSh 7,500",
    originalPrice: "KSh 9,990",
    merchant: "Kilimall",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=60",
    location: "Nairobi CBD",
    description: "True wireless audio earbuds packing intelligent active noise cancellation and clear call voice separation.",
    inStock: true
  },
  {
    id: 9,
    title: "TitanCharge 20,000mAh Power Delivery Bank",
    price: "KSh 4,200",
    merchant: "SkyGarden",
    rating: "4.4",
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=60",
    location: "Mombasa CBD",
    description: "High-capacity external battery layout packing dual USB-C fast charging interfaces up to 22.5W.",
    inStock: true
  },
  {
    id: 10,
    title: "Minimalist Magnetic Leather Phone Wallet Case",
    price: "KSh 1,800",
    originalPrice: "KSh 2,500",
    merchant: "Kilimall",
    rating: "4.1",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=60",
    location: "Nairobi CBD",
    description: "Genuine top-grain leather protection case with integrated slots for cash and standard vendor cards.",
    inStock: false
  },

  // === CATEGORY: LAPTOPS, AUDIO & ELECTRONICS ===
  {
    id: 11,
    title: "QuantumBook Pro 14 Silicon Laptop",
    price: "KSh 185,000",
    merchant: "Jumia",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60",
    location: "Kilimani",
    description: "Next-gen computing engine configured with a 10-core processing architecture, 16GB memory infrastructure, and a brilliant liquid panel.",
    inStock: true
  },
  {
    id: 12,
    title: "SonicBoom Over-Ear Wireless Studio Headphones",
    price: "KSh 18,900",
    originalPrice: "KSh 22,000",
    merchant: "SkyGarden",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
    location: "Karen",
    description: "Studio-grade wireless over-ear transducers providing deep linear response and thick memory foam ear cushioning.",
    inStock: true
  },
  {
    id: 13,
    title: "Cinemax 4K Ultra-HD Smart LED TV 55\"",
    price: "KSh 54,999",
    originalPrice: "KSh 65,000",
    merchant: "Kilimall",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=60",
    location: "Syokimau",
    description: "Immersive smart display engine packed with dynamic HDR mapping and preloaded with leading local streaming software portals.",
    inStock: true
  },
  {
    id: 14,
    title: "Ergonomic Mechanical Backlit Gaming Keyboard",
    price: "KSh 6,800",
    merchant: "Jumia",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60",
    location: "Thika",
    description: "Tactile mechanical linear switches boasting customized macro keys and addressable structural RGB backlighting profiles.",
    inStock: true
  },

  // === CATEGORY: HOME & LIVING ===
  {
    id: 15,
    title: "HydroGlow Smart Air Humidifier Diffuser",
    price: "KSh 3,500",
    originalPrice: "KSh 4,800",
    merchant: "SkyGarden",
    rating: "4.3",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&auto=format&fit=crop&q=60",
    location: "Gigiri",
    description: "Ultrasonic cool mist ecosystem delivering target moisture profiles and dynamic nightlight adjustments.",
    inStock: true
  },
  {
    id: 16,
    title: "Orthopedic Memory Foam Ergonomic Office Chair",
    price: "KSh 24,500",
    merchant: "Jumia",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=60",
    location: "Mombasa Road",
    description: "Professional administrative chair engineered with 3D lumbar structural contours and dynamic synchronous tilt systems.",
    inStock: true
  },
  {
    id: 17,
    title: "Chef's Choice Non-Stick Ceramic Cookware Set",
    price: "KSh 12,300",
    originalPrice: "KSh 15,000",
    merchant: "Kilimall",
    rating: "4.4",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=60",
    location: "Industrial Area",
    description: "10-piece professional induction cooking array finished with dual-layer inert scratch-resistant ceramic seals.",
    inStock: true
  },
  {
    id: 18,
    title: "Minimalist Scandinavian Wooden Coffee Table",
    price: "KSh 16,000",
    merchant: "SkyGarden",
    rating: "4.2",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=60",
    location: "Eldoret",
    description: "Handcrafted sustainable oak solid wood coffee centerpiece boasting functional nested structural sliding drawers.",
    inStock: false
  },
  {
    id: 19,
    title: "Pure Egyptian Cotton Luxury Bedding Sheets",
    price: "KSh 5,500",
    originalPrice: "KSh 7,500",
    merchant: "Jumia",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=60",
    location: "Parklands",
    description: "Premium 800 thread-count ultra-breathable sateen finish fabric suite matching King sized bedding footprints.",
    inStock: true
  },

  // === CATEGORY: APPLIANCES ===
  {
    id: 20,
    title: "AeroFryer Pro XL Digital Air Fryer 5.5L",
    price: "KSh 15,900",
    originalPrice: "KSh 19,500",
    merchant: "Kilimall",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&auto=format&fit=crop&q=60",
    location: "Kasarani",
    description: "Rapid 360-degree hot heat cyclonic circulation appliance driving crispy textures lacking greasy lipid tracking.",
    inStock: true
  },
  {
    id: 21,
    title: "Barista Espresso Maker & Steam Milk Frother",
    price: "KSh 28,000",
    merchant: "SkyGarden",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=600&auto=format&fit=crop&q=60",
    location: "Westlands",
    description: "15-bar professional metric pressure brewing workstation complete with micro-foam texturing processing wands.",
    inStock: true
  },
  {
    id: 22,
    title: "Smart App-Controlled Robotic Vacuum Cleaner",
    price: "KSh 32,500",
    originalPrice: "KSh 38,000",
    merchant: "Jumia",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=60",
    location: "Kilimani",
    description: "LIDAR laser-guided obstacle map engine with automatic drop avoidance and automatic recharge docking automation.",
    inStock: true
  },

  // === CATEGORY: HEALTH, FITNESS & BEAUTY ===
  {
    id: 23,
    title: "HydraBoost Hyaluronic Acid Face Serum",
    price: "KSh 2,100",
    merchant: "SkyGarden",
    rating: "4.4",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=60",
    location: "Yaya Centre",
    description: "Deep molecular rehydration topical mixture enriched with pure Vitamin B5 compounds for all dermis types.",
    inStock: true
  },
  {
    id: 24,
    title: "Premium Heavy-Duty Rubber Dumbbell Set 20kg",
    price: "KSh 8,400",
    originalPrice: "KSh 10,000",
    merchant: "Kilimall",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600&auto=format&fit=crop&q=60",
    location: "Ruiru",
    description: "Hexagonal floor-stable structural design constructed of solid cast cores encased in high impact absorbing protective rubber.",
    inStock: true
  },
  {
    id: 25,
    title: "Therapeutic Deep-Tissue Muscle Massage Gun",
    price: "KSh 6,500",
    merchant: "Jumia",
    rating: "4.3",
    image: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=600&auto=format&fit=crop&q=60",
    location: "Nairobi CBD",
    description: "Multi-speed high torque brushless motor system targeting persistent deep myofascial release.",
    inStock: true
  },

  // === CATEGORY: GROCERIES & CONSUMABLES ===
  {
    id: 26,
    title: "Organic Cold-Pressed Extra Virgin Olive Oil 1L",
    price: "KSh 1,850",
    originalPrice: "KSh 2,200",
    merchant: "Jumia",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=60",
    location: "Westlands",
    description: "First premium mechanical cold pressing extract completely free of artificial chemical refinement additives.",
    inStock: true
  },
  {
    id: 27,
    title: "Gourmet Arabica Whole Bean Coffee 500g",
    price: "KSh 1,200",
    merchant: "SkyGarden",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=60",
    location: "Nyeri CBD",
    description: "Single-origin volcanic high-altitude roasted coffee beans throwing subtle crisp chocolate fruit profile notes.",
    inStock: true
  },

  // === CATEGORY: MISCELLANEOUS EDGE CASES (For UI Layout Stability) ===
  {
    id: 28,
    title: "Super-Long Product Title Testing Edge Case For Text Clamping Layout Configurations Premium Gold Plus Pro Max Elite Ultra",
    price: "KSh 1,000",
    merchant: "Jumia",
    rating: "3.5",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60",
    location: "Kisumu CBD",
    description: "This item exists specifically to evaluate if long typographic names gracefully apply CSS line-clamping without breaking rows.",
    inStock: true
  },
  {
    id: 29,
    title: "Budget Plastic Storage Container Box",
    price: "KSh 450",
    merchant: "Kilimall",
    rating: "3.9",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=60",
    location: "Gikomba",
    description: "Cheap lightweight stackable utility bin engineered for basic space organization tasks.",
    inStock: true
  },
  {
    id: 30,
    title: "Premium Carbon Fiber Road Racing Bicycle V3",
    price: "KSh 249,000",
    originalPrice: "KSh 275,000",
    merchant: "SkyGarden",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=60",
    location: "Nakuru CBD",
    description: "Ultra-high modulus carbon fiber professional monocoque framed velocity machine with precision electronic gear shifters.",
    inStock: false
  }
];



export {EXTENSIVE_MOCK_DATABASE}