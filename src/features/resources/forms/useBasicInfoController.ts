import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { BasicInfo } from '../resource.types'
import { useResource, useUpdateBasicInfo } from '../resources.queries'
import { validateBasicInfo, type FieldErrors } from './resource-form.validation'

const EMPTY: BasicInfo = { resourceName: '', owner: '', email: '', description: '', priority: '' }

export const useBasicInfoController = () => {
  const resourceId = Number(useParams().resourceId)
  const navigate = useNavigate()
  const query = useResource(resourceId)
  const mutation = useUpdateBasicInfo()
  const [draft, setDraft] = useState<BasicInfo | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const data = draft ?? query.data?.basicInfo ?? EMPTY

  const onChange = (field: keyof BasicInfo, value: string) => {
    setDraft({ ...data, [field]: value })
    setErrors((current) => ({ ...current, [field]: '' }))
  }
  const onSubmit = async () => {
    const nextErrors = validateBasicInfo(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    try {
      await mutation.mutateAsync({ resourceId, data })
      navigate(`/resources/${resourceId}`)
    } catch { /* mutation state provides the message */ }
  }

  return {
    resourceId, data, errors,
    isLoading: query.isPending,
    isReadOnly: query.data?.status === 'completed',
    isSubmitting: mutation.isPending,
    errorMessage: mutation.error instanceof Error ? mutation.error.message : '',
    onChange,
    onSubmit: () => void onSubmit(),
  }
}
