# Caden Tile Design System

A modern, accessible, and customizable design system built with React, TypeScript, and Tailwind CSS.

## 🎨 Design System Showcase

Visit `/design-system` to see all components in action. This page is not SEO crawlable.

## 📦 Components

### UI Components

All UI components are located in `app/components/ui/` and can be imported from the barrel file:

```tsx
import { Button, Input, Text, Card, Badge, Avatar, Dropdown } from '@/components/ui';
```

#### Button

```tsx
import { Button } from '@/components/ui';

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button isLoading>Loading</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>

// With icons
<Button>
  <FiPlus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

#### Input

```tsx
import { Input } from '@/components/ui';
import { FiSearch, FiMail, FiEye, FiX } from 'react-icons/fi';

// Basic usage
<Input label="Username" placeholder="Enter username" />

// With helper text
<Input 
  label="Email" 
  placeholder="Enter email"
  helperText="We'll never share your email"
/>

// With error
<Input 
  label="Password" 
  type="password"
  error="Password is required"
/>

// With icons
<Input 
  label="Search"
  placeholder="Search..."
  leftIcon={<FiSearch className="h-5 w-5 text-neutral-400" />}
/>

<Input 
  label="Password"
  type="password"
  rightIcon={<FiEye className="h-5 w-5 text-neutral-400" />}
  onRightIconClick={() => {/* handle click */}}
/>

// With both icons
<Input 
  label="Search with clear"
  placeholder="Type to search..."
  leftIcon={<FiSearch className="h-5 w-5 text-neutral-400" />}
  rightIcon={<FiX className="h-5 w-5 text-neutral-400" />}
  onRightIconClick={() => {/* handle clear */}}
/>
```

#### Text

```tsx
import { Text } from '@/components/ui';

// Variants
<Text variant="h1">Heading 1</Text>
<Text variant="h2">Heading 2</Text>
<Text variant="h3">Heading 3</Text>
<Text variant="body">Body text</Text>
<Text variant="small">Small text</Text>

// Sizes
<Text size="xs">Extra Small</Text>
<Text size="sm">Small</Text>
<Text size="md">Medium</Text>
<Text size="lg">Large</Text>
<Text size="xl">Extra Large</Text>

// Weights
<Text weight="normal">Normal</Text>
<Text weight="medium">Medium</Text>
<Text weight="semibold">Semibold</Text>
<Text weight="bold">Bold</Text>

// Colors
<Text color="primary">Primary</Text>
<Text color="success">Success</Text>
<Text color="danger">Danger</Text>
<Text color="warning">Warning</Text>
<Text color="info">Info</Text>
```

#### Badge

```tsx
import { Badge } from '@/components/ui';
import { FiBell, FiCheck } from 'react-icons/fi';

// Variants
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With icons
<Badge>
  <FiBell className="mr-1 h-4 w-4" />
  Notifications
</Badge>
```

#### Avatar

```tsx
import { Avatar } from '@/components/ui';

// Sizes
<Avatar size="xs" fallback="JD" />
<Avatar size="sm" fallback="JD" />
<Avatar size="md" fallback="JD" />
<Avatar size="lg" fallback="JD" />
<Avatar size="xl" fallback="JD" />

// With fallback text
<Avatar fallback="John Doe" />
```

#### Card

```tsx
import { Card } from '@/components/ui';

// Variants
<Card variant="elevated" padding="lg">
  <h3>Elevated Card</h3>
  <Text variant="body">With shadow</Text>
</Card>

<Card variant="outlined" padding="lg">
  <h3>Outlined Card</h3>
  <Text variant="body">With border</Text>
</Card>

<Card variant="filled" padding="lg">
  <h3>Filled Card</h3>
  <Text variant="body">With background</Text>
</Card>
```

#### Dropdown

```tsx
import { Dropdown } from '@/components/ui';

// Basic usage
<Dropdown
  trigger={<Button>Open Menu</Button>}
  items={[
    { label: 'Profile', onClick: () => {} },
    { label: 'Settings', onClick: () => {} },
    { label: 'Logout', onClick: () => {} },
  ]}
/>

// With icons
<Dropdown
  trigger={<Button>Actions</Button>}
  items={[
    { label: 'Edit', icon: <FiEdit />, onClick: () => {} },
    { label: 'Delete', icon: <FiTrash />, onClick: () => {} },
  ]}
/>
```

### Layout Components

Layout components are located in `app/components/layout/` and can be imported from the barrel file:

```tsx
import { Layout, NavBar, Footer, CartSlider, Grid, Container, Pagination } from '@/components/layout';
```

#### Layout

The main layout component that wraps the entire application:

```tsx
import { Layout } from '@/components/layout';

export default function RootLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}
```

#### NavBar

The main navigation bar component:

```tsx
import { NavBar } from '@/components/layout';

// Basic usage
<NavBar />

// With custom items
<NavBar
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
  ]}
/>
```

#### Footer

The main footer component:

```tsx
import { Footer } from '@/components/layout';

// Basic usage
<Footer />
```

#### CartSlider

A slide-out cart component:

```tsx
import { CartSlider } from '@/components/layout';

// Basic usage
<CartSlider
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  items={cartItems}
/>
```

#### Grid

A responsive grid component:

```tsx
import { Grid } from '@/components/layout';

// Basic usage
<Grid cols={3} gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// Responsive
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

#### Container

A centered container component:

```tsx
import { Container } from '@/components/layout';

// Basic usage
<Container>
  <div>Content</div>
</Container>

// With max width
<Container maxWidth="lg">
  <div>Content</div>
</Container>
```

#### Pagination

A pagination component:

```tsx
import { Pagination } from '@/components/layout';

// Basic usage
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => {}}
/>

// With custom items per page
<Pagination
  currentPage={1}
  totalPages={10}
  itemsPerPage={20}
  onPageChange={(page) => {}}
/>
```

## 🎯 Design Tokens

The design system uses Tailwind CSS for styling. Key design tokens are defined in `tailwind.config.ts`:

- Colors: primary, secondary, success, danger, warning, info
- Spacing: xs, sm, md, lg, xl
- Typography: font sizes, weights, line heights
- Border radius
- Shadows

## 🎨 Icons

The design system uses `react-icons/fi` (Feather Icons). Import icons directly:

```tsx
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
```

## 🚀 Getting Started

1. Install pnpm if you haven't already:

```bash
# Using npm
npm install -g pnpm

# Using curl (for Unix-based systems)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Using PowerShell (for Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Visit `http://localhost:3000/design-system` to see the components in action.

## 📦 Package Manager

This project requires pnpm as the package manager. Using other package managers (npm, yarn, bun) is not supported and may lead to unexpected issues.

Benefits of pnpm:
- Faster installation times
- Disk space efficient
- Strict dependency management
- Better monorepo support
- Consistent dependency resolution

## 📝 Best Practices

1. Always use the provided components instead of raw HTML elements
2. Use the Text component for typography to maintain consistency
3. Follow the color system defined in the design tokens
4. Use icons from the Feather Icons set
5. Maintain proper spacing using the defined spacing scale
6. Ensure all interactive elements are accessible

## 🔧 Customization

Components can be customized using Tailwind classes:

```tsx
<Button className="bg-custom-color hover:bg-custom-color-dark">
  Custom Button
</Button>
```

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Icons Documentation](https://react-icons.github.io/react-icons/)
- [Feather Icons](https://feathericons.com/)
