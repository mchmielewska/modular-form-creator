import { Navigate, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import { ResourcesPage } from './features/resources/ResourcesPage'

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
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="*" element={<Navigate to="/resources" replace />} />
        </Routes>
      </Main>
    </AppShell>
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

export default App
