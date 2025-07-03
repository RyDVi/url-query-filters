import { useCallback, useMemo } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import {
  parseQuery,
  buildQuery,
  upsertQuery
} from "@url-query-filters/common";

// Get query parameters as string values, preserving keys and making all values optional strings
export function useUrlQuery<T>(): Record<keyof T, string | undefined> {
  const { search } = useLocation();
  return useMemo(() => parseQuery<T>(search), [search]);
}

// Задать query параметры
export function useSetUrlQuery<T>() {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    (queries: Partial<T>, replace?: boolean) => {
      navigate({ ...location, search: buildQuery(queries) }, { replace });
    },
    [navigate, location]
  );
}

// Upsert query параметры
export function useUpsertUrlQuery<T>() {
  const query = useUrlQuery<T>();
  const setQuery = useSetUrlQuery<T>();
  return useCallback(
    (queries: Partial<T>, replace?: boolean) =>
      setQuery(upsertQuery(query, queries), replace),
    [query, setQuery]
  );
}

export function useUrlQueryActions<T>() {
  const urlQuery = useUrlQuery<T>();
  const setUrlQuery = useSetUrlQuery<T>();
  const upsertUrlQuery = useUpsertUrlQuery<T>();

  return useMemo(
    () => ({
      urlQuery,
      upsertUrlQuery,
      setUrlQuery,
    }),
    [urlQuery, setUrlQuery, upsertUrlQuery]
  );
}
