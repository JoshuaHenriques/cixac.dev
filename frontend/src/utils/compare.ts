export function compare<T>(prevProps: T, nextProps: T): boolean {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}
