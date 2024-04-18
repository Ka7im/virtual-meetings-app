import { useSocket } from '@/shared/api/socket'
import { useInfiniteQuery } from '@tanstack/react-query'
import qs from 'query-string'

interface useChatQueryProps {
  queryKey: string
  apiUrl: string
  paramKey: 'roomId' | 'conversationId'
  paramValue: string
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: useChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true },
    )

    const res = await fetch(url)
    return res.json()
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: 1000,
      initialPageParam: undefined,
    },)

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status }
}
