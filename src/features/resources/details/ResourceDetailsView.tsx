import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Badge, Button, Card } from '../../../design-system'
import type { ResourceDetailsViewProps } from './resource-details.view-model'

export function ResourceDetailsView({ isLoading, isError, errorMessage, resource, onRetry }: ResourceDetailsViewProps) {
  if (isLoading) return <State role="status">Loading resource details…</State>
  if (!resource) return <State><h1>Resource unavailable</h1><p role="alert">{errorMessage}</p>{isError ? <Button type="button" onClick={onRetry}>Try again</Button> : null}</State>

  return (
    <section>
      <BackLink to={resource.overviewPath}>← Back to resource overview</BackLink>
      <Header><div><p>Resource #{resource.resourceId}</p><h1>{resource.name}</h1></div><Badge variant={resource.statusVariant}>{resource.statusLabel}</Badge></Header>
      <Progress>{resource.completedModules} of 2 modules complete</Progress>
      {resource.hasBufferedChanges ? <Notice role="status">Showing temporary completed-resource edits. Submit or discard them from the overview.</Notice> : null}
      <Grid>{resource.groups.map((group) => <DetailCard key={group.title}><h2>{group.title}</h2><Fields>{group.fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</Fields></DetailCard>)}</Grid>
    </section>
  )
}

const BackLink = styled(Link)`color: ${({ theme }) => theme.colors.primaryStrong}; font-weight: 700; text-decoration: none;`
const Header = styled.header`
  display:flex; justify-content:space-between; gap:${({ theme }) => theme.spacing.lg}; margin:${({ theme }) => `${theme.spacing.lg} 0`};
  p { margin:0; color:${({ theme }) => theme.colors.inkMuted}; }
  h1 { margin:${({ theme }) => `${theme.spacing.xs} 0 0`}; color:${({ theme }) => theme.colors.inkStrong}; font-family:${({ theme }) => theme.typography.heading}; }
`
const Progress = styled.p`margin-bottom:${({ theme }) => theme.spacing.lg}; color:${({ theme }) => theme.colors.inkMuted};`
const Notice = styled.p`padding:${({ theme }) => theme.spacing.md}; border-radius:${({ theme }) => theme.radii.md}; background:${({ theme }) => theme.colors.accentSoft};`
const Grid = styled.div`
  display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:${({ theme }) => theme.spacing.lg};
  @media(max-width:720px){grid-template-columns:1fr;}
`
const DetailCard = styled(Card)`h2 { margin-top:0; color:${({ theme }) => theme.colors.inkStrong}; font-family:${({ theme }) => theme.typography.heading}; }`
const Fields = styled.dl`
  margin:0; display:grid; gap:${({ theme }) => theme.spacing.md};
  div { padding-bottom:${({ theme }) => theme.spacing.sm}; border-bottom:1px solid ${({ theme }) => theme.colors.border}; }
  dt { color:${({ theme }) => theme.colors.inkMuted}; font-size:.8rem; }
  dd { margin:${({ theme }) => `${theme.spacing.xs} 0 0`}; color:${({ theme }) => theme.colors.inkStrong}; }
`
const State = styled.div`padding:${({ theme }) => theme.spacing.xl};`
