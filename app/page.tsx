import { getFirstCommunity } from "@/features/community";
import { initialProfile } from "@/features/profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  if (profile) {
    const community = await getFirstCommunity({ profileId: profile.id })

    if (community) {
      redirect(`/communities/${community.id}`)
    }
  }

  return <div>Create a Server</div>
}

export default SetupPage;