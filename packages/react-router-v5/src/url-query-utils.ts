// react-router-v5-query.ts
import { useCallback, useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  parseQuery,
  buildQuery,
  upsertQuery,
  ObjectType,
  Queries,
} from "@url-query-filters/common";

export function useUrlQuery<T extends ObjectType>(): Queries<T> {
  const { search } = useLocation();
  return useMemo(() => parseQuery<T>(search), [search]);
}

export function useSetUrlQuery<T extends ObjectType>() {
  const history = useHistory();
  const location = useLocation();
  return useCallback(
    (queries: Partial<T>, replace?: boolean) => {
      const search = buildQuery(queries);
      if (replace) {
        history.replace({ ...location, search });
      } else {
        history.push({ ...location, search });
      }
    },
    [history, location]
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

