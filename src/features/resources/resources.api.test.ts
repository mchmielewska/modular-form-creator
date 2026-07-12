import { afterEach, describe, expect, it, vi } from 'vitest'
import { createResource, deleteResource, listResources } from './resources.api'

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
})
