import { Input, Select } from '../../../design-system'
import type { BasicInfo } from '../resource.types'
import ModuleFormLayout from './ModuleFormLayout'
import { PRIORITIES, type FieldErrors } from './resource-form.validation'

interface Props {
  resourceId: number
  isInvalidResource: boolean
  data: BasicInfo
  errors: FieldErrors
  isLoading: boolean
  isReadOnly: boolean
  isSubmitting: boolean
  noticeMessage?: string
  submitLabel?: string
  errorMessage: string
  onChange: (field: keyof BasicInfo, value: string) => void
  onSubmit: () => void
}

const BasicInfoView = (props: Props) => {
  return (
    <ModuleFormLayout
      resourceId={props.resourceId}
      isInvalidResource={props.isInvalidResource}
      title="Basic Info"
      description="Add ownership and contact details. The resource name is locked after creation."
      isLoading={props.isLoading}
      errorMessage={props.errorMessage}
      isSubmitting={props.isSubmitting}
      isReadOnly={props.isReadOnly}
      noticeMessage={props.noticeMessage}
      submitLabel={props.submitLabel}
      onSubmit={props.onSubmit}
    >
      <Input label="Resource name" value={props.data.resourceName} state="locked" />
      <Input
        label="Owner"
        value={props.data.owner}
        error={props.errors.owner}
        disabled={props.isReadOnly}
        onChange={(e) => props.onChange('owner', e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        value={props.data.email}
        error={props.errors.email}
        disabled={props.isReadOnly}
        onChange={(e) => props.onChange('email', e.target.value)}
      />
      <Input
        label="Description"
        multiline
        value={props.data.description}
        error={props.errors.description}
        disabled={props.isReadOnly}
        onChange={(e) => props.onChange('description', e.target.value)}
      />
      <Select
        label="Priority"
        value={props.data.priority}
        error={props.errors.priority}
        disabled={props.isReadOnly}
        onChange={(e) => props.onChange('priority', e.target.value)}
        options={[
          { value: '', label: 'Select priority' },
          ...PRIORITIES.map((value) => ({
            value,
            label: value[0].toUpperCase() + value.slice(1),
          })),
        ]}
      />
    </ModuleFormLayout>
  )
}

export default BasicInfoView
