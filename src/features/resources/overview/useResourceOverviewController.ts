import { useParams } from 'react-router-dom'
import { canOpenProjectDetails, canProvision } from '../resource.rules'
import { getErrorMessage } from '../resource.errors'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../resource.rules'
import { mergeCompletedDraft, useCompletedDrafts } from '../completed-drafts/completedDrafts.model'
import {
  useProvisionResource,
  useReplaceCompletedResource,
  useResource,
} from '../resources.queries'
import type { ResourceOverviewViewProps } from './resource-overview.view-model'

export const useResourceOverviewController = (): ResourceOverviewViewProps => {
  const { resourceId: rawResourceId } = useParams()
  const resourceId = Number(rawResourceId)
  const isValidResourceId = Number.isInteger(resourceId) && resourceId > 0
  const resourceQuery = useResource(resourceId)
  const provisionMutation = useProvisionResource()
  const replaceMutation = useReplaceCompletedResource()
  const completedDrafts = useCompletedDrafts()
  const bufferedDraft = completedDrafts.getDraft(resourceId)
  const resource = resourceQuery.data
    ? mergeCompletedDraft(resourceQuery.data, bufferedDraft)
    : undefined

  const provision = async () => {
    if (!resource || !canProvision(resource)) return
    provisionMutation.reset()
    try {
      await provisionMutation.mutateAsync(resource.resourceId)
    } catch {
      // Mutation state exposes the backend business error to the view.
    }
  }

  const submitChanges = async () => {
    if (!resource || resource.status !== 'completed' || !bufferedDraft) return
    try {
      await replaceMutation.mutateAsync({
        resourceId,
        data: {
          name: resource.name,
          basicInfo: resource.basicInfo,
          projectDetails: resource.projectDetails,
        },
      })
      completedDrafts.clearDraft(resourceId)
    } catch {
      // Mutation state exposes the backend business error to the view.
    }
  }

  if (!isValidResourceId) {
    return createErrorState('Resource id must be a positive number.')
  }

  if (!resource) {
    return {
      isLoading: resourceQuery.isPending,
      isError: resourceQuery.isError,
      errorMessage: resourceQuery.error
        ? getErrorMessage(resourceQuery.error)
        : 'Resource could not be loaded.',
      resource: null,
      isProvisioning: false,
      isSubmittingChanges: false,
      onProvision: () => undefined,
      onSubmitChanges: () => undefined,
      onDiscardChanges: () => undefined,
      onRetry: () => void resourceQuery.refetch(),
    }
  }

  const basicInfoComplete = isBasicInfoComplete(resource.basicInfo)
  const projectDetailsComplete = isProjectDetailsComplete(resource.projectDetails)
  const projectDetailsLocked = !canOpenProjectDetails(resource)
  const completedModules = [basicInfoComplete, projectDetailsComplete].filter(Boolean).length
  const provisionError = provisionMutation.error ?? replaceMutation.error

  return {
    isLoading: false,
    isError: Boolean(provisionError),
    errorMessage: provisionError ? getErrorMessage(provisionError) : '',
    resource: {
      resourceId: resource.resourceId,
      name: resource.name,
      statusLabel: resource.status === 'completed' ? 'Completed' : 'Draft',
      isCompleted: resource.status === 'completed',
      completedModules,
      detailsPath: `/resources/${resource.resourceId}/details`,
      canProvision: canProvision(resource),
      provisioningHint: getProvisioningHint(resource.status, completedModules),
      hasBufferedChanges: Boolean(bufferedDraft),
      modules: [
        {
          title: 'Basic Info',
          description: 'Resource ownership, contact details, priority, and description.',
          statusLabel: basicInfoComplete ? 'Complete' : 'Incomplete',
          isComplete: basicInfoComplete,
          isLocked: false,
          path: `/resources/${resource.resourceId}/basic-info`,
          actionLabel: basicInfoComplete ? 'Review Basic Info' : 'Complete Basic Info',
        },
        {
          title: 'Project Details',
          description: 'Project name, budget, category, and enabled options.',
          statusLabel: projectDetailsLocked
            ? 'Locked'
            : projectDetailsComplete
              ? 'Complete'
              : 'Incomplete',
          isComplete: projectDetailsComplete,
          isLocked: projectDetailsLocked,
          path: `/resources/${resource.resourceId}/project-details`,
          actionLabel: projectDetailsComplete
            ? 'Review Project Details'
            : 'Complete Project Details',
        },
      ],
    },
    isProvisioning: provisionMutation.isPending,
    isSubmittingChanges: replaceMutation.isPending,
    onProvision: () => void provision(),
    onSubmitChanges: () => void submitChanges(),
    onDiscardChanges: () => completedDrafts.clearDraft(resourceId),
    onRetry: () => void resourceQuery.refetch(),
  }
}

const getProvisioningHint = (status: 'draft' | 'completed', completedModules: number) => {
  if (status === 'completed') return 'This resource has already been provisioned.'
  if (completedModules === 2) return 'Both modules are complete. This resource is ready.'
  return `Complete ${2 - completedModules} remaining module${completedModules === 1 ? '' : 's'} to provision.`
}

const createErrorState = (errorMessage: string): ResourceOverviewViewProps => ({
  isLoading: false,
  isError: true,
  errorMessage,
  resource: null,
  isProvisioning: false,
  isSubmittingChanges: false,
  onProvision: () => undefined,
  onSubmitChanges: () => undefined,
  onDiscardChanges: () => undefined,
  onRetry: () => undefined,
})
