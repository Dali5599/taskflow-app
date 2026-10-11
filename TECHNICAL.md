# TaskFlow - Documentation Technique

## 🏗️ Architecture de l'Application

### Pattern Client-Side
TaskFlow utilise le **Client-Side Rendering (CSR)** avec Next.js 15 App Router.

```
┌─────────────────────────────────────┐
│        Browser (Client)            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   React Components         │   │
│  │   ┌──────────────┐        │   │
│  │   │  App Router  │        │   │
│  │   │  (Client)    │        │   │
│  │   └──────────────┘        │   │
│  │           │                │   │
│  │   ┌───────▼────────┐       │   │
│  │   │  Hooks         │       │   │
│  │   │  (useTasks)    │       │   │
│  │   └───────┬────────┘       │   │
│  │           │                │   │
│  │   ┌───────▼────────┐       │   │
│  │   │  LocalStorage   │       │   │
│  │   └────────────────┘       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Browser Storage           │   │
│  │   (localStorage)            │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Flux de Données

```
User Action
    │
    ▼
Component (React)
    │
    ▼
Hook (useTasks / useDarkMode)
    │
    ▼
State Update (useState)
    │
    ▼
LocalStorage (Persistence)
    │
    ▼
Re-render Component
    │
    ▼
UI Update
```

## 🧩 Composants

### Architecture par Composition

```
Layout (src/app/layout.tsx)
├── Sidebar (src/components/layout/sidebar.tsx)
│   ├── Logo
│   ├── Navigation Links
│   └── Dark Mode Toggle
│
├── Header (src/components/layout/header.tsx)
│   ├── Breadcrumb
│   ├── Search
│   ├── Notifications
│   └── User Menu
│
└── Main Content (src/app/{page}.tsx)
    ├── Dashboard (src/app/page.tsx)
    ├── Tasks (src/app/tasks/page.tsx)
    ├── Calendar (src/app/calendar/page.tsx)
    ├── Analytics (src/app/analytics/page.tsx)
    └── Settings (src/app/settings/page.tsx)
```

### Composants UI Réutilisables

#### Button (`src/components/ui/button.tsx`)
```typescript
interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  children: React.ReactNode
  className?: string
}
```

#### Input (`src/components/ui/input.tsx`)
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea'
  placeholder?: string
  value?: string | number
  onChange?: (value: string | number) => void
  disabled?: boolean
  label?: string
  error?: string
  className?: string
}
```

#### Card (`src/components/ui/card.tsx`)
```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  animate?: boolean
}
```

#### Badge (`src/components/ui/badge.tsx`)
```typescript
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}
```

## 🎣 Hooks Personnalisés

### useTasks (`src/lib/hooks/use-tasks.tsx`)
Gestion de l'état des tâches avec localStorage.

```typescript
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading tasks:', error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save to localStorage on change
  const saveTasks = (newTasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks))
    setTasks(newTasks)
  }

  return {
    tasks,
    isLoading,
    addTask: (task) => { /* ... */ },
    updateTask: (id, updates) => { /* ... */ },
    deleteTask: (id) => { /* ... */ },
    toggleTask: (id) => { /* ... */ },
  }
}
```

### useDarkMode (`src/lib/hooks/use-dark-mode.tsx`)
Gestion du thème (light/dark) avec localStorage.

```typescript
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light')

  // Load theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeMode
    if (stored) setTheme(stored)
  }, [])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  // Save to localStorage
  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>
    {children}
  </ThemeContext.Provider>
}
```

## 📝 Types TypeScript

### Structure de Données

```typescript
// Task - Entité principale
interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  tags: string[]
  dueDate: string | null
  createdAt: string
  completedAt: string | null
  order: number
}

// Enums
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
type TaskStatus = 'todo' | 'in-progress' | 'completed'
type TaskCategory = 'work' | 'personal' | 'shopping' | 'health' | 'finance' | 'other'
type ThemeMode = 'light' | 'dark' | 'system'

// Color Mappings
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-gray-400',
  medium: 'bg-blue-400',
  high: 'bg-orange-400',
  urgent: 'bg-red-500',
}

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  work: 'bg-blue-500',
  personal: 'bg-purple-500',
  shopping: 'bg-green-500',
  health: 'bg-red-500',
  finance: 'bg-yellow-500',
  other: 'bg-gray-500',
}
```

## 🎨 Design System

### Variables CSS

```css
:root {
  /* Primary Colors */
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-600) 100%);

  /* Background */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;

  /* Text */
  --text-primary: #111827;
  --text-secondary: #4b5563;
}
```

### Animations

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Utility Classes */
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-scale-in { animation: scaleIn 0.3s ease-out; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
```

## 🔄 State Management

### Pattern: Local Storage as Database

```typescript
// Single Source of Truth
const [tasks, setTasks] = useState<Task[]>([])

// Read - Load on mount
useEffect(() => {
  const stored = localStorage.getItem('tasks')
  if (stored) setTasks(JSON.parse(stored))
}, [])

// Create
const addTask = (task: Task) => {
  const newTask = { ...task, id: Date.now().toString() }
  setTasks(prev => {
    const updated = [...prev, newTask]
    localStorage.setItem('tasks', JSON.stringify(updated))
    return updated
  })
}

// Update
const updateTask = (id: string, updates: Partial<Task>) => {
  setTasks(prev => {
    const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t)
    localStorage.setItem('tasks', JSON.stringify(updated))
    return updated
  })
}

// Delete
const deleteTask = (id: string) => {
  setTasks(prev => {
    const updated = prev.filter(t => t.id !== id)
    localStorage.setItem('tasks', JSON.stringify(updated))
    return updated
  })
}
```

## 🚀 Performance Optimizations

### Code Splitting
- Next.js automatic code splitting
- Dynamic imports for heavy components
- Lazy loading for routes

### Caching
- Next.js built-in caching
- Browser localStorage for tasks
- Memoization with useMemo/useCallback (future)

### Bundle Size Optimization
- Tree shaking
- Compression (gzip, brotli)
- Image optimization with next/image

## 🧪 Testing Strategy (Future)

### Unit Tests
- Jest for components
- React Testing Library for user interactions
- TypeScript for type safety

### Integration Tests
- Playwright for E2E
- Testing Library for component integration

### Manual Testing Checklist
- [ ] Create task
- [ ] Edit task
- [ ] Delete task
- [ ] Toggle task completion
- [ ] Filter tasks
- [ ] Dark mode toggle
- [ ] Navigation between pages
- [ ] Responsive design

## 🔒 Sécurité

### XSS Prevention
- React automatic escaping
- No dangerouslySetInnerHTML
- Input validation

### Data Sanitization
- JSON.parse with try-catch
- Validate user input
- Sanitize HTML (future)

### Future Security
- CSRF protection
- Rate limiting
- Authentication
- Authorization

## 📊 Analytics & Monitoring (Future)

### Event Tracking
- User actions
- Feature usage
- Performance metrics

### Error Tracking
- Sentry integration
- Client-side errors
- API errors

## 🚦 Déploiement

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel deploy
```

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

### Docker (Future)
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Références

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Last Updated:** 2026-02-26
