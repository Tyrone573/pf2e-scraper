# Tech Stack Documentation

This document outlines the architecture and technologies used in our Next.js template project, along with guidance on how to use them effectively.

## Core Technologies

### Next.js with App Router

Our application is built on [Next.js](https://nextjs.org/), a React framework that provides server-side rendering, static site generation, and other performance optimizations out of the box.

We use the new App Router architecture, which provides:
- Improved routing with nested layouts
- Server Components for improved performance
- Simplified data fetching patterns

**Key files and directories:**
- `src/app/` - Contains all pages and layouts using the App Router
- `src/app/layout.tsx` - Root layout that wraps all pages
- `src/app/page.tsx` - Home page component

**Usage:**
```tsx
// Creating a new page
// src/app/about/page.tsx
export default function AboutPage() {
  return <div>About Us</div>;
}
```

### Tailwind CSS v4

[Tailwind CSS](https://tailwindcss.com/) is our utility-first CSS framework. We use version 4, which includes:
- Improved performance
- Expanded utility classes
- Better dark mode support

**Key files:**
- `tailwind.config.cjs` - Configuration for Tailwind
- `src/styles/globals.css` - Global styles and Tailwind imports

**Usage:**
```tsx
// Using Tailwind classes in components
<div className="flex min-h-screen flex-col items-center justify-between p-24">
  <h1 className="text-4xl font-bold">Hello World</h1>
</div>
```

### ShadCn Components

We use [ShadCn](https://ui.shadcn.com/) components, which are a collection of re-usable components built with Radix UI and Tailwind CSS.

**Key files:**
- `src/components/ui/` - Contains all ShadCn components
- `src/lib/utils.ts` - Utility functions for ShadCn components

**Usage:**
```tsx
// Using a ShadCn button component
import { Button } from "@/components/ui/button";

export default function MyComponent() {
  return <Button variant="outline">Click Me</Button>;
}
```

### Lucide React Icons

We use [Lucide React](https://lucide.dev/) as our icon library, which provides a comprehensive set of beautiful, consistent icons that integrate seamlessly with our React components.

**Key features:**
- 800+ open source icons
- Customizable size, color, and stroke width
- Tree-shakable (only imports the icons you use)
- Seamless integration with ShadCn components

**Configuration:**
- Configured in `components.json` with `"iconLibrary": "lucide"`
- Installed as a dependency in `package.json`

**Usage:**
```tsx
// Importing specific icons
import { Search, Menu, X } from "lucide-react";

export default function MyComponent() {
  return (
    <div>
      <Search className="h-5 w-5" />
      <Menu className="h-5 w-5 text-gray-500" />
      <X className="h-5 w-5 text-red-500 stroke-2" />
    </div>
  );
}
```

**With ShadCn components:**
```tsx
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AddButton() {
  return (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Item
    </Button>
  );
}
```

## Backend and Data

### Supabase

[Supabase](https://supabase.com/) is our backend-as-a-service platform, providing:
- PostgreSQL database
- Authentication
- Storage
- Realtime subscriptions
- Edge Functions

**Key files:**
- `src/backend/lib/supabase.ts` - Supabase client configuration
- `src/backend/api/` - API functions for interacting with Supabase
- `migrations/` - Database migration files

**Usage:**
```tsx
// Fetching data from Supabase
import { getUsers } from '@backend/api/users';

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Database Migrations

We use a custom migration system to track and apply database changes:

**Key files and directories:**
- `migrations/` - Contains all migration files
- `migrations/migrate.js` - Script to run migrations
- `migrations/functions.sql` - SQL functions for migrations

**Usage:**
```bash
# Apply all pending migrations
node migrations/migrate.js up

# Revert the last migration
node migrations/migrate.js down

# Create a new migration
node migrations/migrate.js create add_new_table
```

Each migration consists of:
- `up.sql` - SQL to apply the migration
- `down.sql` - SQL to revert the migration

## Environment Setup

The project requires the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
```

Create a `.env.local` file in the root directory with these variables for local development.

## Development Workflow

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in `.env.local`
4. Run migrations with `node migrations/migrate.js up`
5. Start the development server with `npm run dev`
6. Access the application at `http://localhost:3000`
