import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  provisionResource,
  replaceCompletedResource,
  updateBasicInfo,
  updateProjectDetails,
} from './resources.api'

const response = (body: unknown, ok = true) =>
  ({ ok, json: vi.fn().mockResolvedValue(body) }) as unknown as Response

describe('resources API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('serializes list filters using the backend contract', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(response({ items: [], pagination: {} }))

    await listResources({
      page: 2,
      pageSize: 20,
      status: 'draft',
      name: '  launch  ',
      sortOrder: 'asc',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5001/api/resources?page=2&pageSize=20&sortOrder=asc&status=draft&name=launch',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })

  it('creates a resource from its immutable name', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(response({ resourceId: 8 }))

    await createResource('Launch workspace')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5001/api/resources',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ resourceName: 'Launch workspace' }),
      }),
    )
  })

  it('deletes by numeric resource id', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(response({ resourceId: 8 }))

    await deleteResource(8)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5001/api/resources/8',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('surfaces the backend business error message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      response({ message: 'Resource not found' }, false),
    )

    await expect(deleteResource(99)).rejects.toThrow('Resource not found')
  })

  it('loads one resource by numeric id', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(response({ resourceId: 8 }))

    await getResource(8)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5001/api/resources/8',
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })

  it('provisions only through the dedicated status endpoint', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(response({ resourceId: 8, status: 'completed' }))

    await provisionResource(8)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5001/api/resources/8/provisioning',
      expect.objectContaining({ method: 'PATCH' }),
    )
  })

  it('updates draft modules through separate PATCH endpoints', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(response({ resourceId: 8 }))
    const basicInfo = {
      resourceName: 'Locked',
      owner: 'Ada',
      email: 'a@b.com',
      description: 'Test',
      priority: 'high',
    }
    const projectDetails = {
      projectName: 'Project',
      budget: '100',
      category: 'internal',
      options: ['FE devs'],
    }

    await updateBasicInfo(8, basicInfo)
    await updateProjectDetails(8, projectDetails)

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:5001/api/resources/8/basic-info',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify(basicInfo) }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:5001/api/resources/8/project-details',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify(projectDetails) }),
    )
  })

  it('persists completed changes through the full PUT endpoint', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(response({ resourceId: 8 }))
    const data = {
      name: 'Locked',
      basicInfo: {
        resourceName: 'Locked',
        owner: 'Ada',
        email: 'a@b.com',
        description: 'Test',
        priority: 'high',
      },
      projectDetails: {
        projectName: 'Project',
        budget: '100',
        category: 'internal',
        options: ['FE devs'],
      },
    }
    await replaceCompletedResource(8, data)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5001/api/resources/8',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(data) }),
    )
  })
})
