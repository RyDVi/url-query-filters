import { useUrlQueryFilters } from "@url-query-filters/react-router-v5";
import { useState } from "react";

const users = [
  { id: 1, name: "Alice", age: 25, city: "Moscow" },
  { id: 2, name: "Bob", age: 30, city: "London" },
  { id: 3, name: "Charlie", age: 22, city: "Moscow" },
  { id: 4, name: "Diana", age: 11, city: "Berlin" },
];

type QueryFilters = { name: string; city: string; adult: string };

type UserFilters = { name: string; city: string; adult: boolean };

const defaultQuery: Required<QueryFilters> = {
  name: "",
  city: "",
  adult: "false",
};

export function QueryFiltersDemo() {
  const [filters, upsertFilters, setFilters] = useUrlQueryFilters<
    QueryFilters,
    UserFilters
  >({
    defaultQuery,
    fromQueryToFilters: (q) => ({
      name: q.name,
      city: q.city,
      adult: q.adult === "true",
    }),
    fromFiltersToQuery: (f) => ({ ...f, adult: String(!!f.adult) }),
  });
  
  const [name, setName] = useState(filters.name);
  const [city, setCity] = useState(filters.city);
  const [adult, setAdult] = useState(filters.adult);

  const filtered = users.filter((u) => {
    if (
      filters.name &&
      !u.name.toLowerCase().includes(filters.name.toLowerCase())
    )
      return false;
    if (filters.city && u.city !== filters.city) return false;
    if (filters.adult && u.age < 18) return false;
    return true;
  });

  return (
    <div style={{ padding: 24 }}>
      <h2>useUrlQueryFilters: user filtering with transformation</h2>
      <form
        style={{ marginBottom: 24 }}
        onSubmit={(e) => {
          e.preventDefault();
          upsertFilters({ name, city, adult });
        }}
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ marginRight: 8 }}
        >
          <option value="">All cities</option>
          <option value="Moscow">Moscow</option>
          <option value="London">London</option>
          <option value="Berlin">Berlin</option>
        </select>
        <label style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            checked={adult}
            onChange={(e) => setAdult(e.target.checked)}
          />
          Adults only
        </label>
        <button type="submit">Apply filters</button>
        <button
          type="button"
          style={{ marginLeft: 8 }}
          onClick={() => {
            setFilters({});
            setName("");
            setCity("");
            setAdult(false);
          }}
        >
          Reset
        </button>
      </form>
      <section style={{ marginBottom: 24 }}>
        <h3>Current filters:</h3>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </section>
      <section>
        <h3>Users:</h3>
        <ul>
          {filtered.map((u) => (
            <li key={u.id}>
              {u.name} — {u.age} years old, {u.city}
            </li>
          ))}
        </ul>
        {filtered.length === 0 && <div>No matches</div>}
      </section>
    </div>
  );
}
