import { createContext, useContext } from 'react'
import type { BasicInfo, ProjectDetails, Resource } from '../resource.types'

export interface CompletedDraft {
  basicInfo?: BasicInfo
  projectDetails?: ProjectDetails
}

export interface CompletedDraftsValue {
  getDraft: (resourceId: number) => CompletedDraft | undefined
  bufferBasicInfo: (resourceId: number, data: BasicInfo) => void
  bufferProjectDetails: (resourceId: number, data: ProjectDetails) => void
  clearDraft: (resourceId: number) => void
}

export const CompletedDraftsContext = createContext<CompletedDraftsValue | null>(null)

export const useCompletedDrafts = () => {
  const context = useContext(CompletedDraftsContext)
  if (!context)
    throw new Error('useCompletedDrafts must be used within CompletedDraftsProvider')
  return context
}

export const mergeCompletedDraft = (
  resource: Resource,
  draft?: CompletedDraft,
): Resource => ({
  ...resource,
  basicInfo: draft?.basicInfo ?? resource.basicInfo,
  projectDetails: draft?.projectDetails ?? resource.projectDetails,
})
