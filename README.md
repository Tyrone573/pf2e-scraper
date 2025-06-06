# Next.js Template with Vite, Tailwind CSS v4, ShadCn, and Supabase

This is a modern Next.js template project that includes:

- [Next.js](https://nextjs.org/) with App Router
- [Vite](https://vitejs.dev/) for fast development and builds
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [ShadCn](https://ui.shadcn.com/) components
- [Lucide React](https://lucide.dev/) for icons
- [Supabase](https://supabase.com/) for backend services
- Database migration system

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/template-react.git
cd template-react
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

4. Run database migrations:

```bash
node migrations/migrate.cjs up
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows a structured organization:

- `src/` - Source code
  - `src/frontend/` - Frontend code
    - `src/frontend/app/` - Next.js App Router pages and layouts
    - `src/frontend/components/` - React components
    - `src/frontend/lib/` - Frontend utility libraries
    - `src/frontend/styles/` - CSS styles
  - `src/backend/` - Backend code
    - `src/backend/api/` - API functions for Supabase
    - `src/backend/lib/` - Backend utility libraries
- `migrations/` - Database migration files
- `docs/` - Project documentation

For more details, see [Project Structure Documentation](docs/projectstructure.md).

## Documentation

- [Tech Stack Documentation](docs/techstack.md) - Details about the technologies used
- [Project Structure Documentation](docs/projectstructure.md) - Directory structure and organization
- [Development Rules](docs/rules.md) - Best practices and guidelines

## Database Migrations

This template includes a custom migration system for Supabase:

```bash
# Apply all pending migrations
node migrations/migrate.cjs up

# Revert the last migration
node migrations/migrate.cjs down

# Create a new migration
node migrations/migrate.cjs create migration_name
```

## Features

- Modern React development with Next.js App Router
- Fast development experience with Vite
- Beautiful UI with Tailwind CSS v4, ShadCn components, and Lucide React icons
- Backend services with Supabase (auth, database, storage)
- Type safety with TypeScript
- Database migration system for schema changes
- Comprehensive documentation

## Vite Configuration

This template uses Vite for fast development and optimized builds:

- **Development Server**: Run `npm run dev` to start the Vite development server with hot module replacement
- **Production Build**: Run `npm run build` to create an optimized production build
- **Preview**: Run `npm run preview` to preview the production build locally
- **Path Aliases**: The Vite configuration includes path aliases that match the TypeScript configuration:
  - `@/` for frontend imports
  - `@backend/` for backend imports

## License

This project is licensed under the MIT License - see the LICENSE file for details.
