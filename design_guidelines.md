# VCenter - Virtual Call Center Business App - Design Guidelines

## App Overview
A comprehensive mobile platform for managing a virtual call center business. Features employee management, recruitment/marketing, training resources, and business analytics. Built for business owners venturing into work-from-home call center operations.

## Architecture Decisions

### Authentication
**Demo Mode Active** - Uses local storage with demo user for testing. Ready for real auth integration.

**Implementation:**
- Demo admin user auto-created on first launch
- Role-based access: Admin, Supervisor, Agent
- Logout with confirmation dialog
- Profile screen shows role badge and employee info

### Navigation Structure
**Tab Navigation (5 tabs)**

**Tab Bar (Bottom):**
1. **Dashboard** - Business overview, active campaigns, real-time metrics
2. **Team** - Agent directory with status tracking and search
3. **Jobs** - Job postings, recruitment, application management
4. **Training** - Onboarding modules and training resources
5. **Profile** - User info, settings, logout

## Screen Specifications

### 1. Dashboard Screen
- Horizontal scrolling metric cards (Active Agents, Total Calls, Avg Response, Revenue)
- Quick stats row (Pending Applications, Active Campaigns)
- Active campaigns list with agent count and call metrics
- Currently active agents list

### 2. Team Screen
- Search bar with real-time filtering
- Status filter buttons (All, Available, Busy, Break, Offline)
- Agent cards with avatar, name, status badge, current task
- Tap to view agent detail modal

### 3. Agent Detail Screen (Modal)
- Profile section with avatar and status
- Contact information section
- Performance metrics grid
- Status update buttons
- Current task indicator if busy

### 4. Jobs Screen
- Stats row (Active Jobs, Applications count)
- Tab switcher (Job Postings / Applications)
- Job cards with type badge, status, location, salary
- Application list with status badges
- FAB for creating new job posting

### 5. Job Detail Screen
- Job type and status badges
- Full description, requirements, benefits lists
- Applications count card (tappable)
- Toggle job active/closed button

### 6. Applications Screen
- Job info header
- Status filter chips
- Application cards with status, contact info
- Tap to view application detail

### 7. Application Detail Screen (Modal)
- Applicant info section
- Experience and cover letter display
- Notes section if present
- Status update grid with icons

### 8. Create Job Screen (Modal)
- Form with title, type selector, department selector
- Location and salary fields
- Description textarea
- Requirements and benefits (one per line)

### 9. Training Screen
- Progress card with overall completion stats
- Category filter chips
- Training module cards with progress bars
- Required badge on mandatory modules

### 10. Module Detail Screen (Modal)
- Category icon and badges
- Completion progress bar
- About section
- Learning points list
- Pro tip card
- Start/Review button

### 11. Profile Screen
- Avatar with initials
- Role badge
- Contact info section
- Business overview metrics
- Menu items (Settings, Help, Terms)
- Logout button

### 12. Settings Screen
- Toggle switches for notifications, sounds, auto-refresh
- Clear data action
- About section with version info

## Design System

### Color Palette
**Primary Colors:**
- Primary: Professional blue (#2563EB)
- Secondary: Teal (#14B8A6)
- Accent: Amber (#F59E0B)

**Status Colors:**
- Available/Online: Green (#10B981)
- Busy/Active: Orange (#F97316)
- Break: Amber (#F59E0B)
- Offline: Gray (#6B7280)
- Error: Red (#EF4444)

**Neutrals (Light Mode):**
- Background Root: #FFFFFF
- Background Default: #F9FAFB
- Background Secondary: #F3F4F6
- Background Tertiary: #E5E7EB
- Text Primary: #111827
- Text Secondary: #6B7280
- Border: #E5E7EB

**Neutrals (Dark Mode):**
- Background Root: #111827
- Background Default: #1F2937
- Background Secondary: #374151
- Background Tertiary: #4B5563
- Text Primary: #F9FAFB
- Text Secondary: #9CA3AF
- Border: #374151

### Typography
- h1: 28pt, Bold
- h2: 24pt, Bold
- h3: 20pt, Semibold
- h4: 18pt, Semibold
- body: 16pt, Regular
- small: 14pt, Regular
- caption: 12pt, Medium

### Spacing
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px
- 3xl: 32px

### Border Radius
- xs: 8px
- sm: 12px
- md: 18px
- lg: 24px
- full: 9999px

### Icons
- Use Feather icons from @expo/vector-icons
- Navigation: home, users, briefcase, book-open, user
- Actions: plus, search, filter, chevron-right, x
- Status: circle (filled for indicators)
- NO emojis throughout the application

### Interaction Design
- Cards: Scale to 0.98 on press with spring animation
- Buttons: Scale with spring animation
- List items: Opacity 0.8 on press
- Pressable feedback on all interactive elements

## Data Model

### Agent
- id, name, email, phone, role, status
- avatarIndex, employeeId, department
- currentTask, callsHandled, avgResponseTime, rating, hireDate

### JobPosting
- id, title, description, requirements[], benefits[]
- department, type, location, salary
- isActive, applicationsCount, createdAt

### Application
- id, jobId, name, email, phone
- experience, coverLetter, status, notes
- createdAt, updatedAt

### TrainingModule
- id, title, description, category
- duration, isRequired, completionRate, order

### Campaign
- id, name, client, description, status
- agentsAssigned, callsToday, conversionRate
- startDate, endDate

## Accessibility
- Minimum touch target: 44x44pt
- Color contrast maintained
- Status indicators use icons + text (not color alone)
- Clear labels on all interactive elements
