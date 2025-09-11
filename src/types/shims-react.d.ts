declare module 'react' {
  export type ReactNode = any
  export type FC<P = any> = (props: P & { children?: ReactNode }) => any
  export function useEffect(effect: (...args: any[]) => any, deps?: any[]): void
  export function useRef<T = any>(initial?: T | null): { current: T | null }
  export function useState<T = any>(initial: T): [T, (v: T) => void]
  const React: any
  export default React
}
