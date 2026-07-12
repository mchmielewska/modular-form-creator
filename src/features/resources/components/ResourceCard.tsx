import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Badge, Button, Card } from '../../../design-system'
import type { ResourceListItemViewModel } from '../resources.view-model'

interface ResourceCardProps {
  resource: ResourceListItemViewModel
  onDelete: (resourceId: number) => void
}

const ResourceCard = ({ resource, onDelete }: ResourceCardProps) => {
  return (
    <CardSurface variant="elevated">
      <CardTop>
        <ResourceId>Resource #{resource.resourceId}</ResourceId>
        <Badge variant={resource.statusVariant}>{resource.statusLabel}</Badge>
      </CardTop>
      <ResourceName>{resource.name}</ResourceName>
      <ProgressText>{resource.completedModules} of 2 modules complete</ProgressText>
      <ProgressTrack aria-label={`${resource.completedModules} of 2 modules complete`}>
        <ProgressFill $percentage={resource.completedModules * 50} />
      </ProgressTrack>
      <CardActions>
        <ButtonLink to={resource.overviewPath}>Open resource</ButtonLink>
        <Button
          type="button"
          variant="ghost"
          size="small"
          disabled={resource.isDeleting}
          onClick={() => onDelete(resource.resourceId)}
        >
          {resource.isDeleting ? 'Deleting…' : 'Delete'}
        </Button>
      </CardActions>
    </CardSurface>
  )
}

export default ResourceCard

const CardSurface = styled(Card)`
  display: flex;
  min-height: 230px;
  flex-direction: column;
`

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const ResourceId = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.8rem;
`

const ResourceName = styled.h2`
  margin: ${({ theme }) => `${theme.spacing.lg} 0 ${theme.spacing.xs}`};
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.35rem;
`

const ProgressText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.9rem;
`

const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.border};
`

const ProgressFill = styled.div<{ $percentage: number }>`
  width: ${({ $percentage }) => `${$percentage}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.success};
`

const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.xl};
`

const ButtonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
