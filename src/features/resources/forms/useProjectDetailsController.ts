import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isBasicInfoComplete } from '../resource.rules'
import type { ProjectDetails } from '../resource.types'
import { useResource, useUpdateProjectDetails } from '../resources.queries'
import { validateProjectDetails, type FieldErrors } from './resource-form.validation'

const EMPTY: ProjectDetails = { projectName: '', budget: '', category: '', options: [] }

export const useProjectDetailsController = () => {
  const resourceId = Number(useParams().resourceId)
  const navigate = useNavigate()
  const query = useResource(resourceId)
  const mutation = useUpdateProjectDetails()
  const [draft, setDraft] = useState<ProjectDetails | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const data = draft ?? query.data?.projectDetails ?? EMPTY
  const isLocked = query.data?.status === 'draft' && !isBasicInfoComplete(query.data.basicInfo)
  const isCompleted = query.data?.status === 'completed'

  const onChange = (field: keyof ProjectDetails, value: string | string[]) => {
    setDraft({ ...data, [field]: value })
    setErrors((current) => ({ ...current, [field]: '' }))
  }
  const onSubmit = async () => {
    if (isLocked || isCompleted) return
    const nextErrors = validateProjectDetails(data)
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
    isReadOnly: Boolean(isLocked || isCompleted),
    readOnlyMessage: isLocked ? 'Complete Basic Info before editing Project Details.' : undefined,
    isSubmitting: mutation.isPending,
    errorMessage: mutation.error instanceof Error ? mutation.error.message : '',
    onChange,
    onSubmit: () => void onSubmit(),
  }
}
