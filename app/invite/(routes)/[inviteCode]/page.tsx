import { InvitePage } from '@/page/invite'

interface PageProps {
  params: {
    inviteCode: string
  }
}

const Page = (props: PageProps) => {
  return <InvitePage {...props} />
}

export default Page
