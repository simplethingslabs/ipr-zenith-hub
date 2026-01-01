# IPR Central API

Backend API for IPR Central - Node.js/Express with Prisma and PostgreSQL.

## Quick Start

### 1. Install Dependencies
```bash
cd api
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

### 3. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs at `http://localhost:3001`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login |
| GET | `/api/posts` | No | List posts |
| GET | `/api/posts/:slug` | No | Get post |
| POST | `/api/posts` | Yes | Create post |
| PUT | `/api/posts/:id` | Yes | Update post |
| DELETE | `/api/posts/:id` | Yes | Delete post |
| GET | `/api/fees` | No | List fees |
| POST | `/api/fees` | Yes | Create fee |
| PUT | `/api/fees/:id` | Yes | Update fee |
| DELETE | `/api/fees/:id` | Yes | Delete fee |
| GET | `/api/settings` | No | Get settings |
| PUT | `/api/settings` | Yes | Update settings |
| POST | `/api/contact` | No | Submit contact |

## Default Admin Credentials
- Email: `admin@iprcentral.com`
- Password: `admin123`

**⚠️ Change these in production!**

## Deployment (Render)

1. Create PostgreSQL database on Render
2. Create Web Service:
   - Root Directory: `api`
   - Build: `npm ci && npx prisma generate && npx prisma migrate deploy`
   - Start: `npm run start`
3. Add environment variables:
   - `DATABASE_URL`: Render Postgres connection string
   - `JWT_SECRET`: Strong random string (32+ chars)
   - `CORS_ORIGIN`: Frontend domain
   - `NODE_ENV`: `production`

## Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio
