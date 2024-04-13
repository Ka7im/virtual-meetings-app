import axios from 'axios'
import qs from 'query-string'

export const deleteRoom = ({
  roomId,
  communityId,
}: {
  roomId: string
  communityId: string
}) => {
  const url = qs.stringifyUrl({
    url: `/api/rooms/${roomId}`,
    query: {
      communityId,
    },
  })

  return axios.delete(url)
}
