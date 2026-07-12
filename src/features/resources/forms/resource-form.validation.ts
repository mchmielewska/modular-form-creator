import type { BasicInfo, ProjectDetails } from '../resource.types'
import { PRIORITIES, PROJECT_CATEGORIES, TEAM_MEMBERS } from '../resource.constants'

export { PRIORITIES, PROJECT_CATEGORIES, TEAM_MEMBERS }

export type FieldErrors = Record<string, string>

export const validateBasicInfo = (data: BasicInfo): FieldErrors => {
  const errors: FieldErrors = {}
  if (!data.owner.trim()) errors.owner = 'Owner is required.'
  else if (!/^[A-Za-z ]+$/.test(data.owner.trim()))
    errors.owner = 'Owner can contain only letters and spaces.'
  if (!data.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = 'Enter a valid email address.'
  if (!data.description.trim()) errors.description = 'Description is required.'
  if (!PRIORITIES.includes(data.priority as (typeof PRIORITIES)[number]))
    errors.priority = 'Select a priority.'
  return errors
}

export const validateProjectDetails = (data: ProjectDetails): FieldErrors => {
  const errors: FieldErrors = {}
  if (!data.projectName.trim()) errors.projectName = 'Project name is required.'
  else if (!/^[A-Za-z0-9 -]+$/.test(data.projectName.trim()))
    errors.projectName = 'Use only letters, numbers, spaces, and hyphens.'
  if (!data.budget.trim()) errors.budget = 'Budget is required.'
  else if (!/^\d+$/.test(data.budget.trim())) errors.budget = 'Budget must be an integer.'
  if (!PROJECT_CATEGORIES.includes(data.category as (typeof PROJECT_CATEGORIES)[number]))
    errors.category = 'Select a category.'
  if (data.options.length === 0) errors.options = 'Select at least one team member.'
  return errors
}
