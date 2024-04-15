import { MemberIdPage } from '@/page/memberId'

interface PageProps {
  params: {
    memberId: string
    communityId: string
  }
}

const Page = ({ params }: PageProps) => {
  return <MemberIdPage params={params} />
}

export default Page
