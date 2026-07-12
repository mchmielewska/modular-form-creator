export interface DetailGroupViewModel {
  title: string
  fields: Array<{ label: string; value: string }>
}

export interface ResourceDetailsViewProps {
  isLoading: boolean
  isError: boolean
  errorMessage: string
  resource: null | {
    resourceId: number
    name: string
    statusLabel: 'Draft' | 'Completed'
    statusVariant: 'warning' | 'success'
    completedModules: number
    hasBufferedChanges: boolean
    overviewPath: string
    groups: DetailGroupViewModel[]
  }
  onRetry: () => void
}
