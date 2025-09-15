import * as React from 'react'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="pt-20">
      {children}
    </div>
  )
}

export default Layout