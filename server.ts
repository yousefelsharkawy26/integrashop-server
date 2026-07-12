import { Type } from '@google/genai';
import * as db from './server/db';
import express from 'express';

// Initialize the database seed data
db.initDb();

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple custom cookie parser middleware for session tracking
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );

  let sid = cookies.sid;
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 15);
    res.setHeader('Set-Cookie', `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`);
  }

  (req as any).sid = sid;
  next();
});

// Session store
const sessions: Record<string, { userId: string; history: any[] }> = {};

function getSession(sid: string) {
  if (!sessions[sid]) {
    sessions[sid] = {
      userId: 'user-1', // Default to User 1 (John Smith) for immediate testing
      history: []
    };
  }
  return sessions[sid];
}

// REST API Endpoints

// 1. Auth APIs
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const user = db.createUser(email, name);
  const session = getSession((req as any).sid);
  session.userId = user.id;
  session.history = []; // reset history for new user
  res.status(201).json({ user, token: `mock-jwt-token-${user.id}` });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  const user = db.getUserByEmail(email);
  if (!user || db.userPasswords[user.id] !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const session = getSession((req as any).sid);
  session.userId = user.id;
  session.history = []; // Reset history on login
  res.json({ user, token: `mock-jwt-token-${user.id}` });
});

app.post('/api/auth/logout', (req, res) => {
  const session = getSession((req as any).sid);
  session.userId = 'user-1'; // Reset to default user on logout instead of null
  session.history = [];
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const session = getSession((req as any).sid);
  const user = db.getUserById(session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// 2. Product APIs
app.get('/api/products', (req, res) => {
  const {
    search, category, brand, minPrice, maxPrice, rating, sort, order, page, limit
  } = req.query;

  const filters = {
    search: search ? String(search) : undefined,
    category: category ? String(category) : undefined,
    brand: brand ? String(brand) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    rating: rating ? Number(rating) : undefined,
    sort: sort ? String(sort) : undefined,
    order: order ? String(order) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  };

  const results = db.getProductsList(filters);
  res.json(results);
});

app.get('/api/products/categories', (req, res) => {
  res.json(db.categories);
});

app.get('/api/products/brands', (req, res) => {
  res.json(db.brands);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 3. Cart APIs
app.get('/api/cart', (req, res) => {
  const session = getSession((req as any).sid);
  res.json({ items: db.getCart(session.userId) });
});

app.post('/api/cart/add', (req, res) => {
  const session = getSession((req as any).sid);
  const { productId, quantity } = req.body;
  try {
    const cart = db.addToCart(session.userId, productId, Number(quantity || 1));
    res.json({ items: cart });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/cart/update', (req, res) => {
  const session = getSession((req as any).sid);
  const { productId, quantity } = req.body;
  try {
    const cart = db.updateCart(session.userId, productId, Number(quantity));
    res.json({ items: cart });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/cart/remove', (req, res) => {
  const session = getSession((req as any).sid);
  const { productId } = req.body;
  try {
    const cart = db.removeFromCart(session.userId, productId);
    res.json({ items: cart });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/cart/clear', (req, res) => {
  const session = getSession((req as any).sid);
  db.clearCart(session.userId);
  res.json({ items: [] });
});

// 4. Checkout APIs
app.post('/api/checkout/calculate', (req, res) => {
  const session = getSession((req as any).sid);
  const { shippingMethod, couponCode } = req.body;
  const items = db.getCart(session.userId);

  let subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'Standard Ground' ? 4.99 : (shippingMethod === 'Express Saver' ? 12.99 : 24.99);
  const tax = parseFloat((subtotal * 0.0825).toFixed(2));

  let discount = 0;
  if (couponCode) {
    const c = db.coupons.find(x => x.code.toUpperCase() === couponCode.toUpperCase());
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
  res.json({ subtotal, shippingCost, tax, discount, total });
});

app.post('/api/checkout/place-order', (req, res) => {
  const session = getSession((req as any).sid);
  const { shippingAddressId, shippingMethod, couponCode } = req.body;
  const user = db.getUserById(session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const items = db.getCart(session.userId);
  if (items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const addr = user.addresses.find(a => a.id === shippingAddressId) || user.addresses[0];
  try {
    const order = db.createOrder(session.userId, items, addr, shippingMethod || 'Standard Ground', couponCode);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Orders APIs
app.get('/api/orders', (req, res) => {
  const session = getSession((req as any).sid);
  res.json(db.getUserOrders(session.userId));
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/api/orders/:id/cancel', (req, res) => {
  try {
    const order = db.cancelOrder(req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. User Profile APIs
app.get('/api/user/profile', (req, res) => {
  const session = getSession((req as any).sid);
  const user = db.getUserById(session.userId);
  res.json(user);
});

app.put('/api/user/profile', (req, res) => {
  const session = getSession((req as any).sid);
  const user = db.getUserById(session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, email, addresses } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (addresses) user.addresses = addresses;

  res.json(user);
});

app.put('/api/user/change-password', (req, res) => {
  const session = getSession((req as any).sid);
  const { oldPassword, newPassword } = req.body;
  const currentPassword = db.userPasswords[session.userId];
  if (currentPassword !== oldPassword) {
    return res.status(400).json({ error: 'Incorrect current password' });
  }
  db.userPasswords[session.userId] = newPassword;
  res.json({ success: true });
});

// 7. Coupon validation API
app.get('/api/coupons', (req, res) => {
  res.json(db.coupons);
});

// Function Declarations for Gemini Tooling
const toolDeclarations = [
  {
    name: "search_products",
    description: "Search and filter products in the store. Can search by text keyword, category, brand, price ranges, and minimum rating.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        search: { type: Type.STRING, description: "Keyword to search in product title or description (e.g., 'gaming', 'nike')" },
        category: { type: Type.STRING, description: "Category slug to filter by (e.g., 'laptops', 'footwear', 'smartphones')" },
        brand: { type: Type.STRING, description: "Brand slug to filter by (e.g., 'nike', 'apple', 'sony')" },
        minPrice: { type: Type.NUMBER, description: "Minimum price in dollars" },
        maxPrice: { type: Type.NUMBER, description: "Maximum price in dollars" },
        rating: { type: Type.NUMBER, description: "Minimum customer rating (from 1 to 5)" }
      }
    }
  },
  {
    name: "get_product",
    description: "Retrieve comprehensive specifications, price, brand, stock inventory, and user reviews for a specific product by its ID (e.g., 'p-1').",
    parameters: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: "The product ID (e.g., 'p-1')" }
      },
      required: ["id"]
    }
  },
  {
    name: "compare_products",
    description: "Compare technical specifications, ratings, stock, and pricing of two or three products side-by-side using their product IDs.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        ids: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
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
      type: Type.OBJECT,
      properties: {
        productId: { type: Type.STRING, description: "The product ID to add (e.g., 'p-15')" },
        quantity: { type: Type.NUMBER, description: "The quantity of items to add (optional, defaults to 1)" }
      },
      required: ["productId"]
    }
  },
  {
    name: "update_cart",
    description: "Update the quantity of an item already in the user's cart.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        productId: { type: Type.STRING, description: "The product ID to update" },
        quantity: { type: Type.NUMBER, description: "The new quantity (must be 0 or greater. 0 removes it)" }
      },
      required: ["productId", "quantity"]
    }
  },
  {
    name: "remove_from_cart",
    description: "Remove an item entirely from the user's shopping cart.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        productId: { type: Type.STRING, description: "The product ID to remove" }
      },
      required: ["productId"]
    }
  },
  {
    name: "apply_coupon",
    description: "Apply a coupon code (e.g., SAVE10, SAVE20) to calculate savings on the current cart items.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        couponCode: { type: Type.STRING, description: "The coupon code to apply (e.g. SAVE20)" }
      },
      required: ["couponCode"]
    }
  },
  {
    name: "calculate_shipping",
    description: "Estimate shipping rates, tax, and order total for a shipping method before checkout.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        shippingMethod: { type: Type.STRING, description: "Shipping method: 'Standard Ground', 'Express Saver', or 'Next Day Air'" },
        couponCode: { type: Type.STRING, description: "An optional coupon code" }
      },
      required: ["shippingMethod"]
    }
  },
  {
    name: "checkout",
    description: "Finalize the cart, apply an optional coupon, select shipping, and place a real order. ALWAYS ask the user for confirmation first or confirm the address and total before triggering this.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        shippingAddressId: { type: Type.STRING, description: "Optional specific address ID. If omitted, uses the user's default address." },
        shippingMethod: { type: Type.STRING, description: "Shipping method: 'Standard Ground', 'Express Saver', or 'Next Day Air' (defaults to 'Standard Ground')" },
        couponCode: { type: Type.STRING, description: "An optional coupon code" }
      },
      required: ["shippingMethod"]
    }
  },
  {
    name: "track_order",
    description: "Get real-time tracking information, delivery status, and order details for a specific order by its order ID (e.g., 'order-10001').",
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: { type: Type.STRING, description: "The order ID to track" }
      },
      required: ["orderId"]
    }
  },
  {
    name: "cancel_order",
    description: "Cancel an existing order by its ID. Can only be done if the order is Pending or Processing.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: { type: Type.STRING, description: "The order ID to cancel" }
      },
      required: ["orderId"]
    }
  },
  {
    name: "search_orders",
    description: "Search and view details of the user's historical orders.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        search: { type: Type.STRING, description: "Keyword to search within order details or product titles" }
      }
    }
  }
];

// Execute a tool on the backend database
async function executeTool(name: string, args: any, userId: string): Promise<any> {
  console.log(`AI Tool Execution: ${name} with args:`, args, `for user: ${userId}`);

  try {
    switch (name) {
      case 'search_products': {
        const res = db.getProductsList({
          search: args.search,
          category: args.category,
          brand: args.brand,
          minPrice: args.minPrice,
          maxPrice: args.maxPrice,
          rating: args.rating,
          limit: 8 // limit AI results so it doesn't flood response
        });
        return {
          count: res.pagination.totalItems,
          products: res.items.map(p => ({ id: p.id, title: p.title, price: p.price, rating: p.rating, stock: p.stock, brand: p.brand, category: p.category }))
        };
      }

      case 'get_product': {
        const prod = db.getProductById(args.id);
        if (!prod) return { error: 'Product not found' };
        return {
          id: prod.id,
          title: prod.title,
          description: prod.description,
          price: prod.price,
          rating: prod.rating,
          stock: prod.stock,
          category: prod.category,
          brand: prod.brand,
          specifications: prod.specifications,
          reviewCount: prod.reviewCount,
          reviews: prod.reviews.slice(0, 3).map(r => ({ rating: r.rating, comment: r.comment, userName: r.userName }))
        };
      }

      case 'compare_products': {
        const results = [];
        for (const id of args.ids) {
          const prod = db.getProductById(id);
          if (prod) {
            results.push({
              id: prod.id,
              title: prod.title,
              price: prod.price,
              rating: prod.rating,
              stock: prod.stock,
              brand: prod.brand,
              specifications: prod.specifications
            });
          }
        }
        return results;
      }

      case 'add_to_cart': {
        const cart = db.addToCart(userId, args.productId, args.quantity || 1);
        const prod = db.getProductById(args.productId);
        return {
          success: true,
          message: `Added ${prod?.title || args.productId} to cart.`,
          cartItemCount: cart.length,
          currentCart: cart.map(i => ({ title: i.product.title, quantity: i.quantity, price: i.product.price }))
        };
      }

      case 'update_cart': {
        const cart = db.updateCart(userId, args.productId, args.quantity);
        return {
          success: true,
          message: `Updated item quantity to ${args.quantity}.`,
          currentCart: cart.map(i => ({ title: i.product.title, quantity: i.quantity, price: i.product.price }))
        };
      }

      case 'remove_from_cart': {
        const cart = db.removeFromCart(userId, args.productId);
        return {
          success: true,
          message: 'Item removed from cart.',
          currentCart: cart.map(i => ({ title: i.product.title, quantity: i.quantity, price: i.product.price }))
        };
      }

      case 'apply_coupon': {
        const c = db.coupons.find(x => x.code.toUpperCase() === args.couponCode.toUpperCase());
        if (!c) return { error: 'Invalid coupon code' };
        const cart = db.getCart(userId);
        const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
        if (c.minSpend && subtotal < c.minSpend) {
          return { error: `Coupon requires a minimum spend of $${c.minSpend}. Current subtotal is $${subtotal}.` };
        }
        const savings = c.discountType === 'percentage' ? parseFloat((subtotal * (c.value / 100)).toFixed(2)) : c.value;
        return { success: true, code: c.code, discount: savings, description: c.description };
      }

      case 'calculate_shipping': {
        const cart = db.getCart(userId);
        const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
        const shippingCost = args.shippingMethod === 'Standard Ground' ? 4.99 : (args.shippingMethod === 'Express Saver' ? 12.99 : 24.99);
        const tax = parseFloat((subtotal * 0.0825).toFixed(2));

        let discount = 0;
        if (args.couponCode) {
          const c = db.coupons.find(x => x.code.toUpperCase() === args.couponCode.toUpperCase());
          if (c && (!c.minSpend || subtotal >= c.minSpend)) {
            discount = c.discountType === 'percentage' ? parseFloat((subtotal * (c.value / 100)).toFixed(2)) : c.value;
          }
        }

        const total = parseFloat((subtotal + shippingCost + tax - discount).toFixed(2));
        return { subtotal, shippingCost, tax, discount, total };
      }

      case 'checkout': {
        const user = db.getUserById(userId);
        if (!user) return { error: 'User not found' };
        const cart = db.getCart(userId);
        if (cart.length === 0) return { error: 'Your shopping cart is empty.' };

        const addr = user.addresses[0]; // defaults to primary
        const order = db.createOrder(userId, cart, addr, args.shippingMethod || 'Standard Ground', args.couponCode);
        return {
          success: true,
          message: 'Checkout complete!',
          orderId: order.id,
          total: order.total,
          status: order.status,
          shippingAddress: `${addr.streetAddress}, ${addr.city}, ${addr.state}`,
          shippingMethod: order.shippingMethod
        };
      }

      case 'track_order': {
        const order = db.getOrderById(args.orderId);
        if (!order) return { error: 'Order not found' };
        return {
          id: order.id,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items,
          total: order.total,
          trackingNumber: order.trackingNumber || 'Not shipped yet'
        };
      }

      case 'cancel_order': {
        const order = db.cancelOrder(args.orderId);
        return {
          success: true,
          id: order.id,
          status: order.status,
          message: 'Order cancelled successfully.'
        };
      }

      case 'search_orders': {
        const list = db.getUserOrders(userId);
        const q = args.search ? args.search.toLowerCase() : '';
        const filtered = list.filter(o => {
          if (!q) return true;
          return o.id.includes(q) || o.items.some(i => i.title.toLowerCase().includes(q));
        });
        return filtered.map(o => ({
          id: o.id,
          createdAt: o.createdAt,
          items: o.items.map(i => `${i.quantity}x ${i.title}`),
          total: o.total,
          status: o.status
        }));
      }

      default:
        return { error: 'Unknown tool' };
    }
  } catch (err: any) {
    return { error: err.message || 'Error executing tool' };
  }
}

// ==========================================
// Server Booting
// ==========================================

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

export default app;
