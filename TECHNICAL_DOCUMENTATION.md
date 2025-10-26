# VHT Healthcare Reform Application - Technical Documentation

## Overview

The VHT (Vermont Healthcare Transformation) application is a comprehensive web platform built with Next.js 15, TypeScript, and modern web technologies. It provides tools for analyzing healthcare policy documents, managing keywords, creating blog content, and tracking news related to Vermont healthcare reform.

## Architecture

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Deployment**: Vercel-ready

### Project Structure

```plaintext
vht/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # Authentication
│   │   └── blog/                 # Blog CRUD operations
│   ├── blog/                     # Blog pages
│   │   ├── [slug]/               # Individual blog posts
│   │   └── new/                  # Create new blog post
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Reusable UI components (40+ components)
│   ├── document-viewer.tsx       # PDF viewer component
│   ├── keyword-highlighter.tsx   # Text highlighting
│   ├── news-headlines.tsx        # News display
│   ├── news-article.tsx          # Individual news articles
│   ├── resizable-grid.tsx        # Layout grid
│   ├── sidebar.tsx               # Navigation sidebar
│   ├── navbar.tsx                # Top navigation
│   └── page-layout.tsx           # Page wrapper
├── lib/                          # Utilities and configuration
│   ├── constants.ts              # Application constants
│   ├── database/                 # Database client
│   │   └── prisma.ts
│   └── ui/                       # UI utilities
│       └── utils.ts
├── services/                     # Business logic
│   ├── blog-service.ts           # Blog operations
│   ├── comment-service.ts        # Comment management
│   └── keyword-service.ts        # Keyword operations
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts             # Mobile detection
│   └── use-toast.ts              # Toast notifications
├── types/                        # TypeScript definitions
│   └── components.ts             # Component prop types
├── prisma/                       # Database schema
│   ├── schema.prisma             # Database models
│   └── migrations/               # Database migrations
├── public/                       # Static assets
└── styles/                       # Additional styles
```

## Key Components

### Core Components

#### DocumentViewer (`components/document-viewer.tsx`)

- **Purpose**: Displays PDF documents with navigation controls
- **Features**:
  - PDF rendering with zoom controls
  - Page navigation
  - Document state persistence
  - Responsive design
- **Props**: None (uses context for state)
- **Dependencies**: React PDF, local storage

#### KeywordHighlighter (`components/keyword-highlighter.tsx`)

- **Purpose**: Highlights keywords in document text
- **Features**:
  - Real-time text highlighting
  - Keyword management
  - Case-insensitive matching
- **Props**: None (uses context)
- **Dependencies**: Document state context

#### ResizableGrid (`components/resizable-grid.tsx`)

- **Purpose**: Provides resizable layout for main content areas
- **Features**:
  - Drag-to-resize panels
  - Persistent layout state
  - Responsive behavior
- **Props**: `children: React.ReactNode[]`
- **Dependencies**: Local storage for state persistence

#### NewsHeadlines (`components/news-headlines.tsx`)

- **Purpose**: Displays list of news articles
- **Features**:
  - Article selection
  - Responsive card layout
  - External link handling
- **Props**: `onArticleSelected: (article: NewsArticleData | null) => void`
- **Dependencies**: News API integration

### UI Components (40+ components in `components/ui/`)

The application uses Shadcn/ui components including:

- **Form Controls**: Button, Input, Textarea, Select, Checkbox
- **Layout**: Card, Dialog, Sheet, Tabs, Accordion
- **Feedback**: Toast, Alert, Progress, Skeleton
- **Navigation**: DropdownMenu, NavigationMenu, Sidebar
- **Data Display**: Table, Badge, Avatar, Separator

All components are exported through `components/ui/index.ts` for easy importing.

## Key Files

### Application Entry Points

#### `app/page.tsx`

- **Purpose**: Main home page component
- **Features**:
  - Layout with sidebar and navbar
  - Resizable grid with main components
  - News article state management
- **State**: `selectedArticle` for news selection
- **Components Used**: Sidebar, Navbar, ResizableGrid, DocumentViewer, KeywordHighlighter, NewsHeadlines, NewsArticle

#### `app/layout.tsx`

- **Purpose**: Root layout for the entire application
- **Features**:
  - HTML structure
  - Font loading (Inter)
  - Theme provider
  - Toast notifications
- **Providers**: ThemeProvider, Toaster

### API Routes

#### `app/api/blog/route.ts`

- **Methods**: GET (list posts), POST (create post)
- **Features**:
  - Blog post CRUD operations
  - Input validation
  - Error handling
- **Middleware**: Content-type validation

#### `app/api/blog/[id]/route.ts`

- **Methods**: GET (single post), PUT (update), DELETE (remove)
- **Features**:
  - Individual blog post operations
  - Authorization checks
  - Data validation

#### `app/api/auth/[...nextauth]/route.ts`

- **Purpose**: NextAuth.js authentication handler
- **Providers**: Google OAuth
- **Features**: Session management, user authentication

### Services

#### `services/blog-service.ts`

- **Purpose**: Blog post business logic
- **Methods**:
  - `getBlogPosts()` - Retrieve all posts
  - `getBlogPostById(id)` - Single post by ID
  - `getBlogPostBySlug(slug)` - Single post by slug
  - `createBlogPost(data)` - Create new post
  - `updateBlogPost(id, data)` - Update existing post
  - `removeBlogPost(id)` - Delete post
  - `seedBlogPosts()` - Initialize sample data
- **Features**:
  - Input validation and sanitization
  - Slug uniqueness checking
  - Error handling with custom messages
  - Database transaction management

#### `services/comment-service.ts`

- **Purpose**: Comment management for documents
- **Features**: CRUD operations for document annotations

#### `services/keyword-service.ts`

- **Purpose**: Keyword management and tracking
- **Features**: Keyword CRUD, document association

### Configuration Files

#### `lib/constants.ts`

- **Purpose**: Centralized application constants
- **Categories**:
  - UI constants (breakpoints, delays, limits)
  - API constants (HTTP codes, content types)
  - Storage keys (localStorage identifiers)
  - Validation rules (patterns, lengths)
  - Default values (fallback data)
  - Routes (URL patterns)
- **Benefits**: Single source of truth, maintainability

#### `prisma/schema.prisma`

- **Purpose**: Database schema definition
- **Models**:
  - User: Authentication data
  - BlogPost: Blog content
  - Comment: Document annotations
  - Keyword: Healthcare terminology
- **Features**: Relations, indexes, constraints

## Database Schema

### Models

#### User

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  blogPosts BlogPost[]
  comments  Comment[]
}
```

#### BlogPost

```prisma
model BlogPost {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  excerpt   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  authorId String?
  author   User?    @relation(fields: [authorId], references: [id])
  comments Comment[]
}
```

#### Comment

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  position  Json?    // PDF coordinates
  createdAt DateTime @default(now())

  // Relations
  blogPostId String?
  userId     String?
  blogPost   BlogPost? @relation(fields: [blogPostId], references: [id])
  user       User?     @relation(fields: [userId], references: [id])
}
```

#### Keyword

```prisma
model Keyword {
  id          String   @id @default(cuid())
  term        String   @unique
  definition  String?
  category    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Database Operations

- **ORM**: Prisma Client
- **Migrations**: Version-controlled schema changes
- **Seeding**: Initial data population
- **Connection**: Environment-based configuration

## State Management

### Local State

- **Component Level**: useState for UI state
- **Form State**: Controlled components with validation
- **Layout State**: ResizableGrid persistence

### Persistent State

- **LocalStorage**: Document viewer state, user preferences
- **Database**: User data, content, relationships
- **Session**: Authentication state (NextAuth.js)

### Context Providers

- **Theme Context**: Dark/light mode (planned)
- **Document Context**: Document state sharing
- **Auth Context**: User authentication state

## Authentication & Authorization

### NextAuth.js Configuration

- **Provider**: Google OAuth 2.0
- **Scopes**: Basic profile information
- **Callbacks**: User creation, session management
- **Pages**: Custom sign-in page

### User Roles (Planned)

- **Regular Users**: Read access, basic interactions
- **Content Creators**: Blog post creation/editing
- **Administrators**: Full system access

## Performance Considerations

### Optimization Techniques

- **Code Splitting**: Route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Static generation where possible

### Database Performance

- **Indexes**: Optimized queries
- **Pagination**: Large dataset handling
- **Connection Pooling**: Efficient database connections

## Development Workflow

### Scripts (`package.json`)

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  "type-check": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:studio": "prisma studio",
  "db:seed": "tsx prisma/seed.ts",
  "clean": "rm -rf .next node_modules/.cache"
}
```

### Development Tools

- **Prettier**: Code formatting
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Husky**: Git hooks (planned)
- **Prisma Studio**: Database management

## Deployment

### Vercel Configuration

- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Environment Variables**: Database URL, auth secrets
- **Domains**: Custom domain support

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application base URL
- `NEXTAUTH_SECRET`: JWT signing secret
- `GOOGLE_CLIENT_ID`: OAuth client ID
- `GOOGLE_CLIENT_SECRET`: OAuth client secret

## Maintenance

### Regular Tasks

1. **Database Backups**: Regular PostgreSQL backups
2. **Dependency Updates**: Monthly security updates
3. **Performance Monitoring**: Response times, error rates
4. **Log Review**: Error logs, user activity

### Troubleshooting

- **Build Issues**: Clear cache, reinstall dependencies
- **Database Issues**: Check connection, run migrations
- **Auth Issues**: Verify OAuth configuration
- **Performance Issues**: Bundle analysis, query optimization

### Monitoring

- **Error Tracking**: Sentry integration (planned)
- **Analytics**: User behavior tracking (planned)
- **Uptime Monitoring**: Service availability checks

## Security Considerations

### Authentication

- Secure OAuth implementation
- Session management
- CSRF protection

### Data Protection

- Input sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection (React, Next.js)

### API Security

- Rate limiting (planned)
- Input validation
- Error message sanitization

## Future Enhancements

### Planned Features

- **Real-time Collaboration**: Multi-user document editing
- **Advanced Search**: Full-text search capabilities
- **Analytics Dashboard**: Usage statistics and insights
- **API Documentation**: Automated API docs generation
- **Mobile App**: React Native companion app

### Technical Debt

- **Legacy Code**: Migrate remaining utils to organized structure
- **Testing**: Add comprehensive test suite
- **Documentation**: Expand API documentation
- **Performance**: Implement caching strategies

### Documentation Maintenance

This documentation is maintained alongside the codebase.

Last updated: October 17, 2025
