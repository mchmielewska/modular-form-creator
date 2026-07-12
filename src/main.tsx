import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import App from './App'
import { GlobalStyles } from './design-system/theme/GlobalStyles'
import { theme } from './design-system/theme/theme'
import { queryClient } from './lib/queryClient'
import { CompletedDraftsProvider } from './features/resources/completed-drafts/CompletedDraftsProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <CompletedDraftsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CompletedDraftsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
