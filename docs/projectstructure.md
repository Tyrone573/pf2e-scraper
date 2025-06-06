# Project Structure Documentation

This document outlines the directory structure of our Next.js template project and provides guidance on where to organize new code.

## Directory Structure

```
template-react/
├── docs/                      # Documentation files
│   ├── techstack.md           # Tech stack documentation
│   ├── projectstructure.md    # Project structure documentation (this file)
│   └── rules.md               # Best practices and rules
│
├── migrations/                # Database migration files
│   ├── 1_initial/             # Initial migration
│   │   ├── up.sql             # SQL to apply the migration
│   │   └── down.sql           # SQL to revert the migration
│   ├── functions.sql          # SQL functions for migrations
│   └── migrate.cjs            # Migration script
│
├── public/                    # Static assets
│   ├── favicon.ico            # Favicon
│   ├── images/                # Image assets
│   └── index.html             # HTML entry point for Vite
│
├── src/                       # Source code
│   ├── frontend/              # Frontend code
│   │   ├── app/               # Next.js App Router
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Home page
│   │   │   └── [feature]/     # Feature-specific routes
│   │   │       ├── page.tsx   # Feature page
│   │   │       └── layout.tsx # Feature layout
│   │   │
│   │   ├── components/        # React components
│   │   │   ├── ui/            # ShadCn UI components
│   │   │   └── [feature]/     # Feature-specific components
│   │   │
│   │   ├── lib/               # Frontend utility libraries
│   │   │   └── utils.ts       # Utility functions
│   │   │
│   │   ├── styles/            # CSS styles
│   │   │   └── globals.css    # Global styles and Tailwind imports
│   │   │
│   │   └── main.tsx           # Entry point for React application
│   │
│   └── backend/               # Backend code
│       ├── api/               # API functions for Supabase
│       │   └── users.ts       # User-related API functions
│       │
│       └── lib/               # Backend utility libraries
│           └── supabase.ts    # Supabase client
│
├── .env.example               # Example environment variables
├── next.config.cjs            # Next.js configuration
├── package.json               # Project dependencies and scripts
├── postcss.config.cjs         # PostCSS configuration
├── tailwind.config.cjs        # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vite.config.js             # Vite configuration
```

## Where to Add New Code

### New Pages

Add new pages in the `src/frontend/app` directory following the Next.js App Router conventions:

- **Regular pages**: Create a `page.tsx` file in the appropriate subdirectory
  ```
  src/frontend/app/about/page.tsx         # /about route
  src/frontend/app/blog/[slug]/page.tsx   # /blog/:slug route
  ```

- **Layouts**: Create a `layout.tsx` file to wrap pages with common UI elements
  ```
  src/frontend/app/dashboard/layout.tsx   # Layout for all dashboard pages
  ```

### New Components

- **UI Components**: Add reusable UI components in `src/frontend/components/ui/`
  ```
  src/frontend/components/ui/button.tsx
  src/frontend/components/ui/card.tsx
  ```

- **Feature Components**: Add feature-specific components in `src/frontend/components/[feature]/`
  ```
  src/frontend/components/dashboard/stats-card.tsx
  src/frontend/components/blog/post-preview.tsx
  ```

### New API Functions

Add new API functions for Supabase in the `src/backend/api` directory:

```
src/backend/api/posts.ts      # Blog post-related API functions
src/backend/api/comments.ts   # Comment-related API functions
```

Follow the pattern in `src/backend/api/users.ts` for consistency.

### New Database Migrations

To create a new database migration:

1. Run `node migrations/migrate.js create migration_name`
2. Edit the generated `up.sql` and `down.sql` files in the new migration directory

### New Styles

- **Global Styles**: Modify `src/frontend/styles/globals.css` for global styles
- **Component Styles**: Use Tailwind classes directly in components
- **Custom Tailwind Extensions**: Add to `tailwind.config.js`

## Code Organization Principles

1. **Feature-First Organization**: Group related components, API functions, and types by feature when possible
2. **Separation of Concerns**: Keep UI components separate from data fetching logic
3. **Reusability**: Extract common patterns into reusable components and utilities
4. **Consistency**: Follow established patterns for new code

## Naming Conventions

- **Files and Directories**: Use kebab-case for file and directory names
  ```
  user-profile.tsx
  auth-context.tsx
  ```

- **React Components**: Use PascalCase for component names
  ```
  export default function UserProfile() {
    // Component code here
  }
  ```

- **Functions and Variables**: Use camelCase for functions and variables
  ```
  const fetchUserData = async () => {
    // Function code here
  }
  const userData = await getUserById(id);
  ```

- **Types and Interfaces**: Use PascalCase for types and interfaces
  ```
  type User = {
    id: string;
    name: string;
  }

  interface AuthProps {
    user: User;
    isLoggedIn: boolean;
  }
  ```

## Import Order

Organize imports in the following order:

1. React and Next.js imports
2. External libraries
3. Internal components and utilities
4. Types and interfaces
5. Styles

Example:
```tsx
// 1. React and Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. External libraries
import { motion } from 'framer-motion';

// 3. Internal components and utilities
import { Button } from '@/components/ui/button';
import { getUserById } from '@backend/api/users';

// 4. Types and interfaces
import type { User } from '@backend/api/users';

// 5. Styles (if not using Tailwind)
import styles from './component.module.css';
```

By following these guidelines, we maintain a consistent and organized codebase that is easy to navigate and extend.
