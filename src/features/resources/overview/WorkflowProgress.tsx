import styled from 'styled-components'
import { Card } from '../../../design-system'

const WorkflowProgress = ({ completedModules }: { completedModules: number }) => {
  const percentage = completedModules * 50

  return (
    <ProgressCard variant="elevated">
      <Summary>
        <div>
          <Label>Workflow progress</Label>
          <Title>{completedModules} of 2 modules complete</Title>
        </div>
        <Value>{percentage}%</Value>
      </Summary>
      <Track aria-label={`${completedModules} of 2 modules complete`}>
        <Fill $percentage={percentage} />
      </Track>
    </ProgressCard>
  )
}

export default WorkflowProgress

const ProgressCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const Summary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const Label = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
`

const Value = styled.strong`
  color: ${({ theme }) => theme.colors.success};
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.5rem;
`

const Track = styled.div`
  height: 10px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.border};
`

const Fill = styled.div<{ $percentage: number }>`
  width: ${({ $percentage }) => `${$percentage}%`};
  height: 100%;
  background: ${({ theme }) => theme.colors.success};
`
