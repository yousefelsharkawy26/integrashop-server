var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"));
var import_path = __toESM(require("path"));
var import_vite = require("vite");
var import_genai = require("@google/genai");

// server/db.ts
function createRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
var categories = [];
var brands = [];
var products = [];
var users = [];
var userPasswords = {};
var orders = [];
var coupons = [];
var userCarts = {};
function initDb() {
  if (products.length > 0) return;
  const random = createRandom(12345);
  const categoryNames = [
    { name: "Electronics", desc: "Gadgets, devices, and accessories", slug: "electronics", img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80" },
    { name: "Laptops", desc: "Powerful workhorses and gaming rigs", slug: "laptops", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" },
    { name: "Smartphones", desc: "Pocket computing powerhouses", slug: "smartphones", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80" },
    { name: "Audio", desc: "Headphones, speakers, and amplifiers", slug: "audio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
    { name: "Wearables", desc: "Smartwatches and fitness trackers", slug: "wearables", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
    { name: "Cameras", desc: "Capture your memories in high-definition", slug: "cameras", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
    { name: "Accessories", desc: "Cases, chargers, and cables", slug: "accessories", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80" },
    { name: "Gaming", desc: "Consoles, controllers, and gear", slug: "gaming", img: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=400&q=80" },
    { name: "Home Appliances", desc: "Smart vacuums, purifiers, and climate control", slug: "home-appliances", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80" },
    { name: "Kitchenware", desc: "Blenders, mixers, and cookware", slug: "kitchenware", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80" },
    { name: "Fitness", desc: "Dumbbells, resistance bands, and workout gear", slug: "fitness", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80" },
    { name: "Footwear", desc: "Running shoes, sneakers, and casual wear", slug: "footwear", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
    { name: "Apparel", desc: "Jackets, activewear, and daily style", slug: "apparel", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80" },
    { name: "Smart Home", desc: "Lights, cameras, and security integrations", slug: "smart-home", img: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80" },
    { name: "Personal Care", desc: "Shavers, hair dryers, and grooming", slug: "personal-care", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
    { name: "Outdoor", desc: "Tents, backpacks, and hiking essentials", slug: "outdoor", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80" },
    { name: "Toys", desc: "Fun, learning, and creative building blocks", slug: "toys", img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80" },
    { name: "Automotive", desc: "Dash cams, cleaners, and car accessories", slug: "automotive", img: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&q=80" },
    { name: "Luggage", desc: "Suitcases, duffels, and travel packs", slug: "luggage", img: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&q=80" },
    { name: "Office", desc: "Chairs, desks, organizers, and stationery", slug: "office", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80" }
  ];
  categories = categoryNames.map((c, i) => ({
    id: `cat-${i + 1}`,
    name: c.name,
    description: c.desc,
    slug: c.slug,
    image: c.img
  }));
  const brandNames = [
    "Apple",
    "Samsung",
    "Sony",
    "Dell",
    "HP",
    "Asus",
    "Lenovo",
    "Logitech",
    "Nike",
    "Adidas",
    "Puma",
    "Under Armour",
    "KitchenAid",
    "Dyson",
    "GoPro"
  ];
  brands = brandNames.map((b, i) => ({
    id: `brand-${i + 1}`,
    name: b,
    slug: b.toLowerCase().replace(/\s+/g, "-")
  }));
  const couponCodes = [
    { code: "SAVE10", type: "percentage", value: 10, min: 50, desc: "10% off orders over $50" },
    { code: "SAVE20", type: "percentage", value: 20, min: 100, desc: "20% off orders over $100" },
    { code: "WELCOME50", type: "fixed", value: 50, min: 200, desc: "$50 flat discount on orders over $200" },
    { code: "FREESHIP", type: "percentage", value: 0, min: 30, desc: "Free shipping on orders over $30 (shipping value is fully discounted)" },
    { code: "VIP15", type: "percentage", value: 15, min: 0, desc: "15% off for our VIP members, no minimum" }
  ];
  coupons = couponCodes.map((c) => ({
    code: c.code,
    discountType: c.type,
    value: c.value,
    minSpend: c.min,
    expiryDate: "2028-12-31",
    description: c.desc
  }));
  const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "James", "Ashley", "Robert", "Jessica"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
  const states = ["NY", "CA", "IL", "TX", "AZ", "PA", "TX", "CA", "TX", "CA"];
  const streets = ["Broadway", "Sunset Blvd", "Michigan Ave", "Main St", "Oak St", "Pine St", "Maple Ave", "Washington St", "Cedar Rd", "Elm St"];
  for (let i = 1; i <= 50; i++) {
    const fName = firstNames[Math.floor(random() * firstNames.length)];
    const lName = lastNames[Math.floor(random() * lastNames.length)];
    const name = `${fName} ${lName}`;
    const email = i === 1 ? "user1@demo.com" : `user${i}@demo.com`;
    const password = "password";
    const userCities = [cities[Math.floor(random() * cities.length)], cities[Math.floor(random() * cities.length)]];
    const userStates = [states[cities.indexOf(userCities[0])], states[cities.indexOf(userCities[1])]];
    const addresses = [
      {
        id: `addr-${i}-1`,
        fullName: name,
        streetAddress: `${Math.floor(random() * 9e3) + 100} ${streets[Math.floor(random() * streets.length)]}`,
        city: userCities[0],
        state: userStates[0],
        postalCode: String(Math.floor(random() * 9e4) + 1e4),
        country: "United States",
        isDefault: true
      },
      {
        id: `addr-${i}-2`,
        fullName: name,
        streetAddress: `${Math.floor(random() * 9e3) + 100} Office Pkwy`,
        city: userCities[1],
        state: userStates[1],
        postalCode: String(Math.floor(random() * 9e4) + 1e4),
        country: "United States",
        isDefault: false
      }
    ];
    const userId = `user-${i}`;
    users.push({
      id: userId,
      email,
      name,
      addresses,
      createdAt: new Date(Date.now() - (50 - i) * 24 * 3600 * 1e3).toISOString()
    });
    userPasswords[userId] = password;
    userCarts[userId] = [];
  }
  let pIndex = 1;
  const reviewComments = [
    "Amazing product, exceeded all my expectations!",
    "Decent quality for the price. Works well.",
    "Highly recommended. Extremely fast delivery too.",
    "Very satisfied with this purchase.",
    "Good, but could be slightly improved.",
    "Excellent customer service and fantastic quality.",
    "Does exactly what it says on the box.",
    "A bit pricey, but absolutely worth it.",
    "Fantastic product! Will definitely buy again.",
    "I'm super happy with this purchase. Outstanding quality!"
  ];
  categories.forEach((cat) => {
    let categoryBrands = brands;
    if (["Laptops", "Smartphones"].includes(cat.name)) {
      categoryBrands = brands.filter((b) => ["Apple", "Samsung", "Dell", "HP", "Asus", "Lenovo"].includes(b.name));
    } else if (cat.name === "Footwear" || cat.name === "Apparel") {
      categoryBrands = brands.filter((b) => ["Nike", "Adidas", "Puma", "Under Armour"].includes(b.name));
    } else if (cat.name === "Audio" || cat.name === "Gaming") {
      categoryBrands = brands.filter((b) => ["Sony", "Apple", "Asus", "Logitech", "Samsung"].includes(b.name));
    } else if (cat.name === "Kitchenware" || cat.name === "Home Appliances") {
      categoryBrands = brands.filter((b) => ["KitchenAid", "Dyson", "Samsung", "Sony"].includes(b.name));
    }
    const nouns = {
      "Electronics": ["Power Bank", "Wireless Charger", "Bluetooth Adapter", "HDMI Splitter", "LED Strip", "Screwdriver Set", "Smart Plug", "Extension Cord"],
      "Laptops": ["ZenBook", "XPS", "Pavilion", "ThinkPad", "MacBook Air", "MacBook Pro", "TUF Gaming", "Legion Slim", "Inspiron"],
      "Smartphones": ["Galaxy S24", "iPhone 15", "Galaxy A55", "Xperia Pro", "ZenFone Pro", "Pixel Pro", "Redmi Note", "Blade Ultra"],
      "Audio": ["Over-Ear Headphones", "Wireless Earbuds", "Soundbar 500", "Smart Speaker", "Studio Monitor", "Noise Cancelling Buds", "Gaming Headset"],
      "Wearables": ["Fitbit Pulse", "Watch Series 9", "Smart Band Pro", "GPS Sports Watch", "Active Smartwatch", "Rugged Explorer Watch"],
      "Cameras": ["Action Camera 4K", "Mirrorless Creator", "Compact Vlog Camera", "Vlogging Rig", "360 Action Cam", "Macro Lens Kit"],
      "Accessories": ["USB-C Hub", "Laptop Stand", "Leather Phone Case", "Fast Charging Block", "Screen Protector Kit", "Travel Organizer"],
      "Gaming": ["Mechanical Keyboard", "RGB Gaming Mouse", "Pro Gamepad", "Steering Wheel Kit", "Streaming Mic", "VR Headset Grip", "RGB Desk Pad"],
      "Home Appliances": ["V15 Cordless Vacuum", "Purifier Hot+Cool", "Smart Humidifier", "Robotic Vacuum X2", "Dehumidifier Elite"],
      "Kitchenware": ["Stand Mixer 5-Qt", "Food Processor", "Air Fryer XL", "Electric Kettle", "Espresso Maker Pro", "Slicing Knife Set"],
      "Fitness": ["Dumbbell Set", "Yoga Mat Premium", "Resistance Bands", "Kettlebell 15lbs", "Foam Roller Pro", "Jump Rope Speed"],
      "Footwear": ["Air Zoom Running Shoes", "Ultraboost Sneakers", "Rider Trainer Shoes", "Project Rock Training Shoes", "Daily Classic Canvas"],
      "Apparel": ["Windbreaker Jacket", "Dry-Fit Training Tee", "Fleece Jogger Pants", "Tech Fleece Hoodie", "Compression Shorts"],
      "Smart Home": ["Smart Lightbulb Pack", "WiFi Smart Lock", "Video Doorbell", "Security Camera Pan-Tilt", "Smart Thermostat"],
      "Personal Care": ["Electric Shaver", "Sonic Toothbrush", "Ionic Hair Dryer", "Beard Trimmer Kit", "Skincare Cooler"],
      "Outdoor": ["Camping Tent 4-Person", "Hiking Backpack 55L", "Sleeping Bag Thermal", "LED Camping Lantern", "Water Filter Straw"],
      "Toys": ["Space Building Blocks", "Coding Robot Kit", "Magnetic Drawing Board", "RC Stunt Car", "Creative Clay Workshop"],
      "Automotive": ["Dash Cam 1080p", "Car Vacuum Cleaner", "Leather Cleaning Kit", "OBD2 Scanner Tool", "Bluetooth FM Transmitter"],
      "Luggage": ['Hardside Spinner 20"', "Travel Duffel Bag", "Anti-Theft Backpack", "Packing Cubes Set", "Toiletry Bag Premium"],
      "Office": ["Ergonomic Mesh Chair", "Adjustable Desk Converter", "Desk Mat Premium", "Monitor Arm Mount", "Document Organizer Tray"]
    };
    const adjectives = ["Pro", "Ultra", "Premium", "Advanced", "Lite", "Elite", "Classic", "Standard", "Wireless", "Smart"];
    const nounList = nouns[cat.name] || ["Item", "Device", "Product", "Gear"];
    for (let j = 1; j <= 16; j++) {
      const brandObj = categoryBrands[Math.floor(random() * categoryBrands.length)];
      const adj = adjectives[Math.floor(random() * adjectives.length)];
      const noun = nounList[Math.floor(random() * nounList.length)];
      const title = `${brandObj.name} ${noun} ${adj}`;
      let price = Math.floor(random() * 80) + 15;
      if (cat.name === "Laptops") price = Math.floor(random() * 1500) + 500;
      else if (cat.name === "Smartphones") price = Math.floor(random() * 900) + 200;
      else if (cat.name === "Audio") price = Math.floor(random() * 300) + 30;
      else if (cat.name === "Cameras") price = Math.floor(random() * 1e3) + 150;
      else if (cat.name === "Gaming") price = Math.floor(random() * 200) + 40;
      else if (cat.name === "Home Appliances") price = Math.floor(random() * 600) + 100;
      else if (cat.name === "Kitchenware") price = Math.floor(random() * 350) + 40;
      else if (cat.name === "Luggage") price = Math.floor(random() * 200) + 50;
      else if (cat.name === "Footwear") price = Math.floor(random() * 120) + 60;
      const rating = parseFloat((4 + random() * 1).toFixed(1));
      const reviewCount = Math.floor(random() * 180) + 10;
      const stock = Math.floor(random() * 85) + 15;
      const specifications = {
        "Model": `${brandObj.name.substring(0, 3).toUpperCase()}-${pIndex}`,
        "Warranty": "1 Year Manufacturer Warranty",
        "In the box": `${title}, User Manual, USB Cable, Power Adapter`
      };
      if (cat.name === "Laptops") {
        specifications["Processor"] = random() > 0.5 ? "Intel Core i7-13700H" : "AMD Ryzen 7 7840HS";
        specifications["RAM"] = random() > 0.4 ? "16GB DDR5" : "32GB DDR5";
        specifications["Storage"] = random() > 0.3 ? "512GB NVMe SSD" : "1TB NVMe SSD";
        specifications["Display"] = '15.6" IPS FHD (1920x1080), 144Hz';
      } else if (cat.name === "Smartphones") {
        specifications["Processor"] = "Octa-Core AI Chipset";
        specifications["Screen"] = '6.7" OLED HDR10+';
        specifications["Battery"] = "5000 mAh with 65W Fast Charge";
        specifications["Camera"] = "50MP Triple Camera with OIS";
      } else if (cat.name === "Footwear") {
        specifications["Material"] = "Breathable Mesh / Synthetic Upper";
        specifications["Sole"] = "Cushioned EVA Midsole with Rubber Outsole";
        specifications["Weight"] = "280g (Size 9)";
      }
      const reviews = [];
      const numReviews = Math.floor(random() * 4) + 1;
      for (let rIdx = 0; rIdx < numReviews; rIdx++) {
        const u = users[Math.floor(random() * users.length)];
        const ratingVal = Math.floor(random() * 2) + 4;
        const comm = reviewComments[Math.floor(random() * reviewComments.length)];
        reviews.push({
          id: `rev-${pIndex}-${rIdx}`,
          userId: u.id,
          userName: u.name,
          rating: ratingVal,
          comment: comm,
          createdAt: new Date(Date.now() - Math.floor(random() * 30) * 24 * 3600 * 1e3).toISOString()
        });
      }
      products.push({
        id: `p-${pIndex}`,
        title,
        description: `Experience the exceptional quality and innovative design of the all-new ${title}. Built to deliver outstanding performance, comfort, and durability, it features state-of-the-art materials and technology designed to fit seamlessly into your lifestyle. Whether for work, sports, or leisure, it represents the ultimate combination of form and function.`,
        price,
        rating,
        reviewCount,
        stock,
        category: cat.slug,
        brand: brandObj.slug,
        image: cat.image,
        // Use the category image for simplicity
        featured: pIndex % 15 === 0,
        // Mark some as featured
        specifications,
        reviews
      });
      pIndex++;
    }
  });
  for (let oIdx = 1; oIdx <= 500; oIdx++) {
    const user = users[Math.floor(random() * users.length)];
    const pCount = Math.floor(random() * 3) + 1;
    const orderItems = [];
    let subtotal = 0;
    for (let k = 0; k < pCount; k++) {
      const prod = products[Math.floor(random() * products.length)];
      const qty = Math.floor(random() * 2) + 1;
      orderItems.push({
        productId: prod.id,
        title: prod.title,
        price: prod.price,
        quantity: qty,
        image: prod.image
      });
      subtotal += prod.price * qty;
    }
    const shippingMethods = ["Standard Ground", "Express Saver", "Next Day Air"];
    const shippingMethod = shippingMethods[Math.floor(random() * shippingMethods.length)];
    const shippingCost = shippingMethod === "Standard Ground" ? 4.99 : shippingMethod === "Express Saver" ? 12.99 : 24.99;
    const tax = parseFloat((subtotal * 0.0825).toFixed(2));
    let discount = 0;
    let couponCode = void 0;
    if (random() > 0.6) {
      const c = coupons[Math.floor(random() * coupons.length)];
      couponCode = c.code;
      if (c.discountType === "percentage") {
        discount = parseFloat((subtotal * (c.value / 100)).toFixed(2));
      } else {
        discount = c.value;
      }
    }
    const total = parseFloat((subtotal + shippingCost + tax - discount).toFixed(2));
    const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    const statusIdx = random() > 0.15 ? 3 : Math.floor(random() * statuses.length);
    const status = statuses[statusIdx];
    const orderDate = new Date(Date.now() - Math.floor(random() * 120) * 24 * 3600 * 1e3 - 36e5);
    orders.push({
      id: `order-1000${oIdx}`,
      userId: user.id,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      shippingAddress: user.addresses[0],
      shippingMethod,
      couponCode,
      status,
      trackingNumber: status === "Shipped" || status === "Delivered" ? `TRK${1e8 + oIdx}` : void 0,
      createdAt: orderDate.toISOString()
    });
  }
  console.log(`Database seeded: ${products.length} products, ${categories.length} categories, ${users.length} users, ${orders.length} orders.`);
}
function getProductsList(filters) {
  let list = [...products];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (filters.category) {
    list = list.filter((p) => p.category === filters.category);
  }
  if (filters.brand) {
    list = list.filter((p) => p.brand === filters.brand);
  }
  if (filters.minPrice !== void 0) {
    list = list.filter((p) => p.price >= filters.minPrice);
  }
  if (filters.maxPrice !== void 0) {
    list = list.filter((p) => p.price <= filters.maxPrice);
  }
  if (filters.rating !== void 0) {
    list = list.filter((p) => p.rating >= filters.rating);
  }
  if (filters.sort) {
    const ord = filters.order === "desc" ? -1 : 1;
    if (filters.sort === "price") {
      list.sort((a, b) => (a.price - b.price) * ord);
    } else if (filters.sort === "rating") {
      list.sort((a, b) => (a.rating - b.rating) * ord);
    } else if (filters.sort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title) * ord);
    }
  }
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;
  const items = list.slice(offset, offset + limit);
  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages
    }
  };
}
function getProductById(id) {
  return products.find((p) => p.id === id);
}
function getUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
function getUserById(id) {
  return users.find((u) => u.id === id);
}
function createUser(email, name) {
  const nextId = `user-${users.length + 1}`;
  const newUser = {
    id: nextId,
    email: email.toLowerCase(),
    name,
    addresses: [
      {
        id: `addr-${users.length + 1}-1`,
        fullName: name,
        streetAddress: "123 Test Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
        isDefault: true
      }
    ],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  users.push(newUser);
  userPasswords[nextId] = "password";
  userCarts[nextId] = [];
  return newUser;
}
function getCart(userId) {
  if (!userCarts[userId]) {
    userCarts[userId] = [];
  }
  return userCarts[userId];
}
function addToCart(userId, productId, quantity) {
  const cart = getCart(userId);
  const existing = cart.find((item) => item.productId === productId);
  const product = getProductById(productId);
  if (!product) throw new Error("Product not found");
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, product.stock);
  } else {
    cart.push({
      productId,
      product,
      quantity: Math.min(quantity, product.stock)
    });
  }
  userCarts[userId] = cart;
  return cart;
}
function updateCart(userId, productId, quantity) {
  const cart = getCart(userId);
  const existing = cart.find((item) => item.productId === productId);
  if (!existing) throw new Error("Item not in cart");
  const product = getProductById(productId);
  if (!product) throw new Error("Product not found");
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }
  existing.quantity = Math.min(quantity, product.stock);
  userCarts[userId] = cart;
  return cart;
}
function removeFromCart(userId, productId) {
  let cart = getCart(userId);
  cart = cart.filter((item) => item.productId !== productId);
  userCarts[userId] = cart;
  return cart;
}
function clearCart(userId) {
  userCarts[userId] = [];
}
function getUserOrders(userId) {
  return orders.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
function getOrderById(id) {
  return orders.find((o) => o.id === id);
}
function cancelOrder(orderId) {
  const order = getOrderById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "Pending" && order.status !== "Processing") {
    throw new Error("Order cannot be cancelled in its current state");
  }
  order.status = "Cancelled";
  return order;
}
function createOrder(userId, items, shippingAddress, shippingMethod, couponCode) {
  if (items.length === 0) throw new Error("Cart is empty");
  for (const item of items) {
    const prod = getProductById(item.productId);
    if (!prod || prod.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${prod?.title || item.productId}`);
    }
  }
  let subtotal = 0;
  const orderItems = items.map((item) => {
    const prod = getProductById(item.productId);
    prod.stock -= item.quantity;
    subtotal += prod.price * item.quantity;
    return {
      productId: item.productId,
      title: prod.title,
      price: prod.price,
      quantity: item.quantity,
      image: prod.image
    };
  });
  const shippingCost = shippingMethod === "Standard Ground" ? 4.99 : shippingMethod === "Express Saver" ? 12.99 : 24.99;
  const tax = parseFloat((subtotal * 0.0825).toFixed(2));
  let discount = 0;
  if (couponCode) {
    const c = coupons.find((x) => x.code.toUpperCase() === couponCode.toUpperCase());
    if (c) {
      if (!c.minSpend || subtotal >= c.minSpend) {
        if (c.discountType === "percentage") {
          discount = parseFloat((subtotal * (c.value / 100)).toFixed(2));
        } else {
          discount = c.value;
        }
      }
    }
  }
  const total = parseFloat((subtotal + shippingCost + tax - discount).toFixed(2));
  const newOrder = {
    id: `order-1000${orders.length + 1}`,
    userId,
    items: orderItems,
    subtotal,
    shippingCost,
    tax,
    discount,
    total,
    shippingAddress,
    shippingMethod,
    couponCode,
    status: "Pending",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  orders.push(newOrder);
  clearCart(userId);
  return newOrder;
}

// server.ts
initDb();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const parts = c.trim().split("=");
      return [parts[0], parts.slice(1).join("=")];
    })
  );
  let sid = cookies.sid;
  if (!sid) {
    sid = "sid_" + Math.random().toString(36).substring(2, 15);
    res.setHeader("Set-Cookie", `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`);
  }
  req.sid = sid;
  next();
});
var sessions = {};
function getSession(sid) {
  if (!sessions[sid]) {
    sessions[sid] = {
      userId: "user-1",
      // Default to User 1 (John Smith) for immediate testing
      history: []
    };
  }
  return sessions[sid];
}
app.post("/api/auth/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const existing = getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "User already exists" });
  }
  const user = createUser(email, name);
  const session = getSession(req.sid);
  session.userId = user.id;
  session.history = [];
  res.status(201).json({ user, token: `mock-jwt-token-${user.id}` });
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }
  const user = getUserByEmail(email);
  if (!user || userPasswords[user.id] !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const session = getSession(req.sid);
  session.userId = user.id;
  session.history = [];
  res.json({ user, token: `mock-jwt-token-${user.id}` });
});
app.post("/api/auth/logout", (req, res) => {
  const session = getSession(req.sid);
  session.userId = "user-1";
  session.history = [];
  res.json({ success: true });
});
app.get("/api/auth/me", (req, res) => {
  const session = getSession(req.sid);
  const user = getUserById(session.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});
app.get("/api/products", (req, res) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sort,
    order,
    page,
    limit
  } = req.query;
  const filters = {
    search: search ? String(search) : void 0,
    category: category ? String(category) : void 0,
    brand: brand ? String(brand) : void 0,
    minPrice: minPrice ? Number(minPrice) : void 0,
    maxPrice: maxPrice ? Number(maxPrice) : void 0,
    rating: rating ? Number(rating) : void 0,
    sort: sort ? String(sort) : void 0,
    order: order ? String(order) : void 0,
    page: page ? Number(page) : void 0,
    limit: limit ? Number(limit) : void 0
  };
  const results = getProductsList(filters);
  res.json(results);
});
app.get("/api/products/categories", (req, res) => {
  res.json(categories);
});
app.get("/api/products/brands", (req, res) => {
  res.json(brands);
});
app.get("/api/products/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});
app.get("/api/cart", (req, res) => {
  const session = getSession(req.sid);
  res.json({ items: getCart(session.userId) });
});
app.post("/api/cart/add", (req, res) => {
  const session = getSession(req.sid);
  const { productId, quantity } = req.body;
  try {
    const cart = addToCart(session.userId, productId, Number(quantity || 1));
    res.json({ items: cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/api/cart/update", (req, res) => {
  const session = getSession(req.sid);
  const { productId, quantity } = req.body;
  try {
    const cart = updateCart(session.userId, productId, Number(quantity));
    res.json({ items: cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/cart/remove", (req, res) => {
  const session = getSession(req.sid);
  const { productId } = req.body;
  try {
    const cart = removeFromCart(session.userId, productId);
    res.json({ items: cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/cart/clear", (req, res) => {
  const session = getSession(req.sid);
  clearCart(session.userId);
  res.json({ items: [] });
});
app.post("/api/checkout/calculate", (req, res) => {
  const session = getSession(req.sid);
  const { shippingMethod, couponCode } = req.body;
  const items = getCart(session.userId);
  let subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = shippingMethod === "Standard Ground" ? 4.99 : shippingMethod === "Express Saver" ? 12.99 : 24.99;
  const tax = parseFloat((subtotal * 0.0825).toFixed(2));
  let discount = 0;
  if (couponCode) {
    const c = coupons.find((x) => x.code.toUpperCase() === couponCode.toUpperCase());
    if (c) {
      if (!c.minSpend || subtotal >= c.minSpend) {
        if (c.discountType === "percentage") {
          discount = parseFloat((subtotal * (c.value / 100)).toFixed(2));
        } else {
          discount = c.value;
        }
      }
    }
  }
  const total = parseFloat((subtotal + shippingCost + tax - discount).toFixed(2));
  res.json({ subtotal, shippingCost, tax, discount, total });
});
app.post("/api/checkout/place-order", (req, res) => {
  const session = getSession(req.sid);
  const { shippingAddressId, shippingMethod, couponCode } = req.body;
  const user = getUserById(session.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const items = getCart(session.userId);
  if (items.length === 0) return res.status(400).json({ error: "Cart is empty" });
  const addr = user.addresses.find((a) => a.id === shippingAddressId) || user.addresses[0];
  try {
    const order = createOrder(session.userId, items, addr, shippingMethod || "Standard Ground", couponCode);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/orders", (req, res) => {
  const session = getSession(req.sid);
  res.json(getUserOrders(session.userId));
});
app.get("/api/orders/:id", (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});
app.post("/api/orders/:id/cancel", (req, res) => {
  try {
    const order = cancelOrder(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/user/profile", (req, res) => {
  const session = getSession(req.sid);
  const user = getUserById(session.userId);
  res.json(user);
});
app.put("/api/user/profile", (req, res) => {
  const session = getSession(req.sid);
  const user = getUserById(session.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { name, email, addresses } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (addresses) user.addresses = addresses;
  res.json(user);
});
app.put("/api/user/change-password", (req, res) => {
  const session = getSession(req.sid);
  const { oldPassword, newPassword } = req.body;
  const currentPassword = userPasswords[session.userId];
  if (currentPassword !== oldPassword) {
    return res.status(400).json({ error: "Incorrect current password" });
  }
  userPasswords[session.userId] = newPassword;
  res.json({ success: true });
});
app.get("/api/coupons", (req, res) => {
  res.json(coupons);
});
var toolDeclarations = [
  {
    name: "search_products",
    description: "Search and filter products in the store. Can search by text keyword, category, brand, price ranges, and minimum rating.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        search: { type: import_genai.Type.STRING, description: "Keyword to search in product title or description (e.g., 'gaming', 'nike')" },
        category: { type: import_genai.Type.STRING, description: "Category slug to filter by (e.g., 'laptops', 'footwear', 'smartphones')" },
        brand: { type: import_genai.Type.STRING, description: "Brand slug to filter by (e.g., 'nike', 'apple', 'sony')" },
        minPrice: { type: import_genai.Type.NUMBER, description: "Minimum price in dollars" },
        maxPrice: { type: import_genai.Type.NUMBER, description: "Maximum price in dollars" },
        rating: { type: import_genai.Type.NUMBER, description: "Minimum customer rating (from 1 to 5)" }
      }
    }
  },
  {
    name: "get_product",
    description: "Retrieve comprehensive specifications, price, brand, stock inventory, and user reviews for a specific product by its ID (e.g., 'p-1').",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        id: { type: import_genai.Type.STRING, description: "The product ID (e.g., 'p-1')" }
      },
      required: ["id"]
    }
  },
  {
    name: "compare_products",
    description: "Compare technical specifications, ratings, stock, and pricing of two or three products side-by-side using their product IDs.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        ids: {
          type: import_genai.Type.ARRAY,
          items: { type: import_genai.Type.STRING },
          description: "List of product IDs to compare (e.g. ['p-1', 'p-2'])"
        }
      },
      required: ["ids"]
    }
  },
  {
    name: "add_to_cart",
    description: "Add a product to the user's shopping cart by product ID. Defaults to quantity 1 if not specified.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        productId: { type: import_genai.Type.STRING, description: "The product ID to add (e.g., 'p-15')" },
        quantity: { type: import_genai.Type.NUMBER, description: "The quantity of items to add (optional, defaults to 1)" }
      },
      required: ["productId"]
    }
  },
  {
    name: "update_cart",
    description: "Update the quantity of an item already in the user's cart.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        productId: { type: import_genai.Type.STRING, description: "The product ID to update" },
        quantity: { type: import_genai.Type.NUMBER, description: "The new quantity (must be 0 or greater. 0 removes it)" }
      },
      required: ["productId", "quantity"]
    }
  },
  {
    name: "remove_from_cart",
    description: "Remove an item entirely from the user's shopping cart.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        productId: { type: import_genai.Type.STRING, description: "The product ID to remove" }
      },
      required: ["productId"]
    }
  },
  {
    name: "apply_coupon",
    description: "Apply a coupon code (e.g., SAVE10, SAVE20) to calculate savings on the current cart items.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        couponCode: { type: import_genai.Type.STRING, description: "The coupon code to apply (e.g. SAVE20)" }
      },
      required: ["couponCode"]
    }
  },
  {
    name: "calculate_shipping",
    description: "Estimate shipping rates, tax, and order total for a shipping method before checkout.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        shippingMethod: { type: import_genai.Type.STRING, description: "Shipping method: 'Standard Ground', 'Express Saver', or 'Next Day Air'" },
        couponCode: { type: import_genai.Type.STRING, description: "An optional coupon code" }
      },
      required: ["shippingMethod"]
    }
  },
  {
    name: "checkout",
    description: "Finalize the cart, apply an optional coupon, select shipping, and place a real order. ALWAYS ask the user for confirmation first or confirm the address and total before triggering this.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        shippingAddressId: { type: import_genai.Type.STRING, description: "Optional specific address ID. If omitted, uses the user's default address." },
        shippingMethod: { type: import_genai.Type.STRING, description: "Shipping method: 'Standard Ground', 'Express Saver', or 'Next Day Air' (defaults to 'Standard Ground')" },
        couponCode: { type: import_genai.Type.STRING, description: "An optional coupon code" }
      },
      required: ["shippingMethod"]
    }
  },
  {
    name: "track_order",
    description: "Get real-time tracking information, delivery status, and order details for a specific order by its order ID (e.g., 'order-10001').",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        orderId: { type: import_genai.Type.STRING, description: "The order ID to track" }
      },
      required: ["orderId"]
    }
  },
  {
    name: "cancel_order",
    description: "Cancel an existing order by its ID. Can only be done if the order is Pending or Processing.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        orderId: { type: import_genai.Type.STRING, description: "The order ID to cancel" }
      },
      required: ["orderId"]
    }
  },
  {
    name: "search_orders",
    description: "Search and view details of the user's historical orders.",
    parameters: {
      type: import_genai.Type.OBJECT,
      properties: {
        search: { type: import_genai.Type.STRING, description: "Keyword to search within order details or product titles" }
      }
    }
  }
];
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server successfully running on http://localhost:${PORT} [ENV: ${process.env.NODE_ENV || "development"}]`);
  });
}
startServer();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
