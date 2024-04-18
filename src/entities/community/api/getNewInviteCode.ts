import axios from 'axios'

export const getNewInviteCode = async (communityId: string) => {
  return axios.patch(`/api/communities/${communityId}/inviteCode`)
}
