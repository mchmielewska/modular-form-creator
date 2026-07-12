import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Badge, Button, Card } from '../../../design-system'
import type { ModuleViewModel } from './resource-overview.view-model'

const ModuleCard = ({ module }: { module: ModuleViewModel }) => {
  return (
    <ModuleSurface>
      <ModuleHeader>
        <ModuleTitle>{module.title}</ModuleTitle>
        <Badge
          variant={
            module.isComplete ? 'success' : module.isLocked ? 'neutral' : 'warning'
          }
        >
          {module.statusLabel}
        </Badge>
      </ModuleHeader>
      <Description>{module.description}</Description>
      {module.isLocked ? (
        <Button type="button" variant="secondary" state="locked" fullWidth>
          Complete Basic Info first
        </Button>
      ) : (
        <ModuleLink to={module.path}>{module.actionLabel}</ModuleLink>
      )}
    </ModuleSurface>
  )
}

export default ModuleCard

const ModuleSurface = styled(Card)`
  display: flex;
  min-height: 220px;
  flex-direction: column;
`

const ModuleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const ModuleTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
`

const Description = styled.p`
  margin: ${({ theme }) => `${theme.spacing.md} 0 ${theme.spacing.xl}`};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ModuleLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  margin-top: auto;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryStrong};
  }
`
