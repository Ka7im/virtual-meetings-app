import axios from 'axios'

export const deleteCommunity = async ({
  communityId,
}: {
  communityId: string
}) => {
  return await axios.delete(`/api/communities/${communityId}`)
}
