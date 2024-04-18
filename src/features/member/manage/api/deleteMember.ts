import axios from 'axios'
import qs from 'query-string'

export const deleteMember = async ({
  memberId,
  communityId,
}: {
  memberId: string
  communityId: string
}) => {
  const url = qs.stringifyUrl({
    url: `/api/members/${memberId}`,
    query: {
      communityId,
    },
  })

  return axios.delete(url)
}
