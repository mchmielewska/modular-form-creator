import { useEffect, useState } from 'react'
import { isBasicInfoComplete, isProjectDetailsComplete } from './resource.rules'
import { getErrorMessage } from './resource.errors'
import type { ResourceStatus } from './resource.types'
import type { ResourcesViewProps } from './resources.view-model'
import { useCreateResource, useDeleteResource, useResources } from './resources.queries'

export const useResourcesController = (): ResourcesViewProps => {
  const [nameFilter, setNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | ''>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [resourceName, setResourceName] = useState('')
  const [createError, setCreateError] = useState('')
  const debouncedNameFilter = useDebouncedValue(nameFilter, 250)

  const resourcesQuery = useResources({
    name: debouncedNameFilter,
    status: statusFilter,
    sortOrder,
  })
  const createMutation = useCreateResource()
  const deleteMutation = useDeleteResource()
  const pageError = resourcesQuery.error ?? deleteMutation.error

  const openCreate = () => {
    createMutation.reset()
    setCreateError('')
    setIsCreateOpen(true)
  }

  const closeCreate = () => {
    createMutation.reset()
    setCreateError('')
    setIsCreateOpen(false)
  }

  const create = async () => {
    const trimmedName = resourceName.trim()
    if (!trimmedName) {
      setCreateError('Resource name is required.')
      return
    }

    setCreateError('')
    try {
      await createMutation.mutateAsync(trimmedName)
      setResourceName('')
      setIsCreateOpen(false)
    } catch (error) {
      setCreateError(getErrorMessage(error))
    }
  }

  const remove = async (resourceId: number) => {
    const resource = resourcesQuery.data?.items.find(
      (item) => item.resourceId === resourceId,
    )
    if (
      !resource ||
      !window.confirm(`Delete “${resource.name}”? This cannot be undone.`)
    ) {
      return
    }

    deleteMutation.reset()
    try {
      await deleteMutation.mutateAsync(resourceId)
    } catch {
      // Mutation state exposes the API error to the view while cached data remains visible.
    }
  }

  return {
    resources:
      resourcesQuery.data?.items.map((resource) => {
        const completedModules = [
          isBasicInfoComplete(resource.basicInfo),
          isProjectDetailsComplete(resource.projectDetails),
        ].filter(Boolean).length

        return {
          resourceId: resource.resourceId,
          name: resource.name,
          statusLabel: resource.status === 'completed' ? 'Completed' : 'Draft',
          statusVariant: resource.status === 'completed' ? 'success' : 'warning',
          completedModules,
          overviewPath: `/resources/${resource.resourceId}`,
          isDeleting:
            deleteMutation.isPending && deleteMutation.variables === resource.resourceId,
        }
      }) ?? [],
    isLoading: resourcesQuery.isPending,
    isError: resourcesQuery.isError,
    isLoaded: resourcesQuery.isSuccess,
    errorMessage: pageError ? getErrorMessage(pageError) : '',
    hasActiveFilters: Boolean(nameFilter || statusFilter),
    filters: { name: nameFilter, status: statusFilter, sortOrder },
    createForm: {
      isOpen: isCreateOpen,
      name: resourceName,
      error: createError,
      isSubmitting: createMutation.isPending,
    },
    onNameFilterChange: setNameFilter,
    onStatusFilterChange: setStatusFilter,
    onSortOrderChange: setSortOrder,
    onOpenCreate: openCreate,
    onCloseCreate: closeCreate,
    onCreateNameChange: (value) => {
      setResourceName(value)
      if (createError) setCreateError('')
    },
    onCreate: () => void create(),
    onDelete: (resourceId) => void remove(resourceId),
    onRetry: () => void resourcesQuery.refetch(),
  }
}

const useDebouncedValue = <Value>(value: Value, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debouncedValue
}
