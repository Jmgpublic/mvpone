# Concierge - Property Management System

## Overview

Concierge is a comprehensive property management application built as an MVP prototype to support the development and deployment of complex property management workflows. The system manages properties subdivided into spaces, tracks residents and their leases, and provides specialized dashboards for different user roles including property managers, facility managers, residents, security personnel, case managers, and administrators.

The application follows a full-stack architecture with a React frontend using shadcn/ui components, an Express.js backend with TypeScript, and PostgreSQL database with Drizzle ORM for data management. The system is organized into distinct branches/modules, each serving specific property management functions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy using session-based auth
- **Session Management**: Express sessions with PostgreSQL session store
- **Password Security**: Crypto module with scrypt for hashing
- **API Design**: RESTful endpoints with consistent error handling

### Database Design
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Core Entities**:
  - Users (authentication and role management)
  - Sites (property definitions)
  - Spaces (individual units within properties)
  - Residents (tenant information with types and roles)
  - Leases (rental agreements linking residents to spaces)

### Authentication & Authorization
- **Strategy**: Session-based authentication with Passport.js
- **Password Security**: Scrypt-based password hashing with salt
- **User Roles**: Enum-based role system (admin, property_manager, facility_manager, resident, security, case_manager)
- **Session Storage**: PostgreSQL-backed session store for persistence
- **Protected Routes**: Client-side route protection with auth context

### Modular Dashboard System
The application is organized into six distinct branches, each with dedicated dashboards:

1. **Property Management**: Site definition, tenant lifecycle, financial functions, message management
2. **Facility Management**: Asset management, service requests, maintenance execution
3. **Resident Portal**: Messaging, profile management, account information
4. **Site Security**: Guard scheduling, incident reporting, access control
5. **Case Management**: Individual resident case management and scheduling
6. **Admin Analytics**: System administration and data management

### Development Environment
- **Package Management**: npm with lock file for dependency consistency
- **Development Server**: Vite dev server with hot module replacement
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **TypeScript Configuration**: Strict mode with path mapping for clean imports
- **Linting & Formatting**: Configured for consistent code style

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection with WebSocket support
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **express**: Web application framework for Node.js
- **passport**: Authentication middleware with local strategy
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Frontend UI Dependencies
- **@radix-ui/***: Comprehensive set of UI primitives for accessible components
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library for React
- **react-hook-form**: Performant form library with validation
- **@hookform/resolvers**: Integration adapters for validation libraries

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **drizzle-kit**: Database schema management and migrations

### Utility Dependencies
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation
- **class-variance-authority**: Utility for creating component variants
- **clsx**: Conditional className utility
- **date-fns**: Modern date utility library
- **nanoid**: URL-safe unique ID generator