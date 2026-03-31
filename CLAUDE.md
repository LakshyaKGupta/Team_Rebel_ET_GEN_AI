# CLAUDE.md - UI/UX Design Guidelines

## Design Philosophy

Build premium, professional UIs with smooth animations that make the app feel polished and modern.

## Animation Guidelines (Framer Motion)

### General Principles
- Use subtle, purposeful animations — avoid excessive motion
- Keep animations fast (200-500ms for most transitions)
- Use easing curves: `easeOut` for entrances, `easeIn` for exits
- Animate opacity and scale together for natural feel

### Common Patterns

#### Page Transitions
```tsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
```

#### Hover Effects
```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>
```

#### Scroll Animations
```tsx
import { useInView } from 'framer-motion';

const Section = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  );
};
```

#### Staggered Lists
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={containerVariants} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li variants={itemVariants} key={item.id}>
  ))}
</motion.ul>
```

### Component Guidelines

#### Buttons
- Subtle scale on hover (1.02x)
- Press feedback on tap (0.98x)
- 150-200ms transitions

#### Cards
- Gentle shadow elevation on hover
- Subtle lift animation (y: -4px)
- Border color transitions if applicable

#### Loading States
- Skeleton screens with shimmer effect
- Smooth fade transitions between states

#### Page Load
- Staggered entrance for lists and grids
- Hero elements animate first, then supporting content

## Tailwind CSS Conventions

- Use semantic color names from design tokens
- Maintain consistent spacing scale
- Use `clsx` and `tailwind-merge` for conditional classes

## Icon Usage

- Use Lucide React icons consistently
- Standard sizes: 16px (sm), 20px (default), 24px (lg), 32px (xl)

## Accessibility

- Respect `prefers-reduced-motion` media query
- Ensure animation doesn't convey information alone
- Maintain focus visible states
