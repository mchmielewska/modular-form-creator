import { CheckboxGroup, Input, Select } from '../../../design-system'
import type { ProjectDetails } from '../resource.types'
import { ModuleFormLayout } from './ModuleFormLayout'
import { PROJECT_CATEGORIES, TEAM_MEMBERS, type FieldErrors } from './resource-form.validation'

interface Props {
  resourceId: number
  data: ProjectDetails
  errors: FieldErrors
  isLoading: boolean
  isReadOnly: boolean
  readOnlyMessage?: string
  noticeMessage?: string
  submitLabel?: string
  isSubmitting: boolean
  errorMessage: string
  onChange: (field: keyof ProjectDetails, value: string | string[]) => void
  onSubmit: () => void
}

export function ProjectDetailsView(props: Props) {
  return (
    <ModuleFormLayout {...props} title="Project Details" description="Define the project scope and team involved.">
      <Input label="Project name" value={props.data.projectName} error={props.errors.projectName} disabled={props.isReadOnly} onChange={(e) => props.onChange('projectName', e.target.value)} />
      <Input label="Budget" inputMode="numeric" value={props.data.budget} error={props.errors.budget} disabled={props.isReadOnly} onChange={(e) => props.onChange('budget', e.target.value)} />
      <Select label="Category" value={props.data.category} error={props.errors.category} disabled={props.isReadOnly} onChange={(e) => props.onChange('category', e.target.value)} options={[{ value: '', label: 'Select category' }, ...PROJECT_CATEGORIES.map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }))]} />
      <CheckboxGroup label="Team members" options={[...TEAM_MEMBERS]} value={props.data.options} error={props.errors.options} disabled={props.isReadOnly} onChange={(value) => props.onChange('options', value)} />
    </ModuleFormLayout>
  )
}
