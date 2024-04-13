import { MemberRole } from '@prisma/client'
import axios from 'axios'
import qs from 'query-string'

export const updateRole = async ({
  memberId,
  communityId,
  role,
}: {
  memberId: string
  communityId: string
  role: MemberRole
}) => {
  const url = qs.stringifyUrl({
    url: `/api/members/${memberId}`,
    query: {
      communityId,
      memberId: memberId,
    },
  })

  return axios.patch(url, { role })
}
