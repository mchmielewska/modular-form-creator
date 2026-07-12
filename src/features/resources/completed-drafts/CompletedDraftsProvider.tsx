import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { BasicInfo, ProjectDetails } from '../resource.types'
import { CompletedDraftsContext, type CompletedDraft } from './completedDrafts.model'

const CompletedDraftsProvider = ({ children }: { children: ReactNode }) => {
  const [drafts, setDrafts] = useState<Record<number, CompletedDraft>>({})

  const getDraft = useCallback((resourceId: number) => drafts[resourceId], [drafts])

  const bufferBasicInfo = useCallback((resourceId: number, data: BasicInfo) => {
    setDrafts((current) => ({
      ...current,
      [resourceId]: { ...current[resourceId], basicInfo: data },
    }))
  }, [])

  const bufferProjectDetails = useCallback((resourceId: number, data: ProjectDetails) => {
    setDrafts((current) => ({
      ...current,
      [resourceId]: { ...current[resourceId], projectDetails: data },
    }))
  }, [])

  const clearDraft = useCallback((resourceId: number) => {
    setDrafts((current) => {
      const next = { ...current }
      delete next[resourceId]
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ getDraft, bufferBasicInfo, bufferProjectDetails, clearDraft }),
    [bufferBasicInfo, bufferProjectDetails, clearDraft, getDraft],
  )

  return (
    <CompletedDraftsContext.Provider value={value}>
      {children}
    </CompletedDraftsContext.Provider>
  )
}

export default CompletedDraftsProvider
