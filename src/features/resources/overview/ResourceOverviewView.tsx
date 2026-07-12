import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Badge, Button } from '../../../design-system'
import { BufferedChangesPanel } from './BufferedChangesPanel'
import { ModuleCard } from './ModuleCard'
import { ProvisioningPanel } from './ProvisioningPanel'
import type { ResourceOverviewViewProps } from './resource-overview.view-model'
import { WorkflowProgress } from './WorkflowProgress'

export function ResourceOverviewView({
  isLoading,
  isError,
  errorMessage,
  resource,
  isProvisioning,
  isSubmittingChanges,
  onProvision,
  onSubmitChanges,
  onDiscardChanges,
  onRetry,
}: ResourceOverviewViewProps) {
  if (isLoading) return <StatePanel role="status">Loading resource…</StatePanel>
  if (!resource) return <UnavailableState errorMessage={errorMessage} onRetry={onRetry} />

  return (
    <section>
      <BackLink to="/resources">← Back to resources</BackLink>
      <OverviewHeader>
        <div>
          <ResourceId>Resource #{resource.resourceId}</ResourceId>
          <Title>{resource.name}</Title>
        </div>
        <Badge variant={resource.isCompleted ? 'success' : 'warning'}>
          {resource.statusLabel}
        </Badge>
      </OverviewHeader>
      {isError ? <ErrorBanner role="alert">{errorMessage}</ErrorBanner> : null}
      <WorkflowProgress completedModules={resource.completedModules} />
      <ModulesGrid>
        {resource.modules.map((module) => (
          <ModuleCard key={module.title} module={module} />
        ))}
      </ModulesGrid>
      {resource.hasBufferedChanges ? (
        <BufferedChangesPanel
          isSubmitting={isSubmittingChanges}
          onSubmit={onSubmitChanges}
          onDiscard={onDiscardChanges}
        />
      ) : null}
      <ProvisioningPanel
        isCompleted={resource.isCompleted}
        canProvision={resource.canProvision}
        isProvisioning={isProvisioning}
        hint={resource.provisioningHint}
        detailsPath={resource.detailsPath}
        onProvision={onProvision}
      />
    </section>
  )
}

function UnavailableState({
  errorMessage,
  onRetry,
}: Pick<ResourceOverviewViewProps, 'errorMessage' | 'onRetry'>) {
  return (
    <StatePanel>
      <ErrorTitle>Resource unavailable</ErrorTitle>
      <p role="alert">{errorMessage}</p>
      <StateActions>
        <Button type="button" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
        <BackLink to="/resources">Back to resources</BackLink>
      </StateActions>
    </StatePanel>
  )
}

const BackLink = styled(Link)`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 700;
  text-decoration: none;
`
const OverviewHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => `${theme.spacing.lg} 0 ${theme.spacing.xl}`};
`
const ResourceId = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.inkMuted};
`
const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.1;
`
const ErrorBanner = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.warning};
  background: ${({ theme }) => theme.colors.accentSoft};
`
const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`
const StatePanel = styled.div`
  display: grid;
  justify-items: start;
  min-height: 260px;
  align-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.inkMuted};
`
const ErrorTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
`
const StateActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`
