# Cursor Rules Documentation

This directory contains comprehensive Cursor Rules to guide AI assistance throughout the codebase. These rules help maintain consistency, enforce best practices, and speed up development.

## 📋 Available Rules

### 1. **project-structure.mdc** (Always Applied)

**Scope**: Entire project  
**Purpose**: Core project architecture and conventions

Covers:

- Technology stack overview
- Directory structure and organization
- File naming conventions
- Import path aliases
- Key configuration files
- Domain models and types
- Available npm scripts

**When it helps**: Understanding project layout, finding files, knowing conventions

---

### 2. **typescript-react.mdc**

**Scope**: `*.ts`, `*.tsx` files  
**Purpose**: TypeScript and React coding standards

Covers:

- TypeScript best practices (strict mode, type safety)
- React component patterns
- Hooks guidelines
- Form handling with React Hook Form + Zod
- Import ordering
- Code style and formatting
- Error handling
- Async/await patterns

**When it helps**: Writing components, managing state, handling forms, type definitions

---

### 3. **component-standards.mdc**

**Scope**: `components/**/*.tsx`, `components/**/*.jsx`  
**Purpose**: Component architecture and development patterns

Covers:

- Component categories (UI, Elements, Features, Layout)
- Props patterns and naming
- Component composition
- Form components best practices
- Styling with Tailwind (className patterns)
- Variant handling with CVA
- State management
- Accessibility basics
- Performance optimization
- Memoization strategies

**When it helps**: Creating new components, refactoring existing ones, ensuring consistency

---

### 4. **styling.mdc**

**Scope**: `*.css`, `*.tsx`, `*.jsx` files  
**Purpose**: Tailwind CSS and styling guidelines

Covers:

- Custom theme (colors, fonts, breakpoints)
- Utility-first approach
- Class organization and ordering
- Responsive design patterns
- RTL (Right-to-Left) support for Persian/Farsi
- Custom breakpoints usage
- Animation with Tailwind and Framer Motion
- Dark mode support
- Performance considerations
- Design system consistency

**When it helps**: Styling components, responsive design, maintaining visual consistency

---

### 5. **api-services.mdc**

**Scope**: `app/api/**/*`, `services/**/*`  
**Purpose**: API routes and service layer patterns

Covers:

- Next.js App Router API route handlers
- Request/response patterns
- Input validation with Zod
- Error handling
- Service class patterns
- Storage services
- Data fetching with TanStack Query
- Server-side data fetching
- Environment variables
- HTTP status codes
- Caching strategies

**When it helps**: Creating API endpoints, fetching data, managing services

---

### 6. **testing.mdc**

**Scope**: `**/*.test.ts`, `**/*.spec.ts`, `e2e/**/*`  
**Purpose**: Testing standards and patterns

Covers:

- Jest setup and configuration
- React Testing Library patterns
- Testing components and hooks
- Mocking strategies
- E2E testing with Playwright
- Page Object Pattern
- API mocking
- Visual regression testing
- Testing best practices
- Coverage guidelines

**When it helps**: Writing tests, debugging test failures, ensuring quality

---

### 7. **performance.mdc**

**Scope**: Manual activation  
**Purpose**: Performance optimization guidelines

Covers:

- Image and font optimization
- Code splitting and dynamic imports
- Bundle analysis
- React performance (memoization, virtual lists)
- Data fetching optimization
- Rendering performance
- Network optimization
- Caching strategies
- Bundle size reduction
- Monitoring with Web Vitals

**When it helps**: Optimizing slow features, reducing bundle size, improving Core Web Vitals

---

### 8. **accessibility.mdc**

**Scope**: `components/**/*.tsx`, `app/**/*.tsx`  
**Purpose**: WCAG 2.1 Level AA accessibility compliance

Covers:

- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Focus management
- Forms accessibility
- Color contrast requirements
- Alt text for images
- RTL support
- Screen reader compatibility
- Accessible patterns (modals, dropdowns, tabs)
- Testing tools and methods

**When it helps**: Ensuring accessible UI, meeting WCAG standards, supporting assistive technologies

---

### 9. **git-workflow.mdc**

**Scope**: Manual activation  
**Purpose**: Git conventions and workflow

Covers:

- Conventional Commits format
- Branch naming conventions
- PR workflow
- Code review guidelines
- Commit best practices
- Keeping history clean (rebase, squash)
- Release process with semantic-release
- Troubleshooting common Git issues

**When it helps**: Creating commits, managing branches, reviewing code, releasing versions

---

## 🎯 How Rules Are Applied

### Automatic Application

Some rules apply automatically based on file type:

- **Always**: `project-structure.mdc`
- **TypeScript files**: `typescript-react.mdc`
- **Component files**: `component-standards.mdc`
- **Styling contexts**: `styling.mdc`
- **API/Service files**: `api-services.mdc`
- **Test files**: `testing.mdc`
- **Accessibility contexts**: `accessibility.mdc`

### Manual Activation

Other rules need to be explicitly referenced:

- **Performance optimization**: "@performance" or reference in your question
- **Git workflow**: "@git-workflow" or ask about commits/branches

## 💡 Using Rules Effectively

### Ask Specific Questions

```
❌ "How do I make a component?"
✅ "How do I create a new flight filter component following our component standards?"

❌ "Fix this code"
✅ "Update this component to follow our TypeScript and accessibility standards"
```

### Reference Rules in Prompts

```
"Create a new API route following our api-services patterns"
"Refactor this component to improve performance per our performance guidelines"
"Add proper accessibility attributes according to our standards"
```

### Request Rule-Compliant Code

```
"Generate a search form component that follows our component-standards and accessibility rules"
"Create tests for this component following our testing patterns"
```

## 📁 Project-Specific Context

### Key Files Referenced in Rules

- **Types**: `app/types/flight.ts`, `app/types/filter.ts`
- **Components**: `components/FlightSearchForm/FlightSearchForm.tsx`
- **Config**: `tsconfig.json`, `tailwind.config.js`, `next.config.ts`
- **Examples**: Referenced throughout rules for patterns

### Custom Conventions

This project has some unique characteristics:

1. **RTL Support**: Persian/Farsi language support with custom font
2. **Custom Breakpoints**: Additional responsive breakpoints (`sm-md`, `lg-xl`, etc.)
3. **Strict TypeScript**: `noUncheckedIndexedAccess` enabled
4. **No Semicolons**: Prettier configured without semicolons
5. **Conventional Commits**: Required commit message format

## 🔄 Maintaining Rules

### When to Update Rules

- New conventions are established
- Technology stack changes
- Best practices evolve
- Common patterns emerge

### Adding New Rules

1. Create `.mdc` file in `.cursor/rules/`
2. Add frontmatter with scope (globs, alwaysApply, or description)
3. Write clear, actionable guidelines
4. Reference existing project files with `[file.ext](mdc:file.ext)`
5. Provide examples (good ✅ and bad ❌)
6. Update this README

### Rule Format

```markdown
---
globs: *.ts,*.tsx
# OR
alwaysApply: true
# OR  
description: When to use this rule
---

# Rule Title

## Section 1

Content...

## Section 2

More content...
```

## 🚀 Quick Reference

| Task                   | Relevant Rules                                       |
| ---------------------- | ---------------------------------------------------- |
| Creating a component   | component-standards, typescript-react, accessibility |
| Styling a component    | styling, component-standards                         |
| Creating API route     | api-services                                         |
| Writing tests          | testing                                              |
| Fetching data          | api-services, performance                            |
| Improving performance  | performance                                          |
| Ensuring accessibility | accessibility                                        |
| Making commits         | git-workflow                                         |
| Understanding project  | project-structure                                    |

## 📚 Additional Resources

- **Official Docs**: [Cursor Rules Documentation](https://docs.cursor.com/context/rules)
- **Project Docs**: See main `README.md` in project root
- **Config Files**: Check individual config files for detailed settings

---

**Last Updated**: October 10, 2025  
**Cursor Version**: Compatible with latest Cursor  
**Project**: Next.js 15 Flight Booking Application
