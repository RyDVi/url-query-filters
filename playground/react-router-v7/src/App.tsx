import { Link } from "react-router-dom";
import { QueryFiltersDemo } from "./QueryFiltersDemo";
import { BasicDemo } from "./TabsContent";
import { useUrlQuery } from "@url-query-filters/react-router-v7";

export default function App() {
  const urlQuery = useUrlQuery<{ tab: "basic" | "filters" }>();
  
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <nav style={{ marginBottom: 24 }}>
        <Link
          to={{ search: "?tab=basic" }}
          style={{
            marginRight: 16,
            fontWeight: urlQuery.tab === "basic" ? "bold" : undefined,
          }}
        >
          Basic filtering
        </Link>
        <Link
          to={{ search: "?tab=filters" }}
          style={{
            fontWeight: urlQuery.tab === "filters" ? "bold" : undefined,
          }}
        >
          useUrlQueryFilters demo
        </Link>
      </nav>
      {urlQuery.tab === "basic" && <BasicDemo />}
      {urlQuery.tab === "filters" && <QueryFiltersDemo />}
    </div>
  );
}
