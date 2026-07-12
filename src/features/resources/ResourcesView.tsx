import styled from 'styled-components'
import { Button } from '../../design-system'
import CreateResourceDrawer from './components/CreateResourceDrawer'
import ResourceCard from './components/ResourceCard'
import ResourcesFilters from './components/ResourcesFilters'
import type { ResourcesViewProps } from './resources.view-model'

const ResourcesView = ({
  resources,
  isLoading,
  isError,
  isLoaded,
  errorMessage,
  hasActiveFilters,
  filters,
  createForm,
  onNameFilterChange,
  onStatusFilterChange,
  onSortOrderChange,
  onOpenCreate,
  onCloseCreate,
  onCreateNameChange,
  onCreate,
  onDelete,
  onRetry,
}: ResourcesViewProps) => {
  return (
    <section>
      <PageHeader>
        <div>
          <Eyebrow>Resource workspace</Eyebrow>
          <Title>Resources</Title>
          <Intro>Create, track, and complete resources from one place.</Intro>
        </div>
        <Button type="button" size="large" onClick={onOpenCreate}>
          Create resource
        </Button>
      </PageHeader>

      <ResourcesFilters
        {...filters}
        onNameChange={onNameFilterChange}
        onStatusChange={onStatusFilterChange}
        onSortOrderChange={onSortOrderChange}
      />

      {errorMessage ? <ErrorBanner role="alert">{errorMessage}</ErrorBanner> : null}

      {isLoading ? <StatePanel role="status">Loading resources…</StatePanel> : null}

      {isError ? (
        <StatePanel>
          <p>Resources could not be loaded.</p>
          <Button type="button" variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </StatePanel>
      ) : null}

      {isLoaded && resources.length === 0 ? (
        <StatePanel>
          <EmptyTitle>No resources found</EmptyTitle>
          <p>
            {hasActiveFilters
              ? 'Adjust your filters to see more resources.'
              : 'Create your first resource to begin the module workflow.'}
          </p>
        </StatePanel>
      ) : null}

      {isLoaded && resources.length > 0 ? (
        <ResourceGrid aria-label="Resources">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.resourceId}
              resource={resource}
              onDelete={onDelete}
            />
          ))}
        </ResourceGrid>
      ) : null}

      <CreateResourceDrawer
        {...createForm}
        onNameChange={onCreateNameChange}
        onClose={onCloseCreate}
        onSubmit={onCreate}
      />
    </section>
  )
}

export default ResourcesView

const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`

const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  line-height: 1.05;
`

const Intro = styled.p`
  margin: ${({ theme }) => `${theme.spacing.sm} 0 0`};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ErrorBanner = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.warning};
  background: ${({ theme }) => theme.colors.accentSoft};
`

const StatePanel = styled.div`
  display: grid;
  justify-items: start;
  min-height: 180px;
  align-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.inkMuted};
  background: ${({ theme }) => theme.colors.surface};

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.md};
  }
`

const EmptyTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
`

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`
