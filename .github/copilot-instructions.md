# Copilot Instructions for Pragma Frontend

## Architecture Overview

This is an **Astro SSR application** with React components, following **Clean Architecture** principles and designed for mentorship platform functionality. The app uses server-side rendering with Vercel deployment.

### Key Technologies
- **Astro 5** with SSR (`output: "server"`) and Vercel adapter
- **React 19** for interactive components with `client:load` directives
- **Authentication** via `auth-astro` with Google OAuth
- **State Management**: Nanostores for user state, Zustand for error handling
- **Styling**: Tailwind CSS with shadcn/ui components and dark mode support
- **HTTP Client**: Axios with centralized error handling and environment-aware base URL

## Essential Patterns

### Component Architecture
Follow **Atomic Design** in `src/components/`:
```
atoms/           # Basic UI elements
molecules/       # Combined atoms (Modal, Select)
organisms/       # Complex components (ProfileForm, DashboardSidebar)
templates/       # Layout components (DashboardLayout)
ui/              # shadcn/ui components
```

### Infrastructure Layer
Clean Architecture separation in `src/infrastructure/`:
```
adapters/        # Third-party integrations (httpClient)
models/          # Backend response interfaces
services/        # API endpoint functions (getTutoringRequests.ts)
```

### State Management Patterns
- **User State**: Nanostores with `userStore` atom and helper functions
- **Error State**: Zustand store with automatic HTTP error handling
- **React Integration**: Use `useStore(userStore)` from `@nanostores/react`

### HTTP Client Configuration
The `httpClient` handles server/client environment differences:
```typescript
// Uses astro:env/server on server, PUBLIC_API_URL on client
const baseURL = typeof window === "undefined" 
  ? (await import("astro:env/server")).getSecret("API_URL")
  : import.meta.env.PUBLIC_API_URL;
```

### Service Layer Pattern
Each API endpoint has its own file with typed interfaces:
```typescript
// Example: getTutoringRequests.ts
export interface GetTutoringRequestsParams { ... }
export interface GetTutoringRequestsResponse { ... }
export async function getTutoringRequests(params) { ... }
```

### Dark Mode Implementation
Tailwind dark mode with `["class"]` strategy:
- Use `dark:` prefixes for styling
- Toggle with `document.documentElement.classList.add/remove('dark')`
- Persist theme in localStorage

## Development Workflows

### Component Creation
- Interactive components need `client:load` in Astro files
- Use TypeScript interfaces for all props and data
- Follow shadcn/ui patterns for consistent styling

### API Integration
1. Create service function in `src/infrastructure/services/`
2. Define request/response interfaces
3. Use `httpClient` for consistent error handling
4. Import and use in React components with proper error states

### Authentication Flow
- Google OAuth configured in `auth.config.ts`
- Session data available via `getSession(Astro.request)` in Astro components
- Pass user data to React components as props

### Environment Variables
- Server secrets: Use `astro:env/server` with schema in `astro.config.mjs`
- Client variables: Prefix with `PUBLIC_` and access via `import.meta.env`

## Testing Commands
```bash
npm run test          # Run Vitest unit tests
npm run coverage      # Generate coverage report
npm run lint          # ESLint check
npm run format        # Prettier formatting
```

## Critical Files
- `src/infrastructure/adapters/httpClient/httpClient.ts` - HTTP configuration
- `src/store/userStore.ts` - User state management
- `src/components/templates/DashboardLayout.astro` - Main layout
- `auth.config.ts` - Authentication setup
- `astro.config.mjs` - Environment and integration config
