import styled from 'styled-components'
import { Input, Select } from '../../../design-system'
import type { ResourceStatus } from '../resource.types'

interface ResourcesFiltersProps {
  name: string
  status: ResourceStatus | ''
  sortOrder: 'asc' | 'desc'
  onNameChange: (value: string) => void
  onStatusChange: (value: ResourceStatus | '') => void
  onSortOrderChange: (value: 'asc' | 'desc') => void
}

const ResourcesFilters = ({
  name,
  status,
  sortOrder,
  onNameChange,
  onStatusChange,
  onSortOrderChange,
}: ResourcesFiltersProps) => {
  return (
    <Filters aria-label="Resource filters">
      <Input
        label="Search resources"
        type="search"
        placeholder="Search by name"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
      />
      <Select
        label="Status"
        aria-label="Status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value as ResourceStatus | '')}
        options={[
          { value: '', label: 'All statuses' },
          { value: 'draft', label: 'Draft' },
          { value: 'completed', label: 'Completed' },
        ]}
      />
      <Select
        label="Sort"
        aria-label="Sort"
        value={sortOrder}
        onChange={(event) => onSortOrderChange(event.target.value as 'asc' | 'desc')}
        options={[
          { value: 'desc', label: 'Newest first' },
          { value: 'asc', label: 'Oldest first' },
        ]}
      />
    </Filters>
  )
}

export default ResourcesFilters

const Filters = styled.div`
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(160px, 220px) minmax(160px, 220px);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`
