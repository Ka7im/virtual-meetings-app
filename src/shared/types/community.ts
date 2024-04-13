import { Community, Member, Profile } from '@prisma/client'

export type CommunityWithMembersWithProfiles = Community & {
  members: (Member & { profile: Profile })[]
}
