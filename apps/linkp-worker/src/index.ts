import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { InsertProduct, products } from '@repo/db/schema';
import { neon } from '@neondatabase/serverless';
import { createMiddleware } from 'hono/factory';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '@repo/db/schema';
import { HTTPException } from 'hono/http-exception';

// Define environment variables type
export type Env = {
  DATABASE_URL: string;
  NODE_ENV?: 'development' | 'production';
};

// Extend HonoRequest to include database instance
declare module 'hono' {
  interface HonoRequest {
    db: NeonHttpDatabase<typeof schema>;
  }
}

// Create Hono app instance with typed environment
const app = new Hono<{ Bindings: Env }>();

// CORS Configuration
const corsOptions = {
  origin: (origin: string) => {
    // In production, replace with your actual domain
    const ALLOWED_ORIGINS = [
      'http://localhost:3000',
      'https://your-production-domain.com'
    ];
    
    return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600, // 10 minutes
  credentials: true,
};

// Error handling middleware
const errorHandler = createMiddleware(async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }
    
    console.error('Unhandled error:', error);
    
    return c.json({
      status: 'error',
      message: 'Internal Server Error',
      error: c.env.NODE_ENV === 'development' ? error : undefined
    }, 500);
  }
});

// Database injection middleware
const injectDB = createMiddleware(async (c, next) => {
  try {
    // Create database connection
    const sql = neon(c.env.DATABASE_URL);
    // Initialize Drizzle with the connection
    c.req.db = drizzle(sql);
    await next();
  } catch (error) {
    console.error('Database connection error:', error);
    throw new HTTPException(503, { message: 'Database connection failed' });
  }
});

// Apply CORS middleware
app.use('/*', cors(corsOptions));
// Apply error handling middleware globally
app.use('/*', errorHandler);

// Routes
app.get('/', injectDB, async (c) => {
  try {
    const allProducts = await c.req.db.select().from(products);
    return c.json({
      status: 'success',
      data: allProducts
    });
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch products' });
  }
});

app.post('/insert', injectDB, async (c) => {
  try {
    const product: InsertProduct[] = [
      {
        name: "test",
        age: 20
      },
      {
        name: "test1",
        age: 40
      },
      {
        name: "test2",
        age: 60
      }
    ];

    const res = await c.req.db.insert(products)
      .values(product)
      .returning();

    return c.json({
      status: 'success',
      message: "Products inserted successfully",
      data: res
    });
  } catch (error) {
    throw new HTTPException(500, { 
      message: 'Failed to insert products',
      cause: error
    });
  }
});

export default app;