import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Badge, Button, Card } from '../../../design-system'
import { ModuleCard } from './ModuleCard'
import type { ResourceOverviewViewProps } from './resource-overview.view-model'

export function ResourceOverviewView({
  isLoading,
  isError,
  errorMessage,
  resource,
  isProvisioning,
  onProvision,
  onRetry,
}: ResourceOverviewViewProps) {
  if (isLoading) return <StatePanel role="status">Loading resource…</StatePanel>

  if (!resource) {
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

      <ProgressCard variant="elevated">
        <ProgressSummary>
          <div>
            <SectionLabel>Workflow progress</SectionLabel>
            <ProgressTitle>{resource.completedModules} of 2 modules complete</ProgressTitle>
          </div>
          <ProgressValue>{resource.completedModules * 50}%</ProgressValue>
        </ProgressSummary>
        <ProgressTrack aria-label={`${resource.completedModules} of 2 modules complete`}>
          <ProgressFill $percentage={resource.completedModules * 50} />
        </ProgressTrack>
      </ProgressCard>

      <ModulesGrid>
        {resource.modules.map((module) => (
          <ModuleCard key={module.title} module={module} />
        ))}
      </ModulesGrid>

      <ActionPanel>
        <div>
          <SectionLabel>{resource.isCompleted ? 'Resource complete' : 'Provisioning'}</SectionLabel>
          <ActionTitle>
            {resource.isCompleted ? 'Review the resource summary' : 'Ready to complete?'}
          </ActionTitle>
          <ActionHint>{resource.provisioningHint}</ActionHint>
        </div>
        <ActionButtons>
          <DetailsLink to={resource.detailsPath}>View details</DetailsLink>
          {!resource.isCompleted ? (
            <Button
              type="button"
              size="large"
              disabled={!resource.canProvision || isProvisioning}
              onClick={onProvision}
            >
              {isProvisioning ? 'Provisioning…' : 'Provision resource'}
            </Button>
          ) : null}
        </ActionButtons>
      </ActionPanel>
    </section>
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

const ProgressCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const ProgressSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const SectionLabel = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

const ProgressTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
`

const ProgressValue = styled.strong`
  color: ${({ theme }) => theme.colors.success};
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.5rem;
`

const ProgressTrack = styled.div`
  height: 10px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.border};
`

const ProgressFill = styled.div<{ $percentage: number }>`
  width: ${({ $percentage }) => `${$percentage}%`};
  height: 100%;
  background: ${({ theme }) => theme.colors.success};
`

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const ActionPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
  }
`

const ActionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
`

const ActionHint = styled.p`
  margin: ${({ theme }) => `${theme.spacing.sm} 0 0`};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    align-items: stretch;
    flex-direction: column;
  }
`

const DetailsLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 700;
  text-decoration: none;
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
