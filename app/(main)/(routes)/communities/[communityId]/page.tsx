import { CommunityIdPage } from '@/page/communityId'

interface PageProps {
  params: {
    communityId: string
  }
}

const Page = ({ params }: PageProps) => {
  return <CommunityIdPage params={params} />
}

export default Page
