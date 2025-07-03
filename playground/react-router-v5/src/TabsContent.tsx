import { useState } from "react";
import { useUrlQuery, useSetUrlQuery, useUpsertUrlQuery } from "@url-query-filters/react-router-v5";

// Static dataset
const users = [
  { id: 1, name: "Alice", age: 25, city: "Moscow" },
  { id: 2, name: "Bob", age: 30, city: "London" },
  { id: 3, name: "Charlie", age: 22, city: "Moscow" },
  { id: 4, name: "Diana", age: 28, city: "Berlin" },
];

type UserFilters = {
  name?: string;
  city?: string;
};

export function BasicDemo() {
  const query = useUrlQuery<UserFilters>();
  const setQuery = useSetUrlQuery<UserFilters>();
  const upsertQuery = useUpsertUrlQuery<UserFilters>();

  // Filtering data by query
  const filtered = users.filter((u) => {
    if (query.name && !u.name.toLowerCase().includes(query.name.toLowerCase()))
      return false;
    if (query.city && u.city !== query.city) return false;
    return true;
  });

  const [name, setName] = useState(query.name || "");
  const [city, setCity] = useState(query.city || "");

  return (
    <div>
      <h2>Demo: user filtering via query parameters</h2>
      <form
        style={{ marginBottom: 24 }}
        onSubmit={(e) => {
          e.preventDefault();
          upsertQuery({ name, city });
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
        <button type="submit">Apply filters</button>
        <button
          type="button"
          style={{ marginLeft: 8 }}
          onClick={() => {
            setQuery({});
            setName("");
            setCity("");
          }}
        >
          Reset
        </button>
      </form>
      <section style={{ marginBottom: 24 }}>
        <h3>Current query parameters:</h3>
        <pre>{JSON.stringify(query, null, 2)}</pre>
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
