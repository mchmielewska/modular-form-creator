import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { theme } from '../../../design-system'
import { CompletedDraftsProvider } from '../completed-drafts/CompletedDraftsProvider'
import type { Resource } from '../resource.types'
import { getResource } from '../resources.api'
import { ResourceDetailsPage } from './ResourceDetailsPage'

vi.mock('../resources.api', () => ({ getResource: vi.fn(), listResources: vi.fn(), createResource: vi.fn(), deleteResource: vi.fn(), provisionResource: vi.fn(), updateBasicInfo: vi.fn(), updateProjectDetails: vi.fn(), replaceCompletedResource: vi.fn() }))

const resource: Resource = {
  _id: 'id', resourceId: 12, name: 'Launch workspace', status: 'completed',
  basicInfo: { resourceName: 'Launch workspace', owner: 'Ada Lovelace', email: 'ada@example.com', description: 'Workspace for the launch', priority: 'high' },
  projectDetails: { projectName: 'Launch', budget: '50000', category: 'internal', options: ['FE devs', 'Designer'] },
}

const renderPage = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<ThemeProvider theme={theme}><QueryClientProvider client={client}><CompletedDraftsProvider><MemoryRouter initialEntries={['/resources/12/details']}><Routes><Route path="/resources/:resourceId/details" element={<ResourceDetailsPage />} /></Routes></MemoryRouter></CompletedDraftsProvider></QueryClientProvider></ThemeProvider>)
}

describe('ResourceDetailsPage', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(getResource).mockResolvedValue(resource) })

  it('summarizes both modules and current completion state', async () => {
    renderPage()
    expect(await screen.findByRole('heading', { name: 'Launch workspace' })).toBeVisible()
    expect(screen.getByText('Completed')).toBeVisible()
    expect(screen.getByText('2 of 2 modules complete')).toBeVisible()
    expect(screen.getByText('Ada Lovelace')).toBeVisible()
    expect(screen.getByText('FE devs, Designer')).toBeVisible()
    expect(screen.getByRole('link', { name: '← Back to resource overview' })).toHaveAttribute('href', '/resources/12')
  })

  it('shows a resource load error', async () => {
    vi.mocked(getResource).mockRejectedValue(new Error('Resource not found'))
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('Resource not found')
  })
})
