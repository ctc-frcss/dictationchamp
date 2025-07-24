# Dictation Champ - Interactive Kids' Spelling Game

## Overview

Dictation Champ is a web-based interactive spelling game designed for elementary school students. The application allows users to upload vocabulary words and transforms them into an engaging drag-and-drop spelling quiz with text-to-speech functionality. Built with a modern React frontend and Express backend, the app features colorful animations, hint systems, and score tracking to create an educational and entertaining experience for children.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom kid-friendly color schemes and animations
- **State Management**: Zustand for game state management
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Animations**: Framer Motion for smooth transitions and celebratory effects

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **File Processing**: Multer for file uploads, XLSX library for spreadsheet parsing
- **Development**: Vite for hot module replacement and development server
- **Session Storage**: In-memory storage with planned PostgreSQL integration

### Build System
- **Bundler**: Vite for frontend, esbuild for backend production builds
- **Development**: Concurrent frontend/backend development with Vite middleware
- **TypeScript**: Strict mode enabled with path mapping for clean imports

## Key Components

### Game Flow Management
- **Welcome Page**: Animated introduction with mascot character (owl emoji)
- **Word Bank Input**: Text input or file upload (CSV/XLSX) for vocabulary words
- **Game Engine**: Drag-and-drop letter placement with 10 randomly selected words
- **Results Display**: Score summary with CSV export functionality

### Interactive Features
- **Text-to-Speech**: Browser-native speech synthesis with child-friendly voice preferences
- **Drag & Drop**: Custom letter placement system with visual feedback
- **Hint System**: Progressive hints showing definitions or revealing letters
- **Animations**: Confetti celebrations, bounce effects, and smooth transitions

### Data Management
- **File Processing**: Server-side parsing of CSV and Excel files
- **Game Sessions**: Tracking of word banks, user answers, and scoring metrics
- **Export Functionality**: Client-side CSV generation for results

## Data Flow

1. **Word Input Phase**:
   - Users paste words or upload CSV/XLSX files
   - Server validates and extracts alphabetic words
   - Frontend stores word bank in Zustand state

2. **Game Session**:
   - System randomly selects 10 words (allows repeats if fewer words available)
   - Each word generates letter slots and scrambled letter options
   - Text-to-speech announces words, users drag letters to spell
   - Immediate feedback with animations for correct/incorrect answers

3. **Results Processing**:
   - Game results stored locally and optionally sent to backend
   - Score calculation and performance metrics generation
   - CSV export available for progress tracking

## External Dependencies

### UI and Interaction
- **Radix UI**: Accessible component primitives for dialogs, buttons, etc.
- **Framer Motion**: Animation library for smooth transitions and effects
- **Lucide React**: Icon library for consistent visual elements

### File Processing
- **Multer**: Multipart form data handling for file uploads
- **XLSX**: Excel file parsing and data extraction

### Development Tools
- **Vite**: Development server with HMR and production building
- **Replit Integration**: Development environment compatibility

### Database (Planned)
- **Drizzle ORM**: Type-safe database interactions
- **Neon Database**: PostgreSQL hosting for production data persistence

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Frontend and backend changes trigger automatic updates
- **File Watching**: TypeScript compilation and error checking

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild compiles TypeScript Express server to `dist/index.js`
- **Static Serving**: Express serves built frontend and handles API routes

### Database Setup
- **Migration System**: Drizzle Kit for schema management
- **Environment Variables**: DATABASE_URL configuration for PostgreSQL connection
- **Fallback Storage**: In-memory storage for development and testing

The architecture prioritizes child-friendly user experience with colorful, animated interfaces while maintaining educational value through structured spelling practice and progress tracking.