# VCenter - Virtual Call Center Business App

## Overview

VCenter is a comprehensive mobile platform designed for managing virtual call center operations. Built with React Native and Expo, the application provides business owners and supervisors with tools to manage employees, recruitment, training resources, and business analytics. The app features a polished, modern UI with support for both iOS and Android platforms, emphasizing smooth animations and an intuitive user experience.

The application is currently in demo mode with local data storage, ready for integration with real authentication and backend services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Navigation**
- React Native with Expo SDK 54 for cross-platform mobile development
- React Navigation (v7) with bottom tab and native stack navigators
- Tab-based architecture with 5 main sections: Dashboard, Team, Jobs, Training, and Profile
- Modal presentations for detail screens (agent details, training modules)

**UI Components & Animation**
- Reanimated v4 for high-performance animations (spring-based interactions on buttons, cards, pressable elements)
- Gesture Handler for smooth touch interactions
- Keyboard Controller for intelligent keyboard management
- Safe Area Context for proper edge-to-edge layouts
- Custom themed components (ThemedText, ThemedView) with light/dark mode support

**Design System**
- Centralized theme system in `constants/theme.ts` with elevation-based backgrounds
- Consistent spacing, border radius, typography, and shadow values
- Color-coded status badges for agent availability (available, busy, break, offline)
- Avatar system with deterministic color assignment based on index

**State Management**
- Local component state with React hooks
- Async Storage for persistence layer
- No global state management library (Redux/MobX) - uses direct storage calls
- Focus-based data refresh using `useFocusEffect` for automatic updates

### Data Storage Solution

**Local Storage Implementation**
- AsyncStorage (@react-native-async-storage) as primary data persistence layer
- Storage abstraction layer in `lib/storage.ts` providing CRUD operations
- Type-safe interfaces for all data models (Agent, JobPosting, Application, TrainingModule, Campaign, etc.)

**Data Models**
- **Agent**: Employee records with status tracking, performance metrics, contact info
- **JobPosting**: Recruitment listings with requirements, benefits, application counts
- **Application**: Candidate applications with status workflow (pending → reviewing → interview → approved/rejected)
- **TrainingModule**: Learning content organized by category (onboarding, product, communication, compliance, advanced)
- **Campaign**: Active marketing/sales campaigns with assigned agents and metrics
- **BusinessMetrics**: Real-time business KPIs and performance data
- **User**: Authentication user model with role-based access (admin, supervisor, agent)

**Demo Data Initialization**
- Auto-generates sample data on first launch
- Creates demo admin user ("Alex Morgan") for testing
- Populates agents, job postings, training modules, and campaigns

### Authentication & Authorization

**Current Implementation: Demo Mode**
- Local authentication using AsyncStorage
- Auto-login with demo admin user on first launch
- Role-based user types: Admin, Supervisor, Agent
- Logout confirmation dialog with data persistence

**Architecture Ready for Real Auth**
- `useAuth` hook provides authentication interface
- Centralized auth state management
- Storage abstraction allows easy swap to API-based auth
- User session stored separately from business data

### Screen Architecture & Features

**Dashboard Screen**
- Horizontal scrolling metric cards (active agents, total calls, avg response time, revenue)
- Quick stats for pending applications and active campaigns
- Active campaigns list with agent assignments and call metrics
- Currently active agents grid

**Team Screen**
- Real-time agent directory with search functionality
- Status filter buttons (All, Available, Busy, Break, Offline)
- Agent cards showing avatar, name, status badge, current task
- Modal detail view for agent performance metrics and contact info

**Jobs & Recruitment**
- Tab-based interface (Job Postings / Applications)
- Job creation form with validation
- Application status workflow management
- Job detail screens with toggle for active/inactive status
- Applications list with status filtering

**Training Center**
- Category-based training module organization
- Module cards with progress tracking and duration
- Detail screens with learning objectives and content sections
- Color-coded categories for easy visual identification

**Profile & Settings**
- User profile with role badge and employee information
- Settings screen with notification preferences
- Logout with confirmation
- Data reset functionality (dev/testing)

### Error Handling & Development

**Error Boundaries**
- Class-based ErrorBoundary component wrapping entire app
- Custom ErrorFallback component with detailed error display
- Development mode: Expandable error details with stack traces
- Restart functionality via Expo's reloadAppAsync

**Development Tools**
- ESLint with Expo and Prettier configurations
- TypeScript for type safety
- Babel module resolver for clean imports using `@/` alias
- React Compiler experiments enabled

### Build & Deployment

**Platform Configuration**
- iOS: Tab support, custom bundle identifier
- Android: Edge-to-edge, adaptive icons with monochrome variant
- Web: Single-page output for static hosting
- Custom splash screen with brand colors for light/dark modes

**Expo Plugins**
- expo-splash-screen for branded launch experience
- expo-web-browser for in-app browsing capabilities
- React Compiler for performance optimizations

## External Dependencies

### Core Framework
- **Expo SDK 54**: Cross-platform mobile development framework
- **React 19.1.0**: UI library with latest concurrent features
- **React Native 0.81.5**: Native mobile runtime

### Navigation
- **@react-navigation/native (v7)**: Navigation infrastructure
- **@react-navigation/bottom-tabs**: Tab-based navigation
- **@react-navigation/native-stack**: Stack navigation with native animations

### UI & Animations
- **react-native-reanimated (v4.1)**: High-performance animations
- **react-native-gesture-handler**: Touch gesture handling
- **expo-blur**: Native blur effects for iOS/Android
- **expo-haptics**: Tactile feedback
- **@expo/vector-icons**: Icon library (Feather icons used throughout)

### Utilities
- **@react-native-async-storage/async-storage**: Local data persistence
- **react-native-keyboard-controller**: Intelligent keyboard management
- **react-native-safe-area-context**: Safe area layout handling
- **expo-image**: Optimized image loading

### Development Tools
- **TypeScript**: Type-safe development
- **ESLint**: Code linting with Expo configuration
- **Prettier**: Code formatting
- **babel-plugin-module-resolver**: Path aliasing for imports

### Future Integration Points
- Authentication service (ready to replace demo auth)
- REST API or GraphQL backend (storage layer abstracted for easy migration)
- Push notifications (expo-notifications)
- Real-time updates (WebSocket/Firebase)
- Analytics tracking
- Cloud storage for avatars/documents