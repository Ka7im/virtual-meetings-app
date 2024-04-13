import axios from 'axios'

export const leave = async ({ communityId }: { communityId: string }) => {
  return axios.patch(`/api/communities/${communityId}/leave/`)
}
