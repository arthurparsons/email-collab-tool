# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a collaborative email editor built with React, TypeScript, Vite, and Supabase. The application allows multiple users to edit emails in real-time with live collaboration features, presence indicators, comments, and version history.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: shadcn/ui (Radix UI components + Tailwind CSS)
- **Rich Text Editor**: TipTap (ProseMirror-based)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS + CSS Variables theming
- **State Management**: React Context (AuthContext, DocumentContext)

## Development Commands

### Core Commands
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development (with debug info)
npm run build:dev

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Database Setup
```bash
# Run the schema in your Supabase SQL editor
# File: database/schema.sql (full schema with RLS policies)
# Or use: database/schema-simple.sql (minimal version)
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Required Supabase configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional configurations
VITE_EMAIL_SERVICE=sendgrid
VITE_SENDGRID_API_KEY=your_sendgrid_api_key_here
VITE_APP_URL=http://localhost:8080
```

## Architecture Overview

### Context Providers (State Management)
- **AuthContext**: Manages user authentication, sign-in/up, session handling
- **DocumentContext**: Handles document CRUD, real-time collaboration, presence tracking
- **ThemeProvider**: Manages dark/light theme switching

### Key Components
- **CollaborativeEditor**: Main collaborative editing interface with real-time presence
- **RichTextEditor**: TipTap-based rich text editor with extensive formatting toolbar
- **PresenceBar**: Shows active collaborators with colored cursors
- **CommentThread**: Inline commenting system for document feedback
- **VersionHistory**: Document version tracking and restoration

### Database Schema
The Supabase schema includes:
- **documents**: Core email documents with content and metadata
- **profiles**: User profiles extending Supabase auth
- **document_collaborators**: Sharing and permissions management
- **comments**: Threaded commenting system with position tracking
- **document_versions**: Complete version history
- **presence**: Real-time cursor positions and user activity
- **email_sends**: Email delivery tracking

### Routing Structure
```
/ → HomePage (landing/auth status)
/login → Login page
/signup → Signup page  
/dashboard → Document dashboard (protected)
/editor/:id → Collaborative editor (protected)
```

## Real-time Features

### Supabase Realtime Integration
- **Document Updates**: Postgres changes broadcast to all connected clients
- **Presence Tracking**: Live cursor positions and user activity
- **Color Assignment**: Automatic color coding for different collaborators
- **Debounced Updates**: 500ms debounce for document saves, 300ms for editor changes

### Collaboration Flow
1. User opens document → `DocumentContext.loadDocument()` 
2. Sets up realtime subscription → `setupRealtimeSubscription()`
3. Tracks presence → `channel.track()` with cursor position
4. Updates propagate via Supabase realtime to all connected users

## Key File Locations

### Core Application Files
- `src/App.tsx` - Main app component with routing
- `src/contexts/` - React contexts for state management  
- `src/components/CollaborativeEditor.tsx` - Main editor component
- `src/components/RichTextEditor.tsx` - TipTap editor implementation
- `src/lib/supabase.ts` - Supabase client configuration

### UI Components
- `src/components/ui/` - shadcn/ui component library
- `components.json` - shadcn/ui configuration
- `tailwind.config.ts` - Tailwind with custom theme system

### Database
- `database/schema.sql` - Complete PostgreSQL schema with RLS
- `database/schema-simple.sql` - Minimal schema for quick setup

## Development Guidelines

### Styling System
- Uses Tailwind CSS with CSS variables for theming
- Custom color system defined in `tailwind.config.ts`
- Dark/light mode support via `next-themes`
- Typography plugin enabled for rich text content

### TypeScript Configuration  
- Strict mode enabled in `tsconfig.json`
- Path aliases: `@/` maps to `src/`
- Separate configs for app (`tsconfig.app.json`) and build tools (`tsconfig.node.json`)

### ESLint Configuration
- React hooks and refresh plugins enabled
- TypeScript ESLint integration
- Unused variables warnings disabled (rule in `eslint.config.js`)

### TipTap Editor Extensions
The rich text editor includes:
- StarterKit (basic formatting, lists, etc.)
- TextStyle, Color, TextAlign, Link, Underline, Image
- Table support (Table, TableRow, TableHeader, TableCell) 
- History with 50-level undo depth
- Custom placeholder and styling attributes

### Real-time Debouncing
- Editor changes: 300ms debounce before triggering onChange
- Document updates: 500ms debounce before saving to database
- Presence updates: Immediate for responsive collaboration