import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { theme } from '../../design-system'
import type { Resource, ResourceListResponse } from './resource.types'
import { ResourcesPage } from './ResourcesPage'
import { createResource, deleteResource, listResources } from './resources.api'

vi.mock('./resources.api', () => ({
  listResources: vi.fn(),
  createResource: vi.fn(),
  deleteResource: vi.fn(),
}))

const draftResource: Resource = {
  _id: 'resource-document-id',
  resourceId: 12,
  name: 'Launch workspace',
  status: 'draft',
  basicInfo: {
    resourceName: 'Launch workspace',
    owner: '',
    email: '',
    description: '',
    priority: '',
  },
  projectDetails: {
    projectName: '',
    budget: '',
    category: '',
    options: [],
  },
}

const listResponse = (items: Resource[]): ResourceListResponse => ({
  items,
  pagination: { page: 1, pageSize: 10, totalItems: items.length, totalPages: 1 },
})

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
        <MemoryRouter>
          <ResourcesPage />
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>,
  )
}

describe('ResourcesPage', () => {
  beforeEach(() => {
    vi.mocked(listResources).mockResolvedValue(listResponse([draftResource]))
    vi.mocked(createResource).mockResolvedValue(draftResource)
    vi.mocked(deleteResource).mockResolvedValue(draftResource)
  })

  afterEach(() => vi.clearAllMocks())

  it('shows resources with status, progress, and overview navigation', async () => {
    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent('Loading resources')
    expect(await screen.findByRole('heading', { name: 'Launch workspace' })).toBeVisible()
    const resources = screen.getByLabelText('Resources')
    expect(within(resources).getByText('Draft')).toBeVisible()
    expect(within(resources).getByText('0 of 2 modules complete')).toBeVisible()
    expect(
      within(resources).getByRole('link', { name: 'Open resource' }),
    ).toHaveAttribute('href', '/resources/12')
  })

  it('creates a resource after validating and trimming its name', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: 'Launch workspace' })

    await user.click(screen.getByRole('button', { name: 'Create resource' }))
    const dialog = screen.getByRole('dialog', { name: 'Create resource' })
    const input = within(dialog).getByRole('textbox', { name: 'Resource name' })
    await user.type(input, '  New resource  ')
    await user.click(within(dialog).getByRole('button', { name: 'Create resource' }))

    await waitFor(() => expect(createResource).toHaveBeenCalledWith('New resource'))
    await waitFor(() => expect(listResources).toHaveBeenCalledTimes(2))
  })

  it('sends backend-driven status and name filters', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: 'Launch workspace' })

    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'draft')
    await user.type(screen.getByRole('searchbox', { name: 'Search resources' }), 'launch')

    await waitFor(() =>
      expect(listResources).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'draft', name: 'launch' }),
        expect.any(AbortSignal),
      ),
    )
  })

  it('deletes only after confirmation and refreshes the list', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderPage()
    await screen.findByRole('heading', { name: 'Launch workspace' })

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => expect(deleteResource).toHaveBeenCalledWith(12))
    expect(window.confirm).toHaveBeenCalledWith(
      'Delete “Launch workspace”? This cannot be undone.',
    )
    await waitFor(() => expect(listResources).toHaveBeenCalledTimes(2))
  })

  it('shows the API error and supports retrying', async () => {
    vi.mocked(listResources)
      .mockRejectedValueOnce(new Error('Backend unavailable'))
      .mockResolvedValueOnce(listResponse([]))
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Backend unavailable')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(
      await screen.findByRole('heading', { name: 'No resources found' }),
    ).toBeVisible()
  })
})
