# CLAUDE.md - AI Assistant Guide for underwrAIt

This document provides comprehensive guidance for AI assistants working with the underwrAIt codebase, a German disability insurance underwriting system built with Next.js 14 and Supabase.

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Development Workflows](#development-workflows)
- [Code Conventions](#code-conventions)
- [Component Architecture](#component-architecture)
- [Error Handling](#error-handling)
- [Data Fetching Patterns](#data-fetching-patterns)
- [UI/UX Guidelines](#uiux-guidelines)
- [Common Tasks](#common-tasks)

---

## Project Overview

**underwrAIt** is a medical underwriting platform for German disability insurance that displays complex medical data in an accessible, user-friendly format.

### Key Features
- Case management for insurance underwriting
- Medical history timeline with encounters, diagnoses, medications
- Lab values and findings display
- Document management (PDF references)
- Three-column responsive layout optimized for medical data review
- Full German localization
- Risk scoring and assessment visualization

### Architecture Pattern
- **Server-first approach**: Uses Next.js 14 App Router with Server Components by default
- **Type-safe data layer**: Full TypeScript coverage with strict mode
- **Direct database access**: Supabase client used directly in Server Components (no API routes)
- **Component-based UI**: Highly modular, reusable React components

---

## Technology Stack

### Core Framework
- **Next.js 14.2.15** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type-safe development

### Backend & Database
- **Supabase (@supabase/supabase-js 2.45.0)** - PostgreSQL database and API
- Connection configured in `lib/supabase.ts`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.460.0** - Icon library
- Custom components in `components/ui/`

### Development Tools
- **ESLint 8** - Linting with Next.js config
- **PostCSS 8** - CSS processing

---

## Project Structure

```
underwrAIt/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Case list/overview page
│   ├── layout.tsx               # Root layout with header
│   ├── error.tsx                # Global error boundary
│   ├── globals.css              # Global styles, animations
│   └── case/
│       └── [id]/
│           ├── page.tsx         # Individual case detail page
│           └── error.tsx        # Case-level error boundary
│
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   │   ├── badge.tsx            # Status/type indicators (12+ variants)
│   │   ├── card.tsx             # Card layout system
│   │   ├── collapsible.tsx      # Expandable sections
│   │   ├── data-display.tsx     # DataRow, DataGrid
│   │   ├── empty-state.tsx      # No-data placeholder
│   │   ├── error-boundary.tsx   # Error handling UI
│   │   └── loading.tsx          # Loading indicators
│   │
│   ├── layout/                  # Layout components
│   │   ├── header.tsx           # Page header
│   │   └── three-column-layout.tsx  # Responsive grid
│   │
│   ├── left-column/             # Left sidebar components
│   │   ├── personal-data-card.tsx
│   │   └── occupation-card.tsx
│   │
│   ├── middle-column/           # Main content components
│   │   ├── medical-history.tsx  # Encounters container
│   │   ├── encounter-card.tsx   # Collapsible encounter
│   │   ├── diagnoses-list.tsx   # Diagnoses with ICD-10
│   │   ├── medications-list.tsx # Medications with dosage
│   │   ├── lab-values-list.tsx  # Lab results
│   │   └── findings-list.tsx    # Medical findings
│   │
│   ├── right-column/            # Right sidebar components
│   │   ├── historical-diagnoses.tsx  # Diagnoses >5 years old
│   │   ├── chronic-conditions.tsx    # Chronic diagnoses
│   │   ├── documents-list.tsx        # PDF references
│   │   └── all-diagnoses-timeline.tsx
│   │
│   └── assistant/               # AI assistant (Phase 2 placeholder)
│       └── assistant-widget.tsx
│
├── lib/                         # Utilities and business logic
│   ├── supabase.ts             # Supabase client initialization
│   ├── types.ts                # TypeScript interfaces
│   ├── queries.ts              # Database query functions
│   ├── utils.ts                # Utility functions
│   └── errors.ts               # Custom error classes & handling
│
├── public/                      # Static assets
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── vercel.json                  # Vercel deployment config
└── package.json                 # Dependencies and scripts
```

---

## Database Schema

### Tables & Key Fields

#### `underwriting_cases`
- **Primary Key**: `id` (UUID)
- **Personal Info**: `name`, `birth_date`, `gender`, `height`, `weight`
- **Status**: `status` ('collecting' | 'review' | 'complete' | 'rejected')
- **Occupation**: `occupation` (JSON), `hobbies` (JSON array), `annual_income`
- **Health**: `smoker_status`
- **Relations**: Has many encounters, diagnoses, medications, lab_values, findings

#### `encounters`
- **Primary Key**: `id` (UUID)
- **Foreign Key**: `case_id` → underwriting_cases
- **Type**: `encounter_type` ('inpatient' | 'outpatient' | 'lab' | 'imaging')
- **Dates**: `start_date`, `end_date`
- **Details**: `title`, `facility`, `department`, `physician`
- **Clinical Notes**: `anamnese`, `therapy_notes`, `discharge_summary`
- **Document**: `source_document` (PDF reference)

#### `diagnoses`
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `case_id`, `encounter_id`
- **Diagnosis**: `condition`, `icd10_code`, `icd10_description`
- **Type**: `diagnosis_type` ('primary' | 'secondary')
- **Status**: `diagnosis_status` ('active' | 'resolved' | 'chronic' | 'suspected')
- **Risk**: `risk_category`, `risk_score` (0-10)
- **Validation**: `confidence`, `needs_review`, `source`

#### `medications`
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `case_id`, `encounter_id`
- **Details**: `name`, `brand_name`, `dosage`, `dosage_value`, `dosage_unit`
- **Usage**: `frequency`, `route`, `indication`, `as_needed`
- **Dates**: `start_date`, `end_date`, `is_current`

#### `lab_values`
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `case_id`, `encounter_id`
- **Measurement**: `parameter`, `value`, `value_text`, `unit`
- **Reference**: `reference_range`, `reference_low`, `reference_high`
- **Flags**: `is_abnormal`, `abnormality_direction` ('high' | 'low' | 'critical_high' | 'critical_low')
- **Date**: `measured_date`

#### `findings`
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `case_id`, `encounter_id`
- **Type**: `finding_type`, `title`, `description`
- **Result**: `result_summary`, `result_category` ('normal' | 'abnormal' | 'pathological' | 'inconclusive')
- **Date**: `performed_at`

### Type Definitions
All database types are defined in `lib/types.ts` with TypeScript interfaces matching the schema.

---

## Development Workflows

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (create `.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

### Available Scripts

```json
{
  "dev": "next dev",        // Development server on http://localhost:3000
  "build": "next build",    // Production build
  "start": "next start",    // Production server
  "lint": "next lint"       // ESLint check
}
```

### Git Workflow

- **Branch naming**: Use descriptive names (e.g., `feature/add-risk-scoring`, `fix/lab-values-display`)
- **Commits**: Write clear, descriptive commit messages in English
- **Testing**: Run `npm run build` before pushing to catch TypeScript errors

### Deployment

- **Platform**: Vercel (configured via `vercel.json`)
- **Build command**: `npm run build`
- **Environment variables**: Set in Vercel dashboard

---

## Code Conventions

### TypeScript Guidelines

1. **Always use TypeScript interfaces** for component props and data structures
2. **Enable strict mode** - already configured in `tsconfig.json`
3. **Import types explicitly** from `lib/types.ts`
4. **Use type guards** for error handling (`isAppError`, `isDatabaseError`)

Example:
```typescript
import { UnderwritingCase, EncounterWithDetails } from '@/lib/types';

interface CaseDetailsProps {
  caseData: UnderwritingCase;
  encounters: EncounterWithDetails[];
}

export default function CaseDetails({ caseData, encounters }: CaseDetailsProps) {
  // Component logic
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `MedicalHistory`, `PersonalDataCard`)
- **Files/Folders**: kebab-case (e.g., `medical-history.tsx`, `left-column/`)
- **Functions/Variables**: camelCase (e.g., `getCaseWithDetails`, `isAbnormal`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `MAX_RISK_SCORE`)
- **Types/Interfaces**: PascalCase (e.g., `UnderwritingCase`, `EncounterType`)

### File Organization

1. **One component per file** (except for tightly coupled sub-components)
2. **Barrel exports** using `index.ts` for clean imports
3. **Co-locate related files** (component + styles + tests in same directory if needed)
4. **Group by feature** not by type (components organized by page section)

### Import Order

```typescript
// 1. React imports
import { useState } from 'react';

// 2. External libraries
import { Calendar } from 'lucide-react';

// 3. Internal absolute imports (using @/ alias)
import { getCase } from '@/lib/queries';
import { UnderwritingCase } from '@/lib/types';

// 4. Relative imports
import { PersonalDataCard } from './personal-data-card';
```

---

## Component Architecture

### Server vs Client Components

**Default to Server Components** - Only add `'use client'` when necessary:
- Interactive components (buttons, forms, collapsible)
- Components using hooks (useState, useEffect)
- Components with event handlers

**Server Components** (no 'use client' directive):
- Data fetching components
- Layout components
- Static display components

Example:
```typescript
// Server Component (default)
import { getCaseWithDetails } from '@/lib/queries';

export default async function CasePage({ params }: { params: { id: string } }) {
  const caseData = await getCaseWithDetails(params.id);
  return <CaseDisplay data={caseData} />;
}

// Client Component
'use client';
import { useState } from 'react';

export function CollapsibleCard({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // Interactive logic
}
```

### Component Structure

Standard component template:

```typescript
'use client'; // Only if needed

import { ComponentProps } from '@/lib/types';
import { ChildComponent } from './child-component';

interface MyComponentProps {
  data: ComponentProps;
  className?: string;
}

export function MyComponent({ data, className = '' }: MyComponentProps) {
  // Component logic here

  return (
    <div className={`base-classes ${className}`}>
      {/* JSX content */}
    </div>
  );
}
```

### Component Composition

- **Build complex UIs** from simple, reusable components
- **Pass data down** via props (no prop drilling - use Server Components for data)
- **Use children pattern** for flexible layouts
- **Avoid component bloat** - split into smaller components if >200 lines

---

## Error Handling

### Custom Error Classes

Defined in `lib/errors.ts`:

```typescript
// Base error
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Specific error types
class DatabaseError extends AppError { }
class NotFoundError extends AppError { statusCode = 404 }
class ValidationError extends AppError { statusCode = 400 }
```

### Error Handling Pattern

```typescript
import { AppError, DatabaseError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/errors';

async function fetchData(id: string) {
  try {
    // Validate input
    if (!isValidUUID(id)) {
      throw new ValidationError('Ungültige ID');
    }

    // Database query
    const { data, error } = await supabase
      .from('table')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new DatabaseError('Fehler beim Laden', error);
    if (!data) throw new NotFoundError('Nicht gefunden');

    return data;
  } catch (error) {
    logError(error, { context: 'fetchData', id });
    throw error;
  }
}
```

### Error Boundaries

- **Global**: `app/error.tsx` for app-level errors
- **Route-specific**: `app/case/[id]/error.tsx` for case page errors
- **Component-level**: Use `ErrorBoundary` component for specific sections

### User-Facing Error Messages

**Always in German**:
- "Es ist ein Fehler aufgetreten" (An error occurred)
- "Fall nicht gefunden" (Case not found)
- "Daten konnten nicht geladen werden" (Data could not be loaded)

**Include recovery options**:
- Retry button
- Navigation to home
- Contact support (future)

---

## Data Fetching Patterns

### Query Functions

All database queries are in `lib/queries.ts`. Import and use these functions:

```typescript
// Case queries
import { getCase, getAllCases, getCaseWithDetails } from '@/lib/queries';

// Encounter queries
import {
  getEncountersForCase,
  getEncounterWithDetails,
  getEncountersWithDetailsForCase
} from '@/lib/queries';

// Diagnosis queries
import {
  getDiagnosesForCase,
  getHistoricalDiagnosesForCase,
  getChronicConditionsForCase
} from '@/lib/queries';
```

### Parallel Data Fetching

Use `Promise.all()` for critical data:

```typescript
export default async function CasePage({ params }: { params: { id: string } }) {
  const [caseData, encounters, diagnoses] = await Promise.all([
    getCaseWithDetails(params.id),
    getEncountersWithDetailsForCase(params.id),
    getDiagnosesForCase(params.id)
  ]);

  return <CaseDisplay data={caseData} encounters={encounters} />;
}
```

### Graceful Degradation

Use `Promise.allSettled()` for non-critical data:

```typescript
const [
  { value: caseData },
  encountersResult,
  documentsResult
] = await Promise.allSettled([
  getCaseWithDetails(params.id),
  getEncountersForCase(params.id),
  getDocumentsForCase(params.id)
]);

const encounters = encountersResult.status === 'fulfilled'
  ? encountersResult.value
  : [];
```

### Force Dynamic Rendering

For pages that need fresh data on every request:

```typescript
export const dynamic = 'force-dynamic';
```

This is already set in case detail pages to ensure up-to-date medical data.

---

## UI/UX Guidelines

### German Localization

**All user-facing text must be in German**:
- Component labels and headings
- Error messages
- Status indicators
- Date/time formatting

```typescript
// Date formatting
const formattedDate = new Date(dateString).toLocaleDateString('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

// Currency formatting
const formattedIncome = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
}).format(income);
```

### Badge System

Use consistent badge variants for status indicators (defined in `components/ui/badge.tsx`):

```typescript
// Status badges
<Badge variant="success">Abgeschlossen</Badge>
<Badge variant="warning">In Prüfung</Badge>
<Badge variant="danger">Abgelehnt</Badge>

// Type badges
<Badge variant="primary">Hauptdiagnose</Badge>
<Badge variant="secondary">Nebendiagnose</Badge>

// Risk scoring (color-coded)
// Green: risk < 4, Yellow: 4-7, Red: >= 7
<Badge variant={risk >= 7 ? 'danger' : risk >= 4 ? 'warning' : 'success'}>
  Risiko: {risk}
</Badge>
```

### Responsive Layout

The three-column layout adapts to screen size:

```typescript
// Desktop (lg breakpoint)
<div className="grid grid-cols-[300px_1fr_350px] gap-6">
  <aside>{/* Left sidebar */}</aside>
  <main>{/* Main content */}</main>
  <aside>{/* Right sidebar */}</aside>
</div>

// Mobile - stacks vertically
<div className="grid grid-cols-1 gap-4">
  {/* All columns stack */}
</div>
```

### Card Components

Standard card structure:

```typescript
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Titel</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Optional footer */}
  </CardFooter>
</Card>
```

### Collapsible Sections

For dense information:

```typescript
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui';

<Collapsible defaultOpen={true}>
  <CollapsibleTrigger>
    <div className="flex items-center justify-between">
      <h3>Begegnungen ({count})</h3>
      <ChevronDown className="transition-transform" />
    </div>
  </CollapsibleTrigger>
  <CollapsibleContent>
    {/* Collapsible content */}
  </CollapsibleContent>
</Collapsible>
```

### Empty States

Always provide feedback when no data exists:

```typescript
import { EmptyState } from '@/components/ui';

{items.length === 0 ? (
  <EmptyState message="Keine Einträge vorhanden" />
) : (
  <ItemsList items={items} />
)}
```

### Loading States

Show loading indicators for async operations:

```typescript
import { LoadingSpinner, LoadingState } from '@/components/ui';

// Inline spinner
<LoadingSpinner size="sm" />

// Full loading state with message
<LoadingState message="Daten werden geladen..." />
```

---

## Common Tasks

### Adding a New Page

1. **Create page file** in `app/` directory:
   ```typescript
   // app/my-page/page.tsx
   export default function MyPage() {
     return <div>Content</div>;
   }
   ```

2. **Add error boundary** (optional):
   ```typescript
   // app/my-page/error.tsx
   'use client';
   export default function Error({ error, reset }: { error: Error; reset: () => void }) {
     return <ErrorState error={error} onRetry={reset} />;
   }
   ```

3. **Update navigation** in `components/layout/header.tsx` if needed

### Adding a New Component

1. **Create component file** in appropriate directory:
   ```bash
   components/
   └── feature-name/
       ├── index.ts              # Barrel export
       ├── feature-component.tsx
       └── sub-component.tsx
   ```

2. **Define TypeScript interface** for props

3. **Add barrel export**:
   ```typescript
   // components/feature-name/index.ts
   export { FeatureComponent } from './feature-component';
   export { SubComponent } from './sub-component';
   ```

4. **Import using clean path**:
   ```typescript
   import { FeatureComponent } from '@/components/feature-name';
   ```

### Adding a New Database Query

1. **Add function to `lib/queries.ts`**:
   ```typescript
   export async function getMyData(caseId: string): Promise<MyDataType[]> {
     try {
       // Validate input
       if (!isValidUUID(caseId)) {
         throw new ValidationError('Ungültige Fall-ID');
       }

       // Query Supabase
       const { data, error } = await supabase
         .from('my_table')
         .select('*')
         .eq('case_id', caseId)
         .order('created_at', { ascending: false });

       if (error) throw new DatabaseError('Fehler beim Laden', error);
       return data || [];
     } catch (error) {
       logError(error, { context: 'getMyData', caseId });
       throw error;
     }
   }
   ```

2. **Add type definition** to `lib/types.ts` if needed

3. **Import and use** in Server Component:
   ```typescript
   import { getMyData } from '@/lib/queries';

   const data = await getMyData(caseId);
   ```

### Styling with Tailwind

Use utility classes consistently:

```typescript
// Layout
<div className="flex items-center justify-between gap-4">

// Spacing (consistent spacing scale)
<div className="p-4 mb-6">  // padding, margin-bottom

// Colors (use Tailwind color palette)
<div className="bg-gray-50 text-gray-900 border-gray-200">

// Responsive (mobile-first)
<div className="grid grid-cols-1 lg:grid-cols-3">

// Hover states
<button className="hover:bg-blue-600 transition-colors">

// Custom classes (when necessary)
<div className="custom-scrollbar">  // Defined in globals.css
```

### Working with Dates

Always use German locale:

```typescript
// Display date
const displayDate = new Date(dateString).toLocaleDateString('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

// Display date with time
const displayDateTime = new Date(dateString).toLocaleString('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

// Calculate age
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
```

### Risk Scoring Colors

Use consistent color coding for risk levels:

```typescript
function getRiskBadgeVariant(riskScore: number): BadgeVariant {
  if (riskScore >= 7) return 'danger';      // Red: High risk
  if (riskScore >= 4) return 'warning';     // Yellow: Medium risk
  return 'success';                         // Green: Low risk
}

<Badge variant={getRiskBadgeVariant(diagnosis.risk_score)}>
  Risiko: {diagnosis.risk_score}
</Badge>
```

---

## Best Practices for AI Assistants

### When Making Changes

1. **Read existing code first** - Always use the Read tool before modifying files
2. **Maintain consistency** - Follow existing patterns in the codebase
3. **Preserve localization** - Keep all UI text in German
4. **Type safety** - Always add TypeScript interfaces for new data structures
5. **Test the build** - Run `npm run build` to catch errors before committing
6. **Error handling** - Use custom error classes and proper error boundaries
7. **Performance** - Prefer Server Components, use parallel data fetching
8. **Accessibility** - Use semantic HTML and proper ARIA labels when needed

### When Adding Features

1. **Check existing components** - Reuse before creating new
2. **Follow the pattern** - Look at similar features for guidance
3. **Update types** - Add interfaces to `lib/types.ts`
4. **Add queries carefully** - Follow the pattern in `lib/queries.ts`
5. **Document complex logic** - Add comments for non-obvious code
6. **Consider mobile** - Test responsive behavior
7. **Handle empty states** - Always provide feedback when no data exists

### When Debugging

1. **Check error logs** - Errors are logged with context in `lib/errors.ts`
2. **Verify data types** - TypeScript strict mode catches many issues
3. **Test database queries** - Validate UUIDs before querying
4. **Check Supabase connection** - Verify environment variables are set
5. **Review error boundaries** - Ensure errors are caught and displayed properly

### Code Quality Checklist

Before committing changes, verify:
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] All UI text is in German
- [ ] TypeScript interfaces are defined for new data structures
- [ ] Error handling is in place
- [ ] Loading and empty states are handled
- [ ] Responsive design works on mobile and desktop
- [ ] No console errors in development mode
- [ ] Code follows existing naming conventions
- [ ] Comments explain complex logic

---

## Future Development

### Planned Features (Phase 2)

- **AI Assistant Widget**: Interactive chat assistant for case analysis
- **Error tracking integration**: Sentry or similar service (see TODO comments in `lib/errors.ts`)
- **Real-time updates**: Leverage Supabase real-time capabilities
- **Advanced risk modeling**: Enhanced risk assessment algorithms

### Extension Points

- **Custom hooks**: Add to `lib/hooks/` for shared React logic
- **Additional query helpers**: Extend `lib/queries.ts` for new data needs
- **UI components**: Add to `components/ui/` for reusable elements
- **Utilities**: Add to `lib/utils.ts` for shared helper functions

---

## Resources

### Documentation
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

### Key Files to Reference
- `lib/types.ts` - All TypeScript interfaces
- `lib/queries.ts` - Database query patterns
- `lib/errors.ts` - Error handling patterns
- `components/ui/badge.tsx` - Badge variant system
- `app/globals.css` - Custom CSS and animations

---

**Last Updated**: 2025-12-07
**Version**: 1.0.0
**Maintainer**: AI-assisted development team
