import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

interface PendingResourceRouteProps {
  title: string
  description: string
}

export function PendingResourceRoute({ title, description }: PendingResourceRouteProps) {
  const { resourceId } = useParams()

  return (
    <RouteShell>
      <Eyebrow>Next implementation step</Eyebrow>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <BackLink to={`/resources/${resourceId}`}>← Back to resource overview</BackLink>
    </RouteShell>
  )
}

const RouteShell = styled.section`
  max-width: 720px;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
`

const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
`

const Description = styled.p`
  margin: ${({ theme }) => `${theme.spacing.md} 0 ${theme.spacing.xl}`};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 700;
  text-decoration: none;
`
