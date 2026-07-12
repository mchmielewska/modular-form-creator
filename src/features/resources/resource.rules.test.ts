import { describe, expect, it } from 'vitest'
import {
  canOpenProjectDetails,
  canProvision,
  isBasicInfoComplete,
  isProjectDetailsComplete,
} from './resource.rules'
import type { Resource } from './resource.types'

const completeResource: Resource = {
  _id: 'resource-document-id',
  resourceId: 1,
  name: 'Launch workspace',
  status: 'draft',
  basicInfo: {
    resourceName: 'Launch workspace',
    owner: 'Ada Lovelace',
    email: 'ada@example.com',
    description: 'Workspace for the launch team',
    priority: 'high',
  },
  projectDetails: {
    projectName: 'Launch',
    budget: '50000',
    category: 'internal',
    options: ['FE devs'],
  },
}

describe('resource completion rules', () => {
  it('requires every Basic Info field', () => {
    expect(isBasicInfoComplete(completeResource.basicInfo)).toBe(true)
    expect(
      isBasicInfoComplete({ ...completeResource.basicInfo, owner: '  ' }),
    ).toBe(false)
  })

  it('requires every Project Details field and at least one option', () => {
    expect(isProjectDetailsComplete(completeResource.projectDetails)).toBe(true)
    expect(
      isProjectDetailsComplete({ ...completeResource.projectDetails, options: [] }),
    ).toBe(false)
  })

  it('unlocks Project Details for a draft only after Basic Info is complete', () => {
    expect(canOpenProjectDetails(completeResource)).toBe(true)
    expect(
      canOpenProjectDetails({
        ...completeResource,
        basicInfo: { ...completeResource.basicInfo, email: '' },
      }),
    ).toBe(false)
  })

  it('keeps Project Details available when a resource is completed', () => {
    expect(
      canOpenProjectDetails({
        ...completeResource,
        status: 'completed',
        basicInfo: { ...completeResource.basicInfo, email: '' },
      }),
    ).toBe(true)
  })

  it('provisions only complete draft resources', () => {
    expect(canProvision(completeResource)).toBe(true)
    expect(canProvision({ ...completeResource, status: 'completed' })).toBe(false)
    expect(
      canProvision({
        ...completeResource,
        projectDetails: { ...completeResource.projectDetails, category: '' },
      }),
    ).toBe(false)
  })
})
