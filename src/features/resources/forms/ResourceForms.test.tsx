import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { theme } from '../../../design-system'
import type { Resource } from '../resource.types'
import {
  getResource,
  replaceCompletedResource,
  updateBasicInfo,
  updateProjectDetails,
} from '../resources.api'
import BasicInfoPage from './BasicInfoPage'
import ProjectDetailsPage from './ProjectDetailsPage'
import CompletedDraftsProvider from '../completed-drafts/CompletedDraftsProvider'
import ResourceOverviewPage from '../overview/ResourceOverviewPage'

vi.mock('../resources.api', () => ({
  getResource: vi.fn(),
  updateBasicInfo: vi.fn(),
  updateProjectDetails: vi.fn(),
  listResources: vi.fn(),
  createResource: vi.fn(),
  deleteResource: vi.fn(),
  provisionResource: vi.fn(),
  replaceCompletedResource: vi.fn(),
}))

const draft: Resource = {
  _id: 'id',
  resourceId: 12,
  name: 'Locked name',
  status: 'draft',
  basicInfo: {
    resourceName: 'Locked name',
    owner: '',
    email: '',
    description: '',
    priority: '',
  },
  projectDetails: { projectName: '', budget: '', category: '', options: [] },
}

const renderForm = (path: string, element: React.ReactNode) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={client}>
        <CompletedDraftsProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/resources/:resourceId/basic-info" element={element} />
              <Route path="/resources/:resourceId/project-details" element={element} />
              <Route path="/resources/:resourceId" element={<h1>Overview</h1>} />
            </Routes>
          </MemoryRouter>
        </CompletedDraftsProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  )
}

describe('draft resource forms', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getResource).mockResolvedValue(draft)
    vi.mocked(updateBasicInfo).mockImplementation(async (_id, data) => ({
      ...draft,
      basicInfo: data,
    }))
    vi.mocked(updateProjectDetails).mockImplementation(async (_id, data) => ({
      ...draft,
      projectDetails: data,
    }))
    vi.mocked(replaceCompletedResource).mockImplementation(async (_id, data) => ({
      ...draft,
      ...data,
      status: 'completed',
    }))
  })

  it('validates and saves Basic Info without allowing name changes', async () => {
    const user = userEvent.setup()
    renderForm('/resources/12/basic-info', <BasicInfoPage />)
    const name = await screen.findByRole('textbox', { name: 'Resource name' })
    expect(name).toBeDisabled()
    await user.type(screen.getByRole('textbox', { name: 'Owner' }), 'Ada Lovelace')
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.com')
    await user.type(screen.getByRole('textbox', { name: 'Description' }), 'Test resource')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Priority' }), 'high')
    await user.click(screen.getByRole('button', { name: 'Save and continue' }))

    await waitFor(() =>
      expect(updateBasicInfo).toHaveBeenCalledWith(
        12,
        expect.objectContaining({
          resourceName: 'Locked name',
          owner: 'Ada Lovelace',
          priority: 'high',
        }),
      ),
    )
    expect(await screen.findByRole('heading', { name: 'Overview' })).toBeVisible()
  })

  it('keeps Project Details locked until Basic Info is complete', async () => {
    renderForm('/resources/12/project-details', <ProjectDetailsPage />)
    expect(
      await screen.findByText('Complete Basic Info before editing Project Details.'),
    ).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'Save and continue' }),
    ).not.toBeInTheDocument()
  })

  it('does not expose a writable form when the resource cannot be loaded', async () => {
    vi.mocked(getResource).mockRejectedValue(new Error('Resource not found'))
    renderForm('/resources/12/basic-info', <BasicInfoPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Resource not found')
    expect(
      screen.queryByRole('button', { name: 'Save and continue' }),
    ).not.toBeInTheDocument()
  })

  it.each([
    ['/resources/not-a-number/basic-info', <BasicInfoPage />],
    ['/resources/0/project-details', <ProjectDetailsPage />],
  ])('keeps %s unavailable and non-writable', async (path, element) => {
    renderForm(path, element)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Resource id must be a positive number.',
    )
    expect(
      screen.queryByRole('button', { name: 'Save and continue' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to resources' })).toHaveAttribute(
      'href',
      '/resources',
    )
    expect(getResource).not.toHaveBeenCalled()
  })

  it('saves Project Details through its separate endpoint after unlock', async () => {
    vi.mocked(getResource).mockResolvedValue({
      ...draft,
      basicInfo: {
        resourceName: 'Locked name',
        owner: 'Ada',
        email: 'ada@example.com',
        description: 'Ready',
        priority: 'high',
      },
    })
    const user = userEvent.setup()
    renderForm('/resources/12/project-details', <ProjectDetailsPage />)
    await user.type(
      await screen.findByRole('textbox', { name: 'Project name' }),
      'Project One',
    )
    await user.type(screen.getByRole('textbox', { name: 'Budget' }), '1000')
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Category' }),
      'internal',
    )
    await user.click(screen.getByRole('checkbox', { name: 'FE devs' }))
    await user.click(screen.getByRole('button', { name: 'Save and continue' }))

    await waitFor(() =>
      expect(updateProjectDetails).toHaveBeenCalledWith(
        12,
        expect.objectContaining({
          budget: '1000',
          category: 'internal',
          options: ['FE devs'],
        }),
      ),
    )
  })

  it('buffers completed edits and persists them only after overview submission', async () => {
    const completed = {
      ...draft,
      status: 'completed' as const,
      basicInfo: {
        resourceName: 'Locked name',
        owner: 'Ada',
        email: 'ada@example.com',
        description: 'Ready',
        priority: 'high',
      },
      projectDetails: {
        projectName: 'Project',
        budget: '100',
        category: 'internal',
        options: ['FE devs'],
      },
    }
    vi.mocked(getResource).mockResolvedValue(completed)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={client}>
          <CompletedDraftsProvider>
            <MemoryRouter initialEntries={['/resources/12/basic-info']}>
              <Routes>
                <Route
                  path="/resources/:resourceId/basic-info"
                  element={<BasicInfoPage />}
                />
                <Route path="/resources/:resourceId" element={<ResourceOverviewPage />} />
              </Routes>
            </MemoryRouter>
          </CompletedDraftsProvider>
        </QueryClientProvider>
      </ThemeProvider>,
    )

    const owner = await screen.findByRole('textbox', { name: 'Owner' })
    await user.clear(owner)
    await user.type(owner, 'Grace Hopper')
    await user.click(screen.getByRole('button', { name: 'Save draft changes' }))

    expect(updateBasicInfo).not.toHaveBeenCalled()
    expect(replaceCompletedResource).not.toHaveBeenCalled()
    await user.click(await screen.findByRole('button', { name: 'Submit changes' }))
    await waitFor(() =>
      expect(replaceCompletedResource).toHaveBeenCalledWith(
        12,
        expect.objectContaining({
          basicInfo: expect.objectContaining({ owner: 'Grace Hopper' }),
        }),
      ),
    )
  })

  it('discards completed edits without sending a PUT request', async () => {
    const completed = {
      ...draft,
      status: 'completed' as const,
      basicInfo: {
        resourceName: 'Locked name',
        owner: 'Ada',
        email: 'ada@example.com',
        description: 'Ready',
        priority: 'high',
      },
      projectDetails: {
        projectName: 'Project',
        budget: '100',
        category: 'internal',
        options: ['FE devs'],
      },
    }
    vi.mocked(getResource).mockResolvedValue(completed)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={client}>
          <CompletedDraftsProvider>
            <MemoryRouter initialEntries={['/resources/12/basic-info']}>
              <Routes>
                <Route
                  path="/resources/:resourceId/basic-info"
                  element={<BasicInfoPage />}
                />
                <Route path="/resources/:resourceId" element={<ResourceOverviewPage />} />
              </Routes>
            </MemoryRouter>
          </CompletedDraftsProvider>
        </QueryClientProvider>
      </ThemeProvider>,
    )

    const owner = await screen.findByRole('textbox', { name: 'Owner' })
    await user.clear(owner)
    await user.type(owner, 'Grace Hopper')
    await user.click(screen.getByRole('button', { name: 'Save draft changes' }))
    await user.click(await screen.findByRole('button', { name: 'Discard changes' }))

    expect(replaceCompletedResource).not.toHaveBeenCalled()
    expect(
      screen.queryByRole('button', { name: 'Submit changes' }),
    ).not.toBeInTheDocument()
  })

  it('buffers completed Project Details edits without sending a module PATCH', async () => {
    const completed = {
      ...draft,
      status: 'completed' as const,
      basicInfo: {
        resourceName: 'Locked name',
        owner: 'Ada',
        email: 'ada@example.com',
        description: 'Ready',
        priority: 'high',
      },
      projectDetails: {
        projectName: 'Original project',
        budget: '100',
        category: 'internal',
        options: ['FE devs'],
      },
    }
    vi.mocked(getResource).mockResolvedValue(completed)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={client}>
          <CompletedDraftsProvider>
            <MemoryRouter initialEntries={['/resources/12/project-details']}>
              <Routes>
                <Route
                  path="/resources/:resourceId/project-details"
                  element={<ProjectDetailsPage />}
                />
                <Route path="/resources/:resourceId" element={<ResourceOverviewPage />} />
              </Routes>
            </MemoryRouter>
          </CompletedDraftsProvider>
        </QueryClientProvider>
      </ThemeProvider>,
    )

    const projectName = await screen.findByRole('textbox', { name: 'Project name' })
    await user.clear(projectName)
    await user.type(projectName, 'Buffered project')
    await user.click(screen.getByRole('button', { name: 'Save draft changes' }))

    expect(updateProjectDetails).not.toHaveBeenCalled()
    await user.click(await screen.findByRole('button', { name: 'Submit changes' }))
    await waitFor(() =>
      expect(replaceCompletedResource).toHaveBeenCalledWith(
        12,
        expect.objectContaining({
          projectDetails: expect.objectContaining({ projectName: 'Buffered project' }),
        }),
      ),
    )
  })
})
