# Eplouribousse Frontend - Developer Documentation

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Architecture Patterns](#architecture-patterns)
6. [Path Aliases](#path-aliases)
7. [Component Organization](#component-organization)
8. [State Management (Stores)](#state-management-stores)
9. [Composables](#composables)
10. [Routing](#routing)
11. [Types](#types)
12. [Internationalization (i18n)](#internationalization-i18n)
13. [Testing](#testing)
14. [Code Style & Linting](#code-style--linting)
15. [Deployment](#deployment)

---

## Overview

Eplouribousse is a web application designed to facilitate the **deduplication of periodicals within a group of libraries**. This frontend is built with Vue 3 and communicates with a backend API.

> ⚠️ **Warning:** The application is partially tested at the moment due to project delays. Test coverage will be improved in future iterations.

### Main Features

- User authentication (local + Shibboleth SSO, handled by the backend)
- Project management (creation, review, launch, archiving)
- Library management
- Resource management with workflow states (positioning, instruction, control, anomaly management and edition)
- Role-based access control (Admin, Manager, Instructor, Controller, Guest)
- Dashboard with charts and statistics

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3 (Composition API with `<script setup>`) |
| Build Tool | Vite |
| State Management | Pinia |
| UI Framework | Quasar |
| Routing | Vue Router |
| HTTP Client | Axios |
| Internationalization | Vue I18n |
| Charts | Chart.js + vue-chartjs |
| Analytics | Vue Matomo |
| Error Tracking | Sentry |
| Testing | Vitest + Vue Test Utils |
| Linting | ESLint + OxLint + Prettier |
| Package Manager | pnpm |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run type checking
pnpm type-check

# Run tests
pnpm test:unit

# Run tests with coverage
pnpm test:unit:coverage

# Lint code
pnpm lint

# Format code
pnpm format

# Build for different environments
pnpm build:test
pnpm build:preprod
pnpm build:prod
```

---

## Project Structure

```
eplfront/
├── constants/          # Application constants and enums
│   ├── other.ts
│   └── project.ts      # Project-related enums (Status, Roles, ResourceStatus, etc.)
│
├── docs/               # Documentation
│
├── nginx/              # Nginx configurations for deployment
│
├── public/             # Static assets (favicon, images, logos)
│
├── src/
│   ├── assets/         # Styles (CSS, SASS) and legal texts
│   │
│   ├── components/     # Vue components (organized by domain)
│   │   ├── account/    # User account components
│   │   ├── admin/      # Admin-specific components
│   │   ├── anomaly/    # Anomaly declaration components
│   │   ├── atomic/     # Reusable atomic/base components
│   │   ├── auth/       # Authentication components
│   │   ├── forms/      # Form components (invitations, etc.)
│   │   ├── layout/     # Layout components (header, footer, drawer)
│   │   ├── library/    # Library management components
│   │   ├── project/    # Project-related components (largest domain)
│   │   ├── projects/   # Projects listing components
│   │   └── utils/      # Utility components (BackButton, etc.)
│   │
│   ├── composables/    # Vue composables (reusable logic)
│   │
│   ├── locales/        # i18n translation files
│   │
│   ├── plugins/        # Vue plugins (i18n, axios)
│   │
│   ├── router/         # Vue Router configuration
│   │
│   ├── stores/         # Pinia stores
│   │
│   ├── utils/          # Utility functions
│   │
│   ├── views/          # Page components (routed views)
│   │
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
│
├── tests/
│   ├── fixtures/       # Test data factories
│   └── mocks/          # Test mocks
│
├── types/              # TypeScript type definitions
│
└── [config files]      # Vite, TypeScript, ESLint, etc.
```

---

## Architecture Patterns

### Component Architecture

The project follows a **domain-driven component organization**:

```
components/
├── atomic/         # Base UI components (Button, Input, Select, Toggle, Dialog)
├── [domain]/       # Domain-specific components (project, library, auth, etc.)
│   ├── ComponentName.vue
│   └── useComponentName.ts   # Associated composable (logic extraction)
```

### Separation of Concerns

Each feature typically has:
1. **Vue Component** (`.vue`) - Template and presentation
2. **Composable** (`use*.ts`) - Business logic extracted from component
3. **Store** - Global state management
4. **Types** - TypeScript interfaces

**Example: Project Resource**
```
components/project/projectLaunched/ProjectResource/
├── ProjectResource.vue        # Component
└── useProjectResource.ts      # Logic
```

---

## Path Aliases

Configured in `vite.config.ts`, these aliases simplify imports:

| Alias | Path | Usage |
|-------|------|-------|
| `@` | `./src` | Source files |
| `#` | `./types` | Type definitions |
| `~` | `./tests` | Test files |
| `&` | `./constants` | Constants |

**Examples:**
```typescript
import { useUserStore } from '@/stores/userStore'
import type { User } from '#/user'
import { userFixture } from '~/fixtures/users'
import { Roles } from '&/project'
```

---

## Component Organization

### Atomic Components (`src/components/atomic/`)

Reusable base components that wrap Quasar components with project-specific defaults:

| Component | Description |
|-----------|-------------|
| `AtomicButton` | Enhanced button with confirmation dialog support |
| `AtomicInput` | Standardized input field |
| `AtomicSelect` | Dropdown select component |
| `AtomicToggle` | Toggle/switch component |
| `AtomicEditableField` | Inline editable field |
| `AtomicConfirmationDialog` | Confirmation modal |

### Domain Components

Components are grouped by business domain:

- **`auth/`** - Login, logout, password reset, account creation
- **`project/`** - Project workflow (stepper, dashboard, resources, segments)
- **`library/`** - Library management
- **`anomaly/`** - Anomaly declaration and tracking
- **`layout/`** - App shell (header, footer, drawer)

### Views (`src/views/`)

Page-level components mapped to routes:

| View | Route | Description |
|------|-------|-------------|
| `HomeView` | `/` | Landing page |
| `AuthView` | `/login`, `/logout`, etc. | Authentication pages |
| `ProjectsView` | `/projects` | Project listing |
| `ProjectView` | `/projects/:id` | Single project view |
| `ProjectAdministrationView` | `/projects/:id/admin` | Project settings |
| `ProjectDashboardView` | `/projects/:id/dashboard` | Project statistics |
| `LibrariesView` | `/libraries` | Library management |
| `TenantAdminView` | `/tenant-admin` | Super admin panel |

---

## State Management (Stores)

Using **Pinia** with the Composition API style:

### Store Files

| Store | Purpose |
|-------|---------|
| `userStore` | Current user state and authentication |
| `projectStore` | Current project details and actions |
| `projectsStore` | Projects listing (pagination, filtering) |
| `resourceStore` | Single resource state |
| `resourcesStore` | Resources listing for a project |
| `libraryStore` | Library management |
| `anomalyStore` | Anomaly declarations |
| `globalStore` | Tenant configuration |

### Store Pattern

```typescript
// Example: userStore.ts
export const useUserStore = defineStore('user', () => {
    // State
    const user = ref<User>()
    const userLoading = ref<boolean>(false)
    
    // Getters (computed)
    const isAuth = computed(() => !!user.value?.id)
    
    // Actions
    const getUser = async () => { /* ... */ }
    const clear = () => { /* ... */ }
    
    return { user, isAuth, userLoading, getUser, clear }
})
```

---

## Composables

Located in `src/composables/`, these extract reusable logic:

| Composable | Purpose |
|------------|---------|
| `useAuth` | Authentication logic (login, logout, Shibboleth handshake) |
| `useComposableQuasar` | Quasar utilities (notifications, loading) |
| `usePasswordValidators` | Password strength validation |
| `useUtils` | General utilities (error handling, date formatting) |

### Component-Specific Composables

Many components have associated `use*.ts` files in the same directory:

```
components/project/stepper/
├── ProjectStepper.vue
└── useProjectStepper.ts    # Stepper logic
```

---

## Routing

### Route Guards

The app uses navigation guards for access control:

```typescript
// User must be authenticated
beforeEnter: [userNeedToBeAuth]

// User must NOT be authenticated
beforeEnter: [userNeedToNotBeAuth]

// User must have local account (not SSO-only)
beforeEnter: [userAccountNeedToBeLocal]

// User must be superuser
beforeEnter: [userNeedToBeSuperUser]
```

### JWT Handling

- Tokens stored in localStorage
- Automatic token refresh via Axios interceptor
- Expiration check on route navigation

---

## Types

TypeScript definitions in `types/`:

| File | Contents |
|------|----------|
| `user.ts` | `User`, `UserSummarized` interfaces |
| `project.ts` | `Project`, `ProjectDetails`, `Collection`, etc. |
| `library.d.ts` | Library interfaces |
| `resources.ts` | Resource interfaces |
| `permissions.d.ts` | Permission types |
| `pagination.ts` | Pagination utilities |
| `utils.ts` | Utility types (`ButtonColor`, etc.) |
| `global.d.ts` | Global type declarations |

### Constants vs Types

- **`constants/`** - Runtime values (enums, labels)
- **`types/`** - Compile-time type definitions

```typescript
// constants/project.ts - Runtime enum
export enum ProjectStatus {
    Draft = 10,
    Review = 20,
    // ...
}

// types/project.ts - Interface using the enum
export interface Project {
    status: ProjectStatus
    // ...
}
```

---

## Internationalization (i18n)

### Configuration

- Plugin: `vue-i18n`
- Locale files: `src/locales/fr.json`
- Default language: French (`fr`)

### Usage

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <h1>{{ t('common.login') }}</h1>
</template>
```

### Scripts

```bash
# Find missing/unused translation keys
pnpm i18n-report
```

---

## Testing

### Stack

- **Vitest** - Test runner
- **Vue Test Utils** - Component testing
- **@faker-js/faker** - Test data generation

### Structure

```
tests/
├── fixtures/       # Reusable test data
│   ├── users.ts
│   ├── projects.ts
│   └── ...
└── mocks/
    └── i18n.ts     # i18n mock for tests
```

### Running Tests

```bash
pnpm test:unit              # Run tests in watch mode
pnpm test:unit:coverage     # Run with coverage report
```

---

## Code Style & Linting

### Tools

- **ESLint** - JavaScript/TypeScript linting
- **OxLint** - Fast linter for additional checks
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks

### Commands

```bash
pnpm lint           # Run all linters with auto-fix
pnpm lint:eslint    # ESLint only
pnpm lint:oxlint    # OxLint only
pnpm format         # Format with Prettier
```

---

## Deployment

### Build Scripts

```bash
pnpm build:test     # Test environment
pnpm build:preprod  # Pre-production
pnpm build:prod     # Production
```

### Docker

The app is containerized using Docker:

- `Dockerfile` - Multi-stage build
- `compose.yaml` - Docker Compose configuration
- `deploy.sh` - Deployment script

### Nginx

Configuration files for different environments in `nginx/`:

- `eplouribousse-test.app.unistra.fr.conf`
- `eplouribousse-pprd.app.unistra.fr.conf`
- `paas.conf`

---

## Quick Reference

### Creating a New Feature

1. **Add types** in `types/` if needed
2. **Add constants** in `constants/` if needed
3. **Create store** in `src/stores/` for state management
4. **Create composable** in `src/composables/` or next to component
5. **Create component(s)** in appropriate `src/components/[domain]/`
6. **Add route** in `src/router/routes.ts`
7. **Create view** in `src/views/` if it's a new page
8. **Add translations** in `src/locales/fr.json`
9. **Write tests** in `src/stores/__tests__/` or `src/utils/__tests__/`

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProjectStepper.vue` |
| Composables | camelCase with `use` prefix | `useProjectStepper.ts` |
| Stores | camelCase with `Store` suffix | `projectStore.ts` |
| Types | camelCase | `project.ts` |
| Views | PascalCase with `View` suffix | `ProjectView.vue` |

---

## Contact

For questions about this project, contact:  
**dnum-dip@unistra.fr**
