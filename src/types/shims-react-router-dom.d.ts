declare module 'react-router-dom' {
  import type { FC, ReactNode } from 'react'
  export const BrowserRouter: FC<{ children?: ReactNode }>
  export const Routes: FC<{ children?: ReactNode }>
  export const Route: FC<{ path?: string; element?: ReactNode }>
  export const Link: FC<{ to: string; className?: string; children?: ReactNode }>
  export const NavLink: FC<{ to: string; className?: string; children?: ReactNode }>
  export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T
}
