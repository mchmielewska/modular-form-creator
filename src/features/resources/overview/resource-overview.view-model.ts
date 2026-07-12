export interface ModuleViewModel {
  title: string
  description: string
  statusLabel: 'Complete' | 'Incomplete' | 'Locked'
  isComplete: boolean
  isLocked: boolean
  path: string
  actionLabel: string
}

export interface ResourceOverviewViewProps {
  isLoading: boolean
  isError: boolean
  errorMessage: string
  resource: null | {
    resourceId: number
    name: string
    statusLabel: 'Draft' | 'Completed'
    isCompleted: boolean
    completedModules: number
    modules: ModuleViewModel[]
    detailsPath: string
    canProvision: boolean
    provisioningHint: string
    hasBufferedChanges: boolean
  }
  isProvisioning: boolean
  isSubmittingChanges: boolean
  onProvision: () => void
  onSubmitChanges: () => void
  onDiscardChanges: () => void
  onRetry: () => void
}
