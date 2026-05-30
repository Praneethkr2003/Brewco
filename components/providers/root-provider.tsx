'use client'

import { ReactNode } from 'react'

export default function RootProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
