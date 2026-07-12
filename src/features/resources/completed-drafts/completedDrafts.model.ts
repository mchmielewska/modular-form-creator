import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { BasicInfo, ProjectDetails, Resource } from '../resource.types'

export interface CompletedDraft {
  basicInfo?: BasicInfo
  projectDetails?: ProjectDetails
}

export interface CompletedDraftsValue {
  drafts: Record<number, CompletedDraft>
  setDrafts: Dispatch<SetStateAction<Record<number, CompletedDraft>>>
}

export const CompletedDraftsContext = createContext<CompletedDraftsValue | null>(null)

export const useCompletedDrafts = () => {
  const context = useContext(CompletedDraftsContext)
  if (!context) throw new Error('useCompletedDrafts must be used within CompletedDraftsProvider')
  return {
    getDraft: (resourceId: number) => context.drafts[resourceId],
    bufferBasicInfo: (resourceId: number, data: BasicInfo) => context.setDrafts((current) => ({ ...current, [resourceId]: { ...current[resourceId], basicInfo: data } })),
    bufferProjectDetails: (resourceId: number, data: ProjectDetails) => context.setDrafts((current) => ({ ...current, [resourceId]: { ...current[resourceId], projectDetails: data } })),
    clearDraft: (resourceId: number) => context.setDrafts((current) => { const next = { ...current }; delete next[resourceId]; return next }),
  }
}

export const mergeCompletedDraft = (resource: Resource, draft?: CompletedDraft): Resource => ({
  ...resource,
  basicInfo: draft?.basicInfo ?? resource.basicInfo,
  projectDetails: draft?.projectDetails ?? resource.projectDetails,
})
