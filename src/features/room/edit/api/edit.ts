import qs from 'query-string'
import axios from 'axios'

export const edit = <T>({
  roomId,
  communityId,
  data,
}: {
  roomId: string
  communityId: string
  data: T
}) => {
  const url = qs.stringifyUrl({
    url: `/api/rooms/${roomId}`,
    query: {
      communityId,
    },
  })

  return axios.patch(url, data)
}
