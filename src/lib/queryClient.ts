import { QueryClient } from '@tanstack/react-query'

export const createAppQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
      },
      mutations: {
        retry: 0,
      },
    },
  })

export const queryClient = createAppQueryClient()
