# React Server Components: The New Paradigm for Full-Stack React

_November 3, 2024_

React Server Components (RSC) represent the biggest shift in React since hooks.
They fundamentally change how we think about data fetching and component
composition.

## Understanding Server Components

```jsx
// This component runs on the server
async function ProductList() {
  // Direct database access - no API needed!
  const products = await db.query("SELECT * FROM products");

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// This component includes client interactivity
"use client";
function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => setLiked(!liked)}>
        {liked ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
```

## Key Benefits

1. **Zero client-side data fetching code**: Fetch data where you need it
2. **Automatic code splitting**: Only ship JavaScript that needs interactivity
3. **Improved performance**: Smaller bundles, faster initial loads

## Patterns and Best Practices

### Composition Pattern

```jsx
// Server Component (container)
async function Dashboard() {
  const data = await fetchDashboardData();

  return (
    <DashboardLayout>
      <DashboardMetrics data={data.metrics} />
      <InteractiveChart initialData={data.chartData} />
    </DashboardLayout>
  );
}

// Client Component (interactive parts)
"use client";
function InteractiveChart({ initialData }) {
  // Handle user interactions
}
```

### Data Flow

- Server Components can import Client Components
- Client Components cannot import Server Components (except as children)
- Props flow from Server to Client Components

## Challenges

- **Mental model shift**: Thinking in server/client boundaries
- **Tooling maturity**: Ecosystem still catching up
- **Caching complexity**: New caching patterns to learn

React Server Components are not just an optimization—they're a new way to build
React applications.
