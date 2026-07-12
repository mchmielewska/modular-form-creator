import { describe, expect, it } from 'vitest'
import { validateBasicInfo, validateProjectDetails } from './resource-form.validation'

describe('draft module validation', () => {
  it('validates Basic Info using backend-compatible rules', () => {
    expect(
      validateBasicInfo({
        resourceName: 'Locked name',
        owner: 'Ada 2',
        email: 'invalid',
        description: '',
        priority: '',
      }),
    ).toEqual({
      owner: 'Owner can contain only letters and spaces.',
      email: 'Enter a valid email address.',
      description: 'Description is required.',
      priority: 'Select a priority.',
    })
  })

  it('validates Project Details using backend enums and integer budget', () => {
    expect(
      validateProjectDetails({ projectName: '', budget: '10.5', category: '', options: [] }),
    ).toEqual({
      projectName: 'Project name is required.',
      budget: 'Budget must be an integer.',
      category: 'Select a category.',
      options: 'Select at least one team member.',
    })
  })
})
