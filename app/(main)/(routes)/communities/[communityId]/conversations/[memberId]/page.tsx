import { MemberIdPage } from '@/page/memberId'

interface PageProps {
  params: {
    memberId: string
    communityId: string
  }
  searchParams: {
    video?: boolean
  }
}

const Page = ({ params, searchParams }: PageProps) => {
  return <MemberIdPage params={params} searchParams={searchParams} />
}

export default Page
