# Medical Referrals System

## Overview

This is a medical referrals management system for the Palestinian Ministry of Health in the West Bank. The application serves as a public portal for citizens to search and track their medical referrals, view border crossing statuses, and access important guidelines and information about the medical referral process. The system is built with Arabic language support and features a clean, accessible interface designed for healthcare administration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with custom styling through shadcn/ui
- **Internationalization**: Arabic-first design with RTL support and Arabic fonts (Noto Sans Arabic)

The frontend follows a component-based architecture with reusable UI components, custom hooks, and a clean separation of concerns between presentation and business logic.

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for medical referrals, border crossings, and statistics
- **Development Setup**: Hot reload with Vite integration during development
- **Build Process**: esbuild for production bundling with external package handling

The backend implements a simple Express server with structured routing and middleware for request logging and error handling.

### Data Storage Solutions
- **Database**: PostgreSQL using Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection Pooling**: Neon serverless connection pooling for optimal performance
- **Schema Management**: Drizzle migrations for database schema versioning
- **Development Storage**: In-memory storage implementation for development and testing

The data layer uses a repository pattern with an abstraction layer (IStorage interface) allowing for different storage implementations.

### Authentication and Authorization
Currently, the application is designed as a public portal without authentication requirements. Citizens can search for referrals using patient ID or referral number without login credentials, following the public service model for healthcare information access.

### API Structure
The REST API follows a resource-based structure:
- `/api/referrals` - Medical referral management (search, retrieve, create)
- `/api/border-crossings` - Border crossing status information
- `/api/statistics` - System statistics and metrics

Error handling includes proper HTTP status codes and Arabic error messages for user-facing responses.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Connection**: WebSocket-based connections through Neon serverless client

### Development Tools
- **Replit Integration**: Specialized Vite plugins for Replit development environment
- **Development Plugins**: Error overlay modal and cartographer for enhanced development experience

### UI and Styling Dependencies
- **Radix UI**: Comprehensive set of accessible React components
- **Tailwind CSS**: Utility-first CSS framework with custom color scheme
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Arabic font families (Noto Sans Arabic) for proper RTL text rendering

### Build and Development
- **Vite**: Fast build tool with Hot Module Replacement
- **TypeScript**: Type safety across the entire stack
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **ESBuild**: Fast JavaScript bundler for production builds

### Form Handling and Validation
- **React Hook Form**: Performant form management
- **Zod**: Schema validation library integrated with Drizzle
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

The system emphasizes developer experience with comprehensive tooling while maintaining a focus on accessibility and internationalization for Arabic-speaking users.