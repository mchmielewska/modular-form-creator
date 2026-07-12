import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createResource,
  deleteResource,
  listResources,
  type ListResourcesParams,
} from './resources.api'

export const resourceKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (params: ListResourcesParams) => [...resourceKeys.lists(), params] as const,
}

export const useResources = (params: ListResourcesParams) =>
  useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: ({ signal }) => listResources(params, signal),
    placeholderData: keepPreviousData,
  })

export const useCreateResource = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (resourceName: string) => createResource(resourceName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resourceKeys.lists() }),
  })
}

export const useDeleteResource = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (resourceId: number) => deleteResource(resourceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resourceKeys.lists() }),
  })
}
