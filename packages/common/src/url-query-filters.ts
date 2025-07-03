// Framework-agnostic logic for url query filters
import { deepFreeze } from "./object";
import { ObjectType, Queries } from "./url-query-utils";

export type UrlQueryProcessor<
  
  FromFilters extends Record<string, any>,
  ToQuery,
> = (queries: Partial<FromFilters>) => Partial<ToQuery>;

export interface UseUrlQueryFiltersConfig<
  
  T extends Record<string, any>,
  ProcessedResult extends T = T,
> {
  /**
   * Значения по умолчанию. Если какое-либо значение будет отсутствовать в query, оно заполнится отсюда.
   */
  defaultQuery: Required<Queries<T>>;
  /**
   * Обработка query параметров (например, string -> boolean)
   */
  fromQueryToFilters?: (queries: Required<Queries<T>>) => ProcessedResult;
  /**
   * Обработка данных перед отдачей их в query параметры урла
   */
  fromFiltersToQuery?: UrlQueryProcessor<ProcessedResult, T>;
}


export function getProcessedQuery<T extends Record<string, any>, ProcessedResult extends Record<keyof T, any> = T>(
  urlQuery: Queries<T>,
  config: UseUrlQueryFiltersConfig<T, ProcessedResult>
): ProcessedResult {
  const { defaultQuery, fromQueryToFilters } = config;
  const merged = {
    ...urlQuery,
    ...Object.fromEntries(
      Object.entries(defaultQuery).map(([key, value]) => [key, urlQuery[key] || value])
    ),
  } as Required<Queries<T>>;
  const processed = fromQueryToFilters ? fromQueryToFilters(merged) : (merged as ProcessedResult);
  return deepFreeze(processed);
}


export function mapFiltersToQuery<T extends ObjectType, ProcessedResult extends Record<keyof T, any> = T>(
  filters: Partial<ProcessedResult>,
  config: UseUrlQueryFiltersConfig<T, ProcessedResult>
): Partial<T> {
  const { fromFiltersToQuery } = config;
  return fromFiltersToQuery ? fromFiltersToQuery(filters) : (filters as Partial<T>);
}
