import type { BasicInfo, ProjectDetails, Resource } from './resource.types'

const hasText = (value: string) => value.trim().length > 0

export const isBasicInfoComplete = (basicInfo: BasicInfo) =>
  hasText(basicInfo.resourceName) &&
  hasText(basicInfo.owner) &&
  hasText(basicInfo.email) &&
  hasText(basicInfo.description) &&
  hasText(basicInfo.priority)

export const isProjectDetailsComplete = (projectDetails: ProjectDetails) =>
  hasText(projectDetails.projectName) &&
  hasText(projectDetails.budget) &&
  hasText(projectDetails.category) &&
  projectDetails.options.length > 0

export const canOpenProjectDetails = (resource: Resource) =>
  resource.status === 'completed' || isBasicInfoComplete(resource.basicInfo)

export const canProvision = (resource: Resource) =>
  resource.status === 'draft' &&
  isBasicInfoComplete(resource.basicInfo) &&
  isProjectDetailsComplete(resource.projectDetails)
