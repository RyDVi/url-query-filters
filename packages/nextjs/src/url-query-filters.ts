import { useCallback, useMemo, useRef } from "react";
import { Queries, deepFreeze } from "@url-query-filters/common";
import { useUrlQuery, useUpsertUrlQuery, useSetUrlQuery } from "./url-query-utils";

// Generic type for query processor
export type UrlQueryProcessor<FromFilters extends Record<string, any>, ToQuery> = (queries: Partial<FromFilters>) => Partial<ToQuery>;

export interface UseUrlQueryFiltersType<T extends Record<string, any>, ProcessedResult extends T = T> {
  defaultQuery: Required<Queries<T>>;
  fromQueryToFilters?: (queries: Required<Queries<T>>) => ProcessedResult;
  fromFiltersToQuery?: UrlQueryProcessor<ProcessedResult, T>;
  replace?: boolean;
}

export function useUrlQueryFilters<
  T extends Record<string, any>,
  ProcessedResult extends Record<keyof T, any> = T
>({
  defaultQuery,
  fromQueryToFilters,
  fromFiltersToQuery,
  replace,
}: UseUrlQueryFiltersType<T, ProcessedResult>) {
  const defaultQueryRef = useRef<Queries<T>>(defaultQuery || ({} as Queries<T>));
  const processQueryRef = useRef<(queries: Required<Queries<T>>) => ProcessedResult>(
    fromQueryToFilters || ((queries) => queries as ProcessedResult)
  );
  const processChangeUrlQueryRef = useRef<UrlQueryProcessor<ProcessedResult, T>>(
    fromFiltersToQuery || ((queries) => queries)
  );

  const urlQuery = useUrlQuery();
  const upsertUrlQuery = useUpsertUrlQuery();
  const setUrlQuery = useSetUrlQuery();

  const overridedQueries: ProcessedResult = useMemo(() => {
    const query = processQueryRef.current({
      ...urlQuery,
      ...Object.fromEntries(
        Object.entries(defaultQueryRef.current).map(([key, value]) => [key, urlQuery[key] || value])
      ),
    } as Required<Queries<T>>);
    return deepFreeze(query);
  }, [urlQuery]);

  const customProcessQuery = useCallback(
    (urlQueryAction: (queries: Partial<T>, replace?: boolean) => void) =>
      (query: Partial<ProcessedResult>) =>
        urlQueryAction(processChangeUrlQueryRef.current(query), replace),
    [replace]
  );
  const processedUpsertUrlQuery = useMemo(
    () => customProcessQuery(upsertUrlQuery),
    [customProcessQuery, upsertUrlQuery]
  );
  const processedSetUrlQuery = useMemo(
    () => customProcessQuery(setUrlQuery),
    [customProcessQuery, setUrlQuery]
  );

  return [
    overridedQueries,
    processedUpsertUrlQuery,
    processedSetUrlQuery,
  ] as const;
}
