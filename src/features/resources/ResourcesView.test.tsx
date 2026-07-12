import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it, vi } from 'vitest'
import { theme } from '../../design-system'
import type { ResourcesViewProps } from './resources.view-model'
import ResourcesView from './ResourcesView'

const createProps = (): ResourcesViewProps => ({
  resources: [
    {
      resourceId: 12,
      name: 'Launch workspace',
      statusLabel: 'Draft',
      statusVariant: 'warning',
      completedModules: 1,
      overviewPath: '/resources/12',
      isDeleting: false,
    },
  ],
  isLoading: false,
  isError: false,
  isLoaded: true,
  errorMessage: '',
  hasActiveFilters: false,
  filters: { name: '', status: '', sortOrder: 'desc' },
  createForm: { isOpen: false, name: '', error: '', isSubmitting: false },
  onNameFilterChange: vi.fn(),
  onStatusFilterChange: vi.fn(),
  onSortOrderChange: vi.fn(),
  onOpenCreate: vi.fn(),
  onCloseCreate: vi.fn(),
  onCreateNameChange: vi.fn(),
  onCreate: vi.fn(),
  onDelete: vi.fn(),
  onRetry: vi.fn(),
})

const renderView = (props: ResourcesViewProps) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <ResourcesView {...props} />
      </MemoryRouter>
    </ThemeProvider>,
  )

describe('ResourcesView', () => {
  it('renders its view model without a server-state provider', () => {
    renderView(createProps())

    expect(screen.getByRole('heading', { name: 'Launch workspace' })).toBeVisible()
    expect(screen.getByText('1 of 2 modules complete')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Open resource' })).toHaveAttribute(
      'href',
      '/resources/12',
    )
  })

  it('reports visual interactions through callbacks', async () => {
    const props = createProps()
    const user = userEvent.setup()
    renderView(props)

    await user.type(screen.getByRole('searchbox', { name: 'Search resources' }), 'x')
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(props.onNameFilterChange).toHaveBeenCalledWith('x')
    expect(props.onDelete).toHaveBeenCalledWith(12)
  })
})
