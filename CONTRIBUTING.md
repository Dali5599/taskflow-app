# Contribution Guide - TaskFlow

Merci de votre intérêt à contribuer à TaskFlow ! 🦞

## 📋 Avant de Contribuer

### Checklist
- [ ] J'ai lu le README
- [ ] J'ai compris la structure du projet
- [ ] J'ai vérifié les issues ouvertes
- [ ] J'ai créé une nouvelle branche
- [ ] J'ai testé mes changements
- [ ] J'ai mis à jour la documentation

### Questions à se poser
- Est-ce que cette fonctionnalité est déjà dans la roadmap ?
- Est-ce que ce changement casse des fonctionnalités existantes ?
- Est-ce que j'ai ajouté des tests ?
- Est-ce que j'ai documenté le code ?

## 🚀 Comment Commencer

### 1. Forker le Projet
```bash
# Forker le repository sur GitHub
# Cloner votre fork
git clone https://github.com/VOTRE_USERNAME/taskflow-app.git
cd taskflow-app
```

### 2. Installer les Dépendances
```bash
npm install
```

### 3. Lancer en Développement
```bash
npm run dev
```

### 4. Créer une Branche
```bash
git checkout -b feature/votre-fonctionnalite
# ou
git checkout -b fix/votre-bugfix
```

## 📝 Conventions de Code

### Naming
- **Components:** PascalCase (ex: TaskList, TaskItem)
- **Functions:** camelCase (ex: addTask, deleteTask)
- **Constants:** UPPER_SNAKE_CASE (ex: PRIORITY_COLORS)
- **Files:** kebab-case (ex: task-list.tsx, task-item.tsx)

### Structure des Composants
```tsx
// Imports
import { useState } from 'react'
import { Task } from '@/lib/types'

// Types
interface ComponentProps {
  // ...
}

// Main Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  const [state, setState] = useState(null)

  // Handlers
  const handleClick = () => { /* ... */ }

  // Effects
  useEffect(() => { /* ... */ }, [])

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// Default Export (if needed)
export default Component
```

### TypeScript Best Practices
```typescript
// ✅ Good
interface TaskProps {
  task: Task
  onUpdate: (id: string) => void
}

export function Task({ task, onUpdate }: TaskProps) {
  // ...
}

// ❌ Bad
export function Task(props: any) {
  // ...
}
```

## 🎨 Style Guide

### Code Style
- Utiliser Prettier pour le formatage
- Indentation: 2 espaces
- Quotes: Single quotes
- Trailing commas: Oui
- Semicolons: Oui

### Configuration Prettier (futur)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### Tailwind CSS
- Utiliser des classes utilitaires plutôt que CSS personnalisé
- Organiser les classes dans un ordre logique:
  1. Layout (flex, grid)
  2. Spacing (p, m, gap)
  3. Typography (text, font)
  4. Colors (bg, text, border)
  5. States (hover, active, focus)

```tsx
// ✅ Good
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-100 transition-all">
  {/* ... */}
</div>

// ❌ Bad
<div className="p-4 flex bg-white hover:bg-gray-100 transition-all justify-between items-center">
  {/* ... */}
</div>
```

## 🧪 Tests

### Structure des Tests
```typescript
// example.test.tsx
import { render, screen } from '@testing-library/react'
import { Component } from './component'

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle click', () => {
    const handleClick = jest.fn()
    render(<Component onClick={handleClick} />)
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Tests à Écrire
- Tests unitaires pour chaque composant
- Tests d'intégration pour les flux
- Tests E2E pour les scénarios critiques

## 📚 Documentation

### Ajouter des Commentaires
```typescript
/**
 * Task Component
 *
 * @description Displays a single task with editing capabilities
 * @param task - The task object to display
 * @param onUpdate - Callback when task is updated
 * @param onDelete - Callback when task is deleted
 *
 * @example
 * <Task
 *   task={task}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 * />
 */
export function Task({ task, onUpdate, onDelete }: TaskProps) {
  // ...
}
```

### Mettre à jour la Documentation
- README.md pour les changements majeurs
- TECHNICAL.md pour les changements d'architecture
- CONTRIBUTING.md pour les changements de workflow

## 🐛 Rapport de Bugs

### Template d'Issue
```markdown
## Description
[Brief description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Screenshots
[If applicable, add screenshots]

## Environment
- OS: [e.g. Ubuntu 22.04]
- Browser: [e.g. Chrome 120]
- Node.js Version: [e.g. v24.13.1]
- Next.js Version: [e.g. 15.5.12]

## Additional Context
[Any other context about the problem]
```

## 💡 Suggestions de Fonctionnalités

### Template d'Issue
```markdown
## Description
[Brief description of the feature]

## Problem Statement
[What problem does this feature solve?]

## Proposed Solution
[Detailed description of the solution]

## Alternatives Considered
[What other approaches did you consider?]

## Additional Context
[Any other context, mockups, or examples]
```

## 📤 Soumettre une PR

### Checklist avant soumission
- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Descriptive commit messages

### Template de PR
```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
[Describe the tests you ran to verify your changes]

## Screenshots (if applicable)
[Add screenshots to help explain your changes]

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### Titres de Commit
```
feat: add drag and drop functionality
fix: resolve task loading issue
docs: update contributing guide
style: format code with prettier
refactor: simplify useTasks hook
test: add unit tests for TaskItem
chore: update dependencies
```

## 🎯 Priorités de Développement

### High Priority
- [ ] Bug fixes
- [ ] Critical features
- [ ] Security issues

### Medium Priority
- [ ] New features
- [ ] Performance improvements
- [ ] User experience enhancements

### Low Priority
- [ ] Documentation
- [ ] Code refactoring
- [ ] Nice-to-have features

## 🤝 Communication

### Channels
- **GitHub Issues:** Pour les bugs et features
- **Pull Requests:** Pour les changements de code
- **Discussions:** Pour les questions générales

### Guidelines
- Soyez respectueux et constructif
- Donnez du feedback utile
- Reconnaissez le travail des autres
- Acceptez les critiques avec grâce

## 📚 Ressources Utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Git Documentation](https://git-scm.com/doc)

## 🙏 Remerciements

Merci de contribuer à TaskFlow ! Chaque contribution aide à améliorer le projet. 🦞

---

**Questions ?** Ouvrez une issue ou contactez @Requin20
