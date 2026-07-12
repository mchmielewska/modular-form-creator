import { Navigate, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'

function App() {
  return (
    <AppShell>
      <Header>
        <BrandMark aria-hidden="true">R</BrandMark>
        <BrandText>
          <BrandName>Resources</BrandName>
          <BrandTagline>Management workspace</BrandTagline>
        </BrandText>
      </Header>
      <Main>
        <Routes>
          <Route path="/resources" element={<ResourcesLanding />} />
          <Route path="*" element={<Navigate to="/resources" replace />} />
        </Routes>
      </Main>
    </AppShell>
  )
}

function ResourcesLanding() {
  return (
    <Landing>
      <Eyebrow>Resource workspace</Eyebrow>
      <Title>Resources</Title>
      <Intro>
        Create resources, complete each module, and provision them when they are
        ready.
      </Intro>
      <FoundationNote>
        <span>Resources list placeholder</span>
      </FoundationNote>
    </Landing>
  )
}

const AppShell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const BrandMark = styled.span`
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.heading};
  font-weight: 700;
`

const BrandText = styled.span`
  display: grid;
`

const BrandName = styled.strong`
  font-family: ${({ theme }) => theme.typography.heading};
  color: ${({ theme }) => theme.colors.inkStrong};
`

const BrandTagline = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.8rem;
`

const Main = styled.main`
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xxl} 0`};
`

const Landing = styled.section`
  max-width: 720px;
`

const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(2.25rem, 6vw, 4rem);
  line-height: 1.05;
`

const Intro = styled.p`
  max-width: 620px;
  margin: ${({ theme }) => `${theme.spacing.md} 0 ${theme.spacing.xl}`};
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 1.1rem;
`

const FoundationNote = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  color: ${({ theme }) => theme.colors.ink};
`

export default App
