# url-query-filters

A lightweight library for working with URL query parameters as objects or filters in react-router applications.

## Hooks Overview

- `useUrlQuery<T>()`: Reads and parses the current query string as a typed object.
- `useSetUrlQuery<T>()`: Replaces the entire query string with a new object.
- `useUpsertUrlQuery<T>()`: Updates only the specified parameters in the query string, preserving the rest.
- `useUrlQueryFilters<Query, Filters>()`: Returns a tuple `[filters, upsertFilters, setFilters]`, where `filters` is the filters object, `upsertFilters` updates part of the filters, and `setFilters` replaces all filters. Supports transformation between query string and filters via `fromQueryToFilters` and `fromFiltersToQuery`.

## Example: useUrlQuery, useSetUrlQuery, useUpsertUrlQuery

```tsx
import { useUrlQuery, useSetUrlQuery, useUpsertUrlQuery } from '@url-query-filters/react-router-v7';

type Query = {
  search: string;
  page: string;
};

function SearchPage() {
  // Get query parameters as an object
  const query = useUrlQuery<Query>();
  // Function to fully replace query parameters
  const setQuery = useSetUrlQuery<Query>();
  // Function to update only part of the query parameters
  const upsertQuery = useUpsertUrlQuery<Query>();

  // Go to another page:
  const goToPage = (page: number) => {
    upsertQuery({ page });
  };

  // Reset search filter:
  const resetSearch = () => {
    setQuery({ search: '', page: '1' });
  };

  return (
    <div>
      <input
        value={query.search || ''}
        onChange={e => upsertQuery({ search: e.target.value })}
        placeholder="Search..."
      />
      <button onClick={resetSearch}>Reset</button>
      <button onClick={() => goToPage(Number(query.page || 1) + 1)}>Next page</button>
      <div>Current page: {query.page}</div>
    </div>
  );
}
```

## Example: useUrlQueryFilters

```tsx
import { useUrlQueryFilters } from '@url-query-filters/react-router-v7';

// Types before and after transformation:
// Query string type (all values are strings):
type QueryFilters = {
  name: string;   // "Alice"
  city: string;   // "Moscow"
  age: string;    // "25"
  active: string; // "true" or "false"
};
// Filters type in the app (e.g. for a form):
type UserFilters = {
  name: string;   // "Alice"
  city: string;   // "Moscow"
  age: number;    // 25
  active: boolean; // true or false
};

function UsersPage() {
  // Get typed filters from the query string, as well as functions to update and reset filters.
  const [filters, upsertFilters, setFilters] = useUrlQueryFilters<QueryFilters, UserFilters>({
    // Default values for query parameters. Missing parameters will be replaced with values from defaultQuery.
    defaultQuery: {
      name: "",      // name search string
      city: "",      // selected city
      age: "",       // age (as string)
      active: "false" // is user active (string 'true' or 'false')
    },
    // transform string parameters to filters object
    fromQueryToFilters: (q) => ({
      ...q,
      age: Number(q.age) || 0, // string to number
      active: q.active === "true", // string to boolean
    }),
    fromFiltersToQuery: (f) => ({ ...f, age: String(f.age), active: String(!!f.active) }), // reverse transformation
  });
  // filters — current filter values, synchronized with the query string
  // upsertFilters — updates only specified filters, preserves the rest
  // setFilters — fully replaces all filters
  // ...
}
```

## Packages

- [@url-query-filters/common](https://www.npmjs.com/package/@url-query-filters/common): Core utilities for parsing, building, and manipulating query objects.
- [@url-query-filters/react-router-v7](https://www.npmjs.com/package/@url-query-filters/react-router-v7): React hooks for working with query parameters in React Router v7 projects.
- [@url-query-filters/react-router-v5](https://www.npmjs.com/package/@url-query-filters/react-router-v5): React hooks for React Router v5.

## Playground

You can find more usage examples in the `playground` directory of the repository.

## License

MIT
