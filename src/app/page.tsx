export {};

import React from 'react';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu';
import { Menu, Github, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '../components/theme-toggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted items-center justify-between">
      {/* Navigation */}
      <nav className="w-full flex justify-between items-center py-6 px-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Image src="/images/chaosmonkey.png" alt="Chaos Monkey" width={48} height={48} className="rounded-full" />
          <span className="text-2xl font-bold tracking-tight">Template React</span>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <a href="#features" className="text-base font-medium hover:underline">Features</a>
          <a href="#tech" className="text-base font-medium hover:underline">Tech Stack</a>
          <a href="/docs" className="text-base font-medium hover:underline">Docs</a>
          <ThemeToggle />
          <Button asChild variant="outline">
            <a href="https://github.com/JonCSykes/template-react" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </Button>
        </div>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href="#features">Features</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#tech">Tech Stack</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/docs">Docs</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://github.com/JonCSykes/template-react" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-6">
          Create anything you imagine.
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-8">
          Kickstart your next project with a modern, type-safe, and beautiful template powered by Next.js, Tailwind CSS, Supabase, shadcn/ui, and Lucide icons.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <a href="/docs">Get Started</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://github.com/JonCSykes/template-react" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Github className="w-4 h-4" /> Star on GitHub
            </a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-4xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col items-center text-center">
          <span className="text-primary mb-2">
            <Menu className="w-8 h-8" />
          </span>
          <h3 className="font-semibold text-lg mb-2">Modern UI</h3>
          <p className="text-muted-foreground">Built with shadcn/ui and Tailwind CSS for a beautiful, customizable interface.</p>
        </div>
        <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col items-center text-center">
          <span className="text-primary mb-2">
            <ExternalLink className="w-8 h-8" />
          </span>
          <h3 className="font-semibold text-lg mb-2">Type Safe</h3>
          <p className="text-muted-foreground">TypeScript everywhere. Enjoy end-to-end type safety and confidence in your code.</p>
        </div>
        <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col items-center text-center">
          <span className="text-primary mb-2">
            <Github className="w-8 h-8" />
          </span>
          <h3 className="font-semibold text-lg mb-2">Production Ready</h3>
          <p className="text-muted-foreground">Next.js App Router, Supabase integration, and best practices out of the box.</p>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="w-full max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex flex-col items-center">
            <span className="mt-2 text-sm">Next.js</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mt-2 text-sm">Tailwind CSS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mt-2 text-sm">Supabase</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mt-2 text-sm">shadcn/ui</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mt-2 text-sm">Lucide</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center justify-center py-8 border-t mt-8 bg-background/80">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Created with &lt;3 by</span>
          <Image src="/images/chaosmonkey.png" alt="chaosmonkey" width={28} height={28} className="rounded-full" />
        </div>
      </footer>
    </main>
  );
}
