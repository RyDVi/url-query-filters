
export type ObjectType = Record<string, any>;

export type Queries<T> = Record<keyof T, string | undefined>;

export type ChangeQueryFunction<T> = (
  queries: Partial<T>,
  replace?: boolean
) => void;

/** Парсит query строку в объект */
export function parseQuery<T>(search: string): Queries<T> {
  return Object.fromEntries(new URLSearchParams(search)) as Queries<T>;
}

/** Преобразует объект query в строку */
export function buildQuery(query: ObjectType): string {
  const filtered = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => [k, String(v)]);
  return new URLSearchParams(filtered).toString();
}

/** Обновляет существующий query объект */
export function upsertQuery<T>(prev: Queries<T>, next: Partial<T>): Partial<T> {
  return { ...prev, ...next } as Partial<T>;
}

/**
 * Преобразует объект query параметров в строковые значения.
 * @param  query - Объект с параметрами запроса.
 * @returns Возвращает объект с параметрами в виде строк.
 */
export function stringifyQuery(query: ObjectType): Record<string, string> {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, String(value)])
  );
}
