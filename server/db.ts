/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Brand, User, Order, Review, Coupon, Address, CartItem } from '../types';

// Simple seedable random number generator for determinism
function createRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Global in-memory tables
export let categories: Category[] = [];
export let brands: Brand[] = [];
export let products: Product[] = [];
export let users: User[] = [];
export let userPasswords: Record<string, string> = {}; // userId -> password
export let orders: Order[] = [];
export let coupons: Coupon[] = [];
export let userCarts: Record<string, CartItem[]> = {}; // userId -> CartItem[]

// Initialize database
export function initDb() {
  if (products.length > 0) return; // Already initialized

  const random = createRandom(12345);

  // 1. Generate Categories (20)
  const categoryNames = [
    { name: 'Electronics', desc: 'Gadgets, devices, and accessories', slug: 'electronics', img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80' },
    { name: 'Laptops', desc: 'Powerful workhorses and gaming rigs', slug: 'laptops', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80' },
    { name: 'Smartphones', desc: 'Pocket computing powerhouses', slug: 'smartphones', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
    { name: 'Audio', desc: 'Headphones, speakers, and amplifiers', slug: 'audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
    { name: 'Wearables', desc: 'Smartwatches and fitness trackers', slug: 'wearables', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    { name: 'Cameras', desc: 'Capture your memories in high-definition', slug: 'cameras', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80' },
    { name: 'Accessories', desc: 'Cases, chargers, and cables', slug: 'accessories', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
    { name: 'Gaming', desc: 'Consoles, controllers, and gear', slug: 'gaming', img: 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=400&q=80' },
    { name: 'Home Appliances', desc: 'Smart vacuums, purifiers, and climate control', slug: 'home-appliances', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80' },
    { name: 'Kitchenware', desc: 'Blenders, mixers, and cookware', slug: 'kitchenware', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80' },
    { name: 'Fitness', desc: 'Dumbbells, resistance bands, and workout gear', slug: 'fitness', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80' },
    { name: 'Footwear', desc: 'Running shoes, sneakers, and casual wear', slug: 'footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
    { name: 'Apparel', desc: 'Jackets, activewear, and daily style', slug: 'apparel', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80' },
    { name: 'Smart Home', desc: 'Lights, cameras, and security integrations', slug: 'smart-home', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80' },
    { name: 'Personal Care', desc: 'Shavers, hair dryers, and grooming', slug: 'personal-care', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { name: 'Outdoor', desc: 'Tents, backpacks, and hiking essentials', slug: 'outdoor', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80' },
    { name: 'Toys', desc: 'Fun, learning, and creative building blocks', slug: 'toys', img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80' },
    { name: 'Automotive', desc: 'Dash cams, cleaners, and car accessories', slug: 'automotive', img: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&q=80' },
    { name: 'Luggage', desc: 'Suitcases, duffels, and travel packs', slug: 'luggage', img: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&q=80' },
    { name: 'Office', desc: 'Chairs, desks, organizers, and stationery', slug: 'office', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80' }
  ];

  categories = categoryNames.map((c, i) => ({
    id: `cat-${i + 1}`,
    name: c.name,
    description: c.desc,
    slug: c.slug,
    image: c.img
  }));

  // 2. Generate Brands (15)
  const brandNames = [
    'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Asus', 'Lenovo', 'Logitech',
    'Nike', 'Adidas', 'Puma', 'Under Armour', 'KitchenAid', 'Dyson', 'GoPro'
  ];

  brands = brandNames.map((b, i) => ({
    id: `brand-${i + 1}`,
    name: b,
    slug: b.toLowerCase().replace(/\s+/g, '-')
  }));

  // 3. Generate Coupons
  const couponCodes = [
    { code: 'SAVE10', type: 'percentage' as const, value: 10, min: 50, desc: '10% off orders over $50' },
    { code: 'SAVE20', type: 'percentage' as const, value: 20, min: 100, desc: '20% off orders over $100' },
    { code: 'WELCOME50', type: 'fixed' as const, value: 50, min: 200, desc: '$50 flat discount on orders over $200' },
    { code: 'FREESHIP', type: 'percentage' as const, value: 0, min: 30, desc: 'Free shipping on orders over $30 (shipping value is fully discounted)' },
    { code: 'VIP15', type: 'percentage' as const, value: 15, min: 0, desc: '15% off for our VIP members, no minimum' }
  ];

  coupons = couponCodes.map(c => ({
    code: c.code,
    discountType: c.type,
    value: c.value,
    minSpend: c.min,
    expiryDate: '2028-12-31',
    description: c.desc
  }));

  // 4. Generate Users (50)
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Ashley', 'Robert', 'Jessica'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];
  const streets = ['Broadway', 'Sunset Blvd', 'Michigan Ave', 'Main St', 'Oak St', 'Pine St', 'Maple Ave', 'Washington St', 'Cedar Rd', 'Elm St'];

  for (let i = 1; i <= 50; i++) {
    const fName = firstNames[Math.floor(random() * firstNames.length)];
    const lName = lastNames[Math.floor(random() * lastNames.length)];
    const name = `${fName} ${lName}`;
    const email = i === 1 ? 'user1@demo.com' : `user${i}@demo.com`;
    const password = 'password'; // Simple uniform password for tests

    const userCities = [cities[Math.floor(random() * cities.length)], cities[Math.floor(random() * cities.length)]];
    const userStates = [states[cities.indexOf(userCities[0])], states[cities.indexOf(userCities[1])]];

    const addresses: Address[] = [
      {
        id: `addr-${i}-1`,
        fullName: name,
        streetAddress: `${Math.floor(random() * 9000) + 100} ${streets[Math.floor(random() * streets.length)]}`,
        city: userCities[0],
        state: userStates[0],
        postalCode: String(Math.floor(random() * 90000) + 10000),
        country: 'United States',
        isDefault: true
      },
      {
        id: `addr-${i}-2`,
        fullName: name,
        streetAddress: `${Math.floor(random() * 9000) + 100} Office Pkwy`,
        city: userCities[1],
        state: userStates[1],
        postalCode: String(Math.floor(random() * 90000) + 10000),
        country: 'United States',
        isDefault: false
      }
    ];

    const userId = `user-${i}`;
    users.push({
      id: userId,
      email,
      name,
      addresses,
      createdAt: new Date(Date.now() - (50 - i) * 24 * 3600 * 1000).toISOString()
    });

    userPasswords[userId] = password;
    userCarts[userId] = []; // Initialize empty cart
  }

  // 5. Generate Products (300+)
  // We will loop through the 20 categories, and generate 16 products for each to reach 320 products
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
    // Select brand list compatible with this category
    let categoryBrands = brands;
    if (['Laptops', 'Smartphones'].includes(cat.name)) {
      categoryBrands = brands.filter(b => ['Apple', 'Samsung', 'Dell', 'HP', 'Asus', 'Lenovo'].includes(b.name));
    } else if (cat.name === 'Footwear' || cat.name === 'Apparel') {
      categoryBrands = brands.filter(b => ['Nike', 'Adidas', 'Puma', 'Under Armour'].includes(b.name));
    } else if (cat.name === 'Audio' || cat.name === 'Gaming') {
      categoryBrands = brands.filter(b => ['Sony', 'Apple', 'Asus', 'Logitech', 'Samsung'].includes(b.name));
    } else if (cat.name === 'Kitchenware' || cat.name === 'Home Appliances') {
      categoryBrands = brands.filter(b => ['KitchenAid', 'Dyson', 'Samsung', 'Sony'].includes(b.name));
    }

    const nouns: Record<string, string[]> = {
      'Electronics': ['Power Bank', 'Wireless Charger', 'Bluetooth Adapter', 'HDMI Splitter', 'LED Strip', 'Screwdriver Set', 'Smart Plug', 'Extension Cord'],
      'Laptops': ['ZenBook', 'XPS', 'Pavilion', 'ThinkPad', 'MacBook Air', 'MacBook Pro', 'TUF Gaming', 'Legion Slim', 'Inspiron'],
      'Smartphones': ['Galaxy S24', 'iPhone 15', 'Galaxy A55', 'Xperia Pro', 'ZenFone Pro', 'Pixel Pro', 'Redmi Note', 'Blade Ultra'],
      'Audio': ['Over-Ear Headphones', 'Wireless Earbuds', 'Soundbar 500', 'Smart Speaker', 'Studio Monitor', 'Noise Cancelling Buds', 'Gaming Headset'],
      'Wearables': ['Fitbit Pulse', 'Watch Series 9', 'Smart Band Pro', 'GPS Sports Watch', 'Active Smartwatch', 'Rugged Explorer Watch'],
      'Cameras': ['Action Camera 4K', 'Mirrorless Creator', 'Compact Vlog Camera', 'Vlogging Rig', '360 Action Cam', 'Macro Lens Kit'],
      'Accessories': ['USB-C Hub', 'Laptop Stand', 'Leather Phone Case', 'Fast Charging Block', 'Screen Protector Kit', 'Travel Organizer'],
      'Gaming': ['Mechanical Keyboard', 'RGB Gaming Mouse', 'Pro Gamepad', 'Steering Wheel Kit', 'Streaming Mic', 'VR Headset Grip', 'RGB Desk Pad'],
      'Home Appliances': ['V15 Cordless Vacuum', 'Purifier Hot+Cool', 'Smart Humidifier', 'Robotic Vacuum X2', 'Dehumidifier Elite'],
      'Kitchenware': ['Stand Mixer 5-Qt', 'Food Processor', 'Air Fryer XL', 'Electric Kettle', 'Espresso Maker Pro', 'Slicing Knife Set'],
      'Fitness': ['Dumbbell Set', 'Yoga Mat Premium', 'Resistance Bands', 'Kettlebell 15lbs', 'Foam Roller Pro', 'Jump Rope Speed'],
      'Footwear': ['Air Zoom Running Shoes', 'Ultraboost Sneakers', 'Rider Trainer Shoes', 'Project Rock Training Shoes', 'Daily Classic Canvas'],
      'Apparel': ['Windbreaker Jacket', 'Dry-Fit Training Tee', 'Fleece Jogger Pants', 'Tech Fleece Hoodie', 'Compression Shorts'],
      'Smart Home': ['Smart Lightbulb Pack', 'WiFi Smart Lock', 'Video Doorbell', 'Security Camera Pan-Tilt', 'Smart Thermostat'],
      'Personal Care': ['Electric Shaver', 'Sonic Toothbrush', 'Ionic Hair Dryer', 'Beard Trimmer Kit', 'Skincare Cooler'],
      'Outdoor': ['Camping Tent 4-Person', 'Hiking Backpack 55L', 'Sleeping Bag Thermal', 'LED Camping Lantern', 'Water Filter Straw'],
      'Toys': ['Space Building Blocks', 'Coding Robot Kit', 'Magnetic Drawing Board', 'RC Stunt Car', 'Creative Clay Workshop'],
      'Automotive': ['Dash Cam 1080p', 'Car Vacuum Cleaner', 'Leather Cleaning Kit', 'OBD2 Scanner Tool', 'Bluetooth FM Transmitter'],
      'Luggage': ['Hardside Spinner 20"', 'Travel Duffel Bag', 'Anti-Theft Backpack', 'Packing Cubes Set', 'Toiletry Bag Premium'],
      'Office': ['Ergonomic Mesh Chair', 'Adjustable Desk Converter', 'Desk Mat Premium', 'Monitor Arm Mount', 'Document Organizer Tray']
    };

    const adjectives = ['Pro', 'Ultra', 'Premium', 'Advanced', 'Lite', 'Elite', 'Classic', 'Standard', 'Wireless', 'Smart'];
    const nounList = nouns[cat.name] || ['Item', 'Device', 'Product', 'Gear'];

    for (let j = 1; j <= 16; j++) {
      const brandObj = categoryBrands[Math.floor(random() * categoryBrands.length)];
      const adj = adjectives[Math.floor(random() * adjectives.length)];
      const noun = nounList[Math.floor(random() * nounList.length)];
      const title = `${brandObj.name} ${noun} ${adj}`;

      // Price mapping by category
      let price = Math.floor(random() * 80) + 15; // default $15 - $95
      if (cat.name === 'Laptops') price = Math.floor(random() * 1500) + 500; // $500 - $2000
      else if (cat.name === 'Smartphones') price = Math.floor(random() * 900) + 200; // $200 - $1100
      else if (cat.name === 'Audio') price = Math.floor(random() * 300) + 30; // $30 - $330
      else if (cat.name === 'Cameras') price = Math.floor(random() * 1000) + 150; // $150 - $1150
      else if (cat.name === 'Gaming') price = Math.floor(random() * 200) + 40; // $40 - $240
      else if (cat.name === 'Home Appliances') price = Math.floor(random() * 600) + 100; // $100 - $700
      else if (cat.name === 'Kitchenware') price = Math.floor(random() * 350) + 40; // $40 - $390
      else if (cat.name === 'Luggage') price = Math.floor(random() * 200) + 50; // $50 - $250
      else if (cat.name === 'Footwear') price = Math.floor(random() * 120) + 60; // $60 - $180

      const rating = parseFloat((4.0 + random() * 1.0).toFixed(1));
      const reviewCount = Math.floor(random() * 180) + 10;
      const stock = Math.floor(random() * 85) + 15;

      const specifications: Record<string, string> = {
        'Model': `${brandObj.name.substring(0, 3).toUpperCase()}-${pIndex}`,
        'Warranty': '1 Year Manufacturer Warranty',
        'In the box': `${title}, User Manual, USB Cable, Power Adapter`
      };

      if (cat.name === 'Laptops') {
        specifications['Processor'] = random() > 0.5 ? 'Intel Core i7-13700H' : 'AMD Ryzen 7 7840HS';
        specifications['RAM'] = random() > 0.4 ? '16GB DDR5' : '32GB DDR5';
        specifications['Storage'] = random() > 0.3 ? '512GB NVMe SSD' : '1TB NVMe SSD';
        specifications['Display'] = '15.6" IPS FHD (1920x1080), 144Hz';
      } else if (cat.name === 'Smartphones') {
        specifications['Processor'] = 'Octa-Core AI Chipset';
        specifications['Screen'] = '6.7" OLED HDR10+';
        specifications['Battery'] = '5000 mAh with 65W Fast Charge';
        specifications['Camera'] = '50MP Triple Camera with OIS';
      } else if (cat.name === 'Footwear') {
        specifications['Material'] = 'Breathable Mesh / Synthetic Upper';
        specifications['Sole'] = 'Cushioned EVA Midsole with Rubber Outsole';
        specifications['Weight'] = '280g (Size 9)';
      }

      // Generate Reviews
      const reviews: Review[] = [];
      const numReviews = Math.floor(random() * 4) + 1; // 1-4 reviews
      for (let rIdx = 0; rIdx < numReviews; rIdx++) {
        const u = users[Math.floor(random() * users.length)];
        const ratingVal = Math.floor(random() * 2) + 4; // 4 or 5 stars
        const comm = reviewComments[Math.floor(random() * reviewComments.length)];
        reviews.push({
          id: `rev-${pIndex}-${rIdx}`,
          userId: u.id,
          userName: u.name,
          rating: ratingVal,
          comment: comm,
          createdAt: new Date(Date.now() - Math.floor(random() * 30) * 24 * 3600 * 1000).toISOString()
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
        image: cat.image, // Use the category image for simplicity
        featured: pIndex % 15 === 0, // Mark some as featured
        specifications,
        reviews
      });

      pIndex++;
    }
  });

  // 6. Generate Historical Orders (500)
  // Seed historical orders across our 50 users to make tracking and order searching high fidelity
  for (let oIdx = 1; oIdx <= 500; oIdx++) {
    const user = users[Math.floor(random() * users.length)];
    const pCount = Math.floor(random() * 3) + 1; // 1 to 3 items
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

    const shippingMethods = ['Standard Ground', 'Express Saver', 'Next Day Air'];
    const shippingMethod = shippingMethods[Math.floor(random() * shippingMethods.length)];
    const shippingCost = shippingMethod === 'Standard Ground' ? 4.99 : (shippingMethod === 'Express Saver' ? 12.99 : 24.99);
    const tax = parseFloat((subtotal * 0.0825).toFixed(2)); // 8.25% tax

    // Apply some coupon at random
    let discount = 0;
    let couponCode: string | undefined = undefined;
    if (random() > 0.6) {
      const c = coupons[Math.floor(random() * coupons.length)];
      couponCode = c.code;
      if (c.discountType === 'percentage') {
        discount = parseFloat((subtotal * (c.value / 100)).toFixed(2));
      } else {
        discount = c.value;
      }
    }

    const total = parseFloat((subtotal + shippingCost + tax - discount).toFixed(2));
    const statuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const statusIdx = random() > 0.15 ? 3 : Math.floor(random() * statuses.length); // mostly Delivered
    const status = statuses[statusIdx];

    const orderDate = new Date(Date.now() - Math.floor(random() * 120) * 24 * 3600 * 1000 - 3600000); // within last 120 days

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
      trackingNumber: status === 'Shipped' || status === 'Delivered' ? `TRK${100000000 + oIdx}` : undefined,
      createdAt: orderDate.toISOString()
    });
  }

  console.log(`Database seeded: ${products.length} products, ${categories.length} categories, ${users.length} users, ${orders.length} orders.`);
}

// Database Helpers
export function getProductsList(filters: {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}) {
  let list = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (filters.category) {
    list = list.filter(p => p.category === filters.category);
  }
  if (filters.brand) {
    list = list.filter(p => p.brand === filters.brand);
  }
  if (filters.minPrice !== undefined) {
    list = list.filter(p => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    list = list.filter(p => p.price <= filters.maxPrice!);
  }
  if (filters.rating !== undefined) {
    list = list.filter(p => p.rating >= filters.rating!);
  }

  // Sorting
  if (filters.sort) {
    const ord = filters.order === 'desc' ? -1 : 1;
    if (filters.sort === 'price') {
      list.sort((a, b) => (a.price - b.price) * ord);
    } else if (filters.sort === 'rating') {
      list.sort((a, b) => (a.rating - b.rating) * ord);
    } else if (filters.sort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title) * ord);
    }
  }

  // Pagination
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

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function createUser(email: string, name: string): User {
  const nextId = `user-${users.length + 1}`;
  const newUser: User = {
    id: nextId,
    email: email.toLowerCase(),
    name,
    addresses: [
      {
        id: `addr-${users.length + 1}-1`,
        fullName: name,
        streetAddress: '123 Test Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        isDefault: true
      }
    ],
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  userPasswords[nextId] = 'password';
  userCarts[nextId] = [];
  return newUser;
}

export function getCart(userId: string): CartItem[] {
  if (!userCarts[userId]) {
    userCarts[userId] = [];
  }
  return userCarts[userId];
}

export function addToCart(userId: string, productId: string, quantity: number): CartItem[] {
  const cart = getCart(userId);
  const existing = cart.find(item => item.productId === productId);
  const product = getProductById(productId);
  if (!product) throw new Error('Product not found');

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

export function updateCart(userId: string, productId: string, quantity: number): CartItem[] {
  const cart = getCart(userId);
  const existing = cart.find(item => item.productId === productId);
  if (!existing) throw new Error('Item not in cart');

  const product = getProductById(productId);
  if (!product) throw new Error('Product not found');

  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  existing.quantity = Math.min(quantity, product.stock);
  userCarts[userId] = cart;
  return cart;
}

export function removeFromCart(userId: string, productId: string): CartItem[] {
  let cart = getCart(userId);
  cart = cart.filter(item => item.productId !== productId);
  userCarts[userId] = cart;
  return cart;
}

export function clearCart(userId: string) {
  userCarts[userId] = [];
}

export function getUserOrders(userId: string): Order[] {
  return orders.filter(o => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrderById(id: string): Order | undefined {
  return orders.find(o => o.id === id);
}

export function cancelOrder(orderId: string): Order {
  const order = getOrderById(orderId);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'Pending' && order.status !== 'Processing') {
    throw new Error('Order cannot be cancelled in its current state');
  }
  order.status = 'Cancelled';
  return order;
}

export function createOrder(
  userId: string,
  items: CartItem[],
  shippingAddress: Address,
  shippingMethod: string,
  couponCode?: string
): Order {
  if (items.length === 0) throw new Error('Cart is empty');

  // Validate stock
  for (const item of items) {
    const prod = getProductById(item.productId);
    if (!prod || prod.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${prod?.title || item.productId}`);
    }
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = items.map(item => {
    const prod = getProductById(item.productId)!;
    // Deduct stock
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

  const shippingCost = shippingMethod === 'Standard Ground' ? 4.99 : (shippingMethod === 'Express Saver' ? 12.99 : 24.99);
  const tax = parseFloat((subtotal * 0.0825).toFixed(2));

  let discount = 0;
  if (couponCode) {
    const c = coupons.find(x => x.code.toUpperCase() === couponCode.toUpperCase());
    if (c) {
      if (!c.minSpend || subtotal >= c.minSpend) {
        if (c.discountType === 'percentage') {
          discount = parseFloat((subtotal * (c.value / 100)).toFixed(2));
        } else {
          discount = c.value;
        }
      }
    }
  }

  const total = parseFloat((subtotal + shippingCost + tax - discount).toFixed(2));
  const newOrder: Order = {
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
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  clearCart(userId);
  return newOrder;
}
