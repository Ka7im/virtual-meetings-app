import axios from 'axios'

export const edit = async <T>({
  data,
  communityId,
}: {
  data: T
  communityId: string
}) => {
  return axios.patch(`/api/communities/${communityId}`, data)
}
