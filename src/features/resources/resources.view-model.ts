import type { BadgeVariant } from '../../design-system'
import type { ResourceStatus } from './resource.types'

export interface ResourceListItemViewModel {
  resourceId: number
  name: string
  statusLabel: string
  statusVariant: BadgeVariant
  completedModules: number
  overviewPath: string
  isDeleting: boolean
}

export interface ResourcesViewProps {
  resources: ResourceListItemViewModel[]
  isLoading: boolean
  isError: boolean
  isLoaded: boolean
  errorMessage: string
  hasActiveFilters: boolean
  filters: {
    name: string
    status: ResourceStatus | ''
    sortOrder: 'asc' | 'desc'
  }
  createForm: {
    isOpen: boolean
    name: string
    error: string
    isSubmitting: boolean
  }
  onNameFilterChange: (value: string) => void
  onStatusFilterChange: (value: ResourceStatus | '') => void
  onSortOrderChange: (value: 'asc' | 'desc') => void
  onOpenCreate: () => void
  onCloseCreate: () => void
  onCreateNameChange: (value: string) => void
  onCreate: () => void
  onDelete: (resourceId: number) => void
  onRetry: () => void
}
