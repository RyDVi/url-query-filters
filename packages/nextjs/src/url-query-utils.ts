// nextjs-query.ts
import { useRouter } from "next/router";
import { useMemo, useCallback } from "react";
import { parseQuery, buildQuery, upsertQuery, ObjectType, Queries } from "@url-query-filters/common";

export function useUrlQuery<T extends ObjectType>(): Queries<T> {
  const router = useRouter();
  return useMemo(() => parseQuery<T>(router.asPath.split(/\?/)[1] || ""), [router.asPath]);
}

export function useSetUrlQuery<T extends ObjectType>() {
  const router = useRouter();
  return useCallback(
    (queries: Partial<T>, replace?: boolean) => {
      const queryString = buildQuery(queries);
      const url = `${router.pathname}${queryString ? `?${queryString}` : ""}`;
      if (replace) {
        router.replace(url, undefined, { shallow: true });
      } else {
        router.push(url, undefined, { shallow: true });
      }
    },
    [router]
  );
}

export function useUpsertUrlQuery<T extends ObjectType>() {
  const query = useUrlQuery<T>();
  const setQuery = useSetUrlQuery<T>();
  return useCallback(
    (queries: Partial<T>, replace?: boolean) =>
      setQuery(upsertQuery(query, queries), replace),
    [query, setQuery]
  );
}
