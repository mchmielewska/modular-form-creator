import { useMemo, useState, type ReactNode } from 'react'
import { CompletedDraftsContext, type CompletedDraft } from './completedDrafts.model'

export function CompletedDraftsProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Record<number, CompletedDraft>>({})
  const value = useMemo(() => ({ drafts, setDrafts }), [drafts])
  return <CompletedDraftsContext.Provider value={value}>{children}</CompletedDraftsContext.Provider>
}
