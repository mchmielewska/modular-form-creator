import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it } from 'vitest'
import App from './App'
import { theme } from './design-system'

const renderRoute = (route: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>,
  )
}

describe('resource routes', () => {
  it.each([
    ['/resources/1/basic-info', 'Basic Info'],
    ['/resources/1/project-details', 'Project Details'],
    ['/resources/1/details', 'Resource details'],
  ])('keeps %s inside the selected resource workflow', (route, heading) => {
    renderRoute(route)

    expect(screen.getByRole('heading', { name: heading })).toBeVisible()
    expect(screen.getByRole('link', { name: '← Back to resource overview' })).toHaveAttribute(
      'href',
      '/resources/1',
    )
  })
})
