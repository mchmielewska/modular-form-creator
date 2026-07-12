import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { theme } from '../../../design-system'
import type { Resource } from '../resource.types'
import { getResource, provisionResource } from '../resources.api'
import { ResourceOverviewPage } from './ResourceOverviewPage'
import { CompletedDraftsProvider } from '../completed-drafts/CompletedDraftsProvider'

vi.mock('../resources.api', () => ({
  getResource: vi.fn(),
  provisionResource: vi.fn(),
  listResources: vi.fn(),
  createResource: vi.fn(),
  deleteResource: vi.fn(),
  replaceCompletedResource: vi.fn(),
}))

const completeDraft: Resource = {
  _id: 'resource-document-id',
  resourceId: 12,
  name: 'Launch workspace',
  status: 'draft',
  basicInfo: {
    resourceName: 'Launch workspace',
    owner: 'Ada Lovelace',
    email: 'ada@example.com',
    description: 'Workspace for the launch team',
    priority: 'high',
  },
  projectDetails: {
    projectName: 'Launch',
    budget: '50000',
    category: 'internal',
    options: ['FE devs'],
  },
}

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CompletedDraftsProvider>
          <MemoryRouter initialEntries={['/resources/12']}>
            <Routes>
              <Route path="/resources/:resourceId" element={<ResourceOverviewPage />} />
            </Routes>
          </MemoryRouter>
        </CompletedDraftsProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  )
}

describe('ResourceOverviewPage', () => {
  beforeEach(() => {
    vi.mocked(getResource).mockResolvedValue(completeDraft)
    vi.mocked(provisionResource).mockResolvedValue({
      ...completeDraft,
      status: 'completed',
    })
  })

  it('shows module progress and enables provisioning for a complete draft', async () => {
    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent('Loading resource')
    expect(await screen.findByRole('heading', { name: 'Launch workspace' })).toBeVisible()
    expect(screen.getByText('2 of 2 modules complete')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Provision resource' })).toBeEnabled()
    expect(screen.getByRole('link', { name: 'Review Basic Info' })).toHaveAttribute(
      'href',
      '/resources/12/basic-info',
    )
  })

  it('locks Project Details and provisioning until Basic Info is complete', async () => {
    vi.mocked(getResource).mockResolvedValue({
      ...completeDraft,
      basicInfo: { ...completeDraft.basicInfo, owner: '' },
      projectDetails: { ...completeDraft.projectDetails, projectName: '' },
    })
    renderPage()

    expect(
      await screen.findByRole('button', { name: 'Complete Basic Info first' }),
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Provision resource' })).toBeDisabled()
    expect(
      screen.queryByRole('link', { name: 'Complete Project Details' }),
    ).not.toBeInTheDocument()
  })

  it('provisions through the mutation and removes the provisioning action', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: 'Launch workspace' })

    await user.click(screen.getByRole('button', { name: 'Provision resource' }))

    await waitFor(() => expect(provisionResource).toHaveBeenCalledWith(12))
    expect(
      await screen.findByText('This resource has already been provisioned.'),
    ).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'Provision resource' }),
    ).not.toBeInTheDocument()
  })

  it('does not offer reprovisioning for completed resources', async () => {
    vi.mocked(getResource).mockResolvedValue({ ...completeDraft, status: 'completed' })
    renderPage()

    expect(
      await screen.findByText('This resource has already been provisioned.'),
    ).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'Provision resource' }),
    ).not.toBeInTheDocument()
  })

  it('shows the backend error and retries the detail query', async () => {
    vi.mocked(getResource)
      .mockRejectedValueOnce(new Error('Resource not found'))
      .mockResolvedValueOnce(completeDraft)
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Resource not found')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { name: 'Launch workspace' })).toBeVisible()
  })
})
