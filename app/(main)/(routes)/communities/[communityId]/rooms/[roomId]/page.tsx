import { RoomIdPage } from '@/page/roomId'

interface Page {
  params: {
    communityId: string
    roomId: string
  }
}

const Page = ({ params }: Page) => {
  return <RoomIdPage params={params} />
}

export default Page
