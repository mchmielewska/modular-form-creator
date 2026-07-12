import type { FormEvent } from 'react'
import styled from 'styled-components'
import { Button, Drawer, Input } from '../../../design-system'

interface CreateResourceDrawerProps {
  isOpen: boolean
  name: string
  error: string
  isSubmitting: boolean
  onNameChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

const CreateResourceDrawer = ({
  isOpen,
  name,
  error,
  isSubmitting,
  onNameChange,
  onClose,
  onSubmit,
}: CreateResourceDrawerProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Drawer title="Create resource" isOpen={isOpen} onClose={onClose}>
      <CreateForm onSubmit={handleSubmit}>
        <Input
          label="Resource name"
          autoFocus
          value={name}
          error={error}
          helperText="The resource name cannot be changed after creation."
          onChange={(event) => onNameChange(event.target.value)}
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create resource'}
        </Button>
      </CreateForm>
    </Drawer>
  )
}

export default CreateResourceDrawer

const CreateForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`
