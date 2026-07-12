import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../../../design-system'

interface ProvisioningPanelProps {
  isCompleted: boolean
  canProvision: boolean
  isProvisioning: boolean
  hint: string
  detailsPath: string
  onProvision: () => void
}

export function ProvisioningPanel(props: ProvisioningPanelProps) {
  return (
    <Panel>
      <div>
        <Label>{props.isCompleted ? 'Resource complete' : 'Provisioning'}</Label>
        <Title>{props.isCompleted ? 'Review the resource summary' : 'Ready to complete?'}</Title>
        <Hint>{props.hint}</Hint>
      </div>
      <Actions>
        <DetailsLink to={props.detailsPath}>View details</DetailsLink>
        {!props.isCompleted ? <Button type="button" size="large" disabled={!props.canProvision || props.isProvisioning} onClick={props.onProvision}>{props.isProvisioning ? 'Provisioning…' : 'Provision resource'}</Button> : null}
      </Actions>
    </Panel>
  )
}

const Panel = styled.section`
  display: flex; align-items: center; justify-content: space-between; gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl}; padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.lg}; color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface}; box-shadow: ${({ theme }) => theme.shadows.card};
  @media (max-width: 720px) { align-items: stretch; flex-direction: column; }
`
const Label = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xs}; color: ${({ theme }) => theme.colors.primary};
  font-size: .8rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
`
const Title = styled.h2`margin: 0; color: ${({ theme }) => theme.colors.inkStrong}; font-family: ${({ theme }) => theme.typography.heading};`
const Hint = styled.p`margin: ${({ theme }) => `${theme.spacing.sm} 0 0`}; color: ${({ theme }) => theme.colors.inkMuted};`
const Actions = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing.md};
  @media (max-width: 480px) { align-items: stretch; flex-direction: column; }
`
const DetailsLink = styled(Link)`color: ${({ theme }) => theme.colors.primaryStrong}; font-weight: 700; text-decoration: none;`
