import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card } from '../../../design-system'

interface ModuleFormLayoutProps {
  resourceId: number
  isInvalidResource: boolean
  title: string
  description: string
  isLoading: boolean
  errorMessage: string
  isSubmitting: boolean
  isReadOnly: boolean
  readOnlyMessage?: string
  noticeMessage?: string
  submitLabel?: string
  onSubmit: () => void
  children: ReactNode
}

const ModuleFormLayout = (props: ModuleFormLayoutProps) => {
  if (props.isInvalidResource) {
    return (
      <State>
        <h1>Resource unavailable</h1>
        <p role="alert">Resource id must be a positive number.</p>
        <BackLink to="/resources">Back to resources</BackLink>
      </State>
    )
  }

  if (props.isLoading) return <State role="status">Loading module…</State>

  return (
    <section>
      <BackLink to={`/resources/${props.resourceId}`}>
        ← Back to resource overview
      </BackLink>
      <Header>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </Header>
      {props.isReadOnly ? (
        <Notice>
          {props.readOnlyMessage ??
            'Completed-resource editing will be enabled in the next reviewed step.'}
        </Notice>
      ) : null}
      {props.noticeMessage ? <Notice>{props.noticeMessage}</Notice> : null}
      {props.errorMessage ? <Error role="alert">{props.errorMessage}</Error> : null}
      <FormCard>
        <Form
          onSubmit={(event) => {
            event.preventDefault()
            props.onSubmit()
          }}
        >
          {props.children}
          {!props.isReadOnly ? (
            <Button type="submit" size="large" disabled={props.isSubmitting}>
              {props.isSubmitting
                ? 'Saving…'
                : (props.submitLabel ?? 'Save and continue')}
            </Button>
          ) : null}
        </Form>
      </FormCard>
    </section>
  )
}

export default ModuleFormLayout

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 700;
  text-decoration: none;
`

const Header = styled.header`
  margin: ${({ theme }) => `${theme.spacing.lg} 0 ${theme.spacing.xl}`};
  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.inkStrong};
  }
  p {
    color: ${({ theme }) => theme.colors.inkMuted};
  }
`

const FormCard = styled(Card)`
  max-width: 760px;
`

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Notice = styled.p`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentSoft};
`

const Error = styled.p`
  color: ${({ theme }) => theme.colors.warning};
`

const State = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`
