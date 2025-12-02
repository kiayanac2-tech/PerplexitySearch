# Virtual Call Center Management App - Design Guidelines

## App Overview
A mobile workforce management platform for virtual call center operations, enabling business owners to manage agents, track performance, assign customer interactions, and monitor real-time operations.

## Architecture Decisions

### Authentication
**Auth Required** - This app manages business operations with multiple user roles.

**Implementation:**
- SSO with Apple Sign-In (iOS) and Google Sign-In (cross-platform)
- Role-based access: Admin, Supervisor, Agent
- Login screen with company logo placeholder
- Account screen includes:
  - Role badge display
  - Employee ID
  - Log out with confirmation
  - Settings nested under Account

### Navigation Structure
**Tab Navigation (4 tabs + Floating Action Button)**

**Tab Bar (Bottom):**
1. **Dashboard** - Performance overview and metrics
2. **Agents** - Team directory and status
3. **Schedule** - Shift management and calendar
4. **Reports** - Analytics and insights

**Floating Action Button (FAB):**
- Core action: "New Assignment" or "Log Call" (contextual based on user role)
- Positioned bottom-right, elevated above tab bar
- Admin/Supervisor: Create new ticket/assignment
- Agent: Log customer interaction

## Screen Specifications

### 1. Dashboard Screen
**Purpose:** Real-time operations overview and quick actions

**Layout:**
- Header: Transparent, title "Dashboard"
  - Right button: Notifications bell icon
- Content: Scrollable
  - Hero stat cards (3 horizontally scrolling cards):
    - Active Agents (live count with green pulse indicator)
    - Today's Calls/Tickets
    - Avg Response Time
  - "Current Activity" section with real-time agent status list
  - Quick actions section (2x2 grid of action cards)
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)

### 2. Agents Screen
**Purpose:** Team directory with live status indicators

**Layout:**
- Header: Custom with integrated search bar
  - Title: "Team"
  - Search bar for filtering agents
  - Right button: Filter icon (by status, shift, department)
- Content: FlatList (non-scrollable root, list handles scroll)
  - Agent cards with:
    - Avatar (generated preset based on role)
    - Name and employee ID
    - Status badge (Available/Busy/Break/Offline) with color coding
    - Current task/call indicator if active
    - Tap to view agent detail screen (modal)
- Safe area insets: top (Spacing.xl - search integrated in header), bottom (tabBarHeight + Spacing.xl)

### 3. Schedule Screen
**Purpose:** Shift management and availability tracking

**Layout:**
- Header: Default navigation header
  - Title: "Schedule"
  - Right button: Calendar view toggle
- Content: Scrollable
  - Week view selector (horizontal date strip)
  - Shift timeline visualization showing all agents
  - Shift cards with drag-to-reschedule capability (admin only)
  - "My Shifts" section for agent role
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)

### 4. Reports Screen
**Purpose:** Performance analytics and business insights

**Layout:**
- Header: Transparent
  - Title: "Reports"
  - Right button: Export/Share icon
- Content: Scrollable
  - Date range selector at top
  - Chart cards (bar/line charts for metrics):
    - Call volume trends
    - Agent performance comparison
    - Customer satisfaction scores
  - Detailed metrics list below charts
- Safe area insets: top (headerHeight + Spacing.xl), bottom (tabBarHeight + Spacing.xl)

### 5. Agent Detail Screen (Modal)
**Purpose:** Individual agent profile and performance

**Layout:**
- Native modal presentation
- Header: Non-transparent
  - Left button: Close (X)
  - Title: Agent name
  - Right button: Edit (admin only)
- Content: Scrollable form-style layout
  - Profile section (avatar, contact info, role)
  - Current status and location
  - Performance metrics (calls handled, avg time, rating)
  - Recent activity log
  - Availability calendar
- Submit/action button: "Assign Task" at bottom (fixed, not in header)
- Safe area insets: top (Spacing.xl), bottom (insets.bottom + Spacing.xl)

### 6. Create Assignment Screen (Modal)
**Purpose:** Assign customer interactions to agents

**Layout:**
- Native modal presentation
- Header: Non-transparent
  - Left button: Cancel
  - Title: "New Assignment"
  - Right button: "Create" (submit)
- Content: Scrollable form
  - Customer info fields
  - Issue/ticket type selector
  - Priority level selector
  - Agent assignment dropdown (shows available agents)
  - Notes/description textarea
- Safe area insets: top (Spacing.xl), bottom (insets.bottom + Spacing.xl)

### 7. Login Screen
**Purpose:** Secure authentication for employees

**Layout:**
- Full screen, no header
- Content: Centered, non-scrollable
  - Company logo placeholder (top third)
  - Welcome text
  - SSO buttons (Apple, Google) stacked vertically
  - Terms & Privacy links at bottom
- Safe area insets: top (insets.top + Spacing.xl), bottom (insets.bottom + Spacing.xl)

## Design System

### Color Palette
**Primary Colors:**
- Primary: Professional blue (#2563EB) - main actions, active states
- Secondary: Teal (#14B8A6) - accents, success states
- Accent: Amber (#F59E0B) - warnings, pending states

**Status Colors:**
- Available/Online: Green (#10B981)
- Busy/Active: Orange (#F97316)
- Break: Amber (#F59E0B)
- Offline: Gray (#6B7280)

**Neutrals:**
- Background: #FFFFFF
- Surface: #F9FAFB
- Card background: #FFFFFF with subtle border
- Text primary: #111827
- Text secondary: #6B7280
- Border: #E5E7EB

### Typography
- Header Large: 28pt, Bold
- Header Medium: 20pt, Semibold
- Body: 16pt, Regular
- Caption: 14pt, Regular
- Label: 12pt, Medium

### Interaction Design
**Touchable Feedback:**
- Cards: Slight scale down (0.98) + opacity (0.8) on press
- Buttons: Solid buttons darken 10% on press
- List items: Background highlight (#F3F4F6) on press
- FAB: Scale animation (0.95) + shadow intensifies on press

**Floating Action Button Shadow:**
- shadowOffset: {width: 0, height: 2}
- shadowOpacity: 0.10
- shadowRadius: 2
- elevation: 4 (Android)

### Icons
- Use Feather icons from @expo/vector-icons
- Navigation: home, users, calendar, bar-chart-2
- Actions: plus-circle, bell, filter, download, x
- Status: circle (filled for status indicators)
- Avoid emojis throughout the application

### Critical Assets
**Required Generated Assets:**
1. **Company Logo** - Modern, professional wordmark for login screen
2. **Agent Avatars (6 presets)** - Minimalist, professional illustration style in brand colors:
   - Male/Female variations
   - Diverse representation
   - Clean geometric style matching corporate aesthetic
3. **Empty State Illustrations (3)**:
   - No agents assigned yet
   - No calls/tickets today
   - No data for selected date range

**Asset Style Guidelines:**
- Clean, minimal, professional aesthetic
- Use primary brand color palette
- Avoid overly playful or casual styles
- Consistent geometric illustration style

## Accessibility Requirements
- Minimum touch target: 44x44pt
- Color contrast ratio: 4.5:1 for text, 3:1 for UI components
- Status indicators: Never rely on color alone (use icons + text labels)
- VoiceOver labels for all interactive elements
- Support Dynamic Type for text scaling
- Loading states with accessibility announcements
- Form fields with clear labels and error messages