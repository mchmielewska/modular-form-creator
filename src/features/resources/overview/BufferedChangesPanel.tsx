import styled from 'styled-components'
import { Button } from '../../../design-system'

interface BufferedChangesPanelProps {
  isSubmitting: boolean
  onSubmit: () => void
  onDiscard: () => void
}

const BufferedChangesPanel = ({
  isSubmitting,
  onSubmit,
  onDiscard,
}: BufferedChangesPanelProps) => {
  return (
    <Panel>
      <div>
        <Label>Temporary changes</Label>
        <Title>Draft edits are ready to submit</Title>
        <Hint>These changes exist only in memory and will be lost on refresh.</Hint>
      </div>
      <Actions>
        <Button type="button" variant="ghost" onClick={onDiscard}>
          Discard changes
        </Button>
        <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit changes'}
        </Button>
      </Actions>
    </Panel>
  )
}

export default BufferedChangesPanel

const Panel = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.accentSoft};
  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
  }
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

const Hint = styled.p`
  margin: ${({ theme }) => `${theme.spacing.sm} 0 0`};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  @media (max-width: 480px) {
    align-items: stretch;
    flex-direction: column;
  }
`
