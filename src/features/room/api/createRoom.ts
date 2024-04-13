import axios from 'axios'
import qs from 'query-string'

export const createRoom = async <T>({
  communityId,
  data,
}: {
  communityId: string
  data: T
}) => {
  const url = qs.stringifyUrl({
    url: '/api/rooms/',
    query: {
      communityId,
    },
  })

  return axios.post(url, data)
}
