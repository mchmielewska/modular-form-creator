import { useParams } from 'react-router-dom'
import { mergeCompletedDraft, useCompletedDrafts } from '../completed-drafts/completedDrafts.model'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../resource.rules'
import { useResource } from '../resources.queries'
import type { ResourceDetailsViewProps } from './resource-details.view-model'

export const useResourceDetailsController = (): ResourceDetailsViewProps => {
  const resourceId = Number(useParams().resourceId)
  const query = useResource(resourceId)
  const drafts = useCompletedDrafts()
  const draft = drafts.getDraft(resourceId)
  const resource = query.data ? mergeCompletedDraft(query.data, draft) : undefined

  if (!resource) {
    return {
      isLoading: query.isPending,
      isError: query.isError,
      errorMessage: query.error instanceof Error ? query.error.message : 'Resource could not be loaded.',
      resource: null,
      onRetry: () => void query.refetch(),
    }
  }

  const completedModules = [
    isBasicInfoComplete(resource.basicInfo),
    isProjectDetailsComplete(resource.projectDetails),
  ].filter(Boolean).length

  return {
    isLoading: false,
    isError: false,
    errorMessage: '',
    resource: {
      resourceId: resource.resourceId,
      name: resource.name,
      statusLabel: resource.status === 'completed' ? 'Completed' : 'Draft',
      statusVariant: resource.status === 'completed' ? 'success' : 'warning',
      completedModules,
      hasBufferedChanges: Boolean(draft),
      overviewPath: `/resources/${resource.resourceId}`,
      groups: [
        {
          title: 'Basic Info',
          fields: [
            { label: 'Resource name', value: resource.basicInfo.resourceName || '—' },
            { label: 'Owner', value: resource.basicInfo.owner || '—' },
            { label: 'Email', value: resource.basicInfo.email || '—' },
            { label: 'Description', value: resource.basicInfo.description || '—' },
            { label: 'Priority', value: resource.basicInfo.priority || '—' },
          ],
        },
        {
          title: 'Project Details',
          fields: [
            { label: 'Project name', value: resource.projectDetails.projectName || '—' },
            { label: 'Budget', value: resource.projectDetails.budget || '—' },
            { label: 'Category', value: resource.projectDetails.category || '—' },
            { label: 'Team members', value: resource.projectDetails.options.join(', ') || '—' },
          ],
        },
      ],
    },
    onRetry: () => void query.refetch(),
  }
}
